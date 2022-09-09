import { User } from "../../api/users";
import {
  Navbar,
  Group,
  Code,
  ScrollArea,
  createStyles,
  Divider,
  TextInput,
  Button,
} from "@mantine/core";
import { useModals } from "@mantine/modals";
import { UserButton } from "./UserButton";
import { RoomButton } from "./RoomButton";
import { useEffect, useState } from "react";
import { createRoom, getAllRooms, Room } from "../../api/rooms";

const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
    paddingBottom: 0,
  },

  header: {
    padding: theme.spacing.md,
    paddingTop: 0,
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    borderBottom: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  links: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
  },

  linksInner: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
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
  onRoomSelected: (room: Room | undefined) => void;
}

export function Sidebar({ user, onRoomSelected }: SidebarProps) {
  const { classes } = useStyles();
  const modals = useModals();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | undefined>();

  useEffect(() => {
    getAllRooms().then(setRooms);
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
        <>
          <form
            autoComplete="off"
            onSubmit={(e) => {
              e.preventDefault();
              createRoom((e.target as HTMLFormElement).roomname.value).then(
                (room) => {
                  setRooms((r) => [...r, room]);
                  setSelectedRoom(room);
                }
              );
              modals.closeModal(id);
            }}
          >
            <TextInput name="roomname" label="Name" />
            <Button type="submit" fullWidth mt="md">
              Create
            </Button>
          </form>
        </>
      ),
    });
  }

  return (
    <Navbar
      width={{ sm: 300 }}
      height="100vh"
      px="md"
      pt="md"
      className={classes.navbar}
    >
      <Navbar.Section className={classes.header}>
        <Group position="apart">
          <Code sx={{ fontWeight: 700 }}>Chatazo v0.0.1</Code>
        </Group>
      </Navbar.Section>

      <Navbar.Section grow className={classes.links} component={ScrollArea}>
        <div className={classes.linksInner}>
          {rooms.map((room) => (
            <RoomButton
              key={room.id}
              room={room}
              onClick={() => setSelectedRoom(room)}
              selected={selectedRoom == room}
            />
          ))}
        </div>
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
        <UserButton {...user} />
      </Navbar.Section>
    </Navbar>
  );
}

