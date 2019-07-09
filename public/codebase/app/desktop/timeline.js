var scheduler;
var timelineLayout;

function timelineInit(cell) {
	
	if (timelineLayout == null) {
		
		// init layout
		var timelineLayout = cell.attachLayout("1C");
        timelineLayout.cells("a").hideHeader();
        timelineLayout.cells("a").showInnerScroll();
		
		// attach grid
        scheduler.locale.labels.timeline_tab = "Timeline";
		scheduler.locale.labels.section_custom="Pracownik";
		scheduler.locale.labels.section_custom="Pracownik";
		//scheduler.locale.labels.grid_tab = "Grid";		
		scheduler.config.details_on_create=true;
		scheduler.config.details_on_dblclick=true;
        scheduler.config.xml_date="%Y-%m-%d %H:%i";
		scheduler.config.show_loading = true;
		scheduler.config.multi_day = true;
		scheduler.config.time_step = 1;


		function changeZadania(){
			console.log(this);
			console.log(arguments);
		}
		function changeZlecenia(el){
			var me = this;
			ajaxGet("zlecenia/zlecenie/kod/"+this.value,
						{
							'success':function(data){
								if(me.nextSibling && data[0].zlecenie!==undefined) me.nextSibling.value = data[0].zlecenie;				
								me.ev.zlecenie=data[0].zlecenie;	
								me.ev.id_zlecenie=data[0].id_zlecenie;	
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
			ajaxGet("zlecenia/zlecenie/ruckmeld/"+this.value,
						{
							'success':function(data){
								console.log()
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
			console.log(arguments);
//			if (!ev.zlecenie) {
//				alert("Text must not be empty");
//				return false;
//			}
			return true;
		})		
		scheduler.config.lightbox.sections=[	
			{name:"Pracownik",  type:"timeline", options:scheduler.serverList("pracownicy") , map_to:"_id" }, //type should be the same as name of the tab
			//{name:"Pracownik", height:40, map_to:"id_user", type:"select", options:scheduler.serverList("pracownicy")},
			{name:"Zadanie",  map_to:"id_zadanie", type:"select", options:scheduler.serverList("zadania"),onchange:changeZadania},
			{name:"Zlecenie",  map_to:"kod", type:"zlecenieEditor",onchange:changeZlecenia},
			{name:"Ruckmeld",  map_to:"ruckmeld", type:"ruckmeldEditor", onchange:changeRuckmeld},
			{name:"Szt",  map_to:"szt",type:"sztEditor", onchange:changeSzt},
			{name:"time", height:72, type:"time", map_to:"auto",time_format:["%Y","%m","%d","%H:%i"]}
		];

		scheduler.createTimelineView({
			section_autoheight: false,
			name:	"timeline",
			x_unit:	"minute",
			x_date:	"%H:%i",
			x_step:	60,
			x_size: 24,
			x_start: 0,
			x_length: 24,
//			event_dy: 24,
			y_property: "_id",
			y_unit: scheduler.serverList("employers"),
			render: "tree",
			dx: 300,
			folder_dy:24,
			dy:24
		});

        scheduler.createGridView({
            fields:[
                {id:"id",width:100, align:'right', sort:'int'},
                {id:"pracownik",width:'*',align:'left'},
                {id:"zadanie",width:'*',align:'left'},
                {id:"zlecenie",width:'*',align:'left'},
                {id:"ruckmeld",width:'*',align:'left'},
                {id:"start_date",width:180},
                {id:"end_date",width:180}
            ],
            select:true,
            paging:true
		});

		scheduler.templates.grid_single_date = function(date){
			var formatFunc = scheduler.date.date_to_str("%Y-%m-%d %H:%i");
			return formatFunc(date); 
		};
		scheduler.templates.timeline_tooltip = function(start,end,event){
			console.log(event);
			return event.text2;
		};

		var format=scheduler.date.date_to_str("%Y-%m-%d %H:%i"); 
		scheduler.templates.tooltip_text = function(start,end,event) {
			return "<b>Pracownik :</b> "+event.pracownik+"<br/>"
					+"<b>Zadanie:</b> "+event.zadanie+"<br/>"
					+"<b>Zlecenie :</b> "+event.zlecenie+"<br/>"
					+"<b>Ruckmeld :</b> "+event.ruckmeld+"<br/>"
					+"<b>Start :</b> "+format(start)+"<br/>"
					+"<b>Stop:</b> "+format(end);
		};
		
		scheduler.setLoadMode("day");		

		var sTabs = '<div class="dhx_cal_tab" name="timeline_tab"></div>'
			+'<div class="dhx_cal_tab" name="grid_tab"></div>'
			+'<div class="dhx_minical_icon" name="minical_tab" id="dhx_minical_icon" onclick="show_minical()">&nbsp;</div>'
			;
		
		timelineLayout.cells("a").attachScheduler(new Date(), "timeline",sTabs);
		var schedulerDP = new dataProcessor("api/operations"); 
		schedulerDP.init(scheduler); 
		schedulerDP.setTransactionMode("JSON");
		schedulerDP.setTransactionMode("REST");
		scheduler.parse("api/operations","json");
	}else{
		scheduler.parse("api/operations","json");
	}
	scheduler.on_load = function (loader) {
		var evs;
		if (loader.xmlDoc.status == 200) {
			if (this._process && this._process == "json") {
				var str = loader.xmlDoc.responseText;
				var data = (window.JSON && JSON.parse("["+str+"]")) ? JSON.parse("["+str+"]") : false;
				var success = (data && data[0] && data[0].success) ? (data[0].success) : false;
				evs = this[this._process].parse(str);
				data = (data[0])?data[0]:data;
			} else if (this._process && this._process != "xml") {
				evs = this[this._process].parse(loader.xmlDoc.responseText);
			} else {
				evs = this._magic_parser(loader);
			}
			if (evs && success){
				scheduler._process_loading(evs);
			}else if (data && !success && data.code==402){
				loginFormShow();
			}else{
				console.log('COŚ NIE TAK Z WCZYTYWANIEM!');
			}
		} else {
			alert("ERROR!!! \n \n System Error code: " + loader.xmlDoc.status);
		}

		this.callEvent("onXLE", []);
	};



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