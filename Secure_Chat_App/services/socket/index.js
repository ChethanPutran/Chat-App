const passportSocketTo = require('passport.socketio');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const MSG = require('../../db/model/msg');
const Connection = require('../../db/model/connection');

/**
 * @param {user} containes all info of authenticated user
 * @param {id} socket connection id
 * @returns JSON object @success,@status
 */

const insertSocketConnection = async (user, id) => {
    try {
        const connection = await Connection.updateOne(
            { user_id: user._id },
            { $set: { user_id: user._id, connection_id: id } },
            { upsert: true },
        );

        return {
            success: true,
            status: 200,
        };
    } catch (err) {
        return {
            success: false,
            status: 500,
            err: new Error("Connection could not be created!"),
        };
    }
}
const deletSocketConnection = async (id) => {
    try {
        const connection = await Connection.deletOne({ connection_id: id });
        return {
            success: true,
            status: 200,
        };
    } catch (err) {
        return {
            success: false,
            status: 500,
            err: new Error("Connection could not be deleted!"),
        };
    }
    
}
    /**
     * @param {sender_id,reciever_id,msg} stores msg
     * @returns JSON object @success,@status
     */

const insertMSG = async (sender_id, reciever_id,msg) => {
    try {
        const newMSG = MSG.create({
            sender_id: sender_id,
            reciever_id: reciever_id,
            msg: msg,
        });
        return {
            success: true,
            status: 200,
        };
    } catch (err) {
        return {
            success: false,
            status: 500,
            err: new Error("Connection could not be deleted!"),
        };
    }
}
/**
     * @param {user_id} in connection
     * @returns JSON object @socket_id for connection
     */

const getSocketID = async (user_id) => { };

const socketIO = (io) => {
    let response;
    io.use(passportSocketTo.authorize({
        key: 'secure-chat-app',
        secret: 'secure-chat-app',
        store: new MongoStore({ url: process.env.DATABASE_URI }),
    }));

    io.use((socket, next) => {
        if (socket.request.user) {
            next();
        } else {
            next(new Error('unauthorizeed!'));
        }
    });

    io.on('connection', async (socket) => {
        /**
         * @current_user is current logged in user
         * @id is socket.id
         */

        const current_user = socket.request.user;
        const id = socket.id;

        response = await insertSocketConnection(current_user, id);
        console.log('SERVER_SIDE: user connected', id, current_user.user_name);

        /**
         * @sending to client
         * and send info for new coonection to other users 
         * this below function will emit info about new connected to all connected users
         */

        io.emit('user_connect', current_user);

        /**
         * @listening from client
         * recieves new MSG and emit to user
         */

        socket.on('SENT_MSG', async (to_user_id, msg, MSG_ACK) => {
            try {

                const socket_id = await getSocketID(to_user_id);
                const newMSG = await insertMSG(current_user._id, to_user_id, msg);

                MSG(newMSG.success);
              
                io.to(socket_id.connection_id).emit('DELIVER_MSG', msg);
            } catch (err) {
                throw new err();
                
            }
        });

        socket.on('disconnect', async () => {
            //Updating connection DATABASE_URI
            response = await deletSocketConnection(id);
            console.log('SERVER_SIDE : user disconnected', id, current_user.user_name);

            /**
             * @sending to client
             * user with @id = user._id is disconnected
             */

            io.emit('user_disconnect', current_user._id);
        });
    });
};

module.exports = socketIO;
