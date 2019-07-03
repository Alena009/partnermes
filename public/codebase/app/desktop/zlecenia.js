var zleceniaGrid;
var zleceniaLayout;
var zleceniaForm;

function zleceniaInit(cell) {   

	if (zleceniaLayout == null) {
		// init layout
		zleceniaLayout = cell.attachLayout("2U");
		zleceniaLayout.cells("a").hideHeader();
		zleceniaLayout.cells("b").hideHeader();
		zleceniaLayout.cells("a").setWidth(280);
		//console.log(pracownicyLayout.listAutoSizes());
		zleceniaLayout.setAutoSize("a");
		var grupyTree = zleceniaLayout.cells("a").attachTree();
		grupyTree.setImagePath("codebase/imgs/dhxtree_web/");		
		//'codebase/imgs/dhxtree_web/'
		//grupyTree.enableSmartXMLParsing(true);
		grupyTree.enableDragAndDrop(true);
		grupyTree.setDragBehavior('complex');
		//grupyTree.enableKeyboardNavigation(true);
		grupyTree.enableItemEditor(true);
		grupyTree.enableCheckBoxes(true);
		//grupyTree.enableAutoSavingSelected(true);
		grupyTree.enableTreeImages(true);
		grupyTree.enableTreeLines(true);
		
		grupyTreeToolBar = zleceniaLayout.cells("a").attachToolbar({
			iconset: "awesome",
			items: [
				{type: "text", id: "title", text: _("Grupy")},
				{type: "spacer"},
				{id: "Add", type: "button", img: "fa fa-plus-square "},
				{id: "Edit", type: "button", img: "fa fa-edit"},
				{id: "Del", type: "button", img: "fa fa-minus-square"}
			]
		});
		grupyTreeToolBar.attachEvent("onClick", function(btn) {
			switch (btn){
				case 'Add':{
					var id = grupyTree.getSelectedItemId(),
			                parent = grupyTree.getParentId(id) || 0;
						
					grupyTree.insertNewItem(id || parent,'_new',"nowa grupa");
					grupyTree.selectItem('_new');
					grupyTree.editItem('_new');
//                                        grupyTree.attachEvent("onEdit", function(state=2, id, tree, value){
//                                            var s;
//                                            if (state == 2){
//                                                s = value;
//                                                
//                                            }
//                                            console.log(s);
//                                            grupyTree.setItemText('_new', s);
//                                        });
				};break;
				case 'Edit':{
					var id = grupyTree.getSelectedItemId(),
						parent = grupyTree.getParentId(id) || 0;
						if(id){
							grupyTree.focusItem(id);
							grupyTree.editItem(id);
						}
					};break;
				case 'Del':{
					var id = grupyTree.getSelectedItemId(),
						parent = grupyTree.getParentId(id) || 0;
						if(id){							
							var ch = grupyTree.getSubItems(id);
							grupyTree.deleteItem(id,true);
							ch = ch.split(',');
							for (k=0;k<ch.length;k++){
								i=ch[k];
								grupyTree.moveItem(i,'item_child',parent);
							};
						}
				};break;
			}
		});		
		grupyTree.attachEvent("onCheck",function(id){
			var ids = grupyTree.getAllChecked();
			ids = ids.split(',');
			ids[ids.length]=id;
			zleceniaGrid.clearAll();
			zleceniaGrid.zaladuj(ids.join('|'));
			return true;
		});
		grupyTree.attachEvent("onSelect",function(){
			var id=grupyTree.getSelectedItemId(), 
				ids = grupyTree.getAllChecked();
			ids = ids.split(',');
			ids[ids.length]=id;
			zleceniaGrid.clearAll();
			zleceniaGrid.zaladuj(ids.join('|'));
			return true;
		});							
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
		grupyTree.zaladuj = function(i=null){
                    var ids = Array();
                    ids = (typeof i === 'string' || typeof i === 'number')  ? [i] : i;
                    var new_data = ajaxGet("api/taskgroups/grupytree",i!=null ? 'parent='+ids.join('|'): '',function(data){
                            if (data.data && data.success){
                                    var d = data.data;
                                    console.log(d);
                                    grupyTree.parse({id:0, item:data.data}, "json");
                                    //parse(d,'json');
                            }
                    });			
                };

		var zleceniaGrid = zleceniaLayout.cells("b").attachGrid({
			image_path:'codebase/imgs/',
			columns: [{
				label: "Na zamowienie",
				id:'for_order',
				width: 60,
				type: "ch",
				sort: "str"				
			},{
				label: "Zamowienie",
				id:'order_kod',
				width: 200,
				type: "co",
				sort: "str",
				align: "left"
			},{
				label: "Produkt",
				id:'product',
				width: 200,
				type: "co",
				sort: "str",
				align: "left"
			},{
				label: "Produkt KOD",
				id:'product_kod',
				width: 200,
				type: "co",
				sort: "str",
				align: "left"
			},{
				label: "Zlecenie",
				id:'name',
				width: 320,
				type: "edtxt",
				sort: "str",
				align: "left"
			},{
				label: "Kod",
				id:'kod',
				width: 200,
				type: "edtxt",
				sort: "str",
				align: "center"
			},{
				label: "Zamknięte",
				id:'zamkniete',
				width: 40,
				type: "ch",
				sort: "int",
				align: "center"
			},{
				label: "Szt",
				id:'amount_stop',
				width: 60,
				type: "edn",
				sort: "str",
				align: "right"
			},{
				label: "Data dodania",
				id:'created_at',
				width: "120",
				type: "dhxCalendarA",
				sort: "date",
				align: "center"
			},{
				label: "Data zamkniecia",
				id:'data_zamkniecia',
				width: "120",
				type: "dhxCalendarA",
				sort: "date",
				align: "center"
			},{
				label: "Data wysylki",
				id:'date_delivery',
				width: "60",
				type: "edn",
				sort: "int",
				align: "center"
			},{
				label: "Plan start",
				id:'plan_start',
				width: "120",
				type: "dhxCalendarA",
				sort: "date",
				align: "center"
			},{
				label: "Plan stop",
				id:'plan_stop',
				width: "120",
				type: "dhxCalendarA",
				sort: "date",
				align: "center"
			},{
				label: "Opis",
				id:'order_description',
				width: "300",
				type: "edtxt",
				sort: "int",
				align: "left"
			}],
			multiselect: true
		});
                
                var ordersCombo = zleceniaGrid.getCombo(1);
		var productsCombo = zleceniaGrid.getCombo(2);
                
                ajaxGet("api/orders", '', function(data) {
                    if (data.success && data.data) {
                        data.data.forEach(function(order){
                            ordersCombo.put(order.id, order.name);
                        });
                    }
                });
                
                ajaxGet("api/products", '', function(data) {
                    if (data.success && data.data) {
                        data.data.forEach(function(product){
                            productsCombo.put(product.id, product.name);
                        });
                    }
                });
		//combo.enableFilteringMode(true);
		//combo.load("produkty/all");
		zleceniaGrid.setDateFormat("%Y-%m-%d","%Y-%m-%d");
		//zleceniaGrid.enablePaging(true,15,5,document.body,true,"recInfoArea");
		//console.log(zleceniaGrid.getColumnCombo(5));
		//zleceniaGrid.setColTypes('edtxt','combo','ro','edtxt','edn','edtxt');
		//zleceniaGrid.setSubTree(treeGrupy, 2);
		zleceniaGrid.attachHeader("#text_filter,#select_filter,#text_filter,#text_search,#select_filter,#numeric_filter,#text_search,#text_search,#text_search,#text_search,#text_search,#text_search");
		//zleceniaGrid.setColumnIds("zlecenie,produkt,produktKod,kod,zamkniete,szt,data_dodania,data_zamkniecia,data_wysylki,plan_start,plan_stop,opis");
		zleceniaGrid.setColValidators(["NotEmpty","","","NotEmpty","","ValidInteger"]);
		zleceniaGrid.enableMultiselect(true); 
                zleceniaGrid.enableMultiline(true);
		zleceniaGrid.enableEditEvents(false,true,true);
		//grupyTree = createGrupyTree(zleceniaLayout.cells("a"),zleceniaGrid);

		zleceniaGrid.zaladuj = function(i){
			var ids = Array();
			ids = (typeof i === 'string' || typeof i === 'number')  ? [i] : i;
			var new_data = ajaxGet("api/zlecenia", '',function(data){
				if (data.data && data.success){
                                    console.log(data.data);
                                        zleceniaGrid.parse(data.data, "js");
                                    }
                                });			
		};
                
              

//		var dpZleceniaGrid = new dataProcessor("zlecenia/zlecenie/",'json');
//		dpZleceniaGrid.init(zleceniaGrid);
//		dpZleceniaGrid.enableDataNames(true);
//		dpZleceniaGrid.setTransactionMode("REST");
//		dpZleceniaGrid.enablePartialDataSend(true);
//		dpZleceniaGrid.enableDebug(true);
//		dpZleceniaGrid.setUpdateMode("row", true);
		zleceniaGrid.attachEvent("onFilterStart", function(indexes,values){
			console.log(arguments);
			return true;
		});
		zleceniaGridToolBar = zleceniaLayout.cells("b").attachToolbar({
			iconset: "awesome",
			items: [
				{type: "text", id: "title", text: _("Zamowienia")},
				{type: "spacer"},
				{id: "Find", type: "button", img: "fa fa-search"},
				{type: "buttonInput", id: "szukaj", text: "Szukaj", width: 100},
				{type: "separator", id: "sep2"},
				{id: "Add", type: "button", img: "fa fa-plus-square "},
				{id: "Edit", type: "button", img: "fa fa-edit"},
				{id: "Del", type: "button", img: "fa fa-minus-square"}
			]
		});		
		zleceniaGridToolBar.attachEvent("onClick", function(btn) {
			console.log(btn);
			switch (btn){
				case 'Add':{
                                        var window = createWindow(500, 500);
                                        window.maximize();
                                        var newZlecenieLayout = window.attachLayout("3W");
                                            newZlecenieLayout.cells("a").hideHeader();
                                            newZlecenieLayout.cells("b").hideHeader();                                        
                                            newZlecenieLayout.cells("c").hideHeader(); 
                                            newZlecenieLayout.cells("a").setWidth(200);
                                            newZlecenieLayout.setAutoSize("a;b;c");
                                        var grupy = newZlecenieLayout.cells("a").attachTree();
                                            grupy.setImagePath("codebase/imgs/dhxtree_web/");		
                                            grupy.enableCheckBoxes(true);
                                            grupy.enableTreeImages(true);
                                            grupy.enableTreeLines(true);                                   
 
                                        ajaxGet("api/taskgroups/grupytree",'',function(data){
                                                if (data.data && data.success){
                                                        grupy.parse({id:0, item:data.data}, "json");
                                                        //parse(d,'json');
                                            }
                                        });			

                                        var ordersPositionsGrid = newZlecenieLayout.cells("b").attachGrid({
                                            image_path:'codebase/imgs/',
                                            columns: [{
                                                    label: _("Zamowienie"),
                                                    width: 50,
                                                    id: "order_kod",
                                                    type: "ed", 
                                                    sort: "str", 
                                                    align: "left"
                                                },
                                                {
                                                    label: _("Nazwa zamowienia"),
                                                    width: 100,
                                                    id: "order_name",
                                                    type: "ed", 
                                                    sort: "str", 
                                                    align: "left"
                                                },                                                                                                  
                                                {
                                                    label: _("Produkt"),
                                                    id: "product_name",
                                                    type: "ed", 
                                                    sort: "str",	
                                                    align: "left"
                                                },
                                                {
                                                    label: _("Produkt Kod"),
                                                    id: "product_kod",
                                                    width: 50, 
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
                                        ordersPositionsGrid.fill = function(forOrder = true) {
                                            var url = "api/positions";
                                            if (!forOrder) {
                                                url = "api/products";
                                            }
                                            ajaxGet(url, "", function(data){
                                                if (data.success && data.data) {
                                                    ordersPositionsGrid.parse((data.data), "js");
                                                }
                                            });
                                        };
                                        ordersPositionsGrid.fill();
                                        ordersPositionsGrid.getFilterElement(2)._filter = function(){
                                            var input = this.value; // gets the text of the filter input
                                            input = input.trim();
                                            input = input.toLowerCase();
                                            input = input.split(' ');
                                            return function(value, id){
                                                //for(var i = 0; i<ordersPositionsGrid.getColumnsNum(); i++){ // iterating through the columns
                                                    var val = ordersPositionsGrid.cells(id, 2).getValue(); // gets the value of the current                                                    
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
                                        var zlecenieForm = newZlecenieLayout.cells("c").attachForm(taskForm);
                                        zlecenieForm.bind(ordersPositionsGrid); 
                                        //var productCombo = zlecenieForm.getcombo("order_kod");
                                        zlecenieForm.attachEvent("onChange", function(name, value, state){
                                            if (name == 'for_order') {
                                                ordersPositionsGrid.clearAll();
                                                ordersPositionsGrid.fill(value);
                                                if (value) {                                                    
                                                    zlecenieForm.showItem("order_kod");
                                                    zlecenieForm.showItem("order_name");
                                                    zlecenieForm.showItem("kod");
                                                    zlecenieForm.showItem("date_delivery");                                                                                                        
                                                } else {                                                              
                                                    zlecenieForm.setItemValue("amount", "");
                                                    zlecenieForm.hideItem("order_kod");
                                                    zlecenieForm.hideItem("order_name");
                                                    zlecenieForm.hideItem("kod");
                                                    zlecenieForm.hideItem("date_delivery");                                                                                                        
                                                }
                                                //pracownicyForm.setRequired("departament", value);                                    
                                            }                    
                                        });
                                        zlecenieForm.attachEvent("onButtonClick", function(name){
                                            switch (name){
                                                case 'save':{ 
                                                        var taskGroup = grupy.getSelectedItemId();
                                                        if (taskGroup) {
                                                            var data = zlecenieForm.getFormData();
                                                            data.amount_start = 1;
                                                            data.task_group_id = taskGroup;
                                                            data.name = data.name_task;
                                                            data.kod = data.kod_task;
                                                            console.log(data);
                                                            ajaxPost("api/zlecenia", data, function(data){                                                            
                                                                //grupyTree.addItem(data.data.id, data.data.name, data.data.parent_id); // id, text, pId
                                                            });
                                                        } else {
                                                            dhtmlx.alert({
                                                                title:_("Wiadomość"),
                                                                type:"alert",
                                                                text:_("Wybierz grupe zlecen!")
                                                            });
                                                        };                         
                                                        
                                                };break;
                                                case 'cancel':{
                                                    zlecenieForm.clear();
                                                };break;
                                            }
                                        });                              
                                        
                                        
//                                        var zlecenieForm = createWindowWithForm(taskForm, 350, 350);
//                                        var ordersCombo = zlecenieForm.getCombo("orders");
//                                        var positionsCombo = zlecenieForm.getCombo("positions");
//                                        var amountInput = zlecenieForm.getInput('amount');
//                                        
//                                        
//                                        ordersCombo.enableFilteringMode(true);
//                                        ajaxGet("api/orders", '', function(data) {
//                                            if (data.success && data.data) {                                            
//                                                some(data.data);                                                
//                                                //ordersCombo.addOption(data.data);                                                
//                                                
//                                                
//                                            }
//                                        });
//                                        var orders = resultq;
//                                        console.log(orders);
//                                        ordersCombo.attachEvent("onChange", function(value, text){                                            
//                                            ajaxGet("api/orders/positions/" + value, "", function(data){
//                                                if (data.success && data.data) { 
//                                                    positionsCombo.addOption(data.data);                                                  
//                                                }
//                                            });
//                                        });
                                        
                                        
                                        
                                        
//					zleceniaGrid.setActive(true);
//					zleceniaGrid.selectCell(1,0);
//                                        var rowId=zleceniaGrid.uid();
//   				        zleceniaGrid.setActive(true);
//					 zleceniaGrid.addRow(rowId,["","","","",""],0);
//					 zleceniaGrid.editCell(rowId,1);
//					 console.log(zleceniaGrid.getSelectedCellIndex()+'x'+zleceniaGrid.getSelectedRowId());
//					(arguments[0]||window.event).cancelBubble=true;
//					zleceniaGrid.selectRow(2);
//					zleceniaGrid.selectCell(2,4,false,true);
//					zleceniaGrid.editCell();
//					zleceniaGrid.cells(1,0).setBgColor('red'); 
////					myGrid.selectCell(rowIndex,cellIndex);
////					myGrid.editCell();	
//					console.log(zleceniaGrid.getRowId(0));
//					zleceniaGrid.forEachCell(1,function(cellObj,ind){
//						console.log('forEachCell',arguments);	
//					});
//					console.log(zleceniaGrid.getSelectedCellIndex()+'x'+zleceniaGrid.getSelectedRowId());
				};break;
				case 'Edit':{
					};break;
				case 'Del':{
				};break;
			}
		});		
		zleceniaGrid.attachEvent("onSelectStateChanged", function(indexes,values){
			console.log('onSelectStateChanged',arguments);
			//console.log(zleceniaGrid.getSelectedCellIndex()+'x'+zleceniaGrid.getSelectedRowId());
			return true;
		});
                
                
                var taskForm = [  
                        {type: "label",                        label: _("Zlecenie na zamowienie"), labelWidth: 150},
                        {type: "radio",    name: "for_order",  label: _("Tak"), value: 1,  checked: true},
                        {type: "radio",    name: "for_order",  label: _("Nie"),  value: 0},                        
                        {type: "input",    name: "order_kod",       label: _("Zamowienie"),       labelAlign: "left", readonly:true},                        
                        {type: "input",    name: "order_name",      label: _("Zamowienie nazwa"), labelAlign: "left", readonly:true},                        
                        {type: "input",    name: "product_kod",     label: _("Produkt"),          labelAlign: "left", readonly:true},                        
                        {type: "input",    name: "product_name",    label: _("Produkt nazwa"),    labelAlign: "left", readonly:true},                                             
                        {type: "input",    name: "amount_stop",     label: _("Ilosc"),            labelAlign: "left"},
                        {type: "input",    name: "date_delivery",   label: _("Data dostawy"),     labelAlign: "left", readonly:true},
                        {type: "input",    name: "name_task",            label: _("Zlecenie"),         labelAlign: "left"},                        
                        {type: "input",    name: "kod_task",             label: _("Zlecenie kod"),     labelAlign: "left"},                        
                        {type: "input",    name: "plan_date_start", label: _("Data start"),       labelAlign: "left"},
                        {type: "input",    name: "plan_date_stop",  label: _("Data end"),         labelAlign: "left"}, 
                        {type: "hidden",   name: "order_position_id"},
                        {type: "settings", position: "label-left", labelWidth: 110, inputWidth: 160},
                        {type: "block",    name: "buttonblock",inputWidth: 200,    className: "myBlock", list:[
                            {type: "button",   name: "save",   value:_("Zapisz"), offsetTop:18},
                            {type: "newcolumn"},
			    {type: "button",   name: "cancel", value:_("Anuluj"), offsetTop:18}
                        ]}                  
		];  
                
                function createWindow(height, width){
                    var dhxWins = new dhtmlXWindows();
                    return w1 = dhxWins.createWindow({
                            id:"w1",
                            left:20,
                            top:30,
                            width: width,
                            height: height,
                            center:true,
                            caption: _("Dodaj zlecenie"),
                            header: true,
                            onClose:function(){

                            }
                    });
                    //initializing form 
                    //return dhxWins.window("w1").attachForm(formStruct, true);         
                } 
                
                function some(data) {                    
                    
                    result = data;
                    alert(result);
                }
                

	}
	grupyTree.zaladuj();
	zleceniaGrid.zaladuj(0);
}

var result;

window.dhx4.attachEvent("onSidebarSelect", function (id, cell) {
	if (id == "zlecenia") {           
            window.history.pushState({'page_id': id}, null, '#zlecenia');
            zleceniaInit(cell);
        }        
});
