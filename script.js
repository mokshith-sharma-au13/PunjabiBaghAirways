// OPENING GLASS SWIPE GATE
const journeyGate = document.getElementById("journeyGate");
const journeySwipe = document.getElementById("journeySwipe");
const journeySwipeHandle = document.getElementById("journeySwipeHandle");
const journeySwipeFill = document.getElementById("journeySwipeFill");
const journeySwipeLabel = document.getElementById("journeySwipeLabel");

let journeySwipeDragging = false;
let journeySwipeProgress = 0;
let journeyStarted = false;

function setJourneySwipeProgress(progress) {
    const safe = Math.max(0, Math.min(1, progress));
    journeySwipeProgress = safe;

    if (journeySwipeHandle) {
        journeySwipeHandle.style.left =
            `calc(${safe * 100}% - ${safe * 54}px)`;
    }

    if (journeySwipeFill) {
        journeySwipeFill.style.width = `${safe * 100}%`;
    }

    journeySwipe?.setAttribute(
        "aria-valuenow",
        String(Math.round(safe * 100))
    );

    if (journeySwipeLabel) {
        journeySwipeLabel.textContent =
            safe > .72 ? "Release to begin" : "Swipe to begin";
    }
}

function beginJourneyExperience() {
    if (journeyStarted) return;
    journeyStarted = true;

    setJourneySwipeProgress(1);
    journeySwipe?.classList.add("is-complete");

    if (journeySwipeLabel) {
        journeySwipeLabel.textContent = "Journey started";
    }

    setTimeout(() => journeyGate?.classList.add("is-leaving"), 220);

    setTimeout(() => {
        if (journeyGate) {
            journeyGate.hidden = true;
        }

        // Release the cinematic intro only now.
        document.body.classList.remove("journey-gate-active");
        document.body.classList.add("journey-sequence-running");

        beginCinematicSequence();
        startCinematicStatusMessages();
    }, 950);
}

function swipePosition(event) {
    if (!journeySwipe) return 0;
    const rect = journeySwipe.getBoundingClientRect();
    return (event.clientX - rect.left - 27) /
        Math.max(1, rect.width - 54);
}

journeySwipeHandle?.addEventListener("pointerdown", event => {
    journeySwipeDragging = true;

    journeySwipeHandle.setPointerCapture(event.pointerId);
    journeySwipe?.classList.add("is-dragging");
});

journeySwipeHandle?.addEventListener("pointermove", event => {
    if (journeySwipeDragging) {
        setJourneySwipeProgress(swipePosition(event));
    }
});

journeySwipeHandle?.addEventListener("pointerup", event => {
    if (!journeySwipeDragging) return;

    journeySwipeDragging = false;
    journeySwipe?.classList.remove("is-dragging");

    if (journeySwipeProgress >= .78) {
        beginJourneyExperience();
    } else {
        setJourneySwipeProgress(0);
    }

    journeySwipeHandle.releasePointerCapture?.(event.pointerId);
});

journeySwipeHandle?.addEventListener("pointercancel", () => {
    journeySwipeDragging = false;
    journeySwipe?.classList.remove("is-dragging");


    setJourneySwipeProgress(0);
});

journeySwipe?.addEventListener("keydown", event => {
    if (event.key === "ArrowRight") {
        event.preventDefault();
        setJourneySwipeProgress(journeySwipeProgress + .12);
    } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        setJourneySwipeProgress(journeySwipeProgress - .12);
    } else if (
        (event.key === "Enter" || event.key === " ") &&
        journeySwipeProgress >= .5
    ) {
        event.preventDefault();
        beginJourneyExperience();
    }
});

window.addEventListener("load", () => {
    setJourneySwipeProgress(0);
}, { once: true });


// FLUID CINEMATIC INTRO

const cinematicOpening = document.getElementById("cinematicOpening");
const cinematicSkip = document.getElementById("cinematicSkip");

let cinematicLogoTimer;
let cinematicFinishTimer;
let cinematicCleanupTimer;
let cinematicSequenceFinished = false;

function completeCinematicSequence() {
    if (cinematicSequenceFinished) return;
    cinematicSequenceFinished = true;

    clearTimeout(cinematicLogoTimer);
    clearTimeout(cinematicFinishTimer);
    clearTimeout(cinematicCleanupTimer);

    cinematicOpening?.classList.add("is-closing");

    document.body.classList.remove(
        "cinematic-intro-active",
        "journey-sequence-running"
    );
    document.body.classList.add("cinematic-intro-complete");

    cinematicCleanupTimer = window.setTimeout(() => {
        if (cinematicOpening) {
            cinematicOpening.hidden = true;
        }
    }, 850);
}

function beginCinematicSequence() {
    if (!cinematicOpening) {
        document.body.classList.remove("cinematic-intro-active");
        document.body.classList.add("cinematic-intro-complete");
        return;
    }

    // Allow the background video to establish the scene.
    cinematicLogoTimer = window.setTimeout(() => {
        cinematicOpening.classList.add("logo-is-visible");
    }, 9200);

    // Show the logo briefly, then reveal the existing login panel.
    cinematicFinishTimer = window.setTimeout(
        completeCinematicSequence,
        13300
    );
}

cinematicSkip?.addEventListener(
    "click",
    completeCinematicSequence,
    { once: true }
);

// Cinematic sequence begins after the opening swipe.


// CINEMATIC AMBIENT STATUS

const cinematicStatus = document.getElementById("cinematicStatus");

const cinematicStatusMessages = [
    "Preparing aircraft...",
    "Checking passenger manifest...",
    "Loading questionable travel decisions...",
    "Ready for boarding."
];

