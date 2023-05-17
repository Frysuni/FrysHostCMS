import { Request, Params } from './core';
import { User } from './types';

export default {
  authRefresh,
  ping,
  authAvailable,
  authLogin,
  authRegister,
  discordAuth,
  emailValidate,
  getUser,
}

function authRefresh() {
  type T = { 'accessToken': string, 'expiresAfter': number };
  const params: Params = { method: 'POST', pathname: 'auth/refresh', preventErrorHandling: true, withCredentials: true };
  return Request<T>(params);
}

function ping() {
  type T = {};
  const params: Params = { method: 'GET', pathname: 'ping', preventErrorHandling: true };
  return Request<T>(params);
}

function authAvailable(username?: string, email?: string) {
  type T = { available: boolean };
  const params: Params = { method: 'GET', pathname: 'auth/available', query: { username, email } };
  return Request<T>(params);
}

function discordAuth(recaptchaCode: string) {
  type T = { url: string };
  const params: Params = { method: 'GET', pathname: 'discord/auth', recaptchaCode };
  return Request<T>(params);
}

function authRegister(credits: { username: string, email: string, password: string }, token: string, recaptchaCode: string, code: string) {
  type T = { accessToken: string, expiresAfter: number };
  const params: Params = { method: 'POST', pathname: 'auth/register', recaptchaCode, withCredentials: true, body: { ...credits, token, code } };
  return Request<T>(params);
}

function authLogin(credits: { usernameOrEmail: string, password: string }, recaptchaCode: string) {
  type T = { accessToken: string, expiresAfter: number };
  const params: Params = { method: 'POST', pathname: 'auth/login', recaptchaCode, body: credits, withCredentials: true };
  return Request<T>(params);
}

function emailValidate(email: string, recaptchaCode: string) {
  type T = {};
  const params: Params = { method: 'POST', pathname: 'email/activate', recaptchaCode, body: { email } };
  return Request<T>(params);
}

function getUser() {
  const params: Params = { method: 'GET', pathname: 'users/me', auth: true }
  return Request<User>(params);
}