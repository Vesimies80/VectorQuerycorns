export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }
  const { query } = req.body;

  const mockResponse = {
    text: `You asked: "${query}"`,
    chartData: [
      { label: "A", value: 30 },
      { label: "B", value: 80 },
      { label: "C", value: 45 },
    ],
  };

  res.status(200).json(mockResponse);
}