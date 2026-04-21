import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import SEO from '../../components/common/SEO'
import { FiMail, FiArrowLeft } from 'react-icons/fi'

export default function ForgotPassword() {
    const { register, handleSubmit, formState: { errors } } = useForm()

    const onSubmit = (data) => {
        alert(`Reset link sent to ${data.email} (Demo)`)
    }

    return (
        <div className="flex-center" style={{ minHeight: '100vh' }}>
            <SEO
                title="Forgot Password - Account Recovery"
                description="Recover your TimelinePlus account. Enter your email address and we'll send you a link to reset your password and regain access to your dashboard."
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card"
                style={{ width: '100%', maxWidth: '400px', padding: '40px' }}
            >
                <h2 style={{ fontSize: '1.8rem', marginBottom: '10px', textAlign: 'center' }}>Reset Password</h2>
                <p style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginBottom: '30px' }}>
                    Enter your email to receive a recovery link.
                </p>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="glass-input-group">
                        <label>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <FiMail style={{ position: 'absolute', left: '15px', top: '14px', color: 'rgba(255,255,255,0.5)' }} />
                            <input
                                {...register("email", { required: "Email is required" })}
                                className="glass-input"
                                style={{ paddingLeft: '45px' }}
                                placeholder="you@example.com"
                            />
                        </div>
                        {errors.email && <span className="text-secondary" style={{ fontSize: '0.8rem' }}>{errors.email.message}</span>}
                    </div>

                    <button
                        type="submit"
                        className="glass-btn w-full"
                        style={{ justifyContent: 'center', marginTop: '10px' }}
                    >
                        Send Reset Link
                    </button>
                </form>

                <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
                    <Link to="/login" className="text-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        <FiArrowLeft /> Back to Login
                    </Link>
                </p>
            </motion.div>
        </div>
    )
}
