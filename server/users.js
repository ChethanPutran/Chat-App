let roomsData = {
  room1: {
    users: [],
    noOfUsers: 0,
  },
  room2: {
    users: [],
    noOfUsers: 0,
  },
};

let users = [];

const addUser = ({ id, username, room }) => {
  username = username.trim().toLowerCase();
  room = room.trim();

  if (!username || !room) {
    return { error: "Username and room are required!" };
  }

  //Check for the presence of room
  if (!(room in roomsData)) {
    return { error: "No room found!" };
  }

  //Check for existing user
  const isExistUser = roomsData[room].users.find((user) => {
    return user.username === username;
  });

  if (isExistUser) {
    return { error: "Username is already taken!" };
  }

  const user = { id, username, room };

  roomsData[room].users.push(user);
  updateUserCount(room);
  users.push({ ...user });
  return { user };
};

const removeUser = (id, room) => {
  if (!(room in roomsData)) {
    return null;
  }
  roomsData[room].users = roomsData[room].users.filter((user) => {
    return user.id !== id;
  });

  const idx = users.findIndex((user) => user.id === id);

  if (idx !== -1) {
    const user = users.splice(idx, 1);
    updateUserCount(room);
    return user[0];
  }
  return { status: check !== users.length, user: getUserById(id) };
};

const getUserById = (id) => {
  return users.filter((user) => user.id === id);
};

const getUsersByRoom = (room) => {
  return roomsData[room].users || null;
};

const updateUserCount = (room) => {
  roomsData[room].noOfUsers = roomsData[room].users.length;
};
const getUserCount = (room) => {
  return roomsData[room].noOfUsers;
};
const getRoomByUserId = (id) => {
  const idx = users.indexOf((user) => {
    return user.id === id;
  });

  return idx === -1 ? null : users[idx].room;
};
module.exports = {
  addUser,
  removeUser,
  getUsersByRoom,
  getUserById,
  getRoomByUserId,
  updateUserCount,
  getUserCount,
};
