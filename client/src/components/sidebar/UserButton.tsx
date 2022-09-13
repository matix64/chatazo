import { Avatar, Text, createStyles, ActionIcon } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { BiPencil } from "react-icons/bi";
import { FiLogOut } from "react-icons/fi";
import { logout } from "../../api/auth";
import { User } from "../../api/users";
import { EditProfileModal } from "./EditProfileModal";

const useStyles = createStyles((theme) => ({
  user: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing.md,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
  },
  nameStatusContainer: {
    flex: 1,
    marginLeft: "10px",
    overflow: "hidden",
  },
  nameStatus: {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
}));

interface UserButtonProps {
  user: User;
  onLogout: () => void;
}

export function UserButton({ user, onLogout }: UserButtonProps) {
  const { classes } = useStyles();
  const modals = useModals();

  return (
    <div className={classes.user}>
      <Avatar src={user.picture} radius="xl" />
      <div className={classes.nameStatusContainer}>
        <Text className={classes.nameStatus} size="sm" weight={500}>
          {user.name}
        </Text>
        <Text className={classes.nameStatus} color="dimmed" size="xs">
          {user.status}
        </Text>
      </div>
      <ActionIcon
        aria-label="Edit profile"
        onClick={() => {
          const id = modals.openModal({
            title: "Edit profile",
            children: (
              <EditProfileModal
                close={() => modals.closeModal(id)}
                user={user}
              />
            ),
          });
        }}
      >
        <BiPencil size={18} />
      </ActionIcon>
      <ActionIcon
        aria-label="Log out"
        onClick={async () => {
          await logout();
          onLogout();
        }}
      >
        <FiLogOut size={18} color="firebrick" />
      </ActionIcon>
    </div>
  );
}
