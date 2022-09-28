import { User } from "../../api/users";
import { Navbar, createStyles, Divider } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { UserButton } from "./UserButton";
import { RoomButton } from "./RoomButton";
import { useEffect, useState } from "react";
import { getAllRooms, Room } from "../../api/rooms";
import { WsConnection } from "../../api/socket";
import { CreateRoomModal } from "./CreateRoomModal";

const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
    paddingBottom: 0,
  },

  navbarClosed: {
    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      display: "none",
    },
  },

  links: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    overflowY: "auto",
  },

  footer: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },
}));

interface SidebarProps {
  user: User;
  socket: WsConnection;
  onRoomSelected: (room: Room | undefined) => void;
  onLogout: () => void;
  open: boolean;
  onClose: () => void;
}

export function Sidebar({
  user,
  socket,
  onRoomSelected,
  onLogout,
  open,
  onClose,
}: SidebarProps) {
  const { classes } = useStyles();
  const modals = useModals();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | undefined>();

  useEffect(() => {
    getAllRooms().then((rooms) =>
      setRooms(rooms.sort((a, b) => a.id.localeCompare(b.id)))
    );
    const unsubRoomChanged = socket.onRoomChanged((room) => {
      setSelectedRoom((selected) => {
        return selected?.id == room.id ? room : selected;
      });
      setRooms((rooms) =>
        [...rooms.filter((r) => r.id != room.id), room].sort((a, b) =>
          a.id.localeCompare(b.id)
        )
      );
    });
    return () => {
      unsubRoomChanged();
    };
  }, []);

  useEffect(() => {
    if (!selectedRoom || !rooms.includes(selectedRoom)) {
      setSelectedRoom(rooms[0]);
    }
  }, [rooms]);

  useEffect(() => onRoomSelected(selectedRoom), [selectedRoom]);

  function onClickCreateRoom(ev: Event) {
    ev.preventDefault();
    const id = modals.openModal({
      title: "Create room",
      children: (
        <CreateRoomModal
          onCreated={(room) => {
            setRooms((rooms) => [...rooms, room]);
            setSelectedRoom(room);
            modals.closeModal(id);
            onClose();
          }}
        />
      ),
    });
  }

  return (
    <Navbar
      width={{ sm: 300 }}
      height="100vh"
      px="md"
      pt="md"
      className={`${classes.navbar} ${open ? "" : classes.navbarClosed}`}
    >
      <Navbar.Section grow className={classes.links}>
        {rooms.map((room) => (
          <RoomButton
            key={room.id}
            room={room}
            onClick={() => {
              setSelectedRoom(room);
              onClose();
            }}
            selected={selectedRoom == room}
          />
        ))}
      </Navbar.Section>

      <Navbar.Section>
        <Divider
          py="xs"
          label="Create room"
          labelPosition="center"
          labelProps={{
            component: "a",
            size: "md",
            href: "#",
            variant: "link",
            color: "blue",
            onClick: onClickCreateRoom,
          }}
        />
      </Navbar.Section>

      <Navbar.Section className={classes.footer}>
        <UserButton user={user} onLogout={onLogout} />
      </Navbar.Section>
    </Navbar>
  );
}
