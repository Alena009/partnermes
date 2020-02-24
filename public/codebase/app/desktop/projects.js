var projectsLayout;

function projectsInit(cell) {
    if (projectsLayout == null) {
            var userData = JSON.parse(localStorage.getItem("userData")); 
            var userCanWrite;
            userData.permissions.forEach(function(elem){
                if (elem.name == 'projects') {
                    userCanWrite = elem.pivot.value;
                }
            });         
            var projectsLayout = cell.attachLayout("2E");  
            projectsLayout.setAutoSize("a;b");            
            var orderLayout = projectsLayout.cells("a").attachLayout("2U");
            orderLayout.cells("a").setText(_("Informacja"));
            orderLayout.cells("a").setWidth(350);
            orderLayout.setAutoSize("a;b");
            orderLayout.cells("b").setText(_("Zamowienia"));            
            var positionLayout = projectsLayout.cells("b").attachLayout("2U");
            positionLayout.cells("a").setText(_("Informacja"));
            positionLayout.cells("a").setWidth(350);
            positionLayout.setAutoSize("a;b");            
            positionLayout.cells("b").setText(_("Pozycje"));
/**
 * Orders 
 * 
 * A
 * 
 */            
            var orderForm = createForm(newProjectFormStruct, orderLayout.cells("a"));   
            var clientsCombo = orderForm.getCombo("client_id");
            ajaxGet("api/clients", "", function(data){
                clientsCombo.addOption(data.data);
            });
            clientsCombo.attachEvent("onClose", function(){
                var value = clientsCombo.getSelectedValue();
                if (value == 0) {
                    ajaxGet("api/orders/last", "", function(data){
                        if (data.success) {
                            var date = getNowDate();
                            date = date.replace(/[-]/g, "");
                            orderForm.setItemValue("kod", "W-" + data.data.id + 1);
                            orderForm.disableItem("kod");
                        }
                    }); 
                } else {
                    orderForm.enableItem("kod");
                    orderForm.setItemValue("kod", "");
                }
            });
            clientsCombo.attachEvent("onChange", function(){
                var value = clientsCombo.getSelectedValue();
                if (value == 0) {
                    orderForm.disableItem("kod"); 
                } else {
                    orderForm.enableItem("kod");
                }
            });            
            orderForm.attachEvent("onButtonClick", function(name){
                if (name === 'save'){  
                    var orderData = orderForm.getFormData();
                    if (ordersGrid.getSelectedRowId()) { 
                        orderData.date_start = orderForm.getCalendar("date_start").getDate(true);                                
                        ordersGrid.edit("api/orders/" + orderData.id + "/edit", orderData);                        
                    } else {
                        orderData.date_start = orderForm.getCalendar("date_start").getDate(true);                                
                        ordersGrid.add("api/orders", orderData);                                          
                    }
                }
            }); 
/**
 * Positions
 * 
 * A
 * 
 */            
            var positionForm = createForm(orderPositionFormStruct, positionLayout.cells("a"));
            var productsCombo = positionForm.getCombo("product_id");
            ajaxGet("api/products", "", function(data){
                productsCombo.addOption(data.data);
            });
            positionForm.attachEvent("onButtonClick", function(name){
                if (name === 'save'){  
                    var positionData = positionForm.getFormData();
                    if (positionsGrid.getSelectedRowId()) {                         
                        positionsGrid.edit("api/positions/" + positionData.id + "/edit", positionData);                        
                    } else {    
                        var orderId = ordersGrid.getSelectedRowId();    
                        if (orderId) {
                            positionData.order_id = orderId;
                            positionData.status = 1;
                            positionsGrid.add("api/positions", positionData);
                        }
                    }
                }
            });            
/**
 * Orders 
 * 
 * B
 * 
 */            
            var ordersGridToolBar;
            userCanWrite ? ordersGridToolBar = orderLayout.cells("b").attachToolbar({
                    iconset: "awesome",
                    items: [
                            {id: "Add",  type: "button", text: _("Dodaj"), img: "fa fa-plus-square "},
                            {id: "Edit", type: "button", text: _("Edytuj"), img: "fa fa-edit"},
                            {id: "Del",  type: "button", text: _("Usuń"), img: "fa fa-minus-square"},
                            {id: "Close",  type: "button", text: _("Zamknij zamówienie"), img: "fa fa-check-square"},  
                            {type: "separator", id: "sep3"},
                            {id: "Redo", type: "button",text: _("Odśwież"), img: "fa fa-refresh"}
                    ]
            }):
                ordersGridToolBar = orderLayout.cells("b").attachToolbar(emptyToolbar);            
            ordersGridToolBar.attachEvent("onClick", function(id) { 
                switch (id){
                    case 'Add':{   
                        clearOrderForm(); 
                        orderLayout.cells("a").expand();
                        orderForm.setItemFocus("client_id");
                        ordersGrid.clearSelection();                        
                    };break;
                    case 'Edit':{ 
                        var orderId = ordersGrid.getSelectedRowId();                            
                        if (orderId) {
                            orderLayout.cells("a").expand();
                            orderForm.setItemFocus("client_id");
                        } else {
                            dhtmlx.alert({
                                title:_("Wiadomość"),
                                text:_("Wybierz zamowienie, które chcesz zmienić!")
                            });
                        }                              
                    };break;                    
                    case 'Del': {                                                                                                                                                                                                                                                   
                        var orderId = ordersGrid.getSelectedRowId();                            
                        if (orderId) {
                            var data = ordersGrid.getRowData(orderId);
                            if (+data.positionsInWork || +data.closedPositions) {
                                console.log(data);
                                dhtmlx.alert({
                                    title:_("Wiadomość"),
                                    text:_("Zamówienie ma otwarte lub zakończone zlecenia. Nie można usunąć!")
                                });
                            } else {
                                ordersGrid.delete("api/orders/" + orderId, orderId);
                                clearOrderForm(); 
                                refreshPositions(null);
                            }
                        } else {
                            dhtmlx.alert({
                                title:_("Wiadomość"),
                                text:_("Wybierz zamowienie, które chcesz usunąć!")
                            });
                        }                            
                    };break; 
                    case 'Close': {                                                                                                                                                                                                                                                   
                        var orderId = ordersGrid.getSelectedRowId();                            
                        if (orderId) {
                            ajaxGet('api/orders/'+orderId+'/close', '', function(data){                                                                                                        
                                if (data && data.success) { 
                                    dhtmlx.alert({
                                        title:_("Wiadomość"),
                                        text:_("Zamknięte!")
                                    });
                                } else {
                                    dhtmlx.alert({
                                        title:_("Wiadomość"),
                                        text:_("Błąd! Zmiany nie zostały zapisane")
                                    });
                                }                                          
                            });
                        } else {
                            dhtmlx.alert({
                                title:_("Wiadomość"),
                                text:_("Wybierz zamowienie, które chcesz zamknąć!")
                            });
                        }                            
                    };break;                     
                    case 'Redo': {
                        refreshOrders();  
                        refreshPositions(ordersGrid.getSelectedRowId());
                    };break;
                }
            });            
            var ordersGrid = orderLayout.cells("b").attachGrid({
                image_path:'codebase/imgs/',
                columns: [
                    {label: _("Kod"),              id: "kod",         type: "ro",   sort: "str", align: "left", width: 50},                    
                    {label: _("Klient"),           id: "client_name", type: "ro",   sort: "str", align: "left", width: 150},                                                                                                
                    {label: _("Termin wykonania"), id: "num_week",    type: "ro",   sort: "str", align: "left", width: 50},                         
                    {id: "client_id"}, 
                    {id: "date_start"}, 
                    {id: "description"},
                    {label: _("Iłość wydrukowanych zleceń"), id: "positionsInWork", type: "ro",   sort: "str", align: "left", width: 50},
                    {label: _("Iłość zamkniętych zleceń"),   id: "closedPositions", type: "ro",   sort: "str", align: "left", width: 50}
                ]
            });            
            ordersGrid.attachHeader('#text_filter,#text_filter,#select_filter');      
            ordersGrid.setColumnHidden(3,true);
            ordersGrid.setColumnHidden(4,true);
            ordersGrid.setColumnHidden(5,true);                                              
            ordersGrid.attachEvent("onRowSelect", function() {
                var id = ordersGrid.getSelectedRowId();
                var orderData = ordersGrid.getRowData(id);
                var numWeekCombo = positionForm.getCombo("num_week");
                numWeekCombo.selectOption(numWeekCombo.getIndexByValue(orderData.num_week));                 
                positionsGrid.fill(id);                
            });                             
            ordersGrid.fill("api/orders"); 
/**
 * Positions
 * 
 * B
 * 
 */            
            var positionsGridToolbar;
            if (userCanWrite) {
                positionsGridToolbar = positionLayout.cells("b").attachToolbar(standartToolbar);   
            } else {
                positionsGridToolbar = positionLayout.cells("b").attachToolbar(emptyToolbar);
            }
            positionsGridToolbar.attachEvent("onClick", function(id) { 
                switch (id) {
                    case 'Add': {
                        var orderId = ordersGrid.getSelectedRowId();                         
                        if (orderId) {
                            var orderData = ordersGrid.getRowData(orderId);
                            positionLayout.cells("a").expand();
                            positionForm.setItemFocus(positionForm.getFirstActive()); 
                            positionsGrid.clearSelection();
                            clearPositionForm(); 
                            var numWeekCombo = positionForm.getCombo("num_week");
                            numWeekCombo.selectOption(numWeekCombo.getIndexByValue(orderData.num_week));                            
                        } else {
                            dhtmlx.message({
                                title:_("Wiadomość"),
                                type:"alert",
                                text:_("Wybierz zamowienie!")
                            }); 
                        }
                    };break;
                    case 'Edit': {                               
                        var positionId = positionsGrid.getSelectedRowId();
                        if (positionId) {
                            positionLayout.cells("a").expand();
                            positionForm.setItemFocus(positionForm.getFirstActive());                                                             
                        } else {
                            dhtmlx.message({
                                title:_("Wiadomość"),
                                type:"alert",
                                text:_("Wybierz pozycje!")
                            });
                        }                                    
                    };break;
                    case 'Del': {                               
                        var positionId = positionsGrid.getSelectedRowId();
                        if (positionId) {    
                            var data = positionsGrid.getRowData(positionId);
                            if (data.status > 1) {
                                dhtmlx.alert({
                                    title:_("Wiadomość"),
                                    text:_("Nie wolno usunąć, są wydrukowane zlecenia dla tej pozycji!")
                                });
                            } else {
                                positionsGrid.delete("api/positions/" + positionId, positionId);
                                clearPositionForm();                                 
                            }                                                                               
                        } else {
                            dhtmlx.alert({
                                title:_("Wiadomość"),
                                text:_("Wybierz pozycje, która chcesz usunąć!")
                            });
                        }                                    
                    };break;                            
                    case 'Redo': {
                        var orderId = ordersGrid.getSelectedRowId();
                        if (orderId) {
                            refreshPositions(orderId);                           
                        } else {
                            dhtmlx.message({
                                title:_("Wiadomość"),
                                type:"alert",
                                text:_("Wybierz zamowienie!")
                            }); 
                        }
                    };break;
                };
            }); 
            
            var positionsGrid = positionLayout.cells("b").attachGrid({
                image_path:'codebase/imgs/',
                columns: [
                    {label: _("Kod pozycji"), id: "kod",          type: "ro", sort: "str", align: "left", width: 50},
                    {label: _("Produkt Kod"), id: "product_kod",  type: "ro", sort: "str", align: "left", width: 150},
                    {label: _("Produkt"),     id: "product_name", type: "ro", sort: "str", align: "left", width: 150},
                    {label: _("Ilosc"),       id: "amount",       type: "ro", sort: "str", align: "left", width: 50},
                    {label: _("Cena"),        id: "price",        type: "ro", sort: "str", align: "left", width: 50},
                    {label: _("Suma"),        id: "summa",        type: "ro", sort: "str", align: "left", width: 50},
                    {label: _("Szczegóły"),   id: "description",  type: "ro", sort: "str", align: "left", width: 100},                        
                    {label: _("Data dostawy"),id: "num_week",     type: "ro", sort: "str", align: "left", width: 100}, 
                    {id: "product_id"},
                    {id: "id"},
                    {id: "order_id"}, 
                    {id: "countWorks"},
                    {id: "status"},
                    {id: "date_status"}
                ]                   
            });  
            positionsGrid.setColumnHidden(8,true);
            positionsGrid.setColumnHidden(9,true);
            positionsGrid.setColumnHidden(10,true);
            positionsGrid.setColumnHidden(11,true);
            positionsGrid.setColumnHidden(12,true);
            positionsGrid.setColumnHidden(13,true);                    
            positionsGrid.attachHeader("#text_filter,#text_filter,#text_filter");
            positionsGrid.attachFooter(
                [_("Ilosc produktow: "),"#cspan","","#stat_total","",""],
                ["text-align:right;","text-align:center"]
            );                       
            positionsGrid.attachFooter(
                [_("Ilosc pozycji: "),"#cspan","","#stat_count","",""],
                ["text-align:right;","text-align:center"]
            );                
            positionsGrid.attachFooter(
                [_("Suma: "),"#cspan","","","","#stat_total"],
                ["text-align:right;","text-align:center"]
            );                                
            positionsGrid.attachEvent("onRowCreated", function(rId,rObj,rXml){
                var data = positionsGrid.getRowData(rId);
                if (data.status == 2) {
                    positionsGrid.setRowColor(rId,"yellow");
                }    
                if (data.status == 3) {
                    positionsGrid.setRowColor(rId,"lightgreen");
                }                 
            });                     
            positionsGrid.fill = function(id){
                positionsGrid.setRegFilter(positionsGrid, 1);
                positionsGrid.setRegFilter(positionsGrid, 2);
                positionsGrid.clearAll();
                ajaxGet("api/positions/byorder/" + id, '', function(data){
                    if (data.data && data.success){			    
                        positionsGrid.parse(data.data, "js");
                    }
                });			
            };   
            orderForm.bind(ordersGrid);
            positionForm.bind(positionsGrid);       
    }
    
    function clearOrderForm()
    {
        orderForm.clear();
        var clientsCombo = orderForm.getCombo("client_id");
        clientsCombo.unSelectOption();         
    }
    
    function refreshOrders()
    {
        ordersGrid.fill("api/orders");
        clearOrderForm();
    }
    
    function refreshPositions(orderId)
    {
        positionsGrid.fill(orderId);    
        clearPositionForm();
    }
    
    function clearPositionForm()
    {
        positionForm.clear();
        var productsCombo = positionForm.getCombo("product_id");
        productsCombo.unSelectOption();        
    }
   
}

