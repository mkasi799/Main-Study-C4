
const screen = document.getElementById("screen");

let userStream = null;
let isMicMuted = false;


/* =========================
   LOGO
========================= */

function addLogo() {
    return `
        <img
            id="logo"
            src="mru-logo.png"
            alt="Mount Royal University logo">
    `;
}


/* =========================
   INTRO SUMMARY
========================= */

function renderIntro() {

    screen.innerHTML = `
        ${addLogo()}

        <div class="center">

            <div class="intro-text">
                <p>
                    You will participate in a brief virtual meeting with other participants. During the meeting, your self-view will be hidden to reduce distractions and standardize the participant experience.
                </p>

                <p>
                    Although you will not be able to see your own video feed, your camera will remain on throughout the interaction, and your video will be visible to the other participants. Likewise, you will be able to see other participants. Please remain connected until the meeting concludes.
                </p>
            </div>

            <button id="proceedBtn">Proceed</button>

        </div>
    `;

    document.getElementById("proceedBtn").onclick = renderDeviceCheck;
}


/* =========================
   CAMERA / MICROPHONE CHECK
========================= */

async function renderDeviceCheck() {

    screen.innerHTML = `
        ${addLogo()}

        <div class="device-check">

            <h1>Device Check</h1>

            <video
                id="previewVideo"
                class="device-preview"
                autoplay
                muted
                playsinline>
            </video>


            <div class="device-check-controls">

                <!-- MICROPHONE CONTROL -->

                <div class="device-check-control">

                    <button
                        type="button"
                        id="deviceMicButton"
                        class="device-check-icon-button"
                        aria-label="Mute microphone">

                        <img
                            src="mic.svg"
                            id="deviceMicIcon"
                            alt="">
                    </button>

                    <div
                        id="deviceMicText"
                        class="device-check-control-label">
                        Microphone on
                    </div>

                    <div
                        id="deviceMicHelper"
                        class="device-check-helper">
                        Click to mute
                    </div>

                </div>


                <!-- CAMERA ICON -->

                <div class="device-check-control">

                    <div
                        class="device-check-camera-icon"
                        aria-hidden="true">

                        <img
                            src="video.svg"
                            alt="">
                    </div>

                    <div class="device-check-control-label">
                        Camera on
                    </div>

                    <div class="device-check-helper">
                        Camera must remain on
                    </div>

                </div>

            </div>


            <div class="device-instructions">
                <p>
                    For this study, you must have your camera on. You will have no option to turn it off during the study. Please make sure your camera is on before proceeding.
                </p>
            </div>


            <button id="joinBtn" disabled>Join Meeting</button>

            <p id="cameraStatus" class="camera-status">
                Please allow access to your camera.
            </p>

        </div>
    `;


    const previewVideo = document.getElementById("previewVideo");
    const joinBtn = document.getElementById("joinBtn");
    const cameraStatus = document.getElementById("cameraStatus");

    const deviceMicButton = document.getElementById("deviceMicButton");
    const deviceMicIcon = document.getElementById("deviceMicIcon");
    const deviceMicText = document.getElementById("deviceMicText");
    const deviceMicHelper = document.getElementById("deviceMicHelper");


    /* Request camera and microphone access */

    try {

        try {

            userStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

        } catch (audioVideoError) {

            userStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
            });

        }


        previewVideo.srcObject = userStream;

        const audioTracks = userStream.getAudioTracks();

        isMicMuted = false;

        audioTracks.forEach(track => {
            track.enabled = true;
        });


        if (audioTracks.length === 0) {

            deviceMicButton.disabled = true;
            deviceMicButton.style.cursor = "not-allowed";
            deviceMicButton.style.opacity = "0.5";

            deviceMicText.innerText = "Microphone unavailable";
            deviceMicHelper.innerText = "No microphone detected";

            deviceMicButton.setAttribute(
                "aria-label",
                "Microphone unavailable"
            );

        }


        cameraStatus.innerText = "Camera ready.";
        joinBtn.disabled = false;


    } catch (error) {

        console.error("Camera access error:", error);

        cameraStatus.innerText =
            "Camera access is required for this study. Please allow camera access and try again.";

        joinBtn.disabled = true;

    }


    /* =========================
       DEVICE-CHECK MIC TOGGLE
    ========================= */

    deviceMicButton.onclick = () => {

        const audioTracks = userStream
            ? userStream.getAudioTracks()
            : [];

        if (audioTracks.length === 0) {
            return;
        }

        isMicMuted = !isMicMuted;

        audioTracks.forEach(track => {
            track.enabled = !isMicMuted;
        });


        if (isMicMuted) {

            deviceMicIcon.src = "mic-muted.svg";
            deviceMicText.innerText = "Microphone off";
            deviceMicHelper.innerText = "Click to unmute";

            deviceMicButton.setAttribute(
                "aria-label",
                "Unmute microphone"
            );

        } else {

            deviceMicIcon.src = "mic.svg";
            deviceMicText.innerText = "Microphone on";
            deviceMicHelper.innerText = "Click to mute";

            deviceMicButton.setAttribute(
                "aria-label",
                "Mute microphone"
            );

        }

    };


    /* Join meeting */

    joinBtn.onclick = () => {

        if (!userStream) {
            return;
        }

        startStudy();

    };

}


