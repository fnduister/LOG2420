"use strict";

class ConnectionHandler {
  constructor(user) {
    this.user = user;
    this.isClosed = false;
    this.websocket = null;
    this.message = null;
    this.channelObserver = new ChannelsObserver();
  }

  dispatchEvent = event => {
    this.message = JSON.parse(event.data);
    const type = this.message["eventType"];
    switch (type) {
      case "updateChannelsList":
        this.channelObserver.updateChannelsList(this.message.data);
        break;
    }
  };

  start = async () => {
    try {
      await this.connect();
      this.websocket.onclose = () => {
        this.isClosed = true;
        alert("Connection closed");
      };
      this.websocket.onmessage = event => {
        this.dispatchEvent(event);
      };
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

  handleMessage = event => {};
}
