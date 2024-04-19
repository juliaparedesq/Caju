<template>
  <v-dialog v-model="dialog" ref="equipmentForm" max-width="420">
    <v-card id="form">
      <v-card-title class="text-h5" v-if="edit == false">
        Agregar Equipo
      </v-card-title>
      <v-card-title class="text-h5" v-else>
        Editar Equipo
      </v-card-title>
      <v-card-text>
        <v-form ref="formEquipment">
          <v-select :items="workingStatus" v-model="equip.active" item-value="value" item-text="name" label="Estado de funcionamiento"/>
          <v-select :items="organizations" v-if="userLogged.role == 'admin'" v-model="equip.organizationId" item-value="id" item-text="name" label="Organizacion" required :rules="[validations.required()]"/>
          <v-text-field v-model="equip.name" label="Nombre" required :rules="[validations.required()]"/>
          <v-text-field v-model="equip.series_number" label="Numero de serie" required :rules="[validations.required()]"/>
          <v-text-field v-model="equip.brand" label="Marca" required :rules="[validations.required()]"/>
          <v-text-field v-model="equip.model" label="Modelo" required :rules="[validations.required()]"/>
          <v-text-field v-model="equip.inventory_number" label="Número de inventario" required :rules="[validations.required()]"/>
          <v-select :items="criticRelevant" v-model="equip.critic" label="Crítico o Relevante" item-value="value" item-text="name" required :rules="[validations.required()]"/>
          <v-text-field v-model="equip.ubication" label="Ubicacion" required :rules="[validations.required()]"/>
          <v-select :items="states" v-model="equip.status" label="Estado" item-value="value" item-text="name" required :rules="[validations.required()]"/>
          <v-text-field v-model.number="currentYearAcquisition" type="number" label="Año de adquisición" required :rules="[validations.required()]"/>
          <v-text-field v-model.number="currentUsefulLife" type="number" label="Vida útil (años)" required :rules="[validations.required()]"/>
          <v-text-field v-model.number="equip.vur" label="VUR (años)" disabled type="number" required :rules="[validations.required()]"/>
          <my-date-picker
                v-model="equip.start_up_date"
                label="Fecha de puesta en marcha"
          ></my-date-picker>
          <v-text-field v-model="equip.purchasing_entity" label="Entidad compradora"/>
          <v-text-field v-model="equip.supplier" label="Proveedor"/>
          <v-text-field v-model.number="equip.cost_of_equipment" type="number" label="Costo del equipo (pesos)" required :rules="[validations.required()]"/>
          <v-select :items="possessions" v-model="equip.possession" label="Posesión" item-value="value" item-text="name" required :rules="[validations.required()]"/>
          <v-text-field v-model.number="equip.warranty" type="number" label="Meses de garantía" />
          <v-text-field v-model.number="equip.periodicity_preventive_maintenance" type="number" label="Periodicidad de mantenciones preventivas (Meses)"/>
          <v-select :items="clases" v-model="equip.clase" label="Clase" item-value="value" item-text="name" required :rules="[validations.required()]"/>
          <v-select :items="subclases" v-model="equip.subclase" label="Subclase"  item-value="value" item-text="name" />
          <v-file-input v-model="equipPhoto" label="Fotografía" :rules="[ validations.atMost5MB()]"/>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="closeModal">Cerrar</v-btn>
        <v-btn @click="addEquip" v-if="edit == false" >Agregar</v-btn>
        <v-btn @click="editEquip" v-else >Actualizar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {getStore} from "../../services/store.service";
import MyDatePicker from "../utils/MyDatePicker.vue";
import axios from "axios";
import validations from "../../services/validation.service";

