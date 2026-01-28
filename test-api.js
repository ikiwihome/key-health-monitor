/**
 * 测试 OpenRouter API 调用
 */

const API_KEY = "sk-or-v1-"

async function testOpenRouterAPI() {
  try {
    console.log('正在测试 OpenRouter API...');
    
    const response = await fetch('https://openrouter.ai/api/v1/key', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API 错误: ${response.status} ${errorText}`);
      return;
    }

    const data = await response.json();
    console.log('✅ API 调用成功！');
    console.log('\n返回的数据结构:');
    console.log(JSON.stringify(data, null, 2));
    
    // 验证数据结构
    if (data.data) {
      const keyData = Array.isArray(data.data) ? data.data[0] : data.data;
      console.log('\n✅ 数据结构验证通过');
      console.log(`- Key 标识: ${keyData.label}`);
      console.log(`- 限额: ${keyData.limit || '无限制'}`);
      console.log(`- 已使用: ${keyData.usage}`);
      console.log(`- 重置周期: ${keyData.limit_reset}`);
      console.log(`- 失效时间: ${keyData.expires_at || '永久有效'}`);
      console.log(`- 请求限制: ${keyData.rate_limit?.requests}/${keyData.rate_limit?.interval}`);
    } else {
      console.error('❌ 数据结构异常: 缺少 data 字段');
    }
    
  } catch (error) {
    console.error('❌ 请求失败:', error.message);
  }
}

testOpenRouterAPI();
