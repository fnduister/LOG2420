"use strict";

var weekDays = ["DIM.", "LUN.", "MAR.", "MER.", "JEU.", "VEN.", "SAM."];

class MessageObserver {
  constructor(user, currentChannelId) {
    this.user = user;
    this.currentChannelId = currentChannelId;
    this.messageList = [];
  }

  //ajoute un nouveau message
  addNewMessage = message => {
    if (message.sender != this.user) {
      addReceivedMessage(message);
    } else {
      addSentMessage(message);
    }
    scrollDown();
  };

  updateMessagesList = (data, numberOfUsers) => {
    console.log({ dataUpda: data });
    this.messageList = data.messages;
    for (const message of this.messageList) {
      this.addNewMessage(message);
    }

    updateActiveChannelInfo(data.name, numberOfUsers);
  };

  clear = () => {
    const chatZone = document.getElementById("chat-zone");
    chatZone.innerHTML = null;
  };
}

const convertTime = timestamp => {
  const time = new Date(timestamp);
  return (
    weekDays[time.getDay()] +
    " " +
    time.getDate() +
    ", " +
    time.getHours() +
    ":" +
    time.getMinutes()
  );
};

const addReceivedMessage = messageInfo => {
  const chatZone = document.getElementById("chat-zone");
  let admin = null;
  if (messageInfo.sender == "Admin") {
    admin = "admin";
  }
  chatZone.innerHTML += `
    <div class="message ${admin}">
        <h6 class="sender ">${messageInfo.sender}</h6>
        <p>${messageInfo.data}</p>
        <h6 class="date">${convertTime(messageInfo.timestamp)}</h6>
    </div>`;
};

const addSentMessage = messageInfo => {
  const chatZone = document.getElementById("chat-zone");
  chatZone.innerHTML += `
    <div class="message receiving">
        <p>${messageInfo.data}</p>
        <h6 class="date">${convertTime(messageInfo.timestamp)}</h6>
    </div>`;
};

const updateActiveChannelInfo = (newName, numberOfUsers) => {
  const activeChannelName = document.querySelector("#channelName");
  const activenumberOfUsers = document.getElementById("numberOfUsers");
  activeChannelName.innerText = newName;
  activenumberOfUsers.innerText = numberOfUsers;
};
