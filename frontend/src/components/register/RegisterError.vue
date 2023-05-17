<template>
  <div class="main">
    <p>{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ text: string }>();

</script>

<style scoped>
.main {
  min-width: 150px;
  max-width: 300px;
  text-align: center;
  font-size: medium;
}
</style>
