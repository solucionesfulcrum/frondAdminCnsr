<template>
  <v-app>
    <v-app-bar
      app
      color="#1973a5"
      dark
    >
      <v-toolbar-title>Centro Nacional de Salud Renal - EsSalud</v-toolbar-title>


      <v-spacer></v-spacer>

      <v-spacer></v-spacer>
      Home
      <v-btn 
      icon
      @click="actionPrincipal"
      >
        <v-icon>mdi-home</v-icon>
      </v-btn>
      Cerrar
      <v-dialog
      v-model="dialog"
      persistent
      max-width="290"
      >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          dark
          v-bind="attrs"
          v-on="on"
          icon
        >
          <v-icon dark left>mdi-logout</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="text-h5">
          ¿Cerrar la sesión?
        </v-card-title>
        <v-card-text>Ud. esta apunto de salir del sistema</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            :dialog=dialog
            @click="actionOut"
          >
            Aceptar
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="dialog = false"
          >
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
     dialog: false,
  }),
  methods: {
       actionOut(){
         //localStorage.removeItem('keyValue')
         this.dialog=false
         window.close()
         //this.$router.push('/')
       },
       actionPrincipal(){
         //this.$router.push('/go')
       }
    },
};
</script>
