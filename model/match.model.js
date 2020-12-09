var mongoose = require('mongoose');



// Setup schema
var matchSchema = mongoose.Schema({
    match_name: {
        type: String,
        required: true,
        unique: true
    },
    teams: [String, String],
    winner: {
        type: String,
        default: null
    },
    loser: {
        type: String,
        default: null
    },
    tie: {
        type: Boolean,
        default: false
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

module.exports = mongoose.model("matchs", matchSchema);