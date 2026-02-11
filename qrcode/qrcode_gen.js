import QRCode from 'qrcode';

/**
 * Generates a QR code buffer for the given text.
 * @param {string} text - The text to encode in the QR code.
 * @returns {Promise<Buffer>} - A promise that resolves to the QR code image buffer.
 */
export const generateQRCodeBuffer = async (text) => {
    try {
        const qrBuffer = await QRCode.toBuffer(text, {
            errorCorrectionLevel: 'H',
            type: 'image/png',
            margin: 1,
            color: {
                dark: '#000000',
                light: '#ffffff'
            }
        });
        return qrBuffer;
    } catch (error) {
        console.error('QR Code Generation Error:', error);
        throw error;
    }
};

// Keeping the original default export for compatibility if needed, 
// but refactoring it to use the buffer logic.
export default async (req, res) => {
    try {
        const dataToEncode = req.body.url || 'https://google.com';
        const qrBuffer = await generateQRCodeBuffer(dataToEncode);
        
        // If the user still wants to upload to ImgBB via this endpoint:
        // (Optional: You could also just return the buffer as an image)
        res.type('image/png').send(qrBuffer);

    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: error.message });
    }
};