window.dhx4.attachEvent("onSidebarSelect", function(id, cell){
	if (id == "projects") {
            window.history.pushState({'page_id': id}, null, '#projects');
	    projectsInit(cell);
	}
});
//
////var projectsGrid;
//var projectsLayout;
//var projectsTabbar;
//var projectsChart;
//var projectsChartId;
//var projectsForm;
//
//function projectsInit(cell) {	
//	if (projectsLayout == null) {	
//            var userData = JSON.parse(localStorage.getItem("userData")); 
//            var userCanWrite;
//            userData.permissions.forEach(function(elem){
//                if (elem.name == 'projects') {
//                    userCanWrite = elem.pivot.value;
//                }
//            });   
//
//            var projectsLayout = cell.attachLayout("3J");
//            projectsLayout.cells("a").setText(_("Zamowienia"));
//            projectsLayout.cells("b").setText(_("Informacja o zamowieniu"));
//            projectsLayout.cells("c").setText(_("Pozycje"));
//            projectsLayout.cells("b").setWidth(330);
//            projectsLayout.cells("c").setHeight(350);
//            projectsLayout.setAutoSize("a;c", "a;b");
///**
// * A
// * 
// */
//            var projectsGridToolBar;
//            userCanWrite ? projectsGridToolBar = projectsLayout.cells("a").attachToolbar(standartToolbar):
//                projectsGridToolBar = projectsLayout.cells("a").attachToolbar(emptyToolbar);
//            projectsGridToolBar.attachEvent("onClick", function(id) { 
//                switch (id){
//                    case 'Add':{   
//                        var newOrderWindow = createWindow(_("Nowe zamowienie"), 500, 450);
//                        var newOrderForm = createForm(newProjectFormStruct, newOrderWindow);                                                                
//                        var clientsCombo = newOrderForm.getCombo("client_id");
//                        ajaxGet("api/clients", "", function(data){
//                            clientsCombo.addOption(data.data);
//                        }); 
//                        clientsCombo.attachEvent("onClose", function(){
//                            var value = clientsCombo.getSelectedValue();
//                            if (value == 0) {
//                                ajaxGet("api/orders/last", "", function(data){
//                                    if (data.success) {
//                                        var date = getNowDate();
//                                        date = date.replace(/[-]/g, "");
//                                        newOrderForm.setItemValue("kod", "W-" + date + "-" + data.data.id + 1);
//                                        newOrderForm.disableItem("kod");
//                                    }
//                                }); 
//                            } else {
//                                newOrderForm.enableItem("kod");
//                                newOrderForm.setItemValue("kod", "");
//                            }
//                        });
//                        newOrderForm.attachEvent("onButtonClick", function(name){
//                            if (name === 'save'){  
//                                var newOrderData = newOrderForm.getFormData();
//                                newOrderData.date_start = newOrderForm.getCalendar("date_start").getDate(true);                                
//                                addOrder(newOrderData, projectsGrid); 
//                                newOrderWindow.close();                                                
//                            }
//                        }); 
//                    };break;
//                    case 'Edit':{ 
//                        var orderId = projectsGrid.getSelectedRowId();                            
//                        if (orderId) {
//                            var editOrderWindow = createWindow(_("Edytuj zamowienie"), 480, 380);                            
//                            var editOrderForm = createForm(newProjectFormStruct, editOrderWindow);                                
//                            var orderData = projectsGrid.getRowData(projectsGrid.getSelectedRowId());
//                            var clientsCombo = editOrderForm.getCombo("client_id");
//                            ajaxGet("api/clients", "", function(data){
//                                clientsCombo.addOption(data.data);                            
//                            }); 
//                            editOrderForm.setFormData(orderData);
//                            editOrderForm.attachEvent("onButtonClick", function(name){
//                                if (name === 'save'){                                 
//                                    var orderData = editOrderForm.getFormData();   
//                                    orderData.date_start = editOrderForm.getCalendar("date_start").getDate(true);                                                                              
//                                    editOrder(projectsGrid.getSelectedRowId(), orderData, projectsGrid);
//                                    editOrderWindow.close();
//                                }
//                            });   
//                        } else {
//                            dhtmlx.alert({
//                                title:_("Wiadomość"),
//                                text:_("Wybierz zamowienie, które chcesz edytować!")
//                            });
//                        }
//                    };break;   
//                    case 'Del': {                                                                                                                                                                                                                                                   
//                        var orderId = projectsGrid.getSelectedRowId();                            
//                        if (orderId) {
//                            var rowData = projectsGrid.getRowData(orderId);                                
//                            if (rowData.hasopenworks != 0) {
//                                dhtmlx.alert({
//                                    title:_("Wiadomość"),
//                                    text:_("Nie mozna usunąć zamowienie. \n\
//                                            Juz sa zlecenia dla tego zamowienia.")
//                                });                                            
//                            } else { 
//                                dhtmlx.confirm({
//                                    title: _("Ostrożność"),                                    
//                                    text: _("Czy na pewno chcesz usunąć?"),
//                                    callback: function(result){
//                                        if (result) {                                                                                    
//                                            ajaxDelete("api/orders/" + orderId, "", function(data){
//                                                if (data && data.success){                                                    
//                                                    projectsGrid.deleteRow(orderId);
//                                                    positionsGrid.fill(0);
//                                                    positionsGrid.callEvent("onGridReconstructed", []);
//                                                    projectsForm.clear();
//                                                } else {
//                                                    dhtmlx.alert({
//                                                        title:_("Wiadomość"),
//                                                        text:_("Nie udało się usunąć!")
//                                                    });
//                                                }
//                                            });   
//                                        }
//                                    }
//                                });                                                                
//                            }
//                        } else {
//                            dhtmlx.alert({
//                                title:_("Wiadomość"),
//                                text:_("Wybierz zamowienie, które chcesz usunąć!")
//                            });
//                        }                            
//                    };break; 
//                    case 'Redo': {
//                        projectsGrid.fill("api/orders"); 
//                    };break;
//                }
//            });                                 
//            var projectsGrid = projectsLayout.cells("a").attachGrid({
//                image_path:'codebase/imgs/',
//                columns: [
//                    {label: _("Kod"),              id: "kod",         type: "ro",   sort: "str", align: "left", width: 50},                    
//                    {label: _("Klient"),           id: "client_name", type: "ro",   sort: "str", align: "left", width: 150},                                                                                                
//                    {label: _("Termin wykonania"), id: "num_week",    type: "ro",   sort: "str", align: "left", width: 50},                         
//                    {id: "client_id"}, 
//                    {id: "hasopenworks"},
//                    {id: "date_start"}, 
//                    {id: "description"}                     
//                ]
//            });
//            projectsGrid.attachHeader('#text_filter,#text_filter,#select_filter');      
//            projectsGrid.setColumnHidden(3,true);
//            projectsGrid.setColumnHidden(4,true);
//            projectsGrid.setColumnHidden(5,true);            
//            projectsGrid.setColumnHidden(6,true);            
//            projectsGrid.attachEvent("onRowSelect", function() {
//                var id = projectsGrid.getSelectedRowId();
//                //historyGrid.fill(id);
//                positionsGrid.fill(id);
//            });              
//            projectsGrid.attachEvent("onRowCreated", function(rId,rObj,rXml){
//                var data = projectsGrid.getRowData(rId);
//                if (data.hasopenworks != 0) {
//                    projectsGrid.setRowColor(rId,"yellow");
//                }
//            });                 
//            projectsGrid.fill("api/orders");                           
///**
// * B
// * 
// */		
//            var projectsForm = createForm(newProjectFormStruct, projectsLayout.cells("b"));
//            var clientsCombo = projectsForm.getCombo("client_id");  
//            ajaxGet("api/clients", '', function(data) {
//                if (data.success && data.data) {
//                    clientsCombo.addOption(data.data);                         
//                }
//            }); 
//            if (!userCanWrite) { projectsForm.hideItem('save'); }
//            projectsForm.attachEvent("onButtonClick", function(name){
//                if (name === 'save'){
//                    var data = projectsForm.getFormData();   
//                    data.date_start = projectsForm.getCalendar("date_start").getDate(true);
//                    if (projectsGrid.getSelectedRowId()) {                                                                                                          
//                        editOrder(projectsGrid.getSelectedRowId(), data, projectsGrid);
//                    } else {                        
//                        addOrder(data, projectsGrid);
//                    }                        
//                }
//            });                                                               
//            projectsForm.bind(projectsGrid);
///**
// * C
// */                                                            
//            var projectsTabbar = projectsLayout.cells("c").attachTabbar({
//                arrows_mode: "auto",
//                tabs: [
//                    {id: "positions", text: _("Pozycje"), selected: 1},                            
//                    {id: "history", text: _("Historia")}                                
//                ]
//            }); 
//                if (userCanWrite) {
//                    positionsGridToolbar = projectsTabbar.tabs("positions").attachToolbar({
//                            iconset: "awesome",
//                            items: [
//                                {id:"Add", type:"button",  text: _("Dodaj"),  img: "fa fa-plus-square"},
//                                {id:"Edit", type:"button", text: _("Edytuj"), img: "fa fa-edit"},
//                                {id:"Del",  type:"button",text: _("Usun"),   img: "fa fa-minus-square"},
//                                {type: "separator", id: "sep3"},
//                                {id: "Block",text: _("Blokuj"), type: "button", img: "fa fa-lock"},                            
//                                {id: "UnBlock",text: _("Odblokuj"), type: "button", img: "fa fa-unlock"},                            
//                                {type: "separator", id: "sep2"},
//                                {id: "Redo", type: "button", text: _("Odśwież"), img: "fa fa-refresh"}
//                            ]
//                    });   
//                } else {
//                    positionsGridToolbar = projectsTabbar.tabs("positions").attachToolbar(emptyToolbar);
//                }
//                positionsGridToolbar.attachEvent("onClick", function(id) { 
//                    switch (id) {
//                        case 'Add': {
//                            var orderId = projectsGrid.getSelectedRowId();                                                          
//                            if (orderId) {
//                                var order = projectsGrid.getRowData(orderId); 
//                                var positionsWindow = createWindow(_("Nowa pozycja"), 350, 550);
//                                var positionsForm = createForm(orderPositionFormStruct, positionsWindow);                                
//                                positionsForm.setItemFocus("kod");
//                                var productsCombo = positionsForm.getCombo("product_id");
//                                var numWeekCombo = positionsForm.getCombo("num_week");
//                                numWeekCombo.selectOption(numWeekCombo.getIndexByValue(order.num_week));
//                                ajaxGet("api/products", '', function(data) {
//                                    if (data.success && data.data) {
//                                        productsCombo.addOption(data.data);                                    
//                                    }
//                                });
//                                positionsForm.attachEvent("onButtonClick", function(name){
//                                    if (name == 'save') {                                                     
//                                        var data = positionsForm.getFormData();                                                                                                
//                                        data.order_id = orderId;
//                                        ajaxPost("api/positions", data, function(data){                                                   
//                                            if (data.success) {
//                                                positionsGrid.addRow(data.data.id, '');
//                                                positionsGrid.setRowData(data.data.id, data.data);
//                                                positionsGrid.callEvent("onGridReconstructed", []);
//                                            } else {                                                
//                                                dhtmlx.alert({
//                                                    title:_("Wiadomość"),
//                                                    text:_("Błąd! Zmiany nie zostały zapisane")
//                                                });
//                                            }
//                                        });                                                                                           
//                                    }
//                                });                                     
//                            } else {
//                                dhtmlx.message({
//                                    title:_("Wiadomość"),
//                                    type:"alert",
//                                    text:_("Wybierz zamowienie!")
//                                }); 
//                            }
//                        };break;
//                        case 'Edit': {                               
//                            var positionId = positionsGrid.getSelectedRowId();
//                            if (positionId) {
//                                var orderId    = projectsGrid.getSelectedRowId(); 
//                                var order      = projectsGrid.getRowData(orderId);                                 
//                                var position = positionsGrid.getRowData(positionId);
//                                var positionsWindow = createWindow(_("Edutyj pozycje"), 350, 550);
//                                var positionsForm = createForm(orderPositionFormStruct, positionsWindow);                                    
//                                positionsForm.setFormData(position);  
//                                var productsCombo = positionsForm.getCombo("product_id");
//                                ajaxGet("api/products", "", function(data){
//                                    productsCombo.addOption(data.data);
//                                    productsCombo.selectOption(productsCombo.getIndexByValue(position.product_id));
//                                }); 
//                                positionsForm.attachEvent("onButtonClick", function(name){
//                                    if (name == 'save'){                                                        
//                                        var data = positionsForm.getFormData();                                                                                            
//                                        data.order_id = projectsGrid.getSelectedRowId();
//                                        ajaxGet("api/positions/" + data.id + "/edit", data, function(data){
//                                            if (data.success && data.data) {
//                                                dhtmlx.alert({
//                                                    title:_("Wiadomość"),
//                                                    text:_("Zapisane")
//                                                });
//                                                positionsGrid.setRowData(data.data.id, data.data);
//                                                positionsGrid.callEvent("onGridReconstructed", []);
//                                                positionsWindow.close();                                                    
//                                            } else {
//                                                dhtmlx.alert({
//                                                    title:_("Wiadomość"),
//                                                    text:_("Błąd! Zmiany nie zostały zapisane")
//                                                });                                                    
//                                            }
//                                        });                                            
//                                    }
//                                });                                    
//                            } else {
//                                dhtmlx.message({
//                                    title:_("Wiadomość"),
//                                    type:"alert",
//                                    text:_("Wybierz pozycje!")
//                                });
//                            }                                    
//                        };break;
//                        case 'Del': {
//                            var orderId    = projectsGrid.getSelectedRowId(); 
//                            var order      = projectsGrid.getRowData(orderId);                                
//                            var positionId = positionsGrid.getSelectedRowId();
//                            if (positionId) {                                   
//                                //ajaxGet("api/positions/list/beguntasks/" + positionId, "", function (data){
//                                    var rowData = positionsGrid.getRowData(positionsGrid.getSelectedRowId());
//                                    if (rowData.status) {
//                                        dhtmlx.alert({
//                                            title:_("Wiadomość"),
//                                            text:_("Nie mozna usunąć pozycje. \n\
//                                                    Juz sa zlecenia dla tej pozycji.")
//                                        });                                            
//                                    } else {
//                                        dhtmlx.confirm({
//                                            title: _("Ostrożność"),                                    
//                                            text: _("Czy na pewno chcesz usunąć pozycje?"),
//                                            callback: function(result){
//                                                if (result) {                                
//                                                    ajaxDelete("api/positions/" + positionId, "", function(data){
//                                                        if (data && data.success) {
//                                                            positionsGrid.deleteRow(positionId);
//                                                        }
//                                                    }); 
//                                                }
//                                            }
//                                        });                                            
//                                    }
//                                //});
//                            } else {
//                                dhtmlx.alert({
//                                    title:_("Wiadomość"),
//                                    text:_("Wybierz pozycje, która chcesz usunąć!")
//                                });
//                            }                                    
//                        };break;
//                        case 'UnBlock':{
//                            var data = positionsGrid.getRowData(positionsGrid.getSelectedRowId());
//                            data.status = 0;
//                            data.date_status = new Date();
//                            ajaxGet("api/positions/" + data.id + "/edit", data, function(data){
//                                if (data.success && data.data) {                            
//                                    //positionsGrid.fill(projectsGrid.getSelectedRowId());
//                                    positionsGrid.setRowData(data.data.id, data.data);
//                                    positionsGrid.callEvent("onRowCreated", [data.id]);
//                                }
//                            });                                                        
//                        };break;                         
//                        case 'Block':{
//                            var data = positionsGrid.getRowData(positionsGrid.getSelectedRowId());
//                            data.status = 2;
//                            data.date_status = new Date();
//                            ajaxGet("api/positions/" + data.id + "/edit", data, function(data){
//                                if (data.success && data.data) {                            
//                                    positionsGrid.setRowData(data.data.id, data.data);
//                                    positionsGrid.callEvent("onRowCreated", [data.id]);
//                                }
//                            });                         
//                        };break;                              
//                        case 'Redo': {
//                            var orderId = projectsGrid.getSelectedRowId();
//                            if (orderId) {
//                                positionsGrid.fill(orderId);
//                            }
//                        };break;
//                    };
//                });                
//                var positionsGrid = projectsTabbar.tabs("positions").attachGrid({
//                    image_path:'codebase/imgs/',
//                    columns: [
//                        {label: _("Kod pozycji"), id: "kod",          type: "ro", sort: "str", align: "left", width: 50},
//                        {label: _("Produkt Kod"), id: "product_kod",  type: "ro", sort: "str", align: "left", width: 150},
//                        {label: _("Produkt"),     id: "product_name", type: "ro", sort: "str", align: "left", width: 150},
//                        {label: _("Ilosc"),       id: "amount",       type: "ro", sort: "str", align: "left", width: 50},
//                        {label: _("Cena"),        id: "price",        type: "ro", sort: "str", align: "left", width: 50},
//                        {label: _("Suma"),        id: "summa",        type: "ro", sort: "str", align: "left", width: 50},
//                        {label: _("Szczegóły"),   id: "description",  type: "ro", sort: "str", align: "left", width: 100},                        
//                        {label: _("Data dostawy"),id: "num_week",     type: "ro", sort: "str", align: "left", width: 100}, 
//                        {id: "product_id"},
//                        {id: "id"},
//                        {id: "order_id"}, 
//                        {id: "countWorks"},
//                        {id: "status"},
//                        {id: "date_status"}
//                    ]                   
//                });  
//                positionsGrid.setColumnHidden(8,true);
//                positionsGrid.setColumnHidden(9,true);
//                positionsGrid.setColumnHidden(10,true);
//                positionsGrid.setColumnHidden(11,true);
//                positionsGrid.setColumnHidden(12,true);
//                positionsGrid.setColumnHidden(13,true);                    
//                positionsGrid.attachHeader("#text_filter,#text_filter,#text_filter");
//                positionsGrid.attachFooter(
//                    [_("Ilosc produktow: "),"#cspan","","#stat_total","",""],
//                    ["text-align:right;","text-align:center"]
//                );                       
//                positionsGrid.attachFooter(
//                    [_("Ilosc pozycji: "),"#cspan","","#stat_count","",""],
//                    ["text-align:right;","text-align:center"]
//                );                
//                positionsGrid.attachFooter(
//                    [_("Suma: "),"#cspan","","","","#stat_total"],
//                    ["text-align:right;","text-align:center"]
//                );                                
//                positionsGrid.attachEvent("onRowCreated", function(rId,rObj,rXml){
//                    var data = positionsGrid.getRowData(rId);
//                    //inprogress
//                    if (data.countWorks > 0) {
//                        positionsGrid.setRowColor(rId,"yellow");
//                    }
//                    //blocked task
//                    if (data.status == 2) {
//                        positionsGrid.setRowColor(rId,"lightgray");
//                    } 
//                    //for producting
//                    if (data.status == 1) {
//                        positionsGrid.setRowColor(rId,"lightyellow");
//                    }                         
//                });                     
//                positionsGrid.fill = function(id){
//                    positionsGrid.setRegFilter(positionsGrid, 1);
//                    positionsGrid.setRegFilter(positionsGrid, 2);
//                    positionsGrid.clearAll();
//                    ajaxGet("api/positions/byorder/" + id, '', function(data){
//                        if (data.data && data.success){			    
//                            positionsGrid.parse(data.data, "js");
//                        }
//                    });			
//                };                
//
//                var historyGrid = projectsTabbar.tabs("history").attachGrid({
//                    image_path:'codebase/imgs/',
//                    columns: [
//                        {label: _("Imie"), id: "name",       type: "ro", sort: "str", align: "left"},
//                        {label: _("Opis"), id: "description",type: "ro", sort: "str", align: "left"},
//                        {label: _("Data"), id: "created_at", type: "ro", sort: "str", align: "left"},
//                        {id: "order_id"}
//                    ]                   
//                });     
//                historyGrid.setColumnHidden(3,true);
//                historyGrid.fill = function(id){
//                    historyGrid.clearAll();
//                    ajaxGet("api/orders/history/" + id, '', function(data){
//                        if (data.data && data.success){                                
//                            historyGrid.parse(data.data, "js");
//                        }
//                    });			
//                };                                           
//	}	
//}
var nowDate = getNowDate();

