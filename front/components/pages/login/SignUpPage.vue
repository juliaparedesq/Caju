<template>
    <v-app id="inspire">
      <v-main class="login">
        <v-container fluid class="d-flex justify-center h-full">
          <v-row align="center" justify="center">
            <v-col xs="12" sm="8" md="6" lg="4">
              <v-card class="elevation-12">
                <v-toolbar color="primary">
                  <span class="white--text">Gestión Equipamiento Clínico</span>
                  <v-spacer/>
                  <v-toolbar-title class="login-title text--white">Login</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                  <div v-if="!isSignUp">
                    <div v-show="isLogin" class="ma-3">
                      
                                  <sign-up ref="signUpForm" @login="doLogin" @login-google="loginWithGoogle"
                      @resetPassword="toRecoveryPasswordForm" :loading="loading"
                      :error="error" @signup="isSignUp = true"/>
                    </div>
                    <div v-show="!isLogin" class="ma-3">
                      <recover-password-form @sendReset="sendReset" @toLogin="toLoginForm" :loading="loading"/>
                    </div>
                  </div>
                  <div v-else>
                    <sign-up @sendReset="sendReset" @toLogin="toLoginForm" :loading="loading"/>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
        <global-toast/>
      </v-main>
    </v-app>
  </template>
  
  <script>
    import LoginForm from "./LoginForm.vue";
    import RecoverPasswordForm from "./RecoverPasswordForm.vue";
    import {setStore} from "../../../services/store.service";
    import SignUp from "./SignUp.vue";
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
            this.$router.push("/app");
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
      }
    }
  </script>
  
  <style scoped>
  
    .login {
      background: #d7e0e5 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='12' viewBox='0 0 20 12'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='charlie-brown' fill='%23d2c6d4' fill-opacity='0.41'%3E%3Cpath d='M9.8 12L0 2.2V.8l10 10 10-10v1.4L10.2 12h-.4zm-4 0L0 6.2V4.8L7.2 12H5.8zm8.4 0L20 6.2V4.8L12.8 12h1.4zM9.8 0l.2.2.2-.2h-.4zm-4 0L10 4.2 14.2 0h-1.4L10 2.8 7.2 0H5.8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }
  
    .login-title {
      text-align: right;
    }
  
    .logo {
      height: 100px;
    }
  
    .h-full {
      height: 100%;
    }
  
  </style>
  