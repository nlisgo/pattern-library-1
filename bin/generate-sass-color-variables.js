/*
 A very basic script to generate json from the sass variable colors, for use in the color swatch.
 Could be extended for other related things, could be made to take config etc.
*/

'use strict';
const fs = require('fs');
const path = require('path');

// go up a level to the project root
const root = path.dirname(__filename).substring(0, path.dirname(__filename).lastIndexOf('/'));

// could make these configurable
const sassColorVarsInputPath = root + '/source/css/sass/_variables--colors.scss';
const sassColorVarsAsJsonOutputPath = root + '/source/_patterns/00-atoms/00-global/colors.json';

function removeFinalCharOfTypeFromString(str, char) {
  const indexOfFinalCharInstance = str.lastIndexOf(char);
  if (indexOfFinalCharInstance === -1) {
    return;
  }

  return str.replace(str.substring(indexOfFinalCharInstance),
                     str.substring(indexOfFinalCharInstance + 1));
}

/**
 *
 * @param {String} sassData defining sass (scss) variables for colors
 * @return {String} stringified json representation of sassData
 */
function deriveJsonFromSass(sassData) {
  const sassVarRegex = /\$([^:]*-color[^:]*): (#[^;]+);/g;
  const replaceWith = (match, $1, $2) => {
    let replacement = '    {\n';
    replacement += `      "name": "${$1}",\n`;
    replacement += `      "value": "${$2}"\n`;
    replacement += '    },\n';
    return replacement;
  };

  let start ='{\n';
  start += '  "colors": [\n';

  let end ='  ]\n';
  end += '}\n';

  let sassVarsAsJson = `${start}${sassData.replace(sassVarRegex, replaceWith)}${end}`;
  sassVarsAsJson = sassVarsAsJson.replace(/\/\/[^\n].*\n/,'');
  return removeFinalCharOfTypeFromString(sassVarsAsJson, ',');

}

fs.readFile(sassColorVarsInputPath, 'utf8', (err, sassColorVarsData) => {
  if (err) {
    console.log(err);
    return;
  }

  const json = deriveJsonFromSass(sassColorVarsData);

  fs.writeFile(sassColorVarsAsJsonOutputPath, json, () => {
    console.log('done');
  });


});


