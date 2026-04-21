import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, User, Mail, Phone, MapPin, Linkedin,
  Github, Layers, Award, Cpu, MessageSquare,
  Clock, DollarSign, Send, Upload, ChevronDown,
  Globe, Zap, Target, CheckCircle, ArrowRight
} from 'lucide-react';

const roles = [
  "SEO Specialist (On-Page & Off-Page)",
  "Expert Content Writer (Urdu & English)",
  "Social Media Manager (SMM)",
  "Graphic Designer",
  "Video Editor",
  "Project Manager",
  "Ads Specialist (PPC Expert)",
  "WordPress & Elementor Expert",
  "Frontend Designer (UI/UX)",
  "Backend / API Specialist",
  "Quality Assurance (QA) Tester",
  "AI Prompt Engineer / Automation Expert",
  "Sales & Outreach Lead"
];

const WHATSAPP_NUMBER = '923294145425';

const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '10px',
  padding: '10px 14px',
  color: '#fff',
  fontSize: '0.875rem',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  fontFamily: 'inherit',
};

const labelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '0.75rem',
  fontWeight: 600,
  color: 'rgba(255,255,255,0.5)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: '5px',
};

const sectionStyle = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '16px',
  padding: '24px',
};

const sectionTitleStyle = {
  fontSize: '0.95rem',
  fontWeight: 700,
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '18px',
  paddingBottom: '12px',
  borderBottom: '1px solid rgba(255,255,255,0.07)',
};

function FormField({ label, icon: Icon, children }) {
  return (
    <div>
      <label style={labelStyle}>
        {Icon && <Icon size={11} style={{ opacity: 0.7 }} />}
        {label}
      </label>
      {children}
    </div>
  );
}

