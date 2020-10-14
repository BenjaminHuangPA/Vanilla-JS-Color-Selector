var color_selection_canvas = document.getElementById("color-selection-canvas");
var color_selection_ctx = color_selection_canvas.getContext('2d');
	    
//var colors = ['#FFFFFF', '#1c88c7', '#4f4443', '#41598a', '#a16535', '#1b6617', '#1a1766', '#cfc623', '#4ac918', '#35c42b'];
var colors = ['255, 255, 255',
			  '50, 186, 22', 
              '28, 136, 199', 
              '79, 68, 67', 
              '65, 89, 138', 
              '161, 101, 53', 
              '27, 102, 23',
              '26, 23, 102',
              '207, 198, 35',
              '74, 201, 24',
             ];

var color_names = [
					'ERASE',
					'FIELD',
					'RIVER',
					'MOUNTAIN',
					'LAKE',
					'CANYON',
					'FOREST',
					'OCEAN',
					'DESERT',
					'RAINFOREST',
				   ];

let R = 0;
let G = 0;
let B = 0;
            
let x_coord = 20;
let y_coord = 150;

let saved_R = 0;
let saved_G = 0;
let saved_B = 0;

let r_span = document.getElementById('R');
let g_span = document.getElementById('G');
let b_span = document.getElementById('B');

let r_selected_span = document.getElementById('selected_R');
let g_selected_span = document.getElementById('selected_G');
let b_selected_span = document.getElementById('selected_B');

var color_handle_img = new Image();
color_handle_img.src = "img/color_selector_handle.png";

let hsv_indicator_img = new Image();
hsv_indicator_img.src = "img/hsv_indicator.png"; 

let horiz_slider = document.getElementById("horiz_slider")
let slider_display = document.getElementById("slider_value");
horiz_slider.oninput = function(){
    slider_display.innerHTML = this.value;
    selectHSV(this.value);
}

/*

function modifyExistingBiome(){
	let name_text_field = document.getElementById('biome_name');
    let new_biome_name = name_text_field.value;
    if(new_biome_name == ""){
    	alert("Invalid name entered. Please try again.");
    } else {
      let final_r = r_selected_span.innerHTML;
      let final_g = g_selected_span.innerHTML;
      let final_b = b_selected_span.innerHTML;
      let new_color = final_r + ', ' + final_g + ', ' + final_b;
      let original_button_name = color_names[currentColor];
      let button_to_modify = document.getElementById(original_button_name);
      button_to_modify.innerHTML = new_biome_name;
      button_to_modify.style.backgroundColor = "rgb(" + final_r + ", " + final_g + ", " + final_b + ")";
      colors[currentColor] = new_color;
      color_names[currentColor] = new_biome_name;
    } 
}


function saveNewBiome(){

	//Once a user has used the color palette/hsv bar to select a color of their choosing, this function
	//adds this color to the "colors" array of biome colors and creates a new button for the biome menu.

    let name_text_field = document.getElementById('biome_name');
    let new_biome_name = name_text_field.value;
    if(new_biome_name == ""){
    	alert("Invalid name entered. Please try again.");
    } else {
        let final_r = r_selected_span.innerHTML;
        let final_g = g_selected_span.innerHTML;
        let final_b = b_selected_span.innerHTML;
        let new_color = final_r + ', ' + final_g + ', ' + final_b;
        console.log("New button color: " + new_color);
        colors.push(new_color);
        color_names.push(new_biome_name);
        let new_button = document.createElement('button');
        new_button.innerHTML = new_biome_name;
        new_button.style.backgroundColor = "rgb(" + new_color + ")";
        let colors_length = colors.length;
        //console.log(colors);
        new_button.addEventListener("click", switchColor(colors_length - 1), false);
        let buttons_list = document.getElementById('biomes-list');
        buttons_list.appendChild(new_button);
    } 
}
*/
        
function drawColorMap(){

	//This function draws the color palette.

    let current_R = 255;
    let current_G = 0;
    let current_B = 0;
	for(let i = 0; i < 76; i += 1){
	    let temp_R = current_R;
	    let temp_G = current_G;
	    let temp_B = current_B;
	    let num_iterations = 6 * (current_R - current_G);
	    let single_iteration = current_R - current_G;
	    for(let j = 0; j < num_iterations; j += 3){
	        if(j < single_iteration){
	        	temp_G += 3;
	        } else if (j >= single_iteration && j < single_iteration * 2){
	        	temp_R -= 3;
	        } else if (j >= single_iteration * 2 && j < single_iteration * 3){
	        	temp_B += 3;
	        } else if (j >= single_iteration * 3 && j < single_iteration * 4){
	        	temp_G -= 3;
	        } else if (j >= single_iteration * 4 && j < single_iteration * 5){
	        	temp_R += 3;
	        } else if (j >= single_iteration * 5 && j < single_iteration * 6){
	        	temp_B -= 3;
	        }
	        color_selection_ctx.fillStyle = 'rgb(' + temp_R + ', ' + temp_G + ', ' + temp_B + ')';
	        let width = 1530 / num_iterations;
	        color_selection_ctx.fillRect(x_coord, y_coord, width, 1);
	        x_coord += width;
	    }
	    x_coord = 20;
	    y_coord += 1;
	    current_B += 3;
	    current_G += 3;
	}
	x_coord = 20;
	y_coord = 150;
}

