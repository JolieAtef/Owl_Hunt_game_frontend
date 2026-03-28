const start_section=document.querySelector(".start")
const start_btn=document.getElementById("start_btn")
const owl=document.querySelectorAll(".owl")
const sm_owl=document.querySelectorAll(".sm_owl")
const owls = document.querySelectorAll(".game_area .row > div > *")
const top_items = document.querySelector(".top_items")
const display_score=document.getElementById("score")
const display_timer=document.getElementById("timer")
let score
let currentUser
let timeLeft


getTopFive()



start_btn.addEventListener("click",function(){
    startGame()
})


sm_owl.forEach((el)=>el.addEventListener("click", function(){
    if (getComputedStyle(el).opacity > 0) {
        score+=1
        display_score.innerText=score
        el.style.backgroundImage="url(../images/4.png)"
        setTimeout(()=>{  
            el.style.backgroundImage="url(../images/sm_owl.png)"
        },1000)       
    }
}))

owl.forEach((el)=>el.addEventListener("click", function(){
    if (getComputedStyle(el).opacity > 0) {
        score+=5
        display_score.innerText=score
        el.style.backgroundImage="url(../images/2.png)"
        setTimeout(()=>{  
            el.style.backgroundImage="url(../images/owl.png)"
        },1000)
    }
}))


async function startGame(){  
    const name = document.getElementById("name").value
    const level = document.getElementById("level").value
    currentUser = await addHunter(name , level)
    start_section.classList.remove("down")
    start_section.classList.add("up")
    score=0
    timeLeft=31
    display_score.innerText=score
    display_timer.innerText=timeLeft
    owlMove(level)  
    
}

function owlMove(level){
    let speed
    switch(level){
        case "easy":
           speed=1000
           show_speed="show_e"
           break;
        case "medium":
           speed=500
           show_speed="show_m"
           break;
        case "hard":
            speed=300
            show_speed="show_h"
            break; 
            default:
           speed=600
           show_speed="show_m"
           break;
        }
    //  random 
    let owl_moving=setInterval(()=>{
        let randomNum_1 = Math.floor(Math.random() * 36);
        let randomNum_2 = 35-randomNum_1
        owls[randomNum_1].classList.toggle(show_speed)
        owls[randomNum_2].classList.toggle(show_speed)  
    },speed)

    timerInterval = setInterval(() => {
                timeLeft--
                display_timer.innerText = timeLeft
                if (timeLeft <= 5) {
                    display_timer.style.color = '#ffcefa'
                    display_timer.style.transform = 'scale(1.3)'
                    setTimeout(() => {
                        display_timer.style.transform = 'scale(1)'
                    }, 200)
                }
     },1000)

    let game_time=setTimeout(()=>{
        display_timer.style.color = '#eb4cdb'
        clearInterval(owl_moving)
        clearInterval(timerInterval)
        endGame()
    },31500)
}

function endGame() {
    clearInterval(timerInterval)
    setScore(currentUser , score)
    showGameOverModal()
    start_section.classList.add("down")
    start_section.classList.remove("up")
}

// modal control
const modal = new bootstrap.Modal(document.getElementById('gameOverModal'), { backdrop: 'static',  keyboard: false       })
document.getElementById("closeBtn").addEventListener("click", () => {
    closeModal()
})

function showGameOverModal() {
    document.getElementById('finalScore').innerText = score
    
    let message = ''
    if (score >= 100) {
        message = '🏆 Legendary Hunter! Amazing performance!'
    } else if (score >= 75) {
        message = '⭐ Expert Hunter! Excellent work!'
    } else if (score >= 50) {
        message = '🎯 Skilled Hunter! Good job!'
    } else if (score >= 25) {
        message = '👍 Novice Hunter! Keep practicing!'
    } else {
        message = '🦉 Keep hunting! You\'ll get better!'
    }
    
    document.getElementById('scoreMessage').innerText = message
    modal.show()
}

function closeModal(){
    modal.hide()
    getTopFive()
}


/// call apis

async function getTopFive(){
    document.querySelector(".top_items").innerHTML=""
    try{
       const res = await fetch("https://owl-hunt-game-backend.vercel.app/users/top_five")
       const top_five = await res.json()
       top_five.data.map((top , i)=> (
          document.querySelector(".top_items").innerHTML+=
          `<div class="top_five_item rounded-2 d-flex mb-2">
            <span class="rank m-2 px-2 fw-bold fs-5">#${i+1}</span>
            <div class="rank_info rounded-4 w-75 d-flex justify-content-between align-items-center px-3">
            <span class="rank_name fw-bold fs-6">
            ${top.name}        
            </span>
            <span class="rank_score fw-bold fs-6">
             ${top.score} 
            </span>
            </div>
            </div>`
       ))
    }catch(err){
         console.log(err)
    }
}

async function addHunter(name , level) {
    if(!name){
        return 0
    }
    try{
        const res = await fetch("https://owl-hunt-game-backend.vercel.app/users/start_game",{
            method:"POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name , level})
          }
        )
        const addedHunter = await res.json() 
        return addedHunter.addedUser[0]._id
    }catch(err){
        console.log(err)
    }
}



async function setScore(currentUser , score) {
    if(!currentUser){
        return 0
    }
    try{
        const res = await fetch(`https://owl-hunt-game-backend.vercel.app/users/set_score/${currentUser}`,{
            method:"PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({score})
          }
        )

    }catch(err){
        console.log(err)
    }
}



// mobile enter info

document.getElementById("name").addEventListener("focus",()=>{
    if (window.innerWidth < 768) {
         document.querySelector(".top_five").classList.add("opacity-0")
     }
})

document.getElementById("level").addEventListener("focus",()=>{
    if (window.innerWidth < 768) {
        document.querySelector(".top_five").classList.add("opacity-0")
    }
})
                
document.getElementById("name").addEventListener("blur",()=>{
    if (window.innerWidth < 768) {
        document.querySelector(".top_five").classList.remove("opacity-0")
     }
})

document.getElementById("level").addEventListener("blur",()=>{
   if (window.innerWidth < 768) {
       document.querySelector(".top_five").classList.remove("opacity-0")
      }
  })
