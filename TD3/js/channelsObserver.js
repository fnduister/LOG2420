"use strict";
class ChannelsObserver {
  constructor() {
    this.currentChannelId;
    this.generalChannelId = "invalid";
    this.state = {
      activeChannels: [],
      nonActiveChannels: [],
      waitingMessages: { globalWaitingMessages: 0 }
    };
    // this.channelList = [];
    this.render = false;
  }

  createChannel = info => {
    console.log({ info });
  };

  saveMessage = message => {
    console.log({ message, actve: this.state.activeChannels });
    const channelFound = this.state.activeChannels.find(
      channel => channel.id == message.channelId
    );
    console.log({ channelFound });
    channelFound.messages.push(message);
  };

  firstRender = channels => {
    for (const channel of channels) {
      if (channel.joinStatus) {
        if (channel.name == "Général") {
          addGeneralChannel(channel.id, "Général");
          this.generalChannelId = channel.id;
        } else {
          addActiveChannel(channel.id, channel.name);
        }
      } else {
        addNonActiveChannel(channel.id, channel.name);
      }
    }
  };

  containsChannel = (channel, channelList) => {
    let i;
    for (i = 0; i < channelList.length; i++) {
      if (channelList[i].id == channel.id) {
        return true;
      }
    }
    return false;
  };

  updateChannelWaitingMessages = channelId => {
    if (this.state.waitingMessages[channelId] != null) {
      this.state.waitingMessages[channelId]++;
    } else {
      this.state.waitingMessages[channelId] = 1;
    }
      this.notification(channelId);
      // setTimeout(() => this.notification(channelId), 1000);
      this.updateGlobalNotification();
  };

  updateChannelsList = channels => {
    console.log({ channels });
    const newActiveChannels = channels.filter(c => c.joinStatus);
    const newNonActiveChannels = channels.filter(c => !c.joinStatus);
    if (!this.state.activeChannels.length) {
      this.firstRender(channels);
    } else {
      if (newNonActiveChannels.length < this.state.nonActiveChannels.length) {
        for (const channel of this.state.nonActiveChannels) {
          if (!this.containsChannel(channel, newNonActiveChannels)) {
            removeNonActiveChannel(channel.id);
            this.state.waitingMessages[channel.id] = null;
          }
        }
      }

      if (newActiveChannels.length < this.state.activeChannels.length) {
        for (const channel of this.state.activeChannels) {
          if (!this.containsChannel(channel, newActiveChannels)) {
            this.removeActiveChannel(channel.id);
          }
        }
      }

      if (newActiveChannels.length > this.state.activeChannels.length) {
        for (const channel of newActiveChannels) {
          if (!this.containsChannel(channel, this.state.activeChannels)) {
            addActiveChannel(channel.id, channel.name);
          }
        }
      }

      if (newNonActiveChannels.length > this.state.nonActiveChannels.length) {
        for (const channel of newNonActiveChannels) {
          if (!this.containsChannel(channel, this.state.nonActiveChannels)) {
            addNonActiveChannel(channel.id, channel.name);
          }
        }
      }
    }
    this.state.activeChannels = newActiveChannels;
    this.state.nonActiveChannels = newNonActiveChannels;
    console.log({ newActiveChannels });
    return null;
  };

  notification = channelId => {
    const channel = document.querySelector(`#notification-${channelId}`);
    channel.innerText =
      this.state.waitingMessages[channelId] != 0
        ? this.state.waitingMessages[channelId]
        : null;
  };

  updateGlobalNotification = () => {
    const notifications = document.querySelector("#notifications span");
    if(this.state.waitingMessages.globalWaitingMessages >= 0)
    notifications.innerText = ++this.state.waitingMessages
        .globalWaitingMessages;
    console.log({ globalNotification:this.state.waitingMessages.globalWaitingMessages })
  };

  removeActiveChannel = id => {
    document.getElementById(id).remove();
    console.log({ id, current: this.currentChannelId });
    if (id == this.currentChannelId) {
      if (this.state.waitingMessages[id]) {
        this.state.waitingMessages.globalWaitingMessages -=
          this.state.waitingMessages[id] + 1;
        this.state.waitingMessages[id] = 0;
        this.updateGlobalNotification();
      }
      this.setActiveChannel(this.generalChannelId);
    }
  };

  clear = () => {
    const activeChannels = document.getElementById("activeChannels");
    const nonActiveChannels = document.getElementById("nonActiveChannels");
    activeChannels.innerHTML = null;
    nonActiveChannels.innerHTML = null;
  };

  setActiveChannel = id => {
    const activeChannel = document.getElementById(id);
    const oldActiveChannel = document.getElementById(this.currentChannelId);
    if (oldActiveChannel) oldActiveChannel.classList.remove("current-channel");
    activeChannel.classList.add("current-channel");
    if (this.state.waitingMessages[id]) {
      this.state.waitingMessages.globalWaitingMessages -=
        this.state.waitingMessages[id] + 1;
      this.state.waitingMessages[id] = 0;
      this.updateGlobalNotification();
      this.notification(id);
    }
    console.log({ current: this.currentChannelId });
  };
}

/**
 *
 *
 * @param {*} channelId
 * @param {*} channelName
 * @returns
 */
const addGeneralChannel = (channelId, channelName) => {
  document.getElementById(
    "activeChannels"
  ).innerHTML += `<div class="group-info general active-channel current-channel" onClick="changeCurrentChannel(this)" id="${channelId}">
        <button>
            <img src="imgs/baseline-lock-24px.svg" alt="default" />
        </button>
        <h4>${channelName}</h4>
        <button class="default-button">default</button>
        <span id="notification-${channelId}"></span>
        </div>`;
  return null;
};

let addActiveChannel = (channelId, channelName) => {
  document.getElementById("activeChannels").innerHTML += `
  <div class="group-info active-channel" onClick="changeCurrentChannel(this)" id=${channelId}>
    <button type="button" onClick="leaveChannel(this)" data-id=${channelId}>
      <img
        src="imgs/baseline-remove_circle-orange-24px.svg"
        alt="settings"
      />
      </button>
    <h4>${channelName}</h4>
    <span id="notification-${channelId}"></span>
    </div>`;
};

let addNonActiveChannel = (channelId, channelName) => {
  document.getElementById(
    "nonActiveChannels"
  ).innerHTML += `<div class="group-info" id=${channelId} >
        <button type="button"  onClick="joinChannel(this)" data-id=${channelId}>
        <img
            src="imgs/baseline-add_circle-green-24px.svg"
            alt="settings"
        />
        </button>
        <h4>${channelName}</h4>
        <span id="notification-${channelId}"></span>
    </div>`;
};

let removeNonActiveChannel = id => {
  document.getElementById(id).remove();
};
