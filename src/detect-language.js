const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
const { IamAuthenticator } = require('ibm-watson/auth');



/**
 * Helper
 * @param {*} errorMessage
 * @param {*} defaultLanguage
 */
function getTheErrorResponse(errorMessage, defaultLanguage) {
  return {
    statusCode: 200,
    body: {
      language: defaultLanguage || 'en',
      errorMessage: errorMessage
    }
  };
}

/**
 *
 * main() will be run when the action is invoked
 *
 * @param Cloud Functions actions accept a single parameter, which must be a JSON object.
 *
 * @return The output of this action, which must be a JSON object.
 *
 */
function main(params) {

  /*
   * The default language to choose in case of an error
   */
  const defaultLanguage = 'en';

  return new Promise(function (resolve, reject) {

    try {

      // *******TODO**********
      // - Call the language identification API of the translation service
      // see: https://cloud.ibm.com/apidocs/language-translator?code=node#identify-language
      // - if successful, resolve exactly like shown below with the
      // language that is most probable the best one in the "language" property
      // and the confidence it got detected in the "confidence" property

      // in case of errors during the call resolve with an error message according to the pattern 
      // found in the catch clause below
      const languageTranslator = new LanguageTranslatorV3({
        version: '2018-05-01',
        authenticator: new IamAuthenticator({
          apikey: 'aJaVaEtEQDIPec5oM-fDpHEt2Fcebh7ce6CVFJmgFh3U',
        }),
        url: 'https://api.eu-de.language-translator.watson.cloud.ibm.com/instances/f75ee448-b239-4b1b-a81a-1f3daecf0fcc',
      });

      languageTranslator.identify({text: params.text})
          .then(response => {
            resolve({
              statusCode: 200,
              body: {
                text: params.text,
                language: response.result.languages[0].language,
                confidence: response.result.languages[0].confidence,
              },
              headers: {'Content-Type': 'application/json'}
            });
            console.log(JSON.stringify(response, null, 2));
          })

          } catch (err) {
        console.error('Error while initializing the AI service', err);
        resolve(getTheErrorResponse('Error while communicating with the language service', defaultLanguage));
      }
    });
}
