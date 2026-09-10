(() => {
  const cacheVersion = "20260910-4";

  const loadFallback = (image) => {
    const originalSource = image.getAttribute("src");
    if (!originalSource || image.dataset.fallbackActive === "true") return;

    image.dataset.fallbackActive = "true";
    image.closest("picture")?.querySelectorAll("source").forEach((source) => source.remove());

    const webpSource = `${originalSource}${originalSource.includes("?") ? "&" : "?"}v=${cacheVersion}`;
    image.onerror = () => {
      image.onerror = null;
      image.src = originalSource.replace(/\.webp(?:\?.*)?$/i, ".png");
    };
    image.src = webpSource;
  };

  document.querySelectorAll("picture img").forEach((image) => {
    image.addEventListener("error", () => loadFallback(image), { once: true });
    if (image.complete && image.naturalWidth === 0) loadFallback(image);
  });
})();
