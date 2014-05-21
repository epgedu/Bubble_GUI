/**
 * file which contains the UI Components and their behaviours 
 */

//Build the common components (buttons)
function buildCommonComponents() {
	console.log("buildCommonComponents method executing....");
	try {
		//build init button in order to start again
		buildInitButton();
		//built back to main list button
		buildBackListButton();
		//built undo button
		buildUndoButton();
		//build subcategories button
		buildSubcategoriesButton();
		//build intesion button
		buildIntensionButton();
		//build not related button
		buildMoreButton();
	}
	catch(e) {
		app.error(e, "Fatal error building common elements... Please contanct the site administrator.");
	}
}

//Build init button
function buildInitButton() {
	//button bubble init
	initButtonBubble = document.createElement("div");
	
	var image = document.createElement("img"); 
	image.className = 'link_init_bubble';
	image.src = "img/init.png"; 
    image.alt = "Go to init";
	initButtonBubble.appendChild(image); 
	
    
	initButtonBubble.addEventListener('touchstart', function(e) {
		event.preventDefault();
		console.log('the user cliked on init button');
		goInit();
	}, false);
}

//Build button in order to come to main list documents back
function buildBackListButton() {
	//button div
	backListButtonBubble = document.createElement('div');
	var image = document.createElement("img"); 
	image.className = 'back_list_bubble';
	image.src = "img/back.png"; 
	image.alt = "Return to results";
	backListButtonBubble.appendChild(image); 
	
	backListButtonBubble.addEventListener('touchstart', function(e) {
		event.preventDefault();
		console.log('the user clicked on go back to list documents button');
		//hide the result layer
		hideResults();
		//remove all divs from results div parent
		cleanResultDiv();
		//hide de links bar
		hideLinksBar();
		//build the link bar, draw docs list and show link bar
		window.setTimeout("buildLinksBar(true);drawListDocBubble();showLinksBar();",1000); //1second is the spent time on the hide transition
	}, false);
}

//Build button in order to show the subcategories
function buildSubcategoriesButton() {
	//subcategories button div
	subcategoriesButtonBubble = document.createElement('div');
	var image = document.createElement("img"); 
	image.className = 'link_subcategories_bubble';
	image.src = "img/add.png";
	image.alt = "Add filter";
	subcategoriesButtonBubble.appendChild(image);
	
	subcategoriesButtonBubble.addEventListener('touchstart', function(e) {
		event.preventDefault();
		console.log('the user clicked on subcategories button');
		//hide the result layer
		hideResults();
		//hide docs link bar
		hideLinksBar();
		//remove all divs from results div parent
		cleanResultDiv();
		//build the links var, draw subcategories and show link bar
		window.setTimeout("buildLinksBar(false);drawSubcategoriesBubble();showLinksBar();",1000); //1second is the spent time on the hide transition
	}, false);
}

//Build intension button
function buildIntensionButton() {
	//intension button div
	intensionButtonBubble = document.createElement('div');
	var image = document.createElement("img"); 
	image.className = 'link_intension_bubble';
	image.src = "img/home.png";
	image.alt = "Your filters";
	intensionButtonBubble.appendChild(image);
	
	intensionButtonBubble.addEventListener('touchstart', function(e) {
		event.preventDefault();
		console.log(' the user clicked on intension button');
		//hide the result layer
		hideResults();
		//hide docs link bar
		hideLinksBar();
		//remove all divs from results div parent
		cleanResultDiv();
		//build the links var, draw subcategories and show link bar
		window.setTimeout("buildLinksBar(false);drawIntensionBubble();showLinksBar();",1000); //1second is the spent time on the hide transition
	}, false);
}