drawColorMap(); //draw the color palette upon loading the script



function getMousePos(color_selection_canvas, evt){

    //Get the mouse pos on the canvas

    var rect = color_selection_canvas.getBoundingClientRect();
	return{
	    x: evt.clientX - rect.left,
	    y: evt.clientY - rect.top
	};
}

function getCoordsFromRgb(r, g, b){

    //This function accepts 3 arguments (an r, g, and b value)
    //and translates this into an x and y coordinate on the color 
    //palette. 

	let x = 0;
	let y = 0;
	if(r == 255){
        if(g >= b){
            y = (b / 3) + 150;
            let multiplier = (255 - b) / 85;
            x = ((g - b) / multiplier) + 21;
        } else {
        	y = (g / 3) + 150;
        	let multiplier = (255 - g) / 85;
        	x = ((255 - b) / multiplier) + 446; 
        }
	} else if (g == 255){
        if(r >= b){
            y = (b / 3) + 150;
            let multiplier = (255 - b) / 85;
            x = ((255 - r) / multiplier) + 106;
        } else {
        	y = (r / 3) + 150;
        	let multiplier = (255 - r) / 85;
        	x = ((b - r) / multiplier) + 191
        }
	} else if (b == 255){
        if(g >= r){
        	y = (r / 3) + 150;
        	let multiplier = (255 - r) / 85;
        	x = ((255 - g) / multiplier) + 276;
        } else {
        	y = (g / 3) + 150;
        	let multiplier = (255 - g) / 85;
        	x = ((r - g) / multiplier) + 361;
        }
	}
	return {
		X: Math.round(x),
		Y: Math.round(y)
	}
}

function rgb_code_determiner(evt){

    //This function is called when the user clicks on the color selection canvas. It checks to see 
    //if they clicked on the color palette, and if so, it determines the RGB values at that specific point.
    //It returns these values.

	let mousepos = getMousePos(color_selection_canvas, evt);
	let x = mousepos.x;
	let y = Math.round(mousepos.y);      
    if(x > 20 && x < 530 && y > 150 && y < 225){
        let starting_R = 3 * (y - 150);
        let starting_G = 3 * (y - 150);
        let starting_B = 3 * (y - 150); 	
	    let man1 = (255 - starting_G) / 85;
        if(x >= 20 && x <= 105){
          	R = 255;
          	G = starting_G + Math.round(x * man1);
          	B = starting_B;	
        } else if(x >= 106 && x <= 190){
          	R = 255 - Math.round((x - 106) * man1);
          	G = 255;
          	B = starting_B;	
        } else if(x >= 191 && x <= 275){
          	R = starting_R;
          	G = 255;	
          	B = starting_B + Math.round((x - 191) * man1)
        } else if(x >= 276 && x <= 360){
          	R = starting_R;
          	G = 255 - Math.round((x - 276) * man1)
          	B = 255;	
        } else if(x >= 361 && x <= 445){
          	R = starting_R + Math.round((x - 361) * man1);
          	G = starting_G;
          	B = 255;	
        } else if (x >= 446 && x <= 530){
          	R = 255;
          	G = starting_G;
          	B = 255 - Math.round((x - 446) * man1);	
        }
        color_selection_ctx.fillStyle = 'rgb(' + R + ', ' + G + ', ' + B + ')';
        color_selection_ctx.fillRect(20, 30, 90, 90);
        r_span.innerHTML = "Current RGB Value: " + R;
        g_span.innerHTML = G;
        b_span.innerHTML = B;  	
    }
}

