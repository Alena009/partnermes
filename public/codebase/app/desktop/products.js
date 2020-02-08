var productsGrid;
var productsLayout;
var productsForm;
var products;

function productsInit(cell) {
    if (productsLayout == null) {  
        var userCanWrite;
        var userData = JSON.parse(localStorage.getItem("userData")); 
        userData.permissions.forEach(function(elem){
            if (elem.name === "products") {
                userCanWrite = elem.pivot.value;
            }
        });            
        var productsLayout = cell.attachLayout("4A");
        productsLayout.cells("a").setText(_("Grupy produktów")); 
        productsLayout.cells("b").setText(_("Typy produktów"));
        productsLayout.cells("b").setWidth(280);        
        productsLayout.cells("c").setText(_("Produkty"));        
        productsLayout.cells("d").setText(_("Informacja o produktu"));         
        productsLayout.cells("d").setWidth(300);         
/**
 * A
 */             
        var productsGroupsToolBar = getProductsGroupsToolBar(productsLayout.cells("a"), userCanWrite);       
        productsGroupsToolBar.attachEvent("onClick", function(btn) {
            switch (btn){
                    case 'Add':{			                                        
                            createAddEditGroupWindow("api/prodgroups", 
                                "api/prodgroups", productsGroupsTree, 0);                            
                    };break;
                    case 'Edit':{
                        var id = productsGroupsTree.getSelectedId();
                        if (id) {                                        
                            createAddEditGroupWindow("api/prodgroups", 
                                "api/prodgroups/" + id + "/edit", productsGroupsTree, id);                         
                        }
                    };break;
                    case 'Del':{
                        var id = productsGroupsTree.getSelectedId();
                        if (id) {
                            deleteNodeFromTree(productsGroupsTree, "api/prodgroups/" + id);
                        }
                    };break;
                    case 'Tasks':{
                        var groupId = productsGroupsTree.getSelectedId();
                        if (groupId) {
                            tasksModule(groupId);
                        } else {
                            dhtmlx.alert({
                                title:_("Wiadomość"),
                                text:_("Wybierz grupę!")
                            });  
                        }                              
                    };break;
                    case 'Redo':{
                        
                    };break;                    
            }
        });
        var productsGroupsTree = productsLayout.cells("a").attachTreeView(treeStruct);                 
        productsGroupsTree.attachEvent("onDrop",function(id){			
                var parent_id = arguments[1];
                parent_id = (parent_id) ? parent_id + '' : '';
                var data = {
                    id: id,
                    parent_id: parent_id
                };                        
                ajaxGet("api/prodgroups/" + id + "/edit?", data, ''); 
        });  
        productsGroupsTree.attachEvent("onSelect",function(id, mode){  
            if (mode) {
                productsGrid.zaladuj(id);                              
            }
        });    
        productsGroupsTree.fill = function(i=null){	
            ajaxGet("api/prodgroups/grupytree/" + localStorage.language, '', function(data) {                    
                if (data && data.success){      
                    productsGroupsTree.clearAll();                            
                    productsGroupsTree.loadStruct(data.data);                           
                }                    
            });
        };
        productsGroupsTree.fill();  
/**
 * B
 */        
        var typesProductsGridToolBar;
        userCanWrite ? typesProductsGridToolBar = productsLayout.cells("b").attachToolbar(standartToolbar):
                typesProductsGridToolBar = productsLayout.cells("b").attachToolbar(emptyToolbar);
        
        typesProductsGridToolBar.attachEvent("onClick", function(btn) {
            switch (btn){
                    case 'Add':{
                        var addingWindow = createWindow(_("Dodaj typ produktu"), 300, 300);
                        var addingForm = createForm([
                            {type:"fieldset",  offsetTop:0, label:_("Nowy typ produktu"), width:250, list:[                                                                          
                                    {type:"input",  name:"name",        label:_("Nazwa"), offsetTop:13, labelWidth:80},                                                                				
                                    {type:"input",  name:"description", label:_("Opis"),  offsetTop:13, labelWidth:80, rows: 3},                                                                				
                                    {type: "block", name: "block", blockOffset: 0, position: "label-left", list: [
                                        {type:"button", name:"save",    	value:_("Zapisz"),   		offsetTop:18},
                                        {type: "newcolumn"},
                                        {type:"button", name:"cancel",     	value:_("Anuluj"),   		offsetTop:18}
                                    ]}
                            ]}                                    
                        ], addingWindow);
                        addingForm.attachEvent("onButtonClick", function(name){
                            if (name == 'save') {
                                ajaxPost("api/prodtypes", addingForm.getFormData(), function(data){
                                    if (data && data.success) {
                                        typesProductsGrid.addRow(data.data.id, [data.data.name, data.data.description]);   
                                    } else {
                                        dhtmlx.alert({
                                            title:_("Wiadomość"),
                                            text:_("Błąd! Zmiany nie zostały zapisane")
                                        });
                                    }
                                });
                            }
                        });                                
                    };break;
                    case 'Edit':{
                        var id = typesProductsGrid.getSelectedRowId();
                        if (id) {
                            var addingWindow = createWindow(_("Edytuj typ produktu"), 300, 300);
                            var addingForm = createForm([
                                {type:"fieldset",  offsetTop:0, label:_("Edytuj typ produktu"), width:250, list:[                                                                          
                                        {type:"input",  name:"name",        label:_("Nazwa"), offsetTop:13, labelWidth:80},                                                                				
                                        {type:"input",  name:"description", label:_("Opis"),  offsetTop:13, labelWidth:80, rows: 3},                                                                				
                                        {type: "block", name: "block", blockOffset: 0, position: "label-left", list: [
                                            {type:"button", name:"save",    	value:_("Zapisz"),   		offsetTop:18},
                                            {type: "newcolumn"},
                                            {type:"button", name:"cancel",     	value:_("Anuluj"),   		offsetTop:18}
                                        ]}
                                ]}                                    
                            ], addingWindow);
                            var rowData = typesProductsGrid.getRowData(typesProductsGrid.getSelectedRowId());
                            addingForm.setFormData(rowData);
                            addingForm.attachEvent("onButtonClick", function(name){
                                if (name == 'save') {
                                    ajaxGet("api/prodtypes/" + typesProductsGrid.getSelectedRowId() + "/edit", addingForm.getFormData(), function(data){
                                        if (data && data.success) {                                            
                                            typesProductsGrid.setRowData(data.data.id, data.data);
                                            addingWindow.close();
                                        } else {
                                            dhtmlx.alert({
                                                title:_("Wiadomość"),
                                                text:_("Błąd! Zmiany nie zostały zapisane")
                                            });
                                        }
                                    });
                                }
                            });  
                        } else {
                            dhtmlx.message({
                                title:_("Wiadomość"),
                                type:"alert",
                                text:_("Wybierz pozycję w tabeli!")
                            });                                     
                        }
                    };break;                            
                    case 'Del':{
                        var id = typesProductsGrid.getSelectedRowId();
                        if (id) {
                            dhtmlx.confirm({
                            title:_("Ostrożność"),                                    
                            text:_("Czy na pewno chcesz usunąć typ?"),
                            callback: function(result){
                                        if (result) {
                                            ajaxDelete("api/prodtypes/" + id, "", function(data){
                                                if (data && data.success){
                                                    typesProductsGrid.deleteRow(id);
                                                } else {
                                                    dhtmlx.alert({
                                                        title:_("Wiadomość"),
                                                        text:_("Błąd! Zmiany nie zostały zapisane")
                                                    });                                            
                                                }
                                            }); 
                                        }
                                    }
                                });                                
                        } else {
                            dhtmlx.message({
                                title:_("Wiadomość"),
                                type:"alert",
                                text:_("Wybierz pozycję w tabeli!")
                            });                                    
                        }
                    };break;
                    case 'Redo': {
                            typesProductsGrid.fill();
                    };break;
            }
        });               
        var typesProductsGrid = productsLayout.cells("b").attachGrid({
            image_path:'codebase/imgs/',
            columns: [
                {
                    label: _("Imie"),
                    id: "name",
                    width: 100,
                    type: "ed", 
                    sort: "str", 
                    align: "left"     
                },                                                
                {
                    label: _("Opis"),
                    id: "description",
                    width: 300,
                    type: "txt", 
                    sort: "str", 
                    align: "left"     
                }                          
            ],
            multiselect: true                    
        });
        typesProductsGrid.attachEvent("onRowSelect", function() {
            var id = typesProductsGrid.getSelectedRowId();
            if (productsGroupsTree.getSelectedId()) {
                productsGrid.filterBy(10, productsGroupsTree.getSelectedId());
            }
            productsGrid.filterBy(9, id);
        });        
        typesProductsGrid.fill = function() {    
            this.clearAll();
            ajaxGet("api/prodtypes", "", function(data){
                if (data && data.success){                    
                    typesProductsGrid.parse(data.data, "js");
                }
            });	                    
        };                  
        typesProductsGrid.fill();
/**
 * C
 */       
        var productsGridToolBar;
        if (userCanWrite) {
            productsGridToolBar = productsLayout.cells("c").attachToolbar({
                    iconset: "awesome",
                    items: [                           
                            {id: "Add",  type: "button", text: _("Dodaj"),  img: "fa fa-plus-square "},
                            {id: "Edit", type: "button", text: _("Edytuj"), img: "fa fa-edit"},
                            {id: "Del",  type: "button", text: _("Usuń"),   img: "fa fa-minus-square"},
                            {type: "separator",   id: "sep3"}, 
                            {id: "Copy", type: "button", text: _("Kopiuj"), img: "fa fa-clone"},
                            {type: "separator",   id: "sep4"}, 
                            {id: "Tasks",     text: _("Zadania"),    type: "button", img: "fa fa-file-text-o "},
                            {id: "Components",text: _("Komponenty"), type: "button", img: "fa fa-puzzle-piece "},
                            {type: "separator",   id: "sep2"},                           
                            {id: "Redo", type: "button", text: _("Odśwież"),img: "fa fa-refresh"}
                    ]                    
            }); 
        } else {
            productsGridToolBar = productsLayout.cells("c").attachToolbar(emptyToolbar); 
        }
        productsGridToolBar.attachEvent("onClick", function(name) {           
            switch (name){
                case 'Copy': {
                    var selectedId = productsGrid.getSelectedRowId();
                    if (selectedId) {                        
                        var productWindow = createWindow(_("Produkt"), 550, 400);                                                
                        var productForm   = createForm(productFormStruct, productWindow);  
                        var rowData       = productsGrid.getRowData(selectedId);
                        productForm.setFormData(rowData);
                        var productTypeCombo = productForm.getCombo("product_type_id");
                        ajaxGet("api/prodtypes", "", function(data){
                            productTypeCombo.addOption(data.data);        
                            productTypeCombo.selectOption(productTypeCombo.getIndexByValue(rowData.product_type_id));        
                        });         
                        var productGroupCombo = productForm.getCombo("product_group_id");
                        ajaxGet("api/prodgroups", "", function(data){
                            productGroupCombo.addOption(data.data);
                            productGroupCombo.selectOption(productGroupCombo.getIndexByValue(rowData.product_group_id));        
                        });                                                                                                                        
                        productForm.setItemValue("kod", "");    
                        productForm.attachEvent("onButtonClick", function(name){
                            if (name === 'save'){                                  
                                addProduct(productForm.getFormData(), productsGrid);                                                                           
                            }
                        });
                    } else {
                        dhtmlx.alert({
                            title:_("Wiadomość"),
                            text:_("Wybierz produkt!")
                        });                         
                    }                                                                
                };break; 
                case 'Tasks': {
                    var productId = productsGrid.getSelectedRowId();
                    if (productId) {
                        var tasksWindow = createWindow(_("Zadania"), 500, 500);  
                        var tasksLayout = tasksWindow.attachLayout("1C");
                        tasksLayout.cells("a").hideHeader();
                        var tasksGridToolbar = tasksLayout.cells("a").attachToolbar(standartToolbar);
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
                                    var rowData = tasksGrid.getRowData(tasksGrid.getSelectedRowId());
                                    if (rowData.for_group) {
                                        dhtmlx.alert({
                                            title:_("Wiadomość"),
                                            text:_("Te zadanie należe do grupy nie można go tu usunąć!")
                                        });
                                    } else {
                                        var productId = tasksGrid.getSelectedRowId();
                                        deleteTaskForProduct(productId, tasksGrid);                                         
                                    }                                                              
                                };break;
                                case "Redo": {
                                    var selectedProductId = productsGrid.getSelectedRowId();
                                    tasksGrid.fill(selectedProductId);                           
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
                                {id: "for_group"}
                            ]
                        }); 
                        tasksGrid.setColumnHidden(3,true);
                        tasksGrid.setColumnHidden(4,true);
                        tasksGrid.setColumnHidden(5,true);
                        tasksGrid.setColumnHidden(7,true);
                        tasksGrid.enableDragAndDrop(true);
                        tasksGrid.attachEvent("onRowCreated", function(rId,rObj,rXml){
                            var data = tasksGrid.getRowData(rId);
                            //task for group
                            if (data.for_group == 1) {
                                tasksGrid.setRowColor(rId, "lightgray");
                            } 
                        });                         
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
                                            {type: "input", name: "height",     required: true, label: _("Wymiar 1")},
                                            {type: "input", name: "width",      required: true, label: _("Wymiar 2")},
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
                                {label: _("Ilość"),width: 50,id: "amount",type: "ed", sort: "str", align: "left"},
                                {label: _("Wymiar 1"),width: 50,id: "height",type: "ed", sort: "str", align: "left"},
                                {label: _("Wymiar 2"),width: 50,id: "width",type: "ed", sort: "str", align: "left"},
                                {id: "product_id"},
                                {id: 'component_id'}
                            ]
                        });  
                        componentsGrid.setColumnHidden(7,true);
                        componentsGrid.setColumnHidden(8,true);
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
                    var productForm = getProductForm(productWindow);                                              
                    productForm.attachEvent("onButtonClick", function(name){
                        if (name === 'save'){
                            addProduct(productForm.getFormData(), productsGrid);                                
                        }
                    });                    
                };break;
                case 'Edit': {
                    var selectedId = productsGrid.getSelectedRowId();
                    if (selectedId) {                        
                        var productWindow = createWindow(_("Produkt"), 550, 400);                                                
                        var productForm   = createForm(productFormStruct, productWindow);  
                        var rowData       = productsGrid.getRowData(selectedId);
                        productForm.setFormData(rowData);
                        var productTypeCombo = productForm.getCombo("product_type_id");
                        ajaxGet("api/prodtypes", "", function(data){
                            productTypeCombo.addOption(data.data);        
                            productTypeCombo.selectOption(productTypeCombo.getIndexByValue(rowData.product_type_id));        
                        });         
                        var productGroupCombo = productForm.getCombo("product_group_id");
                        ajaxGet("api/prodgroups", "", function(data){
                            productGroupCombo.addOption(data.data);
                            productGroupCombo.selectOption(productGroupCombo.getIndexByValue(rowData.product_group_id));        
                        });  
                        productForm.attachEvent("onButtonClick", function(name){
                            if (name === 'save'){
                                editProduct(productForm.getFormData(), selectedId, productsGrid); 
                                productWindow.close();
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
                        var productId = productsGrid.getSelectedRowId();                            
                        if (productId) {                           
                            dhtmlx.confirm({
                                title: _("Ostrożność"),                                    
                                text: _("Czy na pewno chcesz usunąć?"),
                                callback: function(result){
                                    if (result) {                                                                                    
                                        ajaxDelete("api/products/" + productId, "", function(data){
                                            if (data && data.success){                                                    
                                                productsGrid.deleteRow(productId);
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
                                text:_("Wybierz produkt, który chcesz usunąć!")
                            });
                        }                     
                };break;   
                case 'Redo': {                    
                    productsGrid.zaladuj(0);                    
                    productsGroupsTree.unselectItem(productsGroupsTree.getSelectedId());
                    typesProductsGrid.fill();                    
                };break;
            }
        });        
        var productsGrid = productsLayout.cells("c").attachGrid({
            image_path:'codebase/imgs/',
            columns: [  
                //{id: "checked", type:"ch", width: 25},
                {label: _("Kod"), width: 100,id: "kod",type: "ed",sort: "str",  align: "left"},
                {label: _("Imie produktu"),width: 100,id: "name",type: "ed", sort: "str", align: "left"},                
                {label: _("Opakowanie"), width: 100, id: "pack", type: "ed", sort: "str", align: "left"}, 
                {label: _("Opis"), width: 100, id: "description", type: "ed", sort: "str", align: "left"},
                {label: _("Masa, kg"), width: 50, id: "weight", type: "edn", sort: "str", align: "left"},
                {label: _("Wysokość, mm"), width: 50, id: "height", type: "edn", sort: "str", align: "left"},
                {label: _("Szerokość, mm"), width: 50, id: "width", type: "edn", sort: "str", align: "left"},
                {label: _("Długość, mm"), width: 50, id: "length", type: "edn", sort: "str", align: "left"},
                {label: _("Powierzchnia, m2"), width: 50, id: "area", type: "edn", sort: "str", align: "left"},
                {id: "product_type_id"},
                {id: "product_group_id"},
                {id: "product_type_name"},
                {id: "product_group_name"}
            ]
        });   
        productsGrid.setColumnHidden(9,true);
        productsGrid.setColumnHidden(10,true);     
        productsGrid.setColumnHidden(11,true);
        productsGrid.setColumnHidden(12,true);        
        productsGrid.attachHeader("#text_filter,#text_filter,#select_filter,#select_filter");        
        productsGrid.setRegFilter(productsGrid, 0);    
        productsGrid.setRegFilter(productsGrid, 1);                                 
        productsGrid.zaladuj = (i = 0) => {	              
            productsGrid.fill("api/prodgroups/products/" + i + "/" + localStorage.language, 
                                    productsGridToolBar);
        }; 
        productsGrid.zaladuj(0);
/**
 * D
 */                
        var productForm = getProductForm(productsLayout.cells("d"));        
        productForm.attachEvent("onButtonClick", function(name){
            switch(name) {
                case "save": {
                    if (productsGrid.getSelectedRowId()){                        
                        editProduct(productForm.getFormData(), productsGrid.getSelectedRowId(), productsGrid);
                    } else {                        
                        addProduct(productForm.getFormData(), productsGrid);                                                                      
                    }
                };break;              
            }
        });   
        if (!userCanWrite) productForm.hideItem('save');
        productForm.bind(productsGrid);                                  
    }
}

function getProductForm(container) {
    var productForm = createForm(productFormStruct, container); 
    var productTypeCombo = productForm.getCombo("product_type_id");
    ajaxGet("api/prodtypes", "", function(data){
        productTypeCombo.addOption(data.data);                
    });         
    var productGroupCombo = productForm.getCombo("product_group_id");
    ajaxGet("api/prodgroups", "", function(data){
        productGroupCombo.addOption(data.data);        
    });     
    
    return productForm;
}

function addProduct(data, grid) {
    ajaxPost("api/products", data, function(data) {
        if (data && data.success) {
            grid.addRow(data.data.id, '');
            grid.setRowData(data.data.id, data.data);                                         
        } else {
            dhtmlx.alert({
                title:_("Wiadomość"),
                text:_("Zmiany nie zostały zapisane. \n\
                        Wprowadź ponownie!")
            });                                         
        }
    });     
}

function editProduct(data, id, grid) {
    ajaxGet("api/products/" + id + "/edit", data, function(data){
        if (data && data.success) {
            grid.setRowData(data.data.id, data.data);
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

function addTaskForProduct(productId, tasksGrid) {    
    var addingForm = addTask(productId);
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

window.dhx4.attachEvent("onSidebarSelect", function (id, cell) {
    if (id == "products") {
        window.history.pushState({'page_id': id}, null, '#products');
        productsInit(cell);      
    }       
});