<template>
<div>
  <v-card class="mx-auto my-5" max-width="900">
        <v-system-bar color="#1973a5" height="30" dark>DATOS DE INCIDENCIA</v-system-bar>
        <v-row justify="center">
          <v-col cols="12" md="3">
            <v-text-field
              class="mx-auto mt-8"
              v-model="setDni"
              label="DNI"
              required
              :maxlength="8"
              @keyup.enter="buscarPersonal"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="7">
            <v-btn class="mt-10" icon color="#1973a5" @click="buscarPersonal">
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
                <v-toolbar-title
                  >Histórico de movimiento de Historias Clínicas
                </v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="500px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="primary"
                      dark
                      class="mb-2"
                      v-bind="attrs"
                      v-on="on"
                    >
                      Agregar Historia
                    </v-btn>
                  </template>
                  <v-card>
                    <v-form ref="form" v-model="valid" lazy-validation>
                      <v-card-title>
                        <span class="text-h5">{{ formTitle }}</span>
                      </v-card-title>

                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field
                                v-model="editedItem.numHisCli"
                                :rules="[rules.required, rules.counter]"
                                label="Número de Historia"
                                :maxlength="maxdat"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field
                                v-model="editedItem.numBalda"
                                :rules="[rules.required, rules.counter]"
                                label="Número de Balda"
                                :maxlength="maxdat"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="close">
                          Cancelar
                        </v-btn>
                        <v-btn v-if="editedIndex === -1 " color="blue darken-1" text @click="save">
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
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="deleteItemConfirm"
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
              <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
            </template>
            <!--<template v-slot:no-data>
              <v-btn color="primary" @click="initialize"> Reset </v-btn>
            </template>-->
          </v-data-table>
        </div>
      </v-card>
  </div>
</template>

<script>
  import axios from "axios";
  export const RUTA_SERVIDOR = process.env.VUE_APP_RUTA_API;

  export default {
    data:()=>({
      setDni: "",
       headers: [
      {
        text: "Número de Historia",
        align: "start",
        sortable: false,
        value: "numHisCli",
      },
      { text: "Número de Balda", value: "numBalda" },
      { text: "Estado", value: "estado" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      numHisCli: "",
      numBalda: "",
      estado: "",
    },
    defaultItem: {
      numHisCli: "",
      numBalda: "",
      estado: "",
    },
    maxdat: 21,
    dialog: false,
    dialogRespuesta: false,
    dialogDataApi: false,
    dialogAviso: false,
    valid: true,
    rules: {
      required: (value) => !!value || "Campo Obligatorio.",
      counter: (value) => value.length <= 20 || "Max 20 characters",
    },
    }),
    name: 'Home',

    computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo registro" : "Editar Registro";
    },
  },
    components: {
      
    },

    methods: {
       buscarPersonal(){
         axios
          .post(RUTA_SERVIDOR + "/api/token/", {
            username: "cnsr",
            password: "123456",
          })
          .then((response) => {
            this.auth = "Bearer " + response.data.access;
            axios
              .get(RUTA_SERVIDOR + "/incidenciaDsi/?search=" +this.setDni, {
                headers: { Authorization: this.auth },
              })
              .then((res) => {
                console.log(this.setDni)
                console.log(res.data)
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
    }
  }
</script>
