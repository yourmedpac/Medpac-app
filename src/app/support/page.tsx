import React from 'react';

export const metadata = {
  title: 'Support Center | Medpac Health OS',
  description: 'Find answers, read FAQs, learn about report analysis, or contact our support team at support@medpac.in.',
};

export default function SupportCenter() {
  const faqs = [
    {
      q: 'How does the AI Report Analyzer work?',
      a: 'When you upload a PDF or image of a medical report, our secure AI parser reads the text, identifies key biomarkers (like Hemoglobin, Fasting Blood Glucose, TSH), compares them to normal clinical ranges, and produces a summary and dashboard visualization. No clinical decisions should be based solely on this.'
    },
    {
      q: 'Is my health data secure and HIPAA-compliant?',
      a: 'Yes. Medpac encrypts all data in transit using TLS 1.3 and at rest using AES-256. User credentials and session tokens are isolated in secure hardware keychains on mobile, and the backend validates all authorizations using standard JWT mechanisms.'
    },
    {
      q: 'How do I schedule a doctor consultation?',
      a: 'Go to the Consultations section on your Home Screen or navigation bar, select a medical specialty, and choose a time slot. You will be connected via a secure, encrypted voice/video channel.'
    },
    {
      q: 'Can I manage health records for my family members?',
      a: 'Yes. In the Profile tab, select "My Family" where you can add dependent profiles. You can switch between profiles to manage their vitals telemetry, pill reminders, and medical archives.'
    },
    {
      q: 'Who do I contact for feedback or issues?',
      a: 'Please email us directly at support@medpac.in. Our team is available 24/7 to help resolve any billing, login, or technical issues.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#151c27] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Banner Card */}
        <div className="bg-gradient-to-br from-[#006b59] to-[#0ba68c] text-white rounded-2xl p-8 sm:p-12 shadow-sm border border-emerald-600 relative overflow-hidden">
          <div className="relative z-10 max-w-xl">
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">Medpac Support Center</h1>
            <p className="text-emerald-50 text-base sm:text-lg mb-6">
              Need help managing your health files, setting up pill reminders, or syncing your wearable devices? We are here for you.
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="mailto:support@medpac.in" 
                className="bg-white text-[#006b59] hover:bg-emerald-50 px-6 py-3 rounded-xl font-bold text-sm transition shadow-sm"
              >
                Email support@medpac.in
              </a>
              <a 
                href="/privacy" 
                className="bg-transparent border border-emerald-200 hover:border-white hover:bg-emerald-800/20 px-6 py-3 rounded-xl font-semibold text-sm transition"
              >
                Read Privacy Terms
              </a>
            </div>
          </div>
          {/* Subtle background decoration */}
          <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-12 translate-y-12 select-none">
            <svg className="w-80 h-80" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
            </svg>
          </div>
        </div>

        {/* FAQs list */}
        <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-sm border border-slate-100">
          <h2 className="text-2xl font-bold mb-8 text-[#151c27]">Frequently Asked Questions</h2>
          <div className="space-y-8">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                <h3 className="text-lg font-semibold text-[#151c27] mb-2 flex items-start gap-2">
                  <span className="text-[#006b59] font-bold">Q.</span>
                  {faq.q}
                </h3>
                <p className="text-slate-600 leading-relaxed pl-6 text-sm">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-[#f0fdfa] text-[#006b59] rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-[#151c27] mb-1">Email Inquiry</h4>
              <p className="text-slate-500 text-xs mb-2">Typically responds within 2-4 hours</p>
              <a href="mailto:support@medpac.in" className="text-sm font-semibold text-[#006b59] hover:underline">
                support@medpac.in
              </a>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-[#f0fdfa] text-[#006b59] rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-[#151c27] mb-1">Operation Hours</h4>
              <p className="text-slate-500 text-xs mb-2">Technical and clinical support</p>
              <p className="text-sm font-semibold text-slate-700">
                24 hours a day, 7 days a week
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
