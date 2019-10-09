var productsTasksLayout;

function productsTasksInit(cell) {
    if (productsTasksLayout == null) {
        var productsTasksLayout = cell.attachLayout("2U");
        productsTasksLayout.cells("a").hideHeader();
        productsTasksLayout.cells("b").hideHeader();
    
        productsGridToolBar = productsTasksLayout.cells("a").attachToolbar({
                iconset: "awesome",
                items: [
                        {type: "text", id: "title", text: _("Produkty")}				                               
                ]                    
        });
        var productsGrid = productsTasksLayout.cells("a").attachGrid({
            image_path:'codebase/imgs/',
            columns: [                        
                {
                    label: _("Kod"),                    
                    id: "kod",
                    type: "ro", 
                    sort: "str", 
                    align: "left"
                },
                {
                    label: _("Imie produktu"),                    
                    id: "name",
                    type: "ro", 
                    sort: "str", 
                    align: "left"
                },
                {
                    label: _("Typ produktu"),                    
                    id: "product_type_name",
                    type: "ro", 
                    sort: "str", 
                    align: "left"
                },
                {
                    label: _("Grupa produktu"),                    
                    id: "product_group_name",
                    type: "ro", 
                    sort: "str", 
                    align: "left"
                }                          
            ],
                multiselect: true
        });                
        productsGrid.fill = function(){
            productsGrid.clearAll();
            ajaxGet("api/products", '', function(data){                                     
                if (data && data.success){                                    
                    productsGrid.parse(data.data, "js");
                }
            });                        
        };                
        productsGrid.fill();
        productsGrid.attachHeader("#select_filter,#text_filter,#select_filter,#select_filter");		
        productsGrid.setColValidators(["NotEmpty","NotEmpty","NotEmpty","NotEmpty"]);        
        var dpProductsGrid = new dataProcessor("api/products", "js");                
        dpProductsGrid.init(productsGrid);
        dpProductsGrid.enableDataNames(true);
        dpProductsGrid.setTransactionMode("REST");
        dpProductsGrid.enablePartialDataSend(true);
        dpProductsGrid.enableDebug(true);
        dpProductsGrid.setUpdateMode("row", true);
        dpProductsGrid.attachEvent("onBeforeDataSending", function(id, state, data){
            data.id = id;
            ajaxGet("api/products/" + id + "/edit", data, function(data){                                                            
                console.log(data);
            });
        });
        productsGrid.attachEvent("onRowSelect", function(id, ind) {            
            zadaniaGrid.fill(id);     
        });    

        var zadaniaToolBar = productsTasksLayout.cells("b").attachToolbar({
                iconset: "awesome",
                items: [
                        {type: "text", id: "title", text: _("Zadania")},
                        {type: "spacer"},
                        {id: "Add", type: "button", img: "fa fa-plus-square "},
                        {id: "Edit", type: "button", img: "fa fa-edit"},
                        {id: "Del", type: "button", img: "fa fa-minus-square"}				                               
                ]                    
        });   
        zadaniaToolBar.attachEvent("onClick", function(name) {
            var formStruct = [
                            {type: "settings", position: "label-left", labelWidth: 115, inputWidth: 160},
                            {type: "combo", name: "task_id",  required: true, label: _("Zadanie"), options: []},		
                            {type: "input", name: "duration", required: true, label: _("Czas na wykonanie, min: ")},
                            //{type: "input", name: "priority", required: true, label: _("Kolej: ")},
                            {type: "block", name: "block", blockOffset: 0, position: "label-left", list: [
                                {type: "button", name: "save", value: "Zapisz", offsetTop:18},                                        
                                {type: "newcolumn"},
                                {type:"button",  name: "cancel", value: "Anuluj", offsetTop:18}
                            ]}              
                        ];
            switch(name) {
                case "Add": {
                    var selectedProductId = productsGrid.getSelectedRowId();
                    if (selectedProductId) {
                        var addingWindow = createWindow(_("Zadania do produktow"), 300, 300);
                        var addingForm = createForm(formStruct, addingWindow);
                        var tasksCombo = addingForm.getCombo("task_id");
                        ajaxGet("api/products/availabletasks/" + selectedProductId, '', function(data){
                            tasksCombo.addOption(data.data);
                        });
                        addingForm.attachEvent("onButtonClick", function(name){
                            var data = this.getFormData();
                            data.product_id = selectedProductId;
                            if (name == "save") {
                                ajaxPost("api/products/addtask", data, function(data){
                                    if (data && data.success){
                                        zadaniaGrid.fill(selectedProductId);
                                        addingForm.setItemFocus("task_id");
                                    }
                                });
                            }
                        });
                    } else {
                        dhtmlx.alert({
                            title:_("Wiadomość"),
                            text:_("Wybierz produkt, do którego chcesz dodać zadania!")
                        });
                    }
                };break;
                case "Edit": {
                    var selectedId = zadaniaGrid.getSelectedRowId();
                    var selectedProductId = productsGrid.getSelectedRowId();
                    if (selectedId) {
                        var editWindow = createWindow(_("Zadania do produktow"), 300, 300);
                        var editForm = createForm(formStruct, editWindow);
                        var rowData = zadaniaGrid.getRowData(selectedId);
                        var tasksCombo = editForm.getCombo("task_id");
                        ajaxGet("api/tasks", '', function(data){
                            tasksCombo.addOption(data.data);
                            tasksCombo.selectOption(tasksCombo.getIndexByValue(rowData.task_id));
                        });
                        editForm.bind(zadaniaGrid);
                        editForm.unbind(zadaniaGrid);
                        editForm.attachEvent("onButtonClick", function(name){
                            var data = this.getFormData();
                            data.product_id = selectedProductId;
                            if (name == "save") {
                                ajaxGet("api/products/edittask/" + selectedId, data, function(data){
                                    if (data && data.success){
                                        zadaniaGrid.fill(selectedProductId);
                                        addingForm.setItemFocus("task_id");
                                    }
                                });
                            }
                        });
                    }                          
                };break;                
                case "Del": {
                    var selectedId = zadaniaGrid.getSelectedRowId();
                    if (selectedId) {
                        dhtmlx.confirm({
                            title: _("Ostrożność"),                                    
                            text: _("Czy na pewno chcesz usunąć zadanie?"),
                            callback: function(result){
                                if (result) {                                        
                                    var rowData = zadaniaGrid.getRowData(selectedId);
                                    ajaxGet("api/products/deletetask/" + rowData.product_id + "/" + rowData.task_id, "", function(data){
                                        if (data && data.success) {
                                            zadaniaGrid.deleteRow(selectedId);
                                        } else {
                                            dhtmlx.alert({
                                                title:_("Wiadomość"),
                                                text:_("Nie udało się usunąć zadanie!")
                                            });
                                        }
                                    });                            
                                }
                            }
                        });                     
                    } else {
                        dhtmlx.alert({
                            title:_("Wiadomość"),
                            text:_("Wybierz zadanie, które chcesz usunąć!")
                        }); 
                    }
                };break;
            }
        });  
        var zadaniaGrid = productsTasksLayout.cells("b").attachGrid({
            image_path:'codebase/imgs/',
            columns: [                        
                {
                    label: _("Kod"),                  
                    id: "kod",
                    type: "ro",
                    width: 50,
                    sort: "str", 
                    align: "left"
                },
                {
                    label: _("Zadanie"),                    
                    id: "name",
                    type: "ro", 
                    width: 150,
                    sort: "str", 
                    align: "left"
                },
                {
                    label: _("Czas, min"),                 
                    id: "duration",
                    type: "ed", 
                    width: 50,
                    sort: "str", 
                    align: "left"
                },
                {                                     
                    label: _("Kolejnosc"),                 
                    id: "priority",
                    type: "ro",
                    width: 50,
                    sort: "str", 
                    align: "left"                    
                },
                {id: "product_id"},
                {id: "task_id"}
            ]
                
        });        
        zadaniaGrid.setColumnHidden(4,true);
        zadaniaGrid.setColumnHidden(5,true);
        zadaniaGrid.attachHeader("#select_filter,#select_filter");		
        zadaniaGrid.setColValidators(["NotEmpty","NotEmpty","NotEmpty"]); 
        zadaniaGrid.enableDragAndDrop(true);
        zadaniaGrid.attachEvent("onKeyPress", function(code,cFlag,sFlag){
            if (code == 13) {
                var id = zadaniaGrid.getSelectedRowId();
                if (id) {
                    var data = zadaniaGrid.getRowData(id);
                    ajaxGet("api/products/tasks/" + data.product_id + "/" + id + "/edit", data, function(data){ 
                        if (data && data.success) {
                            console.log(data);
                        } else {
                            dhtmlx.alert({
                                title:_("Wiadomość"),
                                text:_("Zmiany nie zostały zapisane. \n\
                                        Wprowadź zmiany ponownie!")
                            });
                        }
                    });
                }
            }                    
        });          
        zadaniaGrid.fill = function(id = 0){	
            zadaniaGrid.clearAll();					
            ajaxGet("api/products/tasks/" + id, '', function(data){                                     
                if (data && data.success){
                    zadaniaGrid.parse((data.data), "js");
                }
            });                        
        };  
        zadaniaGrid.attachEvent("onDrop", function(sId,tId,dId,sObj,tObj,sCol,tCol){
            var productId = productsGrid.getSelectedRowId();           
            ajaxGet("api/products/tasks/changepriority/" + productId + "/" + sId + "/" + tId, "", function(data){ 
                if (data && data.success) {
                    console.log(data);
                } else {
                    dhtmlx.alert({
                        title:_("Wiadomość"),
                        text:_("Zmiany nie zostały zapisane. \n\
                                Wprowadź zmiany ponownie!")
                    });
                }
            });            
        });
//        var tasksCombo = zadaniaGrid.getCombo(1);
//        ajaxGet("api/tasks", "", function(data){                                                            
//            if (data.success && data.data) {
//                data.data.forEach(function(task){
//                    tasksCombo.put(task.id, task.name);
//                });
//            }
//        });    
        
        zadaniaGrid.attachFooter(
            [_("Ilosc czasu na wykonanie, min: "),"#cspan","#stat_total"],
            ["text-align:right;","text-align:center"]
        );
    }
}

window.dhx4.attachEvent("onSidebarSelect", function (id, cell) {
    if (id == "products_tasks") {
        window.history.pushState({'page_id': id}, null, '#products_tasks');
        productsTasksInit(cell);      
    }       
});