module.exports = {

    /**
     * Get the full IIIF link of the image
     * @param {string} digilibUrl - digilib URL that should be checked
     */
    getIiifFull : (digilibUrl) => {

        let base = module.exports.getIiifScaler(digilibUrl);
        let filepath = module.exports.convertFilePath(digilibUrl);
        let fullParameters = "/full/full/0/default.jpg";

        return base + filepath + fullParameters;

    },

    /**
     * Get the IIIF link of the image with the same parameters as the old scaler URL
     * @param {string} digilibUrl - digilib URL to transform
     */
    getIiifModified : (digilibUrl) => {

        let base = module.exports.getIiifScaler(digilibUrl);
        let filepath = module.exports.convertFilePath(digilibUrl);
        let modifiedParameters = module.exports.convertParameters(digilibUrl)

        return base + filepath + modifiedParameters;

    },

    /**
     * Get scaler base
     * @param {string} digilibUrl - digilib url to retrieve base from
     */
    getIiifScaler : (digilibUrl) => {

        return digilibUrl.substr(0, digilibUrl.indexOf('Scaler') + 'Scaler'.length) + "/IIIF/";

    },

    /**
     * Convert the filepath from the digilib URL
     * @param {string} digilibUrl - digilib URL to convert file path from
     */
    convertFilePath : (digilibUrl) => {

        let filepath = module.exports.extractParameters(digilibUrl).fn;

        // Remove leading slashes
        if (filepath[0] === "/") {
            filepath = filepath.substr(1);
        }

        return filepath.replace(/\//g, "!");

    },

    /**
     * Extract parameters from the provided digilib URL
     * @param {string} digilibUrl - digilib URL to extract parameters from
     */
    extractParameters : (digilibUrl) => {

        let parameters = {};

        // Get last part of parameter string
        let parameterString = digilibUrl.split("?")[1];

        // Map parameters to key value pair
        parameterString.split("&").forEach((parameter) => {
            let pair = parameter.split("=");
            parameters[pair[0]] = pair[1];
        });

        return parameters;

    },

    /**
     * Convert scaler parameters to IIIF
     * @param {string} digilibUrl - digilib URL to extract parameters from
     */
    convertParameters : (digilibUrl) => {


        let region = module.exports.getIiifRegion(digilibUrl);
        let size = "";
        let rotation = "";


    },

    /**
     * Convert the region parameters to IIIF
     * @param {string} digilibUrl -
     * @returns {string}
     */
    getIiifRegion : (digilibUrl) => {

        let region = "full";
        let parameters = module.exports.extractParameters(digilibUrl);

        // If relative offset and size is given
        if (parameters.hasOwnProperty("wx") && parameters.hasOwnProperty("wy") &&
            parameters.hasOwnProperty("ww") && parameters.hasOwnProperty("wh")) {

            let offsetX = (parseFloat(parameters.wx) * 100).toString();
            let offsetY = (parseFloat(parameters.wy) * 100).toString();
            let width = (parseFloat(parameters.ww) * 100).toString();
            let height = (parseFloat(parameters.wh) * 100).toString();

            return `pct:${offsetX},${offsetY},${width},${height}`;

        }

        return region;

    },

    /**
     * Convert the size parameters to IIIF
     * @param digilibUrl
     * @returns {string}
     */
    getIiifSize : (digilibUrl) => {

        let size = "full";
        let parameters = module.exports.extractParameters(digilibUrl);

        let scalingFactor = 1;

        if (parameters.hasOwnProperty("ws")) {
            scalingFactor = parameters.ws;
        }

        if (parameters.hasOwnProperty("dw") && parameters.has("dh")) {
            let width = Math.round((parseInt(parameters.dw) * scalingFactor)).toString();
            let height = Math.round((parseInt(parameters.dh) * scalingFactor)).toString();
            return `${width},${height}`;
        }

        if (parameters.hasOwnProperty("dw")) {
            let width = Math.round((parseInt(parameters.dw) * scalingFactor)).toString();
            return `${width},`;
        }

        if (parameters.hasOwnProperty("dh")) {
            let height = Math.round((parseInt(parameters.dh) * scalingFactor)).toString();
            return `${height.toString()}`;
        }

        return size;

    },

    /**
     * Check whether the provided url is a digilib scaler URL
     * @param {string} digilibUrl - digilib URL that should be checked
     */
    isDigilibScaler : (digilibUrl) => {
        return (digilibUrl.includes("Scaler"));
    },

    /**
     * Check whether the provided url is an old fashioned digilib scaler
     * @param {string} digilibUrl - digilib URL that should be checked
     */
    isDigilibOldScaler : (digilibUrl) => {
        return (digilibUrl.includes("Scaler?fn="));
    },


    /**
     * Check whether the the provided url is already IIIF compliant
     * @param  {string} digilibUrl
     */
    isDigilibIiifScaler : (digilibUrl) => {
        return (digilibUrl.includes("Scaler/IIIF/"));
    }

}

