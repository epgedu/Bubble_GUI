/**
 * Unit test to check the proper work for data.js
 */

describe("Processing lattice information", function() {
   
	it("user begins the search", function() {
		//create the mock json response  
	    var jsonResponse = '{"contentObjects":[{"conceptId":"29605","extension":[{"id":"o1","value":""},{"id":"o3","value":""},{"id":"o4","value":""}],'+
	                       '"intension":[{"id":"d7","value":""},{"id":"d10","value":""}],"parentsFormalConceptId":[],"childrenFormalConceptId":["25203","27559"]},'+
	                       '{"conceptId":"25203","extension":[{"id":"o5","value":""},{"id":"o6","value":""}],"intension":[{"id":"d4","value":""},{"id":"d7","value":""},'+
	                       '{"id":"d10","value":""}],"parentsFormalConceptId":["29605"],"childrenFormalConceptId":["12679"]},{"conceptId":"27559",'+
	                       '"extension":[{"id":"o1","value":""},{"id":"o4","value":""},{"id":"o6","value":""},{"id":"o8","value":""},{"id":"o9","value":""}],'+
	                       '"intension":[{"id":"d1","value":""},{"id":"d3","value":""},{"id":"d5","value":""},{"id":"d7","value":""},{"id":"d8","value":""},{"id":"d9","value":""},{"id":"d10","value":""}],"'+
	                       'parentsFormalConceptId":["29605","25203"],"childrenFormalConceptId":["12679"]},{"conceptId":"12679","extension":[{"id":"o9","value":""}],"intension":[{"id":"d8","value":""},'+
	                       '{"id":"d9","value":""},{"id":"d10","value":""}],"parentsFormalConceptId":["25203","27559"],"childrenFormalConceptId":[]}]}';
	    //execute the method to save the json response in javascript data structures
	    try{
	    	savedResponse(jsonResponse);
	    }
	    catch(e) {
	    	if(e.message == "Cannot read property 'alert' of undefined") {
	    		//it is expected, because of the exception is thrown due to all DOM object are not loaded during the test
	    		//check if the subcategories, intension and not related arrays have the expected content
	    		//expected new subcategories
	    		expect(subCategoriesDescriptors[0].id).toBe("d4");
	    		expect(subCategoriesDescriptors[1].id).toBe("d1");
	    		expect(subCategoriesDescriptors[2].id).toBe("d3");
	    		expect(subCategoriesDescriptors[3].id).toBe("d5");
	    		expect(subCategoriesDescriptors[4].id).toBe("d8");
	    		expect(subCategoriesDescriptors[5].id).toBe("d9");
	    	    //expected new intension
	    		expect(intensionDescriptors.length).toBe(0);
	    	    //expected new not related
	    		expect(notRelatedDescriptors[0].id).toBe("d4");
	    		expect(notRelatedDescriptors[1].id).toBe("d1");
	    		expect(notRelatedDescriptors[2].id).toBe("d3");
	    		expect(notRelatedDescriptors[3].id).toBe("d5");
	    		expect(notRelatedDescriptors[4].id).toBe("d8");
	    		expect(notRelatedDescriptors[5].id).toBe("d9");
	    	}
	    }
	});
	
    it("user click a subcategory d5", function() {
    	getChildrenWithDescriptor("d5");
		//mapping the information from the new selected node
		mapDataGui();
		//new selected formal concept
		expect(idFormalConceptSelected).toBe("27559");
		//expected new subcategories
		expect(subCategoriesDescriptors.length).toBe(0);
		//expected new intension
		expect(intensionDescriptors[0].id).toBe("d7");
		expect(intensionDescriptors[0].inherited).toBe(true);
		expect(intensionDescriptors[1].id).toBe("d10");
		expect(intensionDescriptors[1].inherited).toBe(true);
		expect(intensionDescriptors[2].id).toBe("d4");
		expect(intensionDescriptors[2].inherited).toBe(false);
		//expected new not related
		expect(notRelatedDescriptors[0].id).toBe("d4");
	});
  
  
    it("user click a intension d4", function() {
    	
    	getParentsWithDescriptor("d4");
		//mapping the information from the new selected node
		mapDataGui();
    	
    	//expected new formal concept
		expect(idFormalConceptSelected).toBe("25203");
	    //expected new extension
		expect(subCategoriesDescriptors[0].id).toBe("d8");
		expect(subCategoriesDescriptors[1].id).toBe("d9");
	    //expected new intension
		expect(intensionDescriptors[0].id).toBe("d7");
		expect(intensionDescriptors[1].id).toBe("d10");
		//expected new not related
		expect(notRelatedDescriptors[0].id).toBe("d1");
		expect(notRelatedDescriptors[1].id).toBe("d3");
		expect(notRelatedDescriptors[2].id).toBe("d5");
		expect(notRelatedDescriptors[3].id).toBe("d8");
		expect(notRelatedDescriptors[4].id).toBe("d9");
		
    });
   
    it("user click a not related formal concept", function() {
    	getNotRelatedWithDescriptor("d3");
    	//mapping the information from the new selected node
		mapDataGui();
    	//expected new formal concept
		expect(idFormalConceptSelected).toBe("27559");
	    //expected new subcategories
		expect(subCategoriesDescriptors.length).toBe(0);
		//expected new intension
		expect(intensionDescriptors[0].id).toBe("d7");
		expect(intensionDescriptors[0].inherited).toBe(true);
		expect(intensionDescriptors[1].id).toBe("d10");
		expect(intensionDescriptors[1].inherited).toBe(true);
		expect(intensionDescriptors[2].id).toBe("d4");
		expect(intensionDescriptors[2].inherited).toBe(false);
		//expected new not related
		expect(notRelatedDescriptors[0].id).toBe("d4"); 
	});
    
    it("check history array", function() {
	   	//size history
    	expect(indexHistory).toBe(3);
    	expect(historySearch[3]).toBe("27559");
    	expect(historySearch[2]).toBe("25203");
    	expect(historySearch[1]).toBe("27559");
    	expect(historySearch[0]).toBe("29605");
	   	
    });
    
   
});