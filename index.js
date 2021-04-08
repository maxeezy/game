
let $ = (id) => {return  document.getElementById(id)};

function randomInteger(min, max) {
    // получить случайное число от (min-0.5) до (max+0.5)
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}
let colors = ['#da1945','#964a1c','#95ffbf','#5f7a66','#da1945','#964a1c','#95ffbf','#5f7a66','#95ffbf','#5f7a66'];
const SPIN  = new function () {

    let SPIN = this, cnv,ctx,width,height,nodes = [],node_count = 0,for_destroy = {},down_keys ={},node_kill=0,lives = 3,timer = 0,run = true;



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
             this.color = clr;
             this.update = upd;
             nodes.push(this);
         }


         _update(){
             if (this.update){
                 this.update(this);
             }
         }

         draw(){
             rect(this.x,this.y,this.w,this.h,this.color);
         }

         destroy(){
             for_destroy[this.id]  = this;
         }

         move(x,y){
             this.x += x;
             this.y += y;
         }

         intersect(node){
             //console.log(node);
             return ((node.x>=this.x&&node.x+node.w<=this.x+this.w)&&(node.y+node.h>=this.y));
         }
    }

    SPIN.create_node = (x,y,w,h,clr,upd) =>{
        return new Node(x,y,w,h,clr,upd);
    };

    SPIN.stop =()=>{
      run= false;
    }

    SPIN.minusLives=()=>{
        lives--;
    }

    SPIN.returnLives=()=>{
        return lives;
    }

    SPIN.return_timer=()=>{
        return timer;
    }
    SPIN.return_kills = ()=>{
        return node_kill;
    }

    SPIN.set_kills = ()=>{
        node_kill++;
    }

    SPIN.start = (w,h) => {
        cnv = $('cnv');
        ctx = cnv.getContext('2d');
        //console.log(ctx);
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

    SPIN.set_timer = () =>{
        timer++;
    }


    SPIN.update = () => {
        if (run){
       // console.log(nodes.length)
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
        }
    };

    SPIN.key = (key) => {
      return down_keys[key];
    };


};


window.addEventListener('load',function () {

    let score  = 0;
    let field = $('score');
    let button  = $('but');
    let main = $('main');
    let game = $('#game');
    let text = $('text');
    let user = $('user');
    button.onclick = function (e){
        e.preventDefault();
        main.style.display = "none";
        game.style.display = 'block';
        user.innerText = text.value;
        console.log(text.value);
        SPIN.start(640 ,480);
        let enemies = [];


        let enemy_ai  = (node) => {
            node.y+=(0.1*randomInteger(5,30));
            if (node.y > 480){
                node.destroy();
                SPIN.minusLives();
                if (SPIN.returnLives()<1){
                    SPIN.stop();
                    if (SPIN.return_timer()<10){
                        alert("Вы проиграли, вы набрали "+SPIN.return_kills()+" очков. Продержались "+SPIN.return_timer());
                    }
                    else{
                        alert("Вы Выйграли, вы набрали "+SPIN.return_kills()+" очков. Продержались "+SPIN.return_timer());
                    }
                }
            }
        };

        setInterval(function (){

            let chislo = randomInteger(1,10);
            SPIN.set_timer();
            enemies.push(SPIN.create_node(10+(20+40)*chislo,-20,20,20,colors[chislo],enemy_ai));
        },1000);



        SPIN.create_node(640/2-20,480-10-40,40,40,'#000000',(node)=>{
            //console.log(this.color);
            for (let i = enemies.length-1;i>=0;i--){
                if (node.intersect(enemies[i])){
                    enemies[i].destroy();
                    enemies.splice(i,1);
                    SPIN.set_kills();
                    field.innerText = SPIN.return_kills();
                }
            }
            if (SPIN.key('KeyA')){
                node.x -=8;
            }
            if (SPIN.key('KeyD')){
                node.x +=8;
            }
        });
    }

});