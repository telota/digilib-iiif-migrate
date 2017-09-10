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
     * @param {string} digilibUrl - digilib url to extract parameters from
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

