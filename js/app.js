     
//------------------------------------//  
//---- FUNCTIONS REDRAW Main Pull-----//
//----- ------------------------------//

//Pull	 
reDrawPull = function(){
	s = document.getElementById("sizePullText");
	s.innerHTML = "Диаметр бассейна: " +  sizeD + " м";
	 
	if (pull){
		scene.remove(pull);
	}	
	if (floor){
		scene.remove(floor);
	}
	if (water){
		scene.remove(water);
	}		
		
	geometry = new THREE.CylinderGeometry( sizeD+5, sizeD+5, 0.2, sizeD/5 );
	water = new THREE.Mesh( geometry, materialWaterPull );
	water.position.z = 0;
	water.position.y = -8;
	water.position.x = positionPullX;	
	water.rotation.x = 3.14;			
	scene.add( water );		
		
	points = [];
	for ( var i = 0; i < 10; i ++ ) {
		points.push( new THREE.Vector2( sizeD + i, -Math.sin(i*0.5)*4.2) );
	}
	geometry = new THREE.LatheGeometry( points, sizeD+2);
	
	pullMaterial.map.repeat.set(sizeD,1); 		
	pullMaterial.bumpMap.repeat.set(sizeD, 1);    
	pull = new THREE.Mesh(geometry, pullMaterial);
	pull.position.z = 0;
	pull.position.y = -9.5;
	pull.position.x = positionPullX;	
	pull.rotation.x = 3.14;	
	scene.add(pull);

	points = [];
	for ( var i = 0; i < 10; i ++ ) {
		points.push( new THREE.Vector2( sizeD + 3 + i*50 , -3.6 ) );
	}
		
	geometry = new THREE.LatheGeometry( points, 40 );		
	floor = new THREE.Mesh(geometry, floorMaterial);
	floor.position.z = 0;
	floor.position.y = -10;
	floor.position.x = positionPullX;	
	floor.rotation.x = 3.14;	
	scene.add(floor);		
}
	 
//------------------------------------------//	
//------------Constructor Center Jet -------//
//------------------------------------------//	
	
function ConstructorGroup(){
	
	var d = 2.8;
	this.startPX = 0;
	this.startPZ = 0; 
	if(arrGroups.length > 0){ 
		this.startPX = Math.sin((groupID+1 - 1.57)/8 * Math.PI * 2 )*20 * d;
		this.startPZ = Math.cos((groupID+1 - 1.57)/8 * Math.PI * 2 )*20 * d; 			   
	}
			
	this.height = 35;
	this.diam = 0.7;
		
	this.arrRounds = [];  
		
	cubeGeometry = new THREE.BoxGeometry(0.005, 0.005, 0.005);
	this.dummy = new THREE.Mesh(cubeGeometry, basicMaterial);				
	this.dummy.position.set( positionPullX+this.startPX, 3, this.startPZ );		  
	scene.add(this.dummy); 
        	 				
	groupID ++;	
			
	this.removeGeom = function(){
		for (rmd = 0; rmd< this.arrRounds.length; rmd ++){
			this.arrRounds[rmd].removeRoundGeom();
			md = this.arrRounds[rmd];
			this.arrRounds.splice(0,1);
			md = null;
			rmd--;
		}	   
		this.dummy.remove(this.jetCenter);
		scene.remove(this.dummy);
	}	

	this.reDraw = function(){
		if (this.jetCenter){
			this.dummy.remove(this.jetCenter);	
			this.jetCenter = null;			
		}	  
		if (!this.jetCenter){
			geometry = new THREE.CylinderGeometry( this.diam, this.diam, this.height, 10 );
			this.jetCenter = new THREE.Mesh( geometry, materialWaterJets );			  
			this.jetCenter.position.z = 0;
			this.jetCenter.position.y = this.height/2-11;
			this.jetCenter.position.x = 0;				
			this.dummy.add( this.jetCenter );		  	  
		}		  
	}

	this.addRoundJets = function(){
		m = new RoundJetConstructor( this.dummy.position.x, this.dummy.position.z );
		m.reDraw();
		this.arrRounds.push(m);
	}  
	   
	this.removeRoundsAll = function(){
		for ( var ii = 0; ii < this.arrRounds.length; ii ++){
			md = this.arrRounds[ii];
			this.arrRounds[ii].removeRoundGeom();
			this.arrRounds.splice(ii, 1);
			md = null;
			ii--;
		}			  
	}
	   
	this.removeOneRound = function(num){
		md = this.arrRounds[currentRoundJet];
		this.arrRounds[currentRoundJet].removeRoundGeom();
		this.arrRounds.splice(currentRoundJet, 1);		  
		md = null;		  
	}	
	   
	this.moveGroupG = function(pX, pZ ){
		this.dummy.position.set(this.dummy.position.x + pX, 3, this.dummy.position.z + pZ);
	}	

	this.cloneGroup = function(prototipe){
		this.prototipe = prototipe;
		this.jetCenter = arrGroups[this.prototipe].jetCenter.clone();
		this.dummy.add(this.jetCenter);
					
		for ( var aa=0; aa < arrGroups[this.prototipe].arrRounds.length; aa ++ ){
			cl = new RoundJetConstructor( this.dummy.position.x, this.dummy.position.z );
			cl.reDraw();
			this.arrRounds.push(cl);			   
			for ( var clj = 0; clj < this.arrRounds[aa].arrJets.length; clj++){		   
				this.arrRounds[aa].dummy.remove(this.arrRounds[aa].arrJets[clj]);
				this.arrRounds[aa].arrJets.splice(0,1);				  
				clj --;				  	  
			}
			for (clj = 0; clj < arrGroups[this.prototipe].arrRounds[aa].arrJets.length; clj ++ ){  
				j = arrGroups[this.prototipe].arrRounds[aa].arrJets[clj].clone();
				this.arrRounds[aa].dummy.add( j );
		  
				this.arrRounds[aa].arrJets.push( j ); 						  
			}  		   
		}	   
	} 	   
	   
}	 	 
	 
