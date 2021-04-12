const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubdogeitSchema = new Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    admin: [Schema.Types.ObjectId],
    dogeitors: [Schema.Types.ObjectId],
    community_type: {
        type: String,
        reqired: true
    }
}, {
    timestamps: true
})

const Subdogeit = mongoose.model("Subdogeit", SubdogeitSchema);

module.exports = Subdogeit;