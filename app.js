const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const cors = require("cors");

const port = process.env.PORT || 5000;

let id = 1;
let msgs = [
  {
    id: 0,
    author: "Server",
    message: "Esse é um chat privado!",
  },
];

app.use(cors());

app.get("/", (req, res) => {
  res.send("On-line");
});

io.on("connection", (socket) => {
  console.log(`${socket.id} conectou!`);
  socket.emit("allMessages", msgs);

  socket.on("sendMessage", (msg) => {
    msgs.push({
      id,
      author: msg.author,
      message: msg.message,
    });
    socket.broadcast.emit("someoneWalk", {
      id,
      author: msg.author,
      message: msg.message,
    });
    id++;
    console.log(msg.message.substring(0, 55));
  });
});

server.listen(port, () => {
  console.log(`Server rodando na porta ${port}...`);
});
