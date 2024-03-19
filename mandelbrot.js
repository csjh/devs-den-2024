function interpolation(f, c0, c1) {
    let r0 = c0 >> 16 & 0xFF;
    let g0 = c0 >> 8 & 0xFF;
    let b0 = c0 >> 0 & 0xFF;
    let r1 = c1 >> 16 & 0xFF;
    let g1 = c1 >> 8 & 0xFF;
    let b1 = c1 >> 0 & 0xFF;
    let r = Math.floor((1.0 - f) * r0 + f * r1 + 0.5);
    let g = Math.floor((1.0 - f) * g0 + f * g1 + 0.5);
    let b = Math.floor((1.0 - f) * b0 + f * b1 + 0.5);
    return r << 16 | g << 8 | b << 0;
}

function get_color(d) {
    if (d >= 0.0) {
        let k = 0.021 * (d - 1.0 + Math.log(Math.log(128.0)) / Math.log(2.0));
        k = Math.log(1.0 + k) - 29.0 / 400.0;
        k -= Math.floor(k);
        k *= 400.0;
        if (k < 63.0) {
            return interpolation(k / 63.0, 0x000764, 0x206BCB);
        } else if (k < 167.0) {
            return interpolation((k - 63.0) / (167.0 - 63.0), 0x206BCB, 0xEDFFFF);
        } else if (k < 256.0) {
            return interpolation((k - 167.0) / (256.0 - 167.0), 0xEDFFFF, 0xFFAA00);
        } else if (k < 342.0) {
            return interpolation((k - 256.0) / (342.0 - 256.0), 0xFFAA00, 0x310230);
        } else {
            return interpolation((k - 342.0) / (400.0 - 342.0), 0x310230, 0x000764);
        };
    } else {
        return 0x000000;
    };
}

function calc_color(col, row, ox, oy, width) {
    const pixel_size = width / 800.0;
    const cx = (col - 399.5) * pixel_size + ox;
    const cy = (row - 300.0) * pixel_size + oy;
    let zr = cx;
    let zi = cy;
    let k = 0;
    while (++k < 1000) {
        let zr1 = zr * zr - zi * zi + cx;
        let zi1 = zr * zi + zr * zi + cy;
        zr = zr1;
        zi = zi1;
        if (zr * zr + zi * zi >= 4.0) {
            break;
        }
    }
    if (k == 1000) {
        k = -1;
    } else {
        k += 1.0 - Math.log(Math.log(zr * zr + zi * zi) * 0.5) / Math.log(2.0);
    }
    return get_color(k);
}

export function generate_image(height, width, x, y, w) {
    const data = new Uint8ClampedArray(800 * 600 * 4);
    for (let row = 0; row < height; row += 1) {
        for (let col = 0; col < width; col += 1) {
            let rgb = calc_color(col, row, x, y, w);
            let idx = (row * 800 + col) * 4;

            data[idx + 0] = (rgb >> 16) & 0xFF;
            data[idx + 1] = (rgb >> 8) & 0xFF;
            data[idx + 2] = (rgb >> 0) & 0xFF;
            data[idx + 3] = 0xFF;
        };
    };
    return data;
}
