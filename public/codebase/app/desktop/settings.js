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
                mainTabbar.addTab("a4", _("Grupy produktow"));                
                mainTabbar.addTab("a5", _("Grupy produktow - produkty"));
                mainTabbar.addTab("a6", _("Typy produktow"));
                mainTabbar.addTab("a7", _("Grupy pracownikow"));
                mainTabbar.addTab("a8", _("Jezyk"));
            //Tabs
            var rolesLayout = mainTabbar.tabs("a1").attachLayout("3W");
                rolesLayout.cells("a").hideHeader();
                rolesLayout.cells("b").hideHeader();                
                rolesLayout.cells("c").hideHeader();                                
                rolesLayout.setAutoSize("a", "a;b;c");

            var productsLayout = mainTabbar.tabs("a2").attachLayout("3J");
                productsLayout.cells("a").hideHeader();
                productsLayout.cells("b").hideHeader();                
                productsLayout.cells("c").hideHeader();                                
                                                  
                
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
                var productsGridToolBar = productsLayout.cells("a").attachToolbar({
			iconset: "awesome",
			items: [
				{type: "text", id: "title", text: _("Produkty")},
                                {type: "spacer"},
				{id: "Add", type: "button", img: "fa fa-plus-square "},
				{id: "Edit", type: "button", img: "fa fa-edit"},
				{id: "Del", type: "button", img: "fa fa-minus-square"}				                               
			]                    
                });
                var productFormToolBar = productsLayout.cells("b").attachToolbar({
			iconset: "awesome",
			items: [
				{type: "text", id: "title", text: _("Produkt")},
				{type: "spacer"},								
				{id: "Hide", type: "button", img: "fa fa-arrow-right"} 
			]                    
                });  
                var productFormStruct = [
                    {type: "settings", position: "label-left", labelWidth: 110, inputWidth: 160},
                    //{type: "container", name: "photo", label: "", inputWidth: 160, inputHeight: 160, offsetTop: 20, offsetLeft: 65},
                    //{type: "input", name: "date_end",     label: "Due date", offsetTop: 20},                    
                    {type: "combo", name: "product_group_id", required: true, label: _("Grupa produktu"), options: []},		
                    {type: "combo", name: "product_type_id",  required: true, label: _("Typ produktu"),   options: []},		
                    {type: "input", name: "kod",              required: true, label: _("Kod produktu")},
                    {type: "input", name: "name",             required: true, label: _("Nazwa produktu"),
                       tooltip: _("Imie zamowienia"), info: true, 
                       note: {text: _("Imie produktu. Jest obowiazkowe.")}},
                    {type: "input", name: "height",           label: _("Wysokość, mm")},
                    {type: "input", name: "width",            label: _("Szerokość, mm")},
                    {type: "input", name: "length",           label: _("Długość, mm")},
                    {type: "input", name: "weight",           label: _("Masa, kg")},
                    {type: "block", blockOffset: 0, position: "label-left", list: [
                        {type: "button", name: "save",   value: "Zapisz", offsetTop:18},
                        {type: "newcolumn"},
                        {type:"button", name:"cancel", value:"Anuluj", offsetTop:18}
                    ]}
                ];                
                var componentsToolBar = productsLayout.cells("c").attachToolbar({
			iconset: "awesome",
			items: [
				{type: "text", id: "title", text: _("Componenty")},
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
                
                var productsGrid = productsLayout.cells("a").attachGrid({
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
                            label: _("Nazwa produktu"),
                            width: 100,
                            id: "name",
                            type: "ed", 
                            sort: "str", 
                            align: "left"
                        },
                        {
                            label: _("Typ produktu"),
                            width: 100,
                            id: "product_type_name",
                            type: "ed", 
                            sort: "str", 
                            align: "left"
                        },
                        {
                            label: _("Group produktu"),
                            width: 100,
                            id: "product_group_name",
                            type: "ed", 
                            sort: "str", 
                            align: "left"
                        },
                        {
                            label: _("Wysokość, mm"),
                            width: 100,
                            id: "height",
                            type: "ed", 
                            sort: "str", 
                            align: "left"
                        },                        
                        {
                            label: _("Szerokość, mm"),
                            width: 100,
                            id: "width",
                            type: "ed", 
                            sort: "str", 
                            align: "left"
                        },
                        {
                            label: _("Długość, mm"),
                            width: 100,
                            id: "length",
                            type: "ed", 
                            sort: "str", 
                            align: "left"
                        },
                        {
                            label: _("Masa, kg"),
                            width: 100,
                            id: "weight",
                            type: "ed", 
                            sort: "str", 
                            align: "left"
                        }                           
                    ],
			multiselect: true
                });                
                productsGrid.fill = function(){						
                    ajaxGet("api/products", '', function(data){                                     
                        if (data && data.success){                                    
                            productsGrid.parse((data.data), "js");
                        }
                    });                        
                };                
                productsGrid.fill();
                var dpProductsGrid = new dataProcessor("api/products", "js");                
                dpProductsGrid.init(productsGrid);
                dpProductsGrid.enableDataNames(true);
                dpProductsGrid.setTransactionMode("REST");
                dpProductsGrid.enablePartialDataSend(true);
                dpProductsGrid.enableDebug(true);
                dpProductsGrid.setUpdateMode("row", true);
                dpProductsGrid.attachEvent("onBeforeDataSending", function(id, state, data){
                    data.id = id;
                    ajaxGet("api/products/" + id + "/edit", data, function(data){                                                            
                        console.log(data);
                    });
                });
		productsGrid.attachEvent("onRowSelect", function() {
                    var selectedId = productsGrid.getSelectedRowId();
                    componentsGrid.fill(selectedId);                    
                });                
                
                var productForm = productsLayout.cells("b").attachForm(productFormStruct);
                var productTypeCombo = productForm.getCombo("product_type_id");
                ajaxGet("api/prodtypes", "", function(data){
                    if (data && data.success) {
                        productTypeCombo.addOption(data.data);
                    }
                });
                var productGroupCombo = productForm.getCombo("product_group_id");
                ajaxGet("api/prodgroups", "", function(data){
                    if (data && data.success) {
                        productGroupCombo.addOption(data.data);
                    }
                });
                
                productForm.bind(productsGrid);
                
                var componentsGrid = productsLayout.cells("c").attachGrid({
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
                            label: _("Nazwa komponentu"),
                            width: 100,
                            id: "name",
                            type: "ed", 
                            sort: "str", 
                            align: "left"
                        },
                        {
                            label: _("Typ"),
                            width: 100,
                            id: "product_type_name",
                            type: "ed", 
                            sort: "str", 
                            align: "left"
                        },
                        {
                            label: _("Group"),
                            width: 100,
                            id: "product_group_name",
                            type: "ed", 
                            sort: "str", 
                            align: "left"
                        },                        
                        {
                            label: _("Ilość"),
                            width: 100,
                            id: "amount",
                            type: "ed", 
                            sort: "str", 
                            align: "left"
                        }                           
                    ],
			multiselect: true
                });   
                componentsGrid.fill = function(id = 0){						
                    ajaxGet("api/components/list/" + id, '', function(data){                                     
                        if (data && data.success){                                    
                            componentsGrid.parse((data.data), "js");
                        }
                    });                        
                };   
                
