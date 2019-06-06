var zleceniaGrid;
var zleceniaLayout;
var zleceniaForm;

function zleceniaInit(cell) {   

	if (zleceniaLayout == null) {
		// init layout
		zleceniaLayout = cell.attachLayout("2U");
		zleceniaLayout.cells("a").hideHeader();
		zleceniaLayout.cells("b").hideHeader();
		zleceniaLayout.cells("a").setWidth(280);
		//console.log(pracownicyLayout.listAutoSizes());
		zleceniaLayout.setAutoSize("a");
		var grupyTree = zleceniaLayout.cells("a").attachTree();
		grupyTree.setImagePath("codebase/imgs/dhxtree_web/");		
		//'codebase/imgs/dhxtree_web/'
		//grupyTree.enableSmartXMLParsing(true);
		grupyTree.enableDragAndDrop(true);
		grupyTree.setDragBehavior('complex');
		grupyTree.enableKeyboardNavigation(true);
		grupyTree.enableItemEditor(true);
		grupyTree.enableCheckBoxes(true);
		grupyTree.enableAutoSavingSelected(true);
		grupyTree.enableTreeImages(true);
		grupyTree.enableTreeLines(true);
		
		grupyTreeToolBar = zleceniaLayout.cells("a").attachToolbar({
			iconset: "awesome",
			items: [
				{type: "text", id: "title", text: _("Grupy")},
				{type: "spacer"},
				{id: "Add", type: "button", img: "fa fa-plus-square "},
				{id: "Edit", type: "button", img: "fa fa-edit"},
				{id: "Del", type: "button", img: "fa fa-minus-square"}
			]
		});
		grupyTreeToolBar.attachEvent("onClick", function(btn) {
			switch (btn){
				case 'Add':{
					var id = grupyTree.getSelectedItemId(),
						parent = grupyTree.getParentId(id) || 0;
						
					grupyTree.insertNewItem(id || parent,'_new',"nowa grupa");
					grupyTree.selectItem('_new');
					grupyTree.editItem('_new');
				};break;
				case 'Edit':{
					var id = grupyTree.getSelectedItemId(),
						parent = grupyTree.getParentId(id) || 0;
						if(id){
							grupyTree.focusItem(id);
							grupyTree.editItem(id);
						}
					};break;
				case 'Del':{
					var id = grupyTree.getSelectedItemId(),
						parent = grupyTree.getParentId(id) || 0;
						if(id){							
							var ch = grupyTree.getSubItems(id);
							grupyTree.deleteItem(id,true);
							ch = ch.split(',');
							for (k=0;k<ch.length;k++){
								i=ch[k];
								grupyTree.moveItem(i,'item_child',parent);
							};
						}
				};break;
			}
		});		
		grupyTree.attachEvent("onSelect",function(id){
			var ids = grupyTree.getAllChecked();
			ids = ids.split(',');
			ids[ids.length]=id;
			zleceniaGrid.clearAll();
			zleceniaGrid.zaladuj(ids.join('|'));
			return true;
		});
		grupyTree.attachEvent("onCheck",function(){
			var id=grupyTree.getSelectedItemId(), 
				ids = grupyTree.getAllChecked();
			ids = ids.split(',');
			ids[ids.length]=id;
			zleceniaGrid.clearAll();
			zleceniaGrid.zaladuj(ids.join('|'));
			return true;
		});							
		var dpGrupyTree = new dataProcessor("zlecenia/grupy/id/");
		dpGrupyTree.init(grupyTree);
		dpGrupyTree.setTransactionMode("REST");
		dpGrupyTree.attachEvent("onBeforeUpdate", function(id, state, data){
			//console.log(arguments);//your code here
			if (data.tr_id=='_new' && (data.tr_text=="nowa grupa" || data.tr_text=='') && state=='inserted')
				return false;
			else{
				return true;
			}
		});

		dpGrupyTree.attachEvent("onAfterUpdate", function(id, action, tid, response){
			console.log('onAfterUpdate',arguments);
			if (response.action!='error'){
				if (id!=response.id && action=='inserted')  grupyTree.changeItemId(id,response.id);
			}
			
		});

		dpGrupyTree.defineAction("error",function(tag){
			console.log('defineAction.error',tag);
			alert(tag.error);
			return false;
		});
		grupyTree.zaladuj = function(i=null){
			var ids = Array();
			ids = (typeof i === 'string' || typeof i === 'number')  ? [i] : i;
			var new_data = ajaxGet("zlecenia/grupytree/",i!=null ? 'parent='+ids.join('|'): '',function(data){
				if (data[0] && data[0].tree){
					var d = data[0].tree;
					grupyTree.parse(d, "json");
					//parse(d,'json');
                }
            });			
		}

		zleceniaGrid = zleceniaLayout.cells("b").attachGrid({
			image_path:'codebase/imgs/',
			columns: [{
				label: "Zlecenie",
				id:'zlecenie',
				width: 320,
				type: "edtxt",
				sort: "str",
				align: "left"
			},{
				label: "Produkt",
				id:'produkt',
				width: 200,
				type: "combo",
				sort: "str",
				align: "left"
			},{
				label: "Produkt KOD",
				id:'produktKod',
				width: 200,
				type: "ro",
				sort: "str",
				align: "left"
			},{
				label: "Kod",
				id:'kod',
				width: 200,
				type: "edtxt",
				sort: "str",
				align: "center"
			},{
				label: "Zamknięte",
				id:'zamkniete',
				width: 40,
				type: "ch",
				sort: "int",
				align: "center"
			},{
				label: "Szt",
				id:'szt',
				width: 60,
				type: "edn",
				sort: "str",
				align: "right"
			},{
				label: "Data dodania",
				id:'data_dodania',
				width: "120",
				type: "dhxCalendarA",
				sort: "date",
				align: "center"
			},{
				label: "Data zamkniecia",
				id:'data_zamkniecia',
				width: "120",
				type: "dhxCalendarA",
				sort: "date",
				align: "center"
			},{
				label: "KW Wys",
				id:'data_wysylki',
				width: "60",
				type: "edn",
				sort: "int",
				align: "center"
			},{
				label: "Plan start",
				id:'plan_start',
				width: "120",
				type: "dhxCalendarA",
				sort: "date",
				align: "center"
			},{
				label: "Plan stop",
				id:'plan_stop',
				width: "120",
				type: "dhxCalendarA",
				sort: "date",
				align: "center"
			},{
				label: "Opis",
				id:'opis',
				width: "300",
				type: "edtxt",
				sort: "int",
				align: "left"
			}],
			multiselect: true
		});
		combo = zleceniaGrid.getColumnCombo(1);
		combo.enableFilteringMode(true);
		combo.load("produkty/all");
		zleceniaGrid.setDateFormat("%Y-%m-%d","%Y-%m-%d");
		//zleceniaGrid.enablePaging(true,15,5,document.body,true,"recInfoArea");
		//console.log(zleceniaGrid.getColumnCombo(5));
		//zleceniaGrid.setColTypes('edtxt','combo','ro','edtxt','edn','edtxt');
		//zleceniaGrid.setSubTree(treeGrupy, 2);
		zleceniaGrid.attachHeader("#text_filter,#select_filter,#text_filter,#text_search,#select_filter,#numeric_filter,#text_search,#text_search,#text_search,#text_search,#text_search,#text_search");
		zleceniaGrid.setColumnIds("zlecenie,produkt,produktKod,kod,zamkniete,szt,data_dodania,data_zamkniecia,data_wysylki,plan_start,plan_stop,opis");
		zleceniaGrid.setColValidators(["NotEmpty","","","NotEmpty","","ValidInteger"]);
		zleceniaGrid.enableMultiselect(true); 
		zleceniaGrid.enableEditEvents(false,true,true);
		//grupyTree = createGrupyTree(zleceniaLayout.cells("a"),zleceniaGrid);


		zleceniaGrid.zaladuj = function(i){
			var ids = Array();
			ids = (typeof i === 'string' || typeof i === 'number')  ? [i] : i;
			var new_data = ajaxGet("zlecenia/all/",'grupy='+ids.join('|'),function(data){
				if (data[0] && data[0].data){
					var d = data[0].data;
                    zleceniaGrid.parse(d, "js");
                }
            });			
		}

		var dpZleceniaGrid = new dataProcessor("zlecenia/zlecenie/",'json');
		dpZleceniaGrid.init(zleceniaGrid);
		dpZleceniaGrid.enableDataNames(true);
		dpZleceniaGrid.setTransactionMode("REST");
		dpZleceniaGrid.enablePartialDataSend(true);
		dpZleceniaGrid.enableDebug(true);
		dpZleceniaGrid.setUpdateMode("row", true);
		zleceniaGrid.attachEvent("onFilterStart", function(indexes,values){
			console.log(arguments);
			return true;
		});
		zleceniaGridToolBar = zleceniaLayout.cells("b").attachToolbar({
			iconset: "awesome",
			items: [
				{type: "text", id: "title", text: _("Zamowienia")},
				{type: "spacer"},
				{id: "Find", type: "button", img: "fa fa-search"},
				{type: "buttonInput", id: "szukaj", text: "Szukaj", width: 100},
				{type: "separator", id: "sep2"},
				{id: "Add", type: "button", img: "fa fa-plus-square "},
				{id: "Edit", type: "button", img: "fa fa-edit"},
				{id: "Del", type: "button", img: "fa fa-minus-square"}
			]
		});		
		zleceniaGridToolBar.attachEvent("onClick", function(btn) {
			console.log(btn);
			switch (btn){
				case 'Add':{
					//zleceniaGrid.setActive(true);
					//zleceniaGrid.selectCell(1,0);
					// var rowId=zleceniaGrid.uid();
					// zleceniaGrid.setActive(true);
					// zleceniaGrid.addRow(rowId,["","","","",""],0);
					// zleceniaGrid.editCell(rowId,1);
					// console.log(zleceniaGrid.getSelectedCellIndex()+'x'+zleceniaGrid.getSelectedRowId());
					(arguments[0]||window.event).cancelBubble=true;
					//zleceniaGrid.selectRow(2);
					zleceniaGrid.selectCell(2,4,false,true);
					zleceniaGrid.editCell();
					//zleceniaGrid.cells(1,0).setBgColor('red'); 
					//myGrid.selectCell(rowIndex,cellIndex);
					//myGrid.editCell();	
					//console.log(zleceniaGrid.getRowId(0));
					//zleceniaGrid.forEachCell(1,function(cellObj,ind){
					//	console.log('forEachCell',arguments);	
					//});
					console.log(zleceniaGrid.getSelectedCellIndex()+'x'+zleceniaGrid.getSelectedRowId());
				};break;
				case 'Edit':{
					};break;
				case 'Del':{
				};break;
			}
		});		
		zleceniaGrid.attachEvent("onSelectStateChanged", function(indexes,values){
			console.log('onSelectStateChanged',arguments);
			//console.log(zleceniaGrid.getSelectedCellIndex()+'x'+zleceniaGrid.getSelectedRowId());
			return true;
		});

	}
	grupyTree.zaladuj();
	zleceniaGrid.zaladuj(0);
}

window.dhx4.attachEvent("onSidebarSelect", function (id, cell) {
	if (id == "zlecenia") {           
            window.history.pushState({'page_id': id}, null, '#zlecenia');
            //zleceniaInit(cell);
        }        
});
