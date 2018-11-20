<template>

    <div class="mm" v-bind:class="{ 'mm-fixed-height': options.height }" v-bind:style="options.height ? 'height:'+options.height : ''">

        <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
            <details-widget
                v-if="showDetails"
                v-bind:file="file"
                ref="details"
                key="details"
            ></details-widget>
        </transition>

        <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
            <delete-widget
                v-if="showDelete"
                v-bind:file="file"
                ref="delete"
                key="delete"
            ></delete-widget>
        </transition>

        <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
            <upload-status-widget
                v-if="showUploadStatus"
                v-bind:uploads="uploads"
                ref="details"
                key="details"
            ></upload-status-widget>
        </transition>

        <div class="panel panel-default">

            <!--<div class="panel-heading">-->
            <!--    <div class="btn-group btn-group-xs">-->
            <!--    <button v-on:click="toggleUpload" class="btn btn-default">-->
            <!--        <i class="fa fa-upload" aria-hidden="true"></i>-->
            <!--    </button>-->
            <!--    <button class="btn btn-default">-->
            <!--        <i class="fa fa-plus-circle" aria-hidden="true"></i>-->
            <!--        <i class="fa fa-folder-open" aria-hidden="true"></i>-->
            <!--    </button>-->
            <!--    </div>-->
            <!--</div>-->

            <div class="panel-body">
                <notification-widget>
                </notification-widget>

                <ol v-if="options.showBreadcrumb" class="breadcrumb">
                    <li v-for="item in breadcrumb">
                        <a v-on:click.prevent="path=item.path" v-html="item.label" href="#"></a>
                    </li>
                </ol>
                <div class="mm-content">

                    <upload-widget
                        v-if="$api.options.uploadUrl"
                        v-bind:path="path"
                        v-show="showUpload"
                        v-on:upload-success="onUploadSuccess"
                        v-on:upload-error="onUploadError"
                        ref="upload"
                        key="upload"
                        class="animated fadeIn"
                    ></upload-widget>

                    <medias-widget
                        v-bind:path="path"
                        v-show="showMedias"
                        ref="medias"
                        key="medias"
                        class="animated fadeIn"
                    ></medias-widget>

                </div>
            </div>

        </div>
    </div>

</template>

<script>
import { mapState } from 'vuex';

import UploadWidget from './UploadWidget.vue';
import UploadStatusWidget from './UploadStatusWidget.vue';
import MediasWidget from './MediasWidget.vue';
import DetailsWidget from './DetailsWidget.vue';
import DeleteWidget from './DeleteWidget.vue';
import NotificationWidget from './NotificationWidget.vue';

