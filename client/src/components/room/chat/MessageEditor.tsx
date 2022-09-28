import { createStyles } from "@mantine/core";
import { useRef } from "react";
import { MessageSection } from "../../../api/messages";

const useStyles = createStyles((theme) => ({
  container: {
    margin: theme.spacing.md,
  },

  editable: {
    boxSizing: "border-box",
    width: "100%",
    maxHeight: "140px",
    padding: theme.spacing.md,
    color:
      theme.colorScheme == "dark" ? theme.colors.gray[2] : theme.colors.gray[7],
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor:
      theme.colorScheme == "dark" ? theme.colors.gray[6] : theme.colors.gray[2],
    borderRadius: theme.radius.md,
    outline: "none",
    overflowY: "auto",
    whiteSpace: "pre-wrap",
  },
}));

interface MessageEditorProps {
  label: string;
  onSubmit?: (content: MessageSection[]) => void;
}

export function MessageEditor({ label, onSubmit }: MessageEditorProps) {
  const { classes } = useStyles();
  const editableRef = useRef<HTMLDivElement | null>(null);

  function submit() {
    if (onSubmit && editableRef.current) {
      const sections: MessageSection[] = [];
      for (const node of editableRef.current.childNodes || []) {
        const last = sections.at(-1);
        switch (node.nodeName) {
          case "#text":
            if (last?.type == "text" && !last.format)
              last.content += node.textContent || "";
            else
              sections.push({ type: "text", content: node.textContent || "" });
            break;
          case "BR":
            if (node == editableRef.current.lastChild) break;
            if (last?.type == "text") last.content += "\n";
            else sections.push({ type: "text", content: "\n" });
            break;
        }
      }
      onSubmit(sections);
      editableRef.current.innerHTML = "";
    }
  }

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        submit();
      }}
      className={classes.container}
    >
      <div
        ref={editableRef}
        role="textbox"
        aria-label={label}
        aria-multiline="true"
        contentEditable="true"
        // @ts-ignore
        enterKeyHint="send"
        className={classes.editable}
        onKeyDown={(ev) => {
          if (ev.key == "Enter" && !ev.shiftKey) {
            ev.preventDefault();
            submit();
          }
        }}
      ></div>
    </form>
  );
}
