<template>
  <div class="hidden md:flex w-16 bg-white border-r border-gray-200 h-screen">
    <div class="flex flex-col items-center h-full">
      <div class="w-full p-3">
        <div class="w-10 h-10 bg-[#2e9e90] text-white rounded-lg flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2a10 10 0 1 0 10 10H12V2z"></path>
            <path d="M12 2a10 10 0 0 1 10 10h-10V2z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </div>
      </div>

      <div class="flex flex-col items-center gap-6 mt-6">
        <!-- DASHBOARD -->
        <router-link to="/dashboard" class="w-10 h-10 rounded-lg flex items-center justify-center"
          :class="$route.path === '/dashboard' ? 'bg-[#2e9e90] text-white' : 'text-gray-500 hover:bg-gray-100'">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </router-link>

        <!-- CULTIVOS -->
        <router-link to="/cultivos" class="w-10 h-10 rounded-lg flex items-center justify-center"
          :class="$route.path === '/cultivos' ? 'bg-[#2e9e90] text-white' : 'text-gray-500 hover:bg-gray-100'">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
            <path d="M12 2a10 10 0 1 0 10 10H12V2z"></path>
            <path d="M12 2a10 10 0 0 1 10 10h-10V2z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </router-link>

        <!-- CLIMA -->
        <router-link to="/clima" class="w-10 h-10 rounded-lg flex items-center justify-center"
          :class="$route.path === '/clima' ? 'bg-[#2e9e90] text-white' : 'text-gray-500 hover:bg-gray-100'">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
          </svg>
        </router-link>

        <router-link to="/asistente" class="w-10 h-10 rounded-lg flex items-center justify-center"
          :class="$route.path === '/asistente' ? 'bg-[#2e9e90] text-white' : 'text-gray-500 hover:bg-gray-100'">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
            <path d="M3 8h18M3 16h18"></path>
          </svg>
        </router-link>
        <!-- PERFIL -->
        <router-link to="/perfil" class="w-10 h-10 rounded-lg flex items-center justify-center"
          :class="$route.path === '/perfil' ? 'bg-[#2e9e90] text-white' : 'text-gray-500 hover:bg-gray-100'">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
            <path d="M20 21v-2a4 4 0 0 0-3-3.87M4 21v-2a4 4 0 0 1 3-3.87M16 3.13a4 4 0 1 1-8 0"></path>
          </svg>
        </router-link>

      </div>

      <div class="mt-auto mb-4">
        <button @click="$emit('abrirModal')"
          class="w-10 h-10 bg-[#e0f5f3] text-[#2e9e90] rounded-lg flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Sidebar",
  emits: ["abrirModal"],
};
</script>
