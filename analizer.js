/*
* d es por datagrama
*/
var analizer = {
	ToT: function(d){
		//Pues si hay bitwise operators <3
		var ToT = (d[12]<<8) + d[13];
		return ToT;
	},
	analize: function(d){
		var ether = this.ethernet(d);
		// console.table(ether); // For DEBBUGING ¯\_(ツ)_/¯
		var tot = ether.tot;
		var response = {ethernet: ether, type: ""};
		response.datagram = d;

		if(tot < 1500){
			response.type = "LLC";
			response.data = this.LLC(d,tot);
		}else if(tot == 2048){
			response.type = "IP";
			response.data = this.IP(d);
		}else if(tot == 2054){
			response.type = "ARP";
			response.data = this.ARP(d);
		}
		return new trame(response);
	},
	ethernet: function(d){
		var header = {md: "", mo: "", tot: ""};

		header.md = utilities.formater(d,0,6,":");
		header.mo = utilities.formater(d,6,12,":");
		
		header.tot = this.ToT(d);
		return header;
	},

	IP: function(d){
		var ip = {};
		ip.ip_size = (d[14]&15)*4;
		var size = ip.ip_size;
		ip.protocol = d[23];
		var flag = ((d[20]>>5)&7);
		ip.offset = c.bin2dec( 							// Convierte de binario a decimal
						utilities.complete( 			// Completa una cadena binaria (pt. 1)
							c.dec2bin(					// Convierte de decimal a binario
								((d[20]&31)<<8)+d[21])	// Toma los bits del offset y quita la parte de la bandera, lo corre 8 bits y concatena el resto del offset
							,16, false)  				//(pt. 2) De 16 bits corriendo a la izquierda (<<)
						);
		switch(flag){
			case 0: ip.flag = "divisible, sin fragmentos"; break;
			case 1: ip.flag = "divisible, con mas fragmentos"; break;
			case 2: ip.flag = "no divisible, sin fragmentos"; break;
			case 3: ip.flag = "no divisible, con mas fragmentos"; break;
		}
		switch(ip.protocol){
			case 1:
				ip.protocol = [ip.protocol, "ICMP"];
				ip.ICMP = IP.ICMP(d, size);
			break;
			case 2:
				ip.protocol = [ip.protocol, "IGMP"];
				/* TODO IGMP */
			break;
			case 6:
				ip.protocol = [ip.protocol, "TCP"];
				ip.TCP = IP.TCP(d, size);
			break;
			case 17:
				ip.protocol = [ip.protocol, "UDP"];
				ip.UDP = IP.UDP(d, size);
			break;
		}
		ip.checksum = c.dec2hex((d[24]<<8)+(d[25]));
		ip.source = utilities.cat(d, 26, 30, ".");
		ip.dest = utilities.cat(d, 30, 34, ".");
		if(size > 20){
			ip.options = d.slice(34, 34 + (size-20)).map(function(a){return c.dec2hex(a)});
		}
		
		return ip;
	},


	ARP: function(d){
		var arp = {};
		arp.HT = ((d[14]<<8)+d[15]); // Hardware addr Type
		arp.PT = ((d[16]<<8)+d[17]); // Protocol Address Type

		if(arp.HT&1)
              arp.HT = [arp.HT, "Ethernet"];
        else if(arp.HT&2)
              arp.HT = [arp.HT, "IEEE 802 LAN"];
        else if(arp.HT&4)
              arp.HT = [arp.HT, "Token Ring"];
        else if(arp.HT&15)
              arp.HT = [arp.HT, "Frame Relay"];
        else if(arp.HT&16)
              arp.HT = [arp.HT, "ATM"];
        
        arp.hwLn = d[18]; // Hardware length
        arp.pLn = d[19]; // Protocol length
        arp.op = ((d[20]<<8)+d[21]); // Operation

    	if (arp.op==1)
    		arp.op = [arp.op, "Request"];
    	else if (arp.op==2)
    		arp.op = [arp.op, "Reply"];
        else if (arp.op==3 || arp.op==8)
    		arp.op = [arp.op, "Inv Request"];
    	else if (arp.op==4 || arp.op==9)
    		arp.op = [arp.op, "Inv Reply"];

    	arp.mo = utilities.formater(d, 22, 28, ":");
    	arp.ipo = utilities.cat(d, 28, 32, ".");

    	arp.md = utilities.formater(d, 32, 38, ":");
    	arp.ipd = utilities.cat(d, 38, 41, ".");

    	return arp;
	}
}

function decode_input(){
	var input = $("#input").val();
	input = input.replace(/\{/g,"[");
	input = input.replace(/\}/g,"]");
	app.datagrams = eval(input).map(function(d){
					return analizer.analize(d);
				});
	move_scroll();
}

function trame(packet){
	this.packet = packet;
	this.type = packet.type;
	this.datagram = packet.datagram;
	this.data = packet.data;
	this.ethernet = packet.ethernet;


	this.render_datagram = function(){
		return utilities.formater(this.datagram, 0, this.datagram.length, ", ", true);
	};

	this.render_data = function(){
		d = this.data;
		var da = "";
		if(d != undefined && d != null){
			Object.keys(d).map(function(key, index) {
				if(typeof(d[key]) == "object"){ // Is array or JSON
					if(d[key][0] != undefined){
						da += key + ": " + d[key][1] + " (" + d[key][0] + ")";
					}else{
						da += key + ": " + Object.keys(d[key]).map(function(d_key, d_index) {
							return " | "+d_key + ": " + d[key][d_key]+" ";
						});
					}
				}else{
					da += key + ": " + d[key];
				}
				da += "<br>";
			});
		}else{
			da = "No hay información disponible";
		}
		return da;
	}
}

