// Import modul yang diperlukan
import express from "express";
import "dotenv/config";
import { pool } from "./db.js";
import path from "path"; // Tambahkan import path
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { error } from "node:console";

const app = express();
const port = 3000;

// Mendapatkan __dirname di ES6 module
const __dirname = dirname(fileURLToPath(import.meta.url));

// Set view engine HBS dan folder views
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src/views"));

// Middleware untuk melayani file statis (CSS, JS, gambar)
app.use(express.static(path.join(__dirname, "src/assets")));

// Function untuk menformat tanggal menjadi "Bulan Tahun"
function formatWorkDate(date, locale = "id-ID") {
  if (!date) return "Sekarang"; // Jika null/tidak ada isinya
  const d = new Date(date);
  return d.toLocaleDateString(locale, { year: "numeric", month: "long" });
}

// Routing ke index.hbs
app.get("/home", async (req, res) => {
  try {
    console.log(
      "Mengakses route /home untuk merender index.hbs dengan data skills..."
    );

    // 1. Ambil data skills dari database
    // Pastikan nama kolom 'skill_name' sudah benar di tabel Anda.
    const skillsResult = await pool.query(
      "SELECT id, skill_name, icon_filename FROM public.skills ORDER BY id ASC" // Saya asumsikan nama kolom adalah 'skill_name'
    );
    let skillsFromDB = skillsResult.rows;
    console.log("Data skills dari DB:", JSON.stringify(skillsFromDB, null, 2)); // Untuk debugging

    // 2. Siapkan data untuk 8 item carousel (sesuai CSS .item1 s/d .item8)
    const totalItemsForCarousel = 10;
    let displayItems = [];

    if (skillsFromDB.length > 0) {
      for (let i = 0; i < totalItemsForCarousel; i++) {
        displayItems.push({
          skill: skillsFromDB[i % skillsFromDB.length], // Ulangi skills jika jumlahnya kurang dari 8
          itemClass: `item${i + 1}`, // Untuk class .item1, .item2, dst.
        });
      }
    } else {
      // Jika tidak ada data skill, buat data placeholder agar struktur carousel tetap ada
      console.log(
        "Tidak ada skills di DB, menggunakan placeholder untuk carousel."
      );
      for (let i = 0; i < totalItemsForCarousel; i++) {
        displayItems.push({
          skill: {
            skill_name: `Contoh ${i + 1}`,
            icon_filename: "placeholder.png",
          }, // Anda bisa siapkan file placeholder.png
          itemClass: `item${i + 1}`,
        });
      }
    }
    console.log(
      "Data yang akan dikirim ke template index.hbs:",
      JSON.stringify(displayItems, null, 2)
    ); // Untuk debugging

    // Ambil data pengalaman kerja
    const workResult = await pool.query(
      "SELECT id, name, location, start_date, end_date, jobdesc, techs, image FROM public.work ORDER BY start_date DESC" // Sorter berdasarkan tanggal
    );
    let workExperiencesFromDB = workResult.rows;

    const formattedWorkExperiences = workExperiencesFromDB.map((job) => ({
      ...job,
      display_start_date: formatWorkDate(job.start_date),
      display_end_date: formatWorkDate(job.end_date),
      jobdesc_list: Array.isArray(job.jobdesc)
        ? job.jobdesc
        : job.jobdesc
        ? [job.jobdesc]
        : [], // Memastikan job adalah array
      tech_list: Array.isArray(job.techs)
        ? job.techs
        : job.techs
        ? [job.techs]
        : [], // Memastikan tech adalah array
    }));
    console.log(
      "Data work dari DB:",
      JSON.stringify(formattedWorkExperiences, null, 2)
    );

    // Ambil data projects dari Database
    const projectsResult = await pool.query(
      "SELECT id, name, description, techs, code, demo, image FROM public.projects ORDER BY id ASC"
    );
    let projectsFromDB = projectsResult.rows;

    const formatProjects = projectsFromDB.map((projects) => ({
      ...projects,
      projects_list: Array.isArray(projects.techs)
        ? projects.techs
        : projects.techs
        ? [projects.techs]
        : [],
    }));
    console.log(
      "Data Projects dari DB:",
      JSON.stringify(formatProjects, null, 2)
    );

    // Render index dan mengirim kedua data tersebut ke halaman index
    res.render("index", {
      skillsForCarousel: displayItems, // Mengirim data skills
      workExperiences: formattedWorkExperiences, // Mengirim data pengalaman kerja
      projectDjembaraa: formatProjects,
      pageTitle: "Djembar Arafat",
    });
  } catch (err) {
    console.error("Error di route /home:", err.stack);
    res.status(500).send("Terjadi kesalahan saat memuat");
  }
});

