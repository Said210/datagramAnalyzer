analizer.LLC = function(d, size){
	var llc = {};

	var b = (d[15]&1);
	var m = ((d[16]>>2)&3)|((d[16]>>5)<<2);
	var e = 1; // EXTENDED?
	var com = ["ui","sim","-","sarm","up","-","-","sabm","disc","-","-","sarme","-","-","-","sabme","snrm","-","-","rset","-","-","-","xid","-","-","-","snrme","-","-","-","-"];
	var res = ["ui","rim","-","dm","-" ,"-","-","-","rd","-","-","-","ua","-", "-","-","-","frmr","-","-","-","-","-","xid","-","-","-","-","-","-","-","-" ];
	var ss = ["RR","RNR","REJ","SREJ"];

	llc.sap0 = (d[15]);
	llc.lsb = b;

	if((d[16]>>4)&1){
		if(b){
			e = 0;
		}else{
			if((m==11)||(m==15)||(m==27)){
				e = 1;
			}else{
				e = 0;
			}
		}
	}

	switch(d[16]&3){
	case 0:{
		llc.type = "Trama de informacion";
		if(e == 0){
			llc.pf = ((d[16]>>3)&1); 	// Valor de P/F
			llc.ns = (d[16]>>1)&7;		// N(s)
			llc.nr = (d[16]>>5)&7;		// N(r)
		}else{
			llc.pf = ((d[17])&1);	// Valor de P/F
			llc.ns = d[16]>>1;		// N(s)
			llc.nr = d[17]>>1;		// N(r)
		}
	}break;
	
	case 1:{
		llc.type = "Trama de supervision";
		if(e == 0){
			llc.pf = ((d[16]>>4)&1);
			llc.SS = ss[(d[16]>>2)&3];	// Busca el valor de SS en la lista 
			llc.nr = (d[16]>>5)&7;
		}else{
			llc.pf = ((d[17])&1);
			llc.ss = ss[(d[16]>>2)&3];
			llc.nr = d[17]>>1;
		}
	}break;
	
	case 2:{
		llc.type = "Trama de informacion";
		if(e == 0){
			llc.pf = ((d[16]>>3)&1); 	// Valor de P/F
			llc.ns = (d[16]>>1)&7;		// N(s)
			llc.nr = (d[16]>>5)&7;		// N(r)
		}else{
			llc.pf = ((d[17])&1);	// Valor de P/F
			llc.ns = d[16]>>1;		// N(s)
			llc.nr = d[17]>>1;		// N(r)
		}
	}break;
	
	case 3:{
			llc.type = ("Trama no numerada");
			llc.pf = ((d[16]>>4)&1);
			m = ((d[16]>>2)&3)|((d[16]>>5)<<2);
			if(llc.pf == b)
				llc.command = res[m];
			else
				llc.response = com[m];

		}break;
	}
	return llc;
}
