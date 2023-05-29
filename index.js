const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const fs = require("fs");
const port = process.env.PORT || 3000;

app.use(express.static("src"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/src/html/index.html");
});
/*
socket.io 모듈을 불러와서 io 변수에 담고,
io.sockets.on에 connection 이벤트가 호출되면 
실행될 함수를 바인딩해줍니다.

io.sockets은 나를 포함한 모든 소켓의 객체이며 
'connection' 이벤트는 소켓이 연결되면 
호출되는 이벤트입니다.
*/
io.on("connection", (socket) => {
  // 연결되고 chat message가 오면
  filed = JSON.parse(fs.readFileSync("src/base/file.json", "utf-8"));
  io.emit("load_chat", filed);
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
  // msg를 보내준다
  socket.on("save message", function (msg) {
    st = {
      color1: msg[0],
      color2: msg[1],
      color3: msg[2],
      posY: msg[3],
      posX: msg[4],
      des: msg[5],
    };
    filed = JSON.parse(fs.readFileSync("src/base/file.json", "utf-8"));
    filed.list[filed.list.length] = st;
    fs.writeFileSync("./src/base/file.json", JSON.stringify(filed));
  });
  socket.on("disconnect", function () {
    console.log("탈퇴");
  });
  console.log("접속");
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
