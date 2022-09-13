import { createStyles } from "@mantine/core";
import { useEffect, useState } from "react";
import { getMessages, Message, sendMessage } from "../../../api/messages";
import { Room } from "../../../api/rooms";
import { WsConnection } from "../../../api/socket";
import { MessageEditor } from "./MessageEditor";
import { MessageList } from "./MessageList";
import { Topbar } from "./Topbar";

const useStyles = createStyles((theme) => ({
  container: {
    // Become a container for all descendants with position: fixed
    transform: "translateX(0)",
    boxSizing: "border-box",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    padding: 0,
    paddingTop: "50px",
  },
}));

interface ChatProps {
  room: Room;
  socket: WsConnection;
  onOpenInfo: () => void;
}

export function Chat({ room, socket, onOpenInfo }: ChatProps) {
  const { classes } = useStyles();
  const [messages, setMessages] = useState<Message[]>([]);
  const [noOlderMessages, setNoOlderMessages] = useState(false);
  const [loadMessages, setLoadMessages] = useState<() => void | undefined>();

  useEffect(() => {
    let canceled = false;

    function loadMessages(before?: string) {
      if (canceled) return;
      getMessages(room.id, before).then((resp) => {
        if (canceled) return;
        setNoOlderMessages(resp.noOlder);
        resp.messages.reverse();
        setMessages((prevMsgs) => [...resp.messages, ...prevMsgs]);
      });
    }
    setLoadMessages(() => loadMessages);
    setNoOlderMessages(false);
    setMessages([]);
    loadMessages();

    const unsubMsgs = socket.onMessage(room.id, (m) =>
      setMessages((msgs) => [...msgs, m])
    );

    return () => {
      unsubMsgs();
      canceled = true;
    };
  }, [room]);

  return (
    <div className={classes.container}>
      <Topbar room={room} onClickName={onOpenInfo} />
      {loadMessages && (
        <MessageList
          messages={messages}
          noOlderMessages={noOlderMessages}
          loadOlder={loadMessages}
          socket={socket}
        />
      )}
      <MessageEditor
        label="Escribir mensaje"
        onSubmit={(m) => sendMessage(room.id, m)}
      />
    </div>
  );
}
