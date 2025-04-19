<template>
  <div class="w-full h-screen bg-gray-50 flex overflow-x-hidden">
    <!-- Sidebar - Visible solo en desktop -->
    <div class="flex">
      <Sidebar @abrirModal="mostrarModal = true" />
    </div>

    <!-- Main Content -->
    <div class="flex-1 w-full flex flex-col h-screen overflow-x-hidden">
      <div class="flex-1 w-full p-4 md:p-6 md:ml-4 pb-16 md:pb-6 overflow-y-auto overflow-x-hidden">
        <!-- Header -->
        <div class="mb-6">
          <h1 class="text-2xl font-semibold text-gray-800">Mis Cultivos</h1>
        </div>

        <!-- Search Bar -->


        <!-- Tabs -->
        <div class="mb-6">
          <div class="flex flex-wrap rounded-lg border border-gray-200">
            <button class="flex-1 py-2 px-4 bg-white text-gray-700 font-medium hover:bg-gray-50">Todos</button>
            <button class="flex-1 py-2 px-4 bg-[#e0f5f3] text-gray-700 font-medium hover:bg-gray-50">Siembra</button>
            <button
              class="flex-1 py-2 px-4 bg-[#e0f5f3] text-gray-700 font-medium hover:bg-gray-50">Crecimiento</button>
            <button class="flex-1 py-2 px-4 bg-[#e0f5f3] text-gray-700 font-medium hover:bg-gray-50">Cosecha</button>
          </div>
        </div>

        <!-- Cultivos Grid -->
        <div  class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-full cursor-pointer">
          <!-- Cultivo 1: Maíz Amarillo -->
            <!-- contenido de la tarjeta -->


            <div v-for="cultivo in cultivos" :key="cultivo.id"   @click="verCultivo(cultivo.id)"
              class="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div class="relative h-40 bg-gray-200">
                <div class="absolute top-0 right-0 m-2">
                  <span class="px-2 py-1 bg-[#e0f5f3] text-[#2e9e90] text-xs rounded-md">
                    {{ calcularEstado(cultivo) }}
                  </span>
                </div>
                <div
                  class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
                  <h3 class="font-semibold">Tu Parcela</h3>
                  <p class="text-sm flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {{ cultivo.idParcela }}
                  </p>
                </div>
              </div>
              <div class="p-4">
                <div class="text-sm text-gray-500 mb-1">Tipo: {{ cultivo.tipoCultivo?.nombre }}</div>
                <h4 class="font-semibold text-gray-800 mb-2">{{ cultivo.tipoCultivo?.nombre }}</h4>
                <div class="mb-2">
                  <div class="text-sm text-gray-500 mb-1">Días para cosecha</div>
                  <div class="w-full bg-gray-200 rounded-full h-2 mb-1">
                    <div class="bg-[#2e9e90] h-2 rounded-full" :style="{ width: calcularProgreso(cultivo) + '%' }">
                    </div>
                  </div>
                  <div class="flex justify-end text-sm text-gray-500">{{ calcularDiasRestantes(cultivo) }} días
                    restantes</div>
                </div>
              </div>

            </div>


          
        </div>
      </div>

      <!-- Bottom Navigation Bar - Visible solo en mobile -->
      <div class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16">
        <div class="grid grid-cols-4 h-full">
          <button class="flex flex-col items-center justify-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span class="text-xs mt-1">Inicio</span>
          </button>
          <button class="flex flex-col items-center justify-center text-[#2e9e90]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2a10 10 0 1 0 10 10H12V2z"></path>
              <path d="M12 2a10 10 0 0 1 10 10h-10V2z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span class="text-xs mt-1">Cultivos</span>
          </button>
          <button class="flex flex-col items-center justify-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span class="text-xs mt-1">Mapa</span>
          </button>
          <button class="flex flex-col items-center justify-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span class="text-xs mt-1">Cuenta</span>
          </button>
        </div>
      </div>

      <!-- Floating Action Button - Visible solo en mobile -->
      <button
        class="md:hidden fixed right-4 bottom-20 w-14 h-14 bg-[#2e9e90] rounded-full flex items-center justify-center text-white shadow-lg">
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
import Sidebar from "@/components/Sidebar.vue";
import axios from "axios";

export default {
  name: "Cultivos",
  components: { Sidebar },
  data() {
    return {
      cultivos: []
    };
  },
  methods: {
    async obtenerCultivos() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/cultivo", {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("📦 Cultivos recibidos:", response.data);
        this.cultivos = response.data;
      } catch (error) {
        console.error("❌ Error al obtener cultivos:", error);
      }
    },
    calcularDiasRestantes(cultivo) {
      const fechaSiembra = new Date(cultivo.fechaSiembra);
      const cicloVida = parseInt(cultivo.tipoCultivo?.cicloVida, 10);
      const fechaCosecha = new Date(fechaSiembra);
      fechaCosecha.setDate(fechaSiembra.getDate() + cicloVida);

      const hoy = new Date();
      const diferencia = Math.ceil((fechaCosecha - hoy) / (1000 * 60 * 60 * 24));
      return Math.max(0, diferencia);
    },
    calcularProgreso(cultivo) {
      const fechaSiembra = new Date(cultivo.fechaSiembra);
      const cicloVida = parseInt(cultivo.tipoCultivo?.cicloVida, 10);
      const fechaCosecha = new Date(fechaSiembra);
      fechaCosecha.setDate(fechaSiembra.getDate() + cicloVida);

      const hoy = new Date();
      const totalDias = (fechaCosecha - fechaSiembra) / (1000 * 60 * 60 * 24);
      const diasPasados = (hoy - fechaSiembra) / (1000 * 60 * 60 * 24);

      return Math.min(100, Math.max(0, (diasPasados / totalDias) * 100));
    },
    calcularEstado(cultivo) {
      const dias = this.calcularDiasRestantes(cultivo);
      if (dias <= 0) return "Listo para cosecha";
      return "Crecimiento";
    },
    verCultivo(id) {
      this.$router.push(`/cultivo/${id}`);
    },
  },
 


  async created() {
    await this.obtenerCultivos();
  }
};
</script>
