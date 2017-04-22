/* -*- Mode: Java; tab-width: 2; indent-tabs-mode:nil; c-basic-offset: 2 -*- */
/* vim: set ts=2 et sw=2 tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function () {
  "use strict";

  const namespaceURI = "http://www.w3.org/1998/Math/MathML";

  let gXSLTProcessor = null;

  function transformContentMathMLElementsInternal() {
    let maths = document.getElementsByTagNameNS(namespaceURI, "math");
    for (let i = 0; i < maths.length; i++) {
      let newMath = gXSLTProcessor.transformToFragment(maths[i], document);
      if (newMath != null) {
        maths[i].parentNode.replaceChild(newMath, maths[i]);
      }
    }
  }

  function transformContentMathMLElements() {
    // Do nothing if there are not <math> elements.
    if (document.getElementsByTagNameNS(namespaceURI, "math").length === 0) {
      return;
    }

    // Perform the transform immediately if the stylesheet is already loaded.
    if (gXSLTProcessor) {
      transformContentMathMLElementsInternal();
      return;
    }

    // Otherwise load the stylesheet first and try again.
    let xhr = new XMLHttpRequest();
    xhr.open("GET", browser.extension.getURL("content-to-presentation.xsl"), true);
    xhr.onload = function (aEvent) {
      gXSLTProcessor = new XSLTProcessor();
      gXSLTProcessor.importStylesheet(xhr.response);
      transformContentMathMLElementsInternal();
    };
    xhr.responseType = "document";
    xhr.send(null);
  }

  transformContentMathMLElements();
}());
