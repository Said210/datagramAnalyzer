var scroll = false;
var current_card = 0;

const c = {
  bin2dec : s => parseInt(s, 2).toString(10),
  bin2hex : s => parseInt(s, 2).toString(16),
  dec2bin : s => parseInt(s, 10).toString(2),
  dec2hex : s => parseInt(s, 10).toString(16),
  hex2bin : s => parseInt(s, 16).toString(2),
  hex2dec : s => parseInt(s, 16).toString(10)
};

function move_scroll(){
	$("#scroll").toggleClass("active-scroll");
	scroll = !scroll;
	if(!scroll){
		$("#micon").attr("src","scroll.png");
	}else{
		$("#micon").attr("src","min-scroll.png");
	}
}

$("#scroll-icon").on("click", function(){
	move_scroll();
});

Vue.component('ethernet-header', {
  props: ['header', 'classes'],
  template: '<div>'+
  				'<div class="title">Ethernet</div>'+
  				'<div>Md: {{ header.md }}</div>'+
  				'<div>Mo: {{ header.mo }}</div>'+
  				'<div>0x{{ header.tot }}</div>'+
  			'</div> <br>'
});

var app = new Vue({
	el: "#cards",
	data: {
		datagrams: dat.map(function(d){
			return analizer.analize(d);
		})
	},
	updated: function(){
		console.log("UPDATED");
	}
});

$(document).ready(function(){
	$("#c-"+current_card).addClass("current_card");
	$("#c-"+(current_card+1)).addClass("next_card");
	$("#input").attr("placeholder", "Tus tramas aquí: i.e {{0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x00, 0x23, 0x8b, 0x46, 0xe9, 0xad, 0x08, 0x06, 0x00, 0x04, 0x08, 0x00, 0x06, 0x04, 0x00, 0x01, 0x00, 0x23, 0x8b, 0x46, 0xe9, 0xad, 0x94, 0xcc, 0x39, 0xcb, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x94, 0xcc, 0x39, 0xfe }}");
	set_listeners();
});

function next_card(){
	if(current_card + 1 < app.datagrams.length){ // Forward
		$(".card").removeClass("next_card").removeClass("prev_card");
		$("#c-"+current_card).removeClass("current_card").addClass("prev_card");
		$("#c-"+(current_card+1)).addClass("current_card").removeClass("next_card");
		$("#c-"+(current_card+2)).addClass("next_card");
		current_card += 1;
		set_listeners();
	}
}
function prev_card(){
	if(current_card - 1 > 0){ // Backward
		$(".card").removeClass("next_card").removeClass("prev_card");
		$("#c-"+current_card).removeClass("current_card").addClass("next_card");
		$("#c-"+(current_card-1)).addClass("current_card").removeClass("prev_card");
		$("#c-"+(current_card-2)).addClass("prev_card");
		current_card -= 1;
		set_listeners();
	}else if(current_card - 1 == 0){ // Backward
		$(".card").removeClass("next_card").removeClass("prev_card");
		$("#c-"+current_card).removeClass("current_card").addClass("next_card");
		$("#c-"+(current_card-1)).addClass("current_card").removeClass("prev_card");
		current_card -= 1;
		set_listeners();
	}
}

function set_listeners(){
	$(".card").attr("onclick","");
	$($(".prev_card")[0]).attr("onclick", "prev_card()");
	$($(".next_card")[0]).attr("onclick", "next_card()");		
}

function toggle_card(id){
	$("#c-"+id).toggleClass("flipped-card");
}