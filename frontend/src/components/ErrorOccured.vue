<template>
  <div class="main" v-show="true">
    <div
      class="error"
      v-for="error of store.errors"
      :key="error.id"
      :id="error.id"
      @click="() => removeError(error.id)"
    >
      <span class="title">{{ error.title }}</span>
      <hr>
      <span class="description">{{ error.description }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSystemStore } from '@/store/system';
import { watch, onMounted } from 'vue';

const store = useSystemStore();


let oldValuesIds = store.errors.map((value) => value.id);
onMounted(() => {
  watch(store.errors, (value) => {
    const difference = value.filter((x) => !oldValuesIds.includes(x.id));
    difference.forEach((val) => setTimeout(() => removeError(val.id), 20000));
    oldValuesIds = store.errors.map((value) => value.id);
  });
});

const removeError = (key: string) => {
  document.getElementById(key)!.animate([{ transform: 'none' }, { transform: 'translateX(100%)' }], 300);
  setTimeout(() => store.removeError(key), 270);
};
</script>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
  width: 30%;
  max-height: calc(100vh - 1%);
  position: absolute;
  right: 0;
  margin-right: 1%;
  margin-top: .5%;
  overflow: hidden;
  z-index: 100;
}
.error {
  background-color: rgb(255, 94, 94);
  border: 3px solid red;
  border-radius: 10px;
  width: 95%;
  position: relative;
  right: -5%;
  padding: 5px;
  margin-bottom: 10px;
  color: rgb(218, 218, 218);
  cursor: pointer;
  animation-duration: 1s;
  animation-name: popin;
  transition: .2s;
}
.error:hover {
  background-color: rgb(255, 78, 78);
  transform: translateX(-5%);
}
@keyframes popin {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: none;
  }
}
@keyframes popout {
  0% {
    transform: none;
  }
  100% {
    transform: translateX(100%);
  }
}
.title {
  text-align: center;
  width: 100%;
  text-shadow: 2px 2px 2px black;
}
.description {
  font-size: medium;
}
</style>
