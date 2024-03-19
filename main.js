import './style.css'

import { generate_image as generate_image_mite } from './mandelbrot.mite';
import { generate_image as generate_image_js } from './mandelbrot.js';

const USE_MITE = true;

const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas"));
const ox = /** @type {HTMLInputElement} */ (document.getElementById("x"));
const oy = /** @type {HTMLInputElement} */ (document.getElementById("y"));
const width = /** @type {HTMLInputElement} */ (document.getElementById("width"));
const button = document.getElementById("button");
const context = canvas.getContext("2d");
const IMAGEWIDTH = 800;
const IMAGEHEIGHT = 600;
canvas.width = IMAGEWIDTH;
canvas.height = IMAGEHEIGHT;

function generateImage() {
    if (USE_MITE) {
        console.time("Generate Image with Mite")
        const mite_array = generate_image_mite(IMAGEHEIGHT, IMAGEWIDTH, +ox.value, +oy.value, +width.value);
        const mite_imagedata = new ImageData(
            new Uint8ClampedArray(mite_array.buffer, mite_array.byteOffset, mite_array.byteLength),
            IMAGEWIDTH,
            IMAGEHEIGHT
        );
        context.putImageData(mite_imagedata, 0, 0);
        console.timeEnd("Generate Image with Mite")
        return;
    } else {
        console.time("Generate Image with Javascript")
        const js_array = generate_image_js(IMAGEHEIGHT, IMAGEWIDTH, +ox.value, +oy.value, +width.value);
        const js_imagedata = new ImageData(
            js_array,
            IMAGEWIDTH,
            IMAGEHEIGHT
        );
        context.putImageData(js_imagedata, 0, 0);
        console.timeEnd("Generate Image with Javascript")
    }
}

generateImage();
button.addEventListener('click', generateImage);

document.getElementById("preset1").addEventListener("click", () => {
    ox.value = "-0.743643135";
    oy.value = "0.131825963";
    width.value = "0.000014628";
    generateImage();
});

document.getElementById("preset2").addEventListener("click", () => {
    ox.value = "-0.743030";
    oy.value = "0.126433";
    width.value = "0.016110";
    generateImage();
});

document.getElementById("preset3").addEventListener("click", () => {
    ox.value = "-0.74364085";
    oy.value = "0.13182733";
    width.value = "0.00012068";
    generateImage();
});
