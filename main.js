const canvas=document.querySelector('#canvas')
const game=canvas.getContext('2d')
const btnUp=document.querySelector('.arriba')
const btndown=document.querySelector('.abajo')
const btnleft=document.querySelector('.izquierda')
const btnrigth=document.querySelector('.derecha')
const heart=document.querySelector('.heart')
const tiempo=document.querySelector('.time')
const record=document.querySelector('.record')
const modal=document.querySelector('#modalactive')
const spanRecord= document.querySelector('#spanTiempos')
const recordTime= localStorage.getItem('record_time')

btnUp.addEventListener('click', moveUp)
btnUp.addEventListener('click',moveByKey)
btndown.addEventListener('click', moveDown )
btnleft.addEventListener('click', moveLeft)
btnrigth.addEventListener('click', moveRigth)
window.addEventListener ('load',setCanvasSize)
window.addEventListener('resize',setCanvasSize, moveByKey)
window.addEventListener('keyup',moveByKey)

let canvasSize;
let areaSize;
let level=0
let lives=3
let starTime
let intervalo=setInterval(showTime,400)
let timePlayer


const playerPosition={
    positionx:undefined,
    positiony:undefined
}

const bombsPositions={
    x:[],
    y:[]
}
const giftPosition={
    positiongiftx:undefined,
    positiongifty:undefined
}

const doorPosition={
    positiondoorx:undefined,
    positiondoory:undefined
}

let secondtostring=(seconds)=>{
    var hour = Math.floor(seconds / 3600);
    hour = (hour < 10)? '0' + hour : hour;
    
    var minute = Math.floor((seconds / 60) % 60);
    minute = (minute < 10)? '0' + minute : minute;
    
    var second = seconds % 60;
    second = (second < 10)? '0' + second : second;
    return hour + ':' + minute + ':' + second; 
}


function showTime(){
    tiempo.innerHTML= secondtostring((Date.now() - starTime).toFixed()/1000)
}

function moveByKey(event){
    if(!starTime){
        starTime= Date.now()
        console.log('entramos en el if startime')          
    }
    if(event['key']==='ArrowUp') moveUp();
    if(event['key']==='ArrowDown') moveDown();
    if(event['key']==='ArrowLeft') moveLeft();
    if(event['key']==='ArrowRight') moveRigth();
}

function winGame(){
   
    clearInterval(intervalo)
    timePlayer=secondtostring((Date.now() - starTime)/1000)
    
    if(recordTime){
        if(recordTime>timePlayer){
            localStorage.setItem('record_time', timePlayer)
            let view=`<span class="block pt-2">tiempo del jugador:<br> ${timePlayer}</span><span class="block pt-2">tiempo record:<br> ${recordTime}<span><span class="block pt-2  text-orange-500">Crack has logrado romper el record! 🎉🎉</span></span>`
            spanRecord.innerHTML=view
            
            // spanRecord.innerHTML=`Crack has logrado romper el record! 
            // tiempo del jugador: ${timePlayer}
            // tiempo Record: ${recordTime} `
        }else{
            const view=`<span class="block pt-2">tiempo del jugador:<br> ${timePlayer}</span><span class="block pt-2">tiempo record:<br> ${recordTime}<span><span class="block pt-2  text-orange-500">Lo sentimos no has logrado romper el record 😣😣</span></span>`
            spanRecord.innerHTML=view
            // spanRecord.innerHTML=`Lo sentimos no has logrado romper el record 
            // <br>tiempo del jugador: ${timePlayer}
            // <br> tiempo Record: ${recordTime} `
            console.log('no lograste nuevo record')
        }
    }else{
        localStorage.setItem('record_time', timePlayer)
        console.log('nuevo puntaje')
    }
    
    modal.click()
}
function colision(){
    playerPosition.positionx=doorPosition.positiondoorx
    playerPosition.positiony=doorPosition.positiondoory
    setCanvasSize()
}


