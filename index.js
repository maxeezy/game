const SPIN  = new function () {

    let SPIN = this, cnv,ctx,width,height,nodes = [],node_count = 0,for_destroy = {},down_keys ={};

    let $ = (id) => {return  document.getElementById(id)};

    let rect = (x,y,w,h,clr) => {
        ctx.fillStyle = clr;
        ctx.fillRect(x,y,w,h);
    };

    class Node{
         constructor(x,y,w,h,clr,upd){
             this.id = node_count++;
             this.x = x;
             this.y = y;
             this.w = w;
             this.h = h;
             this.update = upd;
             nodes.push(this);
         }


         _update(){
             if (this.update){
                 this.update(this);
             }
         }

         draw(){
             rect(this.x,this.y,this.w,this.h,'#000000');
         }

         destroy(){
             for_destroy[this.id]  = this;
         }

         move(x,y){
             this.x += x;
             this.y += y;
         }

         intersect(node){
             return (this.x+this.h>=node.x&&this.x+this.w+this.h<=node.x+node.w)
         }
    }

    SPIN.create_node = (x,y,w,h,clr,upd) =>{
        return new Node(x,y,w,h,clr,upd);
    };



    SPIN.start = (w,h) => {
        cnv = $('cnv');
        ctx = cnv.getContext('2d');
        console.log(ctx);
        width = w;
        height = h;
        cnv.width = width;
        cnv.height = height;

        window.addEventListener('keydown',(e)=>{
            down_keys[e.code] = true;
        });

        window.addEventListener('keyup',(e)=>{
            delete down_keys[e.code];
        });
        SPIN.update();
    };

    SPIN.update = () => {
        ctx.clearRect(0,0,width,height);
        for (let i=nodes.length-1;i>=0;i--){
            if(for_destroy[nodes[i].id]){
                nodes.splice(i,1);
                continue;
            }
            nodes[i]._update();
            nodes[i].draw();
        }
        requestAnimationFrame(SPIN.update);
    };

    SPIN.key = (key) => {
      return down_keys[key];
    };


};


window.addEventListener('load',function () {



   SPIN.start(640 ,480);
    let enemies = [];

   let enemy_ai  = (node) => {
       node.y+=1;
   };

    for (let i=0;i<10;i++){
        enemies.push(SPIN.create_node(10+(20+40)*i,-20,20,20,'#ffba7d',enemy_ai));
    }

    SPIN.create_node(640/2-20,480-10-40,40,40,'#000000',(node)=>{
        for (let i = enemies.length-1;i>=0;i--){
            if (node.intersect(enemies[i])){
                enemies[i].destroy();
                enemies.splice(i,1);
            }
                }
        if (SPIN.key('KeyA')){
            node.x -=1;
        }
        if (SPIN.key('KeyD')){
            node.x +=1;
        }
    });

});