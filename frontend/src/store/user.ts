import { defineStore } from 'pinia';
import { User } from '~/api/types';

export const useUserStore = defineStore('userStore', {
  state: (): {
    authed: boolean,
    uuid: string | undefined,
    username: string | undefined,
    email: string | undefined,
    assets: [{
      id: number,
      user: string,
      type: 'skin' | 'cloak',
      hd: boolean,
      slim: boolean | null
    }] | undefined,
    registered: string | undefined,
  } => ({
    authed: false,
    uuid: undefined,
    username: undefined,
    email: undefined,
    assets: undefined,
    registered: undefined,
  }),
  actions: {
    setAuth() {
      this.authed = true
    },
    disableAuth() {
      this.authed = false;
      useRouter().push('/');

      this.uuid = undefined;
      this.username = undefined;
      this.assets = undefined;
      this.registered = undefined;
    },
    pushUser(user: User) {
      this.uuid = user.uuid;
      this.username = user.username;
      this.email = user.email;
      this.assets = user.assets;
      this.registered = user.registered;
    }
  },
});