const twilio = require('twilio');
require('dotenv').config();

const sid = process.env.TWILIO_ACCOUNT_SID ? process.env.TWILIO_ACCOUNT_SID.trim() : '';
const token = process.env.TWILIO_AUTH_TOKEN ? process.env.TWILIO_AUTH_TOKEN.trim() : '';
const fromPhone = process.env.TWILIO_PHONE_NUMBER ? process.env.TWILIO_PHONE_NUMBER.trim() : '';

let client = null;
if (sid && token && sid.startsWith('AC') && !sid.includes('your-')) {
  try {
    client = twilio(sid, token);
  } catch (err) {
    console.warn('Twilio initialization failed. Falling back to log-only mode.', err.message);
  }
} else {
  console.log('Twilio credentials missing or invalid. SMS service running in log-only mode.');
}

const sendPaymentSMS = async (officerPhone, referenceNumber) => {
  const smsBody = `Fine ${referenceNumber} has been paid. You may return the driver's license.`;
  if (client && fromPhone) {
    try {
      await client.messages.create({
        body: smsBody,
        from: fromPhone,
        to: officerPhone
      });
      console.log(`SMS successfully sent to ${officerPhone} via Twilio.`);
    } catch (err) {
      console.error(`Twilio failed to send SMS to ${officerPhone}:`, err.message);
      console.log(`[SMS FALLBACK LOG] To: ${officerPhone} | Message: ${smsBody}`);
    }
  } else {
    console.log(`[SMS LOG (No Twilio Configured)] To: ${officerPhone} | Message: ${smsBody}`);
  }
};

module.exports = { sendPaymentSMS };