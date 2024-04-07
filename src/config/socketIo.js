const { Server } = require("socket.io");
const chatRepository = require("../repositories/chatRepository");
const statusChatRepository = require("../repositories/statusChatRepository");
const { uploadFile } = require("../service/file.service");
const {
  updateImageAvatar,
  updateImageBackground,
  getApiChatsFinalByUserIdAndChatId
} = require("../repositories/userRepository");

let SocketIo = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    ///Handle khi có connect từ client tới
    //console.log("New client connected" + socket.id);

    socket.on(`Client-Register-QR-Code`, async (data) => {
      if (data.id) {
        io.emit(`Server-Register-QR-Code`, { data: data });
      }
    });

    socket.on(`Client-Chat-Room`, async (data) => {
      let dateTimeSend = new Date().toLocaleString('en-US', {timeZone: 'Asia/Ho_Chi_Minh'})
      // dateTimeSend.setUTCHours(currentDate.getUTCHours() + 7)
      data.dateTimeSend = dateTimeSend
      if (data.message) {
        await chatRepository.create(data);
        io.emit(`Server-Chat-Room-${data.chatRoom}`, { data: data });
      } else if (data.file) {
        let fileUrl = await uploadFile(data.file);
        data.message = fileUrl;
        await chatRepository.create(data);
        io.emit(`Server-Chat-Room-${data.chatRoom}`, { data: data });
      }
    });

    socket.on(`Client-Status-Chat`, async (data) => {
      let result = await statusChatRepository.create(data);
      if(result){
        let chatFinal = await getApiChatsFinalByUserIdAndChatId(data.implementer, data.objectId)
        io.emit(`Server-Status-Chat-${data.chatRoom}`, { data: {
          id : data.chat,
          chatFinal : chatFinal
        } });
      }
    });

    socket.on(`Client-update-avatar`, async (data) => {
      let fileUrl = await uploadFile(data.file);
      let dt = {
        image: fileUrl,
        id: data.id,
      };
      let user = await updateImageAvatar(dt);
      io.emit(`Server-update-avatar-${data.id}`, { data: user });
    });

    socket.on(`Client-update-background`, async (data) => {
      let fileUrl = await uploadFile(data.file);
      let dt = {
        background: fileUrl,
        id: data.id,
      };
      let user = await updateImageBackground(dt);
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
