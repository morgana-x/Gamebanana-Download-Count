
var itemTypes = {
    "tools":"Tool",
    "mods":"Mod",
    "sounds":"Sound"
}
var fixedPanelIndex = [];
function getItemType(url)
{
    var keys = Object.keys(itemTypes);
    var foundKey = null;
    keys.forEach((key) =>{
        if (!url.includes(key)) return;
        foundKey = key;
    });
    return itemTypes[foundKey];
}

function addDownloads(panel, statsCluster)
{
    var itemUrl = panel.getElementsByClassName("Identifiers Cluster")[0].getElementsByClassName("Name")[0].getAttribute("href"); //getAttribute("data-cat-url");
        
    var itemType = getItemType(itemUrl);
    if (itemType == null) return;
    var itemId = itemUrl.substring(itemUrl.lastIndexOf("/")+1, itemUrl.length);

    var downloadQueryUrl = "https://gamebanana.com/apiv11/" + itemType + "/" + itemId + "/DownloadPage";
    console.log(downloadQueryUrl)

    var xhr = new XMLHttpRequest();
    xhr.open('GET', downloadQueryUrl, true);

    xhr.onreadystatechange  = ()=> {
        if (!( xhr.readyState === 4)) return;
        var response = JSON.parse(xhr.responseText);
        if (response == null) return
        if (!response["_aFiles"]) return
        if (!response["_aFiles"][0]) return;

        var downloadCount = 0;
        response["_aFiles"].forEach((f) => {downloadCount += f["_nDownloadCount"]});
        if (downloadCount == 0) return;

        statsCluster.innerHTML += `<span>
        <spriteicon class="MiscIcon SmallManualDownloadIcon"></spriteicon>
        <itemcount>` + downloadCount + `</itemcount>
        </span>`;
    };
    xhr.send();
}
function checkLikePanels()
{
    var likePanels = document.getElementsByClassName("MiscIcon SubscribeIcon");
    
    for (var i=0; i<likePanels.length;i++)
    {
        if (fixedPanels.includes(i)) continue;
        console.log("Found new panel!");
        fixedPanels.push(i);
        var element = likePanels[i];

        var parent = element.parentElement.parentElement.parentElement; // span->span cluster div
        var panel = element.parentElement.parentElement;
        addDownloads(parent,panel);
    };
}

function checkLikePanelExists()
{
    if (document.getElementsByClassName("MiscIcon SubscribeIcon").length == 0)
        return;
    checkLikePanels();
}
setInterval(checkLikePanelExists, 5000);