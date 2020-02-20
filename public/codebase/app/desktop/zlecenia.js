var zleceniaGrid;
var zleceniaLayout;
var zleceniaForm;

function zleceniaInit(cell) {
	if (zleceniaLayout == null) {
                var userData = JSON.parse(localStorage.getItem("userData")); 
                var write;
                userData.permissions.forEach(function(elem){
                    if (elem.name == 'zlecenia') { write = elem.pivot.value; }
                });                
		var zleceniaLayout = cell.attachLayout("3L");		
		zleceniaLayout.cells("a").setText(_("Zlecenia"));
                zleceniaLayout.cells("b").setText(_("Zadania do wybranych zleceń"));
                zleceniaLayout.cells("c").setText(_("Niezbędne materialy"));        
/**
 * A
 * 
 */                
                var zleceniaGridToolBar = getZleceniaGridToolBar(zleceniaLayout.cells("a"), write);                                    
                zleceniaGridToolBar.attachEvent("onClick", function(btn) {	
		    switch (btn){  
		        case 'DontProduct':{
                            var selectedZlecenia = zleceniaGrid.getCheckedRows(0);
                            if (!selectedZlecenia) {
                                dhtmlx.message({
                                    title:_("Wiadomość"),
                                    type:"alert",
                                    text:_("Zaznacz co najmniej jedno zlecenie")
                                });  
                            } else {
                                var data = {};
                                data.zlecenia = selectedZlecenia;                                
                                ajaxGet("api/positions/dontproduct", data, function(data){
                                    if (data.success) {   
                                        zleceniaGrid.fill("api/positions/zlecenia", zleceniaGridToolBar);                                         
                                    }                                    
                                });  
                            }
                        };break;
                        case 'Print': {
                                var selectedZlecenia = zleceniaGrid.getCheckedRows(0);
                                ajaxGet("api/positions/print/" + selectedZlecenia, "", function(data){
                                    var myWindow=window.open('data:application/pdf,'+data, "_blank", "width=800,height=600,resizable=yes,scrollbars=yes,status=yes");
                                    myWindow.document.write(data);
                                    myWindow.focus();
                                    myWindow.print();
                                });                                
                        };break;
		        case 'Redo':{
                            zleceniaGrid.fill("api/positions/zlecenia", zleceniaGridToolBar); 
                        };break;
                        case 'Close': {
                            var selectedZlecenia = zleceniaGrid.getCheckedRows(0);
                            if (!selectedZlecenia) {
                                dhtmlx.message({
                                    title:_("Wiadomość"),
                                    type:"alert",
                                    text:_("Zaznacz co najmniej jedno zlecenie dla zamknięcia")
                                });                                
                            } else {
                                var data = {};
                                data.zlecenia = selectedZlecenia;                                
                                ajaxGet("api/positions/close", data, function(data){
                                    if (data.success) { 
                                        zleceniaGrid.fill("api/positions/zlecenia", zleceniaGridToolBar);                                          
                                    }
                                });                                 
                            }                              
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
                            {label: "Wydrukowane",         id:'printed',           width: 50,  type: "ch", align: "center"},
                            {label: "Zamknięte",           id:'closed',            width: 50,  type: "ch", align: "center"},                            
                            {label: "Imie produktu",       id:'product_name',      width: 200, type: "ro", sort: "str",  align: "left"},                        
                            {label: "Ilość produktu",      id:'amount',            width: 60,  type: "ro",sort: "str",  align: "right"},                        
                            {label: "Zrobiona ilość",      id:'done_amount',       width: 60,  type: "ro",sort: "str",  align: "right"},                                                      
                            {label: "Data dodania",        id:'created_at',        width: 120, type: "ro", sort: "date", align: "center"},                
                            {label: "Data zamkniecia",     id:'date_closed',       width: 120, type: "ro", sort: "date", align: "center"},
                            {label: "Data dostawy",        id:'num_week',          width: 120, type: "ro", align: "center"},                            
                            //{id: "description", width: 30, label: "description"},
                            {id: "product_id", width: 30, label: "product_id"},
                            //{id: "declared", width: 30, label: "declared"},
                            {id: "countWorks", width: 30, label: "countWorks"},
                            {id: "status", width: 30, label: "status"},
                            //{id: "order_id", width: 30, label: "order_id"},
                            //{id: "price", width: 30, label: "price"},
                            {id: "tasks", width: 30, label: "tasks"}
                    ],
                        multiline: true,
                        multiselect: true
                    });
                zleceniaGrid.attachHeader(",#select_filter,#text_filter,#text_filter");
                zleceniaGrid.setRegFilter(zleceniaGrid, 2);
                zleceniaGrid.setRegFilter(zleceniaGrid, 3);              
                  
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
                    }
                });                 
                zleceniaGrid.fill("api/positions/zlecenia", zleceniaGridToolBar); 
