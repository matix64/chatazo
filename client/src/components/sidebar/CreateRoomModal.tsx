import { Alert, Button, TextInput } from "@mantine/core";
import { useState } from "react";
import { BiErrorCircle } from "react-icons/bi";
import { createRoom, Room } from "../../api/rooms";

export interface CreateRoomModalProps {
  onCreated: (room: Room) => void;
}

export function CreateRoomModal({ onCreated }: CreateRoomModalProps) {
  const [error, setError] = useState<Error | undefined>();

  return (
    <>
      {error && (
        <Alert
          icon={<BiErrorCircle size={32} />}
          title="Error"
          color="red"
          variant="outline"
          withCloseButton
          closeButtonLabel="Hide error"
          mb="md"
          onClose={() => setError(undefined)}
        >
          {error.message}
        </Alert>
      )}
      <form
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault();
          createRoom((e.target as HTMLFormElement).roomname.value)
            .then(onCreated)
            .catch(setError);
        }}
      >
        <TextInput name="roomname" label="Name" required maxLength={40} />
        <Button type="submit" fullWidth mt="md">
          Create
        </Button>
      </form>
    </>
  );
}