//                productTypesToolBar.attachEvent("onClick", function(id) { 
//                    switch (id){
//		        case 'Add':{
//                            var form = createWindowWithForm(permissionForm, 300, 300);
//                            form.attachEvent("onButtonClick", function(name){
//                                switch (name){
//                                    case 'save':{                                                           
//                                        ajaxPost("api/prodtypes", form.getFormData(), function(data){ 
//                                            if (data.success) {                                                
//                                                productTypeGrid.fill();
//                                            }
//                                        });
//                                    };break;
//                                    case 'cancel':{
//                                        form.clear();    
//                                    };break;
//                                }
//                            });
//                        };break;
//		        case 'Del':{
//                            var id = productTypeGrid.getSelectedRowId();;
//                            if (id) {
//                                dhtmlx.confirm({
//                                    title:_("Ostrożność"),                                    
//                                    text:_("Czy na pewno chcesz usunąć?"),
//                                    callback: function(result){
//                                        if (result) {
//                                            ajaxDelete("api/prodtypes/" + id,'', function(data) {
//                                                if (data.success) {
//                                                    productTypeGrid.deleteSelectedRows();                                            
//                                                } else {
//                                                    dhtmlx.alert({
//                                                        title:_("Błąd!"),
//                                                        type:"alert-error",
//                                                        text:data.message
//                                                    });
//                                                }
//                                            });                                              
//                                        }
//                                    }
//                                });   
//                            } else {
//                                dhtmlx.alert({
//                                    title:_("Wiadomość"),
//                                    type:"alert",
//                                    text:_("Wybierz co chcesz usunąć!")
//                                });
//                            }
//                             
//                        };break;                     
//                    };
//                });                
//                                
//                productGroupsToolBar.attachEvent("onClick", function(id) {
//                    switch (id) {
//                        case 'Add':{
//                                var id = productGroupTree.getSelectedItemId(),
//				parent = productGroupTree.getParentId(id) || 0;                                   
//                                
//				var form = createWindowWithForm(permissionForm, 300, 300);
//                                var data = {
//                                    'parent_id': parent                                    
//                                };
//                                form.attachEvent("onButtonClick", function(name){
//                                    switch (name){
//                                        case 'save':{ 
//                                            Object.assign(data, form.getFormData());
//                                            ajaxPost("api/prodgroups", data, function(data){ 
//                                                if (data.success) {                                                
//                                                    productGroupTree.insertNewItem(id || parent,data.data.id,data.data.name);
////					            productGroupTree.selectItem('_new');
////					            productGroupTree.editItem('_new');
//                                                }
//                                            });
//                                        };break;
//                                        case 'cancel':{
//                                            form.clear();    
//                                        };break;
//                                    }
//                                });		
//					
//                                                                
//                        };break;                        
//                        case 'Edit':{
//					var id = productGroupTree.getSelectedItemId(),
//						parent = productGroupTree.getParentId(id) || 0;
//						if(id){
//							productGroupTree.focusItem(id);
//							productGroupTree.editItem(id);
//						}
//                        };break;
//                        case 'Del':{
//                                var id = productGroupTree.getSelectedItemId(),
//                                        parent = productGroupTree.getParentId(id) || 0;
//                                        if(id){							
//                                                var ch = productGroupTree.getSubItems(id);
//                                                productGroupTree.deleteItem(id,true);
//                                                ch = ch.split(',');
//                                                for (k=0;k<ch.length;k++){
//                                                        i=ch[k];
//                                                        productGroupTree.moveItem(i,'item_child',parent);
//                                                };
//                                        }
//                        };break;                        
//                    };
//                });
//                
//                productGroupTree.attachEvent("onEdit", function(state, id, tree, value){
//                    console.log('onEdit', arguments);
//                });
                
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
                
                var productFormStruct = [
                    {type: "file",     name: "upload_photo", hidden: true},
                    {type: "container",name: "photo",      label: "",             inputWidth: 160,    inputHeight: 160, offsetTop: 20, offsetLeft: 65},                        //
                    {type: "input",    name: "kod",        label: _("Kod"),       labelAlign: "left", required: true},
                    {type: "input",    name: "firstname",  label: _("First name"),labelAlign: "left", required: true},
                    {type: "input",    name: "lastname",   label: _("Last name"), labelAlign: "left", required: true},
                    {type: "input",    name: "name",       label: _("Name"),      labelAlign: "left"},
                    {type: "input",    name: "login",      label: _("Login"),     labelAlign: "left"},
                    {type: "password", name: "password",   label: _("Password"),  labelAlign: "left"},
                    {type: "input",    name: "email",      label: _("E-mail"),    labelAlign: "left"},
                    {type: "input",    name: "phone",      label: _("Phone"),     labelAlign: "left"},		 	                                                                        
                    {type: "label",                        label: _("Is worker")},
                    {type: "radio",    name: "is_worker",  label: _("Tak"), value: 1,  checked: true},
                    {type: "radio",    name: "is_worker",  label: _("Nie"),  value: 0},                        
                    {type: "settings", position: "label-left", labelWidth: 110, inputWidth: 160},
                    {type: "block",    name: "buttonblock",inputWidth: 200,    className: "myBlock", list:[
                        {type: "button",   name: "save",   value:_("Zapisz"), offsetTop:18},
                        {type: "newcolumn"},
                        {type: "button",   name: "cancel", value:_("Anuluj"), offsetTop:18}
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