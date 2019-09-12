const getComputedLabel = (element: HTMLElement) => {
  if (element) {
    // The element's `aria-labelledby
    const ariaLabelledby = element.getAttribute("aria-labelledby");
    if (ariaLabelledby) {
      const ariaLabelledbyElement = document.getElementById(ariaLabelledby);
      if (ariaLabelledbyElement) {
        const ariaLabelledbyElementText = ariaLabelledbyElement.innerText;
        if (ariaLabelledbyElementText) return ariaLabelledbyElementText;
      }
    }

    // The element's `aria-label`
    const ariaLabel = element.getAttribute("aria-label");
    if (ariaLabel) return ariaLabel;

    // If it's an image/etc., alternate text
    // Even if it's an empty alt attribute alt=""
    if (
      element.tagName === "APPLET" ||
      element.tagName === "AREA" ||
      element.tagName === "IMG" ||
      element.tagName === "INPUT"
    ) {
      const altText = element.getAttribute("alt");
      if (typeof altText === "string") return altText;
    }

    // <desc> for SVGs
    if (element.tagName === "SVG") {
      const descElt = element.querySelector("desc");
      if (descElt) {
        const descText =
          (<HTMLElement>(<unknown>descElt)).innerText || descElt.innerHTML;
        if (descText) return descText;
      }
    }

    // The value of the element
    const innerText = element.innerText;
    if (innerText) return innerText;
  }
};

export default getComputedLabel;
