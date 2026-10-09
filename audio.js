// Web Audio API Soundscape Synthesizer
    let audioCtx = null;
    let isAudioPlaying = false;
    let noiseNode = null;
    let gainNode = null;
    let audioType = 'rain';

    function initAudio() {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        gainNode = audioCtx.createGain();
        gainNode.gain.value = 0.3;
        gainNode.connect(audioCtx.destination);
      }
    }

    function toggleAmbienceSound() {
      initAudio();
      const btn = document.getElementById('soundToggleBtn');

      if (isAudioPlaying) {
        if (noiseNode) noiseNode.stop();
        isAudioPlaying = false;
        btn.textContent = '▶ Sound';
      } else {
        createNoiseBuffer();
        isAudioPlaying = true;
        btn.textContent = '⏸ Pause';
        drawVisualizer();
      }
    }

    function createNoiseBuffer() {
      if (noiseNode) noiseNode.stop();

      const bufferSize = audioCtx.sampleRate * 2;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      noiseNode = audioCtx.createBufferSource();
      noiseNode.buffer = buffer;
      noiseNode.loop = true;

      // Filter settings for different natural sounds
      const filter = audioCtx.createBiquadFilter();
      if (audioType === 'rain') {
        filter.type = 'lowpass';
        filter.frequency.value = 1000;
      } else if (audioType === 'wind') {
        filter.type = 'bandpass';
        filter.frequency.value = 400;
      } else if (audioType === 'waves') {
        filter.type = 'lowpass';
        filter.frequency.value = 500;
      }

      noiseNode.connect(filter);
      filter.connect(gainNode);
      noiseNode.start();
    }

    function setAmbienceVolume(val) {
      if (gainNode) gainNode.gain.value = parseFloat(val);
    }

    function setSoundType(type) {
      audioType = type;
      document.getElementById('sndRain').classList.toggle('active', type === 'rain');
      document.getElementById('sndWind').classList.toggle('active', type === 'wind');
      document.getElementById('sndWaves').classList.toggle('active', type === 'waves');

      if (isAudioPlaying) createNoiseBuffer();
    }

    // Canvas Audio Spectrum Visualizer
    function drawVisualizer() {
      const canvas = document.getElementById('audioVisualizer');
      const ctx = canvas.getContext('2d');
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      function renderFrame() {
        if (!isAudioPlaying) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          return;
        }

        requestAnimationFrame(renderFrame);
        ctx.fillStyle = 'rgba(0, 20, 40, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const bars = 20;
        const barWidth = canvas.width / bars;

        for (let i = 0; i < bars; i++) {
          const barHeight = Math.random() * canvas.height * 0.8;
          ctx.fillStyle = '#00e5ff';
          ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 2, barHeight);
        }
      }

      renderFrame();
    }