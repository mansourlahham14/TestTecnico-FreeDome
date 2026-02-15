/*Weather API Module e Gestione di tutte le interazioni con l'API OpenWeather, inclusi caching e parsing dei dati*/

import CONFIG from './config.js';

class WeatherAPI {
  constructor() {
    this.apiKey = CONFIG.API_KEY;
    this.baseUrl = CONFIG.BASE_URL;
    this.units = CONFIG.UNITS;
    this.lang = CONFIG.LANG;
    this.demoMode = CONFIG.DEMO_MODE || false;
    
    this.cache = new Map();
    this.cacheExpiry = 10 * 60 * 1000; // 10 minuti
  }

  /**
   * Recupera i dati meteo correnti per una località
   * @param {string} location - Nome città o coordinate (lat,lon)
   * @returns {Promise<Object>} Dati meteo
   */
  async getCurrentWeather(location) {
    if (this.demoMode) {
      return this._getDemoData('current');
    }
    
    const cacheKey = `current_${location}`;
    
    return this._getCachedOrFetch(cacheKey, async () => {
      const url = this._buildUrl('weather', location);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return this._parseCurrentWeather(data);
    });
  }

  /**
   * Recupera le previsioni orarie (prossime 5 ore)
   * @param {string} location - Nome città o coordinate
   * @returns {Promise<Array>} Array di dati orari
   */
  async getHourlyForecast(location) {
    if (this.demoMode) {
      return this._getDemoData('hourly');
    }
    
    const cacheKey = `hourly_${location}`;
    
    return this._getCachedOrFetch(cacheKey, async () => {
      const url = this._buildUrl('forecast', location);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return this._parseHourlyForecast(data);
    });
  }

  /**
   * Recupera le previsioni a 5 giorni
   * @param {string} location - Nome città o coordinate
   * @returns {Promise<Array>} Array di dati giornalieri
   */
  async getDailyForecast(location) {
    if (this.demoMode) {
      return this._getDemoData('daily');
    }
    
    const cacheKey = `daily_${location}`;
    
    return this._getCachedOrFetch(cacheKey, async () => {
      const url = this._buildUrl('forecast', location);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return this._parseDailyForecast(data);
    });
  }

  _buildUrl(endpoint, location) {
    const params = new URLSearchParams({
      q: location,
      appid: this.apiKey,
      units: this.units,
      lang: this.lang
    });
    
    return `${this.baseUrl}/${endpoint}?${params}`;
  }

  /*Recupera dati dalla cache o effettua una nuova chiamata API*/
  async _getCachedOrFetch(cacheKey, fetchFunction) {
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }
    
    const data = await fetchFunction();
    
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    
    return data;
  }

  /*Svuota la cache*/
  clearCache(key = null) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  /*Estrae e normalizza i dati dalla risposta API meteo corrente*/
  _parseCurrentWeather(data) {
    return {
      location: data.name,
      country: data.sys.country,
      temp: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      weatherCode: data.weather[0].id,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      timestamp: data.dt
    };
  }

  /*Estrae le prime 5 previsioni orarie dalla risposta API*/
  _parseHourlyForecast(data) {
    return data.list.slice(0, 5).map(item => ({
      time: this._formatTime(item.dt),
      temp: Math.round(item.main.temp),
      icon: item.weather[0].icon,
      weatherCode: item.weather[0].id,
      timestamp: item.dt
    }));
  }

  /*Estrae le previsioni giornaliere selezionando i dati di mezzogiorno*/
  _parseDailyForecast(data) {
    const dailyData = [];
    const processedDays = new Set();
    
    for (const item of data.list) {
      const date = new Date(item.dt * 1000);
      const day = date.toDateString();
      
      if (!processedDays.has(day) && dailyData.length < 5) {
        const hour = date.getHours();
        if (hour >= 11 && hour <= 14) {
          dailyData.push({
            day: this._formatDay(item.dt),
            temp: Math.round(item.main.temp),
            icon: item.weather[0].icon,
            weatherCode: item.weather[0].id,
            timestamp: item.dt
          });
          processedDays.add(day);
        }
      }
      
      if (dailyData.length >= 5) break;
    }
    
    return dailyData;
  }

  /*Formatta timestamp Unix in formato orario (HH:MM)*/
  _formatTime(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('it-IT', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  }

  /*Formatta timestamp Unix in nome del giorno abbreviato*/
  _formatDay(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('it-IT', { weekday: 'short' });
  }
}

export default WeatherAPI;