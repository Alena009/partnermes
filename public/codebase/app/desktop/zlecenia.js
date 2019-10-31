var zleceniaGrid;
var zleceniaLayout;
var zleceniaForm;

function zleceniaInit(cell) {
	if (zleceniaLayout == null) {
		// init layout
		var zleceniaLayout = cell.attachLayout("4H");
		zleceniaLayout.cells("a").setText(_("Grupy zadań"));
		zleceniaLayout.cells("b").setText(_("Zlecenia"));
                zleceniaLayout.cells("c").setText(_("Zadania"));
                zleceniaLayout.cells("d").setText(_("Komponenty"));
		zleceniaLayout.cells("a").setWidth(280);
                zleceniaLayout.cells("d").setWidth(280);
                zleceniaLayout.cells("c").setHeight(180);
//Groups tasks tree		
		var grupyTreeToolBar = zleceniaLayout.cells("a").attachToolbar({
			iconset: "awesome",
			items: [
				{id: "Add",  type: "button", text: _("Dodaj"),   img: "fa fa-plus-square "},
                                {id: "Edit", type: "button", text: _("Edytuj"), img: "fa fa-edit"},
                                {id: "Del",  type: "button", text: _("Usuń"),   img: "fa fa-minus-square"},
			]
		});
		grupyTreeToolBar.attachEvent("onClick", function(btn) {
                    switch (btn){
                            case 'Add':{
                                    createAddEditGroupWindow("api/taskgroups", 
                                    "api/taskgroups", grupyTree, 0);
                            };break;
                            case 'Edit':{
                                var id = grupyTree.getSelectedId();
                                if (id) {                                        
                                    createAddEditGroupWindow("api/taskgroups", 
                                    "api/taskgroups/" + id + "/edit", grupyTree, id);
                                }
                            };break;
                            case 'Del':{
                                var id = grupyTree.getSelectedId();
                                if (id) {
                                    deleteNodeFromTree(grupyTree, "api/taskgroups/" + id);
                                }
                            };break;
                    }
		});
                var grupyTree = zleceniaLayout.cells("a").attachTreeView({
			skin: "dhx_web",    // string, optional, treeview's skin
			iconset: "font_awesome", // string, optional, sets the font-awesome icons
			multiselect: false,           // boolean, optional, enables multiselect
			checkboxes: true,           // boolean, optional, enables checkboxes
			dnd: true,           // boolean, optional, enables drag-and-drop
			context_menu: true           // boolean, optional, enables context menu			
		}); 
                grupyTree.enableDragAndDrop(true);
		grupyTree.attachEvent("onDrop",function(id){			
                        var parent_id = arguments[1];
                        parent_id = (parent_id) ? parent_id+'' : 0;
                        var data = {
                            id: id,
                            parent_id: parent_id
                        };                        
                        ajaxGet("api/taskgroups/" + id + "/edit?", data);
			return true;
		});                 
		grupyTree.attachEvent("onSelect",function(id, mode){  
                    if (mode) {
                        var grupy=grupyTree.getAllChecked();
                        grupy[grupy.length]=id;
			zleceniaGrid.zaladuj(grupy);
			return true;                        
                    }
		});
		grupyTree.attachEvent("onCheck",function(id){
			var grupy=grupyTree.getAllChecked(); 
			zleceniaGrid.zaladuj(grupy);
			return true;
		});                
		grupyTree.zaladuj = function(i=null){	
                    var treeStruct = ajaxGet("api/taskgroups/grupytree", '', function(data) {                    
                        if (data && data.success){      
                            grupyTree.clearAll();                            
                            grupyTree.loadStruct(data.data);                           
                        }                    
                    });
                };         
                
                var zleceniaGridToolBar = zleceniaLayout.cells("b").attachToolbar({
			iconset: "awesome",
			items: [
                            {id: "Product",text: _("Wyprodukować"), type: "button", img: "fa fa-print"},                                                       
                            {id: "DontProduct",text: _("Nie produkować"), type: "button", img: "fa fa-times"},                                                       
                            {id: "Block",text: _("Blokuj"), type: "button", img: "fa fa-lock"},                            
                            {id: "UnBlock",text: _("Odblokuj"), type: "button", img: "fa fa-unlock"},                            
                            {id: "sep3",     type: "separator"},
                            {id: "Redo", type: "button", text: _("Odśwież"),img: "fa fa-refresh"}
			]
		}); 
                zleceniaGridToolBar.attachEvent("onClick", function(btn) {	
		    switch (btn){
		        case 'Product':{
                            var selectedZlecenia = zleceniaGrid.getCheckedRows(0);
                            selectedZlecenia.split(',').forEach(function(elem){
                                var data = zleceniaGrid.getRowData(elem);
                                data.status = 1;
                                data.date_status = new Date();
                                ajaxGet("api/positions/" + elem + "/edit", data, function(data){
                                    if (data.success && data.data) {                            
                                        zleceniaGrid.zaladuj(0);
                                    }
                                });
                            });                          
                        };break;   
		        case 'DontProduct':{
                            var selectedZlecenia = zleceniaGrid.getCheckedRows(0);
                            selectedZlecenia.split(',').forEach(function(elem){
                                var data = zleceniaGrid.getRowData(elem);
                                data.status = 0;
                                data.date_status = new Date();
                                ajaxGet("api/positions/" + elem + "/edit", data, function(data){
                                    if (data.success && data.data) {                            
                                        zleceniaGrid.zaladuj(0);
                                    }
                                });
                            });                          
                        };break;                         
		        case 'UnBlock':{
                            var selectedZlecenia = zleceniaGrid.getCheckedRows(0);
                            selectedZlecenia.split(',').forEach(function(elem){
                                var data = zleceniaGrid.getRowData(elem);
                                data.status = 0;
                                data.date_status = new Date();
                                ajaxGet("api/positions/" + elem + "/edit", data, function(data){
                                    if (data.success && data.data) {                            
                                        zleceniaGrid.zaladuj(0);
                                    }
                                });
                            });                          
                        };break;                         
		        case 'Block':{
                            var selectedZlecenia = zleceniaGrid.getCheckedRows(0);
                            selectedZlecenia.split(',').forEach(function(elem){
                                var data = zleceniaGrid.getRowData(elem);
                                data.status = 2;
                                data.date_status = new Date();
                                ajaxGet("api/positions/" + elem + "/edit", data, function(data){
                                    if (data.success && data.data) {                            
                                        zleceniaGrid.zaladuj(0);
                                    }
                                });
                            });                          
                        };break;                      
		        case 'Redo':{
                                zleceniaGrid.zaladuj(0);
                        };break;
                    }
                });                
                var zleceniaGrid = zleceniaLayout.cells("b").attachGrid({
		    image_path:'codebase/imgs/',
		    columns: [  
                        {label: "",                    id:'checked',           width: 30,  type: "ch", align: "center"},                        
                        {label: "Zmówienie Kod",       id:'order_kod',         width: 50, type: "ro", sort: "str",  align: "center"},                        
                        {label: "Zlecenie Kod",        id:'kod',               width: 100, type: "ro", sort: "str",  align: "center"},                                              
                        {label: "Produkt Kod",         id:'product_kod',       width: 100, type: "ro", sort: "str",  align: "left"},
                        {label: "Imie produktu",       id:'product_name',      width: 200, type: "ro", sort: "str",  align: "left"},                        
                        {label: "Ilość produktu",      id:'amount',            width: 60,  type: "ro",sort: "str",  align: "right"},                        
                        {label: "Zrobiona ilość",      id:'done_amount',       width: 60,  type: "edn",sort: "str",  align: "right"},
                        {label: "Zamknięte",           id:'closed',            width: 30,  type: "ch", align: "center"},
                        {label: "Data dodania",        id:'created_at',        width: 120, type: "ro", sort: "date", align: "center"},
                        {label: "Data zamkniecia",     id:'date_closing',      width: 120, type: "ro", sort: "date", align: "center"},
                        {label: "Data dostawy",        id:'num_week',          width: 120, type: "ro", align: "center"},
                        {id: "date_delivery"},
                        {id: "description"},
                        {id: 'product_id'},
                        {id: "declared"},
                        {id: "countWorks"},
                        {id: "status"},
                        {id: "order_id"},
                        {id: "price"}
                    ],
                    multiline: true,
                    multiselect: true
                });  
                zleceniaGrid.attachHeader("#master_checkbox,#select_filter,#text_filter,#text_filter,#text_filter");
                zleceniaGrid.setRegFilter(zleceniaGrid, 2);
                zleceniaGrid.setRegFilter(zleceniaGrid, 3);
                zleceniaGrid.setRegFilter(zleceniaGrid, 4);
                zleceniaGrid.attachEvent("onRowSelect", function(id,ind) {
                        componentsGrid.fill(id);
                        tasksGrid.fill(id);
                });                 
                zleceniaGrid.attachEvent("onCheck", function(rId,cInd,state){
                    var rowData = zleceniaGrid.getRowData(rId);
                    if (rowData.closed == true) {
                        zleceniaGrid.cells(rId,0).setValue(false);
                    }
                    var ids = zleceniaGrid.getCheckedRows(0);
                    if (ids.length) {
                        componentsGrid.fill(ids);
                        tasksGrid.fill(ids);
                    }
                });                
		zleceniaGrid.zaladuj = function(i = 0){
                    this.clearAll();
                    var ids = Array();
                    ids = (typeof i === 'string' || typeof i === 'number')  ? [i] : i;
                    var new_data = ajaxGet("api/positions", "", function(data){
                        if (data && data.success){                            
                                zleceniaGrid.parse(data.data, "js");
                            }
                        });			
		}; 
                zleceniaGrid.attachEvent("onRowCreated", function(rId,rObj,rXml){
                    var data = zleceniaGrid.getRowData(rId);
                    //if (data.declared == data.countWorks) { 
                    if (data.status == 2) {
                        zleceniaGrid.setRowColor(rId,"pink");
                    } 
                    if (data.status == 1) {
                        zleceniaGrid.setRowColor(rId,"lightyellow");
                    } 
                    if (data.closed == true) { 
                        zleceniaGrid.setRowColor(rId,"lightgreen");
                    } 
                    if (data.countWorks > 0) {
                        zleceniaGrid.setRowColor(rId,"yellow");
                    }
                }); 
                
                var tasksGrid = zleceniaLayout.cells("c").attachGrid({
                    image_path:'codebase/imgs/',
                    columns: [ 
                        {id: "checked", type: "ch", width: 30},
                        {label: _("Zadanie Kod"),   id: "kod",      type: "ro", sort: "str", align: "left", width: 100},                                                                        
                        {label: _("Zadanie"),       id: "name",     type: "ro", sort: "str", align: "left", width: 150},                         
                        {label: _("Ilość"),         id: "amount",   type: "ro", sort: "str", align: "left", width: 50},                                    
                        {label: _("Ilość czasu"),   id: "duration", type: "ro", sort: "str", align: "left", width: 50},                          
                        {label: _("Ilość zrobiona"),id: "done", type: "ro", sort: "str", align: "left", width: 50},                                                
                        {id: "countWorks"}
                    ]
                });  
                tasksGrid.attachEvent("onRowCreated", function(rId,rObj,rXml){
                    var data = tasksGrid.getRowData(rId);
                    if (data.amount == data.done) { 
                        tasksGrid.setRowColor(rId,"lightgreen");
                    } else if (data.countWorks>0) {
                        tasksGrid.setRowColor(rId,"yellow");
                    }
                });                 
                tasksGrid.fill = function(positionsIds) { 
                    tasksGrid.clearAll();
                    ajaxGet("api/positions/tasks/" + positionsIds, "", function(data){
                        if (data.success && data.data) {                            
                            tasksGrid.parse((data.data), "js");
                        }
                    });
                };                 
                
                componentsGridToolBar = zleceniaLayout.cells("d").attachToolbar({
                        iconset: "awesome",
                        items: [                           
                                {id: "Do",    type: "button", text: _("Wyprodukować"),  img: "fa fa-plus-square"},
                                {id: "Order", type: "button", text: _("Zamówić"), img: "fa fa-plus-square"}
                        ]                    
                }); 
                componentsGridToolBar.attachEvent("onClick", function(btn) {	
		    switch (btn){
		        case 'Do':{
                            var selectedComponents = componentsGrid.getCheckedRows(0);
                            if (selectedComponents.length) {
                                var newOrderWindow = createWindow(_("Nowe wewnętrzne zamowienie"), 500, 380);
                                var newOrderForm = createForm(newProjectFormStruct, newOrderWindow);                                                                
                                var clientsCombo = newOrderForm.getCombo("client_id");
                                ajaxGet("api/clients", "", function(data){
                                    clientsCombo.addOption(data.data);
                                    clientsCombo.selectOption(0);
                                });                                       
                                newOrderForm.attachEvent("onButtonClick", function(name){
                                    switch (name){
                                        case 'save':{    
                                            var data = newOrderForm.getFormData();
                                            data.date_start = newOrderForm.getCalendar("date_start").getDate(true);                                         
                                            ajaxPost("api/orders", data, function(data){
                                                if (data && data.success) {
                                                    selectedComponents.split(',').forEach(function(elem){
                                                        var data2 = componentsGrid.getRowData(elem);
                                                        data2.order_id = data.data.id;
                                                        data2.price = 0;
                                                        data2.date_delivery = data.data.date_end;
                                                        data2.product_id = data2.component_id;
                                                        data2.kod = data.data.id + data2.kod;
                                                        ajaxPost("api/positions", data2, "");
                                                    });
                                                    newOrderWindow.hide(); 
                                                    dhtmlx.alert({
                                                        title:_("Wiadomość"),
                                                        text:_("Zapisane")
                                                    });
                                                    zleceniaGrid.zaladuj(0);
                                                } else {
                                                    dhtmlx.alert({
                                                        title:_("Wiadomość"),
                                                        text:_("Błąd! Zmiany nie zostały zapisane")
                                                    });
                                                }
                                            });                
                                        };break;                                        
                                    }
                                });
                            }
                        };break;      
                    }
                });
                var componentsGrid = zleceniaLayout.cells("d").attachGrid({
                    image_path:'codebase/imgs/',
                    columns: [ 
                        {id: "checked", type: "ch", width: 30},
                        {label: _("Komponent Kod"),       id: "kod",      type: "ro", sort: "str", align: "left", width: 100},                                                                        
                        {label: _("Komponent"),           id: "name",     type: "ro", sort: "str", align: "left", width: 150},                                  
                        {label: _("Wymagana ilość"),      id: "amount1",   type: "ro", sort: "str", align: "left", width: 50},                                    
                        {label: _("Ilość na magazynie"),  id: "available",type: "ro", sort: "str", align: "left", width: 50},
                        {label: _("Ilość do produkowania"),id: "amount",   type: "ed", sort: "str", align: "left", width: 50},
                        //{label: _("Zlecenie"),            id: "zlecenie", type: "ro", sort: "str", align: "left", width: 100},												
                        {id: "component_id"},												
                        {id: "available"},
                        {id: "order_position_id"}
                    ]
                });
                componentsGrid.attachEvent("onRowCreated", function(rId,rObj,rXml){
                    var data = componentsGrid.getRowData(rId);
                    if ((data.amount1 - data.available) > 0) {                        
                        componentsGrid.setRowColor(rId,"pink");
                    }
                }); 
                componentsGrid.fill = function(positionsIds) { 
                    componentsGrid.clearAll();
                    ajaxGet("api/positions/components/" + positionsIds, "", function(data){
                        if (data.success && data.data) {
                            data.data.forEach(function(elem){
                                elem.amount = elem.amount1;
                            });
                            componentsGrid.parse((data.data), "js");
                        }
                    });
                };   
                
////Toolbar on zlecenia grid             
//                var zleceniaGridToolBar = zleceniaLayout.cells("b").attachToolbar({
//			iconset: "awesome",
//			items: [
////				{id: "Find",     type: "button", img: "fa fa-search"},
////				{id:"szukaj",    type: "buttonInput", text: "", width: 150},                               
////				{id: "sep1",     type: "separator"},
//				{id: "Add",  type: "button", text: _("Dodaj"),   img: "fa fa-plus-square "},
//                                {id: "Edit", type: "button", text: _("Edytuj"), img: "fa fa-edit"},
//                                {id: "Del",  type: "button", text: _("Usuń"),   img: "fa fa-minus-square"},
//                                //{id: "sep2",     type: "separator"},
//                                //{id: "AddTotal", type: "button", text: _("Zrobić wspólne zlecenie"), img: "fa fa-check-square"},
//                                {id: "sep3",     type: "separator"},
//                                {id: "Redo", type: "button", text: _("Odśwież"),img: "fa fa-refresh"}
//			]
//		});
//                zleceniaGridToolBar.attachEvent("onClick", function(btn) {	
//		    switch (btn){
//		        case 'Add':{                                
//                            var newZlecenieWindow = createWindow(_("Dodaj zlecenie"), 500, 700);
//                            var newZlecenieLayout = newZlecenieWindow.attachLayout("1C");
//                            var newZlecenieLayoutTabbar = newZlecenieLayout.cells("a").attachTabbar();
//                                newZlecenieLayoutTabbar.addTab("a1", _("Zlecenie na zamówienie"), null, null, true);               
//                                //newZlecenieLayoutTabbar.addTab("a2", _("Wewnętrzne zlecenie"));  
////New zlecenie for order                               
//                            var newOrderZlecenieLayout = newZlecenieLayoutTabbar.tabs("a1").attachLayout("3L");
//                            newOrderZlecenieLayout.cells("a").setText(_("Pozycji zamowien"));                            
//                            newOrderZlecenieLayout.cells("b").setText(_("Komponenty"));
//                            newOrderZlecenieLayout.cells("c").setText(_("Zlecenia do wybranych produktów"));   
//                            newOrderZlecenieLayout.cells("c").setHeight(100);
//                            newOrderZlecenieLayout.setAutoSize("a", "a;b;c");
//                            var ordersPositionsGrid = newOrderZlecenieLayout.cells("a").attachGrid({
//                                image_path:'codebase/imgs/',
//                                columns: [   
//                                    {id: "checked", type: "ch", width: 30},                                                                     
//                                    {label: _("Zamowienie Kod"), id: "order_kod",          type: "ro", sort: "str", align: "left", width: 50},                                    
//                                    {label: _("Pozycja Kod"),    id: "order_position_kod", type: "ro", sort: "str", align: "left", width: 50},
//                                    {label: _("Produkt Kod"),    id: "product_kod",        type: "ro", sort: "str", align: "left", width: 50},                                                                        
//                                    {label: _("Produkt"),        id: "product_name",       type: "ro", sort: "str", align: "left", width: 150},                                  
//                                    {label: _("Ilosc"),          id: "amount",             type: "ro", sort: "str", align: "left", width: 50},
//                                    {label: _("Cena"),           id: "price",              type: "ro", sort: "str", align: "left", width: 50},
//                                    {label: _("Suma"),           id: "summa",              type: "ro", sort: "str", align: "left", width: 50},                                    
//                                    {label: _("Opis"),           id: "description",        type: "ro", sort: "str", align: "left", width: 150},
//                                    {id: "date_delivery"},
//                                    {id: "description"},												
//                                    {id: "available"},
//                                    {id: "product_id"}   
//                                ]
//                            });  
//                            ordersPositionsGrid.attachHeader(",#select_filter,,#select_filter");
//                            ordersPositionsGrid.attachFooter(
//                                [_("Ilosc: "),"#cspan","#cspan","#cspan","#cspan","#stat_total","","#stat_total"],
//                                ["text-align:right;","text-align:center"]
//                            ); 
//                            ordersPositionsGrid.setColumnHidden(9,true);
//                            ordersPositionsGrid.setColumnHidden(10,true);
//                            ordersPositionsGrid.setColumnHidden(11,true);
//                            ordersPositionsGrid.setColumnHidden(12,true);        
//                            ordersPositionsGrid.attachEvent("onCheck", function(rId,cInd,state){
//                                var productsIds = [];
//                                var ids = ordersPositionsGrid.getCheckedRows(0);
//                                if (ids.length) {
//                                    ids.split(',').forEach(function(elem){
//                                        var data = ordersPositionsGrid.getRowData(elem);
//                                        productsIds.push(data.product_id);   
//                                    });                                                             
//                                    componentsGrid.fill(ids); 
//                                } else {
//                                    componentsGrid.fill(0); 
//                                }
//                            });                                                                                   
//                            ordersPositionsGrid.fill("api/positions/freepositions");                        
//                            var componentsGrid = newOrderZlecenieLayout.cells("b").attachGrid({
//                                image_path:'codebase/imgs/',
//                                columns: [ 
//                                    {id: "checked", type: "ch", width: 30},
//                                    {label: _("Komponent Kod"),       id: "kod",      type: "ro", sort: "str", align: "left", width: 100},                                                                        
//                                    {label: _("Komponent"),           id: "name",     type: "ro", sort: "str", align: "left", width: 150},                                  
//                                    {label: _("Wymagana ilość"),      id: "amount1",   type: "ro", sort: "str", align: "left", width: 50},                                    
//                                    {label: _("Ilość na magazynie"),  id: "available",type: "ro", sort: "str", align: "left", width: 50},
//                                    {label: _("Ilość do produkowania"),  id: "amount1",   type: "ed", sort: "str", align: "left", width: 50},
//                                    //{label: _("Zlecenie"),            id: "zlecenie", type: "ro", sort: "str", align: "left", width: 100},												
//                                    {id: "component_id"},												
//                                    {id: "available"},
//                                    {id: "order_position_id"}
//                                ]
//                            });   
//                            componentsGrid.attachHeader("#master_checkbox,#text_filter,#text_filter");
//                            componentsGrid.setRegFilter(componentsGrid, 1);
//                            componentsGrid.setRegFilter(componentsGrid, 2);                            
//                            componentsGrid.setColumnHidden(6,true);
//                            componentsGrid.setColumnHidden(7,true);
//                            componentsGrid.setColumnHidden(8,true);                                   
//                            componentsGrid.fill = function(positionsId) { 
//                                componentsGrid.clearAll();
//                                ajaxGet("api/positions/components/" + positionsId, "", function(data){
//                                    if (data.success && data.data) {																										
//                                        componentsGrid.parse((data.data), "js");
//                                    }
//                                });
//                            };                            
//                            var form = newOrderZlecenieLayout.cells("c").attachForm([
//                                {type: "settings", position: "label-left", labelWidth: 110, inputWidth: 160},		                                
//                                {type: "button", name: "save",   value: _("Zapisz"), offsetTop:18}                              
//                            ]);  
//                            form.attachEvent("onButtonClick", function(name){
//                                if (name == "save") {
//                                    var checkedMainProducts = ordersPositionsGrid.getCheckedRows(0);
//                                    var checkedComponents = componentsGrid.getCheckedRows(0);    
//                                    if (!checkedMainProducts.length && !checkedComponents.length) {
//                                        dhtmlx.alert({
//                                            title:_("Wiadomość"),
//                                            text:_("Nie wybrano produktów do produkowania!")
//                                        });
//                                    } else {
//                                        var zlecWin = createWindow(_("Zlecenia do wybranych produktów"), 500, 500);
//                                        var zlecLayout = zlecWin.attachLayout("2U");
//                                        zlecLayout.cells("a").setText(_("Zlecenia"));
//                                        zlecLayout.cells("b").setText(_("Funkcje"));
//                                        var mySidebar = zlecLayout.cells("a").attachSidebar();
//                                        checkedMainProducts.split(',').forEach(function(elem) {
//                                            var data = ordersPositionsGrid.getRowData(elem);
//                                            mySidebar.addItem({
//                                                id: elem,
//                                                text: data.product_kod + ' ' + data.product_name + ' - ' + data.amount,
//                                                selected: true
//                                            });
//                                            var myGrid = mySidebar.cells(elem).attachGrid({
//                                                image_path:'codebase/imgs/',
//                                                columns: [                                            
//                                                    {type: "ch", id: "checked", width: 30},                                                                                        
//                                                    {label: _("Zadanie Kod"), id: "task_kod",width: 100, type: "ro", sort: "int", align: "right"},
//                                                    {label: _("Zadanie"),     id: "task_name",width: 150, type: "ed", sort: "str", align: "left"},
//                                                    {label: _("Iłość"),       id: "declared_amount",width: 50, type: "ed", sort: "str", align: "left"},
//                                                    {label: "Column B",id: "task_id",width: 50, type: "ed", sort: "str", align: "left"},
//                                                    {label: "Column B",id: "product_id",width: 50, type: "ed", sort: "str", align: "left"},
//                                                    {label: "Column B",id: "order_position_id",width: 50, type: "ed", sort: "str", align: "left"}
//                                                ]                                        
//                                            });     
//                                            myGrid.setColumnHidden(4,true);
//                                            myGrid.setColumnHidden(5,true);
//                                            myGrid.setColumnHidden(6,true);                                             
//                                            myGrid.fill = function(product, amount, orderPosId) { 
//                                                this.clearAll();
//                                                ajaxGet("api/products/tasks/" + product, "", function(data){
//                                                    if (data.success && data.data) { 
//                                                        data.data.forEach(function(elem){
//                                                            elem.declared_amount = amount;
//                                                            elem.checked = true;
//                                                            elem.order_position_id = orderPosId;
//                                                        });
//                                                        myGrid.parse((data.data), "js");                                        
//                                                    }
//                                                });                                
//                                            };                                         
//                                            myGrid.fill(data.product_id, data.amount, elem);                                         
//                                        });
//                                        if (checkedComponents.length) {
//                                            checkedComponents.split(',').forEach(function(elem) {
//                                                var data = componentsGrid.getRowData(elem);
//                                                mySidebar.addItem({
//                                                    id: elem,
//                                                    text: data.kod + ' ' + data.name + ' - ' + data.amount1,
//                                                    selected: true
//                                                });
//                                                var myGrid = mySidebar.cells(elem).attachGrid({
//                                                    image_path:'codebase/imgs/',
//                                                    columns: [                                            
//                                                        {type: "ch", id: "checked", width: 30},                                                                                        
//                                                        {label: _("Zadanie Kod"), id: "task_kod",width: 100, type: "ro", sort: "int", align: "right"},
//                                                        {label: _("Zadanie"),     id: "task_name",width: 150, type: "ed", sort: "str", align: "left"},
//                                                        {label: _("Iłość"),       id: "declared_amount",width: 50, type: "ed", sort: "str", align: "left"},
//                                                        {label: "Column B",id: "task_id",width: 50, type: "ed", sort: "str", align: "left"},
//                                                        {label: "Column B",id: "product_id",width: 50, type: "ed", sort: "str", align: "left"},
//                                                        {label: "Column B",id: "order_position_id",width: 50, type: "ed", sort: "str", align: "left"}
//                                                    ]                                        
//                                                });
//                                                myGrid.setColumnHidden(4,true);
//                                                myGrid.setColumnHidden(5,true);
//                                                myGrid.setColumnHidden(6,true); 
//                                                myGrid.fill = function(product, amount, orderPosId) { 
//                                                    this.clearAll();
//                                                    ajaxGet("api/products/tasks/" + product, "", function(data){
//                                                        if (data.success && data.data) { 
//                                                            data.data.forEach(function(elem){
//                                                                elem.declared_amount = amount;
//                                                                elem.checked = true;   
//                                                                elem.order_position_id = orderPosId;
//                                                            });
//                                                            myGrid.parse((data.data), "js");                                        
//                                                        }
//                                                    });                                
//                                                };                                         
//                                                myGrid.fill(data.component_id, data.amount1, data.order_position_id);                                        
//                                            });                                     
//                                        }
//                                        var formSaveAllZlec = zlecLayout.cells("b").attachForm([
//                                            {type: "settings", position: "label-left", labelWidth: 110, inputWidth: 160},		                                
//                                            {type: "button", name: "saveall",   value: _("Zapisz wrzystkie zlecenia"), offsetTop:18}                              
//                                        ]); 
//                                        formSaveAllZlec.attachEvent("onButtonClick", function(name){
//                                            if (name == "saveall") {
//                                                mySidebar.forEachCell(function(item){                                                
//                                                    var obj = mySidebar.cells(item.getId()).getAttachedObject();
//                                                    if (obj instanceof dhtmlXGridObject && obj.getRowsNum()) {
//                                                        var checkedTasks = obj.getCheckedRows(0);
//                                                        checkedTasks.split(',').forEach(function(checkedTaskId) {
//                                                            var taskData = obj.getRowData(checkedTaskId);
//                                                            ajaxPost("api/declaredworks", taskData, function(data){
//                                                                console.log(data.data);
//                                                            });
//                                                        });
//                                                    } else {                                                    
//                                                        return;
//                                                    }                                                
//                                                });
//                                                dhtmlx.alert({
//                                                    title:_("Wiadomość"),
//                                                    text:_("Zapisane!")
//                                                });
//                                                zleceniaGrid.zaladuj(0);
//                                                ordersPositionsGrid.fill("api/positions/freepositions"); 
//                                                componentsGrid.fill(0);
//                                            }
//                                        });
//                                    }
//                                }
//                            });                          
////New zlecenie for warehouse
////                            var newIntroZlecenieLayout = newZlecenieLayoutTabbar.tabs("a2").attachLayout("4C");
////                                newIntroZlecenieLayout.cells("a").setText(_("Produkty"));                              
////                                newIntroZlecenieLayout.cells("b").setText(_("Iłość")); 
////                                newIntroZlecenieLayout.cells("c").setText(_("Zadania")); 
////                                newIntroZlecenieLayout.cells("d").setText(_("Funkcje")); 
////                            var productsGrid = newIntroZlecenieLayout.cells("a").attachGrid({
////                                image_path:'codebase/imgs/',
////                                columns: [   
////                                    {label: _("Produkt Kod"), id: "product_kod",        type: "ro", sort: "str", align: "left", width: 150},                                                                        
////                                    {label: _("Produkt"),     id: "product_name",       type: "ro", sort: "str", align: "left", width: 150},                                                                      											                                    
////                                    {label: _("Typ"),         id: "product_type_name",  type: "ro", sort: "str", align: "left", width: 150},                                                                      											                                    
////                                    {label: _("Grupa"),       id: "product_group_name", type: "ro", sort: "str", align: "left", width: 150}
////                                ]
////                            });
////                                productsGrid.attachHeader("#text_filter,#text_filter,#select_filter,#select_filter");                                
////                                productsGrid.fill('api/products');  
////                            var amountForm = newIntroZlecenieLayout.cells("b").attachForm([
////                                    {type: "settings", position: "label-left", labelWidth: 110, inputWidth: 160},		
////                                    {type: "input",  name: "amount",  label: _("Iłość"),
////                                        note: {text: _("Iłość produktu do wyprodukowania")}
////                                    }                                
////                                ]);  
////                                amountForm.attachEvent("onInputChange", function(name, value, form){
////                                    var product = productsGrid.getSelectedRowId();
////                                    if (product) {
////                                        if (name == "amount" && parseInt(value) > 0) {
////                                            tasksGrid.fill(product, value);  
////                                        } else {
////                                            dhtmlx.alert({
////                                                title:_("Wiadomość"),
////                                                text:_("Wpisz iłość produktu!")
////                                            });
////                                        } 
////                                    } else {
////                                        dhtmlx.alert({
////                                            title:_("Wiadomość"),
////                                            text:_("Wybierz produkt!")
////                                        });                                        
////                                    }
////                                });
////                            var tasksGrid = newIntroZlecenieLayout.cells("c").attachGrid({
////                                image_path:'codebase/imgs/',
////                                columns: [  
////                                    {label: _(""),        id: "checked",   type: "ch", sort: "str", align: "left", width: 20},                                                                       
////                                    {label: _("Zadanie"), id: "task_name", type: "ro", sort: "str", align: "left", width: 150},                                                                        
////                                    {label: _("Iłość"),   id: "declared_amount",  type: "ed", sort: "str", align: "left", width: 150},
////                                    {id: "task_id"},
////                                    {id: "product_id"}
////                                ]
////                            });   
////                                tasksGrid.setColumnHidden(3,true);
////                                tasksGrid.setColumnHidden(4,true);                            
////                                tasksGrid.attachHeader("#master_checkbox"); 
////                                tasksGrid.fill = function(product, amount) {
////                                    this.clearAll();
////                                    ajaxGet("api/products/tasks/" + product, "", function(data){
////                                    if (data && data.success){  
////                                            data.data.forEach(function(elem){
////                                                elem.declared_amount = amount;
////                                                elem.checked = true;
////                                            });
////                                            tasksGrid.parse(data.data, "js");
////                                        }
////                                    });                                                                        
////                                };
////                            var myForm = newIntroZlecenieLayout.cells("d").attachForm([
////                                    {type: "settings", position: "label-left", labelWidth: 110, inputWidth: 160},		                                
////                                    {type: "button", name: "save",   value: _("Zapisz"), offsetTop:18}                              
////                                ]);
////                                myForm.attachEvent("onButtonClick", function(name){
////                                if (name == "save") {
////                                    var checked = tasksGrid.getCheckedRows(0);
////                                    checked = checked.split(",");
////                                    if (checked.length) {
////                                        checked.forEach(function(id){
////                                            var data = tasksGrid.getRowData(id);                                              
////                                            ajaxPost("api/declaredworks", data, function(data) {
////                                                if (data && data.success) {
////                                                    
////                                                } else {
////                                                    dhtmlx.alert({
////                                                        title:_("Wiadomość"),
////                                                        text:_("Błąd! Zmiany nie zostały zapisane")
////                                                    });
////                                                }
////                                            });                                                                                                                                             
////                                        });                                        
////                                    } else {
////                                        dhtmlx.alert({
////                                            title:_("Wiadomość"),
////                                            text:_("Wybierz produkt oraz zadania do produktu")
////                                        });                                        
////                                    }                                       
////                                }
////                            });                            
//			};break;
//                        case 'Edit':{                            
//                            var selectedZlecenieId   = zleceniaGrid.getSelectedRowId();                                                        
//                            if (selectedZlecenieId) {                                      
//                                var selectedZlecenie   = zleceniaGrid.getRowData(selectedZlecenieId);
//                                var editZlecenieWindow = createWindow(_("Edytuj zlecenie"), 400, 750);
//                                var editZlecenieLayout = editZlecenieWindow.attachLayout("2U");
//                                editZlecenieLayout.cells("a").hideHeader();
//                                editZlecenieLayout.cells("b").hideHeader(); 
//                                
//                                tasksByZlecenieToolbar = editZlecenieLayout.cells("a").attachToolbar({
//                                        iconset: "awesome",
//                                        items: [
//                                            {type: "text", id: "title", text: _("Zadania")},                                
//                                            {type: "spacer"},
//                                            {id:"Add",  type: "button", img: "fa fa-plus-square"}
//                                        ]
//                                });    
//                                tasksByZlecenieToolbar.attachEvent("onClick", function(id) { 
//                                    switch (id){
//                                        case 'Add':{                                                   
//                                            var newTaskForZlecenieWindow = createWindow(_("Dodaj zadanie"), 400, 400);
//                                            var newTaskForZlecenieLayout = newTaskForZlecenieWindow.attachLayout("1C");
//                                            newTaskForZlecenieLayout.cells("a").hideHeader();
//                                            
//                                            tasksForComponentGridToolbar = newTaskForZlecenieLayout.cells("a").attachToolbar({
//                                                iconset: "awesome",
//                                                items: [
//                                                    {type: "text", id: "title", text: _("Zadania")},                                
//                                                    {type: "spacer"},
//                                                    {id:"Add", type: "button", img: "fa fa-check-square"}
//                                                ]
//                                            });  
//                                            tasksForComponentGridToolbar.attachEvent("onClick", function(buttonId) {
//                                                if (buttonId == "Add") {
//                                                    var checked = tasksForComponentGrid.getCheckedRows(0).split(",");
//                                                    if (checked[0] !== "") {
//                                                        checked.forEach(function(elem) {
//                                                            var data = tasksForComponentGrid.getRowData(elem);
//                                                            var newId = (new Date()).valueOf();
//                                                            tasksByZlecenie.addRow(newId,[
//                                                                data.checked, data.task_kod, data.task_name, data.amount
//                                                            ]);
//                                                        });
//                                                    } else {
//                                                        dhtmlx.message({
//                                                            title:_("Wiadomość"),
//                                                            type:"alert",
//                                                            text:_("Wybierz zadania!")
//                                                        });                                                        
//                                                    }
//                                                }
//                                            });
//                                            
//                                            var tasksForComponentGrid = newTaskForZlecenieLayout.cells("a").attachGrid({
//                                                image_path:'codebase/imgs/',
//                                                columns: [    
//                                                    {label: _(""),              id: "checked",         type: "ch", sort: "str", align: "left", width: 20},                                                                                                                                                                                                                                                
//                                                    {label: _("Zadanie Kod"),   id: "task_kod",        type: "ro", sort: "str", align: "left", width: 50},
//                                                    {label: _("Zadanie"),       id: "task_name",       type: "ro", sort: "str", align: "left", width: 150},                                                                                                                                                                                
//                                                    {label: _("Ilosc"),         id: "amount",          type: "ed", sort: "str", align: "left", width: 50}                                                                                                                                             
//                                                ]
//                                            }); 
//                                            tasksForComponentGrid.fill = function (productId) {
//                                                this.clearAll(); 
//                                                ajaxGet("api/products/availabletasks/" + productId, '', function(data){                                     
//                                                    if (data && data.success){
//                                                        tasksForComponentGrid.parse((data.data), "js");
//                                                    }
//                                                });                                    
//                                            };  
//                                            tasksForComponentGrid.fill(selectedZlecenie.product_id);
//                                        };break;
//                                    }
//                                });
//                                var tasksByZlecenie = editZlecenieLayout.cells("a").attachGrid({
//                                    image_path:'codebase/imgs/',
//                                    columns: [    
//                                        {label: _(""),              id: "checked",         type: "ch", sort: "str", align: "left", width: 20},
//                                        {label: _("Zamowienie Kod"),id: "order_kod",       type: "ro", sort: "str", align: "left", width: 50},
//                                        {label: _("Pozycja Kod"),   id: "position_kod",    type: "ro", sort: "str", align: "left", width: 50},
//                                        {label: _("Zadanie Kod"),   id: "task_kod",        type: "ro", sort: "str", align: "left", width: 50},
//                                        {label: _("Zadanie"),       id: "task_name",       type: "ro", sort: "str", align: "left", width: 150},
//                                        {label: _("Data dostawy"),  id: "num_week",        type: "ro", sort: "str", align: "left", width: 50},                                                                                           
//                                        {label: _("Ilość zadan"),   id: "declared_amount", type: "ed", sort: "str", align: "left", width: 50},
//                                        {id: "order_position_id"},
//                                        {id: "product_id"},
//                                        {id: "task_id"},
//                                        {id: "kod"}                                        
//                                    ],
//                                    multiselect: true
//                                });  
//                                tasksByZlecenie.attachHeader(',#select_filter,#select_filter,#select_filter,#select_filter,#text_filter'); 
//                                tasksByZlecenie.setColumnHidden(7,true);
//                                tasksByZlecenie.setColumnHidden(8,true);
//                                tasksByZlecenie.setColumnHidden(9,true);
//                                tasksByZlecenie.setColumnHidden(10,true);
//                                tasksByZlecenie.fill = function (zlecenieId) {
//                                    this.clearAll(); 
//                                    ajaxGet("api/declaredworks/listforzlecenie/" + zlecenieId, '', function(data){                                     
//                                        if (data && data.success){
//                                            tasksByZlecenie.parse((data.data), "js");
//                                        }
//                                    });                                    
//                                };
//                                tasksByZlecenie.fill(selectedZlecenieId);
//                                
//                                var editZlecenieFormStruct = [
//                                        {type: "settings", position: "label-left", labelWidth: 110, inputWidth: 160},		
//                                        {type: "input", name: "kod",          readonly: true, label: _("Kod zlecenia")},
//                                        {type: "input", name: "product_name", readonly: true, label: _("Produkt")},		                        
//                                        {type: "input", name: "amount",       readonly: true, label: _("Ilość produktu"), 
//                                            note: {text: _("Ilość produktu w zamowieniu")}    
//                                        },		                        
////                                        {type: "input", name: "num_week",     readonly: true, label: _("Data dostawy"),                                             
////                                            note: {text: _("Numer tygodnia kiedy produkt musi byc gotowy.")}},
//                                        {type: "block", blockOffset: 0, position: "laabel-left", list: [
//                                            {type: "button", name: "save",   value: _("Zapisz"), offsetTop:18}                                            
//                                        ]} 
//                                        
//                                ];    
//                                
//                                zlecenieFormToolbar = editZlecenieLayout.cells("b").attachToolbar({
//                                    iconset: "awesome",
//                                    items: [
//                                        {type: "text", id: "title", text: _("Zlecenie")}                                                                        
//                                    ]
//                                });
//                                var dhxZlecenieForm = editZlecenieLayout.cells("b").attachForm(editZlecenieFormStruct);
//                                var selectedZlecenieData = zleceniaGrid.getRowData(selectedZlecenieId); 
//                                dhxZlecenieForm.setFormData(selectedZlecenieData); 
//                                
//                                dhxZlecenieForm.attachEvent("onButtonClick", function(name){
//                                    switch (name){  
//                                        case 'save':{
//                                            var checked = tasksByZlecenie.getCheckedRows(0).split(",");
//                                            if (checked[0] !== "") {
//                                                var nullable = checked.some(function(elem) {
//                                                    var data = tasksByZlecenie.getRowData(elem);
//                                                    if (data.amount == "") {
//                                                        dhtmlx.message({
//                                                            title:_("Wiadomość"),
//                                                            type:"alert",
//                                                            text:_("Wpisz ilosc do wrzystkich zadan!")
//                                                        });
//                                                        return true;
//                                                    }
//                                                    return false;
//                                                });
//                                                if (!nullable) {
//                                                    tasksByZlecenie.forEachRow(function(elem) {
//                                                        var rowData = tasksByZlecenie.getRowData(elem);
//                                                        if (tasksByZlecenie.cells(elem,0).isChecked()) {
//                                                            ajaxGet("api/declaredworks/" + elem + "/edit", rowData, function(data){
//
//                                                            });  
//                                                        } else {
//                                                            ajaxDelete("api/declaredworks/" + elem, "", function(data){
//                                                                if (data && data.success) {
//                                                                    tasksByZlecenie.deleteRow(elem);
//                                                                }
//                                                            }); 
//                                                        }
//                                                    }); 
//                                                    dhtmlx.message({
//                                                        title:_("Wiadomość"),
//                                                        type:"alert",
//                                                        text:_("Zapisane!")
//                                                    });                                                    
//                                                }
//                                            }
//                                        };break;            
//                                        case 'cancel':{
//                                            
//                                        };break;
//                                    }
//                                });
//                            } else {
//                                dhtmlx.message({
//                                    title:_("Wiadomość"),
//                                    type:"alert",
//                                    text:_("Wybierz zlecenie!")
//                                }); 
//                            }
//                        };break;
//                        case 'Del':{
//                            var checked = zleceniaGrid.getCheckedRows(0);
//                            if (checked) {
//                                dhtmlx.confirm({
//                                    title: _("Ostrożność"),                                    
//                                    text: _("Czy na pewno chcesz usunąć zlecenie? Zlecenie zostanie usunięte ze wrzystkimi elementami!"),
//                                    callback: function(result){
//                                        if (result) {                                
//                                            ajaxGet("api/declaredworks/delzlec/" + checked, "", function(data){
//                                                if (data && data.success){
//                                                    var groupId = grupyTree.getSelectedId;
//                                                    if (groupId) {
//                                                        zleceniaGrid.zaladuj(groupId);
//                                                        zadaniaGrid.zaladuj(0);
//                                                    } else {
//                                                        zleceniaGrid.zaladuj(0);
//                                                        zadaniaGrid.zaladuj(0);
//                                                    }                                                    
//                                                }
//                                            });
//                                        }
//                                    }
//                                });                                                                                                    
//                            } else {
//                                dhtmlx.message({
//                                    title:_("Wiadomość"),
//                                    type:"alert",
//                                    text:_("Wybierz zlecenie!")
//                                });                                
//                            }
//                        };break;
//                        case 'AddTotal': {
//                            var data = zleceniaGrid.getCheckedRows(0);                             
//                            if (data) {  
//                                dhtmlx.confirm({
//                                    title:_("Ostrożność"),                                    
//                                    text:_("Utwórzyć wspólne zlecenie?"),
//                                    callback: function(result){
//                                                if (result) {
//                                                    var checked = zleceniaGrid.getCheckedRows(0).split(",");
//                                                    var selectedDifferentProductsKods = [];
//                                                    var selectedDifferentZleceniaKods = [];
//                                                    
//                                                    var prevProductKod  = 0;
//                                                    var prevZlecenieKod = 0;                                                    
//                                                    checked.forEach(function(elem) {
//                                                        var thisProductKod  = zleceniaGrid.getRowData(elem).product_kod;
//                                                        var thisZlecenieKod = zleceniaGrid.getRowData(elem).kod;  
//                                                        if ((thisProductKod !== prevProductKod) && (prevProductKod !== 0)) {
//                                                            selectedDifferentProductsKods.push(thisProductKod);
//                                                        };
//                                                        if ((thisZlecenieKod !== prevZlecenieKod) && (prevZlecenieKod !== 0)) {
//                                                            selectedDifferentZleceniaKods.push(thisZlecenieKod);
//                                                        }
//                                                        prevProductKod = thisProductKod;
//                                                        prevZlecenieKod = thisZlecenieKod;
//                                                    });
//                                                    if (selectedDifferentProductsKods.length) {
//                                                        dhtmlx.message({
//                                                            title:_("Wiadomość"),
//                                                            type:"alert",
//                                                            text:_("Nie można dodawać różne produkty do wspólnego zlecenia!")
//                                                        }); 
//                                                    } else if (!selectedDifferentZleceniaKods.length) {
//                                                        dhtmlx.message({
//                                                            title:_("Wiadomość"),
//                                                            type:"alert",
//                                                            text:_("To jest jedno zlecenie!")
//                                                        });
//                                                    } else {
//                                                        ajaxGet("api/declaredworks/makegeneral/" + data, "" , function(data){
//                                                            if (data && data.success) {
//                                                                var selectedGroup = grupyTree.getSelectedId();
//                                                                if (selectedGroup) {
//                                                                    zleceniaGrid.zaladuj(selectedGroup);
//                                                                } else {
//                                                                    zleceniaGrid.zaladuj(0);
//                                                                }                                                           
//                                                            } else {
//                                                                dhtmlx.alert({
//                                                                    title:_("Błąd!"),
//                                                                    type:"alert-error",
//                                                                    text:data.message
//                                                                });        
//                                                            }
//                                                        });                                                         
//                                                    }
//                                                }
//                                            }
//                                });                                                                
//                            } else {
//                                dhtmlx.message({
//                                    title:_("Wiadomość"),
//                                    type:"alert",
//                                    text:_("Wybierz rekordy, aby dodać do wspólnego zlecenia!")
//                                }); 
//                            }
//                        };break;
//                        case 'Redo':{
//                            zleceniaGrid.zaladuj();
//                            grupyTree.uncheckItem(grupyTree.getAllChecked());
//                            grupyTree.unselectItem(grupyTree.getSelectedId());
//                        };break;
//		    }
//		});                     
//		var zleceniaGrid = zleceniaLayout.cells("b").attachGrid({
//		    image_path:'codebase/imgs/',
//		    columns: [  
//                        {label: "",                    id:'checked',           width: 30,  type: "ch", align: "center"},                        
//                        {label: "Zmówienie Kod",       id:'order_kod',         width: 50, type: "ro", sort: "str",  align: "center"},
//                        //{label: "Pozycja Kod",         id:'position_kod',   width: 50, type: "ro", sort: "str",  align: "center"},
//                        {label: "Zlecenie Kod",        id:'kod',               width: 100, type: "ro", sort: "str",  align: "center"},
//                        //{label: "Zadanie Kod",         id:'task_kod',          width: 100, type: "ro", sort: "str",  align: "left"},                        
//                        //{label: "Zadanie",             id:'task_name',         width: 200, type: "ro", sort: "str",  align: "left"},                        
//                        {label: "Produkt Kod",         id:'product_kod',       width: 100, type: "ro", sort: "str",  align: "left"},
//                        {label: "Imie produktu",       id:'product_name',      width: 200, type: "ro", sort: "str",  align: "left"},
//                        //{label: "Typ produktu",        id:'product_type_name', width: 200, type: "ro", sort: "str",  align: "left"},
//                        {label: "Ilość produktu",      id:'declared_amount',            width: 60,  type: "ro",sort: "str",  align: "right"},
//                        //{label: "Zadeklarowana ilość robot", id:'damount',   width: 60,  type: "edn",sort: "str",  align: "right"},
//                        {label: "Zrobiona ilość robot",      id:'done_amount',       width: 60,  type: "edn",sort: "str",  align: "right"},
//                        {label: "Zamknięte",           id:'closed',            width: 30,  type: "ch", align: "center"},
//                        {label: "Data dodania",        id:'created_at',        width: 120, type: "ro", sort: "date", align: "center"},
//                        {label: "Data zamkniecia",     id:'date_closing',      width: 120, type: "ro", sort: "date", align: "center"},
//                        {label: "Data dostawy",        id:'num_week',          width: 120, type: "ro", align: "center"},
//                        {id:'product_id'}
//                    ],
//                    multiline: true,
//                    multiselect: true
//		});  
//                zleceniaGrid.setColumnHidden(11,true);
//                zleceniaGrid.attachHeader("#master_checkbox,#select_filter,#text_filter,#text_filter,#text_filter");
//                zleceniaGrid.setRegFilter(zleceniaGrid, 2);
//                zleceniaGrid.setRegFilter(zleceniaGrid, 3);
//                zleceniaGrid.setRegFilter(zleceniaGrid, 4);
//                zleceniaGrid.attachEvent("onRowCreated", function(rId,rObj,rXml){
//                    var data = zleceniaGrid.getRowData(rId);                    
//                    if (data.closed == 0) {
//                        zleceniaGrid.setRowColor(rId,"pink");
//                    } else {
//                        zleceniaGrid.setRowColor(rId,"lightgrey");
//                    }
//                });   
//                zleceniaGrid.attachEvent("onCheck", function(rId,cInd,state){
//                    var data = zleceniaGrid.getRowData(rId);                    
//                    if (state) {                    
//                        zleceniaGrid.forEachRow(function(id) {
//                            var currentRowData = zleceniaGrid.getRowData(id);
//                            if (currentRowData.kod === data.kod) {
//                                zleceniaGrid.setRowData(id,{"checked": true});
//                                zleceniaGrid.setRowTextBold(id); 
//                            }
//                        });                                         
//                    } else {
//                        zleceniaGrid.forEachRow(function(id) {
//                            var currentRowData = zleceniaGrid.getRowData(id);
//                            if (currentRowData.kod === data.kod) {
//                                zleceniaGrid.setRowData(id,{"checked": false});
//                                zleceniaGrid.setRowTextStyle(id, "font-weight: normal;"); 
//                            }
//                        });                                                  
//                    }                   
//                });  
//                zleceniaGrid.attachEvent("onRowSelect", function(id,ind) {
//                    zadaniaGrid.zaladuj(id);
//                }); 
//                zleceniaGrid.setColumnColor("white,white,white,white,white,white,#d5f1ff");
//		zleceniaGrid.setDateFormat("%Y-%m-%d","%Y-%m-%d");                
//		zleceniaGrid.zaladuj = function(i = 0){
//                    this.clearAll();
//                    var ids = Array();
//                    ids = (typeof i === 'string' || typeof i === 'number')  ? [i] : i;
//                    var new_data = ajaxGet("api/declaredworks/list/" + ids, "", function(data){
//                        if (data && data.success){                            
//                                zleceniaGrid.parse(data.data, "js");
//                            }
//                        });			
//		};    
//                
//		var zadaniaGrid = zleceniaLayout.cells("c").attachGrid({
//		    image_path:'codebase/imgs/',
//		    columns: [  
//                        //{label: "",                    id:'checked',           width: 30,  type: "ch", align: "center"},                        
//                        //{label: "Zlecenie Kod",        id:'kod',               width: 100, type: "ro", sort: "str",  align: "center"},
//                        {label: "Zadanie Kod",         id:'task_kod',          width: 100, type: "ro", sort: "str",  align: "left"},                        
//                        {label: "Zadanie",             id:'task_name',         width: 200, type: "ro", sort: "str",  align: "left"},                        
//                        //{label: "Produkt Kod",         id:'product_kod',       width: 100, type: "ro", sort: "str",  align: "left"},
//                        //{label: "Imie produktu",       id:'product_name',      width: 200, type: "ro", sort: "str",  align: "left"},
//                        //{label: "Typ produktu",        id:'product_type_name', width: 200, type: "ro", sort: "str",  align: "left"},
//                        //{label: "Ilość produktu",      id:'declared_amount',            width: 60,  type: "ro",sort: "str",  align: "right"},
//                        {label: "Zadeklarowana ilość robot", id:'damount',   width: 60,  type: "edn",sort: "str",  align: "right"},
//                        {label: "Zrobiona ilość robot",      id:'done_amount',       width: 60,  type: "edn",sort: "str",  align: "right"},
//                        {label: "Zamknięte",           id:'closed',            width: 30,  type: "ch", align: "center"},
//                        {label: "Data dodania",        id:'created_at',        width: 120, type: "ro", sort: "date", align: "center"},
//                        {label: "Data zamkniecia",     id:'date_closing',      width: 120, type: "ro", sort: "date", align: "center"},                        
//                        {id:'product_id'}
//                    ],
//                    multiline: true,
//                    multiselect: true
//		});  
//                zadaniaGrid.setColumnHidden(7,true);
//		zadaniaGrid.zaladuj = function(i = 0){
//                    this.clearAll();
//                    var ids = Array();
//                    ids = (typeof i === 'string' || typeof i === 'number')  ? [i] : i;
//                    var new_data = ajaxGet("api/declaredworks/listforzlecenie/" + ids, "", function(data){
//                        if (data && data.success){                            
//                                zadaniaGrid.parse(data.data, "js");
//                            }
//                        });			
//		};                                
	}
	grupyTree.zaladuj();
	zleceniaGrid.zaladuj(0);
}

						
//		var dpGrupyTree = new dataProcessor("api/taskgroup");
//		dpGrupyTree.init(grupyTree);
//		dpGrupyTree.setTransactionM);
//		dpGrupyTree.attachEvent("onBeforeUpdate", function(id, state, data){
//			//console.log(arguments);//your code here
//			if (data.tr_id=='_new' && (data.tr_text=="nowa grupa" || data.tr_text=='') && state=='inserted')
//				return false;
//			else{
//				return true;
//			}
//		});
//
//
//
//		dpGrupyTree.attachEvent("onAfterUpdate", function(id, action, tid, response){
//			console.log('onAfterUpdate',arguments);
//			if (response.action!='error'){
//				if (id!=response.id && action=='inserted')  grupyTree.changeItemId(id,response.id);
//			}
//			
//		});
//
//		dpGrupyTree.defineAction("error",function(tag){
//			console.log('defineAction.error',tag);
//			alert(tag.error);
//			return false;
//		});
window.dhx4.attachEvent("onSidebarSelect", function (id, cell) {
	if (id == "zlecenia") {           
            window.history.pushState({'page_id': id}, null, '#zlecenia');
            zleceniaInit(cell);
        }        
});
