var scheduler;
var timelineLayout;

function timelineInit(cell) {
	
    if (timelineLayout == null) {
/*        
        var timelineLayout = cell.attachLayout("1C");
        timelineLayout.cells("a").hideHeader();
        timelineLayout.cells("a").showInnerScroll(); 
        
        var sTabs = 
            '<div class="dhx_cal_tab" name="day_tab"      style="right:204px;"></div>'+
            '<div class="dhx_cal_tab" name="week_tab"     style="right:140px;"></div>'+
            '<div class="dhx_cal_tab" name="month_tab"    style="right:280px;"></div>'+
            '<div class="dhx_cal_tab" name="timeline_tab" style="right:26px;"></div>'+            
            '<div class="dhx_cal_tab" name="grid_tab"     style="right:36px;"></div>';
        // attach grid
        scheduler.locale.labels.timeline_tab = "Timeline";
        scheduler.locale.labels.section_custom="Pracownik";
        scheduler.locale.labels.section_custom="Pracownik";

        scheduler.config.details_on_create=true;
        scheduler.config.details_on_dblclick=true;
        scheduler.config.xml_date="%Y-%m-%d %H:%i";
        scheduler.config.show_loading = true;
        scheduler.config.multi_day = true;
        scheduler.config.time_step = 1;
        
        scheduler.config.show_loading = true;   

        ajaxGet("api/users", "", function(data2){
            if (data2 && data2.success){
                var usersList = scheduler.serverList("users", data2.data);
                scheduler.createTimelineView({
                    cell_template: true,
                    name:"timeline",
                    x_unit:"minute", // measuring unit of the X-Axis.
                    x_date:"%H:%i",  // date format of the X-Axis
                    x_step:30,       // X-Axis step in 'x_unit's
                    x_size:24,       // X-Axis length specified as the total number of 'x_step's
                    x_start:16,      // X-Axis offset in 'x_unit's
                    x_length:48,     // number of 'x_step's that will be scrolled at a time
                    y_unit: usersList,
                    y_property: "user_id", 
                    render:"tree"             // view mode          
                }); 
                scheduler.createGridView({
                    name: "grid",
                    fields:[
                        {id:"id",width:100, align:'right', sort:'int'},
                        {id:"user_id",width:'*',align:'left'},
                        //{id:"zadanie",width:'*',align:'left'},
                        {id:"task_id",width:'*',align:'left'},
                        //{id:"ruckmeld",width:'*',align:'left'},
                        {id:"start_date",width:180},
                        {id:"end_date",width:180}
                    ],
                    select:true,
                    paging:true                 
                });                  
                scheduler.fill();
            } 
        });                
        
        scheduler.fill = function() {
            ajaxGet("api/operations", "" , function(data) {
                if(data && data.success) {               
                    scheduler.clearAll();
                    scheduler.parse(data.data, "json");
                } 
            });
        };
        
        timelineLayout.cells("a").attachScheduler(null, "timeline", sTabs); 
        scheduler.templates.grid_single_date = function(date){
                var formatFunc = scheduler.date.date_to_str("%Y-%m-%d %H:%i");
                return formatFunc(date); 
        };      
        scheduler.templates.timeline_tooltip = function(start,end,event){
                console.log(event);
                return event.text2;
        };      
*/      
        
        // init layout
        var timelineLayout = cell.attachLayout("1C");
        timelineLayout.cells("a").hideHeader();
        timelineLayout.cells("a").showInnerScroll();

        // attach grid
//        scheduler.locale.labels.timeline_tab = "Timeline";
//        scheduler.locale.labels.section_custom="Pracownik";
//        scheduler.locale.labels.section_custom="Pracownik";

        scheduler.config.details_on_create=true;
        scheduler.config.details_on_dblclick=true;
        scheduler.config.xml_date="%Y-%m-%d %H:%i";
        scheduler.config.show_loading = true;
        scheduler.config.multi_day = true;
        scheduler.config.time_step = 1;
        
        scheduler.config.lightbox.sections=[	
            {name:"Pracownik",  type:"timeline", options:scheduler.serverList("users") , map_to:"user_id" }, //type should be the same as name of the tab
            //{name:"Pracownik", height:40, map_to:"id_user", type:"select", options:scheduler.serverList("pracownicy")},
            //{name:"Zadanie",  map_to:"id_zadanie", type:"select", options:scheduler.serverList("zadania"),onchange:changeZadania},                
            //{name:"Zlecenie",  map_to:"kod", type:"zlecenieEditor",onchange:changeZlecenia},
            {name:"Zlecenie", type:"combo", filtering:true, height:50, width: 150,
                options:scheduler.serverList("zlecenia"), 
                map_to:"order_position_id", 
                onchange:changeZlecenia},
//            {name:"Zadanie", type:"combo", filtering:true, height:50, width: 150,
//                options:scheduler.serverList("tasks"), 
//                map_to:"task_id"},            
//            {name:"Zlecenie", type:"select", options:scheduler.serverList("zlecenia"), 
//                map_to:"order_position_id", onchange:changeZlecenia}, 
            {name:"Zadanie",  type:"select", options:[],    
                map_to:"task_id" }, 
            {name:"Ruckmeld", type:"ruckmeldEditor", 
                map_to:"ruckmeld", onchange:changeRuckmeld},
            {name:"Szt",      type:"sztEditor",  
                map_to:"amount",   onchange:changeSzt}
//            {name:"time", height:72, type:"time",
//                map_to:"auto", time_format:["%Y","%m","%d","%H:%i"]}
        ];           
        
        ajaxGet("api/positions", "", function(data){
            scheduler.updateCollection("zlecenia", data.data);
        }); 
        
        function changeZadania(){
                console.log(this);
                console.log(arguments);
        }
        
        var update_select_options = function(select, options) { // helper function                 
                select.options.length = 0;
                for (var i=0; i<options.length; i++) {
                        var option = options[i];
                        select[i] = new Option(option.label, option.key);
                }
        };    
        scheduler.attachEvent("onBeforeLightbox", function(id){                      
            update_select_options(scheduler.formSection('Zadanie').control, []);
            return true;
        });        
        function changeZlecenia(el){
            var me = this;
            ajaxGet("api/declaredworks/byorderpos/"+this.getSelectedValue(), "",
                {
                    'success':function(data){                            
                        update_select_options(scheduler.formSection('Zadanie').control, data.data);

//                                if(me.nextSibling && data[0].zlecenie!==undefined) me.nextSibling.value = data[0].zlecenie;				
//                                me.ev.zlecenie=data[0].zlecenie;	
//                                me.ev.id_zlecenie=data[0].id_zlecenie;	
                    },
                    'failure':function(data){
                            me.ev.zlecenie='';
                            me.ev.id_zlecenie='';
                            if(me.nextSibling) me.nextSibling.value = "BRAK ZLECENIA!!!";				
                    }
                }
            );
        }
        function changeRuckmeld(){
            var me = this;
            ajaxGet("api/zlecenia/duration/"+this.value,
                {
                        'success':function(data){
                                if(me.nextSibling && data[0].ruckmeld!==undefined) me.nextSibling.value = data[0].ruckmeld;				
                                me.ev.ruckmeld=data[0].ruckmeld;	
                                me.ev.ruckmeld=data[0].ruckmeld;	
                        },
                        'failure':function(data){
                                me.ev.ruckmeld='';
                                me.ev.id_zlecenie='';
                                if(me.nextSibling) me.nextSibling.value = "BRAK OPERACJI!!!";				
                        }
                }
            );
        }
        function changeSzt(){

        }
        scheduler.form_blocks["zlecenieEditor"] = {
                render:function(sns) {
                        return "<div class='dhx_cal_ltext doubleEditor'><input type='text'><input type='text'  disabled readonly></div>";
                },
                set_value:function(node, value, ev, r) {
                        var el = node.firstChild; 
                        console.log('zlecenieEditor.set_value',arguments);
                        if (r.onchange) {
                                el.onchange = r.onchange, el.ev = ev;
                        }else{
                                el.onchange = undefined;
                        }
                        el.value = value || "";
                        node.childNodes[1].value = ev.zlecenie || "";
                },
                get_value:function(node, ev) {
                        return node.childNodes[0].value;
                },
                focus:function(node) {
                        var a = node.childNodes[0];
                        a.select();
                        a.focus();
                }

        };
        scheduler.form_blocks["ruckmeldEditor"] = {
                render:function(sns) {
                        return "<div class='dhx_cal_ltext doubleEditor'><input type='text'><input type='text'  disabled readonly></div>";
                },
                set_value:function(node, value, ev, r) {
                        console.log('ruckmeldEditor.set_value',arguments);
                        var el = node.firstChild; 
                        if (r.onchange) {
                                el.onchange = r.onchange, el.ev = ev;
                        }else{
                                el.onchange = undefined;
                        }
                        el.value = value || "";
                        node.childNodes[1].value = ev.ruckmeldText || "";
                },
                get_value:function(node, ev) {
                        return node.firstChild.value;
                },
                focus:function(node) {
                        var a = node.firstChild; 
                        a.select();
                        a.focus();
                }

        };
        scheduler.form_blocks["sztEditor"] = {
                render:function() {
                        console.log(arguments);
                        return "<div class='dhx_cal_ltext'><input type='number'></div>";
                },
                set_value:function(node, value, ev, r) {
                        var el = node.firstChild; 
                        if (r.onchange) {
                                el.onchange = r.onchange, el.ev = ev;
                        }else{
                                el.onchange = undefined;
                        }
                        el.value = value || "";
                },
                get_value:function(node, ev) {
                        return node.firstChild.value;
                },
                focus:function(node) {
                        var a = node.firstChild; 
                        a.select();
                        a.focus();
                }

        };
        scheduler.attachEvent("onEventSave",function(id,ev,is_new){
                console.log(ev);
                    if (!ev.task_id) {
                            alert("Text must not be empty");
                            return false;
                    }
                return true;
        });
               
        ajaxGet("api/users", "", function(data2){
            if (data2 && data2.success){
                var usersList = scheduler.serverList("users", data2.data);
            }
            scheduler.createTimelineView({
                    section_autoheight: false,
                    name:	"timeline",
                    x_unit:	"minute",
                    x_date:	"%H:%i",
                    x_step:	60,
                    x_size: 24,
                    x_start: 0,
                    x_length: 24,
                    event_dy: 24,
                    y_unit: usersList,
                    y_property: "user_id",			
                    render: "tree",
                    dx: 300,
                    folder_dy:24,
                    dy:24
            }); 
            ajaxGet("api/operations", "" , function(data) {
                if(data && data.success) {               
                    scheduler.clearAll();
                    scheduler.parse(data.data, "json");
                } 
            }); 
        });

        scheduler.createGridView({
            fields:[
                {id:"id",width:100, align:'right', sort:'int'},
                {id:"user_name",width:'*',align:'left'},
                {id:"task_name",width:'*',align:'left'},                
                {id:"ruckmeld",width:'*',align:'left'},
                {id:"start_date",width:180},
                {id:"end_date",width:180}
            ],
            select:true,
            paging:true
        });
  
        var sTabs = '<div class="dhx_cal_tab" name="day_tab" style="right:204px;"></div>'+
                    '<div class="dhx_cal_tab" name="week_tab" style="right:200px;"></div>'+
                    '<div class="dhx_cal_tab" name="month_tab" style="right:200px;"></div>'+
                    '<div class="dhx_cal_tab" name="grid_tab" style="left:240px;"></div>' + 
                    '<div class="dhx_cal_tab" name="timeline_tab" style="right:256px;"></div>'+
                    '<div class="dhx_minical_icon" name="minical_tab" id="dhx_minical_icon" onclick="show_minical()">&nbsp;</div>';
                     

        timelineLayout.cells("a").attachScheduler(null, "grid", sTabs);
//        var schedulerDP = new dataProcessor("api/operations", "js"); 
//        schedulerDP.init(scheduler); 
//        schedulerDP.setTransactionMode("JSON");
     
        //schedulerDP.setTransactionMode("REST");
        scheduler.templates.grid_single_date = function(date){
                var formatFunc = scheduler.date.date_to_str("%Y-%m-%d %H:%i");
                return formatFunc(date); 
        };
        scheduler.templates.timeline_tooltip = function(start,end,event){
                console.log(event);
                return event.text2;
        };
		
        scheduler.templates.tooltip_text = function(start,end,event) {
                return "<b>Pracownik :</b> "+event.pracownik+"<br/>"
                                +"<b>Zadanie:</b> "+event.zadanie+"<br/>"
                                +"<b>Zlecenie :</b> "+event.zlecenie+"<br/>"
                                +"<b>Ruckmeld :</b> "+event.ruckmeld+"<br/>"
                                +"<b>Start :</b> "+event.start+"<br/>"
                                +"<b>Stop:</b> "+event.end;                        
//                                +"<b>Start :</b> "+format(start)+"<br/>"
//                                +"<b>Stop:</b> "+format(end);
        };                
        scheduler.setLoadMode("day");               
    
//    scheduler.on_load = function (loader) {
//            var evs;
//            
//            if (loader.xmlDoc.status == 200) {
//                console.log(loader);
//                    if (this._process && this._process == "json") {
//                            var str = loader.xmlDoc.responseText;
//                            var data = (window.JSON && JSON.parse("["+str+"]")) ? JSON.parse("["+str+"]") : false;
//                            var success = (data && data[0] && data[0].success) ? (data[0].success) : false;
//                            evs = this[this._process].parse(str);
//                            data = (data[0])?data[0]:data;
//                    } else if (this._process && this._process != "xml") {
//                            evs = this[this._process].parse(loader.xmlDoc.responseText);
//                    } else {
//                            evs = this._magic_parser(loader);
//                    }
//                    if (evs && success){
//                            scheduler._process_loading(evs);
//                    }else if (data && !success && data.code==402){
//                            loginFormShow();
//                    }else{
//                            console.log('COŚ NIE TAK Z WCZYTYWANIEM!');
//                    }
//            } else {
//                    alert("ERROR!!! \n \n System Error code: " + loader.xmlDoc.status);
//            }
//
//            this.callEvent("onXLE", []);
//    };   
    
    }
}

window.dhx4.attachEvent("onSidebarSelect", function(id, cell){
	if (id == "timeline"){
                window.history.pushState({'page_id': id}, null, '#timeline');
		timelineInit(cell);
	}
});

function show_minical(){
    if (scheduler.isCalendarVisible())
        scheduler.destroyCalendar();
    else
        scheduler.renderCalendar({
                position:"dhx_minical_icon",
                date:scheduler._date,
                navigation:true,
                handler:function(date,calendar){
                        scheduler.setCurrentView(date);
                        scheduler.destroyCalendar()
                }
        });
}