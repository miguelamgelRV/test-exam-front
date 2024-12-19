<template>
    <v-dialog v-model="localDialog" max-width="700">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn v-if="type === 1" class="mr-1" rounded="lg" flat color="primary" prepend-icon="mdi-plus"
                v-bind="activatorProps">
                agregar cliente
            </v-btn>
            <v-btn v-else icon="mdi-pencil" size="x-small" flat v-tooltip:top="'Editar ID: ' + datos.id"
                color="indigo-accent-4" v-bind="activatorProps"></v-btn>
        </template>

        <v-card rounded="xl" prepend-icon="mdi-account" :title="type == 1 ? 'Registro de cliente' : 'Editando cliente'">
            <v-card-text>
                <v-form v-model="valid">
                    <v-row dense>
                        <v-col cols="12">
                            <label class="text-overline">Nombre(s)</label>
                            <v-text-field v-model="nombre" variant="outlined" prepend-inner-icon="mdi-account"
                                density="compact" :rules="textFieldRules" rounded="lg" required></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <label class="text-overline">Apellido paterno</label>
                            <v-text-field v-model="apellidoPaterno" variant="outlined" prepend-inner-icon="mdi-account"
                                density="compact" :rules="textFieldRules" rounded="lg" required></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <label class="text-overline">Apellido materno</label>
                            <v-text-field v-model="apellidoMaterno" variant="outlined" prepend-inner-icon="mdi-account"
                                density="compact" :rules="textFieldRules" rounded="lg" required></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <label class="text-overline">Domicilio</label>
                            <v-text-field v-model="domicilio" variant="outlined" prepend-inner-icon="mdi-home-account"
                                placeholder="Ingrese calle y número" density="compact" :rules="textFieldRules" rounded="lg"
                                required></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <label class="text-overline">Correo</label>
                            <v-text-field v-model="correo" variant="outlined" prepend-inner-icon="mdi-at" density="compact"
                                :rules="emailRules" rounded="lg" required></v-text-field>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions class="pa-0">
                <v-btn color="primary" size="x-large" block text="Guardar" @click="submit" variant="text"></v-btn>
            </v-card-actions>
        </v-card>

        <v-snackbar v-model="snackbar" :timeout="2000" :color="colorSnackBar" rounded="lg">
            {{ messageSnackBar }}
        </v-snackbar>
    </v-dialog>
</template>

<script>
import axios from 'axios'
export default {
    props: ['dialog', 'datos', 'type'],
    data: () => ({
        valid: true,
        snackbar: false,
        localDialog: false,
        colorSnackBar: 'success',
        messageSnackBar: '',
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        domicilio: '',
        emailRules: [
            value => {
                if (value) return true

                return 'El correo es requerido.'
            },
            value => {
                if (/.+@.+\..+/.test(value)) return true

                return 'Ingresa una dirección valida.'
            },
        ],
        textFieldRules: [
            value => {
                if (value) return true

                return 'Este campo es requerido.'
            },
        ],
    }),
    mounted() {
        this.localDialog = this.dialog;
        if (this.type === 2) {
            this.nombre = this.datos.nombres;
            this.apellidoPaterno = this.datos.apellido_paterno;
            this.apellidoMaterno = this.datos.apellido_materno;
            this.domicilio = this.datos.domicilio;
            this.correo = this.datos.correo;
        }
    },
    methods: {
        async submit() {
            if (this.valid) {
                const response = await this.saveCostumer()
                if (response.id) {
                    this.localDialog = false;
                    this.cleanner();
                    this.$emit('actualizaTabla');
                } else {
                    this.messageSnackBar = 'Ocurrió un error. No se pudo crear el cliente, intenta más tarde.'
                    this.colorSnackBar = 'error'
                    this.snackbar = true;
                }
            }
        },
        saveCostumer() {
            const params = {
                nombres: this.nombre,
                apellido_paterno: this.apellidoPaterno,
                apellido_materno: this.apellidoMaterno,
                domicilio: this.domicilio,
                correo: this.correo
            }
            const headers = {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            }

            return new Promise((res, rej) => {
                axios.post(`${process.env.VUE_APP_API_URL}/costumers`, params, { headers })
                    .then(response => {
                        if (response.data.status) {
                            res(response.data.datos)
                        } else {
                            res(null);
                        }
                    })
                    .catch(err => {
                        alert(err);
                        rej(err)
                    })
            })
        },
        cleanner() {
            this.nombre = "";
            this.apellidoPaterno = "";
            this.apellidoMaterno = "";
            this.domicilio = "";
            this.correo = "";
        }
    }
}
</script>