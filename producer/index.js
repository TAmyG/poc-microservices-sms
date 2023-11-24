const express = require('express');
require('express-async-errors');

const amqp = require('amqplib');
const cors = require('cors');

const queueName = 'SMS-MS'
let channel;

async function connect() {
  const amqpServer = process.env.RABBITMQ_URL;
  const connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue(queueName);
}
connect();
const app = express();

app.use(express.json());
app.use(cors());

const port = process.env.PORT ?? 3000;

app.listen(port, () => {
  console.log(`Producer Service at ${port}`);
});

app.get('/', async (req, res) => {
  res.status(200).json({status: 'ok', message: `I'm the Producer`});

});


app.post('/sms', async (req, res) => {
  const {description, phoneNumber} = req.body;
  channel.sendToQueue(
    queueName,
    Buffer.from(
      JSON.stringify({
        description, phoneNumber
      })
    )
  );

  res.status(200).json({status: 'ok', message:'SMS created in queue'});

});

