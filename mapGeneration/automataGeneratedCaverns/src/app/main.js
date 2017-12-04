/**************************************************************\
 * This function was created by Nathaniel Inman of The Other  *
 * Experiment Studio for use in the 2013 7DRL Three.RL. This  *
 * function performs Cellular Automata using 4:5r on a map    *
 * while saving the variables to the multidimensional map and *
 * returning a boolean on whether the map was made            *
 * successfully or not.                                       *
 * Originally I had to use a map array and then a secondary   *
 * map array to hold the upcoming map so that the current map *
 * information isn't conflicting with itself. This is because *
 * automata relies entirely on the entire maps state. The     *
 * problem with this is performance issues when iterating     *
 * through the entire secondary map information to throw onto *
 * the primary with each pull. To avoid this, i'll alternate  *
 * which map is the primary map each round. This effectively  *
 * just increases the required memory for the function to     *
 * operate instead of increasing additional processing time.  *
 *------------------------------------------------------------*
 *           R E Q U I R E D      C O N S T A N T S           *
 *------------------------------------------------------------*
 * tileUnused - Specifies which tile is the initialized value *
 * tileDirtFloor - The walkable areas of the map              *
 *------------------------------------------------------------*
 *           F U N C T I O N S    C O N T A I N E D           *
 *------------------------------------------------------------*
 * map_generateAGC() returns true/false on success            *
 *------------------------------------------------------------*
 *           R E Q U I R E D      V A R I A B L E S           *
 *------------------------------------------------------------*
 * map  - the main 2 dimensional array                        *
 *  | .type - distinguishes the tile type at the coordinate   *
 * size - the max size of x and y coordinates                 *
 *------------------------------------------------------------*
 *           R E T U R N E D      V A R I A B L E S           *
 *------------------------------------------------------------*
 * map.type  - Alters from intial value to one of the required*
 *             constants visible above                        *
\**************************************************************/
const tileRemoved = 3;
const tileDirtWall = 2;
const tileDirtFloor = 1;
const tileUnused = 0;

