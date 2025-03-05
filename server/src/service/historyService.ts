import fs from 'fs';

class City {
  name: string;
  id: string;
  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}

class HistoryService {
  private filePath = './db/db.json';

  async read(): Promise<City[]> {
    try {
      const data = await fs.promises.readFile(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async write(cities: City[]) {
    return fs.promises.writeFile(this.filePath, JSON.stringify(cities, null, 2), 'utf8');
  }

  async getCities(): Promise<City[]> {
    return this.read();
  }

  async addCity(cityName: string) {
    const cities = await this.read();
    
    // Check if the city already exists (case insensitive comparison)
    if (cities.some(city => city.name.toLowerCase() === cityName.toLowerCase())) {
      console.log(`City '${cityName}' already exists in history.`);
      return;
    }
    
    // Add new city
    cities.push(new City(cityName, cities.length.toString()));
    await this.write(cities);
  }

  async removeCity(id: string) {
    const cities = await this.read();
    const newCities = cities.filter(city => city.id !== id);
    await this.write(newCities);
  }
}

export default new HistoryService();
