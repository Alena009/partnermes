var warehouseDataView;
var warehouseLayout;
var warehouseMap;

function warehouseInit(cell) {
    if (warehouseLayout == null) {
        var userData = JSON.parse(localStorage.getItem("userData")); 
        var write;
        userData.permissions.forEach(function(elem){
            if (elem.name == 'warehouse') {
                write = elem.pivot.value;
            }
        });
                
        // init layout
        var warehouseLayout = cell.attachLayout("2U");                  
        warehouseLayout.cells("a").setText(_("Grupy produktow"));
        warehouseLayout.cells("b").setText( _("Produkty"));                
        warehouseLayout.cells("a").setWidth(280);		                
        warehouseLayout.setAutoSize("a", "a;b");
               
        var productsTree = warehouseLayout.cells("a").attachTreeView({
            skin: "dhx_web",    // string, optional, treeview's skin
            iconset: "font_awesome", // string, optional, sets the font-awesome icons
            multiselect: false,           // boolean, optional, enables multiselect
            //checkboxes: true,           // boolean, optional, enables checkboxes
            dnd: true,           // boolean, optional, enables drag-and-drop
            context_menu: true
        });                  
        productsTree.attachEvent("onSelect",function(id, mode){  
            if (mode) {
                var grupy=productsTree.getAllChecked();
                grupy[grupy.length]=id;                      
                productsGrid.clearAll();
                productsGrid.fill(grupy);                          
                return true;                        
            }
        });
        productsTree.attachEvent("onCheck",function(id){
                var grupy=productsTree.getAllChecked(); 
                productsGrid.clearAll();
                productsGrid.fill(grupy);                        
                return true;
        }); 
        productsTree.build = function() {
            var treeStruct = ajaxGet("api/prodgroups/grupytree", "", function(data){
                if (data.success) {
                    productsTree.loadStruct(data.data);
                }
            });
        };
        productsTree.build(); 
        
        if (write) {
            productsGridToolBar = warehouseLayout.cells("b").attachToolbar({
                iconset: "awesome",
                items: [                              
                    {id: "Add",  type: "button", text: _("Dodaj"),   img: "fa fa-plus-square "},
                    {type: "separator", id: "sep1"},
                    {id: "Redo", type: "button",text: _("Odśwież"), img: "fa fa-refresh"}
                ]
            });
        } else {
            productsGridToolBar = warehouseLayout.cells("b").attachToolbar({
                iconset: "awesome",
                items: []
            });
        }
        productsGridToolBar.attachEvent("onClick", function(name){
            switch (name){
                case 'Add':{
                    var addingWindow = createWindow(_("Dodaj informacje"), 400, 300);
                    var addingForm = createForm([
                            {type:"fieldset",  offsetTop: 0, offsetBottom: 20, label:_("Informacja"), width:350, list:[                                			
                                {type: "settings", position: "label-left", labelWidth: 110, inputWidth: 160},		                
                                {type: "combo", name: "type_operation",   required: true, label: _("Operacja"), options: [
                                        {text: _("Dodaj do magazynu"), value: "1"},
                                        {text: _("Zabierz z magazynu"), value: "-1"}
                                ]},
                                {type: "combo", name: "product_group_id", required: true, label: _("Grupa"), options: []},
                                {type: "combo", name: "product_id",       required: true, label: _("Produkt"), options: []},
                                {type: "input", name: "available_amount", readonly: true, label: _("Ilość dostępna")},
                                {type: "input", name: "amount",           required: true, label: _("Ilosc")},
                                {type: "block", blockOffset: 0, position: "label-left", list: [
                                    {type: "button", name: "save",   value: _("Zapisz"), offsetTop:18},
                                    {type: "newcolumn"},
                                    {type:"button", name:"cancel", value: _("Anuluj"), offsetTop:18}
                                ]}
                            ]}
                        ], addingWindow);                    
                    var productGroupsCombo = addingForm.getCombo("product_group_id");                                                                            
                    ajaxGet("api/prodgroups", '', function(data) {                    
                        productGroupsCombo.addOption(data.data);
                    });  
                    //occurs when some value has selected in the products groups combobox
                    productGroupsCombo.attachEvent("onChange", function(value, text){
                        var selectedGroupId = productGroupsCombo.getSelectedValue();
                        var productsCombo = addingForm.getCombo("product_id"); 
                        ajaxGet("api/prodgroups/products/" + selectedGroupId + "/" + localStorage.language, '', function(data) {                    
                            productsCombo.clearAll();
                            productsCombo.addOption(data.data);
                        }); 
                        //occurs when some value has selected in the products combobox
                        productsCombo.attachEvent("onChange", function(value, text){                                     
                            var selectedProductId = productsCombo.getSelectedValue();
                            ajaxGet("api/warehouse/amountproduct/" + selectedProductId, '', function(data) {                    
                               addingForm.setItemValue('available_amount', data.data); 
                            });                            
                        });                                 
                    }); 
                    //attaching events to the button addingForm
                    addingForm.attachEvent("onButtonClick", function(name){
                        switch(name){
                                case 'save':{                                                           
                                    var data = addingForm.getFormData();
                                    data.amount = data.amount * addingForm.getItemValue("type_operation");
                                    ajaxPost("api/warehouse", data, function(data) {                    
                                        if (data && data.success) {
                                            var selectedGroupInTree = productsTree.getSelectedId();
                                            if (!selectedGroupInTree) {
                                                productsGrid.fill(0);
                                            } else {
                                                productsGrid.fill(selectedGroupInTree);
                                            }                                            
                                        }
                                    });
                                };break;
                                case 'cancel':{

                                };break;
                            }
                    });
                };break;
                case 'Edit':{
                    var addingWindow = createWindow(_("Zmien informacje"), 400, 300);
                    var addingForm = createForm(addingFormStruct, addingWindow);
                    addingForm.bind(productsGrid);                            
                };break;
                case 'Del':{
                    var selectedRow = productsGrid.getSelectedRowId();     
                    ajaxDelete('api/warehouse/' + selectedRow, '', function(data){
                        if (data.success) {
                            productsGrid.deleteRow(selectedRow);
                        }
                    });
                };break;
                case 'Redo':{
                    productsGrid.fill(0);
                    productsTree.getAllChecked().forEach(function(elem){
                        productsTree.uncheckItem(elem);
                    });                    
                    productsTree.unselectItem(productsTree.getSelectedId());
                };break;                
            }
        }); 
        
        //initialising and configuration grid
        var productsGrid = warehouseLayout.cells("b").attachGrid({
            image_path:'codebase/imgs/',
            columns: [                                                  
                {
                    label: _("Grupa"),                 
                    id: "group_name",
                    type: "ro",                                             
                    sort: "str", 
                    align: "left"
                },
                {
                    label: _("Produkt"),                   
                    id: "product_name",
                    type: "ro", 
                    sort: "str", 
                    align: "left"
                },
                {
                    label: _("Produkt kod"),                  
                    id: "product_kod",
                    type: "ro", 
                    sort: "str", 
                    align: "left"
                },                        
                {
                    label: _("Ilosc"),
                    id: "amount",                    
                    type: "ro", 
                    sort: "str", 
                    align: "left"
                }                     
            ],
            multiline: true
        });
        productsGrid.attachHeader("#select_filter,#text_filter,#text_filter");
        productsGrid.attachFooter(
            [_("Ilosc: "),"#cspan","#cspan","#stat_total"],
            ["text-align:right;","text-align:center"]
        );  
        productsGrid.setRegFilter(productsGrid, 1); 
        productsGrid.fill = function(i = 0) {
            productsGrid.clearAll();
            var ids = Array();
            ids = (typeof i === 'string' || typeof i === 'number')  ? [i] : i;
            ajaxGet("api/warehouse/list/" + ids, "", function(data){
                if (data && data.success){
                    productsGrid.parse(data.data, "js");
                }
            });	                    
        };
        productsGrid.fill(0);            
        
       
//        var searchElem = productsGridToolBar.getInput('szukaj');
//        productsGrid.makeFilter(searchElem, 1, true);                                                                  
//        productsGrid.filterByAll();         
        var dpProductsGrid = new dataProcessor("api/warehouse", "js");                
        dpProductsGrid.init(productsGrid);
        dpProductsGrid.enableDataNames(true);
        dpProductsGrid.setTransactionMode("REST");
        dpProductsGrid.enablePartialDataSend(true);
        dpProductsGrid.enableDebug(true);
        dpProductsGrid.setUpdateMode("row", true);
        dpProductsGrid.attachEvent("onBeforeDataSending", function(id, state, data){
            data.id = id;
            ajaxGet("api/warehouse/" + id + "/edit", data, function(data){                                                            
                console.log(data);
            });
        });                               
    }	    
}

window.dhx4.attachEvent("onSidebarSelect", function(id, cell){    
	if (id == "warehouse") {                        
            window.history.pushState({ 'page_id': id }, null, '#warehouse'); 
            warehouseInit(cell);      
        }        
});