import { describe, it, expect } from 'vitest';
import {
  generateMessageId,
  formatTimestamp,
  estimateTokenCount,
  truncateMessage,
  validateMessage,
  createSystemMessage,
  createUserMessage,
  createAssistantMessage,
  isUserMessage,
  isAssistantMessage,
  isSystemMessage,
  filterMessagesByRole,
  getLastMessages,
  removeSystemMessages,
  countConversationTokens,
  findMessageById,
  updateMessageContent,
  sanitizeMessageContent,
} from './chat-utils';
import type { Message } from '../core/interfaces';

describe('Chat Utils', () => {
  describe('generateMessageId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateMessageId();
      const id2 = generateMessageId();

      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^msg_/);
      expect(id2).toMatch(/^msg_/);
    });
  });

  describe('formatTimestamp', () => {
    it('should format timestamp correctly', () => {
      const date = new Date('2024-01-15T10:30:45');
      const formatted = formatTimestamp(date);

      expect(formatted).toMatch(/^\d{1,2}:\d{2}/);
    });
  });

  describe('estimateTokenCount', () => {
    it('should estimate tokens based on character count', () => {
      expect(estimateTokenCount('Hello world')).toBe(3); // ~12 chars / 4 = 3 tokens
      expect(estimateTokenCount('')).toBe(0);
    });
  });

  describe('truncateMessage', () => {
    it('should truncate long messages', () => {
      const longMessage = 'This is a very long message that should be truncated';
      const truncated = truncateMessage(longMessage, 20);

      expect(truncated.length).toBeLessThan(longMessage.length);
      expect(truncated).toEndWith('...');
    });

    it('should not truncate short messages', () => {
      const shortMessage = 'Short message';
      const result = truncateMessage(shortMessage, 50);

      expect(result).toBe(shortMessage);
    });
  });

  describe('validateMessage', () => {
    it('should validate correct messages', () => {
      const validMessage: Partial<Message> = {
        role: 'user',
        content: 'Hello world',
      };

      expect(validateMessage(validMessage)).toBe(true);
    });

    it('should reject invalid messages', () => {
      expect(validateMessage({})).toBe(false);
      expect(validateMessage({ role: 'user' })).toBe(false);
      expect(validateMessage({ content: 'Hello' })).toBe(false);
      expect(validateMessage({ role: 'invalid', content: 'Hello' })).toBe(false);
    });
  });

  describe('Message creators', () => {
    it('should create system message', () => {
      const message = createSystemMessage('You are a helpful assistant');

      expect(message.role).toBe('system');
      expect(message.content).toBe('You are a helpful assistant');
      expect(message.id).toMatch(/^msg_/);
      expect(message.timestamp).toBeInstanceOf(Date);
    });

    it('should create user message', () => {
      const message = createUserMessage('Hello');

      expect(message.role).toBe('user');
      expect(message.content).toBe('Hello');
      expect(message.id).toMatch(/^msg_/);
    });

    it('should create assistant message', () => {
      const message = createAssistantMessage('Hi there!');

      expect(message.role).toBe('assistant');
      expect(message.content).toBe('Hi there!');
      expect(message.id).toMatch(/^msg_/);
    });
  });

  describe('Message type checkers', () => {
    const messages: Message[] = [
      { id: '1', role: 'system', content: 'System prompt', timestamp: new Date() },
      { id: '2', role: 'user', content: 'User message', timestamp: new Date() },
      { id: '3', role: 'assistant', content: 'Assistant reply', timestamp: new Date() },
    ];

    it('should identify message types correctly', () => {
      expect(isSystemMessage(messages[0])).toBe(true);
      expect(isUserMessage(messages[1])).toBe(true);
      expect(isAssistantMessage(messages[2])).toBe(true);

      expect(isUserMessage(messages[0])).toBe(false);
      expect(isAssistantMessage(messages[1])).toBe(false);
      expect(isSystemMessage(messages[2])).toBe(false);
    });

    it('should filter messages by role', () => {
      const userMessages = filterMessagesByRole(messages, 'user');
      const systemMessages = filterMessagesByRole(messages, 'system');

      expect(userMessages).toHaveLength(1);
      expect(userMessages[0].role).toBe('user');
      expect(systemMessages).toHaveLength(1);
      expect(systemMessages[0].role).toBe('system');
    });
  });

  describe('Message utilities', () => {
    const messages: Message[] = [
      { id: '1', role: 'system', content: 'System', timestamp: new Date() },
      { id: '2', role: 'user', content: 'User 1', timestamp: new Date() },
      { id: '3', role: 'assistant', content: 'Assistant 1', timestamp: new Date() },
      { id: '4', role: 'user', content: 'User 2', timestamp: new Date() },
      { id: '5', role: 'assistant', content: 'Assistant 2', timestamp: new Date() },
    ];

    it('should get last N messages', () => {
      const last2 = getLastMessages(messages, 2);
      expect(last2).toHaveLength(2);
      expect(last2[0].id).toBe('4');
      expect(last2[1].id).toBe('5');
    });

    it('should remove system messages', () => {
      const withoutSystem = removeSystemMessages(messages);
      expect(withoutSystem).toHaveLength(4);
      expect(withoutSystem.every(msg => msg.role !== 'system')).toBe(true);
    });

    it('should count conversation tokens', () => {
      const tokenCount = countConversationTokens(messages);
      expect(tokenCount).toBeGreaterThan(0);
      expect(typeof tokenCount).toBe('number');
    });

    it('should find message by ID', () => {
      const found = findMessageById(messages, '3');
      expect(found?.id).toBe('3');
      expect(found?.content).toBe('Assistant 1');

      const notFound = findMessageById(messages, '999');
      expect(notFound).toBeUndefined();
    });

    it('should update message content', () => {
      const updated = updateMessageContent(messages, '2', 'Updated content');
      expect(updated[1].content).toBe('Updated content');
      expect(updated[1].id).toBe('2');

      // Original should be unchanged
      expect(messages[1].content).toBe('User 1');
    });
  });

  describe('Content sanitization', () => {
    it('should sanitize HTML content', () => {
      const malicious = '<script>alert("xss")</script>Hello & world';
      const sanitized = sanitizeMessageContent(malicious);

      expect(sanitized).toBe('&lt;script&gt;alert("xss")&lt;/script&gt;Hello &amp; world');
    });
  });
});
