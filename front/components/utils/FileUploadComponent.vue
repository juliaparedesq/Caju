<template>
    <v-hover>
        <v-layout align-center
                  justify-space-around wrap class="fill-height" slot-scope="{ hover }">
            <v-avatar :tile="true" v-if="url" class="size-avatar">
                <v-img class="border-radius" :src="url" alt="avatar" @click="pickFile">
                    <v-expand-transition v-if="!disabled">
                        <div v-if="hover" class="transition-fast-in-fast-out black darken-2 v-card--reveal fill-height">
                            <v-icon dark>photo_camera</v-icon>
                        </div>
                    </v-expand-transition>
                </v-img>
            </v-avatar>
            <v-btn v-else color="primary" large fab dark icon @click="pickFile">
                <v-icon>photo_camera</v-icon>
            </v-btn>
            <input type="file" style="display: none" ref="file"
                   :accept="accept" @change="onFilePicked">
        </v-layout>
    </v-hover>
</template>

<script>
    export default {
        name: 'v-file-upload',
        data: () => ({
            url: '',
            name: '',
            file: null,
            uploadFile: null,
            pickedFile: false,
        }),
        props: {
            accept: String,
            rules: Array,
            errorMessages: Array,
            label: String,
            hint: String,
            disabled: {
                type: Boolean,
                default: false,
            },
            imageURL: {
                type: String,
                default: null,
            },
            filename: {
                type: String,
                default: '',
            }
        },
        created() {
            this.url = this.imageURL;
        },
        watch: {
            filename(val) {
                this.name = val;
            },
            imageURL(val) {
                console.log(val);
                this.url = val;
            }
        },
        methods: {
            pickFile() {
                if(!this.disabled) {
                    this.$refs.file.value = null;
                    this.$refs.file.click();
                }
            },
            onFilePicked(e) {
                const files = e.target.files;
                if (files[0] !== undefined) {
                    if(files[0].size > 4 * 1024 * 1024) {
                        this.$toast('La imagen debe pesar menos de 4Mb');
                        return;
                    }

                    if(!(files[0]['type']==='image/jpeg' || files[0]['type']==='image/png')) {
                        this.$toast('La imagen debe ser jpg o png');
                        return;
                    }

                    this.name = files[0].name;
                    if (this.name.lastIndexOf('.') <= 0) {
                        return;
                    }

                    const fr = new FileReader();
                    fr.readAsDataURL(files[0]);
                    fr.addEventListener('load', () => {
                        this.url = fr.result;
                        this.uploadFile = files[0];
                        this.$emit('input', files[0]);
                        this.$emit('url', this.url);
                    })
                } else {
                    this.name = '';
                    this.url = '';
                    this.uploadFile = null;
                    this.$emit('input', null);
                }
            }
        }
    }
</script>

<style>

    .size-avatar {
        height: 100% !important;
        width: 100% !important;
    }

    .border-radius {
        border-radius: 16px !important;
    }
    .v-card--reveal {
        align-items: center;
        bottom: 0;
        justify-content: center;
        opacity: .5;
        width: 100%;
    }

    .v-card--reveal:hover{
        cursor: pointer;
    }
</style>