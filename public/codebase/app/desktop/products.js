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
                        {id: "Edit", type: "button", img: "fa fa-edit"},
                        {id: "Del", type: "button", img: "fa fa-minus-square"}				                               
                ]                    
        });
        productsGridToolBar.attachEvent("onClick", function(name) {
            var productForm = createWindowWithForm(newProductFormStruct, 
                                            _("Produkt"), 480, 380);  
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
            switch (name){
                case 'Add': {                       
                    productForm.attachEvent("onButtonClick", function(name){
                        switch (name){
                            case 'save':{ 
                                ajaxPost("api/products", productForm.getFormData(), function(data) {
                                    if (data && data.success) {
                                        productsGrid.fill();
                                        productsGrid.selectRowById(data.data.id);
                                    }
                                }); 
                            };break;
                        }
                    });                    
                };break;
                case 'Edit': {  
                    var selectedId = productsGrid.getSelectedRowId();
                    if (selectedId) {
                        productForm.bind(productsGrid);
                        productForm.unbind(productsGrid);                        
                        productForm.attachEvent("onButtonClick", function(name){
                            switch (name){
                                case 'save': {                                    
                                    var data = productForm.getFormData();                                                                 
                                    ajaxGet("api/products/" + selectedId + "/edit", data, function(data){
                                        if (data && data.success) {
                                           console.log(data);
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
                    var selectedId = productsGrid.getSelectedRowId();
                    if (selectedId) {                                 
                        ajaxDelete("api/products/" + selectedId,'', function(data){
                            if (data && data.success) {
                                productsGrid.deleteRow(selectedId);
                            }
                        });                           
                    } else {
                        dhtmlx.alert({
                            title:_("Wiadomość"),
                            text:_("Wybierz produkt, który chcesz usunąć!")
                        });                        
                    }
                };break;                        
            }
        });
        var productsGrid = productsLayout.cells("a").attachGrid({
            image_path:'codebase/imgs/',
            columns: [                        
                {
                    label: _("Kod"),
                    width: 100,
                    id: "kod",
                    type: "ed", 
                    sort: "str", 
                    align: "left"
                },
                {
                    label: _("Imie produktu"),
                    width: 100,
                    id: "name",
                    type: "ed", 
                    sort: "str", 
                    align: "left"
                },
                {
                    label: _("Typ produktu"),
                    width: 100,
                    id: "product_type_name",
                    type: "ed", 
                    sort: "str", 
                    align: "left"
                },
                {
                    label: _("Grupa produktu"),
                    width: 100,
                    id: "product_group_name",
                    type: "ed", 
                    sort: "str", 
                    align: "left"
                }                           
            ],
                multiselect: true
        });
        productsGrid.attachHeader("#select_filter,#text_filter,#select_filter,#select_filter");
        productsGrid.fill = function(){						
            ajaxGet("api/products", '', function(data){                                     
                if (data && data.success){                                    
                    productsGrid.parse(data.data, "js");
                }
            });                        
        };                
        productsGrid.fill();
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
            componentsGrid.clearAll();
            componentsGrid.fill(selectedId);     
            zleceniaForProductGrid.fill(selectedId);     
            productForm.hideItem("block");
        });    
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
            {type: "input", name: "name",             required: true, label: _("Nazwa produktu")},                                      
            {type: "input", name: "height",                           label: _("Wysokość, mm")},
            {type: "input", name: "width",                            label: _("Szerokość, mm")},
            {type: "input", name: "length",                           label: _("Długość, mm")},
            {type: "input", name: "weight",           required: true, label: _("Masa, kg")},
            {type: "input", name: "area",             required: true, label: _("Powierzchnia, m2")},
            {type: "input", name: "pack",             required: true, label: _("Opakowanie")},
            {type: "input", name: "description",      required: true, label: _("Opis"), rows: 3},
            {type: "block", name: "block",         blockOffset: 0, position: "label-left", list: [
                {type: "button", name: "save",    value: "Zapisz", offsetTop:18},                
                {type: "newcolumn"},
                {type:"button",  name: "cancel", value: "Anuluj", offsetTop:18}
            ]}
        ]; 
        var productFormStruct = [
            {type: "settings", position: "label-left", labelWidth: 115, inputWidth: 160},
            //{type: "container", name: "photo", label: "", inputWidth: 160, inputHeight: 160, offsetTop: 20, offsetLeft: 65},
            //{type: "input", name: "date_end",     label: "Due date", offsetTop: 20},                    
            {type: "input", name: "product_group_name", label: _("Grupa produktu"), options: []},		
            {type: "input", name: "product_type_name",  label: _("Typ produktu"),   options: []},		
            {type: "input", name: "kod",                label: _("Kod produktu")},
            {type: "input", name: "name",               label: _("Nazwa produktu")},                                      
            {type: "input", name: "height",             label: _("Wysokość, mm")},
            {type: "input", name: "width",              label: _("Szerokość, mm")},
            {type: "input", name: "length",             label: _("Długość, mm")},
            {type: "input", name: "weight",             label: _("Masa, kg")},
            {type: "input", name: "area",               label: _("Powierzchnia, m2")},
            {type: "input", name: "pack",               label: _("Opakowanie")},
            {type: "input", name: "description",        label: _("Opis"), rows: 3}
        ];         
        var productForm = productsLayout.cells("b").attachForm(productFormStruct); 
        productForm.bind(productsGrid);     
        
        var componentsGridMenu = componentsLayout.cells("a").attachMenu({
                iconset: "awesome",
                items: [
                    {id:"Add",  text: _("Dodaj"),  img: "fa fa-plus-square"},
                    {id:"Edit", text: _("Edytuj"), img: "fa fa-edit"},
                    {id:"Del",  text: _("Usun"),   img: "fa fa-minus-square"}
                ]                    
        }); 
        componentsGridMenu.attachEvent("onClick", function(name) {
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
            switch(name) {
                case "Add": {
                    var selectedProductId = productsGrid.getSelectedRowId();
                    if (selectedProductId) {
                        var addingForm = createWindowWithForm(formStruct, "Componenty", 300, 300);
                        var productCombo = addingForm.getCombo("component_id");
                        productCombo.enableFilteringMode(true);
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
                                        addingForm.setItemFocus("component_id");
                                    }
                                });
                            }
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
                    }                            
                };break;
            }
        });    
        var componentsGrid = componentsLayout.cells("a").attachGrid({
            image_path:'codebase/imgs/',
            columns: [                        
                {
                    label: _("Kod"),
                    width: 100,
                    id: "kod",
                    type: "ed", 
                    sort: "str", 
                    align: "left"
                },
                {
                    label: _("Nazwa komponentu"),
                    width: 100,
                    id: "name",
                    type: "ed", 
                    sort: "str", 
                    align: "left"
                },
                {
                    label: _("Typ"),
                    width: 100,
                    id: "product_type_name",
                    type: "ed", 
                    sort: "str", 
                    align: "left"
                },
                {
                    label: _("Group"),
                    width: 100,
                    id: "product_group_name",
                    type: "ed", 
                    sort: "str", 
                    align: "left"
                },                        
                {
                    label: _("Ilość"),
                    width: 100,
                    id: "amount",
                    type: "ed", 
                    sort: "str", 
                    align: "left"
                }                           
            ],
                multiselect: true
        });   
        componentsGrid.fill = function(id = 0){	
            componentsGrid.clearAll();
            ajaxGet("api/components/list/" + id, '', function(data){                                     
                if (data && data.success){
                    componentsGrid.parse((data.data), "js");
                }
            });                        
        };  
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
        var zleceniaForProductGridMenu = zleceniaForProductLayout.cells("a").attachMenu({
                iconset: "awesome",
                items: [
                    {id:"Add",  text: _("Dodaj"),  img: "fa fa-plus-square"},
                    {id:"Edit", text: _("Edytuj"), img: "fa fa-edit"},
                    {id:"Del",  text: _("Usun"),   img: "fa fa-minus-square"}
                ]                    
        });    
        zleceniaForProductGridMenu.attachEvent("onClick", function(name) {
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
                        var addingForm = createWindowWithForm(formStruct, "Componenty", 300, 300);
                        var tasksCombo = addingForm.getCombo("task_id");
                        tasksCombo.enableFilteringMode(true);
                        ajaxGet("api/tasks", '', function(data){
                            tasksCombo.addOption(data.data);
                        });
                        addingForm.attachEvent("onButtonClick", function(name){
                            var data = this.getFormData();
                            data.product_id = selectedProductId;
                            if (name == "save") {
                                ajaxPost("api/productstasks", data, function(data){
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
                {
                    label: _("Kod"),
                    width: 100,
                    id: "task_kod",
                    type: "ro", 
                    sort: "str", 
                    align: "left"
                },
                {
                    label: _("Zadania"),
                    width: 100,
                    id: "task_name",
                    type: "ro", 
                    sort: "str", 
                    align: "left"
                },
                {
                    label: _("Czasy, min"),
                    width: 100,
                    id: "duration",
                    type: "ed", 
                    sort: "str", 
                    align: "left"
                }                           
            ],
                multiselect: true
        });
        zleceniaForProductGrid.fill = function(id = 0){	
            zleceniaForProductGrid.clearAll();
            ajaxGet("api/productstasks/list/" + id, '', function(data){                                     
                if (data && data.success){
                    zleceniaForProductGrid.parse((data.data), "js");
                }
            });                        
        };    
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