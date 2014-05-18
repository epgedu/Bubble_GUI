//array colour bubbles
var colours = new Array();
colours[0] = "#F08080"; //LightCoral
colours[1] = "#E9967A"; //DarkSalmon 
colours[2] = "#F08080"; //LightPink
colours[3] = "#FF6347"; //Tomato
colours[4] = "#FF8C00"; //DarkOrange
colours[5] = "#FFFF00"; //Yellow
colours[6] = "#FFE4B5"; //Moccasin
colours[7] = "#EE82EE"; //Violet
colours[8] = "#6A5ACD"; //SlateBlue
colours[9] = "#7FFF00"; //Chartreuse
colours[10] = "#00FF7F"; //SpringGreen
colours[11] = "#66CDAA"; //MediumAquamarine
colours[12] = "#40E0D0"; //Turquoise
colours[13] = "#00BFFF"; //DeepSkyBlue

/**
 * get the random position from result-width, result-height and the size of resultDiv
 * 
 * min position left -20, max left position (resultsDiv.offsetWidth - 50)
 * min position top -20, max top position ( (resultsDiv.offsetHeight * 3) - 20). *3 due to iscroll
 * It means that the bubbles can be out left, top and rigth 20 px.
 * 
 * Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
 * 
 * @param heightElement
 * @param widthElement
 * @returns {Array}
 */
function getRandomPositionOnResultsDiv() {
	var x = Math.floor(Math.random() * (resultsDiv.offsetWidth - 20) ) - 50;   
	var y = Math.floor(Math.random() * ( (resultsDiv.offsetHeight * 3) - 20) ) - 20;
	return [x,y];
}

/**
 * get a random colour
 * 
 * @returns
 */
function getRandomColour() {
	//instead to get a random colour, we gonna choose a colour among a list of colours. That is due to sometime the random colour is too much dark and the user cannnot read the text. 
	//so we got a number between 0 and 13 (we have an array with 14 colours)
	//Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
	return colours[ (Math.floor(Math.random() * (13 - 0 + 1)) )];
}
