import Expo from "../models/expo.model.js";
import transporter from "../config/nodemailer.js";
import { appendToSheet } from "../config/googlesheets.js";

async function sendEmail(ownerEmail, stallName) {
    const mailOptions = {
        from: `Prerna Expo Registration <${process.env.ADMIN_EMAIL}>`,
        to: ownerEmail,
        subject: `Prerna Expo Registration - ${stallName}`,
        html: `
        <h1>Congratulations!</h1>
        <p>Your stall <strong>${stallName}</strong> has been successfully registered for the Prerna Expo.</p>
        <p>We are excited to have you on board and look forward to showcasing your innovations at the event.</p>`
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log(`Confirmation email sent to ${ownerEmail}`);
    } catch (error) {
        console.error(`Error sending email to ${ownerEmail}:`, error);
    }
}

export const registerExpo = async (req, res) => {
    try {
        const { ownerName, ownerEmail, ownerContact, stallName, stallCategory, stallDescription } = req.body;

        if (!ownerName || !ownerEmail || !ownerContact || !stallName || !stallCategory || !stallDescription) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const nameExists = await Expo.findOne({ stallName });
        if (nameExists) {
            return res.status(400).json({ message: `Stall name "${stallName}" is already registered` });
        }
        const emailExists = await Expo.findOne({ ownerEmail });
        if (emailExists) {
            return res.status(400).json({ message: `Email "${ownerEmail}" is already registered` });
        }

        const newExpo = new Expo({
            ownerName,
            ownerEmail,
            ownerContact,
            stallName,
            stallCategory,
            stallDescription
        });
        await newExpo.save();

        // Append to Google Sheets
        const sheetRow = [
            stallName,
            ownerName,
            ownerEmail,
            ownerContact,
            stallCategory,
            stallDescription
        ];

        await appendToSheet("Expo", sheetRow);

        await sendEmail(ownerEmail, stallName);
        res.status(201).json({ message: "Expo stall registered successfully" });
    } catch (error) {
        console.error("Error registering expo stall:", error);
        res.status(500).json({ message: "Server error" });
    }
}
