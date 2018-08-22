import {Sector} from './Sector';
import Heap from 'collections/heap';
import {Noise} from 'noisejs';

export class Map{
  constructor({width=50,height=50,sectors=[],initialize=true}={}){
    this.width = width;
    this.height = height;
    this.noise = new Noise(Math.random());
    this.sectors = sectors;
    if(initialize) this.initialize();
  }
  initialize(){
    for(let y=0;y<=this.height;y++){
      this.sectors[y]=[];
      for(let x=0;x<=this.width;x++){
        this.sectors[y][x]=new Sector({x,y});
      } //end for
    } //end for
  }
  clone(){
    return new Map({
      width: this.width,
      height: this.height,
      sectors: this.sectors.map(row=>{
        return row.map(sector=>{
          return sector.clone();
        });
      }),
      initialize: false
    });
  }
  reset(){
    this.sectors.forEach(row=>{
      row.forEach(sector=> sector.setEmpty());
    });
  }
  getSector({x=0,y=0}={}){
    return this.sectors[y][x];
  }
  isEmpty({x=0,y=0}={}){
    return this.isInbounds({x,y})&&
      this.getSector({x,y}).isEmpty();
  }
  setEmpty({x=0,y=0}={}){
    this.getSector({x,y}).setEmpty();
  }
  isFloor({x=0,y=0}={}){
    return this.getSector({x,y}).isFloor();
  }
  setFloor({x=0,y=0}={}){
    this.getSector({x,y}).setFloor();
  }
  isFloorSpecial({x=0,y=0}={}){
    return this.getSector({x,y}).isFloorSpecial();
  }
  setFloorSpecial({x=0,y=0}={}){
    this.getSector({x,y}).setFloorSpecial();
  }
  isWall({x=0,y=0}={}){
    return this.getSector({x,y}).isWall();
  }
  setWall({x=0,y=0}={}){
    this.getSector({x,y}).setWall();
  }
  isWallSpecial({x=0,y=0}={}){
    return this.getSector({x,y}).isWallSpecial();
  }
  setWallSpecial({x=0,y=0}={}){
    this.getSector({x,y}).setWallSpecial();
  }
  isWater({x=0,y=0}={}){
    return this.getSector({x,y}).isWater();
  }
  setWater({x=0,y=0}={}){
    this.getSector({x,y}).setWater();
  }
  isWaterSpecial({x=0,y=0}){
    return this.getSector({x,y}).isWaterSpecial();
  }
  setWaterSpecial({x=0,y=0}={}){
    this.getSector({x,y}).setWaterSpecial();
  }
  isDoor({x=0,y=0}={}){
    return this.getSector({x,y}).isDoor();
  }
  setDoor({x=0,y=0}={}){
    this.getSector({x,y}).setDoor();
  }
  isRemoved({x=0,y=0}={}){
    return this.getSector({x,y}).isRemoved();
  }
  setRemoved({x=0,y=0}={}){
    this.getSector({x,y}).setRemoved();
  }
  isWalkable({x=0,y=0}={}){
    return this.getSector({x,y}).isWalkable();
  }
  isWalkableOrEmpty({x=0,y=0}={}){
    return this.getSector({x,y}).isWalkableOrEmpty();
  }
  isRoom({x=0,y=0}={}){
    return this.getSector({x,y}).id>0;
  }
  setRoom({x=0,y=0,id=0}={}){
    this.getSector({x,y}).roomNumber = id;
  }
  getRoom({x=0,y=0}={}){
    return this.getSector({x,y}).roomNumber;
  }
  isSameRoom({x1=0,y1=0,x2=0,y2=0}={}){
    return this.getSector({x: x1,y: y1}).roomNumber===
      this.getSector({x: x2,y: y2}).roomNumber;
  }
  isInbounds({x=0,y=0}={}){
    return x>=0&&x<=this.width-1&&y>=0&&y<=this.height-1;
  }

