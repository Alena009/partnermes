var pracownicysGrid;
var pracownicyLayout;
var pracownicyForm;

function pracownicyInit(cell) {

	if (pracownicyLayout == null) {
		// init layout
		pracownicyLayout = cell.attachLayout("2U");
		pracownicyLayout.cells("a").hideHeader();
		pracownicyLayout.cells("b").hideHeader();
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
                
		grupyTree.rebuild = function(){
                    var treeStruct = ajaxGet("api/departaments", '', function(data) {                    
                        if (data[0] && data[0].success){      
                            grupyTree.clearAll();
                            grupyTree.loadStruct(data[0].data);                           
                        }                    
                    });                       
                };                
                grupyTree.rebuild();
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
			return true;
		});
		grupyTree.attachEvent("onSelect",function(id, mode){  
                    if (mode) {
			pracownicyGrid.clearAll();
			pracownicyGrid.zaladuj(id);
			return true;                        
                    }
		});

		grupyTree.attachEvent("onCheck",function(id){
			var grupy=grupyTree.getAllChecked();                                            
			pracownicyGrid.clearAll();
			pracownicyGrid.zaladuj(grupy);
			return true;
		});
		pracownicyGrid = pracownicyLayout.cells("b").attachGrid({
			image_path:'codebase/imgs/',
			columns: [{
                label: _("Nazwisko"),
                width: 250,
                id: "lastname",
				type: "ed",
				sort: "str",
				align: "left"
			},{
				label: _("Imię"),
                id: "firstname",
				width: 100,
				type: "ed",
				sort: "str",
				align: "left"
			},{
				label: _("Kod"),
                id: "kod",
				width: 100,
				type: "ed",
				sort: "int",
				align: "right"
			},{
				label: _("Język"),
                id: "language",
				type: "ed",
				sort: "str",
				align: "left"
			}],
			multiselect: true
        });
        //pracownicyGrid.setColumnIds("lastname,firstname,kod,language");
		pracownicyGrid.zaladuj = function(i){
			var ids = Array();
			ids = (typeof i === 'string' || typeof i === 'number')  ? [i] : i;                        
			var new_data = ajaxGet("api/workerslist/" + i, '', function(data){                                     
				if (data[0] && data[0].success){
                                    pracownicyGrid.parse((data[0].data), "js");
                                }
			});                        
                }
		var dpPracownicyGrid = new dataProcessor("api/workerslist",'js');
		dpPracownicyGrid.init(pracownicyGrid);
		dpPracownicyGrid.enableDataNames(true);
		dpPracownicyGrid.setTransactionMode("REST");
		dpPracownicyGrid.enablePartialDataSend(true);
		dpPracownicyGrid.enableDebug(true);
        dpPracownicyGrid.setUpdateMode("row", true);


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
		grupyFormData = [
			{type:"fieldset",  offsetTop:0, label:"Nowa grupa", width:253, list:[                                
				{type:"combo",  name:"parent_id",       label:"Grupa nadrzędna",        options: [{text: "None", value: "0"}], inputWidth: 150},                                
				{type:"input",  name:"pl",    	label:"Nazwa grupy",     	offsetTop:13, 	labelWidth:80},
                                {type:"input",  name:"en",    	label:"Group name (EN)",     	offsetTop:13, 	labelWidth:80},
				{type:"input",  name:"upr",    		label:"Uprawnienie",    	offsetTop:7,	labelWidth:80},
				{type:"button", name:"save",    	value:"Zapisz",   		offsetTop:18},
				{type:"button", name:"cancel",     	value:"Anuluj",   		offsetTop:18}
			]}
		];

		grupyTreeToolBar.attachEvent("onClick", function(id) {                        
			console.log('mainToolbar.onClick',arguments);
			switch (id){
				case 'Add':{
					console.log('Dodaj grupe');
                                        var dhxWins= new dhtmlXWindows();
                                        w1 = dhxWins.createWindow({
                                                id:"w1",
                                                left:20,
                                                top:30,
                                                width:300,
                                                height:350,
                                                center:true,
                                                onClose:function(){

                                                }
                                        });                                       
                                        //initializing form for add/edit/delete departaments
                                        var grupyForm = dhxWins.window("w1").attachForm(grupyFormData, true);
                                        //get combobox from form 
                                        var dhxCombo = grupyForm.getCombo("parent_id");
                                        //loading listrecords for combobox
                                        var tree = ajaxGet("api/departaments", '', function(data) {                    
                                            dhxCombo.addOption(data[0].data);
                                        });                                        
					var parent = grupyTree.getSelectedId();                                   
   
                                        //attaching events on form buttons click
                                        grupyForm.attachEvent("onButtonClick", function(name){
                                            switch (name){
                                                case 'save':{   
                                                        var parameters = {
                                                            parent_id: dhxCombo.getSelectedValue(),
                                                            pl: grupyForm.getItemValue('pl'),
                                                            en: grupyForm.getItemValue('en')
                                                        };
                                                        $.post("api/departaments", parameters, function(data){
                                                            console.log(data);
                                                            grupyTree.addItem(data.id, data.name, data.parent_id); // id, text, pId

                                                        });
                                                };break;
                                                case 'cancel':{
                                                    grupyForm.clear();
                                                };break;
                                            }
                                        });
					//grupyForm.bind(tree);
				};break;
				case 'Edit':{
					console.log('Zmien grupe');
                                        dhxCombo.load({data:[{parent_id:"1"}]});
				};break;
				case 'Del':{
					console.log('Usun grupe');
                                        var id = grupyTree.getSelectedId();
                                        if (id) {
                                            ajaxDelete("api/departaments/" + id,'', function() {
                                                grupyTree.deleteItem(id);                                                    
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
				{id: "Add", type: "button", img: "fa fa-plus-square "},
				{id: "Edit", type: "button", img: "fa fa-edit"},
				{id: "Del", type: "button", img: "fa fa-minus-square"}
			]
		});
		// pracownicyGrid.attachEvent("onRowSelect", pracownicyFillForm);
		// pracownicyGrid.attachEvent("onRowInserted", pracownicyGridBold);
		//
		// // attach form
		// pracownicyForm = pracownicyLayout.cells("c").attachForm([
		// 	{type: "settings", position: "label-left", labelWidth: 110, inputWidth: 160},
		// 	{type: "container", name: "photo", label: "", inputWidth: 160, inputHeight: 160, offsetTop: 20, offsetLeft: 65},
		// 	{type: "input", name: "name",    label: "Name", offsetTop: 20},
		// 	{type: "input", name: "email",   label: "E-mail"},
		// 	{type: "input", name: "phone",   label: "Phone"},
		// 	{type: "input", name: "company", label: "Company"},
		// 	{type: "input", name: "info",    label: "Additional info"}
		// ]);
		// pracownicyForm.setSizes = pracownicyForm.centerForm;
		// pracownicyForm.setSizes();
		// pracownicyGrid.attachEvent("onXLS", function(){
		// 	console.log("pracownicyGrid.onXLS", arguments);
		// 	var grupy=grupyTree.getAllChecked();
		// 	//var args = base64Encode(JSON.stringify(grupy));
		// 	console.log(grupy);
		// 	console.log(JSON.stringify(grupy));
		// 	//console.log(base64Encode(JSON.stringify(grupy)));
		// 	console.log(args);
		// });
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

window.dhx4.attachEvent("onSidebarSelect", function (id, cell) {
	if (id == "pracownicy") pracownicyInit(cell);
});
