var productsGrid;
var productsLayout;
var productsForm;

function productsInit(cell) {
    if (productsLayout == null) {      
        var productsLayout = cell.attachLayout("2U");
        productsLayout.cells("a").setText(_("Produkty"));
        productsLayout.cells("b").setText(_("Informacja o produktu"));         
        productsLayout.cells("b").setWidth(300);   
/**
 * A
 */       
        productsGridToolBar = productsLayout.cells("a").attachToolbar({
                iconset: "awesome",
                items: [                           
                        {id: "Add",  type: "button", text: _("Dodaj"),   img: "fa fa-plus-square "},
                        {id: "Edit", type: "button", text: _("Edytuj"), img: "fa fa-edit"},
                        {id: "Del",  type: "button", text: _("Usuń"),   img: "fa fa-minus-square"},
                        {type: "separator",   id: "sep4"}, 
                        {id: "Tasks",     text: _("Zadania"),    type: "button", img: "fa fa-file-text-o "},
                        {id: "Components",text: _("Komponenty"), type: "button", img: "fa fa-puzzle-piece "},
                        {type: "separator",   id: "sep2"},                           
                        {id: "Redo", type: "button", text: _("Odśwież"),img: "fa fa-refresh"}
                ]                    
        });  
        productsGridToolBar.attachEvent("onClick", function(name) {           
            switch (name){
                case 'Tasks': {
                    var productId = productsGrid.getSelectedRowId();
                    if (productId) {
                        var tasksWindow = createWindow(_("Zadania"), 500, 500);  
                        var tasksLayout = tasksWindow.attachLayout("1C");
                        tasksLayout.cells("a").hideHeader();
                        var tasksGridToolbar = tasksLayout.cells("a").attachToolbar({
                                iconset: "awesome",
                                items: [                                 
                                    {id:"Add", type:"button", text: _("Dodaj"),  img: "fa fa-plus-square"},
                                    {id:"Edit",type:"button", text: _("Edytuj"), img: "fa fa-edit"},
                                    {id:"Del", type:"button", text: _("Usun"),   img: "fa fa-minus-square"}
                                ]                    
                        });
                        tasksGridToolbar.attachEvent("onClick", function(name) {
                            switch(name) {
                                case "Add": {
                                    var productId = productsGrid.getSelectedRowId();
                                    addTaskForProduct(productId, tasksGrid);
                                };break;
                                case "Edit": {
                                    var selectedId = tasksGrid.getSelectedRowId();
                                    var selectedProductId = productsGrid.getSelectedRowId();
                                    editTaskForProduct(selectedId, selectedProductId, tasksGrid);                          
                                };break;                                 
                                case "Del": {
                                    var productId = tasksGrid.getSelectedRowId();
                                    deleteTaskForProduct(productId, tasksGrid);                           
                                };break;
                            }
                        });     
                        var tasksGrid = tasksLayout.cells("a").attachGrid({
                            image_path:'codebase/imgs/',
                            columns: [                        
                                {label: _("Kod"),width: 100,id: "task_kod", type: "ro", sort: "str", align: "left"},
                                {label: _("Zadania"),width: 100, id: "task_name", type: "ro", sort: "str", align: "left"},
                                {label: _("Czasy, min"), width: 100,  id: "duration", type: "ed", sort: "str", align: "left"},
                                {id: "product_id"},
                                {id: "task_id"},
                                {id: "priority"},
                                {label: _("Kolejnosc"), id: "priority", type: "ro", width: 50, sort: "str", align: "left"},                            
                            ],
                                multiselect: true
                        }); 
                        tasksGrid.setColumnHidden(3,true);
                        tasksGrid.setColumnHidden(4,true);
                        tasksGrid.setColumnHidden(5,true);
                        tasksGrid.enableDragAndDrop(true);
                        tasksGrid.attachEvent("onKeyPress", function(code,cFlag,sFlag){
                            if (code == 13) {
                                var id = tasksGrid.getSelectedRowId();
                                if (id) {
                                    var data = tasksGrid.getRowData(id);
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
                        tasksGrid.attachEvent("onDrop", function(sId,tId,dId,sObj,tObj,sCol,tCol){
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
                        tasksGrid.fill = function(id){	
                            tasksGrid.clearAll();
                            ajaxGet("api/products/tasks/" + id, '', function(data){                                     
                                if (data && data.success){
                                    tasksGrid.parse((data.data), "js");
                                }
                            });                        
                        };    
                        tasksGrid.fill(productId);                        
                    } else {
                        dhtmlx.alert({
                            title:_("Wiadomość"),
                            text:_("Wybierz produkt!")
                        });  
                    }                     
                };break;
                case 'Components': {
                    var productId = productsGrid.getSelectedRowId();
                    if (productId) { 
                        var componentsWindow = createWindow(_("Komponenty"), 500, 500);  
                        var componentsLayout = componentsWindow.attachLayout("1C");
                        componentsLayout.cells("a").hideHeader();
                        componentsGridToolbar = componentsLayout.cells("a").attachToolbar({
                            iconset: "awesome",
                            items: [
                                {id:"Add", type:"button", text: _("Dodaj"),  img: "fa fa-plus-square"},
                                //{id:"Edit",type:"button", text: _("Edytuj"), img: "fa fa-edit"},
                                {id:"Del", type:"button", text: _("Usun"),   img: "fa fa-minus-square"}
                            ]                    
                        });    
                        componentsGridToolbar.attachEvent("onClick", function(id) {
                            var formStruct = [
                                            {type: "settings", position: "label-left", labelWidth: 115, inputWidth: 160},
                                            {type: "combo", name: "component_id", required: true, label: _("Produkt"), options: []},		
                                            {type: "input", name: "amount",     required: true, label: _("Ilosc")},
                                            {type: "block", name: "block", blockOffset: 0, position: "label-left", list: [
                                                {type: "button", name: "save", value: "Zapisz", offsetTop:18},                                        
                                                {type: "newcolumn"},
                                                {type:"button",  name: "cancel", value: "Anuluj", offsetTop:18}
                                            ]}              
                                        ];
                            switch(id) {
                                case "Add": {
                                    var selectedProductId = productsGrid.getSelectedRowId();
                                    if (selectedProductId) {
                                        var addingWindow = createWindow(_("Componenty"), 300, 300);
                                        var addingForm = createForm(formStruct, addingWindow);
                                        var productCombo = addingForm.getCombo("component_id");                        
                                        ajaxGet("api/products", '', function(data){
                                            productCombo.addOption(data.data);
                                        });
                                        addingForm.attachEvent("onButtonClick", function(name){
                                            var data = this.getFormData();
                                            data.product_id = selectedProductId;
                                            if (name == "save") {
                                                ajaxPost("api/components", data, function(data){
                                                    if(data && data.success){
                                                        componentsGrid.fill(selectedProductId);                                        
                                                    }
                                                });
                                            }
                                        });
                                    } else {
                                        dhtmlx.alert({
                                            title:_("Wiadomość"),
                                            text:_("Wybierz produkt, do którego chcesz dodać komponent!")
                                        });  
                                    }
                                };break;
                                case "Edit": {
                                    var selectedComponentId = componentsGrid.getSelectedRowId();
                                    if (selectedComponentId) {
                                        var addingWindow = createWindow(_("Componenty"), 300, 300);
                                        var addingForm = createForm(formStruct, addingWindow);  
                                        var rowData = componentsGrid.getRowData(componentsGrid.getSelectedRowId());
                                        var productCombo = addingForm.getCombo("component_id");                        
                                        ajaxGet("api/products", '', function(data){
                                            productCombo.addOption(data.data);
                                            productCombo.selectOption(productCombo.getIndexByValue(rowData.component_id));
                                        });                        
                                        addingForm.setFormData(rowData);
                                    } else {
                                        dhtmlx.alert({
                                            title:_("Wiadomość"),
                                            text:_("Wybierz komponent, który chcesz edytować!")
                                        }); 
                                    }    
                                };break;
                                case "Del": {
                                    var selectedComponentId = componentsGrid.getSelectedRowId();
                                    if (selectedComponentId) {
                                        ajaxDelete("api/components/" + selectedComponentId, "", function(data){
                                            if (data && data.success) {
                                                componentsGrid.deleteRow(selectedComponentId);
                                            }
                                        });    
                                    } else {
                                        dhtmlx.alert({
                                            title:_("Wiadomość"),
                                            text:_("Wybierz komponent, który chcesz usunąć!")
                                        });                          
                                    }                           
                                };break;
                            }
                        });                          
                        var componentsGrid = componentsLayout.cells("a").attachGrid({
                            image_path:'codebase/imgs/',
                            columns: [                        
                                {label: _("Kod"), width: 100, id: "kod",  type: "ro", sort: "str", align: "left"},
                                {label: _("Nazwa komponentu"), width: 100, id: "name", type: "ro", sort: "str", align: "left"},
                                {label: _("Typ"), width: 100, id: "product_type_name", type: "ro", sort: "str", align: "left"},
                                {label: _("Group"),width: 100,id: "product_group_name",type: "ro", sort: "str", align: "left"},                        
                                {label: _("Ilość"),width: 100,id: "amount",type: "ed", sort: "str", align: "left"},
                                {id: "product_id"},
                                {id: 'component_id'}
                            ]
                        });  
                        componentsGrid.setColumnHidden(5,true);
                        componentsGrid.setColumnHidden(6,true);
                        var dpComponentsGrid = new dataProcessor("api/components", "js");                
                        dpComponentsGrid.init(componentsGrid);
                        dpComponentsGrid.enableDataNames(true);
                        dpComponentsGrid.setTransactionMode("REST");
                        //dpComponentsGrid.enablePartialDataSend(true);
                        dpComponentsGrid.enableDebug(true);
                        dpComponentsGrid.setUpdateMode("row", true);
                        dpComponentsGrid.attachEvent("onBeforeDataSending", function(id, state, data){
                            data.id = id;
                            ajaxGet("api/components/" + id + "/edit", data, function(data){                                                            
                                console.log(data);
                            });
                        });     
                        componentsGrid.attachEvent("onKeyPress", function(code,cFlag,sFlag){
                            if (code == 13) {
                                try {                                    
                                    dpComponentsGrid.sendData();
                                    dpComponentsGrid.setUpdated(componentsGrid.getSelectedRowId(), false, "updated");
                                } catch (e){
                                    console.log(e);
                                    dhtmlx.alert({
                                        title:_("Wiadomość"),
                                        text:_("Zmiany nie zostały zapisane. \n\
                                                Wybierz produkt, który chcesz zmienic ta wprowadź zmiany ponownie!")
                                    });
                                }
                            }                    
                        });                         
                        componentsGrid.fill = function(id){	
                            componentsGrid.clearAll();
                            ajaxGet("api/products/components/" + id, '', function(data){                                     
                                if (data && data.success){
                                    componentsGrid.parse((data.data), "js");
                                }
                            });                        
                        };
                        componentsGrid.fill(productId);
                    } else {
                        dhtmlx.alert({
                            title:_("Wiadomość"),
                            text:_("Wybierz produkt!")
                        });                        
                    }                        
                };break;
                case 'Add': {  
                    var productWindow = createWindow(_("Produkt"), 550, 400);
                    var productForm = createForm(productFormStruct, productWindow);                          
                    var productTypeCombo = productForm.getCombo("product_type_id");
                    ajaxGet("api/prodtypes", "", function(data){
                        if (data && data.success) {                        
                            productTypeCombo.addOption(data.data);                        
                        }
                    });
                    var productGroupCombo = productForm.getCombo("product_group_id");
                    ajaxGet("api/prodgroups", "", function(data){
                        if (data && data.success) {
                            productGroupCombo.addOption(data.data);
                        }
                    });                         
                    productForm.attachEvent("onButtonClick", function(name){
                        switch (name){
                            case 'save':{ 
                                ajaxPost("api/products", productForm.getFormData(), function(data) {
                                    if (data && data.success) {
                                        productsGrid.fill();
                                        dhtmlx.alert({
                                            title:_("Wiadomość"),
                                            text:_("Zapisane!")
                                        });                                          
                                    } else {
                                        dhtmlx.alert({
                                            title:_("Wiadomość"),
                                            text:_("Zmiany nie zostały zapisane. \n\
                                                    Wprowadź ponownie!")
                                        });                                         
                                    }
                                }); 
                            };break;
                        }
                    });                    
                };break;
                case 'Edit': {
                    var selectedId = productsGrid.getSelectedRowId();
                    if (selectedId) {                        
                        var productWindow = createWindow(_("Produkt"), 550, 400);
                        var productForm = createForm(productFormStruct, productWindow); 
                        var rowData = productsGrid.getRowData(selectedId);
                        var productTypeCombo = productForm.getCombo("product_type_id");
                        ajaxGet("api/prodtypes", "", function(data){
                            if (data && data.success) {                        
                                productTypeCombo.addOption(data.data); 
                                productTypeCombo.selectOption(productTypeCombo.getIndexByValue(rowData.product_type_id));
                            }
                        });
                        var productGroupCombo = productForm.getCombo("product_group_id");
                        ajaxGet("api/prodgroups", "", function(data){
                            if (data && data.success) {
                                productGroupCombo.addOption(data.data);
                                productGroupCombo.selectOption(productGroupCombo.getIndexByValue(rowData.product_group_id));
                            }
                        });                         
                        productForm.bind(productsGrid);
                        productForm.unbind(productsGrid);
                        productForm.attachEvent("onButtonClick", function(name){
                            switch (name){
                                case 'save': {                                    
                                    var data = productForm.getFormData(); 
                                    ajaxGet("api/products/" + selectedId + "/edit", data, function(data){
                                        if (data && data.success) {
                                            dhtmlx.alert({
                                                title:_("Wiadomość"),
                                                text:_("Zapisane!")
                                            });  
                                        }
                                    });                                                                
                                };break;
                            }
                        });
                    } else {
                        dhtmlx.alert({
                            title:_("Wiadomość"),
                            text:_("Wybierz produkt, który chcesz zmienic!")
                        });                         
                    }
                };break;
                case 'Del': {
                        productsGrid.deleteMyRecordById("api/products/");
                };break;   
                case 'Redo': {
                    productsGrid.fill();
                };break;
            }
        });        
        var productsGrid = productsLayout.cells("a").attachGrid({
            image_path:'codebase/imgs/',
            columns: [  
                //{id: "checked", type:"ch", width: 25},
                {label: _("Kod"), width: 100,id: "kod",type: "ed",sort: "str",  align: "left"},
                {label: _("Imie produktu"),width: 100,id: "name",type: "ed", sort: "str", align: "left"},
                {label: _("Typ produktu"), width: 100,id: "product_type_id", type: "coro", sort: "str", align: "left"},
                {label: _("Grupa produktu"),width: 100,id: "product_group_id", type: "coro",sort: "str", align: "left"},
                {label: _("Opakowanie"), width: 100, id: "pack", type: "ed", sort: "str", align: "left"}, 
                {label: _("Opis"), width: 100, id: "description", type: "ed", sort: "str", align: "left"},
                {label: _("Masa, kg"), width: 50, id: "weight", type: "edn", sort: "str", align: "left"},
                {label: _("Wysokość, mm"), width: 50, id: "height", type: "edn", sort: "str", align: "left"},
                {label: _("Szerokość, mm"), width: 50, id: "width", type: "edn", sort: "str", align: "left"},
                {label: _("Długość, mm"), width: 50, id: "length", type: "edn", sort: "str", align: "left"},
                {label: _("Powierzchnia, m2"), width: 50, id: "area", type: "edn", sort: "str", align: "left"}
            ],
            multiselect: true
        });
        productsGrid.setColValidators(["NotEmpty","NotEmpty"]);    
        productsGrid.attachHeader("#select_filter,#text_filter,#select_filter,#select_filter");
        var dpProductsGrid = new dataProcessor("api/products", "js");                
        dpProductsGrid.init(productsGrid);
        dpProductsGrid.enableDataNames(true);
        dpProductsGrid.setTransactionMode("REST");
        dpProductsGrid.enableDebug(true);    
        //dpProductsGrid.enablePartialDataSend(true);
        dpProductsGrid.setUpdateMode("row", true);
        dpProductsGrid.attachEvent("onBeforeDataSending", function(id, state, data){
            data.id = id;
            ajaxGet("api/products/" + id + "/edit", data, function(data){ 
                if (data && data.success) {
                    dpProductsGrid.setUpdated(productsGrid.getSelectedRowId(), false, "updated");
                }
            });
        }); 
        productsGrid.attachEvent("onKeyPress", function(code,cFlag,sFlag){
            if (code == 13) {
                try {                    
                    dpProductsGrid.sendData();
                    dpProductsGrid.setUpdated(productsGrid.getSelectedRowId(), false, "updated");
                } catch (e){
                    console.log(e);
                    dhtmlx.alert({
                        title:_("Wiadomość"),
                        text:_("Zmiany nie zostały zapisane. \n\
                                Wybierz produkt, który chcesz zmienic ta wprowadź zmiany ponownie!")
                    });
                }
            }                    
        });       
        var typeProductCombo = productsGrid.getCombo(2); 
        var groupProductCombo = productsGrid.getCombo(3);         
        productsGrid.fill = function(){	
            this.clearAll();
            ajaxGet("api/products", '', function(data){                                     
                if (data && data.success){                                    
                    productsGrid.parse(data.data, "js");
                }
            });                        
        };                
        productsGrid.fill(); 
/**
 * B
 */        

        var productFormStruct = [
            {type: "settings", position: "label-left", labelWidth: 115, inputWidth: 160},                 
            {type: "combo", name: "product_group_id",  required:true,  label: _("Grupa produktu"), options: []},		
            {type: "combo", name: "product_type_id", required:true,   label: _("Typ produktu"),   options: []},		
            {type: "input", name: "kod",     required:true,            label: _("Kod produktu")},
            {type: "input", name: "name",     required:true,          label: _("Nazwa produktu")},                                      
            {type: "input", name: "height",             label: _("Wysokość, mm")},
            {type: "input", name: "width",     required:true,          label: _("Szerokość, mm")},
            {type: "input", name: "length",             label: _("Długość, mm")},
            {type: "input", name: "weight",    required: true,         label: _("Masa, kg"), numberFormat:"0,000.00"},
            {type: "input", name: "area",      required:true,          label: _("Powierzchnia, m2"), numberFormat:"0,000.00"},
            {type: "input", name: "pack",        required:true,        label: _("Opakowanie")},
            {type: "input", name: "description",  required:true,       label: _("Opis"), rows: 3},
            {type: "block", name: "block",         blockOffset: 0, position: "label-left", list: [
                {type: "button", name: "save",   value: _("Zapisz"), offsetTop:18},                              
            ]}
        ];         
        var productForm = productsLayout.cells("b").attachForm(productFormStruct);
        var productTypeCombo = productForm.getCombo("product_type_id");
        var productGroupCombo = productForm.getCombo("product_group_id"); 
        productForm.attachEvent("onButtonClick", function(name){
            switch(name) {
                case "save": {
                    if (productsGrid.getSelectedRowId()){
                        try {                  
                            productForm.save(); 
                            dpProductsGrid.sendData();
                            dpProductsGrid.setUpdated(productsGrid.getSelectedRowId(), false, "updated");
                            dhtmlx.alert({
                                title:_("Wiadomość"),
                                text:_("Zapisane!")
                            });                        
                        } catch (e){
                            console.log(e);
                            dhtmlx.alert({
                                title:_("Wiadomość"),
                                text:_("Zmiany nie zostały zapisane. \n\
                                        Wybierz produkt, który chcesz zmienic ta wprowadź zmiany ponownie!")
                            });
                        }
                    } else {
                        ajaxPost("api/products", productForm.getFormData(), function(data) {
                            if (data && data.success) {
                                productsGrid.fill();
                                dhtmlx.alert({
                                    title:_("Wiadomość"),
                                    text:_("Zapisane!")
                                });                                          
                            } else {
                                dhtmlx.alert({
                                    title:_("Wiadomość"),
                                    text:_("Zmiany nie zostały zapisane. \n\
                                            Wprowadź ponownie!")
                                });                                         
                            }
                        });                      
                    }
                };break;              
            }
        });        
        productForm.bind(productsGrid); 
       
        
        ajaxGet("api/prodtypes", '', function(data) {
            if (data.success && data.data) {
                data.data.forEach(function(rec){
                    typeProductCombo.put(rec.id, rec.name);
                });
                productTypeCombo.addOption(data.data); 
            }
        });                
        ajaxGet("api/prodgroups", '', function(data) {
            if (data.success && data.data) {
                data.data.forEach(function(rec){
                    groupProductCombo.put(rec.id, rec.name);
                });
                productGroupCombo.addOption(data.data);
            }
        });         
    }
}

function addProduct() {
    
}

function addComponentForProduct() {
    
}

function addTaskForProduct(productId, tasksGrid) {    
    if (productId) {
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
            tasksCombo.addOption(data.data);
        });
        addingForm.attachEvent("onButtonClick", function(name){
            var data = this.getFormData();
            data.product_id = productId;
            if (name == "save") {
                ajaxPost("api/products/addtask", data, function(data){
                    if(data && data.success){
                        tasksGrid.fill(productId);                                                        
                    } else {
                        dhtmlx.alert({
                            title:_("Wiadomość"),
                            text:_("Zmiany nie zostały zapisane. \n\
                                    Wprowadź zmiany ponownie!")
                        });                                                         
                    }
                });
            }
        });
    } else {
        dhtmlx.alert({
            title:_("Wiadomość"),
            text:_("Wybierz produkt do którego chcesz dołączyć zadania!")
        });       
    }   
}

function deleteTaskForProduct(id, tasksGrid) {
    if (id) {
        dhtmlx.confirm({
            title: _("Ostrożność"),                                    
            text: _("Czy na pewno chcesz usunąć zadanie?"),
            callback: function(result){
                if (result) {                                        
                    var rowData = tasksGrid.getRowData(id);
                    ajaxGet("api/products/deletetask/" + rowData.product_id + "/" + rowData.task_id, "", function(data){
                        if (data && data.success) {
                            tasksGrid.deleteRow(id);
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
} 

function editTaskForProduct(id, productId, tasksGrid) {
    if (id) {
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
        var editWindow = createWindow(_("Zadania do produktow"), 300, 300);
        var editForm = createForm(formStruct, editWindow);
        var rowData = tasksGrid.getRowData(id);
        var tasksCombo = editForm.getCombo("task_id");
        ajaxGet("api/tasks", '', function(data){
            tasksCombo.addOption(data.data);
            tasksCombo.selectOption(tasksCombo.getIndexByValue(rowData.task_id));
        });
        editForm.setFormData(rowData);
        editForm.attachEvent("onButtonClick", function(name){
            var data = this.getFormData();
            data.product_id = productId;
            if (name == "save") {
                ajaxGet("api/products/tasks/" + productId +"/" + 
                        rowData.task_id + "/edit", data, function(data){
                    if (data && data.success){
                        tasksGrid.fill(productId);                                        
                    }
                });
            }
        });
    } else {
        dhtmlx.alert({
            title:_("Wiadomość"),
            text:_("Wybierz zadanie, które chcesz edytować!")
        });           
    }     
}

window.dhx4.attachEvent("onSidebarSelect", function (id, cell) {
    if (id == "products") {
        window.history.pushState({'page_id': id}, null, '#products');
        productsInit(cell);      
    }       
});