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

    document.body.classList.remove("cinematic-intro-active");
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

window.addEventListener(
    "load",
    beginCinematicSequence,
    { once: true }
);


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

window.addEventListener(
    "load",
    startCinematicStatusMessages,
    { once: true }
);

cinematicSkip?.addEventListener("click", () => {
    clearInterval(cinematicStatusTimer);
});


// TRIP COUNTDOWN
// Change this one value later if the confirmed departure date changes.
const tripDepartureTime =
    new Date("2026-11-09T09:00:00+05:30").getTime();

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
