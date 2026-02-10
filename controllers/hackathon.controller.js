import Hackathon from "../models/hackathon.model.js";
import transporter from "../config/nodemailer.js";

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
        return res.json({ message: "Team registered but failed to send confirmation email" });
    }

}




export const registerTeam = async (req, res) => {
    try {
        const { teamName, leaderName, leaderEmail, leaderContact, collegeName, members } = req.body;
        if (!teamName || !leaderName || !leaderEmail || !leaderContact || !collegeName || !members) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Validate members array
        if (!Array.isArray(members) || members.length === 0) {
            return res.status(400).json({ message: "At least one team member is required" });
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
        await newTeam.save();

        await sendEmail(leaderEmail);
        res.status(201).json({ message: "Team registered successfully" });
    } catch (error) {
        console.error("Error registering team:", error);
        res.status(500).json({ message: "Server error" });
    }
}
