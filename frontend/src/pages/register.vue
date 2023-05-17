<template>
  <RecaptchaComponent
    @response="(response: string) => recaptchaKey = response"
    ref="captchaElement"
  />
  <div class="wrapper">
    <h2 class="topic unselectable">Регистрация</h2>
    <RegisterError
      v-if="step === StepEnum.Error"
      :text="registerErrorText"
    />
    <RegisterDiscord
      v-if="step === StepEnum.Discord"
      @continue="confirmDiscord"
    />
    <RegisterForm
      v-if="step === StepEnum.Form"
      @next-step="confirmForm"
      v-model:recaptchacode="recaptchaKey"
    />
    <RegisterEmail 
      v-if="step === StepEnum.Email"
      :email="data.form.email"
      :recaptchaCode="recaptchaKey"
      @confirm="confirmEmail"
    />
    <!-- <RegisterTwoFA
      v-if="step === StepEnum.TwoFA"
    
    /> -->
    <footer class="space-between unselectable">
      <span
        class="return"
        @click="() => $router.push('/')"
      >Назад</span>
      <p>{{ step }}/4</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { getDiscordConfirmLink, register, matchError } from '@/api';
import RegisterEmail from '../components/register/RegisterEmail.vue';

const captchaElement = ref();

enum StepEnum {
  Error,
  Discord,
  Form,
  Email,
  TwoFA,
}
const step = ref<number>(StepEnum.Discord);
const registerErrorText = ref('');
type FormPayload = { username: string, email: string, password: string}
const data = ref<{ discord: { token: string }, form: FormPayload }>({
  discord: { token: '' },
  form: { username: '', email: '', password: '' },
});

const router = useRouter();
const recaptchaKey = ref('');
const registerEmailRef = ref<InstanceType<typeof RegisterEmail>>();

async function confirmDiscord(): Promise<void> {
  await captchaElement.value?.execute();
  const url = await getDiscordConfirmLink(recaptchaKey.value);
  if (process.client) window.location.href = url;
}

async function confirmForm(payload: FormPayload) {
  data.value.form = payload;
  step.value = StepEnum.Email;
}

async function confirmEmail(code: string) {
  await captchaElement.value?.execute();

  register(data.value.form, token, recaptchaKey.value, code)
    .then(() => {
      router.push('/');
    })
    .catch(e => {
      if (matchError(e, 'AuthRegister: Invalid discord authorization token')) {
        step.value = StepEnum.Error;
      } else if (matchError(e, 'AuthRegister: Invalid email activation code. (Or email not the same)')) {
        registerEmailRef.value?.wrongCode();
      } else {
        router.push('/404');
        throw e;
      }
    })
  
}

let token = '';
const route = useRoute();
if (route.query.auth) {
  if (route.query.auth === 'false') {
    registerErrorText.value = 'Короче ты кринж. Я устал чистить бд на старом сайте, симплкабинете этом блин, и только поэтому написал вот это. Ты не состоишь в нужном дискорд гилде, так что у тебя не выйдет зарегистрироваться.'
    step.value = StepEnum.Error;
  } else if (route.query.auth === 'exists') {
    registerErrorText.value = 'Ты кринж! На этот дискорд аккаунт уже зарегистрирвоан тут аккаунт, жми назад и входи в него.'
    step.value = StepEnum.Error;
  } else {
    step.value = StepEnum.Form;
    token = route.query.auth as string;
  }
  if (process.client) router.replace({ query: {} });
}

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
span {
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
}
footer {
  display: block;
}
</style>
