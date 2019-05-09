function createGrupyTree(parent,grid){
    var grupyZTree = parent.attachTreeView({
        skin: "dhx_terrace",  // string, optional, treeview's skin
        iconset: "font_awesome", // string, optional, sets the font-awesome icons
        multiselect: false,           // boolean, optional, enables multiselect
        checkboxes: true,           // boolean, optional, enables checkboxes
        dnd: true,           // boolean, optional, enables drag-and-drop
        context_menu: true,           // boolean, optional, enables context menu
    });
    // grupyZTree.attachEvent("onBeforeDrag",function(id){
    //     console.log("grupyTree.onBeforeDrag", arguments);
    //     return true;
    // });		
    // grupyZTree.attachEvent("onDragOver",function(id){
    //     console.log("grupyTree.onDragOver", arguments);
    //     return true;
    // });
    // grupyZTree.attachEvent("onBeforeDrop",function(id){
    //     console.log("grupyTree.onBeforeDrop", arguments);
    //     return true;
    // });
    // grupyZTree.attachEvent("onDrop",function(id){
    //     console.log("grupyTree.onDrop", arguments);
    //     return true;
    // });
    // grupyZTree.attachEvent("onDblClick",function(id){
    //     console.log("grupyTree.onDblClick", arguments);
        
    //     return true;
    // });		
    grupyZTree.attachEvent("onSelect",function(id){
        grid.clearAll();
        grid.zaladuj(id);
        return true;
    });	

    grupyZTree.attachEvent("onCheck",function(id){
        var grupy=grupyZTree.getAllChecked();
        grid.clearAll();
        grid.zaladuj(grupy);
        return true;
    });	
    grupyZTree.getValues = function(){
        var ids =this.getSelectedId(),
            id = (ids>0 ? ids:0),
            parent = this.getParentId(id),
            upr = this.getUserData(id, "upr"),
            a = {'ids':ids,'id':id,'text':this.getItemText(id),'parent':parent,'upr':upr}
        console.log(a);
        return a;
    }
    grupyZTreeToolBar = zleceniaLayout.cells("a").attachToolbar({
        iconset: "awesome",
        items: [
            {type: "text", id: "title", text: _("Grupy")},
            {type: "spacer"},
            {id: "Add", type: "button", img: "fa fa-plus-square "},
            {id: "Edit", type: "button", img: "fa fa-edit"},
            {id: "Del", type: "button", img: "fa fa-minus-square"}
        ]
    });

    grupyZTreeToolBar.attachEvent("onClick", function(btn) {
        console.log('mainToolbar.onClick',arguments);
        switch (btn){
            case 'Add':{
                //console.log('Dodaj grupe');
                var parent = grupyZTree.getSelectedId();
                    id = grupyZTree.getSelectedId();
                    w1 = zleceniaLayout.dhxWins.createWindow({
                        id:"w1",
                        left:20,
                        top:30,
                        width:345,
                        height:270,
                        center:true,
                        resize: false,
                        caption: 'Nowa grupa',
                        modal: true,
                        onClose:function(){
                            
                        }
                    });
                    w1.button('stick').hide();
                    w1.button('help').hide();
                    w1.button('park').hide();
                    w1.button('minmax').hide();
                    //w1.button('dock').hide();

                    grupyZForm = w1.attachForm([
                        {type:"settings",position:"label-left",labelWidth:160,inputWidth:120, labelAlign:"left"},
                        {type:"hidden",  name:"id",    		label:""},
                        {type:"hidden",  name:"parent",    		label:"", value:parent},
                        {type:"input",  name:"text",    		label:"Nazwa grupy",required:true,maxLength:30,selected: true},
                        {type:"input",  name:"opis",    		label:"Opis",rows:3,maxLength:120},
                        {type:"checkbox",  name:"upr",    			label:"Uprawnienie domyślne",labelWidth:160,inputWidth:50,checked:true},
                        {type: "block", width:"*", offsetLeft:30,offsetTop:30, list: [
                            {name:'save', type: "button", width:100,value: "Zapisz"},
                            {type: "newcolumn"},
                            {name:'cancel', type: "button", width:100, value: "Anuluj"}
                        ]}
                    ], true);	
                    grupyZForm.attachEvent("onButtonClick", function(id){
                        switch (id){
                            case 'save': {
                                window.dhx4.callEvent("onTreeGrupySave", [0,grupyZForm.getFormData()]);
                                w1.close();
                                break;
                            }
                            case 'cancel': w1.close();break;
                        }
                    });
            };break;
            case 'Edit':{
                var parent = grupyZTree.getSelectedId();
                    id = grupyZTree.getSelectedId();
                    w1 = zleceniaLayout.dhxWins.createWindow({
                        id:"w1",
                        left:20,
                        top:30,
                        width:345,
                        height:270,
                        center:true,
                        resize: false,
                        caption: 'Edytuj grupę',
                        modal: true,
                    });
                    w1.button('stick').hide();
                    w1.button('help').hide();
                    w1.button('park').hide();
                    w1.button('minmax').hide();
                    grupyZForm = w1.attachForm([
                        {type:"settings",position:"label-left",labelWidth:160,inputWidth:120, labelAlign:"left"},
                        {type:"hidden",  name:"id",    		label:"",value:id},
                        {type:"hidden",  name:"parent",    		label:""},
                        {type:"input",  name:"text",    		label:"Nazwa grupy",required:true,maxLength:30,selected: true},
                        {type:"input",  name:"opis",    		label:"Opis",rows:3,maxLength:120},
                        {type:"checkbox",  name:"upr",    			label:"Uprawnienie domyślne",labelWidth:160,inputWidth:50,checked:true},
                        {type: "block", width:"*", offsetLeft:30,offsetTop:30, list: [
                            {name:'save', type: "button", width:100,value: "Zapisz"},
                            {type: "newcolumn"},
                            {name:'cancel', type: "button", width:100, value: "Anuluj"}
                        ]}
                    ], true);
                    grupyZForm.bind(grupyZTree);
                    grupyZForm.attachEvent("onButtonClick", function(btn2){
                        switch (btn2){
                            case 'save': {
                                window.dhx4.callEvent("onTreeGrupySave", [id,grupyZForm.getFormData()]);
                                w1.close();
                                break;
                            }
                            case 'cancel': w1.close();break;
                        }
                    });
                };break;
            case 'Del':{
                console.log('Usun grupe');
            };break;
        }
    });
    var dpGrupyTree = new dataProcessor("zlecenia/grupy/");
    dpGrupyTree.init(grupyZTree);
    dpGrupyTree.setTransactionMode("REST");

    return grupyZTree;
}
