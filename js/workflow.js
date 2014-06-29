/**
 * workflow.js
 * Manage the user workflow
 */

//shows result div on screen
function showResults() {
	resultsDiv.className = 'results transition center';
}

//hides result div 
function hideResults() {
	resultsDiv.className = 'results transition right';
}

//shows the search bar div on screen
function showSearchBar () {
	searchbarDiv.className = 'page transition center';
}

//hides search bar div 
function hideSearchBar() {
	searchbarDiv.className = 'page transition up';
}

//shows the links bar div on screen
function showLinksBar() {
	linksbarDiv.className = 'page transition center';
}

//hides the links bar div
function hideLinksBar() {
	linksbarDiv.className = 'page transition down';
}

//add on results div, the element passed by parameter
function addOnResults(element) {
	resultsDiv.appendChild(element);
}

//add on results div, the element passed by parameter
function addOnLinkBar(element) {
	linksbarDiv.appendChild(element);
}

//clean the list docs
function cleanLinksBar() {
	//remove all divs from results div parent
	while ( linksbarDiv.firstChild ) linksbarDiv.removeChild( linksbarDiv.firstChild );
}

//function removes all components on result div
function cleanResultDiv() {
	//remove all divs from results div parent
	while ( resultsDiv.firstChild ) resultsDiv.removeChild( resultsDiv.firstChild );
}

//shows the load page div on screen
function showLoadPage () {
	loadpageDiv.className = 'page transition center';
}

//hides load page div 
function hideLoadPage() {
	loadpageDiv.className = 'page transition up';
}


//to open menu div
function openMenu() {
	try {
		//if swipe left more 80px on results layer
	    if ((up_x - down_x) > 80) {
	    	//if state is body
	    	if(state=="body"){ 
	    		console.log('open menu');
	    		appDiv.className = 'page transition right';
	            state="menu";
	        }
	    }
	}
	catch(e) {
		app.error(e, "Fatal error opening menu... Please contanct the site administrator.");
	}
}

// to close menu div
function closeMenu() {
	try {
		//if swipe right more 30px on menu layer
		if ((down_x - up_x) > 30) {
	    	//if state is menu
		  if(state=="menu"){
			  	console.log('close menu');
			  	appDiv.className = 'page transition center';
			  	state="body";        
			}
	    }
	}
	catch(e) {
		app.error(e, "Fatal error closing menu... Please contanct the site administrator.");
	}
}

//function is executed when the user click on search button 
function pushSearch() {
	try {
		console.log("Init Search...");
		
		//validation 
		if (validateSearch()) {
			//hide the search bar
			hideSearchBar();
			showLoadPage();
			sendRequest(searchtxt.value, languageSearchChecked);
		}
		else {
			//it not an exception, that's why the first parameter is null
			app.info(null, "Please, insert a text as search filter");
		}
	}
	catch(e) {
		hideLoadPage();
		app.error(e, "Fatal error searching... Please contanct the site administrator.");
	}
}

//search text field cannot be empty
function validateSearch() {
	console.log("text search filter: "+searchtxt.value)
	if (searchtxt.value == '') {
		return false;
	}
	else {
		for (i=0;i<languageSearch.length;i++){ 
			if (languageSearch[i].checked) {
				languageSearchChecked = languageSearch[i].value;
				break;
			}
		} 
		return true;
	}
}

//thrown actions after to get a response from backend
function proSeach() {
	try {
		hideLoadPage();
		buildListDocBubble();
		drawListDocBubble();
		buildLinksBar(true);
		showLinksBar();
		//after to show the screen , we build subcategories and intension
		buildSubcategoriasIntension();
	}
	catch(e) {
		hideLoadPage();
		app.error(e, "Fatal on pro-search process... Please contanct the site administrator.");
	}
}



//it's executed when the user click on any intension bubble
function selectBubbleIntension(idSelectedDescriptor) {
	try {
		//hide the result layer
		hideResults();
		//hide docs link bar
		hideLinksBar();
		//remove all divs from results div parent
		cleanResultDiv();
		
		//get the new data. From the selected formal concept, we seek on its parents in order to get the new formal concept
		getParentsWithDescriptor(idSelectedDescriptor);
		//mapping the information from the new selected node
		mapDataGui();

		//refresh the components
		buildListDocBubble();
		//build the links var, draw docs list and show link bar
		window.setTimeout("buildLinksBar(true);drawListDocBubble();showLinksBar();",1000); //1second is the spent time on the hide transition

		//after to show the screen , we build subcategories and intension
		buildSubcategoriasIntension(); 

	}
	catch(e) {
		app.error(e, "Fatal error loading result after to select an intension bubble... Please contanct the site administrator.");
	}
}

