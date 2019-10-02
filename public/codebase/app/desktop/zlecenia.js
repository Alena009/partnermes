var zleceniaGrid;
var zleceniaLayout;
var zleceniaForm;

function zleceniaInit(cell) {
	if (zleceniaLayout == null) {
		// init layout
		var zleceniaLayout = cell.attachLayout("2U");
		zleceniaLayout.cells("a").hideHeader();
		zleceniaLayout.cells("b").hideHeader();
		zleceniaLayout.cells("a").setWidth(280);			                       
		
		var grupyTreeToolBar = zleceniaLayout.cells("a").attachToolbar({
			iconset: "awesome",
			items: [
				{type: "text", id: "title", text: _("Grupy zadan")},
				{type: "spacer"},
				{id: "Add", type: "button", img: "fa fa-plus-square "},
				{id: "Edit", type: "button", img: "fa fa-edit"},
				{id: "Del", type: "button", img: "fa fa-minus-square"}
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
			zleceniaGrid.clearAll();
			zleceniaGrid.zaladuj(grupy);
                        console.log(id);
			return true;                        
                    }
		});
		grupyTree.attachEvent("onCheck",function(id){
			var grupy=grupyTree.getAllChecked(); 
			zleceniaGrid.clearAll();
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
				{id: "title",    type: "text", text: _("Zlecenia")},
				{type: "spacer"},
				{id: "Find",     type: "button", img: "fa fa-search"},
				{id:"szukaj",    type: "buttonInput", text: "", width: 150},                               
				{id: "sep1",     type: "separator"},
				{id: "Add",      type: "button", img: "fa fa-plus-square "},
				{id: "Edit",     type: "button", img: "fa fa-edit"},
				{id: "Del",      type: "button", img: "fa fa-minus-square"},
                                {id: "sep2",     type: "separator"},
                                {id: "AddTotal", type: "button", img: "fa fa-check-square"},
                                {id: "sep3",     type: "separator"},
                                {id: "Redo",     type: "button", img: "fa fa-reply"}
			]
		});
                zleceniaGridToolBar.attachEvent("onClick", function(btn) {	
		    switch (btn){
		        case 'Add':{
                            var newZlecenieWindow = createWindow(_("Dodaj zlecenie"), 500, 700);                                                     
                            var newZlecenieLayout = newZlecenieWindow.attachLayout("3J");
                            newZlecenieLayout.cells("a").hideHeader();                            
                            newZlecenieLayout.cells("b").hideHeader();
                            newZlecenieLayout.cells("b").setCollapsedText(_("Informacja"));
                            newZlecenieLayout.cells("c").hideHeader();   
                            
                            ordersPositionsGridToolbar = newZlecenieLayout.cells("a").attachToolbar({
                                    iconset: "awesome",
                                    items: [
                                        {type: "text", id: "title", text: _("Pozycji zamowien")},                                
                                        {type: "spacer"},
                                        {id:"Add",  type: "button", text: _("Zapisz zlecenie"), img: "fa fa-plus-square"}
                                    ]
                            }); 
                            ordersPositionsGridToolbar.attachEvent("onClick", function(id) { 
                                if (id == 'Add') {                                    
                                        var selectedPosition = ordersPositionsGrid.getSelectedRowId();
                                        if (selectedPosition) {
                                            var newZlecenieForMainProductWindow = createWindow(_("Dodaj zlecenie do produktu"), 500, 400);                                                                       
                                            var newZlecenieForMainProductLayout = newZlecenieForMainProductWindow.attachLayout("2E");
                                            newZlecenieForMainProductLayout.cells("a").setText(_("Zadania"));
                                            newZlecenieForMainProductLayout.cells("b").setText(_("Funkcje"));
                                            var tasksForMainProductGrid = newZlecenieForMainProductLayout.cells("a").attachGrid({
                                                image_path:'codebase/imgs/',
                                                columns: [    
                                                    {label: _(""),                  id: "checked",           type: "ch", sort: "str", align: "left", width: 20},                                                                       
                                                    {label: _("Zamowienie Kod"),    id: "order_kod",         type: "ro", sort: "str", align: "left", width: 50},                                    
                                                    {label: _("Pozycja Kod"),       id: "position_kod",      type: "ro", sort: "str", align: "left", width: 50},
                                                    {label: _("Produkt Kod"),       id: "product_kod",       type: "ro", sort: "str", align: "left", width: 50},
                                                    {label: _("Produkt"),           id: "product_name",      type: "ro", sort: "str", align: "left", width: 50},                                   
                                                    {label: _("Zadanie Kod"),       id: "kod",               type: "ro", sort: "str", align: "left", width: 100},
                                                    {label: _("Zadanie"),           id: "name",              type: "ro", sort: "str", align: "left", width: 200},                                                                        
                                                    {label: _("Ilosc"),             id: "declared_amount",   type: "ed", sort: "str", align: "left", width: 50},
                                                    {id: "task_id"},
                                                    {id: "order_position_id"},
                                                    {id: "product_id"}
                                                ]
                                            });         
                                            tasksForMainProductGrid.setColumnHidden(1,true);
                                            tasksForMainProductGrid.setColumnHidden(2,true);
                                            tasksForMainProductGrid.setColumnHidden(3,true);
                                            tasksForMainProductGrid.setColumnHidden(4,true);
                                            tasksForMainProductGrid.setColumnHidden(8,true);
                                            tasksForMainProductGrid.setColumnHidden(9,true);                            
                                            tasksForMainProductGrid.setColumnHidden(10,true);                                              
                                            tasksForMainProductGrid.attachEvent("onCheck", function(rId,cInd,state){
                                                if (state=='0'){                                    
                                                    tasksForMainProductGrid.setRowTextStyle(rId, 
                                                    "background-color: lightgray; color: gray; font-family: italy;");                                    
                                                } else if (state=='1'){
                                                    tasksForMainProductGrid.setRowTextStyle(rId, 
                                                    "background-color: white; color: black; font-family: arial;");
                                                }                                        
                                            });  
                                            tasksForMainProductGrid.fill = function(positionId) {                                    
                                                this.clearAll();                                                                               
                                                ajaxGet("api/positions/list/tasks/" + positionId, "", function(data){
                                                    if (data.success && data.data) {																										
                                                        tasksForMainProductGrid.parse(data.data, "js");
                                                    }
                                                });                                
                                            };   
                                            tasksForMainProductGrid.fill(selectedPosition); 
                                            
                                            var buttonsSavingMainProductZlecenie = [                                                                             
                                                {type: "button", name: "save", value: "Zapisz"}
                                            ];
                                            var dhxAddingFormMainProduct = newZlecenieForMainProductLayout.cells("b").attachForm(buttonsSavingMainProductZlecenie);                                            
                                            dhxAddingFormMainProduct.attachEvent("onButtonClick", function(name){
                                                switch (name){
                                                    case 'save':{                                                        
                                                        var checkedTasksForMainProduct = tasksForMainProductGrid.getCheckedRows(0);
                                                        checkedTasksForMainProduct = checkedTasksForMainProduct.split(",");
                                                        checkedTasksForMainProduct.forEach(function(element) {                                                    
                                                            var data = tasksForMainProductGrid.getRowData(element);                                                  
                                                            ajaxPost("api/declaredworks", data, function(data){
                                                                if (data && data.success) {
                                                                    newZlecenieForMainProductWindow.hide();
                                                                    zleceniaGrid.zaladuj(0);
                                                                } else {
                                                                    dhtmlx.alert({
                                                                        title:_("Wiadomość"),
                                                                        text:_("Błąd! Zmiany nie zostały zapisane")
                                                                    });                                                                    
                                                                }
                                                            });                                                           
                                                        }); 
                                                        ordersPositionsGrid.deleteSelectedRows();
                                                    };break;
                                                }
                                            }); 
                                        } else {
                                            dhtmlx.message({
                                                title:_("Wiadomość"),
                                                type:"alert",
                                                text:_("Wybierz pozycję w tabeli!")
                                            }); 
                                        }
                                    
                                }
                            });
                            var ordersPositionsGrid = newZlecenieLayout.cells("a").attachGrid({
                                image_path:'codebase/imgs/',
                                columns: [   
                                    {id: "product_id"},                                    
                                    {label: _("Zamowienie Kod"), id: "order_kod",          type: "ro", sort: "str", align: "left", width: 50},
                                    {label: _("Zamowienie"),     id: "order_name",         type: "ro", sort: "str", align: "left", width: 50},
                                    {label: _("Pozycja Kod"),    id: "order_position_kod", type: "ro", sort: "str", align: "left", width: 50},
                                    {label: _("Produkt Kod"),    id: "product_kod",        type: "ro", sort: "str", align: "left", width: 50},                                                                        
                                    {label: _("Produkt"),        id: "product_name",       type: "ro", sort: "str", align: "left", width: 150},                                  
                                    {label: _("Ilosc"),          id: "amount",             type: "ro", sort: "str", align: "left", width: 50},
                                    {label: _("Cena"),           id: "price",              type: "ro", sort: "str", align: "left", width: 50},
                                    {label: _("Suma"),           id: "summa",              type: "ro", sort: "str", align: "left", width: 50},
                                    {id: "date_delivery"},
                                    {id: "description"},												
                                    {id: "available"}												                                    
                                ]
                            });  
                            ordersPositionsGrid.attachHeader(",#select_filter,#select_filter,#select_filter,#select_filter,#text_filter");
                            ordersPositionsGrid.setColumnHidden(0,true);
                            ordersPositionsGrid.setColumnHidden(9,true);
                            ordersPositionsGrid.setColumnHidden(10,true);
                            ordersPositionsGrid.setColumnHidden(11,true);
                            ordersPositionsGrid.attachEvent("onRowCreated", function(rId,rObj,rXml){
                                var data = ordersPositionsGrid.getRowData(rId);
                                if (data.available == 1) {
                                    ordersPositionsGrid.setRowColor(rId,"lightgreen");
                                } else {
                                    ordersPositionsGrid.setRowColor(rId,"pink");
                                }
                            });        
                            ordersPositionsGrid.attachEvent("onRowSelect", function(id,ind){
                                var data = ordersPositionsGrid.getRowData(ordersPositionsGrid.getSelectedRowId());                                                                                                        
                                if (data.available != 1) {
                                    ordersPositionsGridToolbar.disableItem("Add");
                                } else {
                                    ordersPositionsGridToolbar.enableItem("Add");
                                }
                                componentsGrid.fill(id);
                            });     
                            ordersPositionsGrid.getFilterElement(5)._filter = function (){
                                var input = this.value; // gets the text of the filter input
                                input = input.trim().toLowerCase().split(' ');
                                return function(value, id){
                                    //for(var i = 0; i<ordersPositionsGrid.getColumnsNum(); i++){ // iterating through the columns
                                        var val = ordersPositionsGrid.cells(id, 5).getValue(); // gets the value of the current                                                    
                                        //making pattern string for regexp
                                        var searchStr = '';
                                        for (var i = 0; i < input.length; i++) {
                                            searchStr = searchStr + input[i] + "(.*)";                                                                
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
                            ordersPositionsGrid.fill = function() {                                    
                                this.clearAll();                                                                               
                                ajaxGet("api/positions/list/freepositions", "", function(data){
                                    if (data.success && data.data) {																										
                                        ordersPositionsGrid.parse((data.data), "js");
                                    }
                                });
                            };
                            ordersPositionsGrid.fill(); 
                                                                                                                                                                                                  
                            componentsGridToolbar = newZlecenieLayout.cells("c").attachToolbar({
                                    iconset: "awesome",
                                    items: [
                                        {type: "text", id: "title", text: _("Komponenty")},                                
                                        {type: "spacer"},                                        
                                        {id:"Add",  type: "button",  text: _("Zapisz zlecenie"), img: "fa fa-plus-square"}
                                    ]
                            });    
                            componentsGridToolbar.attachEvent("onClick", function(id) { 
                                if (id == 'Add') {
                                        var selectedPositionId    = ordersPositionsGrid.getSelectedRowId();
                                        var selectedComponentId   = componentsGrid.getSelectedRowId();
                                        if (selectedPositionId && selectedComponentId) {                                    
                                            var selectedComponentData = componentsGrid.getRowData(componentsGrid.getSelectedRowId());
                                            selectedComponentData.order_position_id = selectedPositionId;                                             
                                            var newZlecenieForCOmponentWindow = createWindow(_("Dodaj zlecenie do komponentu"), 400, 500);
                                            var newZlecenieForComponentLayout = newZlecenieForCOmponentWindow.attachLayout("2E");
                                            newZlecenieForComponentLayout.cells("a").setText(_("Zadania"));
                                            newZlecenieForComponentLayout.cells("b").setText(_("Funkcje"));
                                            
                                            var tasksForComponentGrid = newZlecenieForComponentLayout.cells("a").attachGrid({
                                                image_path:'codebase/imgs/',
                                                columns: [    
                                                    {label: _(""),              id: "checked",         type: "ch", sort: "str", align: "left", width: 20},                                                                                        
                                                    {label: _("Pozycja Kod"),   id: "position_kod",    type: "ro", sort: "str", align: "left", width: 50},                                    
                                                    {label: _("Komponent Kod"), id: "product_kod",   type: "ro", sort: "str", align: "left", width: 50},
                                                    {label: _("Komponent"),     id: "product_name",  type: "ro", sort: "str", align: "left", width: 150},                                    
                                                    {label: _("Zadanie Kod"),   id: "kod",             type: "ro", sort: "str", align: "left", width: 50},
                                                    {label: _("Zadanie"),       id: "name",            type: "ro", sort: "str", align: "left", width: 150},                                                                                                                            
                                                    {label: _("Ilosc"),         id: "declared_amount", type: "ed", sort: "str", align: "left", width: 50},
                                                    {id: "task_id"},
                                                    {id: "order_position_id"},
                                                    {id: "order_kod"},
                                                    {id: "product_id"}                                                    
                                                ]
                                            }); 
                                            tasksForComponentGrid.setColumnHidden(7,true);
                                            tasksForComponentGrid.setColumnHidden(8,true);                            
                                            tasksForComponentGrid.setColumnHidden(9,true);
                                            tasksForComponentGrid.setColumnHidden(10,true);
                                            tasksForComponentGrid.attachEvent("onCheck", function(rId,cInd,state){
                                                if (state=='0'){                                    
                                                    this.setRowTextStyle(rId, "background-color: lightgray; color: gray; font-family: italy;");                                                    
                                                } else if (state=='1'){
                                                    this.setRowTextStyle(rId, "background-color: white; color: black; font-family: arial;");
                                                }                                        
                                            });     
                                            tasksForComponentGrid.fill = function(data) {                                    
                                                this.clearAll();                                                                               
                                                ajaxGet("api/positions/list/componenttasks", data, function(data){
                                                    if (data.success && data.data) {																										
                                                        tasksForComponentGrid.parse(data.data, "js");
                                                    }
                                                });
                                            };                                             
                                            var data = {};
                                            data.position_id  = selectedPositionId;
                                            data.component_id = selectedComponentData.component_id;
                                            data.amount       = selectedComponentData.amount_need; 
                                            tasksForComponentGrid.fill(data);                                          
                                            
                                            var buttonsSavingComponentZlecenie = [                                                                             
                                                {type: "button", name: "save", value: "Zapisz"}
                                            ];
                                            var dhxAddingFormComponent = newZlecenieForComponentLayout.cells("b").attachForm(buttonsSavingComponentZlecenie);                                            
                                            dhxAddingFormComponent.attachEvent("onButtonClick", function(name){
                                                switch (name){
                                                    case 'save':{
                                                        var checkedTasksForComponent = tasksForComponentGrid.getCheckedRows(0);
                                                        checkedTasksForComponent = checkedTasksForComponent.split(",");
                                                        checkedTasksForComponent.forEach(function(element) {                                                    
                                                            var data = tasksForComponentGrid.getRowData(element);                                                  
                                                            ajaxPost("api/declaredworks", data, function(data) {
                                                                if (data && data.success) {
                                                                    newZlecenieForCOmponentWindow.hide();
                                                                    zleceniaGrid.zaladuj(0);
                                                                    componentsGrid.fill(selectedPositionId);
                                                                } else {
                                                                    dhtmlx.alert({
                                                                        title:_("Wiadomość"),
                                                                        text:_("Błąd! Zmiany nie zostały zapisane")
                                                                    });
                                                                }
                                                            });                                                            
                                                        });  
                                                        componentsGrid.deleteSelectedRows();
                                                    };break;
                                                }
                                            });                                            
                                        } else {
                                            dhtmlx.message({
                                                title:_("Wiadomość"),
                                                type:"alert",
                                                text:_("Wybierz pozycję w tabeli!")
                                            });                                                 
                                        }
                                }
                                
                            });
                            
                            var componentsGrid = newZlecenieLayout.cells("c").attachGrid({
                                image_path:'codebase/imgs/',
                                columns: [                                                                           
                                    {label: _("Komponent Kod"),       id: "component_kod",      type: "ro", sort: "str", align: "left", width: 100},                                                                        
                                    {label: _("Komponent"),           id: "component_name",     type: "ro", sort: "str", align: "left", width: 150},                                  
                                    {label: _("Wymagana ilość"),      id: "amount_need",        type: "ro", sort: "str", align: "left", width: 50},                                    
                                    {label: _("Dostępna ilość"),      id: "amount_available",   type: "ro", sort: "str", align: "left", width: 50},
                                    {label: _("Zlecenie"),            id: "zlecenie",           type: "ro", sort: "str", align: "left", width: 100},												
                                    {id: "component_id"},												
                                    {id: "available"}                                    
                                ]
                            });   
                            componentsGrid.attachHeader(",#text_filter,#select_filter");
                            componentsGrid.setColumnHidden(5,true);
                            componentsGrid.setColumnHidden(6,true);
                            componentsGrid.attachEvent("onRowCreated", function(rId,rObj,rXml){
                                var data = componentsGrid.getRowData(rId);
                                if (data.available == 0) {
                                    componentsGrid.setRowColor(rId,"pink");
                                } else if(data.available == 2) {
                                    componentsGrid.setRowColor(rId,"yellow");
                                }
                            });   
                            componentsGrid.attachEvent("onRowSelect", function(id,ind){
                                var data = componentsGrid.getRowData(componentsGrid.getSelectedRowId());                                                                        
                                if (data.available == 0) {                                    
                                    componentsGridToolbar.enableItem("Add");
                                } else {
                                    componentsGridToolbar.disableItem("Add");
                                }
                            });                            
                            componentsGrid.fill = function(positionId) {                                    
                                this.clearAll();                                                                               
                                ajaxGet("api/positions/list/components/" + positionId, "", function(data){
                                    if (data.success && data.data) {																										
                                        componentsGrid.parse((data.data), "js");
                                    }
                                });
                            };                                                       
                            
                            var formStructure = [
                                {type: "settings", position: "label-left", labelWidth: 110, inputWidth: 160},		
                                {type: "input",  name: "order_kod",          label: _("Zamowienie Kod"), readonly: true},
                                {type: "input",  name: "order_name",         label: _("Zamowienie"), readonly: true},
                                {type: "input",  name: "order_position_kod", label: _("Pozycja Kod"), readonly: true},
                                {type: "input",  name: "product_kod",        label: _("Produkt Kod"), readonly: true},
                                {type: "input",  name: "product_name",       label: _("Produkt"), readonly: true},
                                {type: "input",  name: "amount",             label: _("Ilosc"), readonly: true},
                                {type: "input",  name: "price",              label: _("Cena"), readonly: true},
                                {type: "input",  name: "summa",              label: _("Suma"), readonly: true},
                                {type: "input",  name: "num_week",           label: _("Data dostawy"),
                                    note: {text: _("Numer tygodnia kiedy produkt byc gotowy.")}
                                },
                                {type: "input",  name: "description",        label: _("Opis"), rows: 3, readonly: true}                              
                            ];
                            informationFormPositionToolbar = newZlecenieLayout.cells("b").attachToolbar({
                                    iconset: "awesome",
                                    items: [
                                        {type: "text", id: "title", text: _("Informacja")},                                
                                        {type: "spacer"},
                                        {id: "Hide", type: "button", img: "fa fa-arrow-right"}
                                    ]
                            });     
                            informationFormPositionToolbar.attachEvent("onClick", function(id) { 
                                if (id == 'Hide') {
                                    newZlecenieLayout.cells("b").collapse();                        
                                }                    
                            });
                            var informationFormPosition = newZlecenieLayout.cells("b").attachForm(formStructure);
                            informationFormPosition.bind(ordersPositionsGrid);                                                                                             
			};break;
                        case 'Edit':{                            
                            var selectedZlecenieId   = zleceniaGrid.getSelectedRowId();                                                        
                            if (selectedZlecenieId) {                                      
                                var selectedZlecenie   = zleceniaGrid.getRowData(selectedZlecenieId);
                                var editZlecenieWindow = createWindow(_("Edytuj zlecenie"), 400, 750);
                                var editZlecenieLayout = editZlecenieWindow.attachLayout("2U");
                                editZlecenieLayout.cells("a").hideHeader();
                                editZlecenieLayout.cells("b").hideHeader(); 
                                
                                tasksByZlecenieToolbar = editZlecenieLayout.cells("a").attachToolbar({
                                        iconset: "awesome",
                                        items: [
                                            {type: "text", id: "title", text: _("Zadania")},                                
                                            {type: "spacer"},
                                            {id:"Add",  type: "button", img: "fa fa-plus-square"}
                                        ]
                                });    
                                tasksByZlecenieToolbar.attachEvent("onClick", function(id) { 
                                    switch (id){
                                        case 'Add':{                                                   
                                            var newTaskForZlecenieWindow = createWindow(_("Dodaj zadanie"), 400, 400);
                                            var newTaskForZlecenieLayout = newTaskForZlecenieWindow.attachLayout("1C");
                                            newTaskForZlecenieLayout.cells("a").hideHeader();
                                            
                                            tasksForComponentGridToolbar = newTaskForZlecenieLayout.cells("a").attachToolbar({
                                                iconset: "awesome",
                                                items: [
                                                    {type: "text", id: "title", text: _("Zadania")},                                
                                                    {type: "spacer"},
                                                    {id:"Add", type: "button", img: "fa fa-check-square"}
                                                ]
                                            });  
                                            tasksForComponentGridToolbar.attachEvent("onClick", function(buttonId) {
                                                if (buttonId == "Add") {
                                                    var checked = tasksForComponentGrid.getCheckedRows(0).split(",");
                                                    if (checked[0] !== "") {
                                                        checked.forEach(function(elem) {
                                                            var data = tasksForComponentGrid.getRowData(elem);
                                                            var newId = (new Date()).valueOf();
                                                            tasksByZlecenie.addRow(newId,[
                                                                data.checked, data.task_kod, data.task_name, data.amount
                                                            ]);
                                                        });
                                                    } else {
                                                        dhtmlx.message({
                                                            title:_("Wiadomość"),
                                                            type:"alert",
                                                            text:_("Wybierz zadania!")
                                                        });                                                        
                                                    }
                                                }
                                            });
                                            
                                            var tasksForComponentGrid = newTaskForZlecenieLayout.cells("a").attachGrid({
                                                image_path:'codebase/imgs/',
                                                columns: [    
                                                    {label: _(""),              id: "checked",         type: "ch", sort: "str", align: "left", width: 20},                                                                                                                                                                                                                                                
                                                    {label: _("Zadanie Kod"),   id: "task_kod",        type: "ro", sort: "str", align: "left", width: 50},
                                                    {label: _("Zadanie"),       id: "task_name",       type: "ro", sort: "str", align: "left", width: 150},                                                                                                                                                                                
                                                    {label: _("Ilosc"),         id: "amount",          type: "ed", sort: "str", align: "left", width: 50}                                                                                                                                             
                                                ]
                                            }); 
                                            tasksForComponentGrid.fill = function (productId) {
                                                this.clearAll(); 
                                                ajaxGet("api/products/availabletasks/" + productId, '', function(data){                                     
                                                    if (data && data.success){
                                                        tasksForComponentGrid.parse((data.data), "js");
                                                    }
                                                });                                    
                                            };  
                                            tasksForComponentGrid.fill(selectedZlecenie.product_id);
                                        };break;
                                    }
                                });
                                var tasksByZlecenie = editZlecenieLayout.cells("a").attachGrid({
                                    image_path:'codebase/imgs/',
                                    columns: [    
                                        {label: _(""),              id: "checked",         type: "ch", sort: "str", align: "left", width: 20},
                                        {label: _("Zamowienie Kod"),id: "order_kod",       type: "ro", sort: "str", align: "left", width: 50},
                                        {label: _("Pozycja Kod"),   id: "position_kod",    type: "ro", sort: "str", align: "left", width: 50},
                                        {label: _("Zadanie Kod"),   id: "task_kod",        type: "ro", sort: "str", align: "left", width: 50},
                                        {label: _("Zadanie"),       id: "task_name",       type: "ro", sort: "str", align: "left", width: 150},
                                        {label: _("Data dostawy"),  id: "num_week",        type: "ro", sort: "str", align: "left", width: 50},                                                                                           
                                        {label: _("Ilość zadan"),   id: "declared_amount", type: "ed", sort: "str", align: "left", width: 50},
                                        {id: "order_position_id"},
                                        {id: "product_id"},
                                        {id: "task_id"},
                                        {id: "kod"}                                        
                                    ],
                                    multiselect: true
                                });  
                                tasksByZlecenie.attachHeader(',#select_filter,#select_filter,#select_filter,#select_filter,#text_filter'); 
                                tasksByZlecenie.setColumnHidden(7,true);
                                tasksByZlecenie.setColumnHidden(8,true);
                                tasksByZlecenie.setColumnHidden(9,true);
                                tasksByZlecenie.setColumnHidden(10,true);
                                tasksByZlecenie.fill = function (zlecenieId) {
                                    this.clearAll(); 
                                    ajaxGet("api/declaredworks/listforzlecenie/" + zlecenieId, '', function(data){                                     
                                        if (data && data.success){
                                            tasksByZlecenie.parse((data.data), "js");
                                        }
                                    });                                    
                                };
                                tasksByZlecenie.fill(selectedZlecenieId);
                                
                                var editZlecenieFormStruct = [
                                        {type: "settings", position: "label-left", labelWidth: 110, inputWidth: 160},		
                                        {type: "input", name: "kod",          readonly: true, label: _("Kod zlecenia")},
                                        {type: "input", name: "product_name", readonly: true, label: _("Produkt")},		                        
                                        {type: "input", name: "amount",       readonly: true, label: _("Ilość produktu"), 
                                            note: {text: _("Ilość produktu w zamowieniu")}    
                                        },		                        
//                                        {type: "input", name: "num_week",     readonly: true, label: _("Data dostawy"),                                             
//                                            note: {text: _("Numer tygodnia kiedy produkt musi byc gotowy.")}},
                                        {type: "block", blockOffset: 0, position: "laabel-left", list: [
                                            {type: "button", name: "save",   value: _("Zapisz"), offsetTop:18}                                            
                                        ]} 
                                        
                                ];    
                                
                                zlecenieFormToolbar = editZlecenieLayout.cells("b").attachToolbar({
                                    iconset: "awesome",
                                    items: [
                                        {type: "text", id: "title", text: _("Zlecenie")}                                                                        
                                    ]
                                });
                                var dhxZlecenieForm = editZlecenieLayout.cells("b").attachForm(editZlecenieFormStruct);
                                var selectedZlecenieData = zleceniaGrid.getRowData(selectedZlecenieId); 
                                dhxZlecenieForm.setFormData(selectedZlecenieData); 
                                
                                dhxZlecenieForm.attachEvent("onButtonClick", function(name){
                                    switch (name){  
                                        case 'save':{
                                            var checked = tasksByZlecenie.getCheckedRows(0).split(",");
                                            if (checked[0] !== "") {
                                                var nullable = checked.some(function(elem) {
                                                    var data = tasksByZlecenie.getRowData(elem);
                                                    if (data.amount == "") {
                                                        dhtmlx.message({
                                                            title:_("Wiadomość"),
                                                            type:"alert",
                                                            text:_("Wpisz ilosc do wrzystkich zadan!")
                                                        });
                                                        return true;
                                                    }
                                                    return false;
                                                });
                                                if (!nullable) {
                                                    tasksByZlecenie.forEachRow(function(elem) {
                                                        var rowData = tasksByZlecenie.getRowData(elem);
                                                        if (tasksByZlecenie.cells(elem,0).isChecked()) {
                                                            ajaxGet("api/declaredworks/" + elem + "/edit", rowData, function(data){

                                                            });  
                                                        } else {
                                                            ajaxDelete("api/declaredworks/" + elem, "", function(data){
                                                                if (data && data.success) {
                                                                    tasksByZlecenie.deleteRow(elem);
                                                                }
                                                            }); 
                                                        }
                                                    }); 
                                                    dhtmlx.message({
                                                        title:_("Wiadomość"),
                                                        type:"alert",
                                                        text:_("Zapisane!")
                                                    });                                                    
                                                }
                                            }
                                        };break;            
                                        case 'cancel':{
                                            
                                        };break;
                                    }
                                });
                            } else {
                                dhtmlx.message({
                                    title:_("Wiadomość"),
                                    type:"alert",
                                    text:_("Wybierz zlecenie!")
                                }); 
                            }
                        };break;
                        case 'Del':{
                            var checked = zleceniaGrid.getCheckedRows(0);
                            if (checked) {
                                dhtmlx.confirm({
                                    title: _("Ostrożność"),                                    
                                    text: _("Czy na pewno chcesz usunąć zlecenie? Zlecenie zostanie usunięte ze wrzystkimi elementami!"),
                                    callback: function(result){
                                        if (result) {                                
                                            ajaxGet("api/declaredworks/delzlec/" + checked, "", function(data){
                                                if (data && data.success){
                                                    var groupId = grupyTree.getSelectedId;
                                                    if (groupId) {
                                                        zleceniaGrid.zaladuj(groupId);
                                                    } else {
                                                        zleceniaGrid.zaladuj(0);
                                                    }                                                    
                                                }
                                            });
                                        }
                                    }
                                });                                                                                                    
                            } else {
                                dhtmlx.message({
                                    title:_("Wiadomość"),
                                    type:"alert",
                                    text:_("Wybierz zlecenie!")
                                });                                
                            }
                        };break;
                        case 'AddTotal': {
                            var data = zleceniaGrid.getCheckedRows(0);                             
                            if (data) {  
                                dhtmlx.confirm({
                                    title:_("Ostrożność"),                                    
                                    text:_("Utwórzyć wspólne zlecenie?"),
                                    callback: function(result){
                                                if (result) {
                                                    var checked = zleceniaGrid.getCheckedRows(0).split(",");
                                                    var selectedDifferentProductsKods = [];
                                                    var selectedDifferentZleceniaKods = [];
                                                    
                                                    var prevProductKod  = 0;
                                                    var prevZlecenieKod = 0;                                                    
                                                    checked.forEach(function(elem) {
                                                        var thisProductKod  = zleceniaGrid.getRowData(elem).product_kod;
                                                        var thisZlecenieKod = zleceniaGrid.getRowData(elem).kod;  
                                                        if ((thisProductKod !== prevProductKod) && (prevProductKod !== 0)) {
                                                            selectedDifferentProductsKods.push(thisProductKod);
                                                        };
                                                        if ((thisZlecenieKod !== prevZlecenieKod) && (prevZlecenieKod !== 0)) {
                                                            selectedDifferentZleceniaKods.push(thisZlecenieKod);
                                                        }
                                                        prevProductKod = thisProductKod;
                                                        prevZlecenieKod = thisZlecenieKod;
                                                    });
                                                    if (selectedDifferentProductsKods.length) {
                                                        dhtmlx.message({
                                                            title:_("Wiadomość"),
                                                            type:"alert",
                                                            text:_("Nie można dodawać różne produkty do wspólnego zlecenia!")
                                                        }); 
                                                    } else if (!selectedDifferentZleceniaKods.length) {
                                                        dhtmlx.message({
                                                            title:_("Wiadomość"),
                                                            type:"alert",
                                                            text:_("To jest jedno zlecenie!")
                                                        });
                                                    } else {
                                                        ajaxGet("api/declaredworks/makegeneral/" + data, "" , function(data){
                                                            if (data && data.success) {
                                                                var selectedGroup = grupyTree.getSelectedId();
                                                                if (selectedGroup) {
                                                                    zleceniaGrid.zaladuj(selectedGroup);
                                                                } else {
                                                                    zleceniaGrid.zaladuj(0);
                                                                }                                                           
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
                                            }
                                });                                                                
                            } else {
                                dhtmlx.message({
                                    title:_("Wiadomość"),
                                    type:"alert",
                                    text:_("Wybierz rekordy, aby dodać do wspólnego zlecenia!")
                                }); 
                            }
                        };break;
                        case 'Redo':{
                            zleceniaGrid.zaladuj();
                            grupyTree.uncheckItem(grupyTree.getAllChecked());
                            grupyTree.unselectItem(grupyTree.getSelectedId());
                        };break;
		    }
		});     
                var searchElem = zleceniaGridToolBar.getInput('szukaj');               
		var zleceniaGrid = zleceniaLayout.cells("b").attachGrid({
		    image_path:'codebase/imgs/',
		    columns: [  
                        {label: "",                    id:'checked',           width: 30,  type: "ch", align: "center"},                        
                        {label: "Zlecenie Kod",        id:'kod',               width: 100, type: "ro", sort: "str",  align: "center"},
                        {label: "Zadanie Kod",         id:'task_kod',          width: 100, type: "ro", sort: "str",  align: "left"},                        
                        {label: "Zadanie",             id:'task_name',         width: 200, type: "ro", sort: "str",  align: "left"},                        
                        {label: "Produkt Kod",         id:'product_kod',       width: 100, type: "ro", sort: "str",  align: "left"},
                        {label: "Imie produktu",       id:'product_name',      width: 200, type: "ro", sort: "str",  align: "left"},
                        //{label: "Typ produktu",        id:'product_type_name', width: 200, type: "ro", sort: "str",  align: "left"},
                        {label: "Ilość produktu",      id:'amount',            width: 60,  type: "ro",sort: "str",  align: "right"},
                        {label: "Zadeklarowana ilość", id:'declared_amount',   width: 60,  type: "edn",sort: "str",  align: "right"},
                        {label: "Zrobiona ilość",      id:'done_amount',       width: 60,  type: "edn",sort: "str",  align: "right"},
                        {label: "Zamknięte",           id:'closed',            width: 30,  type: "ch", align: "center"},
                        {label: "Data dodania",        id:'created_at',        width: 120, type: "ro", sort: "date", align: "center"},
                        {label: "Data zamkniecia",     id:'date_closing',      width: 120, type: "ro", sort: "date", align: "center"},
                        {label: "Data dostawy",        id:'num_week',          width: 120, type: "ro", align: "center"},
                        {id:'product_id'}
                    ],
                    multiline: true,
                    multiselect: true
		});  
                zleceniaGrid.setColumnHidden(13,true);
                zleceniaGrid.attachHeader("#master_checkbox,#select_filter,#select_filter,#select_filter,#select_filter,#select_filter,#numeric_filter,#text_search,#text_search,#text_search,#text_search,#text_search,#text_search");
                zleceniaGrid.getFilterElement(5)._filter = function (){
                    var input = this.value; // gets the text of the filter input
                    input = input.trim().toLowerCase().split(' ');
                    return function(value, id){
                        //for(var i = 0; i<ordersPositionsGrid.getColumnsNum(); i++){ // iterating through the columns
                            var val = zleceniaGrid.cells(id, 5).getValue(); // gets the value of the current                                                    
                            //making pattern string for regexp
                            var searchStr = '';
                            for (var i = 0; i < input.length; i++) {
                                searchStr = searchStr + input[i] + "(.*)";                           
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
                zleceniaGrid.attachEvent("onRowCreated", function(rId,rObj,rXml){
                    var data = zleceniaGrid.getRowData(rId);                    
                    if (data.closed == 0) {
                        zleceniaGrid.setRowColor(rId,"pink");
                    } else {
                        zleceniaGrid.setRowColor(rId,"lightgrey");
                    }
                });   
                zleceniaGrid.attachEvent("onCheck", function(rId,cInd,state){
                    var data = zleceniaGrid.getRowData(rId);                    
                    if (state) {                    
                        zleceniaGrid.forEachRow(function(id) {
                            var currentRowData = zleceniaGrid.getRowData(id);
                            if (currentRowData.kod === data.kod) {
                                zleceniaGrid.setRowData(id,{"checked": true});
                                zleceniaGrid.setRowTextBold(id); 
                            }
                        });                                         
                    } else {
                        zleceniaGrid.forEachRow(function(id) {
                            var currentRowData = zleceniaGrid.getRowData(id);
                            if (currentRowData.kod === data.kod) {
                                zleceniaGrid.setRowData(id,{"checked": false});
                                zleceniaGrid.setRowTextStyle(id, "font-weight: normal;"); 
                            }
                        });                                                  
                    }                   
                });                 
                zleceniaGrid.setColumnColor("white,white,white,white,white,white,#d5f1ff");
		zleceniaGrid.setDateFormat("%Y-%m-%d","%Y-%m-%d");                
		zleceniaGrid.zaladuj = function(i = 0){
                    this.clearAll();
                    var ids = Array();
                    ids = (typeof i === 'string' || typeof i === 'number')  ? [i] : i;
                    var new_data = ajaxGet("api/declaredworks/list/" + ids, "", function(data){
                        if (data && data.success){                            
                                zleceniaGrid.parse(data.data, "js");
                            }
                        });			
		};    
//		var dpZleceniaGrid = new dataProcessor("api/declaredworks",'json');
//		dpZleceniaGrid.init(zleceniaGrid);
//		dpZleceniaGrid.enableDataNames(true);
//		dpZleceniaGrid.setTransactionMode("REST");
//		dpZleceniaGrid.enablePartialDataSend(true);
//		dpZleceniaGrid.enableDebug(true);
//		dpZleceniaGrid.setUpdateMode("row", true);
//                dpZleceniaGrid.attachEvent("onBeforeDataSending", function(id, state, data){
//                    data.id = id;
//                    ajaxGet("api/declaredworks/" + id + "/edit", data, function(data){                                                            
//                        console.log(data);
//                    });
//                });                 
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
