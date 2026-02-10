import Startup from "../models/startup.model.js";
import transporter from "../config/nodemailer.js";

async function sendEmail(founderEmail, startupName) {
    const mailOptions = {
        from: `Prerna Startup Registration <${process.env.ADMIN_EMAIL}>`,
        to: founderEmail,
        subject: `Prerna Startup Registration - ${startupName}`,
        html: `
        <h1>Congratulations!</h1>
        <p>Your startup <strong>${startupName}</strong> has been successfully registered for the Prerna Startup Expo.</p>
        <p>We are excited to have you on board and look forward to seeing your innovative ideas come to life during the event.</p>`
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
        await newStartup.save();

        await sendEmail(founderEmail, startupName);
        res.status(201).json({ message: "Startup registered successfully" });
    } catch (error) {
        console.error("Error registering startup:", error);
        res.status(500).json({ message: "Server error" });
    }
}
