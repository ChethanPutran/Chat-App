const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const connectionSchema = new Schema(
    {
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User', required: true,
        index: true
    },
    connection_id: {
        type: String, required: true, index: true
    },
    }, { timestamps: true }
);

module.exports = mongoose.model('Connection', connectionSchema);