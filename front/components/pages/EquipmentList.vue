<template>
  <v-card color="secondary" elevation="0">
    <v-toolbar color="secondary" elevation="0">
      <v-toolbar-title>Listado de equipos</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-scale-transition>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" icon @click="openAddEquipment">
              <v-icon>mdi-plus-box</v-icon>
            </v-btn>
          </template>
          <span>Agregar equipo</span>
        </v-tooltip>
      </v-scale-transition>
      <v-scale-transition>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" icon @click="downloadList">
              <v-icon dark>mdi-file-download</v-icon>  
            </v-btn>
          </template>
          <span>Descargar equipos</span>
        </v-tooltip>
      </v-scale-transition>
    </v-toolbar>
    <v-card-text >
      <v-container>
        <v-row>
          <v-col  class="pa-2 ">
            <v-text-field v-model="search" outlined hide-details clearable dense class="rounded-lg" label="Nombre de equipo" background-color="white"/>
          </v-col>
          <v-col class="pa-2">
            <v-select v-if="userLogged.role == 'admin'" :items="organizations" clearable prepend-inner-icon="mdi-hospital-building" v-model="filterByOrganizationId" item-value="id" item-text="name" label="Hospital" outlined dense class="rounded-lg" background-color="white" />
            <v-select v-else :items="organization" disabled prepend-inner-icon="mdi-hospital-building" v-model="filterByOrganizationId" item-value="id" item-text="name" label="Hospital" outlined dense class="rounded-lg" background-color="white" />
          </v-col>
          <v-col class="pa-2">
            <v-select :items="orders" prepend-inner-icon="" clearable v-model="sortByMaintenance" item-value="value" item-text="name" label="Última mantención" outlined dense class="rounded-lg" background-color="white"/>
          </v-col>
          <v-col  class="pa-2">
            <v-select :items="filterVUR" clearable prepend-inner-icon="" v-model="filterByVUR" item-value="value" item-text="name" label="Vida útil residual" outlined dense class="rounded-lg" background-color="white"/>
          </v-col>
          <v-col  class="pa-2">
            <v-select :items="filterCostMaintenances" clearable prepend-inner-icon="" v-model="filterByCostMaintenancesGreater" item-value="value" item-text="name" label="Costo mantención > equipo" outlined dense class="rounded-lg" background-color="white"/>
          </v-col>
          <v-col  class="pa-2 ">
            <v-text-field v-model.number="filterByMaintenanceIndicator" outlined hide-details clearable dense class="rounded-lg" label="Indicador de mantenimiento" background-color="white" type="number"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col  class="pa-2 ">
            <v-select v-model="clase" :items="clases" clearable prepend-inner-icon="" item-value="value" item-text="name" label="Clase" outlined dense class="rounded-lg" background-color="white" />
          </v-col>
          <v-col class="pa-2">
            <v-select v-model="critic" :items="criticRelevant" clearable prepend-inner-icon="" item-value="value" item-text="name" label="Crítico/Relevante" outlined dense class="rounded-lg" background-color="white" />
          </v-col>
          <v-col class="pa-2">
            <v-select v-model="agreement" :items="agreementOptions" clearable prepend-inner-icon="" item-value="value" item-text="name" label="Convenio" outlined dense class="rounded-lg" background-color="white" />
          </v-col>
          <v-col  class="pa-2">
            <v-select v-model="active" :items="workingStatus" clearable prepend-inner-icon="" item-value="value" item-text="name" label="Estado de funcionamiento" outlined dense class="rounded-lg" background-color="white" />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>

    <v-data-iterator
        :items="equipments"
        :items-per-page.sync="itemsPerPage"
        :page.sync="page"
        :search="search"
        :sort-by="[sortBy.toLowerCase(), sortByMaintenance]"
        :sort-desc="sortDesc"
        :server-items-length="total">
      <template v-slot:item="{ item }" color="primary" dark>
        <v-row>
          <v-col cols="12">
            <v-card class="rounded-lg" elevation="0">
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="1" class="pa-0 text-center">
                      <v-icon large="true">mdi-washing-machine</v-icon>
                    </v-col>
                    <v-col cols="4" class="pa-0">
                      <v-row class="ma-0">
                        <v-col cols="12" class="pa-0">
                          <v-tooltip bottom v-if="item.name.length > 32">
                            <template v-slot:activator="{ on, attrs }">
                              <v-card-title class="pa-0 pr-5" v-bind="attrs" v-on="on">{{ item.name.length > 32 ? item.name.slice(0, 32 - 1) + "…" : item.name }}</v-card-title>
                            </template>
                            <span>{{item.name}}</span>
                          </v-tooltip>
                          <v-card-title class="pa-0 pr-5" v-else>{{ item.name }}</v-card-title>
                        </v-col>
                        <v-col cols="12" class="pa-0">
                          <v-card-text class="pa-0">{{ item.model }}</v-card-text>
                        </v-col>
                        <v-col cols="12" class="pa-0 mt-4">
                          <v-card-text class="pa-0 text-decoration-underline">{{ item.series_number }}</v-card-text>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="3" class="pa-0">
                      <v-row class="ma-0"> 
                        <v-col cols="2" class="pa-0 pb-2" v-if="item.vur == 0">
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                              <v-alert icon="mdi-timer-outline" v-bind="attrs" v-on="on" type="warning" dense width="24" height="24" class="ma-0 pa-0 " @click="filterByVUR = 1"/>
                            </template>
                            <span>VUR = 0</span>
                          </v-tooltip>
                        </v-col>
                        <v-col cols="2" class="pa-0 pb-2" v-if="(item.cost_of_equipment != null) && (item.cost_of_maintenances > item.cost_of_equipment)">
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                              <v-alert icon="mdi-alert-decagram-outline" v-bind="attrs" v-on="on" type="error" dense width="24" height="24" class="ma-0 pa-0" @click="filterByCostMaintenancesGreater = 'yes' "/>
                            </template>
                            <span>Costo mantenciones supera al costo del equipo</span>
                          </v-tooltip>
                        </v-col>
                        <v-col cols="2" class="pa-0 pb-2" v-if="!futureDate(item.last_maintenance) & checkPeriodicity(item.last_maintenance, item.periodicity_preventive_maintenance)">
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                              <v-alert icon="mdi-wrench-clock" v-bind="attrs" v-on="on" color="indigo" dense width="24" height="24" class="ma-0 pa-0" @click="filterByCostMaintenancesGreater = 'yes'"/>
                            </template>
                            <span>Última mantencion preventiva atrasada</span>
                          </v-tooltip>
                        </v-col>
                        <v-col cols="12" class="pa-0">
                          <v-card-text class="pa-0">
                            <v-icon>mdi-map-marker-outline</v-icon>{{ organizations[item.organizationId -1].name }}, {{ item.ubication }}
                          </v-card-text>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="2" class="pa-0 pr-10">
                      <v-row class="ma-0">
                        <v-col cols="12" class="pa-0">
                          <v-card-text class="text-right pa-0" v-if="futureDate(item.last_maintenance)">
                            En convenio hasta
                          </v-card-text>
                          <v-card-text class="text-right pa-0" v-else>
                            Última Mantención
                          </v-card-text>
                        </v-col>
                        <v-col cols="12" class="pa-0">
                          <v-card-text class="text-right pa-0">
                            {{ item.last_maintenance ? (formatDate(item.last_maintenance)) : ("-") }}
                          </v-card-text>
                        </v-col>
                        <v-col cols="12" class="pa-0 mt-8 text-right">
                          <v-chip v-if="item.active == 'operational'" class="ml-10 rounded-lg" color="green" text-color="white">Operativo</v-chip>
                          <v-chip v-if="item.active == 'nonOperational'" class="ml-10 rounded-lg" color="orange" text-color="white">No Operativo</v-chip>
                          <v-chip v-if="item.active == 'deactivated'" class="ml-10 rounded-lg" color="red" text-color="white">Dado de baja</v-chip>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="2" class="pa-0 pl-1">
                      <v-row class="ma-0">
                        <v-col cols="12" class="pa-0">
                          <v-card-text class="pa-0">Vida útil residual</v-card-text>
                        </v-col>
                        <v-col cols="12" class="pa-0">
                          <v-card-title class="pa-0">{{ item.vur != null ? (item.vur + " años") : "-" }}</v-card-title>
                        </v-col>
                        <v-col cols="12" class="pa-0">
                          <v-card-text class="pa-0">
                            <v-btn color="primary" class="px-6 rounded-lg" @click="viewEquipment(item)">Ver ficha</v-btn>
                          </v-card-text>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </v-data-iterator>
    <equipment-form ref="equipForm" @update="getEquipments"/>
  </v-card>
