var warehouseDataView;
var warehouseLayout;
var warehouseMap;

function warehouseInit(cell) {
    if (warehouseLayout == null) {
        // init layout
        var warehouseLayout = cell.attachLayout("2U");                  
        warehouseLayout.cells("a").hideHeader();
        warehouseLayout.cells("b").hideHeader();                
        warehouseLayout.cells("a").setWidth(280);		                
        warehouseLayout.setAutoSize("a", "a;b");
        var productsTreeToolBar = warehouseLayout.cells("a").attachToolbar({
                iconset: "awesome",
                items: [
                        {type: "text", id: "title", text: _("Grupy produktow")},
                        {type: "spacer"},                                                       
                        {id: "Add", type: "button", img: "fa fa-plus-square "},
                        {id: "Edit", type: "button", img: "fa fa-edit"},
                        {id: "Del", type: "button", img: "fa fa-minus-square"},
                        {id: "Hide", type: "button", img: "fa fa-arrow-left"}
                ]
        }); 
        var grupyFormAddData = [
                {type:"fieldset",  offsetTop:0, label:_("Nowa grupa"), width:253, list:[                                
                        {type:"combo",  name:"parent_id",       label:_("Grupa nadrzędna"),     options: [{text: "None", value: "0"}], inputWidth: 150},                                
                        {type:"input",  name:"name",    	label:_("Nazwa grupy"),     	offsetTop:13, 	labelWidth:80},                                                                				
                        {type: "block", blockOffset: 0, position: "label-left", list: [
                            {type: "button", name: "save",   value: _("Zapisz"), offsetTop:18},
                            {type: "newcolumn"},
                            {type:"button", name:"cancel", value: _("Anuluj"), offsetTop:18}
                        ]}
                ]}
        ];
        var grupyFormEditData = [
                {type:"fieldset",  offsetTop:0, label:_("Grupa"), width:253, list:[                                			
                        {type:"input",  name:"name",    	label:"Nazwa grupy",     	offsetTop:13, 	labelWidth:80},                                                                				
                        {type: "block", blockOffset: 0, position: "label-left", list: [
                            {type: "button", name: "save",   value: _("Zapisz"), offsetTop:18},
                            {type: "newcolumn"},
                            {type:"button", name:"cancel", value: _("Anuluj"), offsetTop:18}
                        ]}
                ]}
        ];        
        productsTreeToolBar.attachEvent("onClick", function(id) {
            switch (id){
                case 'Add':{                                
                    var addingForm = createWindowWithForm(grupyFormAddData, _("Grupy produktow"), 250, 300);            
                    var parentGroupsCombo = addingForm.getCombo("parent_id");
                    parentGroupsCombo.enableFilteringMode(true);  
                    ajaxGet("api/prodgroups", '', function(data) {                    
                            parentGroupsCombo.addOption(data.data);
                    });  
                    addingForm.attachEvent("onButtonClick", function(name){
                        switch (name){
                            case 'save':{                                                           
                                    ajaxPost("api/prodgroups", addingForm.getFormData(), function(data){                                                            
                                        productsTree.addItem(data.data.id, data.data.name, data.data.parent_id); // id, text, pId
                                        productsTree.openItem(data.data.parent_id);
                                        productsTree.selectItem(data.data.id);
                                    });
                            };break;
                            case 'cancel':{
                                addingForm.clear();
                            };break;
                        }
                    });
                };break;
                case 'Edit':{
                    var id = productsTree.getSelectedId();                                            
                    if (id) {                                            
                        var data = {
                            id: id,
                            name: productsTree.getItemText(id)
                        };
                        var grupyForm = createWindowWithForm(grupyFormEditData, _("Grupy produktow"), 200, 250);                                                                                       
                        grupyForm.setFormData(data);                                                                                                                   
                        grupyForm.attachEvent("onButtonClick", function(name){
                            switch (name){
                                case 'save':{                                                        
                                    ajaxGet("api/prodgroups/" + id +"/edit", grupyForm.getFormData(), function(data) {                                                                                                        
                                        if (data.success) {                                                                
                                            productsTree.setItemText(id, data.data.name);
                                        }   
                                    });
                                };break;
                                case 'cancel':{                                                            
                                    grupyForm.setFormData(data);                                                        
                                };break;
                            }
                        });
                    } else {
                        dhtmlx.alert({
                            title:_("Wiadomość"),
                            type:"alert",
                            text:_("Wybierz grupe, która chcesz edytować!")
                        });
                    }                                 
                };break;
                case 'Del': {
                    var id = productsTree.getSelectedId();
                                if (id) {
                                    dhtmlx.confirm({
                                    title:_("Ostrożność"),                                    
                                    text:_("Czy na pewno chcesz usunąć grupe?"),
                                    callback: function(result){
                                                if (result) {
                                                    ajaxDelete("api/prodgroups/" + id,'', function(data) {
                                                        if (data.success) {
                                                            productsTree.deleteItem(id);                                                    
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
                };break;
                case 'Hide': {
                        warehouseLayout.cells("a").collapse();
                };break; 
            }                    
        });        
        var productsTree = warehouseLayout.cells("a").attachTreeView({
            skin: "dhx_web",    // string, optional, treeview's skin
            iconset: "font_awesome", // string, optional, sets the font-awesome icons
            multiselect: false,           // boolean, optional, enables multiselect
            checkboxes: true,           // boolean, optional, enables checkboxes
            dnd: true,           // boolean, optional, enables drag-and-drop
            context_menu: true
        });  
        productsTree.enableDragAndDrop(true);                 
        productsTree.attachEvent("onDrop",function(id){                    
            var parent_id = arguments[1];
            parent_id = (parent_id) ? parent_id+'' : 0;
            var data = {
                id: id,
                parent_id: parent_id
            };                        
            ajaxGet("api/prodgroups/" + id +"/edit?", data, function(data) {                                                                                                        
                if (data.success) {                                                                
                    console.log("success");
                }   
            });
            return true;
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
        productsGridToolBar = warehouseLayout.cells("b").attachToolbar({
            iconset: "awesome",
            items: [
                {type: "text", id: "title", text: _("Produkty")},
                {type: "spacer"},
                {type: "text", id: "find", text: _("Find:")},				
                {type: "buttonInput", id: "szukaj", text: "", width: 100},
                {type: "separator", id: "sep2"},                                
                {id: "Add", type: "button", img: "fa fa-plus-square "},
//                {id: "Edit", type: "button", img: "fa fa-edit"},
//                {id: "Del", type: "button", img: "fa fa-minus-square"}
                {type: "separator", id: "sep1"},
                {id: "Redo", type: "button", img: "fa fa-reply"}
            ]
        });
        productsGridToolBar.attachEvent("onClick", function(name){
            switch (name){
                case 'Add':{
                    var addingForm = createWindowWithForm(addingFormStruct, _("Dodaj informacje"), 300, 400);
                    var productGroupsCombo = addingForm.getCombo("product_group_id");                           
                    addingForm.adjustParentSize();                            
                    productGroupsCombo.enableFilteringMode(true);                            

                    //filling combobox with products groups
                    ajaxGet("api/prodgroups", '', function(data) {                    
                            productGroupsCombo.addOption(data.data);
                    });
                    //occurs when some value has selected in the products groups combobox
                    productGroupsCombo.attachEvent("onChange", function(value, text){
                        var selectedGroupId = productGroupsCombo.getSelectedValue();
                        var productsCombo = addingForm.getCombo("product_id"); 
                        productsCombo.enableFilteringMode(true); 
                        ajaxGet("api/products/listbygroups/" + selectedGroupId, '', function(data) {                    
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
                    var addingForm = createWindowWithForm(addingFormStruct, _("Zmien informacje"), 300, 400);
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
        productsGrid.attachHeader("#select_filter,#text_filter,#select_filter");
        productsGrid.attachFooter(
            [_("Ilosc: "),"#cspan","#cspan","#stat_total"],
            ["text-align:right;","text-align:center"]
        );  
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
        //filtering by column filter
        productsGrid.getFilterElement(1)._filter = function (filterElem){
            var input = this.value; // gets the text of the filter input
            input = input.trim().toLowerCase().split(' ');
            return function(value, id){
                //for(var i = 0; i<ordersPositionsGrid.getColumnsNum(); i++){ // iterating through the columns
                var val = productsGrid.cells(id, 1).getValue(); // gets the value of the current                                                    
                //making pattern string for regexp
                var searchStr = '';
                for (var i = 0; i < input.length; i++) {
                    searchStr = searchStr + input[i] + "(.+)";                                                                
                    //var searchStr = /^zz(.+)np(.+)/ig;
                }
                var regExp = new RegExp("^" + searchStr, "ig");                                                          
                if (val.toLowerCase().match(regExp)){                                                             
                    return true;
                }                                                    
                //}
                return false;
            };
        };     
        
        var searchElem = productsGridToolBar.getInput('szukaj');
        productsGrid.makeFilter(searchElem, 1, true);                                                                  
        productsGrid.filterByAll();         
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
        
        //auxiliary variables and functions
        var addingFormStruct = [
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
        ];          
        function createWindowWithForm(formStruct, caption, height, width){
            var dhxWins = new dhtmlXWindows();
            w1 = dhxWins.createWindow({
                    id:"w1",
                    left:20,
                    top:30,
                    width: width,
                    height: height,
                    center:true,
                    caption: _(caption),
                    header: true,
                    onClose:function(){

                    }
            });
            //initializing form 
            return dhxWins.window("w1").attachForm(formStruct, true);         
        }                 
    }	    
}

window.dhx4.attachEvent("onSidebarSelect", function(id, cell){    
	if (id == "warehouse") {                        
            window.history.pushState({ 'page_id': id }, null, '#events'); 
            warehouseInit(cell);      
        }        
});