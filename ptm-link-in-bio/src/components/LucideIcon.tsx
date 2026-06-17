import * as Icons from 'lucide-react';

interface LucideIconProps {
  name: string;
  className?: string;
  size?: number;
}

export default function LucideIcon({ name, className = '', size = 20 }: LucideIconProps) {
  // Safe dynamic lookup in Lucide's icon collection
  const IconComponent = (Icons as any)[name];
  
  if (!IconComponent) {
    // Fallback if icon name doesn't match
    return <Icons.HelpCircle className={className} size={size} />;
  }
  
  return <IconComponent className={className} size={size} />;
}
