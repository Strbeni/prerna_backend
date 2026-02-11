import { google } from "googleapis";
import path from "path";

const auth = new google.auth.GoogleAuth({
    keyFile: path.join(process.cwd(), "prerna-credentials.json"), // your JSON filename
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

const SPREADSHEET_ID = "1tNfyfc8GoSNB7N86jTF6WqeT3vBREXiE7wsSCM4mr38";

export const appendToSheet = async (sheetName, rowData) => {
    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: `${sheetName}!A1`,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [rowData],
            },
        });
    } catch (error) {
        console.error("Google Sheets Error:", error.message);
        throw error;
    }
};