//it's executed when the user's clicked any subcategories bubble
function selectBubbleSubcategories(idSelectedDescriptor) {
	try {
		//hide the result layer
		hideResults();
		//hide docs link bar
		hideLinksBar();
		//remove all divs from results div parent
		cleanResultDiv();
		
		//get the new data. From the selected formal concept, we seek on its children in order to get the new formal concept
		getChildrenWithDescriptor(idSelectedDescriptor);
		//mapping the information from the new selected node
		mapDataGui();
		
		//refresh the components
		buildListDocBubble();
		//build the links var, draw docs list and show link bar
		window.setTimeout("buildLinksBar(true);drawListDocBubble();showLinksBar();",1000); //1second is the spent time on the hide transition

		//after to show the screen , we build subcategories and intension
		buildSubcategoriasIntension(); 
	}
	catch(e) {
		app.error(e, "Fatal error loading result after to select a subcategories bubble... Please contanct the site administrator.");
	}
}

//It's executed when the user's clicked any not related bubble
function selectBubbleNotRelated(idSelectedDescriptor) {
	try {
		//hide the result layer
		hideResults();
		//hide docs link bar
		hideLinksBar();
		//remove all divs from results div parent
		cleanResultDiv();
		
		//get the new data. From the selected formal concept, we seek on its children in order to get the new formal concept
		getNotRelatedWithDescriptor(idSelectedDescriptor);
		//mapping the information from the new selected node
		mapDataGui();
		
		//refresh the components
		buildListDocBubble();
		//build the links var, draw docs list and show link bar
		window.setTimeout("buildLinksBar(true);drawListDocBubble();showLinksBar();",1000); //1second is the spent time on the hide transition

		//after to show the screen , we build subcategories and intension
		buildSubcategoriasIntension(); 
	}
	catch(e) {
		app.error(e, "Fatal error loading result after to select a not related bubble... Please contanct the app administrator.");
	}
}

//it's executed when the user's clicked "Undo" button
function selectBubbleHistory(formalConceptId) {
	try {
		//hide the result layer
		hideResults();
		//remove all divs from results div parent
		cleanResultDiv();
		
		//get the new data
		changeToFormalConceptHistory(formalConceptId);
		//mapping the information from the new selected node
		mapDataGui();
		
		//refresh the components
		buildListDocBubble();
		//build the links var, draw docs list and show link bar
		window.setTimeout("drawListDocBubble();",1000); //1second is the spent time on the hide transition

		//after to show the screen , we build subcategories and intension
		buildSubcategoriasIntension(); 

	}
	catch(e) {
		app.error(e, "Fatal error loading result after to select a history search... Please contanct the app administrator.");
	}
	
}

//function goes toward init screen
function goInit() {
	try {
		hideResults();
		hideLinksBar();
		//remove all divs from results div parent
		cleanResultDiv();
		//remove the filter search
		searchtxt.value = "";
		languageSearch[0].checked = true;
		showSearchBar();
	}
	catch (e) {
		app.error(e, "Fatal error going to init screen... Please contanct the site administrator.");
	}
}



//function loads the components in order to show the intension bubbles 
function drawIntensionBubble() {
	try {
		//update the screen
		addOnResults(intensionBubble);
		buildScroll();
		showResults();	
	}
	catch(e) {
		app.error(e, "Fatal error drawing intension bubbles... Please contanct the site administrator.");
	}
}

//it draws the components in order to show the list of documents (extension of selected node)
function drawListDocBubble() {
	try {
		//update the screen
		addOnResults(listDocsBubble);
		buildScroll();
		//show results
		showResults();
	}
	catch(e) {
		app.error(e, "Fatal error drawing list of documents... Please contanct the site administrator.");
	}
}

//function loads the needed components to show the subcategories bubbles
function drawSubcategoriesBubble() {
	try {
		//update the screen
		addOnResults(subcategoriesBubble);
		buildScroll();
		showResults();	
	}
	catch(e) {
		app.error(e, "Fatal error drawing subcategories bubbles... Please contanct the site administrator.");
	}
	
}

//function loads the needed components to show the not related bubbles
function drawNotRelatedBubble() {
	try {
		//update the screen
		addOnResults(notRelatedBubble);
		buildScroll();
		showResults();	
	}
	catch(e) {
		app.error(e, "Fatal error drawing not related bubbles... Please contanct the site administrator.");
	}
}

//it builds the links bar. Depend on where the component will be show on list documents bubble or on subcategories/intension bubbles 
function buildLinksBar(isToDocsList) {
	try {
		cleanLinksBar();
		if(isToDocsList) { 
			linksbarDiv.style.width = "100%";
			addOnLinkBar(intensionButtonBubble);
			addOnLinkBar(subcategoriesButtonBubble);
			addOnLinkBar(initButtonBubble);
			addOnLinkBar(undoButtonBubble);
		}
		else {
			addOnLinkBar(backListButtonBubble);
			addOnLinkBar(moreButtonBubble);
		}
	}
	catch(e) {
		app.error(e, "Fatal error loading link bar... Please contanct the site administrator.");
	}
}

//function builds the iscroll components on result div
function buildScroll() {
	console.log('building scroll result');
	scrollResult = new IScroll('#results_div', {dimensions:{x:30,y:60}, mouseWheel: true });
	resultsDiv.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
}
