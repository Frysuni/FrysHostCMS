import { useUserStore } from '~/store/user';
import { setAuth } from './auth';
import endpoints from './endpoints';

export * from './apiError';

export function refreshAccessToken() {
  return endpoints.authRefresh().catch(() => false) as Promise<Awaited<ReturnType<typeof endpoints.authRefresh>> | false>;
}

export function checkServerConnection() {
  return endpoints.ping()
    .then(() => true)
    .catch(() => false)
}

export function checkAvailableUsername(username: string) {
  return endpoints.authAvailable(username)
    .then(data => data.available);
}

export function checkAvailableEmail(email: string) {
  return endpoints.authAvailable(undefined, email)
    .then(data => data.available);
}

export function getDiscordConfirmLink(recaptchaCode: string) {
  return endpoints.discordAuth(recaptchaCode)
    .then(data => data.url);
}

export async function auth(data: { accessToken: string, expiresAfter: number } | false) {
  if (!data) return;
  await setAuth(data);
  useUserStore().pushUser(await endpoints.getUser());
}

export function login(credentials: { usernameOrEmail: string, password: string }, recaptchaCode: string) {
  return endpoints.authLogin(credentials, recaptchaCode)
    .then(auth);
}

export function register(credentials: { username: string, email: string, password: string }, token: string, recaptchaCode: string, code: string) {
  return endpoints.authRegister(credentials, token, recaptchaCode, code)
    .then(auth);
}

export function emailValidationRequest(email: string, recaptchaCode: string) {
  return endpoints.emailValidate(email, recaptchaCode);
}