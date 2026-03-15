async function postJSON<T>(url: string, payload: unknown): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || `Request failed: ${response.status}`);
  }

  return data as T;
}

export async function generateImage(prompt: string): Promise<string> {
  try {
    const data = await postJSON<{ image: string }>('/api/generate-image', { prompt });
    return data.image;
  } catch (error) {
    console.error('Image generation error:', error);
    let hash = 0;
    for (let i = 0; i < prompt.length; i++) {
      hash = ((hash << 5) - hash) + prompt.charCodeAt(i);
      hash |= 0;
    }
    const seed = Math.abs(hash).toString();
    return `https://picsum.photos/seed/${seed}/800/450?blur=2`;
  }
}

export async function generateText(context: string, userAction: string): Promise<string> {
  try {
    const data = await postJSON<{ text: string }>('/api/generate-text', { context, userAction });
    return data.text || '【系统提示：OpenAI 文本生成返回为空。】';
  } catch (error) {
    console.error('Text generation error:', error);
    return '【系统提示：OpenAI 文本生成失败。】';
  }
}

export async function generateVideo(prompt: string): Promise<{ id?: string; status?: string; videoUrl?: string | null; raw?: unknown }> {
  return postJSON('/api/generate-video', { prompt });
}

export async function getAuthStatus(): Promise<boolean> {
  const response = await fetch('/api/oauth-me', { credentials: 'include' });
  if (!response.ok) return false;
  const data = await response.json();
  return Boolean(data.authenticated);
}
