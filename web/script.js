/**
 * メニューの表示/非表示を切り替える関数
 */
function toggleMenu() {
    const menu = document.getElementById('menu');
    if (menu.style.display === 'none' || menu.style.display === '') {
        menu.style.display = 'flex';
    } else {
        menu.style.display = 'none';
    }
}


// 初期状態の設定
let planeVisible = false;
let lineVisible = true;

/**
 * 平面を追加する関数
 * @param {Array} x - x座標の配列
 * @param {Array} y - y座標の配列
 * @param {Array} z - z座標の配列
 * @param {String} color - 色
 * @param {String} name - 平面の名前
 * @param {Number} index - 平面のインデックス
 * @returns {Object} - 平面データオブジェクト
 */
function addPlane(x, y, z, color, name, index) {
    return {
        x: x,
        y: y,
        z: z,
        i: [0, 0],
        j: [2, 3],
        k: [1, 1],
        type: 'mesh3d',
        opacity: 0.5,
        color: color,
        name: name,
        visible: document.getElementById('togglePlane' + index).checked ? true : 'legendonly',
        showlegend: false,
        hovertemplate: '1: %{z}<br>2: %{x}<br>3: %{z}<extra></extra>'
    };
}

/**
 * ラインを追加する関数
 * @param {Array} x - x座標の配列
 * @param {Array} y - y座標の配列
 * @param {Array} z - z座標の配列
 * @param {String} color - 色
 * @param {String} name - ラインの名前
 * @param {Number} index - ラインのインデックス
 * @returns {Object} - ラインデータオブジェクト
 */
function addLine(x, y, z, color, name, index) {
    return {
        x: x,
        y: y,
        z: z,
        mode: 'line+marker',
        type: 'scatter3d',
        line: {
            width: 5,
            color: color
        },
        marker: {
            size: 3,
            color: color
        },
        name: name,
        visible: document.getElementById('toggleLine' + index).checked ? true : 'legendonly',
        showlegend: false,
        hovertemplate: '1: %{z}<br>2: %{x}<br>3: %{y}<extra></extra>'
    };
}

let points = [];

/**
 * 点を追加しプロットを更新する関数
 */
function addPoint() {
    const x = parseFloat(document.getElementById('x').value) || 0;
    const y = parseFloat(document.getElementById('y').value) || 0;
    const z = parseFloat(document.getElementById('z').value) || 0;

    points.push({ x, y, z });
    updatePlotWithPoints();
}

/**
 * 点を追加してプロットを更新する関数
 */
function updatePlotWithPoints(customColor = 'yellow') {
    const pointData = {
        x: points.map(p => p.x),
        y: points.map(p => p.y),
        z: points.map(p => p.z),
        mode: 'markers',
        type: 'scatter3d',
        marker: {
            size: 5,
            color: customColor
        },
        name: 'Points',
        showlegend: false,
    };

    Plotly.addTraces('TriangleDiv', pointData);
}

/**
 * シャープレイ値を計算しプロット
 */
function factorial(n) {
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
}

function powerSet(arr) {
    const result = [[]];
    for (const value of arr) {
        const length = result.length;
        for (let i = 0; i < length; i++) {
            const subset = result[i].concat(value);
            result.push(subset);
        }
    }
    return result;
}

function calculateShapleyValue(players, v_1, v_2, v_3, v_12, v_13, v_23, v_123) {
    const coalitionValues = {
        '': 0,
        '1': v_1,
        '2': v_2,
        '3': v_3,
        '12': v_12,
        '13': v_13,
        '23': v_23,
        '123': v_123
    };

    const shapleyValues = {};
    players.forEach(player => {
        shapleyValues[player] = 0;
    });

    players.forEach(player => {
        const otherPlayers = players.filter(p => p !== player);
        const subsets = powerSet(otherPlayers);

        subsets.forEach(subset => {
            const subsetKey = subset.sort().join('');
            const playerInSubsetKey = subset.concat(player).sort().join('');
            const marginalContribution = (coalitionValues[playerInSubsetKey] || 0) - (coalitionValues[subsetKey] || 0);
            const weight = factorial(subset.length) * factorial(players.length - subset.length - 1) / factorial(players.length);
            shapleyValues[player] += weight * marginalContribution;
        });
    });

    return shapleyValues;
}

function calculateAndPlotShapley() {
    const players = ['1', '2', '3'];
    const v_1 = parseFloat(document.getElementById('v_1').value);
    const v_2 = parseFloat(document.getElementById('v_2').value);
    const v_3 = parseFloat(document.getElementById('v_3').value);
    const v_12 = parseFloat(document.getElementById('v_12').value);
    const v_13 = parseFloat(document.getElementById('v_13').value);
    const v_23 = parseFloat(document.getElementById('v_23').value);
    const v_n = parseFloat(document.getElementById('v_n').value);

    const shapleyValues = calculateShapleyValue(players, v_1, v_2, v_3, v_12, v_13, v_23, v_n);
    console.log(shapleyValues);
    
    const x = shapleyValues['1'];
    const y = shapleyValues['2'];
    const z = shapleyValues['3'];

    //points.push({ x, y, z });
    points = [{ x, y, z }];
    updatePlotWithPoints();
}

