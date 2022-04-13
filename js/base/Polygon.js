class polygon {
    vertices = [];
    geometry = new THREE.BufferGeometry()
    line = new THREE.Line();
    dot = new THREE.Points();
    lineMaterial = new THREE.LineBasicMaterial({
        color: 0x00ff37
    });
    dotMaterial = new THREE.PointsMaterial({
        size: 10,
        color: 0xff0000
    });
    render() {
        scene.add()
    }
    push(vertex) {
        this.vertices.push(vertex);
        this.updateGeometry
        scene.add(line);
    }
    updateGeometry() {
        this.line = new THREE.Line(geometry, lineMaterial);
        this.dot = new THREE.Points(geometry, dotMaterial);
    }
}