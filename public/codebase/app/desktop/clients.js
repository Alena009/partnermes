var clientsGrid;
var clientsLayout;
var clientsForm;

function clientsInit(cell) {
    if (clientsLayout == null) {
        var userData = JSON.parse(localStorage.getItem("userData")); 
        var userCanWrite;
        userData.permissions.forEach(function(elem){
            if (elem.name == 'clients') {
                userCanWrite = elem.pivot.value;
            }
        });
        var clientsLayout = cell.attachLayout("2U");
            clientsLayout.cells("a").setText(_("Klienci"));
            clientsLayout.cells("b").setText(_("Informacja"));
            clientsLayout.cells("b").setWidth(280);    
/**
 * A
 * 
 */                          
        var clientsGridToolBar;       
        userCanWrite ? clientsGridToolBar = clientsLayout.cells("a").attachToolbar(standartToolbar):
                    clientsGridToolBar = clientsLayout.cells("a").attachToolbar(emptyToolbar);                
        clientsGridToolBar.attachEvent("onClick", function(id) {
            switch (id){
                case 'Add': {
                    var windowForm = createWindow(_("Nowy klient"), 500, 500);
                    var clientForm = createForm(clientFormStruct, windowForm);                          
                    clientForm.attachEvent("onButtonClick", function(name){
                        if (name === 'save'){          
                            addClient(clientForm.getFormData(), clientsGrid);                           
                        }
                    });                                
                };break;
                case 'Edit': {
                    var selectedClientId = clientsGrid.getSelectedRowId();
                    if (selectedClientId) {
                        var windowForm = createWindow(_("Klient"), 500, 500);
                        var clientForm = createForm(clientFormStruct, windowForm); 
                        var clientData = clientsGrid.getRowData(selectedClientId);
                        clientForm.setFormData(clientData);                                
                        clientForm.attachEvent("onButtonClick", function(name){
                            if (name === 'save'){  
                                editClient(selectedClientId, clientForm.getFormData(), clientsGrid);                              
                                windowForm.close();
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
                    var selectedClientId = clientsGrid.getSelectedRowId();
                    if (selectedClientId) {                                
                        dhtmlx.confirm({
                            title: _("Ostrożność"),                                    
                            text: _("Czy na pewno chcesz usunąć?"),
                            callback: function(result){
                                if (result) {                                                                                    
                                    ajaxDelete("api/clients/" + selectedClientId, "", function(data){
                                        if (data && data.success){
                                            clientsGrid.deleteRow(selectedClientId);
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
                    clientsGrid.fill("api/clients");                                                            
                };break;                        
            }
        });                 
        var clientsGrid = clientsLayout.cells("a").attachGrid({
            image_path:'codebase/imgs/',
            columns: [
                {label: _("Kod"),      id: "kod",     width: 50, type: "ro", sort: "str", align: "left"},                        
                {label: _("Imie"),     id: "name",    width: 100,type: "ro", sort: "str", align: "left"},                                                
                {label: _("Adresa"),   id: "address", width: 300,type: "ro", sort: "str", align: "left"},
                {label: _("Kraj"),     id: "country", width: 50, type: "ro", sort: "str", align: "left"},
                {label: _("Kontakty"), id: "contacts",width: 300,type: "ro", sort: "str", align: "left"}                         
            ]                   
        });
        clientsGrid.attachHeader("#text_filter,#text_filter,,#select_filter");             
        clientsGrid.fill("api/clients");               
/**
 * B
 * 
 */                  
        var clientForm = clientsLayout.cells("b").attachForm(clientFormStruct);
        if (!userCanWrite) { clientForm.hideItem('save'); }
        clientForm.bind(clientsGrid);
        clientForm.attachEvent("onButtonClick", function(name){
            if (name === 'save'){
                var data = clientForm.getFormData();
                var selectedClient = clientsGrid.getSelectedRowId();
                if (selectedClient) { 
                    editClient(selectedClient, data, clientsGrid);
                } else {                                       
                    addClient(data, clientsGrid);                              
                }
            }
        });                  
    }                
}

function addClient(data, grid) {
    ajaxPost("api/clients", data, function(data){                                                                                                        
        if (data && data.success) {
            grid.addRow(data.data.id, '');
            grid.setRowData(data.data.id, data.data);
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

function editClient(id, data, grid) {
    ajaxGet("api/clients/" + id + "/edit", data, function(data){                                                                                                        
        if (data && data.success) { 
            grid.setRowData(data.data.id, data.data);
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

window.dhx4.attachEvent("onSidebarSelect", function (id, cell) {
	if (id == "clients") {
            window.history.pushState({'page_id': id}, null, '#clients');
            clientsInit(cell);      
        }       
});
