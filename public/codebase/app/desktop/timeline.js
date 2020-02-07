var scheduler;
var timelineLayout;

function timelineInit(cell) {
	
    if (timelineLayout == null) {        
        var userData = JSON.parse(localStorage.getItem("userData")); 
        var userCanWrite;
        userData.permissions.forEach(function(elem){
            if (elem.name == 'timeline') {
                userCanWrite = elem.pivot.value;
            }
        });        
        
        var timelineLayout = cell.attachLayout("1C");
        timelineLayout.cells("a").hideHeader();
        timelineLayout.cells("a").showInnerScroll();
        
        var operationsGridToolBar;       
        userCanWrite ? operationsGridToolBar = timelineLayout.cells("a").attachToolbar(standartToolbar):
                    operationsGridToolBar = timelineLayout.cells("a").attachToolbar(emptyToolbar);   
        operationsGridToolBar.attachEvent("onClick", function(id) {
            switch (id){
                case 'Add': {
                    var windowForm     = createWindow(_("Operacja"), 500, 500);
                    var operationForm  = createForm(newOperationFormStruct, windowForm); 
                    operationForm.hideItem("done_amount");
                    operationForm.setItemValue("done_amount", "0");
                    var usersCombo     = operationForm.getCombo("user_id");
                    var positionsCombo = operationForm.getCombo("order_position_id");
                    var tasksCombo     = operationForm.getCombo("task_id");                    
                    operationForm.attachEvent("onChange", function(name, value, state){
                        if (name == 'for_order') {
                            if (state) {
                                operationForm.hideItem("order_position_id");
                                ajaxGet("api/tasks/notfororder", "", function(data){
                                    tasksCombo.clearAll();
                                    tasksCombo.addOption(data.data);                            
                                });
                            } else {
                                operationForm.showItem("order_position_id");
                            }
                        }
                    });                    
                    ajaxGet("api/users/freeusers", "", function(data){
                        usersCombo.addOption(data.data);
                        usersCombo.selectOption(0);
                    });      
                    ajaxGet("api/positions/getPrinted", "", function(data){
                        positionsCombo.addOption(data.data);                        
                    });   
                    positionsCombo.attachEvent("onClose", function(){
                        var positionId = positionsCombo.getSelectedValue();
                        ajaxGet("api/positions/tasks/" + positionId, "", function(data){
                            tasksCombo.clearAll();
                            tasksCombo.addOption(data.data);                            
                        });                           
                    });                    
                    tasksCombo.attachEvent("onClose", function(){
                        var data = {};
                        data.order_position_id = positionsCombo.getSelectedValue();
                        data.task_id = tasksCombo.getSelectedValue();
                        ajaxGet("api/operations/taskchange", data, function(data){
                            if (data.success) {
                                operationForm.setItemValue("start_amount", data.data);                                
                            } else {
                                operationForm.setItemValue("start_amount", "0");
                            }
                        });                                                  
                    });                     
                    operationForm.setItemValue("end_date", new Date());
                    operationForm.attachEvent("onButtonClick", function(name){
                        if (name === 'save'){          
                            addOperation(operationForm.getFormData(), operationsGrid);                           
                        }
                    });                                
                };break;
                case 'Edit': {
                    var selectedId = operationsGrid.getSelectedRowId();
                    if (selectedId) {
                        var operationData  = operationsGrid.getRowData(selectedId);
                        if (operationData.closed == 1) {                            
                            dhtmlx.alert({
                                title:_("Wiadomość"),
                                text:_("Operacja jest zamknięta, nie można zmienić!")
                            });                             
                        } else {
                            var windowForm     = createWindow(_("Operacja"), 500, 500);
                            var operationForm  = createForm(operationFormStruct, windowForm);                                                                     
                            operationForm.setFormData(operationData);             
                            var data = {};
                            data.order_position_id = operationData.order_position_id;
                            data.task_id = operationData.task_id;
                            ajaxGet("api/operations/taskchange", data, function(data){
                                if (data.success) {
                                    operationForm.setItemValue("start_amount", data.data);                                
                                }
                            });  
                            operationForm.attachEvent("onButtonClick", function(name){
                                if (name === 'save'){  
                                    editOperation(selectedId, operationForm.getFormData(), operationsGrid);                              
                                    windowForm.close();
                                }
                            });    
                        }
                    } else {
                        dhtmlx.alert({
                            title:_("Wiadomość"),
                            text:_("Wybierz operację, którą chcesz zmienić!")
                        });                            
                    }
                };break;
                case 'Del': {                               
                    var selectedId = operationsGrid.getSelectedRowId();
                    if (selectedId) {
                        var operationData = operationsGrid.getRowData(selectedId);                    
//                        if (operationData.closed == 1) {                            
//                            dhtmlx.alert({
//                                title:_("Wiadomość"),
//                                text:_("Operacja jest zamknięta, nie można usunąć!")
//                            });                             
//                        } else {
                            dhtmlx.confirm({
                                title: _("Ostrożność"),                                    
                                text: _("Czy na pewno chcesz usunąć?"),
                                callback: function(result){
                                    if (result) {                                                                                    
                                        ajaxDelete("api/operations/" + selectedId, "", function(data){
                                            if (data && data.success){
                                                operationsGrid.deleteRow(selectedId);
                                            } else {
                                                dhtmlx.alert({
                                                    title:_("Wiadomość"),
                                                    text:_("Nie udało się usunąć!")
                                                });
                                            }
                                        });   
                                    }
                                }
                            });
                        //}
                    } else {
                        dhtmlx.alert({
                            title:_("Wiadomość"),
                            text:_("Wybierz klienta, informacje o którym chcesz usunąć!")
                        });                            
                    }                                
                };break;
                case 'Redo': {
                    operationsGrid.fill("api/operations");                                                            
                };break;                        
            }
        });        
        var operationsGrid = timelineLayout.cells("a").attachGrid({
            image_path:'codebase/imgs/',
            columns: [                                
                {label: _("Zadanie"),                  id: "task_name",          width: 100,type: "ro", sort: "str", align: "left"},
                {label: _("Pracownik"),                id: "user_name",          width: 150,type: "ro", sort: "str", align: "left"},
                {label: _("Zamówienie"),               id: "order_kod",          width: 100, type: "ro", sort: "str", align: "left"},                        
                {label: _("Zlecenie"),                 id: "zlecenie",           width: 100,type: "ro", sort: "str", align: "left"},
                {label: _("Produkt Kod"),              id: "product_kod",        width: 150,type: "ro", sort: "str", align: "left"},                
                {label: _("Zamknięte"),                id: "closed",             width: 50, type: "ch", align: "left"},                
                {label: _("Zrbiona iłość"),            id: "done_amount",        width: 50,type: "ro", sort: "str", align: "left"},
                {label: _("Data start"),               id: "start_date",         width: 150,type: "ro", sort: "str", align: "left"},
                {label: _("Data end"),                 id: "end_date",           width: 150,type: "ro", sort: "str", align: "left"},
                {id: "start_amount"},
                {id: "order_position_id", width: 50},
                {id: "task_id", width: 50}
            ]                   
        });  
        operationsGrid.attachHeader("#select_filter,#select_filter,#select_filter," + 
                                     "#select_filter,#text_filter,#select_filter");             
        operationsGrid.fill("api/operations");
    }
}

