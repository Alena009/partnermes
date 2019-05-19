var mainSidebar;
var mainToolbar;
var w1;

window.dhx_globalImgPath = 'codebase/imgs/dhxtree_web/';

function appInit() {
	mainSidebar = new dhtmlXSideBar({
		parent: document.body,
		icons_path: "imgs/sidebar/",
		width: 140,
		template: "tiles",
		items: [
			{id: "timeline", text: "Timeline", icon: "timeline.png"},
			{id: "zlecenia", text: "Zlecenia", icon: "list.png"},
			{id: "pracownicy", text: "Pracownicy", icon: "contacts.png"},
			{id: "projects", text: "Projects", icon: "projects.png"},
			{id: "events",   text: "Events",   icon: "events.png"  },
			{id: "settings", text: "Settings", icon: "settings.png"}
		]
	});

/*
<div class="dhxsidebar_item dhxsidebar_item_selected">
	<img class="dhxsidebar_item_icon" src="imgs/sidebar/contacts.png" border="0">
	<div class="dhxsidebar_item_text">Pracownicy</div>
</div>
*/
	mainToolbar = mainSidebar.attachToolbar({
		icons_size: 32,
		icons_path: "imgs/toolbar/",
		items: [
			{type: "text", id: "title", text: "&nbsp;"},
			{type: "spacer"},
			{type: "button", id: "logoout", img: "logout.png"}
		]
	});

	mainSidebar.attachEvent("onSelect", function(id){
		mainToolbar.setItemText("title", window.dhx4.template("<span style='font-weight: bold; font-size: 14px;'>#text#</span>", {text:mainSidebar.cells(id).getText().text}));
		window.dhx4.callEvent("onSidebarSelect", [id, this.cells(id)]);
	});
	mainToolbar.attachEvent("onClick", function(id) {
		console.log('mainToolbar.onClick',arguments);
		if (id='logoout'){
			ajaxPost('logout','',function(){                            
                            location.reload();
			});
		}
	});
	mainSidebar.cells("zlecenia").setActive(true);
	//window.dhx4.callEvent("onSelect","projects");
	//debugger;
	//window.dhx4.callEvent("onSidebarSelect", ['projects', mainSidebar.cells('projects')]);
}


function appUnload() {
	if (mainSidebar != null && mainSidebar.unload != null) {
		mainSidebar.unload();
		mainSidebar = null;
	}
}

function loginFormShow(callback2={}){

	if (w1 != undefined){
		w1.show();
		loginForm.clear();
	}else{
		dhxWins = new dhtmlXWindows();
		dhxWins.attachViewportTo(document.body);
		w1 = dhxWins.createWindow({
			id:"w1",
			left:10,
			top:10,
			width:320,
			height:160,
			center:true,
			caption:'Logowanie'
		});
		w1.denyResize();
		w1.denyPark();
		w1.button("minmax").hide();
		w1.button("park").hide();
		w1.button("close").disable();
		w1.show();
		w1.centerOnScreen();                
		var loginFormData = [
			{type: "settings", position: "label-left", labelWidth: 75, inputWidth: 150},
			{type: "block", blockOffset: 30, offsetTop: 5, width: "auto", list: [                                
				{type: "input", label: "Login", name: "login", value: "", offsetTop: 5},
				{type: "password", label: "Hasło", name: "password", value: ""},
				{type: "button", name: "submit", value: "Zaloguj", offsetTop: 5, offsetLeft: 72}
			]}
		];

		var loginForm = w1.attachForm(loginFormData);
		var loginFormDP = new dataProcessor("login");    //inits dataProcessor
		loginFormDP.init(loginForm);
		loginForm.callback = callback2;
		loginForm.weryfikuj = function(id){
			var data = loginForm.getFormData();
                        var csrf_token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');                                                        
			dhx.ajax.post("login","login="+data.login+"&password="+data.password+"&_token="+csrf_token,function(r){                            
				var data = (r && r.xmlDoc && r.xmlDoc.status && r.xmlDoc.status==200 && r.xmlDoc.responseText) ? JSON.parse(r.xmlDoc.responseText):false;                                
				if (data.success===true){                                    
					w1.hide();
					if (loginForm.callback.success && isFunction(loginForm.callback.success)){
						loginForm.callback['success']();                                                
					}else{
						if (loginForm.callback && isFunction(loginForm.callback)){
							loginForm.callback();
						}
					}
					this.isLogged = !0;
				}else{
					this.isLogged = !1;
					if (loginForm.callback.failure && isFunction(loginForm.callback.failure)){
						loginForm.callback['failure']();
					}
				}
			});
			return this.isLogged;
		}
		loginForm.attachEvent("onButtonClick", function(id){
			if (id=='submit'){
				loginForm.weryfikuj();
			};
		});
		loginForm.attachEvent("onKeyup",function(inp,ev){
			if (ev && ev.keyCode==13){
				loginForm.weryfikuj();
			}
		});
	}
}