let cinematicStatusTimer = null;
let cinematicStatusIndex = 0;

function startCinematicStatusMessages() {
    if (!cinematicStatus) return;

    cinematicStatusIndex = 0;
    cinematicStatus.textContent =
        cinematicStatusMessages[cinematicStatusIndex];

    cinematicStatusTimer = window.setInterval(() => {
        if (
            cinematicStatusIndex >=
            cinematicStatusMessages.length - 1
        ) {
            clearInterval(cinematicStatusTimer);
            return;
        }

        cinematicStatus.classList.add("is-changing");

        window.setTimeout(() => {
            cinematicStatusIndex += 1;

            cinematicStatus.textContent =
                cinematicStatusMessages[cinematicStatusIndex];

            cinematicStatus.classList.remove("is-changing");
        }, 500);
    }, 2300);
}

// Ambient status begins after the opening swipe.

cinematicSkip?.addEventListener("click", () => {
    clearInterval(cinematicStatusTimer);
});


// TRIP COUNTDOWN
// Change this one value later if the confirmed departure date changes.
const tripDepartureTime =
    new Date("2026-11-15T09:00:00+05:30").getTime();

const countdownDays = document.getElementById("countdownDays");
const countdownHours = document.getElementById("countdownHours");
const countdownMinutes = document.getElementById("countdownMinutes");
const countdownSeconds = document.getElementById("countdownSeconds");
const countdownStatus = document.getElementById("countdownStatus");
const countdownNote = document.getElementById("countdownNote");
const tripCountdown = document.getElementById("tripCountdown");

function padCountdownValue(value, length = 2) {
    return String(value).padStart(length, "0");
}

function updateTripCountdown() {
    if (
        !countdownDays ||
        !countdownHours ||
        !countdownMinutes ||
        !countdownSeconds
    ) return;

    const remaining = tripDepartureTime - Date.now();

    if (remaining <= 0) {
        countdownDays.textContent = "000";
        countdownHours.textContent = "00";
        countdownMinutes.textContent = "00";
        countdownSeconds.textContent = "00";

        if (countdownStatus) {
            countdownStatus.textContent = "NOW BOARDING";
        }

        if (countdownNote) {
            countdownNote.textContent =
                "The adventure is officially ready for takeoff. ✈️";
        }

        tripCountdown?.classList.add("is-departing");
        return;
    }

    const totalSeconds = Math.floor(remaining / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    countdownDays.textContent = padCountdownValue(days, 3);
    countdownHours.textContent = padCountdownValue(hours);
    countdownMinutes.textContent = padCountdownValue(minutes);
    countdownSeconds.textContent = padCountdownValue(seconds);
}

updateTripCountdown();
window.setInterval(updateTripCountdown, 1000);

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
            "Passenger verified. Rio approves this journey. 🐶";

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


const companionSelection =
document.querySelector(".companion-select-card");


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


companionSelection.classList.remove("hidden");


},800);



},1500);



}



},40);



}












// =========================================================
// COLORFUL EMAIL NOTIFICATIONS — EMAILJS
// Sends:
// 1) Companion booking confirmation
// 2) Boarding pass after Travel Clearance
// =========================================================

const PBA_COMPANION_NOTIFICATION_EMAIL = "mokshithvsharma@gmail.com";

const PBA_EMAILJS = {
    serviceId: "service_jxaq2pp",
    templateId: "template_0ajph0q",
    publicKey: "PNUHbNDbC8Gvg7yqC"
};

const companionEmailStatus = null;

const boardingPassEmailStatus =
    document.getElementById("boardingPassEmailStatus");
const boardingPassRecipientEmail =
    document.getElementById("boardingPassRecipientEmail");
const sendBoardingPassEmailButton =
    document.getElementById("sendBoardingPassEmailButton");

let companionNotificationSent = false;

function formatNotificationTimestamp() {
    return new Intl.DateTimeFormat("en-GB", {
        dateStyle: "full",
        timeStyle: "medium",
        timeZone: "Asia/Kolkata"
    }).format(new Date());
}

function setEmailStatus(element, message, state = "") {
    if (!element) return;

    element.textContent = message;
    element.classList.remove(
        "is-sending",
        "is-success",
        "is-error"
    );

    if (state) {
        element.classList.add(`is-${state}`);
    }
}

// Public deployment base used by email clients.
// Email apps cannot load localhost/file URLs, so email images must always
// point to the live GitHub Pages assets.
const PBA_PUBLIC_ASSET_BASE =
    "https://mokshith-sharma-au13.github.io/PunjabiBaghAirways/";

