<template>
  <div class="wrapper">
    <p>FrysHost</p>
  </div>
  <BasicLogined v-if="userStore.authed === true"/>
  <BasicNotLogined v-else/>
</template>

<script setup lang="ts">
import { useUserStore } from '~~/src/store/user';

const userStore = useUserStore();

</script>

<style scoped>
p {
  color: blueviolet;
}
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
