import type { Tool } from '../core/interfaces';
import type {
  BaseTool,
  ToolMetadata,
  ToolExecutionContext,
  ToolExecutionResult
} from './tool-registry';

/**
 * Abstract base class for implementing tools
 */
export abstract class AbstractTool implements BaseTool {
  public readonly metadata: ToolMetadata;
  public readonly schema: Tool;

  constructor(metadata: Omit<ToolMetadata, 'createdAt' | 'updatedAt'>) {
    this.metadata = {
      ...metadata,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.schema = this.buildSchema();
  }

  /**
   * Build the tool schema (must be implemented by subclasses)
   */
  protected abstract buildSchema(): Tool;

  /**
   * Execute the tool (must be implemented by subclasses)
   */
  abstract execute(
    parameters: Record<string, any>,
    context: ToolExecutionContext
  ): Promise<ToolExecutionResult>;

  /**
   * Validate parameters (can be overridden)
   */
  validate(parameters: Record<string, any>): { valid: boolean; errors?: string[] } {
    try {
      // Basic validation using the schema
      const result = this.validateAgainstSchema(parameters);
      return result;
    } catch (error) {
      return {
        valid: false,
        errors: [error instanceof Error ? error.message : 'Validation failed']
      };
    }
  }

  /**
   * Basic schema validation (can be enhanced with libraries like ajv)
   */
  private validateAgainstSchema(parameters: Record<string, any>): { valid: boolean; errors?: string[] } {
    const errors: string[] = [];
    const properties = this.schema.function.parameters?.properties || {};

    // Check required fields
    const required = this.schema.function.parameters?.required || [];
    for (const field of required) {
      if (!(field in parameters)) {
        errors.push(`Missing required field: ${field}`);
      }
    }

    // Basic type checking
    for (const [key, value] of Object.entries(parameters)) {
      const propertyDef = properties[key];
      if (propertyDef) {
        const expectedType = propertyDef.type;
        const actualType = Array.isArray(value) ? 'array' : typeof value;

        if (expectedType !== actualType) {
          errors.push(`Field ${key}: expected ${expectedType}, got ${actualType}`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined
    };
  }

  /**
   * Health check (can be overridden)
   */
  async healthCheck(): Promise<{ healthy: boolean; message?: string }> {
    return { healthy: true };
  }

  /**
   * Update metadata
   */
  updateMetadata(updates: Partial<ToolMetadata>): void {
    this.metadata.updatedAt = new Date();
    Object.assign(this.metadata, updates);
  }

  /**
   * Enable/disable tool
   */
  setEnabled(enabled: boolean): void {
    this.updateMetadata({ enabled });
  }
}

/**
 * Utility function to create tool metadata
 */
export function createToolMetadata(
  id: string,
  name: string,
  description: string,
  options: {
    version?: string;
    author?: string;
    tags?: string[];
    permissions?: string[];
    enabled?: boolean;
  } = {}
): Omit<ToolMetadata, 'createdAt' | 'updatedAt'> {
  return {
    id,
    name,
    description,
    version: options.version || '1.0.0',
    author: options.author,
    tags: options.tags || [],
    permissions: options.permissions || ['read'],
    enabled: options.enabled ?? true,
  };
}
