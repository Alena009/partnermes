var zleceniaGrid;
var zleceniaLayout;
var zleceniaForm;

function zleceniaInit(cell) {
	if (zleceniaLayout == null) {
                var userData = JSON.parse(localStorage.getItem("userData")); 
                var write;
                userData.permissions.forEach(function(elem){
                    if (elem.name == 'zlecenia') {
                        write = elem.pivot.value;
                    }
                });
		// init layout
		var zleceniaLayout = cell.attachLayout("3L");		
		zleceniaLayout.cells("a").setText(_("Zlecenia"));
                zleceniaLayout.cells("b").setText(_("Zadania do wybranych zleceń"));
                zleceniaLayout.cells("c").setText(_("Niezbędne materialy"));        
                
                if (write) {
                    var zleceniaGridToolBar = zleceniaLayout.cells("a").attachToolbar({
                            iconset: "awesome",
                            items: [
                                {id: "Print",text: _("Wydrukować"), type: "button", img: "fa fa-print"},                                                       
                                //{id: "Product",text: _("Wyprodukować"), type: "button", img: "fa fa-wrench"},                                                       
                                {id: "DontProduct",text: _("Nie produkować"), type: "button", img: "fa fa-times"},                                                                                       
                                {id: "sep3",     type: "separator"},
                                {id: "Redo", type: "button", text: _("Odśwież"),img: "fa fa-refresh"}
                            ]
                    });                    
                } else {
                    var zleceniaGridToolBar = zleceniaLayout.cells("a").attachToolbar({
                            iconset: "awesome",
                            items: [                                
                                {id: "Redo", type: "button", text: _("Odśwież"),img: "fa fa-refresh"}
                            ]
                    });                    
                }
 
                zleceniaGridToolBar.attachEvent("onClick", function(btn) {	
		    switch (btn){  
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
                        case 'Print': {
                                var selectedZlecenia = zleceniaGrid.getCheckedRows(0);
                                ajaxGet("api/positions/print/" + selectedZlecenia, "", function(data){
                                    var myWindow=window.open();
  myWindow.document.write(data);

  myWindow.focus();
  //myWindow.print();

                                });                                
//                                selectedZlecenia.split(',').forEach(function(elem){
//                                    var zlecenie = zleceniaGrid.getRowData(elem);
//                                   zlecenie.status = 1;
//                                    zlecenie.date_status = new Date();
//                                    ajaxGet("api/positions/" + elem + "/edit", zlecenie, function(data){
//                                        if (data.success && data.data) {                                         
//                                            //zleceniaGrid.zaladuj(0);
//                                            tasksGrid.printView('<div>' + _("Zamówienie") + ": " + zlecenie.order_kod + '</div>' + 
//                                                '<div>' + _("Zlecenie") + ": " + zlecenie.kod + '</div>' +
//                                                '<div>' + _("Produkt Kod") + ": " + zlecenie.product_kod + " - " + 
//                                                          _("Produkt") + ": " + zlecenie.product_name + '</div>' + 
//                                                '<div>' + _("Iłość") + ": " + zlecenie.amount + '</div>',                                        
//                                                '<strong>' + _("") + '</strong>');                                            
//                                        }
//                                    });
//                                });
//                                
//                                if (selectedZlecenia.split(',').length > 1) {
//                                    dhtmlx.message({
//                                        title:_("Wiadomość"),
//                                        type:"alert",
//                                        text:_("Nie mogę wydrukować kilka zleceń. \n\
//                                               Zlecenia mogą być wydrukowane tylko pojedynczo. \n\
//                                               Wybierz jedno zlecenie.")
//                                    });                                     
//                                } else {
//                                    var selectedZlecenieId = zleceniaGrid.getSelectedRowId();
//                                    if (!selectedZlecenieId) {
//                                        var selectedZlecenieId = zleceniaGrid.getCheckedRows(0).split(',')[0];
//                                    }                                    
//                                    if (selectedZlecenieId) {
//                                        var zlecenie =  zleceniaGrid.getRowData(selectedZlecenieId);
//                                        if (zlecenie.status) { 
//                                                                                 
//                                        } else {
//                                            dhtmlx.message({
//                                                title:_("Wiadomość"),
//                                                type:"alert",
//                                                text:_("Nie można wzdrukować zlecenie \n\
//                                                        które nie wybrane do wyprodukowania!")
//                                            });
//                                        }
//                                    } else {
//                                        dhtmlx.message({
//                                            title:_("Wiadomość"),
//                                            type:"alert",
//                                            text:_("Wybierz zlecenie!")
//                                        });
//                                    }
//                                };
                        };break;
		        case 'Redo':{
                                zleceniaGrid.zaladuj(0);
                        };break;
                    }
                });                
                var zleceniaGrid = zleceniaLayout.cells("a").attachGrid({
		    image_path:'codebase/imgs/',
		    columns: [  
                        {label: "",                    id:'checked',           width: 30,  type: "ch", align: "center"},                        
                        {label: "Zmówienie Kod",       id:'order_kod',         width: 50,  type: "ro", sort: "str",  align: "center"},                        
                        {label: "Zlecenie Kod",        id:'kod',               width: 100, type: "ro", sort: "str",  align: "center"},                                              
                        {label: "Produkt Kod",         id:'product_kod',       width: 100, type: "ro", sort: "str",  align: "left"},
                        {label: "Imie produktu",       id:'product_name',      width: 200, type: "ro", sort: "str",  align: "left"},                        
                        {label: "Ilość produktu",      id:'amount',            width: 60,  type: "ro",sort: "str",  align: "right"},                        
                        {label: "Zrobiona ilość",      id:'done_amount',       width: 60,  type: "ro",sort: "str",  align: "right"},
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
                    if (rowData.closed == true || rowData.status == 2) {
                        zleceniaGrid.cells(rId,0).setValue(false);
                    }
                    var ids = zleceniaGrid.getCheckedRows(0);
                    if (ids.length) {
                        componentsGrid.fill(ids);
                        //tasksGrid.fill(ids);
                    }
                });                
		zleceniaGrid.zaladuj = function(i = 0){
                    this.clearAll();
                    var ids = Array();
                    ids = (typeof i === 'string' || typeof i === 'number')  ? [i] : i;
                    var new_data = ajaxGet("api/positions/forzlec", "", function(data){
                        if (data && data.success){                            
                                zleceniaGrid.parse(data.data, "js");
                            }
                        });			
		}; 
                zleceniaGrid.attachEvent("onRowCreated", function(rId,rObj,rXml){
                    var data = zleceniaGrid.getRowData(rId);
                    //blocked task
                    if (data.status == 2) {
                        zleceniaGrid.setRowColor(rId,"lightgray");
                    } 
                    //for producting
                    if (data.status == 1) {
                        zleceniaGrid.setRowColor(rId,"lightyellow");
                    } 
                    //done
                    if (data.closed == true) { 
                        zleceniaGrid.setRowColor(rId,"lightgreen");
                    } 
                    //inprogress
                    if (data.countWorks > 0) {
                        zleceniaGrid.setRowColor(rId,"yellow");
                    }
                }); 
                zleceniaGrid.zaladuj(0); 
                
                if (write) {
                    var tasksGridToolBar = zleceniaLayout.cells("b").attachToolbar({
                            iconset: "awesome",
                            items: [
                                    {id: "Add",  type: "button", text: _("Zapisz zmiany"),   img: "fa fa-save "},                                                                
                                    {id: "sep3",     type: "separator"},
                                    {id: "Redo", type: "button", text: _("Odśwież"),img: "fa fa-refresh"}
                            ]
                    });                     
                } else {
                    var tasksGridToolBar = zleceniaLayout.cells("b").attachToolbar({
                            iconset: "awesome",
                            items: [                                    
                                    {id: "Redo", type: "button", text: _("Odśwież"),img: "fa fa-refresh"}
                            ]
                    });                     
                }
		
		tasksGridToolBar.attachEvent("onClick", function(btn) {
                    switch (btn){
                            case 'Add':{
                                var selectedTasks = tasksGrid.getCheckedRows(0);
                                if (selectedTasks.length) {                              
                                    tasksGrid.forEachRow(function(id){
                                        var data = tasksGrid.getRowData(id);
                                        data.order_position_id = zleceniaGrid.getSelectedRowId();
                                        data.declared_amount = data.amount;                                        
                                        ajaxGet("api/declaredworks/savework", data, function(data){
                                            if (data.success) {
                                                console.log(data.data);
                                            } else {
                                                console.log(data.message);
                                            }
                                        });
                                    });
                                    tasksGrid.fill(zleceniaGrid.getSelectedRowId());
                                } else {
                                    dhtmlx.message({
                                        title:_("Wiadomość"),
                                        type:"alert",
                                        text:_("Zaznacz co najmniej jedno zadanie do wykonania")
                                    }); 
                                }
                            };break;                            
                            case 'Redo':{
                                    var ids = zleceniaGrid.getCheckedRows(0);
                                    if (ids.length) {
                                        tasksGrid.fill(ids);
                                    }
                            };break;
                    }
		});                
                var tasksGrid = zleceniaLayout.cells("b").attachGrid({
                    image_path:'codebase/imgs/',
                    columns: [ 
                        {id: "status", type: "ch", width: 30},
                        {label: _("Zadanie Kod"),      id: "kod",      type: "ro", sort: "str", align: "left", width: 100},                                                                        
                        {label: _("Zadanie"),          id: "name",     type: "ro", sort: "str", align: "left", width: 150},                         
                        {label: _("Ilość"),            id: "amount",   type: "ro", sort: "str", align: "left", width: 50},                                    
                        {label: _("Ilość czasu, min"), id: "duration", type: "ro", sort: "str", align: "left", width: 50},                          
                        {label: _("Ilość zrobiona"),   id: "done", type: "ro", sort: "str", align: "left", width: 50},                                                
                        {id: "countWorks"},
                        {id: "task_id"}
                    ]
                });  
                tasksGrid.setColumnHidden(6, true);
                tasksGrid.setColumnHidden(7, true);
                tasksGrid.attachEvent("onRowCreated", function(rId,rObj,rXml){
                    var data = tasksGrid.getRowData(rId);
                    if (data.status == false) {
                        tasksGrid.setRowColor(rId,"lightgrey");
                    }                    
                    if (data.countWorks > 0) {
                        tasksGrid.setRowColor(rId,"yellow");
                    }
                    if (data.amount == data.done) { 
                        tasksGrid.setRowColor(rId,"lightgreen");
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
                
                if (write) {
                    componentsGridToolBar = zleceniaLayout.cells("c").attachToolbar({
                        iconset: "awesome",
                        items: [                           
                            {id: "Do",    type: "button", text: _("Wyprodukować"),  img: "fa fa-wrench"},
                            {id: "Order", type: "button", text: _("Zamówić"), img: "fa fa-plus-square"},
                            {type: "separator", id: "sep3"},         
                            {id: "Redo", type: "button", text: _("Odśwież"), img: "fa fa-refresh"}
                        ]                    
                    }); 
                } else {
                    componentsGridToolBar = zleceniaLayout.cells("c").attachToolbar(emptyToolbar); 
                }
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
                                ajaxGet("api/orders/last", "", function(data){
                                    if (data.success) {
                                        var date = getNowDate();
                                        date = date.replace(/[-]/g, "");
                                        newOrderForm.setItemValue("kod", "W-" + date + "-" + data.data.id + 1);
                                    }
                                });                                  
                                newOrderForm.disableItem("client_id");
                                newOrderForm.disableItem("kod");
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
                        case 'Redo': {
                            var ids = zleceniaGrid.getCheckedRows(0);
                            if (ids.length) {
                                componentsGrid.fill(ids);                                
                            }                                
                        };break;
                    }
                });
                var componentsGrid = zleceniaLayout.cells("c").attachGrid({
                    image_path:'codebase/imgs/',
                    columns: [ 
                        {id: "checked", type: "ch", width: 30},
                        {label: _("Komponent Kod"),       id: "kod",      type: "ro", sort: "str", align: "left", width: 100},                                                                                                
                        {label: _("Wymagana ilość"),      id: "amount1",   type: "ro", sort: "str", align: "left", width: 50},                                    
                        {label: _("Ilość na magazynie"),  id: "available",type: "ro", sort: "str", align: "left", width: 50},
                        {label: _("Ilość do produkowania"),id: "amount",   type: "ro", sort: "str", align: "left", width: 50},                        
                        {id: "component_id"},												                        
                        {id: "order_position_id"}
                    ]
                });
                componentsGrid.setColumnHidden(5, true);
                componentsGrid.setColumnHidden(6, true);                               
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
	}
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
