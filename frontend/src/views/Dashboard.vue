<template>
  <div class="relative w-full h-screen bg-gray-50">

    <ParcelaModal v-if="!tieneParcela" @onRegistroExitoso="actualizarEstadoParcela" />

    <div v-else class="flex h-screen">

      <div class="flex">
        <Sidebar @abrirModal="mostrarModal = true" />
      </div>

      <AddCultivoModal v-if="mostrarModal" @close="mostrarModal = false" />

      <div class="flex-1 flex flex-col h-screen">
        <div class="flex-1 p-4 md:p-6 md:ml-4 pb-16 md:pb-6 overflow-y-auto">

        
          <div class="flex justify-between items-center mb-4">
            <div>
              <h1 class="text-2xl font-semibold text-gray-800">Hola, Buenos días</h1>
              <p class="text-gray-500">{{ fechaActual }}</p>
            </div>
            <div class="w-12 h-12 bg-[#e0f5f3] text-[#2e9e90] rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
          </div>

         
          <div class="md:hidden space-y-6">

            <WeatherCard :meteorologia="meteorologia_actual" :provincia="parcela?.provincium?.nombre || 'Provincia desconocida'" :fecha="fechaActual" :hora="horaActual" :ultimaActualizacion="ultimaActualizacion" @recargarClima="recargarClima" />

           
            <div class="bg-white rounded-lg border border-gray-200 p-4">
              <div class="flex justify-between items-center mb-4">
                <h3 class="font-semibold text-gray-800">Recomendaciones</h3>
                <button @click="mostrarModalRecomendaciones = true" class="text-[#2e9e90] text-sm font-medium">
                  Ver todas
                </button>
              </div>
              <div v-if="recomendacionesIA.length" class="space-y-3">
                <div v-for="(reco, index) in recomendacionesIA.slice(0,4)" :key="index" class="flex justify-between items-start">
                  <div class="flex items-start gap-3">
                    <div class="w-1 h-10 rounded-full" :class="{
                      'bg-red-500': reco.tipo === 'Grave',
                      'bg-amber-500': reco.tipo === 'Media',
                      'bg-yellow-300': reco.tipo === 'Leve'
                    }"></div>
                    <div>
                      <h4 class="font-medium text-gray-800">{{ reco.titulo }}</h4>
                      <p class="text-xs text-gray-500">{{ reco.descripcion }}</p>
                    </div>
                  </div>
                  <span class="text-xs font-semibold uppercase" :class="{
                    'text-red-500': reco.tipo === 'Grave',
                    'text-amber-500': reco.tipo === 'Media',
                    'text-yellow-400': reco.tipo === 'Leve'
                  }">
                    {{ reco.tipo }}
                  </span>
                </div>
              </div>
              <div v-else class="text-sm text-gray-500">Estamos consultando las recomendaciones...</div>
            </div>

            
            <div>
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold text-gray-800">Mis cultivos</h3>
                <a href="#" class="text-[#2e9e90] text-sm font-medium">Ver todos</a>
              </div>
              <div class="space-y-4">
                <div v-for="cultivo in cultivos" :key="cultivo.id" class="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div class="p-4">
                    <div class="flex justify-between items-start mb-2">
                      <h4 class="font-semibold text-gray-800">{{ cultivo.tipoCultivo.nombre }}</h4>
                      <span class="px-2 py-1 bg-[#e0f5f3] text-[#2e9e90] text-xs rounded-md">{{ calcularEstadoCultivo(cultivo) }}</span>
                    </div>
                    <div class="text-sm text-gray-500 mb-2">{{ parcela.provincium?.nombre }}</div>
                    <div class="text-sm text-gray-600 mb-1">Días para cosecha: <strong>{{ calcularDiasRestantes(cultivo) }}</strong></div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div class="bg-[#2e9e90] h-2 rounded-full" :style="{ width: calcularProgresoCosecha(cultivo) + '%' }"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            
            <div class="bg-white rounded-lg border border-gray-200 p-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-[#e0f5f3] rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#2e9e90]" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-500">{{ parcela.provincium?.nombre }}, España</p>
                </div>
                <button class="ml-auto px-3 py-1 bg-[#2e9e90] text-white rounded-md text-xs font-medium">Ver mapa</button>
              </div>
            </div>

          </div>

          <div class="hidden md:flex flex-col gap-6">
            <div class="flex gap-4">

              
              <div class="w-1/2">
                <WeatherCard :meteorologia="meteorologia_actual" :provincia="parcela?.provincium?.nombre || 'Provincia desconocida'" :fecha="fechaActual" :hora="horaActual" :ultimaActualizacion="ultimaActualizacion" @recargarClima="recargarClima" />
              </div>

           
              <div class="w-1/2 bg-white rounded-lg border border-gray-200 p-4">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="font-semibold text-gray-800">Recomendaciones</h3>
                  <button @click="mostrarModalRecomendaciones = true" class="text-[#2e9e90] text-sm font-medium">Ver todas</button>
                </div>
                <div v-if="recomendacionesIA.length" class="space-y-3">
                  <div v-for="(reco, index) in recomendacionesIA.slice(0,4)" :key="index" class="flex justify-between items-start">
                    <div class="flex items-start gap-3">
                      <div class="w-1 h-10 rounded-full" :class="{
                        'bg-red-500': reco.tipo === 'Grave',
                        'bg-amber-500': reco.tipo === 'Media',
                        'bg-yellow-300': reco.tipo === 'Leve'
                      }"></div>
                      <div>
                        <h4 class="font-medium text-gray-800">{{ reco.titulo }}</h4>
                        <p class="text-xs text-gray-500">{{ reco.descripcion }}</p>
                      </div>
                    </div>
                    <span class="text-xs font-semibold uppercase" :class="{
                      'text-red-500': reco.tipo === 'Grave',
                      'text-amber-500': reco.tipo === 'Media',
                      'text-yellow-400': reco.tipo === 'Leve'
                    }">
                      {{ reco.tipo }}
                    </span>
                  </div>
                </div>
                <div v-else class="text-sm text-gray-500">Estamos consultando las recomendaciones...</div>
              </div>
            </div>

            <div>
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-semibold text-gray-800">Mis cultivos</h3>
                <a href="#" class="text-[#2e9e90] text-sm font-medium">Ver todos</a>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div v-for="cultivo in cultivosActivos" :key="cultivo.id" class="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div class="p-4">
                    <div class="flex justify-between items-start mb-2">
                      <h4 class="font-semibold text-gray-800">{{ cultivo.tipoCultivo.nombre }}</h4>
                      <span class="px-2 py-1 bg-[#e0f5f3] text-[#2e9e90] text-xs rounded-md">{{ calcularEstadoCultivo(cultivo) }}</span>
                    </div>
                    <div class="text-sm text-gray-500 mb-2">{{ parcela.provincium?.nombre }}</div>
                    <div class="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Días para cosecha</span>
                      <span class="font-medium">{{ calcularDiasRestantes(cultivo) }} días</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div class="bg-[#2e9e90] h-2 rounded-full" :style="{ width: calcularProgresoCosecha(cultivo) + '%' }"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

           
            <div class="bg-white rounded-lg border border-gray-200 p-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-[#e0f5f3] rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#2e9e90]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <p class="text-sm text-gray-500">{{ parcela.provincium?.nombre }}, España • Visualiza tu estado actual</p>
                <button class="ml-auto px-4 py-2 bg-[#2e9e90] text-white rounded-md text-sm font-medium">Ver mapa</button>
              </div>
            </div>
          </div>

          <button @click="logout" class="text-sm text-gray-500 hover:underline mt-4">Cerrar sesión</button>

        </div>

        <SidebarMobile />

        <button class="md:hidden fixed right-4 bottom-20 w-14 h-14 bg-[#2e9e90] rounded-full flex items-center justify-center text-white shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>

      </div>

    </div>

  </div>
