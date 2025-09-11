import type {
  JSONSchema,
  JSONSchemaProperty,
  StructuredOutputConfig,
  ResponseFormat
} from '../core/interfaces';

/**
 * Utility functions for working with structured outputs
 */

/**
 * Create a structured output configuration
 */
export function createStructuredOutput(
  name: string,
  schema: JSONSchema,
  options: {
    description?: string;
    strict?: boolean;
  } = {}
): StructuredOutputConfig {
  return {
    type: 'json_schema',
    json_schema: {
      name,
      description: options.description,
      strict: options.strict ?? true,
      schema
    }
  };
}

/**
 * Create a simple object schema
 */
export function createObjectSchema(
  properties: Record<string, JSONSchemaProperty>,
  options: {
    required?: string[];
    additionalProperties?: boolean;
    description?: string;
  } = {}
): JSONSchema {
  return {
    type: 'object',
    properties,
    required: options.required,
    additionalProperties: options.additionalProperties ?? false,
    description: options.description
  };
}

/**
 * Create a string property schema
 */
export function createStringProperty(
  options: {
    description?: string;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    enum?: string[];
    default?: string;
  } = {}
): JSONSchemaProperty {
  return {
    type: 'string',
    description: options.description,
    minLength: options.minLength,
    maxLength: options.maxLength,
    pattern: options.pattern,
    enum: options.enum,
    default: options.default
  };
}

/**
 * Create a number property schema
 */
export function createNumberProperty(
  options: {
    description?: string;
    minimum?: number;
    maximum?: number;
    default?: number;
  } = {}
): JSONSchemaProperty {
  return {
    type: 'number',
    description: options.description,
    minimum: options.minimum,
    maximum: options.maximum,
    default: options.default
  };
}

/**
 * Create an array property schema
 */
export function createArrayProperty(
  items: JSONSchema,
  options: {
    description?: string;
    minItems?: number;
    maxItems?: number;
    uniqueItems?: boolean;
  } = {}
): JSONSchemaProperty {
  return {
    type: 'array',
    items,
    description: options.description,
    minItems: options.minItems,
    maxItems: options.maxItems,
    uniqueItems: options.uniqueItems
  };
}

/**
 * Create a boolean property schema
 */
export function createBooleanProperty(
  options: {
    description?: string;
    default?: boolean;
  } = {}
): JSONSchemaProperty {
  return {
    type: 'boolean',
    description: options.description,
    default: options.default
  };
}

/**
 * Validate response against schema (basic validation)
 */
export function validateStructuredResponse(
  response: any,
  schema: JSONSchema
): { valid: boolean; errors?: string[] } {
  const errors: string[] = [];

  try {
    validateValue(response, schema, 'root', errors);
    return { valid: errors.length === 0, errors: errors.length > 0 ? errors : undefined };
  } catch (error) {
    return {
      valid: false,
      errors: [`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`]
    };
  }
}

/**
 * Internal validation function
 */
function validateValue(value: any, schema: JSONSchema, path: string, errors: string[]): void {
  // Check type
  if (schema.type && typeof value !== schema.type && !Array.isArray(value)) {
    errors.push(`Expected type ${schema.type} at ${path}, got ${typeof value}`);
    return;
  }

  // Object validation
  if (schema.type === 'object' && typeof value === 'object' && !Array.isArray(value)) {
    const obj = value as Record<string, any>;

    // Check required properties
    if (schema.required) {
      for (const requiredProp of schema.required) {
        if (!(requiredProp in obj)) {
          errors.push(`Missing required property: ${path}.${requiredProp}`);
        }
      }
    }

    // Check additional properties
    if (schema.additionalProperties === false && schema.properties) {
      const allowedProps = Object.keys(schema.properties);
      for (const prop in obj) {
        if (!allowedProps.includes(prop)) {
          errors.push(`Unexpected property: ${path}.${prop}`);
        }
      }
    }

    // Validate properties
    if (schema.properties) {
      for (const [propName, propSchema] of Object.entries(schema.properties)) {
        if (propName in obj) {
          validateValue(obj[propName], propSchema, `${path}.${propName}`, errors);
        }
      }
    }
  }

  // Array validation
  else if (schema.type === 'array' && Array.isArray(value)) {
    if (schema.minItems && value.length < schema.minItems) {
      errors.push(`Array at ${path} has ${value.length} items, minimum ${schema.minItems}`);
    }
    if (schema.maxItems && value.length > schema.maxItems) {
      errors.push(`Array at ${path} has ${value.length} items, maximum ${schema.maxItems}`);
    }

    if (schema.items) {
      value.forEach((item, index) => {
        validateValue(item, schema.items as JSONSchema, `${path}[${index}]`, errors);
      });
    }
  }

  // String validation
  else if (schema.type === 'string' && typeof value === 'string') {
    if (schema.minLength && value.length < schema.minLength) {
      errors.push(`String at ${path} is too short: ${value.length} < ${schema.minLength}`);
    }
    if (schema.maxLength && value.length > schema.maxLength) {
      errors.push(`String at ${path} is too long: ${value.length} > ${schema.maxLength}`);
    }
    if (schema.pattern && !new RegExp(schema.pattern).test(value)) {
      errors.push(`String at ${path} does not match pattern: ${schema.pattern}`);
    }
    if (schema.enum && !schema.enum.includes(value)) {
      errors.push(`String at ${path} must be one of: ${schema.enum.join(', ')}`);
    }
  }

  // Number validation
  else if (schema.type === 'number' && typeof value === 'number') {
    if (schema.minimum !== undefined && value < schema.minimum) {
      errors.push(`Number at ${path} is too small: ${value} < ${schema.minimum}`);
    }
    if (schema.maximum !== undefined && value > schema.maximum) {
      errors.push(`Number at ${path} is too large: ${value} > ${schema.maximum}`);
    }
  }

  // Boolean validation
  else if (schema.type === 'boolean' && typeof value !== 'boolean') {
    errors.push(`Expected boolean at ${path}, got ${typeof value}`);
  }
}

