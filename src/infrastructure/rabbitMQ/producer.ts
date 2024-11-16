import { Channel } from "amqplib";
import rabbitMQLogger from "../../../logger/rabbitLogget";
export default class Producer {
  constructor(private channel: Channel) {}

  async produceMessage(data: any, corelationId: string, replyQueue: string) {
    try {
      this.channel.sendToQueue(replyQueue, Buffer.from(JSON.stringify(data)), {
        correlationId: corelationId,
      });
      rabbitMQLogger.emit("messageProduced", {
        queue: replyQueue,
        corelationId,
      });

      console.log("message produced back");
    } catch (error) {
      rabbitMQLogger.emit("error", error);

      console.log("Erroor in prodcing message back to apigateway", error);
    }
  }
}
