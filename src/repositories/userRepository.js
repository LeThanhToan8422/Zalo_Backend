const { QueryTypes } = require("sequelize");
let db = require("../models/index");
let { sequelize, Op } = require("../models/index");

let create = async (data) => {
  try {
    await sequelize.query(
      `INSERT INTO Users (name,gender,dob,phone, image, background) VALUES (:name,:gender,:dob,:phone,:image,:background)`,
      {
        replacements: {
          name: data.name,
          gender: data.gender,
          dob: data.dob,
          phone: data.phone,
          image: data.image
            ? data.image
            : "https://s3-dynamodb-cloudfront-20040331.s3.ap-southeast-1.amazonaws.com/toan.jfif",
          background: data.background
            ? data.background
            : "https://s3-dynamodb-cloudfront-20040331.s3.ap-southeast-1.amazonaws.com/backgroud.jpg",
          relationships: JSON.stringify({ friends: [], block: [] }),
        },
        type: QueryTypes.INSERT,
      }
    );
    return await checkPhone(data.phone);
  } catch (error) {
    return null;
  }
};

let update = async (data) => {
  try {
    await sequelize.query(
      `UPDATE Users
        SET name = :name, gender = :gender, dob = :dob
        WHERE id = :id`,
      {
        replacements: {
          id: data.id,
          name: data.name,
          gender: data.gender,
          dob: data.dob,
        },
        type: QueryTypes.UPDATE,
      }
    );
    return true;
  } catch (error) {
    return false;
  }
};

let updateRelationships = async (data) => {
  console.log(data);
  try {
    await sequelize.query(
      `UPDATE Users
        SET relationships = :relationships
        WHERE id = :id`,
      {
        replacements: {
          id: data.id,
          relationships: JSON.stringify(data.relationships),
        },
        type: QueryTypes.UPDATE,
      }
    );
    return true;
  } catch (error) {
    return false;
  }
};

let updateFriendsRelationships = async (id, objectId) => {
  try {
    await sequelize.query(
      `UPDATE Users
      SET relationships = 
          CASE 
              WHEN JSON_CONTAINS(relationships, '{"block": [${objectId}]}') THEN 
                  JSON_SET(
                      JSON_REMOVE(
                          relationships, 
                          JSON_UNQUOTE(
                              JSON_SEARCH(relationships, 'one', '${objectId}', NULL, '$.block')
                          )
                      ), 
                      '$.friends', 
                      JSON_ARRAY_APPEND(
                          JSON_EXTRACT(relationships, '$.friends'),
                          '$',
                          CAST('${objectId}' AS UNSIGNED)
                      )
                  )
              ELSE
                  CASE 
                      WHEN JSON_CONTAINS(relationships, '{"friends": [${objectId}]}') THEN 
                          relationships
                      ELSE 
                          CASE 
                              WHEN JSON_SEARCH(relationships, 'one', '${objectId}', NULL, '$.friends') IS NULL 
                                   AND JSON_SEARCH(relationships, 'one', '${objectId}', NULL, '$.block') IS NULL THEN 
                                  JSON_SET(
                                      relationships,
                                      '$.friends', 
                                      JSON_ARRAY_APPEND(
                                          JSON_EXTRACT(relationships, '$.friends'),
                                          '$',
                                          CAST('${objectId}' AS UNSIGNED)
                                      )
                                  )
                              ELSE 
                                  JSON_SET(
                                      JSON_REMOVE(
                                          JSON_REMOVE(relationships, '$.block'),
                                          '$.friends'
                                      ), 
                                      '$.friends', 
                                      JSON_ARRAY_APPEND(
                                          JSON_EXTRACT(relationships, '$.friends'),
                                          '$',
                                          CAST('${objectId}' AS UNSIGNED)
                                      )
                                  )
                          END
                  END
          END
      WHERE id = ${id};
      `,
      {
        type: QueryTypes.UPDATE,
      }
    );
    return true;
  } catch (error) {
    return false;
  }
};

