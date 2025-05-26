import { useEffect, useRef, useState } from "react"

const useSpeechToText = (options: any) => {
    const [isListening, setIsListening] = useState(false)
    const [transcript, setTranscript] = useState('')
    const recognitionRef = useRef<any>(null)

    useEffect(() => {
      // Перевірка, чи підтримується Web Speech API у браузері
      if (!("webkitSpeechRecognition" in window)) {
        console.error("Web speech api is not supported");
        return;
      }

      // Ініціалізація об'єкта розпізнавання мови
      recognitionRef.current = new (window as any).webkitSpeechRecognition();
      const recognition = recognitionRef.current;

      // Налаштування параметрів розпізнавання
      recognition.interimResults = options.interimResults || true; // Отримання проміжних результатів під час розпізнавання
      recognition.lang = options.lang || "uk-UA"; // Встановлення мови розпізнавання (українська за замовчуванням)
      recognition.continuous = options.continuous || false; // Якщо true — розпізнавання триває без зупинки

      // Перевірка наявності підтримки граматики (SpeechGrammarList)
      if ("webkitSpeechGrammarList" in window) {
        const grammar =
          "#JSGF v1.0; grammar punctuation; public <punc> = . | , | ? | ! | ; | : ;";
        const speechRecognitionList = new (
          window as any
        ).webkitSpeechGrammarList();
        speechRecognitionList.addFromString(grammar, 1);
        recognition.grammars = speechRecognitionList;
      }

      // Обробник події отримання результатів розпізнавання
      recognition.onresult = (event: any) => {
        let text = "";
        for (let i = 0; i < event.results.length; i++) {
          text += event.results[i][0].transcript;
        }
        setTranscript(text);
      };

      // Обробник помилок під час розпізнавання мови
      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
      };

      // Обробник події завершення розпізнавання
      recognition.onend = () => {
        setIsListening(false);
        setTranscript("");
      };

      // Функція очистки для зупинки розпізнавання при демонтажі компонента або повторному запуску 
      return () => {
        recognition.stop();
      };
    }, [])

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            recognitionRef.current.start()
            setIsListening(true)
        }
    }

    const stopListening = () => {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
        setIsListening(false);
      }
    };

    return {
        isListening,
        transcript,
        startListening,
        stopListening
    }
}

export default useSpeechToText