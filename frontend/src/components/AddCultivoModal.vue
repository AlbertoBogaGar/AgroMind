<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-96 m-4">
        <h2 class="text-lg font-bold mb-4 text-center text-gray-600">Añadir cultivo</h2>
  
        <label class="block text-sm font-medium text-black">Tipo de cultivo:</label>
        <select v-model="idTipoCultivo" class="border p-2 w-full rounded mb-2 text-gray-600">
          <option disabled value="">Selecciona un tipo de cultivo</option>
          <option v-for="tipo in tiposCultivo" :key="tipo.id" :value="tipo.id">
            {{ tipo.nombre }} ({{ tipo.mesSiembra }} - {{ tipo.mesCosecha }})
          </option>
        </select>
  
        <label class="block text-sm font-medium text-black">Fecha de siembra:</label>
        <input v-model="fechaSiembra" type="date" class="border p-2 w-full rounded mb-2 text-gray-600" />
  
        <label class="block text-sm font-medium text-black">Estado:</label>
        <select v-model="estado" class="border p-2 w-full rounded mb-2 text-gray-600">
          <option value="Activo">Activo</option>
          <option value="Cosechado">Cosechado</option>
        </select>
  
        <button @click="añadirCultivo" class="bg-green-600 text-white px-4 py-2 mt-2 rounded w-full hover:bg-green-700">
           Añadir cultivo
        </button>
        <button @click="$emit('close')" class="bg-gray-400 text-white px-4 py-2 mt-2 rounded w-full hover:bg-gray-500">
          Cancelar
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  
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
            axios.get(`${BASE_URL}api/parcela`, { headers: { Authorization: `Bearer ${token}` } }),
            axios.get(`${BASE_URL}api/tipoCultivo`)
            
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
          await axios.post(`${BASE_URL}api/cultivo`, {
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
  
  
  