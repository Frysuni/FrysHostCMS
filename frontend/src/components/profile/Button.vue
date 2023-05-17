<template>
  <button><slot></slot></button>
</template>

<script setup lang="ts">

</script>

<style scoped>
button {
  background-color: rgb(43, 76, 226);
  border: 1px solid black;
  border-radius: 5px;
  font-size: medium;
  padding: 5px;
  color: rgb(202, 202, 202);
  margin-top: 3px;
  width: 70%;
  cursor: pointer;
}
</style>
