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
                    return val.length >= 1;
                },
                message: 'A team must have at least 1 additional member (Total 2 including leader).'
            },
            {
                validator: function (val) {
                    return val.length <= 3;
                },
                message: 'A team can have at most 3 additional members (Total 4 including leader).'
            }
        ]
    }
}, { timestamps: true });

const Hackathon = mongoose.model('Hackathon', hackathonSchema);
export default Hackathon;



