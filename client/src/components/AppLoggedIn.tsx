import { User } from "../api/users";
import { useState } from "react";
import { Sidebar } from "./sidebar/Sidebar";
import { Room } from "../api/rooms";
import { RoomView } from "./room/RoomView";
import { AppShell, createStyles } from "@mantine/core";
import { WsConnection } from "../api/socket";
import { ViewInvite } from "./ViewInvite";

const useStyles = createStyles((theme) => ({
  appshell: {
    "& main": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[8]
          : theme.colors.gray[0],
      height: "100vh",
      padding: 0,
      overflow: "hidden",
    },
  },
}));

interface AppLoggedInProps {
  user: User;
  socket: WsConnection;
  onLogout: () => void;
}

export function AppLoggedIn({ user, socket, onLogout }: AppLoggedInProps) {
  const { classes } = useStyles();
  const [selectedRoom, setSelectedRoom] = useState<Room | undefined>();
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        }
        className={classes.appshell}
      >
        {selectedRoom && (
          <RoomView
            room={selectedRoom}
            user={user}
            socket={socket}
            onOpenMenu={() => setSidebarOpen(true)}
          />
        )}
      </AppShell>
    );
  }
}
