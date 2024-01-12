function iter(cx, cy) {
    let x = 0.0;
    let y = 0.0;
    for (let i = 1; i <= 1000; i += 1) {
        let newx = x * x - y * y + cx;
        let newy = 2.0 * x * y + cy;
        x = newx;
        y = newy;
        let smodz = x * x + y * y;
        if (smodz >= 4.0) {
            return i + 1.0 - Math.log(Math.log(smodz) * 0.5) / Math.log(2.0);
        };
    };
    return 0.0 - 1.0;
}

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

export function calc_color(col, row, ox, oy, width) {
    let pixel_size = width / 800.0;
    let cx = (col - 399.5) * pixel_size + ox;
    let cy = (row - 300.0) * pixel_size + oy;
    let r = 0;
    let g = 0;
    let b = 0;
    for (let i = 0 - 1; i <= 1; i += 1) {
        for (let j = 0 - 1; j <= 1; j += 1) {
            let d = iter(cx + i * pixel_size / 3.0, cy + j * pixel_size / 3.0);
            let c = get_color(d);
            r += c >> 16 & 0xFF;
            g += c >> 8 & 0xFF;
            b += c >> 0 & 0xFF;
        };
    };
    r /= 9;
    g /= 9;
    b /= 9;
    return r << 16 | g << 8 | b << 0;
}
