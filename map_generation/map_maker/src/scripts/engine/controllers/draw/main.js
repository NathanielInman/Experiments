// Main import statements required for this module
import { map        } from 'engine/data-model/map';
import { pane       } from 'engine/controllers/components/pane';
import { background } from 'engine/controllers/components/background';
import { mapper     } from 'engine/controllers/components/mapper';
import { button     } from 'engine/controllers/components/button';
import { combobox   } from 'engine/controllers/components/combobox';
import { components } from 'engine/data-model/components';

// Main draw function that calls all the other draw functions
export function draw(){
  components.forEach(function(e){
    var r=e();
    if(r.type=='background')background.draw(r);
    if(r.type=='pane'      )pane.draw(r);
    if(r.type=='mapper'    )mapper.draw(r,map.getActiveSector());
    if(r.type=='button'    )button.draw(r);
    if(r.type=='combobox'  )combobox.draw(r);
  });
} //end function