//Build undo button
function buildUndoButton() {
	//undo button div
	undoButtonBubble = document.createElement('div');
	var image = document.createElement("img"); 
	image.className = 'link_undo_bubble';
	image.src = "img/undo.png";
	image.alt = "Back";
	undoButtonBubble.appendChild(image);
	
	undoButtonBubble.addEventListener('touchstart', function(e) {
		event.preventDefault();
		console.log('the user clicked on undo button');
		
		//check if there is history
		var previousHistory = getPreviousHistory();
		if(previousHistory != false) {
			selectBubbleHistory(previousHistory);
		}
		else {
			app.info(null, "No more results on history");
		}
	}, false);
}

//buid more (not related) button
function buildMoreButton() {
	moreButtonBubble = document.createElement('div');
	var image = document.createElement("img"); 
	image.className = 'link_notrelated_bubble';
	image.src = "img/notrelated.png";
	image.alt = "No related";
	moreButtonBubble.appendChild(image);
	
	moreButtonBubble.addEventListener('touchstart', function(e) {
		event.preventDefault(); //in order to avoid open the menu
		console.log('the user clicked on not related button');
		//hide the result layer
		hideResults();
		//hide docs link bar
		hideLinksBar();
		//remove all divs from results div parent
		cleanResultDiv();
		//build the links var, draw subcategories and show link bar
		window.setTimeout("buildLinksBar(false);drawNotRelatedBubble();showLinksBar();",1000); //1second is the spent time on the hide transition
	}, false);	
}



//Build list docs bubble div. This div contains the results which belong to extension of the selected node.  
function buildListDocBubble() {
	try {
		var TAG_SNIPPET = "snippetObjectBubble:";
		var TAG_URL = "urlObjectBubble:";
		//if the component hasn't been built then it builds the components. Just once.
		if(!isBuiltListDocsBubble) {
			console.log("creating the list docs bubble component...");
			listDocsBubble = document.createElement('div');
			listDocsBubble.className = 'scroller_bubble';
			listDocsBubble.id = 'scroller_list_docs_bubble';
			isBuiltListDocsBubble = true; //this object will not be built again
			
			listDocsBubble.addEventListener('touchmove', function(e) {
				event.preventDefault();
			}, false);
		}
		
		
		//it creates the bubbles with datas
		var tittle;
		var snippet;
		var url;
		var initSnippet;
		var initUrl;
		var auxUrl;
		var endUrl;
		var calls = [];
		var elements = [];
		
		//refresh datas on list doc bubble
		console.log("refresing datas on list documents bubble...");
		
		if(formalConcept != undefined) {
			listDocsBubble.innerHTML = "Results... "+formalConcept.extension.length+" of "+totalResults;
			for (i=0; i<formalConcept.extension.length; i++) {
				var listLink = document.createElement('li');
				listLink.className = 'li_list_doc';
				
				/*split the title, snippet and url*/
				/*the format when we have built the content was: vaule_title snippetObjectBubble:value_snippet || urlObjectBubble: vaule_url*/
				initSnippet = (formalConcept.extension[i].value).indexOf(TAG_SNIPPET);
				initUrl = (formalConcept.extension[i].value).indexOf(TAG_URL); 
				tittle = (formalConcept.extension[i].value).substring(0, initSnippet -1);
				snippet = (formalConcept.extension[i].value).substring(initSnippet + TAG_SNIPPET.length, initUrl);
				
				auxUrl = (formalConcept.extension[i].value).substring(initUrl + TAG_URL.length, (formalConcept.extension[i].value).length);
				endUrl = auxUrl.indexOf(" ");
				if(endUrl == -1) {
					//then there is not space after the url
					url = auxUrl;
				}
				else {
					url = auxUrl.substring(initUrl, endUrl);
					
				}
				console.log(formalConcept.extension[i].value);
				console.log(tittle);
				console.log(url);
				
				listLink.style.marginLeft = '5%';
				listLink.style.marginRight = '5%';
				listLink.innerHTML = "<b>"+tittle+"</b><br>";
				listLink.innerHTML += "<i>"+snippet+"</i><br>";
				listLink.innerHTML += "<a href='#'>"+url+"</a>";
				elements[i] = listLink;
				
				//define one function for each li object
				calls[i] = function(evt) {
					if(auxX == evt.changedTouches[0].pageX) { //if not moving
						window.open(evt.currentTarget.id, '_system', 'location=yes,toolbar=yes,EnableViewportScale=no');
					}
				};
				
				elements[i].addEventListener('touchstart', function(event) {
					auxX = event.targetTouches[0].pageX;
				}, false);
				//pass the url in order to know it when the event is thrown
				elements[i].id = url;
				elements[i].addEventListener('touchend', calls[i], false);
				listDocsBubble.appendChild(elements[i]);
			}
		}	
	}
	catch(e) {
		app.error(e, "Fatal error building list docs bubble... Please contanct the site administrator.");
	}
}

