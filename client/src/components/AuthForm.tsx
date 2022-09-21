import {
  Paper,
  createStyles,
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Text,
  Anchor,
  Alert,
} from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { FormEvent, useEffect, useState } from "react";
import { login, register } from "../api/auth";
import { BiErrorCircle } from "react-icons/bi";

const useStyles = createStyles((theme) => ({
  wrapper: {
    backgroundSize: "cover",
    height: "100vh",
    backgroundImage: "url(/src/assets/cat-sunset.jpg)",
  },

  form: {
    borderRight: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    height: "100%",
    maxWidth: 450,
    display: "grid",
    placeItems: "center",

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: "100%",
    },
  },

  formInner: {
    width: "100%",
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  logo: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    width: 120,
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },
}));

interface AuthFormProps {
  onLogin?: () => void;
}

export function AuthForm({ onLogin }: AuthFormProps) {
  const { classes } = useStyles();
  const [error, setError] = useState<Error | undefined>();
  const [registering, setRegistering] = useState(false);
  const [username, setUsername] = useInputState("");
  const [email, setEmail] = useInputState("");
  const [password, setPassword] = useInputState("");
  useEffect(() => setError(undefined), [registering]);
  function send(ev: FormEvent<any>) {
    ev.preventDefault();
    setError(undefined);
    const promi = registering
      ? register(username, email, password)
      : login(email, password);
    promi.then(onLogin).catch((e) => setError(e));
  }
  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <form className={classes.formInner} onSubmit={send}>
          {error && (
            <Alert
              icon={<BiErrorCircle size={32} />}
              title="Error"
              color="red"
              variant="outline"
              withCloseButton
              closeButtonLabel="Close alert"
              onClose={() => setError(undefined)}
            >
              {error.message}
            </Alert>
          )}
          {registering && (
            <TextInput
              label="Name"
              mt="md"
              size="md"
              value={username}
              minLength={4}
              maxLength={30}
              onChange={setUsername}
            />
          )}
          <TextInput
            label="Email"
            type="email"
            mt="md"
            size="md"
            value={email}
            onChange={setEmail}
          />
          <PasswordInput
            label="Password"
            minLength={registering ? 8 : 0}
            mt="md"
            size="md"
            value={password}
            onChange={setPassword}
            autoComplete={registering ? "new-password" : undefined}
          />
          <Button type="submit" fullWidth mt="xl" size="md">
            {registering ? "Register" : "Login"}
          </Button>

          <Text align="center" mt="md">
            {registering ? (
              <>
                {"Already have an account? "}
                <Anchor<"a">
                  href=""
                  weight={700}
                  onClick={(ev) => {
                    ev.preventDefault();
                    setRegistering(false);
                  }}
                >
                  Login
                </Anchor>
              </>
            ) : (
              <>
                {"Don't have an account? "}
                <Anchor<"a">
                  href=""
                  weight={700}
                  onClick={(ev) => {
                    ev.preventDefault();
                    setRegistering(true);
                  }}
                >
                  Register
                </Anchor>
              </>
            )}
          </Text>
        </form>
      </Paper>
    </div>
  );
}
