var ganttLayout;

function ganttInit(cell) {	
    if (ganttLayout == null) {
        ganttLayout = cell.attachLayout("1C");
        ganttLayout.cells("a").hideHeader();

        
        gantt.config.layout = {
            css: "gantt_container",
            rows:[
                {
                   cols: [
                    {
                      // the default grid view  
                      view: "grid",  
                      scrollX:"scrollHor", 
                      scrollY:"scrollVer"
                    },
                    { resizer: true, width: 1 },
                    {
                      // the default timeline view
                      view: "timeline", 
                      scrollX:"scrollHor", 
                      scrollY:"scrollVer"
                    },
                    {
                      view: "scrollbar", 
                      id:"scrollVer"
                    }
                ]},
                {
                    view: "scrollbar", 
                    id:"scrollHor"
                }
            ]
        };
       
        ganttLayout.cells("a").attachGantt(null, null, gantt);
        
        ajaxGet("api/gantt", "", function(data){
            gantt.parse({
                data: data.data,
//                data: [
//                  { id:1, text:"Project #2", start_date:"01-04-2018", duration:18, progress:0.4, open:true },
//                  { id:2, text:"Task #1", start_date:"02-04-2018", duration:8, progress:0.6, parent:1 },
//                  { id:3, text:"Task #2", start_date:"11-04-2018", duration:8, progress:0.6, parent:1 }
//                ],
//                links: [
//                  { id:1, source:1, target:2, type:"1" },
//                  { id:2, source:2, target:3, type:"0" }
//                ]
            });            
        });

        
    }
}

window.dhx4.attachEvent("onSidebarSelect", function(id, cell){
	if (id == "gantt"){
                window.history.pushState({'page_id': id}, null, '#gantt');
		ganttInit(cell);
	}
});

