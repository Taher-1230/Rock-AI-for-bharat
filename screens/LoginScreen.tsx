import React from 'react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { ScreenName, UserProfile } from '../types';
import { Button } from '../components/Button';
import { t } from '../translations';

interface Props {
  onNavigate: (screen: ScreenName) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  userProfile: UserProfile;
}

export default function LoginScreen({ onNavigate, updateProfile, userProfile }: Props) {
  const [mobile, setMobile] = React.useState('');
  const lang = userProfile.language;

  const handleSendOTP = () => {
    if (mobile.length === 10) {
      updateProfile({ mobile });
      onNavigate(ScreenName.PROFILE_METHOD);
    }
  };

  return (
    <div className="flex flex-col h-full px-6 pb-6 bg-surface">
      <div className="py-4">
        <button onClick={() => onNavigate(ScreenName.WELCOME)} className="p-2 -ml-2 rounded-full hover:bg-slate-100">
          <ArrowLeft className="w-6 h-6 text-slate-800" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center pt-4">
        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
          <ShieldCheck className="w-8 h-8 text-primary" fill="currentColor" fillOpacity={0.2} />
        </div>
        <h1 className="text-2xl font-bold text-primary mb-8">JanSaarthi</h1>

        <div className="w-full space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">{t('loginTitle', lang)}</h2>
            <p className="text-slate-500 text-sm">{t('loginSubtitle', lang)}</p>
          </div>

          <div className="relative group">
            <div className="flex w-full bg-white border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all shadow-sm">
              <div className="bg-slate-50 px-4 py-4 border-r border-slate-200 flex items-center gap-2">
                <img src="https://flagcdn.com/w40/in.png" alt="India" className="w-6 h-4 rounded-sm" />
                <span className="font-semibold text-slate-700">+91</span>
              </div>
              <input
                type="tel"
                maxLength={10}
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                placeholder="00000 00000"
                className="flex-1 px-4 py-4 bg-transparent outline-none text-lg font-medium text-slate-900 placeholder:text-slate-300 tracking-wide"
                autoFocus
              />
            </div>
          </div>

          <Button onClick={handleSendOTP} icon className={mobile.length !== 10 ? 'opacity-50 cursor-not-allowed' : ''}>
            {t('sendOtp', lang)}
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 py-4 bg-green-50 rounded-full border border-green-100">
        <ShieldCheck className="w-4 h-4 text-green-600" />
        <span className="text-xs font-medium text-green-800 text-center">{t('secureData', lang)}</span>
      </div>
    </div>
  );
}