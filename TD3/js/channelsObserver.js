"use strict";
class ChannelsObserver {
  constructor() {
    this.currentChannelId = "invalid";
    this.generalChannelId = "invalid";
    this.channelsIDList = [];
  }

  updateChannelsList = channels => {
    let newChannels = channels; //on sauvegarde les channels venant du serveur pour la premier visite
    if (this.channelsIDList.length) {
      //on recupere seulement les nouveaux channels
      newChannels = channels.filter(c => !this.channelsIDList.includes(c));
    }
    if (newChannels) {
      for (const channel of newChannels) {
        this.channelsIDList.push(channel.id); //on sauvegarde l'id pour etre sure de ne pas le rerender inutilement
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
    }
    console.log(this.channelsIDList);
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
        </div>`;
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
