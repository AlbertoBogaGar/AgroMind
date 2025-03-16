<template>
  <div class="relative w-full h-screen p-6">
 
    <div v-if="!tieneParcela" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 class="text-lg font-bold mb-4 text-center">🌿 Registra tu Parcela</h2>

        <label class="block text-sm font-medium text-black">Tamaño (m²):</label>
        <input v-model="tamaño" type="number" class="border p-2 w-full rounded mb-2 text-black" placeholder="Ejemplo: 500" />

        <label class="block text-sm font-medium text-black">Provincia:</label>
        <input v-model="provincia" type="text" class="border p-2 w-full rounded mb-2" placeholder="Ejemplo: Valladolid" />

        <label class="block text-sm font-medium text-black">Ubicación en Google Maps:</label>
        <div class="flex gap-2">
          <input v-model="lat" type="text" class="border p-2 w-1/2 rounded mb-2 text-black" placeholder="Latitud" />
          <input v-model="lng" type="text" class="border p-2 w-1/2 rounded mb-2 text-black" placeholder="Longitud" />
        </div>

        <button @click="obtenerUbicacion" class="bg-blue-600 text-white px-4 py-2 mt-2 rounded w-full hover:bg-blue-700">
          📍 Obtener Ubicación
        </button>

        <button @click="registrarParcela" class="bg-green-600 text-white px-4 py-2 mt-2 rounded w-full hover:bg-green-700">
          ✅ Guardar Parcela
        </button>
      </div>
    </div>


    <div v-else class="grid grid-cols-3 grid-rows-3 gap-4">
      <div class="col-span-2 row-span-2 bg-green-400 p-6 rounded-lg shadow-lg">
        <h2 class="text-xl font-bold">Información de la Parcela</h2>
        <p>📍 Ubicación: {{ parcela.latitud }}, {{ parcela.longitud }}</p>
        <p>📏 Tamaño: {{ parcela.tamaño }} m²</p>
      </div>

      <div class="bg-red-400 p-6 rounded-lg shadow-lg">
        <h2 class="text-lg font-bold">Alertas</h2>
        <p>⚠️ Sin alertas nuevas</p>
      </div>

      <div class="bg-yellow-400 p-6 rounded-lg shadow-lg">
        <h2 class="text-lg font-bold">Recomendaciones</h2>
        <p>🌱 Riega los tomates mañana.</p>
      </div>

      <div class="col-span-2 bg-brown-600 p-6 rounded-lg shadow-lg text-white">
        <h2 class="text-lg font-bold">Lista de Cultivos</h2>
        <p>🌽 Maíz, 🍅 Tomates, 🥕 Zanahorias</p>
      </div>

      <div class="bg-green-600 p-6 rounded-lg shadow-lg text-white cursor-pointer hover:bg-green-700">
        <h2 class="text-lg font-bold">➕ Añadir Cultivo</h2>
      </div>

      <div class="bg-blue-400 p-6 rounded-lg shadow-lg text-white cursor-pointer hover:bg-blue-500">
        <h2 class="text-lg font-bold">👤 Perfil</h2>
      </div>

      <div class="bg-gray-200 p-6 rounded-lg shadow-lg cursor-pointer hover:bg-gray-300" @click="logout">
        <h2 class="text-lg font-bold text-black">🔒 Cerrar Sesión</h2>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Dashboard",
  data() {
    return {
      tieneParcela: localStorage.getItem("tieneParcela")==="true" ,
      tamaño: "",
      provincia: "",
      lat: "",
      lng: "",
      parcela: {}
    };
  },
  async created() {
    await this.verificarParcela();
  },
  methods: {
    async verificarParcela() {
      const token = localStorage.getItem("token");

      if (!token) {
        this.$router.push("/");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/parcela", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.parcela) {
          this.tieneParcela = true;
          this.parcela = response.data.parcela;
          localStorage.setItem("tieneParcela", "true");
        } else {
          this.tieneParcela = false;
          localStorage.setItem("tieneParcela", "false");
        }
      } catch (error) {
        console.error("Error al verificar parcela:", error);
        this.tieneParcela = false;
      }
    },
    async obtenerUbicacion() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.lat = position.coords.latitude.toFixed(6);
            this.lng = position.coords.longitude.toFixed(6);
          },
          (error) => {
            console.error("Error obteniendo ubicación", error);
            alert("No se pudo obtener la ubicación. Activa la geolocalización.");
          }
        );
      } else {
        alert("Tu navegador no soporta geolocalización.");
      }
    },
    async registrarParcela() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          "http://localhost:5000/api/parcela",
          {
            idProvincia: this.provincia,
            latitud: this.lat,
            longitud: this.lng,
            tamaño: this.tamaño
          },
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        );

       
        localStorage.setItem("tieneParcela", "true");
        this.tieneParcela = true;
        this.parcela = response.data.parcela;

        alert("✅ Parcela registrada correctamente");
      } catch (error) {
        console.error("Error al registrar parcela:", error);
        alert("❌ No se pudo registrar la parcela");
      }
    },
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("tieneParcela");
      this.$router.push("/");
    }
  }
};
</script>
