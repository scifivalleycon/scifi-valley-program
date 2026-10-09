  const MAX_IMAGE_ZOOM = 6;
  const IMAGE_PADDING = 10;
  let imageZoom = 1, geometry = null, gesture = null, resizeFrame = 0;

  function imageAnchor(x = stage.clientWidth / 2, y = stage.clientHeight / 2) {
    return geometry ? {
      x, y,
      u:(stage.scrollLeft + x - geometry.left) / geometry.width,
      v:(stage.scrollTop + y - geometry.top) / geometry.height
    } : {x, y, u:0.5, v:0.5};
  }

  function layoutImage(anchor = null) {
    if (!imageNode?.naturalWidth || !modal?.open) return;
    const width = stage.clientWidth, height = stage.clientHeight;
    if (!width || !height) return;
    const fit = Math.min(1, Math.max(1, width - IMAGE_PADDING * 2) / imageNode.naturalWidth,
      Math.max(1, height - IMAGE_PADDING * 2) / imageNode.naturalHeight);
    const imageWidth = imageNode.naturalWidth * fit * imageZoom;
    const imageHeight = imageNode.naturalHeight * fit * imageZoom;
    const surfaceWidth = Math.max(width, imageWidth + IMAGE_PADDING * 2);
    const surfaceHeight = Math.max(height, imageHeight + IMAGE_PADDING * 2);
    geometry = {width:imageWidth, height:imageHeight,
      left:(surfaceWidth - imageWidth) / 2, top:(surfaceHeight - imageHeight) / 2};
    surface.style.width = `${surfaceWidth}px`;
    surface.style.height = `${surfaceHeight}px`;
    Object.assign(imageNode.style, {width:`${imageWidth}px`, height:`${imageHeight}px`,
      left:`${geometry.left}px`, top:`${geometry.top}px`});
    if (anchor && imageZoom > 1) {
      stage.scrollLeft = geometry.left + anchor.u * imageWidth - anchor.x;
      stage.scrollTop = geometry.top + anchor.v * imageHeight - anchor.y;
    } else {
      stage.scrollLeft = 0;
      stage.scrollTop = 0;
    }
  }

  function setZoom(value, anchor = null) {
    const target = value === true ? 3 : value === false ? 1 : Number(value);
    if (!Number.isFinite(target)) return;
    const focus = anchor || (geometry ? imageAnchor() : null);
    imageZoom = Math.max(1, Math.min(MAX_IMAGE_ZOOM, target));
    zoomed = imageZoom > 1.01;
    modal.classList.toggle("console-zoomed", zoomed);
    zoomButton.textContent = zoomed ? "FIT TO SCREEN" : "ZOOM IN";
    zoomButton.setAttribute("aria-pressed", String(zoomed));
    layoutImage(focus);
  }

  function beginImageGesture(touches) {
    gesture = null;
    if (!geometry || imageNode?.hidden) return;
    const rect = stage.getBoundingClientRect();
    if (touches.length === 2) {
      const a = touches[0], b = touches[1];
      gesture = {kind:"pinch", zoom:imageZoom,
        distance:Math.max(1, Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY)),
        anchor:imageAnchor((a.clientX + b.clientX) / 2 - rect.left,
          (a.clientY + b.clientY) / 2 - rect.top)};
    } else if (touches.length === 1 && zoomed) {
      gesture = {kind:"pan", x:touches[0].clientX, y:touches[0].clientY,
        left:stage.scrollLeft, top:stage.scrollTop};
    }
  }

  function bindImageGestures() {
    // Pinch/drag changes only the poster, not the navigation or close controls.
    // This is scoped to this image stage; page zoom elsewhere is unchanged.
    stage.classList.add("console-image-gestures");
    stage.addEventListener("touchstart", event => {
      beginImageGesture(event.touches);
      if (event.cancelable) event.preventDefault();
    }, {passive:false});
    stage.addEventListener("touchmove", event => {
      if (event.cancelable) event.preventDefault();
      if (!gesture) return;
      const touches = event.touches;
      if (gesture.kind === "pinch" && touches.length === 2) {
        const a = touches[0], b = touches[1], rect = stage.getBoundingClientRect();
        const distance = Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
        setZoom(gesture.zoom * distance / gesture.distance, {...gesture.anchor,
          x:(a.clientX + b.clientX) / 2 - rect.left,
          y:(a.clientY + b.clientY) / 2 - rect.top});
      } else if (gesture.kind === "pan" && touches.length === 1) {
        stage.scrollLeft = gesture.left + gesture.x - touches[0].clientX;
        stage.scrollTop = gesture.top + gesture.y - touches[0].clientY;
      }
    }, {passive:false});
    stage.addEventListener("touchend", event => {
      if (event.cancelable) event.preventDefault();
      beginImageGesture(event.touches);
    }, {passive:false});
    stage.addEventListener("touchcancel", () => { gesture = null; }, {passive:true});
    stage.addEventListener("wheel", event => {
      // Trackpad pinch. Ordinary wheel/keyboard scrolling still pans the poster.
      if (!event.ctrlKey || !geometry || imageNode?.hidden) return;
      event.preventDefault();
      const rect = stage.getBoundingClientRect();
      setZoom(imageZoom * Math.exp(-event.deltaY * 0.01),
        imageAnchor(event.clientX - rect.left, event.clientY - rect.top));
    }, {passive:false});
    const resize = () => {
      if (!modal?.open || resizeFrame) return;
      resizeFrame = requestAnimationFrame(() => {
        resizeFrame = 0;
        layoutImage(geometry ? imageAnchor() : null);
      });
    };
    if (typeof ResizeObserver === "function") new ResizeObserver(resize).observe(stage);
    else window.addEventListener("resize", resize);
  }
