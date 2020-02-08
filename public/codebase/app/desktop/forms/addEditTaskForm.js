function addEditTaskForm(id = 0) { 
    var formStruct = [
            {type: "settings", position: "label-left", labelWidth: 115, inputWidth: 160},
            {type: "combo", name: "task_id",  required: true, label: _("Zadanie"), options: []},		
            {type: "input", name: "duration", required: true, label: _("Czas")},
            {type: "block", name: "block", blockOffset: 0, position: "label-left", list: [
                {type: "button", name: "save", value: "Zapisz", offsetTop:18},                                        
                {type: "newcolumn"},
                {type:"button",  name: "cancel", value: "Anuluj", offsetTop:18}
            ]}              
        ];                
        var addingWindow = createWindow(_("Zadania"), 300, 300);
        var addingForm = createForm(formStruct, addingWindow);
        var tasksCombo = addingForm.getCombo("task_id");
        ajaxGet("api/tasks", '', function(data){
            if (data && data.success) {
                tasksCombo.addOption(data.data);
                if (id) {
                    tasksCombo.selectOption(tasksCombo.getIndexByValue(id));
                }
            } else {
                dhtmlx.alert({
                    title:_("Wiadomość"),
                    text:_("Listę zadań nie było otrzymano. Wypełnij listę zadań \n\
                            w rozdziale 'Zadania' albo odswież stronę.")
                });                 
            }
        });
        return addingForm;
}