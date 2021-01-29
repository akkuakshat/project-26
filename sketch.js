var database;
var dog, happyDogImg,feedMeDogImg, saddog;
var changeState, readState;
var bedroom,garden,washroom;
//var foodS, foodStockReference;


var fedTime, lastFed;
var feedPetButton, addFoodButton;
var foodObj;

function preload()
{
  happyDogImg = loadImage("images/happilyFed.png");
  feedMeDogImg = loadImage("images/feedMe.png");
  bedroom= loadImage("images/BedRoom.png");
  washroom= loadImage("images/WashRoom.png")
  garden=loadImage("images/Garden.png");
  saddog=loadImage("images/Lazy.png");
}

function setup() {
  database = firebase.database();

  createCanvas(1000, 500);

  
  dog = createSprite(800,250) ;
  dog.scale = 0.25;
  dog.addImage(feedMeDogImg);

  foodObj = new Food();
  foodObj.getFoodStock();
  feedPetButton = createButton("Feed the dog");
  feedPetButton.position(850,95);
  

  
  addFoodButton = createButton("Add Food");
  addFoodButton.position(950,95);
  

  database.ref('FeedTime').on("value",function(data){
    lastFed = data.val();
  })

  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  })
}


function draw() {  
  background(46,139,87);
  if(foodObj.foodStock !== undefined && lastFed !== undefined){
      foodObj.display();
      feedPetButton.mousePressed(feedDog);
      addFoodButton.mousePressed(addFood);


      drawSprites();
      fill ("red");
      textSize(18);
      stroke ("blue");
      text ("Last Feed : " + lastFed,300,55);


    if(gameState!="Hungry"){
      feed.hide();
      addFood.hide();
      dog.remove();
    } else{
      feed.show();
      addFood.show();
      dog.addimage(saddog);
    }
      currentTime=hour();
      if(currentTime==(lastFed+1)){
        update("playing");
        foodObj.garden();
      } else if(currentTime==(lastFed+2)){
        update("sleeping");
        foodObj.bedroom();
      } else if(currentTime>(lastFed+2)&&currentTime<=(lastFed+4)){
        update("bathing");
        foodObj.washroom();
      } else {
        update("Hungry");
        foodObj.display();
      }
  }

}

function addFood(){
   if(foodObj.foodStock !== null){
       foodObj.updateFoodStock(foodObj.foodStock() + 1);
       database.ref('/').update({
        Food:foodobj.updateFoodStock()
       })
   } 
  }

function feedDog(){
  
  dog.addImage(happyDogImg);
  foodObj.deductFood();
  foodObj.updateFoodStock(foodObj.foodStock()-1);
  updateFeedTime();
  setTimeout(function(){
    console.log("Hi");
    dog.addImage(feedMeDogImg);
  },1000);
}

async function updateFeedTime(){
       var response = await fetch('http://worldtimeapi.org/api/timezone/Asia/Kolkata');
       var jsonResponse = await response.json();
       hour = jsonResponse.datetime.slice(11,13);
       if(hour > '12')
       {
         hour = hour % 12;
         fedTime = hour + ' PM'
       }
       else if(hour === '00')
       {
         fedTime = '12 AM';
       }
       else if (hour === '12')
       {
        fedTime = '12 PM';
       }
       else 
       {
        fedTime = hour + ' AM';
       }
       //console.log(getTime);
       database.ref('/').update({
           FeedTime : fedTime
         }) 

       
}