// scriptforindex.js
document.addEventListener("DOMContentLoaded", () => {
  const menuToggleButton = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  // Tambahkan log ini untuk memastikan elemen ditemukan saat DOMContentLoaded
  if (menuToggleButton) {
    console.log("Tombol menu 'menu-toggle' ditemukan.");
  } else {
    console.error(
      "Elemen dengan ID 'menu-toggle' TIDAK ditemukan saat DOMContentLoaded."
    );
  }

  if (mobileMenu) {
    console.log("Elemen menu 'mobile-menu' ditemukan.");
  } else {
    console.error(
      "Elemen dengan ID 'mobile-menu' TIDAK ditemukan saat DOMContentLoaded."
    );
  }

  if (menuToggleButton && mobileMenu) {
    menuToggleButton.addEventListener("click", () => {
      // Log ini akan muncul SETIAP KALI tombol di-klik jika listener aktif
      console.log("Tombol hamburger DIKLIK!");
      mobileMenu.classList.toggle("hidden");
      // Log ini untuk melihat status class setelah di-toggle
      console.log(
        "Kelas 'hidden' pada mobileMenu di-toggle. Kelas saat ini:",
        mobileMenu.className
      );
    });
    console.log(
      "Event listener untuk klik sudah ditambahkan ke 'menu-toggle'."
    );
  }
});
