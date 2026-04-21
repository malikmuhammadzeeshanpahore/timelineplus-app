import { motion } from 'framer-motion'
import SEO from '../../components/common/SEO'
import HomeNavbar from '../../components/common/HomeNavbar'

export default function Terms() {
    return (
        <div style={{ minHeight: '100vh', background: '#f7f9fc', color: '#18181b' }}>
            <SEO
                title="Terms & Conditions - User Agreement"
                description="Review the terms and conditions for using TimelinePlus. Guidelines for freelancers, advertisers, and community conduct."
            />
            <HomeNavbar />
            <div className="container" style={{ padding: '120px 20px 60px', maxWidth: '900px' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '40px' }}>Terms & Conditions</h1>

                    <div style={{ background: '#fff', padding: '50px', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                        <p style={{ marginBottom: '40px', color: '#52525b' }}>Last Updated: {new Date().toLocaleDateString()}</p>

                        <section style={{ marginBottom: '50px' }}>
                            <h2 style={{ color: '#18181b', marginBottom: '20px', fontSize: '1.5rem' }}>1. Agreement to Terms</h2>
                            <p style={{ color: '#52525b', lineHeight: '1.8' }}>
                                By accessing or using TimelinePlus, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access the service.
                                These Terms apply to all visitors, users, and others who access or use the Service.
                            </p>
                        </section>

                        <section style={{ marginBottom: '50px' }}>
                            <h2 style={{ color: '#18181b', marginBottom: '20px', fontSize: '1.5rem' }}>2. User Accounts</h2>
                            <ul style={{ listStyle: 'disc', paddingLeft: '20px', color: '#52525b', lineHeight: '1.7' }}>
                                <li>You must be at least 13 years of age to use this Service. (18+ for financial transactions).</li>
                                <li>You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.</li>
                                <li>You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</li>
                                <li>We reserve the right to suspend or terminate your account if you violate our policies (e.g., using bots, fake accounts, multiple accounts).</li>
                            </ul>
                        </section>

                        <section style={{ marginBottom: '50px' }}>
                            <h2 style={{ color: '#18181b', marginBottom: '20px', fontSize: '1.5rem' }}>3. Earning & Freelancing Rules</h2>
                            <p style={{ color: '#52525b', lineHeight: '1.8', marginBottom: '15px' }}>
                                <strong>For Freelancers:</strong> You agree to provide genuine engagement (likes, follows, views) as requested by the Buyer.
                            </p>
                            <ul style={{ listStyle: 'disc', paddingLeft: '20px', color: '#52525b', lineHeight: '1.7' }}>
                                <li>Do not "Unfollow" or "Unlike" a page after receiving payment. This is considered fraud and will result in an immediate permanent ban.</li>
                                <li>Do not use automation software, bots, macros, or scripts to complete tasks. All interactions must be manual and human.</li>
                                <li>Multiple accounts by a single user are strictly prohibited. One person, one account.</li>
                                <li>You must maintain the quality of your social media accounts. Accounts with no profile picture or fake activity may be disqualified.</li>
                            </ul>
                        </section>

                        <section style={{ marginBottom: '50px' }}>
                            <h2 style={{ color: '#18181b', marginBottom: '20px', fontSize: '1.5rem' }}>4. Campaigns & Payments</h2>
                            <p style={{ color: '#52525b', lineHeight: '1.8', marginBottom: '15px' }}>
                                <strong>For Buyers:</strong>
                            </p>
                            <ul style={{ listStyle: 'disc', paddingLeft: '20px', color: '#52525b', lineHeight: '1.7' }}>
                                <li>Campaigns must not contain illegal, adult, hateful, or misleading content.</li>
                                <li>Refunds are processed according to our Refund Policy. All deposits are final unless a technical error occurs.</li>
                                <li>We do not guarantee sales or leads, only the engagement metrics (views, likes, follows) specified in the campaign.</li>
                                <li>We confirm that all traffic is from real human users. However, user retention is dependent on your content quality.</li>
                            </ul>
                        </section>

                        <section style={{ marginBottom: '50px' }}>
                            <h2 style={{ color: '#18181b', marginBottom: '20px', fontSize: '1.5rem' }}>5. Intellectual Property</h2>
                            <p style={{ color: '#52525b', lineHeight: '1.8' }}>
                                The Service and its original content (excluding Content provided by users), features, and functionality are and will remain the exclusive property of TimelinePlus and its licensors.
                                The Service is protected by copyright, trademark, and other laws of Pakistan and foreign countries.
                                Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of TimelinePlus.
                            </p>
                        </section>

                        <section style={{ marginBottom: '50px' }}>
                            <h2 style={{ color: '#18181b', marginBottom: '20px', fontSize: '1.5rem' }}>6. User Generated Content</h2>
                            <p style={{ color: '#52525b', lineHeight: '1.8' }}>
                                Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content").
                                You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness.
                                By posting Content to the Service, you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through the Service.
                            </p>
                        </section>

                        <section style={{ marginBottom: '50px' }}>
                            <h2 style={{ color: '#18181b', marginBottom: '20px', fontSize: '1.5rem' }}>7. Prohibited Uses</h2>
                            <p style={{ color: '#52525b', lineHeight: '1.8', marginBottom: '15px' }}>
                                You may use the Service only for lawful purposes in accordance with Terms. You agree not to use the Service:
                            </p>
                            <ul style={{ listStyle: 'disc', paddingLeft: '20px', color: '#52525b', lineHeight: '1.7' }}>
                                <li>In any way that violates any applicable national or international law or regulation.</li>
                                <li>For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way by exposing them to inappropriate content.</li>
                                <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail", "chain letter," "spam," or any other similar solicitation.</li>
                                <li>To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity.</li>
                            </ul>
                        </section>

                        <section style={{ marginBottom: '50px' }}>
                            <h2 style={{ color: '#18181b', marginBottom: '20px', fontSize: '1.5rem' }}>8. Third-Party Links & Services</h2>
                            <p style={{ color: '#52525b', lineHeight: '1.8' }}>
                                Our Service may contain links to third-party web sites or services (e.g., YouTube, Facebook) that are not owned or controlled by TimelinePlus.
                                We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third party web sites or services.
                                You acknowledge and agree that TimelinePlus shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods or services available on or through any such web sites or services.
                            </p>
                        </section>

                        <section style={{ marginBottom: '50px' }}>
                            <h2 style={{ color: '#18181b', marginBottom: '20px', fontSize: '1.5rem' }}>9. Indemnification</h2>
                            <p style={{ color: '#52525b', lineHeight: '1.8' }}>
                                You agree to defend, indemnify, and hold harmless TimelinePlus and its licensee and licensors, and their employees, contractors, agents, officers, and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees), resulting from or arising out of a) your use and access of the Service, by you or any person using your account and password; b) a breach of these Terms, or c) Content posted on the Service.
                            </p>
                        </section>

                        <section style={{ marginBottom: '50px' }}>
                            <h2 style={{ color: '#18181b', marginBottom: '20px', fontSize: '1.5rem' }}>10. Limitation of Liability</h2>
                            <p style={{ color: '#52525b', lineHeight: '1.8' }}>
                                In no event shall TimelinePlus, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage.
                            </p>
                        </section>

                        <section style={{ marginBottom: '50px' }}>
                            <h2 style={{ color: '#18181b', marginBottom: '20px', fontSize: '1.5rem' }}>11. Governing Law</h2>
                            <p style={{ color: '#52525b', lineHeight: '1.8' }}>
                                These Terms shall be governed and construed in accordance with the laws of Pakistan, without regard to its conflict of law provisions.
                                Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
                            </p>
                        </section>

                        <section style={{ marginBottom: '50px' }}>
                            <h2 style={{ color: '#18181b', marginBottom: '20px', fontSize: '1.5rem' }}>12. Changes to Terms</h2>
                            <p style={{ color: '#52525b', lineHeight: '1.8' }}>
                                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                                By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
                            </p>
                        </section>

                        <section style={{ marginBottom: '40px' }}>
                            <h2 style={{ color: '#18181b', marginBottom: '20px', fontSize: '1.5rem' }}>13. Contact Us</h2>
                            <p style={{ color: '#52525b', lineHeight: '1.8' }}>If you have any questions about these Terms, please contact us at <a href="mailto:support@timelineplus.site" style={{ color: '#ff6600', textDecoration: 'none' }}>support@timelineplus.site</a>.</p>
                        </section>

                    </div>
                </motion.div>
            </div>

        </div>
    )
}
