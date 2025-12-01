function getOrigin() {
  if (["development", "test"].includes(process.env.NODE_ENV)) {
    return "http://localhost:3000";
  }

  if (process.env.VERCEL_ENV === "preview") {
    return `https://${process.env.VERSEL_URL}`;
  }

  return "https://glorificat.com.br";
}

const webServer = {
  origin: getOrigin(),
};

export default webServer;
