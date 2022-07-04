const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {
	userJoin,
	getCurrentUser,
	userLeave,
	getRoomUsers
} = require("./utils/users");
const manager = require("./db/manager");
const moment = require("moment");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

const botName = "RealtimeChat Bot";

// Run when client connects
io.on("connection", socket => {
	socket.on("getRooms", () => {
		manager.getRooms().then(rooms => {
			socket.emit("getRooms", rooms && rooms.length > 0 ? rooms : []);
		});
	});

	socket.on("addRoom", d => {
		let obj = {
			name: d.name,
			time: moment().format()
		};
		manager.addRoom(obj).then(() => {
			manager.addLog(`Room "${d.name}" is added.`);
			manager.getRooms().then(rooms => {
				io.sockets.emit(
					"getRooms",
					rooms && rooms.length > 0 ? rooms : []
				);
			});
		});
	});

	socket.on("deleteRoom", data => {
		manager.addLog(`Room "${data.room}" is deleted.`);
		manager.deleteRoom(data).then(() => {});
	});

	socket.on("joinRoom", ({ username, room }) => {
		manager.addLog(`User "${username}" has joined the room "${room}".`);
		const user = userJoin(socket.id, username, room);

		socket.join(user.room);

		// Welcome current user
		socket.emit(
			"message",
			formatMessage(botName, "Welcome to RealtimeChat!")
		);

		// Broadcast when a user connects
		socket.broadcast
			.to(user.room)
			.emit(
				"message",
				formatMessage(botName, `${user.username} has joined the chat`)
			);

		manager.getRoomMessages(room).then(messages => {
			// Send users and room info
			io.to(user.room).emit("roomUsers", {
				room: user.room,
				users: getRoomUsers(user.room),
				messages: messages
			});
		});
	});

	// Listen for chatMessage
	socket.on("chatMessage", obj => {
		const user = getCurrentUser(socket.id);

		manager.addLog(
			`User "${user.username}" has sent message "${obj.text}" int the room "${obj.room}".`
		);
		manager.addMessage({
			username: user.username,
			text: obj.text,
			room: obj.room,
			time: moment().format()
		});
		io.to(user.room).emit(
			"message",
			formatMessage(user.username, obj.text)
		);
	});

	// Runs when client disconnects
	socket.on("disconnect", () => {
		const user = userLeave(socket.id);

		if (user) {
			manager.addLog(
				`User "${user.username}" has left the room "${user.room}".`
			);
			io.to(user.room).emit(
				"message",
				formatMessage(botName, `${user.username} has left the chat`)
			);

			// Send users and room info
			io.to(user.room).emit("roomUsers", {
				room: user.room,
				users: getRoomUsers(user.room)
			});
		}
	});
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
