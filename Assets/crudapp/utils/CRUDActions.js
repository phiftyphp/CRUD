
export default class CRUDActions {

    constructor(namespace, model)
    {
        this.namespace = namespace;
        this.model = model;
    }


    buildActionSignature(prefix) {
        return `${this.namespace}::Action::${prefix}${this.model}`;
    }

    delete(args) {
        const sig = this.buildActionSignature("Delete");
        return this.run(sig, args);
    }

    update(args) {
        const sig = this.buildActionSignature("Update");
        return this.run(sig, args);
    }

    create(args) {
        const sig = this.buildActionSignature("Create");
        return this.run(sig, args);
    }

    sort(entries, keyAccessor) {
        const dfd = $.Deferred();
        const keys = entries.map(keyAccessor);
        const call = this.buildCall("Sort");
        return call({ "keys": keys });
    }

    buildCall(prefix) {
        const sig = this.buildActionSignature(prefix);
        return (args) => this.run(sig, args);
    }

    run(sig, args) {
        const deferred = jQuery.Deferred();
        runAction(sig, args, (resp) => {
            deferred.resolve(resp);
        });
        return deferred;
    }
}
