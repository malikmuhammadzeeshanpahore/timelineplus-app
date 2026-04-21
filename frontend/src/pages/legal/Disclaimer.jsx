import { motion } from 'framer-motion'
import SEO from '../../components/common/SEO'
import HomeNavbar from '../../components/common/HomeNavbar'

export default function Disclaimer() {
    return (
        <div style={{ minHeight: '100vh', background: '#f7f9fc', color: '#18181b' }}>
            <SEO
                title="Disclaimer - Earnings & Content"
                description="Read the TimelinePlus disclaimer regarding earnings potential, third-party links, and information accuracy."
            />
            <HomeNavbar />
            <div className="container" style={{ padding: '120px 20px 60px', maxWidth: '900px' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '40px' }}>Disclaimer</h1>

                    <div style={{ background: '#fff', padding: '50px', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                        <p style={{ marginBottom: '40px', color: '#52525b' }}>Last Updated: {new Date().toLocaleDateString()}</p>

                        <section style={{ marginBottom: '50px' }}>
                            <h2 style={{ color: '#18181b', marginBottom: '20px', fontSize: '1.5rem' }}>1. General Disclaimer</h2>
                            <p style={{ color: '#52525b', lineHeight: '1.8' }}>
                                The information provided by TimelinePlus ("we," "us," or "our") on <span style={{ color: '#18181b', fontWeight: 'bold' }}>timelineplus.site</span> (the "Site") and our mobile application is for general informational purposes only.
                                All information on the Site and our mobile application is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site or our mobile application.
                                Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the site or our mobile application or reliance on any information provided on the site and our mobile application. Your use of the site and our mobile application and your reliance on any information on the site and our mobile application is solely at your own risk.
                            </p>
                        </section>

                        <section style={{ marginBottom: '50px' }}>
                            <h2 style={{ color: '#18181b', marginBottom: '20px', fontSize: '1.5rem' }}>2. External Links Disclaimer</h2>
                            <p style={{ color: '#52525b', lineHeight: '1.8' }}>
                                The Site and our mobile application may contain (or you may be sent through the Site or our mobile application) links to other websites or content belonging to or originating from third parties or links to websites and features in banners or other advertising.
                                <br /><br />
                                Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us. WE DO NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR THE ACCURACY OR RELIABILITY OF ANY INFORMATION OFFERED BY THIRD-PARTY WEBSITES LINKED THROUGH THE SITE OR ANY WEBSITE OR FEATURE LINKED IN ANY BANNER OR OTHER ADVERTISING. WE WILL NOT BE A PARTY TO OR IN ANY WAY BE RESPONSIBLE FOR MONITORING ANY TRANSACTION BETWEEN YOU AND THIRD-PARTY PROVIDERS OF PRODUCTS OR SERVICES.
                            </p>
                        </section>

                        <section style={{ marginBottom: '50px' }}>
                            <h2 style={{ color: '#18181b', marginBottom: '20px', fontSize: '1.5rem' }}>3. Professional Disclaimer</h2>
                            <p style={{ color: '#52525b', lineHeight: '1.8' }}>
                                The Site cannot and does not contain legal, financial, or tax advice. The earning information is provided for general informational and educational purposes only and is not a substitute for professional advice.
                                Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals. We do not provide any kind of legal, financial, or tax advice. The use or reliance of any information contained on the Site or our mobile application is solely at your own risk.
                            </p>
                        </section>

                        <section style={{ marginBottom: '50px' }}>
                            <h2 style={{ color: '#18181b', marginBottom: '20px', fontSize: '1.5rem' }}>4. Affiliates Disclaimer</h2>
                            <p style={{ color: '#52525b', lineHeight: '1.8' }}>
                                The Site may contain links to affiliate websites, and we receive an affiliate commission for any purchases made by you on the affiliate website using such links.
                                We are a participant in various affiliate programs designed to provide a means for us to earn advertising fees by linking to affiliated sites.
                            </p>
                        </section>

                        <section style={{ marginBottom: '50px' }}>
                            <h2 style={{ color: '#18181b', marginBottom: '20px', fontSize: '1.5rem' }}>5. Earnings Disclaimer</h2>
                            <p style={{ color: '#52525b', lineHeight: '1.8' }}>
                                Every effort has been made to accurately represent our products and their potential. However, there is no guarantee that you will earn any money using the techniques and ideas in these materials. Examples in these materials are not to be interpreted as a promise or guarantee of earnings. Earning potential is entirely dependent on the person using our product, ideas, and techniques.
                                We do not claim this as a "get rich scheme." Your level of success in attaining the results claimed in our materials depends on the time you devote to the program, ideas and techniques mentioned, your finances, knowledge and various skills. Since these factors differ according to individuals, we cannot guarantee your success or income level.
                            </p>
                        </section>

                        <section style={{ marginBottom: '50px' }}>
                            <h2 style={{ color: '#18181b', marginBottom: '20px', fontSize: '1.5rem' }}>6. Testimonials Disclaimer</h2>
                            <p style={{ color: '#52525b', lineHeight: '1.8' }}>
                                The Site may contain testimonials by users of our products and/or services. These testimonials reflect the real-life experiences and opinions of such users. However, the experiences are personal to those particular users, and may not necessarily be representative of all users of our products and/or services. We do not claim, and you should not assume, that all users will have the same experiences. YOUR INDIVIDUAL RESULTS MAY VARY.
                                The testimonials on the Site are submitted in various forms such as text, audio and/or video, and are reviewed by us before being posted.
                            </p>
                        </section>

                        <section style={{ marginBottom: '50px' }}>
                            <h2 style={{ color: '#18181b', marginBottom: '20px', fontSize: '1.5rem' }}>7. Errors and Omissions Disclaimer</h2>
                            <p style={{ color: '#52525b', lineHeight: '1.8' }}>
                                While we have made every attempt to ensure that the information contained in this site has been obtained from reliable sources, TimelinePlus is not responsible for any errors or omissions, or for the results obtained from the use of this information. All information in this site is provided "as is", with no guarantee of completeness, accuracy, timeliness or of the results obtained from the use of this information, and without warranty of any kind, express or implied, including, but not limited to warranties of performance, merchantability and fitness for a particular purpose.
                            </p>
                        </section>

                        <section style={{ marginBottom: '50px' }}>
                            <h2 style={{ color: '#18181b', marginBottom: '20px', fontSize: '1.5rem' }}>8. "Use at Your Own Risk" Disclaimer</h2>
                            <p style={{ color: '#52525b', lineHeight: '1.8' }}>
                                All information in the Site is provided "as is", with no guarantee of completeness, accuracy, timeliness or of the results obtained from the use of this information, and without warranty of any kind, express or implied, including, but not limited to warranties of performance, merchantability and fitness for a particular purpose.
                                In no event will TimelinePlus, its related partnerships or corporations, or the partners, agents or employees thereof be liable to you or anyone else for any decision made or action taken in reliance on the information in the Site or for any consequential, special or similar damages, even if advised of the possibility of such damages.
                            </p>
                        </section>

                        <section style={{ marginBottom: '50px' }}>
                            <h2 style={{ color: '#18181b', marginBottom: '20px', fontSize: '1.5rem' }}>9. Contact Us</h2>
                            <p style={{ color: '#52525b', lineHeight: '1.8' }}>
                                If you have any questions about this Disclaimer, please contact us at <a href="mailto:support@timelineplus.site" style={{ color: '#ff6600', textDecoration: 'none' }}>support@timelineplus.site</a>.
                            </p>
                        </section>

                    </div>
                </motion.div>
            </div>

        </div>
    )
}
