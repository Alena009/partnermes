var projectsGrid;
var projectsLayout;
var projectsTabbar;
var projectsChart;
var projectsChartId;
var projectsForm;

function projectsInit(cell) {
	
	if (projectsLayout == null) {
		
		// init layout
		var projectsLayout = cell.attachLayout("3J");
		projectsLayout.cells("a").hideHeader();
		projectsLayout.cells("b").hideHeader();
                projectsLayout.cells("b").setCollapsedText(_("Informacja o zamowieniu"));
		projectsLayout.cells("c").hideHeader();
                projectsLayout.cells("c").setCollapsedText(_("Pozycji"));
		projectsLayout.cells("b").setWidth(330);
		projectsLayout.cells("c").setHeight(350);
		projectsLayout.setAutoSize("a;c", "a;b");
		
		// attach grid
		var projectsGrid = projectsLayout.cells("a").attachGrid({
                    image_path:'codebase/imgs/',
	            columns: [{
                            label: _("Kod"),
                            id: "kod",
                            type: "ed", 
                            sort: "str", 
                            align: "left"
                        },
                        {
                            label: _("Imie"),
                            id: "name", 
                            type: "ed", 
                            sort: "str", 
                            align: "left"
                        },
                        {
                            label: _("Klient"),
                            id: "client_name",
                            type: "coro", 
                            sort: "str", 
                            align: "left"
                        },                                                                                                
                        {
                            label: _("Termin wykonania"),
                            id: "date_end",
                            type: "ed", 
                            sort: "str",	
                            align: "left"
                        }, 
                        {
                            id: "client_id"
                        }
                    ],
                    multiline: true
                });
                projectsGrid.attachHeader('#select_filter,#text_filter,#select_filter');      
                projectsGrid.setColumnHidden(4,true);

                projectsGrid.enableValidation(true);
                projectsGrid.enableMultiline(true);
                projectsGrid.setColValidators(["NotEmpty","NotEmpty","NotEmpty","ValidDate"]);
                
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
                            console.log(data);
                        }
                    });
                });                
                projectsGrid.fill = function(amount){
		    ajaxGet("api/orders/list/" + amount, '', function(data){
		        if (data.data && data.success){
                            projectsGrid.clearAll();
                            projectsGrid.parse(data.data, "js");
                        }
                    });			
		};
                projectsGrid.fill(10);                
                var clientsCombo = projectsGrid.getCombo(2);                
                ajaxGet("api/clients", '', function(data) {
                    if (data.success && data.data) {
                        data.data.forEach(function(client){
                            clientsCombo.put(client.id, client.name);
                        });
                    }
                });            
		projectsGrid.attachEvent("onRowSelect", function() {
                    var selectedId = projectsGrid.getSelectedRowId();
                    historyGrid.fill(selectedId);
                    positionsGrid.fill(selectedId);
                });
		projectsGrid.attachEvent("onRowInserted", function(r, index){
		    projectsGrid.setCellTextStyle(projectsGrid.getRowId(index), projectsGrid.getColIndexById("project"), "font-weight:bold;");
		});

		var newProjectFormStruct = [
                    {type:"fieldset",  offsetTop:0, label:_("Zamowienie"), list:[
                        {type: "settings", position: "label-left", labelWidth: 110, inputWidth: 160},
                        //{type: "container", name: "photo", label: "", inputWidth: 160, inputHeight: 160, offsetTop: 20, offsetLeft: 65},
                        //{type: "input", name: "date_end",     label: "Due date", offsetTop: 20},
                        {type: "combo", name: "client_id", required: true, label: _("Klient"), options: []},		
                        {type: "input", name: "kod",       required: true,  label: _("Kod zamowienia")},
                        {type: "input", name: "name",        label: _("Zamowienie"),
                           tooltip: _("Imie zamowienia"), required: true, info: true, 
                           note: {text: _("Dodaj imie zamowienia. Jest obowiazkowe.")}},
                        {type: "input", name: "description", label: _("Opis"),
                           rows: 3,
                           note: {text: _("Dodaj opis zamowienia. Nie jest obowiazkowe.")}},
                        {type: "calendar", name: "date_start",  label: _("Data zamowienia"), 
                            required: true, dateFormat: "%Y-%m-%d", enableTodayButton: true,
                            note: {text: _("Data poczatku wykonania zamowienia. Jest obowiazkowe.")}},
                        {type: "calendar", name: "date_end",    label: _("Termin wykonania"), 
                            required: true, dateFormat: "%Y-%m-%d", enableTodayButton: true,
                            note: {text: _("Data kiedy zamowienie musi byc zakonczone. Jest obowiazkowe.")}},
                        {type: "block", blockOffset: 0, position: "label-left", list: [
                            {type: "button", name: "save",   value: "Zapisz", offsetTop:18},
                            {type: "newcolumn"},
                            {type:"button", name:"cancel", value:"Anuluj", offsetTop:18}
                        ]}	
                    ]}
		];                
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
                    //{type: "container", name: "photo", label: "", inputWidth: 160, inputHeight: 160, offsetTop: 20, offsetLeft: 65},
                    //{type: "input", name: "date_end",     label: "Due date", offsetTop: 20},
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
//		projectsForm.getContainer("photo").innerHTML = "<img src='imgs/projects/project.png' border='0' class='form_photo'>";
//		projectsForm.setSizes = projectsForm.centerForm;
//		projectsForm.setSizes();             
		projectsForm.bind(projectsGrid);   
                
		var projectsGridToolBar = projectsLayout.cells("a").attachToolbar({
			iconset: "awesome",
			items: [
				{type: "text", id: "title", text: _("Zamowienia")},                                
                                {type: "spacer"},
                                {type: "text", id: "show_records", text: _("Ilosc wyswietlonych wpisow:")},				
                                {type: "buttonSelect", id: "amount_show", text: _("10"), options:[
                                            {id: "10",  type: "obj", text: _("Ostatnie 10")},
                                            {id: "20",  type: "obj", text: _("Ostatnie 20")},
                                            {id: "50",  type: "obj", text: _("Ostatnie 50")},
                                            {id: "all", type: "obj", text: _("Wszystkie")}		
                                    ]},                                
                                {type: "separator",   id: "sep"},
				{type: "text",        id: "find",   text: _("Find:")},				
				{type: "buttonInput", id: "szukaj", text: _(""), width: 100},
				{type: "separator",   id: "sep2"},                                
				{id: "Add",  type: "button", img: "fa fa-plus-square "},
				{id: "Edit", type: "button", img: "fa fa-edit"},
				{id: "Del",  type: "button", img: "fa fa-minus-square"}
			]
		});
                /**
                 * Selecting amount of visible records in the projectGrid table.
                 * There is a select button on a projectsGridToolBar that allows 
                 * to select how many records we want to load to the projects grid.
                 * 
                 */                
                projectsGridToolBar.attachEvent("onButtonSelectHide", function(id){
                    var amountRecords = projectsGridToolBar.getListOptionSelected("amount_show");
                    projectsGridToolBar.setItemText("amount_show", amountRecords);
                    if (amountRecords == "all") {amountRecords = 0};
                    projectsGrid.fill(amountRecords);                  
                });
                projectsGridToolBar.attachEvent("onClick", function(id) { 
                    switch (id){
                        case 'Add':{   
                                var newOrderForm = createWindowWithForm(newProjectFormStruct, 
                                                                        _("Nowe zamowienie"), 480, 380);                                                                
                                var clientsCombo = newOrderForm.getCombo("client_id");
                                ajaxGet("api/clients", "", function(data){
                                    clientsCombo.addOption(data.data);
                                });
                                clientsCombo.enableFilteringMode(true);
                                newOrderForm.clear();                                        
                                newOrderForm.attachEvent("onButtonClick", function(name){
                                    switch (name){
                                        case 'save':{    
                                            //newOrderForm.validate();
                                            var data = newOrderForm.getFormData(); 
                                            
                                            data.date_start = newOrderForm.getCalendar("date_start").getDate(true); 
                                            data.date_end   = newOrderForm.getCalendar("date_end").getDate(true); 
                                            ajaxPost("api/orders", data, function(data){
                                                console.log(data.data);
                                                projectsGrid.fill(10);
                                                projectsGrid.selectRowById(data.data.id);
                                            });                

                                        };break;                                        
                                    }
                                }); 
                        };break;
                        case 'Edit':{      
                            var editOrderForm = createWindowWithForm(newProjectFormStruct, _("Edytuj zamowienie"), 480, 380);                                
                            var clientsCombo = editOrderForm.getCombo("client_id");
                            ajaxGet("api/clients", "", function(data){
                                clientsCombo.addOption(data.data);
                            });
                            var rowData = projectsGrid.getRowData(projectsGrid.getSelectedRowId());
                            editOrderForm.bind(projectsGrid);     
                            editOrderForm.unbind(projectsGrid);                            
                            clientsCombo.setComboText(rowData.client_name);
                            clientsCombo.setComboValue(rowData.client_id);                            
                            editOrderForm.attachEvent("onButtonClick", function(name){
                                switch (name){
                                    case 'save':{                                                           
                                        var data = editOrderForm.getFormData();   
                                        console.log(data);
                                        data.date_start = editOrderForm.getCalendar("date_start").getDate(true); 
                                        data.date_end   = editOrderForm.getCalendar("date_end").getDate(true);
                                        data.client_id  = clientsCombo.getSelectedValue();
                                        ajaxGet("api/orders/" + data.id + "/edit", data, function(data){
                                            projectsGrid.fill(10);
                                            console.log(data.data);
                                        });
                                    };break;
                                }
                            });                            
                        };break;   
                        case 'Del': {                            
                            var orderId = projectsGrid.getSelectedRowId();
                            if (orderId) {
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
                            } else {
                                dhtmlx.alert({
                                    title:_("Wiadomość"),
                                    text:_("Wybierz zamowienie, które chcesz usunąć!")
                                });
                            }                            
                        };break; 
                    }
                });               
               
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
		// attach tabbar
		var projectsTabbar = projectsLayout.cells("c").attachTabbar({
			arrows_mode: "auto",
			tabs: [
				{id: "positions", text: _("Pozycji"), selected: 1},
                                {id: "history", text: _("Historija")}                                
			]
		});                
                var positionsGrid = projectsTabbar.tabs("positions").attachGrid({
                    image_path:'codebase/imgs/',
	            columns: [
                        {
                            label: _("Kod pozycji"),                           
                            id: "kod",
                            type: "ed", 
                            sort: "str", 
                            align: "left",
                            width: 50                            
                        },
                        {
                            label: _("Produkt"),                            
                            id: "product_name",
                            type: "ro", 
                            sort: "str", 
                            align: "left",
                            width: 150 
                        },
                        {
                            label: _("Ilosc"),
                            id: "amount",                             
                            type: "ed", 
                            sort: "str", 
                            align: "left",
                            width: 50 
                        },
                        {
                            label: _("Cena"),
                            id: "price",                             
                            type: "ed", 
                            sort: "str", 
                            align: "left",
                            width: 50 
                        },
                        {
                            label: _("Data dostawy"),
                            id: "date_delivery",                             
                            type: "ed", 
                            sort: "str", 
                            align: "left",
                            width: 50 
                        }                        
                    ],
			multiselect: true                    
                });  
                positionsGrid.attachHeader("#select_filter,#text_filter,,,#text_filter");
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
		positionsGrid.setColValidators(["NotEmpty","NotEmpty","NotEmpty"]);
                positionsGrid.enableMultiline(true);
                positionsGrid.enableColumnAutoSize(true);
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
                positionsGrid.fill = function(orderId){
                    positionsGrid.clearAll();
		    ajaxGet("api/orders/positions/" + orderId, '', function(data){
		        if (data.data && data.success){			    
                            positionsGrid.clearAll();
                            positionsGrid.parse(data.data, "js");
                        }
                    });			
		}; 
               
