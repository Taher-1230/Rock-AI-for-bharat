import React, { useState, useEffect, useRef } from 'react';
import { ScreenName, UserProfile, Scheme } from '../types';
import { Bell, Search, FileText, History, ArrowRight, Home, Bookmark, User, Lightbulb, Loader2, CheckCircle, MapPin, Briefcase, IndianRupee, Users, LogOut, Edit3, X, Camera } from 'lucide-react';
import { generateSchemes } from '../services/ai';
import { t } from '../translations';

interface Props {
  onNavigate: (screen: ScreenName) => void;
  userProfile: UserProfile;
  schemes: Scheme[];
  setSchemes: (schemes: Scheme[]) => void;
  setSelectedScheme: (scheme: Scheme) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
}

type Tab = 'home' | 'browse' | 'saved' | 'profile';

export default function DashboardScreen({ onNavigate, userProfile, schemes, setSchemes, setSelectedScheme, updateProfile }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [savedSchemeIds, setSavedSchemeIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const lang = userProfile.language;

  useEffect(() => {
    if (schemes.length === 0) {
      const fetchSchemes = async () => {
        setIsLoading(true);
        try {
          const results = await generateSchemes(userProfile);
          setSchemes(results);
        } catch (e) {
          console.error(e);
        } finally {
          setIsLoading(false);
        }
      };
      fetchSchemes();
    }
  }, []);

  const toggleSave = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSavedSchemeIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleSchemeClick = (scheme: Scheme) => {
    setSelectedScheme(scheme);
    onNavigate(ScreenName.SCHEME_DETAILS);
  };

  // --- Helpers for Formatting ---
  const formatIncome = (value?: string) => {
    if (!value) return 'Not provided';
    switch(value) {
      case 'low': return 'Below ₹2.5 Lakh';
      case 'mid_low': return '₹2.5L - ₹5L';
      case 'mid_high': return '₹5L - ₹8L';
      case 'high': return 'Above ₹8L';
      default: return value;
    }
  };

  const formatAge = (value?: string) => {
    if (!value) return 'Not provided';
    return value.replace(/_/g, ' - ').replace('under', 'Under').replace('above', 'Above');
  };

  // --- Sub-components for tabs ---

  const SchemeCard: React.FC<{ scheme: Scheme }> = ({ scheme }) => {
    const isSaved = savedSchemeIds.has(scheme.id);
    return (
      <div 
        onClick={() => handleSchemeClick(scheme)}
        className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group active:scale-[0.99] transition-transform cursor-pointer"
      >
        <div className="h-1 w-full bg-gradient-to-r from-secondary to-orange-500"></div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-green-200">
              <CheckCircle className="w-3 h-3" /> {t('eligible', lang)}
            </span>
            <button 
              onClick={(e) => toggleSave(e, scheme.id)}
              className={`p-1.5 rounded-full transition-colors ${isSaved ? 'text-primary bg-primary/5' : 'text-slate-300 hover:text-primary hover:bg-slate-50'}`}
            >
              <Bookmark className="w-5 h-5" fill={isSaved ? "currentColor" : "none"} />
            </button>
          </div>
          
          <h3 className="text-base font-bold text-slate-900 mb-1 line-clamp-2 leading-snug">{scheme.title}</h3>
          <p className="text-slate-500 text-xs mb-3 line-clamp-2">{scheme.description}</p>
          
          <div className="flex items-center justify-between border-t border-slate-100 pt-3">
             <span className="text-xs font-semibold text-slate-600 bg-slate-50 px-2 py-1 rounded">{scheme.benefitType}</span>
             <span className="text-primary text-xs font-bold flex items-center gap-1">
               {t('viewDetails', lang)} <ArrowRight className="w-3 h-3" />
             </span>
          </div>
        </div>
      </div>
    );
  };

  const RenderHome = () => {
    const featuredScheme = schemes.length > 0 ? schemes[0] : null;
    return (
      <div className="px-6 pt-6 pb-24 animate-in fade-in duration-300">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">{t('namaste', lang)}, {userProfile.name.split(' ')[0]}</h2>
        </div>

        {/* Hero Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-[#1a5a8a] shadow-xl shadow-primary/20 mb-8 p-6 text-white">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                {isLoading ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <Search className="w-6 h-6 text-white" />}
              </div>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">Verified Citizen</span>
            </div>
            
            <h3 className="text-2xl font-bold mb-2">
              {isLoading ? t('analyzingTitle', lang) : t('unlockBenefits', lang)}
            </h3>
            
            <p className="text-blue-100 text-sm mb-6 max-w-[85%]">
               {isLoading ? t('analyzingDesc', lang) : t('schemesFound', lang, { count: schemes.length })}
            </p>
            
            <button 
              onClick={() => setActiveTab('browse')}
              disabled={isLoading}
              className={`w-full bg-white text-primary font-bold py-3.5 rounded-xl shadow-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>Analyzing <Loader2 className="w-4 h-4 animate-spin ml-1" /></>
              ) : (
                <>{t('viewSchemes', lang, { count: schemes.length })} <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 active:bg-slate-50">
            <div className="bg-orange-50 p-2 rounded-lg">
              <FileText className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-xs font-semibold text-slate-700">{t('documents', lang)}</span>
          </button>
          <button className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 active:bg-slate-50">
            <div className="bg-green-50 p-2 rounded-lg">
              <History className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-xs font-semibold text-slate-700">{t('history', lang)}</span>
          </button>
        </div>

        {/* Featured Scheme */}
        {featuredScheme && !isLoading && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900">{t('topRec', lang)}</h3>
              <button onClick={() => setActiveTab('browse')} className="text-sm font-semibold text-primary">{t('viewAll', lang)}</button>
            </div>
            <div 
              onClick={() => handleSchemeClick(featuredScheme)}
              className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex gap-4 active:scale-[0.99] transition-transform cursor-pointer"
            >
              <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                <Home className="w-6 h-6 text-slate-500" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{featuredScheme.title}</h4>
                  <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{t('eligible', lang)}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">{featuredScheme.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tip */}
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex gap-3 mb-6">
          <Lightbulb className="w-5 h-5 text-orange-500 flex-shrink-0" />
          <div>
            <h5 className="text-sm font-bold text-slate-900">{t('didYouKnow', lang)}</h5>
            <p className="text-xs text-slate-600 mt-1">{t('tip', lang)}</p>
          </div>
        </div>
      </div>
    );
  };

  const RenderBrowse = () => {
    const filteredSchemes = schemes.filter(s => 
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="flex flex-col h-full animate-in fade-in duration-300">
        <div className="px-6 py-4 sticky top-0 bg-surface z-10 space-y-4">
          <div className="flex justify-between items-end">
            <h2 className="text-2xl font-bold text-slate-900">{t('browse', lang)}</h2>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">{schemes.length} {t('found', lang)}</span>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search schemes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-24 space-y-4 no-scrollbar">
          {filteredSchemes.length > 0 ? (
            filteredSchemes.map(scheme => <SchemeCard key={scheme.id} scheme={scheme} />)
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium">No schemes found</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const RenderSaved = () => {
    const savedSchemes = schemes.filter(s => savedSchemeIds.has(s.id));
    
    return (
      <div className="flex flex-col h-full animate-in fade-in duration-300">
        <div className="px-6 py-4 sticky top-0 bg-surface z-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-1">{t('saved', lang)}</h2>
          <p className="text-sm text-slate-500">{savedSchemes.length} schemes saved for later</p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-24 space-y-4 no-scrollbar">
          {savedSchemes.length > 0 ? (
            savedSchemes.map(scheme => <SchemeCard key={scheme.id} scheme={scheme} />)
          ) : (
            <div className="flex flex-col items-center justify-center h-[60%] text-center px-8">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <Bookmark className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">No saved schemes yet</h3>
              <p className="text-slate-500 text-sm mb-6">Bookmark schemes you want to apply for later to see them here.</p>
              <button 
                onClick={() => setActiveTab('browse')}
                className="px-6 py-3 bg-primary text-white rounded-xl font-semibold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-colors"
              >
                Browse Schemes
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const RenderProfile = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          updateProfile({ profileImage: reader.result as string });
        };
        reader.readAsDataURL(file);
      }
    };

    const ProfileItem = ({ icon: Icon, label, value }: any) => (
      <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-slate-100">
        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-slate-500" strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wide mb-1">{label}</p>
          <p className="text-slate-900 font-semibold text-sm truncate">{value || 'Not provided'}</p>
        </div>
      </div>
    );

    return (
      <div className="flex flex-col h-full animate-in fade-in duration-300 bg-white">
        <div className="px-6 py-8 pb-24 overflow-y-auto no-scrollbar">
          <div className="flex flex-col items-center mb-10">
            <div className="relative mb-4 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              {userProfile.profileImage ? (
                <img src={userProfile.profileImage} alt="Profile" className="w-28 h-28 rounded-full border-4 border-slate-50 shadow-xl object-cover" />
              ) : (
                <div className="w-28 h-28 rounded-full bg-slate-100 flex items-center justify-center border-4 border-slate-50 shadow-xl text-slate-300">
                  <User className="w-12 h-12" />
                </div>
              )}
              <div className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full border-4 border-white shadow-md transition-transform group-hover:scale-110">
                <Edit3 className="w-4 h-4" />
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
              />
            </div>
            
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{userProfile.name}</h2>
            <div className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-100 shadow-sm">
               <CheckCircle className="w-3.5 h-3.5" />
               <span className="text-xs font-bold">Verified Citizen</span>
            </div>
          </div>

          <div className="w-full mb-6">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 ml-1">Personal Details</h3>
            <div className="flex flex-col gap-3">
              <ProfileItem 
                icon={MapPin} 
                label="Location" 
                value={`${userProfile.district || ''}${userProfile.district && userProfile.state ? ', ' : ''}${userProfile.state || ''}`} 
              />
              <ProfileItem 
                icon={Briefcase} 
                label="Occupation" 
                value={userProfile.occupation} 
              />
              <ProfileItem 
                icon={Users} 
                label="Category" 
                value={userProfile.category} 
              />
              <ProfileItem 
                icon={IndianRupee} 
                label="Income Group" 
                value={formatIncome(userProfile.income)} 
              />
              <ProfileItem 
                icon={User} 
                label="Age Range" 
                value={formatAge(userProfile.ageRange)} 
              />
            </div>
          </div>

          <button 
            onClick={() => {
              localStorage.removeItem('janSaarthi_profile');
              localStorage.removeItem('janSaarthi_schemes');
              window.location.reload();
            }}
            className="w-full p-4 text-red-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-50 transition-colors mt-4"
          >
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-surface relative">
      {/* Header - Only for Home. Browse/Saved/Profile have their own headers or layout */}
      {activeTab === 'home' && (
        <header className="px-6 py-4 bg-white sticky top-0 z-20 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="font-bold text-primary text-xs">JS</span>
            </div>
            <h1 className="text-lg font-bold text-primary">JanSaarthi</h1>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('profile')}
              className="relative transition-transform active:scale-95 group"
            >
              {userProfile.profileImage ? (
                  <img src={userProfile.profileImage} alt="Profile" className="w-10 h-10 rounded-full border-2 border-slate-100 shadow-sm object-cover group-hover:border-primary/20 transition-colors" />
              ) : (
                  <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-slate-50 shadow-sm flex items-center justify-center text-slate-400 group-hover:border-primary/20 transition-colors">
                    <User className="w-6 h-6" />
                  </div>
              )}
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </button>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        {activeTab === 'home' && <RenderHome />}
        {activeTab === 'browse' && <RenderBrowse />}
        {activeTab === 'saved' && <RenderSaved />}
        {activeTab === 'profile' && <RenderProfile />}
      </main>

      {/* Bottom Nav */}
      <nav className="absolute bottom-0 w-full bg-white border-t border-slate-100 px-6 py-3 flex justify-between items-end pb-6 z-30 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 w-14 transition-colors duration-200 ${activeTab === 'home' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Home className={`w-6 h-6 ${activeTab === 'home' ? 'fill-current' : ''}`} strokeWidth={activeTab === 'home' ? 2 : 2} />
          <span className="text-[10px] font-bold tracking-wide">{t('home', lang)}</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('browse')}
          className={`flex flex-col items-center gap-1 w-14 transition-colors duration-200 ${activeTab === 'browse' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Search className="w-6 h-6" strokeWidth={activeTab === 'browse' ? 2.5 : 2} />
          <span className="text-[10px] font-bold tracking-wide">{t('browse', lang)}</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('saved')}
          className={`flex flex-col items-center gap-1 w-14 transition-colors duration-200 ${activeTab === 'saved' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Bookmark className={`w-6 h-6 ${activeTab === 'saved' ? 'fill-current' : ''}`} strokeWidth={activeTab === 'saved' ? 2 : 2} />
          <span className="text-[10px] font-bold tracking-wide">{t('saved', lang)}</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 w-14 transition-colors duration-200 ${activeTab === 'profile' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <User className={`w-6 h-6 ${activeTab === 'profile' ? 'fill-current' : ''}`} strokeWidth={activeTab === 'profile' ? 2 : 2} />
          <span className="text-[10px] font-bold tracking-wide">{t('profile', lang)}</span>
        </button>
      </nav>
    </div>
  );
}