function safeAssetUrl(relativePath) {
    try {
        const cleanPath = String(relativePath || "")
            .replace(/^\.\//, "")
            .replace(/^\//, "");

        return new URL(cleanPath, PBA_PUBLIC_ASSET_BASE).href;
    } catch (error) {
        console.warn("Unable to create public email asset URL:", error);
        return "";
    }
}

function emailShell(innerHtml, previewText = "") {
    const logoUrl = safeAssetUrl("assets/images/Logo.png");

    return `
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width">
<title>Punjabi Bagh Airways</title>
</head>

<body style="margin:0;padding:0;background:#07111f;font-family:Arial,Helvetica,sans-serif;color:#17202a;">

<div style="display:none;max-height:0;overflow:hidden;opacity:0;">
${previewText}
</div>

<table role="presentation"
       width="100%"
       cellspacing="0"
       cellpadding="0"
       border="0"
       style="width:100%;background:#07111f;margin:0;padding:0;">

<tr>
<td align="center" style="padding:34px 14px;">

<table role="presentation"
       width="680"
       cellspacing="0"
       cellpadding="0"
       border="0"
       style="width:100%;max-width:680px;border-collapse:separate;border-spacing:0;
              background:#f5f1e8;border-radius:24px;overflow:hidden;
              box-shadow:0 24px 70px rgba(0,0,0,.35);">

<tr>
<td style="padding:28px 34px;background:#0a1627;border-bottom:3px solid #cda45d;">

<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
<tr>

<td valign="middle">
    <div style="font-size:11px;letter-spacing:4px;color:#d8b875;font-weight:700;">
        PUNJABI BAGH AIRWAYS
    </div>

    <div style="margin-top:8px;font-family:Georgia,'Times New Roman',serif;
                font-size:28px;line-height:1.1;color:#ffffff;font-weight:700;">
        Private Passenger Service
    </div>
</td>

<td width="120" align="right" valign="middle">
    ${logoUrl ? `
    <img src="${logoUrl}"
         width="104"
         alt="Punjabi Bagh Airways"
         style="display:block;width:104px;max-width:104px;height:auto;border:0;border-radius:12px;">
    ` : `
    <div style="display:inline-block;padding:12px 14px;border:1px solid #d8b875;
                border-radius:50%;color:#d8b875;font-size:18px;font-weight:700;">
        PBA
    </div>
    `}
</td>

</tr>
</table>

</td>
</tr>

${innerHtml}

<tr>
<td style="padding:22px 34px;background:#0a1627;text-align:center;">

<div style="color:#d8b875;font-size:11px;font-weight:700;letter-spacing:2px;">
    PUNJABI BAGH AIRWAYS
</div>

<div style="margin-top:8px;color:#9dacbf;font-size:11px;line-height:1.6;">
    Connecting people, places &amp; questionable decisions since 2026.
</div>

</td>
</tr>

</table>

<div style="max-width:620px;margin:18px auto 0;color:#728298;
            font-size:10px;line-height:1.5;text-align:center;">
    Automated travel notification • ${formatNotificationTimestamp()}
</div>

</td>
</tr>
</table>

</body>
</html>`;
}

function buildCompanionBookedHtml() {
    const companionImage =
        safeAssetUrl("assets/images/Companion_Pic.jpg");

    return emailShell(`
<tr>
<td style="padding:36px 34px 16px;text-align:center;">

    ${companionImage ? `
    <img src="${companionImage}"
         width="112"
         height="112"
         alt="Mokshith Sharma"
         style="display:block;margin:0 auto;width:112px;height:112px;object-fit:cover;
                border-radius:56px;border:4px solid #ffffff;
                box-shadow:0 10px 25px rgba(0,0,0,.15);">
    ` : `
    <div style="display:inline-block;width:104px;height:104px;border-radius:52px;
                background:#0a1627;color:#d8b875;font-size:30px;line-height:104px;
                font-weight:700;text-align:center;">
        MS
    </div>
    `}

    <div style="margin-top:24px;color:#7b6a4d;font-size:10px;
                letter-spacing:2.5px;font-weight:700;">
        COMPANION BOOKING CONFIRMED
    </div>

    <div style="margin-top:8px;font-family:Georgia,'Times New Roman',serif;
                color:#121820;font-size:34px;line-height:1.15;font-weight:700;">
        Mokshith Sharma
    </div>

    <div style="margin-top:8px;color:#66707d;font-size:14px;">
        An Introvert Explorer
    </div>

</td>
</tr>

<tr>
<td style="padding:10px 34px 34px;">

<table role="presentation"
       width="100%"
       cellspacing="0"
       cellpadding="0"
       border="0"
       style="border-collapse:separate;border-spacing:0;background:#ffffff;
              border:1px solid #ddd5c7;border-radius:16px;">

<tr>
<td style="padding:18px 20px;border-bottom:1px dashed #c8c0b4;">
    <div style="font-size:10px;letter-spacing:1.8px;color:#8b8276;font-weight:700;">
        PASSENGER
    </div>
    <div style="margin-top:6px;font-size:18px;color:#18202a;font-weight:700;">
        Tanya Arora
    </div>
</td>
</tr>

<tr>
<td style="padding:18px 20px;border-bottom:1px dashed #c8c0b4;">
    <div style="font-size:10px;letter-spacing:1.8px;color:#8b8276;font-weight:700;">
        ROUTE
    </div>
    <div style="margin-top:6px;font-size:17px;color:#18202a;font-weight:700;">
        India → London → Japan
    </div>
</td>
</tr>

<tr>
<td style="padding:18px 20px;">
    <div style="font-size:10px;letter-spacing:1.8px;color:#8b8276;font-weight:700;">
        BOOKING STATUS
    </div>
    <div style="margin-top:6px;color:#238548;font-size:17px;font-weight:700;">
        COMPANION BOOKED ✓
    </div>
</td>
</tr>

</table>

<div style="margin-top:24px;padding:17px 20px;border-radius:14px;
            border:1px solid #b9ddc7;background:#eef8f1;color:#28603d;
            font-size:13px;line-height:1.6;text-align:center;">

    Punjabi Bagh Airways confirms that Mokshith Sharma has successfully
    survived the selection process. Terms &amp; Conditions are now unlocked. ✈️

</div>

</td>
</tr>
`, "Mokshith Sharma has been booked as your Punjabi Bagh Airways companion.");
}

function buildBoardingPassHtml() {
    const passengerImage =
        safeAssetUrl("assets/images/Passenger_Pic.jpg");

    return emailShell(`
<tr>
<td style="padding:34px 34px 8px;">

<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
<tr>

<td valign="middle">

    <div style="font-size:10px;letter-spacing:2.5px;color:#8b8276;font-weight:700;">
        OFFICIAL TRAVEL DOCUMENT
    </div>

    <div style="margin-top:6px;font-family:Georgia,'Times New Roman',serif;
                font-size:36px;line-height:1.1;color:#121820;font-weight:700;">
        BOARDING PASS
    </div>

</td>

<td width="112" align="right" valign="middle">

    ${passengerImage ? `
    <img src="${passengerImage}"
         width="96"
         height="96"
         alt="Tanya Arora"
         style="display:block;margin-left:auto;width:96px;height:96px;object-fit:cover;
                border-radius:48px;border:4px solid #ffffff;
                box-shadow:0 8px 20px rgba(0,0,0,.13);">
    ` : `
    <div style="display:inline-block;width:88px;height:88px;border-radius:44px;
                background:#ded8cc;color:#333;font-size:26px;line-height:88px;
                text-align:center;font-weight:700;">
        TA
    </div>
    `}

</td>

</tr>
</table>

</td>
</tr>

<tr>
<td style="padding:18px 34px;">

<table role="presentation"
       width="100%"
       cellspacing="0"
       cellpadding="0"
       border="0"
       style="border-collapse:separate;border-spacing:0;background:#fffdf8;
              border:1px solid #d8d0c3;border-radius:18px;overflow:hidden;">

<tr>
<td style="padding:19px 20px;border-bottom:1px dashed #bdb5a8;">
    <div style="font-size:10px;letter-spacing:1.8px;color:#81786d;font-weight:700;">
        PASSENGER
    </div>
    <div style="margin-top:6px;font-size:19px;color:#111820;font-weight:700;">
        Tanya Arora
    </div>
</td>
</tr>

<tr>
<td style="padding:19px 20px;border-bottom:1px dashed #bdb5a8;">
    <div style="font-size:10px;letter-spacing:1.8px;color:#81786d;font-weight:700;">
        ROUTE
    </div>
    <div style="margin-top:6px;font-size:18px;color:#111820;font-weight:700;">
        India 🇮🇳 → London 🇬🇧 → Japan 🇯🇵
    </div>
</td>
</tr>

<tr>
<td style="padding:19px 20px;border-bottom:1px dashed #bdb5a8;">
    <div style="font-size:10px;letter-spacing:1.8px;color:#81786d;font-weight:700;">
        SELECTED COMPANION
    </div>
    <div style="margin-top:6px;font-size:18px;color:#111820;font-weight:700;">
        Mokshith Sharma
    </div>
</td>
</tr>

<tr>
<td style="padding:19px 20px;border-bottom:1px dashed #bdb5a8;">
    <div style="font-size:10px;letter-spacing:1.8px;color:#81786d;font-weight:700;">
        MISSION
    </div>
    <div style="margin-top:6px;font-size:18px;color:#111820;font-weight:700;">
        Case Study First. Sushi Later. 🍣
    </div>
</td>
</tr>

<tr>
<td style="padding:19px 20px;border-bottom:1px dashed #bdb5a8;">
    <div style="font-size:10px;letter-spacing:1.8px;color:#81786d;font-weight:700;">
        SEAT
    </div>
    <div style="margin-top:6px;font-size:18px;color:#111820;font-weight:700;">
        Window Seat, Of Course ✈️😄
    </div>
</td>
</tr>

<tr>
<td style="padding:19px 20px;">
    <div style="font-size:10px;letter-spacing:1.8px;color:#81786d;font-weight:700;">
        STATUS
    </div>
    <div style="margin-top:6px;color:#238548;font-size:18px;font-weight:700;">
        Travel Companion Approved
    </div>
</td>
</tr>

</table>

</td>
</tr>

<tr>
<td style="padding:10px 34px 32px;">

<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
<tr>

<td valign="bottom">

    <div style="display:inline-block;padding:12px 18px;border:3px solid #238548;
                color:#238548;font-weight:800;letter-spacing:3px;
                font-size:16px;transform:rotate(-5deg);">

        APPROVED

    </div>

</td>

<td align="right" valign="bottom">

    <div style="font-family:'Courier New',monospace;color:#111820;
                font-size:16px;letter-spacing:3px;font-weight:700;">
        || ||| || |||| || |
    </div>

    <div style="margin-top:5px;color:#5f6570;font-family:'Courier New',monospace;
                font-size:12px;letter-spacing:2px;">
        PBA-2026-LON-JPN
    </div>

</td>

</tr>
</table>

<div style="margin-top:28px;padding:18px;border-top:1px solid #d8d0c3;
            color:#4f5965;font-size:13px;line-height:1.6;text-align:center;">

    Estimated departure:
    <strong style="color:#151d27;">
        15 November 2026, 9:00 AM IST
    </strong>

    <br><br>

    <span style="font-family:Georgia,'Times New Roman',serif;
                 font-size:20px;color:#151d27;">
        See you at the departure gate ✈️
    </span>

</div>

</td>
</tr>
`, "Your Punjabi Bagh Airways boarding pass is ready.");
}

async function sendViaEmailJs(toEmail, subject, htmlContent) {
    const response = await fetch(
        "https://api.emailjs.com/api/v1.0/email/send",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                service_id: PBA_EMAILJS.serviceId,
                template_id: PBA_EMAILJS.templateId,
                user_id: PBA_EMAILJS.publicKey,
                template_params: {
                    to_email: toEmail,
                    subject,
                    email_html: htmlContent
                }
            })
        }
    );

    if (!response.ok) {
        const text = await response.text();

        throw new Error(
            `EmailJS failed (${response.status}): ${text}`
        );
    }

    return true;
}

