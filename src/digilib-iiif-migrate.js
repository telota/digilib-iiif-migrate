const has = Object.prototype.hasOwnProperty;

/**
 * Get scaler base
 * @param {string} digilibUrl - digilib URL to retrieve base from
 * @returns {string} - IIIF scaler URL of same service
 */
function getIiifScaler(digilibUrl) {
  return `${digilibUrl.substr(0, digilibUrl.indexOf('Scaler') + 'Scaler'.length)}/IIIF/`;
}

/**
 * Check whether the provided url is a digilib scaler URL
 * @param {string} digilibUrl - digilib URL that should be checked
 * @returns {boolean}
 */
function isDigilibScaler(digilibUrl) {
  return digilibUrl.includes('Scaler');
}

/**
 * Check whether the provided url is an old fashioned digilib scaler
 * @param {string} digilibUrl - digilib URL that should be checked
 * @returns {boolean}
 */
function isDigilibOldScaler(digilibUrl) {
  return digilibUrl.includes('Scaler?fn=');
}

/**
 * Check whether the the provided url is already IIIF compliant
 * @param  {string} digilibUrl
 * @returns {boolean}
 */
function isDigilibIiifScaler(digilibUrl) {
  return digilibUrl.includes('Scaler/IIIF/');
}

/**
 * Extract parameters from the provided digilib URL
 * @param {string} digilibUrl - digilib URL to extract parameters from
 * @returns {object} - parameters used in the URL
 */
function extractParameters(digilibUrl) {
  const parameters = {};

  // Get last part of parameter string
  const parameterString = digilibUrl.split('?')[1];

  // Map parameters to key value pair
  parameterString.split('&').forEach((parameter) => {
    const pair = parameter.split('=');

    const [prop, val] = pair;
    parameters[prop] = val;
  });

  return parameters;
}

/**
 * Convert the filepath from the digilib URL
 * @param {string} digilibUrl - digilib URL to convert file path from
 * @returns {string} - digilib IIIF compliant file path format
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
 * @returns {string} - digilib IIIF URL to the full sized image
 */
function getIiifFull(digilibUrl) {
  if (!isDigilibOldScaler(digilibUrl)) {
    return digilibUrl;
  }

  const base = getIiifScaler(digilibUrl);
  const filepath = convertFilePath(digilibUrl);
  const fullParameters = '/full/full/0/default.jpg';

  return base + filepath + fullParameters;
}

/**
 * Convert the region parameters to IIIF
 * @param {string} digilibUrl - digilib URL to extract the region parameters from
 * @returns {string} - IIIF region string
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
 * Convert the size parameters to IIIF
 * @param digilibUrl - digilib URL to extract the size parameters from
 * @returns {string} - IIIF size string
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
    return `,${height.toString()}`;
  }

  return size;
}

/**
 * @param digilibUrl - digilib URL to extract rotation parameter from
 * @returns {string} - IIIF rotation string
 */
function getIiifRotation(digilibUrl) {
  const parameters = extractParameters(digilibUrl);

  let rotation = 0;

  if (has.call(parameters, 'rot')) {
    rotation = parameters.rot;
  }

  return rotation.toString();
}

/**
 * Convert scaler parameters to IIIF
 * @param {string} digilibUrl - digilib URL to extract parameters from
 */
function convertParameters(digilibUrl) {
  const region = getIiifRegion(digilibUrl);
  const size = getIiifSize(digilibUrl);
  const rotation = getIiifRotation(digilibUrl);

  return `/${region}/${size}/${rotation}/`;
}

/**
 * Get the IIIF link of the image with the same parameters as the old scaler URL
 * @param {string} digilibUrl - digilib URL to transform
 * @returns {string} - modified digilib URL
 */
function getIiifModified(digilibUrl) {
  if (!isDigilibOldScaler(digilibUrl)) {
    return digilibUrl;
  }

  const base = getIiifScaler(digilibUrl);
  const filepath = convertFilePath(digilibUrl);
  const modifiedParameters = convertParameters(digilibUrl);

  return `${base}${filepath}${modifiedParameters}default.jpg`;
}

/**
 * Iterate over all anchors (a) in a document and replace
 * their href values with IIIF digilib values if necessary
 */
function updateAnchors() {
  const anchors = document.querySelectorAll('a');
  [].forEach.call(anchors, (anchor) => {
    const updatedLink = getIiifModified(anchor.getAttribute('href'));
    anchor.setAttribute('href', updatedLink);
  });
}

/**
 * Iterate over all images (img) in a document and replace
 * their href values with IIIF digilib values if necessary
 */
function updateImages() {
  const images = document.querySelectorAll('img');
  [].forEach.call(images, (image) => {
    const updatedSource = getIiifModified(image.getAttribute('src'));
    image.setAttribute('src', updatedSource);
  });
}

/**
 * Apply IIIF DOM updates for anchors and image tags
 */
function updateDOM() {
  updateAnchors();
  updateImages();
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
  getIiifRotation,
  isDigilibScaler,
  isDigilibOldScaler,
  isDigilibIiifScaler,
  updateAnchors,
  updateImages,
  updateDOM,
};

