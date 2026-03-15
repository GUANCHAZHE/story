import { callOpenAI, json, resolveOpenAIAccessToken } from './_openai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    json(res, 405, { error: 'Method not allowed' });
    return;
  }

  const token = resolveOpenAIAccessToken(req);
  if (!token) {
    json(res, 401, { error: 'Not authenticated with OpenAI OAuth' });
    return;
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const { context, userAction } = body;
  if (!context || !userAction) {
    json(res, 400, { error: 'Missing context or userAction' });
    return;
  }

  try {
    const payload = await callOpenAI('/v1/responses', token, {
      model: process.env.OPENAI_TEXT_MODEL || 'gpt-4.1-mini',
      input: [
        {
          role: 'system',
          content: '你是一个文字冒险游戏的地下城主（DM）。游戏风格是《葬送的芙莉莲》那种带有淡淡忧伤、宁静的日系奇幻。请根据玩家的当前情境和行动，生成一段简短的剧情发展（约100-150字）。以第二人称“你”来描述。不要给出选择，只描述结果。',
        },
        {
          role: 'user',
          content: `当前情境：${context}\n玩家行动：${userAction}\n请描述接下来发生了什么：`,
        },
      ],
    });

    const text = payload.output_text || payload.output?.[0]?.content?.[0]?.text || '【系统提示：OpenAI 文本返回为空。】';
    json(res, 200, { text });
  } catch (error: any) {
    json(res, 500, { error: error.message || 'OpenAI text generation failed' });
  }
}
