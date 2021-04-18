const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        unique: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: false
    },
    image: {
        type: Array,
        required: false
    },
    link: {
        type: String,
        required: false
    },
    subdogeit: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const Subdogeit = mongoose.model("Post", PostSchema);

module.exports = Subdogeit;