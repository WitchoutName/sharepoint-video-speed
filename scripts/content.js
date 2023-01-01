const speedMenuHtml = `<div class="menu-base">
<div class="menu-list">
    </div>
</div>`

const speedItemHtml = (number)=>`<div class="menu-item">
<div class="menu-item-icon"><svg fill="currentColor" class="speedTick" aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M14.05 3.49c.28.3.27.77-.04 1.06l-7.93 7.47A.85.85 0 014.9 12L2.22 9.28a.75.75 0 111.06-1.06l2.24 2.27 7.47-7.04a.75.75 0 011.06.04z" fill="currentColor"></path></svg></div>
<div>${number}</div>
</div>`

const speedOptions = [
    0.25,
    0.5,
    0.75,
    1,
    1.25,
    1.5,
    1.75,
    2,
    3,
    4,
    8,
    16
]

const setupVideo = (video)=>{
    const menubar = $("div.playback-experience-controls-container > div > div");
    menubar.children()[2].after(document.createElement("div"));
    menubarPlayItem = $(menubar.children()[3])
    menubarPlayItem.attr("class", "menubar-item");
    
    menubarPlayItem.append("<button class='menubar-item-button' title='Speed'><img id='speed-icon' /></button>")
    $("#speed-icon").attr("src", chrome.runtime.getURL("images/speed.png"))

    menubarPlayItem.append(speedMenuHtml);
    speedMenu = $(menubarPlayItem.children()[1])
    speedMenu.hide();
    // $("body").click()

    speedOptions.forEach(o => {
        speedMenu.append(speedItemHtml(o));
        let item = $(speedMenu.children()[speedMenu.children().length-1])
        
        if(o != 1) item.find(".speedTick").hide();

        item.click(()=>{
            video[0].playbackRate = o;
            $(".speedTick").hide();
            item.find(".speedTick").show();
        })
    })

    menubarPlayItem.on("click", ()=>{
        speedMenu.toggle()
    })

    $(document).on("click", function(e) { 
        if($(speedMenu).is(":visible" && e.currentTarget != menubarPlayItem)) {
            speedMenu.hide()
        }
    });
}


$(()=>{
    let video = null;
    let looking = false;
    let time = 0;
    const timeoutTime = 10 * 10000;

    const findVideo = ()=>{
        if(!looking){
            looking = true;
            console.log("looking for a video...", looking)
            const getVideoInterval = setInterval(function(){
                if(time >= timeoutTime){
                    looking = false;
                    console.log("timeout...", looking)
                    clearInterval(getVideoInterval);
                    return;
                }
                
                video = $('video');
                if (video && video.length){
                    looking = false;
                    console.log("video found", looking)
                    clearInterval(getVideoInterval);
                    video.on("play", function(){
                        video.unbind("play");
                        time = 0;
                        setupVideo(video);
                    })
                }
                
                time += 200;
            }, 200)
        }
    }
    console.log($("button[role='link']"))
    $("button[role='link']").on("click", ()=>{findVideo()});
    
    findVideo();
        
    
})