import { motion } from 'framer-motion'
import SEO from '../../components/common/SEO'
import HomeNavbar from '../../components/common/HomeNavbar'

export default function RefundPolicy() {
    return (
        <div style={{ minHeight: '100vh', background: '#f7f9fc', color: '#18181b' }}>
            <SEO
                title="Refund Policy - Advertising Returns"
                description="Review our refund policy for advertising campaigns and deposits on TimelinePlus. Transparent rules for buyers and sellers."
            />
            <HomeNavbar />
            <div className="container" style={{ padding: '120px 20px 60px', maxWidth: '900px' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '40px' }}>Refund Policy</h1>

                    <div style={{ background: '#fff', padding: '50px', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                        <p style={{ marginBottom: '40px', color: '#52525b' }}>Last Updated: {new Date().toLocaleDateString()}</p>

                        <section style={{ marginBottom: '50px' }}>
                            <h2 style={{ color: '#18181b', marginBottom: '20px', fontSize: '1.5rem' }}>1. General Policy</h2>
                            <p style={{ color: '#52525b', lineHeight: '1.8' }}>
                                Specifically for <strong>Buyers (Advertisers)</strong>: We strive to ensure that all campaigns delivered meet your expectations. However, due to the digital nature of our services, refunds are limited to specific circumstances outlined below.
                            </p>
                        </section>

                        <section style={{ marginBottom: '50px' }}>
                            <h2 style={{ color: '#18181b', marginBottom: '20px', fontSize: '1.5rem' }}>2. Qualifying for a Refund</h2>
                            <p style={{ color: '#52525b', lineHeight: '1.8', marginBottom: '15px' }}>You may be eligible for a refund if:</p>
                            <ul style={{ listStyle: 'disc', paddingLeft: '20px', color: '#52525b', lineHeight: '1.7' }}>
                                <li>The campaign was not started within 72 hours of purchase.</li>
                                <li>The services delivered are materially different from what was described (e.g., incorrect target action).</li>
                                <li>There is a verified technical error preventing the delivery of service.</li>
                                <li>You were charged multiple times for the same transaction due to a payment gateway error.</li>
                            </ul>
                        </section>

                        <section style={{ marginBottom: '50px' }}>
                            <h2 style={{ color: '#18181b', marginBottom: '20px', fontSize: '1.5rem' }}>3. Non-Refundable Items</h2>
                            <p style={{ color: '#52525b', lineHeight: '1.8', marginBottom: '15px' }}>The following are strictly non-refundable:</p>
                            <ul style={{ listStyle: 'disc', paddingLeft: '20px', color: '#52525b', lineHeight: '1.7' }}>
                                <li>Funds deposited into your Wallet that have already been used for active campaigns.</li>
                                <li>Campaigns that have already been completed or are in progress with verifiable delivery metrics.</li>
                                <li>Account upgrades or subscription fees once the period has started.</li>
                                <li>"Change of mind" requests after a campaign has launched.</li>
                            </ul>
                        </section>

                        <section style={{ marginBottom: '50px' }}>
                            <h2 style={{ color: '#18181b', marginBottom: '20px', fontSize: '1.5rem' }}>4. Refund Process</h2>
                            <ol style={{ listStyle: 'decimal', paddingLeft: '20px', color: '#52525b', lineHeight: '1.7' }}>
                                <li>Submit a request to <a href="mailto:support@timelineplus.site" style={{ color: '#ff6600' }}>support@timelineplus.site</a> with your Order ID and issue description.</li>
                                <li>Our team will audit the campaign logs and interaction data within 48-72 hours.</li>
                                <li>If approved, the refund will be credited back to your TimelinePlus Wallet or original payment method (depending on feasibility) within 5 business days.</li>
                            </ol>
                        </section>

                        <section style={{ marginBottom: '50px' }}>
                            <h2 style={{ color: '#18181b', marginBottom: '20px', fontSize: '1.5rem' }}>5. Chargebacks</h2>
                            <p style={{ color: '#52525b', lineHeight: '1.8' }}>
                                You agree to contact us first to resolve any issues before initiating a chargeback with your payment provider. Initiating a baseless chargeback or dispute will result in the immediate and permanent suspension of your account.
                            </p>
                        </section>

                        <section style={{ marginBottom: '40px' }}>
                            <h2 style={{ color: '#18181b', marginBottom: '20px', fontSize: '1.5rem' }}>6. Contact Us</h2>
                            <p style={{ color: '#52525b', lineHeight: '1.8' }}>
                                For any refund-related queries, please contact our support team at <a href="mailto:support@timelineplus.site" style={{ color: '#ff6600', textDecoration: 'none' }}>support@timelineplus.site</a>.
                            </p>
                        </section>

                    </div>
                </motion.div>
            </div>

        </div>
    )
}
