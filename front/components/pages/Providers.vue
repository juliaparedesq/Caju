<template>
  <v-card elevation="2">
    <v-toolbar dense color="primary" dark>
      <v-toolbar-title>Gestión de Proveedores</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" icon @click="openAddProvider">
            <v-icon>mdi-account-plus</v-icon>
          </v-btn>
        </template>
        <span>Agregar proveedor</span>
      </v-tooltip>
    </v-toolbar>
    <v-data-table :headers="headers" :items="providers" :items-per-page="15" class="elevation-1">
      <template v-slot:item.contact="{ item }">
        <v-card-text class="pa-0 ma-0">Email: {{item.email}}</v-card-text>
        <v-card-text class="pa-0 ma-0">Teléfono: {{item.phone_number}}</v-card-text>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" icon @click="openEditProvider(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </template>
          <span>Editar</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" icon @click="openConfirmDeactivate(item)">
              <v-icon>mdi-account-off</v-icon>
            </v-btn>
          </template>
          <span>Desactivar</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <v-dialog v-model="dialog" max-width="420">
      <v-card>
        <v-card-title class="text-h5" v-if="!isEdit">
          Agregar Proveedor
        </v-card-title>
        <v-card-title class="text-h5" v-else>
          Editar Proveedor
        </v-card-title>
        <v-card-text>
          <v-form ref="formProvider" @keyup.native.enter="formReady">
            <v-text-field :error="this.errorName" :error-messages="this.messageErrorName" v-model="providerName" label="Nombre" required :rules="[validations.required()]"/>
            <v-text-field v-model="provider.rut" label="Rut" required :rules="[validations.required()]"/>
            <v-text-field v-model="provider.email" label="Email"/>
            <v-text-field v-model="provider.phone_number" label="Teléfono"/>
            <v-checkbox v-model="provider.pm_agreement" value label="Convenio Mantenciones Preventivas"></v-checkbox>
            <v-checkbox v-model="provider.cm_agreement" value label="Convenio Mantenciones Correctivas"></v-checkbox>
            <v-text-field v-model="provider.bidding" label="Licitación"/>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="closeModal">Cerrar</v-btn>
          <v-btn v-if="!isEdit" @click="addProvider">Agregar</v-btn>
          <v-btn v-else @click="updateProvider">Actualizar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="deactivateModel" max-width="420">
      <v-card>
        <v-card-title class="text-h5" >
          Desactivar Proveedor
        </v-card-title>
        <v-card-text>
          ¿Está seguro de desactivar al proveedor {{this.providerToDeactivate.name}}?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="closeDeactivateModel()">No</v-btn>
          <v-btn @click="deactivateProvider()">Sí, desactivar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script>
import validations from "../../services/validation.service";

export default {
  name: "providersManager",
  data() {
    return {
      validations: validations,
      headers: [
        { text: 'Nombre', value: 'name' },
        { text: 'Rut', value: 'rut' },
        { text: 'Contacto', value: 'contact' },
        { text: 'Acciones', value: 'actions' },
      ],
      providers: [],
      dialog: false,
      deactivateModel: false,
      providerToDeactivate:{
        name: ""
      },
      id:0,
      isEdit: false,
      errorName: false,
      messageErrorName: "",
      providerName: "",
      provider: {
        name: "",
        rut: "",
        email: "",
        phone_number: "",
        pm_agreement: true,
        cm_agreement: true,
        bidding: null,
      },
      organizations: []
    }
  },
  mounted() {
    this.getProviders();
  },
  methods: {
    async getProviders(){
      let providers = await this.$service("api/provider").find({
        query: {
          active: true,
          $limit: 100
        }
      });
      this.providers = providers.data;
    },
    async getOrganizations(){
      let finder = await this.$service("api/organization").find();
      this.organizations = finder['data'];
    },
    openAddProvider(){
      this.isEdit = false;
      this.dialog = true;
      this.clearProvider();
      this.resetProviderValidation();
    },
    closeModal(){
      this.dialog = false;
      this.clearProvider();
      this.getProviders();
      this.resetProviderValidation();
    },
    async addProvider(){
      this.provider.name = this.providerName;
      if(this.$refs.formProvider.validate()) {
        try{
          await this.$service("api/provider").create(this.provider);
          this.getProviders();
          this.closeModal();
        }
        catch(e){
          if(e.errors[0].message){
            if(e.errors[0].message == 'name must be unique'){
              this.messageErrorName = "Proveedor ya registrado";
            }
          }
        }
      }
    },
    async openEditProvider(provider){
      this.isEdit = true;
      this.dialog = true;
      this.id = provider.id;
      this.provider = provider;
      this.providerName = provider.name;
    },
    async updateProvider(){
      this.provider.name = this.providerName;
      if(this.$refs.formProvider.validate()){
        try{
          await this.$service("api/provider").patch(this.id, this.provider);
          this.getProviders();
          this.closeModal();
          this.id = 0;
        }
        catch(e){
          if(e.errors[0].message){
            if(e.errors[0].message == 'name must be unique'){
              this.messageErrorName = "Proveedor ya registrado";
            }
          }
        }
      }
    },
    formReady(){
      if(this.isEdit){
        this.updateProvider();
      }
      else{
        this.addProvider();
      }
    },
    clearProvider(){
      this.providerName = "";
      this.provider = {
        name: "",
        rut: "",
        email: "",
        phone_number: "",
        pm_agreement: true,
        cm_agreement: true,
        bidding: "",
      };
    },
    async deactivateProvider(){
      this.id = this.providerToDeactivate.id;
      await this.$service("api/provider").patch(this.id, {active: "FALSE"});
      this.getProviders();
      this.closeDeactivateModel();
    },
    resetProviderValidation() {
      if (this.$refs['formProvider']){
        this.$refs.formProvider.resetValidation();
      }
      this.errorName = false;
      this.messageErrorName = "";
    },
    openConfirmDeactivate(item){
      this.providerToDeactivate = item;
      this.deactivateModel = true;
    },
    closeDeactivateModel(){
      this.deactivateModel = false;
      this.clearDeactivateProvider();
    },
    clearDeactivateProvider(){
      this.providerToDeactivate = {
        name: "",
      };
    }
  },
  watch: {
    providerName(){
      this.errorName = false;
      this.messageErrorName = "";
    }
  }
}
</script>

<style scoped>

</style>