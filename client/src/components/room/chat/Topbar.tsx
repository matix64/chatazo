import { ActionIcon, createStyles, Header, Title } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { useEffect, useState } from "react";
import { BiUserPlus } from "react-icons/bi";
import { getRoomMembers, Room, RoomMember } from "../../../api/rooms";
import { InviteModal } from "../../InviteModal";

const useStyles = createStyles((theme) => ({
  bar: {
    position: "fixed",
    width: "inherit",
    display: "flex",
    alignItems: "center",
    padding: theme.spacing.md,
    backgroundColor:
      theme.colorScheme == "dark" ? theme.colors.dark[6] : theme.white,
    color: theme.colorScheme == "dark" ? theme.colors.gray[0] : theme.black,
  },

  roomName: {
    background: "none",
    border: "none",
    color: "inherit",
    fontSize: theme.fontSizes.md,
    cursor: "pointer",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

interface TopbarProps {
  room: Room;
  onClickName: () => void;
}

export function Topbar({ room, onClickName }: TopbarProps) {
  const { classes } = useStyles();
  const modals = useModals();
  const [members, setMembers] = useState<RoomMember[] | undefined>();

  useEffect(() => {
    setMembers(undefined);
    getRoomMembers(room.id).then(setMembers);
  }, [room]);

  return (
    <Header height={50} className={classes.bar}>
      <button className={classes.roomName} onClick={onClickName}>
        {room.name}
        {members &&
          ` — ${members.length} member${members.length != 1 ? "s" : ""}`}
      </button>
      <div style={{ flexGrow: 1 }} />
      <ActionIcon
        size="lg"
        onClick={() =>
          modals.openModal({
            title: <Title order={3}>Invite someone to {room.name}</Title>,
            children: <InviteModal room={room} />,
            size: "550px",
          })
        }
      >
        <BiUserPlus size={32} />
      </ActionIcon>
    </Header>
  );
}
