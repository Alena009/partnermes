var productsGrid;
var productsLayout;
var productForm;
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
        var productsGroupsToolBar;
        userCanWrite ? productsGroupsToolBar = productsLayout.cells("a").attachToolbar(standartToolbar):
                productsGroupsToolBar = productsLayout.cells("a").attachToolbar(emptyToolbar);
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
                    case 'Redo':{
                        productsGroupsTree.fill(); 
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
            var formStruct = [
                            {type:"fieldset",  offsetTop:0, label:_("Nowy typ produktu"), width:250, list:[                                                                          
                                    {type:"input",  name:"name",        label:_("Nazwa"), offsetTop:13, labelWidth:80},                                                                				
                                    {type:"input",  name:"description", label:_("Opis"),  offsetTop:13, labelWidth:80, rows: 3},                                                                				
                                    {type: "block", name: "block", blockOffset: 0, position: "label-left", list: [
                                        {type:"button", name:"save",    	value:_("Zapisz"),   		offsetTop:18},
                                        {type: "newcolumn"},
                                        {type:"button", name:"cancel",     	value:_("Anuluj"),   		offsetTop:18}
                                    ]}
                            ]}                                    
                        ];
            switch (btn){
                    case 'Add':{
                        var addingWindow = createWindow(_("Dodaj typ produktu"), 300, 300);
                        var addingForm = createForm(formStruct, addingWindow);
                        addingForm.attachEvent("onButtonClick", function(name){
                            if (name == 'save') {
                                typesProductsGrid.add("api/prodtypes", addingForm.getFormData());
                            }
                        });                                
                    };break;
                    case 'Edit':{
                        var id = typesProductsGrid.getSelectedRowId();
                        if (id) {
                            var addingWindow = createWindow(_("Edytuj typ produktu"), 300, 300);
                            var addingForm = createForm(formStruct, addingWindow);
                            var rowData = typesProductsGrid.getRowData(typesProductsGrid.getSelectedRowId());
                            addingForm.setFormData(rowData);
                            addingForm.attachEvent("onButtonClick", function(name){
                                if (name == 'save') {
                                    typesProductsGrid.edit("api/prodtypes/" + typesProductsGrid.getSelectedRowId() + "/edit", addingForm.getFormData());
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
                            typesProductsGrid.delete("api/prodtypes/" + id, id);                               
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
            ]                   
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
                        var rowData = productsGrid.getRowData(selectedId);
                        productsGrid.clearSelection();
                        productForm.setFormData(rowData);
                        productsLayout.cells("d").expand(); 
                        productForm.setItemValue("kod", "");
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
                        componentsGridToolbar = componentsLayout.cells("a").attachToolbar(standartToolbar);    
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
                                        addingForm.attachEvent("onButtonClick", function(name){
                                            if (name == "save") {
                                                componentsGrid.edit("api/components/" + selectedComponentId + "/edit", this.getFormData());
                                            }
                                        });                                              
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
                                        componentsGrid.delete("api/components/" + selectedComponentId, selectedComponentId);                                           
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
                            ajaxGet("api/products/" + id + "/components/" + localStorage.language, '', function(data){                                     
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
                    productForm.clear();                             
                    productsGrid.clearSelection();
                    productsLayout.cells("d").expand(); 
                    productForm.setItemFocus(productForm.getFirstActive());                                              
                };break;
                case 'Edit': {
                    var selectedId = productsGrid.getSelectedRowId();
                    if (selectedId) {    
                        productsLayout.cells("d").expand();
                        productForm.setItemFocus(productForm.getFirstActive()); 
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
                            productsGrid.delete("api/products/" + productId, productId);                                                                                            
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
            productsGrid.fill("api/prodgroups/" + i + "/products/" + localStorage.language, 
                                    productsGridToolBar);
        }; 
        productsGrid.zaladuj(0);
/**
 * D
 */                        
        var productForm = createForm(productFormStruct, productsLayout.cells("d")); 
        var productTypeCombo = productForm.getCombo("product_type_id");
        ajaxGet("api/prodtypes", "", function(data){
            productTypeCombo.addOption(data.data);                
        });         
        var productGroupCombo = productForm.getCombo("product_group_id");
        ajaxGet("api/prodgroups", "", function(data){
            productGroupCombo.addOption(data.data);        
        }); 
        productForm.attachEvent("onButtonClick", function(name){
            switch(name) {
                case "save": {
                    var id = productsGrid.getSelectedRowId();
                    if (id){                        
                        productsGrid.edit("api/products/" + id + "/edit", productForm.getFormData());
                    } else {                        
                        productsGrid.add("api/products", productForm.getFormData());                                                                      
                    }                    
                };break;              
            }
        });   
        if (!userCanWrite) productForm.hideItem('save');
        productForm.bind(productsGrid);                                  
    }
}

function addTaskForProduct(productId, tasksGrid) {    
    var addingForm = addTask(productId);
    addingForm.attachEvent("onButtonClick", function(name){
        var data = this.getFormData();
        data.product_id = productId;
        if (name == "save") {
            tasksGrid.add("api/products/addtask", data);
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