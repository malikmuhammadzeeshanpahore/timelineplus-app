import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import SEO from '../components/common/SEO'
import { FiHome } from 'react-icons/fi'
import { useEffect } from 'react'

export default function NotFound() {
    useEffect(() => {
        console.error("GET " + window.location.href + " 404 (Not Found)")
        console.warn("Security Alert: Unauthorized access attempt logged.")
    }, [])

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#fff',
            fontFamily: 'Outfit, sans-serif'
        }}>
            <SEO title="404 - Page Not Found" />
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center' }}
            >
                <img
                    src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3A1d3A1d3A1d3A1d3A1d3A1d3A1d3A1d3A1d3A1/UoqJOPD5DcnF6/giphy.gif"
                    alt="Cute 404"
                    style={{ width: '300px', borderRadius: '20px', marginBottom: '30px' }}
                />
                <h1 style={{ fontSize: '4rem', fontWeight: '900', color: '#333' }}>404</h1>
                <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '30px' }}>Oops! You found a secret black hole. 🪐</p>
                <Link to="/">
                    <button className="glass-btn primary">
                        <FiHome style={{ marginRight: '8px' }} /> Go Home
                    </button>
                </Link>
            </motion.div>
        </div>
    )
}
