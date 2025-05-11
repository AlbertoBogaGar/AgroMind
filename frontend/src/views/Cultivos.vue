<template>
  <div class="w-full h-screen bg-gray-50 flex overflow-x-hidden">

    <div class="flex">
      <Sidebar @abrirModal="mostrarModal = true" />
    </div>

    <AddCultivoModal v-if="mostrarModal" @close="mostrarModal = false" />

    <div class="flex-1 w-full flex flex-col h-screen overflow-x-hidden">
      <div class="flex-1 w-full p-4 md:p-6 md:ml-4 pb-16 md:pb-6 overflow-y-auto overflow-x-hidden">
    
        <div class="mb-6">
          <h1 class="text-2xl font-semibold text-gray-800">Mis Cultivos</h1>
        </div>


        <div class="mb-6">
          <div class="flex flex-wrap rounded-lg border border-gray-200">
            <button class="flex-1 py-2 px-4"
              :class="filtroEstado === 'todos' ? 'bg-white text-gray-700 font-medium' : 'bg-[#e0f5f3] text-gray-700'"
              @click="filtroEstado = 'todos'">
              Todos
            </button>
            <button class="flex-1 py-2 px-4"
              :class="filtroEstado === 'cosechado' ? 'bg-white text-gray-700 font-medium' : 'bg-[#e0f5f3] text-gray-700'"
              @click="filtroEstado = 'cosechado'">
              Cosechados
            </button>
            <button class="flex-1 py-2 px-4"
              :class="filtroEstado === 'activo' ? 'bg-white text-gray-700 font-medium' : 'bg-[#e0f5f3] text-gray-700'"
              @click="filtroEstado = 'activo'">
              Activos
            </button>
          </div>
        </div>

  
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-full cursor-pointer">
          <div v-for="cultivo in cultivosFiltrados" :key="cultivo.id" @click="verCultivo(cultivo.id)"
            class="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div class="relative h-40 bg-gray-200">
              <img v-if="cultivo.imagen" :src="cultivo.imagen" alt="Imagen del cultivo"
                class="absolute w-full h-full object-cover" />

              <div class="absolute top-0 right-0 m-2">
                <span class="px-2 py-1 text-xs rounded-md"
                  :class="cultivo.estado === 'cosechado' ? 'bg-green-100 text-green-600' : 'bg-[#e0f5f3] text-[#2e9e90]'">
                  {{ cultivo.estado === 'cosechado' ? 'Cosechado' : calcularEstado(cultivo) }}
                </span>
              </div>

              <div
                class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
              </div>
            </div>

            <div class="p-4">
              <div class="text-sm text-gray-500 mb-1">Tipo: {{ cultivo.tipoCultivo?.nombre }}</div>
              <h4 class="font-semibold text-gray-800 mb-2">
  {{ cultivo.tipoCultivo?.nombre }}
  <span v-if="fechaValida(cultivo.fechaRecoleccion)">
    {{ formatearFecha(cultivo.fechaRecoleccion) }}
  </span>
</h4>

              <div class="mb-2">
                <div class="text-sm text-gray-500 mb-1">Días para cosecha</div>
                <div class="w-full bg-gray-200 rounded-full h-2 mb-1">
                  <div class="bg-[#2e9e90] h-2 rounded-full"
                    :style="{ width: cultivo.estado === 'cosechado' ? '100%' : calcularProgreso(cultivo) + '%' }"></div>
                </div>
                <div v-if="cultivo.estado !== 'cosechado'" class="flex justify-end text-sm text-gray-500">
                  {{ calcularDiasRestantes(cultivo) }} días restantes
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>


      <SidebarMobile />


      <button
  class="md:hidden fixed right-4 bottom-20 w-14 h-14 bg-[#2e9e90] rounded-full flex items-center justify-center text-white shadow-lg"
  @click="mostrarModal = true"
>
  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
</button>
    </div>
  </div>
</template>

<script>
import AddCultivoModal from "@/components/AddCultivoModal.vue";
import Sidebar from "@/components/Sidebar.vue";
import SidebarMobile from "@/components/SidebarMobile.vue";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;


export default {
  name: "Cultivos",
  components: { Sidebar, SidebarMobile,AddCultivoModal },
  data() {
    return {
      cultivos: [],
      filtroEstado:'todos',
      mostrarModal:false
    };
  },
  computed: {
  cultivosFiltrados() {
    let filtrados = this.cultivos;

    if (this.filtroEstado === 'activo') {
      filtrados = filtrados.filter(c => c.estado === 'activo');
    } else if (this.filtroEstado === 'cosechado') {
      filtrados = filtrados.filter(c => c.estado === 'cosechado');
    }

    
    return filtrados.slice().sort((a, b) => {
      if (a.estado === 'cosechado' && b.estado !== 'cosechado') return -1;
      if (a.estado !== 'cosechado' && b.estado === 'cosechado') return 1;
      return 0;
    });
  }
},

  methods: {
    formatearFecha(fecha) {
    if (!fecha || fecha === '0000-00-00') return '';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  },
  fechaValida(fecha) {
    return fecha && fecha !== '0000-00-00';
  },
    async obtenerCultivos() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}api/cultivo`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.cultivos = response.data;
      } catch (error) {
        console.error("Error al obtener cultivos:", error);
      }
    },
    calcularDiasRestantes(cultivo) {
      let fechaSiembra = new Date(cultivo.fechaSiembra);
      let cicloVida = parseInt(cultivo.tipoCultivo?.cicloVida, 10);
      let fechaCosecha = new Date(fechaSiembra);
      fechaCosecha.setDate(fechaSiembra.getDate() + cicloVida);
      let hoy = new Date();
      let diferencia = Math.ceil((fechaCosecha - hoy) / (1000 * 60 * 60 * 24));
      return Math.max(0, diferencia);
    },
    calcularProgreso(cultivo) {
      let fechaSiembra = new Date(cultivo.fechaSiembra);
      let cicloVida = parseInt(cultivo.tipoCultivo?.cicloVida, 10);
      let fechaCosecha = new Date(fechaSiembra);
      fechaCosecha.setDate(fechaSiembra.getDate() + cicloVida);
      let hoy = new Date();
      let totalDias = (fechaCosecha - fechaSiembra) / (1000 * 60 * 60 * 24);
      let diasPasados = (hoy - fechaSiembra) / (1000 * 60 * 60 * 24);
      return Math.min(100, Math.max(0, (diasPasados / totalDias) * 100));
    },
    calcularEstado(cultivo) {
      let dias = this.calcularDiasRestantes(cultivo);
      if (dias <= 0) return "Listo para cosecha";
      return "Crecimiento";
    },
    verCultivo(id) {
      this.$router.push(`/cultivo/${id}`);
    }
  },
  async created() {
    await this.obtenerCultivos();
  }
};
</script>
