export const generateTicketHTML = ({
    title,
    orderId,
    date,
    time,
    venue,
    venueLink,
    calendarLink,
    headerImage,
    typeLabel
}) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title} Ticket</title>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&display=swap" rel="stylesheet">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Outfit', sans-serif; background-color: #f0f2f5;">
        <div style="max-width: 450px; margin: 40px auto; padding: 0 20px;">
            <div style="background-color: #ffffff; border-radius: 30px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15); border: 1px solid #e2e8f0;">
                
                <!-- Header Image with Overlay -->
                <div style="position: relative; height: 200px;">
                    <img src="${headerImage}" alt="Banner" style="width: 100%; height: 100%; object-fit: cover;">
                    <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(0,0,0,0.7)); padding: 20px;">
                        <span style="background-color: #4f46e5; color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">${typeLabel}</span>
                    </div>
                </div>

                <!-- Main Content -->
                <div style="padding: 30px; text-align: center;">
                    <div style="color: #64748b; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px;">PRERNA PRESENTS</div>
                    <div style="color: #1e293b; font-size: 28px; font-weight: 800; line-height: 1.2; margin-bottom: 25px;">${title}</div>

                    <!-- Info Grid -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; text-align: left; margin-bottom: 30px;">
                        <div style="background-color: #f8fafc; padding: 15px; border-radius: 16px; border: 1px solid #f1f5f9;">
                            <div style="color: #94a3b8; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Date</div>
                            <div style="color: #334155; font-size: 15px; font-weight: 700;">${date}</div>
                        </div>
                        <div style="background-color: #f8fafc; padding: 15px; border-radius: 16px; border: 1px solid #f1f5f9;">
                            <div style="color: #94a3b8; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Time</div>
                            <div style="color: #334155; font-size: 15px; font-weight: 700;">${time}</div>
                        </div>
                    </div>

                    <div style="background-color: #f8fafc; padding: 15px; border-radius: 16px; border: 1px solid #f1f5f9; text-align: left; margin-bottom: 30px;">
                        <div style="color: #94a3b8; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Venue</div>
                        <div style="color: #334155; font-size: 15px; font-weight: 700; line-height: 1.5;">${venue}</div>
                    </div>

                    <!-- Integration Buttons -->
                    <div style="display: flex; gap: 10px; margin-bottom: 30px; justify-content: center;">
                        <a href="${calendarLink}" style="display: inline-flex; align-items: center; background-color: #4f46e5; color: white; padding: 12px 20px; border-radius: 12px; text-decoration: none; font-size: 14px; font-weight: 600; transition: background 0.2s;">
                            <img src="https://cdn-icons-png.flaticon.com/512/2665/2665181.png" width="18" style="margin-right: 8px; filter: brightness(0) invert(1);">
                            Add to Calendar
                        </a>
                        <a href="${venueLink}" style="display: inline-flex; align-items: center; background-color: #ffffff; color: #4f46e5; padding: 12px 20px; border-radius: 12px; text-decoration: none; font-size: 14px; font-weight: 600; border: 2px solid #4f46e5;">
                            <img src="https://cdn-icons-png.flaticon.com/512/854/854878.png" width="18" style="margin-right: 8px;">
                            View Map
                        </a>
                    </div>

                    <!-- Perforation -->
                    <div style="position: relative; height: 2px; border-top: 2px dashed #e2e8f0; margin: 10px -30px 40px -30px;">
                        <div style="position: absolute; left: -10px; top: -11px; width: 22px; height: 22px; background-color: #f0f2f5; border-radius: 50%; border-right: 1px solid #e2e8f0;"></div>
                        <div style="position: absolute; right: -10px; top: -11px; width: 22px; height: 22px; background-color: #f0f2f5; border-radius: 50%; border-left: 1px solid #e2e8f0;"></div>
                    </div>

                    <!-- QR Section -->
                    <div style="background-color: #f8fafc; padding: 25px; border-radius: 20px; border: 2px solid #e2e8f0;">
                         <div style="color: #94a3b8; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px;">Scan to Verify Registration</div>
                        <div style="background-color: #ffffff; padding: 15px; border-radius: 15px; display: inline-block; margin-bottom: 15px;">
                            <img src="cid:qrcode" alt="QR Code" style="width: 150px; height: 150px; display: block;">
                        </div>
                        <div style="color: #334155; font-size: 13px; font-weight: 700; background-color: #f1f5f9; padding: 8px 16px; border-radius: 8px; display: inline-block;">
                            ID: PRN-${orderId}
                        </div>
                    </div>
                </div>

                <div style="background-color: #1e293b; padding: 20px; text-align: center;">
                    <div style="color: #ffffff; font-size: 12px; font-weight: 500; opacity: 0.8; letter-spacing: 0.5px;">PLEASE BRING A PRINTED COPY OR SHOW THIS ON YOUR PHONE</div>
                </div>
            </div>

            <div style="text-align: center; margin-top: 30px;">
                <p style="color: #64748b; font-size: 14px;">Need help? <a href="mailto:support@venturenest.cgcuniversity.in" style="color: #4f46e5; text-decoration: none; font-weight: 600;">Contact Support</a></p>
                <div style="font-size: 12px; color: #94a3b8; margin-top: 20px;">
                    © 2026 Prerna. All rights reserved.<br>
                    CGC Jhanjeri, Mohali, Punjab
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
};
