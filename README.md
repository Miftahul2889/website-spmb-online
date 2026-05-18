# Website SPMB Online Madrasah

Template front-end website SPMB (Seleksi Penerimaan Murid Baru) untuk Madrasah dengan desain modern dan responsif.

## Fitur

- ✅ Halaman pendaftaran multi-tahap (5 langkah)
- ✅ Desain responsif untuk desktop dan mobile
- ✅ Validasi form otomatis
- ✅ CAPTCHA demo untuk keamanan
- ✅ Unggah berkas dengan validasi ukuran
- ✅ Preview konfirmasi data
- ✅ Simpan draft otomatis ke localStorage
- ✅ Fungsi cetak bukti pendaftaran
- ✅ Interface yang user-friendly dan accessible

## Tahap Pendaftaran

1. **Data Awal Peserta** - NIK, sekolah asal, tahun lulus, dan verifikasi CAPTCHA
2. **Biodata & Alamat** - Data lengkap peserta dan alamat domisili
3. **Data Tambahan** - Data keluarga, wali, dan kondisi pendukung
4. **Unggah Berkas** - Upload dokumen pendukung (max 2MB per file)
5. **Konfirmasi Data** - Review data sebelum pengiriman

## Cara Penggunaan

1. Ekstrak file ke folder lokal Anda
2. Buka `index.html` di browser web
3. Customisasi nama madrasah, logo, dan field sesuai kebutuhan
4. Untuk produksi, hubungkan form ke backend (Laravel, CodeIgniter, Node.js, PHP, dll)

## Struktur File

```
website-spmb-online/
├── index.html      # Template HTML utama
├── style.css       # Stylesheet
├── script.js       # JavaScript logic
├── README.md       # Dokumentasi
└── assets/         # Folder untuk gambar
    ├── logo-mis-nuris.png
    └── siswa-nurul-ikhsan.png
```

## Customization

### Mengubah Nama Madrasah
Buka `index.html` dan cari elemen dengan id `schoolTitle` atau ubah teks di bagian hero section.

### Menambah/Mengurangi Field
Edit bagian form di `index.html` sesuai dengan kebutuhan, kemudian update `script.js` jika ada validasi khusus.

### Mengubah Warna
Tarik warna di `:root` di bagian atas `style.css`:
- `--green`: Warna utama (default: #00b874)
- `--blue`: Warna sekunder
- `--danger`: Warna warning/error

## Backend Integration

Untuk menyimpan data ke database, hubungkan ke backend API Anda:

```javascript
// Di akhir form submission, ubah menjadi:
const formData = new FormData(form);
fetch('/api/pendaftaran', {
  method: 'POST',
  body: formData
}).then(res => res.json())
  .then(data => console.log('Success:', data))
  .catch(error => console.error('Error:', error));
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Lisensi

Free to use and modify for personal and commercial projects.

## Catatan

- Template ini hanya front-end. Data tidak disimpan ke server.
- Gunakan localStorage hanya untuk draft, bukan penyimpanan data final.
- Untuk produksi, implementasikan validasi server-side dan enkripsi data.

## Support

Jika Anda menemukan bug atau memiliki saran, silakan buat issue atau pull request.
