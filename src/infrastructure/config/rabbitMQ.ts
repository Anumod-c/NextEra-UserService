import config from "./config";

interface RabbitMQConfig {
  rabbitMQ: {
    url: string;
    queues: {
      userQueue: string;
    };
  };
}
const RabbitMQConfig: RabbitMQConfig = {
  rabbitMQ: {
    url: config.RABBITMQ_URL,
    queues: {
      userQueue: "user_queue",
    },
  },
};

export default RabbitMQConfig;
