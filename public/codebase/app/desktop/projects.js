var projectsGrid;
var projectsLayout;
var projectsTabbar;
var projectsChart;
var projectsChartId;
var projectsForm;

function projectsInit(cell) {
	
	if (projectsLayout == null) {
		
		// init layout
		projectsLayout = cell.attachLayout("3J");
		projectsLayout.cells("a").hideHeader();
		projectsLayout.cells("b").hideHeader();
		projectsLayout.cells("c").hideHeader();
		projectsLayout.cells("b").setWidth(330);
		projectsLayout.cells("c").setHeight(350);
		projectsLayout.cells("b").fixSize(true, true);
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
                
                projectsGrid.fill = function(){
		    ajaxGet("api/orders", '', function(data){
		        if (data.data && data.success){
			    var d = data.data;
                            console.log(d);
                            projectsGrid.parse(d, "js");
                        }
                    });			
		};
                projectsGrid.fill();
                
                
		projectsGrid.attachEvent("onRowSelect", function() {
                    var selectedId = projectsGrid.getSelectedRowId();
                    historyGrid.fill(selectedId);
                    positionsGrid.fill(selectedId);
                });
//		projectsGrid.attachEvent("onRowInserted", function(r, index){
//		    projectsGrid.setCellTextStyle(projectsGrid.getRowId(index), projectsGrid.getColIndexById("project"), "font-weight:bold;");
//		});
		
		// attach form
		var projectsForm = projectsLayout.cells("b").attachForm([
			{type: "settings", position: "label-left", labelWidth: 110, inputWidth: 160},
			{type: "container", name: "photo", label: "", inputWidth: 160, inputHeight: 160, offsetTop: 20, offsetLeft: 65},
			{type: "input", name: "date_end",     label: "Due date", offsetTop: 20},
			{type: "input", name: "name", label: "Project"},
			{type: "input", name: "status",  label: "Status"},
			{type: "input", name: "assign",  label: "Assigned to"},
			{type: "input", name: "info",    label: "Additional info"}
		]);
		projectsForm.getContainer("photo").innerHTML = "<img src='imgs/projects/project.png' border='0' class='form_photo'>";
		projectsForm.setSizes = projectsForm.centerForm;
		projectsForm.setSizes();
		projectsForm.bind(projectsGrid); 
                
		// attach tabbar
		projectsTabbar = projectsLayout.cells("c").attachTabbar({
			arrows_mode: "auto",
			tabs: [
				{id: "positions", text: _("Positions"), selected: 1},
                                {id: "history", text: _("History")},
                                {id: "client", text: _("Client")}
			]
		});
                var positionsGrid = projectsTabbar.tabs("positions").attachGrid({
                    image_path:'codebase/imgs/',
	            columns: [{
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
		    ajaxGet("api/orders/history/" + orderId, '', function(data){
		        if (data.data && data.success){			    
//                            console.log(d);
                            historyGrid.clearAll();
                            historyGrid.parse(data.data, "js");
                        }
                    });			
		};     
                positionsGrid.fill = function(orderId){
		    ajaxGet("api/orders/positions/" + orderId, '', function(data){
		        if (data.data && data.success){			    
//                            console.log(d);
                            positionsGrid.clearAll();
                            console.log(data.data);
                            positionsGrid.parse(data.data, "js");
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