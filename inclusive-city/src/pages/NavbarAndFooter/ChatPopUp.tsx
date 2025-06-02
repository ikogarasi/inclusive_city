import {
  Unstable_Popup as BasePopup,
  PopupProps,
} from "@mui/base/Unstable_Popup";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
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
import {
  detectRouteIntent,
  findInclusivePlaces,
  InclusivePlace,
  navigateToMapPage,
} from "./../../app/overpassService";
import { buildRoute } from "./../../app/api/utils/way";
import { useAppSelector } from "../../app/hooks";
import { speakUp } from "../../app/useTexttoSpeech";
import { useAddReviewMutation } from "../../api/externalServicesRktApi";
import { RouteHandler, RouteHandlerContext } from '../../app/handlers/routeHandler';
import { OverpassHandler, OverpassHandlerContext } from '../../app/handlers/overpassHandler';
import { StructureUtils } from '../../app/handlers/structureUtils';
import { 
  NavigationTagHandler,
  QuestionTagHandler,
  ReviewTagHandler,
  StructureNavigationTagHandler,
  TagHandlerContext
} from '../../app/handlers/tagHandlers';
// @ts-ignore
import * as polyline from "@mapbox/polyline";
import { useNavigate } from "react-router-dom";
import { useSubmitQuestionMutation } from "../../api/quesionsRtkApi";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";



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

  const [polylines, setPolyline] = React.useState<L.LatLngExpression[]>([]);

  const [lastFoundPlaces, setLastFoundPlaces] = useState<InclusivePlace[]>([]);

  const [textInput, setTextInput] = useState("");

  const { isListening, transcript, startListening, stopListening } =
    useSpeechToText({ continuous: true });

  const chatBodyRef = useRef<HTMLDivElement | null>(null);

  const userData = useAppSelector((state) => state.user);

  const [submitQuestion] = useSubmitQuestionMutation();

  const navigate = useNavigate();

  const [addReview] = useAddReviewMutation();

  const reduxStructures = useSelector(
    (state: RootState) => state.structures.items
  ); 

  const startStopListening = () => {
    isListening ? stopVoiceInput() : startListening();
  };

  const stopVoiceInput = () => {
    setTextInput(
      (prevVal) =>
        prevVal +
        (transcript.length ? (prevVal.length ? " " : "") + transcript : "")
    );
    stopListening();
  };

  // Cтан для відстеження того, чи користувач взаємодіяв з чатом
  const [hasUserInteracted, setHasUserInteracted] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("chatUserInteracted");
      return saved ? JSON.parse(saved) : false;
    } catch (error) {
      console.error("Error loading chat interaction state:", error);
      return false;
    }
  });

  const handleQuestionSubmission = async (questionText: string) => {
    try {
      
      await submitQuestion({ description: questionText });
      return true;
    } catch (error) {
      console.error("Error submitting question:", error);
      return false;
    }
  };

  const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);

  // Окремий стан для контролю відкриття попапу
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(hasUserInteracted);

  // Зберігаємо стан взаємодії в localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        "chatUserInteracted",
        JSON.stringify(hasUserInteracted)
      );
    } catch (error) {
      console.error("Error saving chat interaction state:", error);
    }
  }, [hasUserInteracted]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!anchor) {
      setAnchor(event.currentTarget);
      setIsPopupOpen(true);
    } else {
      setAnchor(null);
      setIsPopupOpen(false);
    }
  };

  // Автоматично встановлюємо anchor для користувачів, які раніше взаємодіяли
  useEffect(() => {
    if (hasUserInteracted && !anchor && isPopupOpen) {
      // Знаходимо кнопку чату для правильного позиціонування
      const chatButton = document.querySelector(
        '[aria-describedby="' + id + '"]'
      ) as HTMLElement;
      if (chatButton) {
        setAnchor(chatButton);
      }
    }
  }, [hasUserInteracted, anchor, isPopupOpen, id]);

  const open = isPopupOpen && Boolean(anchor);

  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const [chatHistory, setChatHistory] = useState<
    { role: string; text: string; hideInChat?: boolean }[]
  >(() => {
    const saved = sessionStorage.getItem("chatHistory");
    if (saved) {
      return JSON.parse(saved);
    } else {
      return [
        {
          hideInChat: true,
          role: "model",
          text: InCityInfo,
        },
      ];
    }
  });

  useEffect(() => {
    sessionStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    console.log(chatHistory);
  }, [chatHistory]);

  const buttonFocusRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    // Дати трохи часу браузеру на рендер перед фокусом
    const timer = setTimeout(() => {
      buttonFocusRef.current?.focus();
    }, 100); // затримка для сумісності з рідерами

    return () => clearTimeout(timer);
  }, []);


  const handleReviewSubmission = async (reviewData: {
    osmId: number;
    osmType: string;
    username: string;
    imageBase64: string;
    createdBy: number;
    comment: string;
    rate: number;
  }): Promise<boolean> => {
    try {
      await addReview(reviewData).unwrap();
      return true;
    } catch (error) {
      console.error("Error submitting review:", error);
      return false;
    }
  };

  const [description, setDescription] = useState("");
  const [rate, setRate] = useState(0);
  
  const generateBotResponse = async (
  history: { role: string; text: string }[]
) => {
  const updateHistory = (text: string, isError = false) => {
    setChatHistory((prev) => [
      ...prev.filter((msg) => msg.text !== "Треба трішки подумати..."),
      { role: "model", text, isError },
    ]);
  };

  const formattedHistory = history.map(({ role, text }) => ({
    role,
    parts: [{ text }],
  }));

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: formattedHistory }),
  };

  try {
    // Виклик API для отримання відповіді бота
    const response = await fetch(
      import.meta.env.VITE_API_URL,
      requestOptions
    );
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.error.message || "Something went wrong");

    // Очищення та оновлення чату з відповіддю бота
    let apiResponseText = data.candidates[0].content.parts[0].text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .trim();

    console.log(apiResponseText);

    const userMessage = history[history.length - 1]?.text || "";
    
    // Отримуємо доступні структури
    const availableStructures = StructureUtils.getAvailableStructures(
      lastFoundPlaces,
      reduxStructures
    );

    // Витягуємо теги з відповіді
    const {
      navigationTag,
      questionTag,
      structureNavigationTag,
      reviewTag,
      overpassQueryMatch,
    } = StructureUtils.extractTags(apiResponseText);

    // Очищуємо текст від тегів
    apiResponseText = StructureUtils.cleanApiResponse(apiResponseText);

    // Контекст для обробників тегів
    const tagHandlerContext: TagHandlerContext = {
      updateHistory,
      navigate,
      userData,
      handleQuestionSubmission,
      handleReviewSubmission,
      description,
      rate,
      setDescription,
      setRate,
      availableStructures,
    };

    // Обробка різних типів тегів
    if (reviewTag) {
      await ReviewTagHandler.handle(reviewTag, tagHandlerContext);
      return;
    }

    if (questionTag) {
      await QuestionTagHandler.handle(questionTag, tagHandlerContext);
      return;
    }

    if (navigationTag) {
      await NavigationTagHandler.handle(navigationTag, tagHandlerContext);
      return;
    }

    if (structureNavigationTag) {
      await StructureNavigationTagHandler.handle(structureNavigationTag, tagHandlerContext);
      return;
    }

    // Перевіряємо, чи є це запит на маршрут
    if (RouteHandler.isRouteRequest(userMessage)) {
      const routeHandlerContext: RouteHandlerContext = {
        updateHistory,
        navigate,
        setPolyline,
        lastFoundPlaces,
        setLastFoundPlaces,
      };

      await RouteHandler.processRouteRequest(userMessage, routeHandlerContext);
      return;
    }

    // Обробка запиту на пошук місць через Overpass API
    if (overpassQueryMatch) {
      const overpassHandlerContext: OverpassHandlerContext = {
        updateHistory,
        navigate,
        setLastFoundPlaces,
      };

      await OverpassHandler.processOverpassQuery(overpassQueryMatch, overpassHandlerContext);
      return;
    }

    // Стандартна відповідь моделі
    speakUp(apiResponseText);
    updateHistory(apiResponseText);

  } catch (error) {
    console.error("Error generating bot response:", error);
    const errorMessage = error instanceof Error ? error.message : "Невідома помилка";
    updateHistory(`Виникла помилка: ${errorMessage}`, true);
  }
};

  const handleFormSumbit = (e: any) => {
    e.preventDefault();

    if (!inputRef.current) return;
    const userMessage = inputRef.current.value.trim();
    inputRef.current.value = "";

    if (!userMessage) return;

    if (!hasUserInteracted) {
      setHasUserInteracted(true);
      console.log(
        "Користувач вперше відправив повідомлення - встановлено hasUserInteracted: true"
      );
    }

    //Оновлення історії чату з повідомленням користувача
    setChatHistory((history) => [
      ...history,
      { role: "user", text: userMessage },
    ]);

    setTimeout(() => {
      setChatHistory((history) => [
        ...history,
        { role: "model", text: "Треба трішки подумати..." },
      ]);

      generateBotResponse([
        ...chatHistory,
        {
          role: "user",
          text: `Using the details provided above, please address this query: ${userMessage}`,
        },
      ]);
    }, 600);
    setTextInput("");
  };

  useEffect(() => {
    //Auto-scroll when chat history updated
    chatBodyRef.current?.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatHistory, location]);

  useEffect(() => {
    console.log(location);
  }, [location]);

  return (
    <div
      style={{
        position: "fixed",
        zIndex: 1000,
        bottom: 0,
        right: -80,
        margin: "30px 0px 20px",

        padding: 5,
      }}
    >
      <Button
        onClick={handleClick}
        aria-label="Це чат-бот Сітик, він допоможе вам скористатися усіма можливотсями нашого сайту за допомогою 
        голосового введення або текстових запитів. Натисніть на кнопку, щоб відкрити чат."
        ref={buttonFocusRef}
        aria-describedby={id}
        type="button"
        style={{ borderRadius: "20px" }}
      >
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
      <div style={{ width: "350px", marginTop: "-15px" }}>
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
            <h2 style={{ marginLeft: "8px", color: "white" }}>Сітик</h2>
            <DeleteIcon
            sx={{
                color: "white",
                height: "30px",
                width: "30px",
                padding: "2px",
                flexShrink: 0,
                borderRadius: "50%",
                marginBottom: "-7px",
                marginLeft: "auto", 
              }}/>
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
                <textarea
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
                  rows={1}
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
  z-index: drawer;
`;
const PopupBody = styled("div")(
  ({ theme }: { theme: Theme }) => `
  width: 380px;
  height: 470px;
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
