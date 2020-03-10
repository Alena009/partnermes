function loadAllDataStores()
{
    const clientsURL = "api/clients"; 
    const clientDataStore = new dhtmlXDataStore();
    clientDataStore.load = () => {    
        ajaxGet(clientsURL, '', function(data) {
            if (data && data.success) {
                clientDataStore.parse(data.data);
            }
        });
    };
    clientDataStore.load();    
}