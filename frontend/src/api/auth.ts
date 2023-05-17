import { refreshAccessToken } from '.';
import { useUserStore } from '../store/user';

enum SessionStorageItems {
  ExpiresAt = 'authexpiresat',
  AccessToken = 'authaccesstoken',
  ProbablyLogined = 'authprobablylogined',
}

export async function getAccess(): Promise<string | false> {
  if (
    !sessionStorage.getItem(SessionStorageItems.ExpiresAt) ||
    !sessionStorage.getItem(SessionStorageItems.ProbablyLogined)
  ) return logout()

  if (Number(sessionStorage.getItem(SessionStorageItems.ExpiresAt)) <= Math.floor(Date.now() / 1000) - 10) {
    const data = await refreshAccessToken();
    if (!data) return logout();
    await setAuth(data)
  }
  
  const accessToken = sessionStorage.getItem(SessionStorageItems.AccessToken);
  if (!accessToken) return logout();
  
  return accessToken;
}


export async function setAuth(data: { accessToken: string, expiresAfter: number }) {
  sessionStorage.setItem(SessionStorageItems.AccessToken, data.accessToken);
  sessionStorage.setItem(SessionStorageItems.ProbablyLogined, 'true');
  sessionStorage.setItem(SessionStorageItems.ExpiresAt, (Math.floor(Date.now() / 1000) + data.expiresAfter).toString());

  useUserStore().setAuth();
}

export function logout(): false {
  sessionStorage.removeItem(SessionStorageItems.AccessToken);
  sessionStorage.removeItem(SessionStorageItems.ExpiresAt);
  sessionStorage.removeItem(SessionStorageItems.ProbablyLogined);

  useUserStore().disableAuth();

  return false;
}