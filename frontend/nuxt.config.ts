import { config } from 'dotenv';
import { from } from 'env-var';
import { resolve } from 'node:path';

config({ path: resolve(process.cwd(), '../', '.env') });
const env = from(process.env);

export default defineNuxtConfig({
  ssr: false,
  srcDir: 'src/',
  app: {
    head: {
      title: 'FrysHost',
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico',
        },
      ],
    }
  },
  devServer: {
    port: env.get('BASE_PORT').default(4000).asPortNumber(),
  },
  modules: [
    '@pinia/nuxt',
    '@nuxt/devtools',
    '@nathanchase/nuxt-dayjs-module',
  ],
  dayjs: {
    locales: ['en', 'ru', 'de'],
    defaultLocale: 'ru',
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  css: [
    '~/assets/styles/tailwind.css',
    '~/assets/styles/main.scss',
  ],
  runtimeConfig: {
    apiURL: env.get('API_URL').required().asUrlString(),
    recaptchaSiteKey: '6Lfd2sMkAAAAABMVACdNZhccY117o35gXqbSUVkK',
  },
})
