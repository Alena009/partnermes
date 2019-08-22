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
                        {id: "Add", type: "button", img: "fa fa-plus-square "},
                        {id: "Edit", type: "button", img: "fa fa-edit"},
                        {id: "Del", type: "button", img: "fa fa-minus-square"}				                               
                ]                    
        });
        productsGridToolBar.attachEvent("onClick", function(name) {
            switch (name){
                case 'Add': {                            
                    productForm.clear();
                    productForm.setFocusOnFirstActive();
                    productForm.showItem("block");                            
                    productForm.showItem("savenew");                            
                    productForm.hideItem("saveedit");                            
                };break;
                case 'Edit': {                                
                    var selectedId = productsGrid.getSelectedRowId();                   
                    if (selectedId) {                                 
                        productForm.setFocusOnFirstActive();
                        productForm.showItem("block");                            
                        productForm.showItem("saveedit");                             
                        productForm.hideItem("savenew");                            
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
                    }
                };break;                        
            }
        });
        var productsGrid = productsTasksLayout.cells("a").attachGrid({
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
                },
                {
                    label: _("Wysokość, mm"),
                    width: 100,
                    id: "height",
                    type: "ed", 
                    sort: "str", 
                    align: "left"
                },                        
                {
                    label: _("Szerokość, mm"),
                    width: 100,
                    id: "width",
                    type: "ed", 
                    sort: "str", 
                    align: "left"
                },
                {
                    label: _("Długość, mm"),
                    width: 100,
                    id: "length",
                    type: "ed", 
                    sort: "str", 
                    align: "left"
                },
                {
                    label: _("Masa, kg"),
                    width: 100,
                    id: "weight",
                    type: "ed", 
                    sort: "str", 
                    align: "left"
                }                           
            ],
                multiselect: true
        });                
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
                    width: 100,
                    id: "task_kod",
                    type: "ro", 
                    sort: "str", 
                    align: "left"
                },
                {
                    label: _("Zadanie"),
                    width: 100,
                    id: "task_name",
                    type: "ro", 
                    sort: "str", 
                    align: "left"
                },
                {
                    label: _("Trwalosc"),
                    width: 100,
                    id: "duration",
                    type: "ed", 
                    sort: "str", 
                    align: "left"
                }                           
            ],
                multiselect: true
        });
        zadaniaGrid.fill = function(id = 0){						
            ajaxGet("api/productstasks/list/" + id, '', function(data){                                     
                if (data && data.success){
                    zadaniaGrid.parse((data.data), "js");
                }
            });                        
        };    
        var dpZleceniaForProductGrid = new dataProcessor("api/productstasks", "js");                
        dpZleceniaForProductGrid.init(zadaniaGrid);
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
    if (id == "products_tasks") {
        window.history.pushState({'page_id': id}, null, '#products_tasks');
        productsTasksInit(cell);      
    }       
});