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
                            var dhxWins = new dhtmlXWindows();
                            var window = dhxWins.createWindow({
                                id:"w1",
                                left:20,
                                top:30,
                                width: 700,
                                height: 500,
                                center:true,
                                caption: _("Dodaj zlecenie"),
                                header: true,
                                onClose:function(){}
                            });                            
                            var newZlecenieLayout = window.attachLayout("3J");
                            newZlecenieLayout.cells("a").setText(_("Pozycji zamowien"));                            
                            newZlecenieLayout.cells("b").setText(_("Informacja"));                            
                            newZlecenieLayout.cells("c").setText(_("Komponenty"));  
                            
                            ordersPositionsGridMenu = newZlecenieLayout.cells("a").attachMenu({
                                    iconset: "awesome",
                                    items: [
                                        {id:"Add",  text: _("Zapisz zlecenie"),  img: "fa fa-plus-square"}
                                    ]
                            }); 
                            ordersPositionsGridMenu.attachEvent("onClick", function(id) { 
                                switch (id){
                                    case 'Add':{
                                        var selectedPosition = ordersPositionsGrid.getSelectedRowId();
                                        if (selectedPosition) {
                                            var dhxWins = new dhtmlXWindows();
                                            var window = dhxWins.createWindow({
                                                id:"w1",
                                                left:20,
                                                top:30,
                                                width: 500,
                                                height: 400,
                                                center:true,
                                                caption: _("Dodaj zlecenie do produktu"),
                                                header: true,
                                                onClose:function(){}
                                            });                            
                                            var newZlecenieForMainProductLayout = window.attachLayout("2U");
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
                                                ],
                                                multiselect: true
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
                                                    this.setRowTextStyle(rId, 
                                                    "background-color: lightgray; color: gray; font-family: italy;");                                    
                                                } else if (state=='1'){
                                                    this.setRowTextStyle(rId, 
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
                                                                    success = data.success;
                                                                }
                                                            });
                                                            zleceniaGrid.zaladuj(0);
                                                        }); 
                                                        ordersPositionsGrid.deleteSelectedRows();
                                                    };break;
                                                }
                                            }); 
                                        } else {
                                            dhtmlx.message({
                                                title:_("Wiadomość"),
                                                type:"alert",
                                                text:_("Wybierz produkt!")
                                            }); 
                                        }
                                    };break;
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
                                    {label: _("Data dostawy"),   id: "date_delivery",      type: "ro", sort: "str", align: "left", width: 50},
                                    {label: _("Szczegoly"),      id: "description",        type: "ro", sort: "str", align: "left", width: 150},												
                                    {label: _("Available"),      id: "available",          type: "ro", sort: "str", align: "left", width: 150},												                                    
                                ],
                                multiline: true,
                                multiselect: true
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
                            ordersPositionsGrid.fill = function() {                                    
                                this.clearAll();                                                                               
                                ajaxGet("api/positions/list/freepositions", "", function(data){
                                    if (data.success && data.data) {																										
                                        ordersPositionsGrid.parse((data.data), "js");
                                    }
                                });
                            };
                            ordersPositionsGrid.fill(); 
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
                            ordersPositionsGrid.attachEvent("onRowSelect", function(id,ind){
                                var data = ordersPositionsGrid.getRowData(ordersPositionsGrid.getSelectedRowId());                                                                                                        
                                if (data.available != 1) {
                                    ordersPositionsGridMenu.setItemDisabled("Add");
                                } else {
                                    ordersPositionsGridMenu.setItemEnabled("Add");
                                }
                                componentsGrid.fill(id);
                            });
