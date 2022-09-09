import { createStyles } from "@mantine/core";
import { useState } from "react";

const useStyles = createStyles((theme) => ({
  outer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  content: {
    boxSizing: "border-box",
    width: "100%",
    padding: theme.spacing.sm,
    textAlign: "center",
    color: "inherit",
    border: "none",
    fontSize: theme.fontSizes.sm,
    backgroundColor:
      theme.colorScheme == "dark" ? theme.colors.gray[8] : theme.colors.gray[2],
    borderRadius: theme.radius.sm,
    cursor: "pointer",
    "&:hover": {
      backgroundColor:
        theme.colorScheme == "dark"
          ? theme.colors.gray[9]
          : theme.colors.gray[3],
    },
    "&:focus": {
      outline: "1px solid green",
    },
  },
  lowerTip: {
    marginTop: theme.spacing.sm,
  },
}));

interface ClickToCopyProps {
  value: string;
}

export function ClickToCopy({ value }: ClickToCopyProps) {
  const { classes } = useStyles();
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
  }

  return (
    <div className={classes.outer}>
      <input
        readOnly
        className={classes.content}
        onClick={copy}
        value={value}
      />
      <div className={classes.lowerTip}>
        {copied ? "Copied!" : "Click to copy"}
      </div>
    </div>
  );
}
