<template>
  <div class="w-full h-screen bg-gray-50 flex overflow-x-hidden">
    <Sidebar @abrirModal="mostrarModal = true" />
    <AddCultivoModal v-if="mostrarModal" @close="mostrarModal = false" />

    <div class="flex-1 flex flex-col h-screen overflow-hidden">
      <div class="flex-1 overflow-y-auto p-4 md:p-6 md:ml-4 pb-32">

        <div class="mb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-[#2e9e90]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-semibold text-gray-800">Clima y alertas</h1>
              <p class="text-gray-500">Pronóstico y alertas meteorológicas</p>
            </div>
          </div>
        </div>

        <div class="flex flex-col md:flex-row gap-6 mb-6">
          <div class="w-full md:w-1/2">
            <WeatherCard :meteorologia="meteorologia_actual"
              :provincia="parcela?.provincium?.nombre || 'Provincia desconocida'" :fecha="fechaActual"
              :hora="horaActual" :ultimaActualizacion="ultimaActualizacion"  />
          </div>

          <div class="w-full md:w-1/2">
            <SolGrafico v-if="salidaSol && puestaSol" :salidaSol="salidaSol" :puestaSol="puestaSol"
              :horaActual="horaActual" />
          </div>
        </div>
        <div class="mb-6">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">Resumen de hoy</h3>
          <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-700">
              <div><span class="font-semibold">Temperatura mínima:</span> {{ resumenHoy.temperatura_min }}°C</div>
              <div><span class="font-semibold">Temperatura máxima:</span> {{ resumenHoy.temperatura_max }}°C</div>
              <div><span class="font-semibold">Humedad:</span> {{ resumenHoy.humedad }}%</div>
              <div><span class="font-semibold">Viento:</span> {{ resumenHoy.viento }} km/h</div>
              <div><span class="font-semibold">Prob. lluvia:</span> {{ resumenHoy.prob_precipitacion }}%</div>
              <div><span class="font-semibold">Duración luz:</span> {{ formatearDuracion(resumenHoy.duracion_luz) }}</div>
            </div>
          </div>
        </div>


        <div class="mb-6">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">Alertas meteorológicas</h3>
          <p v-if="cargandoAlertas" class="text-gray-500 text-sm">Consultando alertas meteorológicas...</p>
          <div v-else-if="alertas.length">
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
    </div>

    <SidebarMobile />
  </div>
</template>

<script>
import SolGrafico from "@/components/SolGrafico.vue";
import WeatherCard from "@/components/WeatherCard.vue";
import Sidebar from "@/components/Sidebar.vue";
import SidebarMobile from "@/components/SidebarMobile.vue";
import axios from "axios";
import AddCultivoModal from "@/components/AddCultivoModal.vue";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default {
  name: "Clima",
  components: { WeatherCard, SolGrafico, Sidebar, SidebarMobile, AddCultivoModal },
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
      alertas: [],
      ultimaActualizacion: '',
      tiempoUltimaActualizacion: null,
      intervaloActualizacion: null,
      cargandoAlertas: false,
      mostrarModal: false,
      resumenHoy: {
        temperatura_min: null,
        temperatura_max: null,
        humedad: null,
        viento: null,
        prob_precipitacion: null,
        duracion_sol: null
      }
    };
  },
  methods: {
    formatearDuracion(segundos) {
  if (!segundos || isNaN(segundos)) return '0h 0min';
  const horas = Math.floor(segundos / 3600);
  const minutos = Math.floor((segundos % 3600) / 60);
  return `${horas}h ${minutos}min`;
},
    obtenerFechaActual() {
      let fecha = new Date();
      let format = { weekday: "long", day: "numeric", month: "long" };
      let fechaFormat = fecha.toLocaleDateString("es-ES", format);
      return fechaFormat.charAt(0).toUpperCase() + fechaFormat.slice(1);
    },
    obtenerHoraActual() {
      let fecha = new Date();
      let horas = fecha.getHours().toString().padStart(2, '0');
      let minutos = fecha.getMinutes().toString().padStart(2, '0');
      return `${horas}:${minutos}`;
    },
    async obtenerParcela() {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}api/parcela`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      this.parcela = res.data.parcela;
    },
  
    async obtenerMeteorologia() {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}api/weather/current-live`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      this.meteorologia_actual = res.data;
    },
    async obtenerSolInfo() {
      const token = localStorage.getItem("token");
      const idProvincia = this.parcela?.idProvincia;
      const res = await axios.get(`${BASE_URL}api/weather/sol-info/${idProvincia}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      this.salidaSol = res.data.salidaSol;
      this.puestaSol = res.data.puestaSol;
    },
    async obtenerClimaDesdeBD() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BASE_URL}api/weather/today`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.resumenHoy = res.data;
      } catch (error) {
        console.error("❌ Error al obtener clima de hoy desde BD:", error.message);
      }
    },
    async obtenerAlertasClima() {
      this.cargandoAlertas = true;
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BASE_URL}api/weather/alertas-clima`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.alertas = res.data.alertas;
      } catch (error) {
        console.error("Error al obtener alertas climáticas:", error);
      } finally {
        this.cargandoAlertas = false;
      }
    },
    actualizarMensajeActualizacion() {
      const actualizar = () => {
        if (!this.tiempoUltimaActualizacion) return;
        let ahora = new Date();
        let minutos = Math.floor((ahora - this.tiempoUltimaActualizacion) / 60000);
        this.ultimaActualizacion = minutos === 0 ? 'menos de un minuto' : `${minutos} minuto${minutos > 1 ? 's' : ''}`;
      };
      clearInterval(this.intervaloActualizacion);
      this.intervaloActualizacion = setInterval(actualizar, 60000);
      actualizar();
    }
  },
  async created() {
    await this.obtenerParcela();
    await this.obtenerSolInfo();
    await this.obtenerClimaDesdeBD();
    await this.obtenerAlertasClima();
    await this.obtenerMeteorologia();
    this.tiempoUltimaActualizacion = new Date();
    this.actualizarMensajeActualizacion();
  },
  beforeUnmount() {
    clearInterval(this.intervaloActualizacion);
  }
};
</script>
