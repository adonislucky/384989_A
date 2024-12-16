document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("savePath").addEventListener("click", savePath);
  loadPath();
});

function savePath() {
  let audioPath = document.getElementById("audioPath").value;
  chrome.storage.local.set({ audioPath: audioPath });
}

function loadPath() {
  chrome.storage.local.get(["audioPath"], function (result) {
    document.getElementById("audioPath").value = result.audioPath
      ? result.audioPath
      : null;
  });
}
