const { Server } = require("socket.io");
const chatRepository = require("../repositories/chatRepository");
const statusChatRepository = require("../repositories/statusChatRepository");
const makeFriendsRepository = require("../repositories/makeFriendsRepository");
const { uploadFile } = require("../service/file.service");
const {
  updateImageAvatar,
  updateImageBackground,
  getApiChatsFinalByUserIdAndChatId,
} = require("../repositories/userRepository");
const moment = require("moment");

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
      if (data.message) {
        await chatRepository.create(data);
        io.emit(`Server-Chat-Room-${data.chatRoom}`, { data: data });
      } else if (data.file) {
        let fileUrl = await uploadFile(data.file);
        data.message = fileUrl;
        await chatRepository.create(data);
        io.emit(`Server-Chat-Room-${data.chatRoom}`, { data: data });
      }
      io.emit(`Server-Chat-Room-${data.receiver}`, { data: data });
    });

    socket.on(`Client-Status-Chat`, async (data) => {
      let result = await statusChatRepository.create(data);
      if (result) {
        let chatFinal = await getApiChatsFinalByUserIdAndChatId(
          data.implementer,
          data.objectId
        );
        io.emit(`Server-Status-Chat-${data.chatRoom}`, {
          data: {
            id: data.chat,
            chatFinal: chatFinal,
          },
        });
      }
    });

    socket.on(`Client-Delete-Chat`, async (data) => {
      let idChats = await chatRepository.getApiChatBetweenUsersForDelete(
        data.implementer,
        data.objectId
      );
      for (let i = 0; i < idChats.length; i++) {
        let rss = await statusChatRepository.create({
          status: "delete",
          implementer: data.implementer,
          chat: idChats[i].id,
        });
      }
      io.emit(`Server-Delete-Chat-${data.implementer}`, {data : true});
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

    socket.on(`Client-Make-Friends`, async (data) => {
      let rs = await makeFriendsRepository.create(data)
      rs && io.emit(`Server-Make-Friends-${data.chatRoom}`, {data : rs});
    });

    socket.on(`Client-Delete-Make-Friends`, async (data) => {
      let rs = await makeFriendsRepository.deleteById(data.id)
      rs && io.emit(`Server-Delete-Make-Friends-${data.chatRoom}`, {data : true});
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected"); // Khi client disconnect thì log ra terminal.
    });
  });
};

module.exports = {
  SocketIo,
};