//------------------------------------------//	
//------ Constructor Rounds Jet--------------//
//------------------------------------------//	 

function RoundJetConstructor(pX, pZ){
	 
	jetRoundRadius = 5 + arrGroups[currentFontanGroup].arrRounds.length*10 ;
	if (arrGroups[currentFontanGroup].arrRounds.length != 0){
		jetRoundRadius2 = 7 + arrGroups[currentFontanGroup].arrRounds.length;
	}  
	jetRoundCount =  16 + arrGroups[currentFontanGroup].arrRounds.length*16 ;
	jetRoundHeight = 50 - arrGroups[currentFontanGroup].arrRounds.length*10; 
	
	this.height = jetRoundHeight;
	this.radius = jetRoundRadius;
	this.radius2 = jetRoundRadius2; 
	this.countJet = jetRoundCount;
			
	this.arrJets = [];
		
	this.dummy;
	this.pX = 0;
	this.pZ = 0;
		
	this.reDraw = function(){		   
		if ( this.dummy){
			for ( var a = 0; a< this.arrJets.length; a++ ){
				md = this.arrJets[a];
				this.arrJets.splice(0,1);
				this.dummy.remove(md);
				a--;
			}
			scene.remove(this.dummy);
			this.dummy = null;
		}		   
			   
		if (!this.dummy){ 		   
			cubeGeometry = new THREE.BoxGeometry(0.005, 0.005, 0.005);
			this.dummy = new THREE.Mesh(cubeGeometry, basicMaterial);			  
			this.dummy.position.set( this.pX, 0, this.pZ );	
			arrGroups[currentFontanGroup].dummy.add(this.dummy);			  	

			for ( var a=0; a < this.countJet; a++){
				if ( Math.abs(this.radius2) < 1 ){
					geometry1 = new THREE.CylinderGeometry( 0.3, 0.3, this.height/2, 10 );
					jetRoundG = new THREE.Mesh( geometry1, materialWaterJets );
					//jetRoundG.position.y = 0;				 
					jetRoundG.position.set( Math.sin(a / this.countJet * Math.PI * 2)*this.radius, this.height/2-this.height/4-11, Math.cos(a / this.countJet * Math.PI * 2)*this.radius);				 	
					this.arrJets.push(jetRoundG); 	 		  
					this.dummy.add( jetRoundG );
				}else{
					numPoints = 20;
					arrPoints = [] 
					for ( var  ix = 0; ix < 3; ix ++ ){	
						paramX = Math.sin(a/this.countJet * Math.PI * 2);
						paramZ = Math.cos(a/this.countJet * Math.PI * 2); 						  
						xP = paramX * this.radius + paramX * this.radius2 * ix;
						zP = paramZ * this.radius + paramZ * this.radius2 * ix;  						  
						point1 = new THREE.Vector3( xP  , (Math.sin(ix*1.57)*this.height)-11, zP ) ;               					  
						arrPoints.push(point1);   
					} 			
					curveQuad = new THREE.QuadraticBezierCurve3( arrPoints[0], arrPoints[1], arrPoints[2]);
					tube = new THREE.TubeGeometry( curveQuad, numPoints, 0.15, 10, false);
					mesh1 = new THREE.Mesh(tube,materialWaterJets );
					this.arrJets.push(mesh1); 	 					  
					this.dummy.add(mesh1);	               					  
				}	
			}
		}			  
	}

	this.removeRoundGeom = function(){
		obj = this.dummy;   
		if (obj){              	   			
			for ( var a1 = 0; a1< this.arrJets.length; a1++ ){
				md1 = this.arrJets[a1];
				this.arrJets.splice(0,1);
				this.dummy.remove(md1);
				a1--;
			}	
		}
		scene.remove(obj);			 
	}
}
	 	   
