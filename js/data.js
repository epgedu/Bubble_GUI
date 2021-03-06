/**
 * data.js 
 * Manage the json object from server response
 * @author eduardo.guillen
 */

//id for slected formal concept
var idFormalConceptSelected;
//lattice from afc service
var JsonLattice;
//selected formal concept
var formalConcept;
//subcategorie descriptors array 
var subCategoriesDescriptors = [];
//descriptors intension array
var intensionDescriptors = [];
//ntop group
var nTop = [];
//descriptors not related array
var notRelatedDescriptors = [];
//position root formal concept
var positionRootNode = 0;
//total number of results
var totalResults = 0;
//id root node
var idRootFormalConcept;

//array to keep the last 10 search 
var historySearch = [];
var indexHistory = -1;
//max number to saved on history
var MAX_HISTORY = 10;


/**
 * save the current search (selected formal concept) on history array
 * @param idFormalConcept
 */
function savedHistory(idFormalConcept) {
		indexHistory ++;
		if(indexHistory == MAX_HISTORY) {
			//we get the limit
			indexHistory = 0; //the next search will be saved on the head 
		}
		historySearch[indexHistory] = idFormalConcept;
}

/**
 * get the previous search from history
 */
function getPreviousHistory() {
	//consult the previous position, if the value is false then that mean that there is not a saved concept formal, therefore there is not more history (just save the last MAX_HISTORY changes )
	var previousHistory = historySearch[getPreviousIndexHistory()];
	if( previousHistory == false ) {
		return false;
	}
	else {
		//if there is history on previous position
		//the first task is to remove the current formal concept history
		historySearch[indexHistory] = false;
		//uodate the index
		indexHistory = getPreviousIndexHistory();
		//return id formal concept history
		return previousHistory;
	}
}

/**
 * get the previous index history
 */
function getPreviousIndexHistory() {
	if(indexHistory == 0) {
		return MAX_HISTORY - 1; // last history position
	}
	else{
		return indexHistory - 1; //go back one position
	}
}

/**
 * process the response from afc service 
 * @param jsonResponse
 */
function savedResponse(jsonResponse) {
	try {
		
		//init the history
		for (var i = 0; i < MAX_HISTORY; i++) {
			historySearch[i] = false; //indicamos que no hay concepto formal en ninguna posicion del historial
		}
	
		//get the response
		JsonLattice = JSON.parse(jsonResponse);
		console.log("No of formal concepts: "+JsonLattice.contentObjects.length);
		
		if(JsonLattice.contentObjects.length == 0) {
			console.log("Error, response empty");
			app.infoMsgExit(null, "Sorry, no results...");
		}
		else {
			//total results
			totalResults = JsonLattice.totalResult;
			console.log("No of formal results processed: "+totalResults);
			
			//get the position for root node. Normally it will be the fist formal concept, but to be sure we get it.
			positionRootNode = getPosRootNode();
			idRootFormalConcept = JsonLattice.contentObjects[positionRootNode].conceptId;
			
			//add the inital search in history
			savedHistory(idRootFormalConcept);
			
			//get NTop group to get the not related nodes. Just once, due to this group NTop is always the same until the user make another search
			getNTop(positionRootNode);
			
			//fill the structures for extension, subcategories and intension
			mapDataGui(positionRootNode);
			
			// continue the workflow
			proSeach();
		}
	}
	catch(e) {
		console.log("Error, reading json response");
    	app.error(e, "Error, reading json response. Please contact the app administrator.");
	}
}


/**
 * Mapping the Json Object in order to get the data structures to show the information on the screen.
 * @param positionFormalConcept: position formal concept on the lattice vector. From this position, we get the intension and subcategories descriptors
 */
