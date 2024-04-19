<template>
  <v-card elevation="2" v-if="ready">
    <v-toolbar dense color="primary" dark>
      <v-toolbar-title>Gestión de Convenios</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" icon @click="openAddAgreement">
            <v-icon>mdi-file-plus</v-icon>
          </v-btn>
        </template>
        <span>Agregar convenio</span>
      </v-tooltip>
    </v-toolbar>
    <v-data-table :headers="headers" :items="agreements" :items-per-page="15" class="elevation-1">
        <template v-slot:item.provider="{ item }">
            {{providerName(item.providerId)}}
        </template>
        <template v-slot:item.equipmentsList="{ item }">
            <template v-for="it in item.namesList" >
              <v-list-item-title>{{it}}</v-list-item-title>
            </template>
        </template>
        <template v-slot:item.actions="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" icon @click="openConfirmDeactivate(item)">
              <v-icon>mdi-sim-off</v-icon>
            </v-btn>
          </template>
          <span>Desactivar</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <v-dialog v-model="dialog" max-width="420">
      <v-card id="formAgreement">
        <v-card-title class="text-h5" v-if="!isEdit">
          Agregar Convenio
        </v-card-title>
        <v-card-title class="text-h5" v-else>
          Editar Convenio
        </v-card-title>
        <v-card-text>
          <v-form ref="formAgreement" @keyup.native.enter="formReady">
            <v-select :items="organizations" v-if="userLogged.role == 'admin'" v-model="filterEquipments" item-value="id" item-text="name" label="Organizacion" required :rules="[validations.required()]"/>
            <v-text-field v-model="agreement.name" label="Nombre" required :rules="[validations.required()]"/>
            <v-autocomplete v-model="agreement.providerId" :items="providers" item-value="id" item-text="name" label="Proveedor" required :rules="[validations.required()]"/>
            <v-text-field  v-if="agreement.providerId == 0" label="Ingrese nombre proveedor" v-model="newProvider" required :rules="[validations.required()]"/>
            <v-text-field v-model="agreement.code" value label="Código" required :rules="[validations.required()]"/>
            <v-select v-model="agreement.intention" :items="TypesOfMaintenance" item-value="value" item-text="name" label="Tipo de mantenciones" required :rules="[validations.required()]"/>
            <my-date-picker v-model="agreement.start_date" label="Fecha de inicio" required :rules="[validations.required()]"/>
            <my-date-picker v-model="agreement.end_date" label="Fecha de termino" required :rules="[validations.required()]"/>
            <v-text-field v-model.number="agreement.cost" type="number" label="Costo" required :rules="[validations.required()]"/>
            <v-autocomplete v-model="agreement.equipments_list" :items="equipments" :loading="isLoading" :search-input.sync="search" hide-no-data hide-selected small-chips deletable-chips item-text="name" item-value="id" label="Equipos" multiple></v-autocomplete>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="closeModal">Cerrar</v-btn>
          <v-btn v-if="!isEdit" @click="addAgreement">Agregar</v-btn>
          <v-btn v-else @click="updateAgreement">Actualizar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="deactivateModel" max-width="420">
      <v-card>
        <v-card-title class="text-h5" >
          Desactivar Convenio
        </v-card-title>
        <v-card-text>
          ¿Está seguro de desactivar el convenio {{this.agreementToDeactivate.name}}?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="closeDeactivateModel()">No</v-btn>
          <v-btn @click="deactivateAgreement()">Sí, desactivar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script>
import {getStore} from "../../services/store.service";
import validations from "../../services/validation.service";
import MyDatePicker from '../utils/MyDatePicker.vue';

