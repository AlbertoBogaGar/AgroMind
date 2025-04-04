<template>
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 class="text-lg font-bold mb-4 text-center">🌱 Añadir Cultivo</h2>
  
        <!-- Selección de Tipo de Cultivo -->
        <label class="block text-sm font-medium text-black">Tipo de Cultivo:</label>
        <select v-model="idTipoCultivo" class="border p-2 w-full rounded mb-2 text-gray-600">
          <option disabled value="">Selecciona un tipo de cultivo</option>
          <option v-for="tipo in tiposCultivo" :key="tipo.id" :value="tipo.id">
            {{ tipo.nombre }} ({{ tipo.mesSiembra }} - {{ tipo.mesCosecha }})
          </option>
        </select>
  
        <!-- Fecha de Siembra -->
        <label class="block text-sm font-medium text-black">Fecha de Siembra:</label>
        <input v-model="fechaSiembra" type="date" class="border p-2 w-full rounded mb-2 text-gray-600" />
  
        <!-- Estado -->
        <label class="block text-sm font-medium text-black">Estado:</label>
        <select v-model="estado" class="border p-2 w-full rounded mb-2 text-gray-600">
          <option value="Activo">Activo</option>
          <option value="Cosechado">Cosechado</option>
        </select>
  
        <!-- Botones -->
        <button @click="añadirCultivo" class="bg-green-600 text-white px-4 py-2 mt-2 rounded w-full hover:bg-green-700">
           Añadir Cultivo
        </button>
        <button @click="$emit('close')" class="bg-gray-400 text-white px-4 py-2 mt-2 rounded w-full hover:bg-gray-500">
          Cancelar
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'AddCultivoModal',
    data() {
      return {
        idParcela: '',
        idTipoCultivo: '',
        fechaSiembra: '',
        estado: 'Activo',
        parcelas: [],
        tiposCultivo: []
      };
    },
    methods: {
      async fetchData() {
        try {
          const token = localStorage.getItem('token');
          const [parcelasRes, tiposRes] = await Promise.all([
            axios.get('http://localhost:5000/api/parcela', { headers: { Authorization: `Bearer ${token}` } }),
            axios.get('http://localhost:5000/api/tipoCultivo')
            
          ]);
          this.parcela = parcelasRes.data.parcela;
          this.tiposCultivo = tiposRes.data.tipoCultivo;
          console.log("Tipos de cultivo: "+this.tiposCultivo);
          
        } catch (error) {
          console.error('Error al obtener datos:', error);
        }
      },
      async añadirCultivo() {
        try {
          const token = localStorage.getItem('token');
          await axios.post('http://localhost:5000/api/cultivo', {
            idTipoCultivo: this.idTipoCultivo,
            fechaSiembra: this.fechaSiembra,
            estado: this.estado
          }, { headers: { Authorization: `Bearer ${token}` } });
          alert('Cultivo añadido con éxito');
          this.$emit('close');
        } catch (error) {
          console.error('Error al añadir cultivo:', error);
        }
      }
    },
    created() {
      this.fetchData();
    }
  };
  </script>
  
  <style scoped>
    h2 {
      color: #2e9e90;
    }
  </style>
  