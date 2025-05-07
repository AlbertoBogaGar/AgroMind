<template>
  <div class="w-full h-screen bg-gray-50 flex">

    <Sidebar @abrirModal="mostrarModal = true" />
    <AddCultivoModal v-if="mostrarModal" @close="mostrarModal = false" />
    <SidebarMobile/>
  
    <div class="flex-1 p-6 overflow-y-auto pb-24">

      <h1 class="text-2xl font-semibold text-gray-800 mb-6">Editar perfil y parcela</h1>

      
      <div class="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 class="text-xl font-medium text-gray-700 mb-4">Datos del Usuario</h2>
        <form @submit.prevent="actualizarUsuario">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-600">Nombre</label>
              <input v-model="usuario.nombre" class="w-full mt-1 border rounded px-3 py-2 text-gray-700" type="text" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600">Email</label>
              <input v-model="usuario.email" class="w-full mt-1 border rounded px-3 py-2 text-gray-700" type="email" required />
            </div>
          </div>
          <button class="mt-4 bg-[#2e9e90] text-white px-4 py-2 rounded" type="submit">
            Guardar cambios
          </button>
        </form>
      </div>
      
     
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-medium text-gray-700 mb-4">Ubicación de la Parcela</h2>
        <div id="map" class="w-full h-96 rounded z-0"></div>

        <p class="mt-4 text-sm text-gray-600">Haz clic en el mapa para seleccionar una nueva ubicación.</p>
        <button class="mt-4 bg-[#2e9e90] text-white px-4 py-2 rounded" @click="guardarUbicacion">
          Guardar ubicación
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Sidebar from "@/components/Sidebar.vue";
import SidebarMobile from "@/components/SidebarMobile.vue";
import axios from "axios";
import AddCultivoModal from "@/components/AddCultivoModal.vue";
const BASE_URL = import.meta.env.VITE_BASE_URL;


export default {
  name: "Perfil",
  components: { Sidebar,SidebarMobile, AddCultivoModal },
  data() {
    return {
      usuario: {
        nombre: "",
        email: ""
      },
      parcela: {
        latitud: 40.4168,
        longitud: -3.7038
      },
      map: null,
      marker: null,
      mostrarModal:false
    };
  },
  methods: {
    async cargarDatos() {
      try {
        const token = localStorage.getItem("token");

        const userRes = await axios.get(`${BASE_URL}api/auth/perfil`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(userRes);
        
        this.usuario = userRes.data;

        const parcelaRes = await axios.get(`${BASE_URL}api/parcela`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const { latitud, longitud } = parcelaRes.data.parcela;
        this.parcela = { latitud, longitud };

        this.$nextTick(() => this.initMap());
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    },
    initMap() {
      this.map = L.map("map").setView([this.parcela.latitud, this.parcela.longitud], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(this.map);

      this.marker = L.marker([this.parcela.latitud, this.parcela.longitud], { draggable: true }).addTo(this.map);

      this.map.on("click", (e) => {
        const { lat, lng } = e.latlng;
        this.parcela.latitud = lat;
        this.parcela.longitud = lng;
        this.marker.setLatLng([lat, lng]);
      });
    },
    async actualizarUsuario() {
      try {
        const token = localStorage.getItem("token");
        await axios.put(`${BASE_URL}api/auth/perfil/actualizar`, this.usuario, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Perfil actualizado correctamente");
      } catch (error) {
        console.error("Error al actualizar perfil:", error);
      }
    },
    async guardarUbicacion() {
      try {
        const token = localStorage.getItem("token");
        await axios.put(`${BASE_URL}api/parcela/ubicacion`, this.parcela, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Ubicación guardada correctamente");
      } catch (error) {
        console.error("Error al actualizar ubicación:", error);
      }
    }
  },
  created() {
    this.cargarDatos();
  }
};
</script>

<style>
#map {
  height: 400px;
}
</style>