function drawHSV(local_R, local_G, local_B){

    //This function draws the HSV bar to control the "lightness"
    //of a base color. It accepts 3 arguments: an R, G and a B value, which
    //make up the RGB code for the base color.

	let x = 260;
	let y = 65;
    let R_width = 255 / local_R;
    let G_width = 255 / local_G;
    let B_width = 255 / local_B;
    let R_width_count = 0;
    let G_width_count = 0;
    let B_width_count = 0;
    color_selection_ctx.beginPath();
    for(let i = 0; i < 255; i++){
        if(i > R_width * R_width_count){
      	    local_R--;
      	    R_width_count++;
        }
        if(i > G_width * G_width_count){
      	    local_G--;
      	    G_width_count++;
        }
        if(i > B_width * B_width_count){
      	    local_B--;
      	    B_width_count++;
        }
        color_selection_ctx.fillStyle = 'rgb(' + local_R + ', ' + local_G + ', ' + local_B + ')';
        color_selection_ctx.fillRect(x, y, 1, 10);
        x++;
    }      
}

function getMaxRGBVals(r, g, b){

    //This function is called when the user inputs an RGB code into the text fields.
    //Since the color might not be one on the color palette (rather, it is formed by taking a 
    //base color from the color palette and darkening it with the HSV bar) this function calculates
    //the "max color" (i.e. the color gotten from sliding the HSV bar to its max setting) for use
    //in drawing the anchor for the input color on the color palette.

    if(r == 255 || g == 255 || b == 255){
    	//If one of the RGB values is already 255, no need to calculate further...
    	return {
    		R: r,
    		G: g,
    		B: b,
    		position: 0
    	}
    }
	let x = 260;
	let y = 85;
	let position = 0;
	let max_r = 255;
	let max_g = 255;
	let max_b = 255;
	if(r >= g && r >= b){
        position = 255 - r; //position out of 255
        let g_width = r / g; //we know we have "position" more ticks to go until (0, 0, 0) and we need to traverse
        //"g_width" number of values in that span to reach (0, 0, 0)
        let b_width = r / b
        max_r = 255;
        max_g = g + Math.round((255 - r) / g_width);
        max_b = b + Math.round((255 - r) / b_width);
        //alert("The max RGB values are (" + max_r + ", " + max_g + ", " + max_b + ")");
	} else if (g >= r && g >= b){
        position = 255 - g;
        let r_width = g / r;
        let b_width = g / b;
        max_g = 255;
        max_r = r + Math.round((255 - g) / r_width);
        max_b = b + Math.round((255 - g) / b_width);
        //alert("The max RGB values are (" + max_r + ", " + max_g + ", " + max_b + ")");
	} else if (b >= r && b >= g){
        //position = b;
        position = 255 - b;
        //let r_width = position / r;
        //let g_width = position / g;
        let r_width = b / r;
        let g_width = b / g;
        max_b = 255;
        //max_r = r + Math.round((255 - position) / r_width);
        //max_g = g + Math.round((255 - position) / g_width);
        max_r = r + Math.round((255 - b) / r_width);
        max_g = g + Math.round((255 - b) / g_width);
        //alert("The max RGB values are (" + max_r + ", " + max_g + ", " + max_b + ")!!!");
	}
	return {
		R: max_r,
		G: max_g,
		B: max_b,
		position: position
	}
}

function drawHSVIndicator(conv_val){

    //This function is called when the HSV slider is interacted with.
    //It erases and then draws a small triangle under the HSV bar to show
    //the current HSV setting.

	//color_selection_ctx.fillRect(140, 30, 90, 90);
	color_selection_ctx.clearRect(257, 76, 260, 5);
	let hsv_indicator_x = 260 + conv_val - 3;
	color_selection_ctx.drawImage(hsv_indicator_img, hsv_indicator_x, 76);
}


function selectHSV(value){
  
    //This function is called when the HSV slider is interacted with. It decreases the RGB
    //values of the "base color" (used to generate the HSV bar) by a set amount and calls 
    //drawHSVIndicator() (the above function).

	if(saved_R != 0 && saved_G != 0 && saved_B != 0){
	    let conv_val = value / 2;
	    let R_width = 255 / saved_R;
	    let G_width = 255 / saved_G;
	    let B_width = 255 / saved_B;
	    let r = saved_R - Math.round(conv_val / R_width);
	    let g = saved_G - Math.round(conv_val / G_width);
	    let b = saved_B - Math.round(conv_val / B_width);
	    r_selected_span.innerHTML = r;
	    g_selected_span.innerHTML = g;
	    b_selected_span.innerHTML = b;
	    color_selection_ctx.fillStyle = 'rgb(' + r + ', ' + g + ', ' + b + ')';
	    color_selection_ctx.fillRect(140, 30, 90, 90);
	    drawHSVIndicator(conv_val)
	}
}

function resetPalette(){
	//This function redraws the palette to erase the anchor icon.
	color_selection_ctx.clearRect(20, 530, 150, 225);
	color_selection_ctx.beginPath();
	drawColorMap();
}

