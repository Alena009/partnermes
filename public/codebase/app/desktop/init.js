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
			{id: "timeline",   text: "Timeline",   icon: "timeline.png"},
			{id: "zlecenia",   text: "Zlecenia",   icon: "list.png"},
			{id: "pracownicy", text: "Pracownicy", icon: "contacts.png"},
			{id: "projects",   text: "Projects",   icon: "projects.png"},
			{id: "events",     text: "Events",     icon: "events.png"  },
			{id: "settings",   text: "Settings",   icon: "settings.png"}
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
			ajaxPost('api/logout','',function(){
                            location.reload();
			});
		}
	});
	mainSidebar.cells("pracownicy").setActive(true);
        return;
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
			caption:_('Logowanie')
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
			ajaxPost("api/login","login="+data.login+"&password="+data.password,function(data){
				
				if (data.success===true){
                                    localStorage.setItem('token',data.token);
                                    console.log(data);
                                    
					w1.hide();
					if (loginForm.callback.success && isFunction(loginForm.callback.success)){
						loginForm.callback['success']();
					}else{
						if (loginForm.callback && isFunction(loginForm.callback)){
							loginForm.callback();
						}
					}
				}else{
					if (loginForm.callback.failure && isFunction(loginForm.callback.failure)){
						loginForm.callback['failure']();
					}else{
                        dhtmlx.alert({
                            title:_("Błąd logowania!"),
                            type:"alert-error",
                            text:data.message
                        });
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
	//dhx.ajax.post("logged","_token="+csrf_token,function(r){
        ajaxPost("api/logged",'',function(data){
		//var data = (r && r.xmlDoc && r.xmlDoc.status && r.xmlDoc.status==200 && r.xmlDoc.responseText) ? JSON.parse(r.xmlDoc.responseText):false;
		if (data.success===true){
			console.log('Zalogowany');                        
			appInit();
			//window.dhx4.attachEvent("onload", loginFormShow);
			this.isLogged = !0;
		}else{
                    loginFormShow(
                        {
                            'success':function(){
                                location.reload();
                            },
                        }
                    );
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

function ajaxPost(url, params, callback, headers = {}) {
    return axiosQuery('post', url, params, callback, headers);
}

function ajaxGet(url, params, callback) {
    return axiosQuery('get', url, params, callback);
}

function ajaxDelete(url, params, callback) {
    return axiosQuery('delete', url, params, callback);
}

function axiosQuery(method, url, params, callback, inputHeaders = {}) {      
    var api_token = localStorage.token;
    
//    var headers = {        
//        'Authorization': api_token        
//    };

    var headers = inputHeaders;
    headers.Authorization = 'Bearer ' + api_token;
   
    var requestBody = {
        method: method,
        url: url,               
        headers: headers   
    };
    
    if (method == 'get') {
        requestBody.params = params;        
    } else {
        requestBody.data = params;
    };
    
    axios.request(requestBody)
    .then(function(response){			
                var data = response.data;                
			if (response.status == 200) {
				//var str = data;
				//var data = (window.JSON && JSON.parse("["+str+"]")) ? JSON.parse("["+str+"]") : false;
				var success = (data.success) ? (data.success) : false;

				if (success){
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
		})
    .catch(function (error) {
        console.log(error);
    });   
}


//function ajaxQuery(method, url, params, callback) {
//    
//    var csrf_token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
//
//    var headers = {        
//        'Authorization': localStorage.getItem('token'),
//        'X-CSRF-TOKEN': csrf_token,
//        'Content-Type': 'application/json'
//    };    
//    
//    var afterCall = function(loader, data, xhr){
//			var evs;
//			if (loader.xmlDoc.status == 200) {
//				var str = loader.xmlDoc.responseText;
//				var data = (window.JSON && JSON.parse("["+str+"]")) ? JSON.parse("["+str+"]") : false;
//				var success = (data && data[0] && data[0].success) ? (data[0].success) : false;
//
//				if (data && success){
//					if (callback && callback.success){
//						callback['success'](data);
//					}else if (callback){
//						callback(data);
//					}else{
//						return data;
//					}
//				}else if (data && !success && data.code==402){
//					loginFormShow();
//				}else{
//					if (callback && callback.failure){
//						callback['failure'](data);
//					}else if (callback){
//						callback(data);
//					}else{
//						return false;
//					}
//				}
//			} else {
//				alert("ERROR!!! \n \n System Error code: " + loader.xmlDoc.status);
//			}
//		};    
//    
//    return dhx.ajax.query({
//        method: method,
//        url: url,
//        data: params,
//        async:true,
//        callback: afterCall,
//        headers: headers
//    });    
//}

function _(txt=''){
    return txt;
}

function parseDataForGrid(json){
    console.log('parseDataForGrid',json);

    return data;
}
//Check, does browser support historyApi
function historyApi() {
    return histAPI=!!(window.history && history.pushState);
}

/*
 * function listen changes of hash forr hash navigation
 */
window.onhashchange = function() { 
    var hash = location.hash;
    if (hash) {
        hash = hash.substring(1);
        console.log(hash);
        window.mainSidebar.cells(hash).setActive(true);
    }
};


