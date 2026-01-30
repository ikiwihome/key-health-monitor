'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, Key, AlertCircle, Shield } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { KeyCard } from '@src/components/KeyCard';
import { KeyData as OpenRouterKeyData } from '@src/lib/openrouter';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Home() {
  const [keys, setKeys] = useState<OpenRouterKeyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalDailyUsage, setTotalDailyUsage] = useState<number>(0);

  const fetchKeys = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/keys');
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', response.status, errorText);
        setError(`API 错误: ${response.status} ${response.statusText}`);
        return;
      }
      
      const result = await response.json();
      
      if (result.error) {
        setError(result.error);
      } else {
        // 处理返回的数据，api/keys 返回的是 { data: detailedKeys }
        const keyList = Array.isArray(result.data) ? result.data : [];
        // 过滤掉禁用的密钥
        const activeKeys = keyList.filter((key: OpenRouterKeyData) => !key.disabled);
        // 按 name 或 label 排序
        const sortedKeys = activeKeys.sort((a: OpenRouterKeyData, b: OpenRouterKeyData) => {
          const nameA = (a.name || a.label || '').toLowerCase();
          const nameB = (b.name || b.label || '').toLowerCase();
          return nameA.localeCompare(nameB, undefined, { numeric: true, sensitivity: 'base' });
        });
        setKeys(sortedKeys);
        
        // 计算今日消耗总金额
        const totalUsage = activeKeys.reduce((sum: number, key: OpenRouterKeyData) => sum + (key.usage_daily || 0), 0);
        setTotalDailyUsage(totalUsage);
      }
    } catch (err) {
      console.error('Error fetching keys:', err);
      setError('无法加载密钥信息，请检查网络连接');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="max-w-11/12 mx-auto">
        <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-10 gap-4 md:gap-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-slate-800">OpenRouter API Key 监控面板</h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5 font-medium uppercase tracking-wide">实时监控你的 API 密钥状态</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={fetchKeys}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg shadow-sm hover:bg-slate-50 transition-all disabled:opacity-50 font-medium text-sm flex-1 md:flex-none"
            >
              <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
              刷新
            </button>
          </div>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* 今日消耗总金额统计 */}
        {!loading && keys.length > 0 && (
          <div className="mb-6 p-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium uppercase tracking-wide">今日消耗金额</p>
                <p className="text-3xl font-bold mt-1">${totalDailyUsage.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 justify-items-center">
          {loading && keys.length === 0 ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-64 bg-gradient-to-b from-slate-50 to-white rounded-2xl border border-slate-200 animate-pulse shadow-sm" />
            ))
          ) : (
            keys.map((key, index) => (
              <KeyCard key={key.label || key.name || index} keyData={key} />
            ))
          )}
        </div>

        {!loading && keys.length === 0 && !error && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
            <Key className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">未发现 API 密钥</p>
            <p className="text-sm text-slate-400 mt-2">请检查后端环境变量配置</p>
          </div>
        )}
      </div>
    </main>
  );
}
