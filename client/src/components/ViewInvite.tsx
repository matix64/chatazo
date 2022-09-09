import { createStyles, Skeleton } from "@mantine/core";
import { useEffect, useState } from "react";
import { InvitePreview, useInvite, viewInvite } from "../api/invites";
import { getRoomMembers } from "../api/rooms";

const useStyles = createStyles((theme) => ({
  container: {
    width: "100%",
    height: "100vh",
    display: "grid",
    placeItems: "center",
  },

  inner: {
    width: "100%",
    maxWidth: "600px",
    height: "100%",
    maxHeight: "450px",
    borderRadius: theme.radius.sm,
    boxShadow: "0 5px 5px rgba(0, 0, 0, 0.2)",
    overflow: "hidden",
  },

  innerContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxSizing: "border-box",
    height: "100%",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.dark[6],
    color: theme.colors.gray[0],
  },

  grow: {
    flexGrow: 1,
  },

  joinButton: {
    display: "block",
    width: "80%",
    margin: "0 auto",
    marginBottom: theme.spacing.md,
    padding: theme.spacing.sm,
    fontSize: theme.fontSizes.lg,
    backgroundColor: theme.colors.green[9],
    borderRadius: theme.radius.sm,
    border: "none",
    color: theme.colors.gray[0],
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "darkgreen",
    },
    "&:disabled": {
      backgroundColor: theme.colors.gray[8],
      cursor: "default",
    },
  },
}));

interface ViewInviteProps {
  inviteId: string;
}

export function ViewInvite({ inviteId }: ViewInviteProps) {
  const { classes } = useStyles();
  const [info, setInfo] = useState<InvitePreview | Error | undefined>();
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    viewInvite(inviteId)
      .then(async (invite) => {
        try {
          // This should fail if the user is not in the room
          await getRoomMembers(invite.room.id);
          setIsMember(true);
        } catch {}
        setInfo(invite);
      })
      .catch(setInfo);
  }, []);

  function join() {
    useInvite(inviteId).then(() => (window.location.pathname = "/"));
  }

  return (
    <div className={classes.container}>
      <div className={classes.inner}>
        {info instanceof Error ? (
          <div className={classes.innerContent}>
            <h3>Sorry, something went wrong</h3>
            <h4>{info.message}</h4>
          </div>
        ) : info ? (
          <div className={classes.innerContent}>
            <h2>You've been invited to:</h2>
            <h3>{info.room.name}</h3>
            <span>
              {info.room.members} member{info.room.members != 1 && "s"}
            </span>
            <div className={classes.grow} />
            <button
              disabled={isMember}
              className={classes.joinButton}
              onClick={join}
            >
              {isMember ? "You're already there" : "Join"}
            </button>
          </div>
        ) : (
          <Skeleton width="100%" height="100%" />
        )}
      </div>
    </div>
  );
}
