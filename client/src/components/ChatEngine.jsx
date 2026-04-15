import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User } from 'lucide-react';
import Card from './Card';
import Button from './Button';

export default function ChatEngine({ pageContext, title, description, icon: Icon, color }) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg = { role: 'user', content: query };
    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: userMsg.content, page_context: pageContext })
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Server returned an error');
      }
      
      setMessages((prev) => [...prev, {
        role: 'bot',
        content: data.response || 'No response received.',
        sources: data.sources || []
      }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, {
        role: 'bot',
        content: 'Sorry, the server encountered an error. Please try again.',
        sources: []
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: `${color}20`, width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={24} color={color} />
        </div>
        <div>
          <h1 style={{ fontSize: '24px', margin: 0 }}>{title}</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0, marginTop: '4px' }}>{description}</p>
        </div>
      </div>

      <Card style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden' }}>
        {/* Messages Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {messages.length === 0 && (
            <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Bot size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
              <p>Type below to start your session.</p>
            </div>
          )}
          
          {messages.map((msg, idx) => (
            <div key={idx} style={{
              display: 'flex',
              gap: '16px',
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
            }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                backgroundColor: msg.role === 'user' ? 'var(--accent-blue)' : 'var(--bg-secondary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: msg.role === 'user' ? '#fff' : color,
                border: msg.role === 'bot' ? '1px solid var(--border)' : 'none'
              }}>
                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div style={{
                backgroundColor: msg.role === 'user' ? 'var(--accent-blue-light)' : 'transparent',
                border: msg.role === 'bot' ? '1px solid var(--border)' : 'none',
                padding: '16px',
                borderRadius: '16px',
                borderTopRightRadius: msg.role === 'user' ? '4px' : '16px',
                borderTopLeftRadius: msg.role === 'bot' ? '4px' : '16px',
                maxWidth: '75%',
                color: msg.role === 'user' ? 'var(--accent-blue)' : 'var(--text-primary)'
              }}>
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }} dangerouslySetInnerHTML={{ __html: (msg.content || '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
                
                {msg.sources && msg.sources.length > 0 && (
                  <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border)', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <strong>Sources:</strong> {msg.sources.join(', ')}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                backgroundColor: 'var(--bg-secondary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: color, border: '1px solid var(--border)'
              }}>
                <Bot size={18} />
              </div>
              <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Loader2 className="animate-spin" size={18} color="var(--text-muted)" />
                <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ padding: '20px', borderTop: '1px solid var(--border)', backgroundColor: 'var(--bg-secondary)' }}>
          <form style={{ display: 'flex', gap: '12px' }} onSubmit={handleSubmit}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything..."
              style={{
                flex: 1,
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                outline: 'none',
                fontSize: '15px'
              }}
            />
            <Button
              type="submit"
              disabled={loading || !query.trim()}
              style={{
                borderRadius: '12px',
                padding: '0 24px',
                backgroundColor: loading || !query.trim() ? 'var(--bg-secondary)' : color,
                color: loading || !query.trim() ? 'var(--text-muted)' : '#fff',
                height: 'auto' // Match input height
              }}
            >
              <Send size={20} />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
