import aws from "aws-sdk"

const translate = new aws.Translate({ region: "us-east-1" })

export const doTranslation = async (SourceLanguageCode, TargetLanguageCode, Text) => {
  const params = { SourceLanguageCode, TargetLanguageCode, Text }

  try {
    let translated, res

    translate.translateText(params, (error, data) => {
      translated = data?.SourceLanguageCode !== TargetLanguageCode && data?.TranslatedText ? true : false
      res = {
        error,
        sourceLang: data?.SourceLanguageCode,
        targetLang: data?.TargetLanguageCode,
        translated,
        translation: (translated && data?.TranslatedText) || Text,
      }
      if (error) console.log("Error:", error.originalError?.message)
    })

    do {
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } while (!res)

    return res
  } catch (error) {
    console.log(error)
  }
}
