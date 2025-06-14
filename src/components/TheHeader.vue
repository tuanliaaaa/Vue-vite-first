<template>
    <nav>
        <router-link to="/friend">Friend</router-link>
    </nav>
</template>
<script>
</script>
<style scoped>
nav {
  display: flex;
  justify-content: center;
  padding: 20px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  margin: 0 15px;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

nav a.router-link-exact-active {
  background-color: #42b983;
  color: white;
}

nav a:hover {
  background-color: #e0e0e0;
}
</style>