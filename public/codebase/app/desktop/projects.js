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
		projectsLayout.cells("c").hideHeader();
		projectsLayout.cells("b").setWidth(330);
		projectsLayout.cells("c").setHeight(350);
		//projectsLayout.cells("b").fixSize(true, true);
		projectsLayout.setAutoSize("a;c", "a;b");
		
		// attach grid
		var projectsGrid = projectsLayout.cells("a").attachGrid({
                    image_path:'codebase/imgs/',
	            columns: [{
                            label: _("Kod"),
                            width: 100,
                            id: "kod",
                            type: "ed", 
                            sort: "str", 
                            align: "left"
                        },
                        {
                            label: _("Imie"),
                            id: "name",
                            width: 100, 
                            type: "ed", 
                            sort: "str", 
                            align: "left"
                        },
                        {
                            label: _("Opis"),
                            id: "description",
                            width: 100, 
                            type: "ed", 
                            sort: "str", 
                            align: "left"
                        },
                        {
                            label: _("Klient"),
                            id: "client_name",
                            width: 100, 
                            type: "ed", 
                            sort: "str", 
                            align: "left"
                        },                        
                        {
                            label: _("Date start"),
                            id: "date_start",
                            width: 100, 
                            type: "ed", 
                            sort: "str", 
                            align: "left"
                        },                                                 
                        {
                            label: _("Date end"),
                            id: "date_end",
                            type: "ed", 
                            sort: "str",	
                            align: "left"
                        }                        
                    ],
			multiselect: true                    
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
                        console.log(data);
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
                projectsGrid.enableStableSorting(true);
                projectsGrid.enableTooltips("false,true,true,true,true");                
                
		projectsGrid.attachEvent("onRowSelect", function() {
                    var selectedId = projectsGrid.getSelectedRowId();
                    historyGrid.fill(selectedId);
                    positionsGrid.fill(selectedId);
                });
//		projectsGrid.attachEvent("onRowInserted", function(r, index){
//		    projectsGrid.setCellTextStyle(projectsGrid.getRowId(index), projectsGrid.getColIndexById("project"), "font-weight:bold;");
//		});

		var newProjectFormStruct = [
                    {type: "settings", position: "label-left", labelWidth: 110, inputWidth: 160},
                    {type: "container", name: "photo", label: "", inputWidth: 160, inputHeight: 160, offsetTop: 20, offsetLeft: 65},
                    //{type: "input", name: "date_end",     label: "Due date", offsetTop: 20},
                    {type: "combo", name: "client_id", required: true, label: _("Klient"), options: []},		
                    {type: "input", name: "kod",         label: _("Kod zamowienia")},
                    {type: "input", name: "name",        label: _("Zamowienie"),
                       tooltip: _("Imie zamowienia"), required: true, info: true, 
                       note: {text: _("Dodaj imie zamowienia. Jest obowiazkowe.")}},
                    {type: "input", name: "description", label: _("Opis"),
                       rows: 3,
                       note: {text: _("Dodaj opis zamowienia. Nie jest obowiazkowe.")}},
                    {type: "calendar", name: "date_start",  label: _("Data poczatku"), 
                        required: true, dateFormat: "%Y-%m-%d",
                        note: {text: _("Data poczatku wykonania zamowienia. Jest obowiazkowe.")}},
                    {type: "calendar", name: "date_end",    label: _("Data zamkniecza"), 
                        required: true, dateFormat: "%Y-%m-%d",
                        note: {text: _("Data waznosci. Jest obowiazkowe.")}},
                    {type: "block", blockOffset: 0, position: "label-left", list: [
                        {type: "button", name: "save",   value: "Zapisz", offsetTop:18},
                        {type: "newcolumn"},
                        {type:"button", name:"cancel", value:"Anuluj", offsetTop:18}
                    ]}	        
		];
                var orderPositionFormStruct = [
			{type: "settings", position: "label-left", labelWidth: 110, inputWidth: 160},		
                        {type: "input", name: "kod",        required: true, label: _("Kod pozycji")},
	                {type: "combo", name: "product_id", required: true, label: _("Produkt"), options: []},		                        
                        {type: "input", name: "amount",     label: _("Ilosc"),
                           tooltip: _("Imie zamowienia"),   required: true,
                        },
			{type: "calendar", name: "date_delivery",  label: _("Data dostawy"), 
                            required: true, dateFormat: "%Y-%m-%d",
                            note: {text: _("Data kiedy produkt musi byc gotowy.")}},
                        {type: "block", blockOffset: 0, position: "laabel-left", list: [
			    {type: "button", name: "save",   value: "Zapisz", offsetTop:18},
			    {type: "newcolumn"},
			    {type:"button", name:"cancel", value:"Anuluj", offsetTop:18}
	                ]}                    
                ];
                var projectsForm = projectsLayout.cells("b").attachForm(newProjectFormStruct);
		projectsForm.getContainer("photo").innerHTML = "<img src='imgs/projects/project.png' border='0' class='form_photo'>";
		projectsForm.setSizes = projectsForm.centerForm;
		projectsForm.setSizes();
                var clientsCombo = projectsForm.getCombo("client_id");
                ajaxGet("api/clients", "", function(data){
                    clientsCombo.addOption(data.data);                    
                });                
		projectsForm.bind(projectsGrid); 
                projectsForm.attachEvent("onButtonClick", function(name){
                    switch (name){
                        case 'save':{                                                                  
                            var data = projectsForm.getFormData();
                            var order_id = projectsGrid.getSelectedRowId(); 
                            var ds   = projectsForm.getCalendar("date_start");                                        
                            var de   = projectsForm.getCalendar("date_end");                                        
                            data.date_start = ds.getDate(true);
                            data.date_end   = de.getDate(true);
                            ajaxGet("api/orders/" + order_id + "/edit", data, function(data){
                                console.log(data);
                            });                

                        };break;
                        case 'cancel':{

                        };break;
                    }
                });                 
                
               
                
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
                projectsGridToolBar.attachEvent("onButtonSelectHide", function(id){
                    var amountRecords = projectsGridToolBar.getListOptionSelected("amount_show");
                    projectsGridToolBar.setItemText("amount_show", amountRecords);
                    if (amountRecords == "all") {amountRecords = 0};
                    projectsGrid.fill(amountRecords);                    
                    
                });                

                projectsGridToolBar.attachEvent("onClick", function(id) { 
                    switch (id){
                        case 'Add':{                                                        
                            var clientsCombo = projectsForm.getCombo("client_id");
                            ajaxGet("api/clients", "", function(data){
                                clientsCombo.addOption(data.data);
                            });
                            projectsForm.clear();  
                            projectsForm.setItemFocus("kod");
//                                pracownicyForm.fillAvatar(0);                             
                            projectsForm.attachEvent("onButtonClick", function(name){
                                switch (name){
                                    case 'save':{                                                           
                                        var data = projectsForm.getFormData();
                                        var ds   = projectsForm.getCalendar("date_start");                                        
                                        var de   = projectsForm.getCalendar("date_end");                                        
                                        data.date_start = ds.getDate(true);
                                        data.date_end   = de.getDate(true);
                                        ajaxPost("api/orders", data, function(data){
                                            var orderData = data.data;
                                            projectsGrid.fill(10);
                                            projectsGrid.selectRowById(orderData.id);
                                        });                
                                        
                                    };break;
                                    case 'cancel':{
                                        
                                    };break;
                                }
                            }); 
                        };break;
                        case 'Edit':{                            
                            projectsForm.setItemFocus("client_id");                           
                        };break;                          
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
                var positionsLayout = projectsTabbar.tabs("positions").attachLayout("2U");  
                positionsLayout.cells("a").hideHeader();
		positionsLayout.cells("b").hideHeader();				
		positionsLayout.setAutoSize("a", "a;b");
                
                var positionsGrid = positionsLayout.cells("a").attachGrid({
                    image_path:'codebase/imgs/',
	            columns: [
                        {
                            label: _("Kod pozycji"),
                            width: 50,
                            id: "kod",
                            type: "ed", 
                            sort: "str", 
                            align: "left"
                        },
                        {
                            label: _("Produkt"),
                            width: 100,
                            id: "product_name",
                            type: "ed", 
                            sort: "str", 
                            align: "left"
                        },
                        {
                            label: _("Ilosc"),
                            id: "amount",
                            width: 100, 
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
                positionsGrid.attachHeader("#text_filter,#select_filter,#text_search");		
		positionsGrid.setColValidators(["NotEmpty","NotEmpty","NotEmpty"]);
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
                
                var positionsForm = positionsLayout.cells("b").attachForm(orderPositionFormStruct);
                positionsForm.bind(positionsGrid);                
                positionsForm.setSizes = positionsForm.centerForm;
                positionsForm.attachEvent("onButtonClick", function(name){
                    switch (name){
                            case 'save':{                                                           
                                var data = positionsForm.getFormData();
                                var dd = positionsForm.getCalendar("date_delivery");
                                var order_id = projectsGrid.getSelectedRowId();
                                data.date_delivery = dd.getDate(true); 
                                data.order_id = order_id;
                                var selectedPositionId = positionsGrid.getSelectedRowId();
                                if (selectedPositionId) {
                                    ajaxGet("api/positions/" + selectedPositionId + "/edit", data, function(data){
                                        if (data.success && data.data) {
                                            positionsGrid.fill(order_id);
                                        }
                                    });                                 
                                } else {
                                    ajaxPost("api/positions/", data, function(data){
                                        if (data.success && data.data) {
                                            positionsGrid.fill(order_id);
                                        }
                                    });  
                                } 
                            };break;
                            case 'cancel':{

                            };break;
                        }
                });
                var productsCombo = positionsForm.getCombo("product_id");                
                ajaxGet("api/products", '', function(data) {
                    if (data.success && data.data) {
                        productsCombo.addOption(data.data);                                    
                    }
                });
                productsCombo.attachEvent("onKeyPressed", function(keyCode){
                    var input = productsCombo.getComboText().trim().toLowerCase().split(' ');
                    var mask = "";
                    for (var i = 0; i < input.length; i++) {
                        mask = mask + input[i] + "(.+)";                                                                                                                        
                    }                       
                    productsCombo.filter(function(opt){
                        return opt.text.match(new RegExp("^"+mask.toLowerCase(),"ig"))!=null;
                    }, false);                           
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
                    switch (id){
                        case 'Add':{  
                                positionsForm.clear();
                                positionsForm.setItemFocus("kod");
                        };break;
                        case 'Edit':{
                                positionsForm.setItemFocus("kod");                                                          
                        };break;
                    }
                });
                        

                var historyGrid = projectsTabbar.tabs("history").attachGrid({
                    image_path:'codebase/imgs/',
	            columns: [{
                            label: _("Imie"),
                            width: 100,
                            id: "name",
                            type: "ed", 
                            sort: "str", 
                            align: "left"
                        },
                        {
                            label: _("Data"),
                            id: "created_at",
                            width: 100, 
                            type: "ed", 
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

function createWindowWithForm(formStruct, caption, height, width){
    var dhxWins = new dhtmlXWindows();
    w1 = dhxWins.createWindow({
            id:"w1",
            left:20,
            top:30,
            width: width,
            height: height,
            center:true,
            caption: _(caption),
            header: true,
            onClose:function(){

            }
    });
    //initializing form 
    return dhxWins.window("w1").attachForm(formStruct, true);         
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