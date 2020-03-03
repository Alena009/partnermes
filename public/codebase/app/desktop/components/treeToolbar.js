const buildTreeToolbar = (container, write, url, tree) => {
    const struct = write ? standartToolbar: emptyToolbar;
    const treeToolbar = container.attachToolbar(struct);
    treeToolbar.attachEvent("onClick", function(btn) {
        switch (btn){
                case 'Add':{			                                        
                        createAddEditGroupWindow(url, url, tree, 0);                            
                };break;
                case 'Edit':{
                    var id = tree.getSelectedId();
                    if (id) {                                        
                        createAddEditGroupWindow(url, url + "/" + id + "/edit", tree, id);                         
                    }
                };break;
                case 'Del':{
                    var id = tree.getSelectedId();
                    if (id) {
                        deleteNodeFromTree(tree, url + "/" + id);
                    }
                };break;
                case 'Redo':{
                    tree.fill(); 
                };break;                    
        }
    });
    return treeToolbar;
};

var groupFormStruct = [
        {type:"fieldset",  offsetTop:0, label:_("Grupa"), width:253, list:[                                
                {type:"combo",  name:"parent_id",       label:_("Grupa nadrzędna"),        options: [{text: "None", value: ""}], inputWidth: 150},                                
                {type:"input",  name:"name",    	label:_("Imie grupy"),     	offsetTop:13, 	labelWidth:80},                                                                				
                {type: "block", name: "block", blockOffset: 0, position: "label-left", list: [
                    {type:"button", name:"save",    	value:_("Zapisz"),   		offsetTop:18},
                    {type: "newcolumn"},
                    {type:"button", name:"cancel",     	value:_("Anuluj"),   		offsetTop:18}
                ]}
        ]}
];

function createAddEditGroupWindow(urlForParentCombo, urlForSaveButton, treeObj, id = 0) {
    var grupyWindow = createWindow(_("Dodaj lub zmien grupe"), 300, 350);
    var grupyForm = createForm(groupFormStruct, grupyWindow);
    //if we editing some group, we removing parentgrop combo, because 
    //we can drag groups and change parent group by that way
    if (id) {
        grupyForm.removeItem("parent_id");
        grupyForm.setItemValue("name", treeObj.getItemText(id));
    } else {
        var dhxCombo = grupyForm.getCombo("parent_id");                             
        ajaxGet(urlForParentCombo, '', function(data) {                    
                dhxCombo.addOption(data.data);
        });  
    }   
    grupyForm.addRecord = () => {
        ajaxPost(urlForSaveButton, grupyForm.getFormData(), function(data){
            if (data && data.success) {                
                treeObj.addItem(data.data.id, data.data.name, data.data.parent_id); // id, text, pId
                if (data.data.parent_id) { treeObj.openItem(data.data.parent_id); }
                treeObj.selectItem(data.data.id);  
                grupyForm.setItemValue('name', '');
            } else {
                dhtmlx.alert({
                    title:_("Wiadomość"),
                    text:_("Błąd! Informacja nie została zapisana")
                });  
            }
        });        
    };
    grupyForm.editRecord = (id) => {
        ajaxGet(urlForSaveButton, grupyForm.getFormData(), function(data){  
            if (data && data.success) {                             
                treeObj.setItemText(id, data.data.name);
                if (data.data.parent_id) { treeObj.openItem(data.data.parent_id); }
                treeObj.selectItem(data.data.id);   
                grupyWindow.close();
            } else {
                dhtmlx.alert({
                    title:_("Wiadomość"),
                    text:_("Błąd! Zmiany nie zostały zapisane")
                });  
            }
        });        
    };
    grupyForm.saveEvent = (id = 0) => {
        id ? grupyForm.editRecord(id) : grupyForm.addRecord();
    };    
    grupyForm.attachEvent("onKeyUp",function(inp, ev, name, value){
        if (name == 'name') {
            if (grupyForm.getItemValue('name') !== '') {                
                if (ev.code == 'Enter') {
                    grupyForm.saveEvent(id);
                }                
            }
        }
    });    
    grupyForm.attachEvent("onButtonClick", function(name){
        switch (name){
            case 'save':{
                grupyForm.saveEvent(id);
            };break;         
            case 'cancel':{
                grupyForm.reset();
            };break;
        }
    });
    
    return grupyForm;
}

function deleteNodeFromTree(treeObj, deleteUrl) {
    var id = treeObj.getSelectedId();
    if (id) {
        dhtmlx.confirm({
        title:_("Ostrożność"),                                    
        text:_("Czy na pewno chcesz usunąć grupe?"),
        callback: function(result){
                    if (result) {
                        ajaxDelete(deleteUrl, '', function(data) {
                            if (data.success) {
                                treeObj.deleteItem(id);                                                    
                            } else {
                                dhtmlx.alert({
                                    title:_("Błąd!"),
                                    type:"alert-error",
                                    text:data.message
                                });
                            }
                        }); 
                    }
                }
            });
    }  else {
        dhtmlx.alert({
            title:_("Wiadomość"),
            type:"alert",
            text:_("Wybierz grupe, która chcesz usunąć!")
        });
    }  
}