</template>


<script>
import ParcelaModal from "../components/ParcelaModal.vue";
import AddCultivoModal from "../components/AddCultivoModal.vue";
import axios from "axios";
import WeatherCard from "@/components/WeatherCard.vue";
import Sidebar from "@/components/Sidebar.vue";
import SidebarMobile from "@/components/SidebarMobile.vue";
import RecomendacionesModal from "@/components/RecomendacionesModal.vue";
const BASE_URL = import.meta.env.VITE_BASE_URL;





export default {
  name: "Dashboard",
  components: { ParcelaModal, AddCultivoModal, WeatherCard, Sidebar, SidebarMobile, RecomendacionesModal },
  data() {
    return {
      tieneParcela: localStorage.getItem("tieneParcela") === "true",
      parcela: {},
      fechaActual: this.obtenerFechaActual(),
      horaActual: this.obtenerHoraActual(),
      mostrarModal: false,
      cultivos: [],
      recomendacionesIA: [],
      mostrarModalRecomendaciones: false,
      ultimaActualizacion: '',
      tiempoUltimaActualizacion: null,
      intervaloActualizacion: null,
      meteorologia_actual: {
        temperatura: null,
        humedad: null,
        viento: null,
        estado: '',
      },
    };
  },
  computed: {
    cultivosActivos() {
      return this.cultivos.filter(c => c.estado === 'activo');
    }
  },

  methods: {
    async actualizarEstadoParcela(parcela) {
      console.log("Estado parcela: " + parcela);
      this.tieneParcela = true;
      this.parcela = parcela;
      await this.obtenerParcela();
    },
    async obtenerParcela() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}api/parcela`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Parcela recibida:", response.data);
        if (response.data.parcela) {
          this.parcela = response.data.parcela;
        }
        await this.obtenerCultivos();
        await this.obtenerMeteorologia();

      } catch (error) {
        console.error("Error al obtener la parcela:", error);
      }
    },
    async obtenerCultivos() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}api/cultivo`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Respuesta del backend:", response.data);
        this.cultivos = response.data;
      } catch (error) {
        console.error("Error al obtener cultivos: ", error);
      }
    },
    obtenerFechaActual() {
      const fecha = new Date();
      const format = { weekday: "long", day: "numeric", month: "long" };
      const fechaFormat = fecha.toLocaleDateString("es-ES", format);
      return fechaFormat.charAt(0).toUpperCase() + fechaFormat.slice(1);
    },
    obtenerHoraActual() {
      const fecha = new Date();
      const opcionesHora = { hour: '2-digit', minute: '2-digit', hour12: true };
      return fecha.toLocaleTimeString("es-ES", opcionesHora);
    },
    calcularEstadoCultivo(cultivo) {
      const fechaSiembra = new Date(cultivo.fechaSiembra);
      const cicloVidaDias = parseInt(cultivo.tipoCultivo?.cicloVida, 10);

      if (!fechaSiembra || isNaN(cicloVidaDias)) {
        console.error("Datos inválidos en cultivo:", cultivo);
        return "Datos no disponibles";
      }

      const fechaCosecha = new Date(fechaSiembra);
      fechaCosecha.setDate(fechaSiembra.getDate() + cicloVidaDias);

      const hoy = new Date();

      if (hoy >= fechaCosecha) return "Listo para cosecha";
      if (hoy >= fechaSiembra) return "Crecimiento";
      return "Recién sembrado";
    },
    calcularDiasRestantes(cultivo) {
      const fechaSiembra = new Date(cultivo.fechaSiembra);
      const cicloVidaDias = parseInt(cultivo.tipoCultivo?.cicloVida, 10);

      if (!fechaSiembra || isNaN(cicloVidaDias)) return 0;

      const fechaCosecha = new Date(fechaSiembra);
      fechaCosecha.setDate(fechaSiembra.getDate() + cicloVidaDias);

      const hoy = new Date();
      const diferencia = Math.ceil((fechaCosecha - hoy) / (1000 * 60 * 60 * 24));

      return Math.max(0, diferencia);
    },
    calcularProgresoCosecha(cultivo) {
      const fechaSiembra = new Date(cultivo.fechaSiembra);
      const cicloVidaDias = parseInt(cultivo.tipoCultivo?.cicloVida, 10);
      if (!fechaSiembra || isNaN(cicloVidaDias)) return 0;
      const hoy = new Date();
      const diasPasados = Math.floor((hoy - fechaSiembra) / (1000 * 60 * 60 * 24));
      const progreso = (diasPasados / cicloVidaDias) * 100;
      return Math.min(100, Math.max(0, progreso));
    },
    async obtenerMeteorologia() {
      try {
        const idProvincia = this.parcela?.idProvincia;
        if (!idProvincia) return;
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}api/weather/current-live`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.meteorologia_actual = response.data;
      } catch (error) {
        console.error("Error al obtener datos del tiempo:", error);
      }
    },
    async obtenerClimaDiario() {
      try {
        const token = localStorage.getItem("token");
        await axios.get(`${BASE_URL}api/weather/daily`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Clima diario registrado con éxito.");
      } catch (error) {
        console.error("Error al registrar clima diario:", error.message);
      }
    },

    async obtenerRecomendaciones() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}api/recomendacion`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.recomendacionesIA = response.data.recomendaciones;
        console.log("Recomendaciones IA recibidas:", this.recomendacionesIA);

      } catch (error) {
        console.error("Error al obtener recomendaciones IA:", error);
      }
    },
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("tieneParcela");
      this.$router.push("/");
    },
    async recargarClima() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}api/weather/current-live`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        this.meteorologia_actual = response.data; 
        this.tiempoUltimaActualizacion = new Date();
        this.actualizarMensajeActualizacion();

        console.log("Clima actualizado correctamente:", this.meteorologia_actual);

      } catch (error) {
        console.error("Error al recargar clima:", error.message);
      }
    },
    actualizarMensajeActualizacion() {
      const actualizar = () => {
        if (!this.tiempoUltimaActualizacion) return;
        const ahora = new Date();
        const minutos = Math.floor((ahora - this.tiempoUltimaActualizacion) / 60000);
        this.ultimaActualizacion = minutos === 0 ? 'menos de un minuto' : `${minutos} minuto${minutos > 1 ? 's' : ''}`;
      };
      clearInterval(this.intervaloActualizacion);
      this.intervaloActualizacion = setInterval(actualizar, 60000);
      actualizar();
    },
  },


  async created() {
    if (this.tieneParcela) {
      await this.obtenerParcela();
      this.obtenerRecomendaciones();
      this.obtenerClimaDiario();

    }

  },
  beforeUnmount() {
    clearInterval(this.intervaloActualizacion);
  }
};
</script>
