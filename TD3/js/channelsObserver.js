"use strict";
class ChannelsObserver {
  constructor() {
    this.currentChannelId = "invalid";
    this.generalChannelId = "invalid";
    this.channelsIDList = [];
  }

  updateChannelsList = channels => {
      console.log({ channels });
      if()
    const newChannels = channels.filter(c => !channelsIDList.includes(c));
    for (const channel of channels) {
      if (channel.joinStatus) {
        addGeneralChannel(channel.id, channel.name);
      } else {
        addNonActiveChannel(channel.id, channel.name);
      }
    }
    return null;
  };
}

const addGeneralChannel = (channelId, channelName) => {
  document.getElementById(
    "activeChannels"
  ).innerHTML += `<div class="group-info general active-channel">
        <button>
            <img src="imgs/baseline-lock-24px.svg" alt="default" />
        </button>
        <h4>${channelName}</h4>
        <button class="default-button">default</button>
        </div>`;
  return null;
};

const addActiveChannel = (channelId, channelName) => {
  document.getElementById(
    "activeChannels"
  ).innerHTML += `<div class="group-info" id=${channelId}>
        <button>
              <img
                src="imgs/baseline-remove_circle-orange-24px.svg"
                alt="settings"
              />
        </button>
        <h4>${channelName}</h4>
        </div>
    <div class="group-info">`;
  return null;
};

const addNonActiveChannel = (channelId, channelName) => {
  document.getElementById(
    "nonActiveChannels"
  ).innerHTML += `<div class="group-info" id=${channelId}>
        <button>
        <img
            src="imgs/baseline-add_circle-green-24px.svg"
            alt="settings"
        />
        </button>
        <h4>${channelName}</h4>
    </div>`;
  return null;
};
