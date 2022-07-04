const db = require("./database");
const moment = require("moment");

const Manager = {
	addUser: async data => {
		return new Promise((resolve, reject) => {
			const sql = `INSERT INTO users (id, username, room) VALUES ('${data.id}', '${data.username}', '${data.room}');`;
			const params = [];
			db.get(sql, params, error => {
				console.log(`New user ${data.username} added in database.`);
				resolve();
			});
		});
	},

	addMessage: async data => {
		return new Promise((resolve, reject) => {
			const sql = `INSERT INTO messages (username, text, room, time) VALUES ('${data.username}', '${data.text}', '${data.room}', '${data.time}');`;
			const params = [];
			db.get(sql, params, error => {
				console.log(`New message "${data.text}" added in database.`);
				resolve();
			});
		});
	},

	getRoomMessages: async room => {
		return new Promise((resolve, reject) => {
			const sql = `SELECT * FROM messages WHERE room='${room.trim()}';`;
			const params = [];
			db.all(sql, params, (error, rows) => {
				resolve(rows);
			});
		});
	},

	getRooms: async () => {
		return new Promise((resolve, reject) => {
			const sql = `SELECT * FROM rooms;`;
			const params = [];
			db.all(sql, params, (error, rows) => {
				resolve(rows);
			});
		});
	},

	addRoom: async data => {
		return new Promise((resolve, reject) => {
			const sql = `INSERT INTO rooms (name, time) VALUES ('${data.name}', '${data.time}');`;
			const params = [];
			db.get(sql, params, error => {
				console.log(`New room "${data.name}" added in database.`);
				resolve();
			});
		});
	},

	deleteRoom: async data => {
		return new Promise((resolve, reject) => {
			let sql = `DELETE FROM rooms WHERE name='${data.room}';`;
			let params = [];
			db.get(sql, params, error => {
				console.log(`Deleted room "${data.room}" from database.`);
			});

			sql = `DELETE FROM messages WHERE room='${data.room}';`;
			params = [];
			db.get(sql, params, error => {
				console.log(
					`Deleted all messages for room "${data.room}" from database.`
				);
				resolve();
			});
		});
	},

	addLog: async text => {
		return new Promise((resolve, reject) => {
			let t = moment().format();
			const sql = `INSERT INTO logs (text, time) VALUES ('${text}', '${t}');`;
			const params = [];
			db.get(sql, params, error => {
				resolve();
			});
		});
	}
};

module.exports = Manager;