// Routing ke index.hbs
// Routing ke index.hbs (HALAMAN /home SEKARANG AKAN MENGAMBIL DATA SKILLS)
// app.get("/home", async (req, res) => {
// try {
//   console.log(
//     "Mengakses route /home untuk merender index.hbs dengan data skills..."
//   );

//   // 1. Ambil data skills dari database
//   // Pastikan nama kolom 'skill_name' sudah benar di tabel Anda.
//   const skillsResult = await pool.query(
//     "SELECT id, skill_name, icon_filename FROM public.skills ORDER BY id ASC" // Saya asumsikan nama kolom adalah 'skill_name'
//   );
//   let skillsFromDB = skillsResult.rows;
//   console.log("Data skills dari DB:", JSON.stringify(skillsFromDB, null, 2)); // Untuk debugging

//   // 2. Siapkan data untuk 8 item carousel (sesuai CSS .item1 s/d .item8)
//   const totalItemsForCarousel = 10;
//   let displayItems = [];

//   if (skillsFromDB.length > 0) {
//     for (let i = 0; i < totalItemsForCarousel; i++) {
//       displayItems.push({
//         skill: skillsFromDB[i % skillsFromDB.length], // Ulangi skills jika jumlahnya kurang dari 8
//         itemClass: `item${i + 1}`, // Untuk class .item1, .item2, dst.
//       });
//     }
//   } else {
//     // Jika tidak ada data skill, buat data placeholder agar struktur carousel tetap ada
//     console.log(
//       "Tidak ada skills di DB, menggunakan placeholder untuk carousel."
//     );
//     for (let i = 0; i < totalItemsForCarousel; i++) {
//       displayItems.push({
//         skill: {
//           skill_name: `Contoh ${i + 1}`,
//           icon_filename: "placeholder.png",
//         }, // Anda bisa siapkan file placeholder.png
//         itemClass: `item${i + 1}`,
//       });
//     }
//   }
//   console.log(
//     "Data yang akan dikirim ke template index.hbs:",
//     JSON.stringify(displayItems, null, 2)
//   ); // Untuk debugging

//     // 3. Render 'index.hbs' dan kirim data 'skillsForCarousel' ke template
//     res.render("index", {
//       skillsForCarousel: displayItems,
//       // Anda bisa menambahkan variabel lain di sini jika dibutuhkan oleh index.hbs
//       // Misalnya: pageTitle: "Beranda - Djembar Arafat"
//     });
//   } catch (err) {
//     console.error("Error di route /home:", err.stack);
//     // Kirim halaman error atau pesan error sederhana
//     res
//       .status(500)
//       .send(
//         "Terjadi kesalahan saat memuat halaman. Silakan coba lagi nanti atau cek konsol server."
//       );
//   }
// });

// Route untuk halaman utama "/", bisa diarahkan ke /home
app.get("/", (req, res) => {
  res.redirect("/home");
});

// API Endpoint (sudah ada, path diperbaiki dan potensi typo nama kolom)
// Ini tidak digunakan untuk merender index.hbs secara langsung, tapi baik untuk dimiliki jika dibutuhkan API terpisah.

// API skills dari Database
app.get("/api/skills", async (req, res) => {
  // Path diperbaiki dari "api/skills"
  try {
    const result = await pool.query(
      "SELECT id, skill_name, icon_filename FROM public.skills ORDER BY skill_name ASC" // Saya asumsikan 'skill_name'
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error mengambil data untuk API /api/skills: ", err.stack);
    res.status(500).json({
      error:
        "Terjadi kesalahan pada server pada saat pengambilan database untuk API",
    });
  }
});

// API work dari Database
app.get("/api/work", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, location, start_date, end_date, jobdesc, techs, image FROM public.projects ORDER BY name ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error saat pengambilan database work: ", err.stack);
    res.status(500).json({
      error: "Terjadi kesalahan pada server",
    });
  }
});

// API projects dari Database
app.get("/api/work", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, description, techs, code, demo, image FROM public.work ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error saat pengambilan database work: ", err.stack);
    res.status(500).json({
      error: "Terjadi kesalahan pada server",
    });
  }
});

// Menjalankan server
app.listen(port, () => {
  console.log(`Server DJEMBAR ARAFAT berjalan di http://localhost:${port}`);
  console.log(`Akses halaman utama di http://localhost:${port}/home`);
});
