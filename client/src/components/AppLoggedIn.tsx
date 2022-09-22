import { User } from "../api/users";
import { useState } from "react";
import { Sidebar } from "./sidebar/Sidebar";
import { Room } from "../api/rooms";
import { RoomView } from "./room/RoomView";
import { AppShell } from "@mantine/core";
import { WsConnection } from "../api/socket";
import { ViewInvite } from "./ViewInvite";

interface AppLoggedInProps {
  user: User;
  socket: WsConnection;
  onLogout: () => void;
}

export function AppLoggedIn({ user, socket, onLogout }: AppLoggedInProps) {
  const [selectedRoom, setSelectedRoom] = useState<Room | undefined>();

  const pathSections = window.location.pathname.split("/");

  if (pathSections[1] == "invite") {
    return <ViewInvite inviteId={pathSections[2]} />;
  } else {
    return (
      <AppShell
        navbar={
          <Sidebar
            user={user}
            socket={socket}
            onLogout={onLogout}
            onRoomSelected={setSelectedRoom}
          />
        }
        styles={(theme) => ({
          main: {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
            height: "100vh",
            padding: 0,
            overflow: "hidden",
          },
        })}
      >
        {selectedRoom && (
          <RoomView room={selectedRoom} user={user} socket={socket} />
        )}
      </AppShell>
    );
  }
}
