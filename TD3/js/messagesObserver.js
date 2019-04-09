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

  updateMessagesList = data => {
    this.messageList = data.messages;
    for (const message of this.messageList) {
      this.addNewMessage(message);
    }
    updateActiveChannelName(data.name);
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

const updateActiveChannelName = newName => {
  const activeChannelName = document.querySelector("#chat-title h3");
  activeChannelName.innerText = newName;
};
