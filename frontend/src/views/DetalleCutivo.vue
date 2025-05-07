<template>
  <div class="flex w-full h-screen bg-gray-50">

    <Sidebar class="hidden md:flex" />

    <div class="flex-1 flex flex-col overflow-y-auto">
      <div class="p-6">
        <router-link to="/cultivos" class="text-sm text-gray-600 flex items-center mb-4 hover:underline">
          <svg class="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Volver
        </router-link>

        <div class="bg-gradient-to-r from-[#e0f5f3] to-white rounded-xl p-6 shadow mb-6">
          <h1 class="text-2xl font-bold text-gray-800">{{ cultivo.tipoCultivo?.nombre || 'Cultivo' }}</h1>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

          
          <div class="bg-white rounded-lg p-4 shadow border">
            <h2 class="text-md font-semibold text-gray-800 mb-2">Información del cultivo</h2>
            <p class="text-gray-800"><strong>Tipo:</strong> {{ cultivo.tipoCultivo?.nombre }}</p>
            <p class="text-gray-800"><strong>Ciclo de vida:</strong> {{ cultivo.tipoCultivo?.cicloVida || 'No disponible' }} días</p>
            <p class="text-gray-800"><strong>Mes de siembra:</strong> {{ cultivo.tipoCultivo?.mesSiembra || 'No disponible' }}</p>
            <p class="text-gray-800"><strong>Mes de cosecha:</strong> {{ cultivo.tipoCultivo?.mesCosecha || 'No disponible' }}</p>
            <p class="text-gray-800"><strong>Riego necesario:</strong> {{ cultivo.tipoCultivo?.riegoNecesario || 'No disponible' }}</p>
            <p class="text-gray-800"><strong>Humedad óptima:</strong> {{ cultivo.tipoCultivo?.humedadOptima }}%</p>
            <p class="text-gray-800"><strong>Temperatura óptima:</strong> {{ cultivo.tipoCultivo?.temperaturaOptima }}°C
            </p>
            <p class="text-gray-800"><strong>Fecha de siembra:</strong> {{ formatearFecha(cultivo.fechaSiembra) }}</p>
            <p v-if="cultivo.estado === 'cosechado'" class="text-gray-800">
              <strong>Fecha de recolección:</strong> {{ formatearFecha(cultivo.fechaRecoleccion) }}
            </p>
          </div>

     
          <div class="bg-white rounded-lg p-4 shadow border" style="height: 250px; overflow-y: auto;">
            <div class="flex justify-between items-center mb-2">
              <h2 class="text-md font-semibold text-gray-800">Actividades</h2>
              <button v-if="cultivo.id" @click="mostrarModal = true" class="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded">
    + Añadir
  </button>
            </div>

            <div v-if="actividades.length">
              <div v-for="actividad in actividades" :key="actividad.id" class="flex justify-between items-center mb-2 p-2 bg-white rounded shadow-sm">
                <div>
                  <p :class="actividad.estado === 'completada' ? 'line-through text-gray-400' : 'text-gray-800'">
                    {{ actividad.titulo }}
                  </p>
                  <p class="text-xs text-gray-400">{{ formatearFecha(actividad.fechaSugerida) }}</p>
                </div>
                <button v-if="actividad.estado === 'pendiente'" @click="marcarComoRealizada(actividad.id)"
                  class="bg-yellow-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded">
                  Completar
                </button>
                <span v-else class="text-green-500 text-xs font-semibold">Hecha</span>
              </div>
            </div>

            <p v-else class="text-sm text-gray-500">No hay actividades aún.</p>
          </div>

        </div>

 
        <div class="mt-6">
          <div class="bg-white rounded-lg p-4 shadow border">
            <h2 class="text-md font-semibold text-gray-800 mb-2">Días para cosecha</h2>
            <div class="w-full bg-gray-200 h-2 rounded-full mb-1">
              <div class="bg-[#2e9e90] h-2 rounded-full" :style="{ width: cultivo.estado === 'cosechado' ? '100%' : progreso + '%' }"></div>
            </div>
            <p class="text-sm text-right text-gray-500">{{ diasRestantes }} días restantes</p>
          </div>
        </div>

        <div class="mt-10 px-6" v-if="cultivo.estado !== 'cosechado'">
          <div class="bg-white rounded-lg p-6 shadow border">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Recomendaciones </h3>

            <div v-for="rec in recomendaciones" :key="rec.id" class="mb-4 border-l-4 pl-4" :class="{
              'border-red-500': rec.tipo === 'Grave',
              'border-yellow-500': rec.tipo === 'Media',
              'border-blue-500': rec.tipo === 'Leve',
            }">
              <div class="flex items-center justify-between">
                <h4 class="text-md font-semibold text-gray-900">{{ rec.titulo }}</h4>
                <span class="text-xs font-bold uppercase" :class="{
                  'text-red-600': rec.tipo === 'Grave',
                  'text-yellow-600': rec.tipo === 'Media',
                  'text-blue-600': rec.tipo === 'Leve',
                }">
                  {{ rec.tipo }}
                </span>
              </div>
              <p class="text-sm text-gray-700 mt-1">{{ rec.descripcion }}</p>
            </div>
          </div>
        </div>

        <div class="mt-6 ml-6">
          <button v-if="cultivo.estado === 'activo'" @click="confirmarCosecha"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
            Cosechar cultivo
          </button>

          <p v-else class="text-green-700 font-semibold">Este cultivo ya ha sido cosechado.</p>
        </div>

      </div>
    </div>

    <CrearActividadModal v-if="mostrarModal"  @close="mostrarModal = false" @actividadCreada="obtenerActividades" />

  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue';
