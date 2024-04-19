import "regenerator-runtime/runtime.js";

import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import router from './router';
import Vuetify from 'vuetify';
import VueI18n from 'vue-i18n';
import {i18n} from './plugins/localization/i18n';
import ECharts from 'vue-echarts';

// import ECharts modules manually to reduce bundle size
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/boxplot';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';

import App from './components/App.vue';

import '@mdi/font/css/materialdesignicons.css'
import es from 'vuetify/es5/locale/es'
import en from 'vuetify/es5/locale/en'

import VueSyncersFeathers from 'vue-syncers-feathers';
import feathersClient from "./feathers-client";

Vue.config.productionTip = false;


Vue.use(VueResource);
Vue.use(VueRouter);
Vue.use(VueI18n);

Vue.component('v-chart', ECharts);


// TODO: Upgrade vue when fixed https://github.com/vuetifyjs/vuetify/issues/9999
const ignoreWarnMessage = 'The .native modifier for v-on is only valid on components but it was used on <div>.';
Vue.config.warnHandler = function (msg, vm, trace) {
    // `trace` is the component hierarchy trace
    if (msg === ignoreWarnMessage) {
        msg = null;
        vm = null;
        trace = null;
    }
};

Vue.use(VueSyncersFeathers, {
    aliases: true,
    feathers: feathersClient
});

Vue.use(Vuetify);


let vuetify = new Vuetify({
    // lang: {
    //     t: (key, ...params) => i18n.t(key, params),
    // },
    icons: {
        iconfont: 'mdi',
    },
    theme: {
        options: {
            customProperties: true
        },
        themes: {
            light: {
                primary: "#3c6ca5",
                secondary: "#039BE5",
                accent: "#F9C30D"
            },
            dark: {
                primary: "#3c6ca5",
                secondary: "#039BE5",
                accent: "#F9C30D"
            },
        },
    },

});

// new Vue(App).$mount('#app');
const app = new Vue({
    i18n,
    lang: {
        locales: {es, en},
        current: 'en',
    },
    vuetify,
    router,
    el: '#app',
    render: h => h(App)
});
