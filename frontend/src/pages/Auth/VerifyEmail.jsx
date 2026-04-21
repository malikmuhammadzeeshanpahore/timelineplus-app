import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCheckCircle, FiXCircle, FiLoader, FiGift } from 'react-icons/fi'
import { useToastStore } from '../../context/useToastStore'
import { useAuthStore } from '../../context/useAuthStore'

export default function VerifyEmail() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { addToast } = useToastStore()
    const { user, login } = useAuthStore()
    const [status, setStatus] = useState('loading') // loading, success, error
    const [message, setMessage] = useState('Verifying your email...')
    const [bonusClaimed, setBonusClaimed] = useState(false)
    const [isFreelancer, setIsFreelancer] = useState(false)

    useEffect(() => {
        const token = searchParams.get('token')
        if (!token) {
            setStatus('error')
            setMessage('Invalid verification link.')
            return
        }

        const verifyToken = async () => {
            try {
                const res = await fetch('https://timelineplus.site/api/auth/verify-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token })
                })
                const data = await res.json()

                if (res.ok) {
                    setStatus('success')
                    setMessage(data.message)
                    addToast('success', 'Email Verified Successfully!')

                    setTimeout(() => navigate('/dashboard'), 2000)
                } else {
                    setStatus('error')
                    setMessage(data.error || 'Verification failed')
                }
            } catch (err) {
                setStatus('error')
                setMessage('Network error. Please try again.')
            }
        }

        verifyToken()
    }, [searchParams, navigate, addToast, user])
    // Bonus is now claimed on Dashboard

    return (
        <div className="flex-center" style={{
            minHeight: '100vh',
            padding: '20px',
            background: 'linear-gradient(to bottom, #ffffff, #f0f0f0)'
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card"
                style={{ width: '100%', maxWidth: '400px', padding: '40px', textAlign: 'center' }}
            >
                {status === 'loading' && (
                    <>
                        <FiLoader className="spin" style={{ fontSize: '3rem', color: '#ff6600', marginBottom: '20px' }} />
                        <h2 className="text-xl font-bold mb-2">Verifying...</h2>
                        <p className="text-muted">{message}</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <FiCheckCircle style={{ fontSize: '3rem', color: '#10B981', marginBottom: '20px' }} />
                        <h2 className="text-xl font-bold mb-2">Verified!</h2>
                        <p className="text-muted mb-4">{message}</p>

                        <p className="text-sm">Redirecting to Dashboard...</p>
                        <button onClick={() => navigate('/dashboard')} className="glass-btn primary mt-4 w-full">
                            Go to Dashboard
                        </button>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <FiXCircle style={{ fontSize: '3rem', color: '#EF4444', marginBottom: '20px' }} />
                        <h2 className="text-xl font-bold mb-2">Verification Failed</h2>
                        <p className="text-muted mb-4">{message}</p>
                        <button onClick={() => navigate('/login')} className="glass-btn secondary mt-4 w-full">
                            Back to Login
                        </button>
                    </>
                )}
            </motion.div>
        </div>
    )
}
