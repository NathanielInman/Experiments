class VQueue{
  constructor(){
    this.q = new Array();
    this.i = 0;
  }
  sortOnY(a, b){
    return (a.y > b.y)?1:-1;
  }
  enqueue(p){
    this.q.push(p);
  }
  dequeue(){
    this.q.sort(this.sortOnY);
    return this.q.pop();
  }
  remove(e){
    var index = -1;
    for(this.i=0;this.i<this.q.length;this.i++){
      if(this.q[this.i]===e){
        index = this.i; break;
      } //end if
    } //end for
    this.q.splice(index, 1);
  }
  isEmpty(){
    return (this.q.length===0);
  }
  clear(b){
    this.q = [];
  }
}
