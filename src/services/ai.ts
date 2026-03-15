import { GoogleGenAI } from "@google/genai";

// Initialize Gemini for image generation
// @ts-ignore - process.env is injected by the platform for GEMINI_API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateImage(prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: prompt + " anime fantasy style, frieren style, high quality, masterpiece, serene, slightly melancholic" }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Image generation error:", error);
    // Fallback to a placeholder image when quota is exceeded or other errors occur
    // Using a simple hash of the prompt to get consistent but unique images
    let hash = 0;
    for (let i = 0; i < prompt.length; i++) {
      hash = ((hash << 5) - hash) + prompt.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    const seed = Math.abs(hash).toString();
    return `https://picsum.photos/seed/${seed}/800/450?blur=2`;
  }
}

export async function generateText(context: string, userAction: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `当前情境：${context}\n玩家行动：${userAction}\n请描述接下来发生了什么：`,
      config: {
        systemInstruction: "你是一个文字冒险游戏的地下城主（DM）。游戏风格是《葬送的芙莉莲》那种带有淡淡忧伤、宁静的日系奇幻。请根据玩家的当前情境和行动，生成一段简短的剧情发展（约100-150字）。以第二人称“你”来描述。不要给出选择，只描述结果。"
      }
    });

    return response.text || "【系统提示：AI 文本生成返回为空。】";
  } catch (error) {
    console.error("Text generation error:", error);
    return "【系统提示：AI 文本生成失败。】";
  }
}