function mapDataGui(positionFormalConcept) {
	
	if(positionFormalConcept != null) {
		//when we are coming from initial search , we know the position of root node
		formalConcept = JsonLattice.contentObjects[positionFormalConcept];
	}
	else {
		//we need to find the selected formal concept
		formalConcept = JsonLattice.contentObjects[ findFormalConcept( idFormalConceptSelected )   ];
	}
	
	
	//get subcategories. It is the group of attributes among all children (union of every intension) minus the attributes from selected formal concept. It means that the subcategories are made from the intensions of all childrens, except
	//the inherited attributes from selected formal concept. 
	//first step, to create the group with every children's intension.
	subCategoriesDescriptors = [];//init array
	var formalConceptChildren;
	if(formalConcept != undefined) {
		for(var i = 0; i < formalConcept.childrenFormalConceptId.length; i++) {
			//look for the children
			formalConceptChildren = JsonLattice.contentObjects[ findFormalConcept( formalConcept.childrenFormalConceptId[i] )   ];
			//add the intension
			for(var j = 0; j < formalConceptChildren.intension.length; j++) {
				//check the attribute is not inherited  
				var attributeInherited = false;
				for(var k = 0; k < formalConcept.intension.length && attributeInherited == false; k++) {
					if(formalConcept.intension[k].id == formalConceptChildren.intension[j].id){
						attributeInherited = true;
					}
				}
				if(!attributeInherited) {
					//add attribute
					
					subCategoriesDescriptors.push(formalConceptChildren.intension[j]);
				}
			}
		}
	}
	console.log("Subcategories: ");
	for(var i = 0; i < subCategoriesDescriptors.length; i++) {
		console.log(subCategoriesDescriptors[i]);
	}
	
	//get the attributes to go up through lattice (intensionDescriptors).  
	intensionDescriptors = []; //init array
	var formalConceptParent;
	if(formalConcept != undefined) {
		//if the formal concept is the root node, then the user cannot go up because it is on the top level
		if(formalConcept.conceptId == idRootFormalConcept){
			var linkToRoot = new Object();
			linkToRoot.id = "top"; //id to jump to root node
			intensionDescriptors.push(linkToRoot);
			intensionDescriptors[intensionDescriptors.length - 1].inherited = true;
			
		}else if (formalConcept.parentsFormalConceptId.length == 1 && formalConcept.parentsFormalConceptId[0] == idRootFormalConcept) {
			//if the user is at children of the root node, then just there is one way to go up, it is jumping to root node. (because the root node has not got intension)
			var linkToRoot = new Object();
			linkToRoot.id = "jumpToTop"; //id to jump to root node
			intensionDescriptors.push(linkToRoot);
			intensionDescriptors[intensionDescriptors.length - 1].inherited = true;
		}
		else {
			//The group is is the same than the intension of the current formal concept, but removing the attributes are not inherited.
			for(var i = 0; i < formalConcept.intension.length; i++) {
				intensionDescriptors.push(formalConcept.intension[i]);
				if(isInherited(formalConcept, formalConcept.intension[i].id)) {
					intensionDescriptors[intensionDescriptors.length - 1].inherited = true;	
				}
				else {
					intensionDescriptors[intensionDescriptors.length - 1].inherited = false;
				}
			}
		}
	}
	console.log("Attributes Intension: ");
	for(var i = 0; i < intensionDescriptors.length; i++) {
		console.log(intensionDescriptors[i]);
	}
	
	notRelatedDescriptors = []; //init array
	//get the attributes to represent the options to go toward not related nodes on the lattice. For that, we need remove from ntop group the attributes which makes the intension for selected node.
	//the ntop group always is the same until the user do a new search. Therefore, we get ntop group on the beginning when we receive the json object
	if(formalConcept != undefined) {
		//checking if the selected formal concept is the root node then we don't build the not related group. If we build this group, his content will be the same than subcategories group and this doesn't make sense
		if(formalConcept.conceptId != idRootFormalConcept ) {
			//first step is fill the not related vector whit ntop group
			for ( var i = 0; i < nTop.length;  i++ ) {
				notRelatedDescriptors[i] = nTop[i];
			}
			//for each attribute (intension) in the current formal concept, chek if this is in ntop
			for(var i = 0; i < formalConcept.intension.length; i++) {
				//check if the attribute is in nTop
				var posInNtop = isInNtop(formalConcept.intension[i].id);
				if (posInNtop > -1) {
					//if it is in ntop, then we need to remove it from not related group
					removeNotRelated(formalConcept.intension[i].id);
				}
			}
		}
	}
	console.log("Not related: ");
	for(var i = 0; i < notRelatedDescriptors.length; i++) {
		console.log(notRelatedDescriptors[i]);
	}
	
	//checking if we are at leaf node (not documents, not subcategories, not related). In this case, we cannot go ahead because it is the end of the way. We need to go back toward root node
	if (formalConcept != undefined) {
		if (formalConcept.extension.length == 0 && subCategoriesDescriptors.length == 0 && notRelatedDescriptors.length == 0) {
				app.info(null, "End of the road!!!. We cannot go ahead because there are not more subcategories or not related ways. We need to go back toward the start");
				console.log("Info: We are on a leaf node");
		}
	}
	
}

