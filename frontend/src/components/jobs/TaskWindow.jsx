import React, { useState, useEffect, useRef } from 'react';
import { FiMinimize2, FiMaximize2, FiX, FiVolume2, FiVolumeX, FiActivity } from 'react-icons/fi';
import { useAuthStore } from '../../context/useAuthStore';
import { useToastStore } from '../../context/useToastStore';

const TaskWindow = ({ task, onClose, onComplete }) => {
    const { user, checkAuth } = useAuthStore();
    const { addToast } = useToastStore();
    const [isMinimized, setIsMinimized] = useState(false);
    const [status, setStatus] = useState('Initializing...');
    const [totalEarned, setTotalEarned] = useState(0.00);
    const [secondsWatched, setSecondsWatched] = useState(0);
    const [isSoundDetected, setIsSoundDetected] = useState(false);

    // Derived Link (Robust Fallback)
    const validLink = task ? (task.link || task.url || '') : '';

    // Refs
    const playerRef = useRef(null);
    const containerRef = useRef(null);
    const intervalRef = useRef(null);
    const updateIntervalRef = useRef(null);
    const uncommittedSecondsRef = useRef(0);

    // Load YouTube API
    useEffect(() => {
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }

        window.onYouTubeIframeAPIReady = initializePlayer;
        if (window.YT && window.YT.Player) {
            initializePlayer();
        }

        return () => {
            clearInterval(intervalRef.current);
            clearInterval(updateIntervalRef.current);
            // Save final progress on unmount?
        };
    }, [task]);

    const initializePlayer = () => {
        if (playerRef.current) return;

        console.log('[TaskWindow] Task Object:', task);
        console.log('[TaskWindow] Using Link:', validLink);

        // __ROBUST VIDEO ID EXTRACTION__
        const getYouTubeId = (url) => {
            if (!url) return null;
            const str = url.trim();
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
            const match = str.match(regExp);
            return (match && match[2].length === 11) ? match[2] : null;
        };

        const videoId = getYouTubeId(validLink);

        console.log('[TaskWindow] Extracted ID:', videoId);

        if (!videoId) {
            setStatus('Error: Could not load video. Please use button below.');
            return;
        }

        playerRef.current = new window.YT.Player('youtube-player', {
            height: '100%',
            width: '100%',
            videoId: videoId,
            playerVars: {
                'playsinline': 1,
                'controls': 1,
                'autoplay': 1,
                'mute': 1,
                'origin': window.location.origin
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange,
                'onError': (e) => setStatus('Video Error: ' + e.data)
            }
        });
    };

    const onPlayerReady = (event) => {
        setStatus('Ready. Please play the video.');
        startVerification();
    };

    const onPlayerStateChange = (event) => {
        if (event.data === window.YT.PlayerState.PLAYING) {
            setStatus('Tracking Active...');
        } else if (event.data === window.YT.PlayerState.PAUSED) {
            setStatus('Paused. Resume to earn.');
            setIsSoundDetected(false);
        } else if (event.data === window.YT.PlayerState.ENDED) {
            setStatus('Video Ended.');
            setIsSoundDetected(false);
        }
    };

    const startVerification = () => {
        // Check every second
        intervalRef.current = setInterval(() => {
            if (!playerRef.current || !playerRef.current.getPlayerState) return;

            const state = playerRef.current.getPlayerState();
            const volume = playerRef.current.getVolume();
            const isMuted = playerRef.current.isMuted();

            // Verification Logic: Must be PLAYING (1) and Volume > 0 and NOT Muted
            if (state === 1 && volume > 0 && !isMuted) {
                setIsSoundDetected(true);
                uncommittedSecondsRef.current += 1;
                setSecondsWatched(prev => prev + 1);

                // Visual Earner Update
                // Rate per second = (task.reward_per_task / task.target_duration)
                // But wait, the frontend doesn't have target_duration directly unless it's sent.
                // Assuming it's in `task`. Let's gracefully handle it.
                // If not available, we can just say "Earning..." or use a generic math.
                // But we CAN calculate it if budget_pool and remaining_time is sent, but it's not.
                // For now, let's keep it simple: just show uncommitted seconds out of 60.

                setStatus('Tracking... 🟢');
            } else {
                setIsSoundDetected(false);
                if (state !== 1) setStatus('Video Paused ⏸️');
                else if (isMuted || volume === 0) setStatus('Sound Required 🔊');
            }
        }, 1000);

        // Frequent check to ensure exactly 60-second milestones are processed accurately without delay
        updateIntervalRef.current = setInterval(() => {
            if (uncommittedSecondsRef.current >= 60) {
                const sendAmount = Math.floor(uncommittedSecondsRef.current / 60) * 60;
                sendUpdate(sendAmount);
                uncommittedSecondsRef.current -= sendAmount;
            }
        }, 5000);
    };

    const sendUpdate = async (seconds) => {
        try {
            const res = await fetch('https://timelineplus.site/api/campaign/watch-update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    campaignId: task.id,
                    seconds: seconds
                })
            });
            const data = await res.json();
            if (data.success) {
                setTotalEarned(prev => prev + (data.reward || 0));
                setCurrentMinuteEarned(0); // Reset minute earning
                checkAuth(); // Live update wallet balance in Navbar

                addToast('success', `+$\${data.reward.toFixed(4)} added to wallet!`);
            } else if (data.error) {
                setStatus(`Error: ${data.error}`);
                if (data.stop) {
                    clearInterval(intervalRef.current);
                    clearInterval(updateIntervalRef.current);
                    addToast('error', data.error);
                }
            }
        } catch (err) {
            console.error('Update failed', err);
        }
    };

    if (!task) return null;

    return (
        <div
            ref={containerRef}
            style={{
                position: 'fixed',
                bottom: 0,
                right: isMinimized ? '20px' : '0',
                width: isMinimized ? '300px' : '100%',
                height: isMinimized ? '60px' : '400px',
                background: '#000',
                boxShadow: '0 -5px 20px rgba(0,0,0,0.5)',
                zIndex: 9999,
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                borderTop: '2px solid #3b82f6'
            }}
        >
            {/* Header */}
            <div style={{
                height: '50px',
                background: '#18181b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 20px',
                color: 'white'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ fontWeight: 'bold', color: '#3b82f6' }}>Active Task</div>
                    <div style={{ fontSize: '0.9rem', color: '#aaa' }}>{status}</div>

                    {/* Audio Indicator */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '5px',
                        color: isSoundDetected ? '#10b981' : '#ef4444',
                        background: isSoundDetected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem'
                    }}>
                        {isSoundDetected ? <FiVolume2 /> : <FiVolumeX />}
                        {isSoundDetected ? 'Sound Detected' : 'No Sound'}
                    </div>

                    <div style={{ marginLeft: '10px', fontSize: '0.9rem', display: 'flex', flexDirection: 'column' }}>
                        <div>Current Min: <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>{secondsWatched % 60}s / 60s</span></div>
                        <div>Total Earned: <span style={{ color: '#10b981', fontWeight: 'bold' }}>${totalEarned.toFixed(4)}</span></div>
                    </div>

                    <div style={{ marginLeft: '15px', paddingLeft: '15px', borderLeft: '1px solid #444', fontSize: '0.9rem', color: '#3b82f6', fontWeight: 'bold' }}>
                        Time: {Math.floor(secondsWatched / 60)}m {secondsWatched % 60}s
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => setIsMinimized(!isMinimized)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                        {isMinimized ? <FiMaximize2 /> : <FiMinimize2 />}
                    </button>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                        <FiX />
                    </button>
                </div>
            </div>

            {/* Video Container */}
            <div style={{
                flex: 1,
                position: 'relative',
                display: isMinimized ? 'none' : 'block'
            }}>
                <div id="youtube-player" style={{ pointerEvents: !isSoundDetected && status.includes('Tracking') ? 'none' : 'auto' }}></div>

                {/* MUTE WARNING OVERLAY */}
                {!isSoundDetected && (
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(220, 38, 38, 0.7)',
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        color: 'white', zIndex: 20, pointerEvents: 'none',
                        backdropFilter: 'blur(2px)'
                    }}>
                        <FiVolumeX size={64} style={{ marginBottom: '15px', animation: 'pulse 1.5s infinite' }} />
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: '0 0 10px 0', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>VIDEO MUTED!</h2>
                        <p style={{ fontSize: '1.1rem', fontWeight: '500', background: 'rgba(0,0,0,0.5)', padding: '8px 16px', borderRadius: '8px' }}>
                            You are NOT earning money right now. Please unmute the video.
                        </p>
                    </div>
                )}

                {/* Fallback Link */}
                <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 10 }}>
                    <button
                        onClick={() => window.open(validLink, '_blank')}
                        style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid #555', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem' }}
                    >
                        Open Direct Link ↗
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskWindow;