let updateBlockRelationships = async (id, objectId) => {
  try {
    await sequelize.query(
      `UPDATE Users
      SET relationships = 
          CASE 
              WHEN JSON_CONTAINS(relationships, '{"friends": [${objectId}]}') THEN 
                  JSON_SET(
                      JSON_REMOVE(
                          relationships, 
                          JSON_UNQUOTE(
                              JSON_SEARCH(relationships, 'one', '${objectId}', NULL, '$.friends')
                          )
                      ), 
                      '$.block', 
                      COALESCE(
                          JSON_ARRAY_APPEND(
                              JSON_EXTRACT(relationships, '$.block'),
                              '$',
                              CAST('${objectId}' AS UNSIGNED)
                          ),
                          JSON_ARRAY(CAST('${objectId}' AS UNSIGNED))
                      )
                  )
              ELSE
                  CASE 
                      WHEN JSON_CONTAINS(relationships, '{"block": [${objectId}]}') THEN 
                          relationships
                      ELSE 
                          CASE 
                              WHEN JSON_SEARCH(relationships, 'one', '${objectId}', NULL, '$.friends') IS NULL 
                                   AND JSON_SEARCH(relationships, 'one', '${objectId}', NULL, '$.block') IS NULL THEN 
                                  JSON_SET(
                                      relationships,
                                      '$.block', 
                                      JSON_ARRAY_APPEND(
                                          JSON_EXTRACT(relationships, '$.block'),
                                          '$',
                                          CAST('${objectId}' AS UNSIGNED)
                                      )
                                  )
                              ELSE 
                                  JSON_SET(
                                      JSON_REMOVE(
                                          JSON_REMOVE(relationships, '$.block'),
                                          '$.friends'
                                      ), 
                                      '$.block', 
                                      JSON_ARRAY_APPEND(
                                          JSON_EXTRACT(relationships, '$.block'),
                                          '$',
                                          CAST('${objectId}' AS UNSIGNED)
                                      )
                                  )
                          END
                  END
          END
      WHERE id = ${id};
      `,
      {
        type: QueryTypes.UPDATE,
      }
    );
    return true;
  } catch (error) {
    return false;
  }
};

let updateImageAvatar = async (data) => {
  try {
    await sequelize.query(
      `UPDATE Users
        SET image = :image
        WHERE id = :id`,
      {
        replacements: {
          id: data.id,
          image: data.image,
        },
        type: QueryTypes.UPDATE,
      }
    );
    return await findById(data.id);
  } catch (error) {
    return null;
  }
};

let updateImageBackground = async (data) => {
  try {
    await sequelize.query(
      `UPDATE Users
        SET background = :background
        WHERE id = :id`,
      {
        replacements: {
          id: data.id,
          background: data.background,
        },
        type: QueryTypes.UPDATE,
      }
    );
    return await findById(data.id);
  } catch (error) {
    return null;
  }
};

let findAll = async () => {
  try {
    let datas = await sequelize.query("SELECT * FROM Users", {
      type: QueryTypes.SELECT,
    });
    return datas;
  } catch (error) {
    return null;
  }
};

let findById = async (id) => {
  try {
    let data = await sequelize.query(
      `SELECT u.id, u.name, u.gender, u.dob, a.phone, u.image, u.background, u.relationships FROM Users AS u INNER JOIN Accounts AS a ON u.id = a.user WHERE u.id = :id`,
      {
        replacements: {
          id: id,
        },
        type: QueryTypes.SELECT,
      }
    );
    return data[0];
  } catch (error) {
    return null;
  }
};

let deleteById = async (id) => {
  try {
    await db.User.destroy({
      where: {
        id: id,
      },
    });
    return true;
  } catch (error) {
    return false;
  }
};

