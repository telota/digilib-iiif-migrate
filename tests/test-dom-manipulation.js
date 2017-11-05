import test from 'ava';
import dim from '../src/digilib-iiif-migrate';

const validOldUrl = 'https://digilib.bbaw.de/digitallibrary/servlet/Scaler?fn=/silo10/Koran/Umwelttexte/Yazdgerd%20III.jpg&dw=500&';

test('it replaces an anchor tag with a digilib scaler link with an IIIF link', (t) => {
  const anchor = document.createElement('a');
  anchor.setAttribute('href', validOldUrl);
  document.body.appendChild(anchor);
  t.is(document.querySelector('a'), anchor);
  t.is(document.querySelector('a').getAttribute('href'), validOldUrl);

  dim.updateAnchors();

  const targetUrl = 'https://digilib.bbaw.de/digitallibrary/servlet/Scaler/IIIF/silo10!Koran!Umwelttexte!Yazdgerd%20III.jpg/full/500,/0/default.jpg';
  t.is(document.querySelector('a').getAttribute('href'), targetUrl);
});

test('it replaces an image tag with a digilib scaler link with an IIIF link', (t) => {
  const image = document.createElement('img');
  image.setAttribute('src', validOldUrl);
  document.body.appendChild(image);
  t.is(document.querySelector('img'), image);
  t.is(document.querySelector('img').getAttribute('src'), validOldUrl);

  dim.updateImages();

  const targetUrl = 'https://digilib.bbaw.de/digitallibrary/servlet/Scaler/IIIF/silo10!Koran!Umwelttexte!Yazdgerd%20III.jpg/full/500,/0/default.jpg';
  t.is(document.querySelector('img').getAttribute('src'), targetUrl);
});

test('it replaces all digilib scaler link with IIIF links', (t) => {
  const anchor = document.createElement('a');
  anchor.setAttribute('href', validOldUrl);
  document.body.appendChild(anchor);

  const image = document.createElement('img');
  image.setAttribute('src', validOldUrl);
  document.body.appendChild(image);

  dim.updateDOM();

  const targetUrl = 'https://digilib.bbaw.de/digitallibrary/servlet/Scaler/IIIF/silo10!Koran!Umwelttexte!Yazdgerd%20III.jpg/full/500,/0/default.jpg';
  t.is(document.querySelector('a').getAttribute('href'), targetUrl);
  t.is(document.querySelector('img').getAttribute('src'), targetUrl);
});
