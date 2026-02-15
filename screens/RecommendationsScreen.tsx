import React from 'react';
import { ScreenName, Scheme, UserProfile } from '../types';
import { ArrowLeft, Bell, Bookmark, CheckCircle, ArrowRight, User } from 'lucide-react';
import { t } from '../translations';

interface Props {
  onNavigate: (screen: ScreenName) => void;
  setSelectedScheme: (scheme: Scheme) => void;
  schemes: Scheme[];
  userProfile: UserProfile;
}

export default function RecommendationsScreen({ onNavigate, setSelectedScheme, schemes, userProfile }: Props) {
  const lang = userProfile.language;
  
  const handleViewDetails = (scheme: Scheme) => {
    setSelectedScheme(scheme);
    onNavigate(ScreenName.SCHEME_DETAILS);
  };

  return (
    <div className="flex flex-col h-full bg-surface">
      {/* Header */}
      <header className="bg-primary px-4 py-4 pt-12 pb-6 flex items-center justify-between shadow-md z-20">
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate(ScreenName.DASHBOARD)} className="text-white hover:bg-white/10 p-2 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-white font-bold text-lg">JanSaarthi</h1>
            <p className="text-blue-200 text-xs">Government Scheme Assistant</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="text-white hover:bg-white/10 p-2 rounded-full relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full"></span>
          </button>
          
          <div className="w-9 h-9 rounded-full border border-white/30 overflow-hidden bg-white/10 flex items-center justify-center">
            {userProfile.profileImage ? (
                <img src={userProfile.profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
                <User className="w-5 h-5 text-white/80" />
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-24">
        <div className="px-5 pt-6 pb-4">
          <div className="flex justify-between items-end mb-2">
            <h2 className="text-xl font-bold text-primary">{t('recSchemes', lang)}</h2>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">{schemes.length} {t('found', lang)}</span>
          </div>
          <p className="text-slate-500 text-sm">{t('recSubtitle', lang)}</p>
        </div>

        <div className="flex flex-col gap-4 px-4">
          {schemes.length === 0 ? (
             <div className="p-8 text-center text-slate-500">{t('noSchemes', lang)}</div>
          ) : (
            schemes.map((scheme) => (
              <div key={scheme.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group">
                <div className="h-1 w-full bg-gradient-to-r from-secondary to-orange-500"></div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-[10px] font-bold uppercase px-2.5 py-1 rounded-md border border-green-200">
                      <CheckCircle className="w-3 h-3" /> {t('eligible', lang)}
                    </span>
                    <button className="text-slate-400 hover:text-primary">
                      <Bookmark className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <h3 className="text-lg font-bold text-primary mb-1.5">{scheme.title}</h3>
                  <p className="text-slate-600 text-sm mb-5 line-clamp-2">{scheme.description}</p>
                  
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Benefit Type</span>
                      <span className="text-xs font-semibold text-slate-700">{scheme.benefitType}</span>
                    </div>
                    <button 
                      onClick={() => handleViewDetails(scheme)}
                      className="bg-primary hover:bg-primary-dark text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm flex items-center gap-2 transition-colors"
                    >
                      {t('viewDetails', lang)} <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
          
          <div className="text-center py-6">
            <p className="text-xs text-slate-400">
              Don't see what you're looking for? <br/>
              <span className="text-primary underline cursor-pointer">Update your profile</span> to find more.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}