// ------------------------//
// ----- UI--------------- //
// ------------------------//

//space key
function keyPressed(e){
	keyCode = e.which;
	if (keyCode == 32){
		if (personControl == true){
			personControl = false;
			m = document.getElementById("messageGame");
			m.style.marginLeft = windowW/2  + "px";
			 
			m = document.getElementById("panel");
			m.style.marginLeft = 15 + "px";
	
			m = document.getElementById("messageSpace");
			m.style.marginLeft = 5000 + "px";			   	   
		}
	}
} 
	 
document.onkeydown = keyPressed;
	 
//vars
var windowW=document.body.clientWidth-100; 
var windowH=screen.height - 400;
	 
m = document.getElementById("messageGame");
m.style.marginLeft = windowW/2  + "px";	 
m.style.marginTop = 100 + windowH/2  + "px";
		
m = document.getElementById("messageSpace");
m.style.marginLeft = 5000 + "px";	
	 
m = document.getElementById("panel");
m.style.marginLeft =15 + "px";	 
	 
//ui buttoms
var bottomPullMore = document.getElementById("pullMoreD");
var bottomPullMini = document.getElementById("pullMiniD");	
var bottomLookArownd = document.getElementById("lookAround");		
var bottomJetCenterAdd = document.getElementById("jetCenterAdd");	
var bottomJetRoundAdd = document.getElementById("jetRoundAdd");
	
bottomLookArownd.onclick = function() {   	
	personControl = true;	
	m = document.getElementById("messageGame");		
	m.style.marginLeft = 3000 +"px";
		
	m = document.getElementById("panel");
	m.style.marginLeft = 5000  + "px";	

	m = document.getElementById("messageSpace");
	m.style.marginLeft = windowW/2 - 150 + "px";		
}	
	 
//Pull
bottomPullMore.onclick = function() {		
	sizeD++;	
	reDrawPull();	
}	
	 
bottomPullMini.onclick = function() {   	
	sizeD--;
	reDrawPull();		
}

bottomJetCenterAdd.onclick = function(){
	if (arrGroups.length < 9 ){
		m = new ConstructorGroup();
		m.reDraw();
		arrGroups.push(m);	
	}  			
}
	
window.onclick = function() {  
	drawUI()		 
	addListenerButtons();		 	
}
	 
//---------------------------//
//---Listeners UI Buttoms ---//
//---------------------------// 
	 
