var user = "fabrice";

let server = new ConnectionHandler(user);
server.start();

// websocket.onmessage = function(event) {
//   console.log(event.data);
//   console.log("hello bro");
// };
