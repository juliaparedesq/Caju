<template>
  <v-form ref="loginForm" @keyup.native.enter="login">
    <v-row v-if="error">
      <v-col>
        <v-alert type="error">Email o Contraseña incorrectos</v-alert>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="pa-0 pl-3 pr-3 ma-0">
        <v-text-field append-icon="mdi-account-circle" :label="'Email'" name="username"
                      v-model="user.user" :rules="[validations.required(), validations.email()]"/>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="pa-0 pl-3 pr-3 ma-0">
        <v-text-field append-icon="mdi-lock" :label="'Contraseña'" name="current-password"
                      type="password" v-model="user.pwd" :rules="[validations.required()]"/>
      </v-col>
    </v-row>
    <v-row>
      <!--<v-col class="pa-0 pl-3 pr-3 ma-0">
        <v-checkbox class="ma-0 pa-0" color="primary" v-model="rememberUser" :label="$t('Remember Me')"></v-checkbox>
      </v-col>-->
      <v-col class="d-flex justify-end">
        <v-btn text small color="primary" @click="toRecoveryPassword">¿Olvidaste tu contraseña?</v-btn>
      </v-col>
    </v-row>
<!--    <v-row>-->
<!--      <v-col class="pa-0 pl-3 pr-3 pt-3 d-flex justify-center" sm="8" offset-sm="2">-->
<!--        <vue-recaptcha ref="captcha" :sitekey="recaptchaToken" loadRecaptchaScript @verify="verifyCaptcha"-->
<!--                       :loadRecaptchaScript="true" :language="'es'"-->
<!--                       @expired="revokeResponse" @error="revokeResponse"/>-->
<!--      </v-col>-->

<!--    </v-row>-->
    <v-row>
      <v-col class="pa-0 pl-3 pr-3 pt-3 d-flex justify-center" sm="8" offset-sm="2">
        <v-btn color="primary" rounded block :loading="loading" dark @keyup.native.enter="login" @click="login">
          Iniciar Sesión
        </v-btn>
      </v-col>
    </v-row>

  </v-form>
</template>

<script>
  import validations from "../../../services/validation.service"

  export default {
    name: "LoginForm",
    props: {
      /**
       * Shows spinner when logging in
       * @values true, false
       */
      loading: {
        type: Boolean,
        default: false,
      },
      error: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        /**
         * Validation Object. It has all the validation functions needed to validate inputs.
         **/
        validations: validations,
        /**
         * User object. Has username and password as key. Used for logging in.
         **/
        user: {
          user: "",
          pwd: ""
        },
        /**
         * Remember user and password for login.
         **/
        rememberUser: false,
        /**
         * Captcha response, if it is not null it means that the login is correct.
         **/
        captchaResponse: null,
      }
    },
    methods: {
      /**
       * Resets login form validations.
       * @public
       **/
      resetLoginValidation() {
        this.$refs.loginForm.resetValidation();
      },
      /**
       * Recover Password
       * @public
       **/
      toRecoveryPassword() {
        this.$emit("resetPassword");
      },
      /**
       * Does login.
       * @public
       **/
      login() {
        /** Validates login form **/
        if(this.$refs.loginForm.validate()) {
          this.$emit("login", {user: this.user, rememberMe: this.rememberMe , response: this.captchaResponse})
        }
      },
      /**
       * Sign in with google, for more information see https://developers.google.com/identity/sign-in/web/reference#users
       * @public
       **/
      signInWithGoogle () {
        this.$emit("login-google");
      },
      /**
       * When signing in throws the error occurred.
       * @param error contains any error occurred.
       * @public
       **/
      onSignInError (error) {
        console.log(error);
      },
      /**
       * Redirect to sign up page.
       * @public
       */
      signUp() {
        this.$emit("signup", true);
      },
      /**
       * Already verified, saves the response of the library.
       * @param response Response Object
       * @public
       */
      verifyCaptcha(response){
        this.captchaResponse = response;
      },
      /**
       * Revokes the captcha response.
       * @public
       */
      revokeResponse(){
        this.captchaResponse = null;
        //this.$toast.error(this.$t("reCAPTCHARevoked"));
      },
      /**
       * Resets the captcha response.
       * @public
       */
      resetCaptcha(){
        this.$refs.captcha.reset();
        this.captchaResponse = null;
        //this.$toast.error(this.$t("reCAPTCHARevoked"));
      }
    }
  }
</script>

<style scoped>
  .google-sign-in-text {
    color: #757575;
    font-size: .875rem;
    font-weight: 400;
    line-height: 1.375rem;
    letter-spacing: .0071428571em;
    font-family: Roboto,sans-serif;
    text-transform: none;
  }
</style>