function logged(){
    var csrf_token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
	dhx.ajax.post("logged","_token="+csrf_token,function(r){
		var data = (r && r.xmlDoc && r.xmlDoc.status && r.xmlDoc.status==200 && r.xmlDoc.responseText) ? JSON.parse(r.xmlDoc.responseText):false;                
		if (data.success===true){
			console.log('Zalogowany');
			appInit();
			//window.dhx4.attachEvent("onload", loginFormShow);
			this.isLogged = !0;
		}else{
			loginFormShow({'success':function(){location.reload();}});
			this.isLogged = !1;
		}
	});
	return this.isLogged;
}

window.dhx4.attachEvent("unload", appUnload);
window.dhx4.attachEvent("onLoadXMLError", function(r){
	console.log("onLoadXMLError",r);
});
// dhtmlxError.catchError("ALL",function(){
// 	console.log("catchError",arguments);
// });

logged();

function isFunction(functionToCheck) {
	return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

function ajaxGet(url,params,callback){
	dhx.ajax.get(url+"?"+params,
		function(loader, data, xhr){
			var evs;
			if (loader.xmlDoc.status == 200) {
				var str = loader.xmlDoc.responseText;
				var data = (window.JSON && JSON.parse("["+str+"]")) ? JSON.parse("["+str+"]") : false;
				var success = (data && data[0] && data[0].success) ? (data[0].success) : false;

				if (data && success){
					if (callback && callback.success){
						callback['success'](data);
					}else if (callback){
						callback(data);
					}else{
						return data;
					}
				}else if (data && !success && data.code==402){
					loginFormShow();
				}else{
					if (callback && callback.failure){
						callback['failure'](data);
					}else if (callback){
						callback(data);
					}else{
						return false;
					}
				}
			} else {
				alert("ERROR!!! \n \n System Error code: " + loader.xmlDoc.status);
			}
		}
	,params);
}
function ajaxPost(url,params,callback){
	console.log(typeof(params));
	dhx.ajax.post(url,params,
		function(loader, data, xhr){
			var evs;
			if (loader.xmlDoc.status == 200) {
				var str = loader.xmlDoc.responseText;
				var data = (window.JSON && JSON.parse("["+str+"]")) ? JSON.parse("["+str+"]") : false;
				var success = (data && data[0] && data[0].success) ? (data[0].success) : false;

				if (data && success){                                    
					if (callback && callback.success){                                            
						callback['success'](data);
					}else if (callback){                                            
						callback(data);
					}else{                                            
						return data;
					}
				}else if (data && !success && data.code==402){
					loginFormShow();
				}else{
					if (callback && callback.failure){
						callback['failure'](data);
					}else if (callback){
						callback(data);
					}else{
						return false;
					}
				}
			} else {
				alert("ERROR!!! \n \n System Error code: " + loader.xmlDoc.status);
			}
		}
	);
}
function ajaxPut(url,params,callback){
	dhx.ajax.put(url,params,
		function(loader, data, xhr){
			var evs;
			if (loader.xmlDoc.status == 200) {
				var str = loader.xmlDoc.responseText;
				var data = (window.JSON && JSON.parse("["+str+"]")) ? JSON.parse("["+str+"]") : false;
				var success = (data && data[0] && data[0].success) ? (data[0].success) : false;

				if (data && success){
					if (callback && callback.success){
						callback['success'](data);
					}else if (callback){
						callback(data);
					}else{
						return data;
					}
				}else if (data && !success && data.code==402){
					loginFormShow();
				}else{
					if (callback && callback.failure){
						callback['failure'](data);
					}else if (callback){
						callback(data);
					}else{
						return false;
					}
				}
			} else {
				alert("ERROR!!! \n \n System Error code: " + loader.xmlDoc.status);
			}
		}
	);
}
