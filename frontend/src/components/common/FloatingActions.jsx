import React, { useState } from 'react';
import { FiMessageSquare, FiX, FiSend } from 'react-icons/fi';
import ChatWidget from './ChatWidget';
import { useAuthStore } from '../../context/useAuthStore';

export default function FloatingActions() {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const { user } = useAuthStore();

    return (
        <>
            {isChatOpen && (
                <div className="chat-widget-container">
                    <ChatWidget onClose={() => setIsChatOpen(false)} />
                </div>
            )}

            <div className="floating-actions-container">
                {/* WhatsApp Button */}
                <a
                    href="https://whatsapp.com/channel/0029Vb7jSxP3QxS7gPFGNz0v"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fa-btn fa-whatsapp"
                    title="WhatsApp Channel"
                >
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                        alt="WhatsApp"
                        style={{ width: '22px', height: '22px' }}
                    />
                    <span className="fa-label">WhatsApp</span>
                </a>

                {/* Support Chat Button */}
                <button
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    className={`fa-btn fa-chat${isChatOpen ? ' fa-chat--open' : ''}`}
                    title="Support Chat"
                >
                    {isChatOpen ? <FiX size={20} /> : <FiMessageSquare size={20} />}
                    <span className="fa-label">{isChatOpen ? 'Close' : 'Support'}</span>
                </button>
            </div>

            <style>{`
                .floating-actions-container {
                    position: fixed;
                    top: 50%;
                    transform: translateY(-50%);
                    right: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    z-index: 9991;
                }

                .fa-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 14px 10px 12px;
                    border: none;
                    cursor: pointer;
                    text-decoration: none;
                    font-weight: 700;
                    font-size: 0.82rem;
                    color: #fff;
                    border-radius: 12px 0 0 12px;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.18);
                    transition: transform 0.2s, box-shadow 0.2s, padding-right 0.2s;
                    white-space: nowrap;
                    overflow: hidden;
                    max-width: 46px;
                    font-family: inherit;
                }

                .fa-btn:hover {
                    max-width: 140px;
                    padding-right: 16px;
                    transform: translateX(-2px);
                    box-shadow: 0 8px 24px rgba(0,0,0,0.22);
                }

                .fa-label {
                    opacity: 0;
                    transform: translateX(6px);
                    transition: opacity 0.2s, transform 0.2s;
                    font-size: 0.82rem;
                    white-space: nowrap;
                }

                .fa-btn:hover .fa-label {
                    opacity: 1;
                    transform: translateX(0);
                }

                .fa-whatsapp {
                    background: linear-gradient(135deg, #25d366, #128c7e);
                }

                .fa-chat {
                    background: linear-gradient(135deg, #18181b, #3f3f46);
                }

                .fa-chat--open {
                    background: linear-gradient(135deg, #ef4444, #dc2626);
                }

                .chat-widget-container {
                    position: fixed;
                    bottom: 20px !important;
                    top: auto !important;
                    right: 80px;
                    width: 380px;
                    height: 600px;
                    max-height: 80vh;
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.25);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    border: 1px solid #e5e7eb;
                    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    z-index: 9999;
                }

                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px) scale(0.98); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }

                @media (max-width: 768px) {
                    .floating-actions-container {
                        top: auto;
                        bottom: 90px;
                        right: 0;
                        transform: none;
                    }
                    .chat-widget-container {
                        position: fixed;
                        top: auto !important;
                        bottom: 0 !important;
                        right: 0 !important;
                        left: 0 !important;
                        width: 100% !important;
                        height: 80vh !important;
                        max-height: 80vh;
                        border-radius: 20px 20px 0 0;
                        z-index: 10000;
                        box-shadow: 0 -4px 25px rgba(0,0,0,0.2);
                        border: none;
                        animation: slideUpMobile 0.3s ease-out;
                    }
                }

                @keyframes slideUpMobile {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
            `}</style>
        </>
    );
}