//buids the subcategories and intension bubbles div
function buildSubcategoriasIntension(){
	buildIntension();
	buildSubcategories();
	buildNotRelated();
}

//Buids the intension bubble div
function buildIntension() {
	try {
		var TAG_TYPE = "typeAttributeBubble";
		//if the component hasn't been built then it builds the components. Just once.
		if(!isBuiltIntensionBubble) {
			console.log("creating the intension bubble component...");
			intensionBubble = document.createElement('div');
			intensionBubble.className = 'scroller_bubble';
			intensionBubble.id = 'scroller_search_trace_bubble';
			isBuiltIntensionBubble = true; //this object will not be built again
		
			intensionBubble.addEventListener('touchmove', function(e) {
				event.preventDefault();
			}, false);	
		}
		
		//refresh data on intension bubble
		console.log("refresing datas on intension bubble...");
		intensionBubble.innerHTML = "Your categories...";
				
		//draw the bubble without content. Totally 10 bubbles
		for (i=0; i<10; i++) {
			var xy = getRandomPositionOnResultsDiv();
			intensionBubble.innerHTML += "<li class='li_space' style='left:"+xy[0]+"px;top:"+xy[1]+"px'></li>";
		}
		//draw the bubbles with datas 
		var initType;
		var nameAttribute;
		var typeAttribute;
		for (i=0; i<intensionDescriptors.length; i++) {
			var left = '0%'; //position bubbles with content
			if (i % 3 == 0) {left = '30%';}
			if (i % 3 == 1) {left = '10%';}
			if (i % 3 == 2) {left = '55%';}
			var bubbleLink = document.createElement('li');
			
			initType = (intensionDescriptors[i].value).indexOf(TAG_TYPE);
			nameAttribute = (intensionDescriptors[i].value).substring(0, initType -1);
			typeAttribute = (intensionDescriptors[i].value).substring(initType + TAG_TYPE.length, intensionDescriptors[i].value.length);
			
			//setting id element "li" with the id descriptor. That way, when the user ckick on the bubble, we can know the selected descriptor during the event
			bubbleLink.id = intensionDescriptors[i].id;
			bubbleLink.style.marginLeft = left;
			bubbleLink.innerHTML = "<br><br><br> "+nameAttribute+"<br>";
			bubbleLink.innerHTML += "<i>"+typeAttribute+"</i>"
			
			//if the attribute is inherited then it cannot be pushed in order to ascendent through lattice 
			if(intensionDescriptors[i].inherited == false) { 
				bubbleLink.className = 'li_bubble';
				bubbleLink.style.background = getRandomColour();
				
				bubbleLink.addEventListener('touchstart', function(event) {
					auxX = event.targetTouches[0].pageX;
		    	}, false);
			
				bubbleLink.addEventListener('touchend', function(event) {
					event.stopPropagation();
					if(auxX == event.changedTouches[0].pageX) { //if not moving
						console.log("refreshing from intension bubble...");
						selectBubbleIntension(event.target.id); 
					}
				}, false);
			}
			else {
				bubbleLink.className = 'li_bubble_inherited';
				
				bubbleLink.innerHTML += "<br><b>{Attribute inherited}<b>";
			}
			intensionBubble.appendChild(bubbleLink);
		}
		
	}
	catch(e) {
		app.error(e, "Fatal error building intension bubble... Please contanct the site administrator.");
	}
}




