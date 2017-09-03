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
     * Extract file path from digilib URL
     * @param {string} digilibUrl - digilib url to retrieve file path from
     */
    extractFilePath : (digilibUrl) => {

        let pattern = /fn=\/(.*?)\&/;
        return digilibUrl.match(pattern)[1];

    },

    /**
     * Convert the filepath from the digilib URL
     * @param {string}digilibUrl - digilib url to convert file path from
     */
    convertFilePath : (digilibUrl) => {

        let filepath = module.exports.extractFilePath(digilibUrl);
        return filepath.replace(/\//g, "!");

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

