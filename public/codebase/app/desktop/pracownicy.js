var pracownicysGrid;
var pracownicyLayout;
var pracownicyForm;

function pracownicyInit(cell) {

	if (pracownicyLayout == null) {
		// init layout
		var pracownicyLayout = cell.attachLayout("3W");
		pracownicyLayout.cells("a").hideHeader();
		pracownicyLayout.cells("b").hideHeader();
                pracownicyLayout.cells("c").hideHeader();                
		pracownicyLayout.cells("a").setWidth(280);
		//console.log(pracownicyLayout.listAutoSizes());
		pracownicyLayout.setAutoSize("a");   
                
		var grupyTree = pracownicyLayout.cells("a").attachTreeView({
			skin: "dhx_skyblue",    // string, optional, treeview's skin
			iconset: "font_awesome", // string, optional, sets the font-awesome icons
			multiselect: false,           // boolean, optional, enables multiselect
			checkboxes: true,           // boolean, optional, enables checkboxes
			dnd: true,           // boolean, optional, enables drag-and-drop
			context_menu: true,           // boolean, optional, enables context menu
			//json: [{id: 1, name: "Produkcja", kids: []}, {id: 2, name: "jkjkjklj"}]
		});
                
		grupyTree.build = function(){
                    var treeStruct = ajaxGet("api/departamentstree", '', function(data) {                    
                        if (data && data.success){      
                            grupyTree.clearAll();                            
                            grupyTree.loadStruct(data.data);                           
                        }                    
                    });                       
                };                
                grupyTree.build();
		grupyTree.attachEvent("onBeforeDrag",function(id){
			console.log("grupyTree.onBeforeDrag", arguments);
			return true;
		});
		grupyTree.attachEvent("onDragOver",function(id){
			console.log("grupyTree.onDragOver", arguments);
			return true;
		});
		grupyTree.attachEvent("onBeforeDrop",function(id){
			console.log("grupyTree.onBeforeDrop", arguments);
			return true;
		});
		grupyTree.attachEvent("onDrop",function(id){
			console.log("grupyTree.onDrop", arguments);
                        var parent_id = arguments[1];
                        parent_id = (parent_id) ? parent_id+'' : 0;
                        var data = {
                            id: id,
                            parent_id: parent_id
                        };                        
                        updateDepartament(id, data);
			return true;
		});
		grupyTree.attachEvent("onSelect",function(id, mode){  
                    if (mode) {
			pracownicyGrid.clearAll();
			pracownicyGrid.zaladuj(id);
                        console.log(id);
			return true;                        
                    }
		});

		grupyTree.attachEvent("onCheck",function(id){
			var grupy=grupyTree.getAllChecked();                                            
			pracownicyGrid.clearAll();
			pracownicyGrid.zaladuj(grupy);
			return true;
		});
		var pracownicyGrid = pracownicyLayout.cells("b").attachGrid({
                    image_path:'codebase/imgs/',
	            columns: [{
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
                        },                          
                        {
                            label: _("Login"),
                            id: "login",
                            type: "ed", 
                            sort: "str",	
                            align: "left"
                        },
                        {
                            label: _("E-mail"),
                            id: "email",
                            width: 100, 
                            type: "ed", 
                            sort: "str", 
                            align: "left"
                        }                        
                    ],
			multiselect: true
                });                        
		pracownicyGrid.zaladuj = function(i){
			var ids = Array();
			ids = (typeof i === 'string' || typeof i === 'number')  ? [i] : i;                        
			var new_data = ajaxGet("api/workerslist/" + i, '', function(data){                                     
				if (data && data.success){
                                    console.log(data.data);
                                    pracownicyGrid.parse((data.data), "js");
                                }
			});                        
                }
		var dpPracownicyGrid = new dataProcessor("api/users", "js");                
		dpPracownicyGrid.init(pracownicyGrid);
		dpPracownicyGrid.enableDataNames(true);
		dpPracownicyGrid.setTransactionMode("REST");
		dpPracownicyGrid.enablePartialDataSend(true);
		dpPracownicyGrid.enableDebug(true);
                dpPracownicyGrid.setUpdateMode("row", true);
                dpPracownicyGrid.attachEvent("onBeforeDataSending", function(id, state, data){
                    console.log(data);
                    data.id = id;
                    updateGridRecord(id, data);
                });
                function updateGridRecord(id, data) {    
                    ajaxGet("api/users/" + id + "/edit", data, function(data){                                                            
                        console.log(data);
                    });
                }
		grupyTreeToolBar = pracownicyLayout.cells("a").attachToolbar({
			iconset: "awesome",
			items: [
				{type: "text", id: "title", text: _("Grupy")},
				{type: "spacer"},
				{id: "Add", type: "button", img: "fa fa-plus-square "},
				{id: "Edit", type: "button", img: "fa fa-edit"},
				{id: "Del", type: "button", img: "fa fa-minus-square"}
			]
		});
		grupyFormAddData = [
			{type:"fieldset",  offsetTop:0, label:_("Nowa grupa"), width:253, list:[                                
				{type:"combo",  name:"parent_id",       label:"Grupa nadrzędna",        options: [{text: "None", value: "0"}], inputWidth: 150},                                
				{type:"input",  name:"name",    	label:"Nazwa grupy",     	offsetTop:13, 	labelWidth:80},                                                                				
				{type:"button", name:"save",    	value:"Zapisz",   		offsetTop:18},
				{type:"button", name:"cancel",     	value:"Anuluj",   		offsetTop:18}
			]}
		];
		grupyFormEditData = [
			{type:"fieldset",  offsetTop:0, label:_("Grupa"), width:253, list:[                                			
				{type:"input",  name:"name",    	label:"Nazwa grupy",     	offsetTop:13, 	labelWidth:80},                                                                				
				{type:"button", name:"save",    	value:"Zapisz",   		offsetTop:18},
				{type:"button", name:"cancel",     	value:"Anuluj",   		offsetTop:18}
			]}
		];                
//                
//                var dpGrupyTree = new dataProcessor("api/departaments", "js");
//                dpGrupyTree.init(grupyTree);
//                dpGrupyTree.setTransactionMode("REST");
                
                function createWindowWithForm(formStruct, height, width){
                    var dhxWins = new dhtmlXWindows();
                    w1 = dhxWins.createWindow({
                            id:"w1",
                            left:20,
                            top:30,
                            width: width,
                            height: height,
                            center:true,
                            caption: _("Dodaj lub zmien grupe"),
                            header: true,
                            onClose:function(){

                            }
                    });
                    //initializing form 
                    return dhxWins.window("w1").attachForm(formStruct, true);         
                }                                         
                               
		grupyTreeToolBar.attachEvent("onClick", function(id) {                        
			console.log('mainToolbar.onClick',arguments);
			switch (id){
				case 'Add':{
					console.log('Dodaj grupe');                                                                               
                                        var grupyForm = createWindowWithForm(grupyFormAddData, 300, 350);
                                        var dhxCombo = grupyForm.getCombo("parent_id");                             
                                        ajaxGet("api/departaments", '', function(data) {                    
                                                dhxCombo.addOption(data.data);
                                        });
                                        //attaching events on form buttons click
                                        grupyForm.attachEvent("onButtonClick", function(name){
                                            switch (name){
                                                case 'save':{                                                           
                                                        ajaxPost("api/departaments", grupyForm.getFormData(), function(data){                                                            
                                                            grupyTree.addItem(data.data.id, data.data.name, data.data.parent_id); // id, text, pId
                                                        });
                                                };break;
                                                case 'cancel':{
                                                    //grupyForm.clear();
                                                };break;
                                            }
                                        });
					//grupyForm.bind(tree);
				};break;
				case 'Edit':{                                        				
                                        var id = grupyTree.getSelectedId(); 
                                        
                                        if (id) {                                            
                                            var data = {
                                                id: id,
                                                name: grupyTree.getItemText(id)
                                            };
                                            var grupyForm = createWindowWithForm(grupyFormEditData, 300, 350);                                                                                       
                                            grupyForm.setFormData(data);                                                                                                                   
                                            grupyForm.attachEvent("onButtonClick", function(name){
                                                switch (name){
                                                    case 'save':{                     
                                                        console.log(grupyForm.getFormData());     
                                                        ajaxGet("api/departaments/" + id +"/edit", grupyForm.getFormData(), function(data) {                                                                                                        
                                                            if (data.success) {
                                                                console.log(data.data);                                             
                                                                grupyTree.setItemText(id, data.data.name);
                                                            }   
                                                        });
                                                    };break;
                                                    case 'cancel':{
                                                        //grupyForm.clear();                                                    
                                                        dhxCombo.selectOption(3);                                            
                                                        
                                                    };break;
                                                }
                                            });
                                        }                                     
				};break;
				case 'Del':{
					console.log('Usun grupe');
                                        var id = grupyTree.getSelectedId();
                                        if (id) {
                                            ajaxDelete("api/departaments/" + id,'', function(data) {
                                                if (data.success) {
                                                    grupyTree.deleteItem(id);                                                    
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
			}
		});

		pracownicyGridToolBar = pracownicyLayout.cells("b").attachToolbar({
			iconset: "awesome",
			items: [
				{type: "text", id: "title", text: _("Pracownicy")},
				{type: "spacer"},
				{id: "Find", type: "button", img: "fa fa-search"},
				{type: "buttonInput", id: "szukaj", text: "Szukaj", width: 100},
				{type: "separator", id: "sep2"},
                                {id: "Cog", type: "button", img: "fa fa-cog "},
                                {type: "separator", id: "sep3"},
				{id: "Add", type: "button", img: "fa fa-plus-square "},
				{id: "Edit", type: "button", img: "fa fa-edit"},
				{id: "Del", type: "button", img: "fa fa-minus-square"}
			]
		});
                
                //adding events to the toolbar on the pracownicy grid
                pracownicyGridToolBar.attachEvent("onClick", function(id) { 
                    switch (id){
		        case 'Add':{
                            console.log('adding mode');                         
                            pracownicyForm.clear();
                            pracownicyLayout.cells("c").expand();
                            pracownicyForm.attachEvent("onButtonClick", function(name){
                                switch (name){
                                    case 'save':{                                                           
                                        saveNewUser(pracownicyForm.getFormData()); 
                                        pracownicyGrid.zaladuj();
                                    };break;
                                    case 'cancel':{
                                        pracownicyForm.updateValues();                   
                                    };break;
                                }
                            }); 
                        };break;
                        case 'Edit':{
                            console.log('edit mode');                            
                            pracownicyForm.attachEvent("onButtonClick", function(name){
                                switch (name){
                                    case 'save':{ 
                                        var userId = pracownicyGrid.getSelectedRowId();
                                        updateUser(userId, pracownicyForm.getFormData());
                                    };break;
                                    case 'cancel':{
                                        pracownicyForm.updateValues();                   
                                    };break;
                                }
                            });                           
                        };break;
                        case 'Del':{
                            //delete user
                            var id = pracownicyGrid.getSelectedRowId();
                            ajaxDelete("api/users/" + id, '', function(data) {
                                if (data.success) {
                                    pracownicyGrid.deleteRow(id);
                                }
                            });
                        };break; 
                        case 'Find': {                            
                            //console.log(searchElem);
                            var searchText = pracownicyGridToolBar.getValue("szukaj");              
                            console.log(searchText);
                            pracownicyGrid.filterBy(1, searchText);                                    
                        };break;
                        case 'Cog': {
                            var departamentID = grupyTree.getSelectedId();
                            if (departamentID) {
                                var dhxWins = new dhtmlXWindows();
                                w1 = dhxWins.createWindow({
                                        id:"w1",
                                        left:20,
                                        top:30,
                                        width: 500,
                                        height: 500,
                                        center:true,
                                        caption: _("Dolanczyc pracownikow do departamentu"),
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
                                            departament_id: departamentID,
                                            user_id: rId
                                        };
                                    if (state) {                                                                            
                                        ajaxPost("api/workerdep", data, '');
                                    } else {
                                        ajaxGet("api/workerdep/del", data, '');
                                    }
                                    pracownicyGrid.zaladuj(departamentID);                                   
                                });
                                ajaxGet("api/workerslist/", '', function(data){                                     
                                    if (data && data.success){ 
                                        //remember array of all workers
                                        var allUsers = data.data;
                                        //asking array of workers for choosen departament
                                        ajaxGet("api/workerslist/" + departamentID, '', function(data2){
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
                
                pracownicyFormStruct = [         
                        {type: "file", name: "upload_photo", hidden: true},
                        {type: "container", name: "photo", label: "", inputWidth: 160, inputHeight: 160, offsetTop: 20, offsetLeft: 65},
                        //{type: "image", name: "photo", imageWidth: 126, imageHeight: 126, url: "../public/uploads/avatars/empty_user.jpg"},    
                        {type: "input",    name: "kod",        label: _("Kod"),       labelAlign: "left",                required: true},
		 	{type: "input",    name: "firstname",  label: _("First name"),labelAlign: "left",                required: true},
                        {type: "input",    name: "lastname",   label: _("Last name"), labelAlign: "left",                required: true},
                        {type: "input",    name: "name",       label: _("Name"),      labelAlign: "left",                required: true},
                        {type: "input",    name: "login",      label: _("Login"),     labelAlign: "left",                required: true},
                        {type: "password", name: "password",   label: _("Password"),  labelAlign: "left",                required: true},
		 	{type: "input",    name: "email",      label: _("E-mail"),    labelAlign: "left",                required: true},
		 	{type: "input",    name: "phone",      label: _("Phone"),     labelAlign: "left"},		 	                                                
                        //{type: "combo",    name: "role",       label: _("User role"), options:[],  required: true, readonly: true},
                        {type: "label",                        label: _("Is worker")},
                        {type: "radio",    name: "is_worker",  label: _("Yes"), value: 1,  checked: true},
                        {type: "radio",    name: "is_worker",  label: _("No"),  value: 0},
                        //{type: "combo",    name: "departament",label: _("Departament"), options:[{text: "--", value: 0}],required: true, readonly: true},                         
                        {type: "settings", position: "label-left", labelWidth: 110, inputWidth: 160},
                        {type: "block",    inputWidth: 200,    className: "myBlock", list:[
                            {type: "button",   name: "save",       value:_("Zapisz"), offsetTop:18},
                            {type: "newcolumn"},
			    {type: "button",   name: "cancel",     value:_("Anuluj"), offsetTop:18}
                        ]}                  
		]; 
                
                pracownikToolBar = pracownicyLayout.cells("c").attachToolbar({
			iconset: "awesome",
			items: [
				{type: "text", id: "title", text: _("Pracownik")},
				{type: "spacer"},				
				{id: "Hide", type: "button", img: "fa fa-arrow-right"}
			]
		});
                //hide cell with form with inforation about worker
                pracownikToolBar.attachEvent("onClick", function(id) { 
                    if (id == 'Hide') {
                        pracownicyLayout.cells("c").collapse();
                    }                    
                });               
                
                var pracownicyForm = pracownicyLayout.cells("c").attachForm(pracownicyFormStruct);                        
                
                pracownicyForm.bind(pracownicyGrid);
                
                pracownicyForm.attachEvent("onChange", function(name, value, state){
                    if (name == 'is_worker') {
                        console.log(name, value);                       
                        pracownicyForm.setRequired("departament", value);                                    
                    }                    
                });                                                        
                                
                pracownicyForm.attachEvent("onButtonClick", function(name){
                    switch (name){
                        case 'save':{                                                           
                            saveNewUser(pracownicyForm.getFormData());
                        };break;
                        case 'cancel':{
                            //pracownicyLayout.cells("c").collapse;
                        };break;
                    }
                });                
                
                pracownicyForm.fillAvatar = function(id = 0) {                    
                    ajaxGet('api/users/avatar/' + id, '', function(data) {
                        var url = data.data;
                        pracownicyForm.getContainer("photo").innerHTML = "<img src='" + url + "' border='0' class='form_photo'>";                        
                    });
                };
                
                pracownicyForm.fillAvatar(); 
                
                //pracownicyGrid.makeFilter(searchElem, 0);
                //pracownicyGrid.makeFilter(searchElem, 1);
                //pracownicyGrid.makeFilter(searchElem, 2);                                 

                pracownicyGrid.attachEvent("onRowSelect", function() { 
                    var selectedId = pracownicyGrid.getSelectedRowId(); 
                    pracownicyForm.fillAvatar(selectedId);  
                });
                
		//Listen when onClick event for container "photo" in pracownicyForm occurs
                var container = pracownicyForm.getContainer("photo");
                if (window.addEventListener) {
                    container.addEventListener("click",onContentClick,false);
                } else {
                    container.attachEvent("onclick",onContentClick);
                }

                //Avatar loading for view
                function onContentClick() {
                    console.log('click');
                    var input = pracownicyForm.getInput("upload_photo");                    
                    input.onchange = e => { 
                        var file = e.target.files[0]; 
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            pracownicyForm.getContainer("photo").innerHTML = "<img src='" + e.target.result + "' border='0' class='form_photo'>";                                                                                
                        };
                        reader.onerror = function(event) {
                            console.error(_("File can`t be read! ") + event.target.error.code);
                        };
                        reader.readAsDataURL(file);                          
                    };                    
                    input.click();                                         
                };
                
                function saveNewUser(data) {                    
                    userOperation("api/users", data);                   
                }
                
                function updateUser(userId, data) {
                    var query = "api/users/" + userId + "/edit";
                    
                    userOperation(query, data);                   
                }
                 
                function userOperation(query, data) {
                    var input = pracownicyForm.getInput("upload_photo");                    
                    var file = input.files[0];
                    data = pracownicyForm.getFormData();
                    
                    ajaxPost(query, data, function(data){                                                            
                        if (data.success) {
                            if (file) {
                                var headers = {'Content-Type': 'multipart/form-data; charset=utf-8; boundary=' + Math.random().toString().substr(2)};
                                var formData = new FormData();
                                var id = data.data.id;
                                formData.append("image", file);                        
                                ajaxPost('api/users/avatar/load/' + id, formData, function(data) {console.log(data)}, headers);                      
                            };       
                        }
                    });                     
                }
                 
		 pracownicyGrid.attachEvent("onXLS", function(){
		 	console.log("pracownicyGrid.onXLS", arguments);
		 	var grupy=grupyTree.getAllChecked();
		 	//var args = base64Encode(JSON.stringify(grupy));
		 	console.log(grupy);
		 	console.log(JSON.stringify(grupy));
		 	//console.log(base64Encode(JSON.stringify(grupy)));
		 	console.log(args);
		 });
	}

	pracownicyGrid.zaladuj(0);

}

function pracownicyFillForm(id) {
	// update form
	var data = pracownicyForm.getFormData();
	for (var a in data) {
		var index = pracownicyGrid.getColIndexById(a);
		if (index != null && index >= 0) data[a] = String(pracownicyGrid.cells(id, index).getValue()).replace(/\&amp;?/gi, "&");
	}
	pracownicyForm.setFormData(data);
	// change photo
	var img = pracownicyGrid.cells(id, pracownicyGrid.getColIndexById("photo")).getValue(); // <img src=....>
	var src = img.match(/src=\"([^\"]*)\"/)[1];
	pracownicyForm.getContainer("photo").innerHTML = "<img src='imgs/pracownicy/big/" + src.match(/[^\/]*$/)[0] + "' border='0' class='form_photo'>";
}

function pracownicyGridBold(r, index) {
	pracownicyGrid.setCellTextStyle(pracownicyGrid.getRowId(index), pracownicyGrid.getColIndexById("name"), "font-weight:bold;border-left-width:0px;");
	pracownicyGrid.setCellTextStyle(pracownicyGrid.getRowId(index), pracownicyGrid.getColIndexById("photo"), "border-right-width:0px;");
}

function updateDepartament(id, data) {
    console.log(data);
    ajaxGet("api/departaments/" + id + "/edit?", data, function(data){                                                            
    //grupyTree.addItem(data.id, data.name, data.parent_id); // id, text, pId
        console.log(data);
    });    
}

window.dhx4.attachEvent("onSidebarSelect", function (id, cell) {
	if (id == "pracownicy") {
            window.history.pushState({'page_id': id}, null, '#pracownicy');
            pracownicyInit(cell);      
        }       
});
