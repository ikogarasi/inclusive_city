import React from "react";
import styles from "../Chat.module.less";
import Diversity1Icon from "@mui/icons-material/Diversity1";

type ChatMessageProps = {
  chat: { role: string; text: string; isError?: boolean; hideInChat?: boolean };
  previousChat?: { role: string }; // додали попереднє повідомлення для перевірки
};

const ChatMessage: React.FC<ChatMessageProps> = ({ chat, previousChat }) => {
  // Перевірка, чи попереднє повідомлення належить тому ж боту
  const isBotMessageAfterBot =
    previousChat?.role === "model" && chat.role === "model";

  return (
    !chat.hideInChat && (
      <div
        className={`${styles.message} ${
          chat.role === "model" ? styles.botMessage : styles.userMessage
        } ${chat.isError ? styles.messageError : ""} ${
          isBotMessageAfterBot ? styles.noTopMargin : ""
        }`}
      >
        {chat.role === "model" && (
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
        )}
        <p className={styles.messageText}>{chat.text}</p>
      </div>
    )
  );
};

export default ChatMessage;
