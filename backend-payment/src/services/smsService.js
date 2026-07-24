const axios = require('axios');
require('dotenv').config();

// Controls sending behavior for demos/free trials
// - SMS_ENABLED=false => skip without calling Notify.lk
// - SMS_MODE=mock => simulate success and only log
const SMS_ENABLED = process.env.SMS_ENABLED;
const SMS_MODE = process.env.SMS_MODE;

const NOTIFYLK_USER_ID = process.env.NOTIFYLK_USER_ID;
const NOTIFYLK_API_KEY = process.env.NOTIFYLK_API_KEY;
const NOTIFYLK_SENDER_ID = process.env.NOTIFYLK_SENDER_ID;

const NOTIFYLK_SEND_URL = 'https://app.notify.lk/api/v1/send';

const formatPhoneForNotify = (toPhone) => {
  if (!toPhone) return '';
  return String(toPhone).trim().replace(/^\+/, '');
};

const sendOfficerPaymentSms = async (firstArg, secondArg) => {
  if (SMS_ENABLED === 'false') {
    return { status: 'skipped', reason: 'SMS_ENABLED=false' };
  }

  let officerPhone;
  let messageBody;

  if (firstArg && typeof firstArg === 'object') {
    const {
      officerId,
      officerPhone: phone,
      referenceNumber,
      categoryId,
      paymentChannel,
    } = firstArg;

    officerPhone = phone;
    messageBody = [
      'Traffic fine payment confirmed.',
      `Officer ID: ${officerId}`,
      `Reference No: ${referenceNumber}`,
      `Category ID: ${categoryId}`,
      `Channel: ${paymentChannel}`,
    ].join('\n');
  } else {
    officerPhone = firstArg;
    messageBody = secondArg;
  }

  if (SMS_MODE === 'mock') {
    console.log('[SMS MOCK] Would send SMS to:', officerPhone);
    return { status: 'sent_mock' };
  }

  if (!NOTIFYLK_USER_ID || !NOTIFYLK_API_KEY) {
    console.warn(
      '[Notify.lk] Missing NOTIFYLK_USER_ID or NOTIFYLK_API_KEY; skipping SMS send'
    );
    return { status: 'skipped' };
  }

  const to = formatPhoneForNotify(officerPhone);
  if (!to) {
    return { status: 'skipped', reason: 'Officer phone is missing' };
  }

  try {
    // Notify.lk endpoint is used as GET with query params.
    const response = await axios.get(NOTIFYLK_SEND_URL, {
      params: {
        user_id: NOTIFYLK_USER_ID,
        api_key: NOTIFYLK_API_KEY,
        sender_id: NOTIFYLK_SENDER_ID,
        to,
        message: messageBody,
      },
      timeout: 8000,
    });

    const body = response?.data;

    // Treat HTTP 2xx as success unless the body explicitly signals an error.
    const apiStatus =
      typeof body?.status === 'string' ? body.status.toLowerCase() : null;

    if (response.status < 200 || response.status >= 300) {
      return { status: 'failed', error: body || response.statusText };
    }

    if (apiStatus === 'error' || apiStatus === 'failed') {
      return { status: 'failed', error: body };
    }

    return { status: 'sent', response: body };
  } catch (err) {
    const error = err?.response?.data || err?.message || String(err);
    console.error('[Notify.lk] SMS send failed:', error);
    return { status: 'failed', error };
  }
};

module.exports = { sendOfficerPaymentSms };