//                var positionsForm = positionsLayout.cells("b").attachForm(orderPositionFormStruct);
//                positionsForm.bind(positionsGrid);                
//                positionsForm.setSizes = positionsForm.centerForm;
//                positionsForm.attachEvent("onButtonClick", function(name){
//                    switch (name){
//                            case 'save':{                                                           
//                                var data = positionsForm.getFormData();
//                                var dd = positionsForm.getCalendar("date_delivery");
//                                var order_id = projectsGrid.getSelectedRowId();
//                                data.date_delivery = dd.getDate(true); 
//                                data.order_id = order_id;
//                                var selectedPositionId = positionsGrid.getSelectedRowId();
//                                if (selectedPositionId) {
//                                    ajaxGet("api/positions/" + selectedPositionId + "/edit", data, function(data){
//                                        if (data.success && data.data) {
//                                            positionsGrid.fill(order_id);
//                                        }
//                                    });                                 
//                                } else {
//                                    ajaxPost("api/positions/", data, function(data){
//                                        if (data.success && data.data) {
//                                            positionsGrid.fill(order_id);
//                                        }
//                                    });  
//                                } 
//                            };break;
//                            case 'cancel':{
//
//                            };break;
//                        }
//                });
//                var productsCombo = positionsForm.getCombo("product_id");                
//                ajaxGet("api/products", '', function(data) {
//                    if (data.success && data.data) {
//                        productsCombo.addOption(data.data);                                    
//                    }
//                });
//                productsCombo.attachEvent("onKeyPressed", function(keyCode){
//                    var input = productsCombo.getComboText().trim().toLowerCase().split(' ');
//                    var mask = "";
//                    for (var i = 0; i < input.length; i++) {
//                        mask = mask + input[i] + "(.+)";                                                                                                                        
//                    }                       
//                    productsCombo.filter(function(opt){
//                        return opt.text.match(new RegExp("^"+mask.toLowerCase(),"ig"))!=null;
//                    }, false);                           
//                });   
                var orderPositionFormStruct = [
			{type: "settings", position: "label-left", labelWidth: 110, inputWidth: 160},		
                        {type: "input", name: "kod",        required: true, label: _("Kod pozycji")},
	                {type: "combo", name: "product_id", required: true, label: _("Produkt"), options: []},		                        
                        {type: "input", name: "amount",     required: true, label: _("Ilosc")},
                        {type: "input", name: "price",      required: true, label: _("Cena")},
			{type: "calendar", name: "date_delivery",  label: _("Data dostawy"), 
                            required: true, dateFormat: "%Y-%m-%d",
                            note: {text: _("Data kiedy produkt musi byc gotowy.")}},
                        {type: "block", blockOffset: 0, position: "laabel-left", list: [
			    {type: "button", name: "save",   value: "Zapisz", offsetTop:18},
			    {type: "newcolumn"},
			    {type:"button", name:"cancel", value:"Anuluj", offsetTop:18}
	                ]}                    
                ];                
		positionsGridMenu = projectsTabbar.tabs("positions").attachMenu({
			iconset: "awesome",
			items: [
                            {id:"Add",  text: _("Dodaj"),  img: "fa fa-plus-square"},
                            {id:"Edit", text: _("Edytuj"), img: "fa fa-edit"},
                            {id:"Del",  text: _("Usun"),   img: "fa fa-minus-square"}
			]
		});                 
                positionsGridMenu.attachEvent("onClick", function(id) { 
                    switch (id){
                        case 'Add':{  
                            var orderId = projectsGrid.getSelectedRowId();
                            if (orderId) {
                                var positionsForm = createWindowWithForm(orderPositionFormStruct, _("Nowa pozycja"), 250, 350);                                                                
                                positionsForm.setItemFocus("kod");
                                var productsCombo = positionsForm.getCombo("product_id");                
                                ajaxGet("api/products", '', function(data) {
                                    if (data.success && data.data) {
                                        productsCombo.addOption(data.data);                                    
                                    }
                                });                                   
                                positionsForm.attachEvent("onButtonClick", function(name){
                                    switch (name){
                                            case 'save':{                                                           
                                                var data = positionsForm.getFormData();                                            
                                                data.date_delivery = positionsForm.getCalendar("date_delivery").getDate(true); 
                                                data.order_id = projectsGrid.getSelectedRowId();
                                                ajaxPost("api/positions", data, function(data){
                                                    if (data.success && data.data) {
                                                        positionsGrid.fill(projectsGrid.getSelectedRowId());
                                                    }
                                                });                                            
                                            };break;
                                            case 'cancel':{

                                            };break;
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
                        case 'Edit':{
                            var orderId = projectsGrid.getSelectedRowId();
                            if (orderId) {
                                var editPositionForm = createWindowWithForm(orderPositionFormStruct, _("Edutyj pozycje"), 280, 380);                                                                
                                var productsCombo = editPositionForm .getCombo("product_id");
                                ajaxGet("api/products", "", function(data){
                                    productsCombo.addOption(data.data);
                                });  
                                editPositionForm.bind(positionsGrid);     
                                editPositionForm.unbind(positionsGrid);
                                var rowData = positionsGrid.getRowData(positionsGrid.getSelectedRowId());
                                productsCombo.setComboText(rowData.product_name);
                                productsCombo.setComboValue(rowData.product_id);   
                                productsCombo.attachEvent("onKeyPressed", function(keyCode){
                                    var input = productsCombo.getComboText().trim().toLowerCase().split(' ');
                                    var mask = "";
                                    for (var i = 0; i < input.length; i++) {
                                        mask = mask + input[i] + "(.*)";                                                                                                                        
                                    }                       
                                    productsCombo.filter(function(opt){
                                        return opt.text.match(new RegExp("^"+mask.toLowerCase(),"ig"))!=null;
                                    }, false);                           
                                });                                 
                                editPositionForm.attachEvent("onButtonClick", function(name){
                                    switch (name){
                                        case 'save':{                                                           
                                            var data = editPositionForm.getFormData();                                            
                                            data.date_delivery = editPositionForm.getCalendar("date_delivery").getDate(true); 
                                            data.order_id = projectsGrid.getSelectedRowId();
                                            ajaxPost("api/positions", data, function(data){
                                                if (data.success && data.data) {
                                                    positionsGrid.fill(projectsGrid.getSelectedRowId());
                                                }
                                            });                                            
                                        };break;
                                        case 'cancel':{

                                        };break;
                                    }
                                });  
                            } else {
                                dhtmlx.alert({
                                    title:_("Wiadomość"),
                                    type:"alert",
                                    text:_("Wybierz zamowienie!")
                                });                                 
                            }
                        };break;
                        case 'Del': {                            
                            var positionId = positionsGrid.getSelectedRowId();
                            if (positionId) {
                                dhtmlx.confirm({
                                    title: _("Ostrożność"),                                    
                                    text: _("Czy na pewno chcesz usunąć pozycje?"),
                                    callback: function(result){
                                        if (result) {                                
                                            ajaxDelete("api/positions/" + positionId, "", function(data){
                                                if (data.data && data.success) {
                                                    positionsGrid.deleteSelectedRows();
                                                }
                                            }); 
                                        }
                                    }
                                });
                            } else {
                                dhtmlx.alert({
                                    title:_("Wiadomość"),
                                    text:_("Wybierz pozycje, która chcesz usunąć!")
                                });
                            }                            
                        };break;                         
                    }
                });
                        

                var historyGrid = projectsTabbar.tabs("history").attachGrid({
                    image_path:'codebase/imgs/',
	            columns: [{
                            label: _("Imie"),                            
                            id: "name",
                            type: "ro", 
                            sort: "str", 
                            align: "left"
                        },
                        {
                            label: _("Data"),
                            id: "created_at",                            
                            type: "ro", 
                            sort: "str", 
                            align: "left"
                        }                        
                    ],
			multiselect: true                    
                });                
                historyGrid.fill = function(orderId){
                    historyGrid.clearAll();
		    ajaxGet("api/orders/history/" + orderId, '', function(data){
		        if (data.data && data.success){			    
                            historyGrid.clearAll();
                            historyGrid.parse(data.data, "js");
                        }
                    });			
		};               
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