import dotenv from "dotenv";

dotenv.config();

const config = {
  port: parseInt(process.env.PORT as string) || 5001,

  RABBITMQ_URL: process.env.RABBITMQ_URL || "amqp://localhost",

  DATABASE_URL:
    process.env.DATABASE_URL || "mongodb://0.0.0.0:27017/NextEra-UserService",

  googleClientId:
    process.env.GOOGLE_CLIENT_ID ||
    "335970622446-fmad2vt6p80hhmjqgu8evh9tcs9letnl.apps.googleusercontent.com",

  EMAIL: process.env.EMAIL,
  EMAIL_PASS: process.env.EMAIL_PASS,
};

export default config;