function addListenerButtons(){
	//groups
	if (! bottomJetCenterRemove ){
		if  (arrGroups[currentFontanGroup]){		 
			var bottomJetCenterRemove = document.getElementById("jetCenterRemove");	
			bottomJetCenterRemove.onclick = function(){
				if  (arrGroups[currentFontanGroup]){ 			  
					arrGroups[currentFontanGroup].removeGeom();
					md = arrGroups[currentFontanGroup];
					arrGroups.splice(currentFontanGroup,1);
					md = null;
				}	 
			}				  
		} 
	}

	if (! buttonJetCenterClone ){
		if  (arrGroups[currentFontanGroup]){		 
			var buttonJetCenterClone = document.getElementById("jetCenterClone");	
			buttonJetCenterClone.onclick = function(){
				if  (arrGroups[currentFontanGroup]){ 			  
					if (arrGroups.length < 9 ){
						m = new ConstructorGroup();
						arrGroups.push(m);						
							
						var prototipeG = currentFontanGroup;
						currentFontanGroup ++;						
			            
						m.cloneGroup(prototipeG);
					}
				}	 
			}				  
		} 
	}
		
	if ( ! bottomJetCenterPlus){	
		if (arrGroups[currentFontanGroup]){  			
			var bottomJetCenterPlus = document.getElementById("jetCenteMore");         
			bottomJetCenterPlus.onclick = function(){
				if  (arrGroups[currentFontanGroup]){			  
					arrGroups[currentFontanGroup].height +=3;
					arrGroups[currentFontanGroup].reDraw();	
				}
			}				  
		}
	} 
 				
	if ( ! bottomJetCenterMinus){
		if (arrGroups[currentFontanGroup]){  		 
			var bottomJetCenterMinus = document.getElementById("jetCenterSmaller");		 
			bottomJetCenterMinus.onclick = function(){
				if  (arrGroups[currentFontanGroup]){			   
					arrGroups[currentFontanGroup].height -=3;
					arrGroups[currentFontanGroup].reDraw();
				}					 
			}
		}  
	} 	
		 
	if ( ! bottomJetCenterMoveXP){
		if (arrGroups[currentFontanGroup]){ 		 
			var bottomJetCenterMoveXP = document.getElementById("groupMoveXP");		 
			bottomJetCenterMoveXP.onclick = function(){
				if  (arrGroups[currentFontanGroup]){				  
					arrGroups[currentFontanGroup].moveGroupG( 10, 0 );
				}					
			}
		}  
	}

	if (!bottomJetCenterMoveXM){	
		if (arrGroups[currentFontanGroup]){ 		 
			var bottomJetCenterMoveXM = document.getElementById("groupMoveXM");		 
			bottomJetCenterMoveXM.onclick = function(){
				if  (arrGroups[currentFontanGroup]){				   
					arrGroups[currentFontanGroup].moveGroupG( -10, 0 );
				}					 
			}
		}  
	}
 
	if (! bottomJetCenterMoveZM){		
		if (arrGroups[currentFontanGroup]){ 		 
			var bottomJetCenterMoveZM = document.getElementById("groupMoveZM");		 
			bottomJetCenterMoveZM.onclick = function(){
				if  (arrGroups[currentFontanGroup]){				   
					arrGroups[currentFontanGroup].moveGroupG( 0, -10 );
				}					 
			}
		}  
	}

	if (! bottomJetCenterMoveZP){		
        if (arrGroups[currentFontanGroup]){			
			var bottomJetCenterMoveZP = document.getElementById("groupMoveZP");		 
			bottomJetCenterMoveZP.onclick = function(){
				if  (arrGroups[currentFontanGroup]){				   
					arrGroups[currentFontanGroup].moveGroupG( 0, 10 );
				}						
			}
		}		  
	}
			
	if (!bottomAddRounds){ 
		if (arrGroups[currentFontanGroup]){ 		 
			var bottomAddRounds = document.getElementById("addRounds");	
			if (bottomAddRounds){		 
				bottomAddRounds.onclick = function(){
					if  (arrGroups[currentFontanGroup]){					   
						arrGroups[currentFontanGroup].addRoundJets();
					}						 
				}
			}	
		}
	}

	if (! bottomRemoveRounds) {		
		if (arrGroups[currentFontanGroup]){ 		
			var bottomRemoveRounds = document.getElementById("removeRounds");	
			if (bottomRemoveRounds){		 
				bottomRemoveRounds.onclick = function(){
					if  (arrGroups[currentFontanGroup]){	
						arrGroups[currentFontanGroup].removeRoundsAll();
					}						 
				}
			}
		}   
	}   
		 
	// listener Rounds
	if ( ! buttonAddOneRound ){
		var buttonAddOneRound = document.getElementById("oneRoundAdd");
		if (buttonAddOneRound){
			buttonAddOneRound.onclick = function(){
				if (arrGroups[currentFontanGroup].arrRounds){
					if(arrGroups[currentFontanGroup].arrRounds.length < 4){ 
						arrGroups[currentFontanGroup].addRoundJets();
					}
				}					 
			}   
		}             
	}		 
		 
	if (! bottomJetRoundRemove){
		var bottomJetRoundRemove = document.getElementById("jetRoundRemove");	
		if (bottomJetRoundRemove){		  
			bottomJetRoundRemove.onclick = function(){
				if (arrGroups[currentFontanGroup].arrRounds[currentRoundJet]){				  
					arrGroups[currentFontanGroup].removeOneRound(currentRoundJet);			   
				} 
			} 
		}	   
	}	  
		 
	if ( !bottomJetRoundCountPlus )	{		 
		var bottomJetRoundCountPlus = document.getElementById("jetRoundCountPlus");         
		if (bottomJetRoundCountPlus){
			bottomJetRoundCountPlus.onclick = function(){	
				if (arrGroups[currentFontanGroup].arrRounds[currentRoundJet]){	 
					arrGroups[currentFontanGroup].arrRounds[currentRoundJet].countJet ++;
					arrGroups[currentFontanGroup].arrRounds[currentRoundJet].reDraw();	
				}  						 
			} 
		}
	}	
		 
	if (! bottomJetRoundCountMinus){
		var bottomJetRoundCountMinus = document.getElementById("jetRoundCountMinus");
		if (bottomJetRoundCountMinus){		 
			bottomJetRoundCountMinus.onclick = function(){
				if (arrGroups[currentFontanGroup].arrRounds[currentRoundJet]){			   
					arrGroups[currentFontanGroup].arrRounds[currentRoundJet].countJet --;
					arrGroups[currentFontanGroup].arrRounds[currentRoundJet].reDraw();
				}						 
			}
		}	
	}	

	if (! bottomJetRoundHeightMinus ) {
		var bottomJetRoundHeightMinus = document.getElementById("jetRoundHeightMinus");
		if (bottomJetRoundHeightMinus){		 
			bottomJetRoundHeightMinus.onclick = function(){
				if (arrGroups[currentFontanGroup].arrRounds[currentRoundJet]){			   
					arrGroups[currentFontanGroup].arrRounds[currentRoundJet].height --;
					arrGroups[currentFontanGroup].arrRounds[currentRoundJet].reDraw();
				}						
			}
		}   
	}
		 
	if (! bottomJetRoundHeightPlus){
		var bottomJetRoundHeightPlus = document.getElementById("jetRoundHeightPlus");
		if (bottomJetRoundHeightPlus){
			bottomJetRoundHeightPlus.onclick = function(){
				if (arrGroups[currentFontanGroup].arrRounds[currentRoundJet]){			   
					arrGroups[currentFontanGroup].arrRounds[currentRoundJet].height ++;
					arrGroups[currentFontanGroup].arrRounds[currentRoundJet].reDraw();
				}						
			}	
		}  
	}			 

	if (!bottomJetRoundRadiusMinus) {
		var bottomJetRoundRadiusMinus = document.getElementById("jetRoundRadiusMinus");
		if (bottomJetRoundRadiusMinus){ 		 
			bottomJetRoundRadiusMinus.onclick = function(){
				if (arrGroups[currentFontanGroup].arrRounds[currentRoundJet]){			  
					arrGroups[currentFontanGroup].arrRounds[currentRoundJet].radius --;
					arrGroups[currentFontanGroup].arrRounds[currentRoundJet].reDraw();
				}						
			}
		}  
	}
		 
	if (! bottomJetRoundRadiusPlus){
		var bottomJetRoundRadiusPlus = document.getElementById("jetRoundRadiusPlus");
		if (bottomJetRoundRadiusPlus){   		 
			bottomJetRoundRadiusPlus.onclick = function(){
				if (arrGroups[currentFontanGroup].arrRounds[currentRoundJet]){				
					arrGroups[currentFontanGroup].arrRounds[currentRoundJet].radius ++;
					arrGroups[currentFontanGroup].arrRounds[currentRoundJet].reDraw();
				}						
			}
		}	
	}
 
	if (!buttonJetRoundRadius2Plus){
		var buttonJetRoundRadius2Plus = document.getElementById("jetRoundRadius2Plus");
		if (buttonJetRoundRadius2Plus){
			buttonJetRoundRadius2Plus.onclick = function(){
				if (arrGroups[currentFontanGroup].arrRounds[currentRoundJet]){				
					arrGroups[currentFontanGroup].arrRounds[currentRoundJet].radius2 ++;
					arrGroups[currentFontanGroup].arrRounds[currentRoundJet].reDraw();
				}						
			}			
		}
	}
		 
	if (!buttonJetRoundRadius2Minus){
		var buttonJetRoundRadius2Minus= document.getElementById("jetRoundRadius2Minus");
		if (buttonJetRoundRadius2Minus){
			buttonJetRoundRadius2Minus.onclick = function(){
			if (arrGroups[currentFontanGroup].arrRounds[currentRoundJet]){				
					arrGroups[currentFontanGroup].arrRounds[currentRoundJet].radius2 --;
					arrGroups[currentFontanGroup].arrRounds[currentRoundJet].reDraw();
				}						
			}			
		}
	}		 
}	 
	 
