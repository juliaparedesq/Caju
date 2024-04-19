<template>
  <v-card elevation="2">
    <v-toolbar dense color="primary" dark>
      <v-toolbar-title>Gestión de Usuarios</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="openAddUser">
        <v-icon>mdi-account-plus</v-icon>
      </v-btn>
    </v-toolbar>
    <v-data-table :headers="headers" :items="users" items-per-page="5" class="elevation-1">
      <template v-slot:item.actions="{ item }">
        <v-btn icon @click="openEditUser(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon>mdi-account-off</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <v-dialog v-model="dialog" max-width="420">
      <v-card>
        <v-card-title class="text-h5">
          Agregar Usuario
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field v-model="user.name" label="Nombre" required/>
            <v-text-field v-model="user.email" label="Email" required/>
            <v-text-field v-model="user.password" label="Password" type="password" required/>
            <v-select :items="roles" label="Rol" v-model="user.role" item-value="value" item-text="name"/>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="closeModal">Cerrar</v-btn>
          <v-btn @click="addUser">Agregar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
  name: "UsersManager",
  data() {
    return {
      headers: [
        { text: 'Nombre', value: 'name' },
        { text: 'Email', value: 'email' },
        { text: 'Rol', value: 'role' },
        { text: 'Acciones', value: 'actions' },
      ],
      users: [],
      dialog: false,
      user: {
        name: "",
        email: "",
        password: "",
        role: "visitor"
      },
      roles: [
        {name: "Administrador", value: "admin"},
        {name: "Gestor", value: "manager"},
        {name: "Visita", value: "visitor"},
      ]
    }
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    async getUsers(){
      let users = await this.$service("users").find({
        query: {
          active: true
        }
      });
      this.users = users.data;
    },
    openAddUser(){
      this.dialog = true;
    },
    closeModal(){
      this.dialog = false;
    },
    async addUser(){
      console.log(this.user);
      await this.$service("users").create(this.user);
      this.getUsers();
      this.closeModal();
    },
    openEditUser(user){
      console.log(user);
    }
  }
}
</script>

<style scoped>

</style>