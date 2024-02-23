export const getGb = long => {
    if (!long) {
        return {
            num: 0,
            unit: 'GB'
        }
    }
    return {
        num: (long / (1024 * 1024 * 1024)).toFixed(2),
        unit: 'GB'
    }
}
export const getMb = long => {
    if (!long) {
        return {
            num: 0,
            unit: 'MB'
        }
    }
    return {
        num: (long / (1024 * 1024)).toFixed(2),
        unit: 'MB'
    }
}
export const getKb = long => {
    if (!long) {
        return {
            num: 0,
            unit: 'KB'
        }
    }
    return {
        num: (long / (1024)).toFixed(2),
        unit: 'KB'
    }
}
export const getKbps = (long, num) => {
    num = num || 1024;
    if (!long) {
        return {
            num: 0,
            unit: 'Kbps'
        }
    }
    return {
        num: (long / (num)).toFixed(2),
        unit: 'Kbps'
    }
}
export const getMaxUnitByBit = (long, isByte) => {
    if (!long) {
        return {
            num: 0,
            unit: 'KB'
        }
    }
    // if (!isByte) {
    //     long /= 8;
    // }
    let unit = 'B';
    if (long / 1024 > 1) {
        long /= 1024;
        unit = 'KB';
    }
    if (long / 1024 > 1) {
        long /= 1024;
        unit = 'MB';
    }
    if (long / 1024 > 1) {
        long /= 1024;
        unit = 'GB';
    }
    if (long / 1024 > 1) {
        long /= 1024;
        unit = 'TB';
    }
    return {
        num: parseFloat(long.toFixed(2)),
        unit
    }
}
export const getMbps = (long, num) => {
    num = num || 1024;
    if (!long) {
        return {
            num: 0,
            unit: 'Mbps'
        }
    }
    let unit = 'Mbps'
    if (long / num > 1) {
        long /= num * num;
        unit = 'Mbps';
    }
    if (long / num > 1) {
        long /= num;
        unit = 'Gbps';
    }
    if (long / num > 1) {
        long /= num;
        unit = 'Tbps';
    }
    return {
        num: parseFloat(long.toFixed(2)),
        unit
    }
}
export const getMaxUnitByFlow = (long, num) => {
    num = num || 1024;
    if (!long) {
        return {
            num: 0,
            unit: 'bps'
        }
    }
    let unit = 'bps';
    if (long / num > 1) {
        long /= num;
        unit = 'Kbps';
    }
    if (long / num > 1) {
        long /= num;
        unit = 'Mbps';
    }
    if (long / num > 1) {
        long /= num;
        unit = 'Gbps';
    }
    if (long / num > 1) {
        long /= num;
        unit = 'Tbps';
    }
    return {
        num: parseFloat(long.toFixed(2)),
        unit
    }
}
export const getValueByUnit = (long, unit, num) => {
    if(!long) {
        return 0;
    }
    num = num || 1024;
    switch (unit) {
        case 'KB':
            long /= num;
            break;
        case 'MB':
            long /= num * num;
            break;
        case 'GB':
            long /= num * num * num;
            break;
        case 'TB':
            long /= num * num * num * num;
            break;
        case 'Kbps':
            long /= num;
            break;
        case 'Mbps':
            long /= num * num;
            break;
        case 'Gbps':
            long /= num * num * num;
            break;
        case 'Tbps':
            long /= num * num * num * num;
        default: break;
    }
    return parseFloat(long.toFixed(2));
}
// 递归得到树结构
export const getTree = (tree, pid) => {
    let treeData = [];
    tree.forEach(item => {
        if (item.pid == pid) {
            const children = getTree(tree, item.id)
            if (children.length) {
                item.children = children;
            }
            treeData.push(item)
        }
    })
    return treeData
}
export const formatTime = (second) => {
    if (second > 0) {
        var day = 0;
        var hour = 0;
        var minute = 0;
        var data = {};
        minute = Math.floor(second / (60))
        if (parseInt(minute) >= 60) {
            hour = parseInt(minute / 60);
            minute %= 60;
        }
        if (parseInt(hour) >= 24) {
            day = parseInt(hour / 24);
            hour %= 24;
        }
        data.day = day ? day + '天' : '';
        data.hour = hour ? hour + '小时' : '';
        data.minute = minute ? minute + '分钟' : '';
        data.second = (second % 60) ? (second % 60) + '秒' : '';
        return data.day + data.hour + data.minute + data.second;
    } else if (second == 0) {
        return '0秒'
    }
}
// 字符串消除空格
export const trimAll = (ele) => {
    if (typeof ele === 'string') {
        return ele.split(/[\t\r\f\n\s]*/g).join('');
    } else {
        console.error(`${typeof ele} is not the expected type, but the string type is expected`)
    }
}

export const debounce = (fn, t = 500) => {
    let lastTime;
    return () => {
        clearTimeout(lastTime);
        const [that, args] = [this, arguments];
        lastTime = setTimeout(() => {
            fn.apply(that, args);
        }, t);
    }
}
export const hexToRgba = (hex, opacity) => {
    let RGBA = "rgba(" + parseInt("0x" + hex.slice(1, 3)) + "," + parseInt("0x" + hex.slice(3, 5)) + "," + parseInt("0x" + hex.slice(5, 7)) + "," + opacity + ")";
    return {
        r: parseInt("0x" + hex.slice(1, 3)),
        g: parseInt("0x" + hex.slice(3, 5)),
        b: parseInt("0x" + hex.slice(5, 7)),
        rgba: RGBA
    }
}

export const drawLine = (start, end, offset) => {
    //起点元素中心坐标
    var y_start = Number(start.offsetTop) + 146;
    var x_start = Number(start.offsetLeft) + 92;

    const offsetX = offset ? offset.x : 0;
    const offsetY = offset ? offset.y : 41;
    //终点元素中心坐标
    var y_end = Number(end.offsetTop) + offsetY;
    var x_end = Number(end.offsetLeft) - offsetX;

    //用勾股定律计算出斜边长度及其夹角（即连线的旋转角度）
    var lx = x_end - x_start;
    var ly = y_end - y_start;
    //计算连线长度
    var length = Math.sqrt(lx * lx + ly * ly);
    //弧度值转换为角度值
    var c = 360 * Math.atan2(ly, lx) / (2 * Math.PI);

    //连线中心坐标
    var midX = (x_end + x_start) / 2;
    var midY = (y_end + y_start) / 2;
    var deg = c <= -90 ? (360 + c) : c;  //负角转换为正角

    return `<div class='line-connect' 
                style='top:${midY}px;left:${midX - length / 2}px;width:${length}px;transform:rotate(${deg}deg);'>
            </div>`
}