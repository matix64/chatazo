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

  function addMessages(newMessages: Message[]) {
    setMessages((oldList) => {
      const all = [...oldList, ...newMessages].sort((a, b) =>
        a.id.localeCompare(b.id)
      );
      const newList: Message[] = [];
      for (let i = 0; i < all.length; i++) {
        if (newList[newList.length - 1]?.id != all[i].id) newList.push(all[i]);
      }
      return newList;
    });
  }

  useEffect(() => {
    let canceled = false;

    function loadMessages(before?: string) {
      if (canceled) return;
      getMessages(room.id, before).then((resp) => {
        if (canceled) return;
        setNoOlderMessages(resp.noOlder);
        resp.messages.reverse();
        addMessages(resp.messages);
      });
    }
    setLoadMessages(() => loadMessages);
    setNoOlderMessages(false);
    setMessages([]);
    loadMessages();

    const unsubMsgs = socket.onMessage(room.id, (m) => addMessages([m]));

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
