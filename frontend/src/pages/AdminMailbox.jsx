import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiMail, FiRefreshCw, FiSend, FiUser, FiClock, FiCheckCircle, FiPlus, FiUsers, FiEye, FiMenu, FiX, FiMessageSquare } from 'react-icons/fi'
import { useToastStore } from '../context/useToastStore'
import Navbar from '../components/common/Navbar'
import VerifiedBadge from '../components/common/VerifiedBadge'
import { Link } from 'react-router-dom'

export default function AdminMailbox() {
    const [messages, setMessages] = useState([])
    const [stats, setStats] = useState({ visits: 0, total_users: 0, verified_users: 0, users: [] })
    const [selectedMsg, setSelectedMsg] = useState(null)
    const [replyText, setReplyText] = useState('')
    const [composeMode, setComposeMode] = useState(false)
    const [composeData, setComposeData] = useState({ email: '', subject: '', message: '' })
    const [viewMode, setViewMode] = useState('inbox') // inbox, users
    const [activeTab, setActiveTab] = useState('inbox') // inbox, sent, system
    const [loading, setLoading] = useState(true)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { addToast } = useToastStore()
    const [selectedIds, setSelectedIds] = useState(new Set())

    const toggleSelection = (e, id) => {
        e.stopPropagation()
        const newSet = new Set(selectedIds)
        if (newSet.has(id)) newSet.delete(id)
        else newSet.add(id)
        setSelectedIds(newSet)
    }

    const handleDeleteSelected = async () => {
        if (selectedIds.size === 0) return;
        if (!confirm(`Delete ${selectedIds.size} messages?`)) return;

        try {
            await fetch('https://timelineplus.site/api/admin/messages/batch', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: Array.from(selectedIds) })
            });
            addToast('success', 'Selected messages deleted');
            setMessages(prev => prev.filter(m => !selectedIds.has(m.id)));
            setSelectedIds(new Set());
            setSelectedMsg(null);
        } catch (e) {
            addToast('error', 'Batch delete failed');
        }
    }

    const fetchData = async () => {
        setLoading(true)
        try {
            const [resMsgs, resStats] = await Promise.all([
                fetch('https://timelineplus.site/api/admin/messages'),
                fetch('https://timelineplus.site/api/admin/stats')
            ])
            const msgs = await resMsgs.json()
            const statData = await resStats.json()

            if (resMsgs.ok) setMessages(msgs)
            if (resStats.ok) {
                console.log('AdminMailbox Stats:', statData);
                setStats(statData)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
        // Auto-sync every 30 seconds
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [])

    const handleReply = async () => {
        if (!replyText.trim()) return addToast('error', 'Reply cannot be empty')

        try {
            const res = await fetch('https://timelineplus.site/api/admin/reply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: selectedMsg.id,
                    email: selectedMsg.email,
                    subject: selectedMsg.subject,
                    reply: replyText
                })
            })
            const data = await res.json()
            if (res.ok) {
                addToast('success', 'Reply Sent!')
                setReplyText('')
                setMessages(msgs => msgs.map(m => m.id === selectedMsg.id ? { ...m, status: 'replied', reply: replyText } : m))
                setSelectedMsg(prev => ({ ...prev, status: 'replied', reply: replyText }))
            } else {
                addToast('error', data.error)
            }
        } catch (e) {
            addToast('error', 'Failed to send reply')
        }
    }

    const handleCompose = async () => {
        if (!composeData.email || !composeData.subject || !composeData.message) return addToast('error', 'Fill all fields');

        try {
            const res = await fetch('https://timelineplus.site/api/admin/compose', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(composeData)
            })
            if (res.ok) {
                addToast('success', 'Email Sent!');
                setComposeMode(false);
                setComposeData({ email: '', subject: '', message: '' });
                fetchData();
            } else {
                addToast('error', 'Failed to send');
            }
        } catch (e) {
            addToast('error', 'Network error');
        }
    }

    const handleSync = async () => {
        const toastId = addToast('info', 'Syncing emails...')
        setLoading(true)
        try {
            const res = await fetch('https://timelineplus.site/api/admin/messages/sync', { method: 'POST' })
            const data = await res.json()
            if (res.ok) {
                addToast('success', `Synced ${data.count} new emails`)
                await fetchData() // Refresh list
            } else {
                addToast('error', 'Sync failed')
            }
        } catch (e) {
            addToast('error', 'Network error')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this message?')) return;
        try {
            await fetch(`https://timelineplus.site/api/admin/messages/${id}`, { method: 'DELETE' });
            addToast('success', 'Deleted');
            setMessages(prev => prev.filter(m => m.id !== id));
            if (selectedMsg?.id === id) setSelectedMsg(null);
        } catch (e) {
            addToast('error', 'Delete failed');
        }
    }

    const handleDeleteAll = async () => {
        if (!confirm('Delete ALL messages? This cannot be undone.')) return;
        try {
            await fetch(`https://timelineplus.site/api/admin/messages/all`, { method: 'DELETE' });
            addToast('success', 'All messages cleared');
            setMessages([]);
            setSelectedMsg(null);
        } catch (e) {
            addToast('error', 'Clear failed');
        }
    }

    // Filter Logic
    const filteredMessages = messages.filter(msg => {
        if (activeTab === 'inbox') return msg.status !== 'sent' && msg.status !== 'system';
        if (activeTab === 'sent') return msg.status === 'sent';
        if (activeTab === 'system') return msg.status === 'system';
        return true;
    });

    return (
        <div className="container" style={{ padding: '100px 20px' }}>
            <Navbar />

            {/* Stats Bar */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="stats-grid mb-6">
                <div className="glass-card stat-card">
                    <FiEye className="text-primary" />
                    <div>
                        <h3>{stats.visits}</h3>
                        <p>Total Visits</p>
                    </div>
                </div>
                <div className="glass-card stat-card">
                    <FiUsers className="text-secondary" />
                    <div>
                        <h3>{stats.total_users}</h3>
                        <p>Total Users</p>
                    </div>
                </div>
                <div className="glass-card stat-card">
                    <FiCheckCircle className="text-success" />
                    <div>
                        <h3>{stats.verified_users}</h3>
                        <p>Verified</p>
                    </div>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center mb-4 flex-wrap gap-4">
                <h1 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FiMail className="text-primary" /> Admin Hub
                </h1>
                <div className="flex gap-2 flex-wrap">
                    {selectedIds.size > 0 && (
                        <button onClick={handleDeleteSelected} className="glass-btn" style={{ background: '#ef4444', color: 'white', border: 'none' }}>
                            Delete Selected ({selectedIds.size})
                        </button>
                    )}
                    <button onClick={handleDeleteAll} className="glass-btn" style={{ color: '#ef4444', border: '1px solid #ef4444' }}>Empty Trash</button>
                    <button onClick={() => setViewMode(viewMode === 'inbox' ? 'users' : 'inbox')} className="glass-btn secondary">
                        {viewMode === 'inbox' ? <><FiUsers /> View Users</> : <><FiMail /> View Inbox</>}
                    </button>
                    <button onClick={() => setComposeMode(true)} className="glass-btn primary"><FiPlus /> Compose</button>
                    <button onClick={handleSync} className="glass-btn secondary" style={{ gap: '5px' }}><FiRefreshCw /> Sync</button>
                    <Link to="/admin/support" className="glass-btn" style={{ textDecoration: 'none', color: '#10b981', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <FiMessageSquare /> Live Chat
                    </Link>
                </div>
            </motion.div>

            {composeMode && (
                <div className="glass-card mb-6" style={{ border: '1px solid #ff6600' }}>
                    <div className="flex justify-between mb-4">
                        <h3 className="font-bold">Compose New Email</h3>
                        <button onClick={() => setComposeMode(false)}><FiX /></button>
                    </div>
                    <input className="glass-input w-full mb-2" placeholder="To: email@example.com" value={composeData.email} onChange={e => setComposeData({ ...composeData, email: e.target.value })} />
                    <input className="glass-input w-full mb-2" placeholder="Subject" value={composeData.subject} onChange={e => setComposeData({ ...composeData, subject: e.target.value })} />
                    <textarea className="glass-input w-full mb-2" rows="5" placeholder="Message..." value={composeData.message} onChange={e => setComposeData({ ...composeData, message: e.target.value })}></textarea>
                    <button onClick={handleCompose} className="glass-btn primary"><FiSend /> Send Email</button>
                </div>
            )}

            <div className="mailbox-grid">
                {/* User List View */}
                {viewMode === 'users' ? (
                    <div className="glass-card w-full" style={{ overflowX: 'auto', gridColumn: 'span 2' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #eee' }}>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>User</th>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>Email</th>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>Role</th>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(stats.users || []).map(u => (
                                    <tr key={u.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                                        <td style={{ padding: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            {u.name}
                                            {/* Debug: Check if verified is true/1 */}
                                            {u.is_verified ? <VerifiedBadge size="1.2em" /> : null}
                                        </td>
                                        <td style={{ padding: '10px' }}>{u.email}</td>
                                        <td style={{ padding: '10px' }}>{u.role}</td>
                                        <td style={{ padding: '10px' }}>
                                            {u.is_verified ? (
                                                <span className="badge success" style={{ background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '10px' }}>Verified</span>
                                            ) : (
                                                <span className="badge warning" style={{ background: '#fff7ed', color: '#c2410c', padding: '2px 8px', borderRadius: '10px' }}>Pending</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <>
                        {/* Inbox View */}
                        <div className={`glass-card list-panel ${selectedMsg && 'hidden-mobile'}`} style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            {/* Tabs */}
                            <div style={{ display: 'flex', borderBottom: '1px solid #eee' }}>
                                {['inbox', 'sent', 'system'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => { setActiveTab(tab); setSelectedMsg(null); }}
                                        style={{
                                            flex: 1,
                                            padding: '10px',
                                            background: activeTab === tab ? '#fff' : '#f9f9f9',
                                            borderBottom: activeTab === tab ? '2px solid #ff6600' : 'none',
                                            fontWeight: activeTab === tab ? 'bold' : 'normal',
                                            textTransform: 'capitalize'
                                        }}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            <div style={{ padding: '10px', background: '#f5f5f5', fontSize: '0.8rem', color: '#666' }}>
                                Showing {filteredMessages.length} messages
                            </div>

                            <div style={{ overflowY: 'auto', flex: 1 }}>
                                {loading && filteredMessages.length === 0 ? <p className="p-4 text-center text-muted">Loading...</p> : filteredMessages.map(msg => (
                                    <div
                                        key={msg.id}
                                        onClick={() => setSelectedMsg(msg)}
                                        style={{
                                            padding: '15px',
                                            borderBottom: '1px solid rgba(0,0,0,0.05)',
                                            cursor: 'pointer',
                                            background: selectedMsg?.id === msg.id ? 'rgba(255, 102, 0, 0.05)' : 'transparent',
                                            borderLeft: selectedMsg?.id === msg.id ? '3px solid #ff6600' : '3px solid transparent',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px'
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.has(msg.id)}
                                            onClick={(e) => toggleSelection(e, msg.id)}
                                            style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                                        />
                                        <div style={{ flex: 1, overflow: 'hidden' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                                <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{msg.name}</span>
                                                {msg.status === 'replied' && <FiCheckCircle className="text-success" />}
                                                {msg.status === 'sent' && <FiSend className="text-primary" />}
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {msg.subject}
                                            </div>
                                            <div style={{ fontSize: '0.7rem', color: '#999' }}>{msg.date}</div>
                                        </div>
                                    </div>
                                ))}
                                {filteredMessages.length === 0 && !loading && <p className="p-4 text-center text-muted">No messages in {activeTab}.</p>}
                            </div>
                        </div>

                        {/* Message Detail */}
                        <div className={`glass-card detail-panel ${!selectedMsg && 'hidden-mobile'}`} style={{ display: 'flex', flexDirection: 'column' }}>
                            {selectedMsg ? (
                                <>
                                    <div className="mobile-header hidden-desktop">
                                        <button onClick={() => setSelectedMsg(null)} className="glass-btn secondary mb-4">← Back</button>
                                    </div>
                                    <div style={{ paddingBottom: '20px', borderBottom: '1px solid rgba(0,0,0,0.1)', marginBottom: '20px' }}>
                                        <div className="flex justify-between items-start">
                                            <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>{selectedMsg.subject}</h2>
                                            <button onClick={() => handleDelete(selectedMsg.id)} style={{ color: 'red', border: '1px solid rgba(255,0,0,0.2)', padding: '5px 10px', borderRadius: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                <FiX /> Delete
                                            </button>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: '#666', fontSize: '0.9rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><FiUser /> {selectedMsg.name} ({selectedMsg.email})</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><FiClock /> {selectedMsg.date}</div>
                                        </div>
                                    </div>

                                    <div style={{ flex: 1, overflowY: 'auto', whiteSpace: 'pre-wrap', lineHeight: '1.6', marginBottom: '30px' }}>
                                        {selectedMsg.message}
                                    </div>

                                    {selectedMsg.status === 'replied' && (
                                        <div style={{ background: '#f0fdf4', padding: '15px', borderRadius: '8px', border: '1px solid #bbf7d0', marginBottom: '15px' }}>
                                            <strong className="text-success flex items-center gap-2"><FiCheckCircle /> Replied:</strong>
                                            <p style={{ marginTop: '5px', color: '#166534' }}>{selectedMsg.reply}</p>
                                        </div>
                                    )}
                                    {selectedMsg.status === 'sent' && (
                                        <div className="text-primary text-sm mb-4">This is a sent message.</div>
                                    )}
                                    {selectedMsg.status === 'system' && (
                                        <div className="text-muted text-sm mb-4">This is an automated system message.</div>
                                    )}

                                    <div style={{ marginTop: 'auto' }}>
                                        <h3 style={{ fontSize: '1rem', marginBottom: '10px' }}>Reply</h3>
                                        <textarea
                                            className="glass-input w-full"
                                            rows="4"
                                            placeholder="Type your reply here..."
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            style={{ marginBottom: '10px' }}
                                        ></textarea>
                                        <button onClick={handleReply} className="glass-btn primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <FiSend /> Send Reply
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', flexDirection: 'column' }}>
                                    <FiMail style={{ fontSize: '4rem', marginBottom: '10px', opacity: 0.2 }} />
                                    <p>Select a message to read</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            <style>{`
                .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; }
                .stat-card { display: flex; align-items: center; gap: 15px; padding: 15px; }
                .stat-card svg { font-size: 2rem; }
                .mailbox-grid { display: grid; grid-template-columns: 300px 1fr; gap: 20px; min-height: 600px; }
                
                @media (max-width: 768px) {
                    .mailbox-grid { display: block; }
                    .list-panel { height: 500px; width: 100%; display: flex; }
                    .detail-panel { height: auto; min-height: 500px; width: 100%; }
                    .hidden-mobile { display: none !important; }
                    .hidden-desktop { display: block; }
                    .stats-grid { grid-template-columns: 1fr; }
                }
                @media (min-width: 769px) {
                    .hidden-desktop { display: none; }
                }
            `}</style>
        </div>
    )
}
