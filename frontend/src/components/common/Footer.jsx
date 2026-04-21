
import React from 'react'
import { Link } from 'react-router-dom'
import { FiInstagram, FiFacebook, FiYoutube, FiTwitter, FiMail, FiMapPin } from 'react-icons/fi'

export default function Footer() {
    return (
        <footer style={{ background: '#000', color: '#fff', paddingTop: '60px', paddingBottom: '30px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>

                {/* Brand Column */}
                <div>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', color: '#ffffff', background: 'none', WebkitTextFillColor: '#ffffff', textShadow: '0 0 10px rgba(0,0,0,0.5)' }}>TimelinePlus</h2>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'rgba(255,255,255,0.8)' }}>
                        The #1 Platform for Real Social Engagement. Connect, Earn, and Grow with verified human interactions.
                    </p>
                    <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                        <a href="#" style={{ color: 'rgba(255,255,255,0.7)' }} className="hover-white"><FiFacebook /></a>
                        <a href="#" style={{ color: 'rgba(255,255,255,0.7)' }} className="hover-white"><FiInstagram /></a>
                        <a href="#" style={{ color: 'rgba(255,255,255,0.7)' }} className="hover-white"><FiYoutube /></a>
                        <a href="#" style={{ color: 'rgba(255,255,255,0.7)' }} className="hover-white"><FiTwitter /></a>
                    </div>
                </div>

                {/* Company Links */}
                <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#ffffff', background: 'none', WebkitTextFillColor: '#ffffff' }}>Company</h3>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <li><Link to="/about" style={{ color: 'rgba(255,255,255,0.7)' }} className="hover-white">About Us</Link></li>
                        <li><Link to="/contact" style={{ color: 'rgba(255,255,255,0.7)' }} className="hover-white">Contact Us</Link></li>
                        <li><Link to="/faq" style={{ color: 'rgba(255,255,255,0.7)' }} className="hover-white">FAQ</Link></li>
                        <li><Link to="/services" style={{ color: 'rgba(255,255,255,0.7)' }} className="hover-white">Services</Link></li>
                        <li><Link to="/blog" style={{ color: 'rgba(255,255,255,0.7)' }} className="hover-white">Blog</Link></li>
                        <li><Link to="/jobs" style={{ color: 'rgba(255,255,255,0.7)' }} className="hover-white">For Freelancers</Link></li>
                        <li><Link to="/hiring" style={{ color: '#ff6600', fontWeight: 'bold' }}>We Are Hiring!</Link></li>
                    </ul>
                </div>

                {/* Legal Links */}
                <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#ffffff', background: 'none', WebkitTextFillColor: '#ffffff' }}>Legal</h3>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <li><Link to="/privacy-policy" style={{ color: 'rgba(255,255,255,0.7)' }} className="hover-white">Privacy Policy</Link></li>
                        <li><Link to="/terms" style={{ color: 'rgba(255,255,255,0.7)' }} className="hover-white">Terms & Conditions</Link></li>
                        <li><Link to="/disclaimer" style={{ color: 'rgba(255,255,255,0.7)' }} className="hover-white">Disclaimer</Link></li>
                        <li><Link to="/cookie-policy" style={{ color: 'rgba(255,255,255,0.7)' }} className="hover-white">Cookie Policy</Link></li>
                        <li><Link to="/refund-policy" style={{ color: 'rgba(255,255,255,0.7)' }} className="hover-white">Refund Policy</Link></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#ffffff', background: 'none', WebkitTextFillColor: '#ffffff' }}>Contact</h3>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <li style={{ display: 'flex', gap: '10px', alignItems: 'center', color: 'rgba(255,255,255,0.7)' }}>
                            <FiMail />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <a href="mailto:support@timelineplus.site" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }} className="hover-white">support@timelineplus.site</a>
                                <a href="mailto:malikmuhammadzeeshanpahore@gmail.com" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.85rem' }} className="hover-white">malikmuhammadzeeshanpahore@gmail.com</a>
                            </div>
                        </li>
                        <li style={{ display: 'flex', gap: '10px', alignItems: 'center', color: 'rgba(255,255,255,0.7)' }}>
                            <FiMapPin /> Lahore, Pakistan
                        </li>
                    </ul>
                </div>
            </div>

            <div className="container" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '40px', paddingTop: '20px', textAlign: 'center', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
                <p>&copy; {new Date().getFullYear()} TimelinePlus. All rights reserved.</p>
            </div>
        </footer>
    )
}