//Builds the refine bubble div
function buildSubcategories() {
	try {
		var TAG_TYPE = "typeAttributeBubble";
		if(!isBuiltSubcategoriesBubble) {
			console.log("creating the subcategories bubble component...");
			subcategoriesBubble = document.createElement('div');
			subcategoriesBubble.id = 'scroller_refine_bubble'; 
			subcategoriesBubble.className = 'scroller_bubble';
			isBuiltSubcategoriesBubble = true; //this object will not be built again
				
			subcategoriesBubble.addEventListener('touchmove', function(e) {
				event.preventDefault(); //in order to avoid open the menu
			}, false);	
		}
		
		//refresh subcategories bubble
		console.log("refresing datas on subcategories bubble...");
		subcategoriesBubble.innerHTML = "Subcategories..."; 
			
		//draw the bubble without content. Totally 10 bubbles  DUPLICADO
		for (i=0; i<10; i++) {
			var xy = getRandomPositionOnResultsDiv();
			subcategoriesBubble.innerHTML += "<li class='li_space' style='left:"+xy[0]+"px;top:"+xy[1]+"px'></li>";
		}
			
		//draw the bubbles with datas
		var initType;
		var nameAttribute;
		var typeAttribute;
		for (i=0; i<subCategoriesDescriptors.length; i++) {
			var left = '0%'; //position bubbles with content
			if (i % 3 == 0) {left = '30%';}
			if (i % 3 == 1) {left = '10%';}
			if (i % 3 == 2) {left = '55%';}
			var bubbleLink = document.createElement('li');
			bubbleLink.className = 'li_bubble';

			initType = (subCategoriesDescriptors[i].value).indexOf(TAG_TYPE);
			nameAttribute = (subCategoriesDescriptors[i].value).substring(0, initType -1);
			typeAttribute = (subCategoriesDescriptors[i].value).substring(initType + TAG_TYPE.length, subCategoriesDescriptors[i].value.length);
			
			//setting id element "li" with the id descriptor. That way, when the user ckick on the bubble, we can know the selected descriptor during the event
			bubbleLink.id = subCategoriesDescriptors[i].id;
			
			bubbleLink.style.marginLeft = left;
			bubbleLink.style.background = getRandomColour();
			bubbleLink.innerHTML = "<br><br>"+nameAttribute+"<br>";
			bubbleLink.innerHTML += "<i>"+typeAttribute+"</i>"
				
			bubbleLink.addEventListener('touchstart', function(event) {
				auxX = event.targetTouches[0].pageX;
	    	}, false);
			
			bubbleLink.addEventListener('touchend', function(event) {
				event.stopPropagation();
				if(auxX == event.changedTouches[0].pageX) { //if not moving
					console.log("refreshing from subcategories bubble...");
					selectBubbleSubcategories(event.target.id); 
				}
			}, false);
			
			subcategoriesBubble.appendChild(bubbleLink);
		}
		 
	}
	catch(e) {
		app.error(e, "Fatal error building refine bubble... Please contanct the site administrator.");
	}
}

/*
 * function to built the not related bubble
 */
