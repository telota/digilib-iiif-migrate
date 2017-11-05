import test from 'ava';
import dim from '../src/digilib-iiif-migrate';

const validOldUrl = 'https://digilib.bbaw.de/digitallibrary/servlet/Scaler?fn=/silo10/Koran/Umwelttexte/Yazdgerd%20III.jpg&dw=500&';
const invalidOldUrl = 'https://digilib.bbaw.de/digitallibrary/servlet/Faker?fn=/silo10/Koran/Umwelttexte/Yazdgerd%20III.jpg&dw=500&';

const validIiifUrl = 'https://digilib.bbaw.de/digitallibrary/servlet/Scaler/IIIF/silo10!Koran!Umwelttexte!Yazdgerd%20III.jpg/full/full/0/default.jpg';
const invalidIiifUrl = 'https://digilib.bbaw.de/digitallibrary/servlet/Scaler/Faker/silo10!Koran!Umwelttexte!Yazdgerd%20III.jpg/full/full/0/default.jpg';

test('it checks digilib urls for scalers', (t) => {
  t.true(dim.isDigilibScaler(validOldUrl));
  t.false(dim.isDigilibScaler(invalidOldUrl));
  t.true(dim.isDigilibScaler(validIiifUrl));
  t.true(dim.isDigilibScaler(invalidIiifUrl));
});

test('it checks digilib urls for old scalers', (t) => {
  t.true(dim.isDigilibOldScaler(validOldUrl));
  t.false(dim.isDigilibOldScaler(invalidOldUrl));
  t.false(dim.isDigilibOldScaler(validIiifUrl));
  t.false(dim.isDigilibOldScaler(invalidIiifUrl));
});

test('it checks digilib urls for iiif scalers', (t) => {
  t.false(dim.isDigilibIiifScaler(validOldUrl));
  t.false(dim.isDigilibIiifScaler(invalidOldUrl));
  t.true(dim.isDigilibIiifScaler(validIiifUrl));
  t.false(dim.isDigilibIiifScaler(invalidIiifUrl));
});

test('it retrieves the IIIF scaler base', (t) => {
  const match = 'https://digilib.bbaw.de/digitallibrary/servlet/Scaler/IIIF/';
  t.is(match, dim.getIiifScaler(validOldUrl));
});

test('it converts the file path to the digilib IIIF format', (t) => {
  const match = 'silo10!Koran!Umwelttexte!Yazdgerd%20III.jpg';
  t.is(match, dim.convertFilePath(validOldUrl));
});

test('it converts the old scaler URL to IIIF', (t) => {
  t.is(validIiifUrl, dim.getIiifFull(validOldUrl));
});

test('it extracts parameters as an object', (t) => {
  const targetFileName = '/silo10/Koran/Umwelttexte/Yazdgerd%20III.jpg';
  const targetWidth = '500';

  const parameters = dim.extractParameters(validOldUrl);

  t.is(targetFileName, parameters.fn);
  t.is(targetWidth, parameters.dw);
});

test('it converts the region parameters to full when no region parameters are specified at all', (t) => {
  const scalerUrl = 'https://digilib.bbaw.de/digitallibrary/servlet/Scaler?fn=/silo10/Koran/Umwelttexte/Yazdgerd%20III.jpg';
  const targetRegion = 'full';
  t.is(targetRegion, dim.getIiifRegion(scalerUrl));
});

test('it converts the region parameters to full when not all region parameters are specified', (t) => {
  const scalerUrl = 'https://digilib.bbaw.de/digitallibrary/servlet/Scaler?fn=/silo10/Koran/Umwelttexte/Yazdgerd%20III.jpg&wx=0.1&wy=0.15&ww=0.43';
  const targetRegion = 'full';
  t.is(targetRegion, dim.getIiifRegion(scalerUrl));
});


test('it converts the region parameters correctly when all region parameters are specified', (t) => {
  const scalerUrl = 'https://digilib.bbaw.de/digitallibrary/servlet/Scaler?fn=/silo10/Koran/Umwelttexte/Yazdgerd%20III.jpg&wx=0.1&wy=0.15&ww=0.43&wh=0.354';
  const targetRegion = 'pct:10,15,43,35.4';
  t.is(targetRegion, dim.getIiifRegion(scalerUrl));
});

test('it converts the size parameters to full when no size paramters are specified at all ', (t) => {
  const scalerUrl = 'https://digilib.bbaw.de/digitallibrary/servlet/Scaler?fn=/silo10/Koran/Umwelttexte/Yazdgerd%20III.jpg&wx=0.1&wy=0.15&ww=0.43&wh=0.354';
  const targetSize = 'full';
  t.is(targetSize, dim.getIiifSize(scalerUrl));
});

