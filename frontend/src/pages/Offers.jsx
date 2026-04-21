import React, { useState, useEffect, Fragment } from 'react'
import { useAuthStore } from '../context/useAuthStore'
import { useToastStore } from '../context/useToastStore'
import { FiDollarSign, FiCheck, FiX, FiRefreshCw, FiActivity, FiLink, FiLayers, FiPlus, FiInstagram, FiFacebook, FiYoutube, FiTrendingUp } from 'react-icons/fi'
import Navbar from '../components/common/Navbar'
import SEO from '../components/common/SEO'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import AdsterraBanner from '../components/common/AdsterraBanner'
import FeedAd from '../components/common/FeedAd'

export default function Offers() {
    const { user, login } = useAuthStore()
    const { addToast } = useToastStore()
    const [offers, setOffers] = useState([])
    const [loading, setLoading] = useState(true)
    const [adSlots, setAdSlots] = useState({ slot1: '', slot2: '', slot3: '' })
    const navigate = useNavigate()

    // Form State
    const [service, setService] = useState('')
    const [link, setLink] = useState('')
    const [quantity, setQuantity] = useState('')
    const [rate, setRate] = useState('')

    // Counter Offer State
    const [counterRates, setCounterRates] = useState({})
    const [showCounterInput, setShowCounterInput] = useState({})

    const services = [
        "Facebook Followers", "Facebook Likes", "Facebook Post Likes", "Facebook Post Views", "Facebook Comments", "Facebook Shares", "Facebook Group Joins",
        "Instagram Followers", "Instagram Likes", "Instagram Views", "Instagram Comments", "Instagram Shares",
        "Youtube Subscribers", "Youtube Views", "Youtube Watchtime", "Youtube Likes",
        "Tiktok Views", "Tiktok Likes", "Tiktok Comments", "Tiktok Followers"
    ]

    useEffect(() => {
        if (user?.email && user?.password) {
            login(user.email, user.password).catch(() => { })
        }
        fetchOffers()
        fetch('https://timelineplus.site/api/admin/config/feed-ad-code')
            .then(res => res.json())
            .then(d => { if (d) setAdSlots(d) })
            .catch(() => { })
    }, [user?.id])

    const fetchOffers = async () => {
        if (!user?.id) return
        try {
            const res = await fetch(`https://timelineplus.site/api/offers/my/${user.id}`)
            const data = await res.json()
            const offersList = Array.isArray(data) ? data : (data ? [data] : [])
            setOffers(offersList)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const calculateTotal = () => {
        const q = parseFloat(quantity) || 0
        const r = parseFloat(rate) || 0
        return q * r
    }

    const handleNegotiate = async () => {
        if (!service || !link || !quantity || !rate) return addToast('error', 'All fields are required')
        const total = calculateTotal()
        if (user.balance < total) {
            return addToast('error', `Insufficient Balance. Need: ${total}, Have: ${user.balance}`)
        }

        try {
            const res = await fetch('https://timelineplus.site/api/offers/negotiate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    rate: parseFloat(rate),
                    role: 'user',
                    service,
                    link,
                    quantity
                })
            })
            if (res.ok) {
                addToast('success', 'Offer submitted!')
                setService('')
                setLink('')
                setQuantity('')
                setRate('')
                fetchOffers()
            } else {
                const data = await res.json()
                addToast('error', data.error || 'Failed to submit offer')
            }
        } catch (e) {
            addToast('error', 'Network error')
        }
    }

    const handleAccept = async (offerId) => {
        try {
            const res = await fetch('https://timelineplus.site/api/offers/accept', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ offerId, userId: user.id })
            })
            const data = await res.json()
            if (res.ok) {
                addToast('success', 'Offer Accepted! Campaign Created.')
                setTimeout(() => window.location.href = '/dashboard', 1000)
            } else {
                addToast('error', data.error || 'Failed to accept offer')
            }
        } catch (e) {
            addToast('error', 'Network error')
        }
    }

    const handleCounter = async (offerId) => {
        const newRate = counterRates[offerId]
        if (!newRate) return
        try {
            const offerToCounter = offers.find(o => o.id === offerId)
            if (!offerToCounter) return
            const res = await fetch('https://timelineplus.site/api/offers/negotiate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    rate: parseFloat(newRate),
                    role: 'user',
                    service: offerToCounter.service_type,
                    link: offerToCounter.link,
                    quantity: offerToCounter.quantity
                })
            })
            if (res.ok) {
                addToast('success', 'Counter Submitted')
                setShowCounterInput(prev => ({ ...prev, [offerId]: false }))
                fetchOffers()
            }
        } catch (e) { }
    }

    const toggleCounterInput = (id) => setShowCounterInput(prev => ({ ...prev, [id]: !prev[id] }))
    const handleCounterRateChange = (id, value) => setCounterRates(prev => ({ ...prev, [id]: value }))

    const categories = [
        { name: 'Instagram', icon: <FiInstagram />, color: '#E1306C', services: services.filter(s => s.startsWith('Instagram')) },
        { name: 'Facebook', icon: <FiFacebook />, color: '#1877F2', services: services.filter(s => s.startsWith('Facebook')) },
        { name: 'YouTube', icon: <FiYoutube />, color: '#FF0000', services: services.filter(s => s.startsWith('Youtube')) },
        { name: 'TikTok', icon: <FiActivity />, color: '#000000', services: services.filter(s => s.startsWith('Tiktok')) }
    ]

    const [selectedCategory, setSelectedCategory] = useState(null)

    if (loading) return <div className="text-center p-10">Loading...</div>

    return (
        <div style={{ padding: '100px 20px 100px' }} className="campaign-container">
            <SEO
                title="Special Offers & Campaigns"
                description="Create and manage your own social media growth campaigns or complete special high-paying offers on TimelinePlus."
                injectAd={true}
            />
            <Navbar />

            <div className="header-section">
                <h1>Create Campaign</h1>
                <p>Boost your social media presence with real engagement.</p>
            </div>

            {/* Campaign Creation Wizard */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="wizard-card"
            >
                {/* Header */}
                <div className="wizard-header">
                    <h2>
                        <div className="icon-wrapper"><FiPlus size={24} /></div>
                        New Campaign
                    </h2>
                    <div className="progress-indicator">
                        <span>Progress</span>
                        <div className="steps">
                            {[1, 2, 3, 4].map(step => (
                                <div key={step} className={`step ${(selectedCategory ? (service ? (quantity ? (rate ? 4 : 3) : 2) : 1) : 0) >= step ? 'active' : ''}`}></div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="wizard-body">
                    {/* Step 1: Platform Selection */}
                    <div className="step-section">
                        <div className="platform-grid">
                            {categories.map(cat => (
                                <button
                                    key={cat.name}
                                    onClick={() => {
                                        setSelectedCategory(cat.name)
                                        setService(cat.services[0] || '')
                                        setRate('')
                                        setQuantity('')
                                    }}
                                    className={`platform-card ${selectedCategory === cat.name ? 'active' : ''}`}
                                >
                                    <div
                                        className="platform-icon"
                                        style={{ color: selectedCategory === cat.name ? cat.color : '#9ca3af' }}
                                    >
                                        {cat.icon}
                                    </div>
                                    <span>{cat.name}</span>
                                    <div className="active-indicator" style={{ background: cat.color }}></div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {selectedCategory ? (
                        <div className="content-layout">

                            {/* Left Column: Form */}
                            <div className="form-column">

                                {/* Service */}
                                <div className="form-section">
                                    <div className="section-header">
                                        <div className="step-number">2</div>
                                        <label>Select Service</label>
                                    </div>
                                    <div className="service-grid">
                                        {categories.find(c => c.name === selectedCategory)?.services.map(s => (
                                            <button
                                                key={s}
                                                onClick={() => setService(s)}
                                                className={`service-card ${service === s ? 'active' : ''}`}
                                            >
                                                <span>{s}</span>
                                                <div className="check-icon">
                                                    {service === s && <FiCheck />}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Quantity */}
                                <div className="form-section">
                                    <div className="section-header">
                                        <div className="step-number">3</div>
                                        <label>Quantity</label>
                                    </div>
                                    <div className="quantity-grid">
                                        {[100, 250, 500, 1000, 2000, 5000].map(qty => (
                                            <button
                                                key={qty}
                                                onClick={() => setQuantity(qty)}
                                                className={`qty-pill ${quantity == qty ? 'active' : ''}`}
                                            >
                                                {qty.toLocaleString()}
                                            </button>
                                        ))}
                                        <div className="custom-qty">
                                            <div className="label">Custom</div>
                                            <input
                                                type="number"
                                                placeholder="0"
                                                value={quantity}
                                                onChange={e => setQuantity(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    {quantity < 100 && quantity !== '' && <p style={{ color: 'red', marginTop: '10px', fontSize: '0.8rem', fontWeight: 'bold' }}>* Minimum quantity is 100</p>}
                                </div>

                                {/* Link & Rate */}
                                <div className="input-group-grid">
                                    <div className="form-section">
                                        <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 'bold', color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>4. Target Link</label>
                                        <div className="input-wrapper">
                                            <div className="icon-box"><FiLink /></div>
                                            <input
                                                type="url"
                                                placeholder={service.includes('Youtube') ? 'https://youtube.com/...' : 'https://...'}
                                                value={link}
                                                onChange={e => setLink(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-section">
                                        <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 'bold', color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Rate Per Task</label>
                                        <div className="input-wrapper">
                                            <div className="icon-box" style={{ fontSize: '1rem', fontWeight: 'bold' }}>USD</div>
                                            <input
                                                type="number"
                                                placeholder="0.5"
                                                value={rate}
                                                onChange={e => setRate(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* Right Column: Summary (Sticky on Desktop) */}
                            <div className="summary-column">
                                <div className="sticky-summary">
                                    <div className="summary-card">
                                        <div className="summary-header">
                                            <div className="icon"><FiLayers /></div>
                                            Summary
                                        </div>

                                        <div className="summary-row">
                                            <span>Platform</span>
                                            <span>{selectedCategory}</span>
                                        </div>
                                        <div className="summary-row">
                                            <span>Quantity</span>
                                            <span>{quantity ? parseInt(quantity).toLocaleString() : '-'}</span>
                                        </div>
                                        <div className="summary-row">
                                            <span>Rate/Task</span>
                                            <span style={{ color: '#4ade80' }}>${rate || '-'}</span>
                                        </div>

                                        <div className="total-cost">
                                            <div className="label">Total Cost</div>
                                            <div className="amount">
                                                <span style={{ fontSize: '1rem', color: '#9ca3af', marginRight: '5px' }}>USD</span>
                                                {calculateTotal().toLocaleString()}
                                            </div>
                                        </div>

                                        <button
                                            className="launch-btn"
                                            onClick={handleNegotiate}
                                            disabled={!service || !link || !quantity || !rate}
                                        >
                                            Launch <FiCheck />
                                        </button>
                                    </div>

                                    <div style={{ textAlign: 'center', marginTop: '1rem', color: '#6b7280', fontSize: '0.9rem' }}>
                                        Available Balance: <strong>${user?.balance?.toLocaleString()}</strong>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '6rem 2rem', opacity: 0.6 }}>
                            <FiTrendingUp style={{ fontSize: '5rem', marginBottom: '1rem', color: '#d1d5db' }} />
                            <h3 style={{ fontSize: '2rem', fontWeight: '800', color: '#374151', marginBottom: '0.5rem' }}>Start Growing</h3>
                            <p style={{ fontSize: '1.2rem', color: '#9ca3af' }}>Select a platform above to begin your campaign.</p>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Active Offers List - Keeping simplistic structure here as user focused on Wizard */}
            <div style={{ marginTop: '4rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '2rem' }}>Your Campaigns</h2>
                {offers.length === 0 ? (
                    <div style={{ padding: '4rem', background: 'white', borderRadius: '2rem', textAlign: 'center', border: '1px solid #f3f4f6' }}>
                        <p style={{ color: '#9ca3af', fontWeight: '600' }}>No active campaigns.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {offers.map((offer, index) => (
                            <Fragment key={offer.id}>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="glass-card"
                                    style={{ padding: '2rem', borderRadius: '1.5rem', border: '1px solid #f3f4f6' }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>{offer.service_type}</h3>
                                        <span className={`badge ${offer.status === 'accepted' ? 'success' : 'warning'}`}>{offer.status}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '2rem', color: '#6b7280' }}>
                                        <div>Qty: <strong>{offer.quantity}</strong></div>
                                        <div>Rate: <strong>{offer.current_rate}</strong></div>
                                        <div>Link: <a href={offer.link} target="_blank" style={{ color: '#FF6600' }}>View</a></div>
                                    </div>
                                </motion.div>
                                {(index + 1) % 3 === 0 && (
                                    <FeedAd 
                                        adHtml={
                                            ((index + 1) / 3) % 3 === 1 ? adSlots.slot1 : 
                                            ((index + 1) / 3) % 3 === 2 ? adSlots.slot2 : adSlots.slot3
                                        } 
                                    />
                                )}
                            </Fragment>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
