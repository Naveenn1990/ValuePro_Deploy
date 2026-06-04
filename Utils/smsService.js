const axios = require('axios');
const https = require('https');

// SMS gateway uses a self-signed cert — skip verification for this specific call
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

/**
 * Send OTP via SMS using the configured SMS gateway
 * @param {string} mobile - 10-digit mobile number
 * @param {string} otp - 6-digit OTP
 * @param {string} type - 'login' or 'signup'
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function sendOTP(mobile, otp, type = 'login') {
  try {
    const SMS_CONFIG = {
      baseURL: 'https://123.108.46.13/sms-panel/api/http/index.php',
      username: 'VALUEPRO',
      apikey: '7A705-02A32',
      sender: 'VPROSV',
      route: 'TRANS',
      templateID: '1707178048769071567',
      format: 'JSON',
    };

    // Build message based on type
    let message;
    if (type === 'signup') {
      message = `VALUEPRO SERVICE: Your OTP for registration is ${otp}. Valid for 10 minutes. Do not share this OTP with anyone.`;
    } else {
      message = `VALUEPRO SERVICE: Your OTP for login is ${otp}. Valid for 10 minutes. Do not share this OTP with anyone.`;
    }

    // Build query params
    const params = new URLSearchParams({
      username: SMS_CONFIG.username,
      apikey: SMS_CONFIG.apikey,
      apirequest: 'Text',
      sender: SMS_CONFIG.sender,
      mobile: mobile,
      message: message,
      route: SMS_CONFIG.route,
      TemplateID: SMS_CONFIG.templateID,
      format: SMS_CONFIG.format,
    });

    const url = `${SMS_CONFIG.baseURL}?${params.toString()}`;
    console.log('[SMS] Sending OTP to:', mobile, '| Type:', type);

    const response = await axios.get(url, { timeout: 10000, httpsAgent });

    console.log('[SMS] Response status:', response.status);
    console.log('[SMS] Response data:', response.data);

    // Check if SMS was sent successfully
    // Adjust this based on actual API response format
    if (response.status === 200) {
      return {
        success: true,
        message: 'OTP sent successfully',
        data: response.data,
      };
    } else {
      return {
        success: false,
        message: 'Failed to send OTP',
        data: response.data,
      };
    }
  } catch (error) {
    console.error('[SMS] Error sending OTP:', error.message);
    return {
      success: false,
      message: 'SMS service error: ' + error.message,
    };
  }
}

/**
 * Generate a random 6-digit OTP
 * @returns {string} 6-digit OTP
 */
function generateOTP() {
  return (Math.floor(Math.random() * 1000000) + 1000000)
    .toString()
    .substring(1);
}

module.exports = {
  sendOTP,
  generateOTP,
};
