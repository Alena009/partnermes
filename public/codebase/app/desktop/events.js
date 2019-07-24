var eventsDataView;
var eventsLayout;
var eventsMap;

function eventsInit(cell) {
	
	if (eventsLayout == null) {		
		// init layout
		var eventsLayout = cell.attachLayout("2U");                  
                eventsLayout.cells("a").hideHeader();
		eventsLayout.cells("b").hideHeader();                
		eventsLayout.cells("a").setWidth(380);		                
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
				{type: "buttonInput", id: "szukaj", text: "", width: 100},
                                {type: "separator", id: "sep2"},                                
                                {id: "Add", type: "button", img: "fa fa-plus-square "},
                                {id: "Edit", type: "button", img: "fa fa-edit"},
                                {id: "Del", type: "button", img: "fa fa-minus-square"}                                 
			]
		}); 
                
                var productsGrid = eventsLayout.cells("b").attachGrid({
                    image_path:'codebase/imgs/',
                    columns: [
                        {
                            label: _("Grupa"),
                            width: 100,
                            id: "group_name",
                            type: "ro",                                             
                            sort: "str", 
                            align: "left"
                        },
                        {
                            label: _("Produkt"),
                            width: 100,
                            id: "product_name",
                            type: "ro", 
                            sort: "str", 
                            align: "left"
                        },
                        {
                            label: _("Produkt kod"),
                            width: 100,
                            id: "product_kod",
                            type: "ro", 
                            sort: "str", 
                            align: "left"
                        },                        
                        {
                            label: _("Data"),
                            id: "created_at",
                            width: 60, 
                            type: "ro", 
                            sort: "str", 
                            align: "left"
                        },                         
                        {
                            label: _("Ilosc"),
                            id: "amount",
                            width: 60, 
                            type: "dyn", 
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
                productsGrid.fill(0);
                //productsGrid.setColumnColor("white,white,white,#d5f1ff");
                productsGrid.setInitWidths("200,*,*,100,*");
                productsGrid.attachFooter(
                    [_("Ilosc: "),"#cspan","#cspan","#cspan","#stat_total"],
                    ["text-align:right;","text-align:center"]
                );
                var dpProductsGrid = new dataProcessor("api/warehouse", "js");                
		    dpProductsGrid.init(productsGrid);
		    dpProductsGrid.enableDataNames(true);
		    dpProductsGrid.setTransactionMode("REST");
		    dpProductsGrid.enablePartialDataSend(true);
		    dpProductsGrid.enableDebug(true);
                    dpProductsGrid.setUpdateMode("row", true);
                    dpProductsGrid.attachEvent("onBeforeDataSending", function(id, state, data){
                        console.log(data);
                        data.id = id;
                        ajaxGet("api/warehouse/" + id + "/edit", data, function(data){                                                            
                            console.log(data);
                        });
                    });        
        
                var productsGridToolBar = eventsLayout.cells("b").attachToolbar({
                    iconset: "awesome",
                    items: [
                        {type: "text", id: "title", text: _("Produkty")},
                        {type: "spacer"},
                        {type: "text", id: "find", text: _("Find:")},				
                        {type: "buttonInput", id: "szukaj", text: "", width: 100},
                        {type: "separator", id: "sep2"},                                
                        {id: "Add", type: "button", img: "fa fa-plus-square "},
                        {id: "Edit", type: "button", img: "fa fa-edit"},
                        {id: "Del", type: "button", img: "fa fa-minus-square"}                                
                    ]
		}); 
                productsGridToolBar.attachEvent("onClick", function(name){
                    switch (name){
                        case 'Add':{
                            var addingForm = createWindowWithForm(addingFormStruct, _("Dodaj informacje"), 300, 400);
                            var productGroupsCombo = addingForm.getCombo("product_group_id"); 
                            
                            addingForm.adjustParentSize();                            
                            productGroupsCombo.enableFilteringMode(true);  
                            //filling combobox with products groups
                            ajaxGet("api/prodgroups", '', function(data) {                    
                                    productGroupsCombo.addOption(data.data);
                            });
                            //occurs when some value has selected in the products groups combobox
                            productGroupsCombo.attachEvent("onChange", function(value, text){
                                var selectedGroupId = productGroupsCombo.getSelectedValue();
                                var productsCombo = addingForm.getCombo("product_id"); 
                                productsCombo.enableFilteringMode(true); 
                                ajaxGet("api/products/listbygroups/" + selectedGroupId, '', function(data) {                    
                                    productsCombo.addOption(data.data);
                                }); 
                                //occurs when some value has selected in the products combobox
                                productsCombo.attachEvent("onChange", function(value, text){                                     
                                    var selectedProductId = productsCombo.getSelectedValue();
                                    ajaxGet("api/warehouse/amountproduct/" + selectedProductId, '', function(data) {                    
                                       addingForm.setItemValue('available_amount', data.data); 
                                    });                            
                                });                                 
                            }); 
                            //attaching events to the button addingForm
                            addingForm.attachEvent("onButtonClick", function(name){
                                switch(name){
                                        case 'save':{                                                           
                                            var data = addingForm.getFormData();
                                            data.amount = data.amount * addingForm.getItemValue("type_operation");
                                            ajaxPost("api/warehouse", data, function(data) {                    
                                                if (data.success) {
                                                    productsGrid.fill(0);
                                                }
                                            });
                                        };break;
                                        case 'cancel':{
                                            
                                        };break;
                                    }
                            });
                        };break;
                        case 'Edit':{
                            var selectedRow = productsGrid.getRowIndex(productsGrid.getSelectedRowId());     
                            console.log(selectedRow);
                            productsGrid.selectCell(selectedRow,4,false,true,true);                            
                        };break;
                        case 'Del':{
                            var selectedRow = productsGrid.getSelectedRowId();     
                            ajaxDelete('api/warehouse/' + selectedRow, '', function(data){
                                if (data.success) {
                                    productsGrid.deleteRow(selectedRow);
                                }
                            });
                        };break;
                    }
                });                
                
                var addingFormStruct = [
                    {type:"fieldset",  offsetTop: 0, offsetBottom: 20, label:_("Informacja"), width:350, list:[                                			
                        {type: "settings", position: "label-left", labelWidth: 110, inputWidth: 160},		
                        //{type: "input", name: "kod",              required: true, label: _("Kod pozycji")},
                        {type: "combo", name: "type_operation",   required: true, label: _("Operacja"), options: [
                                {text: _("Dodaj do magazynu"), value: "1"},
                                {text: _("Zabierz z magazynu"), value: "-1"}
                        ]},
                        {type: "combo", name: "product_group_id", required: true, label: _("Grupa"), options: []},
                        {type: "combo", name: "product_id",       required: true, label: _("Produkt"), options: []},
                        {type: "input", name: "available_amount", readonly: true, label: _("Ilość dostępna")},
                        {type: "input", name: "amount",           required: true, label: _("Ilosc")},
                        {type: "block", blockOffset: 0, position: "label-left", list: [
			    {type: "button", name: "save",   value: _("Zapisz"), offsetTop:18},
			    {type: "newcolumn"},
			    {type:"button", name:"cancel", value: _("Anuluj"), offsetTop:18}
	                ]}
                    ]}
                ]; 
                
                
                
                function createWindowWithForm(formStruct, caption, height, width){
                    var dhxWins = new dhtmlXWindows();
                    w1 = dhxWins.createWindow({
                            id:"w1",
                            left:20,
                            top:30,
                            width: width,
                            height: height,
                            center:true,
                            caption: _(caption),
                            header: true,
                            onClose:function(){

                            }
                    });
                    //initializing form 
                    return dhxWins.window("w1").attachForm(formStruct, true);         
                }                 

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