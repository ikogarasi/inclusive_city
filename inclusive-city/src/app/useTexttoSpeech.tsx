/**
 * Сервіс для роботи з Web Speech API
 * Містить функції для синтезу мови (text-to-speech)
 */

/**
 * Розбиває текст на частини для кращого відтворення мови
 * @param text - текст для розбиття
 * @param maxLength - максимальна довжина однієї частини (за замовчуванням 150 символів)
 * @returns масив частин тексту
 */
export const splitText = (text: string, maxLength = 150): string[] => {
  const sentences = text.match(/[^.!?]+[.!?]*/g) || [text];
  const chunks: string[] = [];
  let chunk = "";

  for (const sentence of sentences) {
    if ((chunk + sentence).length <= maxLength) {
      chunk += sentence;
    } else {
      chunks.push(chunk.trim());
      chunk = sentence;
    }
  }
  if (chunk.trim()) chunks.push(chunk.trim());
  return chunks;
};

/**
 * Відтворює текст за допомогою синтезу мови
 * Автоматично розбиває довгий текст на частини для кращого відтворення
 * @param text - текст для відтворення
 * @param options - опції для налаштування мови
 */
export const speakUp = (
  text: string,
  options: {
    lang?: string;
    rate?: number;
    pitch?: number;
    volume?: number;
    voice?: SpeechSynthesisVoice; // новий параметр
  } = {}
): void => {
  const {
    lang = "uk-UA",
    rate = 0.95,
    pitch = 1,
    volume = 1,
    voice = getDefaultUkrainianVoice(),
  } = options;

  window.speechSynthesis.cancel();
  const chunks = splitText(text);

  const speakChunk = (index: number): void => {
    if (index >= chunks.length) return;
    const speech = new SpeechSynthesisUtterance(chunks[index]);
    speech.lang = lang;
    speech.rate = rate;
    speech.pitch = pitch;
    speech.volume = volume;

    if (voice) {
      speech.voice = voice;
    }

    speech.onend = () => {
        console.log(`Зачитано частину ${index + 1}`);
        const voice = getDefaultUkrainianVoice();
        console.log("Використаний голос:", voice);
      speakChunk(index + 1);
    };

    speech.onerror = (event) => {
      console.error("Помилка синтезу мови:", event.error);
    };

    window.speechSynthesis.speak(speech);
  };

  speakChunk(0);
};
  

/**
 * Зупиняє поточне відтворення мови
 */
export const stopSpeaking = (): void => {
  window.speechSynthesis.cancel();
};

/**
 * Призупиняє поточне відтворення мови
 */
export const pauseSpeaking = (): void => {
  window.speechSynthesis.pause();
};

/**
 * Відновлює призупинене відтворення мови
 */
export const resumeSpeaking = (): void => {
  window.speechSynthesis.resume();
};

/**
 * Перевіряє, чи підтримується синтез мови в браузері
 * @returns true, якщо підтримується
 */
export const isSpeechSynthesisSupported = (): boolean => {
  return "speechSynthesis" in window;
};

/**
 * Отримує список доступних голосів
 * @returns масив доступних голосів
 */

export const getDefaultUkrainianVoice = (): SpeechSynthesisVoice | null => {
    const voices = window.speechSynthesis.getVoices();
    return voices.find(
      (voice) =>
        voice.name.toLowerCase().includes("Google українська") ||
        (voice.lang && voice.lang.toLowerCase().startsWith("uk"))
    ) || null;
  };
  

/**
 * Перевіряє статус відтворення мови
 * @returns об'єкт з інформацією про стан відтворення
 */
export const getSpeechStatus = () => {
  return {
    speaking: window.speechSynthesis.speaking,
    pending: window.speechSynthesis.pending,
    paused: window.speechSynthesis.paused,
  };
};
