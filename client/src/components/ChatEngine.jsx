import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User, ImagePlus, X } from 'lucide-react';
import Card from './Card';
import Button from './Button';

export default function ChatEngine({ pageContext, title, description, icon: Icon, color, onBotResponse }) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (selectedImages.length + files.length > 10) {
      alert('You can only upload a maximum of 10 images per message.');
      return;
    }

    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }
      return true;
    });

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImages(prev => [...prev, {
          file,
          previewUrl: URL.createObjectURL(file),
          base64: reader.result
        }]);
      };
      reader.readAsDataURL(file);
    });
    
    // Reset input so the same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim() && selectedImages.length === 0) return;

    const userMsg = { 
       role: 'user', 
       content: query,
       images: selectedImages.map(img => img.base64)
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setSelectedImages([]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query: userMsg.content, 
          page_context: pageContext,
          images: userMsg.images
        })
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Server returned an error');
      }
      
      const botMsg = {
        role: 'bot',
        content: data.response || 'No response received.',
        sources: data.sources || []
      };
      setMessages((prev) => [...prev, botMsg]);
      
      // Trigger callback for activity tracking
      if (onBotResponse) {
        onBotResponse(userMsg, botMsg);
      }
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
                {msg.content && (
                  <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }} dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
                )}
                
                {/* Render sent images */}
                {msg.images && msg.images.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: msg.content ? '12px' : '0' }}>
                    {msg.images.map((imgSrc, i) => (
                      <img key={i} src={imgSrc} alt="Attached" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)' }} />
                    ))}
                  </div>
                )}

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
        <div style={{ padding: '20px', borderTop: '1px solid var(--border)', backgroundColor: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Image Previews */}
          {selectedImages.length > 0 && (
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
              {selectedImages.map((img, idx) => (
                <div key={idx} style={{ position: 'relative', width: '60px', height: '60px', flexShrink: 0 }}>
                  <img src={img.previewUrl} alt={`preview ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)' }} />
                  <button 
                    type="button"
                    onClick={() => removeImage(idx)}
                    style={{ position: 'absolute', top: '-6px', right: '-6px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-primary)' }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <form style={{ display: 'flex', gap: '12px', alignItems: 'center' }} onSubmit={handleSubmit}>
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleImageChange} 
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0,
                backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-secondary)', cursor: 'pointer', outline: 'none',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, { borderColor: color, color: color })}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: 'var(--border)', color: 'var(--text-secondary)' })}
            >
              <ImagePlus size={20} />
            </button>

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
              disabled={loading || (!query.trim() && selectedImages.length === 0)}
              style={{
                borderRadius: '12px',
                padding: '0 24px',
                backgroundColor: loading || (!query.trim() && selectedImages.length === 0) ? 'var(--bg-secondary)' : color,
                color: loading || (!query.trim() && selectedImages.length === 0) ? 'var(--text-muted)' : '#fff',
                height: '48px'
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
