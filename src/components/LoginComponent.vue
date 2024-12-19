<template>
    <v-container fluid fill-height>
        <v-row align="center" justify="center" style="min-height: 90vh;">
            <v-col cols="12" sm="8" md="4">
                <v-card class="rounded-xl elevation-0" color="blue-grey-lighten-5">
                    <v-card-title>
                        Iniciar sesión
                    </v-card-title>
                    <v-card-subtitle>
                        Ingresa tus credenciales
                    </v-card-subtitle>

                    <!-- Formulario de login -->
                    <v-card-text>
                        <v-form v-model="valid">
                            <div class="text-subtitle-1 text-medium-emphasis">Correo</div>

                            <v-text-field v-model="email" :rules="emailRules" density="compact" outlined class="rounded-lg"
                                placeholder="Ingresa una dirección de correo" prepend-inner-icon="mdi-email-outline"
                                variant="outlined">
                            </v-text-field>

                            <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
                                Contraseña
                                <a class="text-caption text-decoration-none text-blue" href="#" rel="noopener noreferrer"
                                    target="_blank">
                                    ¿Olvidaste tu contraseña?</a>
                            </div>

                            <v-text-field v-model="password" :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                                :rules="passwordRules" :type="!show ? 'text' : 'password'" density="compact" outlined
                                class="rounded-lg" placeholder="Ingresa tu contraseña" prepend-inner-icon="mdi-lock-outline"
                                variant="outlined" @click:append-inner="show = !show"></v-text-field>
                            <v-btn depressed color="primary" rounded="lg" block variant="tonal"
                                @click="submit">Entrar</v-btn>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <v-snackbar v-model="snackbar" :timeout="2000" :color="colorSnackBar" rounded="lg">
            {{ messageSnackBar }}
        </v-snackbar>
    </v-container>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return {
            valid: true,
            email: '',
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
            password: '',
            passwordRules: [
                value => {
                    if (value) return true

                    return 'La contraseña es requerida.'
                },
            ],
            show: true,
            changeConfirm: false,
            colorSnackBar: 'success',
            messageSnackBar: '',
        }
    },
    mounted() {
        localStorage.removeItem('token');
    },
    methods: {
        async submit() {
            if (this.valid) {
                const response = await this.login();
                if (!response) {
                    this.messageSnackBar = 'Credenciales incorrectass.'
                    this.colorSnackBar = 'error'
                    this.snackbar = true;
                } else {
                    this.$router.push('/home')
                }
            } else {
                alert('Formulario no válido');
            }
        },

        login() {
            const params = {
                email: this.email,
                password: this.password
            }

            return new Promise((res) => {
                axios.post(`${process.env.VUE_APP_API_URL}/login`, params)
                    .then((response) => {
                        if (response.data.token) {
                            localStorage.setItem('token', response.data.token);
                            res(true)
                        } else {
                            res(false)
                        }
                    })
                    .catch((err) => {
                        this.messageSnackBar = 'Credenciales incorrectass.'
                        this.colorSnackBar = 'error'
                        this.snackbar = true;
                        console.error(err)
                    })
            })
        }
    }
}
</script>
