import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  iconColor: string;
  iconBgColor: string;
}

export function MetricCard({ icon: Icon, label, value, iconColor, iconBgColor }: MetricCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 flex items-start gap-4">
      <div className={`${iconBgColor} ${iconColor} p-3 rounded-lg`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <div className="text-sm text-gray-600 mb-1">{label}</div>
        <div className="text-2xl font-semibold text-gray-900">{value}</div>
      </div>
    </div>
  );
}
