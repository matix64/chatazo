import { createStyles, Loader } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  container: {
    display: "grid",
    placeItems: "center",
    width: "100%",
    height: "100vh",
  },
}));

export function LoadingScreen() {
  const { classes } = useStyles();

  return (
    <div className={classes.container}>
      <Loader color="gray" variant="dots" />
    </div>
  );
}
