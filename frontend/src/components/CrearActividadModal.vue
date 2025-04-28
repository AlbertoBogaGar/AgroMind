<template>
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 class="text-xl font-bold mb-4 text-gray-800">Crear nueva actividad</h2>
  
        <form @submit.prevent="crearActividad">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-semibold mb-1">Título</label>
            <input v-model="nuevaActividad.titulo" type="text" required class="w-full border rounded px-3 py-2 focus:outline-none text-gray-600" />
          </div>
  
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-semibold mb-1">Descripción</label>
            <textarea v-model="nuevaActividad.descripcion" required class="w-full border rounded px-3 py-2 focus:outline-none text-gray-600"></textarea>
          </div>
  
          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-semibold mb-1">Fecha sugerida</label>
            <input v-model="nuevaActividad.fechaSugerida" type="date" required class="w-full border rounded px-3 py-2 focus:outline-none text-gray-600" />
          </div>
  
          <div class="flex justify-end space-x-3">
            <button type="button" @click="$emit('close')" class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Cancelar</button>
            <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Crear</button>
          </div>
        </form>
  
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  
  export default {
    name: "CrearActividadModal",
    props: {
      idCultivo: {
        type: Number,
        required: true,
      }
    },
    data() {
      return {
        nuevaActividad: {
          titulo: "",
          descripcion: "",
          fechaSugerida: ""
        }
      };
    },
    methods: {
      async crearActividad() {
        try {
          const token = localStorage.getItem("token");
  
          await axios.post(`${BASE_URL}api/actividad/crear`, {
            idCultivo: this.idCultivo,
            titulo: this.nuevaActividad.titulo,
            descripcion: this.nuevaActividad.descripcion,
            fechaSugerida: this.nuevaActividad.fechaSugerida,
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
  
          console.log("Actividad creada correctamente");
          this.$emit("actividadCreada");   
          this.$emit("close");              
  
        } catch (error) {
          console.error("Error al crear actividad:", error.response?.data || error.message);
          alert("Error al crear la actividad. Intenta de nuevo.");
        }
      }
    }
  };
  </script>
  