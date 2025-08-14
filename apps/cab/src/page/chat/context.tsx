"use client"
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

export type ChatRole = 'user' | 'assistant'

export interface ChatMessage {
	id: string
	threadId: string
	role: ChatRole
	text: string
	createdAt: number
  imageUrl?: string
}

export interface ChatThread {
	id: string
	title: string
	createdAt: number
	updatedAt: number
}

interface ChatContextValue {
	threads: ChatThread[]
	selectedThreadId: string | null
	selectedThread: ChatThread | null
	messages: ChatMessage[]
	selectThread: (id: string) => void
	createThread: (initialTitle?: string) => string
	removeThread: (id: string) => void
	sendMessage: (text: string) => void
	sendImage: (prompt: string, imageUrl: string) => void
		sendCode: (code: string, output: string) => void
	renewChat: () => void
}

const ChatContext = createContext<ChatContextValue | null>(null)

const THREADS_KEY = 'chat:threads'
const SELECTED_KEY = 'chat:selected'

function generateId(prefix: string = 'id'): string {
	return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`
}

function toTitleFromText(text: string, maxWords: number = 6, maxLen: number = 64): string {
	const words = text.trim().replace(/\s+/g, ' ').split(' ').slice(0, maxWords)
	const title = words.join(' ')
	return title.length > maxLen ? `${title.slice(0, maxLen - 1)}…` : title || 'New chat'
}

export function ChatProvider({ children }: { children: ReactNode }) {
	const [threads, setThreads] = useState<ChatThread[]>(() => {
		try {
			const raw = typeof window !== 'undefined' ? window.localStorage.getItem(THREADS_KEY) : null
			return raw ? (JSON.parse(raw) as ChatThread[]) : []
		} catch {
			return []
		}
	})

	const [selectedThreadId, setSelectedThreadId] = useState<string | null>(() => {
		try {
			return typeof window !== 'undefined' ? window.localStorage.getItem(SELECTED_KEY) : null
		} catch {
			return null
		}
	})

	// Messages are in-memory only (not persisted), per requirements
	const messagesRef = useRef<Record<string, ChatMessage[]>>({})
	const [, forceRerender] = useState(0)

	useEffect(() => {
		try {
			window.localStorage.setItem(THREADS_KEY, JSON.stringify(threads.map(t => ({ id: t.id, title: t.title, createdAt: t.createdAt, updatedAt: t.updatedAt }))))
		} catch {}
	}, [threads])

	useEffect(() => {
		try {
			if (selectedThreadId) {
				window.localStorage.setItem(SELECTED_KEY, selectedThreadId)
			} else {
				window.localStorage.removeItem(SELECTED_KEY)
			}
		} catch {}
	}, [selectedThreadId])

	const selectThread = useCallback((id: string) => {
		setSelectedThreadId(id)
	}, [])

	const createThread = useCallback((initialTitle?: string) => {
		const id = generateId('thread')
		const now = Date.now()
		const title = toTitleFromText(initialTitle || '')
		const thread: ChatThread = { id, title, createdAt: now, updatedAt: now }
		setThreads(prev => [thread, ...prev])
		messagesRef.current[id] = []
		setSelectedThreadId(id)
		return id
	}, [])

	const removeThread = useCallback((id: string) => {
		setThreads(prev => prev.filter(t => t.id !== id))
		delete messagesRef.current[id]
		setSelectedThreadId(curr => (curr === id ? null : curr))
	}, [])

	const sendMessage = useCallback((text: string) => {
		const trimmed = text.trim()
		if (!trimmed) return

		let threadId = selectedThreadId
		if (!threadId) {
			threadId = createThread(toTitleFromText(trimmed))
		}

		const userMsg: ChatMessage = {
			id: generateId('msg'),
			threadId,
			role: 'user',
			text: trimmed,
			createdAt: Date.now()
		}
		messagesRef.current[threadId] = [...(messagesRef.current[threadId] || []), userMsg]
		setThreads(prev => prev.map(t => (t.id === threadId ? { ...t, title: toTitleFromText(trimmed), updatedAt: Date.now() } : t)))
		forceRerender(n => n + 1)

		// Simulated assistant reply for demo UX
		window.setTimeout(() => {
			const assistantMsg: ChatMessage = {
				id: generateId('msg'),
				threadId: threadId as string,
				role: 'assistant',
				text: `Echo: ${trimmed}`,
				createdAt: Date.now()
			}
			messagesRef.current[threadId as string] = [...(messagesRef.current[threadId as string] || []), assistantMsg]
			forceRerender(n => n + 1)
		}, 500)
	}, [createThread, selectedThreadId])

	const sendImage = useCallback((prompt: string, imageUrl: string) => {
		const trimmed = prompt.trim()
		if (!trimmed) return

		let threadId = selectedThreadId
		if (!threadId) {
			threadId = createThread(toTitleFromText(trimmed))
		}

		const now = Date.now()
		const userMsg: ChatMessage = {
			id: generateId('msg'),
			threadId,
			role: 'user',
			text: trimmed,
			createdAt: now
		}
		const assistantMsg: ChatMessage = {
			id: generateId('msg'),
			threadId,
			role: 'assistant',
			text: '',
			imageUrl,
			createdAt: now + 1
		}
		const current = messagesRef.current[threadId] || []
		messagesRef.current[threadId] = [...current, userMsg, assistantMsg]
		setThreads(prev => prev.map(t => (t.id === threadId ? { ...t, title: toTitleFromText(trimmed), updatedAt: Date.now() } : t)))
		forceRerender(n => n + 1)
	}, [createThread, selectedThreadId])

	const sendCode = useCallback((code: string, output: string) => {
		const trimmed = code.trim()
		if (!trimmed) return

		let threadId = selectedThreadId
		if (!threadId) {
			threadId = createThread(toTitleFromText(trimmed))
		}

		const now = Date.now()
		const userMsg: ChatMessage = {
			id: generateId('msg'),
			threadId,
			role: 'user',
			text: trimmed,
			createdAt: now
		}
		const assistantMsg: ChatMessage = {
			id: generateId('msg'),
			threadId,
			role: 'assistant',
			text: output,
			createdAt: now + 1
		}
		const current = messagesRef.current[threadId] || []
		messagesRef.current[threadId] = [...current, userMsg, assistantMsg]
		setThreads(prev => prev.map(t => (t.id === threadId ? { ...t, title: toTitleFromText(trimmed), updatedAt: Date.now() } : t)))
		forceRerender(n => n + 1)
	}, [createThread, selectedThreadId])

	const renewChat = useCallback(() => {
		setSelectedThreadId(null)
	}, [])

	const selectedThread = useMemo(() => threads.find(t => t.id === selectedThreadId) || null, [threads, selectedThreadId])

	const messages = useMemo(() => (selectedThread ? (messagesRef.current[selectedThread.id] || []) : []), [selectedThread])

	const value = useMemo<ChatContextValue>(() => ({
		threads,
		selectedThreadId,
		selectedThread,
		messages,
		selectThread,
		createThread,
		removeThread,
		sendMessage,
		sendImage,
		sendCode,
		renewChat
	}), [threads, selectedThreadId, selectedThread, messages, selectThread, createThread, removeThread, sendMessage, sendImage, sendCode, renewChat])

	return (
		<ChatContext.Provider value={value}>
			{children}
		</ChatContext.Provider>
	)
}

export function useChat() {
	const ctx = useContext(ChatContext)
	if (!ctx) throw new Error('useChat must be used within ChatProvider')
	return ctx
}