/**
 * B
 * 
 */                
                if (write) {
                    var tasksGridToolBar = zleceniaLayout.cells("b").attachToolbar(emptyToolbar);                                         
                } else {
                    var tasksGridToolBar = zleceniaLayout.cells("b").attachToolbar(emptyToolbar);                     
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
                        //{id: "status", type: "ch", width: 30},
                        {label: _("Zadanie Kod"),      id: "kod",      type: "ro", sort: "str", align: "left", width: 100},                                                                        
                        {label: _("Zadanie"),          id: "name",     type: "ro", sort: "str", align: "left", width: 150},                         
                        {label: _("Ilość"),            id: "amount",   type: "ro", sort: "str", align: "left", width: 50},                                    
                        {label: _("Ilość czasu, min"), id: "duration", type: "ro", sort: "str", align: "left", width: 50},                          
                        {label: _("Ilość zrobiona"),   id: "done", type: "ro", sort: "str", align: "left", width: 50},                                                
                        {id: "countWorks"},
                        {id: "task_id"}
                    ]
                });  
                tasksGrid.setColumnHidden(5, true);
                tasksGrid.setColumnHidden(6, true);
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
                    ajaxGet("api/positions/" + positionsIds + "/tasks", "", function(data){
                        if (data.success && data.data) {     
                            tasksGrid.parse((data.data), "js");
                        }
                    });
                };                 
/**
 * C
 * 
 */               
                var componentsGridToolBar;
                if (write) {
                    componentsGridToolBar = zleceniaLayout.cells("c").attachToolbar({
                        iconset: "awesome",
                        items: [                           
                            {id: "Do",    type: "button", text: _("Wyprodukować"),  img: "fa fa-wrench"},
                            //{id: "Order", type: "button", text: _("Zamówić"), img: "fa fa-plus-square"},
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
                                        //newOrderForm.setItemValue("kod", "W-" + date + "-" + data.data.id + 1);
                                        newOrderForm.setItemValue("kod", "W-" + data.data.id + 1);
                                    }
                                });                                  
                                newOrderForm.disableItem("client_id");
                                newOrderForm.disableItem("kod");
                                newOrderForm.attachEvent("onButtonClick", function(name){
                                    switch (name){
                                        case 'save':{                                                  
                                            var orderData = newOrderForm.getFormData();
                                            orderData.date_start = newOrderForm.getCalendar("date_start").getDate(true);                                         
                                            ajaxPost("api/orders", orderData, function(data){
                                                if (data && data.success) {
                                                    var i = 0;
                                                    selectedComponents.split(',').forEach(function(elem){
                                                        i++;
                                                        var component = componentsGrid.getRowData(elem);
                                                        component.order_id = data.data.id;
                                                        component.price = 0;
                                                        component.num_week = orderData.num_week;
                                                        component.product_id = component.component_id;
                                                        component.kod = i;
                                                        console.log(component);
                                                        ajaxPost("api/positions", component, "");
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
