<template>
  <div class="flex w-full h-screen bg-gray-50">
    <!-- Sidebar -->
    <Sidebar class="hidden md:flex" />

    <!-- Contenido principal -->
    <div class="flex-1 flex flex-col overflow-y-auto">
      <div class="p-6">
        <router-link to="/cultivos" class="text-sm text-gray-600 flex items-center mb-4 hover:underline">
          <svg class="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Volver
        </router-link>

        <!-- Cabecera -->
        <div class="bg-gradient-to-r from-[#e0f5f3] to-white rounded-xl p-6 shadow mb-6">
          <h1 class="text-2xl font-bold text-gray-800">{{ cultivo.tipoCultivo?.nombre || 'Cultivo' }}</h1>
        </div>

        <!-- Contenido -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Info cultivo -->
          <div class="bg-white rounded-lg p-4 shadow border">
            <h2 class="text-md font-semibold text-gray-800 mb-2">Información del cultivo</h2>
            <p class="text-gray-800"><strong>Tipo:</strong> {{ cultivo.tipoCultivo?.nombre }}</p>
            <p class="text-gray-800"><strong>Área:</strong> {{ parcela.tamaño }} ha</p>
            <p class="text-gray-800"><strong>Localización:</strong> {{ parcela.ubicacion || '—' }}</p>
            <p class="text-gray-800"><strong>Actividades:</strong> {{ actividades.length }}</p>
          </div>

          <!-- Días para cosecha -->
          <div class="bg-white rounded-lg p-4 shadow border">
            <h2 class="text-md font-semibold text-gray-800 mb-2">Días para cosecha</h2>
            <div class="w-full bg-gray-200 h-2 rounded-full mb-1">
              <div class="bg-[#2e9e90] h-2 rounded-full" :style="{ width: progreso + '%' }"></div>
            </div>
            <p class="text-sm text-right text-gray-500">{{ diasRestantes }} días restantes</p>
          </div>
        </div>
      </div>
      <div class="mt-10 px-6">
  <div class="bg-white rounded-lg p-6 shadow border">
    <h3 class="text-lg font-semibold text-gray-800 mb-4">Recomendaciones</h3>

    <div v-for="rec in recomendaciones" :key="rec.id" class="mb-4 border-l-4 pl-4"
      :class="{
        'border-red-500': rec.tipo === 'Grave',
        'border-yellow-500': rec.tipo === 'Media',
        'border-blue-500': rec.tipo === 'Leve',
      }"
    >
      <div class="flex items-center justify-between">
        <h4 class="text-md font-semibold text-gray-900">{{ rec.titulo }}</h4>
        <span
          class="text-xs font-bold uppercase"
          :class="{
            'text-red-600': rec.tipo === 'Grave',
            'text-yellow-600': rec.tipo === 'Media',
            'text-blue-600': rec.tipo === 'Leve',
          }"
        >
          {{ rec.tipo }}
        </span>
      </div>
      <p class="text-sm text-gray-700 mt-1">{{ rec.descripcion }}</p>
    </div>
  </div>
</div>

    </div>




  </div>
</template>

<script>
import Sidebar from "@/components/Sidebar.vue";
import axios from "axios";

export default {
  name: "DetalleCultivo",
  components: { Sidebar },
  data() {
    return {
      cultivo: {},
      parcela: {},
      actividades: [],
      diasRestantes: 0,
      progreso: 0,
      recomendaciones: []
    };

  },
  methods: {
    async obtenerRecomendaciones() {
  try {
    const token = localStorage.getItem("token");
    const cultivoId = this.$route.params.id;
    
    const response = await axios.get(
      `http://localhost:5000/api/recomendacion/cultivo/${cultivoId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data && response.data.recomendaciones) {
      this.recomendaciones = response.data.recomendaciones;
      console.log("🌱 Recomendaciones del cultivo:", this.recomendaciones);
    } else {
      console.warn("⚠️ No se encontraron recomendaciones para este cultivo.");
      this.recomendaciones = [];
    }

  } catch (error) {
    console.error("❌ Error al obtener recomendaciones del cultivo:", error);
  }
}

  },
  async created() {
    const id = this.$route.params.id;
    const token = localStorage.getItem("token");

    const response = await axios.get(`http://localhost:5000/api/cultivo/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    this.cultivo = response.data;
    this.parcela = response.data.parcela || {};
    this.actividades = response.data.actividades || [];

    const siembra = new Date(this.cultivo.fechaSiembra);
    const ciclo = parseInt(this.cultivo.tipoCultivo?.cicloVida, 10);
    const cosecha = new Date(siembra);
    cosecha.setDate(siembra.getDate() + ciclo);
    const hoy = new Date();

    this.diasRestantes = Math.max(0, Math.ceil((cosecha - hoy) / (1000 * 60 * 60 * 24)));
    const diasTotales = (cosecha - siembra) / (1000 * 60 * 60 * 24);
    const diasPasados = (hoy - siembra) / (1000 * 60 * 60 * 24);
    this.progreso = Math.min(100, (diasPasados / diasTotales) * 100);
    await this.obtenerRecomendaciones();
  }
};
</script>