//                            ordersPositionsGrid.attachEvent("onCheck", function(rId,cInd,state){
//                                var checked = ordersPositionsGrid.getCheckedRows(1).split(",");
//                                checked.some(function(elem){
//                                    if (ordersPositionsGrid.getRowData(elem).available == 0) {
//                                        dhtmlx.message({
//                                            title:_("Wiadomość"),
//                                            type:"alert",
//                                            text:_("Nie można dodawać różne produkty do wspólnego zlecenia!")
//                                        }); 
//                                        ordersPositionsGrid.setRowTextStyle(rId, "font-weight: normal;");  
//                                        ordersPositionsGrid.cells(rId, 1).setValue(0);
//                                        return true;
//                                    }
//                                    return false;
//                                });
//                                if (state) {
//                                    ordersPositionsGrid.setRowTextBold(rId); 
//                                } else {
//                                    ordersPositionsGrid.setRowTextStyle(rId, "font-weight: normal;"); 
//                                }                   
//                            });                                                                                                               
                            
                            componentsGridMenu = newZlecenieLayout.cells("c").attachMenu({
                                    iconset: "awesome",
                                    items: [
                                        {id:"Add",  text: _("Zapisz zlecenie"),  img: "fa fa-plus-square"}
                                    ]
                            });    
                            componentsGridMenu.attachEvent("onClick", function(id) { 
                                switch (id){
                                    case 'Add':{
                                            var selectedPosition      = ordersPositionsGrid.getSelectedRowId();
                                            var selectedComponentData = componentsGrid.getRowData(componentsGrid.getSelectedRowId());
                                            selectedComponentData.order_position_id = selectedPosition;
                                            
                                            var dhxWins = new dhtmlXWindows();
                                            var window = dhxWins.createWindow({
                                                id:"w1",
                                                left:20,
                                                top:30,
                                                width: 500,
                                                height: 400,
                                                center:true,
                                                caption: _("Dodaj zlecenie do komponentu"),
                                                header: true,
                                                onClose:function(){}
                                            });                            
                                            var newZlecenieForComponentLayout = window.attachLayout("2U");
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
                                                ],
                                                multiselect: true
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
                                            data.position_id  = selectedPosition;
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
                                                            ajaxPost("api/declaredworks", data, "");
                                                            zleceniaGrid.zaladuj(0);
                                                        });  
                                                        componentsGrid.deleteSelectedRows();
                                                    };break;
                                                }
                                            });                                            
                                    };break;
                                }
                            });
                            var componentsGrid = newZlecenieLayout.cells("c").attachGrid({
                                image_path:'codebase/imgs/',
                                columns: [                                                                           
                                    {label: _("Komponent Kod"),       id: "component_kod",      type: "ro", sort: "str", align: "left", width: 100},                                                                        
                                    {label: _("Komponent"),           id: "component_name",     type: "ro", sort: "str", align: "left", width: 150},                                  
                                    {label: _("Wymagana ilość"),      id: "amount_need",        type: "ro", sort: "str", align: "left", width: 50},                                    
                                    {label: _("Dostępna ilość"),      id: "amount_available",   type: "ro", sort: "str", align: "left", width: 50},                                    
                                    {label: _("Component"),           id: "component_id",       type: "ro", sort: "str", align: "left", width: 50},												
                                    {label: _("Available"),           id: "available",          type: "ro", sort: "str", align: "left", width: 50},
                                    {label: _("Zlecenie"),            id: "zlecenie",           type: "ro", sort: "str", align: "left", width: 100}												
                                ],
                                multiline: true,
                                multiselect: true
                            });   
                            componentsGrid.attachHeader(",#text_filter,#select_filter");
                            componentsGrid.setColumnHidden(4,true);
                            componentsGrid.setColumnHidden(5,true);
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
                                if (data.available != 0) {
                                    componentsGridMenu.setItemDisabled("Add");
                                } else {
                                    componentsGridMenu.setItemEnabled("Add");
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
                                {type: "input",  name: "date_delivery",      label: _("Data wysylki")},
                                {type: "input",  name: "description",        label: _("Opis"), rows: 3, readonly: true}                              
                            ];
                            var dhxAddingFormPosition = newZlecenieLayout.cells("b").attachForm(formStructure);
                            dhxAddingFormPosition.bind(ordersPositionsGrid);
//                            var tasksTogetherGridMenu = newZlecenieLayout.cells("d").attachMenu({
//                                iconset: "awesome",
//                                            items: [
//                                                {id:"Add",  text: _("Dodaj"),  img: "fa fa-plus-square"},
//                                                {id:"Edit", text: _("Edytuj"), img: "fa fa-edit"},
//                                                {id:"Del",  text: _("Usun"),   img: "fa fa-minus-square"}
//                                            ]  
//                            
//                            });
//                            var tasksTogetherGrid = newZlecenieLayout.cells("d").attachGrid({
//                                image_path:'codebase/imgs/',
//                                columns: [    
//                                    {label: _(""),              id: "checked",         type: "ch", sort: "str", align: "left", width: 20},                                                                        
//                                    {label: _("Zamowienie Kod"),id: "order_kod",       type: "ro", sort: "str", align: "left", width: 50},
//                                    {label: _("Pozycja Kod"),   id: "position_kod",    type: "ro", sort: "str", align: "left", width: 50},
//                                    {label: _("Komponent Kod"), id: "component_kod",   type: "ro", sort: "str", align: "left", width: 50},
//                                    {label: _("Komponent"),     id: "component_name",  type: "ro", sort: "str", align: "left", width: 150},                                    
//                                    {label: _("Zadanie Kod"),   id: "kod",             type: "ro", sort: "str", align: "left", width: 50},
//                                    {label: _("Zadanie"),       id: "name",            type: "ro", sort: "str", align: "left", width: 150},                                                                                                            
//                                    {label: _("Ilosc robot"),         id: "declared_amount", type: "ed", sort: "str", align: "left", width: 50},
//                                    {id: "task_id"}												
//                                ],
//                                multiselect: true
//                            });  
                            
