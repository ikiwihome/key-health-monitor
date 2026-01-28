import { useState } from 'react';
import { Key, Activity, Clock, AlertCircle, Info } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { KeyData, calculateUsagePercentage, formatCurrency, formatExpiryTime, formatRateLimit, getCurrentUsage, getLimitResetTime } from '@src/lib/openrouter';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface KeyCardProps {
  keyData: KeyData;
}

export function KeyCard({ keyData }: KeyCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  
  const usagePercentage = calculateUsagePercentage(keyData);
  const currentUsage = getCurrentUsage(keyData);
  const isOverLimit = keyData.limit && currentUsage >= keyData.limit;
  const isNearLimit = keyData.limit && currentUsage >= keyData.limit * 0.8;
  
  // 获取Key的名称或标签
  const keyName = keyData.name || keyData.label || 'Unknown Key';
  
  // 统一的 Linear 浅色风格颜色配置
  const colorClass = 'from-slate-50 to-white border-slate-200';
  const iconBgClass = 'bg-gradient-to-br from-blue-500 to-indigo-600';
  
  // 获取Key的简短标签
  const getShortLabel = (label: string) => {
    if (!label) return 'Unknown';
    if (label.length <= 20) return label;
    return label.substring(0, 10) + '...' + label.substring(label.length - 6);
  };
  
  return (
    <div className={cn(
      'relative rounded-2xl overflow-hidden bg-gradient-to-b transition-all duration-300',
      colorClass,
      'border shadow-sm hover:shadow-md hover:-translate-y-0.5',
      'animate-fade-in',
      isOverLimit ? 'border-red-200 bg-red-50/30' : 
      isNearLimit ? 'border-orange-200 bg-orange-50/30' : 
      'border-slate-200'
    )}>
      {/* 顶部装饰条 - 根据状态改变颜色但保持线性感 */}
      <div className={cn(
        "h-1 w-full opacity-70 bg-gradient-to-r",
        isOverLimit ? "from-red-400 to-rose-400" :
        isNearLimit ? "from-orange-400 to-amber-400" :
        "from-blue-400 via-indigo-400 to-purple-400"
      )} />
      
      {/* 卡片内容 */}
      <div className="p-5">
        {/* Key标签和状态 */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={cn(
              'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0',
              iconBgClass,
              'shadow-sm'
            )}>
              <Key className="w-4.5 h-4.5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-slate-800 text-md truncate">
                {getShortLabel(keyName)}
              </h3>
              <p className="text-[12px] font-medium text-slate-600 tracking-wider mt-0.5">
                {keyData.label || 'Default Key'}
              </p>
            </div>
          </div>
          {isOverLimit && (
            <div className="flex items-center gap-1 text-red-500 text-[10px] font-bold bg-red-50/80 backdrop-blur-sm px-2 py-1 rounded-md flex-shrink-0 ml-2 border border-red-100">
              <AlertCircle className="w-3 h-3" />
              LIMIT EXCEEDED
            </div>
          )}
        </div>
        
        {/* 进度条部分 */}
        <div className="mb-4">
          {/* 进度条容器 */}
          <div 
            className="relative h-6 bg-slate-100/50 rounded-lg overflow-hidden cursor-pointer group transition-all border border-slate-100"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            {/* 进度条填充 */}
            <div 
              className={cn(
                "h-full transition-all duration-1000 ease-out bg-gradient-to-r",
                isOverLimit ? "from-red-300 to-rose-400" : 
                isNearLimit ? "from-orange-300 to-amber-400" : 
                "from-blue-400 to-indigo-500"
              )}
              style={{ width: `${Math.min(100, usagePercentage)}%` }}
            />
            
            {/* 进度文字 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] font-bold text-slate-600 drop-shadow-sm">
                {usagePercentage.toFixed(1)}%
              </span>
            </div>
            
            {/* 悬停提示 */}
            {showTooltip && (
              <div className={cn(
                'absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-3',
                'bg-slate-900 text-white text-xs rounded-lg shadow-xl',
                'whitespace-nowrap z-20 font-medium'
              )}>
                <div className="flex items-center gap-2">
                  <span>已使用: {formatCurrency(currentUsage)}</span>
                  <span className="text-slate-400">/</span>
                  <span>限额: {keyData.limit ? formatCurrency(keyData.limit) : 'Unlimited'}</span>
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-slate-900 rotate-45" />
              </div>
            )}
          </div>
          
          {/* 进度条下方的使用量和限额 */}
          <div className="flex justify-between items-center mt-3 px-1">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">已使用</span>
              <span className={cn(
                'text-xs font-bold',
                isOverLimit ? 'text-red-600' : 'text-slate-700'
              )}>
                {formatCurrency(currentUsage)}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">限额</span>
              <span className="text-xs font-bold text-slate-700">
                {keyData.limit ? formatCurrency(keyData.limit) : '∞'}
              </span>
            </div>
          </div>
        </div>
      
      {/* 详细信息 */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
        {/* 请求次数限制 */}
        <div className="flex items-center gap-3 p-2.5 bg-slate-50/50 rounded-lg border border-slate-100/50 hover:bg-slate-50 transition-colors">
          <div className="w-7 h-7 rounded-md bg-blue-50 flex items-center justify-center flex-shrink-0">
            <Activity className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-slate-400 font-medium uppercase">请求次数限制</span>
            <span className="text-[11px] font-bold text-slate-700 truncate">
              {formatRateLimit(keyData.rate_limit)}
            </span>
          </div>
        </div>
        
        {/* 失效时间 */}
        <div className="flex items-center gap-3 p-2.5 bg-slate-50/50 rounded-lg border border-slate-100/50 hover:bg-slate-50 transition-colors">
          <div className="w-7 h-7 rounded-md bg-indigo-50 flex items-center justify-center flex-shrink-0">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-slate-400 font-medium uppercase">失效时间</span>
            <span className={cn(
              'text-[11px] font-bold truncate',
              keyData.expires_at ? 'text-slate-700' : 'text-emerald-600'
            )}>
              {formatExpiryTime(keyData.expires_at)}
            </span>
          </div>
        </div>
      </div>
      
      {/* 重置信息 */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2 text-[10px] text-slate-400 bg-slate-50/30 p-2 rounded-lg border border-slate-100/30">
          <Info className="w-3 h-3 flex-shrink-0" />
          <span className="font-medium">{getLimitResetTime(keyData.limit_reset)}</span>
        </div>
      </div>
    </div>
  </div>
  );
}
