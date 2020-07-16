(function(){
  localStorage['excludes'] = localStorage['excludes'] || JSON.stringify({excludes:[]});

  let data = JSON.parse(localStorage['excludes']);

  chrome.runtime.onStartup.addListener(function(){
    chrome.browsingData.remove({
      "since": 0
    },{
      "appcache": true,
      "downloads": true,
      "formData": true,
      "passwords": true
    });
    chrome.browsingData.remove(
    { 
      "since" : 0,
      "excludeOrigins": data.excludes
    }, {
      "cache": true,
      "cacheStorage": true,
      "cookies": true,
      "fileSystems": true,
      //"history": false,
      "indexedDB": true,
      "localStorage": true,
      "pluginData": true,
      "serviceWorkers": true,
      "webSQL": true
    });
  });

  chrome.tabs.onUpdated.addListener(setTabAction);
  chrome.pageAction.onClicked.addListener(pageClicked);

  updateAllTabs();

  function pageClicked(tab){
    try {
      let origin = new URL(tab.url).origin;
      let data = JSON.parse(localStorage['excludes']);
      if ( data.excludes.indexOf(origin) < 0 ) {
        data.excludes.push(origin);
        data.excludes.sort();
      } else {
        data.excludes = data.excludes.filter((o)=>{return o !== origin});
      }
      localStorage['excludes'] = JSON.stringify(data);
      updateAllTabs();
    } catch(e){}
  }

  function updateAllTabs(){
    chrome.tabs.query({}, function(tabs){
      tabs.forEach(tab => {
        setTabAction(tab.id, null, tab);
      })
    })
  }

  function setTabAction(tabId, info, tab) {
    try {
      let origin = new URL(tab.url).origin;
      let data = JSON.parse(localStorage['excludes']);
      if ( data.excludes.indexOf(origin) < 0 ) {
        chrome.pageAction.setIcon({tabId, path: 'img/dump.png'});
        chrome.pageAction.setTitle({tabId, title: 'Site data will be cleared at startup'});
      } else {
        chrome.pageAction.setIcon({tabId, path: 'img/protection.png'});
        chrome.pageAction.setTitle({tabId, title: 'Site data will retained at startup'});
      }
      chrome.pageAction.show(tabId);
    } catch(e){}
  }
})();