async function sendCompanionBookedEmail() {
    if (companionNotificationSent) return;

    setEmailStatus(
        companionEmailStatus,
        "Sending premium booking confirmation… ✈️",
        "sending"
    );

    try {
        await sendViaEmailJs(
            PBA_COMPANION_NOTIFICATION_EMAIL,
            "PBA ✈️ Companion Booking Confirmed — Mokshith Sharma",
            buildCompanionBookedHtml()
        );

        companionNotificationSent = true;

        setEmailStatus(
            companionEmailStatus,
            "Premium booking email sent ✓",
            "success"
        );

    } catch (error) {

        console.error(
            "Companion notification email failed:",
            error
        );

        setEmailStatus(
            companionEmailStatus,
            "Booking saved. Email notification could not be delivered.",
            "error"
        );
    }
}

async function sendBoardingPassEmail(toEmail) {
    const recipient = String(toEmail || "").trim();

    if (!recipient || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
        setEmailStatus(
            boardingPassEmailStatus,
            "Please enter a valid email address.",
            "error"
        );
        boardingPassRecipientEmail?.focus();
        return;
    }

    if (sendBoardingPassEmailButton) {
        sendBoardingPassEmailButton.disabled = true;
    }

    setEmailStatus(
        boardingPassEmailStatus,
        "Sending premium boarding pass… ✈️",
        "sending"
    );

    try {
        await sendViaEmailJs(
            recipient,
            "PBA Boarding Pass ✈️ Tanya Arora — London & Japan",
            buildBoardingPassHtml()
        );

        setEmailStatus(
            boardingPassEmailStatus,
            `Boarding pass sent to ${recipient} ✓`,
            "success"
        );

        if (sendBoardingPassEmailButton) {
            sendBoardingPassEmailButton.textContent = "Sent ✓";
        }

    } catch (error) {
        console.error("Boarding pass email failed:", error);

        setEmailStatus(
            boardingPassEmailStatus,
            "Boarding-pass email could not be delivered. Please try again.",
            "error"
        );

        if (sendBoardingPassEmailButton) {
            sendBoardingPassEmailButton.disabled = false;
        }
    }
}



