/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/*
 * This file contains the global variables declarations, initialization app process and declares the main events 
 */

// global variables (div's)
var appDiv, 
searchbarDiv, 
resultsDiv, 
linksbarDiv,
searchBtn,
searchtxt,
undoButtonBubble,
backListButtonBubble,
listDocsBubble, 
errorScreen, 
initButtonBubble,
subcategoriesButtonBubble,
intensionButtonBubble,
moreButtonBubble,
msgError,
initError,
subcategoriesBubble,
intensionBubble,
notRelatedBubble,
loadpageDiv; 

//scroll on result_div
var scrollResult;

//save the variables in order to get it later without to look for it
appDiv = document.getElementById("app_div");
searchbarDiv = document.getElementById("searchbar_div");
resultsDiv = document.getElementById("results_div");
menuDiv = document.getElementById("menu_div");
linksbarDiv = document.getElementById("linksbar_div");
searchBtn = document.getElementById("searchbtn");
searchtxt = document.getElementById("searchtxt");
languageSearch = document.getElementsByName("languageSearch");
loadpageDiv = document.getElementById("loadpage_div");

//global variables (load control). The component are built once, the first load of application
var isBuiltListDocsBubble,
isBuiltIntensionBubble,
isBuiltSubcategoriesBubble,
isBuiltErrorBubble,
isBuiltNotRelatedBubble = false,
languageSearchChecked;

//var to save the position and state of event and to handle the swipe event
var down_x = null;
var up_x = null;
var wasMoved = false;

//var to split the iscroll moving and select bubble
var auxX;

//var url
var protocol = "http";

//Setting emulator chrome
var server = "127.0.0.1";
var port = "7000";

var nameResourceSearch = "/bubble-search";
var url;

