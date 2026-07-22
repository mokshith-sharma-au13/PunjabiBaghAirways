console.log("✈️ Punjabi Bagh Airways Activated");



const yesButton =
document.querySelector(".yes-btn");


const noButton =
document.getElementById("noButton");


const acceptButton =
document.querySelector(".accept-btn");



const invitation =
document.querySelector(".invitation-card");


const verification =
document.querySelector(".verification-card");


const agreement =
document.querySelector(".agreement-card");


const boarding =
document.querySelector(".boarding-card");



const progressBar =
document.querySelector(".progress-bar");


const percentage =
document.querySelector(".percentage");


const approved =
document.querySelector(".approved");



const funnyMessage =
document.getElementById("funnyMessage");







// NO BUTTON


const messages=[

"Travel clearance requires YES 😂",

"That button missed the flight ✈️",

"Nice try 😄",

"Departure gate is on the other side 😂"

];



noButton.addEventListener("mouseover",()=>{


let x=Math.random()*250-125;

let y=Math.random()*150-75;


noButton.style.transform=
`translate(${x}px,${y}px)`;


funnyMessage.innerHTML=
messages[Math.floor(Math.random()*messages.length)];


});








// YES


yesButton.addEventListener("click",()=>{


fadeOut(invitation);



setTimeout(()=>{


invitation.style.display="none";


verification.classList.remove("hidden");


startVerification();



},800);


});









function startVerification(){


let progress=0;


let checks=document.querySelectorAll(".checks span");



let timer=setInterval(()=>{


progress++;


progressBar.style.width=
progress+"%";


percentage.innerHTML=
progress+"%";



if(progress>=100){


clearInterval(timer);



checks.forEach(x=>{

x.innerHTML="✓";

});



approved.classList.remove("hidden");



setTimeout(()=>{


fadeOut(verification);



setTimeout(()=>{


verification.style.display="none";


agreement.classList.remove("hidden");


},800);



},1500);



}



},40);



}








// ACCEPT


acceptButton.addEventListener("click",()=>{


fadeOut(agreement);



setTimeout(()=>{


agreement.style.display="none";


boarding.classList.remove("hidden");


startTicketGeneration();



},800);



});









function startTicketGeneration(){


const loader =
document.querySelector(".ticket-loading");


const ticket =
document.querySelector(".ticket-content");


const stamp =
document.querySelector(".stamp");



setTimeout(()=>{


loader.style.display="none";


ticket.classList.remove("hidden");



setTimeout(()=>{


stamp.classList.remove("hidden");


},1200);



},3000);



}









function fadeOut(element){

element.classList.add("fade-out");

}