/**
 * with an id descriptor we get the parent with this descriptor in its intension. We return the first parent where we find the attribute and we finish the search
 * @param idSelectedDescriptor
 */
function getParentsWithDescriptor(idSelectedDescriptor) {
	
	//if idSelectedDescriptor is "root" we are forcing to jump to root node
	if(idSelectedDescriptor == "jumpToTop") {
		idFormalConceptSelected = idRootFormalConcept;
		console.log("jumping to root node: "+idRootFormalConcept);
		//add the new search to the history
		savedHistory(idRootFormalConcept);
		return null;
	}
	else {
		//to look for in every parent
		var formalConceptParent;
		if(formalConcept != undefined) {
			for(var i = 0; i < formalConcept.parentsFormalConceptId.length; i++) {
				//get the formal concept parent
				formalConceptParent = JsonLattice.contentObjects[ findFormalConcept( formalConcept.parentsFormalConceptId[i] )   ];
				//look for the attribute 
				for(var j = 0; j < formalConceptParent.intension.length; j++) {
					//check if the attribute is  
					if(formalConceptParent.intension[j].id == idSelectedDescriptor) {
						//parent found
						idFormalConceptSelected = formalConceptParent.conceptId;
						console.log("new formal concept: "+idFormalConceptSelected);
						//add the new search to the history
						savedHistory(idFormalConceptSelected);
						return null;
					}
				}
			}
		}
	}
}

/**
 * with an id descriptor we get the children with this descriptor in its intension. Just can be one descendent who posses the attribute. The reason is because the user could not select any inherited attributes
 * from current formal concept.
 * @param idSelectedDescriptor
 */
function getChildrenWithDescriptor(idSelectedDescriptor) {
	//to look for in every children
	var formalConceptChildren;
	if(formalConcept != undefined) {
		for(var i = 0; i < formalConcept.childrenFormalConceptId.length; i++) {
			//get the formal concept parent
			formalConceptChildren = JsonLattice.contentObjects[ findFormalConcept( formalConcept.childrenFormalConceptId[i] )   ];
			//look for the attribute 
			for(var j = 0; j < formalConceptChildren.intension.length; j++) {
				//check if the attribute is  
				if(formalConceptChildren.intension[j].id == idSelectedDescriptor) {
					//parent found
					idFormalConceptSelected = formalConceptChildren.conceptId;
					console.log("new formal concept: "+idFormalConceptSelected);
					//add the new search to the history
					savedHistory(idFormalConceptSelected);
					return null;
				}
			}
		}
	}
	
}

/**
 * with an id descriptor we get the not related node with this descriptor. Just can be one not related formal concept who posses the attribute. The reason is because the user could not select
 * any inherited attributes from root node.
 * @param idSelectedDescriptor
 */
function getNotRelatedWithDescriptor(idSelectedDescriptor) {
	//to look for in every formal concept children from root node
	var formalConceptRoot = JsonLattice.contentObjects[positionRootNode];
	
	var formalConceptChildrenRoot;
	if(formalConceptRoot != undefined) {
		for(var i = 0; i < formalConceptRoot.childrenFormalConceptId.length; i++) {
			//get the formal concept parent
			formalConceptChildrenRoot = JsonLattice.contentObjects[ findFormalConcept( formalConceptRoot.childrenFormalConceptId[i] )   ];
			//look for the attribute 
			for(var j = 0; j < formalConceptChildrenRoot.intension.length; j++) {
				//check if the attribute is  
				if(formalConceptChildrenRoot.intension[j].id == idSelectedDescriptor) {
					//parent found
					idFormalConceptSelected = formalConceptChildrenRoot.conceptId;
					console.log("new formal concept: "+idFormalConceptSelected);
					//add the new search to the history
					savedHistory(idFormalConceptSelected);
					return null;
				}
			}
		}
	}
}

