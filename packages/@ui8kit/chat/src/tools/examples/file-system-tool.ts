import { AbstractTool, createToolMetadata } from '../base-tool';
import type { ToolExecutionContext, ToolExecutionResult } from '../tool-registry';
import * as fs from 'fs';
import * as path from 'path';

/**
 * File system tool for reading and writing files
 */
export class FileSystemTool extends AbstractTool {
  private allowedPaths: string[];
  private maxFileSize: number;

  constructor(options: {
    allowedPaths?: string[];
    maxFileSize?: number; // in bytes
  } = {}) {
    super(createToolMetadata(
      'file-system',
      'File System',
      'Read and write files with security controls and path restrictions',
      {
        tags: ['file', 'filesystem', 'io'],
        permissions: ['read', 'write'], // Requires both permissions
        version: '1.0.0'
      }
    ));

    this.allowedPaths = options.allowedPaths || ['/tmp', './data'];
    this.maxFileSize = options.maxFileSize || 1024 * 1024; // 1MB default
  }

  protected buildSchema() {
    return {
      type: 'function' as const,
      function: {
        name: 'file_operation',
        description: 'Perform file system operations: read, write, list, delete files with security controls.',
        parameters: {
          type: 'object',
          properties: {
            operation: {
              type: 'string',
              enum: ['read', 'write', 'list', 'delete', 'exists', 'stat'],
              description: 'The file operation to perform'
            },
            path: {
              type: 'string',
              description: 'File or directory path (must be within allowed paths)'
            },
            content: {
              type: 'string',
              description: 'Content to write (required for write operation)'
            },
            encoding: {
              type: 'string',
              enum: ['utf8', 'base64', 'binary'],
              description: 'File encoding for read/write operations',
              default: 'utf8'
            },
            recursive: {
              type: 'boolean',
              description: 'For list operation: include subdirectories',
              default: false
            }
          },
          required: ['operation', 'path']
        }
      }
    };
  }

