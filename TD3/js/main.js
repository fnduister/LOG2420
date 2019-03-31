var user = "fabrice";

let server = new ConnectionHandler(user);
server.start();

// websocket.onmessage = function(event) {
//   console.log(event.data);
//   console.log("hello bro");
// };

const leaveChannel = obj => {
  const message = new Message("onLeaveChannel", obj.dataset.id);
  server.send(message);
};

const joinChannel = obj => {
  const message = new Message("onJoinChannel", obj.dataset.id);
  server.send(message);
};
