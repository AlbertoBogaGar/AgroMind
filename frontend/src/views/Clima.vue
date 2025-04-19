<template>
  <div class="w-full h-screen bg-gray-50 flex overflow-x-hidden">
    <!-- Sidebar - Visible solo en desktop -->
    <div class="flex">
      <Sidebar @abrirModal="mostrarModal = true" />
    </div>

    <!-- Main Content -->
    <!-- Main Content -->
    <div class="flex-1 flex flex-col h-screen overflow-hidden">
      <div class="flex-1 overflow-y-auto p-4 md:p-6 md:ml-4 pb-32">



        <!-- Header -->
        <div class="mb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-[#2e9e90]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-semibold text-gray-800">Clima y Alertas</h1>
              <p class="text-gray-500">Pronóstico y alertas meteorológicas</p>
            </div>
          </div>
        </div>

        <!-- Weather Card -->
        <div class="mb-6">
          <WeatherCard :meteorologia="meteorologia_actual"
            :provincia="parcela?.provincium?.nombre || 'Provincia desconocida'" :fecha="fechaActual"
            :hora="horaActual" />
        </div>
        <div class="mb-6">
          <SolGrafico v-if="salidaSol && puestaSol" :salidaSol="salidaSol" :puestaSol="puestaSol"
            :horaActual="horaActual" />



        </div>

        <!-- Alertas meteorológicas -->
        <div class="mb-6" v-if="alertas.length">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">Alertas meteorológicas</h3>

          <div v-for="(alerta, index) in alertas" :key="index" :class="[
            'bg-white rounded-lg border border-l-4 p-4 mb-4',
            {
              'border-l-red-500': alerta.tipo === 'grave',
              'border-l-amber-400': alerta.tipo === 'media',
              'border-l-blue-400': alerta.tipo === 'leve',
            },
          ]">
            <div class="flex justify-between items-start">
              <div class="flex gap-3">
                <div :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center',
                  {
                    'bg-red-100 text-red-500': alerta.tipo === 'grave',
                    'bg-amber-100 text-amber-500': alerta.tipo === 'media',
                    'bg-blue-100 text-blue-500': alerta.tipo === 'leve',
                  },
                ]">
                  <!-- Icono de sol por defecto -->
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h4 class="font-semibold text-gray-800">{{ alerta.titulo }}</h4>
                    <span :class="[
                      'px-2 py-0.5 text-xs rounded-md',
                      {
                        'bg-red-100 text-red-700': alerta.tipo === 'grave',
                        'bg-amber-100 text-amber-700': alerta.tipo === 'media',
                        'bg-blue-100 text-blue-700': alerta.tipo === 'leve',
                      },
                    ]">
                      {{ alerta.tipo }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-600 mt-1">{{ alerta.mensaje }}</p>

                  <p class="text-xs text-gray-500 mt-2">{{ alerta.fecha_inicio }} - {{ alerta.fecha_fin }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Bottom Navigation Bar - Visible solo en mobile -->
    <div class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16">
      <div class="grid grid-cols-4 h-full">
        <RouterLink to="/dashboard" class="flex flex-col items-center justify-center text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span class="text-xs mt-1">Inicio</span>
        </RouterLink>
        <RouterLink to="/cultivos" class="flex flex-col items-center justify-center text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2a10 10 0 1 0 10 10H12V2z"></path>
            <path d="M12 2a10 10 0 0 1 10 10h-10V2z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          <span class="text-xs mt-1">Cultivos</span>
        </RouterLink>
        <RouterLink to="/mapa" class="flex flex-col items-center justify-center text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span class="text-xs mt-1">Mapa</span>
        </RouterLink>
        <RouterLink to="/clima" class="flex flex-col items-center justify-center text-[#2e9e90]">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
          </svg>
          <span class="text-xs mt-1">Clima</span>
        </RouterLink>
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

</template>

<script>
import SolGrafico from "@/components/SolGrafico.vue";
import WeatherCard from "@/components/WeatherCard.vue";
import Sidebar from "@/components/Sidebar.vue";
import axios from "axios";
export default {
  name: "Clima",
  components: { WeatherCard, SolGrafico, Sidebar },
  data() {
    return {
      meteorologia_actual: {
        temperatura: null,
        humedad: null,
        viento: null,
        estado: '',
      },
      parcela: {},
      fechaActual: this.obtenerFechaActual(),
      horaActual: this.obtenerHoraActual(),
      salidaSol: null,
      puestaSol: null,
      alertas: []
    };
  },
  methods: {
    obtenerFechaActual() {
      const fecha = new Date();
      const format = { weekday: "long", day: "numeric", month: "long" };
      const fechaFormat = fecha.toLocaleDateString("es-ES", format);
      return fechaFormat.charAt(0).toUpperCase() + fechaFormat.slice(1);
    },
    obtenerHoraActual() {
      const fecha = new Date();
      const horas = fecha.getHours().toString().padStart(2, '0');
      const minutos = fecha.getMinutes().toString().padStart(2, '0');
      return `${horas}:${minutos}`;
    },
    async obtenerParcela() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/parcela", {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Parcela recibida:", response.data);
        if (response.data.parcela) {
          this.parcela = response.data.parcela;
        }
      } catch (error) {
        console.error("Error al obtener la parcela:", error);
      }
    },
    async obtenerMeteorologia() {
      try {
        const idProvincia = this.parcela?.idProvincia;
        if (!idProvincia) return;
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:5000/api/weather/current-live`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.meteorologia_actual = response.data;
      } catch (error) {
        console.error("Error al obtener datos del tiempo:", error);
      }
    },
    async obtenerSolInfo() {
      try {
        const idProvincia = this.parcela?.idProvincia;
        if (!idProvincia) return;

        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:5000/api/weather/sol-info/${idProvincia}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log("🌞 Info del sol:", response.data);
        this.salidaSol = response.data.salidaSol;
        this.puestaSol = response.data.puestaSol;

      } catch (error) {
        console.error("Error al obtener info del sol:", error);
      }
    },
    async obtenerAlertasClima() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/weather/alertas-clima", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.alertas = response.data.alertas;
        console.log("🔔 Alertas climáticas recibidas:", this.alertas);
      } catch (error) {
        console.error("Error al obtener alertas climáticas:", error);
      }
    },

  },
  async created() {
    await this.obtenerParcela();
    await this.obtenerMeteorologia();
    await this.obtenerSolInfo();
    await this.obtenerAlertasClima();

  }

};
</script>