/**
 * 提携値の更新とプロットの描画
 */
function updateValues() {
    const v_n = parseFloat(document.getElementById('v_n').value) || 0;
    const v_1 = parseFloat(document.getElementById('v_1').value) || 0;
    const v_2 = parseFloat(document.getElementById('v_2').value) || 0;
    const v_3 = parseFloat(document.getElementById('v_3').value) || 0;
    const v_12 = parseFloat(document.getElementById('v_12').value) || 0;
    const v_13 = parseFloat(document.getElementById('v_13').value) || 0;
    const v_23 = parseFloat(document.getElementById('v_23').value) || 0;

    if (v_n >= 0 && v_1 >= 0 && v_2 >= 0 && v_3 >= 0 && v_12 >= 0 && v_13 >= 0 && v_23 >= 0) {
        drawPlot(v_n, v_1, v_2, v_3, v_12, v_13, v_23);
    } else {
        alert('All values must be 0 or greater');
    }
}

/**
 * 要素の表示/非表示を切り替える関数
 * @param {String} id - 要素のID
 * @param {Number} index - 要素のインデックス
 * @param {String} type - 要素のタイプ（'plane' または 'line'）
 */
function toggleVisibility(id, index, type) {
    const checkbox = document.getElementById(id);
    const update = { visible: checkbox.checked ? true : 'legendonly' };
    Plotly.restyle('TriangleDiv', update, [index]);

    // チェック状態に応じてラベルの色を変更
    const label = checkbox.closest('label');
    if (checkbox.checked) {
        label.style.backgroundColor = label.getAttribute('default-color');
        label.style.color = 'white';
    } else {
        label.style.backgroundColor = 'white';
        label.style.color = label.getAttribute('default-color');
    }
}

// 全ての平面を表示/非表示するイベントリスナー
document.getElementById('toggleAllPlanes').addEventListener('change', function () {
    const isVisible = this.checked;
    document.querySelectorAll('#controls input[id^="togglePlane"]').forEach(function (cb) {
        cb.checked = isVisible;
    });
    const updates = { visible: isVisible ? true : 'legendonly' };
    Plotly.restyle('TriangleDiv', updates, [1, 3, 5, 7, 9, 11]);
});

// 全てのラインを表示/非表示するイベントリスナー
document.getElementById('toggleAllLines').addEventListener('change', function () {
    const isVisible = this.checked;
    document.querySelectorAll('#controls input[id^="toggleLine"]').forEach(function (cb) {
        cb.checked = isVisible;
    });
    const updates = { visible: isVisible ? true : 'legendonly' };
    Plotly.restyle('TriangleDiv', updates, [2, 4, 6, 8, 10, 12]);
});

// 個別の平面およびラインの表示/非表示を制御するイベントリスナー
['Plane1', 'Line1', 'Plane2', 'Line2', 'Plane3', 'Line3', 'Plane12', 'Line12', 'Plane13', 'Line13', 'Plane23', 'Line23'].forEach((id, idx) => {
    document.getElementById('toggle' + id).addEventListener('change', () => toggleVisibility('toggle' + id, idx + 1, id.startsWith('Plane') ? 'plane' : 'line'));
});

/**
 * プロットを描画する関数
 * @param {Number} v_n - 全体の提携値
 * @param {Number} v_1 - 提携値 v_1
 * @param {Number} v_2 - 提携値 v_2
 * @param {Number} v_3 - 提携値 v_3
 * @param {Number} v_12 - 提携値 v_12
 * @param {Number} v_13 - 提携値 v_13
 * @param {Number} v_23 - 提携値 v_23
 */
