import dotenv from 'dotenv';
dotenv.config();


// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
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
  private baseURL: string =  'https://api.openweathermap.org/';
  private apiKey: string = '75d7363343760770608b56789e7f106c';
  private cityName: string = '';
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    const response = await fetch(query);
    const data = await response.json();
    return data;
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates[]) {
   // console.log('locationData 2', locationData)
    const [{ lat, lon }] = locationData;
   // console.log('lat/lon', lat, lon)
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
   // console.log(this.cityName)
    const query = this.buildGeocodeQuery(this.cityName);
   // console.log('query', query)
    const locationData = await this.fetchLocationData(query);
    // console.log('location', locationData)
    return this.destructureLocationData(locationData);
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const query = this.buildWeatherQuery(coordinates);
   // console.log('query', query)
    const response = await fetch(query);
    //console.log("response", response)
    const data = await response.json();
    //console.log("data", data)
    //console.log('main', data.list[0].main, 'weather', data.list[0].weather, 'clouds', data.list[0].clouds, 'wind', data.list[0].wind, 'sys', data.list[0].sys)
    return data;
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    //console.log('Response', response)
    console.log(response.list[0].wind)
    const weather = response.list[0].weather
    const temp = response.list[0].main.temp
    const { name, rh, wind_spd, uv, } = response.list[0].wind;
    const weatherIcon = weather.icon;
    return new Weather(name, temp, rh, wind_spd, uv, weatherIcon);
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
    console.log('Get city Service')
    this.cityName = city;
    console.log("city", city)
    const coordinates = await this.fetchAndDestructureLocationData();
    console.log("coordinates", coordinates)
    const fetchdata=await this.fetchWeatherData(coordinates)
   // console.log('detchdata', fetchdata)
    const currentWeather = this.parseCurrentWeather(fetchdata);
    console.log('currentweather', currentWeather)
    const weatherData = await this.fetchWeatherData(coordinates);
    console.log('weatherData', weatherData)
    const forecastArray = this.buildForecastArray(currentWeather, weatherData.data);
    console.log('forecast', forecastArray)
    return { currentWeather, forecastArray };
  }
}

export default new WeatherService();
