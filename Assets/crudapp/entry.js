window.SetPasswordControl = require("./components/SetPasswordControl");
window.DateRangeControl  = require("./components/DateRangeControl");
window.SingleDayControl  = require("./components/SingleDayControl");
window.CRUDCreateButton  = require("./components/CRUDCreateButton");
window.CRUDListEditor    = require("./components/CRUDListEditor");
window.CRUDHasManyEditor = require("./components/CRUDHasManyEditor");
window.CRUDRelModal      = require("./CRUDRelModal");
window.TableViewBuilder = require("./viewbuilder/TableViewBuilder");

$(function() {
    console.log('from crudapp');

    const buttons = document.querySelectorAll('.crudapp-create-button');

    for (let el of buttons) {
        console.log(el, el.dataset);
        const btn = React.createElement(CRUDCreateButton, el.dataset);
        ReactDOM.render(btn, el);
    }
});

