/* LOGIN */
function login() {
  fetch("/login", { method: "POST" })
    .then(res => res.json())
    .then(() => alert("Login successful"));
}

/* FETCH & ALLOCATE TANKERS */
function fetchTankers() {
  fetch("/tankers")
    .then(res => res.json())
    .then(res => {
      let html = `<p>Available Tankers: ${res.count}</p>`;
      res.data.forEach(t => {
        html += `
          <p>
            🚚 ${t.driverName}<br>
            Capacity: ${t.capacity}<br>
            📞 <a href="tel:${t.phone}">${t.phone}</a>
          </p>`;
      });
      document.getElementById("tankerList").innerHTML = html;

      // Automated allocation trigger
      fetch("/send-otp", { method: "POST" });
    });
}

/* OTP VERIFICATION */
function verifyOTP() {
  const otp = document.getElementById("otp").value;

  fetch("/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ otp })
  })
  .then(res => res.json())
  .then(data => alert(data.message));
}

/* PAYMENT */
function payNow() {
  fetch("/payment", { method: "POST" })
    .then(res => res.json())
    .then(data => alert(data.message));
}

/* LIVE MAP */
if (document.getElementById("map")) {
  const map = L.map("map").setView([19.076, 72.877], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

  fetch("/tankers")
    .then(res => res.json())
    .then(res => {
      res.data.forEach(t => {
        let marker = L.marker([t.latitude, t.longitude], {
          icon: L.icon({
            iconUrl: "https://cdn-icons-png.flaticon.com/512/3448/3448339.png",
            iconSize: [40, 40]
          })
        }).addTo(map);

        // 🚚 Moving animation
        let lat = t.latitude;
        let lng = t.longitude;

        setInterval(() => {
          lat += 0.0003;
          lng += 0.0003;
          marker.setLatLng([lat, lng]);
        }, 2000);
      });
    });
}


/* CHATBOT */
function chatBot() {
  const msg = document.getElementById("chatMsg").value;

  fetch("/chatbot", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: msg })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById("botReply").innerText = data.reply;
  });
}

const languageData = {
  en: {
    title: "Water Tanker Booking",
    booking: "My Booking"
  },
  hi: {
    title: "पानी टैंकर बुकिंग",
    booking: "मेरी बुकिंग"
  },
  mr: {
    title: "पाणी टँकर बुकिंग",
    booking: "माझी बुकिंग"
  }
};

function changeLanguage(lang) {
  document.querySelector("h1").innerText = languageData[lang].title;
  document.querySelector("h2").innerText = languageData[lang].booking;
}
