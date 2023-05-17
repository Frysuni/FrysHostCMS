<template>
  <div class="wrapper">
    <button @click="() => $router.push('/login')">Войти в аккаунт</button>
    <button @click="() => $router.push('/register')">Создать аккаунт</button>
  </div>
</template>

<script setup lang="ts">


</script>

<style scoped>

.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100px;
}
button {
  width: 300px;
  height: 40px;
  margin-top: 20px;
  margin-bottom: -14px;
  border-radius: 10px;
  border: 1px solid black;
  cursor: pointer;
  background-color: rgb(90, 90, 255);
  font-size: medium;
  font-weight: 700;
  color: white;
  transition: .5s;
}
button:hover {
  background-color: rgb(62, 62, 255);
}
button:active {
  transition: none;
  border-width: 3px;
  border-color: rgb(56, 56, 56);
}
</style>
