const { Server } = require("socket.io");
const chatRepository = require("../repositories/chatRepository");
const statusChatRepository = require("../repositories/statusChatRepository");
const deletedChatRepository = require("../repositories/deletedChatRepository");
const makeFriendsRepository = require("../repositories/makeFriendsRepository");
const groupChatRepository = require("../repositories/groupChatRepository");
const { uploadFile } = require("../service/file.service");
const {
  findById,
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
      let user = await findById(data.sender);
      if (data.message) {
        await chatRepository.create(data);
        io.emit(`Server-Chat-Room-${data.chatRoom}`, {
          data: { ...data, name: user.name, imageUser: user.image },
        });
      } else if (data.file) {
        let fileUrl = await uploadFile(data.file);
        data.message = fileUrl;
        await chatRepository.create(data);
        io.emit(`Server-Chat-Room-${data.chatRoom}`, {
          data: { ...data, name: user.name, imageUser: user.image },
        });
      }
      if (data.receiver) {
        io.emit(`Server-Chat-Room-${data.receiver}`, { data: data });
        io.emit(`Server-Chat-Room-${data.sender}`, { data: data });
      } else {
        let group = await groupChatRepository.findById(data.groupChat);
        for (let index = 0; index < group.members.length; index++) {
          io.emit(`Server-Chat-Room-${group.members[index]}`, { data: data });
        }
      }
    });

    socket.on(`Client-Status-Chat`, async (data) => {
      let result = await statusChatRepository.create(data);
      if (result && data.objectId) {
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
      io.emit(`Server-Status-Chat-${data.chatRoom}`, {
        data: {
          id: data.chat,
        },
      });
    });

    socket.on(`Client-Delete-Chat`, async (data) => {
      await deletedChatRepository.create(data)
      io.emit(`Server-Group-Chats-${data.implementer}`, { data: data.chat ? data.chat : data.groupChat });
    });

    socket.on(`Client-update-avatar`, async (data) => {
      let fileUrl = await uploadFile(data.file);
      let dt = {
        image: fileUrl,
        id: data.id,
      };
      let user = await updateImageAvatar(dt);
      io.emit(`Server-Reload-Page-${data.id}`, { data: user });
    });

    socket.on(`Client-update-background`, async (data) => {
      let fileUrl = await uploadFile(data.file);
      let dt = {
        background: fileUrl,
        id: data.id,
      };
      let user = await updateImageBackground(dt);
      io.emit(`Server-Reload-Page-${data.id}`, { data: user });
    });

    socket.on(`Client-Make-Friends`, async (data) => {
      let rs = await makeFriendsRepository.create(data);
      rs && io.emit(`Server-Make-Friends-${data.chatRoom}`, { data: rs });
    });

    socket.on(`Client-Delete-Make-Friends`, async (data) => {
      let rs = await makeFriendsRepository.deleteById(data.id);
      rs &&
        io.emit(`Server-Delete-Make-Friends-${data.chatRoom}`, { data: true });
    });

    socket.on(`Client-Group-Chats`, async (data) => {
      let group = await groupChatRepository.create(data);
      await chatRepository.create({
        message: `Chào mừng đến với nhóm ${group.name}`,
        dateTimeSend: moment().utcOffset(7).format("YYYY-MM-DD HH:mm:ss"),
        sender: data.leader,
        groupChat: group.id,
      });
      for (let index = 0; index < data.members.length; index++) {
        io.emit(`Server-Group-Chats-${data.members[index]}`, { data: group });
      }
    });

    socket.on(`Client-Update-Group-Chats`, async (data) => {
      if (typeof data.mbs === "object") {
        data.group.members = JSON.stringify([
          ...data.group.members,
          ...data.mbs,
        ]);
        await groupChatRepository.update(data.group);
        for (let index = 0; index < data.mbs.length; index++) {
          io.emit(`Server-Group-Chats-${data.mbs[index]}`, {
            data: data.group,
          });
        }
      } else {
        data.group.members = JSON.stringify(
          data.group.members.filter((m) => m !== data.mbs)
        );
        await groupChatRepository.update(data.group);
        io.emit(`Server-Group-Chats-${data.mbs}`, { data: data.group });
      }
    });

    socket.on(`Client-Dessolution-Group-Chats`, async (data) => {
      data.group.status = 1
      await groupChatRepository.updateStatusGroup(data.group.status, data.group.id);
      for (let index = 0; index < data.group.members.length; index++) {
        io.emit(`Server-Group-Chats-${data.group.members[index]}`, {
          data: data.group,
        });
      }
    });

    socket.on(`Client-Change-Leader-And-Deputy-Group-Chats`, async (data) => {
      await groupChatRepository.updateLeaderAndDeputyGroup(data.group.leader, data.group.deputy, data.group.id);
      io.emit(`Server-Change-Leader-And-Deputy-Group-Chats-${data.group.id}`, {
        data: data.group,
      });
    });

    socket.on(`Client-Change-Name-Or-Image-Group-Chats`, async (data) => {
      await groupChatRepository.updateNameAndImageGroup(data.group.name, data.group.image, data.group.id);
      io.emit(`Server-Change-Name-Or-Image-Group-Chats-${data.group.id}`, {
        data: data.group,
      });
      for (let index = 0; index < data.group.members.length; index++) {
        io.emit(`Server-Reload-Page-${data.group.members[index]}`, {
          data: data.group,
        });
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
