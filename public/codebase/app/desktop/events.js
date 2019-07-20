var eventsDataView;
var eventsLayout;
var eventsMap;

function eventsInit(cell) {
	
	if (eventsLayout == null) {		
		// init layout
		var eventsLayout = cell.attachLayout("2U");                  
                eventsLayout.cells("a").hideHeader();
		eventsLayout.cells("b").hideHeader();
		eventsLayout.cells("b").setWidth(430);		
		eventsLayout.setAutoSize("a", "a;b");
		
                var productsTree = eventsLayout.cells("a").attachTreeView({
                    skin: "dhx_web",    // string, optional, treeview's skin
                    iconset: "font_awesome", // string, optional, sets the font-awesome icons
                    multiselect: false,           // boolean, optional, enables multiselect
                    checkboxes: true,           // boolean, optional, enables checkboxes
                    dnd: true,           // boolean, optional, enables drag-and-drop
                    context_menu: true
                });
                
                productsTree.build = function() {
                    var treeStruct = ajaxGet("api/prodgroups/grupytree", "", function(data){
                        if (data.success) {
                            productsTree.loadStruct(data.data);
                        }
                    });
                };
                productsTree.build();
                
		productsTree.attachEvent("onSelect",function(id, mode){  
                    if (mode) {
                        var grupy=productsTree.getAllChecked();
                        grupy[grupy.length]=id;
			productsGrid.clearAll();
			productsGrid.fill(grupy);                        
			return true;                        
                    }
		});
		productsTree.attachEvent("onCheck",function(id){
			var grupy=productsTree.getAllChecked(); 
			productsGrid.clearAll();
			productsGrid.fill(grupy);
			return true;
		}); 
                
                var productsTreeToolBar = eventsLayout.cells("a").attachToolbar({
			iconset: "awesome",
			items: [
				{type: "text", id: "title", text: _("Grupy produktow")},
				{type: "spacer"},
				{type: "text", id: "find", text: _("Find:")},				
				{type: "buttonInput", id: "szukaj", text: "Szukaj", width: 100}
			]
		}); 
                
                var productsGrid = eventsLayout.cells("b").attachGrid({
                    image_path:'codebase/imgs/',
                    columns: [
                        {
                            label: _("Grupa"),
                            width: 100,
                            id: "group_name",
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
                            label: _("Produkt kod"),
                            width: 100,
                            id: "product_kod",
                            type: "ed", 
                            sort: "str", 
                            align: "left"
                        },                        
                        {
                            label: _("Ilosc"),
                            id: "amount",
                            width: 60, 
                            type: "ed", 
                            sort: "str", 
                            align: "left"
                        }                      
                    ]                                       
                });
                
                productsGrid.fill = function(i) {
                    var ids = Array();
                    ids = (typeof i === 'string' || typeof i === 'number')  ? [i] : i;
                    var new_data = ajaxGet("api/warehouse/list/" + ids, "", function(data){
                        if (data.data && data.success){
                            productsGrid.parse(data.data, "js");
                        }
                    });	                    
                };
                
                var productsGridToolBar = eventsLayout.cells("b").attachToolbar({
                    iconset: "awesome",
                    items: [
                        {type: "text", id: "title", text: _("Produkty")},
                        {type: "spacer"},
                        {type: "text", id: "find", text: _("Find:")},				
                        {type: "buttonInput", id: "szukaj", text: "Szukaj", width: 100},
                        {type: "separator", id: "sep2"},                                
                        {id: "Add", type: "button", img: "fa fa-plus-square "},
                        {id: "Edit", type: "button", img: "fa fa-edit"},
                        {id: "Del", type: "button", img: "fa fa-minus-square"}                                
                    ]
		}); 
                
//		// attach data view
//		var eventsDataView = eventsLayout.cells("a").attachDataView({
//			type: {
//				template: "<div class='event_image'><img src='imgs/events/#image#' border='0' ondragstart='return false;'></div>"+
//						"<div class='event_title'>#title#</div>"+
//						"<div class='event_date'>#date#</div>"+
//						"<div class='event_place'>#place#</div>",
//				margin: 10,
//				padding: 20,
//				height: 300,
//				width: 204
//			},
//			drag: false,
//			select: true,
//			edit: false
//		});
//		
//		eventsDataView.load(A.server+"events.xml?type="+A.deviceType);
//		
//		eventsDataView.attachEvent("onAfterSelect", function(id){
//			var i = eventsDataView.item(id);
//			eventsMap.setCenter(new google.maps.LatLng(Number(i.lat), Number(i.lng)))
//			eventsMap.setZoom(11);
//		});
//		
//		// map
//		var eventsMap = eventsLayout.cells("b").attachMap();
	}
	
}



window.dhx4.attachEvent("onSidebarSelect", function(id, cell){    
	if (id == "events") {                        
            window.history.pushState({ 'page_id': id, 'user_id': 5 }, null, '#events'); 
            eventsInit(cell);      
        }        
});