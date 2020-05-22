//	mc.gridに濃度を設定
function setupGrid(mc, f) {
	for (let i = 0; i < mc.grid.length; i++) {
		let pos = mc.position(i);	
		mc.grid[i] = f(pos[0], pos[1], pos[2]);
	}
}

window.onload = function (e) {
	//	実験環境の準備
	lab = new Lab("canvas-frame");
	lab.setup({shadow:true, useTrackball:true, floor:{width:60, height:60}});

	//	マーチングキューブス法を実行するオブジェクト
	let mc = new MarchingCubes(20, 0.0);
	setupGrid(mc, (x, y, z) =>{
		//	球体の原点を0,0,0とし半径を0.5としている これで、球体の表面が0になる
		//		球体の式：半径^2 = (x - 原点x)^2 + (y - 原点y)^2 + (z - 原点z)^2 
		return 0.5 - Math.sqrt(x * x + y * y + z * z);

		//	y = x^2 の式を使うなら
		//	return (x * x) - y;
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

