// Serverless function to create a user and send an invitation email on Cloudron.

// See the following links for more information:
// https://docs.cloudron.io/api.html
// https://docs.netlify.com/functions/get-started/?fn-language=js
// [French] https://youtu.be/S3o8PwuLrfc

export const handler = async (event, context) => {
    const cloudronDomain = process.env.CLOUDRON_DOMAIN;
    const cloudronToken = process.env.CLOUDRON_TOKEN;
    const email = event.queryStringParameters.email;
    console.log(`Creating user with email ${email} on ${cloudronDomain}`);
    await createUserAndSendEmail(cloudronDomain, cloudronToken, email)
    return {
      body: JSON.stringify({}),
      statusCode: 200
    };
  };
  

// Copilot JS translation of https://gist.github.com/NicolasGrosjean/1a2ccebf0e13b620cb12f1fd9409cf45
const manageRequestError = (response, successMessage) => {
    if (Math.floor(response.status / 100) !== 2) {
        let error;
        try {
            error = JSON.parse(response.body);
        } catch (e) {
            console.error(`${response.status}: ${response.body}`);
            throw new Error(response.body);
        }
        if (error.message) {
            console.error(error.message);
        } else if (error.detail) {
            console.error(error.detail);
        } else {
            console.error(error);
        }
        throw new Error(response.body);
    } else {
        console.log(successMessage);
    }
};

const createUserAndSendEmail = async (cloudronDomain, cloudronToken, email) => {
    const headers = { "Content-Type": "application/json" };
    const createUserUrl = `https://${cloudronDomain}/api/v1/users?access_token=${cloudronToken}`;
    
    let response = await fetch(createUserUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ email: email })
    });
    
    try {
        manageRequestError(response, "User created");
    } catch (error) {
        console.error(error);
        return;
    }
    
    const userId = (await response.json()).id;
    const sendEmailUrl = `https://${cloudronDomain}/api/v1/users/${userId}/send_invite_email?access_token=${cloudronToken}`;
    
    response = await fetch(sendEmailUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ email: email })
    });
    
    manageRequestError(response, "Invitation email sent");
};