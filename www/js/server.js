/**
 * File which contains the code in order to call the server 
 */


var req; // global variable to hold request object

function sendRequest(filterText) {  
	
	try {
		
		// construct the URL
		var urlRequest = url+nameResourceSearch;	
		console.log("url resource: "+urlRequest);
		
		if(window.XMLHttpRequest) {
		
			// FireFox, Safari, etc.
			try {
			
				console.log("Browser window.XMLHttpRequest");
				req = new XMLHttpRequest();
			
			} catch(e) {
				
				console.log("Error Browser window.XMLHttpRequest");
				req = false;
			
			}
		  
		}
		else if(window.ActiveXObject) {
	    
			try {
				
				console.log("Browser window.ActiveXObject");
				req = new ActiveXObject("Msxml2.XMLHTTP");
			
			} 
			catch(e) {
				
				console.log("Error Browser window.ActiveXObject Msxml2.XMLHTTP");
				try {
				
					console.log("Browser window.ActiveXObject Microsoft.XMLHTTP");
					req = new ActiveXObject("Microsoft.XMLHTTP");
				
				} 
				catch(e) {
					
					console.log("Error Browser window.ActiveXObject Microsoft.XMLHTTP");
					req = false;
				
				}
			}
		}
		
		if(req) {
	    
			
			req.onreadystatechange = handleStateChange;
			req.open("POST", urlRequest, true);
			req.send("text-filter="+filterText);
		
		}
		else {
			
			console.log("XMLHttpRequest is not supported");
			app.error(null, "XMLHttpRequest is not supported... Please contact the app administrator.");
	
		}


	}
	catch(e) {
	
		console.log("Error sending request")
		app.error(e, "Error sending request... Please contact the app administrator.");
		
	}
}

function handleStateChange() {
	
	try {
		console.log("new status: "+req.readyState);
		
	    if(req.readyState == 4) { // the request is done
	    	
	    	console.log("request completed");
	    	console.log("request status: "+req.status);
	    	
	    	
	    	if(req.responseText == "") {
	    	
	    		console.log("Error, response empty");
				app.Error(null, "Error, response empty...");
				
	    	}
	    	else {
	    		
	    		// Throw an error if the request was not 200 OK 
	    	    if (req.status != 200) {
	    	    	
	    	    	console.log("Error, status request "+ req.status +":"+req.responseText);
	    	    	app.error(null, "Error, status request "+ req.status +":"+req.responseText+" Please contact the app administrator.");
	    	    	
	    	    }
	    	    else {
	    	    	
	    	    	// if the request was 200 ok, but further to check the content type of getResponseHeader because it has to be json	
	    	    	// Throw an error if the type was wrong
	    	        var type = req.getResponseHeader("Content-Type");
	    	        if (type != 'application/json') {
	    	        			 
	    	        	console.log("Error, type request "+ type);
		    	    	app.error(null, "Error, type request "+ type + ".Please contact the app administrator");
		    	    	
	    	        }
	    	        else {
	    	        	
	    	        	//process json object
	    	        	console.log(req.responseText)
	    	        	console.log("process json object");
	    	        	savedResponse(req.responseText);
	    	        }
	    	    	
	    	    }	
	    	
	    	}
	    	
	    }

	}
	catch (e) {
		console.log("Error whilst processing response");
		app.error(e, "Error whilst processing response... Please contact the app administrator.");
		
	}
	   
}
