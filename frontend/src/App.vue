<template>
  <img ref="qrcodeImage">
  <div>
    <ErrorOccured />
    <NotConnected v-if="false"/>
    <NuxtLayout v-else />
  </div>
</template>

<script setup lang="ts">
import { auth, refreshAccessToken } from './api';
import { useSystemStore } from './store/system';

const store = useSystemStore();

store.apiConnectionChecker();

if (process.client) refreshAccessToken().then(auth);

if (process.client) window.onerror = (e: string | Event) => {
  store.addError({ title: 'Неизвестная ошибка.', description: e.toString() });
}

</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  user-select: none;
}
</style>