// COMPANION SELECTION
const bookMokshithButton = document.getElementById("bookMokshithButton");
const mokshithBookingMessage = document.getElementById("mokshithBookingMessage");
const dodgeBookButtons = document.querySelectorAll(".dodge-book-button");

const companionDodgeMessages = {
    justin: [
        "Tour schedule conflict. Try someone less famous. 🎤",
        "Belieber detected. Booking privileges temporarily suspended. 😌",
        "This companion has mysteriously left the departure gate. ✈️",
        "Booking denied: paparazzi exceed the baggage allowance. 📸",
        "Nice try. Punjabi Bagh Airways recommends the third option. 😂",
        "System note: Sorry married to Hailey Bieber."
    ],
    rio: [
        "Rio reviewed the itinerary and requested more treats first. 🦴",
        "Woof. Translation: choose Moksh. 🐾",
        "Booking failed — passenger lacks required snack clearance. 😌",
        "Rio moved the button. Chase responsibly. 😂",
        "I am too Good for you, please try someone else.🐶",
        "Travel request denied. Belly-rub documentation incomplete."
    ]
};

function randomCompanionMessage(companion) {
    const options = companionDodgeMessages[companion] || ["Booking unavailable. 😌"];
    return options[Math.floor(Math.random() * options.length)];
}

function moveDodgeButton(button) {
    const zone = button.closest(".companion-book-zone");
    const card = button.closest(".select-companion-profile");
    const message = card?.querySelector(".companion-book-message");
    const companion = button.dataset.dodgeCompanion;

    if (!zone) return;

    const zoneWidth = zone.clientWidth;
    const zoneHeight = zone.clientHeight;
    const buttonWidth = button.offsetWidth;
    const buttonHeight = button.offsetHeight;

    const maxX = Math.max(8, zoneWidth - buttonWidth - 8);
    const maxY = Math.max(8, zoneHeight - buttonHeight - 8);

    button.style.left = `${Math.random() * maxX}px`;
    button.style.top = `${Math.random() * maxY}px`;
    button.style.transform = "none";

    if (message) {
        message.textContent = randomCompanionMessage(companion);
    }

    card?.classList.remove("dodge-flash");
    void card?.offsetWidth;
    card?.classList.add("dodge-flash");
}

dodgeBookButtons.forEach(button => {
    button.addEventListener("mouseenter", () => moveDodgeButton(button));

    button.addEventListener("pointerdown", event => {
        if (event.pointerType !== "mouse") {
            event.preventDefault();
            moveDodgeButton(button);
        }
    });

    button.addEventListener("click", event => {
        event.preventDefault();
        moveDodgeButton(button);
    });
});

bookMokshithButton?.addEventListener("click", () => {
    if (!companionSelection || !agreement) return;

    bookMokshithButton.disabled = true;
    bookMokshithButton.textContent = "COMPANION BOOKED ✓";

    if (mokshithBookingMessage) {
        mokshithBookingMessage.textContent =
            "Booking confirmed. Terms & Conditions unlocked. ✈️";
    }

    document.querySelector('[data-companion="mokshith"]')
        ?.classList.add("companion-booked");

    // Notify Mokshith automatically, without interrupting Tanya's flow.
    void sendCompanionBookedEmail();

    fadeOut(companionSelection);

    setTimeout(() => {
        companionSelection.style.display = "none";
        agreement.classList.remove("hidden");
    }, 800);
});



