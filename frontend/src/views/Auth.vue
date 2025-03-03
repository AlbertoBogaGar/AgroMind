<script>
import axios from "axios";

export default {
  data() {
    return {
      email: "",
      password: "",
      nombre: "",
      isRegistering: false,
      mensaje: ""
    };
  },
  methods: {
    toggleForm() {
      this.isRegistering = !this.isRegistering;
      this.mensaje = "";
    },
    async login() {
      try {
        const response = await axios.post("http://localhost:5000/api/auth/login", {
          email: this.email,
          password: this.password
        });
        localStorage.setItem("token", response.data.token);
        this.mensaje = "Login exitoso ✅";
      } catch (error) {
        this.mensaje = "Error: " + error.response.data.message;
      }
    },



    async register() {
      try {
        const response = await axios.post("http://localhost:5000/api/auth/register", {
          name: this.nombre,
          email: this.email,
          password: this.password
        });
        this.mensaje = "Registro exitoso ✅. Ahora inicia sesión.";
        this.isRegistering = false; // Cambia a login después de registrarse
      } catch (error) {
        this.mensaje = "Error: " + error.response.data.message;
      }
    }
  }
};
</script>

<template>
  <div>
    <h2>{{ isRegistering ? "Registro" : "Iniciar Sesión" }}</h2>
    
    <p v-if="mensaje">{{ mensaje }}</p>

    <form @submit.prevent="isRegistering ? register() : login()">
      <div v-if="isRegistering">
        <label>Nombre:</label>
        <input v-model="nombre" type="text" required />
      </div>

      <label>Email:</label>
      <input v-model="email" type="email" required />

      <label>Contraseña:</label>
      <input v-model="password" type="password" required />

      <button type="submit">
        {{ isRegistering ? "Registrarse" : "Iniciar Sesión" }}
      </button>
    </form>

    <button @click="toggleForm">
      {{ isRegistering ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Regístrate" }}
    </button>
  </div>
</template>

<style scoped>
/* Estilos básicos */
input {
  display: block;
  margin-bottom: 10px;
  padding: 5px;
  color: black;
}
</style>
