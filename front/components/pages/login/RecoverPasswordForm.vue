<template>
  <v-form ref="resetPass">
    <v-row>
      <v-col class="pa-0 pl-3 pr-3 ma-0">
      </v-col>
    </v-row>
    <v-row>
      <v-col class="pa-0 pl-3 pr-3 mb-3">
        <v-text-field append-icon="mdi-account-card-details" :label="'Email'"
                      v-model="recoveryMail" :rules="[validations.required(), validations.email()]"/>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="pa-0 pl-3 pr-3 ma-0 d-flex justify-start" sm="6">
        <v-btn text small color="primary" @click="toLogin">Volver al Login</v-btn>
      </v-col>
      <v-col class="pa-0 pl-3 pr-3 ma-0 d-flex justify-end" sm="6">
        <v-btn color="primary" rounded :loading="loading" dark @click="sendReset">
          Recuperar Contraseña
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
  import validations from "../../../services/validation.service"
  export default {
    name: "RecoverPasswordForm",
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
        recoveryMail: "",
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
      sendReset(){
        /** Validates login form **/
        if(this.$refs.resetPass.validate()) {
          this.$emit("sendReset", this.recoveryMail);
        }
      },
      /**
       * Sends to login.
       * @public
       **/
      toLogin(){
        this.$emit("toLogin");
      }
    }
  }
</script>

<style scoped>

</style>
