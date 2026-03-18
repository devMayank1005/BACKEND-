import app from "./src/app.js";
import {createServer} from "http";
import {Server} from "socket.io";


const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("message",(data)=>{
    console.log("Message received from client");
    io.emit("message", "Hello from the server!");
    console.log(data)
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

httpServer.listen(3000, () => {
  console.log("Server is running on port 3000");
});
