 // WMO Weather Codes to Frutiger Aero Icons & Descriptions
    const weatherCodes = {
      0: { desc: { pt: "Céu Limpo", en: "Clear Sky", es: "Cielo Despejado" }, icon: "☀️" },
      1: { desc: { pt: "Predominantemente Limpo", en: "Mainly Clear", es: "Principalmente Despejado" }, icon: "🌤" },
      2: { desc: { pt: "Parcialmente Nublado", en: "Partly Cloudy", es: "Parcialmente Nublado" }, icon: "⛅" },
      3: { desc: { pt: "Encoberto", en: "Overcast", es: "Nublado" }, icon: "☁️" },
      45: { desc: { pt: "Névoa", en: "Fog", es: "Niebla" }, icon: "🌫" },
      51: { desc: { pt: "Garoa Leve", en: "Light Drizzle", es: "Llovizna Ligera" }, icon: "🌦" },
      61: { desc: { pt: "Chuva Leve", en: "Slight Rain", es: "Lluvia Ligera" }, icon: "🌧" },
      63: { desc: { pt: "Chuva Moderada", en: "Moderate Rain", es: "Lluvia Moderada" }, icon: "🌧" },
      65: { desc: { pt: "Chuva Forte", en: "Heavy Rain", es: "Lluvia Fuerte" }, icon: "🌧" },
      80: { desc: { pt: "Pancadas de Chuva", en: "Rain Showers", es: "Chubascos" }, icon: "⛈" },
      95: { desc: { pt: "Tempestade", en: "Thunderstorm", es: "Tormenta" }, icon: "🌩" }
    };

    // Initialize Application
    window.onload = function() {
      createBackgroundBubbles();
      fetchGeoLocation();
    };
