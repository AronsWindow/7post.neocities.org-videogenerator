// api/status.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!process.env.REPLICATE_API_TOKEN) {
    return res.status(500).json({ error: 'Missing Replicate API Token' });
  }

  try {
    const response = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
      headers: {
        'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      console.error('Replicate API Error:', errorDetails);
      return res.status(500).json({ error: 'Failed to fetch prediction status', details: errorDetails });
    }

    const prediction = await response.json();
    return res.status(200).json(prediction);

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Server error fetching prediction status' });
  }
}
