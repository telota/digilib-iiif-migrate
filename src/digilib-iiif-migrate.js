const has = Object.prototype.hasOwnProperty;

/**
 * Get scaler base
 * @param {string} digilibUrl - digilib url to retrieve base from
 */
function getIiifScaler(digilibUrl) {
  return `${digilibUrl.substr(0, digilibUrl.indexOf('Scaler') + 'Scaler'.length)}/IIIF/`;
}

/**
 * Extract parameters from the provided digilib URL
 * @param {string} digilibUrl - digilib URL to extract parameters from
 */
function extractParameters(digilibUrl) {
  const parameters = {};

  // Get last part of parameter string
  const parameterString = digilibUrl.split('?')[1];

  // Map parameters to key value pair
  parameterString.split('&').forEach((parameter) => {
    const pair = parameter.split('=');

    parameters[pair[0]] = pair[1];
  });

  return parameters;
}

/**
 * Convert the filepath from the digilib URL
 * @param {string} digilibUrl - digilib URL to convert file path from
 */
function convertFilePath(digilibUrl) {
  let filepath = extractParameters(digilibUrl).fn;

  // Remove leading slashes
  if (filepath[0] === '/') {
    filepath = filepath.substr(1);
  }

  return filepath.replace(/\//g, '!');
}

/**
 * Get the full IIIF link of the image
 * @param {string} digilibUrl - digilib URL that should be checked
 */
function getIiifFull(digilibUrl) {
  const base = getIiifScaler(digilibUrl);
  const filepath = convertFilePath(digilibUrl);
  const fullParameters = '/full/full/0/default.jpg';

  return base + filepath + fullParameters;
}

/**
 * Convert the region parameters to IIIF
 * @param {string} digilibUrl -
 * @returns {string}
 */
function getIiifRegion(digilibUrl) {
  const region = 'full';
  const parameters = extractParameters(digilibUrl);

  // If relative offset and size is given
  if (has.call(parameters, 'wx') && has.call(parameters, 'wy') && has.call(parameters, 'ww') && has.call(parameters, 'wh')) {
    const offsetX = (parseFloat(parameters.wx) * 100).toString();
    const offsetY = (parseFloat(parameters.wy) * 100).toString();
    const width = (parseFloat(parameters.ww) * 100).toString();
    const height = (parseFloat(parameters.wh) * 100).toString();

    return `pct:${offsetX},${offsetY},${width},${height}`;
  }

  return region;
}

/**
 * Convert scaler parameters to IIIF
 * @param {string} digilibUrl - digilib URL to extract parameters from
 */
function convertParameters(digilibUrl) {
  const region = getIiifRegion(digilibUrl);
  const size = '';
  const rotation = '';
}

/**
 * Get the IIIF link of the image with the same parameters as the old scaler URL
 * @param {string} digilibUrl - digilib URL to transform
 */
function getIiifModified(digilibUrl) {
  const base = getIiifScaler(digilibUrl);
  const filepath = convertFilePath(digilibUrl);
  const modifiedParameters = convertParameters(digilibUrl);

  return base + filepath + modifiedParameters;
}

/**
 * Convert the size parameters to IIIF
 * @param digilibUrl
 * @returns {string}
 */
function getIiifSize(digilibUrl) {
  const size = 'full';
  const parameters = extractParameters(digilibUrl);

  let scalingFactor = 1;

  if (has.call(parameters, 'ws')) {
    scalingFactor = parameters.ws;
  }

  if (has.call(parameters, 'dw') && has.call(parameters, 'dh')) {
    const width = Math.round((parseInt(parameters.dw, 10) * scalingFactor)).toString();
    const height = Math.round((parseInt(parameters.dh, 10) * scalingFactor)).toString();
    return `${width},${height}`;
  }

  if (has.call(parameters, 'dw')) {
    const width = Math.round((parseInt(parameters.dw, 10) * scalingFactor)).toString();
    return `${width},`;
  }

  if (has.call(parameters, 'dh')) {
    const height = Math.round((parseInt(parameters.dh, 10) * scalingFactor)).toString();
    return `${height.toString()}`;
  }

  return size;
}

/**
 * Check whether the provided url is a digilib scaler URL
 * @param {string} digilibUrl - digilib URL that should be checked
 */
function isDigilibScaler(digilibUrl) {
  return digilibUrl.includes('Scaler');
}

/**
 * Check whether the provided url is an old fashioned digilib scaler
 * @param {string} digilibUrl - digilib URL that should be checked
 */
function isDigilibOldScaler(digilibUrl) {
  return digilibUrl.includes('Scaler?fn=');
}

/**
 * Check whether the the provided url is already IIIF compliant
 * @param  {string} digilibUrl
 */
function isDigilibIiifScaler(digilibUrl) {
  return digilibUrl.includes('Scaler/IIIF/');
}

export default {
  getIiifFull,
  getIiifModified,
  getIiifScaler,
  convertFilePath,
  extractParameters,
  convertParameters,
  getIiifRegion,
  getIiifSize,
  isDigilibScaler,
  isDigilibOldScaler,
  isDigilibIiifScaler,
};