export default {
  name: "agreementsManager",
  components: {
    MyDatePicker
  },
  data() {
    return {
      validations: validations,
      headers: [
        { text: 'Nombre', value: 'name' },
        { text: 'Proveedor', value: 'provider' },
        { text: 'Equipos', value: 'equipmentsList' },
        { text: 'Acciones', value: 'actions' },
      ],
      TypesOfMaintenance: [
        {name: "Preventivo", value: "preventive"},
        {name: "Correctivo", value: "corrective"}
      ],
      agreements: [],
      organizations: [],
      dialog: false,
      deactivateModel: false,
      agreementToDeactivate: {
          name: "",
          providerId: 0
      },
      id:0,
      isEdit: false,
      agreement: {
        name: null,
        providerId: null,
        code: null,
        intention: null,
        start_date: null,
        end_date: null,
        cost: null,
        equipments_list: [],
        organizationId: null,
      },
      equipments: [],
      providers: [],
      newProvider: "",
      ready: false,
      filterEquipments: undefined,
    }
  },
  async created() {
    await this.getOrganizations();
    await this.getAgreements();
    await this.getEquipments();
    await this.getProviders();
    this.ready = true;
  },
  computed: {
    userLogged: getStore("user"),
  },
  watch: {
      dialog(){
          if(this.dialog == false){
              this.goTop('formAgreement');
          }
      },
      filterEquipments(){
        this.agreement.organizationId = this.filterEquipments,
        this.getEquipments();
      }
  },
  methods: {
    goTop(refName) {
      var element =  document.getElementById(refName);
      element.scrollIntoView(true);
    },
    async getAgreements(){
      let agreements = await this.$service("api/agreement").find({
        query: {
          active: true,
          $limit: 100,
          organizationId: this.userLogged.role == 'admin' ? this.filterEquipments : this.userLogged.organizationId,
        }
      });
      for(let agreement of agreements.data){
            agreement.namesList = []
            for(let equipmentId of agreement.equipments_list){
                var equipment = await this.$service("api/equipment").get(equipmentId);
                (agreement.namesList).push(equipment.name);
            }
      }
      this.agreements = agreements.data;
    },
    async getOrganizations(){
      let res = await this.$service("api/organization").find();
      this.organizations = res.data;
    },
    async getEquipments(){
      let offset = 0;
      let limit = 100;
      let res;
      let allEquips;
      res = await this.$service("api/equipment").find({
        query: {
          $limit: limit,
          $skip: offset,
          $sort: {
            id: 1
          },
          $or: [
              {last_maintenance: { $lte: new Date().getTime() } },
              {last_maintenance: null}
          ],
          organizationId: this.userLogged.role == 'admin' ? this.filterEquipments : this.userLogged.organizationId
        }
      });
      allEquips = res.data;
      while(res.total > res.skip + res.limit){
        offset = offset + limit;
        res = await this.$service("api/equipment").find({
        query: {
          $limit: limit,
          $skip: offset,
          $sort: {
            id: 1
          },
          $or: [
              {last_maintenance: { $lte: new Date().getTime() } },
              {last_maintenance: null}
          ],
          organizationId: this.userLogged.role == 'admin' ? this.filterEquipments : this.userLogged.organizationId
        }
        });
        allEquips = allEquips.concat(res.data);
      };
      this.equipments = allEquips;
    },
    async getProviders(){
        let res = await this.$service("api/provider").find();
        this.providers = res.data;
    },
    openAddAgreement(){
      this.resetAgreementValidation();
      this.isEdit = false;
      this.dialog = true;
      this.clearAgreement();
    },
    async closeModal(){
      this.dialog = false;
      this.clearAgreement();
      await this.getAgreements();
      this.resetAgreementValidation();
    },
    async addAgreement(){
        if (this.userLogged.role != 'admin'){
            this.agreement.organizationId = parseInt(this.userLogged.organizationId);
        }
        if(this.newProvider != ""){
                let providerId = await this.addProvider();
                await this.getProviders();
                this.agreement.providerId = providerId;
            }
        if(this.$refs.formAgreement.validate()) {
            let agreement = await this.$service("api/agreement").create(this.agreement);
            await this.addMaintenance(agreement);
            await this.getAgreements();
            await this.closeModal();
      }
    },
    async openEditAgreement(agreement){
      this.isEdit = true;
      this.dialog = true;
      this.id = agreement.id;
      this.agreement = agreement;
    },
    async updateAgreement(){
      if(this.$refs.formAgreement.validate()) {
        await this.$service("api/agreement").patch(this.id, this.agreement);
        await this.closeModal();
      }
      this.id = 0;
    },
    formReady(){
      if(this.isEdit){
        this.updateAgreement();
      }
      else{
        this.addAgreement();
      }
    },
    clearAgreement(){
      this.agreement = {
        name: null,
        providerId: null,
        code: null,
        intention: null,
        start_date: null,
        end_date: null,
        cost: null,
        equipments_list: [],
        organizationId: this.userLogged.role == 'admin' ? null : this.userLogged.organizationId,
      };
      this.newProvider = "";

    },
    async deactivateAgreement(){
      let agreement = this.agreementToDeactivate;
      await this.$service("api/agreement").patch(this.agreementToDeactivate.id, {active: "FALSE"});
      await this.getAgreements();
      this.closeDeactivateModel();
      //maintenances associated with the agreement
      let res = await this.$service("api/maintenance").find({
          query: {
              agreementId: agreement.id
          }
      });
      let maintenancesToDeactivate = res.data;
      let individualMaintenanceCost = maintenancesToDeactivate[0].labor_cost;
      //deactivating maintenances associated with the agreement
      for(let maintenance of maintenancesToDeactivate){
          await this.$service("api/maintenance").patch(maintenance.id, {active: "FALSE"});
      };
      //descounting individual agreement value of total cost of maintenances and changing the last_maintenance value of each equipment associated with the agreement
      for (let equipmentId of agreement.equipments_list){ 
          let equipment = await this.$service("api/equipment").get(equipmentId);
          let costOfMaintenances = equipment.cost_of_maintenances - individualMaintenanceCost;
          if(costOfMaintenances < 0){
            await this.$service("api/equipment").patch(equipmentId, { cost_of_maintenances: 0 });
          }
          else{
            await this.$service("api/equipment").patch(equipmentId, { cost_of_maintenances: costOfMaintenances });
          }
          if(equipment.last_maintenance == agreement.end_date){
              //searching another possible value for last_maintenance
              let res = await this.$service("api/maintenance").find({
                query: {
                    equipmentId: equipmentId,
                    active: "TRUE",
                    $sort: {
                        'date_of_maintenance': -1
                    }
                }
              });
              let maintenances = res.data;
              if(maintenances.length > 0){
                await this.$service("api/equipment").patch(equipmentId, {
                    last_maintenance: maintenances[0].date_of_maintenance
                });
              }
              else{
                  await this.$service("api/equipment").patch(equipmentId, {
                    last_maintenance: null
                });
              };
          }

      }
    },
    resetAgreementValidation(){
      if(this.$refs.formAgreement){
        this.$refs.formAgreement.resetValidation();
      }
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
    providerName(id){
        var name = this.providers.find(x => x.id === id);
        if( name != undefined){
            return name.name;
        }
    },
    async addMaintenance(agreement){
        for(let equipmentId of agreement.equipments_list){
            var maintenance_cost = Math.round(agreement.cost/agreement.equipments_list.length);
            var equipment = await this.$service("api/equipment").get(equipmentId);
            if(equipment.last_maintenance == null || equipment.last_maintenance < agreement.end_date){
              await this.$service("api/equipment").patch(equipmentId, {
                  cost_of_maintenances: maintenance_cost + equipment.cost_of_maintenances,
                  last_maintenance: agreement.end_date
              });
            }
            else{
              await this.$service("api/equipment").patch(equipmentId, {
                  cost_of_maintenances: maintenance_cost + equipment.cost_of_maintenances
              });
            }

            let maintenance = {
                date_of_maintenance: agreement.end_date,
                duration: 0,
                intention: "agreement",
                labor_cost: maintenance_cost,
                extra_cost: 0,
                providerId: agreement.providerId,
                equipmentId: equipmentId,
                agreementId: agreement.id,
                userId: this.userLogged.id,
            }
            await this.$service("api/maintenance").create(maintenance);
        }
    },
    openConfirmDeactivate(item){
      this.agreementToDeactivate = item;
      this.deactivateModel = true;
    },
    closeDeactivateModel(){
      this.deactivateModel = false;
      this.clearDeactivateAgreement();
    },
    clearDeactivateAgreement(){
      this.agreementToDeactivate = {
        name: "",
        providerId: 0
      };
    }
  },
}
</script>

<style scoped>

</style>