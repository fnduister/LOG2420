var user = prompt("username");
// var user = "fabrice";
var server = new ConnectionHandler(user);
server.start();

const leaveChannel = obj => {
  event.cancelBubble = true;
  if (event.stopPropagation) event.stopPropagation();
  const message = new Message("onLeaveChannel", obj.dataset.id);
  server.send(message);
};

const changeUser = () => {
  user = prompt("change your username");
  server.clear();
  server = new ConnectionHandler(user);
  server.start();
  console.log({ server });
};

const changeCurrentChannel = channel => {
  event.cancelBubble = true;
  if (event.stopPropagation) event.stopPropagation();
  if (channel.id != server.channelObserver.currentChannelId) {
    server.send(new Message("onGetChannel", channel.id));
    server.channelObserver.setActiveChannel(channel.id);
    server.channelObserver.currentChannelId = channel.id;
  }
};

const joinChannel = obj => {
  const message = new Message("onJoinChannel", obj.dataset.id);
  server.send(message);
};

const scrollDown = () => {
  const chatZone = document.getElementById("chat-zone");
  chatZone.scrollTo(0, chatZone.scrollHeight);
};

const thumbsUp = () => {
  event.preventDefault();
  const thumbsMessage = `👍🏻`;
  server.send(
    new Message(
      "onMessage",
      server.channelObserver.currentChannelId,
      thumbsMessage,
      ""
    )
  );
  scrollDown();
};

const sendNewMessage = () => {
  event.preventDefault();
  const messageInput = document.getElementById("message-input");
  if (messageInput.value != "") {
    server.send(
      new Message(
        "onMessage",
        server.channelObserver.currentChannelId,
        messageInput.value,
        ""
      )
    );
  }
  scrollDown();
  messageInput.value = "";
};

const handleFormVisibility = () => {
  const imgToggleChannel = document.querySelector("#toggleFormVisibility img");
  const formAddChannel = document.getElementById("adding-channel");
  if (formAddChannel.style.display === "none") {
    imgToggleChannel.src = "imgs/baseline-remove-orange-24px.svg";
    formAddChannel.style.display = "flex";
  } else {
    imgToggleChannel.src = "imgs/baseline-add-white-24px.svg";
    formAddChannel.style.display = "none";
  }
};

const createChannel = formElement => {
  const newChannelName = formElement.elements[0].value;
  // const message = new Message("onCreateChannel", newChannelName);
  const message = new Message(
    "onCreateChannel",
    null,
    newChannelName,
    user,
    Date()
  );
  server.send(message);
  formElement.elements[0].value = "";
  handleFormVisibility();
  event.preventDefault();
};
