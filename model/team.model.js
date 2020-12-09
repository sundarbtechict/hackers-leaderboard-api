var mongoose = require('mongoose');



// Setup schema
var teamSchema = mongoose.Schema({
    team_name: {
        type: String,
        required: true,
        unique: true
    },
    matches: {
        type: Number,
        default: 0
    },
    wins: {
        type: Number,
        default: 0
    },
    losses: {
        type: Number,
        default: 0
    },
    ties: {
        type: Number,
        default: 0
    },
    score: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    createdBy: {
        type: String,
        default: "Default"
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    updatetedBy: {
        type: String,
        default: "Default"
    }

});

module.exports = mongoose.model("teams", teamSchema);