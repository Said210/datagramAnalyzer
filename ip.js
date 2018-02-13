var IP = {
	ICMP: function(d, ip_size){
		/* Seguro esto se puede hacer bien y bonito pero por cuestiones de tiempo ¯\_(ツ)_/¯ :(*/
		var icmp = {}
		var ICMP_start = ip_size + 14;
		switch(d[ICMP_start]){
			case 0: icmp.type = "Echo / Reply"; break;
			case 3: {
					icmp.type = "Destination Unreachable";
					switch(d[ICMP_start+1]){
						case 0: icmp.code = "Codigo: Not Unreachable"; break;
						case 1: icmp.code = "Codigo: Host Unreachable"; break;
						case 2: icmp.code = "Codigo: Protocol Unreachable"; break;
						case 3: icmp.code = "Codigo: Port Unreachable"; break;
						case 4: icmp.code = "Codigo: Fragmentation Needed & DF Set"; break;
						case 5: icmp.code = "Codigo: Source Route Failed"; break;
						case 6: icmp.code = "Codigo: Destination Network Unknown"; break;
						case 7: icmp.code = "Codigo: Destination Host Unknown"; break;
						case 8: icmp.code = "Codigo: Source Host Isolated"; break;
						case 9: icmp.code = "Codigo: Network Administratively Prohibited"; break;
						case 10: icmp.code = "Codigo: Host Administratively Prohibited"; break;
						case 11: icmp.code = "Codigo: Network Unreachable for TOS"; break;
						case 12: icmp.code = "Codigo: Host Unreachable for TOS"; break;
						case 13: icmp.code = "Codigo: Comunication Administratively Prohibited"; break;
					}
			}break;
			case 4: icmp.type = "Source Quench"; break;
			
			case 5: 
				icmp.type = "Redirect";
				switch(d[ICMP_start+1]){
					case 0: icmp.code = "Codigo: Redirect Datagram for the Network"; break;
					case 1: icmp.code = "Codigo: Redirect Datagram for the Host"; break;
					case 2: icmp.code = "Codigo: Redirect Datagram for the TOS & Network"; break;
					case 3: icmp.code = "Codigo: Redirect Datagram for the TOS & Host"; break;
				}
			break;

			case 8: icmp.type = "Echo"; break;
			case 9: icmp.type = "Router ADvertisement"; break;
			case 10: icmp.type = "Router Selection"; break;
			case 11: 
				icmp.type = "Time Exceeded";
				switch(d[ICMP_start+1]){
					case 0: icmp.code = "Codigo: Time to Live exceeded in Transit"; break;
					case 1: icmp.code = "Codigo: Fragment Reassembly Time Exceeded"; break;
				}
			break;
			
			case 12: 
					icmp.type = "Parameter Problem";
					switch(d[ICMP_start+1]){
						case 0: icmp.code = "Codigo: Pointer indicates the error"; break;
						case 1: icmp.code = "Codigo: Missing a Required Option"; break;
						case 2: icmp.code = "Codigo: Bad Length"; break;
					}
			break;
			case 13: icmp.type = "Timestamp"; break;
			case 14: icmp.type = "Timestamp Reply"; break;
			case 15: icmp.type = "Information Request"; break;
			case 16: icmp.type = "Information Reply"; break;
			case 17: icmp.type = "Address Mask Request"; break;
			case 18: icmp.type = "Address Mask Reply"; break;
			case 30: icmp.type = "Traceroute"; break;
		}
		return icmp;
	},
	UDP: function(d, ip_size){

		var udp = {};
		var UDP_start = ip_size + 14;
		var ports = {7: "Echo", 19: "Charger", 37: "Time", 53: "Domain", 67: "Bootps(DHCP)", 68: "Bootpc(DHCP)", 69: "TFTP", 137: "NetBios-NS", 138: "NetBios-DOM", 161: "SNMP", 162: "SNMP-TRAP", 500: "ISAKMP", 514: "SYSLOG", 520: "RIP", 33434: "Traceroute"};
		
		udp.source_port = ports[((d[UDP_start]<<8)+d[UDP_start+1])];
		if(udp.source_port == undefined) { udp.source_port = (d[UDP_start]<<8)+d[UDP_start+1]; }

		udp.destination_port = ports[((d[UDP_start]<<8)+d[UDP_start+1])];
		if(udp.destination_port == undefined) { udp.destination_port = (d[UDP_start+2]<<8)+d[UDP_start+3]; }

		return udp;
	},
	TCP: function(d, ip_size){
		var tcp = {flags: []}
		var TCP_start = ip_size + 14;
		tcp.source_port = (d[TCP_start]<<8) + d[TCP_start+1];
		tcp.destination_port = (d[TCP_start+2]<<8) + d[TCP_start+3];

		tcp.offset = ((d[TCP_start+12])>>4)*4;
		var flags = c.dec2bin(d[TCP_start+13]);

		if(flags[0]==1)	tcp.flags.push("Urgent");
		if(flags[1]==1)	tcp.flags.push("Acknowledge");
		if(flags[2]==1)	tcp.flags.push("Push");
		if(flags[3]==1)	tcp.flags.push("Reset");
		if(flags[4]==1)	tcp.flags.push("Synchronize");
		if(flags[5]==1)	tcp.flags.push("Finish");
		
		tcp.sequence_number = (d[TCP_start+4]<<24) + (d[TCP_start+5]<<16) + (d[TCP_start+6]<<8) + d[TCP_start+7];
		tcp.acknowledgment_number = (d[TCP_start+8]<<24) + (d[TCP_start+9]<<16) + (d[TCP_start+10]<<8) + d[TCP_start+11];
		if(tcp.acknowledgment_number == 0){
			tcp.sequence_number += " (0 Relative sequence number)";
		}
		

		tcp.checksum = c.dec2hex( (d[TCP_start+16]<<8) + d[TCP_start+17]);

		return tcp;
	},
	IGMP: function(d, ip_size){ /*TODO*/ }
}
