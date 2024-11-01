const axios = require('axios');
require('dotenv').config();

async function testOAuthToken() {
    try {
        const response = await axios.post(`${process.env.UAA_URL}/oauth/token`, null, {
            params: {
                grant_type: 'client_credentials',
                client_id: process.env.UAA_CLIENT_ID,
                client_secret: process.env.UAA_CLIENT_SECRET
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        console.log('OAuth Token:', response.data.access_token);
        console.log('Token Type:', response.data.token_type);
        console.log('Expires In:', response.data.expires_in);
    } catch (error) {
        console.error('Error fetching OAuth token:', error);
    }
}

testOAuthToken();
