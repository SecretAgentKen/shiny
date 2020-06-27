chrome.runtime.onStartup.addListener(function(){
  chrome.browsingData.remove({ "since" : 0 }, {
    "appcache": true,
    "cache": true,
    "cacheStorage": true,
    "downloads": true,
    "fileSystems": true,
    "formData": true,
    "indexedDB": true,
    "localStorage": true,
    "pluginData": true,
    "passwords": true,
    "serviceWorkers": true,
    "webSQL": true
  });
});
