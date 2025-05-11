<template>
    <div
      class="h-screen w-screen bg-cover bg-center flex items-center justify-center"
      style="background-image: url('/ruta/a/tu/imagen-campo.jpg')"
    >
      <div class="bg-white bg-opacity-90 p-8 rounded-lg text-center shadow-lg max-w-md mx-4">
        <h1 class="text-6xl font-bold text-[#2e9e90] mb-4">404</h1>
        <p class="text-lg text-gray-800 mb-2">Página no encontrada</p>
        <p class="text-sm text-gray-600 mb-6">Aquí no está tu huerto... pero no te vayas sin sembrar algo </p>
        <RouterLink
          to="/"
          class="bg-[#2e9e90] hover:bg-[#21897a] text-white px-5 py-2 rounded-md transition"
        >
          Volver al inicio
        </RouterLink>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "NotFound"
  };
  </script>
  