var app = {
    // Application Constructor
    initialize: function() {
    	console.log("Initializing bubble...");
    	
    	// Initial state showing the body on central page
        state="body";
        
        // initial positions div's
        appDiv.className = 'page center';
        menuDiv.className = 'page center';
        resultsDiv.className = 'results right';
        linksbarDiv.className = 'page down';
        loadpageDiv.className = 'page up';
		
        this.bindEvents();
    },
    
    // Bind Event Listeners
    // Bind any events that are required on startup. Common events are: 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    
    // deviceready Event Handler
    // The scope of 'this' is the event. In order to call the 'receivedEvent' function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
    	
    	try {
	    	app.receivedEvent('deviceready');
				
	    	// Execute the FastClick function, which removes the 300ms delay when the user click 
	        new FastClick(document.body);
	        
	        //device features
	    	console.log('Device name: '+ device.name );
	    	console.log('Device model: '+ device.model);
	    	console.log('Device cordova: '+ device.cordova );
	    	console.log('Device platform: '+ device.platform );
	    	console.log('Device uuid: '+ device.uuid );
	    	console.log('Device version: '+ device.version );
	    	
	    	//info native browser
	    	console.log('Native browser: '+ navigator.userAgent );
	    	
	    	//checking if native browser support touch events
	    	var touchable = 'createTouch' in document;
	    	console.log('touch events are supported by native browser '+touchable);
	    	//show a message and exit from app
	    	if(touchable==false) {
	    		app.alertErrorAndExit(null, "Sorry, the native browser doesn't support touch events... Please contanct the site administrator.");
	    	}
	    	
    	   	//build the device info into the menu. 
	    	buildInfoDeviceMenu();
	    	
	    	//build the common components like back list bottom , undo bottom
	        buildCommonComponents();
	    	
	        console.log("Setting Swipe events...");
	        //handle swipe event on results layer in order to open the menu
	        appDiv.addEventListener('touchstart', function(e) {
	        	// If there's exactly one finger inside this element
	            var touch = e.targetTouches[0];
	            console.log('start moving event on app div');
	        	down_x = touch.pageX;
	        }, false);
	        
	        appDiv.addEventListener('touchmove', function(e) {
	        	e.preventDefault();
	        	console.log('keep moving event on app div');
	        	var touch = e.targetTouches[0];
	    		up_x = touch.pageX;
	    		wasMoved = true;
	      	}, false);
	        
	        appDiv.addEventListener('touchend', function(e) {
	        	console.log('finish moving event on app div');
	    		if(wasMoved) {
	    			openMenu();
	    			wasMoved = false;
	    		}
	        	
	      	}, false);
	        
	        //handle swipe event in order to close the menu
	        menuDiv.addEventListener('touchstart', function(e) {
	            var touch = e.targetTouches[0];
	            console.log('start moving event on menu div');
	        	down_x = touch.pageX;
	        }, false);
	        
	        menuDiv.addEventListener('touchmove', function(e) {
	        	e.preventDefault();
	        	console.log('keep moving event on menu div');
	        	var touch = e.targetTouches[0];
	    		up_x = touch.pageX;
	    		wasMoved = true;
	        }, false);
	        
	        menuDiv.addEventListener('touchend', function(e) {
	        	console.log('finish moving event on menu div');
	        	if(wasMoved) {
	        		closeMenu();
	        		wasMoved = false;
	        	}
	      	}, false);
	        
	                
	        //check the internet connection
	        console.log("Connection stage initialization..."+navigator.network.connection.type);
	        if(navigator.network.connection.type == Connection.NONE) {
	        	app.error(null, "You are offline...");
	    		//disable search buttom
	        	searchBtn.disabled = true;
	        } 
	        document.addEventListener("online", app.handleConnection, false);
	    	document.addEventListener("offline", app.handleConnection, false);
	    	
	    	
	    	
	    	//get the url depending on the device
	    	//If we are executing on goggle chrome, this event "OnDeviceReady" will never be executed, so to connect to localhost 127.0.0.1 where is deployed the local back-end we use the default connection parameters (127.0.0.1:7000)
	    	if(device.platform == "Android" && device.model == "sdk") {
	    		//we are executing on andorid emulator. So to connect to local back-end we have to connect to IP: 10.0.2.2 (look documentation about android emulator)
	    		server = "10.0.2.2";
	    		port = "7000";
	    	}
	    	else {
	    		//Rest of options (from blackberry emulator or real devices to connect with the public access back-end on heroku server )
	    		server = "bubble-end.herokuapp.com";
	    		port = "80";
	    	}
	    	url = protocol+"://"+server+":"+port;
	    	console.log("setting url backend: "+url);
	    }
    	catch (e) {
    		/*if the error happens during the app init, then it doesn't make sense go to error page, because the
    		 * app is not initialized. Then we set a notification and exit from app. 
    		 */ 
    		app.alertErrorAndExit(e, "Fatal error initializing... Please contanct with the site administrator.");
    	}
    },
    
    
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    },
    
    
    //internet conection 
    handleConnection: function () {
    	console.log("handleConnection control was invoqued...");
    	try {
    		if(navigator.network.connection.type == Connection.NONE) {
	    		console.log("device is offline...")
	    		app.error(null, "You are offline...");
	    		//disable search buttom
	        	searchBtn.disabled = true;
	    	} else {
	    		console.log("device is online...")
	    		app.info(null, "Woot, you are back online.");
	    		//able search buttom
	    		searchBtn.disabled = false;
	    	}
    	}
    	catch(e) {
    		app.error(e, "Fatal error handle the connection... Please contanct the site administrator.");
    	}
    },
    
    //vibrate device
    vibrate: function () {
    	try {
    		//TODO: Establecer el segundo de vibracion como una propiedad externa
    		navigator.notification.vibrate(1000);
    	}
    	catch (e) {
    		app.info(e, "Error with vibration... Please contanct the site administrator.");
    	}
    },
    
    
    //handle errors and rise the error screen
    error: function(e, msg){
        //show on div results, the error image and the text
    	buildError(msg);
    	app.vibrate();
    	if(e != null) { msg = msg + "Exception: "+e;} 
    	console.log(msg);
    },
    
    //handle errors without error screen and exit
    alertErrorAndExit: function(e, msg){
    	app.vibrate();
    	navigator.notification.alert(msg, function() {navigator.app.exitApp();}, "Error");
    	if(e != null) { msg = msg + "Exception: "+e;}
    	console.log(msg);
	},
    
	//show a info message
    info: function (e, msg) {
    	if(e != null) { msg = msg + "Exception: "+e;}
    	navigator.notification.alert(msg, null, "Info");
    	console.log(msg);
    },
	
	//show a info message and init
    infoMsgExit: function (e, msg) {
    	navigator.notification.alert(msg, function() {navigator.app.exitApp();}, "Info");
    	if(e != null) { msg = msg + "Exception: "+e;}
    	console.log(msg);
    }
    
};

//add the device information into the menu div
function buildInfoDeviceMenu() {
	try {
		//It is not a global variable
		var deviceInfoMenu = document.getElementById("infoDevice");
		deviceInfoMenu.innerHTML = 'Device Model: '    + device.model    + '<br />' +
		'Device Name: '  + device.name  + '<br />' +
	    'Device Cordova: '  + device.cordova  + '<br />' +
	    'Device Platform: ' + device.platform + '<br />' +
	    'Device UUID: '     + device.uuid     + '<br />' +
	    'Device Version: '  + device.version  + '<br />';
	}
	catch(e) {
		app.alertErrorAndExit(e, "Fatal error building info device menu...Please contact with the site administrator.")
	}
}
