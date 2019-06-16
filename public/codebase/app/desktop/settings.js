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
                    mainTabbar.addTab("a2", _("Departaments"));
                    mainTabbar.addTab("a3", _("Grupy produktow"));
                    mainTabbar.addTab("a4", _("Rodzaje produktow"));
                    mainTabbar.addTab("a5", _("Produkty"));
                    mainTabbar.addTab("a6", _("Grupy zlecen"));
		    mainTabbar.addTab("a7", _("Jezyk"));
                
                var rolesLayout = mainTabbar.tabs("a1").attachLayout("3W");
                    rolesLayout.cells("a").hideHeader();
                    rolesLayout.cells("b").hideHeader();                
                    rolesLayout.cells("c").hideHeader();                                
                    rolesLayout.setAutoSize("a", "a;b;c");
                
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
                var usersToolBar = rolesLayout.cells("b").attachToolbar({
			iconset: "awesome",
			items: [
				{type: "text", id: "title", text: _("Uzytkowniki")},
				{type: "spacer"},
				{id: "Cog", type: "button", img: "fa fa-cog "}
			]
		});                 
                var permissionsToolBar = rolesLayout.cells("c").attachToolbar({
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
                
                rolesTree.load = function(){ 
                    ajaxGet("api/roles", '', function(data) {                    
                            if (data && data.success){                            
                                rolesTree.loadStruct(data.data);                           
                            }                    
                    });
                };
                rolesTree.load();
                
                rolesTree.attachEvent("onSelect",function(id, mode){  
                    if (mode) {
			usersGrid.clearAll();
                        permissionsGrid.clearAll();			
                        usersGrid.fill(id);
                        permissionsGrid.fill(id);			
                        console.log(id);
			return true;                        
                    }
		});
                
                var usersGrid = rolesLayout.cells("b").attachGrid({
                    image_path:'codebase/imgs/',
	            columns: [
                        {
                            label: _("Kod"),
                            width: 100,
                            id: "kod",
                            type: "ed", 
                            sort: "str", 
                            align: "left"
                        },                        
                        {
                            label: _("First name"),
                            width: 100,
                            id: "firstname",
                            type: "ed", 
                            sort: "str", 
                            align: "left"
                        },
                        {
                            label: _("Last name"),
                            width: 100,
                            id: "lastname",
                            type: "ed", 
                            sort: "str", 
                            align: "left"
                        },
                        {
                            label: _("Role"),
                            width: 100,
                            id: "role_name",
                            type: "ed", 
                            sort: "str", 
                            align: "left"
                        }                        
                    ],
			multiselect: true
                });  
                
                usersGrid.fill = function(id) {
                    ajaxGet("api/roles/" + id + "/users", '', function(data){                                     
			if (data && data.success){
                            usersGrid.parse((data.data), "js");
                        }
		    });
                };
                
                usersGrid.fill(0);                
                                 
                var permissionsGrid = rolesLayout.cells("c").attachGrid({
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
                            width: 50, 
                            type: "ch"       
                        },
                        {
                            label: _("Description"),
                            id: "description",
                            width: 200, 
                            type: "ed"       
                        }                        
                    ],
			multiselect: true
                });  
                
                permissionsGrid.fill = function(id) {
                    ajaxGet("api/roles/" + id + "/permissions", '', function(data){                                     
			if (data && data.success){
                            permissionsGrid.parse((data.data), "js");
                        }
		    });
                };
                
                permissionsGrid.fill(0);
                
                permissionsGrid.attachEvent("onCheck", function(rId,cInd,state){
                    var roleId = rolesTree.getSelectedId();
                    if (roleId) {
                        var data = {
                                role_id: roleId,
                                permission_id: rId                                
                            };
                        if (state) {                                                                            
                            ajaxPost("api/rolespermissions", data, '');
                        } else {
                            ajaxGet("api/rolespermissions/del", data, '');
                        }
                        permissionsGrid.fill(roleId);                          
                    }                                 
                });
                
                //Toolbars events
                rolesToolBar.attachEvent("onClick", function(id) { 
                    switch (id){
		        case 'Add':{
                            var form = createWindowWithForm(roleForm, 300, 300);
                            form.attachEvent("onButtonClick", function(name){
                                switch (name){
                                    case 'save':{                                                           
                                        ajaxPost("api/roles", form.getFormData(), function(data){                                                            
                                            rolesTree.addItem(data.data.id, data.data.name); 
                                        });
                                    };break;
                                    case 'cancel':{
                                        form.clear();    
                                    };break;
                                }
                            });
                        };break;
		        case 'Edit':{
                            var form = createWindowWithForm(roleForm, 300, 300);
                            var roleId = rolesTree.getSelectedId();
                            if (roleId) {
                                var data = {
                                    id: roleId,
                                    name: rolesTree.getItemText(roleId)
                                };
                                form.setFormData(data); 
                                form.attachEvent("onButtonClick", function(name){
                                    switch (name){
                                        case 'save':{                                                           
                                            ajaxGet("api/roles/" + roleId + "/edit", form.getFormData(), function(data){                                                            
                                                if (data.success) {                                                 
                                                    rolesTree.setItemText(roleId, data.data.name);
                                                } 
                                            });
                                        };break;
                                        case 'cancel':{
                                            form.setFormData(data); 
                                        };break;
                                    }
                                });                                
                            }
                        };break;  
		        case 'Del':{
                            var roleId = rolesTree.getSelectedId();
                            if (roleId) {
                                ajaxDelete("api/roles/" + roleId,'', function(data) {
                                    if (data.success) {
                                        rolesTree.deleteItem(roleId);                                                    
                                    } else {
                                        dhtmlx.alert({
                                            title:_("Błąd!"),
                                            type:"alert-error",
                                            text:data.message
                                        });
                                    }
                                });      
                            }
                             
                        };break;                     
                    };
                });
                
                usersToolBar.attachEvent("onClick", function(id) { 
                    switch (id){
		        case 'Cog':{                                
                            var roleId = rolesTree.getSelectedId();
                            if (roleId) {
                                var dhxWins = new dhtmlXWindows();
                                w1 = dhxWins.createWindow({
                                        id:"w1",
                                        left:20,
                                        top:30,
                                        width: 500,
                                        height: 500,
                                        center:true,
                                        caption: _("Dolanczyc pracownikow do roli"),
                                        header: true,                                        
                                        onClose:function(){

                                        }
                                });                               
                                var usersGrid = dhxWins.window("w1").attachGrid({
                                    image_path:'codebase/imgs/',
                                    columns: [
                                        {
                                            label: _("Dolaczone"),
                                            width: 60,
                                            id: "in_departament",
                                            type: "ch",                                             
                                            align: "left"
                                        },
                                        {
                                            label: _("Nazwisko"),
                                            width: 100,
                                            id: "lastname",
                                            type: "ed", 
                                            sort: "str", 
                                            align: "left"
                                        },
                                        {
                                            label: _("Imię"),
                                            id: "firstname",
                                            width: 100, 
                                            type: "ed", 
                                            sort: "str", 
                                            align: "left"
                                        },
                                        {
                                            label: _("Kod"),
                                            id: "kod",
                                            width: 100, 
                                            type: "ed", 
                                            sort: "int", 
                                            align: "right"
                                        }                       
                                    ]                                       
                                }); 
                                usersGrid.attachEvent("onCheck", function(rId,cInd,state){
                                    var data = {
                                            role_id: roleId,
                                            user_id: rId
                                        };
                                    if (state) {                                                                            
                                        ajaxPost("api/usersroles", data, '');
                                    } else {
                                        ajaxGet("api/usersroles/del", data, '');
                                    }
                                    usersGrid.fill(roleId);                                   
                                });
                                ajaxGet("api/roles/0/users", '', function(data){                                     
                                    if (data && data.success){ 
                                        //remember array of all workers
                                        var allUsers = data.data;
                                        //asking array of workers for choosen departament
                                        ajaxGet("api/roles/" + roleId + "/users", '', function(data2){
                                            //remember array of workers in departament
                                            var departamentUsers = data2.data;
                                            //for every worker from all workers array we are checking:
                                            //does this worker is in choosen departament, if he is - then we
                                            //do marking "in_departament" for him
                                            allUsers.forEach(function(element){
                                                if (departamentUsers.find(x => x.id === element.id)) {
                                                    element.in_departament = true;
                                                }
                                            }); 
                                            usersGrid.parse((allUsers), "js");
                                        });
                                    }
                                });
                                
                            }                            
                        };break;
                    }
                });
                
                
                //form for work with roles
                function createWindowWithForm(formStruct, height, width){
                    var dhxWins = new dhtmlXWindows();
                    w1 = dhxWins.createWindow({
                            id:"w1",
                            left:20,
                            top:30,
                            width: width,
                            height: height,
                            center:true,
                            caption: _("Dodaj lub zmien role"),
                            header: true,
                            onClose:function(){

                            }
                    });
                    //initializing form 
                    return dhxWins.window("w1").attachForm(formStruct, true);         
                }  
                
                var roleForm = [
                    {type:"fieldset",  offsetTop:0, label:_("Role"), width:253, list:[                                			
                            {type:"input",  name:"name",   label:_("Nazwa role"), offsetTop:13, labelWidth:80},                                                                				                            
                            {type:"button", name:"save",   value:_("Zapisz"),     offsetTop:18},
                            {type:"button", name:"cancel", value:_("Anuluj"),     offsetTop:18}
                    ]}
		];  
                
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