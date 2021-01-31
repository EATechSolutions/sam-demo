// const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses")
const  processResponse = require('./processResponse.js');
const UTF8CHARSET = 'UTF-8';

const CLIENT_EMAIL = process.env.CLIENT_EMAIL
const FROM_EMAIL = process.env.FROM_EMAIL
// const REGION = process.env.REGION

// const ses = new SESClient({ region: REGION });

exports.handler = async event => {
  if (event.httpMethod === 'OPTIONS') {
    return processResponse(true);
  }

  if (!event.body) {
    return processResponse(true, 'Please specify email parameters: email and message ', 400);
  }
  const emailData = JSON.parse(event.body);

  if (!emailData.toEmails || emailData.email || !emailData.message) {
    return processResponse(true, 'Please specify email parameters: email and message', 400);
  }

  const destination = {
    ToAddresses: [CLIENT_EMAIL]
  }

  const message = `
    Hi,

    Someone tried contacting you. Here are the details:

    From: ${emailData}
    Message: "${emailData.message}"

    Thank you
    CUS Team
  `

  const body = { 
    Text: { 
      Charset: UTF8CHARSET,
      Data: emailData.message
    }
  };

  const emailParams = {
    Destination: destination,
    Message: {
      Body: body,
      Subject: {
        Charset: UTF8CHARSET,
        Data: `CUS: New message recieved`
      }
    },
    Source: FROM_EMAIL
  };

  try {
    // await ses.send(new SendEmailCommand(emailParams));
    return processResponse(true, emailParams);
  } catch (err) {
    console.error(err, err.stack);
    const errorResponse = `Error: Execution update, caused a SES error, please look at your logs.`;
    return processResponse(true, errorResponse, 500);
  }
};