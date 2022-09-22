import { EventMessageSection, Message } from "../../../api/messages";
import {
  createStyles,
  Text,
  Avatar,
  Group,
  TypographyStylesProvider,
  Paper,
} from "@mantine/core";
import { formatRelative } from "date-fns";
import { getUser, User } from "../../../api/users";
import { useEffect, useState } from "react";
import { WsConnection } from "../../../api/socket";

const useStyles = createStyles((theme) => ({
  event: {
    overflowWrap: "anywhere",
    display: "flex",
    alignItems: "center",
    height: "50px",
    color: theme.colors.dark[0],
    paddingLeft: theme.spacing.lg,
    marginTop: theme.spacing.md,
  },

  message: {
    overflowWrap: "anywhere",
    padding: `${theme.spacing.lg}px ${theme.spacing.xl}px`,
    marginTop: theme.spacing.md,
    display: "flex",
  },

  nameDate: {
    display: "flex",
    alignItems: "center",
    marginBottom: "5px",
  },

  body: {
    paddingLeft: theme.spacing.md,
    fontSize: theme.fontSizes.sm,
  },

  content: {
    "& > p:last-child": {
      marginBottom: 0,
    },
    whiteSpace: "pre-wrap",
  },
}));

interface MessageViewProps {
  msg: Message;
  socket: WsConnection;
}

export function MessageView({ msg, socket }: MessageViewProps) {
  const { classes } = useStyles();
  const [author, setAuthor] = useState<User | undefined>();

  useEffect(() => {
    getUser(msg.author).then(setAuthor);
    return socket.onUserChanged(msg.author, setAuthor);
  }, []);

  if (msg.content[0]?.type == "event") {
    const descriptions: Record<EventMessageSection["event"], string> = {
      join: "joined",
      leave: "left",
    };
    return (
      <div className={classes.event}>
        {author && (
          <>
            <Avatar src={author?.picture} radius="xl" mr="md" />
            <Text size="md">
              <b>{author.name}</b> {descriptions[msg.content[0].event]}
            </Text>
          </>
        )}
      </div>
    );
  } else
    return (
      <Paper withBorder radius="md" className={classes.message}>
        <Avatar src={author?.picture} radius="xl" />
        <TypographyStylesProvider className={classes.body}>
          <div className={classes.nameDate}>
            <Text size="sm" weight="bold">
              {author?.name}
            </Text>
            <Text size="xs" mx="5px" color="dimmed">
              —
            </Text>
            <Text size="xs" color="dimmed">
              {formatRelative(msg.date, new Date())}
            </Text>
          </div>
          <div className={classes.content}>
            {msg.content.map((sect, i) => {
              switch (sect.type) {
                case "image":
                  return <img key={i} src={sect.url} />;
                case "text":
                  return <Text key={i}>{sect.content}</Text>;
              }
            })}
          </div>
        </TypographyStylesProvider>
      </Paper>
    );
}
