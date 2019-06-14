var settingsDataView;
var settingsLayout;
var settingsForm;

function settingsInit(cell) {
	
	if (settingsLayout == null) {
		
		// init layout
		var settingsLayout = cell.attachLayout("1C");                
		settingsLayout.cells("a").hideHeader();
                
                var mainTabbar = settingsLayout.cells("a").attachTabbar();
		mainTabbar.addTab("a1", _("Role"), null, null, true);
		mainTabbar.addTab("a2", "Jezyk");
                
                var rolesLayout = mainTabbar.tabs("a1").attachLayout("2U");
                rolesLayout.cells("a").hideHeader();
                rolesLayout.cells("b").hideHeader();                
                rolesLayout.cells("a").setWidth(330);
                //rolesLayout.cells("b").fixSize(true, true);
                rolesLayout.setAutoSize("a", "a;b");
                var rolesToolBar = rolesLayout.cells("a").attachToolbar({
			iconset: "awesome",
			items: [
				{type: "text", id: "title", text: _("Role")},
				{type: "spacer"},
				{id: "Add", type: "button", img: "fa fa-plus-square "},
				{id: "Edit", type: "button", img: "fa fa-edit"},
				{id: "Del", type: "button", img: "fa fa-minus-square"}
			]
		});
                var permissionsToolBar = rolesLayout.cells("b").attachToolbar({
			iconset: "awesome",
			items: [
				{type: "text", id: "title", text: _("Pozwolenia")},
				{type: "spacer"},
				{id: "Add", type: "button", img: "fa fa-plus-square "},
				{id: "Edit", type: "button", img: "fa fa-edit"},
				{id: "Del", type: "button", img: "fa fa-minus-square"}
			]
		});              
                var rolesTree = rolesLayout.cells("a").attachTreeView({
                    skin: "dhx_skyblue",    // string, optional, treeview's skin
			iconset: "font_awesome", // string, optional, sets the font-awesome icons
			multiselect: false,           // boolean, optional, enables multiselect
			checkboxes: true,           // boolean, optional, enables checkboxes
			dnd: true,           // boolean, optional, enables drag-and-drop
			context_menu: true,  
                });
                ajaxGet("api/roles", '', function(data) {                    
                        if (data && data.success){                            
                            rolesTree.loadStruct(data.data);                           
                        }                    
                });
                    
//		var rolesTree = rolesLayout.cells("a").attachTreeView({
//                    skin: "dhx_skyblue",    // string, optional, treeview's skin
//                    iconset: "font_awesome", // string, optional, sets the font-awesome icons
//                    multiselect: false,           // boolean, optional, enables multiselect                    
//                    dnd: true,           // boolean, optional, enables drag-and-drop
//                    context_menu: true,
//                });
//                rolesTree.build = function(){
//                    ajaxGet("api/usersrolestree", '', function(data) {                    
//                        if (data && data.success){      
//                            //rolesTree.clearAll();                            
//                            rolesTree.loadStruct(data.data);                           
//                        }                    
//                    });                       
//                };                
//                rolesTree.build();
                
//                rolesTree.attachEvent("onSelect",function(id, mode){  
//                    if (mode) {
//			permissionsGrid.clearAll();
//			permissionsGrid.fillGrid(id);
//                        console.log(id);
//			return true;                        
//                    }
//		});
//                
//                rolesTree.attachEvent("onItemClick", function (id, ev, html){
//                    console.log(id);
//   permissionsGrid.fill(id);
//    return true;
//});
//                
                var permissionsGrid = rolesLayout.cells("b").attachGrid({
                    image_path:'codebase/imgs/',
	            columns: [
                        {
                            label: _("Permission"),
                            width: 100,
                            id: "name",
                            type: "ed", 
                            sort: "str", 
                            align: "left"
                        },
                        {
                            label: _("Value"),
                            id: "value",
                            width: 100, 
                            type: "ch"       
                        }                        
                    ],
			multiselect: true
                });  
                
                permissionsGrid.fill = function(id) {
                    ajaxGet("api/roles/" + id, '', function(data){                                     
			if (data && data.success){
                            permissionsGrid.parse((data.data.permissions), "js");
                        }
		    });
                };
                
                
//                var new_data = ajaxGet("api/workerslist/" + i, '', function(data){                                     
//				if (data && data.success){
//                                    pracownicyGrid.parse((data.data), "js");
//                                }
//			});
//		settingsLayout.cells("b").hideHeader();
//		settingsLayout.cells("b").setWidth(330);
//		settingsLayout.cells("b").fixSize(true, true);
//		settingsLayout.setAutoSize("a", "a;b");
//		
//		// attach data view
//		settingsDataView = settingsLayout.cells("a").attachDataView({
//			type: {
//				template: "<div style='position:relative;'>"+
//						"<div class='settings_image'><img src='imgs/settings/#image#' border='0' ondragstart='return false;'></div>"+
//						"<div class='settings_title'>#title#"+
//							"<div class='settings_descr'>#descr#</div>"+
//						"</div>"+
//						"</div>",
//				margin: 10,
//				padding: 20,
//				height: 120
//			},
//			autowidth: 2,
//			drag: false,
//			select: true,
//			edit: false
//		});
//		
//		settingsDataView.load(A.server+"settings.xml?type="+A.deviceType, function(){
//			settingsDataView.select("contacts");
//		});
//		
//		settingsDataView.attachEvent("onAfterSelect", function(id){
//			// attach form
//			var formData = [];
//			formData.push({type: "settings", position: "label-left", labelWidth: 110, inputWidth: 160});
//			formData = formData.concat(settingsFormStruct[id]);
//			settingsForm = settingsLayout.cells("b").attachForm(formData);
//			settingsForm.setSizes = settingsForm.centerForm;
//			settingsForm.setSizes();
//		});
		
	}
	
}

window.dhx4.attachEvent("onSidebarSelect", function(id, cell){
	if (id == "settings") {
            window.history.pushState({'page_id': id}, null, '#settings');
            settingsInit(cell);
        } 
});