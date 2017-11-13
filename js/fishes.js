
//------------------------------------------//	 	
//-----------MAIN VARS FISH ----------------//	 
//------------------------------------------//	 

function initGlobalFishProperties(mat, pos){
	FishConstructor.matFish = mat;
	FishConstructor.GLOBALposX = pos;			  
	planeGeom = new THREE.PlaneGeometry(4, 2, 3, 1);		 
	FishConstructor.fishModel = new THREE.Mesh(planeGeom, FishConstructor.matFish);
	FishConstructor.arrFishes = [];		  			  
}
	 
function FishConstructorUpdate(sizeD){
	if (Math.random()*100<0.5){ 
		for (fi =0; fi< FishConstructor.arrFishes.length; fi ++  ){			 
			FishConstructor.arrFishes[fi].addNewTarget(sizeD);
		}	           
	}	 
	for (fi =0; fi< FishConstructor.arrFishes.length; fi ++  ){			 
		FishConstructor.arrFishes[fi].update();
	}	 
}
 	 	 
//------------------------------------------//	
//------ Constructor Fish ------------------//
//------------------------------------------//	 
	 
function FishConstructor(pX){
	this.status = "none";	
	this.pX = pX;
	this.areal = 0; 
	   
	this.model = FishConstructor.fishModel.clone();
	this.model.position.set(this.pX+Math.random()*60-30, -12, Math.random()*60-30);
	this.model.rotation.y = Math.PI / 2; 
	scene.add(this.model);
	   
	this.trgtVector = new THREE.Vector3(Math.random()*20-10+200, -14, Math.random()*20-10); 
	this.ungleTarget = Math.tan(this.trgtVector.x/this.trgtVector.z);		   
	this.spdX = ( this.trgtVector.x - this.model.position.x)/200; 
	this.spdZ = ( this.trgtVector.z - this.model.position.z)/200; 

	FishConstructor.arrFishes.push(this);	      
	  
	this.update = function(){
		if ( Math.abs( this.model.rotation.y - 1.57 ) - this.ungleTarget < 1){ 
			if ( Math.abs(this.model.position.x-200)< this.areal && Math.abs(this.model.position.z)< this.areal ){				 
				this.model.position.x += this.spdX;
				this.model.position.z += this.spdZ;
			}				
		}else{ 
			if (this.model.rotation.y > 6.28){
				this.model.rotation.y = 0.0;
			}		 
			this.model.rotation.y += 0.01;
		} 
	}	 

	this.addNewTarget = function(sizeD){  
		this.areal = sizeD;
		this.trgtVector.set(Math.random()*this.areal-this.areal/2+200, -14, Math.random()*this.areal-this.areal/2); 		  
		this.ungleTarget = Math.tan(this.trgtVector.x/this.trgtVector.z);		  		  
		this.spdX = (this.trgtVector.x - this.model.position.x)/400; 
		this.spdZ = (this.trgtVector.z - this.model.position.z)/400; 		  
	}	  
}
	 
		 
