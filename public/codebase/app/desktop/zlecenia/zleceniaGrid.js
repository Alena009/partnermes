function getZleceniaGrid(parentObj) {
    var gridStruct = {
            image_path:'codebase/imgs/',
            columns: [  
                {label: "",                    id:'checked',           width: 30,  type: "ch", align: "center"},                        
                {label: "Zmówienie Kod",       id:'order_kod',         width: 50,  type: "ro", sort: "str",  align: "center"},                        
                {label: "Zlecenie Kod",        id:'kod',               width: 100, type: "ro", sort: "str",  align: "center"},                                              
                {label: "Produkt Kod",         id:'product_kod',       width: 100, type: "ro", sort: "str",  align: "left"},
                {label: "Imie produktu",       id:'product_name',      width: 200, type: "ro", sort: "str",  align: "left"},                        
                {label: "Ilość produktu",      id:'amount',            width: 60,  type: "ro",sort: "str",  align: "right"},                        
                {label: "Zrobiona ilość",      id:'done_amount',       width: 60,  type: "ro",sort: "str",  align: "right"},
                {label: "Wydrukowane",         id:'status',            width: 30,  type: "ch", align: "center"},
                {label: "Zamknięte",           id:'closed',            width: 30,  type: "ch", align: "center"},
                {label: "Data dodania",        id:'created_at',        width: 120, type: "ro", sort: "date", align: "center"},                
                {label: "Data zamkniecia",     id:'date_closed',       width: 120, type: "ro", sort: "date", align: "center"},
                {label: "Data dostawy",        id:'num_week',          width: 120, type: "ro", align: "center"},
                {id: "date_delivery"},
                {id: "description"},
                {id: 'product_id'},
                {id: "declared"},
                {id: "countWorks"},
                {id: "status"},
                {id: "order_id"},
                {id: "price"}
            ],
            multiline: true,
            multiselect: true
        };
        
    var grid = parentObj.attachGrid(gridStruct);
    grid.attachHeader("#master_checkbox,#select_filter,#text_filter,#text_filter,#text_filter,,,#select_filter,#select_filter");
    grid.setRegFilter(grid, 2);
    grid.setRegFilter(grid, 3);
    grid.setRegFilter(grid, 4);    
    
    return grid;
}
