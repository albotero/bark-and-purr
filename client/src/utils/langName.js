const getLangName = (code, targetLang) => new Intl.DisplayNames([targetLang], { type: "language" }).of(code)

export default getLangName
