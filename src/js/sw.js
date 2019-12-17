
if( 'function' === typeof importScripts) {

  if(workbox) {

    workbox.precaching.precacheAndRoute(self.__precacheManifest)



    workbox.routing.registerRoute(
      // Cache image files.
      /.*\.(png|jpg|jpeg|svg|gif)/,
      // Use the cache if it's available.
      new workbox.strategies.CacheFirst({
        // Use a custom cache name.
        cacheName: 'images',
        plugins: [
          new workbox.expiration.Plugin({
            // Cache only 20 images.
            maxEntries: 26,
            maxAgeSeconds: 12 * 60 * 60,
          }),
          new workbox.cacheableResponse.Plugin({
            statuses: [0, 200]
          })
        ],
      })
    );
    workbox.routing.registerRoute(/.*\/news\/.*/,     
      // Use the cache if it's available.
      new workbox.strategies.CacheFirst({
        // Use a custom cache name.
        cacheName: 'news-cache',
        plugins: [
          new workbox.expiration.Plugin({
            // Cache only 20 entries.
            maxEntries: 20,
            maxAgeSeconds: 12 * 60 * 60,
          })
        ],
      })
    );

    workbox.routing.registerRoute(new RegExp('/(?!.*login|.*register|.*reset|.*forgot|.*resend|.*news).*'), new workbox.strategies.NetworkFirst({
      cacheName: 'index',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 40,
          maxAgeSeconds: 7* 24 * 60 * 60,
        }),
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200]
        })
      ],
    }));

    
    workbox.routing.registerRoute(/.*github.com.*/, new workbox.strategies.CacheFirst({
      cacheName: 'github',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 40,
          maxAgeSeconds: 4 * 60,
        }),
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200]
        })
      ],
    }));

    workbox.routing.registerRoute(/.*github.com.*/, new workbox.strategies.CacheFirst({
      cacheName: 'github-post',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 40,
          maxAgeSeconds: 4 * 60,
        }),
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200]
        })
      ],
    }), 'POST');


  

    workbox.routing.registerRoute(/https:\/\/oauth\.reddit\.com\/\.*/,
      new workbox.strategies.CacheFirst({
        cacheName: 'reddit-cache',
        plugins: [
          new workbox.expiration.Plugin({
            maxEntries: 20,
            maxAgeSeconds: 12 * 60 * 60,
          })
        ],
      })
    );


    workbox.routing.registerRoute(/https:\/\/www\.reddit\.com\/\.*/, new workbox.strategies.NetworkOnly(), 'POST');
    

  }


workbox.routing.setCatchHandler(({url, event, params}) => {
  const fallbackKey = workbox.precaching.getCacheKeyForURL('fallback.json');
  const str = event.request.url;
  const regex = /\/news\/content/;
  const fallbackKeyReddit = workbox.precaching.getCacheKeyForURL('fallbackReddit.json');
  const fallbackKeyGithub = workbox.precaching.getCacheKeyForURL('fallbackGithub.json');


  if(regex.test(str)) {
    return caches.match(fallbackKey);
  }
  else if(/reddit\.com/.test(str)) {
    return caches.match(fallbackKeyReddit);
  }
  else if(/github\.com/.test(str)) {
    return caches.match(fallbackKeyGithub);
  }
  else {
    return Response.error;
  }
  
});

}
