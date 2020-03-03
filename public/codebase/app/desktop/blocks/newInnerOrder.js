const makeNewInnerOrderForm = (container) => {
    const newInnerOrderForm = makeNewOrderForm(container);
    let clientsCombo = newInnerOrderForm.getCombo("client_id");    
    clientsCombo.setComboValue('0');
    newInnerOrderForm.hideItem("client_id");
    
    ajaxGet("api/orders/last", "", function(data){
        if (data && data.success) {
            newInnerOrderForm.setItemValue("kod", "W-" + data.data.id + 1);
        }
    }); 
    
    newInnerOrderForm.disableItem("kod");
     
    return newInnerOrderForm;
}


