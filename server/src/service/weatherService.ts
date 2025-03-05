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
  weatherIcon: string;
  temperature: number;
  windSpeed: number;
  humidity: number;
  constructor(city: string, temperature: number, humidity: number, windSpeed: number, weatherIcon: string) {
    this.city = city;
    this.temperature = temperature;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
    this.weatherIcon = weatherIcon;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL =  process.env.API_BASE_URL;
  private apiKey = process.env.API_KEY;
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
    //console.log('lat/lon', lat, lon)
    return `${this.baseURL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}`;
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
    //console.log('query', query)
    const response = await fetch(query);
    //console.log("response", response)
    const data = await response.json();
   // console.log("data", data)
    return data;
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    const name = response.city.name;
    // console.log('name', name)
    
    const weatherIcon = response.list[0].weather[0].icon;
    // console.log('weatherIcon', weatherIcon)

    // Get the temperature in Kelvin from the response
    const tempInKelvin = response.list[0].main.temp;
    // Convert Kelvin to Fahrenheit
    const tempInFahrenheit = this.kelvinToFahrenheit(tempInKelvin);
    console.log('Temperature in Kelvin:', tempInKelvin, 'Fahrenheit:', tempInFahrenheit);

    const humidity = response.list[0].main.humidity;
    // console.log('humidity', humidity)

    const windSpeed = response.list[0].wind.speed;
    // console.log('windSpeed', windSpeed)

    // Return an instance of the Weather class with the converted temperature in Fahrenheit
    return new Weather(name, windSpeed, tempInFahrenheit, humidity, weatherIcon);
}

// Function to convert Kelvin to Fahrenheit
private kelvinToFahrenheit(kelvin: number): number {
    const fahrenheit = (kelvin - 273.15) * 9 / 5 + 32;
    return fahrenheit;
}
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any): Weather[] {
    const forecastArray = weatherData.list.map((forecast: any) => {
        // Extract weather details from forecast
        const weatherIcon = forecast.weather[0].icon;
        // console.log('weatherIcon', weatherIcon)

        // Extract temperature in Kelvin and convert to Fahrenheit
        const tempInKelvin = forecast.main.temp;
        const tempInFahrenheit = this.kelvinToFahrenheit(tempInKelvin);
        // console.log('tempInKelvin', tempInKelvin, 'tempInFahrenheit', tempInFahrenheit)

        // Extract other weather details
        const humidity = forecast.main.humidity;
        // console.log('humidity', humidity)

        const windSpeed = forecast.wind.speed;
        // console.log('windSpeed', windSpeed)

        // Return a new Weather object with converted temperature
        return new Weather(currentWeather.city, windSpeed, tempInFahrenheit, humidity, weatherIcon);
    });

    return forecastArray;
}
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    //console.log("coordinates", coordinates)
    const fetchdata=await this.fetchWeatherData(coordinates)
   // console.log('fetchdata', fetchdata)
    const currentWeather = this.parseCurrentWeather(fetchdata);
    //console.log('currentweather', currentWeather)
    const weatherData = await this.fetchWeatherData(coordinates);
    //console.log('weatherData', weatherData)
    const forecastArray = this.buildForecastArray(currentWeather, weatherData);
    //console.log('forecast', forecastArray)
    return { currentWeather, forecastArray };
  }
}

export default new WeatherService();