/* =========================
   MEETING
========================= */

function startStudy() {

    screen.innerHTML = `
        <div class="meeting-interface">

            <!-- TOP BAR -->

            <div class="top-ui">
                Virtual Meeting Room
            </div>


            <!-- VIDEO GRID -->

            <div class="meeting-room">

                <div class="video-box">

                    <video autoplay loop muted playsinline preload="auto">
                        <source src="p1.mp4" type="video/mp4">
                    </video>

                    <div class="mic-overlay">
                        <img src="mic-muted.svg" alt="Microphone muted">
                    </div>

                </div>


                <div class="video-box">

                    <video autoplay loop muted playsinline preload="auto">
                        <source src="control_clip.mp4" type="video/mp4">
                    </video>

                    <div class="mic-overlay" id="speakerMic">
                        <img src="mic-muted.svg" alt="Microphone muted">
                    </div>

                </div>


                <div class="video-box">

                    <video autoplay loop muted playsinline preload="auto">
                        <source src="p3.mp4" type="video/mp4">
                    </video>

                    <div class="mic-overlay">
                        <img src="mic-muted.svg" alt="Microphone muted">
                    </div>

                </div>


                <div class="video-box">

                    <video autoplay loop muted playsinline preload="auto">
                        <source src="p4.mp4" type="video/mp4">
                    </video>

                    <div class="mic-overlay">
                        <img src="mic-muted.svg" alt="Microphone muted">
                    </div>

                </div>

            </div>


            <!-- BOTTOM BAR -->

            <div class="bottom-ui">

                <div class="control" id="muteButton">

                    <img
                        src="mic-muted.svg"
                        class="icon"
                        id="muteIcon"
                        alt="Microphone muted">

                    <span id="muteText">Mute</span>

                </div>


                <div class="control">

                    <img
                        src="users.svg"
                        class="icon"
                        alt="Participants">

                    <span>Participants (5)</span>

                </div>

            </div>

        </div>
    `;


    /* =========================
       MEETING MICROPHONE
       Preserve device-check choice
    ========================= */

    const muteButton = document.getElementById("muteButton");
    const muteIcon = document.getElementById("muteIcon");
    const muteText = document.getElementById("muteText");

    const audioTracks = userStream
        ? userStream.getAudioTracks()
        : [];


    function updateMeetingMicUI() {

        if (isMicMuted) {

            muteIcon.src = "mic-muted.svg";
            muteIcon.alt = "Microphone muted";
            muteText.innerText = "Unmute";

        } else {

            muteIcon.src = "mic.svg";
            muteIcon.alt = "Microphone on";
            muteText.innerText = "Mute";

        }

    }


    updateMeetingMicUI();


    muteButton.onclick = () => {

        isMicMuted = !isMicMuted;

        audioTracks.forEach(track => {
            track.enabled = !isMicMuted;
        });

        updateMeetingMicUI();

    };


    /* =========================
       SPEAKER MICROPHONE TIMING
    ========================= */

    // Hide speaker microphone at 40 seconds

    setTimeout(() => {

        const speakerMic = document.getElementById("speakerMic");

        if (speakerMic) {
            speakerMic.style.display = "none";
        }

    }, 40000);


    // Show speaker microphone again at 55 seconds
    // Use flex to keep the icon centered

    setTimeout(() => {

        const speakerMic = document.getElementById("speakerMic");

        if (speakerMic) {
            speakerMic.style.display = "flex";
        }

    }, 55000);


    /* =========================
       MEETING END
       Separate page appears at
       57 seconds.
    ========================= */

    setTimeout(() => {

        renderMeetingCompletePage();

    }, 57000);

}


/* =========================
   MEETING COMPLETE PAGE
========================= */

function renderMeetingCompletePage() {

    screen.innerHTML = `
        <div class="meeting-complete-page">

            <div class="meeting-complete-message">

                <h2>The meeting portion is complete</h2>

                <p>
                    Please click the button below to answer the first set of questions.
                </p>

                <button id="continueBtn">
                    Continue to questionnaire
                </button>

            </div>

        </div>
    `;


    document.getElementById("continueBtn").onclick = () => {

        // Get the condition assigned by Qualtrics
        const urlParameters = new URLSearchParams(window.location.search);
        const condition = urlParameters.get("Condition");

        // Survey 2 URL - replace this with your actual Qualtrics link
        const surveyTwoURL = "https://mtroyal.ca1.qualtrics.com/jfe/form/SV_eeYZBrtYNYWNx1c";

        // Make sure the condition was successfully received
        if (!condition) {
            alert("Your study condition could not be retrieved. Please contact the researcher.");
            return;
        }

        // Add the condition to the Survey 2 URL
        const separator = surveyTwoURL.includes("?") ? "&" : "?";

        window.location.href =
            surveyTwoURL + separator + "Condition=" + encodeURIComponent(condition);

    };

}


/* =========================
   INITIAL PAGE
========================= */

renderIntro();
