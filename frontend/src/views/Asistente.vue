<template>
  <div class="flex w-full min-h-screen bg-gray-50 flex-col md:flex-row">

    <Sidebar @abrirModal="mostrarModal = true" />
    <AddCultivoModal v-if="mostrarModal" @close="mostrarModal = false" />
    


      <h1 class="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
        <i class="i-lucide-zap text-green-600"></i>
        Asistente virtual
      </h1>
      <p class="text-gray-600 mb-6">Pregúntame sobre tus cultivos, clima o técnicas agrícolas.</p>
      <SidebarMobile />

      <div class="flex-1 overflow-y-auto pb-24">
        <div class="bg-white rounded-lg shadow p-4 mb-6">
          <input v-model="pregunta" @keyup.enter="enviarPregunta" type="text"
            placeholder="¿Cómo mejorar el rendimiento de mis cultivos?"
            class="w-full border rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-600" />
          <button @click="enviarPregunta" class="mt-4 bg-[#2e9e90] text-white font-semibold py-2 px-4 rounded">
            Preguntar
          </button>
        </div>
        <div class="flex-1 overflow-y-auto">
        <div v-if="respuesta" class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-2">Respuesta del asistente</h2>
          <p class="text-gray-700 whitespace-pre-line">{{ respuesta }}</p>
        </div>
        </div>
      </div>
    </div>

</template>

<script>
import AddCultivoModal from '@/components/AddCultivoModal.vue';
import Sidebar from '@/components/Sidebar.vue';
import SidebarMobile from '@/components/SidebarMobile.vue';
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL;


export default {
  name: 'AsistenteIA',
  components: { Sidebar, SidebarMobile, AddCultivoModal },
  data() {
    return {
      pregunta: '',
      respuesta: '',
      mostrarModal: false
    };
  },
  methods: {
    async enviarPregunta() {
      if (!this.pregunta.trim()) return;
      try {
        const token = localStorage.getItem('token');
        const res = await axios.post(`${BASE_URL}api/asistente/preguntar`, { pregunta: this.pregunta }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.respuesta = res.data.respuesta;
      } catch (error) {
        console.error('Error al consultar a Gemini:', error);
        this.respuesta = 'Hubo un problema al obtener la respuesta.';
      }
    }
  }
};
</script>

<style scoped></style>