import React, { useState, useRef, useEffect, useCallback } from 'react'
import { apiClient } from '../lib/api'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: string[]
  timestamp: number
}

interface RagResponse {
  answer: string
  sources: string[]
}

interface ChatInterfaceProps {
  endpoint: string
  studentId?: string
  onSuggestFill?: (callback: (text: string) => void) => void
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ endpoint, studentId, onSuggestFill }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [expandedSources, setExpandedSources] = useState<Record<string, boolean>>({})

  // Register suggestion fill callback on mount
  useEffect(() => {
    if (onSuggestFill) {
      onSuggestFill((text: string) => {
        setInputValue(text)
        setTimeout(() => inputRef.current?.focus(), 0)
      })
    }
  }, [onSuggestFill])

  // Send message - use latest input value from state
  const handleSendMessage = useCallback(
    async (messageText?: string) => {
      const textToSend = messageText !== undefined ? messageText : inputValue.trim()
      if (!textToSend) return

      // Add user message
      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content: textToSend,
        timestamp: Date.now()
      }

      setMessages((prev) => [...prev, userMessage])
      if (messageText === undefined) setInputValue('')
      setError('')
      setIsLoading(true)

      try {
        const response = await apiClient.post<RagResponse>(endpoint, {
          message: textToSend,
          student_id: studentId
        })

        const assistantMessage: Message = {
          id: `msg-${Date.now()}-response`,
          role: 'assistant',
          content: response.data.answer,
          sources: response.data.sources || [],
          timestamp: Date.now()
        }

        setMessages((prev) => [...prev, assistantMessage])
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to send message'
        setError(errorMsg)
        console.error('Chat error:', err)
      } finally {
        setIsLoading(false)
      }
    },
    [inputValue, endpoint, studentId]
  )

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Toggle sources expansion
  const toggleSources = (messageId: string) => {
    setExpandedSources((prev) => ({
      ...prev,
      [messageId]: !prev[messageId]
    }))
  }

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 0)
  }, [messages])

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Messages list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-400">
            <p className="text-center">
              Start a conversation about your class or a specific student
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id}>
              {/* Message bubble */}
              <div
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                } mb-2`}
              >
                <div
                  className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-white'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>

              {/* Sources section for assistant messages */}
              {message.role === 'assistant' && message.sources && message.sources.length > 0 && (
                <div className="flex justify-start mb-4">
                  <div className="max-w-xs lg:max-w-md xl:max-w-lg">
                    <button
                      onClick={() => toggleSources(message.id)}
                      className="text-xs text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1"
                    >
                      <span>{expandedSources[message.id] ? '▼' : '▶'}</span>
                      Sources ({message.sources.length})
                    </button>

                    {expandedSources[message.id] && (
                      <div className="mt-2 space-y-1 pl-4 border-l border-teal-600">
                        {message.sources.map((source, idx) => (
                          <p key={idx} className="text-xs text-teal-400">
                            • {source}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-700 rounded-2xl px-4 py-2">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-900/30 border border-red-600 rounded-lg p-3">
            <p className="text-xs text-red-300">{error}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="border-t border-slate-700 bg-slate-800 p-4">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about teaching or your students..."
            disabled={isLoading}
            className="flex-1 px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputValue.trim()}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-blue-300 border-t-white rounded-full animate-spin"></div>
                <span>Sending...</span>
              </>
            ) : (
              'Send'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface
