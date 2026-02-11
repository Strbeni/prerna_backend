import QRCode from 'qrcode';

export default qrcode_gen = async (req,res)=>{

    const dataToEncode = 'https://www.nodejs.org'; 
    const filePath = 'my_qrcode.png';

    QRCode.toFile(filePath, dataToEncode, {
    errorCorrectionLevel: 'H'
    }, (err) => {
    if (err) throw err;
    console.log('QR code saved to ' + filePath);
    });

    res.status(200).send({'message':"Working..."});
};