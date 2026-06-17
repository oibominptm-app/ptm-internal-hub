import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ClipboardCheck, 
  ShieldAlert, 
  BarChart3, 
  Users, 
  Newspaper, 
  CalendarDays, 
  Globe, 
  MessageSquareText, 
  Facebook, 
  Youtube, 
  Mail, 
  Settings, 
  ArrowLeft, 
  LogOut, 
  Eye, 
  Save, 
  RotateCcw, 
  EyeOff, 
  Lock, 
  CheckCircle2, 
  LockKeyhole,
  ExternalLink,
  Plus,
  Trash2
} from 'lucide-react';

import { LinkItem, SocialItem, AppSettings } from './types';
import { DEFAULT_SETTINGS, DEFAULT_LINKS, DEFAULT_SOCIALS, DEFAULT_LOGO_BASE64 } from './defaultData';
import LucideIcon from './components/LucideIcon';

export default function App() {
  // Navigation View State: 'main' | 'login' | 'admin'
  const [view, setView] = useState<'main' | 'login' | 'admin'>('main');

  // State to track if loading the logo image failed
  const [logoError, setLogoError] = useState(false);

  // Load state from local storage or fallback to defaults
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('ptm_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Automatically migrate older logo layouts to match the attached reference image or update to placeholders
      if (!parsed.logoBase64 || parsed.logoBase64.includes('stroke-width') || parsed.logoBase64.includes('line') || parsed.logoBase64.startsWith('data:image/svg+xml')) {
        parsed.logoBase64 = DEFAULT_LOGO_BASE64;
        localStorage.setItem('ptm_settings', JSON.stringify(parsed));
      }
      return parsed;
    }
    return DEFAULT_SETTINGS;
  });

  // Automatically reset the logo loading error state when Settings change
  useEffect(() => {
    setLogoError(false);
  }, [settings.logoBase64]);

  // One-time clear of older/broken logo caches upon first page load
  useEffect(() => {
    const rootCacheCleared = localStorage.getItem('ptm_logo_cleared_v4');
    if (!rootCacheCleared) {
      localStorage.removeItem('ptm_settings');
      setSettings(DEFAULT_SETTINGS);
      localStorage.setItem('ptm_logo_cleared_v4', 'true');
    }
  }, []);

  const [links, setLinks] = useState<LinkItem[]>(() => {
    const saved = localStorage.getItem('ptm_links');
    return saved ? JSON.parse(saved) : DEFAULT_LINKS;
  });

  const [socials, setSocials] = useState<SocialItem[]>(() => {
    const saved = localStorage.getItem('ptm_socials');
    return saved ? JSON.parse(saved) : DEFAULT_SOCIALS;
  });

  // Login inputs
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  // Admin inputs (cloned for staging before saving)
  const [editSettings, setEditSettings] = useState<AppSettings>(settings);
  const [editLinks, setEditLinks] = useState<LinkItem[]>(links);
  const [editSocials, setEditSocials] = useState<SocialItem[]>(socials);

  // Success message state
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New link creation form state
  const [isAdding, setIsAdding] = useState(false);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkDescription, setNewLinkDescription] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkCategory, setNewLinkCategory] = useState<'internal' | 'org'>('internal');
  const [newLinkIcon, setNewLinkIcon] = useState('ExternalLink');
  const [newLinkBadge, setNewLinkBadge] = useState('');

  // Synced state on load and changes
  useEffect(() => {
    setEditSettings(settings);
    setEditLinks(links);
    setEditSocials(socials);
  }, [settings, links, socials]);

  // Login checker handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmail = 'oibomin.ptm@gmail.com';
    const targetPass = 'Ptm59912';

    if (loginEmail.trim() === targetEmail && loginPass === targetPass) {
      setLoginError('');
      setView('admin');
    } else {
      setLoginError('อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
    }
  };

  // Save admin modifications
  const handleSaveSettings = () => {
    localStorage.setItem('ptm_settings', JSON.stringify(editSettings));
    localStorage.setItem('ptm_links', JSON.stringify(editLinks));
    localStorage.setItem('ptm_socials', JSON.stringify(editSocials));

    setSettings(editSettings);
    setLinks(editLinks);
    setSocials(editSocials);

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  // Reset to original factory defaults
  const handleResetDefaults = () => {
    if (window.confirm('คุณต้องการรีเซ็ตลิงก์และข้อมูลทั้งหมดกลับเป็นค่าเริ่มต้นจากทางผู้ผลิตหรือไม่?')) {
      localStorage.removeItem('ptm_settings');
      localStorage.removeItem('ptm_links');
      localStorage.removeItem('ptm_socials');

      setSettings(DEFAULT_SETTINGS);
      setLinks(DEFAULT_LINKS);
      setSocials(DEFAULT_SOCIALS);

      setEditSettings(DEFAULT_SETTINGS);
      setEditLinks(DEFAULT_LINKS);
      setEditSocials(DEFAULT_SOCIALS);

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }
  };

  // Toggle link visibility helper
  const handleToggleLink = (id: string) => {
    const updated = editLinks.map(item => 
      item.id === id ? { ...item, visible: !item.visible } : item
    );
    setEditLinks(updated);
    setLinks(updated);
    localStorage.setItem('ptm_links', JSON.stringify(updated));
  };

  // Update specific link field value dynamically
  const handleLinkFieldChange = (id: string, field: keyof LinkItem, value: any) => {
    const updated = editLinks.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    setEditLinks(updated);
    setLinks(updated);
    localStorage.setItem('ptm_links', JSON.stringify(updated));
  };

  // Add new link to dynamic array
  const handleAddLink = () => {
    if (!newLinkTitle.trim() || !newLinkUrl.trim()) {
      alert('กรุณากรอกชื่อระบบและลิงก์ URL');
      return;
    }

    const newLink: LinkItem = {
      id: `link-${Date.now()}`,
      title: newLinkTitle.trim(),
      description: newLinkDescription.trim() || 'เข้าใช้ออนไลน์ สะดวกรวดเร็ว ตรวจสอบได้ทันที',
      url: newLinkUrl.trim(),
      visible: true,
      category: newLinkCategory,
      iconName: newLinkIcon,
      badge: newLinkBadge.trim() || undefined,
      themeClass: 'from-blue-50 to-indigo-50 border-blue-100 text-blue-900 icon-bg-navy'
    };

    const updated = [newLink, ...editLinks];
    setEditLinks(updated);
    setLinks(updated);
    localStorage.setItem('ptm_links', JSON.stringify(updated));

    // Reset forms
    setNewLinkTitle('');
    setNewLinkDescription('');
    setNewLinkUrl('');
    setNewLinkCategory('internal');
    setNewLinkIcon('ExternalLink');
    setNewLinkBadge('');
    setIsAdding(false);
  };

  // Delete link from dynamic array
  const handleDeleteLink = (id: string) => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบลิงก์ระบบนี้ทิ้งอย่างถาวร?')) {
      const updated = editLinks.filter(item => item.id !== id);
      setEditLinks(updated);
      setLinks(updated);
      localStorage.setItem('ptm_links', JSON.stringify(updated));
    }
  };

  // Update Social URL helper
  const handleSocialURLChange = (id: string, newUrl: string) => {
    setEditSocials(prev => prev.map(item => 
      item.id === id ? { ...item, url: newUrl } : item
    ));
  };

  // Dynamic Lucide theme mapping for preview (frosted glass neon style)
  const iconThemeMapping = (name: string) => {
    switch (name) {
      case 'ClipboardCheck':
        return 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30';
      case 'ShieldAlert':
        return 'bg-sky-500/15 text-sky-300 border border-sky-500/30';
      case 'BarChart3':
        return 'bg-amber-500/15 text-amber-300 border border-amber-500/30';
      case 'Users':
        return 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30';
      case 'Newspaper':
        return 'bg-rose-500/15 text-rose-300 border border-rose-500/30';
      case 'CalendarDays':
        return 'bg-purple-500/15 text-purple-300 border border-purple-500/30';
      case 'Globe':
        return 'bg-green-500/15 text-green-300 border border-green-500/30';
      default:
        return 'bg-slate-800/50 text-slate-300 border border-slate-700/50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] flex flex-col justify-start selection:bg-indigo-500/30 font-sans text-slate-200">
      
      {/* Top micro brand banner (desktop only) */}
      <div className="hidden md:flex justify-between items-center bg-white/5 backdrop-blur-md text-[11px] text-slate-300 px-6 py-2.5 tracking-wider uppercase font-semibold border-b border-white/10">
        <div className="flex items-center gap-1.5 text-slate-200 font-serif font-bold">
          <span className="text-indigo-400">Prism</span>PTM Hub
        </div>
        <div className="text-emerald-400 flex items-center gap-2 font-bold tracking-wide">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span> SYSTEM ACTIVE
        </div>
      </div>

      <main className="flex-1 w-full max-w-md mx-auto px-4 py-8 flex flex-col justify-between">
        
        <AnimatePresence mode="wait">
          
          {/* ========================================================== */}
          {/* ======================= MAIN HUB view ==================== */}
          {/* ========================================================== */}
          {view === 'main' && (
            <motion.div
              key="main-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-6"
            >
              {/* Header profile segment with frosted design */}
              <div className="flex flex-col items-center text-center">
                
                {/* Brand Logo box with premium Gold background in original size */}
                <div className="w-[124px] h-[76px] bg-gradient-to-br from-[#FFE47A] via-[#FBC02D] to-[#E29A09] backdrop-blur-xl rounded-2xl flex items-center justify-center p-3.5 shadow-xl border border-yellow-300/40 hover:border-yellow-100/50 transition-all duration-300 hover:scale-105">
                  {logoError ? (
                    <div id="main-text-logo" className="flex flex-col items-center justify-center leading-none select-none text-center transform scale-150">
                      <span className="text-xl font-serif font-black text-[#0c235f] tracking-wider uppercase">PTM</span>
                      <span className="text-[9px] font-sans font-extrabold text-[#0c235f]/90 tracking-widest uppercase mt-0.5">Agriculture</span>
                    </div>
                  ) : (
                    <img 
                      id="main-logo-img"
                      src={settings.logoBase64} 
                      alt="PTM Agriculture Logo" 
                      className="w-full h-full object-contain filter brightness-105 contrast-105 transform scale-150"
                      onError={() => setLogoError(true)}
                    />
                  )}
                </div>

                <h1 className="text-xl font-serif font-bold text-white mt-4 tracking-tight flex items-center gap-1.5">
                  {settings.name}
                  <span className="inline-block w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" title="ระบบจัดส่งข้อมูล"></span>
                </h1>
                
                <p className="text-[10px] text-indigo-300 font-bold tracking-widest uppercase mt-1 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                  {settings.handle}
                </p>

                <p className="text-sm text-slate-300 leading-relaxed mt-4 whitespace-pre-line max-w-xs px-2">
                  {settings.bio}
                </p>
                
                {/* Glowing subtle gradient visual brand divider */}
                <div className="w-12 h-[3px] bg-gradient-to-r from-indigo-500 via-indigo-400 to-purple-500 rounded-full mt-5 shadow-sm shadow-indigo-500/50"></div>
              </div>

              {/* Group 1: ภายในองค์กร */}
              <div>
                <h3 className="text-[11px] font-serif font-bold text-indigo-400 tracking-widest uppercase mb-3 pl-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                  ระบบภายในองค์กร
                </h3>

                <div className="flex flex-col gap-2.5">
                  {links.filter(k => k.category === 'internal' && k.visible).map(link => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-2xl p-4 shadow-lg shadow-black/10 transition-all duration-200 cursor-pointer active:scale-[0.99]"
                    >
                      {link.badge && (
                        <span className="absolute -top-2.5 right-4 bg-indigo-600 border border-indigo-400/30 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md animate-pulse">
                          {link.badge}
                        </span>
                      )}

                      {/* Icon container styled inside glass badge */}
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-105 select-none ${iconThemeMapping(link.iconName)}`}>
                        <LucideIcon name={link.iconName} size={20} />
                      </div>

                      <div className="flex-1 min-w-0 pr-2">
                        <p className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                          {link.title}
                        </p>
                        <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors line-clamp-1 mt-0.5">
                          {link.description}
                        </p>
                      </div>

                      <ExternalLink className="text-slate-400 group-hover:text-indigo-300 transition-all" size={16} />
                    </a>
                  ))}
                  
                  {links.filter(k => k.category === 'internal' && k.visible).length === 0 && (
                    <div className="text-center py-6 border border-dashed border-white/10 rounded-2xl text-xs text-slate-500 bg-white/2">
                      ไม่มีลิงก์ระบบภายในองค์กรที่เปิดใช้งาน
                    </div>
                  )}
                </div>
              </div>

              {/* Group 2: ข้อมูลองค์กร */}
              <div>
                <h3 className="text-[11px] font-serif font-bold text-indigo-400 tracking-widest uppercase mb-3 pl-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                  ข้อมูลองค์กร
                </h3>

                <div className="flex flex-col gap-2.5">
                  {links.filter(k => k.category === 'org' && k.visible).map(link => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-2xl p-4 shadow-lg shadow-black/10 transition-all duration-200 cursor-pointer active:scale-[0.99]"
                    >
                      {link.badge && (
                        <span className="absolute -top-2.5 right-4 bg-indigo-600 border border-indigo-400/30 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                          {link.badge}
                        </span>
                      )}

                      {/* Icon container with brand color preset glass design */}
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-105 select-none ${iconThemeMapping(link.iconName)}`}>
                        <LucideIcon name={link.iconName} size={20} />
                      </div>

                      <div className="flex-1 min-w-0 pr-2">
                        <p className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                          {link.title}
                        </p>
                        <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors line-clamp-1 mt-0.5">
                          {link.description}
                        </p>
                      </div>

                      <ExternalLink className="text-slate-400 group-hover:text-indigo-300 transition-all" size={16} />
                    </a>
                  ))}

                  {links.filter(k => k.category === 'org' && k.visible).length === 0 && (
                    <div className="text-center py-6 border border-dashed border-white/10 rounded-2xl text-xs text-slate-500 bg-white/2">
                      ไม่มีลิงก์ข้อมูลองค์กรที่เปิดใช้งาน
                    </div>
                  )}
                </div>
              </div>

              {/* Social Channels panel with frosted circles */}
              <div className="flex justify-center items-center gap-3.5 py-4">
                {socials.map(soc => (
                  soc.url ? (
                    <a
                      key={soc.id}
                      href={soc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={soc.label}
                      className={`w-11 h-11 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:border-indigo-400/40 hover:bg-white/15 flex items-center justify-center transition-all duration-200 shadow-md text-slate-300 hover:text-white active:scale-95`}
                    >
                      <LucideIcon name={soc.iconName} size={18} />
                    </a>
                  ) : null
                ))}
              </div>

              {/* Aesthetic Humanistic Footer */}
              <div className="text-center text-[11px] text-slate-500 mt-4 leading-relaxed">
                <p>© 2025 <span className="text-indigo-400 font-semibold hover:underline cursor-pointer">PTM Agriculture Co., Ltd.</span></p>
                <p className="mt-0.5 tracking-wider font-light">สงวนลิขสิทธิ์ทุกประการ • ระบบกลางสำหรับบุคลากร</p>
              </div>

              {/* Management settings shortcut with premium glass design */}
              <div className="flex justify-center mt-2">
                <button 
                  onClick={() => {
                    setView('login');
                    setLoginError('');
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:border-white/20 bg-white/5 backdrop-blur-md text-[11px] text-slate-300 hover:text-white transition-all cursor-pointer shadow-lg hover:shadow-indigo-500/10 active:scale-95"
                >
                  <Settings size={12} className="animate-spin-slow text-indigo-400" />
                  ระบบจัดการผู้ดูแลระบบ (Admin)
                </button>
              </div>
            </motion.div>
          )}

          {/* ========================================================== */}
          {/* ======================= LOGIN VIEW ======================= */}
          {/* ========================================================== */}
          {view === 'login' && (
            <motion.div
              key="login-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-6"
            >
              {/* Top back routing button */}
              <button 
                onClick={() => setView('main')}
                className="self-start inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors uppercase font-semibold cursor-pointer py-1"
              >
                <ArrowLeft size={14} />
                <span>กลับสู่หน้าหลัก</span>
              </button>

              <div className="flex flex-col items-center text-center mt-3">
                <div className="w-[110px] h-[66px] bg-gradient-to-br from-[#FFE47A] via-[#FBC02D] to-[#E29A09] rounded-2xl flex items-center justify-center p-3 shadow-xl border border-yellow-300/40 hover:border-yellow-105/50 transition-all duration-300">
                  {logoError ? (
                    <div id="login-text-logo" className="flex flex-col items-center justify-center leading-none select-none text-center transform scale-150">
                      <span className="text-lg font-serif font-black text-[#0c235f] tracking-wider uppercase">PTM</span>
                      <span className="text-[8px] font-sans font-extrabold text-[#0c235f]/90 tracking-widest uppercase mt-0.5">Agriculture</span>
                    </div>
                  ) : (
                    <img 
                      id="login-logo-img"
                      src={settings.logoBase64} 
                      alt="PTM Agriculture Logo" 
                      className="w-full h-full object-contain filter brightness-105 contrast-105 transform scale-150"
                      onError={() => setLogoError(true)}
                    />
                  )}
                </div>
                <h2 className="text-lg font-bold text-white mt-4">เข้าสู่ระบบผู้ดูแลระบบ (Admin)</h2>
                <p className="text-xs text-slate-400 mt-1.5">สำหรับการจัดการข้อมูลหน้ารวมลิงก์ PTM Agriculture</p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl mt-2">
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                  
                  {/* Auth Email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-indigo-300">อีเมลแอดมิน</label>
                    <div className="relative">
                      <input 
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="กรอกอีเมลแอดมิน (oibomin.ptm@gmail.com)"
                        className="w-full bg-black/30 hover:bg-black/40 focus:bg-black/50 border border-white/10 focus:border-indigo-400 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all placeholder:text-slate-500"
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  {/* Auth Password */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-indigo-300">รหัสผ่านแอดมิน</label>
                    <div className="relative">
                      <input 
                        type="password"
                        required
                        value={loginPass}
                        onChange={(e) => setLoginPass(e.target.value)}
                        placeholder="กรอกรหัสผ่าน (Ptm59912)"
                        className="w-full bg-black/30 hover:bg-black/40 focus:bg-black/50 border border-white/10 focus:border-indigo-400 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all placeholder:text-slate-500"
                      />
                    </div>
                  </div>

                  {/* Warning credentials alert inside glass panel */}
                  <div className="bg-indigo-950/45 border border-indigo-500/20 rounded-xl p-3.5 text-[11px] text-indigo-200 leading-relaxed font-semibold">
                    <div className="font-bold text-indigo-300 mb-0.5 uppercase tracking-wide">บัญชีทดสอบที่กำหนดอย่างเป็นทางการ:</div>
                    <p>อีเมล: <span className="underline select-all text-white">oibomin.ptm@gmail.com</span></p>
                    <p>รหัสผ่าน: <span className="underline select-all text-white">Ptm59912</span></p>
                  </div>

                  {/* Realtime login error presentation */}
                  {loginError && (
                    <div className="text-xs font-semibold text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
                      {loginError}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all cursor-pointer shadow-lg shadow-indigo-600/25 active:scale-[0.98] mt-2 flex items-center justify-center gap-2"
                  >
                    <LockKeyhole size={15} />
                    <span>ยืนยันสิทธิ์เข้าสู่ระบบ</span>
                  </button>

                </form>
              </div>
            </motion.div>
          )}

          {/* ========================================================== */}
          {/* ======================= ADMIN PANEL ====================== */}
          {/* ========================================================== */}
          {view === 'admin' && (
            <motion.div
              key="admin-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-6"
            >
              
              {/* Header inside Panel */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex flex-col gap-0.5">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Admin Control</div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-1.5">
                    <span>แผงผู้ดูแลระบบ</span>
                    <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                      Admin Mode
                    </span>
                  </h2>
                </div>

                <button 
                  onClick={() => {
                    setView('main');
                    setLoginEmail('');
                    setLoginPass('');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#ef4444]/20 hover:border-[#ef4444]/30 bg-[#ef4444]/10 hover:bg-[#ef4444]/20 text-[#fca5a5] text-xs font-semibold transition-all cursor-pointer active:scale-95"
                >
                  <LogOut size={13} />
                  <span>ออกจากระบบ</span>
                </button>
              </div>

              {/* SECTION: Profile Settings edit */}
              <div className="flex flex-col gap-4 bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-3xl shadow-xl">
                <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-widest border-b border-white/5 pb-2.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                  1. ตั้งค่าข้อมูลหน้าโปรไฟล์
                </h3>
                
                <div className="flex flex-col gap-3 text-xs">
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-slate-400">โลโก้สัญลักษณ์แบรนด์/บริษัท (ลิงก์ URL รูปภาพ หรือ Base64)</label>
                    <input 
                      type="text"
                      id="input-logo-url"
                      placeholder="เช่น https://domain.com/logo.png หรือใส่ชื่อพาร์ทภาพที่คุณต้องการ"
                      className="w-full bg-black/30 hover:bg-black/45 focus:bg-black/60 border border-white/10 focus:border-indigo-400 rounded-xl px-3 py-2 outline-none transition-all font-medium text-white font-mono text-[11px]"
                      value={editSettings.logoBase64}
                      onChange={(e) => setEditSettings({ ...editSettings, logoBase64: e.target.value })}
                    />
                    <span className="text-[10px] text-slate-500">ท่านสามารถสลับหรือวาง URL ภาพใหม่ลงในช่องนี้เพื่อเปลี่ยนโลโก้ทั้งหมดในระบบได้ทันที</span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-slate-400">ชื่อแบรนด์หรือบริษัท</label>
                    <input 
                      type="text"
                      className="w-full bg-black/30 hover:bg-black/45 focus:bg-black/60 border border-white/5 focus:border-indigo-400 rounded-xl px-3 py-2 outline-none transition-all font-medium text-white"
                      value={editSettings.name}
                      onChange={(e) => setEditSettings({ ...editSettings, name: e.target.value })}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-slate-400">Username Handle</label>
                    <input 
                      type="text"
                      className="w-full bg-black/30 hover:bg-black/45 focus:bg-black/60 border border-white/5 focus:border-indigo-400 rounded-xl px-3 py-2 outline-none transition-all font-medium text-white"
                      value={editSettings.handle}
                      onChange={(e) => setEditSettings({ ...editSettings, handle: e.target.value })}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-slate-400">คำอธิบายประวัติย่อ (Bio)</label>
                    <textarea 
                      rows={3}
                      className="w-full bg-black/30 hover:bg-black/45 focus:bg-black/60 border border-white/5 focus:border-indigo-400 rounded-xl px-3 py-2 outline-none transition-all font-medium text-white leading-relaxed resize-none"
                      value={editSettings.bio}
                      onChange={(e) => setEditSettings({ ...editSettings, bio: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION: links list modification */}
              <div className="flex flex-col gap-4 bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-3xl shadow-lg">
                <div className="flex justify-between items-center border-b border-white/5 pb-2.5 gap-2">
                  <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                    2. ลิงก์ระบบและบริการองค์กร
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsAdding(!isAdding)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95"
                  >
                    <Plus size={13} />
                    <span>เพิ่มลิงก์ระบบใหม่</span>
                  </button>
                </div>

                {/* Collapsible New Link Entry Form */}
                {isAdding && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl flex flex-col gap-3 text-xs mb-4 shadow-inner"
                  >
                    <div className="text-xs font-bold text-emerald-400 flex items-center justify-between">
                      <span>➕ ฟอร์มกรอกข้อมูลระบบใหม่</span>
                      <button
                        type="button"
                        onClick={() => setIsAdding(false)}
                        className="text-[10px] text-slate-400 hover:text-white"
                      >
                        ยกเลิก
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-slate-300">ชื่อระบบ/บริการ</label>
                        <input
                          type="text"
                          placeholder="เช่น ระบบประเมินผลการทำงาน, WI เอกสารโรงงาน"
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 outline-none text-white focus:border-emerald-500 font-medium"
                          value={newLinkTitle}
                          onChange={(e) => setNewLinkTitle(e.target.value)}
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-slate-300">คำอธิบายระบบโดยย่อ</label>
                        <input
                          type="text"
                          placeholder="เช่น มุ่งเน้นการประเมินเพื่อพัฒนาศักยภาพตนเอง"
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 outline-none text-white focus:border-emerald-500 font-medium"
                          value={newLinkDescription}
                          onChange={(e) => setNewLinkDescription(e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1">
                          <label className="font-semibold text-slate-300">เลือกหมวดหมู่</label>
                          <select
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 outline-none text-white focus:border-emerald-500 font-medium"
                            value={newLinkCategory}
                            onChange={(e) => setNewLinkCategory(e.target.value as 'internal' | 'org')}
                          >
                            <option value="internal">ระบบภายในองค์กร</option>
                            <option value="org">ข้อมูลองค์กร</option>
                          </select>
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="font-semibold text-slate-300">ประเภทไอคอน</label>
                          <select
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 outline-none text-white focus:border-emerald-500 font-medium"
                            value={newLinkIcon}
                            onChange={(e) => setNewLinkIcon(e.target.value)}
                          >
                            <option value="ClipboardCheck">📋 เช็คลิสต์ (ClipboardCheck)</option>
                            <option value="ShieldAlert">🛡️ ความปลอดภัย (ShieldAlert)</option>
                            <option value="BarChart3">📊 สถิติ/รายงาน (BarChart3)</option>
                            <option value="Users">👥 บุคลากร (Users)</option>
                            <option value="Newspaper">📰 ข่าวสาร (Newspaper)</option>
                            <option value="CalendarDays">📅 ปฏิทิน (CalendarDays)</option>
                            <option value="Globe">🌐 เว็บไซต์ (Globe)</option>
                            <option value="ExternalLink">🔗 ลิงก์ภายนอก (ExternalLink)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1">
                          <label className="font-semibold text-slate-300">ป้ายกำกับพิเศษ (ถ้ามี)</label>
                          <input
                            type="text"
                            placeholder="เช่น ใหม่, แนะนำ (ว่างไว้ได้)"
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 outline-none text-white focus:border-emerald-500 font-medium"
                            value={newLinkBadge}
                            onChange={(e) => setNewLinkBadge(e.target.value)}
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="font-semibold text-slate-300">ที่อยู่อ้างอิง (URL)</label>
                          <input
                            type="url"
                            placeholder="https://..."
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 outline-none text-white focus:border-emerald-500 font-mono font-medium"
                            value={newLinkUrl}
                            onChange={(e) => setNewLinkUrl(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddLink}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold mt-1.5 transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shadow-lg shadow-emerald-700/25"
                    >
                      <Plus size={14} />
                      <span>ยืนยันเพื่อเพิ่มระบบใหม่</span>
                    </button>
                  </motion.div>
                )}

                <div className="flex flex-col gap-5">
                  {editLinks.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-500 border border-dashed border-white/10 rounded-2xl">
                      ไม่มีลิงก์ในระบบ กรุณากดปุ่มเพิ่มลิงก์ด้านบนเพื่อเริ่มสร้าง
                    </div>
                  ) : (
                    editLinks.map((link) => (
                      <div 
                        key={link.id} 
                        className={`flex flex-col gap-3.5 p-4 rounded-2xl border transition-all ${
                          link.visible ? 'border-white/15 bg-white/5' : 'border-white/5 bg-black/10 opacity-60'
                        }`}
                      >
                        {/* Top bar inside item editor */}
                        <div className="flex items-center justify-between pb-2 border-b border-white/5">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${iconThemeMapping(link.iconName)}`}>
                              <LucideIcon name={link.iconName} size={15} />
                            </div>
                            <span className="text-[10px] font-bold text-indigo-300 uppercase bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/15">
                              {link.category === 'internal' ? 'ระบบภายใน' : 'ข้อมูลองค์กร'}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            {/* Visibility slider toggle */}
                            <div className="flex items-center gap-1">
                              <button
                                type="button" 
                                onClick={() => handleToggleLink(link.id)}
                                className={`relative inline-flex h-4.5 w-8 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out pb-0.5 outline-none ${
                                  link.visible ? 'bg-indigo-600' : 'bg-slate-700'
                                }`}
                              >
                                <span
                                  className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                    link.visible ? 'translate-x-3.5' : 'translate-x-0'
                                  }`}
                                />
                              </button>
                              <span className="text-[9px] font-bold text-slate-400 select-none">
                                {link.visible ? 'ใช้งาน' : 'ซ่อน'}
                              </span>
                            </div>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => handleDeleteLink(link.id)}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-red-500/20 hover:border-red-500/40 bg-red-500/10 hover:bg-red-500/20 text-[#fca5a5] text-[10px] font-bold transition-all cursor-pointer active:scale-95"
                            >
                              <Trash2 size={11} />
                              <span>ลบลิงก์</span>
                            </button>
                          </div>
                        </div>

                        {/* Live Edit Fields Grid */}
                        <div className="grid grid-cols-1 gap-2 text-[11px]">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col gap-0.5">
                              <label className="font-semibold text-slate-400">ชื่อระบบ</label>
                              <input 
                                type="text"
                                className="w-full bg-black/40 border border-white/5 focus:border-indigo-400 rounded-lg px-2.5 py-1 text-slate-100 outline-none"
                                value={link.title}
                                onChange={(e) => handleLinkFieldChange(link.id, 'title', e.target.value)}
                              />
                            </div>

                            <div className="flex flex-col gap-0.5">
                              <label className="font-semibold text-slate-400">คำอธิบายย่อ</label>
                              <input 
                                type="text"
                                className="w-full bg-black/40 border border-white/5 focus:border-indigo-400 rounded-lg px-2.5 py-1 text-slate-100 outline-none"
                                value={link.description}
                                onChange={(e) => handleLinkFieldChange(link.id, 'description', e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            <div className="flex flex-col gap-0.5">
                              <label className="font-semibold text-slate-400">หมวดหมู่</label>
                              <select 
                                className="w-full bg-black/40 border border-white/5 focus:border-indigo-400 rounded-lg px-2 py-1 text-slate-200 outline-none text-[10px]"
                                value={link.category}
                                onChange={(e) => handleLinkFieldChange(link.id, 'category', e.target.value as 'internal' | 'org')}
                              >
                                <option value="internal">ระบบภายใน</option>
                                <option value="org">ข้อมูลองค์กร</option>
                              </select>
                            </div>

                            <div className="flex flex-col gap-0.5">
                              <label className="font-semibold text-slate-400">เลือกไอคอน</label>
                              <select 
                                className="w-full bg-black/40 border border-white/5 focus:border-indigo-400 rounded-lg px-2 py-1 text-slate-200 outline-none text-[10px]"
                                value={link.iconName}
                                onChange={(e) => handleLinkFieldChange(link.id, 'iconName', e.target.value)}
                              >
                                <option value="ClipboardCheck">📋 เช็คลิสต์</option>
                                <option value="ShieldAlert">🛡️ ปลอดภัย</option>
                                <option value="BarChart3">📊 รายงาน</option>
                                <option value="Users">👥 พนักงาน</option>
                                <option value="Newspaper">📰 ข่าวสาร</option>
                                <option value="CalendarDays">📅 ปฏิทิน</option>
                                <option value="Globe">🌐 เว็บไซต์</option>
                                <option value="ExternalLink">🔗 ลิงก์ภายนอก</option>
                              </select>
                            </div>

                            <div className="flex flex-col gap-0.5">
                              <label className="font-semibold text-slate-400">ป้ายพิเศษ</label>
                              <input 
                                type="text"
                                placeholder="(ไม่มี)"
                                className="w-full bg-black/40 border border-white/5 focus:border-indigo-400 rounded-lg px-2.5 py-1 text-slate-100 outline-none"
                                value={link.badge || ''}
                                onChange={(e) => handleLinkFieldChange(link.id, 'badge', e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="flex flex-col gap-0.5">
                            <label className="font-semibold text-slate-400">ที่อยู่อ้างอิง (URL)</label>
                            <input 
                              type="url"
                              placeholder="https://"
                              className="w-full bg-black/40 border border-white/5 focus:border-indigo-400 rounded-lg px-2.5 py-1 outline-none text-[11px] font-mono text-slate-200"
                              value={link.url}
                              onChange={(e) => handleLinkFieldChange(link.id, 'url', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* SECTION: Social panel setting */}
              <div className="flex flex-col gap-4 bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-3xl shadow-lg">
                <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-widest border-b border-white/5 pb-2.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                  3. ช่องทางโซเชียลมีเดีย
                </h3>

                <div className="flex flex-col gap-3.5">
                  {editSocials.map((soc) => (
                    <div key={soc.id} className="flex gap-3 items-end">
                      
                      {/* Brand Label design */}
                      <div className="flex items-center gap-2 flex-shrink-0 w-28 bg-white/5 border border-white/5 rounded-xl px-2.5 py-1.5 text-slate-300">
                        <div className="text-indigo-400 flex-shrink-0">
                          <LucideIcon name={soc.iconName} size={15} />
                        </div>
                        <span className="text-[11px] font-bold text-slate-300 line-clamp-1">{soc.label}</span>
                      </div>

                      {/* URL setting in Social with dark frosted view */}
                      <div className="flex-1 flex flex-col gap-0.5">
                        <input
                          type="text"
                          placeholder={soc.id === 'soc-mail' ? 'mailto:contact@url.com' : 'https://'}
                          className="w-full bg-black/30 hover:bg-black/45 focus:bg-black/60 border border-white/10 focus:border-indigo-450 rounded-xl px-3 py-1.5 outline-none text-xs font-mono text-slate-200 transition-colors"
                          value={soc.url}
                          onChange={(e) => handleSocialURLChange(soc.id, e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions panel bottom */}
              <div className="flex flex-col gap-2 pt-2">
                
                {/* Save core controls */}
                <button
                  onClick={handleSaveSettings}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-sm font-semibold transition-all cursor-pointer shadow-lg shadow-indigo-600/35 flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <Save size={16} />
                  <span>บันทึกข้อมูลการเปลี่ยนแปลง</span>
                </button>

                {/* Reset defaults configuration */}
                <button
                  onClick={handleResetDefaults}
                  className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white rounded-2xl text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <RotateCcw size={13} />
                  <span>รีเซ็ตลิงก์และระบบเป็นค่าเริ่มต้น</span>
                </button>

                {/* Save Feedback State */}
                {saveSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center text-xs font-semibold text-emerald-300 flex items-center justify-center gap-2 mt-1"
                  >
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    <span>ข้อมูลและการตั้งค่าทั้งหมดถูกบันทึกสำเร็จ เรียบร้อยแล้ว ✓</span>
                  </motion.div>
                )}

                {/* Go back Preview */}
                <button
                  onClick={() => setView('main')}
                  className="w-full py-3 border border-white/10 hover:bg-white/5 text-slate-300 rounded-2xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 mt-1 active:scale-[0.98]"
                >
                  <Eye size={15} className="text-slate-400" />
                  <span>ดูผลลัพธ์หน้าตัวอย่างจริง</span>
                </button>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
