import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: string;
  lon: string;
}

// TODO: Define a class for the Weather object
class Weather {
  city: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  weatherIcon: string;
  constructor(city: string, temperature: number, humidity: number, windSpeed: number, uvIndex: number, weatherIcon: string) {
    this.city = city;
    this.temperature = temperature;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
    this.uvIndex = uvIndex;
    this.weatherIcon = weatherIcon;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string = process.env.API_BASE_URL || 'https://api.openweathermap.org/';
  private apiKey: string = process.env.API_KEY || '75d7363343760770608b56789e7f106c';
  private cityName = '';
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    const response = await fetch(query);
    const data = await response.json();
    return data;
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const { lat, lon } = locationData;
    return { lat, lon };
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(cityName: string){
    return `${this.baseURL}geo/1.0/direct?q=${cityName}&limit=1&appid=${this.apiKey}`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: any) {
    const {lat, lon} = coordinates;
    return `${this.baseURL}data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=imperial`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const query = this.buildGeocodeQuery(this.cityName);
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const query = this.buildWeatherQuery(coordinates);
    const response = await fetch(query);
    const data = await response.json();
    return data;
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const { city_name, temp, rh, wind_spd, uv, weather } = response.data[0];
    const weatherIcon = weather.icon;
    return new Weather(city_name, temp, rh, wind_spd, uv, weatherIcon);
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(_currentWeather: Weather, weatherData: any[]) {
    const forecastArray = weatherData.map((day) => {
      const { valid_date, high_temp, low_temp, pop, weather } = day;
      const weatherIcon = weather.icon;
      return {
        date: valid_date,
        highTemp: high_temp,
        lowTemp: low_temp,
        pop,
        weatherIcon,
      };
    });
    return forecastArray;
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const currentWeather = this.parseCurrentWeather(await this.fetchWeatherData(coordinates));
    const weatherData = await this.fetchWeatherData(coordinates);
    const forecastArray = this.buildForecastArray(currentWeather, weatherData.data);
    return { currentWeather, forecastArray };
  }
}

export default new WeatherService();
