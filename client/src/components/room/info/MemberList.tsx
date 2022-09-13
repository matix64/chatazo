import { Avatar, createStyles } from "@mantine/core";
import {
  editMember,
  getRoomMembers,
  kickMember,
  Role,
  Room,
  RoomMember,
} from "../../../api/rooms";
import { User } from "../../../api/users";

const useStyles = createStyles((theme, _, getRef) => ({
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  member: {
    borderTop: "1px solid #444",
    "&:last-of-type": {
      borderBottom: "1px solid #444",
    },
    "&:hover": {
      background: theme.colors.dark[7],
    },
    [`&:hover .${getRef("actions")}`]: {
      opacity: 1,
    },
    "&>td": {
      paddingTop: theme.spacing.xs,
      paddingBottom: theme.spacing.xs,
    },
  },
  nameAvatar: {
    display: "flex",
    alignItems: "center",
    paddingLeft: theme.spacing.sm,
  },
  memberName: {
    marginLeft: theme.spacing.md,
    fontWeight: "bold",
  },
  actions: {
    ref: getRef("actions"),
    opacity: 0,
  },
}));

interface MemberListProps {
  room: Room;
  members: (User & RoomMember)[];
  currUserMember: User & RoomMember;
  setMembers: (members: (User & RoomMember)[]) => void;
}

export function MemberList({
  room,
  members,
  currUserMember,
  setMembers,
}: MemberListProps) {
  const { classes } = useStyles();

  async function kick(memberId: string) {
    await kickMember(room.id, memberId);
    setMembers(members?.filter((m) => m.id != memberId));
  }

  function changeRole(member: RoomMember & User, role: number) {
    editMember(room.id, member.id, { role }).catch((err) =>
      alert(`Error editing ${member.name}'s role: ${err.message}`)
    );
  }

  return (
    <table className={classes.table}>
      <tbody>
        {members.map((member) => (
          <tr className={classes.member} key={member.id}>
            <td className={classes.nameAvatar}>
              <Avatar src={member.picture} radius="xl" />
              <span className={classes.memberName}>{member.name}</span>
            </td>
            <td style={{ textAlign: "center" }}>
              {member.role < currUserMember.role &&
              currUserMember.role >= Role.Admin ? (
                <select
                  defaultValue={member.role}
                  onChange={(ev) => changeRole(member, Number(ev.target.value))}
                >
                  {Object.entries(Role)
                    .filter(
                      ([_, value]) =>
                        typeof value == "number" && value < currUserMember.role
                    )
                    .map(([name, value]) => (
                      <option key={value} value={value}>
                        {name}
                      </option>
                    ))}
                </select>
              ) : (
                <>{Role[member.role]}</>
              )}
            </td>
            <td style={{ textAlign: "center" }} className={classes.actions}>
              {member.role < currUserMember.role &&
                currUserMember.role >= Role.Moderator && (
                  <>
                    <button onClick={() => kick(member.id)}>Kick</button>
                  </>
                )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
