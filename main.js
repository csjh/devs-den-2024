import './style.css'

import { calc_color } from "./mandelbrot.mite";

const canvas = document.getElementById("canvas");
const ox = document.getElementById("x");
const oy = document.getElementById("y");
const width = document.getElementById("width");
const button = document.getElementById("button");
const context = canvas.getContext("2d");
const IMAGEWIDTH = 800;
const IMAGEHEIGHT = 600;
canvas.width = IMAGEWIDTH;
canvas.height = IMAGEHEIGHT;
const imagedata = context.createImageData(IMAGEWIDTH, IMAGEHEIGHT);

function generateImage() {
    const x = +ox.value;
    const y = +oy.value;
    const w = +width.value;

    console.time("Generate Image");
    for (let row = 0; row < IMAGEHEIGHT; row++) {
        for (let col = 0; col < IMAGEWIDTH; col++) {
            const rgb = calc_color(col, row, x, y, w);
            const idx = Math.floor((row * 800.0 + col) * 4.0);

            imagedata.data[idx + 0] = rgb >> 16 & 0xFF;
            imagedata.data[idx + 1] = rgb >> 8 & 0xFF;
            imagedata.data[idx + 2] = rgb >> 0 & 0xFF;
            imagedata.data[idx + 3] = 0xFF;
        }
    }

    context.putImageData(imagedata, 0, 0);
    console.timeEnd("Generate Image");
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

import { makeCoordinate, distance, addCoordinates } from './coordinates.mite';

function updateCoordinate(coord) {
    const coordinate_el = document.getElementById('coordinate');
    coordinate_el.innerHTML = `${coord.x.toLocaleString()}, ${coord.y.toLocaleString()}`;

    const distance_el = document.getElementById('distance');
    distance_el.innerHTML = distance(coord, makeCoordinate(0, 0)).toLocaleString();
}

let coordinate = makeCoordinate(1, 2);
updateCoordinate(coordinate);

const randomize = document.getElementById('randomize');
randomize.addEventListener('click', () => {
    coordinate = addCoordinates(coordinate, makeCoordinate(Math.random(), Math.random()));
    // coordinate.x += Math.random();
    // coordinate.y += Math.random();
    updateCoordinate(coordinate);
});
