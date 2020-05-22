//	受け取った f(x, y, z) 関数を使い、その戻り値をgridの値に加算する
//	fに渡すx, y, zはgridの 0 〜 size 範囲を -1 〜 1 に写像させたものとする。
//	gridを3次元配列と考えた場合のgrid[k][j][i]のk, j, iはそれぞれ空間座標のz, y, xに対応させる。
function addFunction(grid, size, func) {
	for (let k = 0; k < size; k++) {
		for (let j = 0; j < size; j++) {
			for (let i = 0; i < size; i++) {
				let index = (size * size * k) + (size * j) + i;				
				//	gridの 0 〜 size 範囲を -1 〜 1 に写像
				let x = i * 2 / size - 1;
				let y = j * 2 / size - 1;
				let z = k * 2 / size - 1;
				grid[index] += func(x, y, z);
			}
		}
	}	
}

window.onload = function (e) {
	//	実験環境の準備
	lab = new Lab("canvas-frame");
	lab.setup({shadow:true, useTrackball:true, floor:{width:60, height:60}});

	//	マーチングキューブス法を実行するオブジェクト
	let mc = new MarchingCubes(20, 0.0);
	//	gridに濃度を設定
	addFunction(mc.grid, mc.size, (x, y, z) => {
		//	y = x^2 の式
		//	return (x * x) - y;

		//	半径0.5 原点を中心にした球体の式　
		return 0.5 - Math.sqrt(x * x + y * y + z * z);
	});
	
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

