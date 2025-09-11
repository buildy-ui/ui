import { BaseAIProvider } from '../core/base-provider';
import { OpenRouterProvider } from './openrouter-provider';
import { OpenAIProvider } from './openai-provider';

export type ProviderType = 'openrouter' | 'openai';

export interface ProviderConfig {
  type: ProviderType;
  apiKey: string;
  baseURL?: string;
}

export class ProviderFactory {
  static createProvider(config: ProviderConfig): BaseAIProvider {
    switch (config.type) {
      case 'openrouter':
        return new OpenRouterProvider(config.apiKey, config.baseURL);

      case 'openai':
        return new OpenAIProvider(config.apiKey, config.baseURL);

      default:
        throw new Error(`Unsupported provider type: ${config.type}`);
    }
  }

  static getAvailableProviders(): ProviderType[] {
    return ['openrouter', 'openai'];
  }
}
