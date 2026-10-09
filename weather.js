
    // Initialize Application
    window.onload = function() {
      createBackgroundBubbles();
      fetchGeoLocation();
    };

    // Generate Floating Background Bubbles
    function createBackgroundBubbles() {
      const container = document.getElementById('bubbleContainer');
      for (let i = 0; i < 15; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        const size = Math.random() * 60 + 20;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${Math.random() * 100}%`;
        bubble.style.animationDuration = `${Math.random() * 10 + 10}s`;
        bubble.style.animationDelay = `${Math.random() * 5}s`;
        container.appendChild(bubble);
      }
    }

    // HTML5 Geolocation Retrieval
    function fetchGeoLocation() {
      const statusText = document.getElementById('statusText');
      statusText.textContent = "🌐 " + i18n[currentLang].btnGps + "...";

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            currentLat = position.coords.latitude;
            currentLon = position.coords.longitude;
            statusText.textContent = i18n[currentLang].locSuccess;
            await reverseGeocode(currentLat, currentLon);
            await fetchWeatherData();
          },
          (error) => {
            statusText.textContent = i18n[currentLang].locDenied;
            reverseGeocode(currentLat, currentLon);
            fetchWeatherData();
          }
        );
      } else {
        statusText.textContent = i18n[currentLang].locDenied;
        fetchWeatherData();
      }
    }

    // Reverse Geocoding with OpenStreetMap Nominatim
    async function reverseGeocode(lat, lon) {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
        const data = await res.json();
        currentCity = data.address.city || data.address.town || data.address.village || data.address.municipality || "Fortaleza";
        currentCountry = `${data.address.country_code.toUpperCase()} — ${data.address.state || ""}`;
        document.getElementById('cityName').textContent = currentCity;
        document.getElementById('countryTag').textContent = currentCountry;
      } catch (e) {
        document.getElementById('cityName').textContent = currentCity;
      }
    }

    // Fetch Weather Data from Open-Meteo API
    async function fetchWeatherData() {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${currentLat}&longitude=${currentLon}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max&timezone=auto`;
        const res = await fetch(url);
        currentWeatherData = await res.json();
        renderWeatherUI();
      } catch (e) {
        console.error("Erro ao buscar clima:", e);
      }
    }

    // Render Weather UI Components
    function renderWeatherUI() {
      if (!currentWeatherData) return;

      const current = currentWeatherData.current_weather;
      const hourly = currentWeatherData.hourly;
      const daily = currentWeatherData.daily;

      // Temperature conversion helper
      const formatTemp = (val) => {
        if (selectedUnit === 'F') {
          return Math.round((val * 9/5) + 32) + "°F";
        }
        return Math.round(val) + "°C";
      };

      // Main Temp & Description
      document.getElementById('mainTemp').textContent = formatTemp(current.temperature);
      
      const wInfo = weatherCodes[current.weathercode] || weatherCodes[0];
      document.getElementById('weatherOrb').textContent = wInfo.icon;
      document.getElementById('weatherDesc').textContent = wInfo.desc[currentLang] || wInfo.desc.pt;

      // Metrics
      document.getElementById('valFeels').textContent = formatTemp(current.temperature - 1);
      const humidityVal = hourly.relative_humidity_2m[0] || 65;
      document.getElementById('valHumidity').textContent = humidityVal + "%";
      document.getElementById('valWind').textContent = Math.round(current.windspeed) + " km/h";
      const uvVal = daily.uv_index_max[0] || 5;
      document.getElementById('valUv').textContent = uvVal;

      // Render Donut Gauges
      document.getElementById('donutHumidity').setAttribute('stroke-dasharray', `${humidityVal}, 100`);
      document.getElementById('donutUv').setAttribute('stroke-dasharray', `${(uvVal / 12) * 100}, 100`);

      // Hourly Forecast Carousel
      const hourlyCarousel = document.getElementById('hourlyCarousel');
      hourlyCarousel.innerHTML = '';
      for (let i = 0; i < 12; i++) {
        const item = document.createElement('div');
        item.className = 'hourly-item';
        const date = new Date(hourly.time[i]);
        const timeStr = date.getHours().toString().padStart(2, '0') + ":00";
        const hCode = hourly.weather_code[i] || 0;
        const hIcon = (weatherCodes[hCode] || weatherCodes[0]).icon;

        item.innerHTML = `
          <span class="hourly-time">${timeStr}</span>
          <span class="hourly-icon">${hIcon}</span>
          <span class="hourly-temp">${formatTemp(hourly.temperature_2m[i])}</span>
        `;
        hourlyCarousel.appendChild(item);
      }

      // Daily Forecast
      const dailyList = document.getElementById('dailyList');
      dailyList.innerHTML = '';
      const dayNames = {
        pt: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
        en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        es: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
      };

      for (let i = 0; i < 5; i++) {
        const row = document.createElement('div');
        row.className = 'daily-row';
        const date = new Date(daily.time[i]);
        const dayStr = dayNames[currentLang][date.getDay()];
        const dCode = daily.weather_code[i] || 0;
        const dIcon = (weatherCodes[dCode] || weatherCodes[0]).icon;

        row.innerHTML = `
          <span class="daily-day">${dayStr}</span>
          <span class="daily-icon">${dIcon}</span>
          <span class="daily-temp-range">${formatTemp(daily.temperature_2m_max[i])} / ${formatTemp(daily.temperature_2m_min[i])}</span>
        `;
        dailyList.appendChild(row);
      }
    }

    // City Search Input Handling (Nominatim Search API)
    function handleSearchInput(query) {
      clearTimeout(searchDebounceTimer);
      const suggBox = document.getElementById('searchSuggestions');

      if (!query || query.length < 2) {
        suggBox.style.display = 'none';
        return;
      }

      searchDebounceTimer = setTimeout(async () => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
          const results = await res.json();
          suggBox.innerHTML = '';

          if (results.length > 0) {
            suggBox.style.display = 'block';
            results.forEach(place => {
              const item = document.createElement('div');
              item.className = 'suggestion-item';
              item.textContent = place.display_name;
              item.onclick = () => {
                currentLat = parseFloat(place.lat);
                currentLon = parseFloat(place.lon);
                currentCity = place.name;
                currentCountry = place.display_name.split(',').slice(-1)[0].trim();
                document.getElementById('cityName').textContent = currentCity;
                document.getElementById('countryTag').textContent = currentCountry;
                suggBox.style.display = 'none';
                document.getElementById('searchInput').value = '';
                fetchWeatherData();
              };
              suggBox.appendChild(item);
            });
          } else {
            suggBox.style.display = 'none';
          }
        } catch (e) {
          suggBox.style.display = 'none';
        }
      }, 300);
    }

    // Unit Switcher
    function setUnit(unit) {
      selectedUnit = unit;
      document.getElementById('unitC').classList.toggle('active', unit === 'C');
      document.getElementById('unitF').classList.toggle('active', unit === 'F');
      renderWeatherUI();
    }