function drawPlot(v_n, v_1, v_2, v_3, v_12, v_13, v_23) {
    const icon1 = {
        width: 500,
        height: 600,
        path: 'M224 512c35.32 0 63.97-28.65 63.97-64H160.03c0 35.35 28.65 64 63.97 64zm215.39-149.71c-19.32-20.76-55.47-51.99-55.47-154.29 0-77.7-54.48-139.9-127.94-155.16V32c0-17.67-14.32-32-31.98-32s-31.98 14.33-31.98 32v20.84C118.56 68.1 64.08 130.3 64.08 208c0 102.3-36.15 133.53-55.47 154.29-6 6.45-8.66 14.16-8.61 21.71.11 16.4 12.98 32 32.1 32h383.8c19.12 0 32-15.6 32.1-32 .05-7.55-2.61-15.27-8.61-21.71z'
    };

    const layout = {
        autosize: true,
        modebardisplay: false,
        font: {
            size: 10
        },
        scene: {
            aspectmode: "manual",
            aspectratio: {
                x: 1,
                y: 1,
                z: 1,
            },
            xaxis: {
                title: '2',
                range: [0, v_n],
            },
            yaxis: {
                title: '3',
                range: [0, v_n],
            },
            zaxis: {
                title: '1',
                range: [0, v_n],
            },
            camera: {
                up: {
                    x: 0,
                    y: 0,
                    z: 1,
                },
                center: {
                    x: 0,
                    y: 0,
                    z: 0,
                },
                eye: {
                    x: 1.25,
                    y: 1.25,
                    z: 1.25,
                }
            }
        }
    };

    const basic_triangle = {
        x: [v_n, 0, 0],
        y: [0, v_n, 0],
        z: [0, 0, v_n],
        i: [0],
        j: [1],
        k: [2],
        type: 'mesh3d',
        opacity: 0.5,
        color: 'blue',
        name: 'BasicTriangle',
        hovertemplate: '1: %{z}<br>2: %{x}<br>3: %{y}<extra></extra>'
    };

    const data = [basic_triangle];

    if (v_1 >= 0) {
        const plane_1 = addPlane([v_n, 0, v_n, 0], [v_n, 0, 0, v_n], [v_1, v_1, v_1, v_1], '#ADD8E6', 'Plane_v{1}', 1);
        const line_1 = addLine([v_n - v_1, 0], [0, v_n - v_1], [v_1, v_1], '#0000FF', 'Line_v{1}', 1);
        data.push(plane_1, line_1);
    }
    
    if (v_2 >= 0) {
        const plane_2 = addPlane([v_2, v_2, v_2, v_2], [v_n, 0, v_n, 0], [v_n, 0, 0, v_n], '#F08080', 'Plane_v{2}', 2);
        const line_2 = addLine([v_2, v_2], [v_n - v_2, 0], [0, v_n - v_2], '#FF0000', 'Line_v{2}', 2);
        data.push(plane_2, line_2);
    }
    
    if (v_3 >= 0) {
        const plane_3 = addPlane([v_n, 0, v_n, 0], [v_3, v_3, v_3, v_3], [v_n, 0, 0, v_n], '#98FB98', 'Plane_v{3}', 3);
        const line_3 = addLine([v_n - v_3, 0], [v_3, v_3], [0, v_n - v_3], '#008000', 'Line_v{3}', 3);
        data.push(plane_3, line_3);
    }
    
    if (v_12 >= 0) {
        const plane_12 = addPlane([v_12, 0, v_12, 0], [v_n, 0, 0, v_n], [0, v_12, 0, v_12], '#E6E6FA', 'Plane_v{12}', 12);
        const line_12 = addLine([0, v_12], [v_n - v_12, v_n - v_12], [v_12, 0], '#800080', 'Line_v{12}', 12);
        data.push(plane_12, line_12);
    }
    
    if (v_13 >= 0) {
        const plane_13 = addPlane([v_n, 0, 0, v_n], [v_13, 0, v_13, 0], [0, v_13, 0, v_13], '#FFDAB9', 'Plane_v{13}', 13);
        const line_13 = addLine([v_n - v_13, v_n - v_13], [0, v_13], [v_13, 0], '#FFA500', 'Line_v{13}', 13);
        data.push(plane_13, line_13);
    }
    
    if (v_23 >= 0) {
        const plane_23 = addPlane([v_23, 0, v_23, 0], [0, v_23, 0, v_23], [v_n, 0, 0, v_n], '#F5DEB3', 'Plane_v{23}', 23);
        const line_23 = addLine([0, v_23], [v_23, 0], [v_n - v_23, v_n - v_23], '#A52A2A', 'Line_v{23}', 23);
        data.push(plane_23, line_23);
    }
    

    const config = {
        responsive: true,
        modeBarButtonsToAdd: [
            {
                name: 'rotate',
                icon: icon1,
                click: function (gd) {
                    setInterval(() => {
                        const newData = gd._fullLayout.scene._scene.getCamera();

                        const currentX = newData.eye.x;
                        const currentY = newData.eye.y;
                        const currentZ = newData.eye.z;

                        const newX = (currentX * Math.cos(1 * (Math.PI / 180))) - (currentY * Math.sin(1 * (Math.PI / 180)));
                        const newY = (currentX * Math.sin(1 * (Math.PI / 180))) + (currentY * Math.cos(1 * (Math.PI / 180)));

                        const update = {
                            x: newX,
                            y: newY,
                            z: currentZ
                        };

                        Plotly.relayout(gd, 'scene.camera.eye', update);
                    }, 10);
                }
            },
        ]
    };

    Plotly.newPlot('TriangleDiv', data, layout, config);
}

// 初期描画
drawPlot(0, 0, 0, 0, 0, 0, 0);
