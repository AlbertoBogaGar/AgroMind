<template>
  <div>
    <h1>Bienvenido al Dashboard</h1>
    <p>Aquí podrás gestionar tu parcela y cultivos.</p>
    
    <button @click="logout">Cerrar Sesión</button>
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
