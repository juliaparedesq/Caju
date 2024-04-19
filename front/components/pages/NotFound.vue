<template>
    <v-layout align-center justify-center column fill-height class="grey--text">
        <v-flex xs12>
            <v-icon size="96" color="grey">access_time</v-icon>
        </v-flex>
        <v-flex xs12 class="text-center">
            <h1>Not Found</h1>
            <span>Esta página está en desarrollo. <br>Intentlo más tarde.</span>
        </v-flex>
    </v-layout>
</template>

<script>
    import {getStore} from "../../services/store.service";

    export default {
        data() {
            return {}
        },
        mounted() {

        },
        computed: {
          user: getStore("user")
        }
    }
</script>

<style>

</style>
