<template>
  <v-app id="inspire" class="full">
    <v-main>
      <v-container fluid class="d-flex justify-center align-center login">
        <v-col xs="12" sm="8" md="6" lg="4" style="height: 100vh !important;">
          <!--                    <v-row style="height: 10vh">-->
          <!--                    </v-row>-->
          <v-row style="height: 10vh"></v-row>
          <v-row class="justify-center align-center d-flex logo">
            <img src="/logo-create.png" alt="Icon" height="64" class="img-white">
            <img src="/logo-ssmo.png" alt="Icon" height="96" class="img-white ml-4">
          </v-row>
          <v-row style="height: 10vh">
          </v-row>
          <v-row class="justify-center align-center d-flex logo">
            <span style="font-weight: lighter; font-size: x-large">Gestión de Equipos Clínicos</span>
          </v-row>
          <v-row class="justify-center align-center d-flex logo">
            <span style="font-weight: lighter; font-size: x-large">Iniciar sesión</span>
          </v-row>
          <v-row v-if="error" class="justify-center align-center d-flex error-message">
            <v-flex sm6>
              <p style="text-align: center" class="red--text mb-4">Puede que tu e-mail o contraseña sean incorrectos</p>
            </v-flex>
          </v-row>
          <v-row  class="justify-center align-center d-flex">
            <login-form
                ref="form"
                @login="doLogin"
                @resetPassword="toRecoveryPasswordForm"
                :loading="loading"
            >
            </login-form>
          </v-row>
          <v-row style="height: 5vh">
          </v-row>
          <v-row style="height: 10vh">
          </v-row>
        </v-col>
        <v-col v-if="$vuetify.breakpoint.name !== 'xs'" xs="0" sm="4" md="6" lg="8" style="height: 100vh;">
          <v-img
              lazy-src="/login_bg.png"
              class="img"
              :max-height="windowSize.y"
              max-width="100%"
              src="/login_bg.png"
          ></v-img>
        </v-col>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
  import LoginForm from "./LoginForm.vue";
  import RecoverPasswordForm from "./RecoverPasswordForm.vue";
  import {setStore} from "../../../services/store.service";
  import SignUp from "./SignUp";
  import GlobalToast from "../../utils/GlobalToast";

  export default {
    components: {GlobalToast, SignUp, RecoverPasswordForm, LoginForm},
    data() {
      return {
        /**
         * Renders login form when true otherwise renders password reset form.
         **/
        isLogin: true,
        isSignUp: false,
        /**
         * Shows spinner when logging in.
         **/
        loading: false,
        error: false,
        languages: [
          {
            id: 1,
            locale: "en",
            flag: "us",
            text: "English"
          },
          {
            id: 2,
            locale: "es",
            flag: "es",
            text: "Español"
          },
          // {
          //   id: 3,
          //   locale: "de",
          //   flag: "de",
          //   text: "Deutsch"
          // }
        ],
        currentLanguage: 'en',
      }
    },
    created() {

    },
    methods: {
      /**
       * Validates if it was given a user and a password, and then authenticates the user/password.
       * @param data Includes user data such as username and password, also if the user wants to remember the login.
       * @public
       */
      async doLogin(data) {
        this.loading = true;
        try {
          let auth = await this.$feathers.authenticate({
            strategy: 'local',
            email: data.user.user,
            password: data.user.pwd
          });
          this.loading = false;
          setStore("user", auth.user);
          this.$router.push("/app/equipments");
        } catch (e) {
          this.loading = false;
          this.error = true;
          console.error(e);
        }
      },
      /**
       * Login user with google user account.
       * @param googleUser google user info when logging in. See https://developers.google.com/identity/sign-in/web/reference#users
       * @public
       */
      loginWithGoogle(googleUser) {
      },
      /**
       * Sends an email for password reset.
       * @public
       */
      sendReset(recoveryEmail) {

      },
      /**
       * Shows the login form.
       * @public
       */
      toLoginForm(d) {
        this.isLogin = true;
        this.isSignUp = false;
        if(d){
          this.doLogin({
            user: {
              user: d.email,
              pwd: d.pwd
            }
          });
        }
      },
      /**
       * Shows the recovery password form.
       * @public
       */
      toRecoveryPasswordForm() {
        this.isLogin = false;
      },
    },
    computed: {
      windowSize() {
        return {x: window.innerWidth, y: window.innerHeight};
      }
    }
  }
</script>

<style scoped>

  .login-title {
    text-align: right;
  }

  .logo {
    height: 100px;
  }

  .img {
    height: 95vh;
  }

  .h-full {
    height: 100%;
  }

</style>
