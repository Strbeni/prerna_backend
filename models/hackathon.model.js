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
    }
}, { timestamps: true });

const Hackathon = mongoose.model('Hackathon', hackathonSchema);
export default Hackathon;



