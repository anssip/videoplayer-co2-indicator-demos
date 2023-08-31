// TODO: wrap variables in a closure
let player;
let plugin;

function initApp() {
    console.log("initApp")
    // Install built-in polyfills to patch browser incompatibilities.
    shaka.polyfill.installAll();

    const playlistLinks = document.querySelectorAll('#playlist a');
    playlistLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent the default link behavior
            const videoUrl = link.getAttribute('href');
            const carbonId = link.getAttribute('data-carbon-id');
            play(videoUrl, carbonId); // Call the global play function with the video URL
        });
    });

    // Check to see if the browser supports the basic APIs Shaka needs.
    if (shaka.Player.isBrowserSupported()) {
        // Everything looks good!
        initPlayer().then(() => console.log("player initialized"));
    } else {
        // This browser does not have the minimum set of APIs we need.
        console.error('Browser not supported!');
    }
}

async function initPlayer() {
    console.log("initPlayer")
    player = new shaka.Player();
    player.addEventListener('error', onErrorEvent);

    plugin = new CarbonVideoPlugin({videoId: 'video', indicatorId: 'carbon-indicator'});
    play("https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd", "66734506-46b4-456b-b8e8-87b42edcd0c6");
}

function play(url, carbonId) {
    const video = document.getElementById('video');
    player.attach(video);
    plugin.setCarbonVideoId(carbonId);
    console.log("play", url)
    player.load(url);
}

function onErrorEvent(event) {
    console.error('onErrorEvent', event)
    // Extract the shaka.util.Error object from the event.
    onError(event.detail);
}

function onError(error) {
    console.error('onError', error)
    // Log the error.
    console.error('Error code', error.code, 'object', error);
}

document.addEventListener('DOMContentLoaded', initApp);