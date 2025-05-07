<template>
  <div >
    <div class="md:hidden mb-4">
      <div class="bg-[#2e9e90] rounded-lg p-6 text-white relative">
       


        <p class="text-sm font-medium mb-2">{{ provincia }}</p>
        <div class="flex items-end gap-2 mb-2">
          <h2 class="text-6xl font-bold">{{ meteorologia?.temperatura ?? '--' }}ºC</h2>
        </div>
        <p class="mb-1 flex items-center">
          <svg class="h-5 w-5 mr-2 text-white opacity-75" fill="none" stroke="currentColor" stroke-width="2"
            viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
          </svg>
          {{ meteorologia.estado }}
        </p>
        <p class="text-sm">{{ fecha }} - {{ hora }}</p>
        <p class="text-xs mt-1 opacity-80">Actualizado hace {{ ultimaActualizacion }}</p>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 mt-1 p-4">
        <div class="flex justify-between">
          <div class="flex items-center">
            <svg class="h-5 w-5 text-blue-500 mr-2" fill="none" stroke="currentColor" stroke-width="2"
              viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
              <path
                d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 15 5 15a7 7 0 0 0 7 7z" />
            </svg>
            <div>
              <p class="text-xs text-gray-700">Humedad</p>
              <p class="font-medium text-gray-700">{{ meteorologia.humedad }}%</p>
            </div>
          </div>
          <div class="flex items-center">
            <svg class="h-5 w-5 text-blue-500 mr-2" fill="none" stroke="currentColor" stroke-width="2"
              viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
              <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
              <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
            </svg>
            <div>
              <p class="text-xs text-gray-500">Viento</p>
              <p class="font-medium text-gray-700">{{ meteorologia.viento }} km/h</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    
    <div class="hidden md:flex gap-4">
      <div class="w-full bg-[#2e9e90] rounded-lg p-6 text-white relative">
        

        <p class="text-sm font-medium mb-2">{{ provincia }}</p>
        <div class="flex items-end gap-2 mb-2">
          <h2 class="text-6xl font-bold">{{ meteorologia?.temperatura ?? '--' }}ºC</h2>
        </div>
        <p class="mb-1">{{ meteorologia.estado }}</p>
        <p class="text-sm">{{ fecha }} - {{ hora }}</p>
        <p class="text-xs mt-1 opacity-80">Actualizado hace {{ ultimaActualizacion  }} </p>

        <div class="flex justify-between mt-8">
          <div class="flex items-center gap-2">
            <svg class="h-5 w-5 text-blue-200" fill="none" stroke="currentColor" stroke-width="2"
              viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
              <path
                d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 15 5 15a7 7 0 0 0 7 7z" />
            </svg>
            <div>
              <p class="text-xs text-blue-100">Humedad</p>
              <p class="font-medium">{{ meteorologia.humedad }}%</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <svg class="h-5 w-5 text-blue-200" fill="none" stroke="currentColor" stroke-width="2"
              viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
              <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
              <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
            </svg>
            <div>
              <p class="text-xs text-blue-100">Viento</p>
              <p class="font-medium">{{ meteorologia.viento }} km/h</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "WeatherCard",
  props: {
    meteorologia: Object,
    provincia: String,
    fecha: String,
    hora: String,
    ultimaActualizacion: String
  },

};
</script>
