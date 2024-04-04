const { Server } = require("socket.io");
const chatRepository = require('../repositories/chatRepository')
const chatFileRepository = require('../repositories/chatFileRepository');
const { uploadFile } = require("../service/file.service");
const { updateImageAvatar, updateImageBackground } = require("../repositories/userRepository");

let SocketIo = (httpServer) => {
  const io = new Server(httpServer, { 
    cors: {
      origin: "*",
    },
   });


   io.on("connection", (socket) => {
    ///Handle khi có connect từ client tới
    //console.log("New client connected" + socket.id);

    socket.on(`Client-Register-QR-Code`, async(data) => {
      if(data.id){
        io.emit(`Server-Register-QR-Code`, { data: data }); 
      }
    });

    socket.on(`Client-Chat-Room`, async(data) => {
      if(data.message){
        await chatRepository.create(data)
        io.emit(`Server-Chat-Room-${data.chatRoom}`, { data: data }); 
      }
    });

    socket.on(`Client-Chat-Room-File`, async(data) => {
      let fileUrl = await uploadFile(data.file)
        let dt = {
          url : fileUrl,
          sender : data.sender,
          receiver : data.receiver
        }
        await chatFileRepository.create(dt)
        io.emit(`Server-Chat-Room-${data.chatRoom}`, { data: dt }); 
    });

    socket.on(`Client-update-avatar`, async(data) => {
      let fileUrl = await uploadFile(data.file)
        let dt = {
          image : fileUrl,
          id : data.id,
        }
        let user = await updateImageAvatar(dt)
        io.emit(`Server-update-avatar-${data.id}`, { data: user }); 
    });

    socket.on(`Client-update-background`, async(data) => {
      let fileUrl = await uploadFile(data.file)
        let dt = {
          background : fileUrl,
          id : data.id,
        }
        let user = await updateImageBackground(dt)
        io.emit(`Server-update-background-${data.id}`, { data: user }); 
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected"); // Khi client disconnect thì log ra terminal.
    });
  });
};

module.exports = {
  SocketIo,
};
