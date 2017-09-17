import test from 'ava';
import dim from '../src/digilib-iiif-migrate';

let validOldUrl = "https://digilib.bbaw.de/digitallibrary/servlet/Scaler?fn=/silo10/Koran/Umwelttexte/Yazdgerd%20III.jpg&dw=500&";
let invalidOldUrl = "https://digilib.bbaw.de/digitallibrary/servlet/Faker?fn=/silo10/Koran/Umwelttexte/Yazdgerd%20III.jpg&dw=500&";

let validIiifUrl = "https://digilib.bbaw.de/digitallibrary/servlet/Scaler/IIIF/silo10!Koran!Umwelttexte!Yazdgerd%20III.jpg/full/full/0/default.jpg";
let invalidIiifUrl = "https://digilib.bbaw.de/digitallibrary/servlet/Scaler/Faker/silo10!Koran!Umwelttexte!Yazdgerd%20III.jpg/full/full/0/default.jpg";

test('it checks digilib urls for scalers', t => {

    t.true(dim.isDigilibScaler(validOldUrl));
    t.false(dim.isDigilibScaler(invalidOldUrl));
    t.true(dim.isDigilibScaler(validIiifUrl));
    t.true(dim.isDigilibScaler(invalidIiifUrl));

});

test('it checks digilib urls for old scalers', t => {

    t.true(dim.isDigilibOldScaler(validOldUrl));
    t.false(dim.isDigilibOldScaler(invalidOldUrl));
    t.false(dim.isDigilibOldScaler(validIiifUrl));
    t.false(dim.isDigilibOldScaler(invalidIiifUrl));

});

test('it checks digilib urls for iiif scalers', t => {

    t.false(dim.isDigilibIiifScaler(validOldUrl));
    t.false(dim.isDigilibIiifScaler(invalidOldUrl));
    t.true(dim.isDigilibIiifScaler(validIiifUrl));
    t.false(dim.isDigilibIiifScaler(invalidIiifUrl));

});

test('it retrieves the IIIF scaler base', t => {

    let match = "https://digilib.bbaw.de/digitallibrary/servlet/Scaler/IIIF/";
    t.is(match, dim.getIiifScaler(validOldUrl));

});

test('it converts the file path to the digilib IIIF format', t => {

    let match = "silo10!Koran!Umwelttexte!Yazdgerd%20III.jpg";
    t.is(match, dim.convertFilePath(validOldUrl));

});

test('it converts the old scaler URL to IIIF', t => {

    t.is(validIiifUrl, dim.getIiifFull(validOldUrl));

});

test('it extracts parameters as an object', t => {

    let targetFileName = "/silo10/Koran/Umwelttexte/Yazdgerd%20III.jpg";
    let targetWidth = '500';

    let parameters = dim.extractParameters(validOldUrl);

    t.is(targetFileName, parameters.fn);
    t.is(targetWidth, parameters.dw);

});

test('it converts the region parameters to full when no region parameters are specified at all', t => {

    let scalerUrl = "https://digilib.bbaw.de/digitallibrary/servlet/Scaler?fn=/silo10/Koran/Umwelttexte/Yazdgerd%20III.jpg&wx=0.1&wy=0.15&ww=0.43&wh=0.354";

    let targetRegion = "pct:10,15,43,35.4";

    t.is(targetRegion, dim.getIiifRegion(scalerUrl));


});

test('it converts the region parameters to full when not all region parameters are specified', t => {

});


test('it converts the region parameters correctly when all region parameters are specified', t => {

});

test('it converts the size parameters to full when no size paramters are specified at all ', t => {

});

test('it converts the size parameters correctly when height and width are specified', t => {

});

test('it converts the size parameters correctly when only height is specified', t => {

});

test('it converts the size parameters correctly when only width is specified', t => {

});

test('it applies the scaling factor to the size conversion correctly', t => {

});