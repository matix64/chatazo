import { ActionIcon, createStyles, Loader } from "@mantine/core";
import { useEffect, useState } from "react";
import { BiArrowBack, BiPencil } from "react-icons/bi";
import { getRoomMembers, Role, Room, RoomMember } from "../../../api/rooms";
import { getUser, User } from "../../../api/users";
import { MemberList } from "./MemberList";
import { RoomName } from "./RoomName";

const useStyles = createStyles((theme) => ({
  container: {
    padding: theme.spacing.lg,
    color: theme.colors.gray[1],
  },

  inner: {
    padding: theme.spacing.lg,
  },
}));

interface RoomInfoProps {
  user: User;
  room: Room;
  onClose: () => void;
}

export function RoomInfo({ user, room, onClose }: RoomInfoProps) {
  const { classes } = useStyles();
  const [currUserMember, setCurrUserMember] = useState<
    (RoomMember & User) | undefined
  >();
  const [members, setMembers] = useState<(RoomMember & User)[] | undefined>();

  useEffect(() => {
    setMembers(undefined);
    (async () => {
      const members = await getRoomMembers(room.id);
      const users = await Promise.all(members.map((m) => getUser(m.userId)));
      const membUsers = members.map((m, i) => ({ ...m, ...users[i] }));
      setMembers(membUsers);
      setCurrUserMember(membUsers.find((m) => m.id == user.id));
    })();
  }, [room]);

  return (
    <div className={classes.container}>
      <ActionIcon size="lg" onClick={onClose}>
        <BiArrowBack size={32} />
      </ActionIcon>
      <div className={classes.inner}>
        <RoomName
          room={room}
          editable={(currUserMember?.role || 0) >= Role.Admin}
        />
        <h3>Members {members && `(${members.length})`}</h3>
        {members && currUserMember ? (
          <MemberList
            room={room}
            members={members}
            currUserMember={currUserMember}
            setMembers={setMembers}
          />
        ) : (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Loader color="gray" variant="dots" mt="md" />
          </div>
        )}
      </div>
    </div>
  );
}
