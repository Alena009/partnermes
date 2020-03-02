const buildTree = (container, url) => {
    const treeStruct = {
                skin: "dhx_web",    // string, optional, treeview's skin
                iconset: "font_awesome", // string, optional, sets the font-awesome icons
                multiselect: false,           // boolean, optional, enables multiselect
                checkboxes: true,           // boolean, optional, enables checkboxes
                dnd: true,           // boolean, optional, enables drag-and-drop
                context_menu: true           // boolean, optional, enables context menu			
    };
    const tree = container.attachTreeView(treeStruct);
    tree.attachEvent("onDrop",function(id){			
            var parent_id = arguments[1];
            parent_id = (parent_id) ? parent_id + '' : '';
            var data = {
                id: id,
                parent_id: parent_id
            };                        
            ajaxGet(url + "/" + id + "/edit", data, ''); 
    }); 
    tree.fill = () => {	
        ajaxGet(url + "/grupytree/" + localStorage.language, '', function(data) {                    
            if (data && data.success){      
                tree.clearAll();                            
                tree.loadStruct(data.data);                           
            }                    
        });
    }; 
    return tree;
};


