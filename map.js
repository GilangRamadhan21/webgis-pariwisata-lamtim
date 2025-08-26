/* --- NAVIGATION --- */
/* Menjadikan navbar selalu berada di atas halaman saat discroll */
.navbar {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 9999; /* agar tidak tertimpa elemen lain */
}

/* --- RESPONSIVE NAVBAR untuk layar kecil (max-width 576px) --- */
@media (max-width: 576px) {
  /* Ukuran teks brand agar tidak terpotong di layar kecil */
  .navbar-brand {
    font-size: 0.95rem;
    white-space: nowrap;
  }

  /* Ukuran tombol toggle navbar pada layar kecil */
  .navbar-toggler {
    padding: 0.25rem 0.5rem;
    font-size: 0.8rem;
  }

  /* Ukuran ikon toggle navbar */
  .navbar-toggler-icon {
    width: 1.2em;
    height: 1.2em;
  }
}

/* --- SECTION ANCHOR PADDING --- */
/* Memberi ruang atas agar anchor tidak tertutup navbar */
#Home,
#Eksplorasi,
#WisataPopuler,
#PetaWisata,
#Kontak {
  padding-top: 80px;
  margin-top: -80px;
}

/* --- HOME SECTION --- */
/* Mengatur tampilan halaman utama dengan latar belakang penuh */
.Home {
  background: url("gambar/bg.jpg") no-repeat center center;
  background-size: cover;
  min-height: 100vh; /* agar memenuhi tinggi layar */
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #fff;
  padding: 2rem;
  position: relative;
}

/* --- WISATA POPULER SECTION --- */
/* Gambar galeri destinasi */
.galeri-img {
  height: 220px;
  object-fit: cover;
  transition: 0.3s ease;
}

/* Efek zoom saat hover */
.galeri-img:hover {
  transform: scale(1.03);
}

/* --- PETA WISATA SECTION --- */
/* Bungkus peta agar berbentuk kotak rapi dengan batas */
.map-wrapper {
  width: 100%;
  height: 600px;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
}

/* Ukuran elemen #map agar memenuhi wrapper */
#map {
  width: 100%;
  height: 100%;
}

/* Scroll untuk daftar destinasi wisata agar tidak melebihi tinggi */
.card-body {
  max-height: 600px;
  overflow-y: auto;
}

.popup-container {
  font-family: 'Segoe UI', sans-serif;
  max-width: 340px;
  max-height: 350px;
  overflow-y: auto;
  padding: 10px;
}

.popup-title {
  margin-bottom: 10px;
  font-weight: 600;
  color: #000000;
  text-align: center;
}

.popup-description {
  text-align: justify;
  font-size: 14px;
  color: rgb(5, 5, 5);
}

.popup-image {
  width: 100%;
  height: 150px; /* misalnya */
  object-fit: cover;
  border-radius: 8px;
  margin: 12px 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.popup-info {
  font-size: 13px;
  line-height: 1.5;
  color: rgb(1, 1, 1);
}

.popup-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

/* --- KONTAK SECTION --- */
/* Tampilan latar belakang dan warna teks bagian kontak */
.kontak {
  background: url("gambar/bgkontak.jpg") no-repeat center center;
  background-size: cover;
  padding-top: 5%;
  color: #fff;
}

/* Gambar profil bulat dengan batas */
.profile-img {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 2px solid #000;
  object-fit: cover;
}

/* Ikon media sosial */
.social {
  font-size: 24px;
  margin: 0 10px;
  color: #000;
  text-decoration: none;
  transition: 0.3s ease-in-out;
}

/* Efek hover ikon media sosial */
.social:hover {
  color: #007bff;
  transform: scale(1.2);
}

/* Menyusun ikon sosial secara horizontal dan merata */
.social-icons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 10px;
}

