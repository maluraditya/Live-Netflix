let apiLoaded = false;
let apiLoading = false;
const callbacks = [];

export function loadYouTubeAPI(callback) {
  if (apiLoaded) {
    callback();
    return;
  }
  callbacks.push(callback);
  if (apiLoading) return;

  apiLoading = true;
  window.onYouTubeIframeAPIReady = () => {
    apiLoaded = true;
    callbacks.forEach((cb) => cb());
    callbacks.length = 0;
  };

  const script = document.createElement('script');
  script.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(script);
}
