// common app settings
var A = {
	deviceOrient: (typeof(window.orientation)=="undefined"?(window.innerWidth>window.innerHeight?"landscape":"portrait"):doOnRotate()),
	deviceType: (function(i){return (i<1024?"phone":(i<1280?"tablet":"desktop"));})(Math.max(screen.width, screen.height)),
	server: "server/",
	cache: true,
	modules: {
		dhtmlx: ["dhtmlx.debug",
//			"sources/dhtmlxCombo/codebase/dhtmlxcombo",
				"sources/dhtmlxScheduler/codebase/dhtmlxscheduler",
                                "sources/dhtmlxGantt/codebase/dhtmlxgantt",
				"sources/dhtmlxScheduler/codebase/dhtmlxscheduler_timeline",
				"sources/dhtmlxScheduler/codebase/dhtmlxscheduler_treetimeline",
				"sources/dhtmlxScheduler/codebase/ext/dhtmlxscheduler_grid_view",
				"sources/dhtmlxScheduler/codebase/ext/dhtmlxscheduler_minical",
				"sources/dhtmlxScheduler/codebase/ext/dhtmlxscheduler_tooltip",
                                "sources/dhtmlxScheduler/codebase/ext/dhtmlxscheduler_editors",
				'sources/dhtmlxScheduler/codebase/sources/locale/locale_pl'
			],

		app: ["dhtmlx_ext", "init", "settings", "timeline", "zlecenia", 
                    "pracownicy", "clients", "projects", "warehouse", "products", 
                    "products_tasks", "gantt", "tools","components/tree",
                "components/treeToolbar", "blocks/newOrder", "blocks/newInnerOrder"],
		common: ["settings_forms","base64ArrayBuffer"]
	}
};

// app enter-point
function doOnLoad() {
	// apply device-related css
	document.body.className = "device_type_"+A.deviceType;
	// show loader
	showLoader();
	// build modules to load
	var k = [];
	var l ='';
	for (var a in A.modules) {
		for (var q=0; q<A.modules[a].length; q++) {
			if (a == "dhtmlx"){
				l="codebase/dhtmlx/"+A.modules[a][q]+".js";
				k.push("codebase/dhtmlx/"+A.modules[a][q]+".js");
			}
			if (a == "app"){
				l="codebase/app/"+A.modules[a][q]+".js";
				k.push("codebase/app/"+A.deviceType+"/"+A.modules[a][q]+".js");
			}
			if (a == "common") {
				l="codebase/app/"+A.modules[a][q]+".js";
				k.push("codebase/app/"+A.modules[a][q]+".js");
			}
			//console.log(l);
			//loadModule([l]);
		}
	}
	A.modules = k;
	// start loading
	loadModule();
};

// load single module with requirejs
function loadModule(name) {
	if (A.modules.length == 0) {
		window.dhx4.callEvent("init",[]);
		window.setTimeout(hideLoader, 500);
	} else {
		require([A.modules[0]+(A.cache?"?r="+new Date().getTime():"")], function(){
			var name = A.modules.shift();
			loadModule(name);
		});
	}
};

// app unload
function doOnUnload() {
	if (typeof(window.addEventListener) == "function") {
		window.removeEventListener("load", doOnLoad, false);
		window.removeEventListener("unload", doOnUnload, false);
		window.removeEventListener("orientationchange", doOnRotate, false);
	} else {
		window.detachEvent("onload", doOnLoad);
		window.detachEvent("onunload", doOnUnload);
	}
	window.dhx4.callEvent("unload",[]);
};

// common rotate callback
function doOnRotate(e) {
	var deviceOrient = (window.orientation == 0 || window.orientation == 180 ? "portrait":"landscape");
	if (typeof(e) == "undefined") return deviceOrient;
	if (A != null) A.deviceOrient = deviceOrient;
	window.dhx4.callEvent("onOrientationChange", [deviceOrient]);
};

// page-load event
if (typeof(window.addEventListener) == "function") {
	window.addEventListener("load", doOnLoad, false);
	window.addEventListener("unload", doOnUnload, false);
	window.addEventListener("orientationchange", doOnRotate, false);
} else {
	window.attachEvent("onload", doOnLoad);
	window.attachEvent("onunload", doOnUnload);
}
function _(str){
	return str;
}
