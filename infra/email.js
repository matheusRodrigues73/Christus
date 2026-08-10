import nodemailer from "nodemailer";
import { ServiceError } from "./errors";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SMTP_HOST,
  port: process.env.EMAIL_SMTP_PORT,
  auth: {
    user: process.env.EMAIL_SMTP_USER,
    pass: process.env.EMAIL_SMTP_PASSWORD,
  },
  secure: process.env.NODE_ENV === "production" ? true : false,
});

async function send(mailOpitions) {
  try {
    if (!mailOpitions.from)
      mailOpitions.from = "Glorificat <contato@glorificat.com.br>";
    await transporter.sendMail(mailOpitions);
  } catch (error) {
    throw new ServiceError({
      message: "The email message couldn't be sent.",
      action: "Check the mail service is active.",
      cause: error,
      context: mailOpitions,
    });
  }
}

const email = {
  send,
};

export default email;
