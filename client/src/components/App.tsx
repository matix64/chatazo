import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { useEffect, useState } from "react";
import { WsConnection } from "../api/socket";
import { getCurrentUser, User } from "../api/users";
import { AppLoggedIn } from "./AppLoggedIn";
import { AuthForm } from "./AuthForm";
import { LoadingScreen } from "./LoadingScreen";

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | undefined>();
  const [socket, setSocket] = useState<WsConnection | undefined>();

  function updateUser() {
    setLoading(true);
    setSocket(undefined);
    getCurrentUser()
      .then((user) => {
        setUser(user);
        if (user) setSocket(new WsConnection());
      })
      .finally(() => setLoading(false));
  }
  useEffect(updateUser, []);
  useEffect(() => {
    if (socket) return socket.onUserChanged(user!.id, setUser);
  }, [socket]);

  return (
    <MantineProvider theme={{ colorScheme: "dark" }}>
      <ModalsProvider>
        {user && socket ? (
          <AppLoggedIn user={user} socket={socket} onLogout={updateUser} />
        ) : loading ? (
          <LoadingScreen />
        ) : (
          <AuthForm onLogin={updateUser} />
        )}
      </ModalsProvider>
    </MantineProvider>
  );
}

export default App;
