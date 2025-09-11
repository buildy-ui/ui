import type { BaseTool, ToolExecutionContext, ToolExecutionResult } from './tool-registry';
import type { Tool, ToolCall, Message } from '../core/interfaces';
import { toolRegistry } from './tool-registry';

/**
 * Tool execution options
 */
export interface ToolExecutionOptions {
  timeout?: number; // in milliseconds
  retries?: number;
  retryDelay?: number; // in milliseconds
  validateParams?: boolean;
  collectMetrics?: boolean;
}

/**
 * Tool manager for handling tool lifecycle and execution
 */
export class ToolManager {
  private executionMetrics = new Map<string, {
    executions: number;
    successes: number;
    failures: number;
    avgExecutionTime: number;
    lastExecutionTime: number;
  }>();

  /**
   * Register a tool
   */
  registerTool(tool: BaseTool): void {
    toolRegistry.register(tool);
    this.initializeMetrics(tool.metadata.id);
  }

  /**
   * Unregister a tool
   */
  unregisterTool(toolId: string): boolean {
    this.executionMetrics.delete(toolId);
    return toolRegistry.unregister(toolId);
  }

  /**
   * Get all available tools as OpenAI-compatible format
   */
  getToolsForAI(provider?: string): Tool[] {
    const tools = toolRegistry.getEnabledTools();

    // Filter tools based on provider if needed
    const filteredTools = provider ? this.filterToolsByProvider(tools, provider) : tools;

    return filteredTools.map(tool => tool.schema);
  }

