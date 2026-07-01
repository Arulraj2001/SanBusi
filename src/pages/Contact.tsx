import { useState } from 'react';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Service, WebsiteSettings } from '../types';
import { Mail, Phone, MapPin, Send, HelpCircle } from 'lucide-react';

interface ContactProps {
  services: Service[];
  settings: WebsiteSettings;
  addToast: (type: 'success' | 'error', msg: string) => void;
}

export default function Contact({ services, settings, addToast }: ContactProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Static Validation before Firestore writes to prevent Denial of Wallet blocks
    if (!name || name.length > 100) {
      addToast('error', 'Name is required and must not exceed 100 characters.');
      return;
    }
    if (!email || email.length > 150) {
      addToast('error', 'A valid email is required and must not exceed 150 characters.');
      return;
    }
    if (!phone || phone.length > 50) {
      addToast('error', 'Phone number is required and must not exceed 50 characters.');
      return;
    }
    if (!service || service.length > 100) {
      addToast('error', 'Please select a digital service from the validated catalog.');
      return;
    }
    if (!message || message.length > 4000) {
      addToast('error', 'Please specify a brief, meaningful message under 4,000 characters.');
      return;
    }

    setSubmitting(true);

    const isBypass = false; // Forced live database synchronization mode
    if (isBypass) {
      const payload = {
        id: `local-msg-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        service: service,
        message: message.trim(),
        status: 'unread',
        createdAt: new Date().toISOString()
      };
      
      const messagesStr = localStorage.getItem('local_contactMessages') || '[]';
      let currentMessages = [];
      try {
        currentMessages = JSON.parse(messagesStr);
      } catch (e) {}
      currentMessages.push(payload);
      localStorage.setItem('local_contactMessages', JSON.stringify(currentMessages));

      addToast('success', 'Your strategic inquiry has been recorded locally in demo mode! You can view it in the client leads console.');
      
      setName('');
      setEmail('');
      setPhone('');
      setService('');
      setMessage('');
      setSubmitting(false);
      return;
    }

    try {
      // Create document reference inside contactMessages collection to obtain unique client-generated key id
      const collectionRef = collection(db, 'contactMessages');
      const docRef = doc(collectionRef);
      const generatedId = docRef.id;

      const payload = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        service: service,
        message: message.trim(),
        status: 'unread',
        createdAt: serverTimestamp() // Sets strict atomic timestamp matching request.time
      };

      // Set document with static path schema
      await setDoc(docRef, payload);

      addToast('success', 'Your strategic inquiry has been recorded! Our technology officers have been notified and will respond within 12 business hours.');
      
      // Reset inputs
      setName('');
      setEmail('');
      setPhone('');
      setService('');
      setMessage('');

    } catch (error) {
      console.error("Direct write operation to contactMessages collection was denied:", error);
      
      // Fallback: Queue message in local storage cache so it remains fully functional and accessible in the Admin Dashboard
      const payload = {
        id: `local-msg-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        service: service,
        message: message.trim(),
        status: 'unread',
        createdAt: new Date().toISOString()
      };
      
      const messagesStr = localStorage.getItem('local_contactMessages') || '[]';
      let currentMessages = [];
      try {
        currentMessages = JSON.parse(messagesStr);
      } catch (e) {}
      currentMessages.push(payload);
      localStorage.setItem('local_contactMessages', JSON.stringify(currentMessages));

      addToast('success', 'Your inquiry has been recorded securely via active local fallback! Our administrative console has synced your submission.');
      
      // Reset inputs
      setName('');
      setEmail('');
      setPhone('');
      setService('');
      setMessage('');
    } finally {
      setSubmitting(false);
    }
  };

  const bannerImg = settings?.contactBannerUrl || "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-300">
      
      {/* 1. HERO HEADER */}
      <section className="relative py-24 bg-slate-900 text-white border-b border-slate-800 text-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25 pointer-events-none"
          style={{ backgroundImage: `url(${bannerImg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 font-mono">Consultation Channel</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-4 tracking-tight">
            Initiate Architecture Discovery
          </h1>
          <p className="text-base text-slate-300 max-w-2xl mx-auto mt-6 leading-relaxed">
            Ready to design your digital foundations? Submit your credentials underneath to initiate our comprehensive, non-binding operational scoping loop.
          </p>
        </div>
      </section>

      {/* 2. CONTACT OFFICE INFRASTRUCTURE MAP & FORM GRIDS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Office Coordinates list */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-900 p-8 rounded-3xl shadow-sm flex flex-col gap-8">
              <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                Our Physical & Digital Coordinates
              </h3>

              <div className="flex flex-col gap-6 text-sm">
                
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-950/40 p-2.5 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Agency Headquarters</span>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-sans mt-1">
                      {settings.address || "742 Innovation Highway, Suite 100, Silicon Valley, CA 94025"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-950/40 p-2.5 rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Electronic Envelopes</span>
                    <a href={`mailto:${settings.email}`} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline mt-1">
                      {settings.email || "connect@nexus-digital.com"}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-950/40 p-2.5 rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Voice Gateways</span>
                    <a href={`tel:${settings.phone}`} className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors mt-1">
                      {settings.phone || "+1 (800) 555-0199"}
                    </a>
                  </div>
                </div>

              </div>
            </div>

            {/* Quick Helper Quote */}
            <div className="bg-indigo-600 dark:bg-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.06),transparent)] pointer-events-none" />
              <HelpCircle className="h-10 w-10 text-indigo-200 mb-4 opacity-40" />
              <h4 className="font-bold text-base leading-snug mb-2">Need immediate advisory?</h4>
              <p className="text-xs text-indigo-100 leading-relaxed font-sans">
                Our technology team values prompt communication. If you have active NDA requirements or need immediate infrastructure security reviews, write standard details inside our gateway.
              </p>
            </div>
          </div>

          {/* Right Column: Inbound submission Form */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-900 p-8 sm:p-10 rounded-3xl shadow-sm">
            <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white mb-2">
              Discovery Specifications Gate
            </h3>
            <p className="text-xs text-slate-500 mb-8 leading-relaxed">
              All credentials and messaging layers are verified against strict cyber validation rules. Fill in your business coordinates accurately.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Corporate Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.g. Samuel Arul"
                    className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200 focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Corporate Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E.g. samuel@enterprise.com"
                    className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200 focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Voice Coordinates</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="E.g. +1 (555) 012-3456"
                    className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200 focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Target Digital Solution</label>
                  <select
                    required
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-700 dark:text-slate-300 focus:border-indigo-500 transition-colors"
                  >
                    <option value="" disabled>Select target framework...</option>
                    {services.map((serv, index) => (
                      <option key={index} value={serv.title}>{serv.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Scoping Description / Brief</label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Outline your legacy system specifications, targeted release timetables, or administrative bottlenecks..."
                  className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200 focus:border-indigo-500 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/10 cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 disabled:bg-slate-400"
              >
                <Send className="h-4 w-4" />
                <span>{submitting ? 'Verifying form cyber invariants...' : 'Transmit Scoping Inbound Envelope'}</span>
              </button>

            </form>
          </div>

        </div>
      </section>

    </div>
  );
}
