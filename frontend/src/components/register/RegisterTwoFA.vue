<template>
  <div class="main">
    <h5>Подключение двухфакторной авторизации.</h5>
    <p>Загрузите и установите на Ваш телефон одно из приложений: "Google Authentificator", "Яндекс.Ключ", "Authy", затем при помощи него отсканируйте QR-код слева и введите ключ из приложения в поле справа.</p>

    

    <div class="flex my-4">
      <img ref="qrcodeImage">
      <div class="flex flex-col mx-4">
        <UiInput
          class="codeInput"
          id="2faCode"
          label="Ключ"
          type="text"
          v-model="twoFaCode"
          icon="LockClosedIcon"
        />
        <Button class="text-m font-normal bg-slate-300 rounded-lg">Подтвердить</Button>
        <span
          class="text-sm font-light underline-offset-4 underline text-blue-800 mt-10 cursor-pointer"
          v-if="!standartQR"
          @click="alternateMethod"
        >Альтернативный способ</span>
        <span
          v-else
        >{{ 'token' }}</span>
      </div>

    </div>



  </div>

</template>

<script setup lang="ts">
import QrCode, { BaseOptions } from 'qrcode-with-logos';
// import * as authentificator from 'notp';

const twoFaCode = ref('');
const standartQR = ref(false);
const qrcodeImage = ref<HTMLImageElement>();


function alternateMethod() {
  standartQR.value = true;
  renderQrCode(standartQRSettings);
}

const megaQrSettings: Partial<BaseOptions> = {
  nodeQrCodeOptions: {
    margin: 2,
    errorCorrectionLevel: 'Q',
    color: {
      dark: '#FFFFFFFF',
      light: '#333333FF'
    }
  },
  logo: {
    src: 'favicon.ico',
    borderRadius: 15,
    borderSize: 0.10,
    logoSize: 0.25,
    bgColor: '#333333FF'
  }
}
const standartQRSettings: Partial<BaseOptions> = {
  nodeQrCodeOptions: {
    margin: 2,
    errorCorrectionLevel: 'H',
  },
}
function renderQrCode(settings: Partial<BaseOptions> = megaQrSettings) {
  new QrCode({
    content: "https://github.com/zxpsuper",
    width: 200,
    image: qrcodeImage.value,
    ...settings,
  }).toImage();
}
if (process.client) onMounted(renderQrCode);
</script>

<style scoped>
.main {
  max-width: 400px;
}
h5 {
  text-align: center;
  font-size: x-large;
}
p {
  text-align: center;
  font-size: small;
  font-weight: 400;
}
img {
  border-radius: 5px;
}
.codeInput {
  max-width: 300px;
}
.dataWrapper {
  display: flex;
}
</style>