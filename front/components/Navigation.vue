<template>
  <v-app id="inspire">
    <v-app-bar dense color="accent" app fixed elevation="0">
      <v-toolbar-title class="ml-0">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </v-toolbar-title>
      <v-spacer/>

      <!-- <v-icon color="white" v-if="!darkMode">mdi-white-balance-sunny</v-icon>
      <v-icon color="white" v-else>mdi-weather-night</v-icon>
      <v-switch class="ml-2" inset v-model="darkMode" color="white" @change="toggleDarkMode" hide-details /> -->

      <v-avatar size="36" color="primary">
        <v-img v-if="user && user.profilePicture" :src="user.profilePicture"
               alt="Profile picture"></v-img>
        <v-skeleton-loader v-else-if="loading" type="avatar" class="mx-auto"></v-skeleton-loader>
        <span class="white--text" v-else-if="user">{{ user.name.getInitials() }}</span>
      </v-avatar>
      <span v-if="$vuetify.breakpoint.mdAndUp" class="pl-3">{{user ? (user.name ? user.name : user.email): ''}}</span>
      <v-btn :loading="loading" class="mx-2" icon small @click="logout">
        <v-icon>mdi-logout-variant</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer transition="slide-x-transition" left mini-variant-width="100" width="240px"
                         v-model="drawer" app color="primary" class="cnav pt-10">
      <v-list>
        <v-list-item v-for="(item, index) in rolesItems"
                     :key="item.text" @click="selectTab(index,item.route)"
                     :class="{'secondary rounded-l-pill ml-2': selectedTab == index}">
          <v-list-item-avatar>
            <v-icon :color="selectedTab == index ? 'primary' : 'white'">{{item.icon}}</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <span class="navigation-text" :class="{'primary--text': selectedTab == index}">{{ item.text }}</span>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <v-container fluid class="min-height-100">
        <router-view class="mb-10"></router-view>
      </v-container>
      <global-toast/>
    </v-main>
  </v-app>
</template>

<script>
  import validations from "../services/validation.service";
  import {getStore} from "../services/store.service";
  import GlobalToast from "./utils/GlobalToast";

  String.prototype.getInitials = function(glue){
    if (typeof glue == "undefined") {
      glue = true;
    }

    const initials = this.replace(/[^a-zA-Z- ]/g, "").match(/\b\w/g);

    if (glue) {
      return initials.join('');
    }

    return  initials;
  };

  export default {
    components: {GlobalToast},
    data() {
      return {
        validations: validations,
        /**
         *  Number that represents the current view selected.
         */
        selectedTab: 0,
        /**
         *  Used when loading the role of the user.
         */
        loading: false,
        /**
         * Knows when a user is already logged in.
         **/
        loggedIn: false,
        /**
         * Navigation pages.
         *
         * Each page needs an icon, a route, a description and also which roles can access that component.
         **/
        items: [
          {icon: 'mdi-account-circle', text: 'Usuarios', route: "/app/users", roleRestrict: ["admin"]},
          {icon: 'mdi-washing-machine', text: 'Equipos', route: "/app/equipments", roleRestrict: ["admin", "manager", "visitor"]},
          {icon: 'mdi-account-cog', text: 'Proveedores', route: "/app/providers", roleRestrict: ["admin", "manager", "visitor"]},
          {icon: 'mdi-file-cog', text: 'Convenios', route: "/app/agreements", roleRestrict: ["admin", "manager", "visitor"]},
          {icon: 'mdi-chart-box', text: 'Indicadores', route: "/app/indicators", roleRestrict: ["admin", "manager", "visitor"]},
          // {icon: 'mdi-account', text: 'Perfil', route: "/app/profile", roleRestrict: ["admin", "manager"]},
        ],
        /**
         * Used to hide and show the navigation drawer.
         **/
        drawer:  false,
        darkMode: false,
        dic_tab: {
          "/app/users" : 0,
          "/app/equipments" : 1,
          "/app/providers" : 2,
          "/app/agreements" : 3,
          "app/indicators" : 4,
        }
      }
    },
    mounted() {
      if (this.$vuetify.breakpoint.mdAndUp){ //true con pantalla grande
        this.drawer = true;
      }
      this.selectedTab = this.dic_tab[this.$router.history._startLocation];
    },
    created() {
      // this.$vuetify.theme.dark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      // this.darkMode = this.$vuetify.theme.dark;
    },
    methods: {
      /**
       *
       * Changes rendered route
       * @param i Index on routes array
       * @param route text of the route
       * @public
       *
       */
      selectTab(i, route) {
        if (route === '/logout') {
          this.logout();
          return;
        }
        this.selectedTab = i;
        this.$router.push(route).catch(console.error);
      },
      /**
       *
       * Restricts view depending on the role of the user.
       * @param rolesAllowed List of roles allowed on a route
       * @returns {boolean} returns true if the user has permission to access this view.
       * @public
       */
      restrictViews(rolesAllowed) {
        if (this.user.role) {
          return rolesAllowed.filter(e => e === this.user.role).length > 0;
        }
        return false;
      },
      /**
       * Logout from app.
       * @public
       */
      async logout() {
        await this.$feathers.logout();
        this.$router.push('/login');
      },
      toggleDarkMode(){
        this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      }
    },
    computed: {
      user: getStore("user"),
      rolesItems(){
        return this.items.filter(item => this.restrictViews(item.roleRestrict));
      }
    }
  }
</script>

<style>

  .navigation-text {
    font-weight: bold;
    color: white;
    line-height: 26px;
  }

  .min-height-100{
    min-height: 100%;
    background-color: #F5F6FA;
  }

  .footer-app {
    width: 100%;
    display: flex;
    justify-content: center;
    position: absolute;
    bottom: 10px;
  }

  .footer-text {
    font-size: xx-small;
    font-weight: 500;
  }

  .color-primary {
    color: var(--v-primary-base);
  }
  .message-content {
    width: 100%;
  }

  .cnav .v-navigation-drawer__border {
    background-color: transparent !important;
  }

</style>
