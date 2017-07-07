
export default class CRUDUrl {

    static regionCreate(prefix, crudId) {
        return `${prefix}/${crudId}/crud/create`;
    }

    static regionEdit(prefix, crudId) {
        return `${prefix}/${crudId}/crud/edit`;
    }

    static regionDelete(prefix, crudId) {
        return `${prefix}/${crudId}/crud/delete`;
    }
}
