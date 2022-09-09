import React from "react";
import {
  UnstyledButton,
  Group,
  Avatar,
  Text,
  createStyles,
} from "@mantine/core";
import { FiChevronRight } from "react-icons/fi";

const useStyles = createStyles((theme) => ({
  user: {
    display: "block",
    width: "100%",
    padding: theme.spacing.md,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[8]
          : theme.colors.gray[0],
    },
  },
}));

interface UserButtonProps {
  name: string;
  picture?: string;
  status?: string;
}

export function UserButton({
  picture,
  name,
  status,
}: UserButtonProps) {
  const { classes } = useStyles();
  return (
    <UnstyledButton className={classes.user}>
      <Group>
        <Avatar src={picture} radius="xl" />
        <div style={{ flex: 1 }}>
          <Text size="sm" weight={500}>
            {name}
          </Text>
          <Text color="dimmed" size="xs">
            {status}
          </Text>
        </div>
        <FiChevronRight size={14} />
      </Group>
    </UnstyledButton>
  );
}