function drawAnchor(x, y){

    //This function accepts an x and y value representing a location that the user clicked.
    //It updates the spans showing the RGB values of the currently selected color as well as the
    //square showing the currently selected color. In other words, this function "selects" a clicked-on
    //color.

    if(x > 20 && x < 530 && y > 150 && y < 225){
	    x_coord = 0;
	    y_coord = 150;
	    resetPalette();
	    color_selection_ctx.drawImage(color_handle_img, x - 7, y - 7);
	    saved_R = R;
	    saved_G = G;
	    saved_B = B;
	    color_selection_ctx.fillStyle = 'rgb(' + saved_R + ', ' + saved_G + ', ' + saved_B + ')';
	    console.log("Drawing a color with R = " + saved_R + " G = " + saved_G + " B = " + saved_B);
	    r_selected_span.innerHTML = "Selected RGB Value: " + saved_R;
	    g_selected_span.innerHTML = saved_G;
	    b_selected_span.innerHTML = saved_B;
	    color_selection_ctx.fillRect(140, 30, 90, 90);
	    drawHSV(saved_R, saved_G, saved_B);
	}
}

function drawAnchorByClick(evt){

    //This function servces as a callback when the user clicks on the canvas.
    //It calls the drawAnchor() function to draw the anchor on the color palette.

	let mousepos = getMousePos(color_selection_canvas, evt);
	let x = mousepos.x;
	let y = mousepos.y;
    drawAnchor(x, y);
}


function placeAnchor(r, g, b){

	//function to handle user input from entering in RGB codes into the text fields. Places an anchor
	//based on RGB values.

	if(r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255){
        alert("Please make sure all inputs are between 0 and 255.")
    } else {
        color_selection_ctx.fillStyle = 'rgb(' + r + ', ' + g + ', ' + b + ')';
        color_selection_ctx.fillRect(20, 30, 90, 90);
        color_selection_ctx.fillRect(140, 30, 90, 90);
        max_rgb = getMaxRGBVals(r, g, b);
        saved_R = max_rgb.R;
        saved_G = max_rgb.G;
        saved_B = max_rgb.B;
        console.log("Max R: " + saved_R + " Max G: " + saved_G + " Max B: " + saved_B);
        drawHSV(max_rgb.R, max_rgb.G, max_rgb.B);
        console.log("HSV position: " + max_rgb.position);
        drawHSVIndicator(max_rgb.position);
        let hsv_slider = document.getElementById("horiz_slider");
        hsv_slider.value = max_rgb.position * 2;
        let coords = getCoordsFromRgb(max_rgb.R, max_rgb.G, max_rgb.B);
        console.log("X: " + coords.X + " Y: " + coords.Y);
        //color_selection_ctx.drawImage(color_handle_img, x - 7, y - 7);
        //resetPalette();
        color_selection_ctx.drawImage(color_handle_img, coords.X - 7, coords.Y - 7);
    }
}

/*
function getRGBFromCurrentColor(){

    //This function is called when the user chooses to modify a preexisting
    //color by clicking the "modify" button.

    let undo_button = document.getElementById("undo-button");
    let modify_button = document.getElementById("modify-button");
    let add_button = document.getElementById("save-button");
    if(undo_button.style.display == "none"){
        undo_button.style.display = "inline";
    }

    if(modify_button.style.display == "none"){
    	modify_button.style.display = "inline";
    }

    if(add_button.style.display == "inline"){
    	add_button.style.display = "none";
    }

	let current_rgb = colors[currentColor].split(", ");
	let r = parseInt(current_rgb[0]);
	let g = parseInt(current_rgb[1]);
	let b = parseInt(current_rgb[2]);
	let name_text_field = document.getElementById('biome_name');
	console.log("R: " + r + " G: " + g + " B: " + b);
	r_span.innerHTML = "Current RGB Value: " + r;
	g_span.innerHTML = g;
	b_span.innerHTML = b;
	r_selected_span.innerHTML = r;
	g_selected_span.innerHTML = g;
	b_selected_span.innerHTML = b;
	name_text_field.value = color_names[currentColor];
	resetPalette();
	placeAnchor(r, g, b);
}
*/

function drawAnchorByTextField(){
    let r_textfield = document.getElementById("r_input");
    let g_textfield = document.getElementById("g_input");
    let b_textfield = document.getElementById("b_input");
    try{
        let r = parseInt(r_textfield.value);
        let g = parseInt(g_textfield.value);
        let b = parseInt(b_textfield.value);
        placeAnchor(r, g, b);
        //alert("r: " + r + " g: " + g + " b: " + b);
    } catch{
        alert("One of your inputs is not an integer. Please try again.")
    }

}


color_selection_canvas.addEventListener("mousemove", rgb_code_determiner, false);
color_selection_canvas.addEventListener("click", drawAnchorByClick, false);