var newProjectFormStruct = [          
        {type: "settings", position: "label-left", labelWidth: 110, inputWidth: 160},   	        
        {type: "combo", name: "client_id", required: true, label: _("Klient"), options: []},		
        {type: "input", name: "kod",       required: true, label: _("Kod zamowienia")},
        {type: "input", name: "description", label: _("Opis"), rows: 3},
        {type: "calendar", name: "date_start",  label: _("Data zamowienia"), 
            required: true, dateFormat: "%Y-%m-%d", enableTodayButton: true,
            value: nowDate},                       
        {type: "combo", name: "num_week", required: true, label: _("Termin wykonania"), 
            options:[],
            note: {text: _("Numer tygodnia. Jest obowiazkowe.")}},
        {type: "block", blockOffset: 0, position: "label-left", list: [
            {type: "button", name: "save",   value: "Zapisz", offsetTop:18}                            
        ]}	
];
orderPositionFormStruct = [
    {type: "settings", position: "label-left", labelWidth: 110, inputWidth: 160},		
    {type: "input", name: "kod",        required: true, label: _("Kod pozycji")},
    {type: "combo", name: "product_id", required: true, label: _("Produkt"), options: []},		                        
    {type: "input", name: "amount",     required: true, label: _("Ilosc"),                        
        note:{text: _("Ilosc. Tylko liczby. Jest obowiazkowe.")}}, 
    {type: "input", name: "price",      required: true, label: _("Cena"), info:true,
        tooltip: _("Format 0000.00"),
        note:{text: _("Cena, tylko liczby. Jest obowiazkowe.")}},
    {type: "input", name: "description", label: _("Opis"), rows: 3},
    {type: "combo", name: "num_week",    required: true, label: _("Data dostawy"), 
        options:[],
        note: {text: _("Numer tygodnia. Jest obowiazkowe.")}},
    {type: "block", blockOffset: 0, position: "laabel-left", list: [
        {type: "button", name: "save",   value: "Zapisz", offsetTop:18},
        {type: "newcolumn"},
        {type:"button", name:"cancel", value:"Anuluj", offsetTop:18}
    ]}                    
]; 
//
//function addOrder(data, grid) {                                             
//    ajaxPost("api/orders", data, function(data){
//        if (data && data.success) {
//            grid.addRow(data.data.id, '');
//            grid.setRowData(data.data.id, data.data);
//            dhtmlx.alert({
//                title:_("Wiadomość"),
//                text:_("Zapisane")
//            });                        
//        } else {
//            dhtmlx.alert({
//                title:_("Wiadomość"),
//                text:_("Błąd! Zmiany nie zostały zapisane")
//            });
//        }
//    });    
//}
//
//function editOrder(id, data, grid) {
//    ajaxGet("api/orders/" + id + "/edit", data, function(data){                                            
//         if (data && data.success) {
//            grid.setRowData(data.data.id, data.data);
//            dhtmlx.alert({
//                title:_("Wiadomość"),
//                text:_("Zapisane")
//            });                                                
//        } else {
//            dhtmlx.alert({
//                title:_("Wiadomość"),
//                text:_("Błąd! Zmiany nie zostały zapisane")
//            });
//        }
//    });   
//}
//
////function updateChart(id) {
////	if (projectsTabbar.getActiveTab() != "stats") return;
////	if (id == null) id = projectsGrid.getSelectedRowId();
////	if (id == projectsChartId || id == null) return;
////	// init chart
////	if (projectsChart == null) {
////		projectsChart = projectsTabbar.tabs("stats").attachChart({
////			view:	  "bar",
////			value:    "#sales#",
////			gradient: "rising",
////			radius:   0,
////			legend: {
////				width:	  75,
////				align:	  "right",
////				valign:	  "middle",
////				template: "#month#"
////			}
////		});
////	} else {
////		projectsChart.clearAll();
////	}
////	projectsChart.load(A.server+"chart/"+id+".json?r="+new Date().getTime(),"json");
////	// remember loaded project
////	projectsChartId = id;
////}
//
//window.dhx4.attachEvent("onSidebarSelect", function(id, cell){
//	if (id == "projects") {
//            window.history.pushState({'page_id': id}, null, '#projects');
//	    projectsInit(cell);
//	}
//});