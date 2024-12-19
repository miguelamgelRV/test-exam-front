<template>
    <v-dialog v-model="localShowConfirm" max-width="300" persistent>
        <v-card rounded="lg">
            <v-card-text class="px-4 py-6">
                <p class="text-center font-weight-bold cyan-darken-4--text">
                    {{ question }}
                </p>
            </v-card-text>
            <v-card-actions>
                <v-row dense>
                    <v-col cols="6"><v-btn block rounded="lg" color="primary" variant="outlined"
                            @click="cancel">Cancelar</v-btn></v-col>
                    <v-col cols="6"><v-btn block rounded="lg" color="primary" variant="flat"
                            @click="confirm">Confirmar</v-btn></v-col>
                </v-row>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: ['showConfirm', 'question'],
    data() {
        return {
            localShowConfirm: false,
        };
    },
    watch: {

        showConfirm(newValue) {
            this.localShowConfirm = newValue;
        },
    },
    methods: {
        cancel() {
            this.localShowConfirm = false;
            this.$emit('update:showConfirm', false);
        },
        confirm() {
            this.localShowConfirm = false;
            this.$emit('update:showConfirm', false);
            this.$emit('confirm');
        },
    },
};
</script>
