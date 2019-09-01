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
				{type: "text", id: "title", text: _("Zamowienia")},
				{type: "spacer"},
				{id: "Find", type: "button", img: "fa fa-search"},
				{type: "buttonInput", id: "szukaj", text: "", width: 150},                               
				{type: "separator", id: "sep2"},
				{id: "Add", type: "button", img: "fa fa-plus-square "},
				{id: "Edit", type: "button", img: "fa fa-edit"},
				{id: "Del", type: "button", img: "fa fa-minus-square"},
                                {type: "separator", id: "sep1"},
                                {id: "Redo", type: "button", img: "fa fa-reply"}
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
                            var newZlecenieLayout = window.attachLayout("3L");
                            newZlecenieLayout.cells("a").hideHeader();
                            newZlecenieLayout.cells("b").hideHeader();                                         
                            newZlecenieLayout.cells("c").hideHeader();
                            newZlecenieLayout.cells("a").setWidth(400);
                            newZlecenieLayout.cells("c").setHeight(100);
                            newZlecenieLayout.setAutoSize("a;b;c"); 
                            var ordersPositionsGridToolBar = newZlecenieLayout.cells("a").attachToolbar({
                                    iconset: "awesome",
                                    items: [
                                        {type: "text", id: "title", text: _("Zamowienia")}                                                                                           
                                    ]
                            });  
                            var ordersPositionsGrid = newZlecenieLayout.cells("a").attachGrid({
                                image_path:'codebase/imgs/',
                                columns: [   
                                    {id: "product_id"},
                                    {label: _("Produkt"),        id: "product_name", type: "ro", sort: "str", align: "left"},
                                    {label: _("Produkt Kod"),    id: "product_kod",  type: "ro", sort: "str", align: "left"},
                                    {label: _("Zamowienie kod"), id: "order_kod",    type: "ro", sort: "str", align: "left"},
                                    {label: _("Zamowienie"),     id: "order_name",   type: "ro", sort: "str", align: "left"},
                                    {label: _("Ilosc"),          id: "amount_stop",  type: "ro", sort: "str", align: "left"},
                                    {label: _("Data dostawy"),   id: "date_delivery",type: "ro", sort: "str", align: "left"}												
                                ],
                                multiselect: true
                            }); 
                            ordersPositionsGrid.attachHeader("#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter");
                            ordersPositionsGrid.setColumnHidden(0,true);
                            ordersPositionsGrid.fill = function() {                                    
                                this.clearAll();                                                                               
                                ajaxGet("api/positions", "", function(data){
                                    if (data.success && data.data) {																										
                                        ordersPositionsGrid.parse((data.data), "js");
                                    }
                                });
                            };
                            ordersPositionsGrid.fill(); 
                            ordersPositionsGrid.getFilterElement(1)._filter = function (){
                                var input = this.value; // gets the text of the filter input
                                input = input.trim().toLowerCase().split(' ');
                                return function(value, id){
                                    //for(var i = 0; i<ordersPositionsGrid.getColumnsNum(); i++){ // iterating through the columns
                                    var val = ordersPositionsGrid.cells(id, 1).getValue(); // gets the value of the current                                                    
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
                            ordersPositionsGrid.attachEvent("onRowSelect", function(id,ind){
                                var data = ordersPositionsGrid.getRowData(ordersPositionsGrid.getSelectedRowId());
                                var productId = data.product_id;
                                tasksForProductGrid.fill(productId);
                            });
                            var tasksForProductGrid = newZlecenieLayout.cells("b").attachToolbar({
                                    iconset: "awesome",
                                    items: [
                                        {type: "text", id: "title", text: _("Zadania do produktu")}                                           
                                    ]
                            });  
                            var tasksForProductGrid = newZlecenieLayout.cells("b").attachGrid({
                                image_path:'codebase/imgs/',
                                columns: [    
                                    {label: _(""),            id: "check",           type: "ch", sort: "str", align: "left"},
                                    {label: _("Zadanie"),     id: "task_name",       type: "ro", sort: "str", align: "left"},
                                    {label: _("Zadanie Kod"), id: "task_kod",        type: "ro", sort: "str", align: "left"},
                                    {label: _("Grupa zadan"), id: "task_group_name", type: "ro", sort: "str", align: "left"},
                                    {label: _("Czas"),        id: "duration",        type: "ro", sort: "str", align: "left"},
                                    {label: _("Ilosc"),       id: "declared_amount", type: "ed", sort: "str", align: "left"},
                                    {id: "task_id"}												
                                ],
                                multiselect: true
                            }); 
                            tasksForProductGrid.attachFooter(
                                        [_("Ilosc czasu, min: "),"#cspan","#cspan","#cspan","#stat_total"],
                                        ["text-align:right;","text-align:center"]
                                    );    
                            tasksForProductGrid.attachHeader("#master_checkbox");
                            tasksForProductGrid.setColumnHidden(6,true);
                            tasksForProductGrid.attachEvent("onCheck", function(rId,cInd,state){
                                    if (state=='1'){
                                        tasksForProductGrid.cells(rId,5).setValue('1');
                                    } else if (state=='0'){
                                        tasksForProductGrid.cells(rId,5).setValue('');
                                    }                                        
                            });
                            tasksForProductGrid.fill = function(id) {                                    
                                this.clearAll();                                                                               
                                ajaxGet("api/productstasks/list/" + id, "", function(data){
                                    if (data.success && data.data) {																										
                                        tasksForProductGrid.parse((data.data), "js");
                                    }
                                });
                            };                            
                            var myForm = newZlecenieLayout.cells("c").attachForm([                                    
                                //{type: "combo", name: "orders",        label: _("Zamowienia")},                                         
//                                {type: "input", name: "product",       label: _("Szukaj produkt")},                                                                                                     
//                                {type: "settings", position: "label-left", labelWidth: 110, inputWidth: 160},
                                {type: "block",    name: "buttonblock",inputWidth: 200,    className: "myBlock", list:[

                                    {type: "button",   name: "save",   value:_("Zapisz"), offsetTop:18},
                                    {type: "newcolumn"},
                                    {type: "button",   name: "cancel", value:_("Anuluj"), offsetTop:18}
                                ]}                                    
                            ]);
                            myForm.attachEvent("onButtonClick", function(name){
                                switch (name){
                                    case 'save': {   
                                            var data;
                                            var orderPositionId = ordersPositionsGrid.getSelectedRowId();
                                            var checkedRows = tasksForProductGrid.getCheckedRows(0);
                                            checkedRows = checkedRows.split(",");
                                            checkedRows.forEach(function(element) {                                                    
                                                data = tasksForProductGrid.getRowData(element);
                                                data.order_position_id = orderPositionId;
                                                ajaxPost("api/declaredworks", data, "");                                                                                                        
                                            });
                                            zleceniaGrid.zaladuj();                        
                                    };break;
                                    case 'cancel':{
                                        myForm.clear();
                                    };break;
                                }
                            });                             
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
                        };break;
                        case 'Del':{
                            var id = zleceniaGrid.getSelectedRowId();
                            if (id) {
                                ajaxDelete("api/operations/" + id, "", function(data){
                                    if (data && data.success){
                                        zleceniaGrid.deleteRow(id);
                                    }
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
                        {label: "Kod zlecenia",        id:'kod_zlecenia',    width: 100, type: "ro", sort: "str",  align: "center"},
                        {label: "Zadanie Kod",         id:'task_kod',        width: 100, type: "ro", sort: "str",  align: "left"},                        
                        {label: "Zadanie",             id:'task_name',       width: 200, type: "ro", sort: "str",  align: "left"},
                        {label: "Imie produktu",       id:'product_name',    width: 200, type: "ro", sort: "str",  align: "left"},
                        {label: "Kod produktu",        id:'product_kod',     width: 100, type: "ro", sort: "str",  align: "left"},
                        {label: "Zadeklarowana ilosc", id:'declared_amount', width: 60,  type: "edn",sort: "str",  align: "right"},
                        {label: "Zrobiona ilosc",      id:'done_amount',     width: 60,  type: "edn",sort: "str",  align: "right"},
                        {label: "Zamknięte",           id:'closed',          width: 30,  type: "ch", align: "center"},
                        {label: "Data dodania",        id:'created_at',      width: 120, type: "ro", sort: "date", align: "center"},
                        {label: "Data zamkniecia",     id:'date_closing',    width: 120, type: "ro", sort: "date", align: "center"},
                        {label: "Data wysylki",        id:'date_delivery',   width: 120, type: "ro", align: "center"}
                    ],
		    multiselect: true,
                    multiline: true                        
		});  
                zleceniaGrid.attachHeader("#text_filter,#select_filter,#text_filter,#text_filter,#select_filter,#numeric_filter,#text_search,#text_search,#text_search,#text_search,#text_search,#text_search");
                zleceniaGrid.getFilterElement(3)._filter = function (){
                    var input = this.value; // gets the text of the filter input
                    input = input.trim().toLowerCase().split(' ');
                    return function(value, id){
                        //for(var i = 0; i<ordersPositionsGrid.getColumnsNum(); i++){ // iterating through the columns
                        var val = zleceniaGrid.cells(id, 3).getValue(); // gets the value of the current                                                    
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
                    var ids = Array();
                    ids = (typeof i === 'string' || typeof i === 'number')  ? [i] : i;
                    var new_data = ajaxGet("api/declaredworks/list/" + ids, "", function(data){
                        if (data && data.success){
                            console.log(data.data);
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
           
                var taskForm = [   
                        {type: "combo",    name: "task_group_id",   label: _("Grupa"),    options: [], required: true},                    
                        {type: "combo",    name: "task_id",         label: _("Zlecenie"), options: [], required: true},                                                
                        {type: "input",    name: "amount_stop",     label: _("Ilosc"),                 required: true},
                        {type: "input",    name: "date_delivery",   label: _("Data dostawy"),    readonly:true},                                                
                        {type: "input",    name: "order_kod",       label: _("Zamowienie kod"),  readonly:true},                        
                        {type: "input",    name: "order_name",      label: _("Zamowienie imie"), readonly:true},                        
                        {type: "input",    name: "product_kod",     label: _("Produkt kod"),     readonly:true, required: true},                        
                        {type: "input",    name: "product_name",    label: _("Produkt imie"),    readonly:true},                                                                     
                        {type: "hidden",   name: "order_position_id"},
                        {type: "settings", position: "label-left", labelWidth: 110, inputWidth: 160},
                        {type: "block",    name: "buttonblock",inputWidth: 200,    className: "myBlock", list:[
                            {type: "button",   name: "save",   value:_("Zapisz"), offsetTop:18},
                            {type: "newcolumn"},
			    {type: "button",   name: "cancel", value:_("Anuluj"), offsetTop:18}
                        ]}                  
		];  
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
