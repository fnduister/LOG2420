"use strict";

class ConnectionHandler {
  constructor(user) {
    this.user = user;
    this.isClosed = false;
    this.websocket = null;
    this.message = null;
    this.channelObserver = new ChannelsObserver();
    this.messageObserver;
  }

  dispatchEvent = event => {
    this.message = JSON.parse(event.data);
    const type = this.message["eventType"];
    switch (type) {
      case "updateChannelsList":
        console.log("updateChannelList");
        console.log(this.message);
        this.channelObserver.updateChannelsList(this.message.data);
        if (!this.channelObserver.currentChannelId) {
          this.channelObserver.currentChannelId = this.channelObserver.generalChannelId;
          this.messageObserver = new MessageObserver(
            this.user,
            this.channelObserver.currentChannelId
          );
          this.send(
            new Message("onGetChannel", this.channelObserver.currentChannelId)
          );
        }
        break;

      case "onMessage":
        console.log("onMessage");
        console.log({ message: this.message });
        if (this.channelObserver.currentChannelId == this.message.channelId) {
          this.messageObserver.addNewMessage(this.message);
        } else {
          setTimeout(
            () => this.channelObserver.saveMessage(this.message),
            1000
          );
          this.channelObserver.updateChannelWaitingMessages(
            this.message.channelId
          );
        }

        // this.channelObserver.state.activeChannels[
        //   this.message.channelId
        // ].messages.push(this.message);
        break;

      case "onCreateChannel":
        console.log("onCreateChannel");
        this.channelObserver.createChannel(this.message.data);
        break;

      case "onGetChannel":
        console.log("onGetChannel");
        
        this.messageObserver.clear();
        if ((this.channelObserver.currentChannelId = this.message.channelId))
          this.messageObserver.updateMessagesList(this.message.data, this.channelObserver.state.activeChannels.find(channel =>
            channel.id == this.channelObserver.currentChannelId).numberOfUsers);
        console.log({
          list: this.channelObserver.state.activeChannels.find(channel =>
            channel.id == this.channelObserver.currentChannelId)
        });
        break;
    }
  };

  start = async () => {
    try {
      await this.connect();
      this.websocket.onclose = () => {
        this.isClosed = true;
        alert("The connection was closed");
      };
      this.websocket.onmessage = event => {
        this.dispatchEvent(event);
      };
      this.websocket.onerror = event => {
        alert("an error appeared");
      };
      let username = document.getElementById("usernameHeader");
      username.innerText = this.user;

      // this.clear();
    } catch (err) {
      console.log({ err });
    }
  };

  send = message => {
    const JSONmessage = JSON.stringify(message);
    if (!this.isClosed) {
      this.websocket.send(JSONmessage);
    } else alert("Connection closed");
  };

  connect = () => {
    return new Promise((resolve, reject) => {
      this.websocket = new WebSocket(
        "ws://log2420-nginx.info.polymtl.ca/chatservice?username=" + user
      );
      this.websocket.onopen = () => {
        resolve(this.websocket);
      };
      server.onerror = err => {
        reject(err);
      };
    });
  };

  clear = () => {
    this.messageObserver.clear();
    this.channelObserver.clear();
  };
}
