import { createWebSocketStream, WebSocketServer } from "ws";
import Redis from "ioredis";

const wss = new WebSocketServer({ port: 8080 });

const pub = new Redis();
const sub = new Redis();

await sub.subscribe("doc:123");

sub.on("message", (channel, message) => {
    console.log((`message received from Redis [${channel}: ${message}`))

    wss.clients.forEach((client) => {
        if (client.readyState === 1) {
            client.send(message)
        }
    });
});

wss.on("connection", (ws) => {
    console.log("Client Connected");

    ws.on("message", async (message) => {
        await pub.publish("doc:123", message);
    });
});

ws.on("close", () => {
    console.log("client disconnected");
})

console.log("websocket server is running on ws://localhost:8080");