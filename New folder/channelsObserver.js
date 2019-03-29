
var channelObserver = {
  /**
   * Function called when the connectionHandler receives a message of type updateChannelsList from the websocket
   * the function creates all the elements required to create the list of channels in the proper location 
   * along with the proper behavior for when one is clicked. 
   * @param {AnyType} msg -Information of the message sent by the server trough the websocket
   */
   updateChannelsList: function(msg) {
    var myNode = document.getElementById("channels");
    while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
    }
    var channels = msg.data;
    for (var i in channels) {
      var channel = document.createElement('div');
      setAttributes(channel,{"onclick": "getChannel('"+channels[i]["id"]+"',"+channels[i]["joinStatus"]+","+true+")"});
      if(i%2 == 0)
      {
        setAttributes(channel,{"class": "chatEvenChannelBoard"});
      }else
      {
        setAttributes(channel,{"class": "chatOddChannelBoard"});
      }
      var channelIcon = document.createElement('div');
      setAttributes(channelIcon,{"class": "channelIconBox", "onclick": "joinChannel('"+channels[i]["id"]+"')"});
      var iconType = "fas fa-plus";
      var name = channels[i]["name"];

      if(name  == "Général"){
        nbrOfUnreadMsg.set(channels[i]["id"],0);
        iconType = "fas fa-star";
        generalChannelId = channels[i]["id"];
        if(currentChannelId == "invalid")
          currentChannelId = channels[i]["id"];
      }
      else if(channels[i]["joinStatus"]){
        iconType = "fas fa-minus";
        setAttributes(channelIcon, {"onclick": "leaveChannel('"+channels[i]["id"]+"')" })
      }
      var Icon = document.createElement('i');
      if(iconType == "fas fa-plus")
      {
        setAttributes(Icon, {"style": "color: #5F9EA0"});
      }
      setAttributes(Icon,{"class": iconType});
      var channelName = document.createElement('p');
      channelName.innerText = name; 
      channelIcon.appendChild(Icon);
      channel.appendChild(channelIcon);
      channel.appendChild(channelName);
      if(name == "Général")
      {
        var defaultBubble = document.createElement('div');
        setAttributes(defaultBubble,{"class": "generalChatDefaultBox"});
        defaultBubble.innerText = "default";
        channel.appendChild(defaultBubble);
      }
      document.getElementById("channels").appendChild(channel);
      document.getElementsByClassName("channelIconBox")[0].removeAttribute("onclick");
  }
}
,
/**
 * Function is called when the connection handler received a message of type onGetChannel by the websocket
 * the function clears the chat section and then shows all the messages contained in the selected channel.
 * @param {AnyType} msg -Information of the message sent by the server trough the websocket
 */
  onGetChannel : function(msg){
    var myNode = document.getElementById("chat");
    currentChannelId = msg["data"]["id"]
    while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
    }
    var messages = msg.data["messages"];
    for (var i in messages) {
      messageObserver.onMessage(messages[i],true);
    }
    document.getElementById("groupeActif").innerHTML = msg["data"]["name"];
  }
}
