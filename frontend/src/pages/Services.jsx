import HomeNavbar from '../components/common/HomeNavbar'
import SEO from '../components/common/SEO'
import { motion } from 'framer-motion'
import { FiSmartphone, FiTrendingUp, FiShield, FiDollarSign, FiBarChart2, FiGlobe, FiCheckSquare, FiZap, FiTarget, FiUsers } from 'react-icons/fi'

export default function Services() {
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    }

    const freelancerServices = [
        { title: 'Social Engagement', desc: 'Get paid to like, follow, and share content.', icon: <FiSmartphone /> },
        { title: 'Video Reviews', desc: 'Create short video testimonials for brands.', icon: <FiGlobe /> },
        { title: 'Survey Participation', desc: 'Share your opinion and earn rewards.', icon: <FiCheckSquare /> },
        { title: 'App Testing', desc: 'Test new apps and give feedback.', icon: <FiZap /> },
    ]

    const buyerServices = [
        { title: 'Organic Growth', desc: 'Real users, real engagement. No bots.', icon: <FiTrendingUp /> },
        { title: 'Targeted Campaigns', desc: 'Reach specific demographics in Pakistan.', icon: <FiTarget /> },
        { title: 'Detailed Analytics', desc: 'Track every rupee spent with real-time data.', icon: <FiBarChart2 /> },
        { title: 'Brand Safety', desc: '100% verified human traffic.', icon: <FiShield /> },
    ]

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '100px', background: '#f7f9fc', color: '#18181b', overflowX: 'hidden' }}>
            <SEO
                title="Our Services - Social Engagement & Growth"
                description="Discover our range of services for both freelancers and brands. Real human engagement, organic growth, and instant rewards on TimelinePlus."
            />
            <HomeNavbar />

            {/* 1. Hero */}
            <section className="container" style={{ paddingTop: '150px', marginBottom: '80px', textAlign: 'center' }}>
                <motion.h1
                    className="text-gradient"
                    style={{ fontSize: '3.5rem', marginBottom: '20px', fontWeight: 900 }}
                    initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
                >
                    World-Class Services
                </motion.h1>
                <motion.p
                    style={{ fontSize: '1.2rem', color: '#52525b', maxWidth: '700px', margin: '0 auto' }}
                    initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
                >
                    Comprehensive solutions for digital earners and ambitious brands.
                </motion.p>
            </section>

            {/* 2. For Freelancers */}
            <section className="container" style={{ marginBottom: '100px' }}>
                <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '15px', color: '#18181b' }}>For Freelancers</h2>
                    <p style={{ color: '#52525b' }}>Monetize your free time with simple tasks.</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '30px' }}>
                    {freelancerServices.map((s, i) => (
                        <motion.div key={i} className="glass-card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} style={{ borderColor: 'rgba(18, 209, 198, 0.2)', background: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                            <div style={{ fontSize: '2.5rem', color: '#12d1c6', marginBottom: '15px' }}>{s.icon}</div>
                            <h3 className="heading" style={{ color: '#18181b' }}>{s.title}</h3>
                            <p style={{ color: '#52525b' }}>{s.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* 3. For Buyers */}
            <section className="container" style={{ marginBottom: '100px' }}>
                <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '15px', color: '#18181b' }}>For Advertisers</h2>
                    <p style={{ color: '#52525b' }}>Grow your digital presence with real engagement.</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '30px' }}>
                    {buyerServices.map((s, i) => (
                        <motion.div key={i} className="glass-card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} style={{ borderColor: 'rgba(239, 68, 68, 0.2)', background: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                            <div style={{ fontSize: '2.5rem', color: '#ef4444', marginBottom: '15px' }}>{s.icon}</div>
                            <h3 className="heading" style={{ color: '#18181b' }}>{s.title}</h3>
                            <p style={{ color: '#52525b' }}>{s.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* NEW SECTION 1: Features Comparison */}
            <section className="container" style={{ marginBottom: '100px' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '40px', color: '#18181b', textAlign: 'center' }}>Why Choose Us?</h2>
                <div className="glass-card" style={{ padding: '0', overflow: 'hidden', background: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: '#18181b' }}>
                        <thead style={{ background: '#f8fafc' }}>
                            <tr>
                                <th style={{ padding: '20px', textAlign: 'left' }}>Feature</th>
                                <th style={{ padding: '20px', textAlign: 'center', color: '#ff6600' }}>TimelinePlus</th>
                                <th style={{ padding: '20px', textAlign: 'center', color: '#52525b' }}>Others</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { f: 'Payout Speed', u: 'Instant', o: '30 Days' },
                                { f: 'User Quality', u: '100% Real Humans', o: 'Bots / Fakes' },
                                { f: 'Min Withdrawal', u: '$100', o: '$2000+' },
                                { f: 'Support', u: '24/7 Live Chat', o: 'Email Only' },
                            ].map((row, i) => (
                                <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '20px' }}>{row.f}</td>
                                    <td style={{ padding: '20px', textAlign: 'center', fontWeight: 'bold' }}>{row.u}</td>
                                    <td style={{ padding: '20px', textAlign: 'center', color: '#71717a' }}>{row.o}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* 4. How It Works */}
            <section className="container" style={{ marginBottom: '100px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '40px', color: '#18181b' }}>How It Works</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px' }}>
                    {[
                        { step: 1, title: "Register", desc: "Create your free account in 30 seconds." },
                        { step: 2, title: "Act", desc: "Perform simple social tasks or post your ad." },
                        { step: 3, title: "Earn/Grow", desc: "Get paid instantly or watch your followers grow." }
                    ].map(item => (
                        <motion.div key={item.step} className="glass-card" style={{ alignItems: 'center', background: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(45deg, #ff6600, #ff8e53)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px', color: 'white' }}>{item.step}</div>
                            <h3 className="heading" style={{ color: '#18181b' }}>{item.title}</h3>
                            <p style={{ color: '#52525b' }}>{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* NEW SECTION 2: Affiliate Program */}
            <section className="container" style={{ marginBottom: '100px' }}>
                <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(255,102,0,0.05), rgba(255,255,255,1))', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: '40px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <div style={{ fontSize: '3rem', color: '#ff6600', marginBottom: '20px' }}><FiUsers /></div>
                        <h2 className="heading" style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#18181b' }}>Affiliate Program</h2>
                        <p style={{ fontSize: '1.1rem', color: '#52525b', marginBottom: '20px' }}>
                            Earn passive income by inviting friends!
                        </p>
                        <ul style={{ listStyle: 'none', color: '#52525b' }}>
                            <li style={{ marginBottom: '10px' }}>✓ <strong>10% Commission</strong> on every task they complete.</li>
                            <li style={{ marginBottom: '10px' }}>✓ <strong>5% Bonus</strong> on their first deposit.</li>
                            <li>✓ Lifetime earnings tracking.</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* 5. Verification System */}
            <section className="container" style={{ marginBottom: '100px', display: 'flex', gap: '40px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <h2 className="text-gradient" style={{ fontSize: '3rem', fontWeight: 900 }}>AI Verified.</h2>
                    <p style={{ fontSize: '1.2rem', color: '#52525b', marginTop: '20px' }}>
                        Our proprietary AI analyzes every screenshot and interaction to ensure compliance. No fakes, no fraud.
                    </p>
                    <ul style={{ marginTop: '20px', listStyle: 'none' }}>
                        <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px', color: '#18181b' }}><FiCheckSquare style={{ color: '#10b981' }} /> Image Recognition</li>
                        <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px', color: '#18181b' }}><FiCheckSquare style={{ color: '#10b981' }} /> Timestamp Analysis</li>
                    </ul>
                </div>
                <motion.div className="glass-card" style={{ flex: 1, height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }} initial={{ rotate: 5 }} whileInView={{ rotate: 0 }}>
                    <FiShield style={{ fontSize: '8rem', color: '#f1f5f9' }} />
                    <div style={{ position: 'absolute', fontWeight: 900, fontSize: '2rem', color: '#e4e4e7' }}>SECURE</div>
                </motion.div>
            </section>

            {/* NEW SECTION 3: API Integration for Developers */}
            <section className="container" style={{ marginBottom: '100px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#18181b' }}>Developer API</h2>
                <p style={{ color: '#52525b', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
                    Automate your campaigns. Integrate TimelinePlus directly into your SMM panel or application.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                    <div className="glass-card" style={{ textAlign: 'left', background: '#fff', border: '1px solid #e4e4e7' }}>
                        <code style={{ color: '#10b981' }}>POST /api/v1/orders</code>
                        <p style={{ fontSize: '0.8rem', marginTop: '10px', color: '#71717a' }}>Create new campaigns programmatically.</p>
                    </div>
                </div>
            </section>

            {/* 6. Instant Payouts */}
            <section className="container" style={{ marginBottom: '100px' }}>
                <div className="glass-card" style={{ background: 'linear-gradient(90deg, #10b98110, #ffffff)', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '50px', flexWrap: 'wrap', gap: '20px', border: '1px solid #10b98120' }}>
                    <div>
                        <h2 className="heading" style={{ fontSize: '2.5rem', color: '#18181b' }}><FiDollarSign style={{ verticalAlign: 'middle' }} /> Instant Payouts</h2>
                        <p style={{ color: '#52525b' }}>Withdraw via JazzCash, EasyPaisa, or Bank Transfer instantly.</p>
                    </div>
                    <button className="glass-btn secondary">View Payment Proofs</button>
                </div>
            </section>

            {/* NEW SECTION 4: Testimonials/Success Stories */}
            <section className="container" style={{ marginBottom: '100px' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '40px', color: '#18181b', textAlign: 'center' }}>Success Stories</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px' }}>
                    {[
                        { name: "Ali K.", role: "Influencer", text: "Grew my channel from 0 to 10k subs in a month!" },
                        { name: "Sarah M.", role: "Freelancer", text: "I pay my internet bills just by liking posts here. Amazing!" },
                        { name: "BrandX", role: "Agency", text: "Best ROI for organic engagement in Pakistan." }
                    ].map((t, i) => (
                        <div key={i} className="glass-card" style={{ background: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                            <p style={{ fontStyle: 'italic', marginBottom: '15px', color: '#52525b' }}>"{t.text}"</p>
                            <h4 style={{ color: '#18181b' }}>{t.name}</h4>
                            <span style={{ fontSize: '0.8rem', color: '#ff6600' }}>{t.role}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* 7. Campaign Analytics (New Section 5 - Enhanced) */}
            <section className="container" style={{ marginBottom: '100px', textAlign: 'center' }}>
                <h2 style={{ marginBottom: '30px', color: '#18181b' }}>Real-Time Data</h2>
                <div className="glass-card" style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #e4e4e7', background: '#f8fafc' }}>
                    <div>
                        <FiBarChart2 style={{ fontSize: '4rem', color: '#a1a1aa', marginBottom: '20px' }} />
                        <p style={{ color: '#71717a' }}>Interactive Analytics Dashboard</p>
                    </div>
                </div>
            </section>

            {/* 8. CTA */}
            <section className="container" style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '3rem', marginBottom: '20px', color: '#18181b' }}>Start Today</h2>
                <p style={{ marginBottom: '40px', fontSize: '1.2rem', color: '#52525b' }}>Join the platform that pays you to be social.</p>
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button className="glass-btn secondary">I'm a Freelancer</button>
                    <button className="glass-btn" style={{ background: '#18181b', color: '#fff' }}>I'm a Brand</button>
                </div>
            </section>
        </div>
    )
}