let getApiChatsByUserId = async (id) => {
  try {
    let datas = await sequelize.query(
      `
      SELECT 
        u.id, 
        u.name, 
        u.gender, 
        u.dob, 
        u.phone, 
        u.image, 
        u.background, 
        c.message AS message,
        c.dateTimeSend AS dateTimeSend,
        c.receiver, 
        c.sender,
        (SELECT COUNT(*) FROM Chats AS c WHERE c.sender = u.id AND c.receiver = :id AND c.dateTimeSend > wm.dateTimeSend) AS quantity
    FROM 
        Users AS u 
    INNER JOIN 
        Chats AS c ON (c.sender = u.id AND c.receiver = :id) OR (c.sender = :id AND c.receiver = u.id) 
    LEFT JOIN 
        Deleted_Chats AS dc ON (dc.implementer = :id)
    LEFT JOIN 
      	Wait_Messages AS wm ON wm.sender = u.id AND wm.receiver = :id
    WHERE 
        c.id = (
            SELECT 
                c.id 
            FROM 
                Chats AS c
            WHERE 
                ((c.sender = u.id AND c.receiver = :id) OR (c.sender = :id AND c.receiver = u.id)) 
                AND c.id NOT IN (
                    SELECT 
                        c.id 
                    FROM 
                        Chats AS c 
                    INNER JOIN 
                        Status_Chat AS st ON c.id = st.chat
                    WHERE 
                        ((c.sender = u.id AND c.receiver = :id) OR (c.sender = :id AND c.receiver = u.id))
                        AND (st.implementer = :id OR st.status = 'recalls')
                )
            ORDER BY 
                c.dateTimeSend DESC
            LIMIT 1
        ) AND u.id NOT IN (SELECT chat FROM Deleted_Chats WHERE implementer = :id AND dc.dateTimeSend > c.dateTimeSend)
    GROUP BY u.id
        `,
      {
        replacements: {
          id: Number(id),
        },
        type: QueryTypes.SELECT,
      }
    );

    return datas;
  } catch (error) {
    return null;
  }
};

let getApiGroupChatsByUserId = async (id) => {
  try {
    let datas = await sequelize.query(
      `SELECT gr.id, gr.name, gr.members, gr.leader, gr.deputy, gr.image, 
      CASE 
              WHEN dc.dateTimeSend IS NOT NULL THEN (
                  SELECT 
                      c1.message 
                  FROM 
                      Chats AS c1 
                  WHERE c1.groupChat = gr.id
                      AND c1.dateTimeSend > dc.dateTimeSend
                  ORDER BY 
                      c1.dateTimeSend DESC 
                  LIMIT 1
              )
              ELSE c.message
          END AS message
      , 
      CASE 
              WHEN dc.dateTimeSend IS NOT NULL THEN (
                  SELECT 
                      c2.dateTimeSend 
                  FROM 
                      Chats AS c2 
                  WHERE c2.groupChat = gr.id
                      AND c2.dateTimeSend > dc.dateTimeSend
                  ORDER BY 
                      c2.dateTimeSend DESC 
                  LIMIT 1
              )
              ELSE c.dateTimeSend
          END AS dateTimeSend, c.sender,
      (SELECT COUNT(*) FROM Chats AS c WHERE c.groupChat = gr.id AND c.dateTimeSend > wm.dateTimeSend) AS quantity
      FROM Group_Chats AS gr 
      INNER JOIN Chats AS c ON c.groupChat = gr.id
      LEFT JOIN
          Deleted_Chats AS dc ON (dc.implementer = :id AND dc.groupChat = gr.id)
      LEFT JOIN Wait_Messages AS wm ON wm.sender = :id AND wm.groupChat = gr.id
            WHERE JSON_CONTAINS(gr.members, :id)
            AND c.id = (
                SELECT id FROM Chats AS c
                WHERE c.groupChat = gr.id AND c.id NOT IN (
                  SELECT c.id FROM Chats AS c
                  INNER JOIN Status_Chat AS st ON c.id = st.chat
                  WHERE c.groupChat = gr.id
                  AND if(st.implementer = :id, 1, 0) OR st.status = 'recalls'
                )
              ORDER BY c.dateTimeSend DESC
              LIMIT 1
            ) AND gr.status = 0
   GROUP BY gr.id
      `,
      {
        replacements: {
          id: Number(id),
        },
        type: QueryTypes.SELECT,
      }
    );
    return datas;
  } catch (error) {
    return null;
  }
};

