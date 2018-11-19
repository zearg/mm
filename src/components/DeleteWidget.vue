<template>

    <div class="delete-widget panel-modal">
        <div class="panel panel-default">

            <div class="panel-heading">
                <template v-if="file.type!='dir'">
                    Supprimer le fichier ?
                </template>
                <template v-if="file.type=='dir'">
                    Supprimer le dossier et ses fichiers ?
                </template>
                <button v-on:click="onClose" type="button" class="close" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>

            <div class="delete-widget-content panel-body">
                <table class="table table-bordered">
                    <tbody>
                        <tr>
                            <td rowspan="4" style="text-align: center;">
                                <img v-if="file.thumb" v-bind:src="file.thumb" class="thumb">
                                <div v-else class="icon">
                                    <i v-bind:class="mmc.faIconClass(file)"></i>
                                </div>
                            </td>
                            <th>Nom</th>
                            <td>{{ file.basename }}</td>
                        </tr>
                        <tr>
                            <th>Chemin</th>
                            <td>{{ file.path }}</td>
                        </tr>
                        <tr v-if="file.timestamp">
                            <th>Date</th>
                            <td>{{ file.timestamp }}</td>
                        </tr>
                        <tr v-if="file.size">
                            <th>Poids</th>
                            <td>{{ file.size }}</td>
                        </tr>
                    </tbody>
                </table>
                <p class="buttons">
                    <template v-if="file.type!='dir'">
                        <button v-on:click.prevent="mmc.deleteFile(file)" class="btn btn-primary btn-sm" role="button"><i class="fa fa-trash" aria-hidden="true"></i> Oui</button>
                        <button v-on:click.prevent="mmc.toggleDeleteOff(file)" class="btn btn-primary btn-sm" role="button"><i class="fa fa-trash" aria-hidden="true"></i> Non</button>
                    </template>
                    <template v-if="file.type=='dir'">
                        <button v-on:click.prevent="mmc.deleteFolder(file)" class="btn btn-primary btn-sm" role="button"><i class="fa fa-trash" aria-hidden="true"></i> Oui</button>
                        <button v-on:click.prevent="mmc.toggleDeleteOff(file)" class="btn btn-primary btn-sm" role="button"><i class="fa fa-trash" aria-hidden="true"></i> Non</button>
                    </template>
                </p>
            </div>

        </div>

    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    props: [ 'file' ],
    computed: {
        ...mapState({
            options: state => state.options
        }),
        mmc() {
            return this.$root.$mmc;
        }
    },
    methods: {
        onClose() {
            this.mmc.toggleDeleteOff();
        }
    }
};
</script>

<style lang="scss">
.delete-widget-content {
    .thumb {
        max-height: 100px;
    }
    .icon {
        line-height: 100px;
        font-size: 50px;
    }
    .buttons {
        text-align: right;
    }
}
</style>
