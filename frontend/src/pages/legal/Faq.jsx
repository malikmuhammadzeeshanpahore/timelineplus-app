
import { motion, AnimatePresence } from 'framer-motion'
import SEO from '../../components/common/SEO'
import HomeNavbar from '../../components/common/HomeNavbar'
import Footer from '../../components/common/Footer'
import { FiHelpCircle, FiChevronDown, FiChevronUp } from 'react-icons/fi'

export default function Faq() {
    const [openIndex, setOpenIndex] = React.useState(null)

    const toggle = (i) => setOpenIndex(openIndex === i ? null : i)

    const faqs = [
        {
            q: "How do I earn money on TimelinePlus?",
            a: "You earn by completing simple social media tasks like following a page, liking a post, or subscribing to a YouTube channel. Each task has a set price in USD which is instantly added to your wallet."
        },
        {
            q: "Is it free to join?",
            a: "Yes! Signing up as a Freelancer is 100% free. You can start earning immediately without any investment."
        },
        {
            q: "How do I withdraw my earnings?",
            a: "We support instant withdrawals to JazzCash and EasyPaisa. The minimum withdrawal limit is $100."
        },
        {
            q: "Are the likes and followers real?",
            a: "Yes. Every interaction on TimelinePlus comes from a real human user (our freelancer community). We do not use bots."
        },
        {
            q: "Why do you need my Google/Facebook account?",
            a: "We use OAuth to verify that you actually completed the task (e.g., we check if you really subscribed to a channel). We do NOT store your passwords or access your private messages."
        },
        {
            q: "Can I use multiple accounts?",
            a: "No. Creating multiple accounts to defraud the system will result in a permanent ban and forfeiture of earnings."
        },
        {
            q: "I am a Buyer. What if my followers drop?",
            a: "We have a strictly enforced policy against unfollowing. If a freelancer unfollows you, they are penalized. If drops occur, contact support for a refill."
        },
        {
            q: "Is my data safe?",
            a: "Absolutely. We comply with GDPR and relevant data protection laws. Your data is encrypted and never sold to third parties."
        }
    ]

    return (
        <div style={{ minHeight: '100vh', background: '#f7f9fc', color: '#18181b' }}>
            <SEO
                title="FAQ - Frequently Asked Questions"
                description="Find answers to common questions about earning money, withdrawals, account safety, and advertising on TimelinePlus."
            />
            <HomeNavbar />
            <div className="container" style={{ padding: '120px 20px 60px', maxWidth: '800px' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '40px', textAlign: 'center' }}>Frequently Asked Questions</h1>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {faqs.map((item, i) => (
                            <motion.div
                                key={i}
                                className="glass-card"
                                style={{ padding: '20px', cursor: 'pointer', background: openIndex === i ? 'rgba(255,102,0,0.05)' : '#fff', border: openIndex === i ? '1px solid rgba(255,102,0,0.3)' : '1px solid rgba(0,0,0,0.05)', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                                onClick={() => toggle(i)}
                                whileHover={{ scale: 1.01 }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ fontSize: '1.1rem', margin: 0, display: 'flex', alignItems: 'center', color: openIndex === i ? '#ff6600' : '#18181b' }}>
                                        <FiHelpCircle style={{ marginRight: '10px', color: '#ff6600' }} /> {item.q}
                                    </h3>
                                    {openIndex === i ? <FiChevronUp color="#52525b" /> : <FiChevronDown color="#52525b" />}
                                </div>
                                {openIndex === i && (
                                    <motion.p
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="text-muted"
                                        style={{ marginTop: '15px', paddingLeft: '26px', lineHeight: '1.6', color: '#52525b' }}
                                    >
                                        {item.a}
                                    </motion.p>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '60px' }}>
                        <p className="text-muted" style={{ color: '#52525b' }}>Still have questions?</p>
                        <a href="/contact" className="glass-btn secondary" style={{ marginTop: '10px', display: 'inline-block', background: 'linear-gradient(135deg, #ff6600 0%, #ff8e53 100%)', color: '#fff' }}>Contact Support</a>
                    </div>

                </motion.div>
            </div>
        </div>
    )
}
