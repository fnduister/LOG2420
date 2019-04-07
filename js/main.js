var user = "fabrice";

let server = new ConnectionHandler(user);
server.start();

const leaveChannel = obj => {
  const message = new Message("onLeaveChannel", obj.dataset.id);
  server.send(message);
};

const joinChannel = obj => {
  const message = new Message("onJoinChannel", obj.dataset.id);
  server.send(message);
};

const scrollDown = () => {
  const chatZone = document.getElementById("chat-zone");
  chatZone.scrollTo(0, chatZone.scrollHeight);
};

const sendNewMessage = () => {
  event.preventDefault();
  const messageInput = document.getElementById("message-input");
  if (messageInput.value != "") {
    server.send(
      new Message(
        "onMessage",
        server.messageObserver.currentChannelId,
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
  console.log({ form: formElement.elements[0].value });
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