  // uses bresenhams line algorithm to acquire an array of points
  // inclusively between A(x1,y1) and B(x2,y2)
  getPath({x1=0,y1=0,x2=0,y2=0}={}){
    const dx = Math.abs(x2-x1), dy = Math.abs(y2-y1),
          sx = x1<x2?1:-1, sy = y1<y2?1:-1,
          path = [{x: x1,y: y1}];

    let err = dx-dy, err2; //difference and difference*2

    while(!(x1===x2&&y1===y2)){
      err2 = 2*err;
      if(err2>-dy){
        err-=dy; x1+=sx; //eslint-disable-line no-param-reassign
      } //end if
      if(err2<dx){
        err+=dx; y1+=sy; //eslint-disable-line no-param-reassign
      } //end if
      if(x1<=1||x1>this.width-2||y1<=1||y1>this.height-2){
        path.length=0
        break; //no need to continue, it fails
      }else{
        path.push({x: x1,y: y1});
      } //end if
    } //end while()
    return path;
  }
  getNeighbors({
    x=0,y=0,size=1,
    orthogonal=true,cardinal=true,self=false,
    test=()=>true
  }={}){
    const list=[],
          listAdd = loc=>{
            if(this.isInbounds(loc)&&test(this.getSector(loc))){
              list.push(this.getSector(loc));
            } //end if
          };

    for(let cy=y-size;cy<=y+size;cy++){
      for(let cx=x-size;cx<=x+size;cx++){
        if(cx===x&&cy===y&&self){
          listAdd({x: cx, y: cy});
        }else if(cx===x&&cardinal||cy===y&&cardinal){ //cardinal
          listAdd({x: cx, y: cy});
        }else if(orthogonal){ //orthogonal
          listAdd({x: cx, y: cy});
        } //end if
      } //end for
    } //end for
    return list;
  }
  drunkenPath({x1=0,y1=0,x2=0,y2=0,wide=false,draw=()=>true}={}){
    const map = this.clone();

    let path;

    // randomly populate noise on a cloned map until there's a viable
    // path from x1,y1 to x2,y2
    do{
      map.sectors.forEach(row=>{
        row.forEach(sector=>{
          if(
            Math.random()<0.7||
            Math.abs(sector.x-x1)<3&&Math.abs(sector.y-y1)<3||
            Math.abs(sector.x-x2)<3&&Math.abs(sector.y-y2)<3
          ){
            sector.setFloor();
          }else{
            sector.setWall();
          } //end if
        });
      });
      path = map.findPath({x1,y1,x2,y2});
    }while(path.length===1)

    // now we'll draw the path between the points
    path.forEach(sector=>{
      if(wide){
        map.getNeighbors({
          x: sector.x,y: sector.y,orthogonal: false,
          test(sector){
            return Math.random()<0.35&&sector.isWalkable();
          }
        }).forEach(sector=> draw(this.getSector({x: sector.x,y: sector.y})));
        draw(this.getSector({x: sector.x,y: sector.y}));
      }else{
        draw(this.getSector({x: sector.x,y: sector.y}));
      } //end if
    });
  }
  findPath({x1=0,y1=0,x2=0,y2=0}={}){
    const weight = 1,
          heuristic = (dx, dy) => dx + dy, //manhattan heuristic
          openList = new Heap([],(a,b)=>a.f===b.f,(a,b)=>b.path.f - a.path.f),
          abs = Math.abs, //shorten reference
          map = this.clone(), //so we can mutate it and destroy it when done
          SQRT2 = Math.SQRT2; //shorten reference

    let node = map.getSector({x: x1,y: y1}); //acquire starting node

    // set the g and f value of the start node to be 0
    node.path = {g: 0, f: 0, opened: false, closed: false, parent: null};

    // push the start node into the open list
    openList.push(node);
    node.path.opened = true;

    // while the open list is not empty
    while (openList.length) {

      // pop the position of node which has the minimum f value
      node = openList.pop();
      node.path.closed = true;

      // if reached the end position, construct the path and return it
      if (node.x === x2 && node.y === y2) {
        const path = []; //final path

        // Add all successful nodes to the path array except starting node
        do{
          path.push(this.getSector({x: node.x,y: node.y}));
          node = node.path.parent;
        }while(node.path.parent);

        // pop from list to get path in order
        return path;
      } //end if

      // get neighbours of the current node
      const neighbors = map.getNeighbors({
        x: node.x,y: node.y, orthogonal: false,
        test(sector){
          return sector.isWalkable();
        }
      });

      for (let i = 0, ng; i < neighbors.length; ++i) {
        const neighbor = neighbors[i],
              x = neighbor.x,
              y = neighbor.y;

        // inherit the new path or create the container object
        neighbor.path=neighbor.path||{};

        // get the distance between current node and the neighbor
        // and calculate the next g score
        ng = node.path.g + ((x - node.x === 0 || y - node.y === 0) ? 1 : SQRT2);

        // check if the neighbor has not been inspected yet, or
        // can be reached with smaller cost from the current node
        if (!neighbor.path.opened || ng < neighbor.path.g) {
          neighbor.path.g = ng;
          neighbor.path.h = neighbor.path.h || weight * heuristic(abs(x - x2), abs(y - y2));
          neighbor.path.f = neighbor.path.g + neighbor.path.h;
          neighbor.path.parent = node;

          if (!neighbor.path.opened) {
            openList.push(neighbor);
            neighbor.path.opened = true;
          } //end if
        } //end if
      } // end for each neighbor
    } // end while not open list empty

    // fail to find the path
    return [{x: x1,y: y1}];
  }
  isPath(path=[],test){
    let result = true;

    if(!path.length){
      result = false;
    }else if(!path.slice(1,path.length).every(p=> test(this.getSector(p)))){
      result = false;
    } //end if
    return result;
  }
  isSquare({x1=0,y1=0,x2=0,y2=0}={},test){
    const dx = x1<x2?1:-1, dy = y1<y2?1:-1;

    for(let y = y1;y!==y2+dy;y+=dy){
      for(let x = x1;x!==x2+dx;x+=dx){
        if(
          x<1||x>this.width-1||y<1||y>=this.height-1||
          test(this.getSector({x,y}))
        ){
          return false; //exit early
        } //end if
      } //end for
    } //end for
    return true;
  }
  fillRoom({x1=0,y1=0,x2=0,y2=0}={}){
    const dx = x1<x2?1:-1, dy = y1<y2?1:-1;

    for(let y = y1;y!==y2+dy;y+=dy){
      for(let x = x1;x!==x2+dx;x+=dx){
        if(x<1||x>this.width-1||y<1||y>this.height-1||!this.isEmpty({x,y})){
          return; //exit early
        }else if(y===y1||y===y2||x===x1||x===x2){
          this.setWall({x,y});
        }else{
          this.setFloor({x,y});
        } //end if
      } //end for
    } //end for
  }
  clipOrphaned(test,setFailure,setSuccess){
    const locStats = {val: 0,cur: 0,num: 0,max: 0},
          unmapped = [];

    // we have to start by removing roomNumbers if they exist because
    // we run this function more than once
    this.sectors.forEach(row=>{

      //eslint-disable-next-line no-return-assign
      row.forEach(sector=> sector.roomNumber = 0);
    });
    this.sectors.forEach((row,sectorY)=>{
      row.forEach((sector,sectorX)=>{
        if(test(sector)&&!sector.roomNumber){
          locStats.cur++; locStats.val = 1; //init new room
          let newLoc = {x:sectorX,y:sectorY,id: locStats.cur},
              x, y;

          do{
            ({x,y}=newLoc);
            if(
              this.isInbounds({x: x-1,y})&&!this.getRoom({x: x-1,y})&&
              test(this.getSector({x: x-1,y}))
            ){
              unmapped.push({x: x-1, y});
              this.setRoom({x: x-1,y,id: -1});
            } //end if
            if(
              this.isInbounds({x,y: y-1})&&!this.getRoom({x,y: y-1})&&
              test(this.getSector({x,y: y-1}))
            ){
              unmapped.push({x,y: y-1});
              this.setRoom({x,y: y-1,id: -1});
            } //end if
            if(
              this.isInbounds({x: x+1,y})&&!this.getRoom({x: x+1,y})&&
              test(this.getSector({x: x+1,y}))
            ){
              unmapped.push({x: x+1, y});
              this.setRoom({x: x+1,y,id: -1});
            } //end if
            if(
              this.isInbounds({x,y: y+1})&&!this.getRoom({x,y: y+1})&&
              test(this.getSector({x,y: y+1}))
            ){
              unmapped.push({x,y: y+1});
              this.setRoom({x,y: y+1,id: -1});
            } //end if
            this.setRoom({x,y,id: locStats.cur});
            locStats.val++;
            if(locStats.val>locStats.max){
              locStats.max=locStats.val;
              locStats.num=locStats.cur;
            } //end manage maximum mass
            newLoc = unmapped.pop();
          }while(newLoc!==undefined)
        } //end if
      });
    });
    this.sectors.forEach(row=>{
      row.forEach(sector=>{
        if(test(sector)&&sector.roomNumber!==locStats.num&&setFailure){
          setFailure(sector);
        }else if(test(sector)&&sector.roomNumber===locStats.num&&setSuccess){
          setSuccess(sector);
        } //end if
      });
    });
  }
}
