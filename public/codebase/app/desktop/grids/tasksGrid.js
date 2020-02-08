function getTasksGrid(parentObj) {
    var gridStruct = {
            image_path:'codebase/imgs/',
            columns: [                        
                {
                    label: _("Kod"),
                    width: 100,
                    id: "kod", 
                    type: "ro", 
                    sort: "str", 
                    align: "left"
                },{
                    label: _("Zadanie"),
                    width: 100, id: "name", 
                    type: "ro", 
                    sort: "str", 
                    align: "left"
                },{
                    label: _("Czasy, min"), 
                    width: 100,  
                    id: "duration", 
                    type: "ed", 
                    sort: "str", 
                    align: "left"
                },{
                    label: _("Kolejnosc"), 
                    id: "priority", 
                    type: "ro", 
                    width: 50,
                    sort: "str", 
                    align: "left"
                },{
                    id: "product_group_id", 
                    label:"product_group_id"
                },{
                    id: "product_id", 
                    label: "product_id"
                },{
                    id: "task_id", 
                    label: "task_id"
                }]                                
        };
        
    var grid = parentObj.attachGrid(gridStruct);
    grid.enableDragAndDrop(true);
//    grid.setColumnHidden(3,true);
//    grid.setColumnHidden(4,true);
//    grid.setColumnHidden(5,true);
      
    return grid;
}
