export function loadFont(name, url) {
    var newFont = new FontFace(name, `url(${url})`);
    return newFont.load().then(function (loaded) {
        document.fonts.add(loaded);
        return loaded.fontFamily;
    }).catch(function (error) {
        throw new Error(`Failed to load font: ${error}`);
    });
}

loadFont("BR-R", "assets/fonts/BR-R.otf")
  .then((fontName) => {
      document.documentElement.style.fontFamily = fontName;
  })
  .catch((error) => {
      console.error(`Failed to load font: ${error}`);
  });
