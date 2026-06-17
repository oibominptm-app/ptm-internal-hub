export interface LinkItem {
  id: string;
  title: string;
  description: string;
  url: string;
  visible: boolean;
  category: 'internal' | 'org';
  iconName: string; // Dynamic icon from Lucide
  badge?: string; // Optional badge such as "ใหม่"
  themeClass: string; // Tailwind color class combo
}

export interface SocialItem {
  id: string;
  label: string;
  url: string;
  iconName: string;
  colorClass: string;
}

export interface AppSettings {
  name: string;
  handle: string;
  bio: string;
  logoBase64: string;
}
