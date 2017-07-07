
class CRUDUrl {
    static regionCreate(prefix, crudId) {
        return `${prefix}/${crudId}/crud/create`;
    }

    static regionEdit(prefix, crudId) {
        return `${prefix}/${crudId}/crud/edit`;
    }
}

export default class CRUDModals {
    static defaultOptions = {
        "size": "large",
        "side": false,
        "closeOnSuccess": true,
    };

    static create(crudId, title, args, options = null) {
        const deferred = $.Deferred();
        if (!options) {
            options = this.defaultOptions;
        }
        options.success = (ui, resp) => {
            deferred.resolve(ui, resp);
        };

        CRUDRelModal.open(
            title,
            CRUDUrl.regionCreate("/bs", crudId),
            args,
            options);

        return deferred;
    }

    static edit(crudId, title, args, options = null)
    {
        const deferred = $.Deferred();
        if (!options) {
            options = this.defaultOptions;
        }
        options.success = (ui, resp) => {
            deferred.resolve(ui, resp);
        };

        CRUDRelModal.open(
            title,
            CRUDUrl.regionEdit("/bs", crudId),
            args,
            options);

        return deferred;
    }
}