//var selectedOrderPositionId = ordersPositionsGrid.getSelectedRowId();
//var orderPositionData = ordersPositionsGrid.getRowData(selectedOrderPositionId); 

 

  



                                       
//tasksForProductGrid.fill(orderPositionData.product_id);                      
//tasksForProductGrid.forEachRow(function(id){
//    tasksForProductGrid.cells(id,5).setValue('1');
//});                            
//                            var componentsForProductGrid = newZlecenieLayout.cells("c").attachGrid({
//                                image_path:'codebase/imgs/',
//                                columns: [                                                                          
//                                    {
//                                        label: _("Kod"),
//                                        width: 100,
//                                        id: "kod",
//                                        type: "ro", 
//                                        sort: "str", 
//                                        align: "left"
//                                    },
//                                    {
//                                        label: _("Imie komponentu"),
//                                        width: 100,
//                                        id: "name",
//                                        type: "ro", 
//                                        sort: "str", 
//                                        align: "left"
//                                    },
//                                    {
//                                        label: _("Typ"),
//                                        width: 100,
//                                        id: "product_type_name",
//                                        type: "ro", 
//                                        sort: "str", 
//                                        align: "left"
//                                    },
//                                    {
//                                        label: _("Group"),
//                                        width: 100,
//                                        id: "product_group_name",
//                                        type: "ro", 
//                                        sort: "str", 
//                                        align: "left"
//                                    },                        
//                                    {
//                                        label: _("Ilość niezbedna"),
//                                        width: 100,
//                                        id: "amount",
//                                        type: "ro", 
//                                        sort: "str", 
//                                        align: "left"
//                                    },                        
//                                    {
//                                        label: _("Ilość dostepna"),
//                                        width: 100,
//                                        id: "amount_available",
//                                        type: "ro", 
//                                        sort: "str", 
//                                        align: "left"
//                                    } 												
//                                ]
//                            });
//                            componentsForProductGrid.fill = function(ids) {                                    
//                                this.clearAll(); 
//                                ajaxGet("api/positions/list/components/" + ids, '', function(data){                                     
//                                    if (data && data.success){
//                                        componentsForProductGrid.parse((data.data), "js");
//                                    }
//                                });
//                            };                             
                            
//                            var myForm = newZlecenieLayout.cells("d").attachForm([                                                                    
//                                {type: "block",    name: "buttonblock",inputWidth: 200,    className: "myBlock", list:[
//
//                                    {type: "button",   name: "save",   value:_("Zapisz"), offsetTop:18},
//                                    {type: "newcolumn"},
//                                    {type: "button",   name: "cancel", value:_("Anuluj"), offsetTop:18}
//                                ]}                                    
//                            ]);
//                            myForm.attachEvent("onButtonClick", function(name){
//                                switch (name){
//                                    case 'save': {   
//                                            var data;
//                                            var orderPositionId = ordersPositionsGrid.getSelectedRowId();
//                                            var checkedRows = tasksForProductGrid.getCheckedRows(0);
//                                            checkedRows = checkedRows.split(",");
//                                            checkedRows.forEach(function(element) {                                                    
//                                                data = tasksForProductGrid.getRowData(element);
//                                                data.order_position_id = orderPositionId;
//                                                ajaxPost("api/declaredworks", data, "");                                                                                                        
//                                            });
//                                            zleceniaGrid.zaladuj();                        
//                                    };break;
//                                    case 'cancel':{
//                                        myForm.clear();
//                                    };break;
//                                }
//                            });                             
//                                var ordersCombo = myForm.getCombo("orders");
//                                ordersCombo.enableFilteringMode(true);                                
//                                ajaxGet("api/orders/list/0",'',function(data){
//                                    if (data.data && data.success){
//                                        ordersCombo.addOption(data.data);                                                    
//                                    }
//                                });  
                                                                   
