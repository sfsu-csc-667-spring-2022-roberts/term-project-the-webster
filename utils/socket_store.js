const socketMap = {};

function addSocket(uid, socket) {
	socketMap[uid] = socket;
	console.log(Object.keys(socketMap));
}

function removeSocket(uid) {
	delete socketMap[uid];
	console.log(socketMap);
}


module.exports = {
	addSocket,
	removeSocket,

};


