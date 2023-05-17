<template>
  <div class="wrapper">
    <button @click="() => useRouter().push('/profile')" style="background-color: green;">Перейти в профиль</button>
    <button @click="logout" style="background-color: red;">Выйти из аккаунта</button>
  </div>
</template>

<script setup lang="ts">
import { logout } from '@/api/auth';

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