function buildNotRelated() {
	try {
		var TAG_TYPE = "typeAttributeBubble";
		if(!isBuiltNotRelatedBubble) {
			console.log("creating the not related bubble component...");
			notRelatedBubble = document.createElement('div');
			notRelatedBubble.id = 'scroller_notrelated_bubble'; 
			notRelatedBubble.className = 'scroller_bubble';
			isBuiltNotRelatedBubble = true; //this object will not be built again
				
			notRelatedBubble.addEventListener('touchmove', function(e) {
				event.preventDefault(); //in order to avoid open the menu
			}, false);	
		}
		
		//refresh not related bubble
		console.log("refresing datas on not related bubble...");
		notRelatedBubble.innerHTML = "Not Related with your current filters... "; 
			
		//draw the bubble without content. Totally 10 bubbles  DUPLICADO
		for (i=0; i<10; i++) {
			var xy = getRandomPositionOnResultsDiv();
			notRelatedBubble.innerHTML += "<li class='li_space' style='left:"+xy[0]+"px;top:"+xy[1]+"px'></li>";
		}
			
		//draw the bubbles with datas
		var initType;
		var nameAttribute;
		var typeAttribute;
		for (i=0; i<notRelatedDescriptors.length; i++) {
			var left = '0%'; //position bubbles with content
			if (i % 3 == 0) {left = '30%';}
			if (i % 3 == 1) {left = '10%';}
			if (i % 3 == 2) {left = '55%';}
			var bubbleLink = document.createElement('li');
			bubbleLink.className = 'li_bubble';
			
			initType = (notRelatedDescriptors[i].value).indexOf(TAG_TYPE);
			nameAttribute = (notRelatedDescriptors[i].value).substring(0, initType -1);
			typeAttribute = (notRelatedDescriptors[i].value).substring(initType + TAG_TYPE.length, notRelatedDescriptors[i].value.length);
			
			//setting id element "li" with the id descriptor. That way, when the user ckick on the bubble, we can know the selected descriptor during the event
			bubbleLink.id = notRelatedDescriptors[i].id;
			
			bubbleLink.style.marginLeft = left;
			bubbleLink.style.background = getRandomColour();
			bubbleLink.innerHTML = "<br><br><br>"+nameAttribute; 
			bubbleLink.innerHTML += "<i>"+typeAttribute+"</i>"
			
			bubbleLink.addEventListener('touchstart', function(event) {
				auxX = event.targetTouches[0].pageX;
	    	}, false);
			
			bubbleLink.addEventListener('touchend', function(event) {
				event.stopPropagation();
				if(auxX == event.changedTouches[0].pageX) { //if not moving
					console.log("refreshing from not related bubble...");
					selectBubbleNotRelated(event.target.id); 
				}
			}, false);
			
			notRelatedBubble.appendChild(bubbleLink);
		}
		 
	}
	catch(e) {
		app.error(e, "Fatal error building not related bubble... Please contanct the site administrator.");
	}
	
}


/*
 * function to build error screen.
 * If an error is cought then it does not call to app.error because this will call to buildError again, so theard is looping. 
 * Therefore, it catches the error, but handles it on this function, never calls to app.error. 
 */
function buildError(msg) {
	try {
		if(!isBuiltErrorBubble) { 
			console.log("creating error bubble component...");
			errorScreen = document.createElement('div');
			errorScreen.id = 'error';
			errorScreen.className = 'error';
			msgError = document.createElement('p');
			msgError.id = 'errormsg';
			msgError.className = 'msg_error';
			errorScreen.appendChild(msgError);
			
			//buttom init from error screen
			initError = document.createElement('div');
			var image = document.createElement("img"); 
			image.className = 'back_init_bubble';
			image.src = "img/back.png"; 
			image.alt = "Return to results";
			initError.appendChild(image);
			errorScreen.appendChild(initError);
			
			initError.addEventListener('touchstart', function(e) {
				console.log('click on init error');
				goInit();
			}, false);
			
			isBuiltErrorBubble = true;
		}	
		console.log("loading error bubble...")
		//hide results
		hideResults();
		//remove all divs from results div parent
		cleanResultDiv();
		//hide the links bar
		hideLinksBar();
		//add the error div to results
		addOnResults(errorScreen);
		document.getElementById('errormsg').innerHTML = "Sorry, we had some problems...<br/>"+msg;
		//show results
		showResults();
	}
	catch(e) {
		console.error("Exception: "+e+", Message: FATAL Error building error bubble div");
		navigator.notification.alert("FATAL Error building error bubble div...Please contanct the site administrator", function() {}, "Info");
		app.vibrate();
	}
}
