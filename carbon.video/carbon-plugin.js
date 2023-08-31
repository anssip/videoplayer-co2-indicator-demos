
class CarbonVideoPlugin {
    // TODO: refactor to an options object as constructor arg. Should have the option to pass in the video object or the video id
    constructor({ containerId, video, videoId, indicatorId, carbonVideoId }) {
        this.containerId = containerId;
        if (videoId) {
            this.video = document.getElementById(videoId);
        } else if (video) {
            this.video = video;
        } else {
            throw new Error("Must pass in either video or videoId");
        }

        this.carbonVideoId = carbonVideoId;
        this.indicator = document.getElementById(indicatorId);
        this.overlayShowing = false;
        const overlayContainer = document.getElementById('overlay-content');
        const overlayInnerContainer = document.getElementById('overlay-inner-content');

        const closeOverlayButton = document.getElementById('close-overlay');

        // Open the overlay when the carbon indicator is clicked
        this.indicator.addEventListener('click', (e) => {
            this.overlayShowing = ! this.overlayShowing;
            overlayContainer.style.display = this.overlayShowing ? 'flex' : 'none';
            e.preventDefault();
            e.stopPropagation();
        });

        // Close the overlay when the close button is clicked
        closeOverlayButton.addEventListener('click', () => {
            overlayContainer.style.display = 'none';
        });

        document.addEventListener('click', (event) => {
            console.log("click");
            if (event.target !== overlayInnerContainer) {
                overlayContainer.style.display = 'none';
                this.overlayShowing = false;
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                overlayContainer.style.display = 'none';
                this.overlayShowing = false;
            }
        });

        // hide the indicator initially
        this.indicator.classList.add('hidden');
        overlayContainer.style.display = 'none';

        this.video.addEventListener('playing', () => this.init());
    }

    setCarbonVideoId(carbonVideoId) {
        this.carbonVideoId = carbonVideoId;
    }

    initCarbonIndicatorAutohide() {
        const showIndicator = () => {
            console.log("showIndicator");
            this.indicator.classList.remove('fade-out', 'hidden'); // Show the indicator
            clearTimeout(this.fadeOutTimer); // Clear any existing timer

            // Set a new timer to fade out after 3 seconds
            this.fadeOutTimer = setTimeout(() => {
                if (this.overlayShowing) {
                    return;
                }
                this.indicator.classList.add('fade-out');
            }, 3000);
        };

        // Show the indicator when the video or controls are interacted with
        const elem = this.containerId ? document.getElementById(this.containerId) : this.video;
        console.log("adding listeners", elem);
        elem.addEventListener('mousemove', showIndicator);
        elem.addEventListener('touchstart', showIndicator);
        elem.addEventListener('focus', showIndicator);
        elem.addEventListener('controlsshown', showIndicator);

        showIndicator();
    }
    async init() {
        console.log("init")

        // Initially hide the indicator
        this.indicator.classList.add('fade-out');

        // Call the API to get carbon cost data
        const apiURL = `http://ec2-13-48-55-83.eu-north-1.compute.amazonaws.com:8000/energy/${this.carbonVideoId}`;
        const response = await fetch(apiURL);
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        const data = await response.json();
        const energy = data.usage_in_watts;
        const normalizedEnergy = energy / (video.duration / 60);
        console.log("duration", video.duration);
        console.log("energy", energy);
        console.log("normalizedEnergy", normalizedEnergy);

        // Update the indicator color based on weighted average
        if (energy > 70) {
            this.indicator.style.backgroundColor = 'red';
        } else if (energy >= 40 && energy <= 70) {
            this.indicator.style.backgroundColor = 'orange';
        } else {
            this.indicator.style.backgroundColor = 'green';
        }
        this.initCarbonIndicatorAutohide();
    }
}