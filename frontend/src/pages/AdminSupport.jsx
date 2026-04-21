import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiUser, FiRefreshCw } from 'react-icons/fi';
import { useAuthStore } from '../context/useAuthStore';

export default function AdminSupport() {
    const [sessions, setSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [editingName, setEditingName] = useState(null);
    const [newName, setNewName] = useState('');
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    // Fetch Sessions
    const fetchSessions = async () => {
        try {
            const res = await fetch('https://timelineplus.site/api/admin/support/sessions');
            const data = await res.json();
            setSessions(data);
        } catch (err) {
            console.error("Fetch Sessions Error", err);
        }
    };

    useEffect(() => {
        fetchSessions();
        const interval = setInterval(fetchSessions, 10000); // Refresh list every 10s
        return () => clearInterval(interval);
    }, []);

    // Fetch Chat History
    const fetchHistory = async (sessionId) => {
        if (!sessionId) return;
        try {
            const res = await fetch(`https://timelineplus.site/api/support/history/${encodeURIComponent(sessionId)}`);
            const data = await res.json();
            setMessages(data);
        } catch (err) {
            console.error("Fetch History Error", err);
        }
    };

    // Auto-refresh active chat
    useEffect(() => {
        if (!selectedSession) return;
        fetchHistory(selectedSession.id);
        const interval = setInterval(() => fetchHistory(selectedSession.id), 5000);
        return () => clearInterval(interval);
    }, [selectedSession]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Select Session & Mark Read
    const handleSelectSession = async (session) => {
        setSelectedSession(session);
        // Optimistic update
        setSessions(prev => prev.map(s => s.id === session.id ? { ...s, unread_count: 0 } : s));

        try {
            await fetch('https://timelineplus.site/api/admin/support/read', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId: session.id })
            });
        } catch (err) {
            console.error("Read Mark Error", err);
        }
    };

    // Send Admin Reply
    const handleSend = async () => {
        if ((!inputText.trim() && !attachment) || !selectedSession) return;

        const formData = new FormData();
        formData.append('sessionId', selectedSession.id);
        formData.append('sender', 'admin');
        formData.append('content', inputText);
        if (attachment) {
            formData.append('attachment', attachment);
            formData.append('type', attachment.type.startsWith('image') ? 'image' : 'video');
        } else {
            formData.append('type', 'text');
        }

        setInputText('');
        setAttachment(null);

        try {
            await fetch('https://timelineplus.site/api/support/message', {
                method: 'POST',
                body: formData
            });
            fetchHistory(selectedSession.id);
        } catch (err) {
            console.error("Send Error", err);
        }
    };

    const handleUpdateName = async () => {
        if (!selectedSession || !newName.trim()) return;

        try {
            await fetch('https://timelineplus.site/api/admin/support/name', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId: selectedSession.id, name: newName })
            });

            setSessions(prev => prev.map(s => s.id === selectedSession.id ? { ...s, name: newName } : s));
            setSelectedSession(prev => ({ ...prev, name: newName }));
            setEditingName(null);
        } catch (err) {
            console.error("Update Name Error", err);
        }
    };

    return (
        <div className="container" style={{ padding: '80px 20px 20px', minHeight: '100vh', boxSizing: 'border-box' }}>
            <h2>Support Dashboard</h2>

            <div className="support-grid" style={{
                display: 'grid',
                // Desktop: 300px 1fr, Mobile: 1fr (handled via CSS class/media query interaction conceptually, but here we use dynamic styles or CSS block)
                gap: '20px',
                height: 'calc(100vh - 150px)',
                background: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}>
                {/* Session List */}
                <div
                    className={`session-list ${selectedSession ? 'hidden-mobile' : ''}`}
                    style={{
                        borderRight: '1px solid #e4e4e7',
                        overflowY: 'auto',
                        background: '#fafafa',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <div style={{ padding: '15px', borderBottom: '1px solid #e4e4e7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ margin: 0 }}>Active Chats</h4>
                        <button onClick={fetchSessions} className="icon-btn"><FiRefreshCw /></button>
                    </div>
                    {sessions.map(session => (
                        <div
                            key={session.id}
                            onClick={() => handleSelectSession(session)}
                            style={{
                                padding: '15px',
                                cursor: 'pointer',
                                background: selectedSession?.id === session.id ? '#e4e4e7' : 'transparent',
                                borderBottom: '1px solid #f4f4f5'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '50%', background: '#d4d4d8',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    position: 'relative'
                                }}>
                                    <FiUser />
                                    {session.unread_count > 0 && (
                                        <div style={{
                                            position: 'absolute', top: -2, right: -2, width: '12px', height: '12px',
                                            background: '#f97316', borderRadius: '50%', border: '2px solid white'
                                        }} />
                                    )}
                                </div>
                                <div style={{ overflow: 'hidden' }}>
                                    <p style={{
                                        margin: 0,
                                        fontWeight: session.unread_count > 0 ? '800' : 'bold',
                                        fontSize: '0.9rem',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        color: session.unread_count > 0 ? 'black' : '#3f3f46'
                                    }}>
                                        {session.name || session.id.substring(0, 8) + '...'}
                                        {((session.message_count === 1 && session.unread_count > 0) || !session.message_count) && (
                                            <span style={{ marginLeft: '5px', fontSize: '0.7rem', color: '#f97316' }}>(New)</span>
                                        )}
                                    </p>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: session.unread_count > 0 ? '#18181b' : '#71717a' }}>
                                        {session.name ? session.id.substring(0, 8) : ''} • {new Date(session.last_active_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {sessions.length === 0 && (
                        <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>No active chats</div>
                    )}
                </div>

                {/* Chat Area */}
                <div
                    className={`chat-area ${!selectedSession ? 'hidden-mobile' : ''}`}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        overflow: 'hidden'
                    }}
                >
                    {selectedSession ? (
                        <>
                            {/* Chat Header */}
                            <div style={{ padding: '15px', borderBottom: '1px solid #e4e4e7', background: 'white' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        {/* Mobile Back Button */}
                                        <button
                                            className="mobile-only"
                                            onClick={() => setSelectedSession(null)}
                                            style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', paddingRight: '10px' }}
                                        >
                                            ←
                                        </button>

                                        <div>
                                            {editingName === selectedSession.id ? (
                                                <div style={{ display: 'flex', gap: '5px' }}>
                                                    <input
                                                        type="text"
                                                        value={newName}
                                                        onChange={e => setNewName(e.target.value)}
                                                        placeholder="Enter user name"
                                                        style={{ padding: '5px', borderRadius: '4px', border: '1px solid #d4d4d8' }}
                                                    />
                                                    <button onClick={handleUpdateName} style={{ background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer' }}>Save</button>
                                                    <button onClick={() => setEditingName(null)} style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer' }}>Cancel</button>
                                                </div>
                                            ) : (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <h4 style={{ margin: 0 }}>
                                                        {selectedSession.name || selectedSession.id.substring(0, 8)}
                                                    </h4>
                                                    <button
                                                        onClick={() => { setEditingName(selectedSession.id); setNewName(selectedSession.name || ''); }}
                                                        style={{ border: 'none', background: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '0.8rem' }}
                                                    >
                                                        Edit Name
                                                    </button>
                                                </div>
                                            )}
                                            <small style={{ color: '#71717a' }}>ID: {selectedSession.id}</small>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Messages */}
                            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', background: '#f4f4f5', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {messages.map(msg => (
                                    <div
                                        key={msg.id}
                                        style={{
                                            alignSelf: msg.sender === 'admin' ? 'flex-end' : 'flex-start',
                                            maxWidth: '70%',
                                            background: msg.sender === 'admin' ? '#18181b' : 'white',
                                            color: msg.sender === 'admin' ? 'white' : 'black',
                                            padding: '10px 15px',
                                            borderRadius: '12px',
                                            boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                                        }}
                                    >
                                        {msg.type === 'text' && <p style={{ margin: 0 }}>{msg.content}</p>}
                                        {msg.type === 'image' && <img src={msg.content} alt="media" style={{ maxWidth: '100%', borderRadius: '8px' }} />}
                                        <small style={{ display: 'block', marginTop: '5px', fontSize: '0.7rem', opacity: 0.7 }}>
                                            {msg.sender === 'admin' ? 'You' : 'User'} • {new Date(msg.timestamp).toLocaleTimeString()}
                                        </small>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div style={{ padding: '15px', borderTop: '1px solid #e4e4e7', background: 'white', display: 'flex', gap: '10px' }}>
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="Type a reply..."
                                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #d4d4d8' }}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                />
                                <button onClick={handleSend} style={{ padding: '10px 20px', background: '#18181b', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                                    <FiSend />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#a1a1aa', flexDirection: 'column' }}>
                            <p>Select a chat to start messaging</p>
                        </div>
                    )}
                </div>
            </div>
            <style>{`
                .support-grid {
                    display: grid;
                    grid-template-columns: 300px 1fr;
                }
                .icon-btn { border: none; background: none; cursor: pointer; font-size: 1.1rem; }
                .mobile-only { display: none; }
                
                @media (max-width: 768px) {
                    .support-grid {
                        display: block; /* Stack them */
                    }
                    .session-list {
                        width: 100%;
                        height: 100%;
                    }
                    .chat-area {
                        width: 100%;
                        height: 100%;
                    }
                    .hidden-mobile {
                        display: none !important;
                    }
                    .mobile-only {
                        display: block;
                    }
                }
            `}</style>
        </div>
    );
}
