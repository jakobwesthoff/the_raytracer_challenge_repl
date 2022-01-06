<!--
  Taken from https://www.npmjs.com/package/lite-youtube-embed and slightly
  modified to better suite my needs. Specifically the following changes were made:
  - CSS was made compatible with kahi-ui
  - The highres image is now used as poster image instead of the lowres one.
-->
<script>
  export let videoId
  export let playLabel = 'Play'
  export let params = ''

  let activated = false
  let hovered = false

  $: videoId, (activated = false)
  $: computedParams = (() => {
    const p = new URLSearchParams(params)
    p.append('autoplay', '1')
    return p.toString()
  })()

  function focus(node) {
    node.focus()
  }
</script>

<svelte:head>
  <link rel="preconnect" href="https://i.ytimg.com" />
  {#if hovered}
    <link rel="preconnect" href="https://www.youtube-nocookie.com" />
    <link rel="preconnect" href="https://www.google.com" />
  {/if}
</svelte:head>

<div
  class="lite-youtube"
  class:lite-youtube-activated={activated}
  on:pointerover|once={() => (hovered = true)}
  on:click={() => (activated = true)}
>
  {#key videoId}
    <picture>
      <source
        srcset="https://i.ytimg.com/vi_webp/{videoId}/maxresdefault.webp"
        type="image/webp"
      />
      <img
        class="lite-youtube-poster"
        src="https://i.ytimg.com/vi/{videoId}/maxresdefault.jpg"
        alt={playLabel}
      />
    </picture>
  {/key}
  <button type="button" class="lite-youtube-playbtn" aria-label={playLabel} />
  {#if activated}
    <iframe
      width="560"
      height="315"
      title={playLabel}
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      src="https://www.youtube-nocookie.com/embed/{encodeURIComponent(
        videoId
      )}?{computedParams}"
      use:focus
    />
  {/if}
</div>

<style global>
  :global(.lite-youtube) {
    background-color: #000000;
    position: relative;
    display: block;
    contain: content;
    cursor: pointer;

    /* Modified from original */
    width: 75vw;
    max-height: calc(75vh - 36px * 2);
    max-width: inherit;
  }

  /* gradient */
  :global(.lite-youtube::before) {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAADGCAYAAAAT+OqFAAAAdklEQVQoz42QQQ7AIAgEF/T/D+kbq/RWAlnQyyazA4aoAB4FsBSA/bFjuF1EOL7VbrIrBuusmrt4ZZORfb6ehbWdnRHEIiITaEUKa5EJqUakRSaEYBJSCY2dEstQY7AuxahwXFrvZmWl2rh4JZ07z9dLtesfNj5q0FU3A5ObbwAAAABJRU5ErkJggg==);
    background-position: top;
    background-repeat: repeat-x;
    height: 60px;
    padding-bottom: 50px;
    width: 100%;
    transition: all 0.2s cubic-bezier(0, 0, 0.2, 1);
    box-sizing: unset;
    z-index: 1;
  }

  /* responsive iframe with a 16:9 aspect ratio
    thanks https://css-tricks.com/responsive-iframes/
*/
  :global(.lite-youtube::after) {
    content: '';
    display: block;
    padding-bottom: calc(100% / (16 / 9));
  }
  :global(.lite-youtube) > :global(iframe) {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    border: 0;
  }

  /* poster */
  :global(.lite-youtube-poster) {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    object-fit: cover;
  }

  /* play button */
  :global(.lite-youtube) > :global(.lite-youtube-playbtn) {
    width: 68px;
    height: 48px;
    position: absolute;
    cursor: pointer;
    transform: translate3d(-50%, -50%, 0) !important /* !important to overwrite kahi-ui styles */;
    top: 50%;
    left: 50%;
    z-index: 1;
    background-color: transparent !important /* !important to overwrite kahi-ui */;
    /* YT's actual play button svg */
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 68 48"><path fill="%23f00" fill-opacity="0.8" d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"></path><path d="M 45,24 27,14 27,34" fill="%23fff"></path></svg>');
    filter: grayscale(100%);
    transition: filter 0.1s cubic-bezier(0, 0, 0.2, 1);
    border: none;
    outline: 0 !important; /* !important to overwrite kahi-ui styles */
  }

  :global(.lite-youtube:hover) > :global(.lite-youtube-playbtn),
  :global(.lite-youtube) :global(.lite-youtube-playbtn:focus) {
    /* !important to overwrite kahi-ui button styles */
    filter: none !important;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 68 48"><path fill="%23f00" fill-opacity="0.8" d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"></path><path d="M 45,24 27,14 27,34" fill="%23fff"></path></svg>') !important;
  }

  /* Post-click styles */
  :global(.lite-youtube.lite-youtube-activated) {
    cursor: unset;
  }
  :global(.lite-youtube.lite-youtube-activated::before),
  :global(.lite-youtube.lite-youtube-activated) > :global(.lite-youtube-playbtn) {
    opacity: 0;
    pointer-events: none;
  }
</style>
