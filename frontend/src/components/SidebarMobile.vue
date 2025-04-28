<template>
  <div class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 z-50">
    <div class="grid grid-cols-5 h-full">
      <router-link to="/dashboard" class="flex flex-col items-center justify-center"
        :class="$route.path === '/dashboard' ? 'text-[#2e9e90]' : 'text-gray-500'">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span class="text-xs mt-1">Inicio</span>
      </router-link>

      <router-link to="/cultivos" class="flex flex-col items-center justify-center"
        :class="$route.path === '/cultivos' ? 'text-[#2e9e90]' : 'text-gray-500'">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
          <path d="M12 2a10 10 0 0 1 10 10h-10V2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <span class="text-xs mt-1">Cultivos</span>
      </router-link>

      <router-link to="/clima" class="flex flex-col items-center justify-center"
        :class="$route.path === '/clima' ? 'text-[#2e9e90]' : 'text-gray-500'">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
          <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
        </svg>
        <span class="text-xs mt-1">Clima</span>
      </router-link>

      <router-link to="/asistente" class="flex flex-col items-center justify-center"
        :class="$route.path === '/asistente' ? 'text-[#2e9e90]' : 'text-gray-500'">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
          <path d="M3 8h18M3 16h18" />
        </svg>
        <span class="text-xs mt-1">Asistente</span>
      </router-link>
      <router-link to="/perfil" class="flex flex-col items-center justify-center"
        :class="$route.path === '/perfil' ? 'text-[#2e9e90]' : 'text-gray-500'">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
          <path d="M20 21v-2a4 4 0 0 0-3-3.87M4 21v-2a4 4 0 0 1 3-3.87M16 3.13a4 4 0 1 1-8 0"></path>
        </svg>
        <span class="text-xs mt-1">Perfil</span>
      </router-link>

    </div>
  </div>
</template>

<script>
export default {
  name: "SidebarMobile"
};
</script>