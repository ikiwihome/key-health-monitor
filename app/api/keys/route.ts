import { NextResponse } from 'next/server';

export async function GET() {
  const provisioningKey = process.env.OPENROUTER_PROVISIONING_KEY;

  if (!provisioningKey) {
    console.error('OPENROUTER_PROVISIONING_KEY is not configured');
    return NextResponse.json({ error: 'Provisioning key not configured' }, { status: 400 });
  }

  try {
    // 1. 获取 Key 列表
    const listUrl = 'https://openrouter.ai/api/v1/keys';
    const listResponse = await fetch(listUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${provisioningKey}`,
      },
    });

    if (!listResponse.ok) {
      const errorText = await listResponse.text();
      console.error('OpenRouter API Error:', errorText);
      throw new Error(`Failed to fetch key list: ${listResponse.status} ${listResponse.statusText}`);
    }

    const contentType = listResponse.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await listResponse.text();
      console.error('Unexpected response content type:', contentType, 'Body:', text);
      throw new Error('OpenRouter API returned non-JSON response');
    }

    const listData = await listResponse.json();
    const keys = listData.data || [];

    // 根据 list-api-key.md，/api/v1/keys 返回的列表已经包含了详细的使用信息（usage, limit, label 等）
    // 因此不需要再为每个 key 调用 /api/v1/key。
    // /api/v1/key 仅用于获取“当前”正在使用的 token 的信息。

    return NextResponse.json({ data: keys });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
