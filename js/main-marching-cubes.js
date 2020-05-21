//	0.0 〜 1.0 と 0 〜 size を写像する
class Mapper {
    constructor(size) {
		this.size = size;
	}
	index(v) {
		return Math.floor(v * this.size);
	}
	regular(v) {
		return v / this.size;
	}
};

//	格子に球体の分布を追加
//	
//	格子外へのはみ出しは考慮してない
//	球体の表面を1とし、中心に向け増加する値を設定、表面より外は1より小さい
//	grid:1次元配列
//	size：1次元配列gridを3次元に展開するための折り返し数
//	 	各次元の折り返し数とすることで、1次元grid[i]を3次元grid[z][y][x] とみなす
//	x, y, z:球体の中心（1.0 = size という単位）
//	r:球体の半径（同上）
function addSphere(grid, size, x, y, z, r) {
	m = new Mapper(size);
	for (let k = m.index( z - r ); k < m.index( z + r ); k++) {
		for (let j = m.index( y - r ); j < m.index( y + r ); j++) {
			for (let i = m.index( x - r ); i < m.index( x + r ); i++) {
				//	i, j, kで特定される格子接続点の値を計算
				let dz = m.regular(k) - z;
				let dy = m.regular(j) - y;
				let dx = m.regular(i) - x;
				let d = dx * dx + dy * dy + dz * dz;
				let value = 10000;
				if (d != 0)
					value = r / Math.sqrt(d);
				//	i, j, kで特定される格子接続点のインディックスを計算し値を設定
				let index = (size * size * k) + (size * j) + i;
				grid[ index ] += value;
			}
		}
	}
}

window.onload = function (e) {
	//	実験環境の準備
	lab = new Lab("canvas-frame");
	lab.setup({shadow:true, useTrackball:true, floor:{width:60, height:60}});

	//	マーチングキューブス法を実行するオブジェクト
	let mc = new MarchingCubes( 20, 1.4 );
	addSphere(mc.grid, mc.size, 0.5, 0.5, 0.5, 0.3);

	//	マーチングキューブス法で作ったポリゴンを表示するオブジェクト
	let material = new THREE.MeshPhongMaterial( { color: 0x00ff00, specular: 0x111111, shininess: 1 } );
	let o = new THREE.ImmediateRenderObject(material);
	o.position.set( 0, 20, 0 );
	o.scale.set( 20, 20, 20 );
	lab.scene.add( o );

	//	mcが作った形状を表示するように指示
	o.render = (renderCallback)=> {mc.render(renderCallback)};	

	//	実験開始
	lab.start(mc);
}

