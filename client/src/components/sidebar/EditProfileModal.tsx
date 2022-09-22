import {
  Avatar,
  Button,
  createStyles,
  Divider,
  TextInput,
} from "@mantine/core";
import { FormEvent, useState } from "react";
import { getEditProfileEndpoint, User } from "../../api/users";

const useStyles = createStyles(() => ({
  container: {
    display: "flex",
    alignItems: "center",
  },
  picture: {
    cursor: "pointer",
    fontSize: "12px",
    color: "#23aaf2",
    "&:hover": { textDecoration: "underline" },
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
  const [picture, setPicture] = useState(user.picture);

  function getChangedFields(): [string, any][] {
    const oldValues = user as unknown as Record<string, any>;
    const currValues: Record<string, any> = {
      name: name.trim(),
      status: status.trim(),
      picture,
    };
    return Object.entries(currValues).filter(
      ([key, value]) => value != oldValues[key]
    );
  }

  async function submit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    await fetch(getEditProfileEndpoint(), {
      method: "PATCH",
      body: new FormData(ev.currentTarget),
    });
    close();
  }

  return (
    <form onSubmit={submit}>
      <div className={classes.container}>
        <label className={classes.picture}>
          <input
            type="file"
            name="picture"
            style={{ display: "none" }}
            accept="image/png, image/jpeg, image/webp"
            onChange={({ target }) =>
              target.files &&
              target.files[0] &&
              setPicture(URL.createObjectURL(target.files[0]))
            }
          />
          <Avatar src={picture} radius={100} size="xl" mb="xs" />
          Change picture
        </label>
        <div className={classes.nameStatus}>
          <TextInput
            label="Name"
            name="name"
            value={name}
            maxLength={30}
            onChange={(ev) => setName(ev.target.value)}
          />
          <TextInput
            label="Status"
            name="status"
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
          <Button ml="md" sx={{ float: "right" }} type="submit">
            Save
          </Button>
          <Button variant="outline" sx={{ float: "right" }} onClick={close}>
            Discard
          </Button>
        </>
      )}
    </form>
  );
}
