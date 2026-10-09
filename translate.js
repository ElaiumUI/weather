const i18n = {
      pt: {
        btnGps: "Meu Local",
        windowTitle: "Central Meteorológica Elaium",
        lblFeelsLike: "Sensação",
        lblHumidity: "Umidade",
        lblWind: "Vento",
        lblUv: "Índice UV",
        titleHourly: "Previsão Hora a Hora",
        titleDaily: "Previsão para 5 Dias",
        titleIndicators: "Indicadores Aero",
        titleAmbience: "Elaium Soundscape",
        descAmbience: "Sintetizador de áudio ambiente em tempo real:",
        locSuccess: "🌐 Localização atualizada via GPS!",
        locDenied: "⚠️ GPS indisponível. Exibindo Fortaleza (Default).",
        searchPlaceholder: "Buscar cidade..."
      },
      en: {
        btnGps: "My Location",
        windowTitle: "Elaium Meteorological Center",
        lblFeelsLike: "Feels Like",
        lblHumidity: "Humidity",
        lblWind: "Wind",
        lblUv: "UV Index",
        titleHourly: "Hourly Forecast",
        titleDaily: "5-Day Forecast",
        titleIndicators: "Aero Indicators",
        titleAmbience: "Elaium Soundscape",
        descAmbience: "Real-time ambient audio synthesizer:",
        locSuccess: "🌐 Live GPS Location updated!",
        locDenied: "⚠️ GPS unavailable. Showing default location.",
        searchPlaceholder: "Search city..."
      },
      es: {
        btnGps: "Mi Ubicación",
        windowTitle: "Centro Meteorológico Elaium",
        lblFeelsLike: "Sensación",
        lblHumidity: "Humedad",
        lblWind: "Viento",
        lblUv: "Índice UV",
        titleHourly: "Pronóstico por Hora",
        titleDaily: "Pronóstico de 5 Días",
        titleIndicators: "Indicadores Aero",
        titleAmbience: "Elaium Soundscape",
        descAmbience: "Sintetizador de audio ambiente en tiempo real:",
        locSuccess: "🌐 ¡Ubicación GPS actualizada!",
        locDenied: "⚠️ GPS no disponible. Mostrando ubicación predeterminada.",
        searchPlaceholder: "Buscar ciudad..."
      }
    };

    // Language i18n Switcher
    function setLanguage(lang) {
      currentLang = lang;
      document.getElementById('langPt').classList.toggle('active', lang === 'pt');
      document.getElementById('langEn').classList.toggle('active', lang === 'en');
      document.getElementById('langEs').classList.toggle('active', lang === 'es');

      // Update text tags
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18n[lang][key]) {
          el.textContent = i18n[lang][key];
        }
      });

      document.getElementById('searchInput').placeholder = i18n[lang].searchPlaceholder;
      renderWeatherUI();
    }