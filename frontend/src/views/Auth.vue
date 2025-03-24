<script>
import axios from "axios";

export default {
  data() {
    return {
      email: "",
      password: "",
      nombre: "",
      registrado: false,
      mensaje: ""
    };
  },
  methods: {
    toggleForm() {
      this.registrado = !this.registrado;
      this.mensaje = "";
    },
    
    async login() {
      try {
        const response = await axios.post("http://localhost:5000/api/auth/login", {
          email: this.email,
          password: this.password
        });
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("tieneParcela", response.data.tieneParcela);
        this.mensaje = "Login exitoso ✅";


        this.$router.push( "/dashboard" );
      } catch (error) {
        this.mensaje = "Error: " + error.response.data.message;
      }
    },



    async register() {
      try {
        const response = await axios.post("http://localhost:5000/api/auth/register", {
          nombre: this.nombre,
          email: this.email,
          password: this.password
        });
        this.mensaje = "Registro exitoso ✅. Ahora inicia sesión.";
        this.registrado = false;
      } catch (error) {
        this.mensaje = "Error: " + error.response.data.message;
      }
    }
  }
};
</script>

<template>
  


  
  <div class="w-full max-w-md p-8 space-y-3 rounded-xl dark:bg-gray-50 dark:text-gray-800">
	<h1 class="text-2xl font-bold text-center">{{ registrado ? "Registro" : "Iniciar Sesión" }}</h1>
  <p class="text-center text-red-500">{{ mensaje }}</p>
	<form @submit.prevent="registrado ? register() : login()"  class="space-y-6">
		<div v-if="registrado" class="space-y-1 text-sm">
			<label for="nombre" class="block ">nombre</label>
			<input v-model="nombre" type="text" name="nombre" id="nombre" placeholder="nombre" class="w-full px-4 py-3  text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2e9e90]">
		</div>
		<div class="space-y-1 text-sm">
			<label for="email" class="block ">Email</label>
			<input v-model="email" type="email" name="email" id="email" placeholder="email" class="w-full px-4 py-3 text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2e9e90] ">
		</div>
		<div class="space-y-1 text-sm">
			<label for="password" class="block dark:text-gray-600">Contraseña</label>
			<input v-model="password" type="password" name="password" id="password" placeholder="Password" class="w-full px-4 py-3 text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2e9e90]">
			<div class="flex justify-end text-xs ">
				<a rel="noopener noreferrer" href="#">Forgot Password?</a>
			</div>
		</div>
		<button type="submit" class="block w-full p-3 text-center rounded-sm bg-[#2e9e90]">{{ registrado ? "Registrarse" : "Iniciar Sesión" }}</button>
	</form>
	

	<button @click="toggleForm" class="text-xs text-center sm:px-6 dark:text-gray-600">
		{{ registrado ? "¿Ya tienes una cuenta? Inicia sesión" : "¿No tienes una cuenta? Registrarse" }}
	</button>
</div>

</template>

