import {
  Avatar,
  Button,
  createStyles,
  Divider,
  TextInput,
} from "@mantine/core";
import { useState } from "react";
import { editProfile, EditProfileChanges, User } from "../../api/users";

const useStyles = createStyles(() => ({
  container: {
    display: "flex",
    alignItems: "center",
  },
  nameStatus: { marginLeft: "15px", flexGrow: 1 },
}));

export interface EditProfileModalProps {
  user: User;
  close: () => void;
}

export function EditProfileModal({ user, close }: EditProfileModalProps) {
  const { classes } = useStyles();
  const [name, setName] = useState(user.name);
  const [status, setStatus] = useState(user.status);

  function getChangedFields(): [string, string][] {
    const oldValues = user as unknown as Record<string, string>;
    const currValues: Record<string, string> = { name, status };
    return Object.entries(currValues).filter(
      ([key, value]) => value.trim() != oldValues[key]
    );
  }

  async function save() {
    close();
    await editProfile(Object.fromEntries(getChangedFields()));
  }

  return (
    <>
      <div className={classes.container}>
        <Avatar src={user.picture} radius={100} size="xl" />
        <div className={classes.nameStatus}>
          <TextInput
            label="Name"
            value={name}
            maxLength={30}
            onChange={(ev) => setName(ev.target.value)}
          />
          <TextInput
            label="Status"
            mt="sm"
            value={status}
            maxLength={60}
            onChange={(ev) => setStatus(ev.target.value)}
          />
        </div>
      </div>
      {getChangedFields().length > 0 && (
        <>
          <Divider my="md" />
          <Button ml="md" sx={{ float: "right" }} onClick={save}>
            Save
          </Button>
          <Button variant="outline" sx={{ float: "right" }} onClick={close}>
            Discard
          </Button>
        </>
      )}
    </>
  );
}
