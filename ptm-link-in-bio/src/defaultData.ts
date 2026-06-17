import { LinkItem, SocialItem, AppSettings } from './types';

// ข้อมูลรูปภาพโลโก้เริ่มต้น (สัญลักษณ์แบรนด์)
// ท่านสามารถเปลี่ยนบรรทัดถัดไปเป็นลิงก์ URL รูปภาพที่ท่านต้องการได้เลย เช่น:
export const DEFAULT_LOGO_BASE64 = `https://placehold.co/200x200/1A4314/FBC02D?text=PTM+Logo`;

export const DEFAULT_SETTINGS: AppSettings = {
  name: "PTM Agriculture",
  handle: "@ptm.agriculture",
  bio: "บริษัท พีทีเอ็ม การเกษตร จำกัด\nนวัตกรรมเพื่อการเกษตรที่ยั่งยืน ผู้นำเข้าและผู้จัดจำหน่าย ปุ๋ย ยา และเคมีเกษตรคุณภาพสูง",
  logoBase64: DEFAULT_LOGO_BASE64
};

export const DEFAULT_LINKS: LinkItem[] = [
  {
    id: "link-wp",
    title: "ระบบ Work Permit",
    description: "ขออนุญาตทำงานออนไลน์ ระบบ F-SE-126-07 รวดเร็ว ตรวจสอบได้ทันที",
    url: "https://workpermit.ptm-agriculture.com",
    visible: true,
    category: "internal",
    iconName: "ClipboardCheck",
    badge: "ใหม่",
    themeClass: "from-blue-50 to-indigo-50 border-blue-100 hover:border-blue-300 text-blue-900 icon-bg-navy"
  },
  {
    id: "link-ehs",
    title: "ความปลอดภัย & EHS",
    description: "แบบฟอร์มรายงานอุบัติการณ์ และคู่มือความปลอดภัยสำหรับพนักงาน",
    url: "https://safety.ptm-agriculture.com",
    visible: true,
    category: "internal",
    iconName: "ShieldAlert",
    themeClass: "from-blue-50 to-sky-50 border-sky-100 hover:border-sky-300 text-sky-900 icon-bg-blue"
  },
  {
    id: "link-report",
    title: "รายงานการผลิตประจำวัน",
    description: "สรุปข้อมูลผลผลิต สถิติ และยอดการจัดส่งสินค้าประจำวัน",
    url: "https://report.ptm-agriculture.com",
    visible: true,
    category: "internal",
    iconName: "BarChart3",
    themeClass: "from-amber-50 to-orange-50 border-amber-100 hover:border-amber-300 text-amber-950 icon-bg-amber"
  },
  {
    id: "link-hr",
    title: "HR Portal & บริการพนักงาน",
    description: "ระบบลางานออน์ไลน์ สิทธิสวัสดิการพนักงาน ข้อมูลกองทุนสำรองเลี้ยงชีพ",
    url: "https://hr.ptm-agriculture.com",
    visible: true,
    category: "internal",
    iconName: "Users",
    themeClass: "from-emerald-50 to-teal-50 border-emerald-100 hover:border-emerald-300 text-emerald-950 icon-bg-teal"
  },
  {
    id: "link-news",
    title: "ข่าวสารและประกาศองค์กร",
    description: "อัปเดตนโยบาย ข่าวสาร และเรื่องประกาศสำคัญจากฝ่ายบริหาร",
    url: "https://news.ptm-agriculture.com",
    visible: true,
    category: "org",
    iconName: "Newspaper",
    themeClass: "from-rose-50 to-orange-50 border-rose-100 hover:border-rose-300 text-rose-950 icon-bg-coral"
  },
  {
    id: "link-cal",
    title: "ปฏิทินกิจกรรมองค์กร",
    description: "ปฏิทินกิจกรรม วันทำงาน วันหยุดประเพณี และกำหนดสัมมนาวิชาการ",
    url: "https://calendar.ptm-agriculture.com",
    visible: true,
    category: "org",
    iconName: "CalendarDays",
    themeClass: "from-purple-50 to-fuchsia-50 border-purple-100 hover:border-purple-300 text-purple-950 icon-bg-purple"
  },
  {
    id: "link-web",
    title: "เว็บไซต์หลักอย่างเป็นทางการ",
    description: "เยี่ยมชมหน้าเว็บหลัก ค้นหากลุ่มผลิตภัณฑ์ ปุ๋ยเคมี ยาพ่น พีทีเอ็ม",
    url: "https://ptm-agriculture.com",
    visible: true,
    category: "org",
    iconName: "Globe",
    themeClass: "from-green-50 to-emerald-50 border-green-100 hover:border-green-300 text-green-950 icon-bg-green"
  }
];

export const DEFAULT_SOCIALS: SocialItem[] = [
  {
    id: "soc-line",
    label: "Line Official",
    url: "https://line.me/ti/p/@ptm.agriculture",
    iconName: "MessageSquareText",
    colorClass: "hover:bg-green-100 hover:text-green-600 border-slate-200 text-slate-600"
  },
  {
    id: "soc-fb",
    label: "Facebook Page",
    url: "https://facebook.com/ptm.agriculture",
    iconName: "Facebook",
    colorClass: "hover:bg-blue-100 hover:text-blue-600 border-slate-200 text-slate-600"
  },
  {
    id: "soc-yt",
    label: "YouTube Channel",
    url: "https://youtube.com/@ptm.agriculture",
    iconName: "Youtube",
    colorClass: "hover:bg-red-100 hover:text-red-600 border-slate-200 text-slate-600"
  },
  {
    id: "soc-mail",
    label: "Contact Email",
    url: "mailto:contact@ptm-agriculture.com",
    iconName: "Mail",
    colorClass: "hover:bg-slate-200 hover:text-slate-800 border-slate-200 text-slate-600"
  }
];
