<template>
    <div class="flex w-full h-screen bg-gray-50">
      <Sidebar />
      <div class="flex-1 p-6 overflow-y-auto">
        <h1 class="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <i class="i-lucide-zap text-green-600"></i>
          Recomendaciones IA
        </h1>
        <p class="text-gray-600 mb-6">Pregúntame sobre tus cultivos, clima o técnicas agrícolas.</p>
  
        <div class="bg-white rounded-lg shadow p-4 mb-6">
          <input
            v-model="pregunta"
            @keyup.enter="enviarPregunta"
            type="text"
            placeholder="¿Cómo mejorar el rendimiento de mis cultivos?"
            class="w-full border rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-600"
          />
          <button
            @click="enviarPregunta"
            class="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
          >
            Preguntar
          </button>
        </div>
  
        <div v-if="respuesta" class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-2">Respuesta del asistente</h2>
          <p class="text-gray-700 whitespace-pre-line">{{ respuesta }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Sidebar from '@/components/Sidebar.vue';
  import axios from 'axios';
  
  export default {
    name: 'AsistenteIA',
    components: { Sidebar },
    data() {
      return {
        pregunta: '',
        respuesta: ''
      };
    },
    methods: {
      async enviarPregunta() {
        if (!this.pregunta.trim()) return;
        try {
          const token = localStorage.getItem('token');
          const res = await axios.post('http://localhost:5000/api/asistente/preguntar', { pregunta: this.pregunta }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          this.respuesta = res.data.respuesta;
        } catch (error) {
          console.error('❌ Error al consultar a Gemini:', error);
          this.respuesta = 'Hubo un problema al obtener la respuesta.';
        }
      }
    }
  };
  </script>
  
  <style scoped>
  </style>
  