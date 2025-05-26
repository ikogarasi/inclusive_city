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
import {
  detectRouteIntent,
  findInclusivePlaces,
  InclusivePlace,
  navigateToMapPage,
} from "./../../app/overpassService";
import { buildRoute } from "./../../app/api/utils/way";
import { useAppSelector } from "../../app/hooks";
import { speakUp } from "../../app/useTexttoSpeech";
// @ts-ignore
import * as polyline from "@mapbox/polyline";
import { useNavigate } from "react-router-dom";
import { useSubmitQuestionMutation } from "../../api/quesionsRtkApi";



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
      // Використовуємо той самий мутацію, що і в SendQuestion компоненті
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

  const generateBotResponse = async (
    history: { role: string; text: string }[]
  ) => {
    const updateHistory = (text: string, isError = false) => {
      // Функція для оновлення чату
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
      //Виклик API для отримання відповіді бота
      const response = await fetch(
        import.meta.env.VITE_API_URL,
        requestOptions
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error.message || "Something went wrong");

      //Очищення та оновлення чату з відповіддю бота
      let apiResponseText = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .trim();

      const overpassQueryMatch = apiResponseText.match(
        /\[out:json\];\s*\([\s\S]*?\);\s*out center;/
      );

      console.log(apiResponseText);

      const userMessage = history[history.length - 1]?.text || "";

      const navigationTag = apiResponseText.match(/\[NAVIGATE:(.*?)\]/i);

      const questionTag = apiResponseText.match(/\[SUBMIT_QUESTION:(.*?)\]/s);

      apiResponseText = apiResponseText
        .replace(/\[NAVIGATE:(.*?)\]/i, "")
        .replace(/\[SUBMIT_QUESTION:(.*?)\]/s, "")
        .trim();
      
        if (questionTag) {
          const questionText = questionTag[1].trim();

          // Перевірка авторизації
          if (userData.userData.role !== "User") {
            updateHistory(
              "Для того, щоб надіслати питання, необхідно зареєструватися чи увійти у свій профіль на нашому сайті."
            );
            return;
          }

          updateHistory("Надсилаю ваше питання адміністрації...");

          try {
            const success = await handleQuestionSubmission(questionText);

            if (success) {
              updateHistory(
                "Ваше питання успішно надіслано! Адміністрація розгляне його та спробує відповісти якнайшвидше (зазвичай протягом 24 годин)."
              );
            } else {
              updateHistory(
                "На жаль, сталася помилка при надсиланні питання. Спробуйте ще раз або скористайтеся формою на сторінці 'Запитання та відповіді'."
              );
            }
          } catch (error) {
            console.error("Error submitting question:", error);
            updateHistory(
              "На жаль, сталася помилка при надсиланні питання. Спробуйте ще раз або скористайтеся формою на сторінці 'Запитання та відповіді'."
            );
          }

          return;
        }

      if (navigationTag) {
        const path = navigationTag[1].trim();

        // Перевірка авторизації для сторінки /message
        if (path === "/message") {

          if (userData.userData.role !== "User") {
            updateHistory("Для того, щоб задати питання або написати зауваження необхідно зареєструватися чи увійти у свій профіль на нашому сайті)");
            return;
          }
        }

        updateHistory(`Переходжу на сторінку: ${path}...`);

        setTimeout(() => {
          navigate(path);
        }, 1000);
        return;
      }



      // Перевіряємо, чи є в повідомленні ключові слова для побудови маршруту
      const routeKeywords = [
        "маршрут",
        "шлях",
        "прокласти",
        "проклади",
        "як дійти",
        "як пройти",
        "як доїхати",
        "як добратися",
        "дорога до",
        "провести до",
        "покажи дорогу",
        "побудуй",
      ];

      // Перевіряємо наявність ключових слів маршруту в запиті користувача
      const isRouteRequest = routeKeywords.some((keyword) =>
        userMessage.toLowerCase().includes(keyword.toLowerCase())
      );

      // Обробка запиту на побудову маршруту
      const processRouteRequest = async (userMessage: string) => {
        // Отримуємо актуальні дані про місця з sessionStorage
        let placesToUse = [...lastFoundPlaces]; // Спочатку берем що є в стані

        const storedInclusivePlaces = sessionStorage.getItem("inclusivePlaces");
        if (storedInclusivePlaces) {
          try {
            const parsedPlaces = JSON.parse(storedInclusivePlaces);

            // Одразу використовуємо отримані дані
            placesToUse = parsedPlaces;

            // Також оновлюємо стан для майбутніх запитів
            setLastFoundPlaces(parsedPlaces);

            console.log(
              "Завантажено місць із sessionStorage:",
              parsedPlaces.length
            );
          } catch (error) {
            console.error(
              "Error parsing inclusivePlaces from sessionStorage:",
              error
            );
          }
        }

        // Перевіряємо, чи є у нас дані про місця
        if (placesToUse.length === 0) {
          updateHistory(
            "Спочатку потрібно знайти інклюзивні місця. Спробуйте задати запит про пошук доступних місць."
          );
          return;
        }

        console.log("Виявлено запит на маршрут:", userMessage);
        console.log(
          "Доступні місця:",
          placesToUse.map((p) => p.tags?.name || p.address)
        );

        try {
          // Використовуємо detectRouteIntent для визначення конкретного місця
          const targetPlace = await detectRouteIntent(userMessage, placesToUse);
          console.log("Цільове місце:", targetPlace);

          if (targetPlace && targetPlace !== "Немає маршруту") {
            // Шукаємо відповідне місце серед завантажених місць
            const matched = placesToUse.find((p) => {
              // Перевіряємо назву та адресу (якщо вони існують)
              const nameMatch =
                p.tags?.name &&
                (targetPlace
                  .toLowerCase()
                  .includes(p.tags.name.toLowerCase()) ||
                  (p.tags?.name &&
                    p.tags.name
                      .toLowerCase()
                      .includes(targetPlace.toLowerCase())));

              const addressMatch =
                p.address &&
                (targetPlace.toLowerCase().includes(p.address.toLowerCase()) ||
                  p.address.toLowerCase().includes(targetPlace.toLowerCase()));

              return nameMatch || addressMatch;
            });

            if (matched && matched.lat && matched.lon) {
              updateHistory(
                `Будую маршрут до "${matched.tags?.name || matched.address}"...`
              );

              let startCoordinates = {
                lat: 49.84309611110559, // Львів за замовчуванням
                lon: 24.030603315948206,
              };

              try {
                // Спроба отримати точні координати
                const position = await new Promise<GeolocationPosition>(
                  (resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                      enableHighAccuracy: true,
                      timeout: 5000,
                      maximumAge: 0,
                    });
                  }
                );

                startCoordinates = {
                  lat: position.coords.latitude,
                  lon: position.coords.longitude,
                };
              } catch (locError) {
                console.warn(
                  "Не вдалося отримати геолокацію для маршруту:",
                  locError
                );
                updateHistory(
                  "Не вдалося визначити ваше місцезнаходження. Використовую координати Львова за замовчуванням."
                );
              }

              console.log(
                `Будую маршрут від [${startCoordinates.lat}, ${startCoordinates.lon}] до [${matched.lat}, ${matched.lon}]`
              );

              const route = await buildRoute(
                matched.lat,
                matched.lon,
                startCoordinates.lat,
                startCoordinates.lon
              );

              // Зберігаємо координати користувача в sessionStorage
              sessionStorage.setItem(
                "userCoordinates",
                JSON.stringify(startCoordinates)
              );

              // Зберігаємо маршрут і перенаправляємо на карту
              setPolyline(route);
              sessionStorage.setItem("routeData", JSON.stringify(route));
              navigateToMapPage(placesToUse, navigate);

              updateHistory(
                `Ось маршрут до ${matched.tags?.name || matched.address}.`
              );
            } else {
              updateHistory(
                "Не вдалося знайти вказане місце серед знайдених раніше інклюзивних місць. Спробуйте уточнити назву, вказавши адресу"
              );
            }
          } else {
            updateHistory(
              "Не вдалося визначити до якого місця ви хочете прокласти маршрут. Будь ласка, вкажіть назву або адресу місця точніше."
            );
          }
        } catch (error) {
          console.error("Помилка при побудові маршруту:", error);
          updateHistory(
            "На жаль, сталася помилка при побудові маршруту. Спробуйте ще раз."
          );
        }
      };

      // Обробляємо запит на маршрут, якщо він є
      if (isRouteRequest) {
        await processRouteRequest(userMessage);
        return; // Важливо - повертаємось, щоб не продовжувати виконання функції
      }
      // Обробка запиту на пошук місць через Overpass API
      else if (overpassQueryMatch) {
        let overpassQuery = overpassQueryMatch[0].trim();

        // Показуємо користувачеві, що виконуємо пошук
        updateHistory("Я шукаю інклюзивні місця за вашим запитом...");

        try {
          // Перевіряємо, чи потрібна нам геолокація для цього запиту
          const needsGeolocation =
            overpassQuery.includes("LAT") && overpassQuery.includes("LON");

          // Ініціалізуємо координати
          let coordinates = {
            lat: 49.84309611110559, // Львів за замовчуванням
            lon: 24.030603315948206,
          };

          // Отримуємо геолокацію, якщо вона потрібна
          if (needsGeolocation) {
            updateHistory("Визначаю ваше місцезнаходження...");

            try {
              const position = await new Promise<GeolocationPosition>(
                (resolve, reject) => {
                  if (!navigator.geolocation) {
                    reject(
                      new Error("Геолокація не підтримується вашим браузером")
                    );
                    return;
                  }
                  navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0,
                  });
                }
              );

              coordinates = {
                lat: position.coords.latitude,
                lon: position.coords.longitude,
              };

              console.log("Отримані координати:", coordinates);
            } catch (locError) {
              console.warn("Не вдалося отримати геолокацію:", locError);
              updateHistory(
                "Не вдалося визначити ваше місцезнаходження. Використовую координати Львова за замовчуванням."
              );
            }

            // Підставляємо координати в запит
            overpassQuery = overpassQuery
              .replace(/LAT/g, coordinates.lat.toString())
              .replace(/LON/g, coordinates.lon.toString());
          }

          console.log("Підготовлений Overpass запит:", overpassQuery);

          // Використовуємо функцію з нашого модуля для пошуку інклюзивних місць
          const inclusivePlaces = await findInclusivePlaces(overpassQuery);

          // Зберігаємо знайдені місця в стані для подальших запитів на маршрути
          setLastFoundPlaces(inclusivePlaces);
          console.log("Знайдено інклюзивних місць:", inclusivePlaces.length);

          if (inclusivePlaces.length > 0) {
            // Формуємо відповідь з адресами
            let placesResponse = "Я знайшов наступні інклюзивні місця:\n\n";
            inclusivePlaces.forEach((place, index) => {
              placesResponse += `${index + 1}. ${place.address}\n`;
            });

            placesResponse +=
              "\nЗараз я перенаправлю вас на карту з цими місцями...";

            // Оновлюємо історію чату
            updateHistory(placesResponse);

            // Зберігаємо координати користувача в sessionStorage для використання на сторінці карти
            sessionStorage.setItem(
              "userCoordinates",
              JSON.stringify(coordinates)
            );

            // Після невеликої затримки переходимо на сторінку карти
            setTimeout(() => {
              navigateToMapPage(inclusivePlaces, navigate);
            }, 2000);
          } else {
            updateHistory(
              "На жаль, я не знайшов інклюзивних місць, які відповідають вашому запиту."
            );
          }
        } catch (error) {
          console.error("Error processing Overpass query:", error);
          const errorMessage =
            error instanceof Error ? error.message : "Невідома помилка";
          updateHistory(`Виникла помилка при пошуку: ${errorMessage}`, true);
        }
      }
      // Стандартна відповідь моделі
      else {
        // Якщо немає Overpass запиту і це не запит на маршрут, просто показуємо відповідь бота
        // Використовуємо імпортовану функцію speakUp
        speakUp(apiResponseText);
        updateHistory(apiResponseText);
      }
    } catch (error) {
      console.error("Error generating bot response:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Невідома помилка";
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

    //Update chat hsitory with user`s message

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
    console.log("Scroll down", location);
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
