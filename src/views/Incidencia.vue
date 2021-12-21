<template>
  <v-card>
    <v-navigation-drawer v-model="drawer" :mini-variant.sync="mini" permanent>
      <v-list-item class="px-2">
        <v-list-item-avatar>
          <v-img src="https://randomuser.me/api/portraits/men/85.jpg"></v-img>
        </v-list-item-avatar>

        <v-list-item-title>John Leider</v-list-item-title>

        <v-btn icon @click.stop="mini = !mini">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item v-for="item in items" :key="item.title" link>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-card class="mx-auto">
        <v-container>
          <v-row dense>
            <v-col v-for="(item, i) in dataIncidiencia" :key="i" cols="12">
              <v-card :color="'#1973a5'" dark>
                <div class="d-flex flex-no-wrap justify-space-between">
                  <div>
                    <v-card-title
                      class="text-h5"
                      v-text="
                        item.datosPersonal.apePatPer +
                        ' ' +
                        item.datosPersonal.apeMatPer +
                        ' ' +
                        item.datosPersonal.nomPer
                      "
                    ></v-card-title>

                    <v-card-title
                      class="text-h5"
                      v-text="item.datosPersonal.datosDependencia.descDep"
                    ></v-card-title>

                    <v-card-actions>
                      <v-btn
                        class="ml-2 mt-20"
                        fab
                        icon
                        height="25px"
                        right
                        width="250px"
                        @click="atenderIncidencia"
                      >
                        <v-icon>mdi-play</v-icon>Atender esta incidencia
                      </v-btn>
                    </v-card-actions>
                  </div>

                  <v-avatar class="ma-3" size="125" tile>
                    <v-img :src="item.src"></v-img>
                  </v-avatar>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-navigation-drawer>
  </v-card>
</template>

<script>
import axios from "axios";
export const RUTA_SERVIDOR = process.env.VUE_APP_RUTA_API;

export default {
  data: () => ({
    drawer: true,
    items: [
      { title: "Home", icon: "mdi-home-city" },
      { title: "My Account", icon: "mdi-account" },
      { title: "Users", icon: "mdi-account-group-outline" },
    ],
    mini: true,
    dataIncidiencia: [],
    time: "",
  }),
  name: "Incidencia",

  computed: {},
  components: {},

  created() {
    //this.actionBoton='pres'
    //this.usuario = localStorage.getItem("usuario");
    //console.log("usuario", this.usuario);
    //this.dialogDataApi = true;
    this.IndicenciaDat();
  },

  methods: {
    actualizar() {
      location.reload(true);
    },
    IndicenciaDat() {
      axios
        .post(RUTA_SERVIDOR + "/api/token/", {
          username: "cnsr",
          password: "123456",
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .get(RUTA_SERVIDOR + "/incidenciaDsi/", {
              headers: { Authorization: this.auth },
            })
            .then((res) => {
              console.log("data de incidencias", res.data);
              this.dataIncidiencia = res.data;
              this.time = setTimeout("document.location.reload(true)", 10000);
              //if (!this.dataIncidiencia==0){
              //  this.sonido()
              //}
            })
            .catch((res) => {
              console.warn("Error:", res);
              this.dialog = false;
            });
        })
        .catch((response) => {
          response === 404
            ? console.warn("lo sientimos no tenemos servicios")
            : console.warn("Error:", response);
        });
    },
    atenderIncidencia() {
      clearTimeout(this.time);
    },
    sonido() {
      const music = new Audio(require("./../assets/sonidos/musica.mp3"));
      music.play();
    },
  },
};
</script>
 