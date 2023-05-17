<!-- eslint-disable import/prefer-default-export -->
<template>
  <VueRecaptcha
    :ref="(el: any) => captchaElement = el"
    sitekey="6Lfd2sMkAAAAABMVACdNZhccY117o35gXqbSUVkK"
    :load-recaptcha-script="true"
    theme="light"
    size="invisible"
    recaptcha-host="www.recaptcha.net"
    @verify="verify"
    @render="() => rendered = true"
    @expired="resetCaptcha"

  />
</template>
<script setup lang="ts">
import { ref, defineEmits, defineExpose } from 'vue';
import { VueRecaptcha } from 'vue-recaptcha';

const emits = defineEmits<{(event: 'response', response: string): void }>();

const captchaElement = ref<VueRecaptcha | null>();

const verifiedEvent = new Event('verifiedRecaptcha', { bubbles: true, cancelable: false });

function verify(response: string) {
  emits('response', response);
  document.dispatchEvent(verifiedEvent);
}

function resetCaptcha() {
  if (!captchaElement.value?.reset) return;
  captchaElement.value.reset();
}

const rendered = ref(false);

const execute = () => {
  if (!captchaElement.value) return;
  resetCaptcha();
  return new Promise<void>((res, rej) => {
    let resolved = false;
    document.addEventListener('verifiedRecaptcha', function listener() {
      document.removeEventListener('verifiedRecaptcha', listener, { capture: true });
      res();
      resolved = false;
    });
    setTimeout(() => {
      if (resolved) return;
      rej(Error('Captcha is not resolved.'));
    }, 2 * 60 * 1000);
    captchaElement.value!.execute();
  });
};

defineExpose({ rendered, execute });

</script>
