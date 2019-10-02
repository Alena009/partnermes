var productsTasksLayout;

function productsTasksInit(cell) {
    if (productsTasksLayout == null) {
        var productsTasksLayout = cell.attachLayout("2U");
        productsTasksLayout.cells("a").hideHeader();
        productsTasksLayout.cells("b").hideHeader();
    
        var productsGridToolBar = productsTasksLayout.cells("a").attachToolbar({
                iconset: "awesome",
                items: [
                        {type: "text", id: "title", text: _("Produkty")},
                        {type: "spacer"},
                        {id: "Del", type: "button", img: "fa fa-minus-square"}				                               
                ]                    
        });
        productsGridToolBar.attachEvent("onClick", function(name) {
            switch (name){                
                case 'Del': {
                    var selectedId = productsGrid.getSelectedRowId();
                    if (selectedId) {                                 
                        ajaxDelete("api/products/" + selectedId,'', function(data){
                            if (data && data.success) {
                                productsGrid.deleteRow(selectedId);
                            }
                        });                           
                    }
                };break;                        
            }
        });
        var productsGrid = productsTasksLayout.cells("a").attachGrid({
            image_path:'codebase/imgs/',
            columns: [                        
                {
                    label: _("Kod"),                    
                    id: "kod",
                    type: "ed", 
                    sort: "str", 
                    align: "left"
                },
                {
                    label: _("Imie produktu"),                    
                    id: "name",
                    type: "ed", 
                    sort: "str", 
                    align: "left"
                },
                {
                    label: _("Typ produktu"),                    
                    id: "product_type_name",
                    type: "ed", 
                    sort: "str", 
                    align: "left"
                },
                {
                    label: _("Grupa produktu"),                    
                    id: "product_group_name",
                    type: "ed", 
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
        productsGrid.attachEvent("onRowSelect", function() {
            var selectedId = productsGrid.getSelectedRowId();    
            zadaniaGrid.fill(selectedId);     
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
                            {type: "input", name: "priority", required: true, label: _("Kolej: ")},
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
                    }
                };break;
                case "Edit": {
                    var selectedId = zadaniaGrid.getSelectedRowId();
                    var selectedProductId = productsGrid.getSelectedRowId();
                    if (selectedId) {
                        var editWindow = createWindow(_("Zadania do produktow"), 300, 300);
                        var editForm = createForm(formStruct, editWindow);
                        var tasksCombo = editForm.getCombo("task_id");
                        ajaxGet("api/products/availabletasks/" + selectedProductId, '', function(data){
                            tasksCombo.addOption(data.data);
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
                        ajaxDelete("api/productstasks/" + selectedId, "", function(data){
                            if (data && data.success) {
                                zadaniaGrid.deleteRow();
                            }
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
                    type: "coro", 
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
                    type: "ed",
                    width: 50,
                    sort: "str", 
                    align: "left"                    
                }                
            ],
                multiselect: true
        });        
        zadaniaGrid.attachHeader("#select_filter,#select_filter");		
        zadaniaGrid.setColValidators(["NotEmpty","NotEmpty","NotEmpty"]); 
        zadaniaGrid.enableDragAndDrop(true);
        zadaniaGrid.fill = function(id = 0){	
            zadaniaGrid.clearAll();					
            ajaxGet("api/products/taskslist/" + id, '', function(data){                                     
                if (data && data.success){
                    zadaniaGrid.parse((data.data), "js");
                }
            });                        
        };  
//        zadaniaGrid.attachEvent("onDrop", function(sId,tId,dId,sObj,tObj,sCol,tCol){
//            console.log("zadaniaGrid.onDrop", arguments);
//            var data = {};
//            data.id = sId;
//            data.priority = tObj.getUserData(tId, "priority");
//            ajaxGet("api/productstasks/" + sId + "/edit", data, function(data){                                                            
//                console.log(data);
//            });   
//        });
//        var dpZleceniaForProductGrid = new dataProcessor("api/productstasks", "js");                
//        dpZleceniaForProductGrid.init(zadaniaGrid);
//        dpZleceniaForProductGrid.enableDataNames(true);
//        dpZleceniaForProductGrid.setTransactionMode("REST");
//        dpZleceniaForProductGrid.enablePartialDataSend(true);
//        dpZleceniaForProductGrid.enableDebug(true);
//        dpZleceniaForProductGrid.setUpdateMode("row", true);
//        dpZleceniaForProductGrid.attachEvent("onBeforeDataSending", function(id, state, data){
//            data.id = id;
//            data.task_id = data.task_name;
//            ajaxGet("api/productstasks/" + id + "/edit", data, function(data){                                                            
//                console.log(data);
//            });
//        });
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