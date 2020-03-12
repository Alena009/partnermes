var mainSidebar;
var mainToolbar;
var w1;

window.dhx_globalImgPath = 'codebase/imgs/dhxtree_web/';

function appInit() {            
        var userData = JSON.parse(localStorage.getItem("userData"));  
        if (userData.permissions) {
            userData.permissions.forEach(function(elem){
                elem.id = elem.name;
                elem.text = elem.description;
            });       
        }        
	mainSidebar = new dhtmlXSideBar({
		parent: document.body,
		icons_path: "imgs/sidebar/",
		width: 140,
		template: "tiles",        
                items: userData.permissions
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
                        {type: "text",   id: "user",     text: ""},  
                        {type: "text",   id: "langLabel",text: "Language: "},	                        
			{type: "button", id: "logout", img: "logout.png"}
		]
	});   
        ajaxGet("api/language", "", function(data){
            if (data.data && data.success) {
                data.data.forEach(function(item){                    
                    mainToolbar.addButton("language-"+item.short, 3, item.short, null, null);
                });                        
                mainToolbar.disableItem("language-"+localStorage.getItem("language"));
            } 
            //else {
//                location.reload();
//            }
        }); 
	mainSidebar.attachEvent("onSelect", function(id){
		mainToolbar.setItemText("title", window.dhx4.template("<span style='font-weight: bold; font-size: 14px;'>#text#</span>", {text:mainSidebar.cells(id).getText().text}));
                mainToolbar.setItemText("user", JSON.parse(localStorage.getItem("userData")).name);                
		window.dhx4.callEvent("onSidebarSelect", [id, this.cells(id)]);                               
	});
	mainToolbar.attachEvent("onClick", function(id) {            
		console.log('mainToolbar.onClick',arguments);
                if (id.indexOf('language-')>-1) {
                    localStorage.setItem("language", mainToolbar.getItemText(id));
                    location.reload();
                }
		if (id=='logout'){
                    ajaxPost('api/logout','',function(){ location.reload(); });
		}
	});
	mainSidebar.cells("zlecenia").setActive(true);
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
			height:180,
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
                                {type: "checkbox", label: _("Gość"), name: "isguest", value: "", offsetTop: 5},
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
                            console.log(data);
				if (data.success===true){
                                    localStorage.setItem('userData', JSON.stringify(data.user));                                    
                                    localStorage.setItem('token',data.token);   
                                    localStorage.setItem("user", JSON.parse(localStorage.getItem("userData")).name);
                                    localStorage.setItem("language",  JSON.parse(localStorage.getItem("userData")).language?JSON.parse(localStorage.getItem("userData")).language:'pl');
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
		loginForm.attachEvent("onChange", function (name, value, state){
                    if (name === "isguest") {
                        if (state) {
                            this.setItemValue("login", "guest");
                            this.setItemValue("password", "guest");
                            this.disableItem("login");
                            this.disableItem("password");
                        } else {
                            this.setItemValue("login", "");
                            this.setItemValue("password", ""); 
                            this.enableItem("login");
                            this.enableItem("password");                            
                        }
                    }
                });            
	}
}

function logged(){    	
        ajaxPost("api/logged",'',function(data){
		//var data = (r && r.xmlDoc && r.xmlDoc.status && r.xmlDoc.status==200 && r.xmlDoc.responseText) ? 
                //JSON.parse(r.xmlDoc.responseText):false;
		if (data.success===true){                        
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
    var headers = inputHeaders;
    headers.Authorization = 'Bearer ' + localStorage.token;
   
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
    
    axios.request(requestBody).then(function(response){			
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
    }).catch(function (error) {
        console.log(error);
    });   
}

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
 * function listen changes of hash for hash navigation
 */
window.onhashchange = function() { 
    var hash = location.hash;
    if (hash) {
        hash = hash.substring(1);
        console.log(hash);
        window.mainSidebar.cells(hash).setActive(true);
    }
};          


