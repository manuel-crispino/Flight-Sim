import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await fetch(
      'https://opensky-network.org/api/states/all?lamin=34.0&lomin=-12.0&lamax=45.0&lomax=6.0'
    );

    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Failed to fetch flights',
    });
  }
}