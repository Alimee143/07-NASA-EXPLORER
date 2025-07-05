// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
setupDateInputs(startInput, endInput);

// ====== Space Facts ======
const facts = [
  "Did you know? A day on Venus is longer than its year.",
  "Did you know? Neutron stars can spin at a rate of 600 rotations per second.",
  "Did you know? There are more trees on Earth than stars in the Milky Way.",
  "Did you know? The footprints on the Moon will be there for millions of years.",
  "Did you know? Jupiter has 95 known moons as of 2024.",
  "Did you know? The Sun accounts for 99.86% of the mass in our solar system.",
  "Did you know? Space is completely silent—there’s no atmosphere for sound.",
  "Did you know? One million Earths could fit inside the Sun.",
  "Did you know? The largest volcano in the solar system is on Mars.",
  "Did you know? Saturn could float in water because it’s mostly gas."
];
function showRandomFact() {
  const factDiv = document.getElementById('space-fact');
  const randomFact = facts[Math.floor(Math.random() * facts.length)];
  factDiv.textContent = randomFact;
}
showRandomFact();

// ====== Gallery & Modal ======
const gallery = document.getElementById('gallery');
const button = document.querySelector('.filters button');
const API_KEY = 'DEMO_KEY'; // Replace with your own key for production

// Modal setup
let modal = null;
function createModal() {
  modal = document.createElement('div');
  modal.id = 'modal';
  modal.style.display = 'none';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="modal-close">&times;</span>
      <div class="modal-body"></div>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector('.modal-close').onclick = () => (modal.style.display = 'none');
  modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
}
createModal();

function showModal(item) {
  const body = modal.querySelector('.modal-body');
  body.innerHTML = `
    <h2>${item.title} <span style="font-size:0.8em;color:#888;">(${item.date})</span></h2>
    ${item.media_type === 'image'
      ? `<img src="${item.hdurl || item.url}" alt="${item.title}" style="width:100%;max-height:400px;object-fit:contain;border-radius:8px;">`
      : item.media_type === 'video'
        ? `<div class="video-container"><iframe src="${item.url}" frameborder="0" allowfullscreen></iframe></div>`
        : ''
    }
    <p style="margin-top:1em;">${item.explanation}</p>
  `;
  modal.style.display = 'block';
}

// Fetch APOD data
async function fetchAPOD(start, end) {
  gallery.innerHTML = `<div class="placeholder"><div class="placeholder-icon">🔄</div><p>Loading space photos…</p></div>`;
  try {
    const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${start}&end_date=${end}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch data');
    let data = await res.json();
    if (!Array.isArray(data)) data = [data];
    data.sort((a, b) => new Date(b.date) - new Date(a.date));
    renderGallery(data);
  } catch (err) {
    gallery.innerHTML = `<div class="placeholder"><div class="placeholder-icon">🚫</div><p>Error loading images. Try again later.</p></div>`;
  }
}

function renderGallery(items) {
  if (!items.length) {
    gallery.innerHTML = `<div class="placeholder"><div class="placeholder-icon">🛰️</div><p>No images found for this range.</p></div>`;
    return;
  }
  gallery.innerHTML = '';
  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'gallery-item';
    div.tabIndex = 0;
    div.innerHTML = `
      ${item.media_type === 'image'
        ? `<img src="${item.url}" alt="${item.title}" class="zoom-img">`
        : item.media_type === 'video'
          ? `<div class="video-thumb"><a href="${item.url}" target="_blank" rel="noopener">🎬 Watch Video</a></div>`
          : ''
      }
      <h3>${item.title}</h3>
      <p>${item.date}</p>
    `;
    div.onclick = () => showModal(item);
    gallery.appendChild(div);
  });
}

// Button event
button.addEventListener('click', () => {
  fetchAPOD(startInput.value, endInput.value);
});

// ====== Hover Zoom Effect (CSS) ======
const style = document.createElement('style');
style.textContent = `
  .zoom-img {
    transition: transform 0.3s cubic-bezier(.4,2,.6,1);
    cursor: pointer;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(33, 150, 243, 0.08);
  }
  .zoom-img:hover {
    transform: scale(1.08);
    z-index: 2;
    box-shadow: 0 4px 24px rgba(33, 150, 243, 0.18);
  }
  #modal {
    position: fixed;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    background: rgba(0,0,0,0.55);
    backdrop-filter: blur(2px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  .modal-content {
    background: #fff;
    border-radius: 14px;
    max-width: 600px;
    width: 95%;
    padding: 28px 24px 24px 24px;
    position: relative;
    box-shadow: 0 12px 48px rgba(33, 150, 243, 0.25), 0 2px 8px rgba(0,0,0,0.10);
    animation: modalIn .3s;
    margin: 0 auto;
    border-top: 6px solid #1976d2;
  }
  .modal-content h2 {
    color: #1976d2;
    margin-bottom: 12px;
    font-family: 'Verdana', Arial, sans-serif;
    font-size: 1.3em;
  }
  .modal-close {
    position: absolute; top: 12px; right: 18px; font-size: 2rem; color: #888; cursor: pointer;
    transition: color 0.2s;
  }
  .modal-close:hover { color: #1976d2; }
  .modal-body img, .modal-body iframe { border-radius: 8px; }
  .video-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; }
  .video-container iframe {
    position: absolute; top:0; left:0; width:100%; height:100%;
  }
  .gallery-item {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(33, 150, 243, 0.07);
    margin-bottom: 18px;
    padding: 12px 10px 10px 10px;
    transition: box-shadow 0.2s, transform 0.2s;
    animation: fadeIn 0.7s;
  }
  .gallery-item:hover {
    box-shadow: 0 8px 32px rgba(33, 150, 243, 0.18);
    transform: translateY(-4px) scale(1.03);
  }
  .gallery-item h3 {
    color: #1976d2;
    margin: 10px 0 2px 0;
    font-size: 1.08em;
    font-family: 'Verdana', Arial, sans-serif;
  }
  .gallery-item p {
    color: #444;
    font-size: 0.97em;
    margin-bottom: 0;
  }
  .video-thumb a {
    display: inline-block;
    background: #1976d2;
    color: #fff !important;
    padding: 8px 18px;
    border-radius: 6px;
    text-decoration: none;
    font-weight: bold;
    margin-bottom: 8px;
    transition: background 0.2s;
  }
  .video-thumb a:hover {
    background: #0d47a1;
  }
  .space-fact {
    background: linear-gradient(90deg, #1976d2 0%, #42a5f5 100%);
    color: #fff;
    border-radius: 10px;
    padding: 16px 22px;
    margin: 18px 0 22px 0;
    font-size: 1.13em;
    font-family: 'Verdana', Arial, sans-serif;
    box-shadow: 0 2px 12px rgba(33, 150, 243, 0.10);
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 48px;
    position: relative;
  }
  .space-fact:before {
    content: "✨";
    font-size: 1.5em;
    margin-right: 10px;
    filter: drop-shadow(0 1px 2px #1565c0);
  }
  @keyframes modalIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: none; } }
`;
document.head.appendChild(style);
