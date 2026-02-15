import React from 'react';
import { ScreenName, Scheme, UserProfile } from '../types';
import { ArrowLeft, Share2, CheckCircle, ShieldCheck, IndianRupee, Wallet, Landmark, FileText, Smartphone, Fingerprint, ExternalLink, XCircle, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import { t } from '../translations';

interface Props {
  onNavigate: (screen: ScreenName) => void;
  scheme: Scheme | null;
  userProfile: UserProfile;
}

export default function SchemeDetailsScreen({ onNavigate, scheme, userProfile }: Props) {
  if (!scheme) return null;
  const lang = userProfile.language;

  return (
    <div className="flex flex-col h-full bg-surface">
      <header className="bg-white sticky top-0 z-50 px-4 pt-4 pb-4 flex items-center justify-between border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate(ScreenName.RECOMMENDATIONS)} className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-6 h-6 text-slate-800" />
          </button>
          <h1 className="text-lg font-bold text-slate-900 truncate max-w-[200px]">{t('schemeDetails', lang)}</h1>
        </div>
        <div className="flex gap-2">
          <button className="p-2 rounded-full hover:bg-slate-100 text-primary font-bold text-xs">A/अ</button>
          <button className="p-2 rounded-full hover:bg-slate-100 text-primary"><Share2 className="w-5 h-5" /></button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-32">
        {/* Hero */}
        <div className="bg-white p-6 mb-2 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
               <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold mb-2 border border-green-200">
                <CheckCircle className="w-3 h-3" /> {t('verifiedGov', lang)}
              </div>
              <h2 className="text-xl font-bold text-primary leading-tight mb-1">{scheme.title}</h2>
              <p className="text-xs text-slate-500 font-medium">Ministry of Agriculture & Farmers Welfare</p>
            </div>
          </div>
        </div>

        {/* About */}
        <section className="px-4 py-4">
          <h3 className="text-lg font-bold text-slate-900 mb-3">{t('aboutScheme', lang)}</h3>
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <p className="text-slate-600 text-sm leading-relaxed">{scheme.description}</p>
          </div>
        </section>

        {/* Benefits */}
        <section className="px-4 py-2">
          <h3 className="text-lg font-bold text-slate-900 mb-3">{t('benefits', lang)}</h3>
          <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100 space-y-4">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20"><IndianRupee className="w-5 h-5" /></div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">₹6,000 / year</h4>
                <p className="text-xs text-slate-500 mt-0.5">Financial support</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white text-primary flex items-center justify-center flex-shrink-0 shadow-sm border border-slate-100"><Landmark className="w-5 h-5" /></div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Direct Benefit Transfer (DBT)</h4>
                <p className="text-xs text-slate-500 mt-0.5">Funds transferred directly to bank accounts.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Eligibility */}
        <section className="px-4 py-4">
          <h3 className="text-lg font-bold text-slate-900 mb-3">{t('eligibility', lang)}</h3>
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <ul className="space-y-4">
              <li className="flex gap-3 items-start">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-600 leading-snug">Verified Citizen</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Documents */}
        <section className="px-4 py-2 mb-6">
            <h3 className="text-lg font-bold text-slate-900 mb-3">{t('reqDocs', lang)}</h3>
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col items-center justify-center gap-2 text-center">
                    <Fingerprint className="w-6 h-6 text-primary" />
                    <span className="text-xs font-semibold text-slate-700">Aadhaar Card</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col items-center justify-center gap-2 text-center">
                    <FileText className="w-6 h-6 text-primary" />
                    <span className="text-xs font-semibold text-slate-700">Land Records</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col items-center justify-center gap-2 text-center">
                    <Landmark className="w-6 h-6 text-primary" />
                    <span className="text-xs font-semibold text-slate-700">Bank Passbook</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col items-center justify-center gap-2 text-center">
                    <Smartphone className="w-6 h-6 text-primary" />
                    <span className="text-xs font-semibold text-slate-700">Mobile Number</span>
                </div>
            </div>
        </section>
      </main>

      {/* Footer CTA */}
      <div className="absolute bottom-0 left-0 w-full p-4 bg-white border-t border-slate-100 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex gap-3">
             <button className="flex-1 py-3.5 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-700 flex items-center justify-center gap-2">
                <ExternalLink className="w-4 h-4" /> {t('officialWeb', lang)}
             </button>
             <button className="flex-[2] py-3.5 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
                {t('applyNow', lang)} <ArrowRight className="w-4 h-4" />
             </button>
        </div>
      </div>
    </div>
  );
}