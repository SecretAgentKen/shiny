(function () {

  chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(["excludes"], (data) => {
      if (!data.excludes) {
        chrome.storage.sync.set({ excludes: [] })
      }
      updateAllTabs(data.excludes || []);
    })
  });

  chrome.runtime.onStartup.addListener(() => {
    chrome.storage.sync.get(["excludes"], (data) => {
      updateAllTabs(data.excludes);
      chrome.browsingData.remove({
        "since": 0
      }, {
        "appcache": true,
        "downloads": true,
        "formData": true,
        "passwords": true
      });
      chrome.browsingData.remove(
        {
          "since": 0,
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
    })
  });

  chrome.tabs.onUpdated.addListener((id, junk, tab) => {
    chrome.storage.sync.get(["excludes"], (data) => {
      setTabAction(id, data.excludes, tab);
    })
  });

  chrome.action.onClicked.addListener(tab => {
    chrome.storage.sync.get(["excludes"], (data) => {
      try {
        let origin = new URL(tab.url).origin;
        if (data.excludes.indexOf(origin) < 0) {
          console.log('Would add')
          data.excludes.push(origin);
          data.excludes.sort();
        } else {
          console.log('Would remove')
          data.excludes = data.excludes.filter((o) => { return o !== origin });
        }
        chrome.storage.sync.set({ excludes: data.excludes })
        updateAllTabs(data.excludes || []);

      } catch (e) {
        console.error(e)
      }
    })
  })

  function updateAllTabs(excludes) {
    chrome.tabs.query({}, function (tabs) {
      tabs.forEach(tab => {
        setTabAction(tab.id, excludes, tab);
      })
    })
  }

  function setTabAction(tabId, excludes, tab) {
    try {
      let origin = new URL(tab.url).origin;
      if (excludes.indexOf(origin) < 0) {
        chrome.action.setIcon({ tabId, path: 'img/dump.png' });
        chrome.action.setTitle({ tabId, title: 'Site data will be cleared at startup' });
      } else {
        chrome.action.setIcon({ tabId, path: 'img/protection.png' });
        chrome.action.setTitle({ tabId, title: 'Site data will retained at startup' });
      }
    } catch (e) {
      console.error(e, tab)
    }
  }
})();
