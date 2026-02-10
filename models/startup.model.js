import mongoose from 'mongoose';

const startupSchema = new mongoose.Schema({
    founderName: {
        type: String,
        required: true
    },
    founderEmail: {
        type: String,
        required: true,
        unique: true
    },
    founderContact: {
        type: String,
        required: true
    },
    founderAddress: {
        type: String,
        required: true
    },
    startupName: {
        type: String,
        required: true,
        unique: true
    },
    startupDescription: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Startup = mongoose.model('Startup', startupSchema);
export default Startup;
