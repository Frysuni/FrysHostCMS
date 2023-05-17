<template>
  <button class="return" @click="listener">Вернуться на главную</button>
  <div class="wrapper">
    <div class="notfound">
      <div class="centered"><span class="inverted">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;</div>
      <div class="centered"><span class="inverted">&nbsp;4&nbsp;0&nbsp;4&nbsp;</span><span class="shadow">&nbsp;</span></div>
      <div class="centered"><span class="inverted">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="shadow">&nbsp;</span></div>
      <div class="centered">&nbsp;<span class="shadow">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></div>
      <div class="row">&nbsp;</div>
      <div class="row">A fatal exception 404 has occurred at {{ path }} in FRYSHOST.RU</div>
      <div class="row">The current request will be terminated.</div>
      <div class="row">&nbsp;</div>
      <div class="row">* Press any key to return to the previous page.</div>
      <div class="row">* Press ALT+F4 to think about your actions. You will</div>
      <div class="row">&nbsp;&nbsp;lose any unsaved information in all applications.</div>
      <div class="row">&nbsp;</div>
      <div class="centered">Press any key to continue...<span class="blink">&#9608;</span></div>
  </div>
</div>
</template>

<script setup lang="ts">
const path = useRouter().currentRoute.value.path.toUpperCase();

function listener() {
  useRouter().push('/');
  window.removeEventListener('keyup', listener);
}

onMounted(() => {
  window.addEventListener('keyup', listener)
})
</script>

<style scoped>
@font-face {
    font-family: 'dosasd';
    src: url('~/assets/fonts/moreperfectdosvga.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
}
.return {
  position: absolute;
  width: 200px;
  height: 50px;
  font-family: 'Inter';
  border-radius: 15px;
  border: 2px solid black;
  background-color: #35358d;
  animation: popup 1s forwards 4s;
  color:white;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  transition: .2s;
  top: -60px;
}
.return:hover {
  transform: translateY(-5px);
}
@keyframes popup {
  0% {
    top: -60px;
  }
  100% {
    top: 50px;
  }
}
.wrapper {
    background-color: #000084;
    color: #bbb;
    font-family: 'dosasd';
    font-size: 15px;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

@media (min-width: 600px) {
    body {
        font-size: 16px;
    }
}

@media (min-width: 900px) {
    body {
        font-size: 24px;
        font-weight: 400;
    }
}

.notfound {
    width: 70ch;
    height: 25ch;
    background-color: #000084;
}

.row {
    text-align: left;
}

.centered {
    text-align: center;
}

.inverted {
    background-color: #bbb;
    color: #000084;
}

.shadow {
    background-color: #000;
    color: #000084;
}

.blink {
    animation: blinkingText .8s infinite;
}

@keyframes blinkingText {
    0% {
        opacity: 0;
    }
    
    49% {
        opacity: 0;
    }
    
    50% {
        opacity: 1;
    }
}


</style>