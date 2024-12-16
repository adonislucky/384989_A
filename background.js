let clickCount = 0;
let audio = null;

chrome.storage.local.get(["clickCount"], function (result) {
  clickCount = result.clickCount ? result.clickCount : 0;
  console.log("Value currently is " + clickCount);
});

function playMp3() {
  chrome.storage.local.get(["audioPath"], function (result) {
    let audioPath = result.audioPath ? result.audioPath : null;
    if (audioPath) {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }

      audio = new Audio(audioPath);
      audio.play();
    } else {
      alert("Please set an audio path in the popup.");
    }
  });
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === "complete") {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      function: () => {
        document.addEventListener("click", function () {
          chrome.runtime.sendMessage({ type: "clicked" });
        });
      },
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "clicked") {
    clickCount++;
    chrome.storage.local.set({ clickCount: clickCount });
    if (clickCount >= 10) {
      playMp3();
      clickCount = 0;
      chrome.storage.local.set({ clickCount: clickCount });
    }
  }
});
