import type { Tool } from '../core/interfaces';

/**
 * Tool metadata for management and discovery
 */
export interface ToolMetadata {
  id: string;
  name: string;
  description: string;
  version: string;
  author?: string;
  tags: string[];
  permissions: string[];
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Tool execution context
 */
export interface ToolExecutionContext {
  userId?: string;
  sessionId?: string;
  conversationId?: string;
  messageId?: string;
  provider: string;
  model: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

/**
 * Tool execution result
 */
export interface ToolExecutionResult {
  success: boolean;
  data?: any;
  error?: string;
  executionTime: number;
  metadata?: Record<string, any>;
}

/**
 * Base tool interface
 */
export interface BaseTool {
  readonly metadata: ToolMetadata;
  readonly schema: Tool;

  /**
   * Execute the tool with given parameters
   */
  execute(
    parameters: Record<string, any>,
    context: ToolExecutionContext
  ): Promise<ToolExecutionResult>;

  /**
   * Validate parameters before execution
   */
  validate(parameters: Record<string, any>): { valid: boolean; errors?: string[] };

  /**
   * Get tool health status
   */
  healthCheck(): Promise<{ healthy: boolean; message?: string }>;
}

/**
 * Tool registry for managing available tools
 */
export class ToolRegistry {
  private tools = new Map<string, BaseTool>();
  private categories = new Map<string, Set<string>>();

  /**
   * Register a new tool
   */
  register(tool: BaseTool): void {
    if (this.tools.has(tool.metadata.id)) {
      throw new Error(`Tool with id ${tool.metadata.id} already registered`);
    }

    this.tools.set(tool.metadata.id, tool);

    // Add to categories
    tool.metadata.tags.forEach(tag => {
      if (!this.categories.has(tag)) {
        this.categories.set(tag, new Set());
      }
      this.categories.get(tag)!.add(tool.metadata.id);
    });
  }

  /**
   * Unregister a tool
   */
  unregister(toolId: string): boolean {
    const tool = this.tools.get(toolId);
    if (!tool) return false;

    // Remove from categories
    tool.metadata.tags.forEach(tag => {
      const categoryTools = this.categories.get(tag);
      if (categoryTools) {
        categoryTools.delete(toolId);
        if (categoryTools.size === 0) {
          this.categories.delete(tag);
        }
      }
    });

    return this.tools.delete(toolId);
  }

  /**
   * Get tool by ID
   */
  getTool(toolId: string): BaseTool | undefined {
    return this.tools.get(toolId);
  }

  /**
   * Get all registered tools
   */
  getAllTools(): BaseTool[] {
    return Array.from(this.tools.values());
  }

  /**
   * Get enabled tools only
   */
  getEnabledTools(): BaseTool[] {
    return this.getAllTools().filter(tool => tool.metadata.enabled);
  }

  /**
   * Get tools by category/tag
   */
  getToolsByCategory(category: string): BaseTool[] {
    const toolIds = this.categories.get(category);
    if (!toolIds) return [];

    return Array.from(toolIds)
      .map(id => this.tools.get(id))
      .filter((tool): tool is BaseTool => tool !== undefined);
  }

  /**
   * Get tools by permission
   */
  getToolsByPermission(permission: string): BaseTool[] {
    return this.getAllTools().filter(tool =>
      tool.metadata.permissions.includes(permission)
    );
  }

  /**
   * Search tools by name or description
   */
  searchTools(query: string): BaseTool[] {
    const lowercaseQuery = query.toLowerCase();
    return this.getAllTools().filter(tool =>
      tool.metadata.name.toLowerCase().includes(lowercaseQuery) ||
      tool.metadata.description.toLowerCase().includes(lowercaseQuery) ||
      tool.metadata.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  /**
   * Update tool metadata
   */
  updateToolMetadata(toolId: string, updates: Partial<ToolMetadata>): boolean {
    const tool = this.tools.get(toolId);
    if (!tool) return false;

    Object.assign(tool.metadata, updates, { updatedAt: new Date() });

    return true;
  }

  /**
   * Enable/disable tool
   */
  setToolEnabled(toolId: string, enabled: boolean): boolean {
    return this.updateToolMetadata(toolId, { enabled });
  }

  /**
   * Get registry statistics
   */
  getStats() {
    const allTools = this.getAllTools();
    const enabledTools = this.getEnabledTools();

    return {
      total: allTools.length,
      enabled: enabledTools.length,
      disabled: allTools.length - enabledTools.length,
      categories: Array.from(this.categories.keys()),
      categoriesCount: this.categories.size
    };
  }

  /**
   * Clear all tools
   */
  clear(): void {
    this.tools.clear();
    this.categories.clear();
  }
}

// Global registry instance
export const toolRegistry = new ToolRegistry();