class Sector{
  constructor(){
    this.type = 0;
    this.loc = 0;
  }
  isFloor(){
    return this.type === tileDirtFloor;
  }
  isEmpty(){
    return this.type === tileUnused;
  }
}
export function AGC(map,size,type){
  var map2 = [],
      iterations = 1,
      randomTile; //helps with noise

  for(let i=0;i<=size;i++){
    map2[i] = [];
    for(let j=0;j<=size;j++){
      map2[i][j]= new Sector();
    } //end for
  } //end for

  // Start off by creating the secondary map
  // and generating some noise on the map specifying if the
  // iteration is odd or even
  for(let i=0;i<size;i++){
    for(let j=0;j<size;j++){
      randomTile = Math.floor(Math.random()*99);
      randomTile = randomTile<45?tileUnused:tileDirtFloor;
      if(iterations%2===0){
        map[i][j].type=randomTile;
        map2[i][j].type=tileUnused;
      }else{
        map2[i][j].type=randomTile;
        map[i][j].type=tileUnused;
      } //end if
    } //end for
  } //end for
  runIterations(1,1);
  runIterations(1,2);
  runIterations(1,1);
  runIterations(1,0);
  clipOrphaned();
  buildWalls();
  return true;

  // testSides determines moores neighborhood
  function testSides(x,y,size){
    var result=0,
        i = iterations%2===0;

    if(x>0&&y>0&&type!==tileDirtWall){
      if(i&&map[x-1][y-1].isFloor()||!i&&map2[x-1][y-1].isFloor()){
        result++;
      } //end if
    } //end if
    if(x>0){
      if(i&&map[x-1][y].isFloor()||!i&&map2[x-1][y].isFloor()){
        result++;
      } //end if
    } //end if
    if(x>0&&y<size&&type!==tileDirtWall){
      if(i&&map[x-1][y+1].isFloor()||!i&&map2[x-1][y+1].isFloor()){
        result++;
      } //end if
    } //end if
    if(y>0){
      if(i&&map[x][y-1].isFloor()||!i&&map2[x][y-1].isFloor()){
        result++;
      } //end if
    } //end if
    if(y<size){
      if(i&&map[x][y+1].isFloor()||!i&&map2[x][y+1].isFloor()){
        result++;
      } //end if
    } //end if
    if(x<size&&y>0&&type!==tileDirtWall){
      if(i&&map[x+1][y-1].isFloor()||!i&&map2[x+1][y-1].isFloor()){
        result++;
      } //end if
    } //end if
    if(x<size){
      if(i&&map[x+1][y].isFloor()||!i&&map2[x+1][y].isFloor()){
        result++;
      } //end if
    } //end if
    if(x<size&&y<size&&type!==tileDirtWall){
      if(i&&map[x+1][y+1].isFloor()||!i&&map2[x+1][y+1].isFloor()){
        result++;
      } //end if
    } //end if
    return result;
  } //end testSides()

  // Remove orphaned locations
  function clipOrphaned(){
    var node = {x: 0,y: 0},
        loc_max = {val: 0,cur: 0,num: 0,max: 0},
        unmapped=[];

    for(let i=0;i<size;i++){
      for(let j=0;j<size;j++){
        if(map[i][j].isFloor()&&!map[i][j].loc){
          traverse(++loc_max.cur,i,j);
        } //end if
      } //end for
    } //end for
    for(let i=0;i<size;i++){
      for(let j=0;j<size;j++){
        if(map[i][j].isFloor()&&map[i][j].loc!==loc_max.num){
          map[i][j].type=tileRemoved;
        } //end if
      } //end for
    } //end for

    //look around at location and push unmapped nodes to stack
    function traverse_look(i,j){
      if(i>0&&map[i-1][j].isFloor()&&!map[i-1][j].loc){
        node={x: i-1,y: j};
        unmapped.push(node);map[i-1][j].loc=-1;
      } //end if
      if(j>0&&map[i][j-1].isFloor()&&!map[i][j-1].loc){
        node={x: i,y: j-1};
        unmapped.push(node);map[i][j-1].loc=-1;
      } //end if
      if(i<size&&map[i+1][j].isFloor()&&!map[i+1][j].loc){
        node={x: i+1,y: j};
        unmapped.push(node);map[i+1][j].loc=-1;
      } //end if
      if(j<size&&map[i][j+1].isFloor()&&!map[i][j+1].loc){
        node={x: i,y: j+1};
        unmapped.push(node);map[i][j+1].loc=-1;
      } //end if
    } //end traverse_look()

    // Traverse a location completely
    function traverse(curLoc,i,j){
      var newLoc = node,
          x = i, y = j;

      loc_max.val=1; //set the current mas size to 1
      map[x][y].loc=curLoc;
      traverse_look(x,y);
      while(unmapped.length>0){
        newLoc=unmapped.pop();
        x=newLoc.x;
        y=newLoc.y;
        traverse_look(x,y);
        map[x][y].loc=curLoc;
        loc_max.val++;
        if(loc_max.val>loc_max.max){
          loc_max.max=loc_max.val;
          loc_max.num=loc_max.cur;
        } //end manage maximum mass
      } //end while
    } //end traverse()
  } //end function

  // Cavern generation
  function runIterations(iterations,type){
    var procedure=0,
        mooresNeighborhood,
        t = iterations%2===0;

    do{
      for(let i=0;i<size;i++){
        for(let j=0;j<size;j++){
          mooresNeighborhood=testSides(i,j,size,type);
          if(type===tileUnused){
            if(t&&map[i][j].isFloor()||!t&&map2[i][j].isFloor()){
              if(mooresNeighborhood>=4){
                if(t){
                  map2[i][j].type=tileDirtFloor;
                }else{
                  map[i][j].type=tileDirtFloor;
                } //end if
              }else if(t){
                map2[i][j].type=tileUnused;
              }else{
                map[i][j].type=tileUnused;
              } //end if
            }else if(mooresNeighborhood>=5){
              if(t){
                map2[i][j].type=tileDirtFloor;
              }else{
                map[i][j].type=tileDirtFloor;
              } //end if
            }else if(t){
              map2[i][j].type=tileUnused;
            }else{
              map[i][j].type=tileUnused;
            } //end if
          }else if(type===tileDirtFloor){
            if(t&&map[i][j].isFloor()||!t&&map2[i][j].isFloor()){
              if(mooresNeighborhood>=4){
                if(t){
                  map2[i][j].type=tileDirtFloor;
                }else{
                  map[i][j].type=tileDirtFloor;
                } //end if
              }else if(t){
                map2[i][j].type=tileUnused;
              }else{
                map[i][j].type=tileUnused;
              } //end if
            }else if(mooresNeighborhood>=5){
              if(t){
                map2[i][j].type=tileDirtFloor;
              }else{
                map[i][j].type=tileDirtFloor;
              } //end if
            }else if(t){
              map2[i][j].type=tileUnused;
            }else{
              map[i][j].type=tileUnused;
            } //end if
          }else if(type===tileDirtWall){
            if(t&&map[i][j].isEmpty()||!t&&map2[i][j].isEmpty()){
              if(mooresNeighborhood===4){
                if(t){
                  map2[i][j].type=tileDirtFloor;
                }else{
                  map[i][j].type=tileDirtFloor;
                } //end if
              } //end if
            }else if(t&&map[i][j].isFloor()||!t&&map2[i][j].isFloor()){
              if(mooresNeighborhood<=2){
                if(t){
                  map2[i][j].type=tileUnused;
                }else{
                  map[i][j].type=tileUnused;
                } //end if
              } //end if
            } //end if
          } //end if
        } //end for
      } //end for
      t--;
    }while(t>0);
  } //end runIterations

  function buildWalls(){
    for(let i=0;i<size;i++){
      for(let j=0;j<size;j++){
        if(map[i][j].isFloor()){
          if(i>0){ //to the left
            if(map[i-1][j].isEmpty())map[i-1][j].type=tileDirtWall;
          } //end if
          if(i<size){ //to the right
            if(map[i+1][j].isEmpty())map[i+1][j].type=tileDirtWall;
          } // end if
          if(j>0){ //top
            if(map[i][j-1].isEmpty())map[i][j-1].type=tileDirtWall;
          } // end if
          if(j<size){ //bottom
            if(map[i][j+1].isEmpty())map[i][j+1].type=tileDirtWall;
          } // end if
          if(i>0&&j>0){ //topleft
            if(map[i-1][j-1].isEmpty())map[i-1][j-1].type=tileDirtWall;
          } // end if
          if(i<size&&j<size){ //bottomright
            if(map[i+1][j+1].isEmpty())map[i+1][j+1].type=tileDirtWall;
          } // end if
          if(i>0&&j<size){ //bottomleft
            if(map[i-1][j+1].isEmpty())map[i-1][j+1].type=tileDirtWall;
          } // end if
          if(i<size&&j>0){ //topright
            if(map[i+1][j-1].isEmpty())map[i+1][j-1].type=tileDirtWall;
          } // end if
          if(i===0&&map[i][j].isFloor()||
             i===size-1&map[i][j].isFloor()||
             j===0&&map[i][j].isFloor()||
             j===size-1&&map[i][j].isFloor()){
            map[i][j].type=tileDirtWall;
          } //end if
        } //end if
      } //end for
    } //end for
  } //end buildWalls()
} //end function