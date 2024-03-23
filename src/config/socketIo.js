const { Server } = require("socket.io");
const {
  create,
} = require('../repositories/chatRepository')

let chatRoom = 11

let SocketIo = (httpServer) => {
  const io = new Server(httpServer, { 
    cors: {
      origin: "*",
    },
   });


   io.on("connection", (socket) => {
    ///Handle khi có connect từ client tới
    console.log("New client connected" + socket.id);

    socket.on("chatRoom", (data) => {
      chatRoom = data
      console.log("Chat room : ", chatRoom);
    })

    socket.on(`Client-Chat-Room`, async(data) => {
      await create(data)
      // Handle khi có sự kiện tên là sendDataClient từ phía client
      io.emit(`Server-Chat-Room-${data.chatRoom}`, { data: data }); // phát sự kiện  có tên sendDataServer cùng với dữ liệu tin nhắn từ phía server
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected"); // Khi client disconnect thì log ra terminal.
    });
  });
};

module.exports = {
  SocketIo,
};
