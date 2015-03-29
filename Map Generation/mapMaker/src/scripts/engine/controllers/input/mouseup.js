import { draw       } from 'engine/controllers/draw/main';
import { location   } from 'engine/controllers/input/mouselocation';
import { button     } from 'engine/controllers/components/button';
import { components } from 'engine/data-model/components';
import { map        } from 'engine/data-model/map';

export function mouseup(e){
  // initialize variables
  var dX = location.x; //mouse down x
  var dY = location.y; //mouse down y
  var uX = Math.floor(e.x/50);   //mouse up x
  var uY = Math.floor(e.y/50);   //mouse up y

  components.forEach(function(c,i){
    var r=c(); //acquire the dynamic component's variables
    if(c.d){ //if there is a downstate that's currently initiated, we need to undo it now
      c.d=r.d=false; //set the downstate to false
      r.v=c.v; //ensure the temporary acquired component variables
      if(r.type=='button')button.draw(r); //redraw the button now that the state has changed
    } //end if
  });

  // main logic
  if(uX>=15||uY>=15||dX>=15||dY>=15){
    return;
  }else if(uX == dX && uY == dY){
    map.addSector(uX,uY);
  }else if(uX == dX +1 && uY == dY){
    map.linkSector(dX,dY,uX,uY);
  }else if(uX == dX -1 && uY == dY){
    map.linkSector(dX,dY,uX,uY);
  }else if(uX == dX && uY == dY +1){
    map.linkSector(dX,dY,uX,uY);
  }else if(uX == dX && uY == dY -1){
    map.linkSector(dX,dY,uX,uY);
  } //end if
  draw();
}