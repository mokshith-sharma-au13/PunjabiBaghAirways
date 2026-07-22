// LOGIN

const loginCard = document.querySelector(".login-card");
const loginButton = document.getElementById("loginButton");
const loginName = document.getElementById("loginName");
const loginDob = document.getElementById("loginDob");
const loginMessage = document.getElementById("loginMessage");
const selectedCode = document.getElementById("selectedCode");

const validPassenger = {
    name: "tanya arora",
    dob: "2001-12-12",
    code: "RIO"
};

const lockAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const lockIndexes = Array.from({length:3}, () =>
    Math.floor(Math.random()*lockAlphabet.length)
);

function wrapLockIndex(index) {
    return (index + lockAlphabet.length) % lockAlphabet.length;
}

function renderLockWheel(wheelNumber) {
    const wheel = document.querySelector(`.lock-wheel[data-wheel="${wheelNumber}"]`);
    const currentIndex = lockIndexes[wheelNumber];

    wheel.querySelector(".lock-prev").textContent =
        lockAlphabet[wrapLockIndex(currentIndex - 1)];

    wheel.querySelector(".lock-current").textContent =
        lockAlphabet[currentIndex];

    wheel.querySelector(".lock-next").textContent =
        lockAlphabet[wrapLockIndex(currentIndex + 1)];

    selectedCode.textContent =
        lockIndexes.map(index => lockAlphabet[index]).join("");
}

function rotateLockWheel(wheelNumber, direction) {
    lockIndexes[wheelNumber] =
        wrapLockIndex(lockIndexes[wheelNumber] + direction);

    renderLockWheel(wheelNumber);
}

document.querySelectorAll(".lock-wheel").forEach(wheel => {
    const wheelNumber = Number(wheel.dataset.wheel);

    wheel.querySelector(".lock-up").addEventListener("click", () => {
        rotateLockWheel(wheelNumber, -1);
    });

    wheel.querySelector(".lock-down").addEventListener("click", () => {
        rotateLockWheel(wheelNumber, 1);
    });

    wheel.addEventListener("wheel", event => {
        event.preventDefault();
        rotateLockWheel(wheelNumber, event.deltaY > 0 ? 1 : -1);
    }, { passive: false });

    let touchStartY = null;

    wheel.addEventListener("touchstart", event => {
        touchStartY = event.touches[0].clientY;
    }, { passive: true });

    wheel.addEventListener("touchend", event => {
        if (touchStartY === null) return;

        const touchEndY = event.changedTouches[0].clientY;
        const difference = touchEndY - touchStartY;

        if (Math.abs(difference) > 20) {
            rotateLockWheel(wheelNumber, difference < 0 ? 1 : -1);
        }

        touchStartY = null;
    });
});


loginDob.addEventListener("input", () => {
    let v = loginDob.value.replace(/\D/g,"").slice(0,8);
    if(v.length>4){
        v=v.slice(0,2)+"-"+v.slice(2,4)+"-"+v.slice(4);
    }else if(v.length>2){
        v=v.slice(0,2)+"-"+v.slice(2);
    }
    loginDob.value=v;
});

loginButton.addEventListener("click", () => {

    const enteredName = loginName.value.trim().toLowerCase();
    const enteredDob = loginDob.value;
    const enteredCode =
        lockIndexes.map(index => lockAlphabet[index]).join("");

    loginMessage.className = "";

    if (
        enteredName === validPassenger.name &&
        enteredDob === "12-12-2001" &&
        enteredCode === validPassenger.code
    ) {
        loginMessage.textContent =
            "Passenger verified. Rio approves this journey. 🐾";

        loginMessage.classList.add("login-success");

        setTimeout(() => {
            fadeOut(loginCard);

            setTimeout(() => {
                loginCard.style.display = "none";
                invitation.classList.remove("hidden");
            }, 800);

        }, 900);

    } else {
        loginMessage.textContent =
            "Verification failed. Please check the passenger details and lock code.";

        loginMessage.classList.add("login-error");
    }

});

[loginName, loginDob].forEach(field => {
    field.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            loginButton.click();
        }
    });
});


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

document.querySelectorAll(".lock-wheel").forEach((_, index) => {
    renderLockWheel(index);
});


// FINAL TRAVEL PORTAL TABS

const travelTabs = document.querySelectorAll(".travel-tab");
const travelPanels = document.querySelectorAll(".travel-panel");

travelTabs.forEach(tab => {
    tab.addEventListener("click", () => {
        const targetPanelId = tab.dataset.tab;

        travelTabs.forEach(item => item.classList.remove("active"));
        travelPanels.forEach(panel => panel.classList.remove("active"));

        tab.classList.add("active");

        const targetPanel = document.getElementById(targetPanelId);

        if (targetPanel) {
            targetPanel.classList.add("active");
        }
    });
});
