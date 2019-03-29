var weekDays = [ "DIM.","LUN.","MAR.", "MER.", "JEU.", "VEN.", "SAM."];


var messageObserver = {
	/**
	 * Function called when the connectionHandler has received a message of type onMessage from the websocket
	 * the function creates all the elements required to show a message from either the user or the other users 
	 * in the chat area if the message is from the channel that the user is currently on.
	 * @param {AnyType} msg -Information of the message sent by the server trough the websocket
	 * @param {boolean} calledFromGetChannel -To verify if a sound must be played
	 */
   onMessage: function(msg, calledFromGetChannel) {
		var row = document.createElement('div');
		if(currentChannelId == msg["channelId"]){
			setAttributes(row,{"class": "row"});
			var msgType = "sentMsg";
			var timeType = "dateSent";
			var name = document.createElement('div');
			if (msg["sender"] != user){
				msgType = "receivedMsg";
				timeType = "dateRcvd";
				setAttributes(name,{"class": "name"});
				name.innerText= msg["sender"];
				if(newMessage && soundSet && !calledFromGetChannel){
					var sound = new Audio("sound.mp3");
					sound.play();
					newMessage = false;
				}
			}
			var receivedMsg = document.createElement('div');
			setAttributes(receivedMsg,{"class": msgType});
			receivedMsg.innerText= msg["data"];
			
			var dateRcvd = document.createElement('div');
			setAttributes(dateRcvd,{"class": timeType});
			var time = new Date(msg["timestamp"]);
			var timeStamp = weekDays[time.getDay()] + " " + time.getDate() + ", " + time.getHours() + ":" + time.getMinutes();
			dateRcvd.innerText = timeStamp;
			
			row.appendChild(name);
			row.appendChild(receivedMsg);
			row.appendChild(dateRcvd);
			document.getElementById("chat").appendChild(row);
			var test =	document.getElementById("chat");
			test.scrollTop = test.scrollHeight;
		
    	}else{
			if (nbrOfUnreadMsg.has(msg["channelId"]) ){
				var number = nbrOfUnreadMsg.get(msg["channelId"]) + 1;
				nbrOfUnreadMsg.set(msg["channelId"],number)
			}
		}
	}
}

  
