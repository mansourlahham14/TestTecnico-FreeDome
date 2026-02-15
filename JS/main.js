/*Weather Widget Main Module Orchestrazione del widget: recupero dati, rendering e gestione interazioni utente*/

import WeatherAPI from "./weatherAPI.js";
import { WeatherIcons } from "./weatherIcons.js";
import { SwipeNavigation } from "./swipeNavigation.js";

class WeatherWidget {
  constructor(element) {
    this.element = element;
    this.api = new WeatherAPI();
    this.location = element.dataset.location || "Coimbra, Portugal";
    this.currentView = 0;
    this.totalViews = 3;

    // Elementi DOM del widget
    this.viewsContainer = element.querySelector("#widgetViews");
    this.views = element.querySelectorAll(".view");
    this.dots = element.querySelectorAll(".dot");

    // Elementi vista meteo corrente
    this.currentTemp = element.querySelector("#currentTemp");
    this.currentLocation = element.querySelector("#currentLocation");
    this.currentIcon = element.querySelector("#currentIcon");

    // Elementi previsioni
    this.hourlyGrid = element.querySelector("#hourlyGrid");
    this.dailyGrid = element.querySelector("#dailyGrid");

    this.init();
  }

  /*Inizializza il widget: recupera i dati e configura gli eventi*/
  async init() {
    try {
      await this.fetchWeatherData();
      this.setupEventListeners();
    } catch (error) {
      console.error("Failed to initialize weather widget:", error);
      this.showError();
    }
  }

  /*recupera tutti i dati meteo dall'API*/
  async fetchWeatherData() {
    try {
      const current = await this.api.getCurrentWeather(this.location);
      this.renderCurrentWeather(current);

      const hourly = await this.api.getHourlyForecast(this.location);
      this.renderHourlyForecast(hourly);

      const daily = await this.api.getDailyForecast(this.location);
      this.renderDailyForecast(daily);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      throw error;
    }
  }

  /*Renderizza la vista meteo corrente e applica la sfumatura dinamica*/
  renderCurrentWeather(data) {
    this.currentTemp.textContent = `${data.temp}°`;
    this.currentLocation.textContent = `${data.location}, ${data.country}`;
    this.currentIcon.innerHTML = WeatherIcons.getIcon(data.weatherCode);

    // Imposta l'attributo per la sfumatura di sfondo basata sul meteo
    const viewCurrent = this.element.querySelector(".view-current");
    const weatherType = this._getWeatherType(data.weatherCode);
    viewCurrent.setAttribute("data-weather", weatherType);
  }

  /*Mappa i codici OpenWeather ai tipi di meteo per lo styling*/
  _getWeatherType(code) {
    if (code >= 200 && code < 300) return "thunderstorm";
    if (code >= 300 && code < 600) return "rain";
    if (code >= 600 && code < 700) return "snow";
    if (code >= 700 && code < 800) return "clouds";
    if (code === 800) return "clear";
    if (code > 800) return "clouds";
    return "clear";
  }

  /*Renderizza le previsioni orarie (prossime 5 ore)*/
  renderHourlyForecast(data) {
    this.hourlyGrid.innerHTML = data
      .map(
        (item) => `
      <div class="hourly-item">
        <div class="hourly-temp">${item.temp}°</div>
        <div class="hourly-icon">${WeatherIcons.getIcon(item.weatherCode)}</div>
        <div class="hourly-time">${item.time}</div>
      </div>
    `,
      )
      .join("");
  }

  /*Renderizza le previsioni giornaliere (prossimi 5 giorni)*/
  renderDailyForecast(data) {
    this.dailyGrid.innerHTML = data
      .map(
        (item) => `
      <div class="daily-item">
        <div class="daily-temp">${item.temp}°</div>
        <div class="daily-icon">${WeatherIcons.getIcon(item.weatherCode)}</div>
        <div class="daily-day">${item.day}</div>
      </div>
    `,
      )
      .join("");
  }

  /*Configura la navigazione swipe e i click sui dots*/
  setupEventListeners() {
    // Inizializza navigazione touch/mouse
    this.swipeNav = new SwipeNavigation(this.element, {
      totalViews: this.totalViews,
      onSwipe: (index) => this.navigateToView(index),
    });

    // Navigazione tramite dots
    this.dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        this.navigateToView(index);
      });
    });
  }

  /*Naviga alla vista specificata e aggiorna UI*/
  navigateToView(index) {
    this.currentView = index;

    this.views.forEach((view, i) => {
      view.classList.toggle("active", i === index);
    });

    this.dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });

    const offset = -index * 100;
    this.viewsContainer.style.transform = `translateX(${offset}%)`;
  }

  /*Mostra messaggio di errore*/
  showError() {
    this.currentTemp.textContent = "Error";
    this.currentLocation.textContent = "Unable to load weather data";
  }
}

// Inizializzazione al caricamento del DOM
document.addEventListener("DOMContentLoaded", () => {
  const widgetElement = document.getElementById("weatherWidget");

  if (widgetElement) {
    new WeatherWidget(widgetElement);
  }
});

export default WeatherWidget;
