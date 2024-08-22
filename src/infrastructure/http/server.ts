import express from 'express';
import config from '../config/config';
import RabbitMQClient  from '../rabbitMQ/clients'
import { databaseConnection } from '../database/mongodb';

//manually imported no suggestion came


const app= express();
app.use(express.json());

const startServer = async ()=>{
    try{
        //database connection
        await databaseConnection();

        //rabbitmq initalization
        RabbitMQClient.initialize();

        const port = config.port;
        
        app.listen(port,()=>{
            console.log('user service running on port',port)
        })
    }catch(error){
        console.log("Error in stareting user service")
    }
}


startServer()