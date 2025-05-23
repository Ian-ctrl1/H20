const swiper = new Swiper('.mySwiper', {
  effect: 'fade',
  loop: true,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  }
});

// Fullscreen on image click
document.querySelectorAll('.swiper-slide img').forEach(img => {
  img.addEventListener('click', () => {
    if (img.requestFullscreen) {
      img.requestFullscreen();
    }
  });
});

// Audio visualizer
const audio = document.getElementById('bg-music');
const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = 150;

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();
const source = audioCtx.createMediaElementSource(audio);

source.connect(analyser);
analyser.connect(audioCtx.destination);
analyser.fftSize = 256;

const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

function draw() {
  requestAnimationFrame(draw);
  analyser.getByteFrequencyData(dataArray);
  ctx.fillStyle = '#001f33';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const barWidth = (canvas.width / bufferLength) * 2.5;
  let x = 0;
  for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i];
    ctx.fillStyle = `rgb(${barHeight + 100}, 50, 200)`;
    ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
    x += barWidth + 1;
  }
}

audio.onplay = () => {
  audioCtx.resume().then(() => {
    draw();
  });
};

// Music toggle button
const toggleBtn = document.getElementById('music-toggle');
toggleBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play().then(() => {
      toggleBtn.textContent = '⏸ Pause';
    }).catch(err => {
      console.error("Autoplay blocked:", err);
    });
  } else {
    audio.pause();
    toggleBtn.textContent = '▶ Play';
  }
});

// Auto dark mode at night
const hour = new Date().getHours();
if (hour >= 18 || hour < 6) {
  document.body.classList.add('night');
}
