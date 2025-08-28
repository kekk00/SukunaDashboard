// Dati per i numeri e lo staff
const numbers = [
  {"number":"+1 (289) 536-1012","status":"online"},
  {"number":"+1 (581) 221-6324","status":"standby"},
  {"number":"+39 081 365 7301","status":"pending"},
  {"number":"+39 329 757 0233","status":"founder"},
  {"number":"+39 327 279 0038","status":"founder"},
  {"number":"+1 (431) 400-7905","status":"ban"},
];

const staff = [
  {name:"Sukuna", role:"Founder & Server Host", img:"https://i.postimg.cc/FHZYdb1R/c8756687815f6b0c1ee2a41b6f2c5e99.jpg", link:"https://instagram.com/__immgiuseetbh"},
  {name:"Luca", role:"Fornitore", img:"https://i.postimg.cc/XY4nPrc6/file.jpg", link:"#"}
];

// Funzione per mostrare una notifica
function showNotification(message) {
  const notif = document.createElement('div');
  notif.className = 'notification';
  notif.textContent = message;
  notificationContainer.appendChild(notif);
  setTimeout(() => { notif.style.opacity = '1'; notif.style.transform = 'translateY(0)'; }, 50);
  setTimeout(() => { notif.style.opacity = '0'; notif.style.transform = 'translateY(-20px)'; setTimeout(() => { notif.remove(); }, 500); }, 6000);
}

// Logica per il popup di benvenuto
const popup = document.getElementById('welcomePopup');
const acceptBtn = document.getElementById('acceptBtn');
const notificationContainer = document.getElementById('notificationContainer');
acceptBtn.addEventListener('click', () => {
  popup.style.display = 'none';
  showNotification("Non dimenticare di iscriverti alla nostra newsletter!");
});

// Logica per il menu ad hamburger
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('navMobile');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMobile.classList.toggle('show');
});

// Popola la tabella dei numeri
const table = document.getElementById('numbersTable');
numbers.forEach(n => {
  const cleanNumber = n.number.replace(/[^0-9+]/g, '');
  const waLink = `https://wa.me/${cleanNumber.replace('+', '')}`;
  const tr = document.createElement('tr');
  tr.innerHTML = `<td><a href="${waLink}" target="_blank">${n.number}</a></td>
                  <td class="status-${n.status}">${n.status}</td>`;
  table.appendChild(tr);
});

// Popola la griglia dello staff
const staffGrid = document.getElementById('staffGrid');
staff.forEach(s => {
  const div = document.createElement('div');
  div.classList.add('staff-card', 'fade-in-section');
  div.innerHTML = `<img src="${s.img}" alt="${s.name}"><h3>${s.name}</h3>
                   <div class="staff-role">${s.role}</div>
                   <a href="${s.link}" target="_blank">Profilo</a>`;
  staffGrid.appendChild(div);
});

// Logica per l'apertura e chiusura del popup impostazioni
const settingsPopup = document.getElementById('settingsPopup');
const settingsLink = document.getElementById('settingsLink');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');

settingsLink.addEventListener('click', (e) => {
  e.preventDefault();
  settingsPopup.classList.remove('popup-hidden');
  settingsPopup.style.display = 'flex';
  hamburger.classList.remove('active');
  navMobile.classList.remove('show');
});

closeSettingsBtn.addEventListener('click', () => {
  settingsPopup.classList.add('popup-hidden');
});

// Logica per la "Potato Mode"
const potatoModeToggle = document.getElementById('potatoModeToggle');
potatoModeToggle.addEventListener('change', () => {
  if (potatoModeToggle.checked) {
    document.body.classList.add('potato-mode');
  } else {
    document.body.classList.remove('potato-mode');
  }
});

// Logica per l'apertura e chiusura delle FAQ
document.querySelectorAll('.faq-item').forEach(item => {
  item.addEventListener('click', () => {
    item.classList.toggle('active');
  });
});

// Logica per la progress bar di scorrimento
const progressBar = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
  const scrollDistance = document.documentElement.scrollTop || document.body.scrollTop;
  const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const width = (scrollDistance / totalHeight) * 100;
  progressBar.style.width = width + '%';
});

// Logica per il fade-in al caricamento
const faders = document.querySelectorAll('.fade-in-section');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
faders.forEach(el => observer.observe(el));

// Newsletter Brevo
const newsletterForm = document.getElementById('newsletter-form');
const newsletterEmail = document.getElementById('newsletter-email');
const newsletterStatus = document.getElementById('newsletter-status');

newsletterForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = newsletterEmail.value.trim();
  if (!email) return;

  newsletterStatus.textContent = "Invio in corso...";

  try {
    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": "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"
      },
      body: JSON.stringify({
        email: email,
        listIds: [3] // <-- Sostituisci 12345 con l'ID della tua lista Brevo
      })
    });

    if (response.ok) {
      newsletterStatus.textContent = "Grazie! Ti sei iscritto alla newsletter.";
      newsletterForm.reset();
    } else {
      const data = await response.json();
      newsletterStatus.textContent = `Errore: ${data.message || "Impossibile iscriversi."}`;
    }
  } catch (err) {
    newsletterStatus.textContent = "Errore di connessione. Riprova.";
  }
});
