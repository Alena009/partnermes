var sendingsLayout;
var sendingsURL = "api/sendings";
        
function sendingsInit(cell) {
    if (sendingsLayout == null) {	
        var userCanWrite;
        var userData = JSON.parse(localStorage.getItem("userData")); 
        userData.permissions.forEach(function(elem){
            if (elem.name === "sendings") {
                userCanWrite = elem.pivot.value;
            }
        });             
        var sendingsLayout = cell.attachLayout("3W"); 
        sendingsLayout.cells("a").setText(_("Wysyłki"));                    
        sendingsLayout.cells("b").setText(_("Pallety"));                    
        sendingsLayout.cells("c").setText(_("Zlecenia")); 
/**
 * A
 *  
 */
        let sendingsToolbar;
        userCanWrite? sendingsToolbar = sendingsLayout.cells("a").attachToolbar(standartToolbar):
                sendingsToolbar = sendingsLayout.cells("a").attachToolbar(emptyToolbar);
        sendingsToolbar.attachEvent("onClick", function(btn) {
            var formStruct = [
                {type:"fieldset",  offsetTop:0, label:_("Wysyłka"), width:250, list:[    
                        {type: "settings", position: "label-left", labelWidth: 115, inputWidth: 160},                        
                        {type:"input",    name:"kod",          label:_("Kod wysyłki"),  required: true},   
                        {type:"calendar", name:"date_sending", label:_("Data wysyłki"), required: true},                                                                				
                        {type:"combo",    name:"client_id",    label:_("Klient"),       required: true},                                                                				
                        {type: "block", name: "block", blockOffset: 0, position: "label-left", list: [
                            {type:"button", name:"save", value:_("Zapisz"), offsetTop:18},
                            {type: "newcolumn"},
                            {type:"button", name:"cancel", value:_("Anuluj"), offsetTop:18}
                        ]}
                ]}                                    
            ];            
            switch (btn){
                case 'Add':{
                    let addingWindow = createWindow(_("Dodaj wysyłkę"), 300, 300);
                    let addingForm = createForm(formStruct, addingWindow);
                    let clientsCombo = addingForm.getCombo('client_id');
                    ajaxGet("api/clients", '', function(data){
                        if (data && data.success) {
                            clientsCombo.addOption(data.data);
                        }
                    });
                    addingForm.attachEvent("onButtonClick", function(name){
                        let data = this.getFormData();
                        if (name == 'save') {
                            sendingsGrid.add(sendingsURL, data);
                        }
                    });                                
                };break;
                case 'Edit':{
                    let sendingId = sendingsGrid.getSelectedRowId();
                    if (sendingId) {
                        let sendingData = sendingsGrid.getRowData(sendingId);                        
                        let addingWindow = createWindow(_("Edytuj wysyłkę"), 300, 300);
                        let addingForm = createForm(formStruct, addingWindow);
                        let clientsCombo = addingForm.getCombo('client_id');
                        ajaxGet("api/clients", '', function(data){
                            if (data && data.success) {
                                clientsCombo.addOption(data.data);
                                clientsCombo.selectOption(clientsCombo.getIndexByValue(sendingData.client_id));                                
                            }
                        });
                        addingForm.setFormData(sendingData);
                        addingForm.attachEvent("onButtonClick", function(name){
                            let data = this.getFormData();
                            if (name == 'save') {
                                sendingsGrid.edit(sendingsURL + "/" + sendingId + "/edit", data);
                            }
                        });                        
                    } else {
                        dhtmlx.alert({
                            title:_("Wiadomość"),
                            text:_("Wybierz wysyłkę!")
                        }); 
                    }                                                                      
                };break; 
                case 'Del':{
                    let sendingId = sendingsGrid.getSelectedRowId();
                    if (sendingId) {
                        sendingsGrid.delete(sendingsURL + "/" + sendingId, sendingId);                       
                    } else {
                        dhtmlx.alert({
                            title:_("Wiadomość"),
                            text:_("Wybierz wysyłkę!")
                        }); 
                    }                                                                      
                };break;  
                case 'Redo':{
                    sendingsGrid.fill(sendingsURL, sendingsToolbar);                                                                              
                };break;             
            }
        });
        let sendingsGrid = sendingsLayout.cells("a").attachGrid({
            image_path:'codebase/imgs/',
            columns: [                
                {label: _("Kod wysyłki"),  id: "kod",          width: 100, type: "ro",   sort: "str", align: "left"},                                                
                {label: _("Data wysyłki"), id: "date_sending", width: 100, type: "ro",   sort: "str", align: "left"},                                                                
                {label: _("Klient"),       id: "client_name",  width: 300, type: "ro", sort: "str", align: "left"},
                {id: "client_id"}
            ]                   
        });        
        sendingsGrid.setColumnHidden(3,true);
        sendingsGrid.fill(sendingsURL, sendingsToolbar);        
    } 
};


window.dhx4.attachEvent("onSidebarSelect", function(id, cell){
	if (id == "sendings") {
            window.history.pushState({'page_id': id}, null, '#sendings');
            sendingsInit(cell);
        } 
});