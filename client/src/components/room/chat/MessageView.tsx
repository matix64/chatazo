import { EventMessageSection, Message } from "../../../api/messages";
import {
  createStyles,
  Text,
  Avatar,
  Group,
  TypographyStylesProvider,
  Paper,
} from "@mantine/core";
import { formatDistance } from "date-fns";
import { getUser, User } from "../../../api/users";
import { useEffect, useState } from "react";

const useStyles = createStyles((theme) => ({
  event: {
    display: "flex",
    alignItems: "center",
    height: "50px",
    color: theme.colors.dark[0],
    paddingLeft: theme.spacing.lg,
    marginTop: theme.spacing.md,
  },

  message: {
    padding: `${theme.spacing.lg}px ${theme.spacing.xl}px`,
    marginTop: theme.spacing.md,
  },

  body: {
    paddingLeft: 54,
    paddingTop: theme.spacing.sm,
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
}

export function MessageView({ msg }: MessageViewProps) {
  const { classes } = useStyles();
  const [author, setAuthor] = useState<User | undefined>();
  useEffect(() => {
    getUser(msg.author).then(setAuthor);
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
        <Group>
          <Avatar src={author?.picture} radius="xl" />
          <div>
            <Text size="sm">{author?.name}</Text>
            <Text size="xs" color="dimmed">
              {formatDistance(msg.date, new Date(), { addSuffix: true })}
            </Text>
          </div>
        </Group>
        <TypographyStylesProvider className={classes.body}>
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
