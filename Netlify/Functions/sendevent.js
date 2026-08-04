const fetch = require('node-fetch'); // Standard in Netlify node runtimes

exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { event_name, event_id, user_data, custom_data } = JSON.parse(event.body);
    const pixelId = process.env.META_PIXEL_ID;
    const accessToken = process.env.META_ACCESS_TOKEN;

    const payload = {
      data: [{
        event_name: event_name,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        event_id: event_id, // Must match your front-end browser pixel event_id for deduplication
        user_data: user_data, // Must hash email/phone into SHA-256 before sending
        custom_data: custom_data || {}
      }]
    };

    const response = await fetch(`https://facebook.com{pixelId}/events?access_token=${accessToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const resData = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, meta_response: resData }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
