<template>
  <div>
    <v-dialog v-model="dialogDataApi" hide-overlay persistent width="300">
      <v-card color="#1973a5" dark>
        <v-card-text>
          Cargando Datos
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog
      transition="dialog-bottom-transition"
      max-width="600"
      v-model="dialogAviso"
    >
      <v-card>
        <v-toolbar color="#1973a5" dark>¡Aviso Importante!</v-toolbar>
        <v-card-text>
          <div class="text-h4 pa-5">
            ¡El Indicente no se puede editar ó eliminar por que el ticket ya
            esta asignado o se Soluciono!
          </div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="dialogAviso = false">cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      transition="dialog-bottom-transition"
      max-width="600"
      v-model="dialogIncidencia"
    >
      <v-card>
        <v-toolbar color="#1973a5" dark>¡Aviso Importante!, ¡Asi va tu Incidencia!</v-toolbar>
        <v-card-text>
          <div class="text-h4 pa-5">
            <v-card class="mx-auto" max-width="450">
                <v-card-text>
                   <div v-if="this.desserts.length != 0">
                    Solicitante: {{ this.desserts[0].datosPersonal.apePatPer }}
                    {{ this.desserts[0].datosPersonal.apeMatPer }}
                    {{ this.desserts[0].datosPersonal.nomPer }}
                  </div>
                  <p class="text-h5 text--primary" v-if="this.desserts.length != 0">Estado de Incidencia - {{this.desserts[0].datosEstado.descripMaestro}}</p>
                  <p>Detalles:</p>
                  <div v-if="this.desserts.length != 0" class="text--primary">
                    Personal Asignado: {{ this.desserts[0].userReg }}<br />
                    Problema: {{ this.desserts[0].problema }}<br />
                    Clasificación de Solución: {{ this.desserts[0].clasiSolu }}<br />
                    Solucion: {{ this.desserts[0].solucion }}
                  </div>
                </v-card-text>
             </v-card>
          </div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="dialogIncidencia = false">cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card class="mx-auto my-5" max-width="900">
      <v-system-bar color="#1973a5" height="30" dark
        >DATOS DE INCIDENCIA</v-system-bar
      >
      <v-row justify="center">
        <v-col cols="12" md="3">
          <v-text-field
            class="mx-auto mt-8"
            v-model="setDni"
            label="DNI"
            required
            :maxlength="8"
            @keyup.enter="buscar"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="7">
          <v-btn class="mt-10" icon color="#1973a5" @click="buscar">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <v-card class="mx-auto my-5" max-width="900">
      <!--<div v-if="this.desserts.length != 0">-->
      <div>
        <v-data-table
          :headers="headers"
          :items="desserts"
          sort-by="calories"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title v-if="setDatoPersonal != 0"
                >{{
                  "|" +
                  setDatoPersonal[0].apePatPer +
                  " " +
                  setDatoPersonal[0].apeMatPer +
                  " " +
                  setDatoPersonal[0].nomPer
                }}
              </v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="{ on, attrs }">
                  <div>
                    <v-btn
                      color="primary"
                      dark
                      class="mb-2"
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon>mdi-plus</v-icon>
                      Agregar Incidencia
                    </v-btn>
                  </div>
                </template>
                <v-card>
                  <v-form ref="form" v-model="valid" lazy-validation>
                    <v-card-title>
                      <span class="text-h5">{{ formTitle }}</span>
                    </v-card-title>

                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="12" md="12">
                            <v-textarea
                              v-model="editedItem.problema"
                              :rules="[rules.required, rules.counter]"
                              label="Detalle de Problema"
                              :maxlength="maxdat"
                            ></v-textarea>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="close">
                        Cancelar
                      </v-btn>
                      <v-btn
                        v-if="editedIndex === -1"
                        color="blue darken-1"
                        text
                        @click="save"
                      >
                        Guardar
                      </v-btn>
                      <v-btn v-else color="blue darken-1" text @click="editar">
                        Editar
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card>
              </v-dialog>
              <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                  <v-card-title class="text-h5"
                    >Are you sure you want to delete this item?</v-card-title
                  >
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDelete"
                      >Cancelar</v-btn
                    >
                    <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                      >OK</v-btn
                    >
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">
              mdi-pencil
            </v-icon>
            <v-icon small @click="visualItem(item)"> mdi-eye-settings </v-icon>
          </template>
          <!--<template v-slot:no-data>
              <v-btn color="primary" @click="initialize"> Reset </v-btn>
            </template>-->
        </v-data-table>
      </div>
      <!--</div>-->
    </v-card>
  </div>
</template>

<script>
import axios from "axios";
export const RUTA_SERVIDOR = process.env.VUE_APP_RUTA_API;
import VueExcelXlsx from "vue-excel-xlsx";
import Vue from "vue";

Vue.use(VueExcelXlsx);