export default {
    components: {
        MediasWidget,
        UploadWidget,
        UploadStatusWidget,
        DetailsWidget,
        DeleteWidget,
        NotificationWidget
    },
    data() {
        return {
            path: this.$store.state.options.basePath,
            uploads: [],
            file: {},
            showUpload: true,
            showUploadStatus: false,
            showMedias: true,
            showDetails: false,
            showDelete: false
        };
    },
    computed: {
        ...mapState({
            options: state => state.options,
            basePath: state => state.options.basePath
        }),
        relPath() {
            return this.path.replace(this.basePath, '');
        },
        breadcrumb() {
            let parts = this.relPath.split('/'),
                breadcrumb = [],
                path = '';

            breadcrumb.push({ label: '<i class="fa fa-fw fa-home"></i>', path: this.basePath });
            for (let i=0; i<parts.length; i++) {
                if (parts[i]) {
                    path+= parts[i] + '/';
                    breadcrumb.push({ label: parts[i], path: this.basePath+path.replace(/\/$/, '') });
                }
            }

            return breadcrumb;
        }
    },
    created() {
        this.$root.$mmc = this;
    },
    methods: {

        onUploadSuccess() {
            this.hideUploadStatus();
            this.$refs.medias.refresh();
        },
        onDeleteSuccess() {
            this.showDelete = false;
            this.file = {};
            this.$refs.medias.refresh();
        },
        onUploadError(errors) {
            this.hideUploadStatus();
            this.$refs.medias.refresh();
        },

        onDetailsClose() {
            this.showDetails = false;
            this.file = {};
        },
        onFolderCreatedSuccess() {
            this.$refs.medias.refresh();
        },
        onFolderDeletedSuccess() {
            this.toggleDetailsOff();
            this.toggleDeleteOff();
            this.$refs.medias.refresh();
        },

        deleteFile(file){
            this.$api.deleteUrl(file)
            .then(response => {
                if(response.data.ID === file.id){
                    this.onDeleteSuccess()
                }
            })
            .catch(function (error) {
                // handle error first

                throw error;
            });
            // if(this.$api.deleteUrl(file) === true){
            // }
        },
        createFolder(path) {
            this.$api.createFolder(path)
            .then(response => {
                this.onFolderCreatedSuccess()
            })
            .catch(function (error) {
                // handle error first

                throw error;
            });
        },
        deleteFolder(file) {
            this.$api.deleteFolder(file.path)
            .then(response => {
                this.onFolderDeletedSuccess()
            })
            .catch(function (error) {
                // handle error first

                throw error;
            });

        },
        selectFile(file) {
            this.$store.commit('addSelected', file);
        },
        unselectFile(file) {
            this.$store.commit('removeSelected', file);
        },
        isSelected(file) {
            return this.$store.getters.isSelected(file);
        },

        toggleUploadStatusOn() {
            if (this.hideUploadStatusTimeout)
                window.clearTimeout(this.hideUploadStatusTimeout);
            this.showUploadStatus = true;
        },
        toggleUploadStatusOff() {
            if (this.hideUploadStatusTimeout)
                window.clearTimeout(this.hideUploadStatusTimeout);
            this.showUploadStatus = false;
        },
        hideUploadStatus() {
            this.hideUploadStatusTimeout = window.setTimeout(this.toggleUploadStatusOff, 5000);
        },

        toggleUpload() {
            this.showUpload = !this.showUpload;
            this.showMedias = !this.showUpload;
        },

        toggleDetailsOn(file) {
            this.file = file;
            this.showDetails = true;
        },
        toggleDetailsOff() {
            this.file = {};
            this.showDetails = false;
        },

        toggleDeleteOn(file) {
            this.file = file;
            this.showDetails = false;
            this.showDelete = true;
        },
        toggleDeleteOff() {
            this.file = {};
            this.showDelete = false;
        },

        /**
         * FA icon class helper
         */
        faIconClass(file) {
            let str='fa fa-fw fa-';
            if (file.type=='dir') {
                return str+'folder';
            }
            switch(file.extension) {
                case 'txt' :
                    str+= 'file-text-o';
                    break;
                case 'pdf' :
                    str+= 'file-pdf-o';
                    break;
                case 'zip' :
                    str+= 'file-archive-o';
                    break;
                case 'rar' :
                    str+= 'file-archive-o';
                    break;
                case 'gz' :
                    str+= 'file-archive-o';
                    break;
                case '7z' :
                    str+= 'file-archive-o';
                    break;
                case 'tar' :
                    str+= 'file-archive-o';
                    break;
                case 'mp3' :
                    str+= 'file-audio-o';
                    break;
                case 'wav' :
                    str+= 'file-audio-o';
                    break;
                case 'flac' :
                    str+= 'file-audio-o';
                    break;
                case 'mp4' :
                    str+= 'file-video-o';
                    break;
                case 'mpeg' :
                    str+= 'file-video-o';
                    break;
                case 'avi' :
                    str+= 'file-video-o';
                    break;
                case 'wmv' :
                    str+= 'file-video-o';
                    break;
                case 'ts' :
                    str+= 'file-video-o';
                    break;
                case 'ppt' :
                    str+= 'file-powerpoint-o';
                    break;
                case 'pptx' :
                    str+= 'file-powerpoint-o';
                    break;
                case 'xls' :
                    str+= 'file-excel-o';
                    break;
                case 'xlsx' :
                    str+= 'file-excel-o';
                    break;
                case 'html' :
                    str+= 'file-code-o';
                    break;
                case 'js' :
                    str+= 'file-code-o';
                    break;
                case 'php' :
                    str+= 'file-code-o';
                    break;
                case 'c' :
                    str+= 'file-code-o';
                    break;
                case 'h' :
                    str+= 'file-code-o';
                    break;
                case 'xml' :
                    str+= 'file-code-o';
                    break;
                case 'doc' :
                    str+= 'file-word-o';
                    break;
                case 'docx' :
                    str+= 'file-word-o';
                    break;
                default:
                    str+= 'file-o';
                    break;
            }
            return str;
        }
    }
};
</script>

<style lang="scss">
.mm {
    position: relative;
    .animated {
      animation-duration: 0.4s;
    }
}

.mm-fixed-height {
    > .panel {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: 0;

        > .panel-body {
            position: absolute;
            top: 0; //47px;
            bottom: 0;
            left: 0;
            right: 0;
            overflow: auto;
        }
    }

    .mm-content {
        // position: relative;
        min-height: 250px;
    }
}

</style>
