<template>
  <v-snackbar v-model="show" :timeout="timeout" :color="color">
    {{ text }}
  </v-snackbar>
</template>
<script>
  import Vue from 'vue';

  export default {
    name: 'global-toast',
    data() {
      return {
        show: false,
        timeout: 5000,
        text: "Test",
        color: "primary"
      }
    },
    created() {
      Vue.prototype.$toast = this.openToast;
    },
    methods: {
      openToast(text, color, timeout) {
        this.text = text;
        this.color = color;
        this.timeout = timeout;
        this.show = true;
      }
    },
  }
</script>
