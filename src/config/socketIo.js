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
    //console.log("New client connected" + socket.id);

    socket.on(`Client-Chat-Room`, async(data) => {
      if(data.message){
        await create(data)
        io.emit(`Server-Chat-Room-${data.chatRoom}`, { data: data }); 
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected"); // Khi client disconnect thì log ra terminal.
    });
  });
};

module.exports = {
  SocketIo,
};
