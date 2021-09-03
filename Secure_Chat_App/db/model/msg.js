const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const msgSchema = new Schema(
    {
    sender_id: {
        type: Schema.Types.ObjectId,
        ref: 'User', required: true,
        index: true
    },
    receiver_id: {
        type: Schema.Types.ObjectId,
        ref: 'User', required: true,
        index: true
        },
    
        msg_type: {
            type: String,
            enum: MSG_TYPE,
            default: "TEXT"
        },
        msg: {
            type: String,
            required:true
        },
    }
    , { timestamps: true }
);

module.exports = mongoose.model('MSG',msgSchema);