import { Channel } from "amqplib";

export default class Producer{
    constructor(private channel: Channel){}


    async produceMessage(data:any,corelationId:string,replyQueue:string){
        try{
            this.channel.sendToQueue(replyQueue,Buffer.from(JSON.stringify(data)),{
                correlationId:corelationId
            })
            console.log('message produced');
            
        }catch(error){
            console.log("Erroor in prodcing message back to apigateway",error)
        }
    }
}