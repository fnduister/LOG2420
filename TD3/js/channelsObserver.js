"use strict";
class ChannelsObserver {
  constructor() {
    this.currentChannelId;
    this.generalChannelId = "invalid";
    this.state = {
      activeChannels: [],
      nonActiveChannels: [],
      waitingMessages: {}
    };
    this.render = false;
  }

  createChannel = info => {
    console.log({ info });
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

  updateChannelWaitingMessages = channelID => {
    if (this.state.waitingMessages[channelID] != null)
      this.state.waitingMessages[channelID]++;
    else {
      this.state.waitingMessages[channelID] = 1;
    }
    this.notification(channelID);
    console.log({ state: this.state });
  };

  updateChannelsList = channels => {
    const newActiveChannels = channels.filter(c => c.joinStatus);
    const newNonActiveChannels = channels.filter(c => !c.joinStatus);
    if (!this.state.activeChannels.length) {
      this.firstRender(channels);
    } else {
      if (newNonActiveChannels.length < this.state.nonActiveChannels.length) {
        for (const channel of this.state.nonActiveChannels) {
          if (!this.containsChannel(channel, newNonActiveChannels)) {
            removeNonActiveChannel(channel.id);
          }
        }
      }

      if (newActiveChannels.length < this.state.activeChannels.length) {
        for (const channel of this.state.activeChannels) {
          if (!this.containsChannel(channel, newActiveChannels)) {
            removeActiveChannel(channel.id);
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
    return null;
  };

  notification = channelId => {
    const channel = document.querySelector(`#${channelId} #notification`);
    channel.innerText = this.state.waitingMessages[channelId];
  };
}
const addGeneralChannel = (channelId, channelName) => {
  document.getElementById(
    "activeChannels"
  ).innerHTML += `<div class="group-info general active-channel" id="${channelId}">
        <button>
            <img src="imgs/baseline-lock-24px.svg" alt="default" />
        </button>
        <h4>${channelName}</h4>
        <button class="default-button">default</button>
        <span id="notification"></span>
        </div>`;
  return null;
};

let addActiveChannel = (channelId, channelName) => {
  document.getElementById("activeChannels").innerHTML += `
  <div class="group-info" id=${channelId}>
    <button type="button" onClick="leaveChannel(this)" data-id=${channelId}>
      <img
        src="imgs/baseline-remove_circle-orange-24px.svg"
        alt="settings"
      />
      </button>
    <h4>${channelName}</h4>
    <span id="notification"></span>
  </div>`;
};

let removeActiveChannel = id => {
  document.getElementById(id).remove();
};

let addNonActiveChannel = (channelId, channelName) => {
  document.getElementById(
    "nonActiveChannels"
  ).innerHTML += `<div class="group-info" id=${channelId}>
        <button type="button" onClick="joinChannel(this)" data-id=${channelId}>
        <img
            src="imgs/baseline-add_circle-green-24px.svg"
            alt="settings"
        />
        </button>
        <h4>${channelName}</h4>
        <span id="notification"></span>
    </div>`;
  return null;
};

let removeNonActiveChannel = id => {
  document.getElementById(id).remove();
};
