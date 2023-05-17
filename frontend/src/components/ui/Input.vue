<template>
  <div class="wrapper">
    <input
      class="input"
      :id="id"
      autocomplete="off"
      spellcheck="false"
      placeholder=" "
      :type="type"
      :value="modelValue"
      @input="updateValue(($event.target as HTMLInputElement).value)"
      :style="icon ? { paddingRight: '28px' } : {}"
    />
    <label
      :for="id"
      class="label"
      >{{ label }}
    </label>
    <Icon v-if="icon" class="icon"/>
    <div v-if="warningText" class="warningText">{{ warningText }}</div>
    <slot />
  </div>
</template>
<script setup lang="ts">
import * as icons from '@heroicons/vue/24/outline';

const props = defineProps<{
  id: string,
  label: string,
  type: 'password' | 'text',
  modelValue: string,
  icon?: keyof typeof icons,
  warningText?: string,
}>();

const input = ref('');
const Icon = icons[props.icon ?? 'StopIcon'];

const emit = defineEmits<{ (event: 'update:modelValue', value: string): void }>()
const updateValue = (value: string) => emit('update:modelValue', value)

</script>

<style scoped>
.input {
  border: none;
  outline: none;
  border-bottom: 2px solid rgb(34, 34, 34);
  width: 100%;
  padding: 3px 1px;
  font-size: large;
}
.label {
  position: absolute;
  left: 1px;
  top: 15px;
  transition: .3s ease;
  font-size: medium;
  color: rgb(97, 97, 97);
  pointer-events: none;
}
.wrapper {
  position: relative;
  margin-top: 10px;
}
.wrapper > .icon {
  position: absolute;
  width: 25px;
  right: 0px;
  top: 15px;
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
.warningText {
  color: red;
  font-size: small;
  font-weight: 500;
  overflow-wrap: break-word;
  line-height: 12px;
  margin-bottom: 2px;
  animation: ani 1s forwards;
  position: relative;
  transition: 1s;
}
@keyframes ani {
  0% {
    opacity: 0;
    top: -20px;
  }
  100% {
    opacity: 1;
    top: 0px;
  }
}
</style>