<template>
    <div class="w-full h-screen bg-gray-50 flex overflow-x-hidden">
      <!-- Sidebar - Visible solo en desktop -->
      <div class="hidden md:flex w-16 bg-white border-r border-gray-200 h-screen">
        <div class="flex flex-col items-center h-full">
          <div class="w-full p-3">
            <div class="w-10 h-10 bg-[#2e9e90] text-white rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2a10 10 0 1 0 10 10H12V2z"></path>
                <path d="M12 2a10 10 0 0 1 10 10h-10V2z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </div>
          </div>
          <div class="flex flex-col items-center gap-6 mt-6">
            <RouterLink to="/dashboard" class="w-10 h-10 text-gray-500 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </RouterLink>
            <RouterLink to="/cultivos" class="w-10 h-10 text-gray-500 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2a10 10 0 1 0 10 10H12V2z"></path>
                <path d="M12 2a10 10 0 0 1 10 10h-10V2z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </RouterLink>
            <RouterLink to="/mapa" class="w-10 h-10 text-gray-500 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </RouterLink>
            <RouterLink to="/clima" class="w-10 h-10 bg-gray-100 text-[#2e9e90] rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
              </svg>
            </RouterLink>
            <button class="w-10 h-10 text-gray-500 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>
  
      <!-- Main Content -->
      <div class="flex-1 w-full flex flex-col h-screen overflow-x-hidden">
        <div class="flex-1 w-full p-4 md:p-6 md:ml-4 pb-16 md:pb-6 overflow-y-auto overflow-x-hidden">
          <!-- Header -->
          <div class="mb-6">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-[#2e9e90]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
            <div class="bg-[#2e9e90] rounded-lg p-6 text-white">
              <p class="text-sm font-medium mb-2">Región Agrícola Central</p>
              <div class="flex items-end gap-2 mb-2">
                <h2 class="text-6xl font-bold">24°C</h2>
              </div>
              <p class="mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-white opacity-75" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
                </svg>
                Parcialmente Nublado
              </p>
              <p class="text-sm">Lunes, 24 de mayo - 7:30 AM</p>
            </div>
            
            <div class="bg-white rounded-lg border border-gray-200 mt-1 p-4">
              <div class="flex justify-between">
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 15 5 15a7 7 0 0 0 7 7z"></path>
                  </svg>
                  <div>
                    <p class="text-xs text-gray-500">Humedad</p>
                    <p class="font-medium">65%</p>
                  </div>
                </div>
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"></path>
                    <path d="M9.6 4.6A2 2 0 1 1 11 8H2"></path>
                    <path d="M12.6 19.4A2 2 0 1 0 14 16H2"></path>
                  </svg>
                  <div>
                    <p class="text-xs text-gray-500">Viento</p>
                    <p class="font-medium">8 km/h</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Alertas meteorológicas -->
          <div class="mb-6">
            <h3 class="text-xl font-semibold text-gray-800 mb-4">Alertas meteorológicas</h3>
            
            <!-- Alerta 1: Lluvia intensa -->
            <div class="bg-white rounded-lg border border-l-4 border-l-amber-400 border-gray-200 p-4 mb-4">
              <div class="flex justify-between items-start">
                <div class="flex gap-3">
                  <div class="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
                    </svg>
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <h4 class="font-semibold text-gray-800">Lluvia intensa</h4>
                      <span class="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-md">Media</span>
                    </div>
                    <p class="text-sm text-gray-600 mt-1">Se esperan precipitaciones de hasta 50mm en las próximas 24 horas.</p>
                    
                    <div class="flex flex-wrap gap-2 mt-2">
                      <span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">Parcela Norte</span>
                      <span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">Campo Grande</span>
                      <span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">Valle Sur</span>
                    </div>
                    
                    <p class="text-xs text-gray-500 mt-2">Hoy, 14:00 - Mañana, 14:00</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Alerta 2: Vientos fuertes -->
            <div class="bg-white rounded-lg border border-l-4 border-l-red-500 border-gray-200 p-4 mb-4">
              <div class="flex justify-between items-start">
                <div class="flex gap-3">
                  <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"></path>
                      <path d="M9.6 4.6A2 2 0 1 1 11 8H2"></path>
                      <path d="M12.6 19.4A2 2 0 1 0 14 16H2"></path>
                    </svg>
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <h4 class="font-semibold text-gray-800">Vientos fuertes</h4>
                      <span class="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-md">Alta</span>
                    </div>
                    <p class="text-sm text-gray-600 mt-1">Alerta por vientos de hasta 60 km/h en la zona este.</p>
                    
                    <div class="flex flex-wrap gap-2 mt-2">
                      <span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">Invernadero Este</span>
                    </div>
                    
                    <p class="text-xs text-gray-500 mt-2">Mañana, 08:00 - 20:00</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Alerta 3: Ola de calor -->
            <div class="bg-white rounded-lg border border-l-4 border-l-blue-400 border-gray-200 p-4">
              <div class="flex justify-between items-start">
                <div class="flex gap-3">
                  <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="5"></circle>
                      <line x1="12" y1="1" x2="12" y2="3"></line>
                      <line x1="12" y1="21" x2="12" y2="23"></line>
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                      <line x1="1" y1="12" x2="3" y2="12"></line>
                      <line x1="21" y1="12" x2="23" y2="12"></line>
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <h4 class="font-semibold text-gray-800">Ola de calor</h4>
                      <span class="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-md">Baja</span>
                    </div>
                    <p class="text-sm text-gray-600 mt-1">Se esperan temperaturas de hasta 32°C durante los próximos días.</p>
                    
                    <div class="flex flex-wrap gap-2 mt-2">
                      <span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">Todas las parcelas</span>
                    </div>
                    
                    <p class="text-xs text-gray-500 mt-2">Miércoles, 08:00 - Viernes, 20:00</p>
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
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span class="text-xs mt-1">Inicio</span>
            </RouterLink>
            <RouterLink to="/cultivos" class="flex flex-col items-center justify-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2a10 10 0 1 0 10 10H12V2z"></path>
                <path d="M12 2a10 10 0 0 1 10 10h-10V2z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span class="text-xs mt-1">Cultivos</span>
            </RouterLink>
            <RouterLink to="/mapa" class="flex flex-col items-center justify-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span class="text-xs mt-1">Mapa</span>
            </RouterLink>
            <RouterLink to="/clima" class="flex flex-col items-center justify-center text-[#2e9e90]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
              </svg>
              <span class="text-xs mt-1">Clima</span>
            </RouterLink>
          </div>
        </div>
        
        <!-- Floating Action Button - Visible solo en mobile -->
        <button class="md:hidden fixed right-4 bottom-20 w-14 h-14 bg-[#2e9e90] rounded-full flex items-center justify-center text-white shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "Clima",
    data() {
      return {
        clima: {
          region: "Región Agrícola Central",
          temperatura: 24,
          estado: "Parcialmente Nublado",
          fecha: "Lunes, 24 de mayo",
          hora: "7:30 AM",
          humedad: 65,
          viento: 8
        },
        alertas: [
          {
            id: 1,
            tipo: "Lluvia intensa",
            nivel: "Media",
            nivelColor: "amber",
            icono: "cloud-rain",
            descripcion: "Se esperan precipitaciones de hasta 50mm en las próximas 24 horas.",
            ubicaciones: ["Parcela Norte", "Campo Grande", "Valle Sur"],
            periodo: "Hoy, 14:00 - Mañana, 14:00"
          },
          {
            id: 2,
            tipo: "Vientos fuertes",
            nivel: "Alta",
            nivelColor: "red",
            icono: "wind",
            descripcion: "Alerta por vientos de hasta 60 km/h en la zona este.",
            ubicaciones: ["Invernadero Este"],
            periodo: "Mañana, 08:00 - 20:00"
          },
          {
            id: 3,
            tipo: "Ola de calor",
            nivel: "Baja",
            nivelColor: "blue",
            icono: "sun",
            descripcion: "Se esperan temperaturas de hasta 32°C durante los próximos días.",
            ubicaciones: ["Todas las parcelas"],
            periodo: "Miércoles, 08:00 - Viernes, 20:00"
          }
        ]
      };
    },
    methods: {
      // Aquí podrías agregar métodos para obtener datos del clima en tiempo real
      obtenerClima() {
        // Simulación de llamada a API
        console.log("Obteniendo datos del clima...");
      }
    },
    mounted() {
      this.obtenerClima();
    }
  };
  </script>
  
  