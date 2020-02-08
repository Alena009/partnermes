function getTasksGridToolBar(parentObj, userCanWrite) {
    var toolBarStruct;
    if (userCanWrite) {
        toolBarStruct = {
                iconset: "awesome",
                items: [
                        {id: "AddToGroup",  type: "button", text: _("Dodaj do grupy"), img: "fa fa-plus-square "},
                        {id: "AddToProduct",  type: "button", text: _("Dodaj do produktu"), img: "fa fa-plus-square "},
                        {id: "Edit", type: "button", text: _("Edytuj"), img: "fa fa-edit"},
                        {id: "Del",  type: "button", text: _("Usuń"), img: "fa fa-minus-square"},                        
                        {type: "separator", id: "sep3"},
                        {id: "Redo", type: "button",text: _("Odśwież"), img: "fa fa-refresh"}
                ]                    
        };
    } else {
        toolBarStruct = emptyToolbar;        
    }
    
    return parentObj.attachToolbar(toolBarStruct);
}
