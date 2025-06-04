const request = require('request');

// Exotel API credentials
const key = "a00e9177d130878a1c14dcbf8df21071c95a54bd0f0123f0";
const sid = "maargdarshak1";
const from = "08069458933";
const token = "9567d1cffc5aeb7695d240cea40d99d82e33a506591ad802";
const SID = 'maargdarshak1';
const TOKEN = '9567d1cffc5aeb7695d240cea40d99d82e33a506591ad802';
const EXOPHONE = 'YOUR_EXOPHONE'; // Your Exophone number

// Array of random phone numbers
const phoneNumbers = ['+1234567890', '+9876543210', '+1111111111'];

// Function to make a call to a random number
function callRandomNumber(EXOPHONE) {
  // Choose a random phone number
  const randomIndex = Math.floor(Math.random() * phoneNumbers.length);
  const phoneNumber = phoneNumbers[randomIndex];

  // Exotel API endpoint for initiating a call
  const url = 'https://api.exotel.com/v2/accounts/' + SID + '/calls/connect';

  // Payload for the API request
  const payload = {
    from: EXOPHONE,
    to: phoneNumber,
    caller_id: EXOPHONE
  };

  // Send the API request
  request.post(
    {
      url: url,
      auth: {
        user: SID,
        pass: TOKEN
      },
      json: payload
    },
    (error, response, body) => {
      if (error) {
        console.error('Error making call:', error);
      } else {
        console.log('Call initiated successfully:', body);
        return body
      }
    }
  );
}

// Call the function to make a call to a random number

module.exports={callRandomNumber}
