import {
  Unstable_Popup as BasePopup,
  PopupProps,
} from "@mui/base/Unstable_Popup";
import { grey } from "@mui/material/colors";
import { Box, styled, Theme } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import useSpeechToText from "../../app/useSpeechToText";
import Diversity1Icon from "@mui/icons-material/Diversity1";
import styles from "./Chat.module.less";
import MicNoneIcon from "@mui/icons-material/MicNone";
import MicIcon from "@mui/icons-material/Mic";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ChatMessage from "./components/ChatMessage";
import { InCityInfo } from "./components/InCityInfo";
import ModeCommentIcon from "@mui/icons-material/ModeComment";

export const ChatPopUp = () => {

  return (
    <div>
      <Box>
        <PopupWithTrigger
          id="popup-without-portal-fixed"
          buttonLabel="No portal, 'fixed' strategy"
          disablePortal
          strategy="fixed"
        />
      </Box>
    </div>
  );
};

function PopupWithTrigger(props: PopupProps & { buttonLabel: string }) {

    const { id, buttonLabel, ...other } = props;
    
    const [textInput, setTextInput] = useState("");

    const { isListening, transcript, startListening, stopListening } = useSpeechToText({ continuous: true })

    const chatBodyRef = useRef<HTMLDivElement | null>(null);
    
    const startStopListening = () => {
        isListening ? stopVoiceInput() : startListening();
    };

    const stopVoiceInput = () => {
        setTextInput(prevVal => prevVal + (transcript.length ? (prevVal.length ? ' ' : '') + transcript : ''))
        stopListening()
    }

    const splitText = (text: string, maxLength = 150) => {
      const sentences = text.match(/[^.!?]+[.!?]*/g) || [text];
      const chunks = [];
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

    const speakUp = (text: string) => {
      window.speechSynthesis.cancel(); // Зупинка попереднього синтезу

      const chunks = splitText(text);

      const speakChunk = (index: number) => {
        if (index >= chunks.length) return;

        const speech = new SpeechSynthesisUtterance(chunks[index]);
        speech.lang = "uk-UA";
        speech.rate = 0.95; 

        speech.onend = () => {
          console.log(`Зачитано частину ${index + 1}`);
          speakChunk(index + 1); // Зачитування наступної частини
        };

        speech.onerror = (event) => {
          console.error("Помилка синтезу мови:", event.error);
        };

        window.speechSynthesis.speak(speech);
      };

      speakChunk(0);
    };

    const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchor(anchor ? null : event.currentTarget);
    };

    const open = Boolean(anchor);

    const inputRef = useRef<HTMLInputElement | null>(null);

    const [chatHistory, setChatHistory] = useState<
        { role: string; text: string; hideInChat?: boolean }[]
        >([{
            hideInChat: true,
            role: 'model',
            text: InCityInfo
        }]);
    
    const generateBotResponse = async (history: { role: string; text: string; }[]) => {

        const updateHistory = (text: string, isError = false) => {
            // Функція для оновлення чату
            setChatHistory((prev) => [
                ...prev.filter((msg) => msg.text !== "Треба трішки подумати..."),
                { role: "model", text, isError },
            ]);
        };

        const formattedHistory = history.map(({ role, text }) => ({ role, parts: [{ text }] }));

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: formattedHistory })
        }

        try {
            //Виклик API для отримання відповіді бота
            const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
            const data = await response.json();
            if (!response.ok) throw new Error(data.error.message || "Something went wrong");
            

            //Очищення та оновлення чату з відповіддю бота
            const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1').
                trim();
            
            speakUp(apiResponseText);
            
            updateHistory(apiResponseText);

        } catch (error: unknown) {
            if (error instanceof Error) {
                updateHistory(error.message, true);
            } else {
                // Обробка інших типів помилок (якщо потрібно)
                updateHistory('Unknown error occurred', true);
            }
        }
    }
    
    const handleFormSumbit = (e: any) => {
        e.preventDefault();

        if (!inputRef.current) return;
        const userMessage = inputRef.current.value.trim();
        inputRef.current.value = '';

        if (!userMessage) return;

        //Update chat hsitory with user`s message

        setChatHistory((history) => [...history, { role: 'user', text: userMessage }]);
        
        setTimeout(() => {
            setChatHistory((history) => [...history, { role: 'model', text: "Треба трішки подумати..." }])

        generateBotResponse([
          ...chatHistory,
          {
            role: "user",
            text: `Using the details provided above, please address this query: ${userMessage}`,
          },
        ]);

    },  600)
     setTextInput("");
    }

    useEffect(() => {

        //Auto-scroll when chat history updated
        chatBodyRef.current?.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: 'smooth' });
    }, [chatHistory]);

  return (
    <div
      style={{
        position: "fixed",
        zIndex: 1000,
        bottom: 0,
        right: 0,
        margin: "30px 0px 20px",
        padding: 5,
      }}
    >
      <Button onClick={handleClick} aria-describedby={id} type="button" style={{borderRadius: '20px'}}>
        <ModeCommentIcon
          sx={{
            color: "#357a38",
            height: "18px",
            width: "18px",
            padding: "6px",
            flexShrink: 0,
            fill: "#357a38",
            background: "white",
            alignSelf: "flex-end",
            borderRadius: "50%",
            marginBottom: "-7px",
          }}
        />
      </Button>
      <div style={{ width: "350px" }}>
        <Popup id={id} open={open} anchor={anchor} {...other}>
          <div
            style={{
              backgroundColor: "#357a38",
              display: "flex",
              alignItems: "center",
              padding: "15px 22px",
              height: "15px",
              borderRadius: "8px 8px 0px 0px",
              margin: "0px 8px 0px 8px",
            }}
          >
            <Diversity1Icon
              sx={{
                color: "#357a38",
                height: "18px",
                width: "18px",
                padding: "6px",
                flexShrink: 0,
                fill: "#357a38",
                background: "white",
                alignSelf: "flex-end",
                borderRadius: "50%",
                marginBottom: "-7px",
              }}
            />
            <h2 style={{ marginLeft: "8px", color: "white" }}>Cityk</h2>
          </div>
          <PopupBody>
            <div ref={chatBodyRef} className={styles.chatBody}>
              <div className={`${styles.message} ${styles.botMessage}`}>
                <Diversity1Icon
                  sx={{
                    color: "#357a38",
                    height: "20px",
                    width: "20px",
                    padding: "6px",
                    flexShrink: 0,
                    fill: "#fff",
                    background: "#357a38",
                    alignSelf: "flex-end",
                    borderRadius: "50%",
                  }}
                />
                <p className={styles.messageText}>
                  Привіт! Чим я можу допомогти?
                </p>
              </div>

              {chatHistory.map((chat, index) => (
                <ChatMessage key={index} chat={chat} />
              ))}
            </div>
            <div className={styles.chatFooter}>
              <form
                action="#"
                className={styles.chatForm}
                onSubmit={handleFormSumbit}
              >
                <input
                  ref={inputRef}
                  className={styles.messageInput}
                  disabled={isListening}
                  value={
                    isListening
                      ? textInput +
                        (transcript.length
                          ? (textInput.length ? " " : "") + transcript
                          : "")
                      : textInput
                  }
                  onChange={(e) => {
                    setTextInput(e.target.value);
                  }}
                />
                {textInput == "" ? (
                  <button
                    className={`${styles.chatForm}`}
                    onClick={() => {
                      startStopListening();
                    }}
                    type="button"
                    style={{ marginRight: 5 }}
                  >
                    {isListening ? <MicIcon /> : <MicNoneIcon />}
                  </button>
                ) : (
                  <button
                    className={`${styles.chatForm}`}
                    type="button"
                    style={{ marginRight: 5 }}
                    onClick={handleFormSumbit}
                  >
                    <ArrowUpwardIcon />
                  </button>
                )}
              </form>
            </div>
          </PopupBody>
        </Popup>
      </div>
    </div>
  );
}

