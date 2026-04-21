import { useToastStore } from '../../context/useToastStore'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCheckCircle, FiInfo, FiAlertCircle, FiX } from 'react-icons/fi'

const toastIcons = {
    success: <FiCheckCircle style={{ color: '#10b981' }} />,
    info: <FiInfo style={{ color: '#3b82f6' }} />,
    error: <FiAlertCircle style={{ color: '#ef4444' }} />,
}

export default function ToastContainer() {
    const { toasts, removeToast } = useToastStore()

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            pointerEvents: 'none' // Allow clicks through container
        }}>
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.9 }}
                        style={{
                            pointerEvents: 'auto',
                            minWidth: '300px',
                            padding: '16px',
                            borderRadius: '12px',
                            background: 'rgba(20, 20, 20, 0.95)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '15px',
                            color: 'white'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ fontSize: '1.2rem' }}>{toastIcons[toast.type]}</div>
                            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{toast.message}</span>
                        </div>
                        <button onClick={() => removeToast(toast.id)} style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.1rem' }}>
                            <FiX />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}
