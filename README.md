# Weather Widget Challenge

Widget meteo minimale e responsive sviluppato per Freedome.it utilizzando vanilla JavaScript, HTML e CSS.

## 📋 Descrizione

Widget meteo progettato per l'integrazione nelle pagine attività di Freedome.it. Mostra previsioni meteo in tempo reale per la località specifica dove si svolge l'attività, con tre viste navigabili tramite swipe.

## ✨ Caratteristiche

- **3 viste swipeable**:
  - Meteo corrente con temperatura e località
  - Previsioni orarie (prossime 5 ore)
  - Previsioni a 5 giorni
- **Navigazione touch/mouse**: Swipe su mobile, drag su desktop
- **Design minimale**: Palette neutro/beige ispirata all'estetica Freedome
- **Sfumature dinamiche**: Colori di sfondo che cambiano in base alle condizioni meteo
- **Responsive**: Mobile-first, ottimizzato per tutti i dispositivi
- **Zero dipendenze**: Vanilla JavaScript puro, nessun framework
- **Performance**: Sistema di cache API (10 min TTL)

## 🚀 Installazione e Setup

### 1. Ottenere API Key

Registrati gratuitamente su [OpenWeather](https://openweathermap.org/api) e genera una API key.

### 2. Configurazione

Apri `js/config.js` e inserisci la tua API key:
```javascript
const CONFIG = {
  API_KEY: 'la-tua-api-key-qui',
  BASE_URL: 'https://api.openweathermap.org/data/2.5',
  UNITS: 'metric',
  LANG: 'it'
};
```

### 3. Utilizzo

Apri semplicemente `index.html` nel browser, oppure usa un server locale:
```bash
# Python
python -m http.server 8000

# Node.js
npx http-server
```

## 🎯 Integrazione in Freedome.it

### Parametro Località

**Importante**: La località **non è selezionabile dall'utente** ma viene passata come parametro dal sistema.

Ogni pagina attività di Freedome.it passa la località specifica tramite l'attributo `data-location`:
```html
<!-- Esempio: Canyoning Toscana -->
<div class="weather-widget" id="weatherWidget" data-location="Bagni di Lucca, IT">
  <!-- widget content -->
</div>

<!-- Esempio: Rafting Val di Sole -->
<div class="weather-widget" id="weatherWidget" data-location="Dimaro, IT">
  <!-- widget content -->
</div>
```

### Formati Località Supportati

Il widget accetta diversi formati per la località:

- **Nome città**: `"Rome, IT"`
- **Città + Regione**: `"Milan, Lombardy, IT"`
- **Coordinate GPS**: `"44.0569,10.8739"` (lat,lon) - **Consigliato per maggiore precisione**



## 📁 Struttura Progetto
```
weather-widget-challenge/
├── index.html              # Pagina demo del widget
├── css/
│   └── styles.css          # Stili con design system modulare
├── js/
│   ├── config.js           # Configurazione API
│   ├── main.js             # Orchestratore principale del widget
│   ├── weatherAPI.js       # Gestione chiamate API e caching
│   ├── weatherIcons.js     # Mappatura icone meteo
│   └── swipeNavigation.js  # Gestione navigazione touch/mouse
└── README.md
```

## 🛠️ Stack Tecnologico

- **HTML5**: Markup semantico
- **CSS3**: Grid, Flexbox, Custom Properties, Animations
- **JavaScript ES6+**: Modules, Classes, Async/Await
- **OpenWeather API**: Dati meteo in tempo reale
- **Google Fonts**: Montserrat
- **Google Material Symbols**: Icone meteo

## 🎨 Scelte Architetturali

### Design System con CSS Variables

Utilizzo di CSS Custom Properties per gestire temi, colori e spaziature in modo centralizzato:
```css
:root {
  --color-bg-primary: #f5f3f0;
  --color-text-primary: #2d3748;
  --spacing-lg: 24px;
  /* ... */
}
```

**Vantaggi**:
- Manutenibilità: modifiche centralizzate
- Scalabilità: facile implementare temi multipli
- Performance: nativo del browser

### Architettura Modulare JavaScript

Il codice è organizzato in moduli ES6 indipendenti:

- **WeatherAPI**: Gestisce fetch, parsing e caching (10 min)
- **WeatherIcons**: Mappatura codici OpenWeather → icone Material Symbols
- **SwipeNavigation**: Gestione gesti touch e mouse
- **WeatherWidget**: Orchestratore principale

### Sistema di Caching

Cache in-memory con TTL di 10 minuti per:
- Ottimizzare performance (no latenza di rete)
- Rispettare rate limit API (60 chiamate/min)
- Migliorare UX (navigazione istantanea tra viste)

### Navigazione Swipe Custom

Implementazione custom senza librerie per:
- Controllo totale del comportamento
- Bundle size minimale
- Supporto cross-platform (touch + mouse)

## 🌐 Compatibilità Browser

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)
- 

## 🔧 Configurazione Avanzata

### Modificare Lingua
```javascript
LANG: 'it' // Italiano
LANG: 'en' // English
LANG: 'fr' // Français
```

### Personalizzare Dimensioni Widget

Nel file `css/styles.css`:
```css
:root {
  --widget-width: 500px;
  --widget-height: 180px;
}
```

## 📝 Note di Sviluppo

### Perché Vanilla JavaScript?

Come da requisiti della challenge, il progetto utilizza esclusivamente vanilla JavaScript senza framework. Questo dimostra:
- Comprensione profonda del DOM
- Gestione eventi nativa
- Architettura modulare ES6
- Capacità di sviluppo senza dipendenze

### Gestione Località

La località **non è un input utente** ma un **parametro di sistema**. Questo design è intenzionale per l'integrazione con Freedome.it, dove ogni pagina attività conosce già la località dell'esperienza e la passa al widget automaticamente.

### Future Enhancement

Possibili estensioni future:
- Dark mode
- Animazioni meteo interattive
- Grafici temperatura/precipitazioni
- Internazionalizzazione completa
- Service Worker per offline support
- Unit testing (Jest/Vitest)

## 📄 Licenza

MIT License - Libero uso per progetti personali e commerciali

## 👤 Autore

Mansour Eduardo Lahham

---