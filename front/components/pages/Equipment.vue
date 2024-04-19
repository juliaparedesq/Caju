<template>
    <v-card color=#F5F6FA elevation="0" v-if="ready">
        <v-toolbar color=#F5F6FA elevation="0">
        <v-toolbar-title>Ficha de equipo</v-toolbar-title>
        </v-toolbar>
        <v-row>
            <v-col cols="12" v-if="this.equip.active == 'deactivated'">
                <v-card class="rounded-lg" elevation="0">
                    <v-card-text>
                        <h4> Equipo dado de baja: {{equip.deactivatedReason}}
                        </h4>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12">
                <v-card class="rounded-lg" elevation="0">
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="1" class="pa-1 pt-2 text-center">
                                    <v-tooltip bottom v-if="equipImg != '' ">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-img v-bind="attrs" v-on="on" @click="dialogImg = true" :src="equipImg" alt="" max-width="180" max-height="300"/>
                                        </template>
                                        <span>Ver imagen</span>
                                    </v-tooltip>
                                    <v-icon v-else large>mdi-washing-machine</v-icon>
                            </v-col>
                            <v-col>
                                <v-row>
                                    <v-col cols="12" class="pa-4 pl-1 pt-1 pr-2">
                                        <v-card-title class="pa-0">{{ equip.name }}
                                            <v-spacer></v-spacer>
                                            <v-tooltip bottom v-if="this.equip.active == 'operational'" >
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-chip v-bind="attrs" v-on="on" class="rounded-lg" color="green" text-color="white">Operativo</v-chip>
                                                </template>
                                                <span>En funcionamiento</span>
                                            </v-tooltip>
                                            <v-tooltip bottom v-if="this.equip.active == 'nonOperational'" >
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-chip v-bind="attrs" v-on="on" class="rounded-lg" color="orange" text-color="white">No operativo</v-chip>
                                                </template>
                                                <span>Temporalmente fuera de servicio</span>
                                            </v-tooltip>
                                           <v-chip v-bind="attrs" v-on="on" v-if="this.equip.active == 'deactivated'" class="rounded-lg" color="red" text-color="white">Dado de baja</v-chip>                        
                                                
                                        </v-card-title>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="10">
                                        <v-row>
                                            <v-col cols="4" class="pa-2 pl-1">
                                                <v-card-text class="pa-0">Modelo: {{ equip.model }}</v-card-text>
                                            </v-col>
                                            <v-col cols="4" class="pa-2">
                                                <v-card-text class="pa-0">Costo (pesos): {{ this.equip.cost_of_equipment ? ('$' + this.equip.cost_of_equipment) : "" }}</v-card-text>
                                            </v-col>
                                            <v-col cols="4" class="pa-2">
                                                <v-card-text class="pa-0">Costo mantenciones (pesos): {{ this.equip.cost_of_maintenances ? ('$' + this.equip.cost_of_maintenances) : "" }}</v-card-text>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col cols="4" class="pa-2 pl-1">
                                                <v-card-text class="pa-0">N. serie: {{ equip.series_number }}</v-card-text>
                                            </v-col>
                                            <v-col cols="4" class="pa-2">
                                                <v-card-text class="pa-0">
                                                    Año de adquisición: {{ this.equip.year_of_acquisition ? (this.equip.year_of_acquisition) : ("") }}
                                                </v-card-text>
                                            </v-col>
                                            <v-col cols="4" class="pa-2">
                                                <v-card-text class="pa-0" v-if="futureDate(this.equip.last_maintenance)">
                                                    En convenio hasta: {{ this.equip.last_maintenance ? (formatDate(this.equip.last_maintenance, "guion")) : ("") }}
                                                </v-card-text>
                                                <v-card-text class="pa-0" v-else>
                                                    Última mantención: {{ this.equip.last_maintenance ? (formatDate(this.equip.last_maintenance, "guion")) : ("") }}
                                                </v-card-text>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col cols="4" class="pa-2 pl-1">
                                                <v-card-text class="pa-0">Vida útil: {{ this.equip.useful_life ? (this.equip.useful_life + ' años') : ""}}</v-card-text>
                                            </v-col>
                                            <v-col cols="4" class="pa-2">
                                                <v-card-text class="pa-0">Vida útil residual: {{ this.equip.vur == null ? "" : (this.equip.vur + " años") }}</v-card-text>
                                            </v-col>
                                            <v-col cols="4" class="pa-2">
                                                <v-card-text class="pa-0"> Indicador de mantención: {{ this.equip.maintenance_indicator ? (this.equip.maintenance_indicator ) : ("") }} <strong> {{ this.equip.maintenance_indicator ? ' *' : ""}} </strong> </v-card-text>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col cols="4" class="pa-2 pl-1">
                                                <v-card-text class="pa-0">{{ this.organization }}, {{ this.equip.ubication }}</v-card-text>
                                            </v-col>
                                            <v-col cols="8" class="pa-2">
                                                <v-card-text class="pa-0" v-if="this.equip.maintenance_indicator != null"> <strong>* {{this.maintenancePrompt}} </strong> </v-card-text>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                    <v-col cols="2" class="pa-2 text-right">
                                        <v-card-text class="pa-0 py-1" >
                                            <v-btn width="140px" color="primary" class="rounded-lg" @click="openEditEquipment">Editar equipo</v-btn>
                                        </v-card-text>
                                        <v-card-text class="pa-0 py-1">
                                            <v-btn width="140px" color="primary" class="rounded-lg" @click="openUpdateMI" v-if="this.equip.maintenance_indicator == null">Ingresar IM</v-btn>
                                            <v-btn width="140px" color="primary" class="rounded-lg" @click="openUpdateMI" v-else>Actualizar IM</v-btn>
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
        <v-row align="centered" v-if="!(this.equip.cost_of_equipment == null) || (this.equip.cost_of_equipment == 0)">
          <v-chart class="chart" :option="option"/>
        </v-row>
        <v-dialog v-model="dialogImg" >
            <v-card>
                <v-img :src="equipImg" alt="" max-width="900px" max-height="900px" />
            </v-card>
        </v-dialog>
        <v-toolbar color=#F5F6FA elevation="0">
            <v-toolbar-title>Eventos</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-scale-transition>
                <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" v-on="on" icon @click="downloadMaintenances">
                    <v-icon dark>mdi-file-download</v-icon>  
                    </v-btn>
                </template>
                <span>Descargar mantenciones</span>
                </v-tooltip>
            </v-scale-transition>
        </v-toolbar>
        <v-card-text >
            <v-container>
                <v-row>
                <v-col class="pa-2">
                    <v-select :items="typesOfMaintenance" prepend-inner-icon="mdi-cog" clearable v-model="filterByTypeMaintenance" item-value="value" item-text="name" label="Tipo de mantenciones" outlined dense class="rounded-lg" background-color="white"/>
                </v-col>
                <v-col  class="pa-2"> 
                    <my-date-picker v-model="filterByMaintenanceDate" icon="mdi-history" :outlined="true" :clearable="true" :dense="true" label="Fecha de mantención" classes="rounded-lg" background-color="white"/>
                </v-col>
                </v-row>
            </v-container>
        </v-card-text>
        <v-row>
            <v-col cols="8" v-if="maintenances.length > 0">
                <v-timeline dense>
                    <v-slide-x-reverse-transition
                        group
                        hide-on-leave>
                        <v-timeline-item v-for="item in maintenances" :key="item.id" color="teal lighten-3" small>
                        <v-card class="rounded-lg" elevation="0" v-if="item.intention == 'agreement'">
                            <v-card-title>Convenio
                            <v-spacer></v-spacer>
                            <v-scale-transition>
                                <v-btn class="lala" @click="seeDetails(item)" v-if="!item.details">Ver detalles
                                <v-icon>mdi-chevron-down</v-icon>
                                </v-btn>
                                <v-btn class="lala" @click="hideDetails(item)" v-else>Ocultar detalles
                                <v-icon>mdi-chevron-up</v-icon>
                                </v-btn>
                            </v-scale-transition>
                            </v-card-title>
                            <v-card-subtitle>
                                <v-icon small>mdi-clock-time-five-outline</v-icon> Hasta {{ formatDate(item.date_of_maintenance, "mes") }}
                            </v-card-subtitle>
                            <v-card-text v-if="item.details">
                                <v-row>
                                    <v-col cols="4">
                                        <h4>Proveedor</h4>
                                    </v-col>
                                    <v-col cols="8">
                                        <span>{{ item.providerName }}</span>
                                    </v-col>
                                    <v-col cols="4">
                                        <h4>Costo individual (pesos)</h4>
                                    </v-col>
                                    <v-col cols="8">
                                        <span> ${{item.labor_cost}}</span>
                                    </v-col>
                                    <v-col cols="4">
                                        <h4>Fecha inicio</h4>
                                    </v-col>
                                    <v-col cols="8">
                                        <span> {{formatDate(item.agreement.start_date, "")}}</span>
                                    </v-col>
                                    <v-col cols="4">
                                        <h4>Fecha termino</h4>
                                    </v-col>
                                    <v-col cols="8">
                                        <span> {{formatDate(item.agreement.end_date, "")}}</span>
                                    </v-col>
                                </v-row>
                            </v-card-text> 
                        </v-card>
                        <v-card class="rounded-lg" elevation="0" v-else>
                            <v-card-title>Mantenimiento {{ item.intention == "preventive" ? "preventivo" : "correctivo" }}
                            <v-spacer></v-spacer>
                            <v-scale-transition>
                                <v-btn class="lala" @click="seeDetails(item)" v-if="!item.details">Ver detalles
                                <v-icon>mdi-chevron-down</v-icon>
                                </v-btn>
                                <v-btn class="lala" @click="hideDetails(item)" v-else>Ocultar detalles
                                <v-icon>mdi-chevron-up</v-icon>
                                </v-btn>
                            </v-scale-transition>
                            </v-card-title>
                            <v-card-subtitle>
                                <v-icon small>mdi-clock-time-five-outline</v-icon> {{ formatDate(item.date_of_maintenance, "mes") }}
                            </v-card-subtitle>
                            <v-card-text v-if="item.details">
                                <v-row>
                                    <v-col cols="4">
                                        <h4>Proveedor</h4>
                                    </v-col>
                                    <v-col cols="8">
                                        <span>{{ item.providerName }}</span>
                                    </v-col>
                                    <v-col cols="4">
                                        <h4>Comentarios</h4>
                                    </v-col>
                                    <v-col cols="8">
                                        <span> {{item.comment}}</span>
                                    </v-col>
                                    <v-col cols="4">
                                        <h4>Costo mano de obra (pesos)</h4>
                                    </v-col>
                                    <v-col cols="8">
                                        <span> ${{item.labor_cost}}</span>
                                    </v-col>
                                    <v-col cols="4">
                                        <h4>Costo repuestos (pesos)</h4>
                                    </v-col>
                                    <v-col cols="8">
                                        <span> ${{item.extra_cost}}</span>
                                    </v-col>
                                    <v-col cols="4" v-if="item.pdf !=  null">
                                        <v-btn :href="item.pdf" target="_blank" class="text-decoration-underline pa-0">Ver documento</v-btn>
                                    </v-col>
                                    <v-col cols="4">
                                        <v-btn class="pa-0 text-decoration-underline" small @click="openConfirmDeleteMaintenance(item)">Eliminar mantención
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-card-text> 
                        </v-card>
                        </v-timeline-item>
                    </v-slide-x-reverse-transition>
                </v-timeline>
            </v-col>
            <v-col cols="8" v-else>
                <p v-if="(maintenances.length == 0) & (filterByMaintenanceDate == null) & (filterByTypeMaintenance == null)">Aún no se han agregado mantenimientos a este equipo</p>
            </v-col>
            <v-col cols="4">
                <v-card-text class="pa-2 text-center" >
                    <v-btn width="220px" color="primary" class="rounded-lg" @click="dialogAddMaintenance = true" >Agregar mantenimiento</v-btn>
                </v-card-text>
                <v-card-text class="pa-2 text-center" v-if="this.equip.active != 'deactivated'">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn v-bind="attrs" v-on="on" width="220px" color="red" class="rounded-lg white--text" @click="openConfirmDeactivate()" >Dar de baja</v-btn>
                        </template>
                        <span>Inhabilitar equipo</span>
                    </v-tooltip>
                </v-card-text>
            </v-col>
        </v-row>
        <v-dialog v-model="dialogAddMaintenance" max-width="900">
            <v-card id="formMaintenance">
                <v-card-title class="text-h5">Añadir Mantención</v-card-title>
                <v-card-text>
                    <v-form ref="formMaintenance" >
                        <v-container>
                            <v-row>
                                <v-col cols="12" sm="4" md="4" class="pa-1">
                                    <v-card-text class="pa-1">
                                        <v-icon>mdi-calendar-range</v-icon> Fecha de mantención
                                    </v-card-text>
                                    <my-date-picker v-model="maintenance.date_of_maintenance" :outlined="true" label="" classes="rounded-lg" required :rules="[validations.required(), validations.dateBeforeOrToday()]"/>
                                </v-col>
                                <v-col cols="12" sm="4" md="4" class="pa-1">
                                    <v-card-text class="pa-1">
                                        <v-icon>mdi-cog</v-icon> Mantenimiento
                                    </v-card-text>
                                    <v-select v-model="maintenance.intention" :items="typesOfMaintenance" item-value="value" item-text="name" outlined class="rounded-lg" required :rules="[validations.required()]"/>
                                </v-col>
                                <v-col cols="12" sm="4" md="4" class="pa-1">
                                    <v-card-text class="pa-1">
                                        <v-icon>mdi-calendar-range</v-icon> Fecha de requerimiento
                                    </v-card-text>
                                    <my-date-picker v-model="maintenance.date_of_request" :outlined="true" label="" classes="rounded-lg" required :rules="[validations.required()]"/>
                                </v-col>
                                <v-col cols="12" class="pa-1">
                                    <v-card-text class="pa-1">
                                        <v-icon>mdi-account</v-icon> Proveedor
                                    </v-card-text>
                                    <v-autocomplete v-model="maintenance.providerId" :items="providers" item-value="id" item-text="name" outlined class="rounded-lg" required :rules="[validations.required()]"/>
                                    <v-text-field  v-if="maintenance.providerId == 0" outlined class="rounded-lg" label="Ingrese nombre proveedor" v-model="newProvider" required :rules="[validations.required()]"/>
                                </v-col>
                                <v-col cols="12" class="pa-1">
                                    <v-card-text class="pa-1">
                                        <v-icon>mdi-message-text-outline</v-icon> Comentarios
                                    </v-card-text>
                                    <v-textarea v-model="maintenance.comment" outlined class="rounded-lg" required :rules="[validations.required()]"/>
                                </v-col>
                                <v-col cols="6" sm="6" md="6" class="pa-1">
                                    <v-card-text class="pa-1">
                                        <v-icon>mdi-currency-usd</v-icon> Costo repuestos (pesos)
                                    </v-card-text>
                                    <v-text-field v-model="extraCost" outlined class="rounded-lg" v-model.number="extraCost" type="number" required :rules="[validations.required()]"/>
                                    <v-row no-gutters>
                                        <v-col cols="12" sm="12">
                                            <v-card-text class="pa-1">
                                                <v-icon>mdi-currency-usd</v-icon> Costo mano de obra (pesos)
                                            </v-card-text>
                                            <v-text-field outlined class="rounded-lg" v-model.number="laborCost" type="number" required :rules="[validations.required()]"/>
                                        </v-col>
                                    </v-row>
                                </v-col>
                                <v-col cols="6">
                                    <v-card-text class="pa-1 mt-13">
                                        <v-icon>mdi-currency-usd</v-icon> Costo total (pesos)
                                    </v-card-text>
                                    <v-text-field outlined class="rounded-lg" :placeholder="laborCost+extraCost" disabled />
                                </v-col>
                                <v-col cols="12" class="pa-1"> 
                                    <v-card-text class="pa-1">
                                        <v-icon>mdi-paperclip</v-icon>Documento
                                    </v-card-text>
                                    <v-file-input v-model="maintenanceFile" outlined class="rounded-lg" accept="pdf/*" prepend-icon="" :rules="[ validations.atMost5MB()]"/>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="closeAddMaintenance()" color="primary" class="px-6 rounded-lg">Cerrar</v-btn>
                    <v-btn @click="addMaintenance()" color="primary" class="px-6 rounded-lg">Añadir</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <equipment-form ref="equipForm" @updateChart="editChart" @updateEquip="getEquip"/>
        <v-dialog v-model="deactivateModel" max-width="420">
            <v-card>
                <v-card-title class="text-h5" >
                Desactivar Equipo
                </v-card-title>
                <v-card-text>
                    ¿Está seguro de dar de baja este equipo?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="deactivateModel = false">No</v-btn>
                    <v-btn @click="openDataDeactivateEquip()">Sí</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dataDeactivateModel" max-width="480">
            <v-card>
                <v-card-title class="text-h5" >
                ¿Por qué desea dar de baja el equipo?
                </v-card-title>
                <v-form ref="reasonDeactivate" @submit="deactivateEquip()">
                    <v-card-text>
                            <v-text-field v-model="reasonDeactivateEquip" required :rules="[validations.required()]"></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn @click="closeDataDeactivateModel()">Cancelar</v-btn>
                        <v-btn type="submit">Dar de baja</v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>
        <v-dialog v-model="deleteMaintenanceModel" max-width="420">
            <v-card>
                <v-card-title class="text-h5" >
                Eliminar Mantención
                </v-card-title>
                <v-card-text v-if="this.maintenanceToDelete != null">
                    ¿Está seguro de eliminar la mantención del día {{ formatDate(maintenanceToDelete.date_of_maintenance, 'normal') }}, proveedor {{ maintenanceToDelete.providerName}}?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="closeConfirmDeleteMaintenance">No</v-btn>
                    <v-btn @click="deleteMaintenance">Sí</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogMI" max-width="420">
            <v-card>
                <v-card-title class="text-h5" >
                Indice de mantención
                </v-card-title>
                <v-card-text>
                    <v-form ref="MIForm">
                        <v-select :items="equipmentFunction" v-model="maintenanceIndicator.function" label="Función del equipo" item-value="value" item-text="name" required :rules="[validations.required()]"/>
                        <v-select :items="equipmentAplication" v-model="maintenanceIndicator.aplication" label="Riego físico asociado con la aplicación clínica" item-value="value" item-text="name" required :rules="[validations.required()]"/>
                        <v-select :items="equipmentMaintenance" v-model="maintenanceIndicator.maintenance" label="Requisitos de mantenimiento" item-value="value" item-text="name" required :rules="[validations.required()]"/>
                        <v-select :items="equipmentFactor1" v-model="maintenanceIndicator.factor1" label="Antecedentes de problemas" item-value="value" item-text="name" required :rules="[validations.required()]"/>
                        <v-text-field disabled :placeholder="equip.vur" label="Vida útil residual"/>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="closeDialogMI()">Cancelar</v-btn>
                    <v-btn @click="updateMI()">Actualizar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogWarnMI" max-width="510">
            <v-card>
                <v-card-title class="text-h5" >
                Para continuar se necesitan los siguientes datos:
                </v-card-title>
                <v-card-text v-if="equip.year_of_acquisition == null">
                    - Año de adquisición
                </v-card-text>
                <v-card-text v-if="equip.useful_life == null">
                    - Vida útil
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="dialogWarnMI = false">Cancelar</v-btn>
                    <v-btn @click="dialogWarnMI = false, openEditEquipment()">Editar equipo</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script>
