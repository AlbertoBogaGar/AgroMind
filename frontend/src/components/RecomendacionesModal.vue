<template>
    <div class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div class="bg-white w-11/12 md:w-2/3 lg:w-1/2 rounded-lg shadow-lg p-6 relative">
        
        
        <button @click="$emit('cerrar')" class="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
          ✖
        </button>
  
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">Todas las recomendaciones</h2>
  
        <div class="space-y-4 max-h-[70vh] overflow-y-auto">
          <div v-for="(reco, index) in recomendaciones" :key="index" class="border-b pb-3">
            <div class="flex justify-between items-start">
              <div class="flex items-start gap-3">
                <div class="w-1 h-10 rounded-full"
                     :class="{
                       'bg-red-500': reco.tipo === 'Grave',
                       'bg-amber-500': reco.tipo === 'Media',
                       'bg-yellow-300': reco.tipo === 'Leve'
                     }"></div>
                <div>
                  <h4 class="font-medium text-gray-800">{{ reco.titulo }}</h4>
                  <p class="text-xs text-gray-500">{{ reco.descripcion }}</p>
                </div>
              </div>
              <span class="text-xs font-semibold uppercase"
                    :class="{
                      'text-red-500': reco.tipo === 'Grave',
                      'text-amber-500': reco.tipo === 'Media',
                      'text-yellow-400': reco.tipo === 'Leve'
                    }">
                {{ reco.tipo }}
              </span>
            </div>
          </div>
        </div>
  
      </div>
    </div>
  </template>
  
  <script>
  
  export default {
    name: 'RecomendacionesModal',
    props: {
      recomendaciones: {
        type: Array,
        required: true
      }
    },
    emits: ['cerrar']
  };
  </script>
  