/**
 * Common structured output schemas
 */
export const CommonSchemas = {
  /**
   * Weather information schema
   */
  weather: createStructuredOutput('weather', createObjectSchema({
    location: createStringProperty({ description: 'City or location name' }),
    temperature: createNumberProperty({ description: 'Temperature in Celsius' }),
    conditions: createStringProperty({ description: 'Weather conditions description' }),
    humidity: createNumberProperty({ description: 'Humidity percentage', minimum: 0, maximum: 100 }),
    wind_speed: createNumberProperty({ description: 'Wind speed in km/h', minimum: 0 })
  }, {
    required: ['location', 'temperature', 'conditions']
  })),

  /**
   * Product information schema
   */
  product: createStructuredOutput('product', createObjectSchema({
    name: createStringProperty({ description: 'Product name' }),
    price: createNumberProperty({ description: 'Product price in USD', minimum: 0 }),
    category: createStringProperty({ description: 'Product category' }),
    in_stock: createBooleanProperty({ description: 'Whether product is in stock' }),
    description: createStringProperty({ description: 'Product description', maxLength: 500 })
  }, {
    required: ['name', 'price', 'category']
  })),

  /**
   * Task list schema
   */
  taskList: createStructuredOutput('task_list', createObjectSchema({
    tasks: createArrayProperty(
      createObjectSchema({
        id: createStringProperty({ description: 'Unique task identifier' }),
        title: createStringProperty({ description: 'Task title' }),
        description: createStringProperty({ description: 'Task description' }),
        priority: createStringProperty({
          description: 'Task priority',
          enum: ['low', 'medium', 'high']
        }),
        completed: createBooleanProperty({ description: 'Whether task is completed' })
      }, {
        required: ['id', 'title', 'priority']
      }),
      { description: 'List of tasks' }
    ),
    total_tasks: createNumberProperty({ description: 'Total number of tasks' }),
    completed_tasks: createNumberProperty({ description: 'Number of completed tasks' })
  }, {
    required: ['tasks', 'total_tasks']
  })),

  /**
   * Code analysis schema
   */
  codeAnalysis: createStructuredOutput('code_analysis', createObjectSchema({
    language: createStringProperty({ description: 'Programming language detected' }),
    functions: createArrayProperty(
      createObjectSchema({
        name: createStringProperty({ description: 'Function name' }),
        parameters: createArrayProperty(
          createStringProperty({ description: 'Parameter name and type' }),
          { description: 'Function parameters' }
        ),
        return_type: createStringProperty({ description: 'Function return type' }),
        complexity: createNumberProperty({ description: 'Cyclomatic complexity', minimum: 1 })
      }),
      { description: 'Functions found in code' }
    ),
    issues: createArrayProperty(
      createObjectSchema({
        type: createStringProperty({
          description: 'Type of issue',
          enum: ['error', 'warning', 'info']
        }),
        message: createStringProperty({ description: 'Issue description' }),
        line: createNumberProperty({ description: 'Line number', minimum: 1 }),
        suggestion: createStringProperty({ description: 'Suggested fix' })
      }),
      { description: 'Code issues found' }
    ),
    overall_quality: createStringProperty({
      description: 'Overall code quality assessment',
      enum: ['excellent', 'good', 'fair', 'poor']
    })
  }, {
    required: ['language', 'overall_quality']
  }))
};

/**
 * Helper to create custom schemas easily
 */
export function createCustomSchema(
  name: string,
  properties: Record<string, JSONSchemaProperty>,
  required: string[] = [],
  options: {
    description?: string;
    strict?: boolean;
  } = {}
) {
  return createStructuredOutput(
    name,
    createObjectSchema(properties, {
      required,
      additionalProperties: false,
      description: options.description
    }),
    options
  );
}

/**
 * Parse structured response with validation
 */
export function parseStructuredResponse(
  response: string,
  schema: JSONSchema
): { success: boolean; data?: any; error?: string } {
  try {
    const parsed = JSON.parse(response);
    const validation = validateStructuredResponse(parsed, schema);

    if (!validation.valid) {
      return {
        success: false,
        error: `Schema validation failed: ${validation.errors?.join(', ')}`
      };
    }

    return { success: true, data: parsed };
  } catch (error) {
    return {
      success: false,
      error: `Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

export default {
  createStructuredOutput,
  createObjectSchema,
  createStringProperty,
  createNumberProperty,
  createArrayProperty,
  createBooleanProperty,
  validateStructuredResponse,
  CommonSchemas,
  createCustomSchema,
  parseStructuredResponse
};
