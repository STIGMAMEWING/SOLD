// Ganti dengan webhook Discord Anda
const WEBHOOK_URL = "https://discord.com/api/webhooks/1417179960094883853/9985iNzHJc09P_7WAORvYcINNyPQ-ok1E1Un0VnSkcOf5bfoV7cIZjwAf577Hn7rBaY7";

// Fungsi untuk menyimpan data ke localStorage
function saveData(data) {
  localStorage.setItem("produkData", JSON.stringify(data));
}

// Fungsi untuk mengambil data dari localStorage
function loadData() {
  const storedData = localStorage.getItem("produkData");
  return storedData ? JSON.parse(storedData) : [];
}

// Render produk di list
function renderProduk(data) {
  const list = document.getElementById("stokList");
  list.innerHTML = "";

  if (data.length === 0) {
    list.innerHTML = `<p class="text-gray-400">Belum ada item ditambahkan...</p>`;
  } else {
    data.forEach(item => {
      list.innerHTML += `
        <li class="p-3 bg-gray-700 rounded-lg flex justify-between">
          <div>
            <span class="font-semibold">${item.nama}</span><br>
            <span class="text-gray-400">Rp${item.harga}</span>
          </div>
          <span class="text-sm text-green-400">Stok: ${item.stok}</span>
        </li>`;
    });
  }
  updateStats(data);
}

// Update statistik
function updateStats(data) {
  document.getElementById("total").innerText = data.length;
  document.getElementById("tersedia").innerText = data.filter(p => p.stok > 0).length;
  document.getElementById("terjual").innerText = data.filter(p => p.stok === 0).length;
}

// Tambah produk -> kirim ke webhook
async function tambahProduk() {
  const nama = document.getElementById("namaProduk").value;
  const harga = document.getElementById("hargaProduk").value;
  const status = document.getElementById("statusProduk").value;
  const invenUrl = document.getElementById("invenUrlProduk").value;
  const deskripsi = document.getElementById("deskripsiProduk").value;
  const usernameRoblox = document.getElementById("usernameRoblox").value;
  const stok = document.getElementById("stokProduk").value;
  const fotoInput = document.getElementById("fotoProduk");
  const urlProduk = document.getElementById("urlProduk").value;

  let allData = loadData();
  const itemBaru = { nama, harga, status, invenUrl, deskripsi, usernameRoblox, stok, urlProduk };
  allData.push(itemBaru);
  saveData(allData);
  renderProduk(allData);

  const files = fotoInput.files;

  // Membuat embed dengan emoji dan teks pembelian untuk Discord
  const embed = {
    title: "ROBLOX",
    description: `**⚔️ Harga:** Rp${harga}\n**✅ Status:** ${status || "N/A"}\n**🎒 Inven:** ${invenUrl || "N/A"}\n**🎮 Game:** ${deskripsi || "Uncheck"}\n**👤 Roblox ID:** ${usernameRoblox}\n**📦 Stok:** ${stok}\n\n🔴 **Status Terjual!**\n「 ✦ Terimakasih Sudah Order Di Store Kami ✦ 」  ${urlProduk}`,
    color: 5814783 // Warna biru gelap
  };
  
  try {
    if (files.length > 0) {
      const formData = new FormData();
      
      // Menggunakan gambar pertama sebagai thumbnail embed
      embed.image = { url: `attachment://${files[0].name}` };
      
      const payload = {
        embeds: [embed],
      };
      
      formData.append("payload_json", JSON.stringify(payload));
      
      // Menambahkan semua file yang diunggah ke FormData
      for (let i = 0; i < files.length && i < 10; i++) {
        formData.append(`file${i}`, files[i], files[i].name);
      }

      await fetch(WEBHOOK_URL, { method: "POST", body: formData });
    } else {
      const payload = {
        embeds: [embed]
      };
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }

    alert("Produk berhasil dikirim ke Webhook!");
    resetForm();
  } catch (err) {
    console.error("Gagal kirim webhook:", err);
    alert("Gagal kirim ke Webhook!");
  }
}

// Reset form input
function resetForm() {
  document.getElementById("namaProduk").value = "";
  document.getElementById("hargaProduk").value = "";
  document.getElementById("statusProduk").value = "";
  document.getElementById("invenUrlProduk").value = "";
  document.getElementById("deskripsiProduk").value = "";
  document.getElementById("usernameRoblox").value = "";
  document.getElementById("stokProduk").value = "";
  document.getElementById("fotoProduk").value = "";
}

// Search produk
document.getElementById("search").addEventListener("input", function() {
  const keyword = this.value.toLowerCase();
  const allData = loadData();
  const filtered = allData.filter(p => p.nama.toLowerCase().includes(keyword));
  renderProduk(filtered);
});

// Logout
function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}

// Set profile username
document.getElementById("profileUsername").innerText = localStorage.getItem("loggedInUser");

// Muat data saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
  renderProduk(loadData());
});