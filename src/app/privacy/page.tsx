import React from 'react';

export const metadata = {
  title: 'Privacy Policy | Medpac Health OS',
  description: 'Learn how Medpac Health OS protects, encrypts, and processes your Protected Health Information (PHI).',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#151c27] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Header decoration banner */}
        <div className="h-4 bg-gradient-to-r from-[#006b59] to-[#0ba68c]" />
        
        <div className="p-8 sm:p-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="p-2 bg-[#f0fdfa] text-[#006b59] rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={2} />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </span>
            <h1 className="text-3xl font-extrabold text-[#151c27]">Privacy Policy</h1>
          </div>
          
          <p className="text-slate-500 mb-8 text-sm">Last updated: May 20, 2026</p>
          
          <div className="prose prose-slate max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-bold text-[#151c27] mb-3">1. Introduction</h2>
              <p className="text-slate-600 leading-relaxed">
                Welcome to Medpac Health OS ("Medpac", "we", "us", or "our"). We are committed to protecting the privacy of your Protected Health Information (PHI) and personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our web platform and mobile application.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#151c27] mb-3">2. Compliance Standards</h2>
              <p className="text-slate-600 leading-relaxed">
                As a premium health operating system handling diagnostic logs, medical records, and digital consultations, Medpac is designed to comply with rigorous industry standards:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-2 text-slate-600">
                <li><strong>HIPAA (Health Insurance Portability and Accountability Act):</strong> For users in relevant jurisdictions, we treat all personal medical records as protected health information and employ administrative, physical, and technical safeguards.</li>
                <li><strong>IT Act 2000 (India):</strong> We comply with the Indian Information Technology Act, 2000, and rules governing Sensitive Personal Data or Information (SPDI).</li>
                <li><strong>GDPR (General Data Protection Regulation):</strong> We implement principles of data minimization, purpose limitation, and user consent for data subjects under EU law.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#151c27] mb-3">3. Data We Collect</h2>
              <p className="text-slate-600 leading-relaxed">
                To provide our health tracking, report analysis, and telemedicine services, we collect:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-2 text-slate-600">
                <li><strong>Profile &amp; Health Survey Details:</strong> Age, weight, height, gender, dietary preferences, sleep hours, activity levels, mood/behavior, family history, and fitness goals.</li>
                <li><strong>Medical Reports &amp; Files:</strong> PDF files and images of diagnostic test reports (e.g., blood tests, prescriptions) that you upload for AI summary extraction.</li>
                <li><strong>Vitals Telemetry Data:</strong> Heart rate, blood pressure, blood glucose, and other telemetry indicators logged by you or connected devices.</li>
                <li><strong>Authentication Info:</strong> Verified mobile number, name, email address, and OAuth tokens (e.g., Google login credentials).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#151c27] mb-3">4. How We Use Your Data</h2>
              <p className="text-slate-600 leading-relaxed">
                We process your data strictly to deliver personal health insights and telemedicine access:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-2 text-slate-600">
                <li>To generate personalized health scoreboards and BMI evaluations.</li>
                <li>To analyze medical reports using secure, dedicated LLM APIs and extract structural biomarkers (e.g., glucose, hemoglobin levels).</li>
                <li>To route your details to authenticated partner doctors during remote consultations.</li>
                <li>To send scheduled pill and refill reminders.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#151c27] mb-3">5. Data Security &amp; Encryption</h2>
              <p className="text-slate-600 leading-relaxed">
                Your medical files and telemetry indicators are stored securely. We enforce:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-2 text-slate-600">
                <li><strong>Encryption in Transit:</strong> All communications between the app and our servers are encrypted using Secure Socket Layer (SSL/TLS 1.3).</li>
                <li><strong>Encryption at Rest:</strong> Database records and physical PDF uploads are encrypted on cloud object storage using AES-256 keys.</li>
                <li><strong>Token Isolation:</strong> Mobile sessions are authenticated using secure, short-lived JSON Web Tokens (JWT) stored in hardware-level secure keychains (`flutter_secure_storage`).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#151c27] mb-3">6. User Rights</h2>
              <p className="text-slate-600 leading-relaxed">
                You retain complete ownership over your health records. You have the right to request:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-2 text-slate-600">
                <li>Access to download all uploaded reports and extracted telemetry logs.</li>
                <li>Correction or updating of survey data.</li>
                <li>Permanent deletion of your Medpac account and all associated health documents from our databases.</li>
              </ul>
            </section>

            <section className="bg-slate-50 p-6 rounded-xl border border-slate-100 mt-8">
              <h2 className="text-lg font-bold text-[#151c27] mb-2">7. Contact &amp; Support</h2>
              <p className="text-slate-600 leading-relaxed text-sm">
                If you have questions about this Privacy Policy, wish to exercise your data rights, or need to contact our Grievance Officer, please reach out to us at:
              </p>
              <div className="mt-4 flex flex-col gap-2 text-sm text-slate-700">
                <p><strong>Email Support:</strong> <a href="mailto:support@medpac.in" className="text-[#006b59] hover:underline font-semibold">support@medpac.in</a></p>
                <p><strong>Official Address:</strong> Medpac Health OS, Bangalore, India</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
