<template>
  <p class="description">На адрес <strong>{{ props.email }}</strong> был выслан шестизначный код подтверждения. Введите его в поле ниже, чтобы завершить регистрацию.</p>
  <UiInput
    type="text"
    id="code"
    label="Код подтверждения"
    v-model="code"
    icon="LockClosedIcon"
    :warningText="codeIsWrong ? 'Код подтверждения введён неверно' : undefined"
  />
  <button
    @click.prevent="buttonHandler"
    :disabled="!fieldFilled"
    id="button"
  >
    {{ validationProgress ? '' : 'Далее' }}
    <div v-if="validationProgress" class="lds-dual-ring"></div>
  </button>
</template>

<script setup lang="ts">
import { emailValidationRequest } from '@/api';

const props = defineProps<{ email: string, recaptchaCode: string }>()
const emits = defineEmits<{ (event: 'confirm', code: string): void }>();

const code = ref('');
const codeIsWrong = ref(false);

emailValidationRequest(props.email, props.recaptchaCode)

const fieldFilled = ref(false);
watch(code, (val) => val.length === 6 && !isNaN(Number(val)) ? fieldFilled.value = true : fieldFilled.value = false);
watch(code, () => codeIsWrong.value = false);

const validationProgress = ref(false);
function buttonHandler() {
  if (validationProgress.value) return;
  validationProgress.value = true;
  emits('confirm', code.value);
}

function wrongCode() {
  codeIsWrong.value = true;
  validationProgress.value = false;
}

defineExpose({ wrongCode });
</script>

<style scoped>
.description {
  font-size: medium;
  text-align: center;
  font-weight: 500;
  max-width: 450px;
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
  font-size: large;
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