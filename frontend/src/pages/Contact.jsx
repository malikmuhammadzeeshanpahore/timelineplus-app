import HomeNavbar from '../components/common/HomeNavbar'
import SEO from '../components/common/SEO'
import { motion } from 'framer-motion'
import { FiMail, FiPhone, FiMapPin, FiMessageSquare, FiTwitter, FiInstagram, FiLinkedin, FiHelpCircle, FiGlobe } from 'react-icons/fi'
import { useForm } from 'react-hook-form'
import { useToastStore } from '../context/useToastStore'

export default function Contact() {
    const { register, handleSubmit } = useForm()
    const { addToast } = useToastStore()

    const onSubmit = async (data) => {
        try {
            const res = await fetch('https://timelineplus.site/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            const result = await res.json()
            if (res.ok) {
                addToast('success', 'Message sent! We will reply shortly.')
            } else {
                addToast('error', result.error || 'Failed to send')
            }
        } catch (e) {
            addToast('error', 'Network error')
        }
    }

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    }

    const quickContacts = [
        {
            title: 'Email Us',
            info: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <a href="mailto:support@timelineplus.site" style={{ color: 'inherit', textDecoration: 'none' }}>support@timelineplus.site</a>
                    <a href="mailto:malikmuhammadzeeshanpahore@gmail.com" style={{ color: 'inherit', textDecoration: 'none', fontSize: '0.85rem' }}>malikmuhammadzeeshanpahore@gmail.com</a>
                </div>
            ),
            icon: <FiMail />
        },
        { title: 'Call Us', info: '+92 300 1234567', icon: <FiPhone /> },
        { title: 'Visit Us', info: 'Office 12, Tech Hub, Lahore, Pakistan', icon: <FiMapPin /> },
    ]

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '100px', overflowX: 'hidden' }}>
            <SEO
                title="Contact Us - Support & Feedback"
                description="Have questions or need help? Contact the TimelinePlus support team via email, phone, or live chat. We are here to assist you 24/7."
            />
            <HomeNavbar />

            {/* 1. Hero */}
            <section className="container" style={{ paddingTop: '150px', marginBottom: '80px', textAlign: 'center' }}>
                <motion.h1
                    className="text-gradient"
                    style={{ fontSize: '3.5rem', marginBottom: '20px', fontWeight: 900 }}
                    initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
                >
                    Let's Talk
                </motion.h1>
                <motion.p
                    className="text-muted"
                    style={{ fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}
                    initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
                >
                    Have questions about your earnings or campaign? We're here to help.
                </motion.p>
            </section>

            {/* 2. Quick Contact Grid */}
            <section className="container" style={{ marginBottom: '80px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
                    {quickContacts.map((c, i) => (
                        <motion.div key={i} className="glass-card" style={{ alignItems: 'center', textAlign: 'center' }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '15px', color: '#FF6600' }}>{c.icon}</div>
                            <h3 className="heading">{c.title}</h3>
                            <p className="text-muted">{c.info}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* 3. Contact Form */}
            <section className="container" style={{ marginBottom: '80px' }}>
                <motion.div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto' }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                    <h2 className="heading" style={{ marginBottom: '30px', textAlign: 'center' }}>Send a Message</h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="glass-input-group">
                                <label>Name</label>
                                <input {...register("name")} className="glass-input" placeholder="Your Name" />
                            </div>
                            <div className="glass-input-group">
                                <label>Email</label>
                                <input {...register("email")} className="glass-input" placeholder="you@email.com" />
                            </div>
                        </div>
                        <div className="glass-input-group">
                            <label>Subject</label>
                            <input {...register("subject")} className="glass-input" placeholder="How can we help?" />
                        </div>
                        <div className="glass-input-group">
                            <label>Message</label>
                            <textarea {...register("message")} className="glass-input" rows="5" placeholder="Details..." style={{ fontFamily: 'inherit' }}></textarea>
                        </div>
                        <button className="glass-btn secondary w-full">Send Message</button>
                    </form>
                </motion.div>
            </section>

            {/* 4. Global Presence (Map Placeholder) */}
            <section className="container" style={{ marginBottom: '80px', textAlign: 'center' }}>
                <h2 style={{ marginBottom: '20px' }}>Global Reach</h2>
                <motion.div className="glass-card" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                    <FiGlobe style={{ fontSize: '8rem', color: 'rgba(0,0,0,0.05)' }} />
                    <p style={{ position: 'absolute', color: 'rgba(0,0,0,0.5)' }}>Interactive Map Coming Soon</p>
                </motion.div>
            </section>

            {/* 5. Social Media */}
            <section className="container" style={{ marginBottom: '80px', textAlign: 'center' }}>
                <h2 style={{ marginBottom: '40px' }}>Follow Us</h2>
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                    {[<FiTwitter />, <FiInstagram />, <FiLinkedin />].map((icon, i) => (
                        <motion.button key={i} className="glass-btn secondary" style={{ padding: '20px', fontSize: '2rem' }} whileHover={{ scale: 1.1 }}>
                            {icon}
                        </motion.button>
                    ))}
                </div>
            </section>

            {/* 6. FAQ */}
            <section className="container" style={{ marginBottom: '80px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Common Questions</h2>
                <div style={{ display: 'grid', gap: '20px', maxWidth: '800px', margin: '0 auto' }}>
                    {[
                        { q: 'How do I withdraw?', a: 'Via JazzCash or EasyPaisa instantly.' },
                        { q: 'Is it free to join?', a: 'Yes, absolutely free for freelancers.' },
                        { q: 'How long does verification take?', a: 'Usually less than 24 hours.' }
                    ].map((faq, i) => (
                        <motion.div key={i} className="glass-card" style={{ padding: '20px' }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                            <h3 className="heading" style={{ fontSize: '1.2rem', marginBottom: '10px' }}><FiHelpCircle style={{ marginRight: '10px' }} /> {faq.q}</h3>
                            <p className="text-muted">{faq.a}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* 7. Live Chat */}
            <section className="container" style={{ marginBottom: '80px' }}>
                <div className="glass-card" style={{ background: 'linear-gradient(45deg, rgba(16, 185, 129, 0.1), rgba(0,0,0,0.05))', textAlign: 'center' }}>
                    <FiMessageSquare style={{ fontSize: '3rem', marginBottom: '20px', color: '#10b981' }} />
                    <h2 className="heading">Need Instant Help?</h2>
                    <p style={{ marginBottom: '20px' }}>Chat with our support team live (9AM - 9PM)</p>
                    <button className="glass-btn">Start Chat</button>
                </div>
            </section>

            {/* 8. CTA */}
            <section className="container" style={{ textAlign: 'center' }}>
                <p className="text-muted">Still have questions?</p>
                <h2 style={{ fontSize: '2rem', marginTop: '10px' }}>We are always here.</h2>
            </section>
        </div>
    )
}
