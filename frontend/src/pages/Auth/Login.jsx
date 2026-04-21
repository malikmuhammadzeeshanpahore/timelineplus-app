import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../context/useAuthStore'
import { useToastStore } from '../../context/useToastStore'
import { motion } from 'framer-motion'
import SEO from '../../components/common/SEO'
import { FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff, FiZap } from 'react-icons/fi'

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const { user, login, isLoading } = useAuthStore()
    const { addToast } = useToastStore()
    const navigate = useNavigate()
    const [showPass, setShowPass] = useState(false)

    useEffect(() => {
        if (user) {
            navigate(user.role === 'admin' ? '/admin-dashboard' : '/dashboard')
        }
    }, [user, navigate])


    const onSubmit = async (data) => {
        try {
            const user = await login(data.email, data.password)
            addToast('success', 'Welcome back!')
            navigate(user.role === 'admin' ? '/admin-dashboard' : '/dashboard')
        } catch (err) {
            addToast('error', 'Invalid email or password.')
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <SEO title="Login — TimelinePlus" description="Sign in to your TimelinePlus account." />

            {/* Glow orbs */}
            <div style={{ position: 'absolute', top: '10%', left: '5%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(255,102,0,0.15), transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 250, height: 250, background: 'radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                    width: '100%', maxWidth: '400px',
                    background: 'rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '24px',
                    padding: '36px 32px',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
                    position: 'relative', zIndex: 1
                }}
            >
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,102,0,0.15)', border: '1px solid rgba(255,102,0,0.3)', padding: '8px 18px', borderRadius: 50, marginBottom: 16 }}>
                        <FiZap size={16} color="#ff9500" />
                        <span style={{ color: '#ff9500', fontWeight: 800, fontSize: '0.85rem' }}>TimelinePlus</span>
                    </div>
                    <h1 style={{ fontSize: '1.7rem', fontWeight: 900, color: '#fff', marginBottom: 6 }}>Welcome Back</h1>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem' }}>Sign in to your account</p>
                </div>

                {/* Social Login */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
                    <a href="https://timelineplus.site/api/auth/google" style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                        padding: '11px', borderRadius: 12, background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontWeight: 700,
                        fontSize: '0.88rem', textDecoration: 'none', transition: 'background 0.2s',
                        cursor: 'pointer'
                    }}
                        onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
                        onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: 18, height: 18 }} />
                        Continue with Google
                    </a>

                </div>

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
                    <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.12)' }} />
                    <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', fontWeight: 600 }}>OR</span>
                    <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.12)' }} />
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div style={{ marginBottom: 14 }}>
                        <div style={{ position: 'relative' }}>
                            <FiMail size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
                            <input
                                {...register("email", { required: "Email required" })}
                                placeholder="Email or Username"
                                style={{
                                    width: '100%', padding: '12px 14px 12px 40px',
                                    background: 'rgba(255,255,255,0.08)',
                                    border: errors.email ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.15)',
                                    borderRadius: 12, color: '#fff', fontSize: '0.9rem',
                                    outline: 'none', boxSizing: 'border-box',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>
                        {errors.email && <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: 4, display: 'block' }}>{errors.email.message}</span>}
                    </div>

                    <div style={{ marginBottom: 8 }}>
                        <div style={{ position: 'relative' }}>
                            <FiLock size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
                            <input
                                type={showPass ? 'text' : 'password'}
                                {...register("password", { required: "Password required" })}
                                placeholder="Password"
                                style={{
                                    width: '100%', padding: '12px 44px 12px 40px',
                                    background: 'rgba(255,255,255,0.08)',
                                    border: errors.password ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.15)',
                                    borderRadius: 12, color: '#fff', fontSize: '0.9rem',
                                    outline: 'none', boxSizing: 'border-box',
                                    fontFamily: 'inherit'
                                }}
                            />
                            <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 0 }}>
                                {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                            </button>
                        </div>
                        {errors.password && <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: 4, display: 'block' }}>{errors.password.message}</span>}
                    </div>

                    <div style={{ textAlign: 'right', marginBottom: 18 }}>
                        <Link to="/forgot-password" style={{ fontSize: '0.82rem', color: '#ff9500', fontWeight: 600, textDecoration: 'none' }}>Forgot password?</Link>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            width: '100%', padding: '13px',
                            background: isLoading ? 'rgba(255,102,0,0.5)' : 'linear-gradient(135deg, #ff6600, #ff9500)',
                            border: 'none', borderRadius: 12, color: '#fff',
                            fontWeight: 800, fontSize: '0.95rem', cursor: isLoading ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            boxShadow: '0 8px 25px rgba(255,102,0,0.3)', transition: 'opacity 0.2s'
                        }}
                    >
                        {isLoading ? 'Signing in...' : <><FiArrowRight size={16} /> Sign In</>}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: 22, fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)' }}>
                    No account?{' '}
                    <Link to="/register" style={{ color: '#ff9500', fontWeight: 700, textDecoration: 'none' }}>Create one free</Link>
                </p>
            </motion.div>
        </div>
    )
}