  async execute(
    parameters: {
      operation: 'read' | 'write' | 'list' | 'delete' | 'exists' | 'stat';
      path: string;
      content?: string;
      encoding?: 'utf8' | 'base64' | 'binary';
      recursive?: boolean;
    },
    context: ToolExecutionContext
  ): Promise<ToolExecutionResult> {
    const startTime = Date.now();

    try {
      const { operation, path: filePath, content, encoding = 'utf8', recursive = false } = parameters;

      // Security check
      const securityCheck = this.validatePath(filePath);
      if (!securityCheck.valid) {
        return {
          success: false,
          error: securityCheck.errors?.join(', ') || 'Path validation failed',
          executionTime: Date.now() - startTime
        };
      }

      let result: any;

      switch (operation) {
        case 'read':
          result = await this.readFile(filePath, encoding);
          break;
        case 'write':
          if (!content) {
            return {
              success: false,
              error: 'Content is required for write operation',
              executionTime: Date.now() - startTime
            };
          }
          result = await this.writeFile(filePath, content, encoding);
          break;
        case 'list':
          result = await this.listDirectory(filePath, recursive);
          break;
        case 'delete':
          result = await this.deleteFile(filePath);
          break;
        case 'exists':
          result = await this.fileExists(filePath);
          break;
        case 'stat':
          result = await this.getFileStats(filePath);
          break;
        default:
          return {
            success: false,
            error: `Unsupported operation: ${operation}`,
            executionTime: Date.now() - startTime
          };
      }

      return {
        success: true,
        data: result,
        executionTime: Date.now() - startTime,
        metadata: {
          operation,
          path: filePath,
          encoding,
          recursive
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'File operation failed',
        executionTime: Date.now() - startTime
      };
    }
  }

  private validatePath(filePath: string): { valid: boolean; errors?: string[] } {
    const errors: string[] = [];

    // Resolve to absolute path to prevent directory traversal
    const absolutePath = path.resolve(filePath);

    // Check if path is within allowed directories
    const isAllowed = this.allowedPaths.some(allowedPath => {
      const absoluteAllowed = path.resolve(allowedPath);
      return absolutePath.startsWith(absoluteAllowed);
    });

    if (!isAllowed) {
      errors.push(`Path ${filePath} is not within allowed directories: ${this.allowedPaths.join(', ')}`);
    }

    // Check for dangerous path patterns
    const dangerousPatterns = [
      /\.\./, // Directory traversal
      /^\/(etc|var|usr|bin|sys|proc|dev)/i, // System directories
      /\.(exe|bat|cmd|sh|py)$/i // Executable files
    ];

    if (dangerousPatterns.some(pattern => pattern.test(filePath))) {
      errors.push('Path contains potentially dangerous patterns');
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined
    };
  }

  private async readFile(filePath: string, encoding: string): Promise<string> {
    // Check file size before reading
    const stats = await fs.promises.stat(filePath);
    if (stats.size > this.maxFileSize) {
      throw new Error(`File size ${stats.size} exceeds maximum allowed size ${this.maxFileSize}`);
    }

    return await fs.promises.readFile(filePath, { encoding: encoding as BufferEncoding });
  }

  private async writeFile(filePath: string, content: string, encoding: string): Promise<{ written: number }> {
    // Ensure directory exists
    const dir = path.dirname(filePath);
    await fs.promises.mkdir(dir, { recursive: true });

    // Check content size
    const contentSize = Buffer.byteLength(content, encoding as BufferEncoding);
    if (contentSize > this.maxFileSize) {
      throw new Error(`Content size ${contentSize} exceeds maximum allowed size ${this.maxFileSize}`);
    }

    await fs.promises.writeFile(filePath, content, { encoding: encoding as BufferEncoding });
    return { written: contentSize };
  }

  private async listDirectory(dirPath: string, recursive: boolean): Promise<{
    files: Array<{ name: string; type: 'file' | 'directory'; size?: number }>;
    path: string;
  }> {
    const items = await fs.promises.readdir(dirPath, { withFileTypes: true });

    const files = await Promise.all(
      items.map(async (item) => {
        const fullPath = path.join(dirPath, item.name);
        let size: number | undefined;

        try {
          if (item.isFile()) {
            const stats = await fs.promises.stat(fullPath);
            size = stats.size;
          }
        } catch (error) {
          // Ignore stat errors
        }

        return {
          name: item.name,
          type: item.isDirectory() ? 'directory' as const : 'file' as const,
          size
        };
      })
    );

    return { files, path: dirPath };
  }

  private async deleteFile(filePath: string): Promise<{ deleted: boolean }> {
    try {
      await fs.promises.unlink(filePath);
      return { deleted: true };
    } catch (error) {
      if ((error as any).code === 'ENOENT') {
        return { deleted: false }; // File didn't exist
      }
      throw error;
    }
  }

  private async fileExists(filePath: string): Promise<{ exists: boolean; type?: 'file' | 'directory' }> {
    try {
      const stats = await fs.promises.stat(filePath);
      return {
        exists: true,
        type: stats.isDirectory() ? 'directory' : 'file'
      };
    } catch (error) {
      return { exists: false };
    }
  }

  private async getFileStats(filePath: string): Promise<{
    size: number;
    created: Date;
    modified: Date;
    type: 'file' | 'directory';
  }> {
    const stats = await fs.promises.stat(filePath);

    return {
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
      type: stats.isDirectory() ? 'directory' : 'file'
    };
  }

  async healthCheck(): Promise<{ healthy: boolean; message?: string }> {
    try {
      // Test with a simple operation in allowed path
      const testPath = path.join(this.allowedPaths[0], 'health-check.tmp');

      await fs.promises.writeFile(testPath, 'test');
      await fs.promises.unlink(testPath);

      return {
        healthy: true,
        message: 'File system operations are working correctly'
      };
    } catch (error) {
      return {
        healthy: false,
        message: `File system error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}
