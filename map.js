// Inisialisasi peta di tengah wilayah Lampung Timur
var map = L.map('map').setView([-5.1100, 105.6700], 9.1);

// === BASE LAYER (PETA DASAR) ===
// OpenStreetMap standar
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  minZoom: 5,
  maxZoom: 18,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

// OpenStreetMap versi Humanitarian (HOT)
var osmHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team'
});

// Peta citra satelit dari Esri
var esriSat = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  maxZoom: 19,
  attribution: 'Tiles &copy; Esri, Maxar, Earthstar Geographics, and the GIS User Community'
});

// Menambahkan layer default ke peta (Esri Satellite)
esriSat.addTo(map);

// === LAYER BATAS ADMINISTRASI ===
// Membuat layer GeoJSON kosong untuk batas administrasi
var batasadministrasilamtim = L.geoJSON(null, {
  style: function(feature) {
    return {
      color: "yellow",       // warna garis
      weight: 1,             // ketebalan
      opacity: 1,
      fillOpacity: 0         // tidak diisi warna (transparan)
    };
  }
});

// Memuat data batas dari file GeoJSON
fetch('geojeson/batasadministrasilamtim.geojson')
  .then(res => res.json())
  .then(data => batasadministrasilamtim.addData(data))
  .catch(err => console.error("Error batas desa:", err));

batasadministrasilamtim.addTo(map);

// === LAYER JARINGAN JALAN ===
var jaringanJalan = L.geoJSON(null, {
  style: function(feature) {
    return {
      color: "red",
      weight: 1,
      opacity: 1
    };
  }
});

// Memuat data jalan dari file GeoJSON
fetch('geojeson/jaringanjalan.geojson')
  .then(res => res.json())
  .then(data => jaringanJalan.addData(data))
  .catch(err => console.error("Error jaringan jalan:", err));


// === LAYER WISATA LAMPUNG TIMUR ===
// Untuk menyimpan marker berdasarkan ID
var markerMap = {};
// Objek kontrol rute
var routingControl = null;
// ID marker aktif untuk popup rute
var activeRouteMarkerId = null;

// Layer GeoJSON untuk marker wisata
var wisatalampungtimur = L.geoJSON(null, {
  pointToLayer: function (feature, latlng) {
    
    function popupTemplate(extra = '') {
  const {
    Nama,
    Deskripsi,
    Alamat,
    Jam_Buka,
    Fasilitas,
    Tiket_Masuk,
    Foto,
    ID
  } = feature.properties;

  return `
    <div class="popup-container">
      
      <!-- Judul -->
      <h5 class="popup-title">${Nama}</h5>
      
      <!-- Deskripsi -->
      <p class="popup-description">${Deskripsi}</p>
      
      <!-- Foto -->
      <img src="${Foto}" alt="Foto Wisata" class="popup-image">
      
      <!-- Informasi Teknis -->
      <div class="popup-info">
        <b>Alamat:</b> ${Alamat}<br>
        <b>Jam Buka:</b> ${Jam_Buka}<br>
        <b>Fasilitas:</b> ${Fasilitas}<br>
        <b>Tiket Masuk:</b> ${Tiket_Masuk}<br>
      </div>

      <!-- Tombol Interaksi -->
      <div class="popup-buttons">
        <button onclick="tampilkanRute(${latlng.lat}, ${latlng.lng}, ${ID})" class="btn btn-sm btn-primary">
          Tampilkan Rute
        </button>
        <button onclick="hapusRute()" class="btn btn-sm btn-outline-danger">
          Hapus Rute
        </button>
      </div>

      ${extra}
    </div>
  `;
}

    // Membuat marker dan menyimpan popupTemplate untuk dipanggil ulang saat dibutuhkan
    var marker = L.marker(latlng).bindPopup(popupTemplate());
    markerMap[feature.properties.ID] = marker;
    marker.popupTemplate = popupTemplate;

    return marker;
  }
});


// Memuat file GeoJSON koordinat pariwisata
fetch('geojeson/wisatalampungtimur.geojson')
  .then(res => res.json())
  .then(data => {
    wisatalampungtimur.addData(data);
    map.addLayer(wisatalampungtimur);

    // Interaksi: klik daftar ➜ fokus ke marker
    document.querySelectorAll('.wisata-item').forEach(function(item) {
      item.addEventListener('click', function() {
        var id = this.getAttribute('data-id');
        var marker = markerMap[id];
        if (marker) {
          map.setView(marker.getLatLng(), 14); // pindahkan tampilan peta
          marker.openPopup(); // buka popup-nya
        } else {
          console.warn("Marker tidak ditemukan untuk ID:", id);
        }
      });
    });
  })
  .catch(err => console.error("Error koordinat wisata:", err));



// === FUNGSI TAMPILKAN RUTE ===
// Menampilkan rute dari lokasi pengguna ke titik wisata
function tampilkanRute(latTujuan, lngTujuan, id) {
  if (!navigator.geolocation) {
    alert("Browser Anda tidak mendukung geolokasi.");
    return;
  }

  navigator.geolocation.getCurrentPosition(function(position) {
    var latAsal = position.coords.latitude;
    var lngAsal = position.coords.longitude;

    // Hapus rute sebelumnya jika ada
    if (routingControl !== null) {
      map.removeControl(routingControl);
      routingControl = null;
    }

    // Buat kontrol routing baru
    routingControl = L.Routing.control({
      waypoints: [
        L.latLng(latAsal, lngAsal),
        L.latLng(latTujuan, lngTujuan)
      ],
      router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1'
      }),
      lineOptions: {
        styles: [{ color: 'blue', opacity: 0.7, weight: 5 }]
      },
      createMarker: function() { return null; }, // tidak menampilkan marker rute
      routeWhileDragging: false,
      show: false,
      addWaypoints: false
    }).addTo(map)
      .on('routesfound', function(e) {
        // Hitung estimasi jarak dan waktu
        var route = e.routes[0];
        var waktuMenit = Math.round(route.summary.totalTime / 60);
        var jarakKm = (route.summary.totalDistance / 1000).toFixed(2);

        var info = "<div class='mt-2 text-muted small'>&#128337; Perkiraan: " + waktuMenit + " menit (" + jarakKm + " km)</div>";

        // Perbarui isi popup marker
        var marker = markerMap[id];
        if (marker && marker.popupTemplate) {
          marker.setPopupContent(marker.popupTemplate(info)).openPopup();
          activeRouteMarkerId = id;
        }
      });

  }, function() {
    alert("Tidak dapat mengakses lokasi Anda.");
  });
}


// === FUNGSI HAPUS RUTE ===
// Menghapus rute dari peta dan reset popup
function hapusRute() {
  if (routingControl !== null) {
    map.removeControl(routingControl);
    routingControl = null;
  }

  if (activeRouteMarkerId !== null && markerMap[activeRouteMarkerId]) {
    var marker = markerMap[activeRouteMarkerId];
    marker.setPopupContent(marker.popupTemplate()).openPopup();
    activeRouteMarkerId = null;
  }
}


// === KONTROL LAYER (Layer Control) ===
// Peta dasar (base maps)
var baseMaps = {
  "OpenStreetMap": osm,
  "OpenStreetMap HOT": osmHOT,
  "Citra Satelit": esriSat
};

// Layer tambahan (overlay)
var overlayMaps = {
  "Batas Administrasi": batasadministrasilamtim,
  "Jaringan Jalan": jaringanJalan,
  "Koordinat Pariwisata": wisatalampungtimur
};

// Menambahkan kontrol layer ke peta
L.control.layers(baseMaps, overlayMaps, { collapsed: true }).addTo(map);
