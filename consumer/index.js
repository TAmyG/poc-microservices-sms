const express = require('express');
require('express-async-errors');
const amqp = require('amqplib');

const queueName = 'SMS-MS'
let channel;

async function connect() {
  const amqpServer = process.env.RABBITMQ_URL;
  const connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue(queueName);
}

connect().then(() => {
  channel.consume(queueName, data => {
    console.log(`Consuming ${queueName} service`);
    const { description, phoneNumber } = JSON.parse(data.content);
    console.log('TODO create sms: ', description, phoneNumber);
  });
});

const app = express();

app.use(express.json());

const port = process.env.PORT ?? 3000;

app.listen(port, () => {
  console.log(`Consumer Service at ${port}`);
});

app.get('/', async (req, res) => {
  res.status(200).json({status: 'ok'});
});


