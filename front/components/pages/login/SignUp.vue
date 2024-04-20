<template>
  <v-form ref="createUser" class="pa-4">
    <v-row>
      <v-col class="pa-0 pl-3 pr-3 mb-3">
        <v-text-field append-icon="mdi-account-circle" label="Nombre(s)" v-model="user.name"
          :rules="[validations.required()]" />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="pa-0 pl-3 pr-3 mb-3">
        <v-text-field append-icon="mdi-account-circle" label="Apellidos" v-model="user.lastname"
          :rules="[validations.required()]" />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="pa-0 pl-3 pr-3 mb-3">
        <v-text-field append-icon="mdi-account-circle" label="Documento de identidad" v-model="user.docID"
          :rules="[validations.required()]" />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="pa-0 pl-3 pr-3 mb-3">
        <v-text-field append-icon="mdi-account-circle" label="Número de teléfono" v-model="user.phoneNumber"
          :rules="[validations.required()]" />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="pa-0 pl-3 pr-3 mb-3">
        <v-text-field append-icon="mdi-card-account-mail" label="Email" v-model="user.email"
          :rules="[validations.required(), validations.email()]" />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="pa-0 pl-3 pr-3 mb-3">
        <v-text-field append-icon="mdi-lock" label="Contraseña" type="password" v-model="user.password"
          :rules="[validations.required()]" />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="pa-0 pl-3 pr-3 ma-0 d-flex justify-start" sm="6">
        <v-btn text small color="primary" @click="toLogin">Volver al Login</v-btn>
      </v-col>
      <v-col class="pa-0 pl-3 pr-3 ma-0 d-flex justify-end" sm="6">
        <v-btn color="primary" rounded :loading="loading" dark @click="addUser">
          Crear cuenta
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import validations from "../../../services/validation.service"
export default {
  name: "SignUp",
  props: {
    /**
     * Shows spinner when logging in
     * @values true, false
     */
    loading: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      /**
       * Validation Object. It has all the validation functions needed to validate inputs.
       **/
      validations: validations,
      /**
       * Recovery mail for password reset.
       **/
      user: {
        name: "",
        lastname: "",
        docID: "",
        phoneNumber: "",
        email: "",
        password: "",
      },
    }
  },
  methods: {
    /**
     * Resets reset password form validations.
     * @public
     **/
    resetRecoveryPasswordValidation() {
      this.$refs.resetPass.resetValidation();
    },
    /**
     * Emits the reset password event to parent.
     * @public
     **/
    sendReset() {
      /** Validates login form **/
      if (this.$refs.resetPass.validate()) {
        this.$emit("sendReset", this.recoveryMail);
      }
    },
    /**
     * Sends to login.
     * @public
     **/
    toLogin(sendData) {
      if (sendData) {
        this.$emit("toLogin", { email: this.email, pwd: this.password });
      }
      this.$emit("toLogin");
    },
    async addUser() {
      //this.user.email = this.userEmail;
      if (this.$refs.createUser.validate()) {
        try {
          await this.$service("users").create(this.user);
          this.getUsers();
        }
        catch (e) {
          if (e.errors[0].message) {
            if (e.errors[0].message == 'email must be unique') {
              this.messageErrorEmail = "Email ya registrado";
            }
          }
        }
      }
    },
  }
}
</script>

<style scoped></style>
