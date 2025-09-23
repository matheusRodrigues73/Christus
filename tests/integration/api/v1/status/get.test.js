test('Try to GET ednpoint "api/v1/status"', async () => {
  const response = await fetch("http:localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  expect(responseBody.services.database.version).toBe("16.10");
});
