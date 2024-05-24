const { Server } = require("socket.io");
const chatRepository = require("../repositories/chatRepository");
const statusChatRepository = require("../repositories/statusChatRepository");
const emotionRepository = require("../repositories/emotionRepository");
const deletedChatRepository = require("../repositories/deletedChatRepository");
const makeFriendsRepository = require("../repositories/makeFriendsRepository");
const groupChatRepository = require("../repositories/groupChatRepository");
const waitMessageRepository = require("../repositories/waitMessageRepository");
const { uploadFile } = require("../service/file.service");
const {
  findById,
  updateImageAvatar,
  updateImageBackground,
  getApiChatsFinalByUserIdAndChatId,
  updateRelationships
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
      let group = (data.groupChat) &&  await groupChatRepository.findById(data.groupChat);

      if(data.message.match(
        /Bạn và(?:\s"[^"]+"|\s[^"]+|\s\w+)\sđã trở thành bạn/g
      )){
        await waitMessageRepository.create({
          dateTimeSend: moment().utcOffset(7).format("YYYY-MM-DD HH:mm:ss"),
          sender: data.sender,
          receiver: data.receiver,
          groupChat: data.groupChat,
        })

        await waitMessageRepository.create({
          dateTimeSend: moment().utcOffset(7).format("YYYY-MM-DD HH:mm:ss"),
          sender: data.receiver,
          receiver: data.sender,
          groupChat: data.groupChat,
        })
      }

      let result = null
      if(!data.groupChat){
        result = await waitMessageRepository.findBySenderAndReceiver(data.sender, data.receiver)
      } else{
        result = await waitMessageRepository.findBySenderAndGroupChat(data.sender, data.groupChat)
      }

      if(!result){
        result = await waitMessageRepository.create({
          dateTimeSend: moment().utcOffset(7).format("YYYY-MM-DD HH:mm:ss"),
          sender: data.sender,
          receiver: data.receiver,
          groupChat: data.groupChat,
        })
      }

      if (data.message) {
        const chat = await chatRepository.create(data);
        io.emit(`Server-Chat-Room-${data.chatRoom}`, {
          data: {
            ...data,
            id: chat,
            receiver: data.receiver || null,
            groupChat: data.groupChat || null,
            nameGroup: group ? group.name : null,
            imageGroup: group ? group.image : null,
            chatRoom: data.chatRoom,
            chatReply: data.chatReply || null,
            isRecalls: 0,
            emojis: null,
            quantities: 1,
            name: user.name,
            imageUser: user.image },
        });
      } else if (data.file) {
        let fileUrl = await uploadFile(data.file);
        data.message = fileUrl;
        delete data.file;
        const chat = await chatRepository.create(data);
        io.emit(`Server-Chat-Room-${data.chatRoom}`, {
          data: {
            ...data,
            id: chat,
            receiver: data.receiver || null,
            groupChat: data.groupChat || null,
            chatRoom: data.chatRoom,
            chatReply: null,
            isRecalls: 0,
            emojis: null,
            quantities: 1,
            name: user.name,
            imageUser: user.image },
        });
      }
      
      if (data.receiver) {
        io.emit(`Server-Chat-Room-${data.receiver}`, { data: data, waitMessage : result });
        io.emit(`Server-Chat-Room-${data.sender}`, { data: data, waitMessage : result });
      } else {
        let group = await groupChatRepository.findById(data.groupChat);
        for (let index = 0; index < group.members.length; index++) {
          io.emit(`Server-Chat-Room-${group.members[index]}`, { data: data, waitMessage : result });
        }
      }
    });

    socket.on(`Client-Status-Chat`, async (data) => {
      let result = await statusChatRepository.create(data);
      if (result) {
        const chatFinal = await getApiChatsFinalByUserIdAndChatId(
          data.objectId,
          data.implementer,
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
      await deletedChatRepository.create(data);
      io.emit(`Server-Group-Chats-${data.implementer}`, {
        data: data.chat ? data.chat : data.groupChat,
      });
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
      rs && io.emit(`Server-Reload-Page-${data.recipient}`, { data: rs });
    });

    socket.on(`Client-Update-Friends`, async (data) => {
      let user = await findById(data.userId)
      let friend = await findById(data.friendId)
      user.relationships.friends = user.relationships.friends.filter(fr => fr !== friend.id)
      friend.relationships.friends = friend.relationships.friends.filter(fr => fr !== user.id)
      let rs = await updateRelationships(user)
      rs = await updateRelationships(friend)
      io.emit(`Server-Reload-Page-${data.userId}`, { data: rs });
      io.emit(`Server-Reload-Page-${data.friendId}`, { data: rs });
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
      let leader = await findById(data.leader);
      let members = JSON.parse(data.members);
      for (let index = 0; index < members.length; index++) {
        let user = await findById(members[index]);
        leader.id !== members[index] &&
          (await chatRepository.create({
            message: `${leader.name} đã thêm ${user.name} vào nhóm.`,
            dateTimeSend: moment().utcOffset(7).format("YYYY-MM-DD HH:mm:ss"),
            sender: data.leader,
            groupChat: group.id,
          }));
      }
      for (let index = 0; index < data.members.length; index++) {
        await waitMessageRepository.create({
          dateTimeSend: moment().utcOffset(7).format("YYYY-MM-DD HH:mm:ss"),
          sender: data.members[index],
          receiver: null,
          groupChat: group.id,
        })
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

        let leader = await findById(data.implementer);
        for (let index = 0; index < data.mbs.length; index++) {
          let user = await findById(data.mbs[index]);
          leader.id !== data.mbs[index] &&
            (await chatRepository.create({
              message: `${leader.name} đã thêm ${user.name} vào nhóm.`,
              dateTimeSend: moment().utcOffset(7).format("YYYY-MM-DD HH:mm:ss"),
              sender: data.implementer,
              groupChat: data.group.id,
            }));
        }

        let members = JSON.parse(data.group.members)
        for (let index = 0; index < members.length; index++) {
          io.emit(`Server-Group-Chats-${members[index]}`, {
            data: data.group,
          });
        }
      } else {
        data.group.members = JSON.stringify(
          data.group.members.filter((m) => m !== data.mbs)
        );
        await groupChatRepository.update(data.group);

        let leader = await findById(data.implementer);
        let user = await findById(data.mbs);
        await chatRepository.create({
          message: `${leader.name} đã xóa ${user.name} khỏi nhóm.`,
          dateTimeSend: moment().utcOffset(7).format("YYYY-MM-DD HH:mm:ss"),
          sender: data.implementer,
          groupChat: data.group.id,
        })

        let members = JSON.parse(data.group.members)
        io.emit(`Server-Group-Chats-${data.mbs}`, { data: {...data.group, user : data.mbs} });
        for (let index = 0; index < members.length; index++) {
          io.emit(`Server-Group-Chats-${members[index]}`, { data: {...data.group, user : data.mbs} });
        }
      }
    });

    socket.on(`Client-Dessolution-Group-Chats`, async (data) => {
      data.group.status = 1;
      await groupChatRepository.updateStatusGroup(
        data.group.status,
        data.group.id
      );
      for (let index = 0; index < data.group.members.length; index++) {
        io.emit(`Server-Group-Chats-${data.group.members[index]}`, {
          data: {...data.group, isDissolution : true},
        });
      }
    });

    socket.on(`Client-Change-Leader-And-Deputy-Group-Chats`, async (data) => {
      let oldLeader = await findById(data.oldLeader);
      let newLeader = null
      let deputy = null
      if(data.group.deputy !== null){
        deputy = await findById(data.group.deputy)
      }
      else{
        newLeader = await findById(data.group.leader)
      }
      await groupChatRepository.updateLeaderAndDeputyGroup(
        data.group.leader,
        data.group.deputy,
        data.group.id
      );
      await chatRepository.create({
        message: newLeader !== null ? `${oldLeader.name} đã phân quyền ${newLeader.name} thành trưởng nhóm.` : `${oldLeader.name} đã phân quyền ${deputy.name} thành phó nhóm.`,
        dateTimeSend: moment().utcOffset(7).format("YYYY-MM-DD HH:mm:ss"),
        sender: data.oldLeader,
        groupChat: data.group.id,
      })
      for (let index = 0; index < data.group.members.length; index++) {
        io.emit(`Server-Rerender-Group-Chats-${data.group.members[index]}`, {
          data: {...data.group},
        });
      }
    });

    socket.on(`Client-Change-Name-Or-Image-Group-Chats`, async (data) => {
      await groupChatRepository.updateNameAndImageGroup(
        data.group.name,
        data.group.image,
        data.group.id
      );
      for (let index = 0; index < data.group.members.length; index++) {
        io.emit(`Server-Rerender-Group-Chats-${data.group.members[index]}`, {
          data: {...data.group},
        });
      }
    });

    socket.on(`Client-Emotion-Chats`, async (data) => {
      await emotionRepository.create(data);
      io.emit(`Server-Emotion-Chats-${data.chatRoom}`, {
        data: data,
      });
      for (let index = 0; index < data.members.length; index++) {
        io.emit(`Server-Rerender-Group-Chats-${data.members[index]}`, {
          data: data,
        });
      }
    });

    socket.on(`Client-Update-Wait-Message`, async (data) => {
      await waitMessageRepository.update({
        id : data.id,
        dateTimeSend: moment().utcOffset(7).format("YYYY-MM-DD HH:mm:ss"),
      });
      // io.emit(`Server-Group-Chats-${data.implementer}`, {
      //   data: data.chat ? data.chat : data.groupChat,
      // });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected"); // Khi client disconnect thì log ra terminal.
    });
  });
};

module.exports = {
  SocketIo,
};
