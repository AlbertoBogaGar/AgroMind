<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="bg-white p-8 rounded-lg shadow-lg w-96 max-w-md m-4">
      <h2 class="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#2e9e90] mr-2" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2a10 10 0 1 0 10 10H12V2z"></path>
          <path d="M12 2a10 10 0 0 1 10 10h-10V2z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
        Registra tu parcela
      </h2>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tamaño (m²):</label>
          <input v-model="tamaño" type="number"
            class="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2e9e90]"
            placeholder="Ejemplo: 500" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Provincia:</label>
          <input 
            v-model="provinciaBusqueda"
            list="listaProvincias"
            @change="asignarProvinciaSeleccionada"
            class="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2e9e90]"
            placeholder="Busca tu provincia"
          />
          <datalist id="listaProvincias">
            <option 
              v-for="prov in provincias" 
              :key="prov.id" 
              :value="prov.nombre">
            </option>
          </datalist>
        </div>

        <!-- Ubicación -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Ubicación en Google Maps:</label>
          <div class="flex gap-2">
            <input v-model="lat" type="text"
              class="w-1/2 px-3 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2e9e90]"
              placeholder="Latitud" />
            <input v-model="lng" type="text"
              class="w-1/2 px-3 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2e9e90]"
              placeholder="Longitud" />
          </div>
        </div>

        <button @click="obtenerUbicacion"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          Obtener Ubicación
        </button>

        <button @click="registrarParcela"
          class="w-full bg-[#2e9e90] hover:bg-[#278e82] text-white font-medium py-2 px-4 rounded-md flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Guardar Parcela
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;


export default {
  name: "ParcelaModal",
  emits: ["onRegistroExitoso"],
  data() {
    return {
      tamaño: "",
      idProvincia: "",
      lat: "",
      lng: "",
      mensaje: "",
      success: false,
      provincias: [],
      provinciaBusqueda: "",
    };
  },
  methods: {
    async obtenerProvincias() {
      try {
        const response = await axios.get(`${BASE_URL}api/parcela/provincias`);
        this.provincias = response.data;
      } catch (error) {
        console.error("Error al obtener provincias:", error);
      }
    },

    asignarProvinciaSeleccionada() {
      const seleccionada = this.provincias.find(p =>
        p.nombre.toLowerCase() === this.provinciaBusqueda.toLowerCase()
      );
      this.idProvincia = seleccionada ? seleccionada.id : "";
    },

    obtenerUbicacion() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.lat = position.coords.latitude.toFixed(6);
            this.lng = position.coords.longitude.toFixed(6);
          },
          (error) => {
            console.error("Error obteniendo ubicación", error);
            this.mensaje = "No se pudo obtener la ubicación. Activa la geolocalización.";
            this.success = false;
          }
        );
      } else {
        this.mensaje = "Tu navegador no soporta geolocalización.";
        this.success = false;
      }
    },

    async registrarParcela() {
      if (!this.validarDatos()) return;
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          `${BASE_URL}api/parcela`,
          {
            idProvincia: this.idProvincia,
            latitud: this.lat,
            longitud: this.lng,
            tamaño: this.tamaño,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        this.mensaje = "Parcela registrada correctamente.";
        this.success = true;
        this.$emit("onRegistroExitoso", response.data.parcela);
      } catch (error) {
        console.error("Error al registrar parcela:", error);
        this.mensaje = "Error al registrar la parcela.";
        this.success = false;
      }
    },

    validarDatos() {
      if (!this.tamaño || this.tamaño <= 0) {
        this.mensaje = "El tamaño debe ser un número positivo.";
        this.success = false;
        return false;
      }
      if (!this.lat || !this.lng || this.lat < -90 || this.lat > 90 || this.lng < -180 || this.lng > 180) {
        this.mensaje = "Coordenadas inválidas. Verifica latitud y longitud.";
        this.success = false;
        return false;
      }
      if (!this.idProvincia) {
        this.mensaje = "Debes seleccionar una provincia válida.";
        this.success = false;
        return false;
      }
      return true;
    },
  },
  created() {
    this.obtenerProvincias();
  }
};
</script>

<style scoped>
button {
  transition: background-color 0.3s;
}
</style>