export default {
  data: () => ({
    valiBoton: 0,
    setDatoPersonal: "",
    setDni: "",
    headers: [
      {
        text: "Número Ticket",
        align: "start",
        sortable: false,
        value: "numTicket",
      },
      { text: "Problema", value: "problema" },
      { text: "Dependencia", value: "datosPersonal.datosDependencia.descDep" },
      { text: "Fecha Registro", value: "fecha_reg" },
      { text: "Estado", value: "datosEstado.descripMaestro" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      problema: "",
    },
    defaultItem: {
      problema: "",
    },
    maxdat: 200,
    dialog: false,
    dialogRespuesta: false,
    dialogDataApi: false,
    dialogAviso: false,
    dialogDelete: false,
    dialogIncidencia: false,
    valid: true,
    rules: {
      required: (value) => !!value || "Campo Obligatorio.",
      counter: (value) => value.length <= 199 || "Max 199 characters",
    },
  }),
  name: "Home",

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Incidente" : "Editar Incidente";
    },
  },
  components: {},

  methods: {
    buscarIncidencia() {
      axios
        .post(RUTA_SERVIDOR + "/api/token/", {
          username: "cnsr",
          password: "123456",
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .get(RUTA_SERVIDOR + "/incidenciaDsi/?search=" + this.setDni, {
              headers: { Authorization: this.auth },
            })
            .then((res) => {
              console.log(this.setDni);
              console.log("data incidencia", res.data);
              this.desserts = res.data;
              this.dialogDataApi = false;
              //this.desserts.length!=0?
              //this.dialogNuevo = true;
              //this.datosPaciente = res.data;
              //console.log("datosPaciente", this.datosPaciente);

              //this.datosPaciente.length != 0
              //? this.datosHistoria()
              //: //: ((this.dialogDataApi = false),
              // (this.aviso = "Datos de paciente no encontrados"),
              //(this.dialogAviso = true);
              //);
              //this.pres()
            })
            .catch((res) => {
              console.warn("Error:", res.data);
              this.dialog = false;
            });
        })
        .catch((response) => {
          response === 404
            ? console.warn("lo sientimos no tenemos servicios")
            : console.warn("Error:", response);
        });
    },

    buscar() {
      if (this.setDni == "") {
        //this.dialogAviso = true;
        console.log("esta vacio el dni");
      } else {
        this.dialogDataApi = true;
        axios
          .post(RUTA_SERVIDOR + "/api/token/", {
            username: "cnsr",
            password: "123456",
          })
          .then((response) => {
            this.auth = "Bearer " + response.data.access;
            axios
              .get(RUTA_SERVIDOR + "/personal/?search=" + this.setDni, {
                headers: { Authorization: this.auth },
              })
              .then((res) => {
                this.setDatoPersonal = res.data;
                console.log("llego", this.setDatoPersonal);
                this.valiBoton = 1;
                this.buscarIncidencia();
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
      }
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      console.log("esto es para guardar", this.editedItem);
      this.$refs.form.validate();
      if (!this.editedItem.problema) {
        this.$refs.form.validate();
        console.log("validate");
      } else {
        axios
          .post(RUTA_SERVIDOR + "/api/token/", {
            username: "cnsr",
            password: "123456",
          })
          .then((response) => {
            this.auth = "Bearer " + response.data.access;
            axios
              .post(
                RUTA_SERVIDOR + "/incidenciaDsi/",
                {
                  personal: this.setDatoPersonal[0].url,
                  problema: this.editedItem.problema,
                  userReg: "cnsr",
                  numTicket:
                    "DSI" +
                    this.setDatoPersonal[0].dniPer +
                    "T" +
                    (parseInt(this.desserts.length) + 1),
                  estado: RUTA_SERVIDOR + "/maestro/1/",
                },
                {
                  headers: { Authorization: this.auth },
                }
              )
              .then((res) => {
                console.log("exito", res.status);
                this.buscarIncidencia();
                this.close();
                //this.datosHistoria();
                //this.exclu();
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
      }
    },

    deleteItemConfirm() {
      console.log("para eliminar una linea");
    },

    deleteItemConfirm() {
      this.desserts.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    visualItem(item) {
        //this.editedIndex = this.desserts.indexOf(item);
        //this.editedItem = Object.assign({}, item);
        //this.dialogDelete = true;
        this.dialogIncidencia = true;
    },

    editItem(item) {
      console.log("Datos de Item", item.datosEstado.descripMaestro);
      if (item.datosEstado.descripMaestro !== "PENDIENTE") {
        console.log("no puede editar");
        this.dialogAviso = true;
      } else {
        this.editedIndex = this.desserts.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialog = true;
        console.log("Datos EditedIndex", this.editedItem);
        console.log("Datos EditedItem", this.editedItem);
      }
    },

    editar() {
      console.log("esto es para editar");
      console.log("editITem",this.editedItem)
      axios
        .post(RUTA_SERVIDOR+"/api/token/", {
          username: "cnsr",
          password: "123456",
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .patch(
              RUTA_SERVIDOR+"/incidenciaDsi/" +
                this.editedItem.url.split("/")[4] +
                "/",
              {
                  personal: this.editedItem.personal,
                  problema: this.editedItem.problema,
                  userReg: this.editedItem.userReg,
                  numTicket: this.editedItem.numTicket,
                  estado: this.editedItem.estado,
              },
              {
                headers: { Authorization: this.auth },
              }
            )
            .then((res) => {
              this.dialogDataApi = true;
              console.log("exito", res.status);
              this.dialog = false;
              this.buscar()
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
  },
};
</script>
 