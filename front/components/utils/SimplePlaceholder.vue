<template>
  <v-container>
    <v-row class="justify-center mb-3">
      <v-icon size="72" color="grey darken-1">{{ icon }}</v-icon>
    </v-row>
    <v-row class="justify-center">
      <span class="headline grey--text text--darken-1">
            {{ text }}
      </span>
    </v-row>
  </v-container>
</template>
<script>
    export default {
        name: 'simple-placeholder',
        props: {
            icon: String,
            text: String
        }
    }
</script>
