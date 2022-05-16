const socketMap = {};

function addSocket(uid, socket) {
	socketMap[uid] = socket;
	console.log(Object.keys(socketMap));
}

function removeSocket(uid) {
	delete socketMap[uid];
	console.log(socketMap);
}

function getUserSocket(uid) {
	// console.log(Object.keys(socketMap));
	// console.log('uid: ', uid, ' socket: ', socketMap[uid]);
	return socketMap[uid];
}

module.exports = {
	addSocket,
	removeSocket,
	getUserSocket,
};


