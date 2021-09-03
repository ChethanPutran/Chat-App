const socket = io();
const parent = document.querySelector("#authorized");
const msgForm = parent.querySelector("#msgForm");
const sideBar = parent.querySelector(".sideBar");
const shareLocBtn = parent.querySelector("#msgForm .shareLoc");
const msgFormSendBtn = parent.querySelector("#msgForm .sendBtn");
const msgFormInput = parent.querySelector("#msgForm input");
const msgArea = parent.querySelector(".messageArea");
const data = parent.querySelector(".datas");
console.log(document.querySelector("#msgForm button"));
msgFormSendBtn.disabled = true;

//Emoji picker

const emojiPicker = new FgEmojiPicker({
  trigger: ["#emojiBtn"],
  removeOnSelection: false,
  closeButton: true,
  position: ["top", "left"],
  preFetch: true,
  insertInto: msgFormInput,
  emit(obj, triggerElement) {
    console.log(obj, triggerElement);
  },
});

//Handling user
const params = new URLSearchParams(location.search);
const username = params.get("username");
const room = params.get("room");

if (!username || !params) {
  errorHandler(`❗🚫Usename and Room number are required🚫❗`);
}

//Helper Functions
const errorHandler = (text) => {
  document.body.innerHTML = `<div class="error">${text}</div>`;
};
//Updating UI
const updateUI = () => {
  //Hight of new message
  const newMsgHeight = Math.ceil(msgArea.lastElementChild.offsetHeight);

  //Visible height
  const visibleHeight = msgArea.offsetHeight;

  //Hight of message container
  const containerHeight = Math.ceil(msgArea.scrollHeight);
  const scrollOffset = Math.ceil(msgArea.scrollTop + visibleHeight);

  if (Math.round(containerHeight - newMsgHeight) <= scrollOffset) {
    msgArea.scrollTop = msgArea.scrollHeight;
  }
};

//Updating user data
const updateData = (noOfUsers, username, room) => {
  data.children[0].innerHTML = `<h3 class="username">${noOfUsers}</h3>`;
  data.children[1].innerHTML = `<h3 class="username">${username}</h3>`;
  data.children[2].innerHTML = `<h3>Room No ${room}</h3>`;
};

//Function to append message to UI
const addMessageToUI = (message_) => {
  const div = document.createElement("div");
  div.className =
    message_.from === "me" || message_.from === username
      ? "alignRight"
      : "alignLeft";

  div.innerHTML = `
            <div class="messageBox ${
              message_.from === "me" || message_.from === username
                ? "messageBox__Right"
                : "messageBox__Left"
            }">
              <div class="messageContent">
                <div class="sender">
                ${message_.from === "me" ? "" : message_.from}
                </div>
                <div class="message">${
                  message_.message
                    ? `<p>${message_.message}</p>`
                    : `
                      <a href="https:google.com/maps?${message_.link}"><iframe
                          frameborder="0"
                          marginheight="0"
                          marginwidth="0"
                          src="https://maps.google.com/maps?width=230&amp;height=400&amp;hl=en&amp;${message_.link}&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed">
                        </iframe></a>
                      `
                }</div>
              </div>
              <div class="messageDate">
                <p>${message_.createdAt}</p>
              </div>
          </div>`;

  msgArea.append(div);

  updateUI();
};

//Function to handle side-bar
const handleSideBar = ({ room, users }) => {
  sideBar.innerHTML = "";
  users.forEach((user) => {
    const div = document.createElement("div");
    div.innerHTML = `<div class="userContainer">
                      <div class="userCard">
                        <p class="userName">${user.username}</p>
                        <p class="id">${user.id}</p>
                        <p class="userDescription">Lorem, ipsum dolor sit amet
                          consectetur adipisicing elit.</p>
                      </div>
                      </div>
            `;
    sideBar.append(div);
  });
};

//Function to share location
const shareLocation = () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported in your deveice!");
  }

  shareLocBtn.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition(
    (position) => {
      shareLocBtn.removeAttribute("disabled");
      const to = room;
      socket.emit(
        "shareLocation",

        {
          location: {
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
          },
          from: username,
          to: to,
        },
        (data) => {
          console.log(data);
        }
      );
    },
    (err) => {
      toggleToolTip(err.message);
      setTimeout(() => {
        toggleToolTip();
      }, 3000);
    }
  );
};

//Function to send messages
const sendMessage = (event) => {
  msgFormSendBtn.disabled = true;
  event.preventDefault();
  console.log("submit");
  const messageInput = event.target.elements.message;
  const message = messageInput.value.trim();

  if (!message) {
    return (msgFormSendBtn.disabled = true);
  }
  const time = new Date();
  const hour = time
    .toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
    .toLowerCase();

  addMessageToUI({
    from: "me",
    message: message,
    to: "other",
    createdAt: hour,
  });

  socket.emit(
    "newMessage",
    { message, from: username, to: room },
    (message, error) => {
      msgFormSendBtn.removeAttribute("disabled");

      messageInput.value = "";
      messageInput.focus();
      if (error) {
        return console.log(error);
      }
    }
  );
};

//Function to handle events
const showEvents = (text) => {
  const div = document.createElement("div");
  div.innerHTML = `<div class="centerCont">
                      <div class="subMsg">${text}</div>
                    </div>;`;
  msgArea.append(div);
};
//Function to handle tool-tip
const toggleToolTip = (text = "") => {
  const toolTip = document.querySelector(".toolTip");
  toolTip.classList.toggle("showToolTip");
  toolTip.innerHTML = text;
};

//Updating UI for the first time
// updateUI();
updateData(0, username, room);
msgFormInput.focus();

//SOCKET CODE

//Listening for connection
socket.on("connect", () => {
  //Broadcasting Messages

  //Listening for connection
  socket.emit("join", { username, room }, (err, data) => {
    if (err) {
      errorHandler(err);
    }
  });

  //Handling messages
  socket.on("newMessage", (message_) => {
    addMessageToUI(message_);
  });

  //Handling number of users
  socket.on("userUpdated", (noOfUsers) => {
    updateData(noOfUsers, username, room);
  });

  //Handling side-bar share
  socket.on("roomData", (data) => {
    handleSideBar(data);
  });
  //Handling location share
  socket.on("getLocation", (message) => {
    addMessageToUI(message);
  });

  socket.on("userJoined", (message) => {
    showEvents(message.message);
  });

  //Handling user disconnection
  socket.on("disconnect", () => {});
});
//Handling DOM events
msgFormInput.onkeyup = function () {
  const message = msgFormInput.value.trim();

  const icon = document.querySelector(".sendIcon");
  if (!message) {
    icon.classList.remove("enabled");
    msgFormSendBtn.style.cursor = "context-menu";
    msgFormSendBtn.disabled = true;
    return;
  } else {
    msgFormSendBtn.disabled = false;
    icon.classList.add("enabled");
    msgFormSendBtn.style.cursor = "pointer";
  }
};
msgForm.addEventListener("submit", sendMessage);

shareLocBtn.addEventListener("click", shareLocation);
