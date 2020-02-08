function getProductsGroupsToolBar(parentObj, userCanWrite) {
    var toolBarStruct;
    if (userCanWrite) {        
        toolBarStruct =  {
                    iconset: "awesome",
                    items: [                           
                            {id: "Add",  type: "button", text: _("Dodaj"),  img: "fa fa-plus-square "},
                            {id: "Edit", type: "button", text: _("Edytuj"), img: "fa fa-edit"},
                            {id: "Del",  type: "button", text: _("Usuń"),   img: "fa fa-minus-square"},                            
                            {type: "separator",   id: "sep4"}, 
                            {id: "Tasks",     text: _("Zadania"),    type: "button", img: "fa fa-file-text-o "},                            
                            {type: "separator",   id: "sep2"},                           
                            {id: "Redo", type: "button", text: _("Odśwież"),img: "fa fa-refresh"}
                    ]                    
            }   
    } else {
        toolBarStruct = emptyToolbar;        
    }
    
    return parentObj.attachToolbar(toolBarStruct);
}
