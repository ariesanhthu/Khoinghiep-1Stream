'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { api } from '@/lib/api'
import { getSocket } from '@/lib/socket'
import { useParams } from 'next/navigation'
import type { ChatMessage, Platform } from '@sea/contracts'

interface SessionData {
  id: string
  title: string
  status: string
  rtmpInputKey: string
  autoReplyEnabled: boolean
  platforms: Array<{
    id: string
    rtmpUrl: string
    status: string
  }>
}

interface SuggestionHistoryItem {
  id: string
  messageId: string
  content: string
  status: 'sent' | 'skipped' | 'pending'
}

const platformColors: Record<Platform, { bg: string; label: string }> = {
  youtube: { bg: 'bg-red-600', label: 'YouTube' },
  tiktok: { bg: 'bg-cyan-500', label: 'TikTok' },
  facebook: { bg: 'bg-blue-600', label: 'Facebook' },
  shopee: { bg: 'bg-orange-500', label: 'Shopee' },
}

function formatTimeAgo(date: Date | string): string {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export default function StudioPage() {
  const params = useParams()
  const sessionId = params.id as string
  const [session, setSession] = useState<SessionData | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [autoReply, setAutoReply] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState('')
  const [suggestionHistory, setSuggestionHistory] = useState<SuggestionHistoryItem[]>([])
  const [inputText, setInputText] = useState('')
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [isUserScrolledUp, setIsUserScrolledUp] = useState(false)

  useEffect(() => {
    api.get(`/sessions/${sessionId}`).then((data) => {
      setSession(data)
      setAutoReply(data.autoReplyEnabled ?? false)
    }).catch(console.error)

    api.get(`/chat/${sessionId}`)
      .then(setMessages)
      .catch(console.error)
  }, [sessionId])

  useEffect(() => {
    const socket = getSocket()
    socket.connect()
    socket.emit('join:session', sessionId)

    socket.on('chat:message', (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg])
    })

    socket.on('chat:bot-reply', (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg])
      setAiSuggestion('')
      setSuggestionHistory((prev) => [
        ...prev,
        {
          id: msg.id,
          messageId: msg.id,
          content: msg.content,
          status: 'sent',
        },
      ])
    })

    socket.on('stream:status', (data: any) => {
      console.log('Stream status:', data)
    })

    return () => {
      socket.emit('leave:session', sessionId)
      socket.disconnect()
    }
  }, [sessionId])

  useEffect(() => {
    if (!isUserScrolledUp) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isUserScrolledUp])

  const handleScroll = useCallback(() => {
    const el = chatContainerRef.current
    if (!el) return
    const threshold = 100
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < threshold
    setIsUserScrolledUp(!atBottom)
  }, [])

  const startStream = () =>
    api.post(`/sessions/${sessionId}/start`, {}).then(() =>
      setSession((s) => (s ? { ...s, status: 'live' } : s))
    ).catch(console.error)

  const stopStream = () =>
    api.post(`/sessions/${sessionId}/stop`, {}).then(() =>
      setSession((s) => (s ? { ...s, status: 'ended' } : s))
    ).catch(console.error)

  const toggleAutoReply = async () => {
    const next = !autoReply
    await api.post(`/sessions/${sessionId}/auto-reply`, { enabled: next })
    setAutoReply(next)
  }

  const getManualSuggestion = async (comment: string, messageId: string) => {
    const res = await api.post('/ai/suggest', { sessionId, comment })
    setAiSuggestion(res.suggestion)
    setSelectedMessageId(messageId)
  }

  const sendManualReply = async () => {
    if (!aiSuggestion || !selectedMessageId) return
    const res = await api.post('/chat/send', { sessionId, content: aiSuggestion })
    setSuggestionHistory((prev) => [
      ...prev,
      {
        id: res.id,
        messageId: selectedMessageId,
        content: aiSuggestion,
        status: 'sent',
      },
    ])
    setAiSuggestion('')
    setSelectedMessageId(null)
  }

  const dismissSuggestion = () => {
    if (selectedMessageId && aiSuggestion) {
      setSuggestionHistory((prev) => [
        ...prev,
        {
          id: `skip-${Date.now()}`,
          messageId: selectedMessageId,
          content: aiSuggestion,
          status: 'skipped',
        },
      ])
    }
    setAiSuggestion('')
    setSelectedMessageId(null)
  }

  const sendHostMessage = async () => {
    if (!inputText.trim()) return
    await api.post('/chat/send', { sessionId, content: inputText })
    setInputText('')
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 text-gray-400">
        Loading...
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white overflow-hidden">
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">{session.title}</h1>
          <span
            className={`px-2 py-0.5 text-xs font-medium rounded-full ${
              session.status === 'live'
                ? 'bg-green-900 text-green-300'
                : session.status === 'ended'
                ? 'bg-gray-800 text-gray-400'
                : 'bg-yellow-900 text-yellow-300'
            }`}
          >
            {session.status}
          </span>
          {session.status === 'scheduled' && (
            <button onClick={startStream} className="px-4 py-1.5 text-sm bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors">
              Go Live
            </button>
          )}
          {session.status === 'live' && (
            <button onClick={stopStream} className="px-4 py-1.5 text-sm bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors">
              End Stream
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>RTMP Key:</span>
            <code className="px-2 py-0.5 bg-gray-800 rounded text-blue-400 text-xs">{session.rtmpInputKey}</code>
          </div>

          {session.platforms.map((p) => (
            <span
              key={p.id}
              className={`px-2 py-0.5 text-xs font-medium rounded ${
                p.status === 'live' ? 'bg-green-900 text-green-300' : 'bg-gray-800 text-gray-400'
              }`}
            >
              {p.rtmpUrl.includes('youtube') ? 'YouTube' : p.rtmpUrl.includes('facebook') ? 'Facebook' : p.rtmpUrl.includes('tiktok') ? 'TikTok' : 'Shopee'}
            </span>
          ))}

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <span className={autoReply ? 'text-green-400' : 'text-gray-500'}>
              Auto-Reply {autoReply ? 'ON' : 'OFF'}
            </span>
            <div
              onClick={toggleAutoReply}
              className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${
                autoReply ? 'bg-green-600' : 'bg-gray-700'
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                  autoReply ? 'translate-x-5' : ''
                }`}
              />
            </div>
          </label>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0">
          <div
            ref={chatContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto px-6 py-4 space-y-3"
          >
            {messages.map((msg) =>
              msg.isBot ? (
                <div
                  key={msg.id}
                  className="flex gap-3 p-3 bg-purple-900/20 border-l-2 border-purple-500 rounded-lg"
                >
                  <span className="text-lg">{'\u{1F916}'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-purple-300">AI Assistant</span>
                      <span className="px-1.5 py-0.5 text-xs font-medium bg-purple-700 text-purple-200 rounded">AI</span>
                    </div>
                    <p className="text-sm text-gray-200">{msg.content}</p>
                  </div>
                </div>
              ) : (
                <div key={msg.id} className="group flex gap-3 p-2 rounded-lg hover:bg-gray-900/50 transition-colors">
                  <span
                    className={`shrink-0 px-2 py-0.5 text-xs font-medium text-white rounded self-start ${
                      platformColors[msg.platform as Platform]?.bg ?? 'bg-gray-600'
                    }`}
                  >
                    {platformColors[msg.platform as Platform]?.label ?? msg.platform}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-blue-400">{msg.username}</span>
                      <span className="text-xs text-gray-600">{formatTimeAgo(msg.timestamp)}</span>
                    </div>
                    <p className="text-sm text-gray-300">{msg.content}</p>
                    <button
                      onClick={() => getManualSuggestion(msg.content, msg.id)}
                      className="text-xs text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity mt-1 hover:text-purple-300"
                    >
                      {'\u2728'} AI Reply
                    </button>
                  </div>
                </div>
              )
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="shrink-0 border-t border-gray-800 px-6 py-3">
            <div className="flex gap-3">
              <input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendHostMessage()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={sendHostMessage}
                disabled={!inputText.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 rounded-lg text-sm font-medium transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>

        <div className="w-80 shrink-0 border-l border-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-800">
            <h2 className="font-semibold text-sm">AI Assistant</h2>
          </div>

          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Auto-Reply</span>
              <div
                onClick={toggleAutoReply}
                className={`relative w-9 h-[18px] rounded-full transition-colors cursor-pointer ${
                  autoReply ? 'bg-green-600' : 'bg-gray-700'
                }`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-[14px] h-[14px] rounded-full bg-white transition-transform ${
                    autoReply ? 'translate-x-4' : ''
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="p-4 border-b border-gray-800">
            <p className="text-xs text-gray-500 mb-2">Current Suggestion</p>
            {aiSuggestion ? (
              <div className="space-y-3">
                <div className="p-3 bg-gray-900 rounded-lg border border-gray-700">
                  <p className="text-sm text-gray-200">{aiSuggestion}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={sendManualReply}
                    className="flex-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded text-xs font-medium transition-colors"
                  >
                    Send as reply
                  </button>
                  <button
                    onClick={dismissSuggestion}
                    className="flex-1 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-xs font-medium transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-600 italic">
                Click {'\u2728'} AI Reply on a message to get a suggestion
              </p>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <p className="text-xs text-gray-500 mb-2">Suggestion History</p>
            {suggestionHistory.length === 0 ? (
              <p className="text-sm text-gray-600 italic">No suggestions yet</p>
            ) : (
              <div className="space-y-2">
                {suggestionHistory.map((item) => (
                  <div key={item.id} className="p-2 bg-gray-900/50 rounded text-sm">
                    <p className="text-gray-300 truncate">{item.content}</p>
                    <span
                      className={`text-xs mt-1 inline-block ${
                        item.status === 'sent'
                          ? 'text-green-400'
                          : item.status === 'skipped'
                          ? 'text-gray-500'
                          : 'text-yellow-400'
                      }`}
                    >
                      {item.status === 'sent' ? '\u2713 Sent' : item.status === 'skipped' ? '\u25CB Skip' : '\u25CB Pending'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
