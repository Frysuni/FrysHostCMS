<template>
  <form
    class="main"
    @keypress.enter.prevent
  >
    <UiInput
      id="username"
      label="Имя пользователя"
      type="text"
      v-model="username"
      icon="UserIcon"
      :warningText="usernameWarn"
      @keypress.enter="focusNext('email')"
    />

    <UiInput
      id="email"
      label="Электронная почта"
      type="text"
      v-model="email"
      icon="AtSymbolIcon"
      :warningText="emailWarn"
      @keypress.enter="focusNext('password')"
    />

    <UiInput
      id="password"
      label="Пароль"
      v-model="password"
      icon="LockClosedIcon"
      :warningText="passwordWarn"
      :type="passwordVisible ? 'text' : 'password'"
      @keypress.enter="focusNext('passwordConfirm')"
    >
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
    </UiInput>

    <UiInput
      id="passwordConfirm"
      label="Подтверждение пароля"
      v-model="passwordConfirm"
      icon="LockClosedIcon"
      :warningText="passwordConfirmWarn"
      :type="passwordVisible ? 'text' : 'password'"
      @keypress.enter="focusNext('button')"
    />
  
    <div class="h-4"></div>

    <button
      @click.prevent="buttonHandler"
      :disabled="!fieldsFilled"
      id="button"
      class="button"
    >
      {{ validationProgress ? '' : 'Далее' }}
      <div v-if="validationProgress" class="lds-dual-ring"></div>
    </button>
  </form>
</template>

<script setup lang="ts">
import { checkAvailableUsername, checkAvailableEmail } from '@/api';
import { ref, watch, defineEmits } from 'vue';
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline';

const emits = defineEmits<{(event: 'next-step', payload: { username: string, email: string, password: string }): void }>();

const username = ref('');
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');

const passwordVisible = ref(false);

const focusNext = ref((id: string) => document.getElementById(id)?.focus());

const fieldsFilled = ref(false);
watch([username, email, password, passwordConfirm], (values) => {
  if (!values.includes('')) fieldsFilled.value = true;
  else fieldsFilled.value = false;
  validationProgress.value = false;
});

const validationProgress = ref(false);
const usernameWarn = ref('');
const emailWarn = ref('');
const passwordWarn = ref('');
const passwordConfirmWarn = ref('');

const buttonHandler = ref(async () => {
  if (!fieldsFilled.value) return;
  document.getElementById('button')?.focus();
  if (validationProgress.value) return;

  validationProgress.value = true;

  const usernameValidationError = await validators.username();
  if (usernameValidationError) usernameWarn.value = usernameValidationError;

  const emailValidationError = await validators.email();
  if (emailValidationError) emailWarn.value = emailValidationError;

  const passwordValidationError = await validators.password();
  if (passwordValidationError) passwordWarn.value = passwordValidationError;

  const passwordConfirmValidationError = await validators.passwordConfirm();
  if (passwordConfirmValidationError) passwordConfirmWarn.value = passwordConfirmValidationError;

  if (usernameValidationError || emailValidationError || passwordValidationError || passwordConfirmValidationError) {
    validationProgress.value = false;
  } else {
    emits('next-step', { username: username.value, password: password.value, email: email.value });
  }
});

const validators = {
  async username(): Promise<string | false> {
    if (!username.value.length) return 'Поле должно быть заполнено';
    if (username.value.length < 4) return 'Имя должно содержать более 3 символов';
    if (username.value.length > 16) return 'Имя должно быть короче 16 символов';
    if (!/^[a-z0-9_-]+$/i.test(username.value)) return 'Имя может содержать только латинские буквы, цифры и знаки "_", "-"';
    if (!await checkAvailableUsername(username.value)) return 'Имя занято';
    return false;
  },
  async email(): Promise<string | false> {
    if (!email.value.length) return 'Поле должно быть заполнено';
    if (!/^\S+@\S+\.\S+$/.test(email.value)) return 'Введите корректный адрес электронной почты';
    if (!await checkAvailableEmail(email.value)) return 'Учетная запись с таким Email адресом уже существует';
    return false;
  },
  async password(): Promise<string | false> {
    if (!password.value.length) return 'Поле должно быть заполнено';
    if (password.value.length < 8) return 'Пароль должен содержать минимум 8 символов';
    if (password.value.includes(' ')) return 'Пароль не должен содержать пробелы';
    if (!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(password.value)) {
      return 'Пароль должен содержать заглавные и строчные буквы, а так же цифры и специальные символы.';
    }
    return false;
  },
  async passwordConfirm(): Promise<string | false> {
    if (!passwordConfirm.value.length) return 'Поле должно быть заполнено';
    if (password.value !== passwordConfirm.value) return 'Пароль не совпадает';
    return false;
  },
};
</script>

<style scoped>
.main {
  width: 300px;
  min-width: 100px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  transition: all .2s;
}
.passwordVisibility {
  position: absolute;
  width: 25px;
  top: 16px;
  right: 190px;
  cursor: pointer;
  transition: .3s ease;
}
input:active ~ .passwordVisibility,
input:not(:placeholder-shown) ~ .passwordVisibility,
input:focus ~ .passwordVisibility
{
  transform: translateY(-20px);
}

.button {
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
  font-size: large;
  color: white;
}
.button:hover {
  background-color: rgb(70, 99, 228);
}
.button:disabled {
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
