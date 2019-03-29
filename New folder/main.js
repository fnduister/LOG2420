
var user = prompt("Please enter your name:");
var currentChannelId = "invalid";
var generalChannelId = "invalid";
var	websocket = new WebSocket("ws://log2420-nginx.info.polymtl.ca/chatservice?username=" + user);
var newMessage = false;
var soundSet = true;
var isClosed = false;
var nbrOfUnreadMsg = new Map();

/**Function that writes the username in the proper field under the user icon. */
function updateUsername()
{
	document.getElementById("usernameText").innerHTML = user;
}

var connection = new ConnectionHandler();

/**
 * When the websocket receives a message the data is 
 * sent over to the ConnectionHandler class to decide what to do with it.
 * @param {AnyType} event - contains the information of the message sent by the server.
 */
websocket.onmessage = function(event){
	connection.websocketReceive(event);
}

/**Function that pops up a message when the websocket's connection to the server is closed.*/
websocket.onclose = function(){
	isClosed = true;
	alert("Connection closed")
}
/**
 * Function that writes the error when there is an error with the connection between the server and the websocket.
 * @param {AnyType} event - contains the information of the message sent by the server.
 */
websocket.onerror =  function(event){
	console.log(event);
}

/**
 * Function that takes care of taking the text that the user wrote and in the field and sends 
 * it trough the websocket over to the server as a new message to be broadcasted to evreyone.
 */
function sendMessage()
{
	var text = document.getElementById("messageInput").value;
	document.getElementById("messageInput").value = "";
	if(text != ""){
		var message = new Message("onMessage", currentChannelId,text,"");
		var jSONmessage = JSON.stringify(message);
		if(!isClosed)
			websocket.send(jSONmessage);
		else
			alert("Connection closed");
	}
}

/**
 * Function that sends a request to the server to get all the messages of the channel that the client has selected if he has joined it.
 * @param {string} channelId - The Id of the channel the user wants to get the messages from.
 * @param {boolean} joined - A value to determine whether or not the client has joined the channel. 
 * @param {boolean} changed - A value to determine whether or not the user changed the channel. 
 */
function getChannel(channelId, joined, changed)
{
	if(joined){
		if(nbrOfUnreadMsg.has(channelId) && nbrOfUnreadMsg.get(channelId) > 0 && changed && channelId != currentChannelId){
			var nbr =document.getElementById("unreadMsgs").innerText;
			document.getElementById("unreadMsgs").innerText = nbr - nbrOfUnreadMsg.get(channelId);
			if(document.getElementById("unreadMsgs").innerText <0)
				document.getElementById("unreadMsgs").innerText = 0;
			nbrOfUnreadMsg.set(channelId, 0)	;
		}
		var message = new Message("onGetChannel", channelId);
		var JSONmessage = JSON.stringify(message);
		if(!isClosed)
			websocket.send(JSONmessage);
		else
			alert("Connection closed");	}
}

/**
 * Function send a message to the server that the user joins the selected server.
 * @param {string} channelId -The Id of the channel that the user wants to join.
 */
function joinChannel(channelId)
{
	var message = new Message("onJoinChannel",channelId, null, user, Date());
	var JSONmessage = JSON.stringify(message);
	nbrOfUnreadMsg.set(channelId,0);
	if(!isClosed)
		websocket.send(JSONmessage);
	else
		alert("Connection closed");
}

/**
 * Function sends a message to the server that the user leaves the selected server.
 * @param {string} channelID -The Id of the channel that the user wants to join.
 */
function leaveChannel(channelID)
{
	if(channelID == currentChannelId)
		currentChannelId = "invalid";

	var message = new Message("onLeaveChannel", channelID, null, user, Date());
	var JSONmessage = JSON.stringify(message);
	if(!isClosed)
		websocket.send(JSONmessage);
	else
		alert("Connection closed");
}

/**Function that creates a new channel with a name that the user selects after a prompt. */
function createChannel()
{
	var channelName = prompt("Please enter the channel name: ");
	var createChannelMessage = new Message("onCreateChannel", null, channelName, user, Date());
	var JSONCreateChannel = JSON.stringify(createChannelMessage);
	if(!isClosed)
		websocket.send(JSONCreateChannel);
	else
		alert("Connection closed");}

/**Function that changes the whether or not a sound plays when a new message comes in.  */
function changeSoundSetting(){
	if(soundSet)
		soundSet=false;
	else
		soundSet =true;
}