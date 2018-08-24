'use strict';
const fs = require('fs');
const path = require('path');

const root = path.dirname(__filename).substring(0, path.dirname(__filename).lastIndexOf('/'));
const sassColorVarsInput = root + '/source/css/sass/_variables--colors.scss';
const sassColorVarsOutput = root + '/source/_patterns/00-atoms/00-global/colors.json';

fs.readFile(sassColorVarsInput, 'utf8', (err, data) => {
  if (err) {
    console.log(err);
    return;
  }

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

  let sassVarsAsJson = `${start}${data.replace(sassVarRegex, replaceWith)}${end}`;
  sassVarsAsJson = sassVarsAsJson.replace(/\/\/[^\n].*\n/,'');

  fs.writeFile(sassColorVarsOutput, sassVarsAsJson, () => {
    console.log('done');
  });


});


