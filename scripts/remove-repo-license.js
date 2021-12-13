const fs = require('fs');
const packageJson = require('../package.json');

/**
 * The generate-license-file package includes the current repo in the 3rd party notices file.
 * This function removes that license from the file.
 */
function removeRepoLicense() {
  const noticesFile = './THIRD-PARTY-NOTICES';

  const noticesFileContents = fs.readFileSync(noticesFile, 'utf8');
  const noticesWithoutRepoLicense = getNoticesWithoutReactSiteStarterLicense(noticesFileContents);

  fs.writeFileSync(noticesFile, noticesWithoutRepoLicense);
}

/**
 * Removes the repo's library license from the 3rd party notices file
 * contents and returns the updated file as a string
 *
 * @param {string} fileContents The contents of the 3rd party notices file
 * @returns {string}
 */
function getNoticesWithoutReactSiteStarterLicense(fileContents) {
  const packageName = packageJson.name;
  const repoLine = ` - ${packageName}`;
  const licenseStart = 'The following NPM package may be included in this product:';
  const divider = '-----------';
  const numNewLinesAfterDivider = 2;

  const indexOfRepoLine = fileContents.indexOf(repoLine);
  if (indexOfRepoLine === -1) {
    return fileContents;
  }

  const startOfRepoLicense = fileContents.lastIndexOf(licenseStart, indexOfRepoLine);
  const endOfRepoLicense =
    fileContents.indexOf(divider, startOfRepoLicense)
    + divider.length
    + numNewLinesAfterDivider;

  const fileBeforeRepoLicense = fileContents.slice(0, startOfRepoLicense);
  const fileAfterRepoLicense = fileContents.slice(endOfRepoLicense);

  return fileBeforeRepoLicense + fileAfterRepoLicense;
}

removeRepoLicense();