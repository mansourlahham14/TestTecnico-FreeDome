/*Weather Icons Module e Mappatura tra codici meteo OpenWeather e icone Google Material Symbols*/

export class WeatherIcons {
  /**
   * Restituisce l'icona appropriata in base al codice condizione meteo OpenWeather
   * @param {number} code - Codice condizione meteo
   * @returns {string} HTML span con icona Material Symbol
   */
  static getIcon(code) {
    if (code >= 200 && code < 300) return this.thunderstorm();
    if (code >= 300 && code < 400) return this.drizzle();
    if (code >= 500 && code < 600) return this.rain();
    if (code >= 600 && code < 700) return this.snow();
    if (code >= 700 && code < 800) return this.atmosphere();
    if (code === 800) return this.clear();
    if (code === 801 || code === 802) return this.partlyCloudy();
    if (code === 803 || code === 804) return this.cloudy();
    
    return this.clear();
  }

  static clear() {
    return '<span class="material-symbols-outlined weather-icon">clear_day</span>';
  }

  static partlyCloudy() {
    return '<span class="material-symbols-outlined weather-icon">partly_cloudy_day</span>';
  }

  static cloudy() {
    return '<span class="material-symbols-outlined weather-icon">cloud</span>';
  }

  static rain() {
    return '<span class="material-symbols-outlined weather-icon">rainy</span>';
  }

  static drizzle() {
    return '<span class="material-symbols-outlined weather-icon">rainy_light</span>';
  }

  static thunderstorm() {
    return '<span class="material-symbols-outlined weather-icon">thunderstorm</span>';
  }

  static snow() {
    return '<span class="material-symbols-outlined weather-icon">weather_snowy</span>';
  }

  static atmosphere() {
    return '<span class="material-symbols-outlined weather-icon">mist</span>';
  }
}