test('it converts the size parameters correctly when height and width are specified', (t) => {
  const scalerUrl = 'https://digilib.bbaw.de/digitallibrary/servlet/Scaler?fn=/silo10/Koran/Umwelttexte/Yazdgerd%20III.jpg&wx=0.1&wy=0.15&ww=0.43&wh=0.354&dw=500&dh=400';

  const targetSize = '500,400';
  t.is(targetSize, dim.getIiifSize(scalerUrl));
});

test('it converts the size parameters correctly when only width is specified', (t) => {
  const scalerUrl = 'https://digilib.bbaw.de/digitallibrary/servlet/Scaler?fn=/silo10/Koran/Umwelttexte/Yazdgerd%20III.jpg&wx=0.1&wy=0.15&ww=0.43&wh=0.354&dw=550';

  const targetSize = '550,';
  t.is(targetSize, dim.getIiifSize(scalerUrl));
});

test('it converts the size parameters correctly when only height is specified', (t) => {
  const scalerUrl = 'https://digilib.bbaw.de/digitallibrary/servlet/Scaler?fn=/silo10/Koran/Umwelttexte/Yazdgerd%20III.jpg&wx=0.1&wy=0.15&ww=0.43&wh=0.354&dh=400';

  const targetSize = ',400';
  t.is(targetSize, dim.getIiifSize(scalerUrl));
});

test('it applies the scaling factor to the size conversion for both width and height', (t) => {
  const scalerUrl = 'https://digilib.bbaw.de/digitallibrary/servlet/Scaler?fn=/silo10/Koran/Umwelttexte/Yazdgerd%20III.jpg&wx=0.1&wy=0.15&ww=0.43&wh=0.354&dw=500&dh=400&ws=2';

  const targetSize = '1000,800';
  t.is(targetSize, dim.getIiifSize(scalerUrl));
});

test('it applies the scaling factor to the size conversion if only the width is specified', (t) => {
  const scalerUrl = 'https://digilib.bbaw.de/digitallibrary/servlet/Scaler?fn=/silo10/Koran/Umwelttexte/Yazdgerd%20III.jpg&wx=0.1&wy=0.15&ww=0.43&wh=0.354&dw=550&ws=3';

  const targetSize = '1650,';
  t.is(targetSize, dim.getIiifSize(scalerUrl));
});

test('it applies the scaling factor to the size conversion if only the height height is specified', (t) => {
  const scalerUrl = 'https://digilib.bbaw.de/digitallibrary/servlet/Scaler?fn=/silo10/Koran/Umwelttexte/Yazdgerd%20III.jpg&wx=0.1&wy=0.15&ww=0.43&wh=0.354&dh=400&ws=0.5';

  const targetSize = ',200';
  t.is(targetSize, dim.getIiifSize(scalerUrl));
});

test('it correctly converts the rotation parameter', (t) => {
  const scalerUrl = 'https://digilib.bbaw.de/digitallibrary/servlet/Scaler?fn=/silo10/Koran/Umwelttexte/Yazdgerd%20III.jpg&wx=0.1&wy=0.15&ww=0.43&wh=0.354&rot=85';

  const targetRotation = '85';
  t.is(targetRotation, dim.getIiifRotation(scalerUrl));
});

test('it converts all important parameters to the parameter string', (t) => {
  const scalerUrl = 'https://digilib.bbaw.de/digitallibrary/servlet/Scaler?fn=/silo10/Koran/Umwelttexte/Yazdgerd%20III.jpg&wx=0.1&wy=0.15&ww=0.43&wh=0.354&dw=500&dh=400&ws=2&rot=45';

  const target = '/pct:10,15,43,35.4/1000,800/45/';
  t.is(target, dim.convertParameters(scalerUrl));
});

test('it converts the digilib url to IIIF', (t) => {
  const scalerUrl = 'https://digilib.bbaw.de/digitallibrary/servlet/Scaler?fn=/silo10/Koran/Umwelttexte/Yazdgerd%20III.jpg&wx=0.1&wy=0.15&ww=0.43&wh=0.354&dw=500&dh=400&ws=2&rot=45';

  const iiifUrl = 'https://digilib.bbaw.de/digitallibrary/servlet/Scaler/IIIF/silo10!Koran!Umwelttexte!Yazdgerd%20III.jpg/pct:10,15,43,35.4/1000,800/45/default.jpg';
  t.is(iiifUrl, dim.getIiifModified(scalerUrl));
});

test('it skips the conversion if it does not detect the scaler', (t) => {
  const fakeUrl = 'www.bbaw.de';

  t.is(fakeUrl, dim.getIiifModified(fakeUrl));
  t.is(fakeUrl, dim.getIiifFull(fakeUrl));
})
