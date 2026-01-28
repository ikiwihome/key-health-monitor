export interface KeyRateLimit {
  requests: number;
  interval: string;
  note?: string;
}

export interface KeyData {
  // 从 /api/v1/keys 返回的字段
  hash?: string;
  name?: string;
  label: string;
  disabled?: boolean;
  limit: number | null;
  limit_remaining: number | null;
  limit_reset: string | null;
  include_byok_in_limit: boolean;
  usage: number;
  usage_daily: number;
  usage_weekly: number;
  usage_monthly: number;
  byok_usage: number;
  byok_usage_daily: number;
  byok_usage_weekly: number;
  byok_usage_monthly: number;
  created_at?: string;
  updated_at?: string | null;
  expires_at: string | null;
  
  // 从 /api/v1/key 返回的额外字段
  is_free_tier?: boolean;
  is_provisioning_key?: boolean;
  rate_limit?: KeyRateLimit;
}

export interface KeyResponse {
  data: KeyData;
}

export interface KeyListResponse {
  data: KeyData[];
}

// 获取所有Key的列表（通过Provisioning Key）
export async function fetchKeyList(provisioningKey: string): Promise<KeyListResponse> {
  // 使用 /api/v1/keys 端点获取所有密钥列表
  // 这个端点需要 Provisioning Key 认证
  
  const response = await fetch('https://openrouter.ai/api/v1/keys', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${provisioningKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.status}`);
  }

  const data = await response.json();
  
  // 确保返回的是数组格式
  if (!data.data || !Array.isArray(data.data)) {
    return { data: [] };
  }
  
  return data;
}

// 获取当前周期的使用量
export function getCurrentUsage(keyData: KeyData): number {
  switch (keyData.limit_reset) {
    case 'daily':
      return keyData.usage_daily;
    case 'weekly':
      return keyData.usage_weekly;
    case 'monthly':
      return keyData.usage_monthly;
    default:
      return keyData.usage;
  }
}

// 计算使用量百分比
export function calculateUsagePercentage(keyData: KeyData): number {
  const usage = getCurrentUsage(keyData);
  const limit = keyData.limit;
  if (!limit || limit <= 0) return 0;
  return Math.min((usage / limit) * 100, 100);
}

// 格式化金额
export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

// 格式化过期时间
export function formatExpiryTime(expiresAt: string | null): string {
  if (!expiresAt) return '永久有效';
  
  const date = new Date(expiresAt);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  
  if (diffMs < 0) return '已过期';
  
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) {
    return `${days}天${hours > 0 ? hours + '小时' : ''}后过期`;
  }
  
  if (hours > 0) {
    return `${hours}小时后过期`;
  }
  
  return '即将过期';
}

// 格式化限速信息
export function formatRateLimit(rateLimit: KeyRateLimit | undefined): string {
  if (!rateLimit) {
    return '无限制';
  }
  if (rateLimit.requests === -1) {
    return '无限制';
  }
  return `${rateLimit.requests}次/${rateLimit.interval}`;
}

// 获取限速重置时间
export function getLimitResetTime(limitReset: string | null): string {
  if (!limitReset) {
    return '无重置周期';
  }
  const resetMap: Record<string, string> = {
    'daily': '每天8点重置',
    'weekly': '每周一重置',
    'monthly': '每月1号重置',
  };
  return resetMap[limitReset] || limitReset;
}
