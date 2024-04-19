<template>

                <!-- Date picker -->
                <v-menu
                        ref="menu"
                        v-model="menu"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                >
                    <template v-slot:activator="{ on }">
                        <v-text-field
                                :disabled="disabled"
                                prepend-icon="mdi-calendar"
                                v-model="dateText"
                                v-on:input="$emit('input', $event)"
                                v-on="on"
                                label="Fecha"
                                :error="errorStatus"
                                :error-messages="errorMessage === ''? null: errorMessage"
                        />
                    </template>
                    <v-date-picker
                            :disabled="disabled"
                            style="display: block"
                            v-model="date"
                            @input="formatDate"
                    />
                </v-menu>
</template>

<script>
    import moment from "moment";
    export default {
        name: "DatePickerB",
        data() {
            return {
                menu: false,
                localDate: null,
                errorDate: [],
                date: null,
                dateText: null
            }
        },
        watch: {
        },
        created() {
            let myDate = this.dateInit? moment(this.dateInit, "DD-MM-YYYY HH:mm:ss").toDate(): new Date();
            const offset = myDate.getTimezoneOffset();
            myDate = new Date(myDate.getTime() - (offset*60*1000));
            this.date = myDate.toISOString().split('T')[0];
            this.formatDate(this.date);
        },
        methods: {
            formatDate(date) {
                this.dateText = moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY');

                this.menu = false;
                this.changedDate()
            },
            changedDate(){
                this.$emit("input", this.date);
            },
            initDate(date) {
                this.date = moment(new Date(date), 'DD/MM/YYYY').format('YYYY/MM/DD');
                this.dateText = date;
            }
        },
        props: {
            errorStatus: Boolean,
            errorMessage: Object,
            disabled: Boolean,
            dateInit: {
                type: String,
                allowNull: true
            },
        }
    }
</script>

<style scoped>

</style>