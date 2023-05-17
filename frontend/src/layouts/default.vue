<template>
  <div class="app">
    <Header />
    <main>
      <div class="dialog">
        <NuxtPage />
      </div>
    </main>
  </div>
</template>

<style scoped>
.app {
  background-color: rgb(204, 204, 204);
  width: 100vw;
  height: 100vh;
  align-items: center;
  font-size: xx-large;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
}
.dialog {
  max-width: max-content;
  background-color: white;
  min-height: 20%;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 10%;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, .2);
}
.header {
  background-color: rgb(43, 76, 226);
  height: 7vh;
  position: absolute;
  top: 0;
  width: 100vw;
}
</style>
