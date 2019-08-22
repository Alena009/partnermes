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
				{type: "buttonInput", id: "szukaj", text: "Szukaj", width: 100},                               
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
                            var newZlecenieLayout = window.attachLayout("2U");
                            newZlecenieLayout.cells("a").hideHeader();
                            newZlecenieLayout.cells("b").hideHeader();                                         
                            newZlecenieLayout.cells("a").setHeight(120);
                            newZlecenieLayout.cells("a").setWidth(250);
                            newZlecenieLayout.setAutoSize("a;b"); 
                                var myForm = newZlecenieLayout.cells("a").attachForm([                                    
                                    //{type: "combo", name: "orders",        label: _("Zamowienia")},                                     
                                    {type: "combo", name: "task_group_id", label: _("Grupa zlecen"),    required: true},                    
                                    {type: "combo", name: "task_id",       label: _("Zlecenie"), required: true},    
                                    {type: "input", name: "product",       label: _("Product")},                                                                                                     
                                    {type: "settings", position: "label-left", labelWidth: 110, inputWidth: 160},
                                    {type: "block",    name: "buttonblock",inputWidth: 200,    className: "myBlock", list:[
                                        {type: "button",name: "selectAll", value:_("Wybrac wrzystko"), offsetTop:18},
                                        {type: "newcolumn"},
                                        {type: "button",   name: "save",   value:_("Zapisz"), offsetTop:18},
                                        {type: "newcolumn"},
                                        {type: "button",   name: "cancel", value:_("Anuluj"), offsetTop:18}
                                    ]}                                    
                                ]);                                
//                                var ordersCombo = myForm.getCombo("orders");
//                                ordersCombo.enableFilteringMode(true);                                
//                                ajaxGet("api/orders/list/0",'',function(data){
//                                    if (data.data && data.success){
//                                        ordersCombo.addOption(data.data);                                                    
//                                    }
//                                });  
                                var taskGroupsCombo = myForm.getCombo("task_group_id");
                                ajaxGet("api/taskgroups",'',function(data){
                                    if (data.data && data.success){
                                        taskGroupsCombo.addOption(data.data);                                                    
                                    }
                                });   
                                taskGroupsCombo.enableFilteringMode(true);
                                var tasksCombo = myForm.getCombo("task_id");
                                tasksCombo.fill = function(idGroup = 0) {
                                    ajaxGet("api/tasks/listbygroups/" + idGroup,'',function(data){
                                        if (data.data && data.success){
                                            tasksCombo.addOption(data.data);                                                    
                                        }
                                    }); 
                                };
                                tasksCombo.enableFilteringMode(true);
                                //settings for combo with groups
                                var selectedId = grupyTree.getSelectedId();
                                if (selectedId) {
                                    var selectedText = grupyTree.getItemText(selectedId);
                                    taskGroupsCombo.setComboText(selectedText);
                                    taskGroupsCombo.setComboValue(selectedId);
                                    tasksCombo.fill(selectedId);
                                }
                                //                                
                                myForm.attachEvent("onChange", function(name, value, state){
                                    if (name == 'task_group_id') {                                        
                                        tasksCombo.fill(value);
                                    }                    
                                });                                   
                                myForm.attachEvent("onInputChange",function(name, value, form){
                                    if (name == "product") {                                                    
                                        ordersPositionsGrid.filterBy(0,function(data){                                                
                                            var input = value.trim().toLowerCase().split(' ');
                                            var searchStr = '';
                                            for (var i = 0; i < input.length; i++) {
                                                searchStr = searchStr + input[i] + "(.+)";                                                                                                                        
                                            }
                                            var regExp = new RegExp("^" + searchStr, "ig");
                                                if (data.toLowerCase().match(regExp)){                                                             
                                                    return true;
                                                } 
                                        });
                                    }
                                });
                                myForm.attachEvent("onButtonClick", function(name){
                                    switch (name){
                                        case 'save': {                                             
                                            var taskGroup = myForm.getCombo("task_group_id").getSelectedValue();
                                            if (taskGroup) {                                                
                                                ajaxPost("api/operations", myForm.getFormData(), function(data){ 
                                                    if (data.success) {zleceniaGrid.zaladuj();}
                                                });
                                            } else {
                                                dhtmlx.alert({
                                                    title:_("Wiadomość"),
                                                    type:"alert",
                                                    text:_("Wybierz grupe zlecen!")
                                                });
                                            }                         
                                        };break;
                                        case 'cancel':{
                                            myForm.clear();
                                        };break;
                                    }
                                });                                   
