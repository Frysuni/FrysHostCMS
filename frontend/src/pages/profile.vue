<template>
  <div class="wrapper" v-if="store.authed">
    <SkinViewer/>
    <div class="profile">
      <span class="username">{{ store.username }}</span>
      <hr>
      <p class="uuid">UUID: {{ store.uuid }}</p>
      <p class="email">Email: <b>{{ store.email }}</b></p>
      <p class="registered">Зарегистрирован {{ $dayjs(store.registered).diff() }}</p>
      <hr>
      <Button @click="logout" style="background-color: red;">Выйти из аккаунта</Button>
    </div>
  </div>
  Ты не должен быть здесь
  <!-- Да, именно ты! -->
</template>

<script setup lang="ts">
import Button from '@/components/profile/Button.vue';
import { logout } from '~/api/auth';
import { useUserStore } from '~/store/user';

const store = useUserStore();
if (!store.authed) useRouter().push('/');
</script>

<style scoped>
.wrapper {
  display: flex;
  max-width: 500px;
  width: 100%;
  min-width: 40vw;
}

.profile {
  margin: 0 100% 0 5%;
}
b {
  font-size: medium;
  font-weight: 500;
}
.username {
  font-weight: 800;
  font-size: xx-large;
}

hr {
  width: 24vw;
}
.uuid, .email, .unconfirmed, .registered {
  font-size: small;
  font-weight: 400;
}
.unconfirmed {
  color: red;
  font-weight: 500;
}

</style>
