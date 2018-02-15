var utilities = {
	/*	
		formater (datagrama:array, from:int, to:int, glue:string)
		regresa un string con un formato mas agradable a las personas
	*/
	formater: function(d, from, to, glue, hex){
		var formated = "";
		var hex = (hex != undefined && hex) ? "0x" : "";
		for (var i = from; i < to; i++) {
			formated += hex + this.complete(c.dec2hex(d[i]),2);
			if(i != to-1) formated += glue;
		};
		return formated;
	},
	/*
	*	cat (datagram:array, from:int, to:int, glue:string)
	*	concatena valores decimales con algun "pegamento"
	*/
	cat: function(d, from, to, glue){
		var formated = "";
		for (var i = from; i < to; i++) {
			formated += d[i];
			if(i != to-1) formated += glue;
		};
		return formated;

	},
	/*
	*	complete (bits:string, n:int, padding:bool)
	*	donde n es el numero de bits a rellenar
	*	y padding indica si se agregaran como corrimiento o padding (padding por default)
	*	completa un octeto de bits
	*/
	complete: function(b, n, padding){
		var n = (n != undefined) ? n : 8;
		var padding = (padding != undefined) ? padding : true;
		var bits = "";
		if(!padding) {bits += b;}
		for(var i = 0;i < n - b.length; i++ ){bits += "0";}
		if(padding) {bits += b;}
		return bits;
	}
}
