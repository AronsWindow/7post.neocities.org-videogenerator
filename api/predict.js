// api/predict.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { version, input } = req.body;

  if (!process.env.REPLICATE_API_TOKEN) {
    return res.status(500).json({ error: 'Missing Replicate API Token' });
  }

  try {
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: version,
        input: input
      })
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      console.error('Replicate API Error:', errorDetails);
      return res.status(500).json({ error: 'Failed to start prediction', details: errorDetails });
    }

    const prediction = await response.json();
    return res.status(200).json(prediction);

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Server error starting prediction' });
  }
}