let checkPhone = async (phone) => {
  try {
    let data = await sequelize.query(
      `SELECT u.id, u.name, u.gender, u.dob, u.phone, u.image, u.background FROM Users AS u WHERE u.phone = :phone`,
      {
        replacements: {
          phone: phone,
        },
        type: QueryTypes.SELECT,
      }
    );
    return data[0];
  } catch (error) {
    return null;
  }
};

let getFriendsByIdAndName = async (id, name) => {
  try {
    let datas = await sequelize.query(
      `SELECT u.*
      FROM Users u
      JOIN (
        SELECT JSON_UNQUOTE(friend_id) AS friend_id
        FROM Users
        CROSS JOIN JSON_TABLE(
          relationships,
          '$.friends[*]' COLUMNS (
            friend_id VARCHAR(255) PATH '$'
          )
        ) AS friends
        WHERE id = :id
      ) f ON u.id = CAST(f.friend_id AS INT)
      WHERE u.name LIKE :name`,
      {
        replacements: {
          id: Number(id),
          name: `%${name}%`,
        },
        type: QueryTypes.SELECT,
      }
    );

    let dataGroups = await sequelize.query(
      `SELECT gr.id, gr.name, gr.image, gr.status, gr.leader, gr.deputy FROM Group_Chats AS gr
      WHERE JSON_CONTAINS(gr.members, :id) AND gr.status = 0 AND NAME LIKE :name
      `,
      {
        replacements: {
          id: Number(id),
          name: `%${name}%`,
        },
        type: QueryTypes.SELECT,
      }
    );

    return [...datas, ...dataGroups];
  } catch (error) {
    return null;
  }
};

let getFriendsById = async (id) => {
  try {
    let datas = await sequelize.query(
      `SELECT u.*
      FROM Users u
      JOIN (
        SELECT JSON_UNQUOTE(friend_id) AS friend_id
        FROM Users
        CROSS JOIN JSON_TABLE(
          relationships,
          '$.friends[*]' COLUMNS (
            friend_id VARCHAR(255) PATH '$'
          )
        ) AS friends
        WHERE id = :id
      ) f ON u.id = CAST(f.friend_id AS INT)`,
      {
        replacements: {
          id: Number(id),
        },
        type: QueryTypes.SELECT,
      }
    );

    // let dataGroups = await sequelize.query(
    //   `SELECT gr.id, gr.name, gr.image, gr.status, gr.leader, gr.deputy FROM Group_Chats AS gr
    //   WHERE JSON_CONTAINS(gr.members, :id) AND gr.status = 0`,
    //   {
    //     replacements: {
    //       id: Number(id),
    //     },
    //     type: QueryTypes.SELECT,
    //   }
    // );
    // return [...datas, ...dataGroups];
    return datas
  } catch (error) {
    return null;
  }
};

let getApiChatsFinalByUserIdAndChatId = async (id, chatId) => {
  try {
    let datas = await sequelize.query(
      `SELECT u.id, u.name, u.gender, u.dob, u.phone, u.image, u.background, c.message, c.dateTimeSend, c.receiver, c.sender
      FROM Users AS u 
      INNER JOIN Chats as c ON (c.sender = u.id AND c.receiver = :sender) OR (c.sender = :sender AND c.receiver = u.id)
      WHERE c.id = ( 
        SELECT id FROM Chats AS c 
        WHERE (c.sender = :receiver AND c.receiver = :sender) OR (c.sender = :sender AND c.receiver = :receiver) AND c.id NOT IN (
          SELECT c.id FROM Chats AS c 
          INNER JOIN Status_Chat AS st ON c.id = st.chat
          WHERE (c.sender = :receiver AND c.receiver = :sender) OR (c.sender = :sender AND c.receiver = :receiver)
        )
        ORDER BY c.dateTimeSend DESC
        LIMIT 1
      )`,
      {
        replacements: {
          sender: id,
          receiver: chatId,
        },
        type: QueryTypes.SELECT,
      }
    );
    return datas[0];
  } catch (error) {
    return null;
  }
};

