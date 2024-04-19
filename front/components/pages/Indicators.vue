<template>
  <v-card elevation="2" max-width="800px" class="mx-auto">
    <v-toolbar dense color="primary" dark>
      <v-toolbar-title>Indicadores del mes</v-toolbar-title>
    </v-toolbar>
    <v-simple-table class="row-pointer">
        <template v-slot:default>
        <thead>
                <v-row class="ma-2">
                    <v-col cols="3" class="pa-2 ">
                        <v-select :items="months" hide-details="true" v-model="selectedMonth" item-value="value" item-text="name" label="Mes" outlined dense class="rounded-lg" background-color="white"/>
                    </v-col>
                    <v-col cols="3" class="pa-2 ">
                        <v-select :items="years" hide-details="true" v-model="selectedYear" label="Año" outlined dense class="rounded-lg" background-color="white"/>
                    </v-col>
                    <v-col cols="3" class="pa-2">
                        <v-select :items="equipType" clearable prepend-inner-icon="mdi-format-list-bulleted-type" v-model="filterByEquipType" item-value="value" item-text="name" label="Tipo de equipo" outlined dense class="rounded-lg" background-color="white" />
                    </v-col>
                    <v-col cols="3" class="pa-2">
                        <v-select v-if="userLogged.role == 'admin'" :items="organizations" clearable prepend-inner-icon="mdi-hospital-building" v-model="filterByOrganizationId" item-value="id" item-text="name" label="Hospital" outlined dense class="rounded-lg" background-color="white" />
                        <v-select v-else :items="organization" disabled prepend-inner-icon="mdi-hospital-building" v-model="filterByOrganizationId" item-value="id" item-text="name" label="Hospital" outlined dense class="rounded-lg" background-color="white" />
                    </v-col>
                </v-row>
        </thead>
        <tbody>
            <tr v-for="item in indicators" :key="item.name" @click="copyData(item.value)">
                <td>{{ item.name }}</td>
                <td>{{ item.value }}</td>
            </tr>
        </tbody>
        </template>
    </v-simple-table>
    <v-snackbar v-model="snackbarCopied" :timeout="timeout" text color="primary"  width="200px" class="snack" >
      {{ text }}
    </v-snackbar>
  </v-card>
</template>
<script>
import validations from "../../services/validation.service";
import * as dayjs from 'dayjs';
import {getStore} from "../../services/store.service";


  export default {
    data () {
      return {
        indicators: [],
        selectedMonth: dayjs().endOf('month'),
        selectedYear: dayjs().year(),
        selectedDate: dayjs().endOf('month'),
        months: [
            {name: "Enero", value: 0},
            {name: "Febrero", value: 1},
            {name: "Marzo", value: 2},
            {name: "Abril", value: 3},
            {name: "Mayo", value: 4},
            {name: "Junio", value: 5},
            {name: "Julio", value: 6},
            {name: "Agosto", value: 7},
            {name: "Septiembre", value: 8},
            {name: "Octubre", value: 9},
            {name: "Noviembre", value: 10},
            {name: "Diciembre", value: 11},
        ],
        years: [],
        snackbarCopied: false,
        text: "Copiado.",
        timeout: 1500,
        organizations: [],
        organization: [],
        filterByOrganizationId: -1,
        filterByEquipType: -1,
        equipType: [
            {name: "Industrial", value: 'industrialSupport'},
            {name: "Médicos", value: 'medical'},
        ]
      }
    },
    async created() {
        this.indicators = [];
        this.selectedMonth = dayjs().month();
        this.selectedDate = dayjs();
        this.years = [];
        this.getYears();
    },
    computed: {
        userLogged: getStore("user")
    },
    watch: {
        async filterByOrganizationId(){
            await this.getMonthlyIndicators();
        },
        selectedMonth(){ 
            this.selectedDate = dayjs().year(this.selectedYear).date(31).month(this.selectedMonth);
        },
        selectedYear(){
            this.selectedDate = dayjs().year(this.selectedYear).date(31).month(this.selectedMonth);
        }, 
        async selectedDate(){
            await this.getMonthlyIndicators();
        },
        async filterByEquipType(){
            await this.getMonthlyIndicators();
        }
    },
    mounted() {
        window.addEventListener('mousemove',this.getCursor);
        this.getOrganizations();
        this.indicators = [];
    },
    methods: {
        getYears(){
            this.years = [];
            let initial = 2021;
            while(initial <= dayjs().year()){
                this.years.push(initial);
                initial = initial+1;
            }
        },
        copyData(value){
            navigator.clipboard.writeText(value);
            this.snackbarCopied = true;
        },
        async getMonthlyIndicators(){
            let res;
            this.indicators = [];
            let indicators = [];
            if( this.filterByEquipType == 'medical'){
                res = await this.$service("api/equipment").find({
                    query: {
                        active: "operational",
                        createdAt: {
                            $lte: this.selectedDate.endOf('month') 
                        },
                        organizationId: this.userLogged.role == 'admin' ?  (this.filterByOrganizationId == -1 ? undefined : this.filterByOrganizationId) : undefined,
                        clase: {
                            $ne: 'industrialSupport'
                        }
                    }
                });
                indicators.push({name: 'Total de equipos médicos catastrados', value: res.total})
            }
            else{
                res = await this.$service("api/equipment").find({
                    query: {
                        active: "operational",
                        createdAt: {
                            $lte: this.selectedDate.endOf('month') 
                        },
                        organizationId: this.userLogged.role == 'admin' ?  (this.filterByOrganizationId == -1 ? undefined : this.filterByOrganizationId) : undefined,
                        clase: this.filterByEquipType == -1 ? undefined : (this.filterByEquipType == 'industrialSupport' ? this.filterByEquipType : undefined),
                    }
                });
                if(this.filterByEquipType == -1){
                    indicators.push({name: 'Total de equipos catastrados', value: res.total})
                }
                else{
                    indicators.push({name: 'Total de equipos industriales catastrados', value: res.total})
                }
            }

            res = await this.$service("api/maintenance").find({
                query: {
                    active: "TRUE",
                    intention: "preventive",
                    date_of_request: {
                        $gte: this.selectedDate.startOf('month'),
                        $lte: this.selectedDate.endOf('month')
                    }
                }
            });
            indicators.push({name: 'MP programados del total de equipos en el mes', value: res.total})
            
            res = await this.$service("api/maintenance").find({
                query: {
                    active: "TRUE",
                    intention: "preventive",
                    date_of_maintenance: {
                        $gte: this.selectedDate.startOf('month'),
                        $lte: this.selectedDate.endOf('month')
                    }
                }
            });
            indicators.push({name: 'MP ejecutados del total de equipos en el mes', value: res.total})

            res = await this.$service("api/maintenance").find({
                query: {
                    active: "TRUE",
                    intention: "corrective",
                    date_of_maintenance: {
                        $gte: this.selectedDate.startOf('month'),
                        $lte: this.selectedDate.endOf('month')
                    }
                }
            });
            indicators.push({name: 'MC ejecutados del total de equipos en el mes', value: res.total})
            this.indicators = [];
            this.indicators = indicators;
        },
        async getOrganizations(){
            let res = await this.$service("api/organization").find();
            this.organizations = res['data'];
            if(this.userLogged.role != 'admin'){
                let res = await this.$service("api/organization").get(this.userLogged.organizationId);
                this.organization = res;
                this.filterByOrganizationId = this.userLogged.organizationId;
            }
        },
    }
  }
</script>

<style lang="css" scoped>
.row-pointer >>> tbody tr :hover {
  cursor: pointer;
}
</style>