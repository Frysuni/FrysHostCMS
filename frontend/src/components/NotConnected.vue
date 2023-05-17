<template>
  <div class="h-screen flex flex-col justify-center">
    <div class="">
      <div class="lds-dual-ring"></div>
    </div>
    <span class="text">Нет подключения к серверу...</span>
  </div>
</template>

<style scoped>
.text {
  margin: 0 auto;
  margin-top: 100px;
  position: relative;
  top: 200px;
  display: block;
  align-self: flex-end;
  animation: fadein 3s;
}
.lds-dual-ring:after {
  content: " ";
  display: block;
  margin: 0 auto 0 auto;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 8px solid rgb(43, 76, 226);
  border-color: rgb(43, 76, 226) transparent rgb(43, 76, 226) transparent;
  animation: lds-dual-ring 2s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes fadein {
  0% {
    color: transparent;
  }
  50% {
    color: transparent;
  }
  100% {
    color: inherit;
  }
}
</style>
