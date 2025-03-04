import {Router, Request, Response} from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
// TODO: GET weather data from city name
// TODO: save city to search history
router.post('/', async (req: Request, res: Response) => {
  console.log('Weather log')
    try {
    const cityName: string = req.body.cityName;
    console.log("Retrieving weather data for " + cityName);

    if (!cityName) {
      return res.status(400).json({ error: 'City name is required' });
    }

    const weatherData = await WeatherService.getWeatherForCity(cityName);

    await HistoryService.addCity(cityName);

    return res.json(weatherData);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve weather data' });
  }
});

// TODO: GET search history
router.get('/history', async (_req, res) => {
  try {
    const history = await HistoryService.getCities();
    res.json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve search history' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req,res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'City ID is required' });
    }

    await HistoryService.removeCity(id);
    return res.json({ message: 'City removed from search history' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to remove city from search history' });
  }
});

export default router;
