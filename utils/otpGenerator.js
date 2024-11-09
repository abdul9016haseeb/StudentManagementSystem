const db = require('../model/index');
const otp = async(signup_id)=>{
    let otp = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    const expiration = 1;
    const expiresAt = new Date(Date.now() + expiration * 60000);

    console.log(otp, signup_id);
    await db.Otp.create({
        signup_id: signup_id,
        otp_code: otp,
        expiresAt: expiresAt,
    });
  return otp;
};

module.exports = otp;