var productsGrid;
var productsLayout;
var productsForm;

function productsInit(cell) {
    if (productsLayout == null) {      
        var productsLayout = cell.attachLayout("3J");
        productsLayout.cells("a").hideHeader();
        productsLayout.cells("b").hideHeader();
        productsLayout.cells("b").setCollapsedText(_("Informacja o produktu"));
        productsLayout.cells("c").hideHeader();  
        productsLayout.cells("b").setWidth(300);
            var optionsTabbar = productsLayout.cells("c").attachTabbar(); 
            optionsTabbar.addTab("a1", _("Componenty"), null, null, true);
            optionsTabbar.addTab("a2", _("Zadania"));
            optionsTabbar.addTab("a3", _("Zdjęcia")); 
                var componentsLayout = optionsTabbar.tabs("a1").attachLayout("1C"); 
                componentsLayout.cells("a").hideHeader();
                var zleceniaForProductLayout = optionsTabbar.tabs("a2").attachLayout("1C"); 
                zleceniaForProductLayout.cells("a").hideHeader();           
        
        var productsGridToolBar = productsLayout.cells("a").attachToolbar({
                iconset: "awesome",
                items: [
                        {type: "text", id: "title", text: _("Produkty")},
                        {type: "spacer"},
                        {id: "Add", type: "button", img: "fa fa-plus-square "},
                        //{id: "Edit", type: "button", img: "fa fa-edit"},
                        {id: "Del", type: "button", img: "fa fa-minus-square"}				                               
                ]                    
        });
        productsGridToolBar.attachEvent("onClick", function(name) {           
            switch (name){
                case 'Add': {  
                    var productWindow = createWindow(_("Produkt"), 550, 400);
                    var productForm = createForm(newProductFormStruct, productWindow);                          
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
                                    }
                                }); 
                            };break;
                        }
                    });                    
                };break;