sendBoardingPassEmailButton?.addEventListener("click", () => {
    sendBoardingPassEmail(boardingPassRecipientEmail?.value);
});

boardingPassRecipientEmail?.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        event.preventDefault();
        sendBoardingPassEmail(boardingPassRecipientEmail.value);
    }
});

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

// Lock only the finished travel portal to its initial boarding-pass height.
// The centred "Generating Boarding Pass" loader is intentionally untouched.
window.requestAnimationFrame(() => {
    const portalHeight = ticket.scrollHeight;

    if (portalHeight > 0) {
        ticket.style.setProperty("--portal-locked-height", `${portalHeight}px`);
        ticket.classList.add("portal-height-locked");
    }
});


setTimeout(()=>{


stamp.classList.remove("hidden");

countdownStatus?.classList.add("stamp-status-pulse");

window.setTimeout(() => {
    countdownStatus?.classList.remove("stamp-status-pulse");
}, 720);


},1650);



},3000);



}









function fadeOut(element){

element.classList.add("fade-out");

}

document.querySelectorAll(".lock-wheel").forEach((_, index) => {
    renderLockWheel(index);
});


// GALLERY
const galleryInput = document.getElementById("galleryInput");
const galleryUploadButton = document.getElementById("galleryUploadButton");
const galleryGrid = document.getElementById("galleryGrid");
const galleryEmptyMessage = document.getElementById("galleryEmptyMessage");

galleryUploadButton?.addEventListener("click", () => {
    galleryInput?.click();
});

galleryInput?.addEventListener("change", () => {
    const files = Array.from(galleryInput.files || []);

    files.forEach(file => {
        if (!file.type.startsWith("image/")) return;

        const reader = new FileReader();

        reader.addEventListener("load", () => {
            const figure = document.createElement("figure");
            figure.className = "gallery-item";

            const image = document.createElement("img");
            image.src = reader.result;
            image.alt = file.name || "Travel memory";

            const caption = document.createElement("figcaption");
            caption.textContent = file.name || "Travel memory";

            figure.append(image, caption);
            galleryGrid?.prepend(figure);

            if (galleryEmptyMessage) {
                galleryEmptyMessage.hidden = true;
            }
        });

        reader.readAsDataURL(file);
    });

    galleryInput.value = "";
});


// JOURNAL
const journalInput = document.getElementById("journalInput");
const journalAddButton = document.getElementById("journalAddButton");
const journalList = document.getElementById("journalList");
const journalEmptyMessage = document.getElementById("journalEmptyMessage");

function createJournalNote(text) {
    const article = document.createElement("article");
    article.className = "journal-note";

    const header = document.createElement("div");
    header.className = "journal-note-header";

    const title = document.createElement("strong");
    title.textContent = "Travel Note";

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "journal-remove-button";
    remove.textContent = "Remove";
    remove.addEventListener("click", () => {
        article.remove();

        if (
            journalList &&
            !journalList.querySelector(".journal-note") &&
            journalEmptyMessage
        ) {
            journalEmptyMessage.hidden = false;
        }
    });

    const content = document.createElement("p");
    content.textContent = text;

    header.append(title, remove);
    article.append(header, content);

    return article;
}

journalAddButton?.addEventListener("click", () => {
    const text = journalInput?.value.trim();

    if (!text || !journalList) return;

    journalList.prepend(createJournalNote(text));
    journalInput.value = "";

    if (journalEmptyMessage) {
        journalEmptyMessage.hidden = true;
    }
});

journalInput?.addEventListener("keydown", event => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        journalAddButton?.click();
    }
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


// SECURITY HINT: hover on desktop, tap/click on mobile
const hintTrigger = document.getElementById("hintTrigger");
const securityHint = document.getElementById("securityHint");

function setHintVisibility(isVisible) {
    if (!hintTrigger || !securityHint) return;

    hintTrigger.setAttribute("aria-expanded", String(isVisible));
    securityHint.setAttribute("aria-hidden", String(!isVisible));
    securityHint.classList.toggle("is-visible", isVisible);
}

if (hintTrigger && securityHint) {
    hintTrigger.addEventListener("click", event => {
        event.stopPropagation();
        const isOpen = hintTrigger.getAttribute("aria-expanded") === "true";
        setHintVisibility(!isOpen);
    });

    hintTrigger.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            setHintVisibility(false);
            hintTrigger.blur();
        }
    });

    document.addEventListener("click", event => {
        if (!event.target.closest(".hint-wrapper")) {
            setHintVisibility(false);
        }
    });
}

// BACKGROUND MUSIC CONTROLS
const backgroundMusic = document.getElementById("backgroundMusic");
const musicPlayButton = document.getElementById("musicPlayButton");
const musicMuteButton = document.getElementById("musicMuteButton");
const musicVolume = document.getElementById("musicVolume");
const musicStatus = document.getElementById("musicStatus");
const musicPlayer = document.getElementById("musicPlayer");
const musicPlayIcon = document.getElementById("musicPlayIcon");
const musicMuteIcon = document.getElementById("musicMuteIcon");

