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
                mainTabbar.addTab("a2", _("Produkty"));                    
                mainTabbar.addTab("a3", _("Grupy zlecen"));
                mainTabbar.addTab("a4", _("Jezyk"));
            //Tabs
            var rolesLayout = mainTabbar.tabs("a1").attachLayout("3W");
                rolesLayout.cells("a").hideHeader();
                rolesLayout.cells("b").hideHeader();                
                rolesLayout.cells("c").hideHeader();                                
                rolesLayout.setAutoSize("a", "a;b;c");

            var productsLayout = mainTabbar.tabs("a2").attachLayout("5U");
                productsLayout.cells("a").hideHeader();
                productsLayout.cells("b").hideHeader();                
                productsLayout.cells("c").hideHeader();                                
                productsLayout.cells("d").hideHeader();                                                    
                productsLayout.cells("e").hideHeader();                                                    
                
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
                                {type: "text", id: "find", text: _("Find:")},
				{type: "buttonInput", id: "szukaj", text: "Szukaj", width: 100},
                                {type: "separator", id: "sep2"},
				{id: "Cog", type: "button", img: "fa fa-cog "},
                                {type: "separator", id: "sep3"},
                                {id: "Redo", type: "button", img: "fa fa-reply"}
			]
		});                 
                var permissionsToolBar = rolesLayout.cells("c").attachToolbar({
			iconset: "awesome",
			items: [
				{type: "text", id: "title", text: _("Uprawnienia")},
				{type: "spacer"},
				{id: "Add", type: "button", img: "fa fa-plus-square "},
				{id: "Edit", type: "button", img: "fa fa-edit"},
				{id: "Del", type: "button", img: "fa fa-minus-square"},
                                {type: "separator", id: "sep3"},
                                {id: "Redo", type: "button", img: "fa fa-reply"}
			]
		});    
                var productTypesToolBar = productsLayout.cells("a").attachToolbar({
			iconset: "awesome",
			items: [
				{type: "text", id: "title", text: _("Typ produktu")},
				{type: "spacer"},
				{id: "Add", type: "button", img: "fa fa-plus-square "},
				{id: "Edit", type: "button", img: "fa fa-edit"},
				{id: "Del", type: "button", img: "fa fa-minus-square"},
                                {type: "separator", id: "sep3"},
                                {id: "Redo", type: "button", img: "fa fa-reply"}
			]                    
                });
                var productGroupsToolBar = productsLayout.cells("b").attachToolbar({
			iconset: "awesome",
			items: [
				{type: "text", id: "title", text: _("Grupa produktu")},
				{type: "spacer"},
				{id: "Add", type: "button", img: "fa fa-plus-square "},
				{id: "Edit", type: "button", img: "fa fa-edit"},
				{id: "Del", type: "button", img: "fa fa-minus-square"},
                                {type: "separator", id: "sep3"},
                                {id: "Redo", type: "button", img: "fa fa-reply"}
			]                    
                });                
                var productsToolBar = productsLayout.cells("c").attachToolbar({
			iconset: "awesome",
			items: [
				{type: "text", id: "title", text: _("Produkty")},
				{type: "spacer"},
				{id: "Add", type: "button", img: "fa fa-plus-square "},
				{id: "Edit", type: "button", img: "fa fa-edit"},
				{id: "Del", type: "button", img: "fa fa-minus-square"},
                                {type: "separator", id: "sep3"},
                                {id: "Redo", type: "button", img: "fa fa-reply"}
			]                    
                });                
                var productToolBar = productsLayout.cells("e").attachToolbar({
			iconset: "awesome",
			items: [
				{type: "text", id: "title", text: _("Produkt")},
				{type: "spacer"},
				{id: "Add", type: "button", img: "fa fa-plus-square "},
				{id: "Edit", type: "button", img: "fa fa-edit"},
				{id: "Del", type: "button", img: "fa fa-minus-square"},
                                {type: "separator", id: "sep3"},
                                {id: "Redo", type: "button", img: "fa fa-reply"}
			]                    
                });
                var componentsToolBar = productsLayout.cells("d").attachToolbar({
			iconset: "awesome",
			items: [
				{type: "text", id: "title", text: _("Components")},
				{type: "spacer"},
				{id: "Add", type: "button", img: "fa fa-plus-square "},
				{id: "Edit", type: "button", img: "fa fa-edit"},
				{id: "Del", type: "button", img: "fa fa-minus-square"},
                                {type: "separator", id: "sep3"},
                                {id: "Redo", type: "button", img: "fa fa-reply"}
			]                    
                });                
                
                var rolesTree = rolesLayout.cells("a").attachTreeView({
                    skin: "dhx_skyblue",    // string, optional, treeview's skin
			iconset: "font_awesome", // string, optional, sets the font-awesome icons
			multiselect: false,           // boolean, optional, enables multiselect
			//checkboxes: true,           // boolean, optional, enables checkboxes
			//dnd: true,           // boolean, optional, enables drag-and-drop
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
                            label: _("Nazwisko"),
                            width: 100,
                            id: "firstname",
                            type: "ed", 
                            sort: "str", 
                            align: "left"
                        },
                        {
                            label: _("Imie"),
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
                            usersGrid.clearAll();
                            usersGrid.parse((data.data), "js");
                        }
		    });
                };               
                    usersGrid.fill(0);      
                var searchElem = usersToolBar.getInput('szukaj');
                                 usersGrid.makeFilter(searchElem, 0, true);
                                 usersGrid.makeFilter(searchElem, 1, true);                                 
                                 usersGrid.filterByAll();
                                 
                var permissionsGrid = rolesLayout.cells("c").attachGrid({
                    image_path:'codebase/imgs/',
	            columns: [
                        {
                            label: _("Uprawnienie"),
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
                            label: _("Opis"),
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
                            permissionsGrid.clearAll();
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
                                permission_id: rId, 
                                value: +state
                            };
                        ajaxGet("api/rolespermissions/edit", data, '');
                        
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
                                            if (data.success) {
                                                ajaxPost("api/rolespermissions/fillRole/" + data.data.id, '', '');
                                                rolesTree.addItem(data.data.id, data.data.name); 
                                            }
                                        });
                                    };break;
                                    case 'cancel':{
                                        form.clear();    
                                    };break;
                                }
                            });
                        };break;
		        case 'Edit':{                            
                            var roleId = rolesTree.getSelectedId();
                            if (roleId) {
                                var form = createWindowWithForm(roleForm, 300, 300);
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
                            } else {
                                dhtmlx.alert({
                                    title:_("Wiadomość"),
                                    type:"alert",
                                    text:_("Wybierz rolę, którą chcesz edytować!")
                                });
                            }
                        };break;  
		        case 'Del':{
                            var roleId = rolesTree.getSelectedId();
                            if (roleId) {
                                dhtmlx.confirm({
                                    title:_("Ostrożność"),                                    
                                    text:_("Czy na pewno chcesz usunąć rolę?"),
                                    callback: function(result){
                                        if (result) {
                                            ajaxDelete("api/roles/" + roleId,'', function(data) {
                                                if (data.success) {
                                                    rolesTree.deleteItem(roleId);
                                                    usersGrid.fill(0);
                                                    permissionsGrid.fill(0);
                                                } else {
                                                    dhtmlx.alert({
                                                        title:_("Błąd!"),
                                                        type:"alert-error",
                                                        text:data.message
                                                    });
                                                }
                                            });                                              
                                        }
                                    }
                                });   
                            } else {
                                dhtmlx.alert({
                                    title:_("Wiadomość"),
                                    type:"alert",
                                    text:_("Wybierz rolę, którą chcesz usunąć!")
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
                                var addUsersGrid = dhxWins.window("w1").attachGrid({
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
                                            label: _("Role"),
                                            width: 100,
                                            id: "role_name",
                                            type: "ed", 
                                            sort: "str", 
                                            align: "left"
                                        }                       
                                    ]                                       
                                }); 
                                addUsersGrid.attachEvent("onCheck", function(rId,cInd,state){
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
                                            addUsersGrid.parse((allUsers), "js");
                                        });
                                    }
                                });                                
                            } else {
                                dhtmlx.alert({
                                    title:_("Wiadomość"),
                                    type:"alert",
                                    text:_("Wybierz rolę, do której chcesz dodać użytkowników")
                                });
                            }                           
                        };break;
                        case 'Redo':{
                                var roleId = rolesTree.getSelectedId();
                                rolesTree.unselectItem(roleId);
                                usersGrid.fill(0);
                                permissionsGrid.fill(0);
                        };break; 
                    }
                });                
                permissionsToolBar.attachEvent("onClick", function(id) { 
                    switch (id){
		        case 'Add':{
                                var form = createWindowWithForm(permissionForm, 300, 300);
                                form.attachEvent("onButtonClick", function(name){
                                    switch (name){
                                        case 'save':{                                                           
                                            ajaxPost("api/permissions", form.getFormData(), function(data){                                                                                                        
                                                ajaxPost("api/rolespermissions/addToRoles/" + data.data.id, '', function(data) {
                                                    if (data.success) {
                                                        permissionsGrid.fill(0);
                                                    } 
                                                });                                            
                                            });
                                        };break;
                                        case 'cancel':{
                                            form.clear();    
                                        };break;
                                    }
                                });
                            };break;
                        case 'Edit':{                                
                                var permissionId = permissionsGrid.getSelectedRowId();                                
                                if (permissionId) {                                    
                                    var form = createWindowWithForm(permissionForm, 300, 300);
                                    var data = {
                                        id: permissionId,
                                        name: permissionsGrid.cells(permissionId, 0).getValue(),
                                        description: permissionsGrid.cells(permissionId, 2).getValue()
                                    };
                                    form.setFormData(data); 
                                    form.attachEvent("onButtonClick", function(name){
                                        switch (name){
                                            case 'save':{                                                           
                                                ajaxGet("api/permissions/" + permissionId + "/edit", form.getFormData(), function(data){ 
                                                    if (data.success) {                                                           
                                                        permissionsGrid.fill(0);
                                                    } 
                                                });
                                            };break;
                                            case 'cancel':{
                                                form.setFormData(data); 
                                            };break;
                                        }
                                    });                                
                                } else {
                                    dhtmlx.alert({
                                        title:_("Wiadomość"),
                                        type:"alert",
                                        text:_("Wybierz uprawnienie, które chcesz edytować!")
                                    });
                                }                               
                        };break;
                        case 'Del':{
                                var permissionId = permissionsGrid.getSelectedRowId();                                
                                if (permissionId) {
                                    dhtmlx.confirm({
                                        title:_("Ostrożność"),                                    
                                        text:_("Czy na pewno chcesz usunąć uprawnienie?"),
                                        callback: function(result){
                                            if (result) {
                                                ajaxDelete("api/permissions/" + permissionId, '', function(data) {
                                                    if (data.success) {
                                                        permissionsGrid.deleteSelectedRows();    
                                                    }
                                                });
                                            }
                                        }
                                    });
                                } else {
                                    dhtmlx.alert({
                                        title:_("Wiadomość"),
                                        type:"alert",
                                        text:_("Wybierz uprawnienie, które chcesz usunąć!")
                                    });
                                }
                        };break;
                        case 'Redo':{
                                var roleId = rolesTree.getSelectedId();
                                rolesTree.unselectItem(roleId);
                                usersGrid.fill(0);
                                permissionsGrid.fill(0);
                        };break;
                    }
                });
                //----//
                
                /**
                 * 
                 * Products tab
                 * 
                 * 
                 */
                
                var productTypeGrid = productsLayout.cells("a").attachGrid({
                    image_path:'codebase/imgs/',
	            columns: [                        
                        {
                            label: _("Nazwa"),
                            width: 100,
                            id: "name",
                            type: "ed", 
                            sort: "str", 
                            align: "left"
                        },
                        {
                            label: _("Opis"),
                            width: 100,
                            id: "description",
                            type: "ed", 
                            sort: "str", 
                            align: "left"
                        }                        
                    ],
			multiselect: true
                });                
                    productTypeGrid.fill = function(){						
                            var new_data = ajaxGet("api/prodtypes", '', function(data){                                     
                                    if (data && data.success){                                    
                                        productTypeGrid.parse((data.data), "js");
                                    }
                            });                        
                    };                
                    productTypeGrid.fill();
                var dpProductTypeGrid = new dataProcessor("api/prodtypes", "js");                
		    dpProductTypeGrid.init(productTypeGrid);
		    dpProductTypeGrid.enableDataNames(true);
		    dpProductTypeGrid.setTransactionMode("REST");
		    dpProductTypeGrid.enablePartialDataSend(true);
		    dpProductTypeGrid.enableDebug(true);
                    dpProductTypeGrid.setUpdateMode("row", true);
                    dpProductTypeGrid.attachEvent("onBeforeDataSending", function(id, state, data){
                        console.log(data);
                        data.id = id;
                        ajaxGet("api/prodtypes/" + id + "/edit", data, function(data){                                                            
                            console.log(data);
                        });
                    });
                    
                var productGroupTree = productsLayout.cells("b").attachTree();
                    productGroupTree.setImagePath("codebase/imgs/dhxtree_web/");		                    
                    productGroupTree.enableDragAndDrop(true);
                    productGroupTree.setDragBehavior('complex');                    
                    productGroupTree.enableItemEditor(true);
                    productGroupTree.enableCheckBoxes(true);                    
                    productGroupTree.enableTreeImages(true);
                    productGroupTree.enableTreeLines(true);
                    productGroupTree.fill = function(i=null){
                            var ids = Array();
                            ids = (typeof i === 'string' || typeof i === 'number')  ? [i] : i;
                            ajaxGet("api/prodgroups/grupytree",i!=null ? 'parent='+ids.join('|'): '',function(data){
                                    if (data.data && data.success){                                            
                                            productGroupTree.parse({id:0, item:data.data}, "json");                                            
                                    }
                            });			
                    };
                    productGroupTree.fill();
                               
                productTypesToolBar.attachEvent("onClick", function(id) { 
                    switch (id){
		        case 'Add':{
                            var form = createWindowWithForm(permissionForm, 300, 300);
                            form.attachEvent("onButtonClick", function(name){
                                switch (name){
                                    case 'save':{                                                           
                                        ajaxPost("api/prodtypes", form.getFormData(), function(data){ 
                                            if (data.success) {                                                
                                                productTypeGrid.fill();
                                            }
                                        });
                                    };break;
                                    case 'cancel':{
                                        form.clear();    
                                    };break;
                                }
                            });
                        };break;
		        case 'Del':{
                            var id = productTypeGrid.getSelectedRowId();;
                            if (id) {
                                dhtmlx.confirm({
                                    title:_("Ostrożność"),                                    
                                    text:_("Czy na pewno chcesz usunąć?"),
                                    callback: function(result){
                                        if (result) {
                                            ajaxDelete("api/prodtypes/" + id,'', function(data) {
                                                if (data.success) {
                                                    productTypeGrid.deleteSelectedRows();                                            
                                                } else {
                                                    dhtmlx.alert({
                                                        title:_("Błąd!"),
                                                        type:"alert-error",
                                                        text:data.message
                                                    });
                                                }
                                            });                                              
                                        }
                                    }
                                });   
                            } else {
                                dhtmlx.alert({
                                    title:_("Wiadomość"),
                                    type:"alert",
                                    text:_("Wybierz co chcesz usunąć!")
                                });
                            }
                             
                        };break;                     
                    };
                });                
                                
                productGroupsToolBar.attachEvent("onClick", function(id) {
                    switch (id) {
                        case 'Add':{
                                var id = productGroupTree.getSelectedItemId(),
				parent = productGroupTree.getParentId(id) || 0;                                   
                                
				var form = createWindowWithForm(permissionForm, 300, 300);
                                var data = {
                                    'parent_id': parent                                    
                                };
                                form.attachEvent("onButtonClick", function(name){
                                    switch (name){
                                        case 'save':{ 
                                            Object.assign(data, form.getFormData());
                                            ajaxPost("api/prodgroups", data, function(data){ 
                                                if (data.success) {                                                
                                                    productGroupTree.insertNewItem(id || parent,data.data.id,data.data.name);
//					            productGroupTree.selectItem('_new');
//					            productGroupTree.editItem('_new');
                                                }
                                            });
                                        };break;
                                        case 'cancel':{
                                            form.clear();    
                                        };break;
                                    }
                                });		
					
                                                                
                        };break;                        
                        case 'Edit':{
					var id = productGroupTree.getSelectedItemId(),
						parent = productGroupTree.getParentId(id) || 0;
						if(id){
							productGroupTree.focusItem(id);
							productGroupTree.editItem(id);
						}
                        };break;
                        case 'Del':{
                                var id = productGroupTree.getSelectedItemId(),
                                        parent = productGroupTree.getParentId(id) || 0;
                                        if(id){							
                                                var ch = productGroupTree.getSubItems(id);
                                                productGroupTree.deleteItem(id,true);
                                                ch = ch.split(',');
                                                for (k=0;k<ch.length;k++){
                                                        i=ch[k];
                                                        productGroupTree.moveItem(i,'item_child',parent);
                                                };
                                        }
                        };break;                        
                    };
                });
                
                productGroupTree.attachEvent("onEdit", function(state, id, tree, value){
                    console.log('onEdit', arguments);
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
                            caption: _("Dodaj lub zmien"),
                            header: true,
                            onClose:function(){

                            }
                    });
                    //initializing form 
                    return dhxWins.window("w1").attachForm(formStruct, true);         
                }  
                
                var roleForm = [
                    {type:"fieldset",  offsetTop:0, label:_("Dodaj lub zmien"), width:253, list:[                                			
                            {type:"input",  name:"name",   label:_("Nazwa"), offsetTop:13, labelWidth:80},                                                                				                            
                            {type:"button", name:"save",   value:_("Zapisz"),     offsetTop:18},
                            {type:"button", name:"cancel", value:_("Anuluj"),     offsetTop:18}
                    ]}
		];
                
                var permissionForm = [
                    {type:"fieldset",  offsetTop:0, label:_("Dodaj lub zmien"), width:253, list:[                                			
                            {type:"input",  name:"name",        label:_("Nazwa"), offsetTop:13, labelWidth:100},                                                                				                            
                            {type:"input",  name:"description", label:_("Opis"), offsetTop:13, labelWidth:100},                                                                				                            
                            {type:"button", name:"save",        value:_("Zapisz"),     offsetTop:18},
                            {type:"button", name:"cancel",      value:_("Anuluj"),     offsetTop:18}
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