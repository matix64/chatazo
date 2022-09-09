import { ActionIcon } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { BiPencil } from "react-icons/bi";
import { editRoom, Room } from "../../../api/rooms";

interface RoomNameProps {
  room: Room;
  editable: boolean;
}

export function RoomName({ room, editable }: RoomNameProps) {
  const [editing, setEditing] = useState<boolean>(false);
  const nameRef = useRef<HTMLHeadingElement | null>(null);
  useEffect(() => setEditing(false), [room]);

  function beginEdit() {
    setEditing(true);
    setTimeout(() => {
      if (!nameRef.current) return;
      nameRef.current.focus();
      const range = document.createRange();
      range.selectNodeContents(nameRef.current);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }, 0.2);
  }

  function finishEdit() {
    if (!editing) return;
    setEditing(false);
    editRoom(room.id, { name: nameRef.current?.textContent || "" }).catch(
      (err) => {
        alert(`Error editing room ${room.name}: ${err.message}`);
      }
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <h1 ref={nameRef} contentEditable={editing} onBlur={finishEdit}>
        {room.name}
      </h1>
      {editable && (
        <ActionIcon size="lg" ml="md" onClick={beginEdit}>
          <BiPencil size={32} />
        </ActionIcon>
      )}
    </div>
  );
}