function addOperation(data, grid) {
    ajaxPost("api/operations", data, function(data){                                                                                                        
        if (data && data.success) {
            grid.addRow(data.data.id, '');
            grid.setRowData(data.data.id, data.data);
            dhtmlx.alert({
                title:_("Wiadomość"),
                text:_("Zapisane!")
            });                                        
        } else {
            dhtmlx.alert({
                title:_("Wiadomość"),
                text:data.message
            });
        }                                          
    });      
}

function editOperation(id, data, grid) {
    ajaxGet("api/operations/" + id + "/edit", data, function(data){                                                                                                        
        if (data && data.success) { 
            grid.setRowData(data.data.id, data.data);
            dhtmlx.alert({
                title:_("Wiadomość"),
                text:_("Zapisane!")
            });
        } else {
            dhtmlx.alert({
                title:_("Wiadomość"),
                text:_("Błąd! Zmiany nie zostały zapisane")
            });
        }                                          
    });    
}

var newOperationFormStruct = [        
    {type:"fieldset",  offsetTop:0, label:_("Dodaj lub zmien"), width:253, list:[                                	    
        {type: "settings", position: "label-left", labelWidth: 110, inputWidth: 160},
        {type: "combo",    name: "user_id",           required: true, label: _("Pracownik"), options: []},		
        {type: "checkbox", name: "for_order",         label: _("Nie ma zlecenia")},		
        {type: "combo", name: "order_position_id", label: _("Zlecenie"), options: []},		
        {type: "combo", name: "task_id",           required: true, label: _("Zadanie"), options: []},		
        {type: "input", name: "start_amount",      required: true, label: _("Zadeklarowana iłość"), readonly: true},
        {type: "input", name: "done_amount",       label: _("Zrobiona iłość")},                                     
        {type: "block", blockOffset: 0, position: "label-left", list: [
            {type: "button", name: "save",   value: "Zapisz", offsetTop:18}                            
        ]}
    ]}  
];

