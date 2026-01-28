/**
 * 测试 OpenRouter API - 获取 API 密钥列表
 * 参考: https://openrouter.ai/docs/api/api-reference/api-keys/list
 * 
 * 注意：需要先设置环境变量 OPENROUTER_PROVISIONING_KEY
 */

const PROVISIONING_KEY = process.env.OPENROUTER_PROVISIONING_KEY;
// const PROVISIONING_KEY = "sk-or-v1-"

if (!PROVISIONING_KEY) {
  console.error('错误: 请设置 OPENROUTER_PROVISIONING_KEY 环境变量');
  console.error('例如: export OPENROUTER_PROVISIONING_KEY=sk-or-v1-your-key');
  process.exit(1);
}

/**
 * 获取 API 密钥列表
 * @param {Object} options - 查询选项
 * @param {boolean} options.include_disabled - 是否包含已禁用的密钥
 * @param {number} options.offset - 分页偏移量
 */
async function listAPIKeys(options = {}) {
  try {
    console.log('正在获取 API 密钥列表...\n');
    
    // 构建查询参数
    const params = new URLSearchParams();
    if (options.include_disabled !== undefined) {
      params.append('include_disabled', options.include_disabled);
    }
    if (options.offset !== undefined) {
      params.append('offset', options.offset);
    }
    
    const url = `https://openrouter.ai/api/v1/keys${params.toString() ? '?' + params.toString() : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PROVISIONING_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API 错误: ${response.status}`);
      console.error(`错误信息: ${errorText}`);
      return;
    }

    const data = await response.json();
    console.log('✅ 成功获取 API 密钥列表！\n');
    
    // 显示原始数据
    console.log('完整响应数据:');
    console.log(JSON.stringify(data, null, 2));
    
    // 解析和显示密钥信息
    if (data.data && Array.isArray(data.data)) {
      console.log(`\n📋 共找到 ${data.data.length} 个 API 密钥:\n`);
      
      data.data.forEach((key, index) => {
        console.log(`${index + 1}. ${key.label || key.name || '未命名'}`);
        console.log(`   - Hash: ${key.hash}`);
        console.log(`   - 状态: ${key.disabled ? '❌ 已禁用' : '✅ 启用'}`);
        console.log(`   - 限额: ${key.limit ? `$${key.limit}` : '无限制'}`);
        console.log(`   - 剩余额度: ${key.limit_remaining ? `$${key.limit_remaining}` : 'N/A'}`);
        console.log(`   - 已使用: $${key.usage || 0}`);
        console.log(`   - 重置周期: ${key.limit_reset || 'N/A'}`);
        console.log(`   - 包含 BYOK: ${key.include_byok_in_limit ? '是' : '否'}`);
        console.log('');
      });
    } else {
      console.error('❌ 数据结构异常: 缺少 data 字段或格式不正确');
    }
    
  } catch (error) {
    console.error('❌ 请求失败:', error.message);
  }
}

// 执行测试
async function main() {
  // 测试 1: 获取所有密钥（包括已禁用的）
  console.log('========== 测试 1: 获取所有密钥（包括已禁用的） ==========\n');
  await listAPIKeys({ include_disabled: true });
  
  console.log('\n\n========== 测试 2: 获取启用的密钥 ==========\n');
  await listAPIKeys({ include_disabled: false });
  
  console.log('\n\n========== 测试 3: 获取密钥列表（带分页） ==========\n');
  await listAPIKeys({ offset: 0 });
}

main();
