import express from "express";
import config from "../config/config";
import RabbitMQClient from "../rabbitMQ/clients";
import { databaseConnection } from "../database/mongodb";

const app = express();
app.use(express.json());
const startServer = async () => {
  try {
    //database connection
    await databaseConnection();

    //rabbitmq initalization
    RabbitMQClient.initialize();

    const port = config.port;

    app.listen(port, () => {
      console.log("user service running on port", port);
    });
  } catch (error) {
    console.log("Error in stareting user service");
  }
};

startServer();
