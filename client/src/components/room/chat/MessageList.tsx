import { createStyles, Loader } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { Message } from "../../../api/messages";
import {
  getScrollFromBottom,
  scrollToFromBottom,
} from "../../../util/elements";
import { MessageView } from "./MessageView";

const useStyles = createStyles((theme) => ({
  loadingOldMessages: {
    display: "grid",
    placeItems: "center",
    width: "100%",
    margin: "25px 0",
  },
  container: {
    flexGrow: 1,
    overflow: "auto",
    paddingLeft: theme.spacing.md,
    scrollbarColor: "#ccc rgba(0,0,0,0)",
    "&::-webkit-scrollbar": {
      width: "1em",
      background: "rgba(0,0,0,0)",
    },
    "&::-webkit-scrollbar-thumb": {
      border: "4px solid rgba(0, 0, 0, 0)",
      backgroundClip: "padding-box",
      backgroundColor: "#ccc",
    },
  },
}));

interface MessageListProps {
  messages: Message[];
  noOlderMessages: boolean;
  loadOlder: (before: string | undefined) => void;
}

export function MessageList({
  messages,
  noOlderMessages,
  loadOlder,
}: MessageListProps) {
  const { classes } = useStyles();
  const viewport = useRef<HTMLDivElement>(null);
  const loader = useRef<HTMLDivElement>(null);
  const oldestMsgId = useRef<string>(messages[0]?.id);

  useEffect(() => {
    oldestMsgId.current = messages[0]?.id;
  }, [messages]);

  useEffect(() => {
    const currViewport = viewport.current;
    if (currViewport) {
      const viewport = currViewport;
      let firstVisible: Element | undefined;
      let firstVisibleTop = 0;
      let scrollFromBottom = 0;
      let loadingBefore: string | undefined;
      viewport.onscroll = () => {
        scrollFromBottom = getScrollFromBottom(viewport);
        firstVisible = Array.from(viewport.children)
          .sort(
            (a, b) =>
              a.getBoundingClientRect().top - b.getBoundingClientRect().top
          )
          .filter(
            (x) =>
              x.getBoundingClientRect().top >
                viewport.getBoundingClientRect().top && x != loader.current
          )[0];
        if (firstVisible)
          firstVisibleTop = firstVisible.getBoundingClientRect().top;
        if (
          loader.current &&
          loadingBefore != oldestMsgId.current &&
          loader.current.getBoundingClientRect().bottom >
            viewport.getBoundingClientRect().top
        ) {
          loadingBefore = oldestMsgId.current;
          loadOlder(loadingBefore);
        }
      };
      scrollToFromBottom(viewport, 0);
      function onChange() {
        if (firstVisible && scrollFromBottom > 100) {
          const scrolled =
            firstVisible.getBoundingClientRect().top - firstVisibleTop;
          viewport.scrollTop += scrolled;
        } else scrollToFromBottom(viewport, 0);
      }
      const res = new ResizeObserver(onChange);
      res.observe(viewport);
      const mut = new MutationObserver((muts) => {
        for (const m of muts) {
          for (const node of m.addedNodes)
            if (node.nodeType == Node.ELEMENT_NODE)
              res.observe(node as Element);
        }
        onChange();
      });
      mut.observe(viewport, { childList: true });
      return () => {
        mut.disconnect();
        res.disconnect();
        viewport.onscroll = null;
      };
    }
  }, []);

  return (
    <div className={classes.container} ref={viewport}>
      {!noOlderMessages && (
        <div className={classes.loadingOldMessages} ref={loader}>
          <Loader color="gray" variant="dots" />
        </div>
      )}
      {messages.map((msg) => (
        <MessageView key={msg.id} msg={msg} />
      ))}
    </div>
  );
}
