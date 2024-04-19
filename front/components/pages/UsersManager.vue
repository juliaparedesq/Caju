<template>
  <v-card elevation="2">
    <v-toolbar dense color="primary" dark>
      <v-toolbar-title>Gestión de Usuarios</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" icon @click="openAddUser">
            <v-icon>mdi-account-plus</v-icon>
          </v-btn>
        </template>
        <span>Agregar usuario</span>
      </v-tooltip>
    </v-toolbar>
    <v-data-table :headers="headers" :items="users" :items-per-page="15" class="elevation-1">
      <template v-slot:item.actions="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" icon @click="openEditUser(item)">
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
      <template v-slot:item.role="{ item }">
        {{ dic_roles[item.role] }}
      </template>
    </v-data-table>
    <v-dialog v-model="dialog" max-width="420">
      <v-card>
        <v-card-title class="text-h5" v-if="!isEdit">
          Agregar Usuario
        </v-card-title>
        <v-card-title class="text-h5" v-else>
          Editar Usuario
        </v-card-title>
        <v-card-text>
          <v-form ref="formUser" @keyup.native.enter="formReady">
            <v-text-field v-model="user.name" label="Nombre" required :rules="[validations.required()]"/>
            <v-text-field :error="this.errorEmail" :error-messages="this.messageErrorEmail" v-model="userEmail" label="Email" required :rules="[validations.required(), validations.email()]"/>
            <v-text-field v-model="user.password" v-if="!isEdit" label="Contraseña" type="password" required :rules="[validations.required(), validations.minimumNCharacters(8)]"/>
            <v-text-field v-model="user.password" v-else label="Contraseña" type="password" :rules="passwordEditValidation()" />
            <v-text-field v-model="user.repeatedPassword" v-if="!isEdit" label="Confirme contraseña" type="password" required :rules="[validations.required(), validations.confirmation(user.password)]"/>
            <v-select :items="roles" label="Rol" v-model="user.role" item-value="value" item-text="name" :rules="[validations.required()]"/>
            <v-select :items="organizations" v-if="user.role != 'admin'" label="Organizacion" v-model="user.organizationId" item-value="id" item-text="name" :rules="[validations.required()]"/>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="closeModal">Cerrar</v-btn>
          <v-btn v-if="!isEdit" @click="addUser">Agregar</v-btn>
          <v-btn v-else @click="updateUser">Actualizar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="deactivateModel" max-width="420">
      <v-card>
        <v-card-title class="text-h5" >
          Desactivar Usuario
        </v-card-title>
        <v-card-text>
          ¿Está seguro de desactivar al usuario {{this.userToDeactivate.name}}?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="closeDeactivateModel()">No</v-btn>
          <v-btn @click="deactivateUser()">Sí, desactivar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script>
import validations from "../../services/validation.service";

export default {
  name: "UsersManager",
  data() {
    return {
      validations: validations,
      headers: [
        { text: 'Nombre', value: 'name' },
        { text: 'Email', value: 'email' },
        { text: 'Rol', value: 'role' },
        { text: 'Acciones', value: 'actions' },
      ],
      users: [],
      dialog: false,
      deactivateModel: false,
      userToDeactivate: {
        name: ""
      },
      id:0,
      isEdit: false,
      errorEmail : false,
      messageErrorEmail: "",
      userEmail: "",
      user: {
        name: "",
        email: "",
        password: "",
        repeatedPassword: "",
        role: "visitor",
        organizationId: ""
      },
      roles: [
        {name: "Administrador", value: "admin"},
        {name: "Gestor", value: "manager"},
        {name: "Visita", value: "visitor"},
      ],
      organizations: [],
      dic_roles: {
        "admin": "Administrador", 
        "manager": "Gestor",
        "visitor": "Visita"
      }
    }
  },
  mounted() {
    this.getUsers();
    this.getOrganizations();
  },
  methods: {
    async getUsers(){
      let users = await this.$service("users").find({
        query: {
          active: true,
          $limit: 100
        }
      });
      this.users = users.data;
    },
    async getOrganizations(){
      let finder = await this.$service("api/organization").find();
      this.organizations = finder['data'];
    },
    openAddUser(){
      this.isEdit = false;
      this.dialog = true;
      this.clearUser();
      this.resetUserValidation();
    },
    closeModal(){
      this.dialog = false;
      this.clearUser();
      this.getUsers();
      this.resetUserValidation();
    },
    async addUser(){
      this.user.email = this.userEmail;
      if(this.$refs.formUser.validate()) {
        try{
          await this.$service("users").create(this.user);
          this.getUsers();
          this.closeModal();
        }
        catch(e){
          if(e.errors[0].message){
            if(e.errors[0].message == 'email must be unique'){
              this.messageErrorEmail = "Email ya registrado";
            }
          }
        }
      }
    },
    async openEditUser(user){
      this.isEdit = true;
      this.dialog = true;
      this.id = user.id;
      this.user = user;
      this.userEmail = user.email;
    },
    async updateUser(){
      this.user.email = this.userEmail
      if(this.$refs.formUser.validate()) {
        try{
          if(this.user.password == ""){
            delete this.user.password;
          }
          await this.$service("users").patch(this.id, this.user);
          this.getUsers();
          this.closeModal();
          this.id = 0;
        }
        catch(e){
          if(e.errors[0].message){
            if(e.errors[0].message == 'email must be unique'){
              this.messageErrorEmail = "Email ya registrado";
            }
          }
        }
      }
    },
    formReady(){
      if(this.isEdit){
        this.updateUser();
      }
      else{
        this.addUser();
      }
    },
    clearUser(){
      this.userEmail = "";
      this.user = {
        name: "",
        email: "",
        password: "",
        repeatedPassword: "",
        role: "visitor",
        organization: ""
      };
    },
    async deactivateUser(){
      this.id = this.userToDeactivate.id;
      await this.$service("users").patch(this.id, {active: "FALSE"});
      this.getUsers();
      this.closeDeactivateModel();
    },
    resetUserValidation() {
      if (this.$refs['formUser']){
        this.$refs.formUser.resetValidation();
      }
      this.errorEmail = false;
      this.messageErrorEmail = "";
    },
    passwordEditValidation() {
      if (this.user.hasOwnProperty('password')) {
        return [validations.minimumNCharacters(8)];
      }
      else{
        return [];
      }
    },
    openConfirmDeactivate(item){
      this.userToDeactivate = item;
      this.deactivateModel = true;
    },
    closeDeactivateModel(){
      this.deactivateModel = false;
      this.clearDeactivateUser();
    },
    clearDeactivateUser(){
      this.userToDeactivate = {
        name: "",
      };
    }
  }, 
  watch: {
    userEmail(){
      this.errorEmail = false;
      this.messageErrorEmail = "";
    }
  }
}
</script>

<style scoped>

</style>