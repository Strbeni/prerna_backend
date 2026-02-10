import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    }
}, { _id: false });

const hackathonSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: true,
        unique: true
    },
    leaderName: {
        type: String,
        required: true
    },
    leaderEmail: {
        type: String,
        required: true,
        unique: true
    },
    leaderContact: {
        type: String,
        required: true
    },
    collegeName: {
        type: String,
        required: true
    },
    members: {
        type: [memberSchema],
        required: true,
        validate: [
            {
                validator: function (val) {
                    return val.length >= 2;
                },
                message: 'A team must have at least 2 members.'
            },
            {
                validator: function (val) {
                    return val.length <= 4;
                },
                message: 'A team can have at most 4 members.'
            }
        ]
    }
}, { timestamps: true });

const Hackathon = mongoose.model('Hackathon', hackathonSchema);
export default Hackathon;



