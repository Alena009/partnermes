var clientsGrid;
var clientsLayout;
var clientsForm;

function clientsInit(cell) {
    if (clientsLayout == null) {
                var userData = JSON.parse(localStorage.getItem("userData")); 
                var write;
                userData.permissions.forEach(function(elem){
                    if (elem.name == 'clients') {
                        write = elem.pivot.value;
                    }
                });
                var clientsLayout = cell.attachLayout("2U");
                    clientsLayout.cells("a").setText(_("Klienci"));
                    clientsLayout.cells("b").setText(_("Informacja"));
                    clientsLayout.cells("b").setWidth(280);
                    
                if (write) {
                    clientsGridToolBar = clientsLayout.cells("a").attachToolbar({
                            iconset: "awesome",
                            items: [
                                    {id: "Add",  type: "button", text: _("Dodaj"), img: "fa fa-plus-square "},
                                    {id: "Edit", type: "button", text: _("Edytuj"), img: "fa fa-edit"},
                                    {id: "Del",  type: "button", text: _("Usuń"), img: "fa fa-minus-square"},
                                    {type: "separator",   id: "sep4"}, 
                                    {id: "Redo", type: "button", text: _("Odśwież"), img: "fa fa-refresh"}
                            ]                    
                    });
                } else {
                    clientsGridToolBar = clientsLayout.cells("a").attachToolbar({
                            iconset: "awesome",
                            items: [
                                    {id: "Redo", type: "button", text: _("Odśwież"), img: "fa fa-refresh"}
                            ]                    
                    });
                }
                clientsGridToolBar.attachEvent("onClick", function(id) {
                    switch (id){
                        case 'Add': {
                            var windowForm = createWindow(_("Nowy klient"), 500, 500);
                            var form = createForm(clientFormStruct, windowForm);                          
                            form.attachEvent("onButtonClick", function(name){
                                switch (name){
                                    case 'save':{                                         
                                        ajaxPost("api/clients", form.getFormData(), function(data){                                                                                                        
                                            if (data && data.success) {
                                                clientsGrid.fill();
                                                windowForm.close();
                                                dhtmlx.alert({
                                                    title:_("Wiadomość"),
                                                    text:_("Zapisane!")
                                                });
                                            } else {
                                                dhtmlx.alert({
                                                    title:_("Wiadomość"),
                                                    text:_("Błąd! Zmiany nie zostały zapisane")
                                                });
                                            }                                          
                                        });
                                    };break;
                                    case 'cancel':{
                                        form.clear();    
                                    };break;
                                }
                            });                                
                        };break;
                        case 'Edit': {
                            var selectedId = clientsGrid.getSelectedRowId();
                            if (selectedId) {
                                var windowForm = createWindow(_("Klient"), 500, 500);
                                var form = createForm(clientFormStruct, windowForm);      
                                form.bind(clientsGrid);
                                form.unbind(clientsGrid);                                
                                form.attachEvent("onButtonClick", function(name){
                                    switch (name){
                                        case 'save':{                                         
                                            ajaxGet("api/clients/" + selectedId + "/edit", form.getFormData(), function(data){                                                                                                        
                                                if (data && data.success) {
                                                    clientsGrid.fill();
                                                    windowForm.close();
                                                    dhtmlx.alert({
                                                        title:_("Wiadomość"),
                                                        text:_("Zapisane!")
                                                    });                                                    
                                                } else {
                                                    dhtmlx.alert({
                                                        title:_("Wiadomość"),
                                                        text:_("Błąd! Zmiany nie zostały zapisane")
                                                    });
                                                }                                          
                                            });
                                        };break;
                                        case 'cancel':{
                                            form.clear();    
                                        };break;
                                    }
                                }); 
                            } else {
                                dhtmlx.alert({
                                    title:_("Wiadomość"),
                                    text:_("Wybierz klienta, informacje o którym chcesz zmienić!")
                                });                            
                            }
                        };break;
                        case 'Del': {                               
                            var selectedId = clientsGrid.getSelectedRowId();
                            if (selectedId) {
                                dhtmlx.confirm({
                                    title: _("Ostrożność"),                                    
                                    text: _("Czy na pewno chcesz usunąć?"),
                                    callback: function(result){
                                        if (result) {                                                                                    
                                            ajaxDelete("api/clients/" + selectedId, "", function(data){
                                                if (data && data.success){
                                                    clientsGrid.deleteRow(selectedId);
                                                } else {
                                                    dhtmlx.alert({
                                                        title:_("Wiadomość"),
                                                        text:_("Nie udało się usunąć!")
                                                    });
                                                }
                                            });                           
                                        }
                                    }
                                });                                     
                            } else {
                                dhtmlx.alert({
                                    title:_("Wiadomość"),
                                    text:_("Wybierz klienta, informacje o którym chcesz usunąć!")
                                });                            
                            }                                
                        };break;
                        case 'Redo': {
                            clientsGrid.fill();                                
                        };break;                        
                    }
                });                 
                var clientsGrid = clientsLayout.cells("a").attachGrid({
                    image_path:'codebase/imgs/',
                    columns: [
                        {
                            label: _("Kod"),
                            id: "kod",
                            width: 50,
                            type: "txt", 
                            sort: "str", 
                            align: "left"     
                        } ,                        
                        {
                            label: _("Imie"),
                            id: "name",
                            width: 100,
                            type: "ed", 
                            sort: "str", 
                            align: "left"     
                        },                                                
                        {
                            label: _("Adresa"),
                            id: "address",
                            width: 300,
                            type: "txt", 
                            sort: "str", 
                            align: "left"     
                        },
                        {
                            label: _("Kraj"),
                            id: "country",
                            width: 50,
                            type: "txt", 
                            sort: "str", 
                            align: "left"     
                        },
                        {
                            label: _("Kontakty"),
                            id: "contacts",
                            width: 300,
                            type: "txt", 
                            sort: "str", 
                            align: "left"     
                        }                         
                    ],
                    multiselect: true                    
                });
                clientsGrid.attachHeader("#text_filter,#text_filter,,#select_filter");
                var dpClientsGrid = new dataProcessor("api/clients", "js");                
                dpClientsGrid.init(clientsGrid);
                dpClientsGrid.enableDataNames(true);
                dpClientsGrid.setTransactionMode("REST");
                dpClientsGrid.enablePartialDataSend(true);
                dpClientsGrid.enableDebug(true);               
                dpClientsGrid.setUpdateMode("row", true);
                dpClientsGrid.attachEvent("onBeforeDataSending", function(id, state, data){
                    data.id = id;
                    ajaxGet("api/clients/" + id + "/edit", data, function(data){
                        if (data.success) {
                            clientsGrid.setRowTextNormal(id);
                        }
                    });
                });                
                clientsGrid.fill = function() {     
                    this.clearAll();
                    ajaxGet("api/clients", "", function(data){
                        if (data && data.success){                    
                            clientsGrid.parse(data.data, "js");
                        }
                    });	                    
                };                
                clientsGrid.fill();
                  
                if (write) {
                    var clientFormStruct = [                    
                            {type: "settings", position: "label-left", labelWidth: 110, inputWidth: 160},
                            //{type: "combo", name: "client_id", required: true, label: _("Klient"), options: []},		
                            {type: "input", name: "kod",       required: true, label: _("Kod")},
                            {type: "input", name: "name",      required: true, label: _("Klient"),                           
                               note: {text: _("Dodaj imie klienta. Jest obowiazkowe.")}},
                            {type: "input", name: "address",required: true, label: _("Opis"), rows: 3,
                               note: {text: _("Dodaj adrese klienta. Obowiazkowe.")}},
                            {type: "input", name: "country", required: true, label: _("Kraj"), 
                               note: {text: _("Kraj klienta. Jest obowiazkowe.")}},                        
                            {type: "input", name: "contacts",required: true, label: _("Kontakty"), rows: 3,
                               note: {text: _("Dodaj numer telefonu, e-mail klienta. Obowiazkowe.")}},                      
                            {type: "block", blockOffset: 0, position: "label-left", list: [
                                {type: "button", name: "save",   value: "Zapisz", offsetTop:18}                            
                            ]}	
                    ];    
                } else {
                    var clientFormStruct = [                    
                            {type: "settings", position: "label-left", labelWidth: 110, inputWidth: 160},
                            //{type: "combo", name: "client_id", required: true, label: _("Klient"), options: []},		
                            {type: "input", name: "kod",       required: true, label: _("Kod")},
                            {type: "input", name: "name",      required: true, label: _("Klient"),                           
                               note: {text: _("Dodaj imie klienta. Jest obowiazkowe.")}},
                            {type: "input", name: "address",required: true, label: _("Opis"), rows: 3,
                               note: {text: _("Dodaj adrese klienta. Obowiazkowe.")}},
                            {type: "input", name: "country", required: true, label: _("Kraj"), 
                               note: {text: _("Kraj klienta. Jest obowiazkowe.")}},                        
                            {type: "input", name: "contacts",required: true, label: _("Kontakty"), rows: 3,
                               note: {text: _("Dodaj numer telefonu, e-mail klienta. Obowiazkowe.")}}                                                 
                    ];   
                }
                var clientForm = clientsLayout.cells("b").attachForm(clientFormStruct);
                clientForm.bind(clientsGrid);
                clientForm.attachEvent("onButtonClick", function(name){
                    switch (name){
                        case 'save':{ 
                            var data = clientForm.getFormData();
                            var selectedClient = clientsGrid.getSelectedRowId();
                            if (selectedClient) {                                
                                ajaxGet("api/clients/" + data.id + "/edit", data, function(data){                                                                                                        
                                    if (data && data.success) {
                                        dhtmlx.alert({
                                            title:_("Wiadomość"),
                                            text:_("Zapisane!")
                                        });
                                    } else {
                                        dhtmlx.alert({
                                            title:_("Wiadomość"),
                                            text:_("Błąd! Zmiany nie zostały zapisane")
                                        });
                                    }                                          
                                });                                
                            } else {                                       
                                ajaxPost("api/clients", data, function(data){                                                                                                        
                                    if (data && data.success) {
                                        clientsGrid.fill();
                                        dhtmlx.alert({
                                            title:_("Wiadomość"),
                                            text:_("Zapisane!")
                                        });                                        
                                    } else {
                                        dhtmlx.alert({
                                            title:_("Wiadomość"),
                                            text:_("Błąd! Zmiany nie zostały zapisane")
                                        });
                                    }                                          
                                });                               
                            }

                        };break;
                    }
                });         
    }                
}

window.dhx4.attachEvent("onSidebarSelect", function (id, cell) {
	if (id == "clients") {
            window.history.pushState({'page_id': id}, null, '#clients');
            clientsInit(cell);      
        }       
});
