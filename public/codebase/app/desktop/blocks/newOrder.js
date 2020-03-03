const makeNewOrderForm = (container) => {
    const nowDate = getNowDate();
    const newProjectFormStruct = [          
            {type: "settings", position: "label-left", labelWidth: 110, inputWidth: 160},   	        
            {type: "combo", name: "client_id", required: true, label: _("Klient"), options: []},		
            {type: "input", name: "kod",       required: true, label: _("Kod zamowienia")},
            {type: "input", name: "description", label: _("Opis"), rows: 3},
            {type: "calendar", name: "date_start",  label: _("Data zamowienia"), 
                required: true, dateFormat: "%Y-%m-%d", enableTodayButton: true, value: nowDate},                       
            {type: "combo", name: "num_week", required: true, label: _("Termin wykonania"), options:[],
                note: {text: _("Numer tygodnia. Jest obowiazkowe.")}},
            {type: "block", blockOffset: 0, position: "label-left", list: [
                {type: "button", name: "save",   value: "Zapisz", offsetTop:18}                            
            ]}	
    ];    
    
    if (!container) {
        container = createWindow(_("Nowe zamówienie"), 500, 380);
    }
    
    const newOrderForm = createForm(newProjectFormStruct, container);
    const clientsCombo = newOrderForm.getCombo("client_id");
    ajaxGet("api/clients", "", function(data){
        clientsCombo.addOption(data.data);         
    });  
    
    return newOrderForm;
}

