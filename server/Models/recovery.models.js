const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecoverySchema = new Schema({
    ip: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date(),
        expires: 3600
    }
}, {
    timestamps: true
})

const Recovery = mongoose.model("Recovery", RecoverySchema);

module.exports = Recovery;