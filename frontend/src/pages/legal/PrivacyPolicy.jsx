import { motion } from 'framer-motion'
import SEO from '../../components/common/SEO'
import HomeNavbar from '../../components/common/HomeNavbar'

export default function PrivacyPolicy() {
    return (
        <div style={{ minHeight: '100vh', background: '#f7f9fc', color: '#18181b' }}>
            <SEO
                title="Privacy Policy - Your Data Safety"
                description="Read the TimelinePlus Privacy Policy to understand how we collect, use, and protect your personal information and social media data."
            />
            <HomeNavbar />
            <div className="container" style={{ padding: '120px 20px 60px', maxWidth: '900px' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '40px' }}>Privacy Policy</h1>

                    <div style={{ background: '#fff', padding: '50px', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                        <p style={{ marginBottom: '40px', color: '#52525b' }}>Last Updated: {new Date().toLocaleDateString()}</p>

                        <section style={{ marginBottom: '50px' }}>
                            <h2 style={{ color: '#18181b', marginBottom: '20px', fontSize: '1.5rem' }}>1. Introduction</h2>
                            <p style={{ color: '#52525b', lineHeight: '1.8' }}>
                                Welcome to TimelinePlus ("we," "our," or "us"). We are strongly committed to protecting your personal information and your right to privacy.
                                This Privacy Policy explains how we collect, use, disclosure, and safeguard your information when you visit our website
                                <span style={{ color: '#18181b', fontWeight: 'bold' }}> timelineplus.site</span> and use our services, including our mobile application and API services.
                                Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
                            </p>
                        </section>

                        <section style={{ marginBottom: '50px' }}>
                            <h2 style={{ color: '#18181b', marginBottom: '20px', fontSize: '1.5rem' }}>2. Information We Collect</h2>
                            <p style={{ color: '#52525b', lineHeight: '1.8', marginBottom: '20px' }}>
                                We collect information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, when you participate in activities on the website.
                                The personal information that we collect depends on the context of your interactions with us and the choices you make.
                            </p>

                            <h3 style={{ fontSize: '1.2rem', color: '#18181b', marginBottom: '15px' }}>A. Personal Data</h3>
                            <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginBottom: '25px', color: '#52525b', lineHeight: '1.7' }}>
                                <li><strong>Identity Data:</strong> Name, username, and avatar.</li>
                                <li><strong>Contact Data:</strong> Email address and phone number.</li>
                                <li><strong>Financial Data:</strong> JazzCash/EasyPaisa account numbers for processing withdrawals. We do not store credit card numbers directly.</li>
                                <li><strong>Security Credentials:</strong> Passwords, password hints, and similar security information used for authentication and account access.</li>
                            </ul>

                            <h3 style={{ fontSize: '1.2rem', color: '#18181b', marginBottom: '15px' }}>B. Social Media Data (OAuth)</h3>
                            <p style={{ color: '#52525b', lineHeight: '1.8', marginBottom: '15px' }}>
                                We use third-party authentication services (Google, Facebook, YouTube) to streamline your experience. When you choose to link your accounts,
                                we may collect:
                            </p>
                            <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginBottom: '25px', color: '#52525b', lineHeight: '1.7' }}>
                                <li>Profile Information (Name, Avatar, Email) from your social provider.</li>
                                <li>YouTube Channel ID (to verify subscription tasks and channel ownership).</li>
                                <li>Public Profile Data (Follower count, public posts) to verify eligibility for tasks.</li>
                                <li>Device Information (IP Address, Browser Type, Operating System) for security and fraud prevention.</li>
                            </ul>
                            <div style={{ background: 'rgba(255,102,0,0.1)', borderLeft: '3px solid #ff6600', padding: '15px', borderRadius: '4px' }}>
                                <p style={{ color: '#c2410c', fontSize: '0.9rem', margin: 0 }}>
                                    <strong>Important:</strong> We do NOT store your passwords for these third-party accounts. Authentication is handled securely via OAuth 2.0 tokens. We never post to your social media accounts without your explicit permission.
                                </p>
                            </div>
                        </section>

                        <section style={{ marginBottom: '50px' }}>
                            <h2 style={{ color: '#18181b', marginBottom: '20px', fontSize: '1.5rem' }}>3. How We Use Your Information</h2>
                            <p style={{ color: '#52525b', lineHeight: '1.8', marginBottom: '15px' }}>We use the information we collect or receive for the following purposes:</p>
                            <ul style={{ listStyle: 'disc', paddingLeft: '20px', color: '#52525b', lineHeight: '1.7' }}>
                                <li><strong>To facilitate account creation and logon process:</strong> If you choose to link your account with us to a third-party account (such as your Google or Facebook account), we use the information you allowed us to collect from those third parties to facilitate account creation and logon process for the performance of the contract.</li>
                                <li><strong>To verify task completion:</strong> We use API data to verify if you really subscribed to a channel or liked a post, ensuring fair payouts.</li>
                                <li><strong>To send you administrative information:</strong> We may use your personal information to send you product, service and new feature information and/or information about changes to our terms, conditions, and policies.</li>
                                <li><strong>To protect our Services:</strong> We may use your information as part of our efforts to keep our website safe and secure (for example, for fraud monitoring and prevention).</li>
                                <li><strong>To enforce our terms, conditions, and policies:</strong> for business purposes, to comply with legal and regulatory requirements or in connection with our contract.</li>
                                <li><strong>To respond to legal requests and prevent harm:</strong> If we receive a subpoena or other legal request, we may need to inspect the data we hold to determine how to respond.</li>
                            </ul>
                        </section>

                        <section style={{ marginBottom: '50px' }}>
                            <h2 style={{ color: '#18181b', marginBottom: '20px', fontSize: '1.5rem' }}>4. Data Retention</h2>
                            <p style={{ color: '#52525b', lineHeight: '1.8' }}>
                                We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy policy, unless a longer retention period is required or permitted by law (such as tax, accounting or other legal requirements).
                                <br /><br />
                                When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize such information, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible.
                            </p>
                        </section>

                        <section style={{ marginBottom: '50px' }}>
                            <h2 style={{ color: '#18181b', marginBottom: '20px', fontSize: '1.5rem' }}>5. Security of Your Information</h2>
                            <p style={{ color: '#52525b', lineHeight: '1.8' }}>
                                We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                                <br /><br />
                                Any information disclosed online is vulnerable to interception and misuse by unauthorized parties. Therefore, we cannot guarantee complete security if you provide personal information.
                            </p>
                        </section>

                        <section style={{ marginBottom: '50px' }}>
                            <h2 style={{ color: '#18181b', marginBottom: '20px', fontSize: '1.5rem' }}>6. Information for Minors</h2>
                            <p style={{ color: '#52525b', lineHeight: '1.8' }}>
                                We do not knowingly solicit data from or market to children under 13 years of age. By using the Site, you represent that you are at least 13 or that you are the parent or guardian of such a minor and consent to such minor dependent’s use of the Site.
                                <br /><br />
                                If we learn that personal information from users less than 13 years of age has been collected, we will deactivate the account and take reasonable measures to promptly delete such data from our records. If you become aware of any data we may have collected from children under age 13, please contact us.
                            </p>
                        </section>

                        <section style={{ marginBottom: '50px' }}>
                            <h2 style={{ color: '#18181b', marginBottom: '20px', fontSize: '1.5rem' }}>7. Your Privacy Rights</h2>
                            <p style={{ color: '#52525b', lineHeight: '1.8' }}>
                                Depending on your region, you may have the following rights regarding your personal data:
                            </p>
                            <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginTop: '15px', color: '#52525b', lineHeight: '1.7' }}>
                                <li><strong>Right to Access:</strong> You have the right to request copies of your personal data.</li>
                                <li><strong>Right to Rectification:</strong> You have the right to request that we correct any information you believe is inaccurate.</li>
                                <li><strong>Right to Erasure:</strong> You have the right to request that we erase your personal data, under certain conditions.</li>
                                <li><strong>Right to Restrict Processing:</strong> You have the right to request that we restrict the processing of your personal data.</li>
                                <li><strong>Right to Object to Processing:</strong> You have the right to object to our processing of your personal data.</li>
                                <li><strong>Right to Data Portability:</strong> You have the right to request that we transfer the data that we have collected to another organization, or directly to you.</li>
                            </ul>
                        </section>

                        <section style={{ marginBottom: '50px' }}>
                            <h2 style={{ color: '#18181b', marginBottom: '20px', fontSize: '1.5rem' }}>8. Third-Party Services & Ads</h2>
                            <p style={{ color: '#52525b', lineHeight: '1.8', marginBottom: '20px' }}>
                                We may use third-party advertising companies (such as <strong>Google AdSense</strong>) to serve ads when you visit the website.
                                These companies may use information about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.
                            </p>
                            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                <p style={{ color: '#52525b' }}>
                                    <strong>Google OAuth Compliance:</strong> We adhere to the Google API Services User Data Policy, including the Limited Use requirements.
                                    Information received from Google APIs is used solely to provide the stated features (authentication and task verification) and is not shared with third-party advertisers. We do not use this data for surveillance or unrelated purposes.
                                </p>
                            </div>
                        </section>

                        <section style={{ marginBottom: '50px' }}>
                            <h2 style={{ color: '#18181b', marginBottom: '20px', fontSize: '1.5rem' }}>9. Tracking Technologies (Cookies)</h2>
                            <p style={{ color: '#52525b', lineHeight: '1.8' }}>
                                We use cookies and similar tracking technologies (like web beacons and pixels) to access or store information.
                                Cookies allow us to remember your preferences and recognize you across different devices.
                                Specific information about how we use such technologies and how you can refuse certain cookies is set out in our <a href="/cookie-policy" style={{ color: '#ff6600', textDecoration: 'none' }}>Cookie Policy</a>.
                            </p>
                        </section>

                        <section style={{ marginBottom: '50px' }}>
                            <h2 style={{ color: '#18181b', marginBottom: '20px', fontSize: '1.5rem' }}>10. Updates to This Policy</h2>
                            <p style={{ color: '#52525b', lineHeight: '1.8' }}>
                                We may update this privacy policy from time to time. The updated version will be indicated by an updated "Revised" date and the updated version will be effective as soon as it is accessible.
                                If we make material changes to this privacy policy, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification.
                                We encourage you to review this privacy policy frequently to be informed of how we are protecting your information.
                            </p>
                        </section>

                        <section style={{ marginBottom: '40px' }}>
                            <h2 style={{ color: '#18181b', marginBottom: '20px', fontSize: '1.5rem' }}>11. Contact Us</h2>
                            <p style={{ color: '#52525b', lineHeight: '1.8' }}>If you have questions or comments about this policy, you may email us at <a href="mailto:support@timelineplus.site" style={{ color: '#ff6600', textDecoration: 'none' }}>support@timelineplus.site</a> or by post to:</p>
                            <p style={{ color: '#71717a', marginTop: '15px' }}>
                                TimelinePlus Legal Department<br />
                                Office 12, Tech Hub<br />
                                Lahore, Pakistan
                            </p>
                        </section>

                    </div>
                </motion.div>
            </div>

        </div>
    )
}
