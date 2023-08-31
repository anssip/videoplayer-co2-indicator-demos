// TODO: wrap variables in a closure
let video;
let plugin;

async function initApp() {
    console.log("initApp")

    video = await flowplayer('#player',
        {
            token: "eyJraWQiOiJUWEJ4aWFSdlVwS1QiLCJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJjIjoie1wiYWNsXCI6NCxcImlkXCI6XCJUWEJ4aWFSdlVwS1RcIn0iLCJpc3MiOiJGbG93cGxheWVyIn0.yl6jwRUCMfy2vbnk_uCt3Li8P_57AAz9EMAng0gN0QLcIorvyg--AhrAxLeg6vHVHCoszAchAahIlsSCk2_NPA",
            src: "//edge.flowplayer.org/bauhaus.mp4"
        })
    console.log("video", video)

    const playlistLinks = document.querySelectorAll('#playlist a');
    playlistLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent the default link behavior
            const videoUrl = link.getAttribute('href');
            const carbonId = link.getAttribute('data-carbon-id');
            play(videoUrl, carbonId); // Call the global play function with the video URL
        });
    });
    console.log("video", video)
    plugin = new CarbonVideoPlugin({containerId: 'player', video, indicatorId: 'carbon-indicator', carbonVideoId: "66734506-46b4-456b-b8e8-87b42edcd0c6"});
    video.addEventListener('ready', (e, api, video) => {
        console.log("ready", e, api, video)
    });
}

function play(url, carbonId) {
    video.setSrc(url);
    plugin.setCarbonVideoId(carbonId);
    video.togglePlay(true);
}

document.addEventListener('DOMContentLoaded', initApp);