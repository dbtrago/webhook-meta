const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN;

// GET → verificación de Meta
app.get('/', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === verifyToken) {
        console.log('WEBHOOK VERIFIED');
        return res.status(200).send(challenge);
    }

    return res.sendStatus(403);
});

// POST → mensajes entrantes
app.post('/', async (req, res) => {
    const payload = req.body;

    console.log('Webhook received from Meta');
    console.log(JSON.stringify(payload, null, 2));

    try {
        await fetch('https://33feb8bd09df.ngrok-free.app/webhook/whatsapp-in', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
        });
    } catch (err) {
        console.error('Error sending to n8n:', err.message);
    }

    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});