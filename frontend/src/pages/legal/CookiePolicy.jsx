import { motion } from 'framer-motion'
import SEO from '../../components/common/SEO'
import HomeNavbar from '../../components/common/HomeNavbar'

export default function CookiePolicy() {
    return (
        <div style={{ minHeight: '100vh', background: '#f7f9fc', color: '#18181b' }}>
            <SEO
                title="Cookie Policy - How We Use Cookies"
                description="Learn about how TimelinePlus uses cookies and similar technologies to improve your experience and manage our advertising."
            />
            <HomeNavbar />
            <div className="container" style={{ padding: '120px 20px 60px', maxWidth: '900px' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '40px' }}>Cookie Policy</h1>

                    <div style={{ background: '#fff', padding: '50px', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                        <p style={{ marginBottom: '40px', color: '#52525b' }}>Last Updated: {new Date().toLocaleDateString()}</p>

                        <section style={{ marginBottom: '50px' }}>
                            <h2 style={{ color: '#18181b', marginBottom: '20px', fontSize: '1.5rem' }}>1. What Are Cookies</h2>
                            <p style={{ color: '#52525b', lineHeight: '1.8' }}>
                                Cookies are small text files that are placed on your computer or mobile device by websites that you visit. They are widely used in order to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
                                Cookies allow a website to recognize a particular device or browser. There are several types of cookies:
                            </p>
                            <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginTop: '15px', color: '#52525b', lineHeight: '1.7' }}>
                                <li><strong>Session Cookies:</strong> behave ephemeral and expire when you close your browser.</li>
                                <li><strong>Persistent Cookies:</strong> remain on your device for a set period or until you delete them.</li>
                                <li><strong>First-party Cookies:</strong> set by the website you are visiting.</li>
                                <li><strong>Third-party Cookies:</strong> set by a domain other than the one you are visiting.</li>
                            </ul>
                        </section>

                        <section style={{ marginBottom: '50px' }}>
                            <h2 style={{ color: '#18181b', marginBottom: '20px', fontSize: '1.5rem' }}>2. How We Use Cookies</h2>
                            <p style={{ color: '#52525b', lineHeight: '1.8' }}>
                                We use cookies for a variety of reasons detailed below. Unfortunately, in most cases there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site. It is recommended that you leave on all cookies if you are not sure whether you need them or not in case they are used to provide a service that you use.
                            </p>
                        </section>

                        <section style={{ marginBottom: '50px' }}>
                            <h2 style={{ color: '#18181b', marginBottom: '20px', fontSize: '1.5rem' }}>3. Essential Cookies</h2>
                            <p style={{ color: '#52525b', lineHeight: '1.8' }}>
                                These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in, or filling in forms.
                                You can set your browser to block or alert you about these cookies, but some parts of the site will not then work. These cookies do not store any personally identifiable information.
                            </p>
                        </section>

                        <section style={{ marginBottom: '50px' }}>
                            <h2 style={{ color: '#18181b', marginBottom: '20px', fontSize: '1.5rem' }}>4. Performance & Analytics Cookies</h2>
                            <p style={{ color: '#52525b', lineHeight: '1.8' }}>
                                These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site.
                                All information these cookies collect is aggregated and therefore anonymous. If you do not allow these cookies we will not know when you have visited our site, and will not be able to monitor its performance.
                            </p>
                        </section>

                        <section style={{ marginBottom: '50px' }}>
                            <h2 style={{ color: '#18181b', marginBottom: '20px', fontSize: '1.5rem' }}>5. Functionality Cookies</h2>
                            <p style={{ color: '#52525b', lineHeight: '1.8' }}>
                                These cookies enable the website to provide enhanced functionality and personalisation. They may be set by us or by third party providers whose services we have added to our pages.
                                If you do not allow these cookies then some or all of these services may not function properly. For instance, remembering your login details so you don't have to re-enter them every time.
                            </p>
                        </section>

                        <section style={{ marginBottom: '50px' }}>
                            <h2 style={{ color: '#18181b', marginBottom: '20px', fontSize: '1.5rem' }}>6. Targeting & Advertising Cookies</h2>
                            <p style={{ color: '#52525b', lineHeight: '1.8' }}>
                                These cookies may be set through our site by our advertising partners (such as Google AdSense). They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites.
                                They do not store directly personal information, but are based on uniquely identifying your browser and internet device. If you do not allow these cookies, you will experience less targeted advertising.
                            </p>
                        </section>

                        <section style={{ marginBottom: '50px' }}>
                            <h2 style={{ color: '#18181b', marginBottom: '20px', fontSize: '1.5rem' }}>7. Social Media Cookies</h2>
                            <p style={{ color: '#52525b', lineHeight: '1.8' }}>
                                These cookies are set by a range of social media services that we have added to the site to enable you to share our content with your friends and networks (Facebook, Twitter, LinkedIn, etc.).
                                They are capable of tracking your browser across other sites and building up a profile of your interests. This may impact the content and messages you see on other websites you visit.
                            </p>
                        </section>

                        <section style={{ marginBottom: '50px' }}>
                            <h2 style={{ color: '#18181b', marginBottom: '20px', fontSize: '1.5rem' }}>8. Managing Cookies</h2>
                            <p style={{ color: '#52525b', lineHeight: '1.8' }}>
                                Most web browsers allow some control of most cookies through the browser settings. To find out more about cookies, including how to see what cookies have been set, visit www.aboutcookies.org or www.allaboutcookies.org.
                                <br /><br />
                                Find out how to manage cookies on popular browsers:
                            </p>
                            <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginTop: '15px', color: '#52525b', lineHeight: '1.7' }}>
                                <li><a href="https://support.google.com/accounts/answer/61416?co=GENIE.Platform%3DDesktop&hl=en" target="_blank" rel="noreferrer" style={{ color: '#ff6600' }}>Google Chrome</a></li>
                                <li><a href="https://support.microsoft.com/en-us/windows/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noreferrer" style={{ color: '#ff6600' }}>Microsoft Edge</a></li>
                                <li><a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noreferrer" style={{ color: '#ff6600' }}>Mozilla Firefox</a></li>
                                <li><a href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac" target="_blank" rel="noreferrer" style={{ color: '#ff6600' }}>Apple Safari</a></li>
                            </ul>
                        </section>

                        <section style={{ marginBottom: '50px' }}>
                            <h2 style={{ color: '#18181b', marginBottom: '20px', fontSize: '1.5rem' }}>9. Changes to this Cookie Policy</h2>
                            <p style={{ color: '#52525b', lineHeight: '1.8' }}>
                                We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal or regulatory reasons.
                                Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
                            </p>
                        </section>

                        <section style={{ marginBottom: '50px' }}>
                            <h2 style={{ color: '#18181b', marginBottom: '20px', fontSize: '1.5rem' }}>10. More Information</h2>
                            <p style={{ color: '#52525b', lineHeight: '1.8' }}>
                                Hopefully that has clarified things for you. If there is something that you aren't sure whether you need or not, it's usually safer to leave cookies enabled in case it does interact with one of the features you use on our site.
                                For more information about our privacy practices, please review our <a href="/privacy-policy" style={{ color: '#ff6600' }}>Privacy Policy</a>.
                            </p>
                            <p style={{ color: '#71717a', marginTop: '20px' }}>
                                For any questions regarding this Cookie Policy, email us at: <a href="mailto:support@timelineplus.site" style={{ color: '#ff6600', textDecoration: 'none' }}>support@timelineplus.site</a>
                            </p>
                        </section>

                    </div>
                </motion.div>
            </div>

        </div>
    )
}
