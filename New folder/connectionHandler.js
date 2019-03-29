/**
 * Class that handles the behavior depending on the type of message the websocket receives.
 */

class ConnectionHandler {
	constructor(event)
	{}
	/**
	 * Function that takes the message received by the websocket and depending on the type calls other functions.
	 * @param {AnyType} event - all the information of the message sent by the server trough the websocket 
	 */
	websocketReceive(event)
	{
		var msg = JSON.parse(event.data)
		var type = msg["eventType"];
		switch(type){
			case "onMessage":
				newMessage = true;
				messageObserver.onMessage(msg,false)
				updateReceivedMessages();
				break;
			case "updateChannelsList":
				channelObserver.updateChannelsList(msg);
				getChannel(currentChannelId, true, false);
				break;
			case "onError":
				this._onError(msg);
				break;
			case "onGetChannel":
				channelObserver.onGetChannel(msg)
				break;			
			default:
				console.log(msg);
				console.log("Event type not recognized!");
				break;
		}
	}
	/**
	 * Function called when the websocket receives a message of type onError
	 * which creates a popup displaying the type of error.
 	 * @param {AnyType} msg - all the information of the message from the websocket
 	 */
	_onError(msg)
	{
		alert(msg["data"]);
		console.log(msg);
	}
}
/**
 * Function that can multiple attributes to an element at once.
 * @param {AnyType} el - element that has to be given new attributes
 * @param {string} attrs - attributes to be added to the element
 */
function setAttributes(el, attrs)
{
    for (var key in attrs)
    {
        el.setAttribute(key, attrs[key]);
    }
}
/**
 * Function that update the value of unreadMsg.
 * */
function updateReceivedMessages(){
	var count = 0;
	for (var i of nbrOfUnreadMsg.values()){
		count += i;
	}
	document.getElementById("unreadMsgs").innerText = count;
}