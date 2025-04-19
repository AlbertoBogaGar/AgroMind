<template>
  <div class="relative w-full h-screen bg-gray-50">
    <!-- Modal para registrar parcela -->
    <ParcelaModal v-if="!tieneParcela" @onRegistroExitoso="actualizarEstadoParcela" />

    <!-- Dashboard cuando tiene parcela -->
    <div v-else class="flex h-screen">
      <!-- Sidebar - Visible solo en desktop -->
       <div class="flex">
       <Sidebar @abrirModal="mostrarModal = true"/>
      </div>


      <AddCultivoModal v-if="mostrarModal" @close="mostrarModal = false" />
      <!-- Main Content -->
      <div class="flex-1 flex flex-col h-screen">
        <div class="flex-1 p-4 md:p-6 md:ml-4 pb-16 md:pb-6 overflow-auto">
          <!-- Header -->
          <div class="flex justify-between items-center mb-4">
            <div>
              <h1 class="text-2xl font-semibold text-gray-800">Hola, Buenos días</h1>
              <p class="text-gray-500">{{ fechaActual }}</p>
            </div>
            <div class="w-12 h-12 bg-[#e0f5f3] text-[#2e9e90] rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2a10 10 0 1 0 10 10H12V2z"></path>
                <path d="M12 2a10 10 0 0 1 10 10h-10V2z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </div>
          </div>

          <!-- Weather Card - Mobile Design -->
           <div class=" md:hidden gap-4 mb-6">
          <WeatherCard :meteorologia="meteorologia_actual"
            :provincia="parcela?.provincium?.nombre || 'Provincia desconocida'" :fecha="fechaActual"
            :hora="horaActual" />
          </div>
        

          <!-- Recomendaciones de hoy - Mobile -->
          <div class="md:hidden mb-6">

            <div class="w bg-white rounded-lg border border-gray-200 p-4">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="font-semibold text-gray-800">Recomendaciones</h3>
                  <a href="#" class="text-[#2e9e90] text-sm font-medium">Ver todas</a>
                </div>

                <div class="space-y-3" v-if="recomendacionesIA.length && recomendacionesIA">

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
                <div v-else class="text-sm text-gray-500">No hay recomendaciones por ahora.</div>
              </div>
          </div>

          <!-- Weather and Activities - Desktop Design -->
          <div class="hidden md:flex gap-4 mb-6">
            <div class="w-1/2">
            <!-- Weather Card -->
            <WeatherCard :meteorologia="meteorologia_actual"
              :provincia="parcela?.provincium?.nombre || 'Provincia desconocida'" :fecha="fechaActual"
              :hora="horaActual" />
              </div>
            <!-- Weather Card -->


            <<!-- Recomendaciones IA - Desktop -->
              <div class="w-1/2 bg-white rounded-lg border border-gray-200 p-4">
                <div class="flex justify-between items-center ">
                  <h3 class="font-semibold text-gray-800">Recomendaciones</h3>
                  <a href="#" class="text-[#2e9e90] text-sm font-medium">Ver todas</a>
                </div>

                <div class="space-y-3" v-if="recomendacionesIA.length && recomendacionesIA">

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
                <div v-else class="text-sm text-gray-500">No hay recomendaciones por ahora.</div>
              </div>
          </div>

          <!-- AI Assistants Section -->
         <!--  <div class="mb-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-xl font-semibold text-gray-800">Asistentes IA</h3>
              <a href="#" class="text-[#2e9e90] text-sm font-medium">Ver todos</a>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
             
              <div class="bg-white rounded-lg p-4 border border-gray-200">
                <div class="flex gap-4 mb-4">
                  <div class="w-10 h-10 bg-[#e0f5f3] rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#2e9e90]" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M16 12h-6.5a2 2 0 1 0 0 4H12"></path>
                      <path d="M12 16a2 2 0 1 0 0 4a2 2 0 0 0 0-4z"></path>
                      <path d="M12 4a2 2 0 1 0 0 4a2 2 0 0 0 0-4z"></path>
                      <path d="M12 8v4"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-800">Análisis de Cultivos</h4>
                    <p class="text-sm text-gray-500">Obtenga análisis inteligente sobre el estado de sus cultivos</p>
                  </div>
                </div>
                <div class="flex justify-between items-center">
                  <div class="flex gap-2">
                    <span class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">IA</span>
                    <span class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">Asistente</span>
                  </div>
                  <button
                    class="px-4 py-2 text-[#2e9e90] border border-[#2e9e90] rounded-md text-sm font-medium">Consultar</button>
                </div>
              </div>

         
              <div class="bg-white rounded-lg p-4 border border-gray-200">
                <div class="flex gap-4 mb-4">
                  <div class="w-10 h-10 bg-[#e0f5f3] rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#2e9e90]" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path
                        d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 15 5 15a7 7 0 0 0 7 7z">
                      </path>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-800">Recomendaciones de Riego</h4>
                    <p class="text-sm text-gray-500">Optimice su consumo de agua con IA</p>
                  </div>
                </div>
                <div class="flex justify-between items-center">
                  <div class="flex gap-2">
                    <span class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">IA</span>
                    <span class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">Asistente</span>
                  </div>
                  <button
                    class="px-4 py-2 text-[#2e9e90] border border-[#2e9e90] rounded-md text-sm font-medium">Consultar</button>
                </div>
              </div>

              
              <div class="bg-white rounded-lg p-4 border border-gray-200">
                <div class="flex gap-4 mb-4">
                  <div class="w-10 h-10 bg-[#e0f5f3] rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#2e9e90]" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M18 8c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4 4 1.8 4 4zM6 15s0-2 6-2 6 2 6 2"></path>
                      <path d="M16 18h.01"></path>
                      <path d="M12 18h.01"></path>
                      <path d="M8 18h.01"></path>
                      <path d="M4 10v6"></path>
                      <path d="M20 10v6"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-800">Detección de Plagas</h4>
                    <p class="text-sm text-gray-500">Identifique y trate plagas con análisis inteligente</p>
                  </div>
                </div>
                <div class="flex justify-between items-center">
                  <div class="flex gap-2">
                    <span class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">IA</span>
                    <span class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">Asistente</span>
                  </div>
                  <button
                    class="px-4 py-2 text-[#2e9e90] border border-[#2e9e90] rounded-md text-sm font-medium">Consultar</button>
                </div>
              </div>

              
              <div class="bg-white rounded-lg p-4 border border-gray-200">
                <div class="flex gap-4 mb-4">
                  <div class="w-10 h-10 bg-[#e0f5f3] rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#2e9e90]" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6"></path>
                      <path d="M12 16H7"></path>
                      <path d="M12 12H7"></path>
                      <path d="M12 8H7"></path>
                      <path d="M16 16v-3"></path>
                      <path d="M19.001 16v-3"></path>
                      <path d="M22 18H13"></path>
                      <path d="M21 22l-3-3 3-3"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-800">Predicción de Rendimiento</h4>
                    <p class="text-sm text-gray-500">Estimaciones de cosecha basadas en datos históricos</p>
                  </div>
                </div>
                <div class="flex justify-between items-center">
                  <div class="flex gap-2">
                    <span class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">IA</span>
                    <span class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">Asistente</span>
                  </div>
                  <button
                    class="px-4 py-2 text-[#2e9e90] border border-[#2e9e90] rounded-md text-sm font-medium">Consultar</button>
                </div>
              </div>
            </div>
          </div> -->

          <!-- Mis cultivos - Solo desktop -->
          <div class="hidden md:block mb-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-xl font-semibold text-gray-800">Mis cultivos</h3>
              <a href="#" class="text-[#2e9e90] text-sm font-medium">Ver todos</a>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div v-for="cultivo in cultivos" :key="cultivo.id"
                class="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div class="p-4">
                  <div class="flex justify-between items-start mb-2">
                    <h4 class="font-semibold text-gray-800">{{ cultivo.tipoCultivo.nombre }}</h4>
                    <span class="px-2 py-1 bg-[#e0f5f3] text-[#2e9e90] text-xs rounded-md">
                      {{ calcularEstadoCultivo(cultivo) }}
                    </span>
                  </div>
                  <div class="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <span>{{ parcela.provincium.nombre }}</span>
                  </div>
                  <div class="mb-2">
                    <div class="flex justify-between text-sm mb-1 text-gray-600">
                      <span>Días para cosecha</span>
                      <span class="font-medium">{{ calcularDiasRestantes(cultivo) }} días restantes</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div class="bg-[#2e9e90] h-2 rounded-full"
                        :style="{ width: calcularProgresoCosecha(cultivo) + '%' }"></div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>


          <!-- Campo agrícola - Solo desktop -->
          <div class="hidden md:block">
            <div class="bg-white rounded-lg border border-gray-200 p-4">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 bg-[#e0f5f3] rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#2e9e90]" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-800">Campo agrícola</h3>
                  <p class="text-sm text-gray-500">{{ parcela.provincium?.nombre }}, España • Visualiza tu estado actual
                  </p>
                </div>
                <button class="ml-auto px-4 py-2 bg-[#2e9e90] text-white rounded-md text-sm font-medium">Ver
                  mapa</button>
              </div>
            </div>
          </div>
          <button
  @click="logout"
  class="text-sm text-gray-500 hover:underline mt-4"
>
  Cerrar sesión
</button>

        </div>

        
        <div class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16">
          <div class="grid grid-cols-4 h-full">
            <button class="flex flex-col items-center justify-center text-[#2e9e90]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span class="text-xs mt-1">Inicio</span>
            </button>
            <button class="flex flex-col items-center justify-center text-gray-500">
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
  </div>
</template>

<script>
import ParcelaModal from "../components/ParcelaModal.vue";
import AddCultivoModal from "../components/AddCultivoModal.vue";
import axios from "axios";
import WeatherCard from "@/components/WeatherCard.vue";
import Sidebar from "@/components/Sidebar.vue";



export default {
  name: "Dashboard",
  components: { ParcelaModal, AddCultivoModal, WeatherCard, Sidebar },
  data() {
    return {
      tieneParcela: localStorage.getItem("tieneParcela") === "true",
      parcela: {},
      fechaActual: this.obtenerFechaActual(),
      horaActual: this.obtenerHoraActual(),
      mostrarModal: false,
      cultivos: [],
      recomendacionesIA: [],
      meteorologia_actual: {
        temperatura: null,
        humedad: null,
        viento: null,
        estado: '',
      },
    };
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
    async obtenerCultivos() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/cultivo", {
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
        const response = await axios.get(`http://localhost:5000/api/weather/current-live`, {
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
        await axios.get("http://localhost:5000/api/weather/daily", {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("✅ Clima diario registrado con éxito.");
      } catch (error) {
        console.error("❌ Error al registrar clima diario:", error.message);
      }
    },

    async obtenerRecomendaciones() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/recomendacion", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.recomendacionesIA = response.data.recomendaciones; // 👈 Aquí el cambio clave
        console.log("📦 Recomendaciones IA recibidas:", this.recomendacionesIA);

      } catch (error) {
        console.error("Error al obtener recomendaciones IA:", error);
      }
    },
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("tieneParcela");
      this.$router.push("/");
    }
  },
  async created() {
    await this.obtenerRecomendaciones();
    await this.obtenerParcela();
    await this.obtenerCultivos();
    await this.obtenerMeteorologia();
    await this.obtenerClimaDiario();
  }
};
</script>
