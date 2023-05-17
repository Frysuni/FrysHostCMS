<template>
  <RecaptchaComponent
    @response="(res: string) => recaptchaKey = res"
    ref="captchaElement"
  />
  <div class="wrapper">
    <h2 class="topic unselectable">Вход</h2>
      <form
        class="main"
        @keypress.enter.prevent
      >
        <div class="inputWrapper">
          <UserIcon class="icon" />
          <input
            type="text"
            name="usernameOrEmail"
            id="usernameOrEmail"
            placeholder=" "
            autocomplete="off"
            spellcheck="false"
            v-model="usernameOrEmail"
            @keypress.enter="() => focusNext('password')"
          >
          <label for="username">Имя или Email</label>
        </div>

        <div class="inputWrapper">
          <LockClosedIcon class="icon"/>
          <input
            :type="passwordVisible ? 'text' : 'password'"
            name="password"
            id="password"
            placeholder=" "
            autocomplete="off"
            spellcheck="false"
            v-model="password"
            @keypress.enter="buttonHandler"
          >
          <label for="password">Пароль</label>
          <EyeIcon
            v-if="passwordVisible"
            class="passwordVisibility"
            @click="() => passwordVisible = !passwordVisible"
          />
          <EyeSlashIcon
            v-else
            class="passwordVisibility"
            @click="() => passwordVisible = !passwordVisible"
          />
          
        </div>

        <span v-if="unauthorized">Имя или пароль введены неверно</span>

        <button
          @click.prevent="buttonHandler"
          :disabled="!fieldsFilled"
          id="button"
        >
          {{ validationProgress ? '' : 'Войти' }}
          <div v-if="validationProgress" class="lds-dual-ring"></div>
        </button>
      </form>
    <footer class="space-between unselectable">
      <p
        class="return"
        @click="() => $router.push('/')"
      >Назад</p>
      <p
        class="forgot"
        @click="() => $router.push('reset')"
      >
        Забыли пароль?
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { login } from '@/api';
import RecaptchaComponent from '@/components/RecaptchaComponent.vue';
import { EyeIcon, EyeSlashIcon, UserIcon, LockClosedIcon } from '@heroicons/vue/24/outline';

const router = useRouter();

const captchaElement = ref();

const recaptchaKey = ref('');

const usernameOrEmail = ref('');
const passwordVisible = ref(false);
const password = ref('');

const fieldsFilled = ref(false);
const validationProgress = ref(false);
const unauthorized = ref(false);

watch([usernameOrEmail, password], () => { unauthorized.value = false; });

async function buttonHandler() {
  if (!fieldsFilled.value) return;
  document.getElementById('button')?.focus();
  if (validationProgress.value) return;
  validationProgress.value = true;

  await captchaElement.value!.execute();

  await login({ usernameOrEmail: usernameOrEmail.value, password: password.value }, recaptchaKey.value).catch(() => {
    validationProgress.value = false;
    unauthorized.value = true;
  });
  router.push('/');
}
const focusNext = (id: string) => document.getElementById(id)?.focus();

watch([usernameOrEmail, password], (values) => {
  if (!values.includes('')) fieldsFilled.value = true;
  else fieldsFilled.value = false;
});

</script>

<style scoped>
.topic {
  text-align: center;
  font-size: x-large;
  margin-bottom: 10px;
}
.space-between {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  justify-self: flex-end;
}
p {
  font-size: small;
  cursor: pointer;
  border-bottom: 2px solid black;
  transition: .2s;
}
span:hover {
  border-color: rgb(63, 63, 63);
}
p {
  font-weight: 400;
  font-size: small;
}
.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 170px;
  font-size: large
}
footer {
  display: block;
}
.main {
  width: 300px;
  min-width: 100px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  transition: all .2s;
}
input {
  border: none;
  outline: none;
  border-bottom: 2px solid black;
  margin: 15px 0px;
  width: 100%;
  padding: 5px 20px 5px 1px;
}
label {
  position: absolute;
  left: 1px;
  top: 20px;
  transition: .3s;
  font-size: medium;
  color: gray;
  pointer-events: none;
}
.inputWrapper {
  position: relative;
}
.passwordVisibility {
  position: absolute;
  width: 25px;
  top: 20px;
  right: 190px;
  cursor: pointer;
  transition: .5s;
}
.inputWrapper > .icon {
  position: absolute;
  width: 25px;
  right: 0px;
  top: 22px;
  transition: .6s;
}
.icon {
  pointer-events: none;
}
input:active ~ label,
input:not(:placeholder-shown) ~ label,
input:focus ~ label,
input:active ~ .passwordVisibility,
input:not(:placeholder-shown) ~ .passwordVisibility,
input:focus ~ .passwordVisibility
{
  transform: translateY(-20px);
}

span {
  font-size: small;
  position: relative;
  top: -15px;
  color: red;
  max-width: 100%;
  overflow-wrap: break-word;
}
.forgot {
  color: rgb(83, 83, 255);
  font-weight: 500;
  border: none;
}
button {
  background-color: rgb(43, 76, 226);
  height: 35px;
  padding: 3px;
  border-width: 1px;
  cursor: pointer;
  border-radius: 2px;
  transition: .5s;
  outline: none;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: x-large;
  color: white;
}
button:hover {
  background-color: rgb(70, 99, 228);
}
button:disabled {
  cursor: default;
  background-color: rgba(43, 76, 226, .5);
  color: gray;
}
.lds-dual-ring:after {
  content: " ";
  display: block;
  width: 16px;
  height: 16px;
  margin: 4px;
  border-radius: 50%;
  border: 4px solid #fff;
  border-color: #fff transparent #fff transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
