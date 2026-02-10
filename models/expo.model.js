import mongoose from 'mongoose';

const expoSchema = new mongoose.Schema({
    ownerName: {
        type: String,
        required: true
    },
    ownerEmail: {
        type: String,
        required: true,
        unique: true
    },
    ownerContact: {
        type: String,
        required: true
    },
    stallName: {
        type: String,
        required: true,
        unique: true
    },
    stallCategory: {
        type: String,
        required: true
    },
    stallDescription: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Expo = mongoose.model('Expo', expoSchema);
export default Expo;
