import { defineStore } from 'pinia';
import { checkServerConnection } from '@/api';

export const useSystemStore = defineStore('systemStore', {
  state: (): {
    apiConnected: boolean,
    errors: Array<{ title: string, description: string, id: string }>,
  } => ({
    apiConnected: true,
    errors: []
  }),
  actions: {
    addError(data: { title: string, description: string }) {
      this.errors.push({ ...data, id: (Date.now() + ~~(Math.random() * 1000000)).toString() })
    },
    removeError(id: string) {
      this.errors = this.errors.filter(error => error.id != id);
    },
    changeApiConnected(value: boolean) {
      this.apiConnected = value;
    },
    apiConnectionChecker() {
      setInterval(async () => {
        this.changeApiConnected(await checkServerConnection());
      }, 5000);
    }
  },
});