// ------------------------------//	 
//----- Draw Interface ----------//
// ------------------------------//
	 
function drawUI(){
	           
	//panel Groups
	var d = document.getElementById("jetPlusMinus");		   
	if (!d){			
		h = document.createElement('div');
		h.id = "jetPlusMinus";
		h.innerHTML = ".....................................................<br/>"+
			"<div id = \"radioGroupPanel\">Выбрать группу</div>" +		
			".....................................................<br/>"+						  
			"<button id=\"jetCenterClone\" >Клонировать группу</button>&nbsp;&nbsp<button id=\"jetCenterRemove\" >Удалить группу</button>"+
			"<br/>.....................................................<br/>"+									  
			"<button id=\"jetCenteMore\" >Увеличить высоту</button>&nbsp;&nbsp;<button id=\"jetCenterSmaller\" >Уменьшить высоту</button><br/>"+ 
			"<button id=\"groupMoveXP\" >Отодвинуть дальше</button>&nbsp;&nbsp;<button id=\"groupMoveXM\" >Придвинуть ближе</button><br/>"+ 	
			"<button id=\"groupMoveZP\" >Пододвинуть правее</button>&nbsp;&nbsp;<button id=\"groupMoveZM\" >Отодвинуть левее</button><br/>"+
			".....................................................<br/>"+
			"<div id=\"addRemoveRounds\"></div>"; 

			m = document.getElementById("panelJetCenter"); 		
			m.appendChild(h);
		}

		d = document.getElementById("jetPlusMinus");
		if (d){
			if (arrGroups.length == 0){
				m = document.getElementById("panelJetCenter"); 
				h = document.getElementById("jetPlusMinus"); 
				m.removeChild(h); 					   
			}
		}	 
	 
		if (document.getElementsByName('radioGroupPanel')){			
			m = document.getElementById("radioGroupPanel"); 		
			radio = "";
			for (gc = 0; gc < arrGroups.length; gc ++){
				if (gc == currentFontanGroup){
					radio = radio +  "<input type=\"radio\" checked  name=\"radG\"/> ";
				}else{
					radio = radio +  "<input type=\"radio\"  name=\"radG\"/> ";				  
				}					  
			}	
			if (m){
				m.innerHTML = radio;
			}	 					  
			var radioGroups = document.getElementsByName('radG');
		}
				
		m = document.getElementById("radioGroupPanel"); 	
		var ff = document.getElementById("radioGroupPanel");
		if (ff){
			ff.onclick = function(){
				if (radioGroups){     
					for( var i2 = 0; i2 < radioGroups.length; i2++){
						if (radioGroups[i2].checked) {
							currentFontanGroup = i2;		   
						}
					}
				}
			}	
		}				 
		
		d = document.getElementById("addRemoveRounds");
		if (d){
			if (arrGroups[currentFontanGroup]){
				if (arrGroups[currentFontanGroup].arrRounds.length == 0){
					m = document.getElementById("addRemoveRounds")				  
					m.innerHTML = "<button id=\"addRounds\" >Добавить кольца ----\> </button>"; 							           	
				}
				if (arrGroups[currentFontanGroup].arrRounds.length > 0){
					m = document.getElementById("addRemoveRounds")				  
					m.innerHTML = "<button id=\"removeRounds\" > \<----- Удалить кольца</button>"; 	
				}
			}	
		} 			   
			   
		// panel Rounds 
		d = document.getElementById("panelJetRound");
		if (!d){
			if (arrGroups[currentFontanGroup]){
				if (arrGroups[currentFontanGroup].arrRounds.length != 0){				   
					h = document.createElement('div');
					h.id = "panelJetRound";
					cv = currentFontanGroup + 1;
					h.innerHTML = "<div id=\"sizeJetRound\" >Кольца для группы: </div>"+
						"<button id=\"oneRoundAdd\" >Добавить кольцо</button><br/>"+
						".....................................................<br/>"+
						"<div id = \"radioRoundsPanel\"></div>"+ 
						".....................................................<br/>"+									 
						"<button id=\"jetRoundRemove\">Удалить кольцо</button><br/>"+
						".....................................................<br/>"+		  
						"<button id=\"jetRoundCountPlus\" >Добавить насадку</button>&nbsp;&nbsp;<button id=\"jetRoundCountMinus\" >Удалить насадку</button><br/>"+ 
						"<button id=\"jetRoundHeightPlus\" >Увеличить высоту</button>&nbsp;&nbsp;<button id=\"jetRoundHeightMinus\" >Уменьшить высоту</button><br/>" + 
						"<button id=\"jetRoundRadiusPlus\" >Увеличить диаметр</button>&nbsp;&nbsp;<button id=\"jetRoundRadiusMinus\" >Уменьшить диаметр</button><br/>"+
						"<button id=\"jetRoundRadius2Plus\" >Увеличить дальность</button>&nbsp;&nbsp;<button id=\"jetRoundRadius2Minus\" >Уменьшить дальность</button>";										 
					m = document.getElementById("panel");
					m.appendChild(h);					   
				}
			}				   
		}
			   
		d = document.getElementById("panelJetRound");
		if (d){
			if (arrGroups[currentFontanGroup]){
				if (arrGroups[currentFontanGroup].arrRounds.length == 0){				   
					h = document.getElementById("panelJetRound");
					m = document.getElementById("panel"); 
					m.removeChild(h);					   
				}				    
			}
			if (!arrGroups[currentFontanGroup]){				   
				h = document.getElementById("panelJetRound");
				m = document.getElementById("panel"); 
				m.removeChild(h);					   			    
			}				  
		}			   
		m = document.getElementById("radioRoundsPanel");
		if (m){	
			radio = "";
			for (rg = 0; rg < arrGroups[currentFontanGroup].arrRounds.length; rg ++){
				if (rg == currentRoundJet){
					radio = radio +  "<input type=\"radio\" checked  name=\"radJ\"/> ";
				}else{
					radio = radio +  "<input type=\"radio\"  name=\"radJ\"/> ";				  
				}
			}
			m.innerHTML = radio;
			var radioRounds = document.getElementsByName('radJ');					
		}
               			  		
		if (radioRounds){
			var tt = document.getElementById("radioRoundsPanel");
			tt.onclick = function(){
				for( var i2 = 0; i2 < radioRounds.length; i2++){
					if (radioRounds[i2].checked) {
						currentRoundJet = i2;		   
					}
				}
			}
		}		
    }
	 
	//----------------------// 
	// MAIN VARIABLES SCENE //
	//---------------------//
	
	var renderer,scene,camera, player, clock;
	var INV_MAX_FPS = 0.01, frameDelta = 0;
	var	myCanvas = document.getElementById('myCanvas');

	var personControl = false; 
	var camera2;	
	var start1 = Date.now()+Math.random();	
	var start2 = Date.now()+Math.random();		
	var timer = 0;	
	var frame = 0;
	var uniforms; 	

	var colorEnv = 0xa8daea;
			 
	//RENDERER
	renderer = new THREE.WebGLRenderer({canvas: myCanvas, antialias: true});
	//renderer.setClearColor(0x000000);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor( colorEnv, 1); 
	
	//CAMERA
	camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 3000);
	camera.position.y = 7;
	camera.rotation.y = -1.57;
	
	//SCENE
	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2(colorEnv, 0.003);
		
	//LIGHTS
	var light = new THREE.AmbientLight(0xffffff, 0.4);
	light.position.set(300,70,70);
	scene.add(light);

	var light2 = new THREE.PointLight(0xffffff, 0.5);
	light2.position.set(300,70,70);	
	scene.add(light2);
	
	//SKY
	var color0 = [176,202,237],	
	color1 = [172,144,149],
	color2 = [20,15,29],
	color3 = [20,15,29],
	color4 = [20,15,29],	
	color5 = [193,118,106],  
	color6 = [176,202,237], 
	color7 = [176,202,237],
	color8 = [176,202,237];	

	var arrColors = [];
	arrColors.push(color0, color1, color2, color3,color4,color5,color6,color7,color8);
	var currentColor = color0; 
   
	var oldColor = 0;
	var targetColor = 1; 
	var spd = 200;
	var hex;
	var colorTimer = 0;	

	function chancheColorSky(){
		if (colorTimer> 100){	   
			if ( ( Math.abs(currentColor[0]-arrColors[targetColor][0])) < 10 ) {
				if( ( Math.abs(currentColor[1]-arrColors[targetColor][1])) < 10 ){
					if( ( Math.abs(currentColor[1]-arrColors[targetColor][1])) < 10 ){
						targetColor ++;
						oldColor ++;
						colorTimer =0;				
					}		
				}	 
			}
			if ( targetColor > arrColors.length-1 ){
				targetColor = 0;
			} 
			if ( oldColor > arrColors.length-1 ){
				oldColor = 0;
			}	   
  
			spd0 = (arrColors[targetColor][0] - arrColors[oldColor][0]) / spd;  
			spd1 = (arrColors[targetColor][1] - arrColors[oldColor][1]) / spd;   
			spd2 = (arrColors[targetColor][2] - arrColors[oldColor][2]) / spd;
			currentColor[0]  += spd0; 
			currentColor[1]  += spd1;
			currentColor[2]  += spd2; 

			st = "rgb(" + Math.round(currentColor[0]) + "," + Math.round(currentColor[1]) + "," + Math.round(currentColor[2]) + ")"; 
			var rgb = st.match(/\d+/g), r = parseInt(rgb[0]).toString(16), g = parseInt(rgb[1]).toString(16), b = parseInt(rgb[2]).toString(16), hex = "0x" + r + g + b;
 
			renderer.setClearColor( 	eval(hex), 1); 
			scene.fog = new THREE.FogExp2( eval(hex), 0.003);
		
		} 
		colorTimer ++;	  
	}

	//MATERIALS
	var pullMaterial = new THREE.MeshPhongMaterial();
	pullMaterial.map = THREE.ImageUtils.loadTexture("assets/f.png");
	pullMaterial.map.wrapS = pullMaterial.map.wrapT = THREE.RepeatWrapping;
	pullMaterial.map.repeat.set(10,1); 	
	pullMaterial.bumpMap = THREE.ImageUtils.loadTexture("assets/fb.png");
	pullMaterial.bumpMap.wrapS = pullMaterial.bumpMap.wrapT = THREE.RepeatWrapping;
	pullMaterial.bumpMap.repeat.set(10, 1);	
	
	var floorMaterial = new THREE.MeshPhongMaterial();
	floorMaterial.map = THREE.ImageUtils.loadTexture("assets/gl.png");
	floorMaterial.map.wrapS = floorMaterial.map.wrapT = THREE.RepeatWrapping;
	floorMaterial.map.repeat.set(30,30); 	
	floorMaterial.bumpMap = THREE.ImageUtils.loadTexture("assets/glb.png");
	floorMaterial.bumpMap.wrapS = floorMaterial.bumpMap.wrapT = THREE.RepeatWrapping;
	floorMaterial.bumpMap.repeat.set(30, 30);
	var waterMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} );

	var materialWaterPull = new THREE.ShaderMaterial( {
		uniforms: { 
			tExplosion: {
				type: "t", 
				value: THREE.ImageUtils.loadTexture( 'assets/water.png' )
			},
			time: { // float initialized to 0
				type: "f", 
				value: Math.random()
			}
		},
		vertexShader: document.getElementById( 'vertexShaderPullWater' ).textContent,
		fragmentShader: document.getElementById( 'fragmentShaderPullWater' ).textContent,
		transparent: true	
	} );
			
	var materialWaterJets = new THREE.ShaderMaterial( {
		uniforms: { 
			tExplosion: {
				type: "t", 
				value: THREE.ImageUtils.loadTexture( 'assets/waterJets.png' )
			},
			time: { // float initialized to 0
				type: "f", 
				value: Math.random()
			}
		},
		vertexShader: document.getElementById( 'vertexShaderJets' ).textContent,
		fragmentShader: document.getElementById( 'fragmentShaderJets' ).textContent,
		transparent: true	
	} );

	var materialFish = new THREE.ShaderMaterial( {
		uniforms: { 
			tExplosion: {
				type: "t", 
				value: THREE.ImageUtils.loadTexture( 'assets/fish_d.png' )
			},
			time: { // float initialized to 0
				type: "f", 
				value: Math.random()
			}
		},
		vertexShader: document.getElementById( 'vertexShaderFish' ).textContent,
		fragmentShader: document.getElementById( 'fragmentShaderFish' ).textContent,
		transparent: true	
	} );
	
	materialFish.side = THREE.DoubleSide;				
	var basicMaterial = new THREE.MeshBasicMaterial( {color: 0xff0000 } );				
  
	//PULL WARS
	var positionPullX = 200;
	var positionPullZ = 0;
	var sizeD = 90;	
	var pull;
	var floor;
	var water; 
	reDrawPull();	
	
	//CENTER VARS
	var jetCenterHeight = 20;
	var jetCenter=false;

	//ROUNDS JETS VARS 
	var jetRoundCount = 8;
	var jetRoundHeight = 16;
	var jetRoundRadius = 3; 
	var jetRoundRadius2 = 0;
	
	//GROUPS VARS
	var currentRoundJet = 0;
	var currentFontanGroup = 0;	
	var groupID = 0;
	var arrGroups = [];
	
	//FISHES
	initGlobalFishProperties( materialFish, positionPullX );
	for (ff = 0; ff < 10; ff++){
		f = new FishConstructor(positionPullX);
	}
	
	//-----------------------------//
	//---SCENE ANIMATION-----------//
	//-----------------------------//
	
	//vars
	clock = new THREE.Clock();
	player = new THREE.FirstPersonControls(camera);
	player.lookSpeed = 0.05;	
	
	requestAnimationFrame(function animate() {
		draw(); 
		if (personControl == true){
			frameDelta += clock.getDelta();
			while (frameDelta >= INV_MAX_FPS) {
				//player.moveForward = false;				
				player.update(INV_MAX_FPS);						
				frameDelta -= INV_MAX_FPS;
			}
		}	
		requestAnimationFrame( animate );
	});
 
	//loop	
	function draw(){
		FishConstructorUpdate(sizeD);
		chancheColorSky();
		materialWaterPull.uniforms[ 'time' ].value = 0.0005 * ( Date.now() - start1 );
		materialWaterJets.uniforms[ 'time' ].value = 0.05 * ( Date.now() - start2 );
		materialFish.uniforms[ 'time' ].value = 0.005 * ( Date.now() - start2 );		
		renderer.render(scene, camera);		   
	}		

	