export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const API_TOKEN = process.env.REPLICATE_API_TOKEN;
  if (!API_TOKEN) {
    return res.status(500).json({ error: "No API token configured" });
  }

  const predictionId = req.query.id;
  if (!predictionId) {
    return res.status(400).json({ error: "Missing prediction id" });
  }

  try {
    const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
      headers: {
        Authorization: `Token ${API_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const prediction = await response.json();
    res.status(200).json(prediction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