//                                myForm.attachEvent("onInputChange",function(name, value, form){
//                                    if (name == "product") {                                                    
//                                        ordersPositionsGrid.filterBy(1,function(data){                                                
//                                            var input = value.trim().toLowerCase().split(' ');
//                                            var searchStr = '';
//                                            for (var i = 0; i < input.length; i++) {
//                                                searchStr = searchStr + input[i] + "(.+)";                                                                                                                        
//                                            }
//                                            var regExp = new RegExp("^" + searchStr, "ig");
//                                                if (data.toLowerCase().match(regExp)){                                                             
//                                                    return true;
//                                                } 
//                                        });
//                                    }
//                                });
//                                myForm.attachEvent("onButtonClick", function(name){
//                                    switch (name){
//                                        case 'save': {   
//                                                var data;
//                                                var orderPositionId = ordersPositionsGrid.getSelectedRowId();
//                                                var checkedRows = tasksForProductGrid.getCheckedRows(0);
//                                                checkedRows = checkedRows.split(",");
//                                                checkedRows.forEach(function(element) {                                                    
//                                                    data = tasksForProductGrid.getRowData(element);
//                                                    data.order_position_id = orderPositionId;
//                                                    ajaxPost("api/declaredworks", data, "");                                                                                                        
//                                                });
//                                                zleceniaGrid.zaladuj();                        
//                                        };break;
//                                        case 'cancel':{
//                                            myForm.clear();
//                                        };break;
//                                    }
//                                });     
                                 
