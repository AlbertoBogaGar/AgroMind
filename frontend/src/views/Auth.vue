<template>
  <div class="w-full max-w-md p-8 space-y-3 rounded-xl bg-gray-50 text-gray-800 m-4">
    <h1 class="text-2xl font-bold text-center">{{ registrado ? "Registro" : "Iniciar Sesión" }}</h1>
    <p class="text-center text-red-500">{{ mensaje }}</p>
    <form @submit.prevent="registrado ? register() : login()" class="space-y-6">
      <div v-if="registrado" class="space-y-1 text-sm">
        <label for="nombre" class="block">Nombre</label>
        <input v-model="nombre" type="text" name="nombre" id="nombre" placeholder="nombre" :class="['w-full px-4 py-3 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2e9e90]',
          errores.nombre ? 'border-red-500' : 'border-gray-300']">
      </div>
      <div class="space-y-1 text-sm">
        <label for="email" class="block">Email</label>
        <input v-model="email" type="email" name="email" id="email" placeholder="email" :class="['w-full px-4 py-3 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2e9e90]',
          errores.email ? 'border-red-500' : 'border-gray-300']">
      </div>
      <div class="space-y-1 text-sm">
        <label for="password" class="block dark:text-gray-600">Contraseña</label>
        <input v-model="password" type="password" name="password" id="password" placeholder="Password" :class="['w-full px-4 py-3 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2e9e90]',
          errores.password ? 'border-red-500' : 'border-gray-300']">
      </div>
      <button type="submit" class="block w-full p-3 text-center rounded-sm bg-[#2e9e90]">{{ registrado ? "Registrarse" :
        "Iniciar Sesión" }}</button>
    </form>


    <button @click="toggleForm" class="text-xs text-center sm:px-6 dark:text-gray-600">
      {{ registrado ? "¿Ya tienes una cuenta? Inicia sesión" : "¿No tienes una cuenta? Registrarse" }}
    </button>
  </div>

</template>

<script>
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;


export default {
  data() {
    return {
      email: "",
      password: "",
      nombre: "",
      registrado: false,
      mensaje: "",
      errores: {
        email: false,
        password: false,
        nombre: false
      }
    };
  },
  methods: {
    toggleForm() {
      this.registrado = !this.registrado;
      this.mensaje = "";
      this.errores = { email: false, password: false, nombre: false };
    },

    validarEmail(email) {
      const expresion = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return expresion.test(email);
    },

    validarCampos() {
      this.errores = { email: false, password: false, nombre: false };

      let valido = true;

      if (this.registrado && this.nombre.trim().length < 2) {
        this.errores.nombre = true;
        this.mensaje = "El nombre debe tener al menos 2 caracteres";
        valido = false;
      }

      if (!this.validarEmail(this.email)) {
        this.errores.email = true;
        this.mensaje = "Introduce un email válido";
        valido = false;
      }

      if (this.password.length < 4) {
        this.errores.password = true;
        this.mensaje = "La contraseña debe tener al menos 6 caracteres";
        valido = false;
      }

      return valido;
    },

    async login() {
      if (!this.validarCampos()) return;

      try {
        const response = await axios.post(`${BASE_URL}api/auth/login`, {
          email: this.email,
          password: this.password
        });
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("tieneParcela", response.data.tieneParcela);
        this.mensaje = "Login exitoso";
        this.$router.push("/dashboard");
      } catch (error) {
        this.mensaje = "Error: " + error.response?.data?.message || "Error al iniciar sesión";
      }
    },

    async register() {
      if (!this.validarCampos()) return;

      try {
        await axios.post(`${BASE_URL}api/auth/register`, {
          nombre: this.nombre,
          email: this.email,
          password: this.password
        });

        const loginRes = await axios.post(`${BASE_URL}api/auth/login`, {
          email: this.email,
          password: this.password
        });

        localStorage.setItem("token", loginRes.data.token);
        localStorage.setItem("tieneParcela", loginRes.data.tieneParcela);
        this.mensaje = "Registro y acceso exitoso ";
        this.$router.push("/dashboard");

      } catch (error) {
        this.mensaje = "Error: " + error.response?.data?.message || "Error al registrar";
      }
    }

  },
  mounted() {
    const token = localStorage.getItem("token");
    if (token) {
      this.$router.push("/dashboard");
    }
  },
};
</script>