var operationFormStruct = [        
    {type:"fieldset",  offsetTop:0, label:_("Dodaj lub zamknij"), width:253, list:[                                	    
        {type: "settings", position: "label-left", labelWidth: 110, inputWidth: 160},
        {type: "input",    name: "user_name",    required: true, label: _("Pracownik"),           readonly: true},		        
        {type: "input",    name: "zlecenie",                     label: _("Zlecenie"),            readonly: true},		
        {type: "input",    name: "task_name",    required: true, label: _("Zadanie"),             readonly: true},		
        {type: "input",    name: "start_amount", required: true, label: _("Zadeklarowana iłość"), readonly: true},
        {type: "input",    name: "done_amount",                  label: _("Zrobiona iłość")},          
        {type: "block", blockOffset: 0, position: "label-left", list: [
            {type: "button", name: "save",   value: "Zamkni", offsetTop:18}                            
        ]}
    ]}  
];

window.dhx4.attachEvent("onSidebarSelect", function(id, cell){
	if (id == "timeline"){
                window.history.pushState({'page_id': id}, null, '#timeline');
		timelineInit(cell);
	}
});













//////var scheduler;
////var timelineLayout;
////
////function timelineInit(cell) {	
////    if (timelineLayout == null) {     
////        var timelineLayout = cell.attachLayout("1C");
////        timelineLayout.cells("a").hideHeader();
////  
////        var sTabs = '<div class="dhx_cal_tab" name="day_tab" style="right:204px;"></div>'+
////                    '<div class="dhx_cal_tab" name="week_tab" style="right:200px;"></div>'+
////                    '<div class="dhx_cal_tab" name="month_tab" style="right:200px;"></div>'+
////                    '<div class="dhx_cal_tab" name="grid_tab" style="left:240px;"></div>' + 
////                    '<div class="dhx_cal_tab" name="timeline_tab" style="right:256px;"></div>'+
////                    '<div class="dhx_minical_icon" name="minical_tab" id="dhx_minical_icon" onclick="show_minical()">&nbsp;</div>';
////
//////        var elements = [ // original hierarhical array to display
//////                {key:10, label:"Web Testing Dep.", open: true, children: [
//////                        {key:20, label:"Elizabeth Taylor"},
//////                        {key:30, label:"Managers",  children: [
//////                                {key:40, label:"John Williams"},
//////                                {key:50, label:"David Miller"}
//////                        ]},
//////                        {key:60, label:"Linda Brown"},
//////                        {key:70, label:"George Lucas"}
//////                ]},
//////                {key:110, label:"Human Relations Dep.", open:true, children: [
//////                        {key:80, label:"Kate Moss"},
//////                        {key:90, label:"Dian Fossey"}
//////                ]}
//////        ];
////        //Create scheduler views
////        ajaxGet("api/departaments/scheduler", "", function(data2){
////            if (data2 && data2.success){
////                console.log(data2.data);
////                var elements = scheduler.serverList("departamentsTree", data2.data);
////            }
////            scheduler.createTimelineView({
////                 name:"timeline",
////                 x_unit:"minute", // measuring unit of the X-Axis.
////                 x_date:"%H:%i",  // date format of the X-Axis
////                 x_step:30,       // X-Axis step in 'x_unit's
////                 x_size:24,       // X-Axis length specified as the total number of 'x_step's
////                 x_start:16,      // X-Axis offset in 'x_unit's
////                 x_length:48,     // number of 'x_step's that will be scrolled at a time
////                 y_unit: elements,
////                 y_property:"user_id", // mapped data property
////                 render:"tree"             // view mode
////            }); 
//////            //scheduler parse
//////            scheduler.parse([
//////                    { start_date: "2019-10-16 09:00", end_date: "2019-10-16 12:00", text:"Task A-12458", user_id:10},
//////                    { start_date: "2019-10-16 10:00", end_date: "2019-10-16 16:00", text:"Task A-89411", user_id:20},
//////                    { start_date: "2019-10-16 10:00", end_date: "2019-10-16 14:00", text:"Task A-64168", user_id:30},
//////                    { start_date: "2019-10-16 16:00", end_date: "2019-10-16 17:00", text:"Task A-46598", user_id:40},
//////                    { start_date: "2019-10-16 12:00", end_date: "2019-10-16 20:00", text:"Task B-48865", user_id:120},
//////                    { start_date: "2019-10-16 14:00", end_date: "2019-10-16 16:00", text:"Task B-44864", user_id:10},
//////                    { start_date: "2019-10-16 16:30", end_date: "2019-10-16 18:00", text:"Task B-46558", user_id:10},
//////                    { start_date: "2019-10-16 18:30", end_date: "2019-10-16 20:00", text:"Task B-45564", user_id:20},
//////                    { start_date: "2019-10-16 08:00", end_date: "2019-10-16 12:00", text:"Task C-32421", user_id:30},
//////                    { start_date: "2019-10-16 14:30", end_date: "2019-10-16 16:45", text:"Task C-14244", user_id:40},
//////                    { start_date: "2019-10-16 09:20", end_date: "2019-10-16 12:20", text:"Task D-52688", user_id:120},
//////                    { start_date: "2019-10-16 11:40", end_date: "2019-10-16 16:30", text:"Task D-46588", user_id:130},
//////                    { start_date: "2019-10-16 12:00", end_date: "2019-10-16 18:00", text:"Task D-12458", user_id:120}
//////            ], "json");               
////            ajaxGet("api/operations", "" , function(data) {
////                if(data && data.success) {                
////                    console.log(data.data);
////
////                    scheduler.clearAll();
////                    scheduler.parse(data.data, "json");
////                } 
////            }); 
////        });        
////        
////        scheduler.createGridView({
////            fields:[
////                //{id:"user_id",width:100, align:'right', sort:'int'},
////                {id:"zlecenie",width:100, align:'right', sort:'int'},
////                {id:"user_name",width:'*',align:'left'},
////                {id:"task_name",width:'*',align:'left'},                
////                {id:"ruckmeld",width:'*',align:'left'},
////                {id:"start_date",width:180},
////                {id:"end_date",width:180}
////            ],
////            select:true,
////            paging:true
////        });                
////        //Scheduler config
////        scheduler.config.xml_date="%Y-%m-%d %H:%i";
////        scheduler.config.lightbox.sections=[	
////                {name:"description", height:50, map_to:"text", type:"textarea" , focus:true},
////                {name:"custom", height:30, type:"timeline", options:null , map_to:"section_id" }, //type should be the same as name of the tab
////                {name:"time", height:72, type:"time", map_to:"auto"}
////        ];
////        scheduler.templates.grid_single_date = function(date){
////                var formatFunc = scheduler.date.date_to_str("%Y-%m-%d %H:%i");
////                return formatFunc(date); 
////        };
////        //Initialization of scheduler
////        timelineLayout.cells("a").attachScheduler(null, "timeline", sTabs);
////                 
////      
////    }
////}
////
////window.dhx4.attachEvent("onSidebarSelect", function(id, cell){
////	if (id == "timeline"){
////                window.history.pushState({'page_id': id}, null, '#timeline');
////		timelineInit(cell);
////	}
////});
//
//
//
//var scheduler;
//var timelineLayout;
//
//function timelineInit(cell) {
//	
//    if (timelineLayout == null) {
//     
//        // init layout
//        var timelineLayout = cell.attachLayout("1C");
//        timelineLayout.cells("a").hideHeader();
//        timelineLayout.cells("a").showInnerScroll();
//
//        scheduler.config.details_on_create=true;
//        scheduler.config.details_on_dblclick=true;
//        scheduler.config.xml_date="%Y-%m-%d %H:%i";
//        scheduler.config.show_loading = true;
//        scheduler.config.multi_day = true;
//        scheduler.config.time_step = 1;
//        
//        ajaxGet("api/positions/forprod", "", function(data){
//            console.log(data.data);
//            if (data && data.success) {
//                scheduler.updateCollection("zlecenia", data.data);
//            }
//        });  
//        ajaxGet("api/tasks", "", function(data){
//            console.log(data.data);
//            if (data && data.success) {
//                scheduler.updateCollection("zadania", data.data);
//            }
//        });
//        
//        scheduler.config.lightbox.sections=[	
//            {name:"Pracownik",  type:"timeline", 
//                options:scheduler.serverList("users") , map_to:"user_id" }, //type should be the same as name of the tab
//            {name:"Zlecenie", type:"combo", filtering:true, 
//                options:scheduler.serverList("zlecenia"), 
//                map_to:"order_position_id", 
//                onchange:changeZlecenia}, 
//            {name:"Zadanie", type:"combo", filtering:true, 
//                options:scheduler.serverList("zadania"), 
//                map_to:"task_id",
//                onchange:changeZadania},             
////            {name:"Zadanie",  type:"select", options:[],    
////                map_to:"task_id",
////                onchange:changeZadania}, 
////            {name:"Ruckmeld", type:"ruckmeldEditor", 
////                map_to:"ruckmeld", onchange:changeRuckmeld},
//            {name:"Zadeklarowano",      type:"textarea",  
//                map_to:"start_amount", height:50},
//            {name:"Zrobiono",      type:"sztEditor",  
//                map_to:"done_amount"},    
//            {name:"Zamknięte", map_to:"closed", type:"checkbox", 
//                checked_value: "1", unchecked_value: "0", height:40 }
//        ];           
//        //scheduler.config.buttons_right = ["dhx_cancel_btn", "dhx_close_btn", "dhx_save_btn",];
//        scheduler.config.buttons_right = ["dhx_cancel_btn", "dhx_save_btn",];
//        scheduler.config.buttons_left = ["dhx_delete_btn"];   
//        //scheduler.locale.labels["dhx_close_btn"] = _("Close");    
//        scheduler.attachEvent("onLightbox", function(){
//           var declared = scheduler.formSection("Zadeklarowano");
//           declared.control.disabled = true;
//           scheduler.formSection("Zrobiono").setValue("0");           
//           var cb = document.querySelector(".dhx_cal_wide_checkbox input");
//           cb.disabled = true;
//        });        
//        scheduler.attachEvent("onLightboxButton", function(button_id, node, e){
//            if(button_id == "dhx_close_btn"){               
//                var evId = scheduler.getState().lightbox_id;               
//                var data = {};
//                data.done_amount = scheduler.formSection('Zrobiono').getValue();    
//                data.closed = 1;
//                console.log(data);
//                ajaxGet("api/operations/" + evId + "/edit", data, function(data) {
//                    if(data && data.success) {               
//                        console.log(data);
//                    } else {
//                        dhtmlx.alert({
//                            title:_("Wiadomość"),
//                            text:_(data.message)
//                        });
//                    }
//                });                
//            }
//        });        
//        var update_select_options = function(select, options) { // helper function                 
//                select.options.length = 0;
//                for (var i=0; i<options.length; i++) {
//                        var option = options[i];
//                        select[i] = new Option(option.label, option.id);
//                }
//        }; 
//        var update_template_value = function(value) {
//            //var template = scheduler.formSection('template').control;
//            //template.innerText = value;
//        };
////        scheduler.attachEvent("onBeforeLightbox", function(id){                      
////            update_select_options(scheduler.formSection('Zadanie').control, []);           
////            return true;
////        });        
//        function changeZlecenia(el){
////            var me = this;
////            console.log(this.getSelectedValue());
////            ajaxGet("api/positions/"+this.getSelectedValue(), "",
////                {
////                    'success':function(data){                            
////                        scheduler.formSection('Zadeklarowano').setValue(data.data.amount);	
////                        
////                    },
////                    'failure':function(data){
//////                            me.ev.zlecenie='';
//////                            me.ev.id_zlecenie='';
//////                            if(me.nextSibling) me.nextSibling.value = "BRAK ZLECENIA!!!";				
////                    }
////                }
////            );
//        }
//        function changeZadania(el){
//            console.log(this);
//            console.log(arguments);       
//            //console.log(this.selectedOptions[0].value);
//            var me = this;
//            console.log(this.getSelectedValue());
//            var data = {};
//            data.order_position_id = scheduler.formSection('Zlecenie').getValue();
//            data.task_id = this.getSelectedValue();
//            ajaxGet("api/operations/taskchange", data,
//                {
//                    'success':function(data){                            
//                        scheduler.formSection('Zadeklarowano').setValue(data.data);	
//                        
//                    },
//                    'failure':function(data){
////                            me.ev.zlecenie='';
////                            me.ev.id_zlecenie='';
////                            if(me.nextSibling) me.nextSibling.value = "BRAK ZLECENIA!!!";				
//                    }
//                }
//            );            
//            //update_template_value(this.selectedOptions[0].innerText);
//        }        
//        function changeRuckmeld(){
//            var me = this;
//            ajaxGet("api/zlecenia/duration/"+this.value,
//                {
//                        'success':function(data){
//                                if(me.nextSibling && data[0].ruckmeld!==undefined) me.nextSibling.value = data[0].ruckmeld;				
//                                me.ev.ruckmeld=data[0].ruckmeld;	
//                                me.ev.ruckmeld=data[0].ruckmeld;	
//                        },
//                        'failure':function(data){
//                                me.ev.ruckmeld='';
//                                me.ev.id_zlecenie='';
//                                if(me.nextSibling) me.nextSibling.value = "BRAK OPERACJI!!!";				
//                        }
//                }
//            );
//        }
//        function changeSzt(){
//
//        }
//        scheduler.form_blocks["zlecenieEditor"] = {
//                render:function(sns) {
//                        return "<div class='dhx_cal_ltext doubleEditor'><input type='text'><input type='text'  disabled readonly></div>";
//                },
//                set_value:function(node, value, ev, r) {
//                        var el = node.firstChild; 
//                        console.log('zlecenieEditor.set_value',arguments);
//                        if (r.onchange) {
//                                el.onchange = r.onchange, el.ev = ev;
//                        }else{
//                                el.onchange = undefined;
//                        }
//                        el.value = value || "";
//                        node.childNodes[1].value = ev.zlecenie || "";
//                },
//                get_value:function(node, ev) {
//                        return node.childNodes[0].value;
//                },
//                focus:function(node) {
//                        var a = node.childNodes[0];
//                        a.select();
//                        a.focus();
//                }
//
//        };
//        scheduler.form_blocks["ruckmeldEditor"] = {
//                render:function(sns) {
//                        return "<div class='dhx_cal_ltext doubleEditor'><input type='text'><input type='text'  disabled readonly></div>";
//                },
//                set_value:function(node, value, ev, r) {
//                        console.log('ruckmeldEditor.set_value',arguments);
//                        var el = node.firstChild; 
//                        if (r.onchange) {
//                                el.onchange = r.onchange, el.ev = ev;
//                        }else{
//                                el.onchange = undefined;
//                        }
//                        el.value = value || "";
//                        node.childNodes[1].value = ev.ruckmeldText || "";
//                },
//                get_value:function(node, ev) {
//                        return node.firstChild.value;
//                },
//                focus:function(node) {
//                        var a = node.firstChild; 
//                        a.select();
//                        a.focus();
//                }
//
//        };
//        scheduler.form_blocks["sztEditor"] = {
//                render:function() {
//                        console.log(arguments);
//                        return "<div class='dhx_cal_ltext'><input type='number'></div>";
//                },
//                set_value:function(node, value, ev, r) {
//                        var el = node.firstChild; 
//                        if (r.onchange) {
//                                el.onchange = r.onchange, el.ev = ev;
//                        }else{
//                                el.onchange = undefined;
//                        }
//                        el.value = value || "";
//                },
//                get_value:function(node, ev) {
//                        return node.firstChild.value;
//                },
//                focus:function(node) {
//                        var a = node.firstChild; 
//                        a.select();
//                        a.focus();
//                }
//
//        };
//              
//        scheduler.attachEvent("onEventSave",function(id,ev,is_new){
//            console.log(ev);
//                if (!ev.task_id) {
//                        alert("Choose the task");
//                        return false;
//                } else {                    
//                    ajaxGet("api/operations/save", ev, function(data) {
//                        if(data && data.success) {               
//                            console.log(data);
//                        } else {
//                            dhtmlx.alert({
//                                title:_("Wiadomość"),
//                                text:_(data.message)
//                            });
//                        }
//                    }); 
//                }
//            return true;
//        });
//        scheduler.attachEvent("onEventChanged", function(id,ev){
//            console.log(ev);
//        });        
//        scheduler.attachEvent("onEventDeleted", function(id,ev){
//            ajaxDelete("api/operations/" + id, "", function(data){
//                if (data && data.success){
//                    dhtmlx.alert({
//                        title:_("Wiadomość"),
//                        text:_("Usunięte!")
//                    });
//                } else {
//                    dhtmlx.alert({
//                        title:_("Wiadomość"),
//                        text:_("Nie udało się usunąć!")
//                    });
//                }
//            }); 
//        });
//               
//        ajaxGet("api/departaments/scheduler", "", function(data2){
//            if (data2 && data2.success){
//                var usersList = scheduler.serverList("users", data2.data);
//            }
//            scheduler.createTimelineView({
//                    section_autoheight: false,
//                    name:	"timeline",
//                    x_unit:	"minute",
//                    x_date:	"%H:%i",
//                    x_step:	60,
//                    x_size: 24,
//                    //x_start: 05,
////                    first_hour:10,
////    last_hour:18,
//                    //x_length: 24,
//                    //event_dy: 24,
//                    y_unit: usersList,
//                    y_property: "user_id",			
//                    render: "tree",
//                    dx: 300,
//                    folder_dy:24,
//                    dy:24
//            }); 
//            ajaxGet("api/operations", "" , function(data) {
//                if(data && data.success) {               
//                    scheduler.clearAll();
//                    scheduler.parse(data.data, "json");
//                } 
//            }); 
//        });
//
//        scheduler.createGridView({
//            fields:[
//                {id:"user_name",width:'*',align:'left'},
//                {id:"zlecenie",width:100, align:'right'},                
//                {id:"kod",width:100, align:'right'},                
//                {id:"task_name",width:'*',align:'left'},                
//                {id:"start_amount",width:'*',align:'left'},
//                {id:"done_amount",width:'*',align:'left'},
//                {id:"start_date",width:'*'},
//                {id:"end_date",width:'*'}
//            ],
//            select:true,
//            paging:true
//        });
//  
//        var sTabs = '<div class="dhx_cal_tab" name="day_tab" style="right:204px;"></div>'+
//                    '<div class="dhx_cal_tab" name="week_tab" style="right:200px;"></div>'+
//                    '<div class="dhx_cal_tab" name="month_tab" style="right:200px;"></div>'+
//                    '<div class="dhx_cal_tab" name="grid_tab" style="left:240px;"></div>' + 
//                    '<div class="dhx_cal_tab" name="timeline_tab" style="right:256px;"></div>'+
//                    '<div class="dhx_minical_icon" name="minical_tab" id="dhx_minical_icon" onclick="show_minical()">&nbsp;</div>';
//                     
////        var schedulerDP = new dataProcessor("api/operations", "js"); 
////        schedulerDP.init(scheduler); 
////        //schedulerDP.setTransactionMode("JSON");     
////        schedulerDP.setTransactionMode("REST");
//
//
//
////    scheduler.on_load = function (loader) {
////            var evs;
////            
////            if (loader.xmlDoc.status == 200) {
////                console.log(loader);
////                    if (this._process && this._process == "json") {
////                            var str = loader.xmlDoc.responseText;
////                            var data = (window.JSON && JSON.parse("["+str+"]")) ? JSON.parse("["+str+"]") : false;
////                            var success = (data && data[0] && data[0].success) ? (data[0].success) : false;
////                            evs = this[this._process].parse(str);
////                            data = (data[0])?data[0]:data;
////                    } else if (this._process && this._process != "xml") {
////                            evs = this[this._process].parse(loader.xmlDoc.responseText);
////                    } else {
////                            evs = this._magic_parser(loader);
////                    }
////                    if (evs && success){
////                            scheduler._process_loading(evs);
////                    }else if (data && !success && data.code==402){
////                            loginFormShow();
////                    }else{
////                            console.log('COŚ NIE TAK Z WCZYTYWANIEM!');
////                    }
////            } else {
////                    alert("ERROR!!! \n \n System Error code: " + loader.xmlDoc.status);
////            }
////
////            this.callEvent("onXLE", []);
////    }; 
//
////        scheduler.templates.grid_single_date = function(date){
////                var formatFunc = scheduler.date.date_to_str("%Y-%m-%d %H:%i");
////                return formatFunc(date); 
////        };
////        scheduler.templates.timeline_tooltip = function(start,end,event){
////                console.log(event);
////                return event.text2;
////        };
////		
//        scheduler.templates.tooltip_text = function(start,end,event) {
//                return "<b>Pracownik :</b> "+event.user_name+"<br/>"
//                    +"<b>Zadanie:</b> "+event.kod+"-"+event.task_name+"<br/>"
//                    +"<b>Zlecenie :</b> "+event.order_position+"<br/>"                                
//                    +"<b>Wymagana iłość :</b> "+event.start_amount+"<br/>"                                    
//                    +"<b>Zrobiona iłość :</b> "+event.done_amount+"<br/>"                                                        
//                    +"<b>Start :</b> "+new Date(event.start_date.toISOString())+"<br/>"
//                    +"<b>Stop:</b> "+new Date(event.end_date.toISOString())+"<br/>"   
//                    +"<b>Status:</b> "+event.closed;    
//
//        };                
//        scheduler.setLoadMode("day");   
//        
//        timelineLayout.cells("a").attachScheduler(null, "timeline", sTabs);        
//    }
//}
//
//window.dhx4.attachEvent("onSidebarSelect", function(id, cell){
//	if (id == "timeline"){
//                window.history.pushState({'page_id': id}, null, '#timeline');
//		timelineInit(cell);
//	}
//});
//
//function show_minical(){
//    if (scheduler.isCalendarVisible())
//        scheduler.destroyCalendar();
//    else
//        scheduler.renderCalendar({
//                position:"dhx_minical_icon",
//                date:scheduler._date,
//                navigation:true,
//                handler:function(date,calendar){
//                        scheduler.setCurrentView(date);
//                        scheduler.destroyCalendar()
//                }
//        });
//}
//
