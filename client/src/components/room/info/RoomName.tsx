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
  useEffect(() => {
    if (!editing && nameRef.current) nameRef.current.blur();
  }, [editing]);

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
    const newName = nameRef.current?.textContent || "";
    if (newName.trim().length == 0) return cancelEdit();
    setEditing(false);
    editRoom(room.id, { name: newName })
      .then((room) => {
        if (nameRef.current?.textContent == newName)
          nameRef.current.textContent = room.name;
      })
      .catch((err) => {
        if (nameRef.current?.textContent == newName)
          nameRef.current.textContent = room.name;
        alert(`Error editing room ${room.name}: ${err.message}`);
      });
  }

  function cancelEdit() {
    setEditing(false);
    if (nameRef.current) nameRef.current.textContent = room.name;
  }

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <h1
        ref={nameRef}
        contentEditable={editing}
        onBlur={finishEdit}
        style={{ overflow: "scroll" }}
        onKeyDown={(ev) => {
          const target = ev.target as HTMLHeadingElement;
          if (ev.key == "Enter") {
            ev.preventDefault();
            finishEdit();
          } else if (ev.key == "Escape") {
            ev.preventDefault();
            cancelEdit();
          } else if (
            !ev.ctrlKey &&
            ev.key.length < 3 &&
            (target.textContent?.length || 0) + ev.key.length > 40
          )
            ev.preventDefault();
        }}
        onPaste={(ev) => {
          ev.preventDefault();
          const target = ev.target as HTMLHeadingElement;
          const selection = window.getSelection();
          if (!selection?.rangeCount) return;
          const range = selection.getRangeAt(0);
          range.deleteContents();
          const paste = ev.clipboardData
            .getData("text")
            .slice(0, 40 - (target.textContent?.length || 0));
          range.insertNode(document.createTextNode(paste));
        }}
      >
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
