import axios from 'axios';

export default class Api {

    static get defaultOptions() {
        return {
            baseUrl: null,
            listUrl: null,
            downloadUrl: null,
            deleteUrl: null,
            uploadUrl: null,
            createFolderUrl: null,
            deleteFolderUrl: null,
            axiosOptions: {}
        };
    }

    constructor(opts) {
        this.options = { ...this.constructor.defaultOptions, ...opts};

        if (this.options.baseUrl) {
            this.options.axiosOptions.baseURL = this.options.baseUrl;
        }

        this.axios = axios.create(this.options.axiosOptions);
    }

    list(path) {
        return this.axios.get(this.options.listUrl, { params: { path: path } });
    }

    upload(data, config) {
        return this.axios.post(this.options.uploadUrl, data, config);
    }

    deleteUrl(file) {
        return this.axios.get(this.options.deleteUrl, { params: { id: file.id } });
    }

    downloadUrl(file) {
        // TODO : proper
        if (this.options.downloadUrl)
            return this.options.downloadUrl+'?path='+file.path;
    }

    createFolder(path) {
        return this.axios.get(this.options.createFolderUrl, { params: { path: path } });
    }

    deleteFolder(path) {
        return this.axios.get(this.options.deleteFolderUrl, { params: { path: path } });
    }

}
