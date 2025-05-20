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
              <h1 class="text-2xl font-semibold text-gray-800">Hola, {{ saludo }}</h1>
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


          <div class="flex flex-col md:flex-row gap-4 mb-6 items-stretch">

            <div class="w-full md:w-1/2 flex flex-col h-full">
              <WeatherCard class="flex-1" :meteorologia="meteorologia_actual"
                :provincia="parcela?.provincium?.nombre || 'Provincia desconocida'" :fecha="fechaActual"
                :hora="horaActual" :ultimaActualizacion="ultimaActualizacion"  />
            </div>


            <div class="w-full md:w-1/2 flex- flex-col bg-white rounded-lg border border-gray-200 p-4 overflow-y-auto"
              style="max-height: 282px">
              <div class="flex justify-between items-center mb-4">
                <h3 class="font-semibold text-gray-800">Actividades</h3>
                <button @click="mostrarModalActividad = true"
                  class="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded">
                  + Añadir
                </button>
              </div>
              <div v-if="actividades.length">
                <div v-for="actividad in actividades" :key="actividad.id"
                class="flex justify-between items-center mb-2 p-2 bg-white rounded shadow-sm">
                <div>
                  <p :class="actividad.estado === 'completada' ? 'line-through text-gray-400' : 'text-gray-800'">
                    {{ actividad.titulo }}
                  </p>
                  <p class="text-xs text-gray-400">{{ formatearFecha(actividad.fechaSugerida) }}</p>
                </div>
                <div class="flex gap-2">
                  <button v-if="actividad.estado === 'pendiente'" @click="marcarComoRealizada(actividad.id)"
                    class="bg-yellow-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded">
                    Completar
                  </button>
                  <button @click="eliminarActividad(actividad.id)"
                    class="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded">
                    Eliminar
                  </button>
                </div>
              </div>
              </div>
              <p v-else class="text-sm text-gray-500">No hay actividades aún.</p>
            </div>
          </div>


          <div class="w-full bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="font-semibold text-gray-800">Recomendaciones </h3>
            </div>
            
            <div v-if="recomendacionesIA.length" class="space-y-3">
              <div v-for="(reco, index) in recomendacionesIA.slice(0, 4)" :key="index"
                class="flex justify-between items-start">
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
            <div class="mb-5">
              <div class="flex justify-between items-center mb-7">
                <h3 class="text-xl font-semibold text-gray-800">Mis cultivos</h3>
                <RouterLink to="cultivos" class="text-[#2e9e90] text-sm font-medium">Ver todos</RouterLink>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <router-link v-for="cultivo in cultivosActivos" :key="cultivo.id" :to="`/cultivo/${cultivo.id}`"
                  class="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition duration-200">
                  <div class="p-4">
                    <div class="flex justify-between items-start mb-2">
                      <h4 class="font-semibold text-gray-800">{{ cultivo.tipoCultivo.nombre }}</h4>
                      <span class="px-2 py-1 bg-[#e0f5f3] text-[#2e9e90] text-xs rounded-md">
                        {{ calcularEstadoCultivo(cultivo) }}
                      </span>
                    </div>
                    <div class="text-sm text-gray-500 mb-2">{{ parcela.provincium?.nombre }}</div>
                    <div class="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Días para cosecha</span>
                      <span class="font-medium">{{ calcularDiasRestantes(cultivo) }} días</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div class="bg-[#2e9e90] h-2 rounded-full"
                        :style="{ width: calcularProgresoCosecha(cultivo) + '%' }"></div>
                    </div>
                  </div>
                </router-link>
              </div>
            </div>


            <div class="bg-white rounded-lg border border-gray-200 p-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-[#e0f5f3] rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#2e9e90]" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <p class="text-sm text-gray-500">{{ parcela.provincium?.nombre }}, España • Visualiza tu estado actual
                </p>
                <router-link to="/perfil"
                  class="ml-auto px-3 py-1 bg-[#2e9e90] text-white rounded-md text-xs font-medium whitespace-nowrap">Ver
                  mapa</router-link>
              </div>
            </div>
          </div>


          <button @click="logout" class="text-sm text-gray-500 hover:underline mt-4">Cerrar sesión</button>
        </div>
        <CrearActividadModal v-if="mostrarModalActividad" :idCultivo="idCultivoSeleccionado"
          @close="cerrarModalActividad" @actividadCreada="obtenerActividades" />
        <SidebarMobile />



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
import CrearActividadModal from '@/components/CrearActividadModal.vue';
const BASE_URL = import.meta.env.VITE_BASE_URL;





export default {
  name: "Dashboard",
  components: { ParcelaModal, AddCultivoModal, WeatherCard, Sidebar, SidebarMobile,  CrearActividadModal },
  data() {
    return {
      saludo: "",
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
      mostrarModalActividad: false,
      idCultivoSeleccionado: null,
      meteorologia_actual: {
        temperatura: null,
        humedad: null,
        viento: null,
        estado: '',
      },
      actividades: []
    };
  },
  computed: {
    cultivosActivos() {
      return this.cultivos.filter(c => c.estado === 'activo');
    }
  },

  methods: {
    async eliminarActividad(idActividad) {
  const confirmar = confirm("¿Seguro que deseas eliminar esta actividad?");
  if (!confirmar) return;

  try {
    const token = localStorage.getItem("token");
    await axios.delete(`${BASE_URL}api/actividad/${idActividad}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    this.obtenerActividades(); 
  } catch (error) {
    console.error("Error al eliminar la actividad:", error.message);
  }
},
    obtenerSaludo() {
      const hora = new Date().getHours();

      if (hora >= 6 && hora < 12) return "Buenos días";
      if (hora >= 12 && hora < 20) return "Buenas tardes";
      return "Buenas noches";
    },

    async obtenerActividades() {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${BASE_URL}api/actividad/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.actividades = res.data;
      } catch (error) {
        console.error('Error al cargar actividades:', error.message);
      }
    },
    formatearFecha(fecha) {
      if (!fecha) return 'No disponible';
      return new Date(fecha).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    },
    async marcarComoRealizada(idActividad) {
      try {
        const token = localStorage.getItem('token');
        await axios.put(`${BASE_URL}api/actividad/${idActividad}/completar`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        await this.obtenerActividades();
      } catch (error) {
        console.error('Error al marcar actividad como completada:', error.message);
      }
    },
    cerrarModalActividad() {
      this.mostrarModalActividad = false;
      this.idCultivoSeleccionado = null;
    },
    async actualizarEstadoParcela(parcela) {
      console.log("Estado parcela: " + parcela);
      this.tieneParcela = true;
      localStorage.setItem("tieneParcela", "true");
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
     this.tieneParcela = localStorage.getItem("tieneParcela") === "true";
    if (this.tieneParcela) {
      await this.obtenerParcela();
      this.tiempoUltimaActualizacion = new Date();
      this.actualizarMensajeActualizacion();
      this.obtenerRecomendaciones();
      this.obtenerClimaDiario();
      await this.obtenerActividades();

    }
    this.saludo = this.obtenerSaludo();

  },
  beforeUnmount() {
    clearInterval(this.intervaloActualizacion);
  }
};
</script>