//                                myForm.attachEvent("onInputChange",function(name, value, form){
//                                    if (name == "product") {                                                    
//                                        ordersPositionsGrid.filterBy(1,function(data){                                                
//                                            var input = value.trim().toLowerCase().split(' ');
//                                            var searchStr = '';
//                                            for (var i = 0; i < input.length; i++) {
//                                                searchStr = searchStr + input[i] + "(.+)";                                                                                                                        
//                                            }
//                                            var regExp = new RegExp("^" + searchStr, "ig");
//                                                if (data.toLowerCase().match(regExp)){                                                             
//                                                    return true;
//                                                } 
//                                        });
//                                    }
//                                });                                
                                 

                               


                                
                                                                
                                                                                             
			};break;
                        case 'Edit':{
                            var selectedZlecenieId   = zleceniaGrid.getSelectedRowId();                            
                            if (selectedZlecenieId) {
                                var dhxWins = new dhtmlXWindows();
                                var window = dhxWins.createWindow({
                                    id:"w1",
                                    left:20,
                                    top:30,
                                    width: 500,
                                    height: 400,
                                    center:true,
                                    caption: _("Edytuj zlecenie"),
                                    header: true,
                                    onClose:function(){}
                                });                            
                                var editZlecenieLayout = window.attachLayout("2U");
                                editZlecenieLayout.cells("a").setText(_("Zadania"));
                                editZlecenieLayout.cells("b").setText(_("Informacja"));  
                                
                                tasksByZlecenieMenu = editZlecenieLayout.cells("a").attachMenu({
                                        iconset: "awesome",
                                        items: [
                                            {id:"Add",  text: _("Dodaj zadania"),  img: "fa fa-plus-square"}
                                        ]
                                });    
                                tasksByZlecenieMenu.attachEvent("onClick", function(id) { 
                                    switch (id){
                                        case 'Add':{
                                            var dhxWins = new dhtmlXWindows();
                                            var window = dhxWins.createWindow({
                                                id:"w1",
                                                left:20,
                                                top:30,
                                                width: 400,
                                                height: 400,
                                                center:true,
                                                caption: _("Dodaj zadanie"),
                                                header: true,
                                                onClose:function(){}
                                            });                            
                                            var newTaskForZlecenieLayout = window.attachLayout("2U");
                                            newTaskForZlecenieLayout.cells("a").setText(_("Zadania"));
                                            newTaskForZlecenieLayout.cells("b").setText(_("Funkcje")); 
                                            
                                            var tasksForComponentGrid = newTaskForZlecenieLayout.cells("a").attachGrid({
                                                image_path:'codebase/imgs/',
                                                columns: [    
                                                    {label: _(""),              id: "checked",         type: "ch", sort: "str", align: "left", width: 20},                                                                                                                                                                                                                                                
                                                    {label: _("Zadanie Kod"),   id: "kod",             type: "ro", sort: "str", align: "left", width: 50},
                                                    {label: _("Zadanie"),       id: "name",            type: "ro", sort: "str", align: "left", width: 150},                                                                                                                            
                                                    {label: _("Ilosc"),         id: "declared_amount", type: "ed", sort: "str", align: "left", width: 50},
                                                    {id: "task_id"}                                                  
                                                ],
                                                multiselect: true
                                            }); 
                                            tasksForComponentGrid.setColumnHidden(4,true);                                          
                                        };break;
                                    }
                                });
                                var tasksByZlecenie = editZlecenieLayout.cells("a").attachGrid({
                                    image_path:'codebase/imgs/',
                                    columns: [    
                                        {label: _(""),              id: "checked",         type: "ch", sort: "str", align: "left", width: 20},                                                                                                                                
                                        {label: _("Zadanie Kod"),   id: "task_kod",        type: "ro", sort: "str", align: "left", width: 50},
                                        {label: _("Zadanie"),       id: "task_name",       type: "ro", sort: "str", align: "left", width: 150},                                                                                                                            
                                        {label: _("Ilosc"),         id: "declared_amount", type: "ed", sort: "str", align: "left", width: 50}                                                                                           
                                    ],
                                    multiselect: true
                                });  
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
                                        {type: "calendar", name: "date_delivery",  label: _("Data dostawy"), 
                                            readonly: true, dateFormat: "%Y-%m-%d",
                                            note: {text: _("Data kiedy produkt musi byc gotowy.")}}                   
                                ];                                 
                                var dhxZlecenieForm = editZlecenieLayout.cells("b").attachForm(editZlecenieFormStruct);
                                var selectedZlecenieData = zleceniaGrid.getRowData(selectedZlecenieId); 
                                dhxZlecenieForm.setFormData(selectedZlecenieData);                                


                            } else {
                                dhtmlx.message({
                                    title:_("Wiadomość"),
                                    type:"alert",
                                    text:_("Wybierz zlecenie!")
                                }); 
                            }
                        };break;
                        case 'Del':{
                            var selectedZlecenieId = zleceniaGrid.getSelectedRowId();
                            if (selectedZlecenieId) {
                                ajaxDelete("api/declaredworks/" + selectedZlecenieId, "", function(data){
                                    if (data && data.success){
                                        zleceniaGrid.deleteSelectedRows();
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
                                ajaxGet("api/declaredworks/makegeneral/" + data, "" , function(data){
                                    console.log(data);
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
                        {label: "Typ produktu",        id:'product_type_name', width: 200, type: "ro", sort: "str",  align: "left"},
                        {label: "Zadeklarowana ilosc", id:'amount',            width: 60,  type: "edn",sort: "str",  align: "right"},
                        {label: "Zrobiona ilosc",      id:'done_amount',       width: 60,  type: "edn",sort: "str",  align: "right"},
                        {label: "Zamknięte",           id:'closed',            width: 30,  type: "ch", align: "center"},
                        {label: "Data dodania",        id:'created_at',        width: 120, type: "ro", sort: "date", align: "center"},
                        {label: "Data zamkniecia",     id:'date_closing',      width: 120, type: "ro", sort: "date", align: "center"},
                        {label: "Data wysylki",        id:'date_delivery',     width: 120, type: "ro", align: "center"}
                    ],
		    multiselect: true,
                    multiline: true                        
		});  
                zleceniaGrid.attachHeader(",#select_filter,#select_filter,#select_filter,#select_filter,#select_filter,#numeric_filter,#text_search,#text_search,#text_search,#text_search,#text_search,#text_search");
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
                    var checked = zleceniaGrid.getCheckedRows(0).split(",");
                    var prevProductKod = 0;
                    checked.some(function(elem){
                        var thisProductKod = zleceniaGrid.getRowData(elem).product_kod;
                        if ((thisProductKod !== prevProductKod) && (prevProductKod !== 0)) {
                            dhtmlx.message({
                                title:_("Wiadomość"),
                                type:"alert",
                                text:_("Nie można dodawać różne produkty do wspólnego zlecenia!")
                            }); 
                            zleceniaGrid.setRowTextStyle(rId, "font-weight: normal;");  
                            zleceniaGrid.cells(rId, 0).setValue(0);
                            return true;
                        } else {
                            prevProductKod = thisProductKod;
                        }
                        return false;
                    });
                    if (state) {
                        zleceniaGrid.setRowTextBold(rId); 
                    } else {
                        zleceniaGrid.setRowTextStyle(rId, "font-weight: normal;"); 
                    }                   
                });                 
                zleceniaGrid.setColumnColor("white,white,white,white,white,white,#d5f1ff");
//                var ordersCombo = zleceniaGrid.getCombo(5);
//		var productsCombo = zleceniaGrid.getCombo(2);
//                
//                ajaxGet("api/orders", '', function(data) {
//                    if (data.success && data.data) {
//                        data.data.forEach(function(order){
//                            ordersCombo.put(order.id, order.name);
//                        });
//                    }
//                });                
//                ajaxGet("api/products", '', function(data) {
//                    if (data.success && data.data) {
//                        data.data.forEach(function(product){
//                            productsCombo.put(product.id, product.name);
//                        });
//                    }
//                });
		//combo.enableFilteringMode(true);
		//combo.load("produkty/all");
		zleceniaGrid.setDateFormat("%Y-%m-%d","%Y-%m-%d");                
//                zleceniaGrid.enableAutoWidth(true);
//                zleceniaGrid.enableAutoHeight(true);
                //zleceniaGrid.enableDragAndDrop(true);
		//zleceniaGrid.enablePaging(true,15,5,document.body,true,"recInfoArea");
		//console.log(zleceniaGrid.getColumnCombo(5));
		//zleceniaGrid.setColTypes('ro','combo','ro','edtxt','edn','edtxt');
		//zleceniaGrid.setSubTree(treeGrupy, 2);
		
		//zleceniaGrid.setColumnIds("zlecenie,produkt,produktKod,kod,zamkniete,szt,data_dodania,data_zamkniecia,data_wysylki,plan_start,plan_stop,opis");
		//zleceniaGrid.setColValidators(["NotEmpty","","","NotEmpty","","ValidInteger"]);
		//zleceniaGrid.enableMultiselect(true); 
		//zleceniaGrid.enableEditEvents(false,true,true);
		//grupyTree = createGrupyTree(zleceniaLayout.cells("a"),zleceniaGrid);

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
		var dpZleceniaGrid = new dataProcessor("api/declaredworks",'json');
		dpZleceniaGrid.init(zleceniaGrid);
		dpZleceniaGrid.enableDataNames(true);
		dpZleceniaGrid.setTransactionMode("REST");
		dpZleceniaGrid.enablePartialDataSend(true);
		dpZleceniaGrid.enableDebug(true);
		dpZleceniaGrid.setUpdateMode("row", true);
                dpZleceniaGrid.attachEvent("onBeforeDataSending", function(id, state, data){
                    data.id = id;
                    ajaxGet("api/declaredworks/" + id + "/edit", data, function(data){                                                            
                        console.log(data);
                    });
                });  
                
//                var zleceniaMainGrid = zleceniaLayout.cells("c").attachGrid({
//		    image_path:'codebase/imgs/',
//		    columns: [  
//                        {label: "",                    id:'checked',           width: 30,  type: "ch", align: "center"},                        
//                        {label: "Zlecenie Kod",        id:'kod',               width: 100, type: "ro", sort: "str",  align: "center"},                       
//                        {label: "Produkt Kod",         id:'product_kod',       width: 100, type: "ro", sort: "str",  align: "left"},
//                        {label: "Imie produktu",       id:'product_name',      width: 200, type: "ro", sort: "str",  align: "left"},
//                        {label: "Typ produktu",        id:'product_type_name', width: 200, type: "ro", sort: "str",  align: "left"},
//                        {label: "Zadeklarowana ilosc", id:'amount',   width: 60,  type: "edn",sort: "str",  align: "right"},
//                        {label: "Zrobiona ilosc",      id:'done_amount',       width: 60,  type: "edn",sort: "str",  align: "right"},
//                        {label: "Zamknięte",           id:'closed',            width: 30,  type: "ch", align: "center"},
//                        {label: "Data dodania",        id:'created_at',        width: 120, type: "ro", sort: "date", align: "center"},
//                        {label: "Data zamkniecia",     id:'date_closing',      width: 120, type: "ro", sort: "date", align: "center"}
//                        
//                    ],
//		    multiselect: true,
//                    multiline: true                        
//		}); 
//		zleceniaMainGrid.zaladuj = function(i = 0){
//                    var ids = Array();
//                    ids = (typeof i === 'string' || typeof i === 'number')  ? [i] : i;
//                    var new_data = ajaxGet("api/declaredworks/mainlist/" + ids, "", function(data){
//                        if (data && data.success){                            
//                                zleceniaMainGrid.parse(data.data, "js");
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