export default function Hiring() {
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', location: '', linkedin: '',
    role: '', experience: '', skills: '',
    portfolio: '', github: '', projectDescription: '',
    aiProficiency: '', problemSolving: '',
    availability: '', pressureHandling: '', salary: '', noticePeriod: '',
    whyUs: '', clientRelationship: ''
  });

  const [resume, setResume] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isDev = (formData.role.toLowerCase().includes('backend') ||
    formData.role.toLowerCase().includes('frontend') ||
    formData.role.toLowerCase().includes('wordpress') ||
    formData.role.toLowerCase().includes('api'));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = '#ff6600';
    e.target.style.boxShadow = '0 0 0 3px rgba(255,102,0,0.15)';
  };
  const handleBlur = (e) => {
    e.target.style.borderColor = 'rgba(255,255,255,0.12)';
    e.target.style.boxShadow = 'none';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(k => data.append(k, formData[k]));
      if (resume) data.append('resume', resume);

      const response = await fetch('https://timelineplus.site/api/hiring/apply', { method: 'POST', body: data });
      const result = await response.json();

      if (response.ok) {
        setSubmitted(true);
        const waMessage = encodeURIComponent(
          `Hi, I just applied for the ${formData.role} role at TimelinePlus. Name: ${formData.fullName}`
        );
        setTimeout(() => {
          window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`;
        }, 2500);
      } else {
        alert(result.error || 'Something went wrong. Please try again.');
      }
    } catch {
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={{
        minHeight: '100vh', background: '#0a0a0a', display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: '20px'
      }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ textAlign: 'center', maxWidth: '420px' }}
        >
          <div style={{
            width: 72, height: 72, background: 'linear-gradient(135deg, #ff6600, #ff9500)',
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px', boxShadow: '0 0 40px rgba(255,102,0,0.4)'
          }}>
            <CheckCircle size={36} color="#fff" />
          </div>
          <h2 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 800, marginBottom: 12 }}>Application Sent!</h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: 20 }}>
            We've received your application. Redirecting you to WhatsApp to complete your onboarding...
          </p>
          <div style={{ width: 40, height: 3, background: 'linear-gradient(90deg, #ff6600, #ff9500)', borderRadius: 2, margin: '0 auto', animation: 'pulse 1.5s infinite' }} />
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '0 0 80px' }}>
      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, #111 0%, #1a0a00 50%, #0a0a0a 100%)',
        borderBottom: '1px solid rgba(255,102,0,0.15)',
        padding: '60px 20px 50px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 300,
          background: 'radial-gradient(ellipse, rgba(255,102,0,0.1) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            border: '1px solid rgba(255,102,0,0.3)', borderRadius: 50,
            padding: '5px 14px', fontSize: '0.75rem', fontWeight: 700,
            color: '#ff6600', letterSpacing: '0.05em', marginBottom: 20,
            background: 'rgba(255,102,0,0.08)'
          }}>
            <Briefcase size={12} /> WE ARE HIRING
          </div>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 900,
            lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: 14,
            background: 'linear-gradient(135deg, #fff 40%, rgba(255,255,255,0.6))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>
            Join TimelinePlus<br />
            <span style={{
              background: 'linear-gradient(90deg, #ff6600, #ff9500)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>Digital Agency</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.95rem', maxWidth: 500, margin: '0 auto' }}>
            We are looking for talented experts who can help us grow our agency to the next level. If you have the skills, we want you on our team.
          </p>
        </motion.div>
      </div>

      {/* Form */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 20px 0' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Section 1: Basic Information */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={sectionStyle}>
            <div style={sectionTitleStyle}>
              <div style={{ width: 28, height: 28, background: 'rgba(255,102,0,0.15)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={14} color="#ff6600" />
              </div>
              Basic Information
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <FormField label="Full Name" icon={User}>
                <input required name="fullName" value={formData.fullName} onChange={handleChange}
                  onFocus={handleFocus} onBlur={handleBlur}
                  style={inputStyle} placeholder="John Smith" />
              </FormField>
              <FormField label="Email Address" icon={Mail}>
                <input required type="email" name="email" value={formData.email} onChange={handleChange}
                  onFocus={handleFocus} onBlur={handleBlur}
                  style={inputStyle} placeholder="you@email.com" />
              </FormField>
              <FormField label="WhatsApp / Phone" icon={Phone}>
                <input required name="phone" value={formData.phone} onChange={handleChange}
                  onFocus={handleFocus} onBlur={handleBlur}
                  style={inputStyle} placeholder="+92 3xx xxxxxxx" />
              </FormField>
              <FormField label="Current Location" icon={MapPin}>
                <input required name="location" value={formData.location} onChange={handleChange}
                  onFocus={handleFocus} onBlur={handleBlur}
                  style={inputStyle} placeholder="City, Country" />
              </FormField>
              <div style={{ gridColumn: '1 / -1' }}>
                <FormField label="LinkedIn Profile" icon={Linkedin}>
                  <input required type="url" name="linkedin" value={formData.linkedin} onChange={handleChange}
                    onFocus={handleFocus} onBlur={handleBlur}
                    style={inputStyle} placeholder="https://linkedin.com/in/yourprofile" />
                </FormField>
              </div>
            </div>
          </motion.div>

          {/* Section 2: Role & Expertise */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} style={sectionStyle}>
            <div style={sectionTitleStyle}>
              <div style={{ width: 28, height: 28, background: 'rgba(99,102,241,0.15)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Layers size={14} color="#818cf8" />
              </div>
              Role &amp; Expertise
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <FormField label="Applying For" icon={Briefcase}>
                <div style={{ position: 'relative' }}>
                  <select required name="role" value={formData.role} onChange={handleChange}
                    onFocus={handleFocus} onBlur={handleBlur}
                    style={{ ...inputStyle, appearance: 'none', paddingRight: '34px', cursor: 'pointer' }}>
                    <option value="" style={{ background: '#111' }}>Select a role...</option>
                    {roles.map(r => <option key={r} value={r} style={{ background: '#111' }}>{r}</option>)}
                  </select>
                  <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', pointerEvents: 'none' }} />
                </div>
              </FormField>
              <FormField label="Experience Level" icon={Award}>
                <div style={{ position: 'relative' }}>
                  <select required name="experience" value={formData.experience} onChange={handleChange}
                    onFocus={handleFocus} onBlur={handleBlur}
                    style={{ ...inputStyle, appearance: 'none', paddingRight: '34px', cursor: 'pointer' }}>
                    <option value="" style={{ background: '#111' }}>Select level...</option>
                    <option value="Fresher" style={{ background: '#111' }}>Fresher</option>
                    <option value="1-2 years" style={{ background: '#111' }}>1-2 Years</option>
                    <option value="3-5 years" style={{ background: '#111' }}>3-5 Years</option>
                    <option value="Senior (5+ years)" style={{ background: '#111' }}>Senior (5+ Years)</option>
                  </select>
                  <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', pointerEvents: 'none' }} />
                </div>
              </FormField>
              <div style={{ gridColumn: '1 / -1' }}>
                <FormField label="Primary Skills" icon={Zap}>
                  <input required name="skills" value={formData.skills} onChange={handleChange}
                    onFocus={handleFocus} onBlur={handleBlur}
                    style={inputStyle} placeholder="React, Node.js, Figma, SEMrush..." />
                </FormField>
              </div>
            </div>
          </motion.div>

          {/* Section 3: Portfolio & Proof */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={sectionStyle}>
            <div style={sectionTitleStyle}>
              <div style={{ width: 28, height: 28, background: 'rgba(16,185,129,0.15)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Globe size={14} color="#10b981" />
              </div>
              Portfolio &amp; Proof of Work
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <FormField label="Portfolio / Website" icon={Globe}>
                <input required type="url" name="portfolio" value={formData.portfolio} onChange={handleChange}
                  onFocus={handleFocus} onBlur={handleBlur}
                  style={inputStyle} placeholder="https://yourportfolio.com" />
              </FormField>

              <AnimatePresence>
                {isDev && (
                  <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}>
                    <FormField label="GitHub Profile" icon={Github}>
                      <input type="url" name="github" value={formData.github} onChange={handleChange}
                        onFocus={handleFocus} onBlur={handleBlur}
                        style={inputStyle} placeholder="https://github.com/username" />
                    </FormField>
                  </motion.div>
                )}
              </AnimatePresence>

              <div style={{ gridColumn: '1 / -1' }}>
                <FormField label="Best Project Description" icon={Target}>
                  <textarea required name="projectDescription" value={formData.projectDescription} onChange={handleChange}
                    onFocus={handleFocus} onBlur={handleBlur}
                    style={{ ...inputStyle, minHeight: '90px', resize: 'vertical' }}
                    placeholder="Describe a project you're proud of — what was your role, the challenge, and the result?" />
                </FormField>
              </div>

              {/* Resume Upload */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}><Upload size={11} style={{ opacity: 0.7 }} /> Resume (PDF)</label>
                <label style={{ display: 'block', cursor: 'pointer' }}>
                  <input type="file" accept=".pdf" onChange={e => setResume(e.target.files[0])} style={{ display: 'none' }} />
                  <div style={{
                    border: '1.5px dashed rgba(255,255,255,0.12)', borderRadius: '10px',
                    padding: '16px 20px', textAlign: 'center',
                    background: resume ? 'rgba(255,102,0,0.06)' : 'transparent',
                    transition: 'all 0.2s',
                    color: resume ? '#ff6600' : 'rgba(255,255,255,0.3)',
                    fontSize: '0.82rem'
                  }}>
                    <Upload size={16} style={{ margin: '0 auto 6px', display: 'block' }} />
                    {resume ? resume.name : 'Click to upload PDF resume'}
                  </div>
                </label>
              </div>
            </div>
          </motion.div>

          {/* Section 4: Technical & AI */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} style={sectionStyle}>
            <div style={sectionTitleStyle}>
              <div style={{ width: 28, height: 28, background: 'rgba(245,158,11,0.15)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Cpu size={14} color="#f59e0b" />
              </div>
              Technical &amp; AI Alignment
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <FormField label="AI Tool Proficiency" icon={Cpu}>
                <textarea required name="aiProficiency" value={formData.aiProficiency} onChange={handleChange}
                  onFocus={handleFocus} onBlur={handleBlur}
                  style={{ ...inputStyle, minHeight: '72px', resize: 'vertical' }}
                  placeholder="How do you use ChatGPT, Claude, Copilot etc. in your workflow?" />
              </FormField>
              <FormField label="Problem Solving Scenario" icon={Target}>
                <textarea required name="problemSolving" value={formData.problemSolving} onChange={handleChange}
                  onFocus={handleFocus} onBlur={handleBlur}
                  style={{ ...inputStyle, minHeight: '72px', resize: 'vertical' }}
                  placeholder="A plugin is throwing errors and you have 1 hour until deadline. What's your first step?" />
              </FormField>
            </div>
          </motion.div>

          {/* Section 5: Availability & Expectations */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={sectionStyle}>
            <div style={sectionTitleStyle}>
              <div style={{ width: 28, height: 28, background: 'rgba(52,211,153,0.15)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={14} color="#34d399" />
              </div>
              Availability &amp; Expectations
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
              <FormField label="Weekly Availability" icon={Clock}>
                <input required name="availability" value={formData.availability} onChange={handleChange}
                  onFocus={handleFocus} onBlur={handleBlur}
                  style={inputStyle} placeholder="Full-time / 20hrs/week..." />
              </FormField>
              <FormField label="High-Pressure Work" icon={Zap}>
                <div style={{ position: 'relative' }}>
                  <select required name="pressureHandling" value={formData.pressureHandling} onChange={handleChange}
                    onFocus={handleFocus} onBlur={handleBlur}
                    style={{ ...inputStyle, appearance: 'none', paddingRight: '34px', cursor: 'pointer' }}>
                    <option value="" style={{ background: '#111' }}>Select...</option>
                    <option value="Ready" style={{ background: '#111' }}>Ready for it</option>
                    <option value="Maybe" style={{ background: '#111' }}>Depends on project</option>
                  </select>
                  <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', pointerEvents: 'none' }} />
                </div>
              </FormField>
              <FormField label="Expected Monthly Salary" icon={DollarSign}>
                <input required name="salary" value={formData.salary} onChange={handleChange}
                  onFocus={handleFocus} onBlur={handleBlur}
                  style={inputStyle} placeholder="PKR / USD expectation" />
              </FormField>
              <FormField label="Notice Period / Join Date" icon={Clock}>
                <input required name="noticePeriod" value={formData.noticePeriod} onChange={handleChange}
                  onFocus={handleFocus} onBlur={handleBlur}
                  style={inputStyle} placeholder="Immediately / 1 week..." />
              </FormField>
            </div>
          </motion.div>

          {/* Section 6: Critical Thinking */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} style={sectionStyle}>
            <div style={sectionTitleStyle}>
              <div style={{ width: 28, height: 28, background: 'rgba(167,139,250,0.15)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageSquare size={14} color="#a78bfa" />
              </div>
              Critical Thinking
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <FormField label="Why TimelinePlus?" icon={Target}>
                <textarea required name="whyUs" value={formData.whyUs} onChange={handleChange}
                  onFocus={handleFocus} onBlur={handleBlur}
                  style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                  placeholder="What draws you to our agency specifically?" />
              </FormField>
              <FormField label="Building Long-Term Client Trust" icon={MessageSquare}>
                <textarea required name="clientRelationship" value={formData.clientRelationship} onChange={handleChange}
                  onFocus={handleFocus} onBlur={handleBlur}
                  style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                  placeholder="What's the single most important thing in building lasting client relationships?" />
              </FormField>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '15px 24px',
                background: isSubmitting
                  ? 'rgba(255,255,255,0.1)'
                  : 'linear-gradient(135deg, #ff6600 0%, #ff9500 100%)',
                border: 'none',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '0.95rem',
                fontWeight: 700,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: isSubmitting ? 'none' : '0 8px 25px rgba(255,102,0,0.35)',
                transition: 'all 0.2s',
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => { if (!isSubmitting) e.target.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.target.style.transform = 'none'; }}
            >
              {isSubmitting ? (
                <>Submitting...</>
              ) : (
                <><Send size={16} /> Submit Application</>
              )}
            </button>
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem', marginTop: '10px' }}>
              After submission you'll be redirected to WhatsApp to confirm your application.
            </p>
          </motion.div>

        </form>
      </div>
    </div>
  );
}
