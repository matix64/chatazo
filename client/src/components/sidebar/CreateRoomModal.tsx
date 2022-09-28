import { Alert, Button, TextInput } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { BiErrorCircle } from "react-icons/bi";
import { createRoom, Room } from "../../api/rooms";

export interface CreateRoomModalProps {
  onCreated: (room: Room) => void;
}

export function CreateRoomModal({ onCreated }: CreateRoomModalProps) {
  const nameInput = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    if (nameInput.current) {
      const input = nameInput.current;
      setTimeout(() => input.focus());
    }
  }, [nameInput]);

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
        <TextInput
          name="roomname"
          label="Name"
          required
          maxLength={40}
          ref={nameInput}
        />
        <Button type="submit" fullWidth mt="md">
          Create
        </Button>
      </form>
    </>
  );
}