</template>

<script>
import {getStore, setStore} from "../../services/store.service";
import FD from "feathers-data-table";
import * as dayjs from 'dayjs';
import {json2excel, excel2json} from 'js2excel';
import axios from "axios";
import validations from "../../services/validation.service";
import EquipmentForm from "../utils/EquipmentForm.vue";


export default {
  name: "EquipmentList",
  components: {
    FeathersDataTable: FD.FeathersDataTable, EquipmentForm

  },
  data() {
    return {
      validations: validations,
      laborCost: 0,
      extraCost: 0,
      TypesOfMaintenance: [
        {name: "Preventivo", value: "preventive"},
        {name: "Correctivo", value: "corrective"}
      ],
      dictOrganizations:{
        17: 'Hospital Hanga Roa',
        1: 'Hospital Del Salvador',
        6: 'Instituto Nacional de Rehabilitación Infantil Presidente Pedro Aguirre Cerda',
        2: 'Hospital Dr. Luis Tisné B.',
        5: 'Instituto de Neurocirugía Dr. Alfonso Asenjo',
        7: 'Instituto Nacional Geriátrico Presidente Eduardo Frei Montalva',
        3: 'Hospital de Niños Dr. Luis Calvo Mackenna',
      },
      dictClases: {
        "industrialSupport": "Apoyo industrial",
        "verticalTransport": "Transporte vertical",
        "energy": "Energia",
        "liquidHandling": "Manejo de liquidos",
        "communications": "Comunicaciones",
        'diagnosticSupport': 'Apoyo Diagnóstico', 
        'endoscopicSupport': 'Apoyo Endoscópico', 
        'industrySupport': 'Apoyo Industrial', 
        'surgicalSupport': 'Apoyo Quirúrgico', 
        'therapeuticSupport': 'Apoyo Terapéutico', 
        'sterilization': 'Esterilización', 
        'imaging': 'Imagenología', 
        'laboratory/Pharmacy': 'Laboratorio/Farmac', 
        'physMedRehabilitation': 'Med. Fís. Rehabilitación', 
        'monitoring': 'Monitoreo', 
        'odontology': 'Odontología', 
        'furniture': 'Mobiliario', 
        'other': 'Otra', 
      },
      dictSubclases: {
        'highPrice': 'Alto Costo', 
        'mediumCost': 'Mediano Costo', 
        'lowCost': 'Bajo Costo', 
        'instrumental': 'Instrumental', 
        'clinical': 'Clínico', 
        'weighing': 'Pesaje',
        'refrigeration': 'Refrigeración',
        'cooking': 'Cocción',
        'chop': 'Picar',
        'peel': 'Pelar',
        'shake': 'Batir',
        'extraction': 'Extracción',
        'distribution': 'Distribución',
        'washed': 'Lavado',
        'decontamination': 'Descontaminación',
        'centrifugation': 'Centrifugación',
        'drying': 'Secado',
        'ironing': 'Planchado',
        'sewing': 'Costura',
        'compression': 'Compresión',
        'peopleTransport': 'Transporte de personas',
        'freightTransport': 'Transporte de carga',
        'electrical': 'Eléctrica',
        'caloric': 'Calórica',
        'sewageElevation': 'Elevación de aguas servidas',
        'drinkingWaterLift': 'Elevación de agua potable',
        'FluidLiftAndHotWater': 'Elevación de fluidos y agua caliente',
        'UHFRadioCommunication': 'Radiocomunicación UHF',
        'VHFRadioCommunication': 'Radiocomunicación VHF',
        'HFRadioCommunication': 'Radiocomunicación HF',
        'RadioCommunicationViaMicrowave': 'Radiocomunicación vía microonda',
        'safetyAndEscapeRoutes': 'Seguridad y vías de escape',
      },
      dictWorkingStatus: {
        'operational': 'Operativo',
        'nonOperational': 'No operativo',
        'deactivated': 'Desactivado'
      },
      clases: [
        {name: "Apoyo industrial", value: "industrialSupport"},
        {name: "Transporte vertical", value: "verticalTransport"},
        {name: "Energia", value: "energy"},
        {name: "Manejo de liquidos", value: "liquidHandling"},
        {name: "Comunicaciones", value: "communications"},
        {name: 'Apoyo Diagnóstico', value: 'diagnosticSupport'},
        {name: 'Apoyo Endoscópico', value: 'endoscopicSupport'},
        {name: 'Apoyo Industrial', value: 'industrySupport'},
        {name: 'Apoyo Quirúrgico', value: 'surgicalSupport'},
        {name: 'Apoyo Terapéutico', value: 'therapeuticSupport'},
        {name: 'Esterilización', value: 'sterilization'},
        {name: 'Imagenología', value: 'imaging'},
        {name: 'Laboratorio/Farmac', value: 'laboratory/Pharmacy'},
        {name: 'Med. Fís. Rehabilitación', value: 'physMedRehabilitation'},
        {name: 'Monitoreo', value: 'monitoring'},
        {name: 'Odontología', value: 'odontology'},
        {name: 'Mobiliario', value: 'furniture'},
        {name: 'Otra', value: 'other'},
      ],
      criticRelevant: [
        {name: "Crítico", value: "critic"},
        {name: "Relevante", value: "relevant"},        
      ],
      agreementOptions:[
        {name: "En convenio", value: "agreement"},
        {name: "Sin convenio", value: "notAgreement"}
      ],
      workingStatus: [
        {name: "Operativo", value: "operational"},
        {name: "No operativo", value: "nonOperational"},
        {name: "Dado de baja", value: "deactivated"}
      ],
      orders: [
        {name: "Ascendente", value: "ascending"},
        {name: "Descendente", value: "descending"}
      ],
      filterVUR: [
        {name: "0", value: 1},
        {name: "<6", value: 7},
        {name: "<12", value: 13},
        {name: "<24", value: 25}
      ],
      filterCostMaintenances: [
        {name: "mayor al del equipo", value: 'yes'},
        {name: "menor al del equipo", value: 'no'}
      ],
      dialogConfirm : false,
      equip: {
        series_number: "",
        brand: "",
        name: "",
        ubication: "",
        clase: "",
        subclase: "",
        cost_of_equipment: 0,
        model: "",
        start_up_date: "",
        score: 0,
        year_of_acquisition: 0,
        useful_life: 0,
        vur: 0,
        possession: "own",
        status: "good",
        purchasing_entity: "",
        warranty: 0,
        supplier: "",
        organizationId: 1
      },
      equipPhoto: null,
      id: 0,
      maintenance: {},
      organizations: [],
      organization: [],
      dictStates: { 
        "good" : "Bueno",
        "bad" : "Malo",
        "regular" : "Regular",
      },
      dictPossessions: {
        "own": "Propio",
        "lease": "Arrendado",
        "commodatum": "Comodato",
      },
      dictCritic:{
        "critic": "Crítico",
        "relevant": "Relevante",
      },
      equipments: [],
      itemsPerPageArray: [5, 10, 20],
      search: '',
      clase: undefined,
      critic: undefined, 
      agreement: undefined, 
      active: "operational",
      filterByMaintenanceIndicator: null,
      filter: {},
      sortDesc: false,
      sortByMaintenance: false,
      filterByVUR: 900000,
      filterByCostMaintenancesGreater: "",
      page: 1,
      itemsPerPage: 5,
      sortBy: 'id',
      total: -1,
      filterByOrganizationId: -1,
      maintenances: [
        {
          id: 1,
          color: 'info',
          icon: 'mdi-information',
        },
      ]
    }
  },
  mounted() {
    this.getOrganizations();
    this.setStatus();
    this.getEquipments();
  },
  methods: {
    clearEquip(){
      this.equip = {
        series_number: "",
        brand: "",
        name: "",
        ubication: "",
        inventory_number: "",
        critic: "critic",
        clase: "",
        subclase: "",
        cost_of_equipment: 0,
        model: "",
        start_up_date: "",
        score: 0,
        year_of_acquisition: 0,
        useful_life: 0,
        vur: 0,
        possession: "own",
        status: "good",
        purchasing_entity: "",
        warranty: 0,
        supplier: "",
        organizationId: 1,
      };
    },
    openAddEquipment(){
      this.$refs.equipForm.openAddEquipment();
    },
    setStatus(){
      this.page = this.listStatus['page'];
      this.itemsPerPage = this.listStatus['itemsPerPage'];
      this.sortBy  = this.listStatus['sortBy'];
      this.sortDesc  = this.listStatus['sortDesc'];
      this.search  = this.listStatus['search'];
      this.filterByOrganizationId  = this.listStatus['filterByOrganizationId'];
      this.filterByVUR  = this.listStatus['filterByVUR'];
      this.filterByCostMaintenancesGreater  = this.listStatus['filterByCostMaintenancesGreater'];
      this.sortByMaintenance  = this.listStatus['sortByMaintenance'];
      this.filterByMaintenanceIndicator  = this.listStatus['filterByMaintenanceIndicator'];
      this.clase = this.listStatus['clase'];
      this.critic = this.listStatus['critic'];
      this.agreement = this.listStatus['agreement'];
      this.active = this.listStatus['active'];
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
    async getEquipments(){
      let offset = (this.page - 1) * this.itemsPerPage;
      let res;
      if(this.agreement == 'agreement'){
        res = await this.$service("api/equipment").find({
          query: {
            $limit: this.itemsPerPage,
            $skip: offset,
            active: this.active,
            critic: this.critic,
            clase: this.clase,
            last_maintenance: {
              $gt: new Date()
            },
            vur: {
                  $lte: this.filterByVUR == null ? 900000 : (this.filterByVUR)
            },
            $filterByCostMaintenances: this.filterByCostMaintenancesGreater,  
            $sort: {
              [this.sortBy]: this.sortBy == 'id' ? (this.sortDesc ? -1 : 1) : (this.sortByMaintenance == 'ascending' ? 1 : -1)
            },
            $or: [
              {
                name: {
                  $iLike: "%" + this.search + "%",
                }
              },
              {
                series_number: {
                  $iLike: "%" + this.search + "%",
                },
              },
            ],
            maintenance_indicator: this.filterByMaintenanceIndicator != undefined ? (this.filterByMaintenanceIndicator == '' ? undefined : this.filterByMaintenanceIndicator) : undefined,
            organizationId: this.userLogged.role == 'admin' ?  (this.filterByOrganizationId == -1 ? undefined : this.filterByOrganizationId) : undefined
          }
        });
      }
      else if(this.agreement == 'notAgreement'){
        res = await this.$service("api/equipment").find({
          query: {
            $limit: this.itemsPerPage,
            $skip: offset,
            active: this.active,
            critic: this.critic,
            clase: this.clase,
            last_maintenance: {
              $lte: new Date()
            },
            vur: {
                  $lte: this.filterByVUR == null ? 900000 : (this.filterByVUR)
            },
            $filterByCostMaintenances: this.filterByCostMaintenancesGreater,  
            $sort: {
              [this.sortBy]: this.sortBy == 'id' ? (this.sortDesc ? -1 : 1) : (this.sortByMaintenance == 'ascending' ? 1 : -1)
            },
            $or: [
              {
                name: {
                  $iLike: "%" + this.search + "%",
                }
              },
              {
                series_number: {
                  $iLike: "%" + this.search + "%",
                },
              },
            ],
            maintenance_indicator: this.filterByMaintenanceIndicator != undefined ? (this.filterByMaintenanceIndicator == '' ? undefined : this.filterByMaintenanceIndicator) : undefined,
            organizationId: this.userLogged.role == 'admin' ?  (this.filterByOrganizationId == -1 ? undefined : this.filterByOrganizationId) : undefined
          }
        });
      }
      else{
        res = await this.$service("api/equipment").find({
          query: {
            $limit: this.itemsPerPage,
            $skip: offset,
            active: this.active,
            critic: this.critic,
            clase: this.clase,
            vur: {
                  $lte: this.filterByVUR == null ? 900000 : (this.filterByVUR)
            },
            $filterByCostMaintenances: this.filterByCostMaintenancesGreater,  
            $sort: {
              [this.sortBy]: this.sortBy == 'id' ? (this.sortDesc ? -1 : 1) : (this.sortByMaintenance == 'ascending' ? 1 : -1)
            },
            $or: [
              {
                name: {
                  $iLike: "%" + this.search + "%",
                }
              },
              {
                series_number: {
                  $iLike: "%" + this.search + "%",
                },
              },
            ],
            maintenance_indicator: this.filterByMaintenanceIndicator != undefined ? (this.filterByMaintenanceIndicator == '' ? undefined : this.filterByMaintenanceIndicator) : undefined,
            organizationId: this.userLogged.role == 'admin' ?  (this.filterByOrganizationId == -1 ? undefined : this.filterByOrganizationId) : undefined
          }
        });
      }
      this.equipments = res.data;
      this.total = res.total;
    },
    viewEquipment(equipment){
      this.$router.push("/app/equipment/" + equipment.id);
    },
    formatDate(date){
      return dayjs(date).format('DD-MM-YYYY');
    },
    futureDate(date){ //si la fecha es posterior a hoy retorna true, ie, si es hasta hoy muestra ultima mant, no en convenio
      return dayjs(date).isAfter(dayjs());
    },
    checkPeriodicity(lastMaintenance, periodicityPM){
      if ((lastMaintenance != null) && (periodicityPM != null)){
        let today = dayjs();
        let nextMaintenance = dayjs(lastMaintenance).add(periodicityPM, 'month');
        if (today.isBefore(nextMaintenance)){
          return false;
        }
        else{
          return true;
        }
        return true;
      }
      else{
        return false;
      }
    },
    async downloadList(){
      let allEquips;
      let res;
      let offset = 0;
      let limit = 100;
      if(this.agreement == 'agreement'){
        res = await this.$service("api/equipment").find({
          query: {
            $limit: limit,
            $skip: offset,
            active: this.active,
            critic: this.critic,
            clase: this.clase,
            last_maintenance: {
              $gt: new Date()
            },
            vur: {
                  $lte: this.filterByVUR == null ? 900000 : (this.filterByVUR),
                },
            $filterByCostMaintenances: this.filterByCostMaintenancesGreater, 
            $sort: {
              [this.sortBy]: this.sortBy == 'id' ? (this.sortDesc ? -1 : 1) : (this.sortByMaintenance == 'ascending' ? 1 : -1)
            },
            $or: [
              {
                name: {
                  $iLike: "%" + this.search + "%",
                }
              },
              {
                series_number: {
                  $iLike: "%" + this.search + "%",
                },
              },
            ],
            maintenance_indicator: this.filterByMaintenanceIndicator != undefined ? (this.filterByMaintenanceIndicator == '' ? undefined : this.filterByMaintenanceIndicator) : undefined,
            organizationId: this.userLogged.role == 'admin' ?  (this.filterByOrganizationId == -1 ? undefined : this.filterByOrganizationId) : undefined
  
          }
        });
      }
      else if( this.agreement == 'notAgreement'){
        res = await this.$service("api/equipment").find({
          query: {
            $limit: limit,
            $skip: offset,
            active: this.active,
            critic: this.critic,
            clase: this.clase,
            last_maintenance: {
              $lte: new Date()
            },
            vur: {
                  $lte: this.filterByVUR == null ? 900000 : (this.filterByVUR),
                },
            $filterByCostMaintenances: this.filterByCostMaintenancesGreater, 
            $sort: {
              [this.sortBy]: this.sortBy == 'id' ? (this.sortDesc ? -1 : 1) : (this.sortByMaintenance == 'ascending' ? 1 : -1)
            },
            $or: [
              {
                name: {
                  $iLike: "%" + this.search + "%",
                }
              },
              {
                series_number: {
                  $iLike: "%" + this.search + "%",
                },
              },
            ],
            maintenance_indicator: this.filterByMaintenanceIndicator != undefined ? (this.filterByMaintenanceIndicator == '' ? undefined : this.filterByMaintenanceIndicator) : undefined,
            organizationId: this.userLogged.role == 'admin' ?  (this.filterByOrganizationId == -1 ? undefined : this.filterByOrganizationId) : undefined
  
          }
        });
      }
      else{
        res = await this.$service("api/equipment").find({
          query: {
            $limit: limit,
            $skip: offset,
            active: this.active,
            critic: this.critic,
            clase: this.clase,
            vur: {
                  $lte: this.filterByVUR == null ? 900000 : (this.filterByVUR),
                },
            $filterByCostMaintenances: this.filterByCostMaintenancesGreater, 
            $sort: {
              [this.sortBy]: this.sortBy == 'id' ? (this.sortDesc ? -1 : 1) : (this.sortByMaintenance == 'ascending' ? 1 : -1)
            },
            $or: [
              {
                name: {
                  $iLike: "%" + this.search + "%",
                }
              },
              {
                series_number: {
                  $iLike: "%" + this.search + "%",
                },
              },
            ],
            maintenance_indicator: this.filterByMaintenanceIndicator != undefined ? (this.filterByMaintenanceIndicator == '' ? undefined : this.filterByMaintenanceIndicator) : undefined,
            organizationId: this.userLogged.role == 'admin' ?  (this.filterByOrganizationId == -1 ? undefined : this.filterByOrganizationId) : undefined
  
          }
        });
      }
      allEquips = res.data;
      while(res.total > res.skip + res.limit){
        offset = offset + limit;
        if(this.agreement == 'agreement'){
          res = await this.$service("api/equipment").find({
            query: {
              $limit: limit,
              $skip: offset,
              active: this.active,
              critic: this.critic,
              clase: this.clase,
              last_maintenance: {
                $gt: new Date()
              },
              vur: {
                    $lte: this.filterByVUR == null ? 900000 : (this.filterByVUR),
                  },
              $filterByCostMaintenances: this.filterByCostMaintenancesGreater, 
              $sort: {
                [this.sortBy]: this.sortBy == 'id' ? (this.sortDesc ? -1 : 1) : (this.sortByMaintenance == 'ascending' ? 1 : -1)
              },
              $or: [
                {
                  name: {
                    $iLike: "%" + this.search + "%",
                  }
                },
                {
                  series_number: {
                    $iLike: "%" + this.search + "%",
                  },
                },
              ],
              maintenance_indicator: this.filterByMaintenanceIndicator != undefined ? (this.filterByMaintenanceIndicator == '' ? undefined : this.filterByMaintenanceIndicator) : undefined,
              organizationId: this.userLogged.role == 'admin' ?  (this.filterByOrganizationId == -1 ? undefined : this.filterByOrganizationId) : undefined
            }
          });
        }
        else if(this.agreement == 'notAgreement'){
          res = await this.$service("api/equipment").find({
            query: {
              $limit: limit,
              $skip: offset,
              active: this.active,
              critic: this.critic,
              clase: this.clase,
              last_maintenance: {
                $lte: new Date()
              },
              vur: {
                    $lte: this.filterByVUR == null ? 900000 : (this.filterByVUR),
                  },
              $filterByCostMaintenances: this.filterByCostMaintenancesGreater, 
              $sort: {
                [this.sortBy]: this.sortBy == 'id' ? (this.sortDesc ? -1 : 1) : (this.sortByMaintenance == 'ascending' ? 1 : -1)
              },
              $or: [
                {
                  name: {
                    $iLike: "%" + this.search + "%",
                  }
                },
                {
                  series_number: {
                    $iLike: "%" + this.search + "%",
                  },
                },
              ],
              maintenance_indicator: this.filterByMaintenanceIndicator != undefined ? (this.filterByMaintenanceIndicator == '' ? undefined : this.filterByMaintenanceIndicator) : undefined,
              organizationId: this.userLogged.role == 'admin' ?  (this.filterByOrganizationId == -1 ? undefined : this.filterByOrganizationId) : undefined
            }
          });
        }
        else{
          res = await this.$service("api/equipment").find({
            query: {
              $limit: limit,
              $skip: offset,
              active: this.active,
              critic: this.critic,
              clase: this.clase,
              vur: {
                    $lte: this.filterByVUR == null ? 900000 : (this.filterByVUR),
                  },
              $filterByCostMaintenances: this.filterByCostMaintenancesGreater, 
              $sort: {
                [this.sortBy]: this.sortBy == 'id' ? (this.sortDesc ? -1 : 1) : (this.sortByMaintenance == 'ascending' ? 1 : -1)
              },
              $or: [
                {
                  name: {
                    $iLike: "%" + this.search + "%",
                  }
                },
                {
                  series_number: {
                    $iLike: "%" + this.search + "%",
                  },
                },
              ],
              maintenance_indicator: this.filterByMaintenanceIndicator != undefined ? (this.filterByMaintenanceIndicator == '' ? undefined : this.filterByMaintenanceIndicator) : undefined,
              organizationId: this.userLogged.role == 'admin' ?  (this.filterByOrganizationId == -1 ? undefined : this.filterByOrganizationId) : undefined
            }
          });
        }
        allEquips = allEquips.concat(res.data);
      };
      let data = allEquips.map(item => {
        if(this.userLogged.role == 'admin'){
          return {
            'Nombre Establecimiento': this.dictOrganizations[item.organizationId],
            'Servicio Clínico' : item.ubication,
            'Clase' : this.dictClases[item.clase],
            'Subclase' : this.dictSubclases[item.subclase],
            'Nombre Equipo' : item.name,
            'Marca' : item.brand,
            'Modelo' : item.model,
            'Serie' : item.series_number,
            'N° Inventario' : item.inventory_number,
            'Valor del equipo M$' : item.cost_of_equipment,
            'Año de Adquisición' : item.year_of_acquisition,
            'Vida útil' : item.useful_life,
            'Vida útil residual' : item.vur,
            'Propio / Arriendo / Comodato' : this.dictPossessions[item.possession],
            'Estado (Bueno / Regular / Malo)' : this.dictStates[item.status],
            'Crítico o Relevante' : this.dictCritic[item.critic],
            'Estado de funcionamiento' : this.dictWorkingStatus[item.active],
          }
        }
        else{
          return {
            'Servicio Clínico' : item.ubication,
            'Clase' : this.dictClases[item.clase],
            'Subclase' : this.dictSubclases[item.subclase],
            'Nombre Equipo' : item.name,
            'Marca' : item.brand,
            'Modelo' : item.model,
            'Serie' : item.series_number,
            'N° Inventario' : item.inventory_number,
            'Valor del equipo M$' : item.cost_of_equipment,
            'Año de Adquisición' : item.year_of_acquisition,
            'Vida útil' : item.useful_life,
            'Vida útil residual' : item.vur,
            'Propio / Arriendo / Comodato' : this.dictPossessions[item.possession],
            'Estado (Bueno / Regular / Malo)' : this.dictStates[item.status],
            'Crítico o Relevante' : this.dictCritic[item.critic],
            'Estado de funcionamiento' : this.dictWorkingStatus[item.active],
          }
        }
      })
      try {
        json2excel({
          data,
          name: 'list-equipment',
          formateDate: 'dd/mm/yyyy'
        });
      } catch (e) {
        console.error(e);
      }
    }
  },
  computed: {
    userLogged: getStore("user"),
    listStatus: getStore("listStatus")
  },
  watch: {
    page(){
      this.getEquipments();
      this.listStatus['page'] = this.page;
      setStore('listStatus', this.listStatus);
    },
    itemsPerPage(){
      this.getEquipments();
      this.listStatus['itemsPerPage'] = this.itemsPerPage;
      setStore('listStatus', this.listStatus);
    },
    sortBy(){
      this.getEquipments();
      this.listStatus['sortBy'] = this.sortBy;
      setStore('listStatus', this.listStatus);
    },
    sortDesc(){
      this.getEquipments();
      this.listStatus['sortDesc'] = this.sortDesc;
      setStore('listStatus', this.listStatus);
    },
    search(){
      if( this.search == null){
        this.search = '';
      }
      this.getEquipments();
      this.listStatus['search'] = this.search;
      setStore('listStatus', this.listStatus);
    },
    filterByOrganizationId(){
      this.getEquipments();
      this.listStatus['filterByOrganizationId'] = this.filterByOrganizationId;
      setStore('listStatus', this.listStatus);
    },
    filterByVUR(){
      this.getEquipments();
      this.listStatus['filterByVUR'] = this.filterByVUR;
      setStore('listStatus', this.listStatus);
    },
    filterByCostMaintenancesGreater(){
      this.getEquipments();
      this.listStatus['filterByCostMaintenancesGreater'] = this.filterByCostMaintenancesGreater;
      setStore('listStatus', this.listStatus);
    },
    sortByMaintenance(){
      this.sortBy = 'last_maintenance';
      this.getEquipments();
      this.listStatus['sortByMaintenance'] = this.sortByMaintenance;
      setStore('listStatus', this.listStatus);
    },
    filterByMaintenanceIndicator(){
      this.getEquipments();
      this.listStatus['filterByMaintenanceIndicator'] = this.filterByMaintenanceIndicator;
      setStore('listStatus', this.listStatus);
    },
    clase(){
      this.getEquipments();
      this.listStatus['clase'] = this.clase;
      setStore('clase', this.listStatus);
    },
    critic(){
      this.getEquipments();
      this.listStatus['critic'] = this.critic;
      setStore('critic', this.listStatus);
    }, 
    agreement(){
      this.getEquipments();
      this.listStatus['agreement'] = this.agreement;
      setStore('agreement', this.listStatus);
    }, 
    active(){
      this.getEquipments();
      this.listStatus['active'] = this.active;
      setStore('active', this.listStatus);
    },
  }
}
</script>

<style>

.v-alert__icon.v-icon {
    font-size: 20px;
}
</style>