const musicIcons = {
    play: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8.6 5.9a1 1 0 0 1 1.54-.84l8.1 5.25a1 1 0 0 1 0 1.68l-8.1 5.25A1 1 0 0 1 8.6 16.4V5.9Z"/>
        </svg>`,
    pause: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="6.75" y="5" width="3.5" height="14" rx="1.2"/>
            <rect x="13.75" y="5" width="3.5" height="14" rx="1.2"/>
        </svg>`,
    volume: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4.5 9.25v5.5h3.4l4.35 3.5V5.75l-4.35 3.5H4.5Z"/>
            <path class="sound-wave" d="M15.2 8.25a5.25 5.25 0 0 1 0 7.5"/>
            <path class="sound-wave" d="M17.7 5.75a8.75 8.75 0 0 1 0 12.5"/>
        </svg>`,
    mute: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4.5 9.25v5.5h3.4l4.35 3.5V5.75l-4.35 3.5H4.5Z"/>
            <path class="sound-wave" d="m16.1 9.1 4.2 4.2m0-4.2-4.2 4.2"/>
        </svg>`
};

function setMusicIcon(element, iconName) {
    if (element) {
        element.innerHTML = musicIcons[iconName];
    }
}

function updateMusicControls() {
    if (
        !backgroundMusic ||
        !musicPlayButton ||
        !musicMuteButton ||
        !musicStatus ||
        !musicPlayer
    ) return;

    const isPlaying = !backgroundMusic.paused;
    const isMuted = backgroundMusic.muted || backgroundMusic.volume === 0;

    setMusicIcon(musicPlayIcon, isPlaying ? "pause" : "play");
    setMusicIcon(musicMuteIcon, isMuted ? "mute" : "volume");

    musicPlayButton.setAttribute(
        "aria-label",
        isPlaying ? "Pause background music" : "Play background music"
    );
    musicPlayButton.title =
        isPlaying ? "Pause background music" : "Play background music";

    musicMuteButton.setAttribute(
        "aria-label",
        isMuted ? "Unmute background music" : "Mute background music"
    );
    musicMuteButton.title =
        isMuted ? "Unmute background music" : "Mute background music";

    musicPlayer.classList.toggle("is-playing", isPlaying && !isMuted);
    musicPlayer.classList.toggle("is-muted", isMuted);

    if (!isPlaying) {
        musicStatus.textContent = "Music paused";
    } else if (isMuted) {
        musicStatus.textContent = "Music muted";
    } else {
        musicStatus.textContent =
            `Playing • ${Math.round(backgroundMusic.volume * 100)}%`;
    }
}

async function toggleBackgroundMusic() {
    if (!backgroundMusic) return;

    if (backgroundMusic.paused) {
        try {
            await backgroundMusic.play();
        } catch (error) {
            musicStatus.textContent = "Tap play to start music";
        }
    } else {
        backgroundMusic.pause();
    }

    updateMusicControls();
}

if (
    backgroundMusic &&
    musicPlayButton &&
    musicMuteButton &&
    musicVolume &&
    musicStatus
) {
    backgroundMusic.volume = Number(musicVolume.value) / 100;

    musicPlayButton.addEventListener("click", toggleBackgroundMusic);

    musicMuteButton.addEventListener("click", () => {
        backgroundMusic.muted = !backgroundMusic.muted;
        updateMusicControls();
    });

    musicVolume.addEventListener("input", () => {
        const selectedVolume = Number(musicVolume.value) / 100;
        backgroundMusic.volume = selectedVolume;

        if (selectedVolume > 0 && backgroundMusic.muted) {
            backgroundMusic.muted = false;
        }

        updateMusicControls();
    });

    backgroundMusic.addEventListener("play", updateMusicControls);
    backgroundMusic.addEventListener("pause", updateMusicControls);
    backgroundMusic.addEventListener("volumechange", updateMusicControls);
    backgroundMusic.addEventListener("error", () => {
        musicStatus.textContent = "Music file unavailable";
        musicPlayer.classList.remove("is-playing");
    });

    updateMusicControls();
}



// SIDE QUEST — LIVE GOOGLE PLACES GENERATOR
const generatePlaceButton = document.getElementById("generatePlaceButton");
const generateAnotherPlaceButton = document.getElementById("generateAnotherPlaceButton");
const placeGeneratorStatus = document.getElementById("placeGeneratorStatus");
const generatedPlaceCard = document.getElementById("generatedPlaceCard");
const generatedPlaceImage = document.getElementById("generatedPlaceImage");
const generatedPlaceDestination = document.getElementById("generatedPlaceDestination");
const generatedPlaceName = document.getElementById("generatedPlaceName");
const generatedPlaceRating = document.getElementById("generatedPlaceRating");
const generatedPlaceAddress = document.getElementById("generatedPlaceAddress");
const generatedPlaceDescription = document.getElementById("generatedPlaceDescription");
const generatedPlaceMapsLink = document.getElementById("generatedPlaceMapsLink");
const googlePlaceAttribution = document.getElementById("googlePlaceAttribution");
const placesSetupNote = document.getElementById("placesSetupNote");

const sideQuestSearches = {
    london: [
        "fun tourist attractions in London UK",
        "hidden gems to visit in London UK",
        "unique museums and experiences in London UK",
        "beautiful viewpoints and gardens in London UK",
        "Harry Potter attractions in London UK",
        "interesting markets and neighbourhoods in London UK"
    ],
    japan: [
        "fun tourist attractions in Tokyo Japan",
        "anime attractions in Tokyo Japan",
        "unique places to visit in Tokyo Japan",
        "beautiful temples and gardens in Tokyo Japan",
        "interesting neighbourhoods in Tokyo Japan",
        "scenic viewpoints and experiences in Tokyo Japan"
    ]
};

const destinationLabels = {
    london: "LONDON SIDE QUEST 🇬🇧",
    japan: "JAPAN SIDE QUEST 🇯🇵"
};

