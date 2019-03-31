"use strict";
class ChannelsObserver {
  constructor() {
    this.currentChannelId = "invalid";
    this.generalChannelId = "invalid";
    this.state = { activeChannels: [], nonActiveChannels: [] };
    this.render = false;
  }

  firstRender = channels => {
    for (const channel of channels) {
      if (channel.joinStatus) {
        if (channel.name == "Général") {
          addGeneralChannel(channel.id, "Général");
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

  updateChannelsList = channels => {
    const newActiveChannels = channels.filter(c => c.joinStatus);
    const newNonActiveChannels = channels.filter(c => !c.joinStatus);
    if (!this.state.activeChannels.length) {
      console.log("first render");
      this.firstRender(channels);
    } else {
      if (newActiveChannels.length > this.state.activeChannels.length) {
        console.log({
          prev: this.state.activeChannels,
          next: newActiveChannels
        });
        console.log("adding active element");
        for (const channel of newActiveChannels) {
          if (!this.containsChannel(channel, this.state.activeChannels)) {
            console.log({ "adding this active channel: ": channel });
            addActiveChannel(channel.id, channel.name);
          }
        }
      } else {
        for (const channel of this.state.activeChannels) {
          if (!this.containsChannel(channel, newActiveChannels)) {
            console.log({ "removing this active element": channel });
            removeActiveChannel(channel.id);
          }
        }
      }

      if (newNonActiveChannels.length > this.state.nonActiveChannels.length) {
        console.log({
          prev: this.state.nonActiveChannels,
          next: newNonActiveChannels
        });
        console.log("adding NonActive element");
        for (const channel of newNonActiveChannels) {
          if (!this.containsChannel(channel, this.state.nonActiveChannels)) {
            console.log({ "adding this non active channel: ": channel });
            addNonActiveChannel(channel.id, channel.name);
          }
        }
      } else {
        console.log("removing NonActive element");
        console.log({
          prev: this.state.nonActiveChannels,
          next: newNonActiveChannels
        });
        for (const channel of this.state.nonActiveChannels) {
          if (!this.containsChannel(channel, newNonActiveChannels)) {
            console.log({ "removing this non active element": channel });
            removeNonActiveChannel(channel.id);
          }
        }
      }
    }
    this.state.activeChannels = newActiveChannels;
    this.state.nonActiveChannels = newNonActiveChannels;
    return null;
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
        </div>`;
  return null;
};

let addActiveChannel = (channelId, channelName) => {
  console.log("render active channel");
  console.log(channelId, channelName);
  const ele = document.getElementById("activeChannels");
  // ele.innerHTML += `<p> ok mec tu veux quoi</p> ${channelId} ${channelName}`;
  ele.innerHTML += `
  <div class="group-info" >
    <button type="button" onClick="leaveChannel(this)" data-id=${channelId}>
      <img
        src="imgs/baseline-remove_circle-orange-24px.svg"
        alt="settings"
      />
      </button>
    <h4>${channelName}</h4>
  </div>`;
  console.log("fin du render sans probleme");
};

let removeActiveChannel = id => {
  console.log("removing active channel");
  console.log(id);
  document.getElementById(id).remove();
};

let addNonActiveChannel = (channelId, channelName) => {
  console.log("render non active channel");
  console.log(channelId);
  const ele = document.getElementById("nonActiveChannels");
  ele.innerHTML += "yooooo";
  ele.innerHTML += `<div class="group-info" id=${channelId}>
        <button type="button" onClick="joinChannel(this)" data-id=${channelId}>
        <img
            src="imgs/baseline-add_circle-green-24px.svg"
            alt="settings"
        />
        </button>
        <h4>${channelName}</h4>
    </div>`;
  return null;
};

let removeNonActiveChannel = id => {
  console.log("removing non active channel");
  console.log(id);
  document.getElementById(id).remove();
};
