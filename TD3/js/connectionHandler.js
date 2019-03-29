"use strict";

class ConnectionHandler {
  constructor(user) {
    this.user = user;
    this.currentChannelId = "invalid";
    this.generalChannelId = "invalid";
    this.isClosed = false;
    this.websocket = null;
  }

  start = async () => {
    try {
      await this.connect();
      this.websocket.onmessage = event => {
        console.log(event.data);
      };
    } catch (err) {
      console.log({ err });
    }
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

  handleMessage = (event) => {};
}
