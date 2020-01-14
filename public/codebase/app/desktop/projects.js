var projectsGrid;
var projectsLayout;
var projectsTabbar;
var projectsChart;
var projectsChartId;
var projectsForm;

function projectsInit(cell) {	
	if (projectsLayout == null) {	
            var userData = JSON.parse(localStorage.getItem("userData")); 
            var userCanWrite;
            userData.permissions.forEach(function(elem){
                if (elem.name == 'projects') {
                    userCanWrite = elem.pivot.value;
                }
            });   

            var projectsLayout = cell.attachLayout("3J");
            projectsLayout.cells("a").setText(_("Zamowienia"));
            projectsLayout.cells("b").setText(_("Informacja o zamowieniu"));
            projectsLayout.cells("c").setText(_("Pozycje"));
            projectsLayout.cells("b").setWidth(330);
            projectsLayout.cells("c").setHeight(350);
            projectsLayout.setAutoSize("a;c", "a;b");
/**
 * A
 * 
 */
            var projectsGridToolBar;
            userCanWrite ? projectsGridToolBar = projectsLayout.cells("a").attachToolbar(standartToolbar):
                projectsGridToolBar = projectsLayout.cells("a").attachToolbar(emptyToolbar);
            projectsGridToolBar.attachEvent("onClick", function(id) { 
                switch (id){
                    case 'Add':{   
                        var newOrderWindow = createWindow(_("Nowe zamowienie"), 500, 450);
                        var newOrderForm = createForm(newProjectFormStruct, newOrderWindow);                                                                
                        var clientsCombo = newOrderForm.getCombo("client_id");
                        ajaxGet("api/clients", "", function(data){
                            clientsCombo.addOption(data.data);
                        });       
                        newOrderForm.attachEvent("onButtonClick", function(name){
                            if (name === 'save'){  
                                var newOrderData = newOrderForm.getFormData();
                                newOrderData.date_start = newOrderForm.getCalendar("date_start").getDate(true);                                
                                addOrder(newOrderData, projectsGrid); 
                                newOrderWindow.close();                                                
                            }
                        }); 
                    };break;
                    case 'Edit':{      
                        var editOrderWindow = createWindow(_("Edytuj zamowienie"), 480, 380);                            
                        var editOrderForm = createForm(newProjectFormStruct, editOrderWindow);                                
                        var orderData = projectsGrid.getRowData(projectsGrid.getSelectedRowId());
                        var clientsCombo = editOrderForm.getCombo("client_id");
                        ajaxGet("api/clients", "", function(data){
                            clientsCombo.addOption(data.data);                            
                        }); 
                        editOrderForm.setFormData(orderData);
                        editOrderForm.attachEvent("onButtonClick", function(name){
                            if (name === 'save'){                                 
                                var orderData = editOrderForm.getFormData();   
                                orderData.date_start = editOrderForm.getCalendar("date_start").getDate(true);                                                                              
                                editOrder(projectsGrid.getSelectedRowId(), orderData, projectsGrid);
                                editOrderWindow.close();
                            }
                        });                            
                    };break;   
                    case 'Del': {                                                                                                                                                                                                                                                   
                        var orderId = projectsGrid.getSelectedRowId();                            
                        if (orderId) {
                            var rowData = projectsGrid.getRowData(orderId);                                
                            if (rowData.hasopenworks != 0) {
                                dhtmlx.alert({
                                    title:_("Wiadomość"),
                                    text:_("Nie mozna usunąć zamowienie. \n\
                                            Juz sa zlecenia dla tego zamowienia.")
                                });                                            
                            } else { 
                                dhtmlx.confirm({
                                    title: _("Ostrożność"),                                    
                                    text: _("Czy na pewno chcesz usunąć?"),
                                    callback: function(result){
                                        if (result) {                                                                                    
                                            ajaxDelete("api/orders/" + orderId, "", function(data){
                                                if (data && data.success){                                                    
                                                    projectsGrid.deleteRow(orderId);
                                                } else {
                                                    dhtmlx.alert({
                                                        title:_("Wiadomość"),
                                                        text:_("Nie udało się usunąć!")
                                                    });
                                                }
                                            });   
                                        }
                                    }
                                });                                                                
                            }
                        } else {
                            dhtmlx.alert({
                                title:_("Wiadomość"),
                                text:_("Wybierz zamowienie, które chcesz usunąć!")
                            });
                        }                            
                    };break; 
                    case 'Redo': {
                        projectsGrid.fill("api/orders"); 
                    };break;
                }
            });                                 
            var projectsGrid = projectsLayout.cells("a").attachGrid({
                image_path:'codebase/imgs/',
                columns: [
                    {label: _("Kod"),              id: "kod",         type: "ro",   sort: "str", align: "left", width: 50},
                    {label: _("Imie"),             id: "name",        type: "ro",   sort: "str", align: "left", width: 150},
                    {label: _("Klient"),           id: "client_name", type: "ro",   sort: "str", align: "left", width: 150},                                                                                                
                    {label: _("Termin wykonania"), id: "num_week",    type: "ro",   sort: "str", align: "left", width: 50},                         
                    {id: "client_id"}, 
                    {id: "hasopenworks"},
                    {id: "date_start"}, 
                    {id: "description"}                     
                ]
            });
            projectsGrid.attachHeader('#text_filter,#text_filter,#select_filter');      
            projectsGrid.setColumnHidden(4,true);
            projectsGrid.setColumnHidden(5,true);
            projectsGrid.setColumnHidden(6,true);            
            projectsGrid.setColumnHidden(7,true);            
            projectsGrid.attachEvent("onRowSelect", function() {
                var id = projectsGrid.getSelectedRowId();
                historyGrid.fill(id);
                positionsGrid.fill(id);
            });              
            projectsGrid.attachEvent("onRowCreated", function(rId,rObj,rXml){
                var data = projectsGrid.getRowData(rId);
                if (data.hasopenworks != 0) {
                    projectsGrid.setRowColor(rId,"yellow");
                }
            });                 
            projectsGrid.fill("api/orders");                           
/**
 * B
 * 
 */		                                
            var projectsForm = projectsLayout.cells("b").attachForm(newProjectFormStruct);
            if (!userCanWrite) { projectsForm.hideItem('save'); }
            projectsForm.attachEvent("onButtonClick", function(name){
                if (name === 'save'){
                    var data = projectsForm.getFormData();   
                    data.date_start = projectsForm.getCalendar("date_start").getDate(true);
                    if (projectsGrid.getSelectedRowId()) {                                                                                                          
                        editOrder(projectsGrid.getSelectedRowId(), data, projectsGrid);
                    } else {                        
                        addOrder(data, projectsGrid);
                    }                        
                }
            });            
            var clientsCombo = projectsForm.getCombo("client_id");  
            ajaxGet("api/clients", '', function(data) {
                if (data.success && data.data) {
                    clientsCombo.addOption(data.data);                         
                }
            });                              
            var dateEndCombo = projectsForm.getCombo("num_week");
            if (dateEndCombo) {
                var numCurrentWeek = new Date().getWeekNumber();
                for (var i = 1; i <= 53; i++) {
                    dateEndCombo.addOption(i, "" + i);
                }
                dateEndCombo.attachEvent("onChange", function(value, text){
                    if (value < numCurrentWeek) {
                        if (!projectsForm.isItem("on_next_year")) {
                            projectsForm.addItem(null, {type: "label", name: "on_next_year", label: _("Na nastepny rok")}, null, 1);
                        }
                    } else {
                        projectsForm.removeItem("on_next_year");
                    }
                });  
            }  
            projectsForm.bind(projectsGrid);
/**
 * C
 */                                                            
            var projectsTabbar = projectsLayout.cells("c").attachTabbar({
                arrows_mode: "auto",
                tabs: [
                    {id: "positions", text: _("Pozycje"), selected: 1},                            
                    {id: "history", text: _("Historia")}                                
                ]
            }); 
                if (userCanWrite) {
                    positionsGridToolbar = projectsTabbar.tabs("positions").attachToolbar({
                            iconset: "awesome",
                            items: [
                                {id:"Add", type:"button",  text: _("Dodaj"),  img: "fa fa-plus-square"},
                                {id:"Edit", type:"button", text: _("Edytuj"), img: "fa fa-edit"},
                                {id:"Del",  type:"button",text: _("Usun"),   img: "fa fa-minus-square"},
                                {type: "separator", id: "sep3"},
                                {id: "Block",text: _("Blokuj"), type: "button", img: "fa fa-lock"},                            
                                {id: "UnBlock",text: _("Odblokuj"), type: "button", img: "fa fa-unlock"},                            
                                {type: "separator", id: "sep2"},
                                {id: "Redo", type: "button", text: _("Odśwież"), img: "fa fa-refresh"}
                            ]
                    });   
                } else {
                    positionsGridToolbar = projectsTabbar.tabs("positions").attachToolbar(emptyToolbar);
                }
                positionsGridToolbar.attachEvent("onClick", function(id) { 
                    switch (id) {
                        case 'Add': {
                            var orderId = projectsGrid.getSelectedRowId();                                                          
                            if (orderId) {
                                var order = projectsGrid.getRowData(orderId); 
                                var positionsWindow = createWindow(_("Nowa pozycja"), 350, 550);
                                var positionsForm = createForm(orderPositionFormStruct, positionsWindow);
                                positionsForm.setItemFocus("kod");
                                var productsCombo = positionsForm.getCombo("product_id");
                                var numWeekCombo = positionsForm.getCombo("num_week");
                                numWeekCombo.selectOption(numWeekCombo.getIndexByValue(order.num_week));
                                ajaxGet("api/products", '', function(data) {
                                    if (data.success && data.data) {
                                        productsCombo.addOption(data.data);                                    
                                    }
                                });
                                positionsForm.attachEvent("onButtonClick", function(name){
                                    if (name == 'save') {                                                     
                                        var data = positionsForm.getFormData();                                                                                                
                                        data.order_id = orderId;
                                        ajaxPost("api/positions", data, function(data){                                                   
                                            if (data.success && data.data) {
                                                positionsGrid.addRow(data.data.id, '');
                                                positionsGrid.setRowData(data.data.id, data.data);
                                                positionsGrid.callEvent("onGridReconstructed", []);
                                            } else {
                                                dhtmlx.alert({
                                                    title:_("Wiadomość"),
                                                    text:_("Błąd! Zmiany nie zostały zapisane")
                                                });
                                            }
                                        });                                                                                           
                                    }
                                });                                     
                            } else {
                                dhtmlx.message({
                                    title:_("Wiadomość"),
                                    type:"alert",
                                    text:_("Wybierz zamowienie!")
                                }); 
                            }
                        };break;
                        case 'Edit': {
                            var orderId    = projectsGrid.getSelectedRowId(); 
                            var order      = projectsGrid.getRowData(orderId);                                
                            var positionId = positionsGrid.getSelectedRowId();
                            if (positionId) {
                                var position = positionsGrid.getRowData(positionId);
                                var positionsWindow = createWindow(_("Edutyj pozycje"), 350, 550);
                                var positionsForm = createForm(orderPositionFormStruct, positionsWindow);                                    
                                positionsForm.setFormData(position);  
                                var productsCombo = positionsForm.getCombo("product_id");
                                ajaxGet("api/products", "", function(data){
                                    productsCombo.addOption(data.data);
                                    productsCombo.selectOption(productsCombo.getIndexByValue(position.product_id));
                                }); 
                                positionsForm.attachEvent("onButtonClick", function(name){
                                    if (name == 'save'){                                                        
                                        var data = positionsForm.getFormData();                                                                                            
                                        data.order_id = projectsGrid.getSelectedRowId();
                                        ajaxGet("api/positions/" + data.id + "/edit", data, function(data){
                                            if (data.success && data.data) {
                                                dhtmlx.alert({
                                                    title:_("Wiadomość"),
                                                    text:_("Zapisane")
                                                });
                                                positionsGrid.setRowData(data.data.id, data.data);
                                                positionsWindow.hide();                                                    
                                            } else {
                                                dhtmlx.alert({
                                                    title:_("Wiadomość"),
                                                    text:_("Błąd! Zmiany nie zostały zapisane")
                                                });                                                    
                                            }
                                        });                                            
                                    }
                                });                                    
                            } else {
                                dhtmlx.message({
                                    title:_("Wiadomość"),
                                    type:"alert",
                                    text:_("Wybierz pozycje!")
                                });
                            }                                    
                        };break;
                        case 'Del': {
                            var orderId    = projectsGrid.getSelectedRowId(); 
                            var order      = projectsGrid.getRowData(orderId);                                
                            var positionId = positionsGrid.getSelectedRowId();
                            if (positionId) {                                   
                                //ajaxGet("api/positions/list/beguntasks/" + positionId, "", function (data){
                                    var rowData = positionsGrid.getRowData(positionsGrid.getSelectedRowId());
                                    if (rowData.status) {
                                        dhtmlx.alert({
                                            title:_("Wiadomość"),
                                            text:_("Nie mozna usunąć pozycje. \n\
                                                    Juz sa zlecenia dla tej pozycji.")
                                        });                                            
                                    } else {
                                        dhtmlx.confirm({
                                            title: _("Ostrożność"),                                    
                                            text: _("Czy na pewno chcesz usunąć pozycje?"),
                                            callback: function(result){
                                                if (result) {                                
                                                    ajaxDelete("api/positions/" + positionId, "", function(data){
                                                        if (data && data.success) {
                                                            positionsGrid.deleteRow(positionId);
                                                        }
                                                    }); 
                                                }
                                            }
                                        });                                            
                                    }
                                //});
                            } else {
                                dhtmlx.alert({
                                    title:_("Wiadomość"),
                                    text:_("Wybierz pozycje, która chcesz usunąć!")
                                });
                            }                                    
                        };break;
                        case 'UnBlock':{
                            var data = positionsGrid.getRowData(positionsGrid.getSelectedRowId());
                            data.status = 0;
                            data.date_status = new Date();
                            ajaxGet("api/positions/" + data.id + "/edit", data, function(data){
                                if (data.success && data.data) {                            
                                    //positionsGrid.fill(projectsGrid.getSelectedRowId());
                                    positionsGrid.setRowData(data.data.id, data.data);
                                    positionsGrid.callEvent("onRowCreated", [data.id]);
                                }
                            });                                                        
                        };break;                         
                        case 'Block':{
                            var data = positionsGrid.getRowData(positionsGrid.getSelectedRowId());
                            data.status = 2;
                            data.date_status = new Date();
                            ajaxGet("api/positions/" + data.id + "/edit", data, function(data){
                                if (data.success && data.data) {                            
                                    positionsGrid.setRowData(data.data.id, data.data);
                                    positionsGrid.callEvent("onRowCreated", [data.id]);
                                }
                            });                         
                        };break;                              
                        case 'Redo': {
                            var orderId = projectsGrid.getSelectedRowId();
                            if (orderId) {
                                positionsGrid.fill(orderId);
                            }
                        };break;
                    };
                });                
                var positionsGrid = projectsTabbar.tabs("positions").attachGrid({
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
                    //inprogress
                    if (data.countWorks > 0) {
                        positionsGrid.setRowColor(rId,"yellow");
                    }
                    //blocked task
                    if (data.status == 2) {
                        positionsGrid.setRowColor(rId,"lightgray");
                    } 
                    //for producting
                    if (data.status == 1) {
                        positionsGrid.setRowColor(rId,"lightyellow");
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

                var historyGrid = projectsTabbar.tabs("history").attachGrid({
                    image_path:'codebase/imgs/',
                    columns: [
                        {label: _("Imie"), id: "name",       type: "ro", sort: "str", align: "left"},
                        {label: _("Opis"), id: "description",type: "ro", sort: "str", align: "left"},
                        {label: _("Data"), id: "created_at", type: "ro", sort: "str", align: "left"},
                        {id: "order_id"}
                    ]                   
                });     
                historyGrid.setColumnHidden(3,true);
                historyGrid.fill = function(id){
                    historyGrid.clearAll();
                    ajaxGet("api/orders/history/" + id, '', function(data){
                        if (data.data && data.success){                                
                            historyGrid.parse(data.data, "js");
                        }
                    });			
                };                                           
	}	
}
var nowDate = getNowDate();
console.log(nowDate);
newProjectFormStruct = [          
        {type: "settings", position: "label-left", labelWidth: 110, inputWidth: 160},   	        
        {type: "combo", name: "client_id", required: true, label: _("Klient"), options: []},		
        {type: "input", name: "kod",       required: true, label: _("Kod zamowienia")},
        {type: "input", name: "name",      required: true, label: _("Zamowienie"),                           
           note: {text: _("Dodaj imie zamowienia. Jest obowiazkowe.")}},
        {type: "input", name: "description", label: _("Opis"), rows: 3,
           note: {text: _("Dodaj opis zamowienia. Obowiazkowe.")}},
        {type: "calendar", name: "date_start",  label: _("Data zamowienia"), 
            required: true, dateFormat: "%Y-%m-%d", enableTodayButton: true,
            value: nowDate,
            note: {text: _("Data poczatku wykonania zamowienia. Jest obowiazkowe.")}},                       
        {type: "combo", name: "num_week", required: true, label: _("Termin wykonania"), 
            options:[],
            note: {text: _("Numer tygodnia kiedy zamowienie musi byc zakonczone. Jest obowiazkowe.")}},
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
        note: {text: _("Numer tygodnia kiedy produkt musi byc zakonczone. Jest obowiazkowe.")}},
    {type: "block", blockOffset: 0, position: "laabel-left", list: [
        {type: "button", name: "save",   value: "Zapisz", offsetTop:18},
        {type: "newcolumn"},
        {type:"button", name:"cancel", value:"Anuluj", offsetTop:18}
    ]}                    
]; 

function addOrder(data, grid) {                                             
    ajaxPost("api/orders", data, function(data){
        if (data && data.success) {
            grid.addRow(data.data.id, '');
            grid.setRowData(data.data.id, data.data);
            dhtmlx.alert({
                title:_("Wiadomość"),
                text:_("Zapisane")
            });                        
        } else {
            dhtmlx.alert({
                title:_("Wiadomość"),
                text:_("Błąd! Zmiany nie zostały zapisane")
            });
        }
    });    
}

function editOrder(id, data, grid) {
    ajaxGet("api/orders/" + id + "/edit", data, function(data){                                            
         if (data && data.success) {
            grid.setRowData(data.data.id, data.data);
            dhtmlx.alert({
                title:_("Wiadomość"),
                text:_("Zapisane")
            });                                                
        } else {
            dhtmlx.alert({
                title:_("Wiadomość"),
                text:_("Błąd! Zmiany nie zostały zapisane")
            });
        }
    });   
}

//function updateChart(id) {
//	if (projectsTabbar.getActiveTab() != "stats") return;
//	if (id == null) id = projectsGrid.getSelectedRowId();
//	if (id == projectsChartId || id == null) return;
//	// init chart
//	if (projectsChart == null) {
//		projectsChart = projectsTabbar.tabs("stats").attachChart({
//			view:	  "bar",
//			value:    "#sales#",
//			gradient: "rising",
//			radius:   0,
//			legend: {
//				width:	  75,
//				align:	  "right",
//				valign:	  "middle",
//				template: "#month#"
//			}
//		});
//	} else {
//		projectsChart.clearAll();
//	}
//	projectsChart.load(A.server+"chart/"+id+".json?r="+new Date().getTime(),"json");
//	// remember loaded project
//	projectsChartId = id;
//}

window.dhx4.attachEvent("onSidebarSelect", function(id, cell){
	if (id == "projects") {
            window.history.pushState({'page_id': id}, null, '#projects');
	    projectsInit(cell);
	}
});