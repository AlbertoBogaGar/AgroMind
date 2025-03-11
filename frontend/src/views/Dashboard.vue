<template>
  <div class="grid grid-cols-3 grid-rows-3 gap-4 p-6 w-full h-screen">
    <div class="col-span-2 row-span-2 bg-green-400 p-6 rounded-lg shadow-lg">
      <h2 class="text-xl font-bold">Información de la Parcela</h2>
      <p>Ubicación, tamaño, coordenadas...</p>
    </div>
    
    <div class="bg-red-400 p-6 rounded-lg shadow-lg">
      <h2 class="text-lg font-bold">Alertas</h2>
      <p>⚠️ Sin alertas nuevas</p>
    </div>
    
    <div class="bg-yellow-400 p-6 rounded-lg shadow-lg">
      <h2 class="text-lg font-bold">Recomendaciones</h2>
      <p>🌱 Riega los tomates mañana.</p>
    </div>
    
    <div class="col-span-2 bg-brown-600 p-6 rounded-lg shadow-lg text-white">
      <h2 class="text-lg font-bold">Lista de Cultivos</h2>
      <p>🌽 Maíz, 🍅 Tomates, 🥕 Zanahorias</p>
    </div>
    
    <div class="bg-green-600 p-6 rounded-lg shadow-lg text-white cursor-pointer hover:bg-green-700">
      <h2 class="text-lg font-bold">➕ Añadir Cultivo</h2>
    </div>
    
    <div class="bg-blue-400 p-6 rounded-lg shadow-lg text-white cursor-pointer hover:bg-blue-500">
      <h2 class="text-lg font-bold">👤 Perfil</h2>
    </div>
    
    <div class="bg-gray-200 p-6 rounded-lg shadow-lg cursor-pointer hover:bg-gray-300">
      <h2 class="text-lg font-bold text-black">🔒 Cerrar Sesión</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
  methods: {
    logout() {
      localStorage.removeItem("token"); // Elimina el token
      this.$router.push("/"); // Redirige al login
    }
  }
};
</script>

<style scoped>
  h1 {
    color: blue;
  }
button {
  margin-top: 20px;
  padding: 10px;
  background-color: red;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
