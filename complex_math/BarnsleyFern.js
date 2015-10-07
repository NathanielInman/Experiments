var v,w=function(){var e=window,a='inner';if(!(e.innerWidth)){a='client';e=document.documentElement||document.body;}return {w:e[a+'Width'],h:e[a+'Height']};},v=w();
var $=function(o){return document.getElementsByTagName(o)[0];};
var sa=function(o,a){for(var i=0;i<a.length;i++){$(o).setAttribute(a[i][0],a[i][1]);}};
var ctx,r=function(){ctx=$('canvas').getContext("2d");},q=function(){sa('canvas',[['width',v.w+'px'],['height',v.h+'px']]);};q();r();
window.onresize=function(){v=w();r();q();ctx.fillStyle='#000';ctx.fillRect(0,0,v.w,v.h);};
var ds=function(x,y,c){ctx.fillStyle=c;ctx.fillRect(x*v.w/size,y*v.h/size,v.w/size,v.h/size);};
var random=function(n,p){return (p||0)+Math.random()*n|0;};
ctx.fillStyle='#000';ctx.fillRect(0,0,v.w,v.h);ctx.fillStyle="#161";
/* BASIC DECLARATIONS */
var totalPoints=10000;
var pen={x:0,y:0};
/* AFFINE TRANSFORMATIONS */
var fp=[1,85,92]; //probability
var f1=function(){pen={x:0,y:0.16*pen.y};};
var f2=function(){pen={x:(0.85*pen.x)+(0.04*pen.y),y:(-0.04*pen.x)+(0.85*pen.y)+1.6};};
var f3=function(){pen={x:0.2*pen.x+-0.26*pen.y,y:0.23*pen.x+0.22*pen.y+1.6};};
var f4=function(){pen={x:-0.15*pen.x+0.28*pen.y,y:0.26*pen.x+0.24*pen.y+0.44};};
/* GENERATE POINTS */
var mainLoop=function(cur){
	for(var i=cur,k=0;i<totalPoints&&i<cur+1000;i++){
		k=random(100);
		if(k<=fp[0]){f1();}else if(k<=fp[1]){f2();}else if(k<=fp[2]){f3();}else{f4();}
		ctx.fillRect(pen.x*v.w/10+v.w/4,pen.y*v.h/10,2,2);
	} //end for
	if(cur<totalPoints)setTimeout("mainLoop("+cur+")",1);
};
mainLoop(0); //initialize
