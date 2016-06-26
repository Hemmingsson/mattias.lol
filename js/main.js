jQuery(document).ready(function($) {
	setInterval(function(){ 
		color_change() 
	}, 2000);
});



function color_change() {
	dark = randomColor({luminosity: 'dark'});
	$("body").css({"border-color": dark});
	$("body").css({"color": dark});
}