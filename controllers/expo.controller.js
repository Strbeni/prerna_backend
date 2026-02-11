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
import { generateQRCodeBuffer } from "../qrcode/qrcode_gen.js";
import { generateTicketHTML } from "../utils/emailTemplates.js";

async function sendEmail(expo) {
    const { ownerEmail, stallName, _id } = expo;
    const orderId = _id.toString().toUpperCase().slice(-8);

    // Generate QR Code Buffer
    const qrBuffer = await generateQRCodeBuffer(`PRN-EXPO-${orderId}`);

    const ticketData = {
        title: "Prerna Expo 2026",
        orderId: `EXPO-${orderId}`,
        date: "06 March, 2026",
        time: "10:00 AM - 06:00 PM",
        venue: "CGC Jhanjeri, Mohali, Punjab, 140307",
        venueLink: "https://www.google.com/maps/search/?api=1&query=CGC+Jhanjeri+Mohali+Punjab+140307",
        calendarLink: "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Prerna+Expo+2026&dates=20260306T100000Z/20260306T180000Z&details=Prerna+Expo+Registration+-+Stall:+${stallName}&location=CGC+Jhanjeri+Mohali+Punjab+140307",
        headerImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        typeLabel: "Expo Stall"
    };

    const mailOptions = {
        from: `Prerna Expo Registration <${process.env.ADMIN_EMAIL}>`,
        to: ownerEmail,
        subject: `Stall Registration Confirmed - ${stallName}`,
        html: generateTicketHTML(ticketData),
        attachments: [
            {
                filename: 'qrcode.png',
                content: qrBuffer,
                cid: 'qrcode'
            }
        ]
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

        const exists = await Expo.findOne({ $or: [{ stallName }, { ownerEmail }] });
        if (exists) {
            return res.status(400).json({ message: "Stall name or owner email already registered" });
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
        const savedExpo = await newExpo.save();

        await sendEmail(savedExpo);
        res.status(201).json({ message: "Expo stall registered successfully" });
    } catch (error) {
        console.error("Error registering expo stall:", error);
        res.status(500).json({ message: "Server error" });
    }
}
