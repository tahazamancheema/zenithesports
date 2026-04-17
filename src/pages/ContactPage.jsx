import React, { useState } from 'react';
import { MessageCircle, Mail, Clock, MapPin, Send } from 'lucide-react';
import GhostInput from '../components/ui/GhostInput';
import GradientButton from '../components/ui/GradientButton';
import toast from 'react-hot-toast';

const CONTACT_INFO = [
  {
    icon: MessageCircle,
    label: 'WHATSAPP',
    value: '+92 339 0715753',
    sub: 'Fastest response — usually within 1 hour',
    href: 'https://wa.me/923390715753',
    cta: 'Message on WhatsApp',
  },
  {
    icon: MapPin,
    label: 'LOCATION',
    value: 'Pakistan',
    sub: 'Pakistan',
    href: null,
    cta: null,
  },
  {
    icon: Clock,
    label: 'SUPPORT HOURS',
    value: 'Mon – Sun',
    sub: '12:00 PM – 2:00 AM PKT',
    href: null,
    cta: null,
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  function setField(field, val) { setForm((f) => ({ ...f, [field]: val })); }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSending(true);
    // WhatsApp fallback — compose a wa.me message
    const text = encodeURIComponent(
      `*ZENITH ESPORTS CONTACT*\n\nName: ${form.name}\nEmail: ${form.email}\nSubject: ${form.subject || 'General Inquiry'}\n\nMessage:\n${form.message}`
    );
    window.open(`https://wa.me/923390715753?text=${text}`, '_blank');
    toast.success('Opening WhatsApp with your message!');
    setSending(false);
    setForm({ name: '', email: '', subject: '', message: '' });
  }

  return (
    <div className="min-h-screen bg-[#131313] pt-20 animate-page-enter">

      {/* Hero */}
      <section className="py-24 px-6 md:px-12 bg-[#1b1b1b] relative overflow-hidden">
        <div className="absolute inset-0 opacity-8"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&q=80&fm=webp')", backgroundSize: 'cover' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1b1b1b] to-transparent" />
        <div className="relative z-10">
          <span className="font-stretch text-[#f9d07a] text-[10px] tracking-[0.4em] block mb-4">GET IN TOUCH</span>
          <h1 className="font-agency text-7xl md:text-8xl font-black italic tracking-tighter leading-none mb-6">
            CONTACT <span className="zenith-gradient-text">COMMAND</span>
          </h1>
          <p className="text-[#d1c5b3] opacity-60 max-w-xl text-base leading-relaxed">
            Questions about registration? Tournament disputes? Business partnerships? We're here — reach us directly on WhatsApp for the fastest response.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">

          {/* Contact info cards */}
          <div className="lg:col-span-4 space-y-4">
            {CONTACT_INFO.map(({ icon: Icon, label, value, sub, href, cta }) => (
              <div key={label} className="bg-[#1f1f1f] p-8 border-l-4 border-[#dbb462]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-[#2a2a2a] flex items-center justify-center">
                    <Icon size={16} className="text-[#f9d07a]" />
                  </div>
                  <span className="font-stretch text-[9px] tracking-widest text-[#f9d07a]">{label}</span>
                </div>
                <p className="font-agency text-xl font-bold mb-1">{value}</p>
                <p className="text-[#d1c5b3] opacity-50 text-xs mb-4">{sub}</p>
                {href && cta && (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-stretch text-[9px] tracking-widest text-[#dbb462] hover:opacity-70 transition-opacity flex items-center gap-2"
                  >
                    {cta} →
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Contact form */}
          <div className="lg:col-span-8">
            <div className="bg-[#1f1f1f] p-10">
              <h2 className="font-agency text-3xl font-bold italic tracking-tight mb-2">SEND A MESSAGE</h2>
              <p className="font-stretch text-[9px] tracking-widest text-[#d1c5b3] opacity-40 mb-10">
                YOUR MESSAGE WILL BE SENT VIA WHATSAPP
              </p>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <GhostInput
                    id="contact-name"
                    label="Your Name"
                    placeholder="Muhammad Ahmed"
                    value={form.name}
                    onChange={(e) => setField('name', e.target.value)}
                    required
                  />
                  <GhostInput
                    id="contact-email"
                    type="email"
                    label="Email Address"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setField('email', e.target.value)}
                    required
                  />
                </div>

                <GhostInput
                  id="contact-subject"
                  label="Subject"
                  placeholder="e.g. Registration Issue / Tournament Query"
                  value={form.subject}
                  onChange={(e) => setField('subject', e.target.value)}
                />

                <div className="space-y-1">
                  <label className="font-stretch text-[9px] tracking-widest text-[#d1c5b3] uppercase block">
                    Message <span className="text-[#f9d07a]">*</span>
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setField('message', e.target.value)}
                    placeholder="Describe your issue or query in detail..."
                    rows={6}
                    required
                    className="w-full bg-[#131313] border-b border-[rgba(78,70,56,0.3)] pt-3 pb-2 text-sm text-[#e2e2e2] placeholder:text-[#4e4638] focus:outline-none focus:border-b-[#f9d07a] transition-colors resize-none"
                  />
                </div>

                <GradientButton type="submit" size="lg" disabled={sending} icon={Send}>
                  {sending ? 'OPENING WHATSAPP...' : 'SEND VIA WHATSAPP'}
                </GradientButton>
              </form>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
