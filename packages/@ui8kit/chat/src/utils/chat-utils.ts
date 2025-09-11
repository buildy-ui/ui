/**
 * Utility functions for chat functionality
 */

import type { Message } from '../core/interfaces';

/**
 * Generate a unique ID for messages
 */
export function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Calculate token count (rough estimation)
 */
export function estimateTokenCount(text: string): number {
  // Rough estimation: ~4 characters per token
  return Math.ceil(text.length / 4);
}

/**
 * Truncate message content for preview
 */
export function truncateMessage(content: string, maxLength: number = 100): string {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength).trim() + '...';
}

/**
 * Validate message structure
 */
export function validateMessage(message: Partial<Message>): boolean {
  return !!(
    message.role &&
    ['system', 'user', 'assistant', 'developer', 'tool'].includes(message.role) &&
    typeof message.content === 'string'
  );
}

/**
 * Create a system message
 */
export function createSystemMessage(content: string): Message {
  return {
    role: 'system',
    content,
    id: generateMessageId(),
    timestamp: new Date()
  };
}

/**
 * Create a user message
 */
export function createUserMessage(content: string): Message {
  return {
    role: 'user',
    content,
    id: generateMessageId(),
    timestamp: new Date()
  };
}

/**
 * Create an assistant message
 */
export function createAssistantMessage(content: string): Message {
  return {
    role: 'assistant',
    content,
    id: generateMessageId(),
    timestamp: new Date()
  };
}

/**
 * Check if message is from user
 */
export function isUserMessage(message: Message): boolean {
  return message.role === 'user';
}

/**
 * Check if message is from assistant
 */
export function isAssistantMessage(message: Message): boolean {
  return message.role === 'assistant';
}

/**
 * Check if message is a system message
 */
export function isSystemMessage(message: Message): boolean {
  return message.role === 'system';
}

/**
 * Filter messages by role
 */
export function filterMessagesByRole(messages: Message[], role: Message['role']): Message[] {
  return messages.filter(message => message.role === role);
}

/**
 * Get the last N messages
 */
export function getLastMessages(messages: Message[], count: number): Message[] {
  return messages.slice(-count);
}

/**
 * Remove system messages from conversation
 */
export function removeSystemMessages(messages: Message[]): Message[] {
  return messages.filter(message => message.role !== 'system');
}

/**
 * Count total tokens in conversation
 */
export function countConversationTokens(messages: Message[]): number {
  return messages.reduce((total, message) =>
    total + estimateTokenCount(message.content), 0
  );
}

/**
 * Find message by ID
 */
export function findMessageById(messages: Message[], id: string): Message | undefined {
  return messages.find(message => message.id === id);
}

/**
 * Replace message content
 */
export function updateMessageContent(
  messages: Message[],
  id: string,
  newContent: string
): Message[] {
  return messages.map(message =>
    message.id === id
      ? { ...message, content: newContent }
      : message
  );
}

/**
 * Add timestamp to message if missing
 */
export function ensureMessageTimestamp(message: Message): Message {
  if (!message.timestamp) {
    return { ...message, timestamp: new Date() };
  }
  return message;
}

/**
 * Add ID to message if missing
 */
export function ensureMessageId(message: Message): Message {
  if (!message.id) {
    return { ...message, id: generateMessageId() };
  }
  return message;
}

/**
 * Sanitize message content (basic HTML/XSS protection)
 */
export function sanitizeMessageContent(content: string): string {
  return content
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Deep clone messages array
 */
export function cloneMessages(messages: Message[]): Message[] {
  return JSON.parse(JSON.stringify(messages));
}

/**
 * Create conversation summary
 */
export function createConversationSummary(messages: Message[]): string {
  const userMessages = filterMessagesByRole(messages, 'user');
  const assistantMessages = filterMessagesByRole(messages, 'assistant');

  return `Conversation with ${userMessages.length} user messages and ${assistantMessages.length} assistant responses`;
}

export default {
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
  ensureMessageTimestamp,
  ensureMessageId,
  sanitizeMessageContent,
  cloneMessages,
  createConversationSummary
};
