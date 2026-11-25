
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
                    You will participate in a brief virtual meeting with other participants.
                </p>

                <p>
                    Please remain connected until the meeting concludes.
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

    // Record the exact meeting start time.
    const meetingStartTime = Date.now();


    screen.innerHTML = `
        <div class="meeting-interface">

            <!-- TOP BAR -->

            <div class="top-ui">
                Virtual Meeting Room
            </div>


            <!-- VIDEO GRID -->

            <div class="meeting-room">

                <!-- UPPER LEFT: C4_P1
                     Starts immediately.
                     Appears at 15 seconds. -->

                <div
                    class="video-box"
                    id="upperLeftBox"
                    style="visibility: hidden;">

                    <video
                        id="upperLeftVideo"
                        autoplay
                        loop
                        muted
                        playsinline
                        preload="auto">
                    </video>

                    <div
                        class="mic-overlay"
                        id="upperLeftMic"
                        style="display: none;">

                        <img
                            src="mic-muted.svg"
                            alt="Microphone muted">

                    </div>

                </div>


                <!-- UPPER RIGHT: C4_P3
                     Starts and appears immediately. -->

                <div class="video-box">

                    <video
                        id="upperRightVideo"
                        autoplay
                        loop
                        playsinline
                        preload="auto">
                    </video>

                    <div class="mic-overlay" id="speakerMic">

                        <img
                            src="mic-muted.svg"
                            id="speakerMicIcon"
                            alt="Microphone muted">

                    </div>

                </div>


                <!-- BOTTOM LEFT: C4_P2
                     Starts immediately.
                     Appears at 8 seconds. -->

                <div
                    class="video-box"
                    id="bottomLeftBox"
                    style="visibility: hidden;">

                    <video
                        id="bottomLeftVideo"
                        autoplay
                        loop
                        muted
                        playsinline
                        preload="auto">
                    </video>

                    <div
                        class="mic-overlay"
                        id="bottomLeftMic"
                        style="display: none;">

                        <img
                            src="mic-muted.svg"
                            alt="Microphone muted">

                    </div>

                </div>


                <!-- PARTICIPANT'S LIVE CAMERA FEED -->

                <div class="video-box">

                    <video
                        id="selfVideo"
                        autoplay
                        muted
                        playsinline>
                    </video>

                    <!-- PARTICIPANT'S MICROPHONE STATUS -->

                    <div class="mic-overlay">

                        <img
                            src="mic-muted.svg"
                            id="selfMicIcon"
                            alt="Microphone muted">

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

                    <span id="participantCount">Participants (2)</span>

                </div>

            </div>

        </div>
    `;


    /* =========================
       VIDEO PLAYBACK
       ALL VIDEOS START AT 0
    ========================= */


    // C4_P3: UPPER RIGHT
    // Starts immediately.
    // Actual audio is UNMUTED throughout.

    const upperRightVideo =
        document.getElementById("upperRightVideo");

    upperRightVideo.src = "C4_P3.mp4";
    upperRightVideo.muted = false;
    upperRightVideo.load();


    // C4_P2: BOTTOM LEFT
    // Starts immediately.
    // Actual audio is muted.
    // Tile appears at 8 seconds.

    const bottomLeftVideo =
        document.getElementById("bottomLeftVideo");

    const bottomLeftBox =
        document.getElementById("bottomLeftBox");

    const bottomLeftMic =
        document.getElementById("bottomLeftMic");

    bottomLeftVideo.src = "C4_P2.mp4";
    bottomLeftVideo.muted = true;
    bottomLeftVideo.load();


    // C4_P1: UPPER LEFT
    // Starts immediately.
    // Actual audio is muted.
    // Tile appears at 15 seconds.

    const upperLeftVideo =
        document.getElementById("upperLeftVideo");

    const upperLeftBox =
        document.getElementById("upperLeftBox");

    const upperLeftMic =
        document.getElementById("upperLeftMic");

    upperLeftVideo.src = "C4_P1.mp4";
    upperLeftVideo.muted = true;
    upperLeftVideo.load();


    // Start all three videos together rather than
    // waiting until their respective tiles appear.

    const videoPlaybackPromises = [
        upperRightVideo.play(),
        bottomLeftVideo.play(),
        upperLeftVideo.play()
    ];

    videoPlaybackPromises.forEach((promise, index) => {

        promise.catch(error => {
            console.error(
                "Confederate video playback error:",
                index,
                error
            );
        });

    });


    /* =========================
       VIDEO TILE VISIBILITY
       AND PARTICIPANT COUNT
    ========================= */


    // C4_P2 appears at 8 seconds.
    // Participant count increases to 3.

    setTimeout(() => {

        const participantCount =
            document.getElementById("participantCount");

        if (participantCount) {
            participantCount.innerText = "Participants (3)";
        }

        if (bottomLeftBox) {
            bottomLeftBox.style.visibility = "visible";
        }

        if (bottomLeftMic) {
            bottomLeftMic.style.display = "flex";
        }

    }, 8000);


    // C4_P1 appears at 15 seconds.
    // Participant count increases to 4.

    setTimeout(() => {

        const participantCount =
            document.getElementById("participantCount");

        if (participantCount) {
            participantCount.innerText = "Participants (4)";
        }

        if (upperLeftBox) {
            upperLeftBox.style.visibility = "visible";
        }

        if (upperLeftMic) {
            upperLeftMic.style.display = "flex";
        }

    }, 15000);


    /* =========================
       MEETING MICROPHONE
       PARTICIPANT CONTROLS
    ========================= */

    const muteButton =
        document.getElementById("muteButton");

    const muteIcon =
        document.getElementById("muteIcon");

    const muteText =
        document.getElementById("muteText");

    const selfVideo =
        document.getElementById("selfVideo");

    const selfMicIcon =
        document.getElementById("selfMicIcon");


    // Reuse the camera and microphone stream
    // granted during Device Check.

    if (selfVideo && userStream) {
        selfVideo.srcObject = userStream;
    }


    const audioTracks = userStream
        ? userStream.getAudioTracks()
        : [];


    function updateMeetingMicUI() {

        if (isMicMuted) {

            muteIcon.src = "mic-muted.svg";
            muteIcon.alt = "Microphone muted";
            muteText.innerText = "Unmute";

            if (selfMicIcon) {
                selfMicIcon.src = "mic-muted.svg";
                selfMicIcon.alt = "Microphone muted";
            }

        } else {

            muteIcon.src = "mic.svg";
            muteIcon.alt = "Microphone on";
            muteText.innerText = "Mute";

            if (selfMicIcon) {
                selfMicIcon.src = "mic.svg";
                selfMicIcon.alt = "Microphone on";
            }

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
       C4_P3 SPEAKER MICROPHONE
       ICON TIMING
    ========================= */

    const speakerMicIcon =
        document.getElementById("speakerMicIcon");


    // 0–54 seconds:
    // Microphone icon remains MUTED.

    speakerMicIcon.src = "mic-muted.svg";
    speakerMicIcon.alt = "Microphone muted";


    // At 55 seconds:
    // Change icon to UNMUTED.

    setTimeout(() => {

        if (speakerMicIcon) {

            speakerMicIcon.src = "mic.svg";
            speakerMicIcon.alt = "Microphone on";

        }

    }, 55000);


    // At 64 seconds:
    // Change icon back to MUTED.

    setTimeout(() => {

        if (speakerMicIcon) {

            speakerMicIcon.src = "mic-muted.svg";
            speakerMicIcon.alt = "Microphone muted";

        }

    }, 64000);


    /* =========================
       MEETING END
       80 SECONDS
    ========================= */

    const elapsedTime = Date.now() - meetingStartTime;

    const remainingTime = Math.max(
        0,
        80000 - elapsedTime
    );


    setTimeout(() => {

        renderMeetingCompletePage();

    }, remainingTime);

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

        const urlParameters =
            new URLSearchParams(window.location.search);

        const condition =
            urlParameters.get("Condition");


        // Survey 2 URL

        const surveyTwoURL =
            "https://mtroyal.ca1.qualtrics.com/jfe/form/SV_eeYZBrtYNYWNx1c";


        // Make sure the condition was successfully received

        if (!condition) {

            alert(
                "Your study condition could not be retrieved. Please contact the researcher."
            );

            return;

        }


        // Add the condition to the Survey 2 URL

        const separator =
            surveyTwoURL.includes("?") ? "&" : "?";

        window.location.href =
            surveyTwoURL +
            separator +
            "Condition=" +
            encodeURIComponent(condition);

    };

}


/* =========================
   INITIAL PAGE
========================= */

renderIntro();

