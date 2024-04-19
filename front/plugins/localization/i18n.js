import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

import es from "./locales/es.json";
import en from "./locales/en.json";

const messages = {
  'en': en,
  'es': es,
  //'de': de
};

export const i18n = new VueI18n({
  locale: 'es', // set locale
  fallbackLocale: 'en', // set fallback locale
  messages, // set locale messages
});

export const lang = Object.keys(messages);
