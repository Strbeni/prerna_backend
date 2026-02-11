import Hackathon from "../models/hackathon.model.js";
import transporter from "../config/nodemailer.js";
import { appendToSheet } from "../config/googlesheets.js";
async function sendEmail(leaderEmail) {
    const mailOptions = {
        from: `Prerna Hackathon <${process.env.ADMIN_EMAIL}>`,
        to: leaderEmail,
        subject: `Prerna Hackathon Registration`,
        html: `
        <h1>Congratulations!</h1>
        <p>Your team has been successfully registered for the Prerna Hackathon.</p>
        <p>We are excited to have you on board and look forward to seeing your innovative ideas come to life during the event.</p>`

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

        // Validate members array (min 1 additional member, max 3)
        if (!Array.isArray(members) || members.length < 1) {
            return res.status(400).json({ message: "At least 1 additional team member is required" });
        }
        if (members.length > 3) {
            return res.status(400).json({ message: "Maximum 3 additional team members are allowed (Total 4 including leader)" });
        }

        for (const member of members) {
            if (!member.name || !member.email || !member.contact) {
                return res.status(400).json({ message: "All member fields (name, email, contact) are required" });
            }
        }

        const nameExists = await Hackathon.findOne({ teamName });
        if (nameExists) {
            return res.status(400).json({ message: `Team name "${teamName}" already exists` });
        }
        const emailExists = await Hackathon.findOne({ leaderEmail });
        if (emailExists) {
            return res.status(400).json({ message: `Leader email "${leaderEmail}" is already registered` });
        }
        const newTeam = new Hackathon({
            teamName,
            leaderName,
            leaderEmail,
            leaderContact,
            collegeName,
            members
        });
        await newTeam.save();

        // Append to Google Sheets
        // Total team size = Leader (1) + members.length
        const totalTeamSize = members.length + 1;

        // Pad members to 3 additional slots so columns G-O always align (Member 2, 3, 4)
        const paddedMembers = [...members];
        while (paddedMembers.length < 3) {
            paddedMembers.push({ name: "", email: "", contact: "" });
        }

        const sheetRow = [
            teamName,
            leaderName,
            collegeName,
            totalTeamSize.toString(),
            leaderEmail,
            leaderContact,
            ...paddedMembers.flatMap(m => [m.name, m.email, m.contact])
        ];

        await appendToSheet("Hackathon", sheetRow);

        await sendEmail(leaderEmail);
        res.status(201).json({ message: "Team registered successfully" });
    } catch (error) {
        console.error("Error registering team:", error);
        res.status(500).json({ message: "Server error" });
    }
}