const Popup = styled(BasePopup)`
  z-index: 10;
`;
const PopupBody = styled("div")(
  ({ theme }: { theme: Theme }) => `
  width: 380px;
  height: 500px;
  display: flex;
  align-items: center;
  padding: 19px;
  margin: 0px 8px 8px 8px;
  border-radius: 0px 0px 8px 8px;
  border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
  background-color: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  box-shadow: ${
    theme.palette.mode === "dark"
      ? `0px 4px 8px rgb(0 0 0 / 0.7)`
      : `0px 4px 8px rgb(0 0 0 / 0.1)`
  };
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
`
);

const Button = styled("button")(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.5;
  background-color: #357a38;
  padding: 8px 16px;
  border-radius: 8px;
  color: white;
  transition: all 150ms ease;
  cursor: pointer;
  border: 1px solid #357a38;
  box-shadow: 0 2px 4px ${
    theme.palette.mode === "dark"
      ? "rgba(0, 0, 0, 0.5)"
      : "rgba(0, 127, 255, 0.5)"
  }, inset 0 1.5px 1px #47824a, inset 0 -2px 1px #2e7031;

  &:hover {
    background-color: #2e7031;
  }

  &:active {
    background-color: #27632a;
    box-shadow: none;
  }

  &:focus-visible {
    box-shadow: 0 0 0 4px ${
      theme.palette.mode === "dark" ? "#5a8b5c" : "#739574"
    };
    outline: none;
  }

  &.disabled {
    opacity: 0.4;
    cursor: not-allowed;
    box-shadow: none;

    &:hover {
      background-color: #357a38;
    }
  }
`
);