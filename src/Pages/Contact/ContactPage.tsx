import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';
import { PageHero } from '../../Components/ui/PageHero';
import { SectionTitle } from '../../Components/ui/SectionTitle';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // API Call logic can be added here
    setIsSubmitted(true);
  };

  return (
    <div className="bg-cream-100 page-top dark:bg-navy-900 min-h-screen pb-16">
      
     
      

      {/* 2. Main Page Content Container */}
      <div className="container-lh">
        
        {/* Section Header */}
        <div className="mt-12 mb-8">
          <SectionTitle
            eyebrow="Contact Channels"
            badge={true}
            align="center"
            title="Reach Out to Our Team"
            subtitle="Choose your preferred way to connect with us for fast support and assistance."
          />
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="group relative h-full overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-card dark:border-white/10 dark:bg-navy-900 dark:hover:border-primary/40 dark:hover:bg-navy-800 flex flex-col items-start">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white group-hover:shadow-glow">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-extrabold text-navy-950 dark:text-white text-base">Call Us</h3>
            <p className="text-xs text-navy-500 dark:text-navy-300 mt-1 mb-3">Mon-Sun, 24/7 Dispatch</p>
            <a href="tel:08001234567" className="text-sm font-bold text-primary hover:underline mt-auto">
              0800 123 4567
            </a>
          </div>

          <div className="group relative h-full overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-card dark:border-white/10 dark:bg-navy-900 dark:hover:border-primary/40 dark:hover:bg-navy-800 flex flex-col items-start">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white group-hover:shadow-glow">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-extrabold text-navy-950 dark:text-white text-base">Email Us</h3>
            <p className="text-xs text-navy-500 dark:text-navy-300 mt-1 mb-3">We reply within 2 hours</p>
            <a href="mailto:support@localhero.com" className="text-sm font-bold text-primary hover:underline mt-auto">
              support@localhero.com
            </a>
          </div>

          <div className="group relative h-full overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-card dark:border-white/10 dark:bg-navy-900 dark:hover:border-primary/40 dark:hover:bg-navy-800 flex flex-col items-start">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white group-hover:shadow-glow">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-extrabold text-navy-950 dark:text-white text-base">Headquarters</h3>
            <p className="text-xs text-navy-500 dark:text-navy-300 mt-1 mb-3">London HQ Office</p>
            <span className="text-xs font-bold text-navy-800 dark:text-navy-200 mt-auto">
              100 Bishopsgate, London, EC2N 4AG
            </span>
          </div>

          <div className="group relative h-full overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-card dark:border-white/10 dark:bg-navy-900 dark:hover:border-primary/40 dark:hover:bg-navy-800 flex flex-col items-start">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white group-hover:shadow-glow">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-extrabold text-navy-950 dark:text-white text-base">Support Hours</h3>
            <p className="text-xs text-navy-500 dark:text-navy-300 mt-1 mb-3">Emergency Response</p>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-auto flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> 24/7 Active
            </span>
          </div>
        </div>

        {/* Main Section: Contact Form & Info */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form (7 Cols) */}
          <div className="lg:col-span-7 group relative h-full overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 sm:p-10 shadow-soft transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-card dark:border-white/10 dark:bg-navy-900 dark:hover:border-primary/40 dark:hover:bg-navy-800">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            {isSubmitted ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-heading text-2xl font-extrabold text-navy-950 dark:text-white">
                  Message Received!
                </h3>
                <p className="text-sm text-navy-500 dark:text-navy-300 max-w-md mx-auto">
                  Thank you for reaching out to LocalHero. One of our support representatives will review your message and get back to you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
                  }}
                  className="btn btn-primary px-6 py-3 mt-4"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h3 className="font-heading text-xl font-extrabold text-navy-950 dark:text-white mb-1">
                    Send Us a Message
                  </h3>
                  <p className="text-xs text-navy-500 dark:text-navy-300">
                    Fill out the form below and we'll reply as soon as possible.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-heading font-bold uppercase text-navy-700 dark:text-navy-200 mb-1.5">
                      Your Name <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-lh"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-heading font-bold uppercase text-navy-700 dark:text-navy-200 mb-1.5">
                      Email Address <span className="text-primary">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. sarah@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-lh"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-heading font-bold uppercase text-navy-700 dark:text-navy-200 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 07700 900123"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="input-lh"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-heading font-bold uppercase text-navy-700 dark:text-navy-200 mb-1.5">
                      Subject
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="input-lh"
                    >
                      <option>General Inquiry</option>
                      <option>Booking Support</option>
                      <option>Trade Pro Application</option>
                      <option>Billing & Payment</option>
                      <option>Report an Issue</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold uppercase text-navy-700 dark:text-navy-200 mb-1.5">
                    Message <span className="text-primary">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can we help you today?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="input-lh resize-none"
                  />
                </div>

                <button type="submit" className="btn btn-primary px-8 py-4 text-base w-full sm:w-auto flex items-center justify-center">
                  <Send className="w-4 h-4 mr-2" /> Send Message
                </button>
              </form>
            )}
          </div>

          {/* Right Sidebar / Map & Support (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Live Map / Address Placeholder */}
            <div className="group relative h-full overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-card dark:border-white/10 dark:bg-navy-900 dark:hover:border-primary/40 dark:hover:bg-navy-800">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <h4 className="font-heading font-extrabold text-navy-950 dark:text-white text-base mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" /> UK Service Coverage
              </h4>
              <p className="text-xs text-navy-500 dark:text-navy-300 leading-relaxed mb-4">
                Our vetted tradespeople operate across Greater London, Manchester, Birmingham, Leeds, Glasgow, and all major UK postcode sectors.
              </p>
              
              {/* Map Container Placeholder */}
              <div className="w-full h-48 rounded-2xl bg-neutral-100 dark:bg-navy-800 border border-neutral-200 dark:border-white/10 overflow-hidden relative flex items-center justify-center">
                <iframe
                  title="LocalHero Office Location"
                  className="w-full h-full border-0 grayscale opacity-80 dark:opacity-60"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2482.8906757132924!2d-0.08331182337943232!3d51.51522020945903!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761cb28be931bd%3A0x8673a559864440c9!2s100%20Bishopsgate!5e0!3m2!1sen!2suk!4v1700000000000!5m2!1sen!2suk"
                  loading="lazy"
                ></iframe>
              </div>
            </div>

            {/* Quick FAQ Box */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-navy-800 dark:to-navy-900 border border-primary/20 rounded-3xl p-6 space-y-4">
              <h4 className="font-heading font-extrabold text-navy-950 dark:text-white text-base flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" /> Frequently Asked Questions
              </h4>
              <div className="space-y-3 text-xs">
                <div>
                  <h5 className="font-bold text-navy-900 dark:text-white">How quickly can a pro arrive?</h5>
                  <p className="text-navy-500 dark:text-navy-300 mt-0.5">Emergency bookings arrive within ~45 minutes across major UK cities.</p>
                </div>
                <div className="border-t border-neutral-200/60 dark:border-white/10 pt-2.5">
                  <h5 className="font-bold text-navy-900 dark:text-white">Are tradespeople insured?</h5>
                  <p className="text-navy-500 dark:text-navy-300 mt-0.5">Yes, every hero carries up to £2,000,000 public liability insurance.</p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};