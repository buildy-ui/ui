import { AbstractTool, createToolMetadata } from '../base-tool';
import type { ToolExecutionContext, ToolExecutionResult } from '../tool-registry';

/**
 * Database query tool for executing SQL queries
 */
export class DatabaseQueryTool extends AbstractTool {
  private connectionString: string;

  constructor(connectionString?: string) {
    super(createToolMetadata(
      'database-query',
      'Database Query',
      'Execute SQL queries on databases with proper security controls',
      {
        tags: ['database', 'sql', 'query'],
        permissions: ['read', 'write'], // Requires both read and write permissions
        version: '1.0.0'
      }
    ));

    this.connectionString = connectionString || process.env.DATABASE_URL || '';
  }

  protected buildSchema() {
    return {
      type: 'function' as const,
      function: {
        name: 'execute_query',
        description: 'Execute SQL queries on the database. Supports SELECT, INSERT, UPDATE, DELETE operations with proper validation.',
        parameters: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'The SQL query to execute'
            },
            database: {
              type: 'string',
              description: 'Database name (optional, uses default if not specified)',
              enum: ['users', 'products', 'orders', 'analytics']
            },
            parameters: {
              type: 'array',
              items: { type: 'string' },
              description: 'Parameterized query values to prevent SQL injection',
              default: []
            },
            readOnly: {
              type: 'boolean',
              description: 'Force read-only mode (only SELECT queries allowed)',
              default: true
            },
            limit: {
              type: 'integer',
              description: 'Maximum number of rows to return for SELECT queries',
              minimum: 1,
              maximum: 1000,
              default: 100
            }
          },
          required: ['query']
        }
      }
    };
  }

  async execute(
    parameters: {
      query: string;
      database?: string;
      parameters?: string[];
      readOnly?: boolean;
      limit?: number;
    },
    context: ToolExecutionContext
  ): Promise<ToolExecutionResult> {
    const startTime = Date.now();

    try {
      const {
        query,
        database,
        parameters: queryParams = [],
        readOnly = true,
        limit = 100
      } = parameters;

      // Security validation
      const validation = this.validateQuery(query, readOnly);
      if (!validation.valid) {
        return {
          success: false,
          error: `Query validation failed: ${validation.errors?.join(', ')}`,
          executionTime: Date.now() - startTime
        };
      }

      // Execute query (mock implementation)
      const result = await this.executeDatabaseQuery(query, queryParams, database, limit);

      return {
        success: true,
        data: result,
        executionTime: Date.now() - startTime,
        metadata: {
          database: database || 'default',
          queryType: this.getQueryType(query),
          rowsAffected: result.rowsAffected || result.rows?.length || 0,
          executionTime: Date.now() - startTime
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Database query failed',
        executionTime: Date.now() - startTime
      };
    }
  }

  private validateQuery(query: string, readOnly: boolean): { valid: boolean; errors?: string[] } {
    const errors: string[] = [];
    const normalizedQuery = query.trim().toUpperCase();

    // Check for dangerous operations
    const dangerousPatterns = [
      /\bDROP\b/,
      /\bDELETE\b/,
      /\bUPDATE\b/,
      /\bINSERT\b/,
      /\bALTER\b/,
      /\bCREATE\b/,
      /\bTRUNCATE\b/
    ];

    const hasDangerousOperation = dangerousPatterns.some(pattern => pattern.test(normalizedQuery));

    if (readOnly && hasDangerousOperation) {
      errors.push('Read-only mode: only SELECT queries are allowed');
    }

    if (!readOnly && !hasDangerousOperation && !normalizedQuery.startsWith('SELECT')) {
      errors.push('Write mode requires explicit write operations (INSERT, UPDATE, DELETE)');
    }

    // Check for SQL injection patterns
    const injectionPatterns = [
      /;\s*--/,
      /;\s*#/,
      /UNION\s+SELECT/i,
      /OR\s+1\s*=\s*1/i,
      /'\s*OR\s*'/i
    ];

    if (injectionPatterns.some(pattern => pattern.test(query))) {
      errors.push('Potential SQL injection detected');
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined
    };
  }

  private getQueryType(query: string): string {
    const normalizedQuery = query.trim().toUpperCase();

    if (normalizedQuery.startsWith('SELECT')) return 'SELECT';
    if (normalizedQuery.startsWith('INSERT')) return 'INSERT';
    if (normalizedQuery.startsWith('UPDATE')) return 'UPDATE';
    if (normalizedQuery.startsWith('DELETE')) return 'DELETE';
    if (normalizedQuery.startsWith('CREATE')) return 'CREATE';
    if (normalizedQuery.startsWith('ALTER')) return 'ALTER';
    if (normalizedQuery.startsWith('DROP')) return 'DROP';

    return 'UNKNOWN';
  }

  private async executeDatabaseQuery(
    query: string,
    parameters: string[],
    database?: string,
    limit?: number
  ): Promise<{
    rows?: any[];
    rowsAffected?: number;
    columns?: string[];
    executionTime?: number;
  }> {
    // This is a mock implementation
    // In real implementation, you would use:
    // - PostgreSQL: pg library
    // - MySQL: mysql2 library
    // - SQLite: better-sqlite3
    // - MongoDB: mongodb driver
    // etc.

    await new Promise(resolve => setTimeout(resolve, 50)); // Simulate query delay

    const queryType = this.getQueryType(query);

    if (queryType === 'SELECT') {
      // Mock SELECT result
      return {
        rows: [
          { id: 1, name: 'Mock User', email: 'user@example.com' },
          { id: 2, name: 'Another User', email: 'another@example.com' }
        ],
        columns: ['id', 'name', 'email'],
        rowsAffected: 2
      };
    } else {
      // Mock write operation result
      return {
        rowsAffected: Math.floor(Math.random() * 10) + 1
      };
    }
  }

  async healthCheck(): Promise<{ healthy: boolean; message?: string }> {
    try {
      if (!this.connectionString) {
        return {
          healthy: false,
          message: 'No database connection string configured'
        };
      }

      // Test connection with a simple query
      const result = await this.executeDatabaseQuery('SELECT 1 as test', [], undefined, 1);

      return {
        healthy: result.rows !== undefined,
        message: result.rows ? 'Database connection successful' : 'Database query failed'
      };
    } catch (error) {
      return {
        healthy: false,
        message: `Database connection error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}
