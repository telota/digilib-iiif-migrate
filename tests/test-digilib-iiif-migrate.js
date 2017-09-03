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

test('it extracts the file path from an old scaler link', t => {

    let match = "silo10/Koran/Umwelttexte/Yazdgerd%20III.jpg";
    t.is(match, dim.extractFilePath(validOldUrl));

});

test('it converts the file path to the digilib IIIF format', t => {

    let match = "silo10!Koran!Umwelttexte!Yazdgerd%20III.jpg";
    t.is(match, dim.convertFilePath(validOldUrl));

});

test('it converts the old scaler URL to IIIF', t => {

    t.is(validIiifUrl, dim.getIiifFull(validOldUrl));

});