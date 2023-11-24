const express = require('express');
require('express-async-errors');
const amqp = require('amqplib');
const { Vonage } = require('@vonage/server-sdk')
let channel;

const queueName = 'SMS-MS';
const from = 'Vonage APIs';
const connectToApi = process.env.CONNECT == 1 ? true : false;
const vonage = new Vonage({
  apiKey: "f0ce0a13",
  apiSecret: "w8PR4Jl2F9URC64d"
})

async function connect() {
  const amqpServer = process.env.RABBITMQ_URL;
  const connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue(queueName);
}

connect().then(() => {
  channel.consume(queueName, data => {
    console.log(`Consuming ${queueName} service`);
    const { description, phoneNumber = [] } = JSON.parse(data.content);

    console.log(`Message sent: ${description} to: ${phoneNumber}`, connectToApi);

    if (connectToApi) {
      console.log('Vonage sent');
      vonage.sms.send({ to: phoneNumber, from, text: description })
        .then(resp => { console.log('Message sent successfully'); console.log(resp); })
        .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
    }
  });
});

const app = express();

app.use(express.json());

const port = process.env.PORT ?? 3000;

app.listen(port, () => {
  console.log(`Consumer Service at ${port}`);
});

app.get('/', async (req, res) => {
  res.status(200).json({ status: 'ok', message: `I'm the Consumer` });
});


