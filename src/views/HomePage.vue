<template>
  <div>
    <v-toolbar border density="compact" title="Inicio">
      <v-spacer></v-spacer>

      <v-btn icon to="/">
        <v-icon>mdi-export</v-icon>
      </v-btn>
    </v-toolbar>
    <v-container fluid>
      <v-row dense>
        <v-col :cols="numCols">
          <v-text-field v-model="search" rounded="lg" variant="outlined" density="compact"
            prepend-inner-icon="mdi-magnify" placeholder="Buscar..."></v-text-field>
        </v-col>
        <v-col :cols="numCols" style="display:flex; justify-content: end;" :class="isSmallScreen ? 'mb-2' : ''">
          <div v-if="!isSmallScreen">

            <CostumerForm :type="1" @actualizaTabla="muestraSnackBar" />
            <v-btn rounded="lg" flat variant="outlined" color="primary" prepend-icon="mdi-reload" @click="updateTable">
              actualizar tabla
            </v-btn>
          </div>
          <div v-else>
            <CostumerForm :type="1" @actualizaTabla="muestraSnackBar" />
            <v-btn rounded="lg" flat variant="outlined" color="primary" icon="mdi-reload"
              v-tooltip:top="'actualizar tabla'" @click="updateTable" size="small">
            </v-btn>
          </div>
        </v-col>
      </v-row>
      <v-card class="pa-2" rounded="lg" variant="outlined">
        <v-data-table :headers="headers" :items="clientes" :search="search" :loading="loadingData">
          <template v-slot:[`item.nombres`]="{ item }">
            {{ item.nombres + " " + item.apellido_paterno + " " + item.apellido_materno }}
          </template>
          <template v-slot:[`item.acciones`]="{ item }">
            <CostumerForm :type="2" :datos="item" @actualizaTabla="muestraSnackBar" />
            <v-btn icon="mdi-delete" class="ml-1" size="x-small" flat v-tooltip:top="'Eliminar ID: ' + item.id"
              color="pink-darken-4" @click="abrirDialogo(item)"></v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
    <v-snackbar v-model="snackbar" :timeout="2000" :color="colorSnackBar" rounded="lg">
      {{ messageSnackBar }}
    </v-snackbar>

    <ConfirmDialog v-model:showConfirm="changeConfirm" :question="question" @confirm="handleConfirm" />
  </div>
</template>
  
<script>
import axios from 'axios'
import CostumerForm from '../components/CostumerForm.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'

export default {
  name: 'HomePage',
  components: { CostumerForm, ConfirmDialog },
  data() {
    return {
      clientes: [],
      headers: [
        { key: "id", title: "id" },
        { key: "nombres", title: "nombre" },
        { key: "domicilio", title: "domicilio" },
        { key: "correo", title: "correo" },
        { key: "acciones", title: "acciones", sortable: false },
      ],
      loadingData: true,
      snackbar: false,
      changeConfirm: false,
      colorSnackBar: 'success',
      messageSnackBar: '',
      search: '',
      question: '',
      auxCostumer: null,
    }
  },
  async mounted() {
    this.clientes = await this.getCostumers();
  },
  computed: {
    numCols() {
      return ['sm', 'xs'].includes(this.$vuetify.display.name) ? 12 : 6
    },
    isSmallScreen() {
      return ['sm', 'xs'].includes(this.$vuetify.display.name) ? true : false
    }
  },
  methods: {
    muestraSnackBar() {
      this.messageSnackBar = 'Cliente creado con éxito.'
      this.colorSnackBar = 'success'
      this.snackbar = true;
      this.updateTable()
    },
    async updateTable() {
      this.loadingData = true;
      this.clientes = await this.getCostumers();
    },
    getCostumers() {
      const token = 'Bearer ' + localStorage.getItem('token');
      const headers = {
        'Authorization': token,
      }
      return new Promise((res) => {
        axios.get(`${process.env.VUE_APP_API_URL}/costumers`, { headers })
          .then(response => {
            if (response.data.status) {
              res(response.data.datos)
            } else {
              res([])
            }
          })
          .catch(err => {
            alert(err)
          })
          .finally(() => {
            this.loadingData = false;
          })
      })
    },
    closeConfirm() {
      this.showConfirm = false
    },
    abrirDialogo(item) {
      this.question = `¿Realmente deseas eliminar al cliente con folio: ${item.id}?`;
      this.auxCostumer = item;
      this.changeConfirm = true;
    },
    async handleConfirm() {
      const response = await this.deleteCostumer();
      if (response) {
        this.messageSnackBar = 'Cliente eliminado con éxito.'
        this.colorSnackBar = 'success'
        this.snackbar = true;
        this.updateTable();
      } else {
        this.messageSnackBar = 'Ocurrió un error. No se pudo eliminar el registro, intenta más tarde.'
        this.colorSnackBar = 'error'
        this.snackbar = true;
      }
    },
    deleteCostumer() {
      const token = 'Bearer ' + localStorage.getItem('token');
      const headers = {
        'Authorization': token,
      }
      return new Promise((res) => {
        axios.patch(`${process.env.VUE_APP_API_URL}/costumers?id=${this.auxCostumer.id}`,{}, { headers })
          .then(response => {
            if (response.data.status) {
              res(response.data.status)
            } else {
              res([])
            }
          })
          .catch(err => {
            alert(err)
          })
          .finally(() => {
            this.loadingData = false;
          })
      })
    }
  }
}
</script>

<style>
.alinea-encabezado {
  display: flex;
  justify-content: space-between;
  align-items: center
}
</style>