import React from 'react'
import ToastContainer from './components/common/ToastContainer'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import VerifyEmail from './pages/Auth/VerifyEmail'


import AdminDashboard from './pages/AdminDashboard'
import Dashboard from './pages/Dashboard'
import Jobs from './pages/Jobs'
import Wallet from './pages/Wallet'
import Profile from './pages/Profile'
import About from './pages/About'
import Services from './pages/Services'
import Contact from './pages/Contact'
import Offers from './pages/Offers'
import ForgotPassword from './pages/Auth/ForgotPassword'
import BottomNav from './components/common/BottomNav'
import Footer from './components/common/Footer'
import PrivacyPolicy from './pages/legal/PrivacyPolicy'
import Terms from './pages/legal/Terms'
import Disclaimer from './pages/legal/Disclaimer'
import CookiePolicy from './pages/legal/CookiePolicy'
import RefundPolicy from './pages/legal/RefundPolicy'
import Faq from './pages/legal/Faq'
import { useAuthStore } from './context/useAuthStore'
import AdminMailbox from './pages/AdminMailbox'
import AdminSupport from './pages/AdminSupport'
import FloatingActions from './components/common/FloatingActions'
import Blog from './pages/Blog'
import BlogDetail from './pages/BlogDetail'
import MemeFeed from './pages/MemeFeed'
import MemeDetail from './pages/MemeDetail'
import UserProfile from './pages/UserProfile'
import NotFound from './pages/NotFound'
import Hiring from './pages/Hiring'

import GlobalAdCleanup from './components/common/GlobalAdCleanup'

function App() {
  const { isAuthenticated, user } = useAuthStore()
  const location = useLocation()
  const hideNavRoutes = ['/login', '/register', '/forgot-password', '/']
  const { logout, setSocialUser } = useAuthStore()

  // Referral tracking
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get('ref');
    if (ref) {
      localStorage.setItem('referredByUsername', ref);
    }
  }, [location.search]);

  // SOCIAL AUTH CHECK
  React.useEffect(() => {
    // Helper to get cookie
    const getCookie = (name) => {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      if (match) return match[2];
      return null;
    }

    const authCookie = getCookie('auth_user');
    if (authCookie) {
      try {
        const user = JSON.parse(decodeURIComponent(authCookie));
        if (user && user.id) {
          console.log('Social Auth Success:', user.name);
          setSocialUser(user);
          // Clear cookie to prevent re-reading
          document.cookie = 'auth_user=; Max-Age=0; path=/;';

          // Remove #_=_ from URL if present (Facebook artifact)
          if (window.location.hash === '#_=_') {
            history.replaceState(null, null, ' ');
          }

          // Referral binding for social login
          const refUsername = localStorage.getItem('referredByUsername');
          if (refUsername) {
            fetch('https://timelineplus.site/api/auth/bind-referral', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, referredByUsername: refUsername })
            }).then(() => {
                localStorage.removeItem('referredByUsername');
                window.location.href = '/dashboard';
            }).catch(() => {
                window.location.href = '/dashboard';
            });
          } else {
              if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register') {
                window.location.href = '/dashboard';
              }
          }
        }
      } catch (e) {
        console.error('Failed to parse auth cookie', e);
      }
    }
  }, [setSocialUser, location.pathname]);


  // FORCE RESET CHECK
  React.useEffect(() => {
    const checkVersion = async () => {
      try {
        const res = await fetch('https://timelineplus.site/api/config/reset-version')
        const data = await res.json()
        const serverVersion = data.version

        const localVersion = localStorage.getItem('app_reset_version')

        if (localVersion && serverVersion !== localVersion) {
          console.log('Reset Version Mismatch! Clearing data...')
          logout() // Logout user
          localStorage.clear() // Hard clear
          localStorage.setItem('app_reset_version', serverVersion)
          window.location.reload()
        } else if (!localVersion) {
          localStorage.setItem('app_reset_version', serverVersion)
        }
      } catch (err) {
        console.error('Version check failed', err)
      }
    }
    checkVersion()
  }, [])

  // TRACK VISITS (Session + Persistent Visitor ID)
  React.useEffect(() => {
    // 1. Session ID (Clears on Tab Close - Session Storage)
    let sessionId = sessionStorage.getItem('visit_session_id');
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
      sessionStorage.setItem('visit_session_id', sessionId);
    }

    // 2. Visitor ID (Persistent - Local Storage)
    let visitorId = localStorage.getItem('visitor_id');
    if (!visitorId) {
      visitorId = Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem('visitor_id', visitorId);
    }

    // 3. Send to Backend
    fetch('https://timelineplus.site/api/log-visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: location.pathname,
        sessionId: sessionId,
        visitorId: visitorId // Send Persistent ID
      })
    }).catch(err => console.error('Visit log failed', err))
  }, [location.pathname])

  return (
    <>
      <GlobalAdCleanup />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/memes" element={<MemeFeed />} />
        <Route path="/meme/:id" element={<MemeDetail />} />
        <Route path="/user/:username" element={<UserProfile />} />
        <Route path="/profile/:username" element={<UserProfile />} />
        <Route path="/hiring" element={<Hiring />} />

        <Route
          path="/admin-dashboard"
          element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />}
        />

        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/jobs"
          element={isAuthenticated ? <Jobs /> : <Navigate to="/login" />}
        />
        <Route
          path="/wallet"
          element={isAuthenticated ? <Wallet /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/offers"
          element={isAuthenticated ? <Offers /> : <Navigate to="/login" />}
        />

        <Route path="*" element={<NotFound />} />

        {/* Legal Routes */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/faq" element={<Faq />} />

        {/* Admin Mailbox */}
        <Route
          path="/mail"
          element={
            isAuthenticated && user?.role === 'admin'
              ? <AdminMailbox />
              : <NotFound />
          }
        />
        <Route
          path="/admin/support"
          element={
            isAuthenticated && user?.role === 'admin'
              ? <AdminSupport />
              : <NotFound />
          }
        />

      </Routes>
      {/* v2: Explicitly show nav only on these pages */}
      {isAuthenticated && ['/dashboard', '/jobs', '/offers', '/wallet', '/profile'].includes(location.pathname) && <BottomNav />}



      {/* Show Global Footer on Landing and Public/Legal Pages */}
      {/* Show Global Footer on Landing and Public/Legal Pages */}
      {/* Show Global Footer on Landing and Public/Legal Pages */}
      {!['/login', '/register', '/forgot-password', '/dashboard'].includes(location.pathname) && !location.pathname.startsWith('/admin') && (
        <Footer />
      )}
      <FloatingActions />
    </>
  )
}

export default App
