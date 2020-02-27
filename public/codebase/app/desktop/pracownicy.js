var pracownicysGrid;
var pracownicyLayout;
var pracownicyForm;

function pracownicyInit(cell) {
	if (pracownicyLayout == null) {
                var userData = JSON.parse(localStorage.getItem("userData")); 
                var write;
                userData.permissions.forEach(function(elem){
                    if (elem.name == 'pracownicy') {
                        write = elem.pivot.value;
                    }
                });
		// init layout
		var pracownicyLayout = cell.attachLayout("3W");		    
                    pracownicyLayout.cells("a").setText(_("Grupy pracownikow"));                    
		    pracownicyLayout.cells("b").setText(_("Pracownicy"));
                    pracownicyLayout.cells("c").setText(_("Informacja o pracowniku"));
		    pracownicyLayout.cells("a").setWidth(280);		
		    pracownicyLayout.setAutoSize("a");   
/**
 * A 
 *
 */                
		var grupyTree = pracownicyLayout.cells("a").attachTreeView({
			skin: "dhx_web",    // string, optional, treeview's skin
			iconset: "font_awesome", // string, optional, sets the font-awesome icons
			multiselect: false,           // boolean, optional, enables multiselect
			checkboxes: true,           // boolean, optional, enables checkboxes
			dnd: true,           // boolean, optional, enables drag-and-drop
			context_menu: true           // boolean, optional, enables context menu			
		});                  
                grupyTree.build = function(){
                    var treeStruct = ajaxGet("api/departaments/grupytree", '', function(data) {                    
                        if (data && data.success){      
                            grupyTree.clearAll();                            
                            grupyTree.loadStruct(data.data);                           
                        }                    
                    });                       
                };                
                grupyTree.build();                
		grupyTree.attachEvent("onDrop",function(id){
                    //console.log("grupyTree.onDrop", arguments);
                    var parent_id = arguments[1];
                    parent_id = (parent_id) ? parent_id+'' : '';
                    var data = {
                        id: id,
                        parent_id: parent_id
                    };            
                    ajaxGet("api/departaments/" + id + "/edit?", data, function(data){                                                            
                        console.log(data);
                    }); 
                    return true;
		});                
		grupyTree.attachEvent("onSelect",function(id, mode){  
                    if (mode) {
                        var grupy=grupyTree.getAllChecked();                                            
                        grupy[grupy.length]=id;
			pracownicyGrid.zaladuj(grupy);                        
			return true;                        
                    }
		});
		grupyTree.attachEvent("onCheck",function(id){
			var grupy=grupyTree.getAllChecked();                                            			
			pracownicyGrid.zaladuj(grupy);
			return true;
		});
                if (write) {
                    var grupyTreeToolBar = pracownicyLayout.cells("a").attachToolbar(standartToolbar);  
                } else {
                    var grupyTreeToolBar = pracownicyLayout.cells("a").attachToolbar(emptyToolbar);
                }
                grupyTreeToolBar.attachEvent("onClick", function(id) {                        		
			switch (id){
                            case 'Add':{			                                        
                                    createAddEditGroupWindow("api/departaments", "api/departaments", grupyTree, 0);
                            };break;
                            case 'Edit':{
                                var id = grupyTree.getSelectedId();
                                if (id) {                                        
                                    createAddEditGroupWindow("api/departaments", "api/departaments/" + id + "/edit", grupyTree, id);
                                }
                            };break;
                            case 'Del':{
                                var id = grupyTree.getSelectedId();
                                if (id) {
                                    deleteNodeFromTree(grupyTree, "api/departaments/" + id);
                                }
                            };break; 
                            case 'Redo': {                                
                                    grupyTree.build();                                
                            };break;                        
			}
		});   
/**
 * B
 * 
 */                
                if (write) {
                    var pracownicyGridToolBar = pracownicyLayout.cells("b").attachToolbar({
                            iconset: "awesome",
                            items: [
                                    {id: "Add",  type: "button", text: _("Dodaj"),   img: "fa fa-plus-square "},
                                    {id: "Edit", type: "button", text: _("Edytuj"), img: "fa fa-edit"},
                                    {id: "Del",  type: "button", text: _("Usuń"),   img: "fa fa-minus-square"},
                                    {type: "separator", id: "sep2"},  
                                    {id: "Cog", type: "button",  text: _("Dodaj do departamentu"), img: "fa fa-spin fa-cog "},                              
                                    {type: "separator", id: "sep3"},
                                    {id: "Redo", type: "button", text: _("Odśwież"), img: "fa fa-refresh"}
                            ]
                    }); 
                } else {
                    var pracownicyGridToolBar = pracownicyLayout.cells("b").attachToolbar(emptyToolbar);                     
                }
                pracownicyGridToolBar.attachEvent("onClick", function(id) { 
                    switch (id){
                        case 'Add':{                            
                            pracownicyForm.clear();  
                            pracownicyForm.setItemFocus("kod");
                            pracownicyForm.fillAvatar(0);
                            pracownicyForm.showItem("buttonblock");
                            pracownicyLayout.cells("c").expand();                              
                        };break;
                        case 'Edit':{
                            pracownicyLayout.cells("c").expand();   
                            pracownicyForm.setItemFocus("kod");                                                      
                        };break;
                        case 'Del':{                            
                            var id = pracownicyGrid.getSelectedRowId();
                            if (id) {
                                pracownicyGrid.delete("api/users/" + id, id);
                            } else {
                                dhtmlx.alert({
                                    title:_("Wiadomość"),
                                    type:"alert",
                                    text:_("Wybierz pracownika, którego chcesz usunąć!")
                                });
                            }
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
                                        ajaxGet("api/workerdep/"+departamentID+"/deleteworker/"+rId, '', '');
                                    }
                                    pracownicyGrid.zaladuj(departamentID);                                   
                                });
                                ajaxGet("api/workerdep/0/workers", '', function(data){                                     
                                    if (data && data.success){ 
                                        //remember array of all workers
                                        var allUsers = data.data;
                                        //asking array of workers for choosen departament
                                        ajaxGet("api/workerdep/"+departamentID+"/workers", '', function(data2){
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

                            } else {
                                dhtmlx.alert({
                                    title:_("Wiadomość"),
                                    type:"alert",
                                    text:_("Wybierz departament, do którego chcesz dodać pracownikow!")
                                });
                            }
                        };break;
                        case 'Redo': {                                
                                grupyTree.unselectItem(grupyTree.getSelectedId());
                                grupyTree.getAllChecked().forEach(function(elem){
                                    grupyTree.uncheckItem(elem);
                                });                                   
                                pracownicyGrid.zaladuj(0);                                
                        };break;
                    }
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
                            label: _("User name"),
                            id: "name",
                            width: 100, 
                            type: "ed", 
                            sort: "str",	
                            align: "left"
                        }                      
                    ]
                });        
                pracownicyGrid.attachHeader("#text_filter,#text_filter,#text_filter");
		pracownicyGrid.zaladuj = function(i = 0){
                    this.clearAll();
                    var ids = Array();
                    ids = (typeof i === 'string' || typeof i === 'number')  ? [i] : i;                        
                    var new_data = ajaxGet("api/workerdep/" + ids + "/workers", '', function(data){                                     
                            if (data && data.success){
                                pracownicyGrid.parse((data.data), "js");
                            }
                    });                     
                };                
//		var dpPracownicyGrid = new dataProcessor("api/users", "js");                
//                dpPracownicyGrid.init(pracownicyGrid);
//                dpPracownicyGrid.enableDataNames(true);
//                dpPracownicyGrid.setTransactionMode("REST");                
//                dpPracownicyGrid.enableDebug(true);
//                dpPracownicyGrid.setUpdateMode("row", true);
//                dpPracownicyGrid.attachEvent("onBeforeDataSending", function(id, state, data){
//                    data.id = id;                    
//                    ajaxGet("api/users/" + id + "/edit", data, function(data){                                                            
//                        console.log(data);
//                    });
//                });                    
                pracownicyGrid.zaladuj(0);            
/**
 * C 
 * 
 */                

                var pracownikFormStruct = [         
                            {type: "file",     name: "upload_photo", hidden: true},
                            {type: "container",name: "photo",      label: "",             inputWidth: 160,    inputHeight: 160, offsetTop: 20, offsetLeft: 65},                        //
                            {type: "input",    name: "kod",        label: _("Kod"),       labelAlign: "left", required: true},
                            {type: "input",    name: "firstname",  label: _("First name"),labelAlign: "left", required: true},
                            {type: "input",    name: "lastname",   label: _("Last name"), labelAlign: "left", required: true},
                            {type: "input",    name: "name",       label: _("User name"), labelAlign: "left"},
                            {type: "input",    name: "login",      label: _("Login"),     labelAlign: "left", required: true},
                            {type: "password", name: "password",   label: _("Password"),  labelAlign: "left", required: true},
                            {type: "combo",    name: "country",    label: _("Kraj"),  options:[]},
                            {type: "combo",    name: "language",   label: _("Język"), options:[]},
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
                var pracownicyForm = pracownicyLayout.cells("c").attachForm(pracownikFormStruct);               
                pracownicyForm.bind(pracownicyGrid); 
                pracownicyForm.attachEvent("onButtonClick", function(name){
                    switch (name){
                        case 'save':{                                                           
                            var data = pracownicyForm.getFormData();
                            var userId = data.id;
                            if (userId){
                                ajaxGet("api/users/" + userId + "/edit", data, function(data){
                                    if (data && data.success){
                                        dhtmlx.alert({
                                            title:_("Wiadomość"),
                                             text:_("Zapisane!")
                                        });
                                    }
                                });    
                                if (grupyTree.getSelectedId()) {
                                    pracownicyGrid.zaladuj(grupyTree.getSelectedId());                                
                                } else {
                                    pracownicyGrid.zaladuj(0);                                
                                }
                            } else {
                                userOperation("api/users", data);
                            }
                        };break;
                    }
                });    
                var countryCombo = pracownicyForm.getCombo("country");
                var languageCombo = pracownicyForm.getCombo("language");
                ajaxGet('api/country', '', function(data){
                    if (data && data.success) {
                        countryCombo.addOption(data.data);
                    }
                });                
                ajaxGet('api/language', '', function(data){
                    if (data && data.success) {
                        languageCombo.addOption(data.data);
                    }
                });
                pracownicyForm.fillAvatar = function(id = 0) {                    
                    ajaxGet('api/users/avatar/' + id, '', function(data) {
                        var url = data.data;
                        pracownicyForm.getContainer("photo").innerHTML = "<img src='" + url + "' border='0' class='form_photo'>";                        
                    });
                };                
                pracownicyForm.fillAvatar();                
                
		//Listen when onClick event for container "photo" in pracownicyForm occurs
                var container = pracownicyForm.getContainer("photo");
                if (window.addEventListener) {
                    container.addEventListener("click",onContentClick,false);
                } else {
                    container.attachEvent("onclick",onContentClick);
                }

                //Avatar loading for view
                function onContentClick() {
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
                            dhtmlx.alert({
                                title:_("Wiadomość"),
                                 text:_("Zapisane!")
                            });
                        } else {
                            dhtmlx.alert({
                                title:_("Wiadomość"),
                                text:_("Błąd! Zmiany nie zostały zapisane!")
                            });
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
                 
                if (!write) { pracownicyForm.hideItem("buttonblock"); }                 
  
	}                
}

//function pracownicyFillForm(id) {
//	// update form
//	var data = pracownicyForm.getFormData();
//	for (var a in data) {
//		var index = pracownicyGrid.getColIndexById(a);
//		if (index != null && index >= 0) data[a] = String(pracownicyGrid.cells(id, index).getValue()).replace(/\&amp;?/gi, "&");
//	}
//	pracownicyForm.setFormData(data);
//	// change photo
//	var img = pracownicyGrid.cells(id, pracownicyGrid.getColIndexById("photo")).getValue(); // <img src=....>
//	var src = img.match(/src=\"([^\"]*)\"/)[1];
//	pracownicyForm.getContainer("photo").innerHTML = "<img src='imgs/pracownicy/big/" + src.match(/[^\/]*$/)[0] + "' border='0' class='form_photo'>";
//}

//function pracownicyGridBold(r, index) {
//	pracownicyGrid.setCellTextStyle(pracownicyGrid.getRowId(index), pracownicyGrid.getColIndexById("name"), "font-weight:bold;border-left-width:0px;");
//	pracownicyGrid.setCellTextStyle(pracownicyGrid.getRowId(index), pracownicyGrid.getColIndexById("photo"), "border-right-width:0px;");
//}

window.dhx4.attachEvent("onSidebarSelect", function (id, cell) {
	if (id == "pracownicy") {
            window.history.pushState({'page_id': id}, null, '#pracownicy');
            pracownicyInit(cell);      
        }       
});