  /**
   * Execute a tool call
   */
  async executeToolCall(
    toolCall: ToolCall,
    context: ToolExecutionContext,
    options: ToolExecutionOptions = {}
  ): Promise<ToolExecutionResult> {
    const {
      timeout = 30000,
      retries = 1,
      retryDelay = 1000,
      validateParams = true,
      collectMetrics = true
    } = options;

    const tool = toolRegistry.getTool(toolCall.function.name);

    if (!tool) {
      const error = `Tool '${toolCall.function.name}' not found`;
      if (collectMetrics) {
        this.updateMetrics(toolCall.function.name, false, 0);
      }
      return {
        success: false,
        error,
        executionTime: 0
      };
    }

    let lastError: string = '';
    let executionTime = 0;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const startTime = Date.now();

        // Parse arguments
        let parameters: Record<string, any>;
        try {
          parameters = JSON.parse(toolCall.function.arguments);
        } catch (error) {
          throw new Error('Invalid tool arguments JSON');
        }

        // Validate parameters if enabled
        if (validateParams) {
          const validation = tool.validate(parameters);
          if (!validation.valid) {
            throw new Error(`Parameter validation failed: ${validation.errors?.join(', ')}`);
          }
        }

        // Execute with timeout
        const executionPromise = tool.execute(parameters, context);
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Tool execution timeout')), timeout);
        });

        const result = await Promise.race([executionPromise, timeoutPromise]);
        executionTime = Date.now() - startTime;

        if (collectMetrics) {
          this.updateMetrics(tool.metadata.id, result.success, executionTime);
        }

        return result;

      } catch (error) {
        lastError = error instanceof Error ? error.message : 'Tool execution failed';
        executionTime = Date.now() - Date.now(); // Reset for retry

        if (attempt < retries) {
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
    }

    // All attempts failed
    if (collectMetrics) {
      this.updateMetrics(tool.metadata.id, false, executionTime);
    }

    return {
      success: false,
      error: lastError,
      executionTime
    };
  }

  /**
   * Execute multiple tool calls (parallel or sequential)
   */
  async executeToolCalls(
    toolCalls: ToolCall[],
    context: ToolExecutionContext,
    options: ToolExecutionOptions & { parallel?: boolean } = {}
  ): Promise<ToolExecutionResult[]> {
    const { parallel = true, ...executionOptions } = options;

    if (parallel) {
      // Execute all tools in parallel
      const promises = toolCalls.map(toolCall =>
        this.executeToolCall(toolCall, context, executionOptions)
      );
      return await Promise.all(promises);
    } else {
      // Execute tools sequentially
      const results: ToolExecutionResult[] = [];
      for (const toolCall of toolCalls) {
        const result = await this.executeToolCall(toolCall, context, executionOptions);
        results.push(result);
      }
      return results;
    }
  }

  /**
   * Process tool calls from AI response and return tool results
   */
  async processToolCalls(
    toolCalls: ToolCall[],
    context: ToolExecutionContext,
    options: ToolExecutionOptions = {}
  ): Promise<Message[]> {
    if (!toolCalls || toolCalls.length === 0) {
      return [];
    }

    const results = await this.executeToolCalls(toolCalls, context, options);

    // Convert results to tool messages
    return toolCalls.map((toolCall, index) => {
      const result = results[index];

      return {
        role: 'tool',
        tool_call_id: toolCall.id,
        content: result.success
          ? JSON.stringify(result.data)
          : JSON.stringify({ error: result.error }),
        metadata: {
          toolName: toolCall.function.name,
          success: result.success,
          executionTime: result.executionTime
        }
      } as Message;
    });
  }

  /**
   * Get tool execution metrics
   */
  getToolMetrics(toolId?: string) {
    if (toolId) {
      return this.executionMetrics.get(toolId);
    }

    // Return all metrics
    const allMetrics: Record<string, any> = {};
    for (const [id, metrics] of this.executionMetrics) {
      allMetrics[id] = metrics;
    }
    return allMetrics;
  }

  /**
   * Get tool health status
   */
  async getToolHealth(toolId: string): Promise<{ healthy: boolean; message?: string }> {
    const tool = toolRegistry.getTool(toolId);
    if (!tool) {
      return { healthy: false, message: 'Tool not found' };
    }

    return await tool.healthCheck();
  }

  /**
   * Enable/disable tool
   */
  setToolEnabled(toolId: string, enabled: boolean): boolean {
    return toolRegistry.setToolEnabled(toolId, enabled);
  }

  /**
   * Get available tools with metadata
   */
  getAvailableTools() {
    return toolRegistry.getEnabledTools().map(tool => ({
      id: tool.metadata.id,
      name: tool.metadata.name,
      description: tool.metadata.description,
      tags: tool.metadata.tags,
      permissions: tool.metadata.permissions,
      version: tool.metadata.version
    }));
  }

  /**
   * Filter tools based on context and permissions
   */
  getFilteredTools(context: {
    userPermissions?: string[];
    requiredTags?: string[];
    excludedTags?: string[];
  } = {}): BaseTool[] {
    let tools = toolRegistry.getEnabledTools();

    const { userPermissions, requiredTags, excludedTags } = context;

    // Filter by permissions
    if (userPermissions) {
      tools = tools.filter(tool =>
        tool.metadata.permissions.some(permission =>
          userPermissions.includes(permission)
        )
      );
    }

    // Filter by required tags
    if (requiredTags) {
      tools = tools.filter(tool =>
        requiredTags.every(tag => tool.metadata.tags.includes(tag))
      );
    }

    // Filter by excluded tags
    if (excludedTags) {
      tools = tools.filter(tool =>
        !excludedTags.some(tag => tool.metadata.tags.includes(tag))
      );
    }

    return tools;
  }

  private initializeMetrics(toolId: string): void {
    if (!this.executionMetrics.has(toolId)) {
      this.executionMetrics.set(toolId, {
        executions: 0,
        successes: 0,
        failures: 0,
        avgExecutionTime: 0,
        lastExecutionTime: 0
      });
    }
  }

  private updateMetrics(toolId: string, success: boolean, executionTime: number): void {
    const metrics = this.executionMetrics.get(toolId);
    if (!metrics) return;

    metrics.executions++;
    if (success) {
      metrics.successes++;
    } else {
      metrics.failures++;
    }

    // Update average execution time
    const totalTime = (metrics.avgExecutionTime * (metrics.executions - 1)) + executionTime;
    metrics.avgExecutionTime = totalTime / metrics.executions;
    metrics.lastExecutionTime = executionTime;
  }

  private filterToolsByProvider(tools: BaseTool[], provider: string): BaseTool[] {
    // This could be enhanced with provider-specific filtering logic
    // For now, return all tools
    return tools;
  }
}

// Global tool manager instance
export const toolManager = new ToolManager();
