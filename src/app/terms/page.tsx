import React from 'react';

export const metadata = {
  title: 'Terms of Service | Medpac Health OS',
  description: 'Terms and conditions governing your use of Medpac Health OS and clinical disclaimers.',
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#151c27] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Header decoration banner */}
        <div className="h-4 bg-gradient-to-r from-[#006b59] to-[#0ba68c]" />
        
        <div className="p-8 sm:p-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="p-2 bg-[#f0fdfa] text-[#006b59] rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </span>
            <h1 className="text-3xl font-extrabold text-[#151c27]">Terms of Service</h1>
          </div>
          
          <p className="text-slate-500 mb-8 text-sm">Last updated: May 20, 2026</p>
          
          <div className="prose prose-slate max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-bold text-[#151c27] mb-3">1. Agreement to Terms</h2>
              <p className="text-slate-600 leading-relaxed">
                By downloading, installing, or accessing Medpac Health OS ("Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you must immediately uninstall and discontinue use of the Service.
              </p>
            </section>

            <section className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-xl">
              <h2 className="text-lg font-bold text-[#b45309] mb-2">🚨 Clinical &amp; Medical Disclaimer</h2>
              <p className="text-amber-800 text-sm leading-relaxed">
                <strong>MEDPAC HEALTH OS IS NOT A REPLACEMENT FOR EMERGENCY MEDICAL CARE OR PROFESSIONAL DIAGNOSIS.</strong> 
                The AI Health Assistant, report summary extractions, and health scoreboards are for informational purposes only. Do not make critical changes to your medication doses or treatment plan based solely on AI suggestions. In case of a medical emergency, call <strong>112</strong> immediately or visit the nearest hospital.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#151c27] mb-3">2. User Accounts &amp; Identity</h2>
              <p className="text-slate-600 leading-relaxed">
                You must provide accurate and verifiable information (including a valid mobile number and email) to create an account. You are solely responsible for:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-2 text-slate-600">
                <li>Maintaining the confidentiality of your secure session token.</li>
                <li>All activities that occur under your patient profile.</li>
                <li>Ensuring that the medical reports you upload belong to you or a family member who has granted you explicit authorization.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#151c27] mb-3">3. Permitted &amp; Prohibited Use</h2>
              <p className="text-slate-600 leading-relaxed">
                You agree not to misuse the Service. Prohibited behaviors include:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-2 text-slate-600">
                <li>Uploading corrupted files, malware, or files exceeding our size restrictions.</li>
                <li>Attempting to bypass security controls or intercept another patient's medical records (IDOR).</li>
                <li>Using our AI systems to generate commercial spam or medical advice leaflets.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#151c27] mb-3">4. Telemedicine &amp; Consultations</h2>
              <p className="text-slate-600 leading-relaxed">
                Medpac facilitates scheduling and connection with licensed third-party doctors. 
                The medical advice, prescriptions, and opinions provided during consultations are the sole responsibility of the consulting physician. Medpac is not liable for any clinical negligence or diagnosis errors made by independent consulting partners.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#151c27] mb-3">5. Intellectual Property</h2>
              <p className="text-slate-600 leading-relaxed">
                The layout designs, illustrations, brand names, and software code of Medpac Health OS are protected by copyright, trademark, and intellectual property laws of India. You may not copy, reverse-engineer, or distribute any part of our platform without prior written consent.
              </p>
            </section>

            <section className="bg-slate-50 p-6 rounded-xl border border-slate-100 mt-8">
              <h2 className="text-lg font-bold text-[#151c27] mb-2">6. Inquiries &amp; Legal Notices</h2>
              <p className="text-slate-600 leading-relaxed text-sm">
                If you have questions regarding these terms, or need to send a legal notice or compliance inquiry, please write to us at:
              </p>
              <div className="mt-4 flex flex-col gap-2 text-sm text-slate-700">
                <p><strong>Email Address:</strong> <a href="mailto:support@medpac.in" className="text-[#006b59] hover:underline font-semibold">support@medpac.in</a></p>
                <p><strong>Corporate Office:</strong> Medpac Health OS, Bangalore, India</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