//                                myForm.attachEvent("onChange", function(name, value, state){
//                                    if (name == 'for_order') {                                                
//                                        ordersPositionsGrid.fill(+value);
//                                        if (+value) {                                                                                                        
//                                            zlecenieForm.showItem("order_kod");
//                                            zlecenieForm.showItem("order_name");
//                                            zlecenieForm.showItem("kod");
//                                            zlecenieForm.showItem("date_delivery");                                                                                                        
//                                        } else {                                                     
//                                            zlecenieForm.setItemValue("amount_stop", "");                                                    					
//                                            zlecenieForm.hideItem("order_kod");
//                                            zlecenieForm.hideItem("order_name");
//                                            zlecenieForm.hideItem("kod");
//                                            zlecenieForm.hideItem("date_delivery");                                                                                                        
//                                        }
//                                        //pracownicyForm.setRequired("departament", value);                                    
//                                    }                    
//                                });                                
                                var ordersPositionsGrid = newZlecenieLayout.cells("b").attachGrid({
                                    image_path:'codebase/imgs/',
                                    columns: [                                                                                                  
                                        {
                                            label: _("Produkt"),
                                            id: "product_name",
                                            width: 100,
                                            type: "ed", 
                                            sort: "str",	
                                            align: "left"
                                        },
                                        {
                                            label: _("Produkt Kod"),
                                            id: "product_kod",
                                            width: 100, 
                                            type: "ed", 
                                            sort: "str", 
                                            align: "left"
                                        },
                                        {
                                            label: _("Zamowienie kod"),
                                            width: 50,
                                            id: "order_kod",
                                            type: "ed", 
                                            sort: "str", 
                                            align: "left"
                                        },
                                        {
                                            label: _("Zamowienie"),
                                            width: 100,
                                            id: "order_name",
                                            type: "ed", 
                                            sort: "str", 
                                            align: "left"
                                        },
                                        {
                                            label: _("Ilosc"),
                                            id: "amount_stop",
                                            width: 50, 
                                            type: "ed", 
                                            sort: "str", 
                                            align: "left"
                                        },
                                        {
                                            label: _("Data dostawy"),
                                            id: "date_delivery",
                                            width: 100, 
                                            type: "ed", 
                                            sort: "str", 
                                            align: "left"
                                        }												
                                    ],
                                    multiselect: true
                                });                                                                              
                                ordersPositionsGrid.attachHeader("#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter");
                                ordersPositionsGrid.fill = function(forOrder = 1) {
                                    var url = "api/positions";
				    this.clearAll();
                                    this.setColWidth(2, "50");
                                    this.setColWidth(3, "100");
                                    this.setColWidth(4, "50");
                                    this.setColWidth(5, "100"); 											
                                    if (!forOrder) {                                        
                                        url = "api/products";                                                                                                 
                                        this.setColWidth(2, "0");
                                        this.setColWidth(3, "0");
                                        this.setColWidth(4, "0");
                                        this.setColWidth(5, "0"); 												
                                    }                                           
                                    ajaxGet(url, "", function(data){
                                        if (data.success && data.data) {																										
                                            ordersPositionsGrid.parse((data.data), "js");
                                        }
                                    });
                                };
                                ordersPositionsGrid.fill();
                                ordersPositionsGrid.getFilterElement(0)._filter = function (){
                                    var input = this.value; // gets the text of the filter input
                                    input = input.trim().toLowerCase().split(' ');
                                    return function(value, id){
                                        //for(var i = 0; i<ordersPositionsGrid.getColumnsNum(); i++){ // iterating through the columns
                                        var val = ordersPositionsGrid.cells(id, 0).getValue(); // gets the value of the current                                                    
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
                                ordersPositionsGrid.enableMultiselect(true);
//                                var zlecenieForm = newZlecenieLayout.cells("b").attachForm(taskForm);
//                                zlecenieForm.bind(ordersPositionsGrid);                                            
//                                var taskGroupsCombo = zlecenieForm.getCombo("task_group_id");
//                                ajaxGet("api/taskgroups",'',function(data){
//                                    if (data.data && data.success){
//                                        taskGroupsCombo.addOption(data.data);                                                    
//                                    }
//                                });   
//                                taskGroupsCombo.enableFilteringMode(true);
//                                var tasksCombo = zlecenieForm.getCombo("task_id");
//                                tasksCombo.fill = function(idGroup = 0) {
//                                    ajaxGet("api/tasks/listbygroups/" + idGroup,'',function(data){
//                                        if (data.data && data.success){
//                                            tasksCombo.addOption(data.data);                                                    
//                                        }
//                                    }); 
//                                };
//                                tasksCombo.enableFilteringMode(true);                                 
//                                //settings for combo with groups
//                                var selectedId = grupyTree.getSelectedId();
//                                if (selectedId) {
//                                    var selectedText = grupyTree.getItemText(selectedId);
//                                    taskGroupsCombo.setComboText(selectedText);
//                                    taskGroupsCombo.setComboValue(selectedId);
//                                    tasksCombo.fill(selectedId);
//                                }
//                                //                                
//                                zlecenieForm.attachEvent("onChange", function(name, value, state){
//                                    if (name == 'task_group_id') {                                        
//                                        tasksCombo.fill(value);
//                                    }                    
//                                });                                 
//                                zlecenieForm.attachEvent("onButtonClick", function(name){
//                                    switch (name){
//                                        case 'save': {                                             
//                                            var taskGroup = zlecenieForm.getCombo("task_group_id").getSelectedValue();
//                                            if (taskGroup) {                                                
//                                                ajaxPost("api/operations", zlecenieForm.getFormData(), function(data){ 
//                                                    if (data.success) {zleceniaGrid.zaladuj();}
//                                                });
//                                            } else {
//                                                dhtmlx.alert({
//                                                    title:_("Wiadomość"),
//                                                    type:"alert",
//                                                    text:_("Wybierz grupe zlecen!")
//                                                });
//                                            }                         
//                                        };break;
//                                        case 'cancel':{
//                                            zlecenieForm.clear();
//                                        };break;
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
		var zleceniaGrid = zleceniaLayout.cells("b").attachGrid({
			image_path:'codebase/imgs/',
			columns: [                                                    
                        {
                            label: "Kod zlecenia",
                            id:'kod',
                            width: 100,
                            type: "ro",
                            sort: "str",
                            align: "center"
			},
                        {
                            label: "Imie zlecenia",
                            id:'task_name',
                            width: 200,
                            type: "ro",
                            sort: "str",
                            align: "left"
			},{
                            label: "Imie produktu",
                            id:'product_name',
                            width: 200,
                            type: "ro",
                            sort: "str",
                            align: "left"
			},{
                            label: "Kod roduktu",
                            id:'product_kod',
                            width: 200,
                            type: "ro",
                            sort: "str",
                            align: "left"
			},{
                            label: "Ilosc",
                            id:'amount',
                            width: 60,
                            type: "edn",
                            sort: "str",
                            align: "right"
			},
                        {
                            label: "Zamknięte",
                            id:'zamkniete',
                            width: 40,
                            type: "ch",
                            align: "center"
			},{
                            label: "Data dodania",
                            id:'created_at',
                            width: "120",
                            type: "ro",
                            sort: "date",
                            align: "center"
			},{
                            label: "Data zamkniecia",
                            id:'data_zamkniecia',
                            width: "120",
                            type: "ro",
                            sort: "date",
                            align: "center"
			},{
                            label: "Data wysylki",
                            id:'date_delivery',
                            width: "120",
                            type: "ro",
                            align: "center"
			}],
			multiselect: true,
                        multiline: true                      
                        
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
		zleceniaGrid.attachHeader("#text_filter,#select_filter,#text_filter,#text_search,#select_filter,#numeric_filter,#text_search,#text_search,#text_search,#text_search,#text_search,#text_search");
		//zleceniaGrid.setColumnIds("zlecenie,produkt,produktKod,kod,zamkniete,szt,data_dodania,data_zamkniecia,data_wysylki,plan_start,plan_stop,opis");
		//zleceniaGrid.setColValidators(["NotEmpty","","","NotEmpty","","ValidInteger"]);
		//zleceniaGrid.enableMultiselect(true); 
		//zleceniaGrid.enableEditEvents(false,true,true);
		//grupyTree = createGrupyTree(zleceniaLayout.cells("a"),zleceniaGrid);

		zleceniaGrid.zaladuj = function(i = 0){
                    var ids = Array();
                    ids = (typeof i === 'string' || typeof i === 'number')  ? [i] : i;
                    var new_data = ajaxGet("api/zlecenia/list/" + ids, "", function(data){
                        if (data && data.success){
                            console.log(data.data);
                                zleceniaGrid.parse(data.data, "js");
                            }
                        });			
		};    
		var dpZleceniaGrid = new dataProcessor("api/zlecenia",'json');
		dpZleceniaGrid.init(zleceniaGrid);
		dpZleceniaGrid.enableDataNames(true);
		dpZleceniaGrid.setTransactionMode("REST");
		dpZleceniaGrid.enablePartialDataSend(true);
		dpZleceniaGrid.enableDebug(true);
		dpZleceniaGrid.setUpdateMode("row", true);
                dpZleceniaGrid.attachEvent("onBeforeDataSending", function(id, state, data){
                    data.id = id;
                    ajaxGet("api/zlecenia/" + id + "/edit", data, function(data){                                                            
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
