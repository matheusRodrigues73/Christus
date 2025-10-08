test('DELETE to "api/v1/migrations" should return 405', async () => {
  const methodNotAllowed = await fetch(
    "http://localhost:3000/api/v1/migrations",
    {
      method: "DELETE",
    },
  );
  expect(methodNotAllowed.status).toBe(405);

  const methodNotAllowedBody = await methodNotAllowed.json();
  expect(methodNotAllowedBody.error).toBe("Method Not Allowed");
});
