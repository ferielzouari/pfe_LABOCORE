import React, { useState, useRef, useEffect } from 'react'
import { chatApi, ChatMessage } from '../services/api'

interface AIAssistantProps {
  onClose: () => void
}

const SUGGESTED_QUESTIONS = [
  "What's critically low?",
  'Show recent movements',
  'Which supplier provides ACC0001?',
]

const ChatIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
)

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const AIAssistant: React.FC<AIAssistantProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleClose = () => {
    setVisible(false)
    setTimeout(onClose, 250)
  }

  const sendMessage = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: trimmed }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await chatApi.sendMessage(newMessages)
      setMessages([...newMessages, { role: 'assistant', content: res.reply }])
    } catch (err: any) {
      setMessages([...newMessages, {
        role: 'assistant',
        content: err?.message || "Sorry, I'm having trouble connecting right now. Please try again."
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <>
      <style>{`
        @keyframes aiTypingDot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.35; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      {/* Backdrop */}
      <div
        style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)',
          zIndex: 299, opacity: visible ? 1 : 0, transition: 'opacity 0.25s ease',
          backdropFilter: 'blur(2px)',
        }}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div
        style={{
          position: 'fixed', top: 0, right: 0, height: '100vh', width: '420px', maxWidth: '100vw',
          background: 'var(--surface-color)', borderLeft: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-floating)', zIndex: 300,
          display: 'flex', flexDirection: 'column',
          transform: visible ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
        }}
      >
        {/* Header */}
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.0625rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
              <span style={{ color: 'var(--primary-color)', display: 'inline-flex' }}><ChatIcon /></span>
              AI Assistant
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Ask about stock, articles, and suppliers
            </p>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.25rem' }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {messages.length === 0 && (
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                Try asking:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {SUGGESTED_QUESTIONS.map(q => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    style={{
                      textAlign: 'left', padding: '0.625rem 0.875rem', borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)', background: 'var(--surface-hover)',
                      color: 'var(--text-main)', fontSize: '0.8125rem', cursor: 'pointer',
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div
                style={{
                  maxWidth: '80%', padding: '0.625rem 0.875rem', borderRadius: 'var(--radius-md)',
                  background: m.role === 'user' ? 'var(--primary-color)' : 'var(--surface-hover)',
                  color: m.role === 'user' ? '#fff' : 'var(--text-main)',
                  border: m.role === 'assistant' ? '1px solid var(--border-color)' : 'none',
                  fontSize: '0.875rem', lineHeight: 1.5, whiteSpace: 'pre-wrap',
                }}
              >
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{
                padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                background: 'var(--surface-hover)', border: '1px solid var(--border-color)',
                display: 'flex', gap: '4px', alignItems: 'center',
              }}>
                {[0, 1, 2].map(i => (
                  <span
                    key={i}
                    style={{
                      width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)',
                      animation: 'aiTypingDot 1.2s ease-in-out infinite',
                      animationDelay: `${i * 0.15}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem' }}>
          <input
            className="form-control"
            style={{ flex: 1 }}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about stock, articles, suppliers..."
            disabled={loading}
          />
          <button type="submit" className="btn btn-primary" disabled={loading || !input.trim()} aria-label="Send">
            <SendIcon />
          </button>
        </form>
      </div>
    </>
  )
}

export default AIAssistant