/**
 * we select the formal concept which has as id the same value than formalConceptId parameter
 */
function changeToFormalConceptHistory(formalConceptId) {
	idFormalConceptSelected = formalConceptId;
	console.log("new formal concept: "+formalConceptId);
	//in this case, we don't save the new formal concept in history, becasuse we got it from the history
}

/**
 * get nTop group from root node position.  
 * The ntop group contains all attributes of root node childrens. Could be that one attribute is in different childrens, because of this attribute is inherited from root node. 
 * In this case, the inherited attribute is not included in ntop group because the truth is that this attribute just belong to the parent , in this case the root node. This descriptor 
 * will be used when the user want to get the root node. 
 */
function getNTop(rootPositionNode) {
	console.log("getting ntop group...");
	nTop = [];
	//for each children from root node
	var formalConceptRoot = JsonLattice.contentObjects[rootPositionNode];
	var childrenRootFormalconcept;
	if(formalConceptRoot != undefined) {
		for(var i = 0; i < formalConceptRoot.childrenFormalConceptId.length; i++) {
			//get the formal concept children
			childrenRootFormalconcept = JsonLattice.contentObjects[ findFormalConcept( formalConceptRoot.childrenFormalConceptId[i] )   ];
			//look for the attribute 
			var attribute;
			for(var j = 0; j < childrenRootFormalconcept.intension.length; j++) {
				//check the attribute is not inherited from root node  
				var attributeInherited = false;
				for(var k = 0; k < formalConceptRoot.intension.length && attributeInherited == false; k++) {
					if(formalConceptRoot.intension[k].id == childrenRootFormalconcept.intension[j].id){
						attributeInherited = true;
					}
				}
				if(!attributeInherited) {
					//add attribute
					nTop.push(childrenRootFormalconcept.intension[j]);
				}
			}
		}
	}
}

 /**
  * We check whether the attribute is contained in ntop group
  * @param idAttribute
  * @returns
  */
function isInNtop(idAttribute) {
	for (var i = 0; i < nTop.length; i++) {
		if(nTop[i].id == idAttribute) {
			return i;
		}
	}
	return -1;
}

/**
 * seek a formal concept in retticulo from an id formal concept
 * @param formalconceptId
 * @returns
 */
function findFormalConcept(formalconceptId) {
	for(var i = 0; i < JsonLattice.contentObjects.length; i++ ) {
		if(JsonLattice.contentObjects[i].conceptId == formalconceptId) {
			return i;
		}
	}
	return null;
}

/**
 * we get the root node position.
 * @returns
 */
function getPosRootNode() {
	for(var i = 0; i < JsonLattice.contentObjects.length; i++ ) {
		//the root node is the unique node without parents
		if(JsonLattice.contentObjects[i].parentsFormalConceptId.length == 0) {
			return i;
		}
	}
	return null;
}

/**
 * Remove not related descriptor in no related array
 * @param idDescriptor
 */
function removeNotRelated(idAttribute) {
	for (var i = 0; i < notRelatedDescriptors.length; i++) {
		if(notRelatedDescriptors[i].id == idAttribute) {
			notRelatedDescriptors.splice(i,1);
			return;
		}

	}
}

/**
 * Checking if the attribute (idIntension) is in a parent of selected formal concept (formalConcept) 
 * @param formalConcept
 * @param idIntension
 * @returns {Boolean}
 */
function isInherited(formalConcept, idIntension) {
	
	var formalConceptParent;
	for(var i=0; i<formalConcept.parentsFormalConceptId.length; i++) {
		formalConceptParent = JsonLattice.contentObjects[ findFormalConcept( formalConcept.parentsFormalConceptId[i] )   ];
		//look for the attribute 
		for(var j = 0; j < formalConceptParent.intension.length; j++) {
			//check if the attribute is  
			if(formalConceptParent.intension[j].id == idIntension) {
				return true;
			}
	
		}
	}
	return false;
}