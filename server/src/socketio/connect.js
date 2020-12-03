import SocketIO from 'socket.io';
import UUID from 'uuid/v1';
import ManageToken from '../middleware/protection/ManageToken';
import ChatRoomSchema from '../models/Chat/ChatRoom';
import ChatReportSchema from '../models/Chat/ChatReport';

export default class SocketIOServer {

    constructor() {

    }

    init(io) {
        io.use((socket, next) => {
            let app_name = socket.handshake.query.app_name;
            let api_key = socket.handshake.query.api_key;

            let token = socket.handshake.query.token;
            let token_decrypted = new ManageToken().decryptToken(token);
            let token_verify = new ManageToken().verifyToken(token_decrypted);
            if(app_name == 'fr.mwactu.application' || app_name == 'com.mwactudev') {
                if(api_key == __config.http.key) {
                    if (token_verify !== 'error') {
                        return next();
                    } else {
                        return next(new Error('Authentification impossible: Code 3'));
                    }
                } else {
                    return next(new Error('Authentification impossible: Code 2'));
                }
            } else {
                return next(new Error('Authentification impossible: Code 1'));
            }
          });

        var list_users_connect = [];

        io.sockets.on('connection', (socket) => {

            socket.on('connect', (data) => {
                console.log('connected')
            })

            socket.on('login', (data) => {
                let token = socket.handshake.query.token;
                let token_decrypted = new ManageToken().decryptToken(token);
                let token_verify = new ManageToken().verifyToken(token_decrypted);

                const d = {
                    id: UUID(),
                    displayUsername: token_verify.data.displayUsername
                }

                list_users_connect.push(d)
            });

            socket.on('disconnect', (data) => {
                console.log('user is disconnected' );
                //socket.disconnect();
            });

            socket.on('report user', (data) => {
                let token = socket.handshake.query.token;
                let token_decrypted = new ManageToken().decryptToken(token);
                let token_verify = new ManageToken().verifyToken(token_decrypted);

                const d = {
                    message_id: data.message_id,
                    text: data.text,
                    user_id: token_verify.data.id,
                    user_report: data.username,
                    created_at: new Date(Date.now())
                }
                ChatReportSchema.create(d, function(err, reported) {
                    if(err) {
                        console.log(err);
                    } else {
                        
                    }
                })
            });

            socket.on('clean chat', () => {
                let token = socket.handshake.query.token;
                let token_decrypted = new ManageToken().decryptToken(token);
                let token_verify = new ManageToken().verifyToken(token_decrypted);

                if(token_verify.data.username == 'arwantys') {
                    ChatRoomSchema.deleteMany({}, (err, result) => {
                        if(err) {
                            console.log(err)
                        } else {
                            console.log('all delete')
                        }
                    })
                    io.emit('clean chat')
                }
            });

            socket.on('delete specific message', (data) => {
                let token = socket.handshake.query.token;
                let token_decrypted = new ManageToken().decryptToken(token);
                let token_verify = new ManageToken().verifyToken(token_decrypted);

                if(token_verify.data.username == 'arwantys') {
                    ChatRoomSchema.deleteOne({message_id: data}, (err, result) => {
                        if(err) {
                            console.log(err)
                        } else {
                            console.log('specific delete')
                            io.emit('delete specific message', data);
                        }
                    })
                }
            })

            socket.on('friend request user', (data) => {
                console.log(data);
            });

            socket.on('load message', () => {
                console.log('load message')
                let token = socket.handshake.query.token;
                let token_decrypted = new ManageToken().decryptToken(token);
                let token_verify = new ManageToken().verifyToken(token_decrypted);

                ChatRoomSchema.aggregate([
                    { $sort : { created_at : 1 } },
                    { $limit : 50 },
                    {
                        "$lookup": {
                            "from": "accounts",
                            "localField": "user_id",
                            "foreignField": "_id",
                            "as": "user"
                        },
                    }
                ], function(err, docs) {
                    if(err) {
                        console.log(err)
                    } else {
                        console.log('emit')
                        socket.emit('load message', docs)
                    }
                })
            })

            socket.on('chat message', (data) => {
                let token = socket.handshake.query.token;
                let token_decrypted = new ManageToken().decryptToken(token);
                let token_verify = new ManageToken().verifyToken(token_decrypted);
                const datenow = new Date(Date.now());
                const data_send = {
                    id: data.id,
                    text: data.message,
                    createdAt: datenow,
                    user: {
                        id: token_verify.data.id,
                        username: token_verify.data.username,
                        pseudonyme: token_verify.data.displayUsername,
                        avatar: token_verify.data.avatar
                    }
                };

                const data_store = {
                    message_id: data.id,
                    text: data.message,
                    user_id: token_verify.data.id,
                    created_at: datenow
                }

                ChatRoomSchema.create(data_store, function(err, created) {
                    if(err) {
                        console.log(err)
                    } else {
                        socket.broadcast.emit('chat receive', data_send);
                    }
                });
            });
			 
		});
    }

}