function setCanvasSize(){ 
    
    playerPosition.positionx=undefined
    playerPosition.positiony=undefined

    if(window.innerHeight > window.innerWidth){
        canvasSize=window.innerWidth * 0.7
    }else{
        canvasSize=window.innerHeight * 0.7
    }

    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);
    areaSize=canvasSize/10
    starGame();
    
}

function starGame(){
    heart.innerHTML=emojis['HEART'].repeat(lives)
    record.innerHTML=recordTime
   
    const mapRow=maps[level].trim().split('\n')
    const mapRowCol=mapRow.map(i=>{
        return i.trim().split('')
    })
    
    bombsPositions.x=[]
    bombsPositions.y=[]
   

    game.textAlign='end'
    game.font=areaSize + 'px San-Serif'
    game.clearRect(0,0,canvasSize,canvasSize)

    mapRowCol.forEach((col, colIndex)=>{
        col.forEach((row,rowIndex)=>{
            const posx=areaSize* (rowIndex +1)
            const posy=areaSize*(colIndex+1)
    
            if(row==='O' && !playerPosition.positionx){
                playerPosition['positionx']=posx
                playerPosition['positiony']=posy
                doorPosition.positiondoorx=posx
                doorPosition.positiondoory=posy
               
            }else if(row==='X'){
                bombsPositions['x'].push(posx.toFixed())
                bombsPositions['y'].push(posy.toFixed())
            }else if(row==='I'){
                giftPosition.positiongiftx=posx
                giftPosition.positiongifty=posy
            }
           
            game.fillText((emojis[row]),posx, posy)
            game.fillText(emojis['PLAYER'], playerPosition['positionx'],playerPosition['positiony'])
            
            
        })
    })

    const posiciondeljugadorRedondeadoX= playerPosition.positionx.toFixed()
    const posiciondeljugadorRedondeadoy= playerPosition.positiony.toFixed()
    
    


    if(playerPosition.positionx){
        if((giftPosition.positiongiftx).toFixed(1)===(playerPosition.positionx).toFixed(1) && (giftPosition.positiongifty).toFixed(1)===(playerPosition.positiony).toFixed(1)){
            if(level<2){
                level+=1
                setCanvasSize()
                console.log('logro alcanzado')
            }else{
                return winGame()
            }
            
        }
        
        for(i=0; i<bombsPositions.x.length; i++){
            if(bombsPositions.x[i]=== posiciondeljugadorRedondeadoX && bombsPositions.y[i]=== posiciondeljugadorRedondeadoy){
                lives-=1              
                console.log(lives)
                if(lives!==0){
                    game.fillText(emojis['BOMB_COLLISION'],playerPosition.positionx,playerPosition.positiony)
                    setTimeout(colision,200)
                    // console.log('colision')
                }else{
                    game.fillText(emojis['BOMB_COLLISION'],playerPosition.positionx,playerPosition.positiony)
                    level=0
                    lives=3
                    starTime=undefined
                    setTimeout(setCanvasSize,200)
                    setTimeout(moveByKey,200)
                }
              
            }
        } 
    }

    
}

function moveUp(){
    console.log('mover pa arriba')
    const redondeo=(playerPosition.positiony-areaSize).toFixed(2)
    console.log(redondeo)

    if((redondeo>=areaSize)){
        console.log('entra en el condicional')
        playerPosition.positiony-=areaSize
        starGame()
    }           
}

function moveDown(){
    console.log('mover pa abajo')
    const redondeo=(playerPosition.positiony+areaSize).toFixed(2)
    
    if(redondeo<=canvasSize){
        playerPosition.positiony+=areaSize
        starGame()
        
         
    }           
}

function moveRigth(){
    console.log('mover pa derecha')
    const redondeo=(playerPosition.positionx+areaSize).toFixed(3)
    
    if(redondeo<=canvasSize){
        playerPosition.positionx+=areaSize
        starGame()
         
    }           
}

function moveLeft(){
    console.log('mover pa izquierda')
    const redondeo=(playerPosition.positionx-areaSize).toFixed(3)
    
    if(redondeo>=areaSize){
        playerPosition.positionx-=areaSize
        starGame()
         
    }           
}
