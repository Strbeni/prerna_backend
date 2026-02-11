import Hackathon from "../models/hackathon.model.js";
import transporter from "../config/nodemailer.js";
import { generateQRCodeBuffer } from "../qrcode/qrcode_gen.js";
import { generateTicketHTML } from "../utils/emailTemplates.js";

async function sendEmail(team) {
    const { leaderEmail, teamName, _id } = team;
    const orderId = _id.toString().toUpperCase().slice(-8);
    
    // Generate QR Code Buffer
    const qrBuffer = await generateQRCodeBuffer(`PRN-HACK-${orderId}`);

    const ticketData = {
        title: "Prerna Hackathon 2026",
        orderId: `HACK-${orderId}`,
        date: "06 March, 2026",
        time: "10:00 AM - 10:00 AM (Next Day)",
        venue: "CGC Jhanjeri, Mohali, Punjab, 140307",
        venueLink: "https://www.google.com/maps/search/?api=1&query=CGC+Jhanjeri+Mohali+Punjab+140307",
        calendarLink: "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Prerna+Hackathon+2026&dates=20260306T100000Z/20260307T100000Z&details=Prerna+Hackathon+Event+Registration&location=CGC+Jhanjeri+Mohali+Punjab+140307",
        headerImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        typeLabel: "Hackathon"
    };

    const mailOptions = {
        from: `Prerna Hackathon <${process.env.ADMIN_EMAIL}>`,
        to: leaderEmail,
        subject: `Registration Confirmed - Prerna Hackathon 2026`,
        html: generateTicketHTML(ticketData),
        attachments: [
            {
                filename: 'qrcode.png',
                content: qrBuffer,
                cid: 'qrcode' // same cid as in the html img src
            }
        ]
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Confirmation email sent to ${leaderEmail}`);
    } catch (error) {
        console.error(`Error sending email to ${leaderEmail}:`, error);
    }
}

export const registerTeam = async (req, res) => {
    try {
        const { teamName, leaderName, leaderEmail, leaderContact, collegeName, members } = req.body;
        if (!teamName || !leaderName || !leaderEmail || !leaderContact || !collegeName || !members) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Validate members array (min 2, max 4)
        if (!Array.isArray(members) || members.length < 2) {
            return res.status(400).json({ message: "At least 2 team members are required" });
        }
        if (members.length > 4) {
            return res.status(400).json({ message: "Maximum 4 team members are allowed" });
        }

        for (const member of members) {
            if (!member.name || !member.email || !member.contact) {
                return res.status(400).json({ message: "All member fields (name, email, contact) are required" });
            }
        }

        const teamExists = await Hackathon.findOne({ $or: [{ teamName }, { leaderEmail }] });
        if (teamExists) {
            return res.status(400).json({ message: "Team name or leader email already exists" });
        }
        
        const newTeam = new Hackathon({
            teamName,
            leaderName,
            leaderEmail,
            leaderContact,
            collegeName,
            members
        });
        
        const savedTeam = await newTeam.save();

        // Pass the savedTeam to include the _id for the ticket
        await sendEmail(savedTeam);
        
        res.status(201).json({ message: "Team registered successfully" });
    } catch (error) {
        console.error("Error registering team:", error);
        res.status(500).json({ message: "Server error" });
    }
}
