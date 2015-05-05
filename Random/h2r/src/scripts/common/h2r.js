/**
 * Generically convert a hex to rgb using three-character format
 * h2r('#fff')    //-------------------- outputs 'rgba(255,255,255,1)'
 *
 * Also supports full six-character format
 * h2r('#ffffff') //-------------------- outputs 'rgba(255,255,255,1)'
 *
 * Give the converted rgb an alpha value
 * h2r('#fff',0.5) //------------------- outputs 'rgba(255,255,255,0.5)'
 *
 * Apply modifiers to each color output
 * h2r('#fff',{r:0.5,g:1,b:0.5}) //----- outputs 'rgba(127,255,127,1)'
 *
 * Supports adding an alpha to the modifier
 * h2r('#fff',{r:0.6,g:1,b:0.5,a:0.5}) //outputs 'rgba(127,255,127,0.5)'
 *
 * Safely modifies values, preventing invalid values
 * h2r('#3f3',{r:1.2,g:1.2,b:1.0}) //--- outputs 'rgba( 61,255, 51,1)'
 *
 * Modify each value and then require it to meet a lower threshold
 * for brightness. If it doesn't meet the lower threshold then it scales
 * all colors up to meet it
 * h2r('#333',{r:1.2,g:1.2,b:1.2},0.3) //outputs 'rgba( 91, 91, 91,1)'
 *
 * Convert the color and give it both a lower and upper threshold for
 * brightness - note that it only alters color strengths if black was
 * given when threshold isn't met; otherwise, all zero-color factors
 * aren't scaled.
 * h2r('#fff',1,0.3,0.8) //--------------outputs 'rgba(202,202,202,1)'
 * h2r('#000',1,0.3,0.8) //--------------outputs 'rgba( 76, 76, 76,1)'
 * h2r('#011',1,0.3,0.8) //--------------outputs 'rgba(114,114,114,1)'
 * h2r('#248',1,0  ,0.3) //--------------outputs 'rgba( 32, 65,130,1)'
 */
var h2r = function(hex,options,lt,ut){
  var r,g,b,
     o=options||1,
     _h=hex.split(/[,()]/g),
     hex=hex.indexOf('rgb')>-1?rgb2hex(hex):hex, //jshint ignore: line
     result = /^#?([a-f\d]{2}|[a-f\d]{1})([a-f\d]{2}|[a-f\d]{1})([a-f\d]{2}|[a-f\d]{1})$/i.exec(hex),
     clt = ()=> !lt || (r+g+b)/3/255 >= lt,
     cut = ()=> !ut || (r+g+b)/3/255 <= ut,
     cot = ()=> { r=r>255?255:r;g=g>255?255:g;b=b>255?255:b; };

  if(!result) return 'rgba(0,0,0,0)';
  result.forEach((i,j,k)=> i.length==1?k[j]=i+i:i);
  r = parseInt(result[1],16); g = parseInt(result[2],16); b = parseInt(result[3],16);
  if(!(clt()&&cut())&&!clt()||!cut())(()=>{
    for(i=0;i<1000 && (!clt()||!cut());i++){
      if(!clt()){
        if(r===0&&g===0&&b===0){r=1;g=1;b=1;}
        r*=1.01;g*=1.01;b*=1.01;
      } //end if
      if(!cut()){
        r*=0.99;g*=0.99;b*=0.99;
      }//end if
      cot();
    } //end for
    r=parseInt(r);g=parseInt(g);b=parseInt(b);
  })();
  if(typeof o=='string'||typeof o=='number'){
    return 'rgba('+r+','+g+','+b+','+o+')';
  }else if(typeof o=='object'){
    if(o.o)return {r:r,g:g,b:b,o:o}; //return as object
    r=parseInt(r*o.r);g=parseInt(g*o.g);b=parseInt(b*o.b);o=o.a||1;
    cot();
    return 'rgba('+r+','+g+','+b+','+o+')';
  }else{
    return 'rgba(0,0,0,0)';
  } //end if
};

var r2h = function(){
  h2r.apply(this,arguments);
};

var rgb2hex = function(rgba){
  var terms = rgba.split(/[,()]/g);
  return '#'+
         parseInt(terms[1]).toString(16)+
         parseInt(terms[2]).toString(16)+
         parseInt(terms[3]).toString(16);
};

var rndHex = function(){
	var l = '0123456789abcdef'.split(''),
	    c = '#';

	for (var i = 0; i < 6; i++ ) c += l[r(15,0,1)];
	return c;
};

var rndRgb = function(){
  return 'rgb('+r(255,0,1)+','+r(255,0,1)+','+r(255,0,1)+')';
};
