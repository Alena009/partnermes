var projectsGrid;
var projectsLayout;
var projectsTabbar;
var projectsChart;
var projectsChartId;
var projectsForm;

function projectsInit(cell) {	
	if (projectsLayout == null) {		
		var projectsLayout = cell.attachLayout("3J");
		projectsLayout.cells("a").hideHeader();
		projectsLayout.cells("b").hideHeader();
                projectsLayout.cells("b").setCollapsedText(_("Informacja o zamowieniu"));
		projectsLayout.cells("c").hideHeader();
                projectsLayout.cells("c").setCollapsedText(_("Pozycji"));
		projectsLayout.cells("b").setWidth(330);
		projectsLayout.cells("c").setHeight(350);
		projectsLayout.setAutoSize("a;c", "a;b");

		var projectsGridToolBar = projectsLayout.cells("a").attachToolbar({
                    iconset: "awesome",
                    items: [
                        {type: "text", id: "title", text: _("Zamowienia")},                                
                        {type: "spacer"},
//                                {type: "text", id: "show_records", text: _("Ilosc wyswietlonych wpisow:")},				
//                                {type: "buttonSelect", id: "amount_show", text: _("10"), options:[
//                                            {id: "10",  type: "obj", text: _("Ostatnie 10")},
//                                            {id: "20",  type: "obj", text: _("Ostatnie 20")},
//                                            {id: "50",  type: "obj", text: _("Ostatnie 50")},
//                                            {id: "all", type: "obj", text: _("Wszystkie")}		
//                                    ]},                                
//                                {type: "separator",   id: "sep"},
                        {type: "text",        id: "find",   text: _("Find:")},				
                        {type: "buttonInput", id: "szukaj", text: _(""), width: 100},
                        {type: "separator",   id: "sep2"},                                
                        {id: "Add",  type: "button", img: "fa fa-plus-square "},
                        {id: "Edit", type: "button", img: "fa fa-edit"},
                        {id: "Del",  type: "button", img: "fa fa-minus-square"}
                    ]
		});        
//                projectsGridToolBar.attachEvent("onButtonSelectHide", function(id){
//                    var amountRecords = projectsGridToolBar.getListOptionSelected("amount_show");
//                    projectsGridToolBar.setItemText("amount_show", amountRecords);
//                    if (amountRecords == "all") {amountRecords = 0};
//                    projectsGrid.fill(amountRecords);                  
//                });
                var newProjectFormStruct = [
                    {type:"fieldset",  offsetTop:0, label:_("Zamowienie"), list:[
                        {type: "settings", position: "label-left", labelWidth: 110, inputWidth: 160},
                        {type: "combo", name: "client_id", required: true, label: _("Klient"), options: []},		
                        {type: "input", name: "kod",       required: true, label: _("Kod zamowienia")},
                        {type: "input", name: "name",      required: true, label: _("Zamowienie"),                           
                           note: {text: _("Dodaj imie zamowienia. Jest obowiazkowe.")}},
                        {type: "input", name: "description", label: _("Opis"), rows: 3,
                           note: {text: _("Dodaj opis zamowienia. Nie jest obowiazkowe.")}},
                        {type: "calendar", name: "date_start",  label: _("Data zamowienia"), 
                            required: true, dateFormat: "%Y-%m-%d", enableTodayButton: true,
                            note: {text: _("Data poczatku wykonania zamowienia. Jest obowiazkowe.")}},                       
                        {type: "combo", name: "num_week", required: true, label: _("Termin wykonania"), 
                            options:[],
                            note: {text: _("Numer tygodnia kiedy zamowienie musi byc zakonczone. Jest obowiazkowe.")}},
                        {type: "block", blockOffset: 0, position: "label-left", list: [
                            {type: "button", name: "save",   value: "Zapisz", offsetTop:18},
                            {type: "newcolumn"},
                            {type:"button", name:"cancel", value:"Anuluj", offsetTop:18}
                        ]}	
                    ]}
		];
                projectsGridToolBar.attachEvent("onClick", function(id) { 
                    switch (id){
                        case 'Add':{   
                            var newOrderWindow = createWindow(_("Nowe zamowienie"), 500, 380);
                            var newOrderForm = createForm(newProjectFormStruct, newOrderWindow);                                                                
                            var clientsCombo = newOrderForm.getCombo("client_id");
                            ajaxGet("api/clients", "", function(data){
                                clientsCombo.addOption(data.data);
                            });                                       
                            newOrderForm.attachEvent("onButtonClick", function(name){
                                switch (name){
                                    case 'save':{    
                                        var data = newOrderForm.getFormData();
                                        data.date_start = newOrderForm.getCalendar("date_start").getDate(true);                                         
                                        ajaxPost("api/orders", data, function(data){
                                            if (data && data.success) {
                                                dhtmlx.alert({
                                                    title:_("Wiadomość"),
                                                    text:_("Zapisane")
                                                });
                                                projectsGrid.fill();                                                
                                                newOrderWindow.hide();                                                
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
                        };break;
                        case 'Edit':{      
                            var editOrderWindow = createWindow(_("Edytuj zamowienie"), 480, 380);                            
                            var editOrderForm = createForm(newProjectFormStruct, editOrderWindow);                                
                            var rowData = projectsGrid.getRowData(projectsGrid.getSelectedRowId());
                            editOrderForm.bind(projectsGrid);
                            editOrderForm.unbind(projectsGrid);
                            var clientsCombo = editOrderForm.getCombo("client_id");
                            ajaxGet("api/clients", "", function(data){
                                clientsCombo.addOption(data.data);
                                clientsCombo.selectOption(clientsCombo.getIndexByValue(rowData.client_id));
                            });                           
                            editOrderForm.attachEvent("onButtonClick", function(name){
                                switch (name){
                                    case 'save':{                                                           
                                        var data = editOrderForm.getFormData();   
                                        data.date_start = editOrderForm.getCalendar("date_start").getDate(true);                                                                              
                                        ajaxGet("api/orders/" + data.id + "/edit", data, function(data){                                            
                                            if (data && data.success) {
                                                dhtmlx.alert({
                                                    title:_("Wiadomość"),
                                                    text:_("Zapisane")
                                                });
                                                projectsGrid.fill();                                                
                                                editOrderWindow.hide();                                                
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
                        };break;   
                        case 'Del': {                            
                            var orderId = projectsGrid.getSelectedRowId();
                            if (orderId) {
                                ajaxGet("api/orders/beguntasks/" + orderId, "", function (data){
                                    if (data && data.success) {
                                        dhtmlx.alert({
                                            title:_("Wiadomość"),
                                            text:_("Nie mozna usunąć zamowienie. \n\
                                                    Juz sa zlecenia dla tego zamowienia.")
                                        });                                            
                                    } else {                                
                                        dhtmlx.confirm({
                                            title: _("Ostrożność"),                                    
                                            text: _("Czy na pewno chcesz usunąć zamowienie?"),
                                            callback: function(result){
                                                if (result) {                                
                                                    ajaxDelete("api/orders/" + orderId, "", function(data){
                                                        if (data.success) {
                                                            projectsGrid.deleteRow(orderId);
                                                        }
                                                    }); 
                                                }
                                            }
                                        });
                                    }
                                });
                            } else {
                                dhtmlx.alert({
                                    title:_("Wiadomość"),
                                    text:_("Wybierz zamowienie, które chcesz usunąć!")
                                });
                            }                            
                        };break; 
                    }
                });                 
                
		var projectsGrid = projectsLayout.cells("a").attachGrid({
                    image_path:'codebase/imgs/',
	            columns: [
                        {label: _("Kod"),              id: "kod",         type: "ed",   sort: "str", align: "left", width: 50},
                        {label: _("Imie"),             id: "name",        type: "ed",   sort: "str", align: "left", width: 50},
                        {label: _("Klient"),           id: "client_name", type: "ro",   sort: "str", align: "left", width: 150},                                                                                                
                        {label: _("Termin wykonania"), id: "num_week",    type: "ro",   sort: "str", align: "left", width: 50},                         
                        {id: "client_id"}
                    ],
                    multiline: true
                });
                projectsGrid.attachHeader('#text_filter,#text_filter,#select_filter');      
                projectsGrid.setColumnHidden(4,true);
                projectsGrid.enableValidation(true);
                projectsGrid.setColValidators(["NotEmpty","NotEmpty","NotEmpty","MotEmpty"]);
                var searchElem = projectsGridToolBar.getInput('szukaj');
                projectsGrid.makeFilter(searchElem, 0, true);                
                projectsGrid.filterByAll();
//                var clientsCombo = projectsGrid.getCombo(2);                
//                ajaxGet("api/clients", '', function(data) {
//                    if (data.success && data.data) {
//                        data.data.forEach(function(client){
//                            clientsCombo.put(client.id, client.name);
//                        });
//                    }
//                });                
		projectsGrid.attachEvent("onRowSelect", function() {
                    var id = projectsGrid.getSelectedRowId();
                    historyGrid.filterBy(3,id);
                    positionsGrid.filterBy(8,id);
                });
		projectsGrid.attachEvent("onRowInserted", function(r, index){
		    projectsGrid.setCellTextStyle(projectsGrid.getRowId(index), projectsGrid.getColIndexById("project"), "font-weight:bold;");
		});                
//		projectsGrid.load(A.server+"projects.xml?type="+A.deviceType, function(){
//			projectsGrid.selectRow(0, true);
//		});
                //projectsGrid.load("api/orders");
                var dpProjectsGrid = new dataProcessor("api/orders", "js");                
                dpProjectsGrid.init(projectsGrid);
                dpProjectsGrid.enableDataNames(true);
                dpProjectsGrid.setTransactionMode("REST");
                dpProjectsGrid.enablePartialDataSend(true);
                dpProjectsGrid.enableDebug(true);
                dpProjectsGrid.setUpdateMode("row", true);
                dpProjectsGrid.attachEvent("onBeforeDataSending", function(id, state, data){
                    data.id = id;
                    ajaxGet("api/orders/" + id + "/edit", data, function(data){
                        if (data.success) {
                            projectsGrid.setRowTextNormal(id);
                        }
                    });
                });                
                projectsGrid.fill = function(){
                    projectsGrid.clearAll();
		    ajaxGet("api/orders", '', function(data){
		        if (data.data && data.success){                           
                            projectsGrid.parse(data.data, "js");
                        }
                    });			
		};
                projectsGrid.fill();  
                          
		                
                projectFormToolBar = projectsLayout.cells("b").attachToolbar({
			iconset: "awesome",
			items: [
				{type: "text", id: "title", text: _("Informacja o zamowieniu")},
				{type: "spacer"},				
				{id: "Hide", type: "button", img: "fa fa-arrow-right"}
			]
		});   
                projectFormToolBar.attachEvent("onClick", function(id) { 
                    if (id == 'Hide') {
                        projectsLayout.cells("b").collapse();                        
                    }                    
                }); 
                
		var projectFormStruct = [
                    {type: "settings", position: "label-left", labelWidth: 110, inputWidth: 160},
                    {type: "input", name: "client_name", label: _("Klient"),              readonly: true},		
                    {type: "input", name: "kod",         label: _("Kod zamowienia"),      readonly: true},
                    {type: "input", name: "name",        label: _("Zamowienie"),          readonly: true,
                       tooltip: _("Imie zamowienia"),    info: true},
                    {type: "input", name: "description", label: _("Opis"), rows: 3,       readonly: true},
                    {type: "calendar", name: "date_start",  label: _("Data zamowienia"),  readonly: true,
                        dateFormat: "%Y-%m-%d"},
                    {type: "calendar", name: "date_end",    label: _("Termin wykonania"), readonly: true,
                        dateFormat: "%Y-%m-%d"},
                    {type: "input", name: "status", label: _("Status zamowienia"),        readonly: true}		
		];                 
                var projectsForm = projectsLayout.cells("b").attachForm(projectFormStruct);            
		projectsForm.bind(projectsGrid);   
                                                            
                positionsLayoutToolBar = projectsLayout.cells("c").attachToolbar({
			iconset: "awesome",
			items: [
				{type: "text", id: "title", text: _("Pozycji")},
				{type: "spacer"},				
				{id: "Hide", type: "button", img: "fa fa-arrow-down"}
			]
		});   
                positionsLayoutToolBar.attachEvent("onClick", function(id) { 
                    if (id == 'Hide') {
                        projectsLayout.cells("c").collapse();
                    }                    
                });                              
		var projectsTabbar = projectsLayout.cells("c").attachTabbar({
			arrows_mode: "auto",
			tabs: [
				{id: "positions", text: _("Pozycji"), selected: 1},
                                {id: "history", text: _("Historija")}                                
			]
		});  
                    positionsGridMenu = projectsTabbar.tabs("positions").attachMenu({
                            iconset: "awesome",
                            items: [
                                {id:"Add",  text: _("Dodaj"),  img: "fa fa-plus-square"},
                                {id:"Edit", text: _("Edytuj"), img: "fa fa-edit"},
                                {id:"Del",  text: _("Usun"),   img: "fa fa-minus-square"}
                            ]
                    });                 
                    positionsGridMenu.attachEvent("onClick", function(id) { 
                        switch (id) {
                            case 'Add': {
                                var orderId = projectsGrid.getSelectedRowId();                                                          
                                if (orderId) {
                                    var order = projectsGrid.getRowData(orderId); 
                                    var positionsWindow = createWindow(_("Nowa pozycja"), 350, 350);
                                    var positionsForm = createForm(orderPositionFormStruct, 
                                        positionsWindow);
                                    positionsForm.setItemFocus("kod");
                                    var productsCombo = positionsForm.getCombo("product_id");                
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
                                                    positionsGrid.fill(projectsGrid.getSelectedRowId());
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
                                    var positionsWindow = createWindow(_("Edutyj pozycje"), 350, 350);
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
                                                    positionsGrid.fill(projectsGrid.getSelectedRowId());
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
                                    ajaxGet("api/positions/list/beguntasks/" + positionId, "", function (data){
                                        if (data && data.success) {
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
                                                                positionsGrid.fill(orderId);
                                                            }
                                                        }); 
                                                    }
                                                }
                                            });                                            
                                        }
                                    });
                                } else {
                                    dhtmlx.alert({
                                        title:_("Wiadomość"),
                                        text:_("Wybierz pozycje, która chcesz usunąć!")
                                    });
                                }                                    
                            };break;
                        };
                    });                
                    var positionsGrid = projectsTabbar.tabs("positions").attachGrid({
                        image_path:'codebase/imgs/',
                        columns: [
                            {label: _("Kod pozycji"), id: "kod",          type: "ed", sort: "str", align: "left", width: 50},
                            {label: _("Produkt"),     id: "product_name", type: "ro", sort: "str", align: "left", width: 150},
                            {label: _("Ilosc"),       id: "amount",       type: "ed", sort: "str", align: "left", width: 50},
                            {label: _("Cena"),        id: "price",        type: "ed", sort: "str", align: "left", width: 50},
                            {label: _("Szczegóły"),   id: "description",  type: "ed", sort: "str", align: "left", width: 100},                        
                            {label: _("Data dostawy"),id: "num_week",     type: "ro", sort: "str", align: "left", width: 100}, 
                            {id: "product_id"},
                            {id: "id"},
                            {id: "order_id"}
                        ],
                        multiselect: true                    
                    });  
                    positionsGrid.setColumnHidden(6,true);
                    positionsGrid.setColumnHidden(7,true);
                    positionsGrid.setColumnHidden(8,true);
                    positionsGrid.attachHeader("#select_filter,#text_filter");
                    positionsGrid.setColValidators(["NotEmpty","NotEmpty","NotEmpty"]);
                    positionsGrid.attachFooter(
                        [_("Ilosc produktow: "),"#cspan","#stat_total",""],
                        ["text-align:right;","text-align:center"]
                    );                       
                    positionsGrid.attachFooter(
                        [_("Ilosc pozycji: "),"#cspan","","#stat_count"],
                        ["text-align:right;","text-align:center"]
                    );              
                    positionsGrid._in_header_stat_total_sum=function(tag,index,data){//'stat_rowcount'-counter name
                        var calc=function(){                       // function used for calculations
                            var total_sum = 0;
                            var data;
                            this.forEachRow(function(id){
                                data = this.getRowData(id);
                                total_sum = total_sum + (data.price * data.amount); 
                            });
                            return total_sum;
                        };
                        this._stat_in_header(tag,calc,index,data); // default statistics handler processor
                    };   
                    positionsGrid.attachFooter(
                        [_("Suma: "),"#cspan","","#stat_total_sum"],
                        ["text-align:right;","text-align:center"]
                    );                     
                    var dpPositionsGrid = new dataProcessor("api/positions", "js");                
                    dpPositionsGrid.init(positionsGrid);
                    dpPositionsGrid.enableDataNames(true);
                    dpPositionsGrid.setTransactionMode("REST");
                    dpPositionsGrid.enablePartialDataSend(true);
                    dpPositionsGrid.enableDebug(true);
                    dpPositionsGrid.setUpdateMode("row", true);
                    dpPositionsGrid.attachEvent("onBeforeDataSending", function(id, state, data){
                        data.id = id;
                        ajaxGet("api/positions/" + id + "/edit", data, function(data){                                                            
                            console.log(data);
                        });
                    });               
                    positionsGrid.fill = function(){
                        positionsGrid.clearAll();
                        ajaxGet("api/positions", '', function(data){
                            if (data.data && data.success){			    
                                positionsGrid.parse(data.data, "js");
                            }
                        });			
                    };
                    positionsGrid.fill();
  
                var historyGrid = projectsTabbar.tabs("history").attachGrid({
                    image_path:'codebase/imgs/',
	            columns: [
                        {label: _("Imie"), id: "name",       type: "ro", sort: "str", align: "left"},
                        {label: _("Opis"), id: "description",type: "ro", sort: "str", align: "left"},
                        {label: _("Data"), id: "created_at", type: "ro", sort: "str", align: "left"},
                        {id: "order_id"}
                    ],
			multiselect: true                    
                });     
                historyGrid.setColumnHidden(3,true);
                historyGrid.fill = function(){
		    ajaxGet("api/history", '', function(data){
		        if (data.data && data.success){			    
                            historyGrid.clearAll();
                            historyGrid.parse(data.data, "js");
                        }
                    });			
		}; 
                historyGrid.fill();
                
                var orderPositionFormStruct = [
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
	}	
}

function updateChart(id) {
	if (projectsTabbar.getActiveTab() != "stats") return;
	if (id == null) id = projectsGrid.getSelectedRowId();
	if (id == projectsChartId || id == null) return;
	// init chart
	if (projectsChart == null) {
		projectsChart = projectsTabbar.tabs("stats").attachChart({
			view:	  "bar",
			value:    "#sales#",
			gradient: "rising",
			radius:   0,
			legend: {
				width:	  75,
				align:	  "right",
				valign:	  "middle",
				template: "#month#"
			}
		});
	} else {
		projectsChart.clearAll();
	}
	projectsChart.load(A.server+"chart/"+id+".json?r="+new Date().getTime(),"json");
	// remember loaded project
	projectsChartId = id;
}

function projectsFillForm(id) {
	// update form
	var data = projectsForm.getFormData();
	for (var a in data) {
		var index = projectsGrid.getColIndexById(a);
		if (index != null && index >=0) data[a] = String(projectsGrid.cells(id, index).getValue()).replace(/\&amp;?/gi,"&");
	}
	projectsForm.setFormData(data);
	// update chart
	updateChart(id);
}

window.dhx4.attachEvent("onSidebarSelect", function(id, cell){
	if (id == "projects") {
            window.history.pushState({'page_id': id}, null, '#projects');
	    projectsInit(cell);
	}
});