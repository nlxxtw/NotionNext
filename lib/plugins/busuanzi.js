/* eslint-disable */
/**
 * 不蒜子统计：失败时不永久隐藏节点；支持备用源
 */
let bszCaller, bszTag, scriptTag, ready

let intervalId
let executeCallbacks
let onReady
let isReady = false
let callbacks = []

const BUSUANZI_ENDPOINTS = [
  '//busuanzi.ibruce.info/busuanzi?jsonpCallback=BusuanziCallback',
  'https://busuanzi.ibruce.info/busuanzi?jsonpCallback=BusuanziCallback'
]

if (typeof document !== 'undefined') {
  ready = function (callback) {
    if (
      isReady ||
      document.readyState === 'interactive' ||
      document.readyState === 'complete'
    ) {
      callback.call(document)
    } else {
      callbacks.push(function () {
        return callback.call(this)
      })
    }
    return this
  }

  executeCallbacks = function () {
    for (let i = 0, len = callbacks.length; i < len; i++) {
      callbacks[i].apply(document)
    }
    callbacks = []
  }

  onReady = function () {
    if (!isReady) {
      isReady = true
      executeCallbacks.call(window)
      if (document.removeEventListener) {
        document.removeEventListener('DOMContentLoaded', onReady, false)
      } else if (document.attachEvent) {
        document.detachEvent('onreadystatechange', onReady)
        if (window == window.top) {
          clearInterval(intervalId)
          intervalId = null
        }
      }
    }
  }

  if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', onReady, false)
  } else if (document.attachEvent) {
    document.attachEvent('onreadystatechange', function () {
      if (/loaded|complete/.test(document.readyState)) {
        onReady()
      }
    })
    if (window == window.top) {
      intervalId = setInterval(function () {
        try {
          if (!isReady) {
            document.documentElement.doScroll('left')
          }
        } catch (e) {
          return
        }
        onReady()
      }, 5)
    }
  }
}

bszCaller = {
  fetch: function (url, callback) {
    const callbackName =
      'BusuanziCallback_' + Math.floor(1099511627776 * Math.random())
    url = url.replace('=BusuanziCallback', '=' + callbackName)
    scriptTag = document.createElement('SCRIPT')
    scriptTag.type = 'text/javascript'
    scriptTag.defer = true
    scriptTag.src = url
    scriptTag.referrerPolicy = 'no-referrer-when-downgrade'
    scriptTag.onerror = function () {
      try {
        delete window[callbackName]
      } catch (e) {}
      if (scriptTag && scriptTag.parentElement) {
        scriptTag.parentElement.removeChild(scriptTag)
      }
      callback(null)
    }
    document.getElementsByTagName('HEAD')[0].appendChild(scriptTag)
    window[callbackName] = this.evalCall(callback)
  },
  evalCall: function (callback) {
    return function (data) {
      ready(function () {
        try {
          callback(data)
          if (
            scriptTag &&
            scriptTag.parentElement &&
            scriptTag.parentElement.contains(scriptTag)
          ) {
            scriptTag.parentElement.removeChild(scriptTag)
          }
        } catch (e) {
          // ignore
        }
      })
    }
  }
}

let fetching = false
let endpointIndex = 0

const fetch = () => {
  if (typeof document === 'undefined') return
  if (fetching) return
  fetching = true

  const tryNext = () => {
    if (endpointIndex >= BUSUANZI_ENDPOINTS.length) {
      fetching = false
      endpointIndex = 0
      // 失败也不隐藏，保留空节点给后续重试
      if (bszTag) bszTag.shows()
      return
    }
    const url = BUSUANZI_ENDPOINTS[endpointIndex++]
    bszCaller.fetch(url, function (data) {
      if (data && (data.site_pv != null || data.page_pv != null)) {
        fetching = false
        endpointIndex = 0
        bszTag.texts(data)
        bszTag.shows()
        try {
          window.dispatchEvent(
            new CustomEvent('heo-busuanzi-ready', { detail: data })
          )
        } catch (e) {}
        return
      }
      tryNext()
    })
  }

  // 不再在请求前 hide：失败时以前会永久 display:none，总浏览一直空白
  if (bszTag) bszTag.shows()
  tryNext()
}

bszTag = {
  bszs: ['site_pv', 'page_pv', 'site_uv'],
  texts: function (data) {
    this.bszs.map(function (key) {
      const elements = document.getElementsByClassName('busuanzi_value_' + key)
      if (elements && data && data[key] != null) {
        for (var element of elements) {
          element.innerHTML = data[key]
        }
      }
    })
  },
  hides: function () {
    // no-op：避免空白占位被永久隐藏
  },
  shows: function () {
    this.bszs.map(function (key) {
      const elements = document.getElementsByClassName(
        'busuanzi_container_' + key
      )
      if (elements) {
        for (var element of elements) {
          element.style.display = ''
          element.style.visibility = 'visible'
        }
      }
    })
  }
}

module.exports = {
  fetch
}