export default {
  name: "EquipmentForm",
  components: {
    MyDatePicker
  },
  data() {
    return {
      validations: validations,
      currentYearAcquisition: 0, 
      currentUsefulLife: 0,
      laborCost: 0,
      extraCost: 0,
      TypesOfMaintenance: [
        {name: "Preventivo", value: "preventive"},
        {name: "Correctivo", value: "corrective"}
      ],
      workingStatus: [
        {name: "Operativo", value: "operational"},
        {name: "No operativo", value: "nonOperational"}
      ],
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
      subclases: [
        {name: 'Alto Costo', value: 'highPrice'},
        {name: 'Mediano Costo', value: 'mediumCost'},
        {name: 'Bajo Costo', value: 'lowCost'},
        {name: 'Instrumental', value: 'instrumental'},
        {name: 'Clínico', value: 'clinical'},
        {name: 'Pesaje', value: 'weighing'},
        {name: 'Refrigeración', value: 'refrigeration'},
        {name: 'Cocción', value: 'cooking'},
        {name: 'Picar', value: 'chop'},
        {name: 'Pelar', value: 'peel'},
        {name: 'Batir', value: 'shake'},
        {name: 'Extracción', value: 'extraction'},
        {name: 'Distribución', value: 'distribution'},
        {name: 'Lavado', value: 'washed'},
        {name: 'Descontaminación', value: 'decontamination'},
        {name: 'Centrifugación', value: 'centrifugation'},
        {name: 'Secado', value: 'drying'},
        {name: 'Planchado', value: 'ironing'},
        {name: 'Costura', value: 'sewing'},
        {name: 'Compresión', value: 'compression'},
        {name: 'Transporte de personas', value: 'peopleTransport'},
        {name: 'Transporte de carga', value: 'freightTransport'},
        {name: 'Eléctrica', value: 'electrical'},
        {name: 'Calórica', value: 'caloric'},
        {name: 'Elevación de aguas servidas', value: 'sewageElevation'},
        {name: 'Elevación de agua potable', value: 'drinkingWaterLift'},
        {name: 'Elevación de fluidos y agua caliente', value: 'FluidLiftAndHotWater'},
        {name: 'Radiocomunicación UHF', value: 'UHFRadioCommunication'},
        {name: 'Radiocomunicación VHF', value: 'VHFRadioCommunication'},
        {name: 'Radiocomunicación HF', value: 'HFRadioCommunication'},
        {name: 'Radiocomunicación vía microonda', value: 'RadioCommunicationViaMicrowave'},
        {name: 'Seguridad y vías de escape', value: 'safetyAndEscapeRoutes'}
      ],
      criticRelevant: [
        {name: "Crítico", value: "critic"},
        {name: "Relevante", value: "relevant"},        
      ],
      dialog: false,
      equip: {
        series_number: "",
        brand: "",
        name: "",
        ubication: "",
        clase: null,
        subclase: null,
        critic: "critic",
        inventory_number: "",
        cost_of_equipment: 0,
        model: "",
        start_up_date: null,
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
      edit: false,
      equipPhoto: null,
      id: 0,
      organizations: [],
      organization: [],
      states: [
        {name: "Bueno", value: "good"},
        {name: "Malo", value: "bad"},
        {name: "Regular", value: "regular"},
      ],
      possessions: [
        {name: "Propio", value: "own"},
        {name: "Arrendado", value: "lease"},
        {name: "Comodato", value: "commodatum"},
      ],
    }
  },

  methods: {
    goTop(refName) {
      var element =  document.getElementById(refName);
      element.scrollIntoView(true);
    },
    clearEquip(){
      this.equip = {
        series_number: "",
        brand: "",
        name: "",
        ubication: "",
        critic: "critic",
        inventory_number: "",
        clase: "",
        subclase: "",
        cost_of_equipment: 0,
        model: null,
        start_up_date: null,
        score: 0,
        year_of_acquisition: 0,
        useful_life: 0,
        vur: 0,
        possession: "own",
        status: "good",
        purchasing_entity: "",
        warranty: 0,
        periodicity_preventive_maintenance: null,
        supplier: "",
        organizationId: 1
      };
    },
    openAddEquipment(){
      this.edit = false;
      this.dialog = true;
      this.clearEquip();
    },
    openEditEquipment(equip){
      this.edit = true;
      this.dialog = true;
      this.equip = equip;
      this.currentYearAcquisition = this.equip.year_of_acquisition;
      this.currentUsefulLife = this.equip.useful_life;
      if(this.$refs.formEquipment){
        this.$refs.formEquipment.resetValidation();
      }
    },
    async addEquip(){
      if (this.userLogged.role != 'admin'){
        this.equip.organizationId = parseInt(this.userLogged.organizationId);
      }
      if(this.$refs.formEquipment.validate()) {
        this.equip.id = 1
        let newEquip = await this.$service("api/equipment").create(this.equip);
        this.closeModal();
        this.$emit("update");
        this.id = newEquip.id;
        if( this.equipPhoto != null){
          await this.uploadFiles();
        }
      }
    },
    async editEquip(){
      if(this.$refs.formEquipment.validate()) {
        await this.$service("api/equipment").patch(this.equip.id, this.equip);
        this.id = this.equip.id;
        this.closeModal();
        this.$emit("updateChart");
        if( this.equipPhoto != null){
          await this.uploadFiles();
        }
      }
    },
    async uploadFiles() {
      let auth = await this.$feathers.reAuthenticate();
      let formData = new FormData();
      formData.append('file', this.equipPhoto);
      formData.append('date', this.equipPhoto.date);
      formData.append('type', this.equipPhoto.type);
      formData.append('equipmentId', this.id);
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
    closeModal(){
      this.dialog = false;
      this.clearEquip();
      this.$refs.formEquipment.resetValidation();
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
    calculateVUR(){
      if(this.currentYearAcquisition != 0 && this.currentUsefulLife != 0){
        const date = new Date();
        const year = date.getFullYear();
        this.equip.vur = this.currentYearAcquisition + this.currentUsefulLife - year;
      }
    },
  },
  computed: {
    userLogged: getStore("user")
  },
  watch: {
    currentYearAcquisition(){
      this.equip.year_of_acquisition = this.currentYearAcquisition;
      this.calculateVUR();
    },
    currentUsefulLife(){
      this.equip.useful_life = this.currentUsefulLife;
      this.calculateVUR();
    },
    dialog(){
      if(this.dialog == false){
        this.goTop('form');
      }
      if(this.edit){
        this.$emit("updateEquip");
      }
    }
  },
  async created() {
    this.getOrganizations()
  }
}
</script>

<style scoped>
</style>
