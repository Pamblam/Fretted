
class GFret{
	constructor(orientation='H'){
		this.orientation=orientation;
		this.canvas = document.createElement("canvas");
		this.canvas.setAttribute("width", "995px");
		this.canvas.setAttribute("height", "180px");
		this.ctx=this.canvas.getContext("2d");
		this.drawFretboard();
		this.labels=[];
	}
	muteString(string){
		this.labels.push({symbol:"X", string:string});
	}
	openString(string, symbol="O"){
		this.labels.push({symbol:symbol, string:string});
	}
	drawFretboard(){
		this.ctx.beginPath();
		this.ctx.moveTo(15,15);
		this.ctx.lineTo(980,15);
		this.ctx.moveTo(15,165);
		this.ctx.lineTo(980,165);
		this.ctx.moveTo(15,15);
		this.ctx.lineTo(15,165);
		for(var fretY=20; fretY<=980; fretY+=40){
			this.ctx.moveTo(fretY,15);
			this.ctx.lineTo(fretY,165);
		}
		for(var stringPos=45; stringPos<30*5; stringPos+=30){
			this.ctx.moveTo(20,stringPos);
			this.ctx.lineTo(980,stringPos);
		}
		this.ctx.stroke();
		[[120,90],[200,90],[280,90],[360,90],[480,60],[480,120],[600,90],[680,90],
		[760,90],[840,90],[960,60],[960,120]].forEach(a=>{
			var centerX=a[0];
			var centerY=a[1];
			var radius = 6;
			this.ctx.beginPath();
			this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
			this.ctx.fill();
			this.ctx.stroke();
		});
	}
	markNote(note, fret, string, circleColor="#FF0000", textColor="#000000"){
		if(string>6||fret>24) return false;
		var centerX = 40*fret;
		var centerY = ((string-1)*30)+15;
		this.ctx.fillStyle=circleColor;
		this.ctx.strokeStyle=circleColor;
		this.ctx.beginPath();
		this.ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI, false);
		this.ctx.fill();
		this.ctx.stroke();
		this.ctx.fillStyle = textColor;
		this.ctx.font = 'bold 14px Courier';
		this.ctx.textBaseline = 'middle'; 
		this.ctx.textAlign = 'center'; 
		if(this.orientation=='H'){
			this.ctx.fillText(note, centerX, centerY);
		}else{
			this.ctx.save();
			this.ctx.translate(centerX, centerY);
			this.ctx.rotate(-Math.PI/2);
			this.ctx.fillText(note, 0, 0);
			this.ctx.restore();
		}
	}
	getDataURI(first=1, frets=24){
		return new Promise(done=>{
			this.getCanvas(first, frets).then(canvas=>done(canvas.toDataURL()));
		});
	}
	cropFretboard(first=1, frets=24){
		return new Promise(done=>{
			if(first > 23) return done(false);
			var startx = first==1?15:20+(40*(first-1));
			var endx = frets==24?980:startx+(40*(frets));
			var width = endx-startx;
			if(first==1) width+=5;
			var canvas = document.createElement("canvas");
			canvas.setAttribute("width", width+"px");
			canvas.setAttribute("height", '180px');
			var img = new Image();
			img.onload = ()=>{
				var ctx=canvas.getContext("2d");
				ctx.drawImage(img, -startx, 0);
				var img2 = new Image();
				img2.onload=()=>{
					var canvas = document.createElement("canvas");
					canvas.setAttribute("width", (width+30)+"px");
					canvas.setAttribute("height", '180px');
					var ctx=canvas.getContext("2d");
					if(first !== 1){
						ctx.font = '14px Courier';
						ctx.textBaseline = 'middle'; 
						ctx.textAlign = 'center'; 
						ctx.fillStyle = "#000000";
						for(var x=15, lbl=parseInt(first); x<width+30; x+=40, lbl++){
							if(this.orientation=='H'){
								ctx.fillText(lbl,x,175);
							}else{
								ctx.save();
								ctx.translate(x,175);
								ctx.rotate(-Math.PI/2);
								ctx.fillText(lbl, 0, 0);
								ctx.restore();
							}
						}
					}
					ctx.drawImage(img2, 15, 0);
					done(canvas);
				};				
				img2.src = canvas.toDataURL();
			};
			img.src=this.canvas.toDataURL();
		});
	}
	labelStrings(canvas){
		var ctx=canvas.getContext("2d");
		ctx.font = 'bold 14px Courier';
		ctx.textBaseline = 'middle'; 
		ctx.textAlign = 'center'; 
		for(var i=0; i<this.labels.length; i++){
			var y = ((this.labels[i].string-1)*30)+15;
			if(this.orientation=='H'){
				ctx.fillText(this.labels[i].symbol,10,y);
			}else{
				ctx.save();
				ctx.translate(10,y);
				ctx.rotate(-Math.PI/2);
				ctx.fillText(this.labels[i].symbol, 0, 0);
				ctx.restore();
			}
		}
		return canvas;
	}
	getCanvas(first=1, frets=24){
		var p = first==1 && frets==24 ? 
			()=>new Promise(done=>done(this.canvas)): 
			()=>this.cropFretboard(first, frets);
		return new Promise(done=>{
			p().then(canvas=>{
				canvas = this.labelStrings(canvas);
				var datauri = canvas.toDataURL();
				var h = canvas.getAttribute("height");
				var w = canvas.getAttribute("width");
				var canvas = document.createElement("canvas");
				if(this.orientation=='H'){
					canvas.setAttribute("width", w);
					canvas.setAttribute("height", h);
				}else{
					canvas.setAttribute("width", h);
					canvas.setAttribute("height", w);
				}
				var ctx=canvas.getContext("2d");
				var img = new Image();
				img.onload = ()=>{
					if(this.orientation=='H'){
						ctx.drawImage(img, 0, 0);
					}else{
						ctx.save();
						ctx.translate(180/2, 995/2);
						ctx.rotate(90 * (Math.PI / 180));
						ctx.drawImage(img, -(995/2),-(180/2));
						ctx.restore();
					}
					done(canvas);
				};
				img.src = datauri;
			});
		});
	}
}
