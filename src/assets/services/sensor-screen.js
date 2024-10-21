const express = require("express");
const cors = require("cors");
const { SerialPort } = require("serialport");
const WebSocket = require("ws");

const app = express();
app.use(cors());
let lastValue = "";

app.get("/screen", (req, res) => {
  res.json({ distance: lastValue });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});

const wss = new WebSocket.Server({ port: 3001 });
wss.on("connection", (ws) => {
  console.log("Połączono z WebSocket");

  ws.send(JSON.stringify({ distance: lastValue }));

  ws.on("close", () => {
    console.log("Rozłączono WebSocket");
  });
});

function broadcastDistanceUpdate() {
  const message = JSON.stringify({ distance: lastValue });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

const port = new SerialPort({
  path: "COM6",
  baudRate: 115200,
  dataBits: 8,
  parity: "none",
  stopBits: 1,
  flowControl: false,
});

let buffer = "";
let timeout = null;

port.on("data", (data) => {
  buffer += data.toString();

  if (timeout) {
    clearTimeout(timeout);
  }

  timeout = setTimeout(() => {
    const match = buffer.match(/=([A-Za-z0-9]+)/);

    if (match) {
      lastValue = match[1];
      console.log('Wartość po "=": ', lastValue);

      broadcastDistanceUpdate();
    } else {
      console.log("Brak dopasowania w odebranych danych:", buffer);
    }

    buffer = "";
  }, 5);
});

port.on("error", (err) => {
  console.error("Wystąpił błąd:", err.message);
});

console.log("Nasłuchiwanie na porcie COM6...");