//                case 'Edit': {  
//                    var productWindow = createWindow(_("Produkt"), 550, 400);
//                    var productForm = createForm(newProductFormStruct, productWindow); 
//                    
//                    var selectedId = productsGrid.getSelectedRowId();
//                    if (selectedId) {
//                        var rowData = productsGrid.getRowData(selectedId);
//                        var productTypeCombo = productForm.getCombo("product_type_id");
//                        ajaxGet("api/prodtypes", "", function(data){
//                            if (data && data.success) {                        
//                                productTypeCombo.addOption(data.data); 
//                                productTypeCombo.selectOption(productTypeCombo.getIndexByValue(rowData.product_type_id));
//                            }
//                        });
//                        var productGroupCombo = productForm.getCombo("product_group_id");
//                        ajaxGet("api/prodgroups", "", function(data){
//                            if (data && data.success) {
//                                productGroupCombo.addOption(data.data);
//                                productGroupCombo.selectOption(productGroupCombo.getIndexByValue(rowData.product_group_id));
//                            }
//                        });                         
//                        productForm.bind(productsGrid);
//                        productForm.unbind(productsGrid);
//                        productForm.attachEvent("onButtonClick", function(name){
//                            switch (name){
//                                case 'save': {                                    
//                                    var data = productForm.getFormData(); 
//                                    console.log(data);
//                                    ajaxGet("api/products/" + selectedId + "/edit", data, function(data){
//                                        if (data && data.success) {
//                                           console.log(data.data);
//                                        }
//                                    });                                                                
//                                };break;
//                            }
//                        });
//                    } else {
//                        dhtmlx.alert({
//                            title:_("Wiadomość"),
//                            text:_("Wybierz produkt, który chcesz zmienic!")
//                        });                         
//                    }
//                };break;
                case 'Del': {
                    var selectedRows = productsGrid.getSelectedRowId();                    
                    //var selectedRows = productsGrid.getCheckedRows(0);                    
                        if (selectedRows) {
                        productsGrid.deleteSelectedRows();
                        //console.log(selectedRows);
                        dhtmlx.confirm({
                            title: _("Ostrożność"),                                    
                            text: _("Czy na pewno chcesz usunąć ten produkt/produkty?"),
                            callback: function(result){
                                if (result) {                                     
                                    ajaxGet("api/products/deleteseveral/" + selectedRows,'', function(data){
                                        if (data && data.success) {
                                            
                                        } else {
                                            dhtmlx.alert({
                                                title:_("Wiadomość"),
                                                text:_("Nie udało się usunąć produkt!")
                                            }); 
                                        }
                                    }); 
                                }
                            }
                        });                                                  
                    } else {
                        dhtmlx.alert({
                            title:_("Wiadomość"),
                            text:_("Wybierz produkt/produkty, który chcesz usunąć!")
                        });                        
                    }
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
                {id: "product_type_id"},
                {id: "product_group_id"}
            ],
            multiselect: true
        });
        
        productsGrid.setColValidators(["NotEmpty","NotEmpty","NotEmpty","NotEmpty"]);  
        productsGrid.setColumnHidden(4, true);
        productsGrid.setColumnHidden(5, true);
        productsGrid.attachHeader(",#select_filter,#text_filter,#select_filter,#select_filter");
        productsGrid.attachEvent("onRowSelect", function(id, ind) {
            componentsGrid.filterBy(5,id);     
            zleceniaForProductGrid.filterBy(3,id);     
        }); 
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
                console.log(data);
            });
        });    
        productsGrid.attachEvent("onKeyPress", function(code,cFlag,sFlag){
            if (code == 13) {
                try {
                    //dpProductsGrid.setUpdated(productsGrid.getSelectedRowId(), true, "updated");
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
        productsGrid.fill = function(){	
            this.clearAll();
            ajaxGet("api/products", '', function(data){                                     
                if (data && data.success){                                    
                    productsGrid.parse(data.data, "js");
                }
            });                        
        };                
        productsGrid.fill(); 
                 
        productFormToolBar = productsLayout.cells("b").attachToolbar({
                iconset: "awesome",
                items: [
                        {type: "text", id: "title", text: _("Informacja o produktu")},
                        {type: "spacer"},								
                        {id: "Hide", type: "button", img: "fa fa-arrow-right"} 
                ]                    
        });  
        productFormToolBar.attachEvent("onClick", function(id) { 
            if (id == 'Hide') {
                productsLayout.cells("b").collapse();
            }                    
        });         
        var newProductFormStruct = [
            {type: "settings", position: "label-left", labelWidth: 115, inputWidth: 160},
            //{type: "container", name: "photo", label: "", inputWidth: 160, inputHeight: 160, offsetTop: 20, offsetLeft: 65},
            //{type: "input", name: "date_end",     label: "Due date", offsetTop: 20},                    
            {type: "combo", name: "product_group_id", required: true, label: _("Grupa produktu"), options: []},		
            {type: "combo", name: "product_type_id",  required: true, label: _("Typ produktu"),   options: []},		
            {type: "input", name: "kod",              required: true, label: _("Kod produktu")},
            {type: "input", name: "name",             required: true, label: _("Imie produktu")},                                      
            {type: "input", name: "height",                           label: _("Wysokość, mm")},
            {type: "input", name: "width",                            label: _("Szerokość, mm")},
            {type: "input", name: "length",                           label: _("Długość, mm")},
            {type: "input", name: "weight",           required: true, label: _("Masa, kg")},
            {type: "input", name: "area",             required: true, label: _("Powierzchnia, m2")},
            {type: "input", name: "pack",             required: true, label: _("Opakowanie")},
            {type: "input", name: "description",      required: true, label: _("Opis"), rows: 3},
            {type: "block", name: "block",         blockOffset: 0, position: "label-left", list: [
                {type: "button", name: "save",     value: "Zapisz", offsetTop:18},                
                {type: "newcolumn"},
                {type:"button",  name: "cancel", value: "Anuluj", offsetTop:18}
            ]}
        ]; 
        var productFormStruct = [
            {type: "settings", position: "label-left", labelWidth: 115, inputWidth: 160},
            //{type: "container", name: "photo", label: "", inputWidth: 160, inputHeight: 160, offsetTop: 20, offsetLeft: 65},
            //{type: "input", name: "date_end",     label: "Due date", offsetTop: 20},                    
            {type: "combo", name: "product_group_id",  required:true,  label: _("Grupa produktu"), options: []},		
            {type: "combo", name: "product_type_id", required:true,   label: _("Typ produktu"),   options: []},		
            {type: "input", name: "kod",     required:true,            label: _("Kod produktu")},
            {type: "input", name: "name",     required:true,          label: _("Nazwa produktu")},                                      
            {type: "input", name: "height",             label: _("Wysokość, mm")},
            {type: "input", name: "width",     required:true,          label: _("Szerokość, mm")},
            {type: "input", name: "length",             label: _("Długość, mm")},
            {type: "input", name: "weight",             label: _("Masa, kg")},
            {type: "input", name: "area",      required:true,          label: _("Powierzchnia, m2")},
            {type: "input", name: "pack",        required:true,        label: _("Opakowanie")},
            {type: "input", name: "description",  required:true,       label: _("Opis"), rows: 3},
            {type: "block", name: "block",         blockOffset: 0, position: "label-left", list: [
                {type: "button", name: "save",   value: "Zapisz zmiany", offsetTop:18},                
                {type: "newcolumn"},
                {type:"button",  name: "cancel", value: "Anuluj", offsetTop:18}
            ]}
        ];         
        var productForm = productsLayout.cells("b").attachForm(productFormStruct);         
        productForm.bind(productsGrid);   
        productForm.attachEvent("onButtonClick", function(id){
            if (id == "save") {
                try {                  
                    productForm.save(); 
                    dpProductsGrid.sendData();
                    dpProductsGrid.setUpdated(productsGrid.getSelectedRowId(), false, "updated");
                } catch (e){
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
        var productTypeCombo = productForm.getCombo("product_type_id");
        var productGroupCombo = productForm.getCombo("product_group_id");
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
            
        var componentsGridToolbar = componentsLayout.cells("a").attachToolbar({
                iconset: "awesome",
                items: [
                    {id:"Add", type:"button", text: _("Dodaj"),  img: "fa fa-plus-square"},
                    {id:"Edit",type:"button", text: _("Edytuj"), img: "fa fa-edit"},
                    {id:"Del", type:"button", text: _("Usun"),   img: "fa fa-minus-square"}
                ]                    
        }); 
        componentsGridToolbar.attachEvent("onClick", function(id) {
            var formStruct = [
                            {type: "settings", position: "label-left", labelWidth: 115, inputWidth: 160},
                            {type: "combo", name: "component_id", required: true, label: _("Produkt"), options: [{text: "", value: "0"}]},		
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
                                        //componentsGrid.fill(selectedProductId);                                        
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
                                componentsGrid.deleteRow();
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
                {label: _("Kod"), width: 100, id: "kod",  type: "ed", sort: "str", align: "left"},
                {label: _("Nazwa komponentu"), width: 100, id: "name", type: "ed", sort: "str", align: "left"},
                {label: _("Typ"), width: 100, id: "product_type_name", type: "ed", sort: "str", align: "left"},
                {label: _("Group"),width: 100,id: "product_group_name",type: "ed", sort: "str", align: "left"},                        
                {label: _("Ilość"),width: 100,id: "amount",type: "ed", sort: "str", align: "left"},
                {id: "product_id"},
                {id: 'component_id'}
            ]
        });
        componentsGrid.setColumnHidden(5,true);
        componentsGrid.setColumnHidden(6,true);
        componentsGrid.fill = function(){	
            componentsGrid.clearAll();
            ajaxGet("api/components", '', function(data){                                     
                if (data && data.success){
                    componentsGrid.parse((data.data), "js");
                }
            });                        
        }; 
        componentsGrid.fill();
        var dpComponentsGrid = new dataProcessor("api/components", "js");                
        dpComponentsGrid.init(componentsGrid);
        dpComponentsGrid.enableDataNames(true);
        dpComponentsGrid.setTransactionMode("REST");
        dpComponentsGrid.enablePartialDataSend(true);
        dpComponentsGrid.enableDebug(true);
        dpComponentsGrid.setUpdateMode("row", true);
        dpComponentsGrid.attachEvent("onBeforeDataSending", function(id, state, data){
            data.id = id;
            ajaxGet("api/components/" + id + "/edit", data, function(data){                                                            
                console.log(data);
            });
        }); 

        var zleceniaForProductGridToolbar = zleceniaForProductLayout.cells("a").attachToolbar({
                iconset: "awesome",
                items: [
                    {id:"Add", type:"button", text: _("Dodaj"),  img: "fa fa-plus-square"},
                    {id:"Edit",type:"button", text: _("Edytuj"), img: "fa fa-edit"},
                    {id:"Del", type:"button", text: _("Usun"),   img: "fa fa-minus-square"}
                ]                    
        });    
        zleceniaForProductGridToolbar.attachEvent("onClick", function(name) {
            var formStruct = [
                            {type: "settings", position: "label-left", labelWidth: 115, inputWidth: 160},
                            {type: "combo", name: "task_id",  required: true, label: _("Zlecenie"), options: []},		
                            {type: "input", name: "duration", required: true, label: _("Czas")},
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
                        var addingWindow = createWindow(_("Componenty"), 300, 300);
                        var addingForm = createForm(formStruct, addingWindow);
                        var tasksCombo = addingForm.getCombo("task_id");
                        tasksCombo.enableFilteringMode(true);
                        ajaxGet("api/tasks", '', function(data){
                            tasksCombo.addOption(data.data);
                        });
                        addingForm.attachEvent("onButtonClick", function(name){
                            var data = this.getFormData();
                            data.product_id = selectedProductId;
                            if (name == "save") {
                                ajaxPost("api/products/addtask", data, function(data){
                                    if(data && data.success){
                                        zleceniaForProductGrid.fill(selectedProductId);
                                        addingForm.setItemFocus("task_id");
                                    }
                                });
                            }
                        });
                    }
                };break;
                case "Del": {
                    var selectedId = zleceniaForProductGrid.getSelectedRowId();
                    if (selectedId) {
                        ajaxDelete("api/productstasks/" + selectedId, "", function(data){
                            if (data && data.success) {
                                zleceniaForProductGrid.deleteRow();
                            }
                        });    
                    }                            
                };break;
            }
        });  
        var zleceniaForProductGrid = zleceniaForProductLayout.cells("a").attachGrid({
            image_path:'codebase/imgs/',
            columns: [                        
                {label: _("Kod"),width: 100,id: "task_kod", type: "ro", sort: "str", align: "left"},
                {label: _("Zadania"),width: 100, id: "task_name", type: "ro", sort: "str", align: "left"},
                {label: _("Czasy, min"), width: 100,  id: "duration", type: "ed", sort: "str", align: "left"},
                {id: "product_id"}
            ],
                multiselect: true
        });
        zleceniaForProductGrid.setColumnHidden(3,true);
        zleceniaForProductGrid.fill = function(){	
            zleceniaForProductGrid.clearAll();
            ajaxGet("api/products/tasks", '', function(data){                                     
                if (data && data.success){
                    zleceniaForProductGrid.parse((data.data), "js");
                }
            });                        
        };    
        zleceniaForProductGrid.fill();
        var dpZleceniaForProductGrid = new dataProcessor("api/productstasks", "js");                
        dpZleceniaForProductGrid.init(zleceniaForProductGrid);
        dpZleceniaForProductGrid.enableDataNames(true);
        dpZleceniaForProductGrid.setTransactionMode("REST");
        dpZleceniaForProductGrid.enablePartialDataSend(true);
        dpZleceniaForProductGrid.enableDebug(true);
        dpZleceniaForProductGrid.setUpdateMode("row", true);
        dpZleceniaForProductGrid.attachEvent("onBeforeDataSending", function(id, state, data){
            data.id = id;
            ajaxGet("api/productstasks/" + id + "/edit", data, function(data){                                                            
                console.log(data);
            });
        });        
    }
}

window.dhx4.attachEvent("onSidebarSelect", function (id, cell) {
    if (id == "products") {
        window.history.pushState({'page_id': id}, null, '#products');
        productsInit(cell);      
    }       
});