import { Box, UnstyledButton, createStyles } from "@mantine/core";
import { Room } from "../../api/rooms";

const useStyles = createStyles((theme) => ({
  link: {
    fontWeight: 500,
    display: "block",
    width: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    fontSize: theme.fontSizes.sm,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[2],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },

  selectedLink: {
    [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
      "&, &:hover": {
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[7]
            : theme.colors.gray[0],
        color: theme.colorScheme === "dark" ? theme.white : theme.black,
      },
    },
  },
}));

interface RoomButtonProps {
  room: Room;
  selected?: boolean;
  onClick?: () => void;
}

export function RoomButton({
  room,
  selected = false,
  onClick,
}: RoomButtonProps) {
  const { classes, cx } = useStyles();

  return (
    <UnstyledButton
      onClick={onClick}
      className={cx(classes.link, { [classes.selectedLink]: selected })}
    >
      {room.name}
    </UnstyledButton>
  );
}
