import Startup from "../models/startup.model.js";
import transporter from "../config/nodemailer.js";
import { generateQRCodeBuffer } from "../qrcode/qrcode_gen.js";
import { generateTicketHTML } from "../utils/emailTemplates.js";

async function sendEmail(startup) {
    const { founderEmail, startupName, _id } = startup;
    const orderId = _id.toString().toUpperCase().slice(-8);

    // Generate QR Code Buffer
    const qrBuffer = await generateQRCodeBuffer(`PRN-STARTUP-${orderId}`);

    const ticketData = {
        title: "Prerna Startup Expo 2026",
        orderId: `STRT-${orderId}`,
        date: "06 March, 2026",
        time: "10:00 AM - 06:00 PM",
        venue: "CGC Jhanjeri, Mohali, Punjab, 140307",
        venueLink: "https://www.google.com/maps/search/?api=1&query=CGC+Jhanjeri+Mohali+Punjab+140307",
        calendarLink: "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Prerna+Startup+Expo+2026&dates=20260306T100000Z/20260306T180000Z&details=Prerna+Startup+Registration+-+${startupName}&location=CGC+Jhanjeri+Mohali+Punjab+140307",
        headerImage: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        typeLabel: "Startup Expo"
    };

    const mailOptions = {
        from: `Prerna Startup Registration <${process.env.ADMIN_EMAIL}>`,
        to: founderEmail,
        subject: `Startup Registration Confirmed - ${startupName}`,
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
        console.log(`Confirmation email sent to ${founderEmail}`);
    } catch (error) {
        console.error(`Error sending email to ${founderEmail}:`, error);
    }
}

export const registerStartup = async (req, res) => {
    try {
        const { founderName, founderEmail, founderContact, founderAddress, startupName, startupDescription } = req.body;

        if (!founderName || !founderEmail || !founderContact || !founderAddress || !startupName || !startupDescription) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const exists = await Startup.findOne({ $or: [{ startupName }, { founderEmail }] });
        if (exists) {
            return res.status(400).json({ message: "Startup name or founder email already registered" });
        }

        const newStartup = new Startup({
            founderName,
            founderEmail,
            founderContact,
            founderAddress,
            startupName,
            startupDescription
        });
        const savedStartup = await newStartup.save();

        await sendEmail(savedStartup);
        res.status(201).json({ message: "Startup registered successfully" });
    } catch (error) {
        console.error("Error registering startup:", error);
        res.status(500).json({ message: "Server error" });
    }
}
