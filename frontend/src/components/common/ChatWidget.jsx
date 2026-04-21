import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiPaperclip, FiX, FiRefreshCw, FiImage, FiMic } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

import { useAuthStore } from '../../context/useAuthStore';

export default function ChatWidget({ onClose }) {
    const { user } = useAuthStore();
    const [sessionId, setSessionId] = useState(localStorage.getItem('support_session_id') || null);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isRecovering, setIsRecovering] = useState(false);
    const [recoverInput, setRecoverInput] = useState('');

    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    // Scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initialize or Recover Session
    useEffect(() => {
        const initSession = async () => {
            setLoading(true);
            try {
                const res = await fetch('https://timelineplus.site/api/support/init', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sessionId, user })
                });
                const data = await res.json();

                if (data.status === 'active' || data.status === 'created') {
                    setSessionId(data.sessionId);
                    localStorage.setItem('support_session_id', data.sessionId);
                    fetchHistory(data.sessionId);
                } else if (data.status === 'expired' || data.status === 'not_found') {
                    // Session invalid, clear local storage
                    localStorage.removeItem('support_session_id');
                    setSessionId(null);
                }
            } catch (err) {
                console.error("Session Init Error", err);
            } finally {
                setLoading(false);
            }
        };

        if (sessionId) {
            initSession();
        } else {
            // Auto-create new session if none exists
            initSession();
        }
    }, []);

    // Fetch History
    const fetchHistory = async (id) => {
        if (!id) return;
        try {
            const res = await fetch(`https://timelineplus.site/api/support/history/${id}`);
            const data = await res.json();
            setMessages(data);
        } catch (err) {
            console.error("Fetch History Error", err);
        }
    };

    // Poll for new messages (Simple real-time)
    useEffect(() => {
        if (!sessionId) return;
        const interval = setInterval(() => fetchHistory(sessionId), 5000);
        return () => clearInterval(interval);
    }, [sessionId]);

    // Send Message
    const handleSend = async () => {
        if ((!inputText.trim() && !attachment) || !sessionId) return;

        const formData = new FormData();
        formData.append('sessionId', sessionId);
        formData.append('sender', 'user');
        formData.append('content', inputText);
        if (attachment) {
            formData.append('attachment', attachment);
            formData.append('type', attachment.type.startsWith('image') ? 'image' : 'video');
        } else {
            formData.append('type', 'text');
        }

        // Optimistic UI Update (Text only)
        if (!attachment) {
            setMessages(prev => [...prev, {
                id: Date.now(),
                sender: 'user',
                type: 'text',
                content: inputText,
                timestamp: new Date().toISOString()
            }]);
        }

        setInputText('');
        setAttachment(null);

        try {
            await fetch('https://timelineplus.site/api/support/message', {
                method: 'POST',
                body: formData
            });
            fetchHistory(sessionId); // Sync with server
        } catch (err) {
            console.error("Send Error", err);
        }
    };

    const handleRecovery = () => {
        if (!recoverInput) return;
        setSessionId(recoverInput);
        localStorage.setItem('support_session_id', recoverInput);
        setIsRecovering(false);
        // Page reload or effect trigger will handle init
        window.location.reload();
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Header */}
            <div style={{
                padding: '15px',
                background: '#18181b',
                color: '#ffffff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                <div>
                    <h3 style={{
                        margin: 0,
                        fontSize: '1rem',
                        color: '#ffffff',
                        background: 'none',
                        WebkitTextFillColor: '#ffffff',
                        backgroundClip: 'border-box',
                        WebkitBackgroundClip: 'border-box'
                    }}>Support Chat</h3>
                    <small style={{ color: '#d4d4d8', fontSize: '0.7rem' }}>ID: {sessionId || 'Connecting...'}</small>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => setIsRecovering(!isRecovering)} className="icon-btn header-icon" title="Recover Chat">
                        <FiRefreshCw style={{ color: '#ffffff' }} />
                    </button>
                    <button onClick={onClose} className="icon-btn header-icon">
                        <FiX style={{ color: '#ffffff' }} />
                    </button>
                </div>
            </div>

            {/* Recovery View */}
            {isRecovering && (
                <div style={{ padding: '15px', background: '#f4f4f5', borderBottom: '1px solid #e4e4e7' }}>
                    <p style={{ fontSize: '0.8rem', marginBottom: '10px' }}>Enter Support ID to recover chat:</p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            value={recoverInput}
                            onChange={(e) => setRecoverInput(e.target.value)}
                            className="input-field"
                            style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #d4d4d8' }}
                        />
                        <button onClick={handleRecovery} className="glass-btn secondary" style={{ padding: '8px 15px', fontSize: '0.8rem' }}>Recover</button>
                    </div>
                </div>
            )}

            {/* Messages Area */}
            <div style={{
                flex: 1,
                padding: '15px',
                overflowY: 'auto',
                background: '#fafafa',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            }}>
                {loading && <p style={{ textAlign: 'center', color: '#a1a1aa' }}>Loading...</p>}

                {messages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                            maxWidth: '80%',
                            background: msg.sender === 'user' ? '#18181b' : 'white',
                            color: msg.sender === 'user' ? 'white' : '#18181b',
                            padding: '10px 15px',
                            borderRadius: msg.sender === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                            border: msg.sender !== 'user' ? '1px solid #e4e4e7' : 'none',
                            fontSize: '0.9rem'
                        }}
                    >
                        {msg.type === 'text' && <p style={{ margin: 0 }}>{msg.content}</p>}
                        {msg.type === 'image' && <img src={msg.content} alt="attachment" style={{ maxWidth: '100%', borderRadius: '8px' }} />}
                        {msg.type === 'video' && <video src={msg.content} controls style={{ maxWidth: '100%', borderRadius: '8px' }} />}
                        <small style={{
                            display: 'block',
                            marginTop: '5px',
                            fontSize: '0.65rem',
                            color: msg.sender === 'user' ? 'rgba(255,255,255,0.5)' : '#a1a1aa'
                        }}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </small>
                    </motion.div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div style={{
                padding: '15px',
                background: 'white',
                borderTop: '1px solid #e4e4e7',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
            }}>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={(e) => setAttachment(e.target.files[0])}
                    accept="image/*,video/*"
                />
                <button
                    onClick={() => fileInputRef.current.click()}
                    className="icon-btn"
                    style={{ color: attachment ? '#10b981' : '#71717a' }}
                    title="Attach File"
                >
                    {attachment ? <FiImage /> : <FiPaperclip />}
                </button>

                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={attachment ? "Add a caption..." : "Type a message..."}
                    style={{
                        flex: 1,
                        border: 'none',
                        outline: 'none',
                        fontSize: '0.95rem'
                    }}
                />

                <button
                    onClick={handleSend}
                    className="icon-btn"
                    style={{
                        color: inputText || attachment ? '#18181b' : '#d4d4d8',
                        cursor: inputText || attachment ? 'pointer' : 'default'
                    }}
                >
                    <FiSend />
                </button>
            </div>

            <style>{`
                .icon-btn {
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 1.2rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 5px;
                    border-radius: 50%;
                    transition: background 0.2s;
                }
                .icon-btn:hover {
                    background: rgba(0,0,0,0.05);
                }
                .header-icon:hover {
                    background: rgba(255,255,255,0.1) !important;
                }
            `}</style>
        </div>
    );
}