import CrearActividadModal from '@/components/CrearActividadModal.vue';
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL;


export default {
  name: 'DetalleCultivo',
  components: { Sidebar,CrearActividadModal },
  data() {
    return {
      cultivo: {},
      actividades: [],
      recomendaciones: [],
      diasRestantes: 0,
      progreso: 0,
      mostrarModal: false
    };
  },
  methods: {
    async obtenerActividades() {
      try {
        const token = localStorage.getItem('token');
        const cultivoId = this.$route.params.id;
        const res = await axios.get(`${BASE_URL}api/actividad/cultivo/${cultivoId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.actividades = res.data;
      } catch (error) {
        console.error('Error al cargar actividades:', error.message);
      }
    },
    async marcarComoRealizada(idActividad) {
      try {
        const token = localStorage.getItem('token');
        await axios.put(`${BASE_URL}api/actividad/${idActividad}/completar`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        await this.obtenerActividades();
      } catch (error) {
        console.error('Error al marcar actividad como completada:', error.message);
      }
    },
    async obtenerRecomendaciones() {
      try {
        const token = localStorage.getItem('token');
        const cultivoId = this.$route.params.id;
        const res = await axios.get(`${BASE_URL}api/recomendacion/cultivo/${cultivoId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.recomendaciones = res.data.recomendaciones || [];
      } catch (error) {
        console.error('Error al cargar recomendaciones:', error.message);
      }
    },
    async confirmarCosecha() {
      const confirmar = confirm('¿Seguro que quieres cosechar este cultivo?');
      if (!confirmar) return;

      try {
        const token = localStorage.getItem('token');
        await axios.put(`${BASE_URL}api/cultivo/${this.cultivo.id}/cosechar`, null, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.cultivo.estado = 'cosechado';
        alert('Cultivo cosechado correctamente.');
      } catch (error) {
        console.error('Error al cosechar cultivo:', error.message);
      }
    },
    formatearFecha(fecha) {
      if (!fecha) return 'No disponible';
      return new Date(fecha).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    }
  },
  async created() {
    try {
      const id = this.$route.params.id;
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BASE_URL}api/cultivo/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      this.cultivo = res.data;

      let siembra = new Date(this.cultivo.fechaSiembra);
      let ciclo = parseInt(this.cultivo.tipoCultivo?.cicloVida, 10);
      let cosecha = new Date(siembra);
      cosecha.setDate(siembra.getDate() + ciclo);
      const hoy = new Date();

      this.diasRestantes = Math.max(0, Math.ceil((cosecha - hoy) / (1000 * 60 * 60 * 24)));
      let diasTotales = (cosecha - siembra) / (1000 * 60 * 60 * 24);
      let diasPasados = (hoy - siembra) / (1000 * 60 * 60 * 24);
      this.progreso = Math.min(100, (diasPasados / diasTotales) * 100);

      await this.obtenerActividades();
      await this.obtenerRecomendaciones();

    } catch (error) {
      console.error('Error en created():', error.message);
    }
  }
};
</script>
