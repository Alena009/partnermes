function getZleceniaGridToolBar(parentObj, userCanWrite) {
    var toolBarStruct;
    if (userCanWrite) {        
        toolBarStruct =  {
                    iconset: "awesome",
                    items: [
                        {id: "Print",text: _("Wydrukować"), type: "button", img: "fa fa-print"},                                                                                       
                        {id: "DontProduct",text: _("Nie produkować"), type: "button", img: "fa fa-times"},                                                                                       
                        {id: "Close",  type: "button", text: _("Zamknij zlecenie"), img: "fa fa-minus-square"},
                        {id: "sep3",     type: "separator"},
                        {id: "Redo", type: "button", text: _("Odśwież"),img: "fa fa-refresh"}
                    ]
                }    
    } else {
        toolBarStruct = emptyToolbar;        
    }
    
    return parentObj.attachToolbar(toolBarStruct);
}
