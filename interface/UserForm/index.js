import { Button, FormControl, Stack, TextInput } from "@primer/react";
import { useState } from "react";

export default function UserForm({
  username,
  email,
  password,
  urlToSubmit,
  redirect,
}) {
  const [usernameState, setUsernameState] = useState("");
  const [emailState, setEmailState] = useState("");
  const [passwordState, setPasswordState] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const newUser = {};
    username ? (newUser.username = usernameState) : null;
    email ? (newUser.email = emailState) : null;
    password ? (newUser.password = passwordState) : null;

    const response = await fetch(urlToSubmit, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });
    if (redirect) {
      if (response.status === 201) {
        location.href = redirect;
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="spacious">
        {username && (
          <FormControl>
            <FormControl.Label>Nome de Usuário: </FormControl.Label>
            <TextInput
              type="text"
              value={usernameState}
              onChange={(event) => {
                setUsernameState(event.target.value);
              }}
              block
            />
          </FormControl>
        )}
        {email && (
          <FormControl>
            <FormControl.Label>Email: </FormControl.Label>
            <TextInput
              type="text"
              value={emailState}
              onChange={(event) => {
                setEmailState(event.target.value);
              }}
              block
            />
          </FormControl>
        )}
        {password && (
          <FormControl>
            <FormControl.Label>Senha: </FormControl.Label>
            <TextInput
              type="password"
              value={passwordState}
              onChange={(event) => {
                setPasswordState(event.target.value);
              }}
              block
            />
          </FormControl>
        )}
        <FormControl>
          <Button type="submit" variant="primary">
            Enviar
          </Button>
        </FormControl>
      </Stack>
    </form>
  );
}