let lastGeneratedPlaceId = "";
let placesLibraryPromise = null;

function selectedSideQuestDestination() {
    return document.querySelector('input[name="sideQuestDestination"]:checked')?.value || "london";
}

function randomItem(items) {
    return items[Math.floor(Math.random() * items.length)];
}

function setPlaceGeneratorLoading(isLoading) {
    if (!generatePlaceButton) return;
    generatePlaceButton.disabled = isLoading;
    generatePlaceButton.textContent = isLoading ? "Searching Google Places..." : "Generate Adventure 🎲";
    if (generateAnotherPlaceButton) generateAnotherPlaceButton.disabled = isLoading;
}

async function getPlacesLibrary() {
    if (!window.google?.maps?.importLibrary) {
        throw new Error("Google Maps is not configured. Add your API key in index.html.");
    }
    if (!placesLibraryPromise) placesLibraryPromise = google.maps.importLibrary("places");
    return placesLibraryPromise;
}

function createAttributionNode(photo) {
    const wrapper = document.createElement("span");
    const attributions = photo?.authorAttributions || [];
    wrapper.append("Place data from Google Maps");
    if (attributions.length) {
        wrapper.append(" · Photo: ");
        attributions.forEach((attribution, index) => {
            if (index > 0) wrapper.append(", ");
            if (attribution.uri) {
                const link = document.createElement("a");
                link.href = attribution.uri;
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                link.textContent = attribution.displayName || "Contributor";
                wrapper.append(link);
            } else {
                wrapper.append(attribution.displayName || "Google Maps contributor");
            }
        });
    }
    return wrapper;
}

function renderGeneratedPlace(place, destination) {
    const photo = place.photos?.[0];
    const photoUrl = photo ? photo.getURI({ maxWidth: 1200, maxHeight: 800 }) : "";

    generatedPlaceName.textContent = place.displayName || "Mystery Adventure";
    generatedPlaceAddress.textContent = place.formattedAddress || "Address available on Google Maps.";
    generatedPlaceDestination.textContent = destinationLabels[destination];

    if (Number.isFinite(place.rating)) {
        const count = Number.isFinite(place.userRatingCount) ? ` · ${place.userRatingCount.toLocaleString()} reviews` : "";
        generatedPlaceRating.textContent = `★ ${place.rating.toFixed(1)}${count}`;
        generatedPlaceRating.hidden = false;
    } else {
        generatedPlaceRating.hidden = true;
    }

    const typeName = place.primaryTypeDisplayName || "travel destination";
    generatedPlaceDescription.textContent =
        `Punjabi Bagh Airways has selected this ${typeName.toLowerCase()} as your next spontaneous adventure. ` +
        `Explore it, take too many photos, and pretend the detour was always part of the itinerary.`;

    if (photoUrl) {
        generatedPlaceImage.src = photoUrl;
        generatedPlaceImage.alt = `${place.displayName || "Generated destination"} from Google Places`;
        generatedPlaceImage.hidden = false;
    } else {
        generatedPlaceImage.removeAttribute("src");
        generatedPlaceImage.alt = "";
        generatedPlaceImage.hidden = true;
    }

    generatedPlaceMapsLink.href = place.googleMapsURI ||
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.displayName || place.formattedAddress || "")}`;

    googlePlaceAttribution.replaceChildren(createAttributionNode(photo));
    generatedPlaceCard.classList.remove("hidden");
    placesSetupNote?.classList.add("is-configured");
    generatedPlaceCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

async function generateRandomGooglePlace() {
    if (!generatePlaceButton || !placeGeneratorStatus || !generatedPlaceCard) return;

    const destination = selectedSideQuestDestination();
    const query = randomItem(sideQuestSearches[destination]);

    setPlaceGeneratorLoading(true);
    placeGeneratorStatus.textContent = `Searching Google for a fun ${destination === "london" ? "London" : "Japan"} side quest...`;

    try {
        const { Place } = await getPlacesLibrary();
        const { places } = await Place.searchByText({
            textQuery: query,
            fields: ["id", "displayName", "formattedAddress", "rating", "userRatingCount", "photos", "googleMapsURI", "primaryTypeDisplayName"],
            maxResultCount: 12,
            minRating: 4,
            language: "en",
            region: destination === "london" ? "gb" : "jp"
        });

        const usablePlaces = places.filter(place => place.displayName && place.photos?.length && place.id !== lastGeneratedPlaceId);
        const fallbackPlaces = places.filter(place => place.displayName && place.photos?.length);
        const selectedPlace = randomItem(usablePlaces.length ? usablePlaces : fallbackPlaces);

        if (!selectedPlace) throw new Error("Google did not return a place with an available photo.");

        lastGeneratedPlaceId = selectedPlace.id || "";
        renderGeneratedPlace(selectedPlace, destination);
        placeGeneratorStatus.textContent = "Side quest assigned. Not following it is technically allowed... but discouraged. 😄";
    } catch (error) {
        console.error("Side quest generator error:", error);
        generatedPlaceCard.classList.add("hidden");
        const message = String(error?.message || "");
        if (message.includes("API key") || message.includes("not configured") || message.includes("could not load")) {
            placeGeneratorStatus.textContent = "Google Places is not configured yet. Add your restricted API key in index.html.";
        } else {
            placeGeneratorStatus.textContent = "The travel generator could not find a place right now. Please try again.";
        }
    } finally {
        setPlaceGeneratorLoading(false);
    }
}

generatePlaceButton?.addEventListener("click", generateRandomGooglePlace);
generateAnotherPlaceButton?.addEventListener("click", generateRandomGooglePlace);
