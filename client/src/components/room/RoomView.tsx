import { useEffect, useState } from "react";
import { Room } from "../../api/rooms";
import { WsConnection } from "../../api/socket";
import { User } from "../../api/users";
import { Chat } from "./chat/Chat";
import { RoomInfo } from "./info/RoomInfo";

enum Screen {
  Chat,
  RoomInfo,
}

interface RoomViewProps {
  user: User;
  room: Room;
  socket: WsConnection;
}

export function RoomView({ user, room, socket }: RoomViewProps) {
  const [screen, setScreen] = useState<Screen>(Screen.Chat);

  useEffect(() => {
    function onPopState() {
      setScreen(Screen.Chat);
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  switch (screen) {
    case Screen.Chat:
      return (
        <Chat
          key={room.id}
          room={room}
          socket={socket}
          onOpenInfo={() => {
            history.pushState(null, "", "");
            setScreen(Screen.RoomInfo);
          }}
        />
      );
    case Screen.RoomInfo:
      return (
        <RoomInfo room={room} user={user} onClose={() => history.back()} />
      );
  }
}