let checkIsFriendByUserId = async (userId, friendId) => {
  try {
    let data = await sequelize.query(
      `SELECT CASE 
          WHEN mf.recipient = ${friendId} THEN 'Đã gửi lời mời kết bạn'
          WHEN mf.recipient = ${userId} THEN 'Đợi chấp nhận lời mời kết bạn'
          WHEN JSON_CONTAINS(relationships, '{"friends": [${friendId}]}') THEN '1'
          ELSE '0'
        END AS isFriends
      FROM Users AS u LEFT JOIN Make_Friends AS mf ON u.id = mf.giver WHERE (mf.giver = ${userId} AND mf.recipient = ${friendId}) || (mf.giver = ${friendId} AND mf.recipient = ${userId}) || u.id = ${userId}`,
      {
        type: QueryTypes.SELECT,
      }
    );
    return data[0];
  } catch (error) {
    return null;
  }
};

let getFriendsHaveNotJoinGroupByUserId = async (userId, groupId) => {
  try {
    let datas = await sequelize.query(
      `SELECT * FROM Users AS u
      WHERE JSON_CONTAINS(u.relationships, '{"friends": [${userId}]}') AND u.id NOT IN (
        SELECT u.id
        FROM Users as u
        JOIN Group_Chats as gr ON JSON_CONTAINS(gr.members, u.id)
        WHERE gr.id = :groupId
      )`,
      {
        replacements: {
          groupId: groupId,
        },
        type: QueryTypes.SELECT,
      }
    );
    return datas;
  } catch (error) {
    return null;
  }
};

let getFriendsHaveNotJoinGroupByUserIdAndName = async (
  userId,
  groupId,
  name
) => {
  try {
    let datas = await sequelize.query(
      `SELECT * FROM Users AS u
      WHERE JSON_CONTAINS(u.relationships, '{"friends": [${userId}]}') AND u.id NOT IN (
        SELECT u.id
        FROM Users as u
        JOIN Group_Chats as gr ON JSON_CONTAINS(gr.members, u.id)
        WHERE gr.id = :groupId
      ) AND u.name LIKE '%${name}%'
      `,
      {
        replacements: {
          groupId: groupId,
        },
        type: QueryTypes.SELECT,
      }
    );
    return datas;
  } catch (error) {
    return null;
  }
};

let getMembersInGroupByGroupId = async (groupId) => {
  try {
    let datas = await sequelize.query(
      `SELECT u.id, u.name, u.image
      FROM Users as u
      JOIN Group_Chats as gr ON JSON_CONTAINS(gr.members, u.id)
      WHERE gr.id = :groupId
      `,
      {
        replacements: {
          groupId: Number(groupId),
        },
        type: QueryTypes.SELECT,
      }
    );
    return datas;
  } catch (error) {
    return null;
  }
};

module.exports = {
  create,
  update,
  updateRelationships,
  findAll,
  findById,
  deleteById,
  getApiChatsByUserId,
  getApiGroupChatsByUserId,
  checkPhone,
  getFriendsByIdAndName,
  updateImageAvatar,
  updateImageBackground,
  getFriendsById,
  getApiChatsFinalByUserIdAndChatId,
  updateFriendsRelationships,
  updateBlockRelationships,
  checkIsFriendByUserId,
  getFriendsHaveNotJoinGroupByUserId,
  getFriendsHaveNotJoinGroupByUserIdAndName,
  getMembersInGroupByGroupId,
};
