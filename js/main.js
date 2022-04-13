//polygon class
class Polygon {
    vertices = [];
    geometry = new THREE.BufferGeometry()
    line = new THREE.Line();
    dot = new THREE.Points();
    mesh = new THREE.Mesh();
    shape = new THREE.Shape();
    shapeGeometry = new THREE.ShapeGeometry();
    mouse = new THREE.Vector3()
    lineMesh = new THREE.Mesh()
    extrudeSettings = {
        depth: 8,
        bevelEnabled: false
    };
    extrudeGeometry = new THREE.ExtrudeGeometry(this.shape, this.extrudeSettings);
    lineMaterial = new THREE.LineBasicMaterial({
        color: 0x00ff37,
        linewidth: 5
    });
    dotMaterial = new THREE.PointsMaterial({
        size: 8,
        color: 0x000
    });

    meshMaterial = new THREE.MeshBasicMaterial({
        color: 0xff7300
    });
    meshLineMaterial = new MeshLineMaterial({
        color: 0x000,
        lineWidth: 1
        
    });

    render() {



        this.extrudeGeometry = new THREE.ExtrudeGeometry(this.shape, this.extrudeSettings);

        this.mesh = new THREE.Mesh(this.extrudeGeometry, this.meshMaterial);
        scene.add(this.mesh);

        this.addLines()


        renderer.clear()
        renderer.render(scene, camera)
    }
    push(vertex) {

        if (this.vertices.length < 1) {
            this.shape.moveTo(vertex.x, vertex.y)
            console.log("move")
        } else {
            this.shape.lineTo(vertex.x, vertex.y);
            console.log(this.vertices.length)
        }
        this.vertices.push(vertex);
        this.updateGeometry()

    }
    updateGeometry() {
        this.geometry.setFromPoints(this.vertices);
        this.line = new THREE.Line(this.geometry, this.lineMaterial);
        this.dot = new THREE.Points(this.geometry, this.dotMaterial);
        this.dot.name = "dots"
        scene.add(this.line);
        scene.add(this.dot);
        renderer.render(scene, camera);
    }
    getMeshGeometry() {
        return this.mesh.clone()
    }
    getGeometry() {
        return this.geometry.clone();
    }
    addLines() {

        var line = new MeshLine();

        line.setPoints(this.vertices);

        this.lineMesh = new THREE.Mesh(line, this.meshLineMaterial);
        scene.add(this.lineMesh);

    }
    copyGeometry(polygon, mouse) {

        this.mesh = polygon.mesh.clone();
        this.lineMesh = polygon.lineMesh.clone()
        scene.add(this.mesh)
        scene.add(this.lineMesh)
        renderer.render(scene, camera);
    }
    moveGeometry(mouse) {
        this.mesh.position.set(mouse.x, mouse.y, mouse.z);
        this.lineMesh.position.set(mouse.x, mouse.y, mouse.z);
        this.mouse = mouse;
    }
}


var canvas = document.getElementById('main');
//renderer Initialization
var renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    preserveDrawingBuffer: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff)
document.body.appendChild(renderer.domElement);
canvas.onmousedown = onMouseDown;
canvas.onmousemove = onMouseMove;

//Camera
var camera = new THREE.OrthographicCamera(canvas.clientWidth / -20, canvas.clientWidth / 20, canvas.clientHeight / 20, canvas.clientHeight / -20, -1000, 1000);


//Initialize Scene

const scene = new THREE.Scene();
const size = 400;
const divisions = 40;
initializeScene()

function initializeScene() {

    const gridHelper = new THREE.GridHelper(size, divisions);
    gridHelper.geometry.rotateX(Math.PI / 2);
    scene.add(gridHelper);
    renderer.render(scene, camera)
}

//create new polygon

currentShape = new Polygon()
tempShape = new Polygon()
boardShape = new Polygon()
polygons = [];
copying = false
//on mouse input
function onMouseDown(event) {
    mouse = new THREE.Vector3();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    mouse.unproject(camera);
    mouse.z = 0;
    if (!copying) {
        currentShape.push(mouse);

    } else {

        copying = false
    }




}

function onMouseMove(event) {
    if (copying) {
        mouse = new THREE.Vector3();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        mouse.z = 0;
        mouse.unproject(camera);
        mouse.z = 0;

        tempShape.moveGeometry(mouse)
        renderer.render(scene, camera)
    }
}

function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

function renderPolygon() {
    currentShape.render();
    boardShape = currentShape;
    currentShape = new Polygon();

}

function copyPolygon() {
    copying = true
    tempShape = new Polygon();
    tempShape.copyGeometry(boardShape, mouse);
    polygons.push(tempShape);
}

function removeAll() {
    while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }
    currentShape = new Polygon()
    polygons = [];
    initializeScene()
}