import {getStore} from "../../services/store.service";
import FD from "feathers-data-table";
import MyDatePicker from '../utils/MyDatePicker.vue';
import axios from "axios";
import * as dayjs from 'dayjs';
import {json2excel, excel2json} from 'js2excel';
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
    GridComponent
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import validations from "../../services/validation.service";
import pdf from 'vue-pdf'
import EquipmentForm from "../utils/EquipmentForm.vue";


use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
    GridComponent
]);

export default {
  name: "Equipment",
  components: {
    FeathersDataTable: FD.FeathersDataTable,
    MyDatePicker,
    VChart,
    pdf, EquipmentForm
  },
  provide: {
    [THEME_KEY]: "light"
  },
  data() {
    return {
      validations: validations,
      typesOfMaintenance: [
        {name: "Preventivo", value: "preventive"},
        {name: "Correctivo", value: "corrective"}
      ],
      dictTypesMaintenance: {
          "preventive": "Preventivo",
          "corrective": "Correctivo",
      },
      clases: [
        {name: "Apoyo industrial", value: "industrialSupport"},
        {name: "Transporte vertical", value: "verticalTransport"},
        {name: "Energia", value: "Energy"},
        {name: "Manejo de liquidos", value: "liquidHandling"},
        {name: "Comunicaciones", value: "communications"},
      ],
      equipmentFunction: [
        {name: "Terapéutico - Apoyo Vital", value: 10},
        {name: "Terapéutico - Cirugía y cuidados intensivo", value:  9},
        {name: "Terapéutico - Fisioterapia y tratamiento", value:  8},
        {name: "Diagnóstico - Control de cirugía y cuidados intensivos", value:  7},
        {name: "Diagnóstico - Control fisiológico adicional y diagnóstico", value:  6},
        {name: "Analítico - Análisis de laboratorio", value: 5},
        {name: "Analítico - Accesorios del laboratorio", value:  4},
        {name: "Analítico - Computadores y afines", value:  3},
        {name: "Otros - Relacionados con el paciente y otros", value:  2},
      ],
      equipmentAplication: [
          {name: "Riesgo de muerte del paciente", value: 5},
          {name: "Posible lesión del paciente o el usuario", value: 4},
          {name: "Tratamiento inapropiado o error de diagnóstico", value: 3},
          {name: "Daño al equipo", value: 2},
          {name: "Sin riesgo significativo identificado", value: 1}
      ],
      equipmentMaintenance: [
          {name: "Importantes: exige calibración y reemplazo de piezas periódicas", value: 5},
          {name: "Superiores al promedio", value: 4},
          {name: "Usuales: verificación de funcionamiento y pruebas de seguridad", value: 3},
          {name: "Inferiores al promedio", value: 2},
          {name: "Mínimos: Inspección visual", value: 1}
      ],
      equipmentFactor1: [
            {name: "Significativo: más de una cada seis meses", value: 2},
            {name: "Moderado: una cada 6-9 meses", value: 1},
            {name: "Usual: una cada 9-18 meses", value: 0},
            {name: "Mínimo: una cada 18-30 meses", value: -1},
            {name: "Insignificante: menos de una en los 30 meses anteriores", value: -2}
      ],
      equipmentFactor2: [
            {name: "VUR < 25% de la VU", value: 2},
            {name: "25 < VUR < 50% de la VU", value: 1},
            {name: "50 < VUR < 75% de la VU", value: 0},
            {name: "75 < VUR < 100% de la VU", value: -1},
            {name: "VUR > 100% de la VU", value: -2}
      ],
      id: -1,
      equip: {},
      maintenances: {},
      maintenanceIndicator: {
          function: "",
          aplication: "",
          maintenance: "",
          factor1: "",
          factor2: ""
      },
      ready : false,
      organization: [],
      dialogAddMaintenance: false,
      dialogImg: false,
      dialogMI: false,
      dialogWarnMI: false,
      deactivateModel: false,
      dataDeactivateModel: false,
      maintenance: {
        date_of_maintenance: "",
        duration: 0,
        intention: "",
        comment: "",
        labor_cost: 0,
        extra_cost: 0,
        providerId: 1
      },
      laborCost: 0,
      extraCost: 0,
      option: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '8%',
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: ['Mon']
        },
        series: [
          {
            name: 'Mantenciones',
            type: 'bar',
            color: '#C7F770',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: [320]
          },
          {
            name: 'Equipo',
            type: 'bar',
            color: '#FAD867',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: [120]
          },
        ]
      },
      maintenanceFile: null,
      equipImg: "",
      providers: [],
      newProvider: "",
      filterByTypeMaintenance: null,
      filterByMaintenanceDate: null,
      maintenancePrompt: "",
      reasonDeactivateEquip: "",
      deleteMaintenanceModel: false,
      maintenanceToDelete: null, 
    }
  },
  methods: {
    openEditEquipment(){
      this.$refs.equipForm.openEditEquipment(this.equip);
      this.$refs.equipForm.id = this.equip.id;
    },
    openUpdateMI(){
        if(this.equip.vur != null){
            if(this.equip.maintenance_indicator != null){
                this.maintenanceIndicator = {
                    function: this.equip.mi_function,
                    aplication: this.equip.mi_aplication,
                    maintenance: this.equip.mi_maintenance,
                    factor1: this.equip.mi_factor1,
                    factor2: ""
                }
            }
            this.calculateVurRange();
            this.dialogMI = true;
        }
        else{
            this.dialogWarnMI = true;
        }
    },
    async getMaintenances(){
        let res;
        if(this.filterByMaintenanceDate == null){
            res = await this.$service("api/maintenance").find({
                query: {
                    equipmentId: this.id,
                    active: "TRUE",
                    $limit: 100,
                    $sort: {
                        'date_of_maintenance': -1
                    },
                    intention: this.filterByTypeMaintenance == null ? undefined : this.filterByTypeMaintenance,
                }
            })
        }
        else{
            res = await this.$service("api/maintenance").find({
                query: {
                    equipmentId: this.id,
                    active: "TRUE",
                    $limit: 100,
                    $sort: {
                        'date_of_maintenance': -1
                    },
                    intention: this.filterByTypeMaintenance == null ? undefined : this.filterByTypeMaintenance,
                    date_of_maintenance: {
                        $lte: this.filterByMaintenanceDate == null ? undefined : this.filterByMaintenanceDate + '  23:59:59-04',
                        $gte: this.filterByMaintenanceDate == null ? undefined : this.filterByMaintenanceDate + '  00:00:00-04'
                    },
                }
            })
        }
        this.maintenances = res.data;
        for(let maintenance of this.maintenances){
            maintenance.details = false;
            let providerName = await this.$service("api/provider").get(maintenance.providerId);
            maintenance.providerName = providerName.name;
            let file = await this.$service("api/files").find({
                query: {
                    equipmentId: this.id,
                    maintenanceId: maintenance.id
                }
            });
            if(file.total > 0){
                maintenance.pdf =  '/uploads/' + file.data[0].name
            }
            if(maintenance.agreementId != null){
                let agreement = await this.$service("api/agreement").get(maintenance.agreementId);
                maintenance.agreement = agreement;
            }
        }
    },
    maintenanceFrequencySuggestion(){
        if(this.equip.maintenance_indicator != null){
            if( 12 <= this.equip.maintenance_indicator & this.equip.maintenance_indicator < 15){
                this.maintenancePrompt = "Se sugiere realizar mantenciones cada 1 año";
            }
            else if( 15 <= this.equip.maintenance_indicator & this.equip.maintenance_indicator < 19){
                this.maintenancePrompt = "Se sugiere realizar mantenciones cada 6 meses";
            }
            else if( 19 <= this.equip.maintenance_indicator ){
                this.maintenancePrompt = "Se sugiere realizar mantenciones cada 4 meses";
            }
        }
        else{
            this.maintenancePrompt = "";
        }
    },
    async getEquip(){
        let res = await this.$service("api/equipment").get(this.id);
        this.equip = res;
        this.maintenanceFrequencySuggestion();
    },
    seeDetails(item){
      item.details = true;
      this.$forceUpdate();
    },
    hideDetails(item){
      item.details = false;
      this.$forceUpdate();
    },
    async getOrganization(){
      let res = await this.$service("api/organization").get(this.equip.organizationId);
      this.organization = res.name;
    },
    async getProviders(){
        let res = await this.$service("api/provider").find();
        this.providers = res['data'];
        //this.providers = this.providers.concat([{id:0, name: 'otro'}]); // commenting this line means blocking the option to add supplier in the add agreement form
    },
    openConfirmDeactivate(){
        this.deactivateModel = true;
    },
    openDataDeactivateEquip(){
        this.deactivateModel = false;
        this.dataDeactivateModel = true;
    },
    closeDataDeactivateModel(){
        this.dataDeactivateModel = false;
        this.reasonDeactivateEquip = "";
        this.$refs.reasonDeactivate.resetValidation();
    },
    async deactivateEquip(){
      await this.$service("api/equipment").patch(this.id, {active: "deactivated", deactivatedReason: this.reasonDeactivateEquip});
      //this.$router.push("/app/equipments");
      this.closeDataDeactivateModel();
      this.getEquip();
    },
    clearMaintenance(){
        this.maintenance = {
            date_of_maintenance: "",
            duration: 0,
            intention: "",
            comment: "",
            labor_cost: 0,
            extra_cost: 0,
            providerId: 0,
            userId: this.userLogged.id,
            equipmentId: this.id
        };
        this.newProvider = "";
        this.maintenanceFile = null;
        this.laborCost = 0;
        this.extraCost = 0;
    },
    closeAddMaintenance(){
        this.dialogAddMaintenance = false;
        this.clearMaintenance();
        this.$refs.formMaintenance.resetValidation();
    },
    closeDialogMI(){
        this.dialogMI = false;
        this.maintenanceIndicator = {
          function: "",
          aplication: "",
          maintenance: "",
          factor1: "",
          factor2: ""
        }
    },
    async updateMI(){
        let mi = this.maintenanceIndicator;
        let result = mi.function + mi.aplication + mi.maintenance + mi.factor1 + mi.factor2;
        await this.$service("api/equipment").patch(this.id, {maintenance_indicator: result, mi_function: mi.function, mi_aplication: mi.aplication, mi_maintenance: mi.maintenance, mi_factor1: mi.factor1});
        await this.getEquip();
        this.closeDialogMI();
    },
    async addProvider(){
        let provider= {
            name: this.newProvider,
            contact: '678', //TODO: fix this.
        }
        await this.$service("api/provider").create(provider);
        let res = await this.$service("api/provider").find({
            query: {
                name: this.newProvider
            }
        });
        return res['data'][0].id
    },
    async addMaintenance(){
        if(this.$refs.formMaintenance.validate()) {
            this.maintenance.labor_cost = this.laborCost;
            this.maintenance.extra_cost = this.extraCost;

            if(this.newProvider != ""){
                let providerId = await this.addProvider();
                await this.getProviders();
                this.maintenance.providerId = providerId;
            }
            let lastMaintenance = await this.$service("api/maintenance").create(this.maintenance);
            await this.$service("api/equipment").patch(this.id, {cost_of_maintenances: this.equip.cost_of_maintenances + this.laborCost + this.extraCost});
            if(this.equip.last_maintenance == null || dayjs(this.equip.last_maintenance).isBefore(dayjs(this.maintenance.date_of_maintenance))){
                await this.$service("api/equipment").patch(this.id, {last_maintenance: this.maintenance.date_of_maintenance });
            }
            if(this.maintenanceFile != null){
                await this.uploadFiles(lastMaintenance.id);
            }
            this.closeAddMaintenance();
            await this.getEquip();
            await this.getMaintenances();
            this.editChart();
            
        }
    },
    formatDate(date, op){
        if(op === "mes"){
            return dayjs(date).format('MMM DD, YYYY');
        }
        else{
            return dayjs(date).format('DD-MM-YYYY');
        }
    },
    futureDate(date){
      return dayjs(date).isAfter(dayjs());
    },
    editChart(){
      this.option.yAxis.data = [this.equip.name];
      let cEquip = this.equip.cost_of_equipment;
      let cMain = this.equip.cost_of_maintenances;
      if(cMain < cEquip){
        let mantPer = Math.round(100 * cMain / cEquip);
        this.option.series[0].data= [mantPer];
        this.option.series[1].data= [100-mantPer];
      }
      else{
            this.option.series[0].data= [100];
            this.option.series.splice(1,2);
            this.option.series[0].color = "red";
      }
    },
    async uploadFiles(num) {
        let auth = await this.$feathers.reAuthenticate();
        let formData = new FormData();
        formData.append('file', this.maintenanceFile);
        formData.append('date', this.maintenanceFile.date);
        formData.append('type', this.maintenanceFile.type);
        formData.append('equipmentId', this.id);
        if(num != 0){
            formData.append('maintenanceId', num);
        }
        try {
          await axios.post(`/api/files`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${auth.accessToken}`
            }
          });
        } catch (e) {
          this.$toast(`Ocurrio un error al subir un archivo.`, 'red');
        }
    },
    async getEquipImg(){
        let res = await this.$service("api/files").find({
            query: {
                equipmentId: this.id
            }
        });
        if(res.total != 0 && (res.data[0].extension == ('png' || 'jpg' || 'jpeg'))){
            this.equipImg = "/" +  res.data[0].path;
        }
    },
    async downloadMaintenances(){
      let allMaintenances;
      let res;
        if(this.filterByMaintenanceDate == null){
            res = await this.$service("api/maintenance").find({
                query: {
                    equipmentId: this.id,
                    $limit: 100,
                    $sort: {
                        'date_of_maintenance': -1
                    },
                    intention: this.filterByTypeMaintenance == null ? undefined : this.filterByTypeMaintenance,
                }
            })
        }
        else{
            res = await this.$service("api/maintenance").find({
                query: {
                    equipmentId: this.id,
                    $limit: 100,
                    $sort: {
                        'date_of_maintenance': -1
                    },
                    intention: this.filterByTypeMaintenance == null ? undefined : this.filterByTypeMaintenance,
                    date_of_maintenance: {
                        $lte: this.filterByMaintenanceDate == null ? undefined : this.filterByMaintenanceDate + '  23:59:59-04',
                        $gte: this.filterByMaintenanceDate == null ? undefined : this.filterByMaintenanceDate + '  00:00:00-04'
                    },
                }
            })
        }
        allMaintenances = res.data;
        for(let i=0; i<allMaintenances.length; i++){
            let providerName = await this.$service("api/provider").get(allMaintenances[i].providerId);
            allMaintenances[i].providerName = providerName.name;
            let file = await this.$service("api/files").find({
                query: {
                    $limit: 100,
                    equipmentId: this.id,
                    maintenanceId: allMaintenances[i].id
                }
            });
            if(file.total > 0){
                allMaintenances[i].pdf =  '/uploads/' + file.data[0].name
            }
        }
      
        let data = allMaintenances.map(item => {
            item.date_of_maintenance = this.formatDate(item.date_of_maintenance, "guion");
            item.date_of_request = this.formatDate(item.date_of_request, "guion");
          return {
            'Fecha de mantenimiento': item.date_of_maintenance,
            'Fecha de requerimiento' : item.date_of_request,
            'Tipo' : this.dictTypesMaintenance[item.intention],
            'Costo repuestos (pesos)' : item.labor_cost,
            'Costo mano de obra (pesos)' : item.extra_cost,
            'Costo total (pesos)' : item.labor_cost + item.extra_cost,
            'Comentarios' : item.comment,
          }
        })
        try {
            json2excel({
            data,
            name: 'maintenances_equip_' + this.id,
            formateDate: 'dd/mm/yyyy'
            });
        } catch (e) {
            console.error(e);
        }
    },
    calculateVurRange(){
        if((this.equip.vur != null) & (this.equip.useful_life != null)){
            let percentage = Math.round(this.equip.vur * 100 / this.equip.useful_life);
            if(percentage < 25){
                this.maintenanceIndicator.factor2 = 2;
            }
            else if( 25 <= percentage & percentage < 50){
                this.maintenanceIndicator.factor2 = 1;
            }
            else if( 50 <= percentage & percentage < 75){
                this.maintenanceIndicator.factor2 = 0;
            }
            else if( 75 <= percentage & percentage < 100){
                this.maintenanceIndicator.factor2 = -1;
            }
            else if( 100 <= percentage){
                this.maintenanceIndicator.factor2 = -2;
            }
        }
    },
    goTop(refName){
      var element =  document.getElementById(refName);
      element.scrollIntoView(true);
    },
    openConfirmDeleteMaintenance(item){
        this.maintenanceToDelete = item;
        this.deleteMaintenanceModel = true;
    },
    closeConfirmDeleteMaintenance(){
        this.maintenanceToDelete = null;
        this.deleteMaintenanceModel = false;
    },
    async deleteMaintenance(){
        await this.$service("api/maintenance").patch(this.maintenanceToDelete.id, {active: "FALSE"});
        let costOfMaintenances = this.equip.cost_of_maintenances - this.maintenanceToDelete.labor_cost - this.maintenanceToDelete.extra_cost;
        if( costOfMaintenances < 0 ){
            await this.$service("api/equipment").patch(this.equip.id, {cost_of_maintenances: 0})
        }
        else{
            await this.$service("api/equipment").patch(this.equip.id, {cost_of_maintenances: costOfMaintenances})
        }
        if(this.equip.last_maintenance == this.maintenanceToDelete.date_of_maintenance){
            //searching another possible value for last_maintenance
            let res = await this.$service("api/maintenance").find({
                query: {
                    equipmentId: this.equip.id,
                    active: "TRUE",
                    $sort: {
                        'date_of_maintenance': -1
                    }
                }
            });
            let maintenances = res.data;
            if(maintenances.length > 0){
                await this.$service("api/equipment").patch(this.equip.id, 
                {last_maintenance: maintenances[0].date_of_maintenance} );
            }
            else{
                await this.$service("api/equipment").patch(this.equip.id,
                {last_maintenance: null });
              };
        }
        await this.getMaintenances();
        this.closeConfirmDeleteMaintenance();
        window.location.reload();

    }
  }, 
  computed: {
    userLogged: getStore("user")
  },
  watch: {
      filterByTypeMaintenance(){
          this.getMaintenances();
      },
      filterByMaintenanceDate(){
          this.getMaintenances();
      },
      dialogAddMaintenance(){
          if(this.dialogAddMaintenance == false){
              this.goTop('formMaintenance');
          }
      }
  },
  async created() {
      this.id = this.$route.params.id
      await this.getEquip();
      await this.getMaintenances();
      await this.getOrganization();
      await this.getProviders();
      this.ready = true;
      this.maintenance.userId = this.userLogged.id;
      this.maintenance.equipmentId = this.id;
      this.editChart();
      this.getEquipImg();
  }
}
</script>
<style scoped>
    .chart {
        height: 200px;
    }
    #custom-disabled.v-chip--disabled {
        opacity: 1;
    }
</style>
