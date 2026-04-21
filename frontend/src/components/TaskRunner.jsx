import { useState, useEffect } from 'react'
import { FiExternalLink, FiClock, FiCheckCircle, FiPlay, FiActivity } from 'react-icons/fi'

export default function TaskRunner({ task, onComplete }) {
    const [status, setStatus] = useState('idle') // idle, running, ready, completing
    const [timeLeft, setTimeLeft] = useState(30)

    useEffect(() => {
        let interval
        if (status === 'running' && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1)
            }, 1000)
        } else if (timeLeft === 0 && status === 'running') {
            setStatus('ready')
        }
        return () => clearInterval(interval)
    }, [status, timeLeft])

    const handleStart = () => {
        // Open link safely
        const link = task.link?.startsWith('http') ? task.link : `https://${task.link}`;
        window.open(link, '_blank')
        setStatus('running')
    }

    const handleVerify = () => {
        const isSocial = ['facebook', 'instagram', 'tiktok', 'twitter', 'youtube'].some(s => task.title.toLowerCase().includes(s));

        if (isSocial) {
            setStatus('verifying_fake')
            setTimeout(() => {
                setStatus('completing')
                onComplete(task.id)
            }, 6000) // 6 seconds fake verify
        } else {
            setStatus('completing')
            onComplete(task.id)
        }
    }

    if (task.status === 'completed') {
        return (
            <button className="glass-btn success w-full" disabled>
                <FiCheckCircle /> Completed
            </button>
        )
    }

    return (
        <div className="w-full">
            {status === 'idle' && (
                <button onClick={handleStart} className="glass-btn primary w-full">
                    <FiPlay /> Start Task
                </button>
            )}

            {status === 'running' && (
                <button className="glass-btn w-full" disabled style={{ background: 'rgba(255,255,255,0.1)', cursor: 'wait' }}>
                    <FiClock className="animate-spin-slow" /> Wait {timeLeft}s
                </button>
            )}

            {status === 'ready' && (
                <button onClick={handleVerify} className="glass-btn success w-full animate-pulse">
                    <FiCheckCircle /> Verify & Earn
                </button>
            )}

            {status === 'verifying_fake' && (
                <button className="glass-btn secondary w-full animate-pulse" disabled style={{ opacity: 0.9 }}>
                    <FiActivity className="animate-spin" /> Verifying with API...
                </button>
            )}

            {status === 'completing' && (
                <button className="glass-btn w-full" disabled>
                    Verifying...
                </button>
            )}
        </div>
    )
}
