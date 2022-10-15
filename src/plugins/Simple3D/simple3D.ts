import {
    Engine, 
    Light, 
    Vector3, 
    Scene, 
    Color4, 
    Color3,
    ArcRotateCamera,
    DefaultRenderingPipeline,
    Quaternion,
    ActionManager,
    ExecuteCodeAction,
    MeshBuilder,
    Space,
    StandardMaterial,
    HemisphericLight,
    AxesViewer
} from '@babylonjs/core';
import { GridMaterial } from '@babylonjs/materials/grid';
import Stats from 'stats.js';


export class utils {
	/**********Functions to Rotate and Scale based on a Pivot***************/
	static rotateAroundPivot = (mesh:any , pivotPoint:any, axis:any, angle:any) => {
		if(!mesh._rotationQuaternion) {
			mesh._rq = Quaternion.RotationYawPitchRoll(mesh.rotation.y, mesh.rotation.x, mesh.rotation.z);
		}		
		const _p = new Quaternion(mesh.position.x - pivotPoint.x, mesh.position.y - pivotPoint.y, mesh.position.z - pivotPoint.z, 0);
		axis.normalize();
		const _q = Quaternion.RotationAxis(axis,angle);  //form quaternion rotation		
		const _qinv = Quaternion.Inverse(_q);	
		const _pdash = _q.multiply(_p).multiply(_qinv);
		mesh.position = new Vector3(pivotPoint.x + _pdash.x, pivotPoint.y + _pdash.y, pivotPoint.z + _pdash.z);
		mesh.rotationQuaternion = mesh._rq.multiply(_q);
		mesh._rq = mesh.rotationQuaternion;
	}
	
	static scaleFromPivot = (mesh:any, pivotPoint:any, sx:any, sy:any, sz:any) => {
		const _sx = sx / mesh.scaling.x;
		const _sy = sy / mesh.scaling.y;
		const _sz = sz / mesh.scaling.z;
		mesh.scaling = new Vector3(sx, sy, sz);	
		mesh.position = new Vector3(pivotPoint.x + _sx * (mesh.position.x - pivotPoint.x), pivotPoint.y + _sy * (mesh.position.y - pivotPoint.y), pivotPoint.z + _sz * (mesh.position.z - pivotPoint.z));
	}
	/**********************************************************************/
}

class domEvents {
    
    click(mesh:any, scene:any, callBack:()=>void){
        mesh.isPickable = true;
        mesh.actionManager ??= new ActionManager(scene); 
        mesh.actionManager.registerAction(
            new ExecuteCodeAction(
                ActionManager.OnPickTrigger,
                callBack
            ));
    }

    leftClick(mesh:any, scene:any, callBack:()=>void){
        mesh.isPickable = true;
        mesh.actionManager ??= new ActionManager(scene); 
        mesh.actionManager.registerAction(
            new ExecuteCodeAction(
                ActionManager.OnLeftPickTrigger,
                callBack
            ));
    }

    rightClick(mesh:any, scene:any, callBack:()=>void){
        mesh.isPickable = true;
        mesh.actionManager ??= new ActionManager(scene); 
        mesh.actionManager.registerAction(
            new ExecuteCodeAction(
                ActionManager.OnRightPickTrigger,
                callBack
            ));
    }

    centerClick(mesh:any, scene:any, callBack:()=>void){
        mesh.isPickable = true;
        mesh.actionManager ??= new ActionManager(scene); 
        mesh.actionManager.registerAction(
            new ExecuteCodeAction(
                ActionManager.OnCenterPickTrigger,
                callBack
            ));
    }
    doubleClick(mesh:any, scene:any, callBack:()=>void){
        mesh.isPickable = true;
        mesh.actionManager ??= new ActionManager(scene); 
        mesh.actionManager.registerAction(
            new ExecuteCodeAction(
                ActionManager.OnDoublePickTrigger,
                callBack
            ));
    }

    longClick(mesh:any, scene:any, callBack:()=>void){
        mesh.isPickable = true;
        mesh.actionManager ??= new ActionManager(scene); 
        mesh.actionManager.registerAction(
            new ExecuteCodeAction(
                ActionManager.OnLongPressTrigger,
                callBack
            ));
    }


    mouseEnter(mesh:any, scene:any, callBack:()=>void){
        mesh.actionManager ??= new ActionManager(scene); 
        mesh.actionManager.registerAction(
            new ExecuteCodeAction(
                ActionManager.OnPointerOverTrigger,
                callBack
            ));
    }

    mouseExit(mesh:any, scene:any, callBack:()=>void){
        mesh.actionManager ??= new ActionManager(scene); 
        mesh.actionManager.registerAction(
            new ExecuteCodeAction(
                ActionManager.OnPointerOutTrigger,
                callBack
            ));
    }

    intersect(mesh1:any , mesh2:any, scene, callBack:()=>void , type : 'enter' | 'exit' = 'enter'){
        mesh1.actionManager ??= new ActionManager(scene); 
        const event = type == 'enter' ? ActionManager.OnIntersectionEnterTrigger : ActionManager.OnIntersectionEnterTrigger; 
        mesh1.actionManager.registerAction(
            new ExecuteCodeAction( {
                trigger: event, 
                parameter: { 
                    mesh: mesh2, 
                    usePreciseIntersection: true
                }
            } ,
                callBack
            ));
    }

}

export class sphere3D {
    scene : any;
    mesh: any;
    type: string = 'Sphere';
    diameter: number;
    segments: number;
    constructor(params: {
        diameter?: number,
        segments?: number,
    }={}) {
        this.diameter = params.diameter || 2;
        this.segments = params.segments || 16;
        this.mesh = MeshBuilder.CreateSphere('sphere1', {
            diameter: this.diameter,
            segments: this.segments
        });
        this.mesh.position.y = 1;
    }
    attachScene(scene: any): void {
        this.scene = scene;
        this.scene.addMesh(this.mesh);
    }
}

export class ground2D {
    scene : any;
    mesh: any;
    material: any;
    type: string = 'Sphere';

    get= {
        x: () => this.mesh.position.x,
        y: () => this.mesh.position.y,
        z: () => this.mesh.position.z,

    }

    set={
        x: (x: number) => this.mesh.position.x = x,
        y: (y: number) => this.mesh.position.y = y,
        z: (z: number) => this.mesh.position.z = z,
        scale: (x:number=1, z:number=1) => {
            this.mesh.scaling.x = x;
            this.mesh.scaling.z = z;
            return this;
        },
        rotation: (x:number=0, y:number=0, z:number=0) => {
            this.mesh.rotation.x = x;
            this.mesh.rotation.y = y;
            this.mesh.rotation.z = z;
            return this;
        },
        grid : (show: boolean = true, params:{
            lineColor:string, 
            mainColor:string,
            opacity:number,
        } = {
            lineColor: '#ffffff', 
            mainColor: '#000000',
            opacity: 0.4,
        }) => {
            if(show){
                this.material = new GridMaterial("groundMaterial", this.scene);
                this.material.gridRatio = 0.01;
                this.material.minorUnitVisibility = 0.7;
                this.material.majorUnitFrequency  = 10;
                this.material.useMaxLine=true;

                this.material.mainColor = Color4.FromHexString(params.mainColor);
                this.material.lineColor = Color4.FromHexString(params.lineColor);
                this.material.opacity = params.opacity;

                this.material.backFaceCulling = false;
                this.mesh.material = this.material;
            } else {
                this.mesh.material = null;
            }
        }
    }
    constructor(params:{
        name?: string,
        width?: number,
        height?: number,
    }={}) {
       this.mesh = MeshBuilder.CreateGround(
        params.name || 'ground1', {
            width: params.width || 10,
            height: params.height || 10,
       });
    }
    attachScene(scene: any): void {
        this.scene = scene;
        this.scene.addMesh(this.mesh);
    }

    detachScene(scene: any): void {
        this.scene = scene;
        this.scene.removeMesh(this.mesh);
    }
}

export class box3D extends domEvents {

    type: string = 'box3D';
    scene : any;
    mesh: any;
    material:any;

    #name: string = this.type;
    #color: string = '#ffffff';
    #x: number = 0;
    #y: number = 0;
    #z: number = 0;
    
    #showEdge: boolean = false;
    #edgeColor: string = '#bcbec299';
    #edgeWidth: number = 1;

    #origin:'center'|'corner' = 'corner';
    ////////////////////////////////
    test(){
        this.x = 1;
    }
    get x() { return this.#x};
    get y() { return this.#y};
    get z() { return this.#z};
    set x(x: number) { 
        this.#x = x;
        if(this.origin === 'center'){
            this.mesh.position.x = x;
        } else {
            this.mesh.position.x = x + this.mesh.scaling.x / 2;
        }
    }
    set y(y: number) {
        this.#y = y;
        if(this.origin === 'center'){
            this.mesh.position.y = y;
        } else {
            this.mesh.position.y = y + this.mesh.scaling.y / 2;
        }
    }
    set z(z: number) {
        this.#z = z;
        if(this.origin === 'center'){
            this.mesh.position.z = z;
        } else {
            this.mesh.position.z = z + this.mesh.scaling.z / 2;
        }
    }
    /////////////////////////////////
    get width() { return this.mesh.scaling.x};
    get height() { return this.mesh.scaling.y};
    get depth() { return this.mesh.scaling.z};
    set width(width: number) { 
        if(this.origin === 'center'){
            this.mesh.scaling.x = width;
        } else {
            const pivotAt = this.get.corner();
            utils.scaleFromPivot(this.mesh, pivotAt, width, this.height, this.depth);
        }
    };
    set height(height: number) {
        if(this.origin === 'center'){
            this.mesh.scaling.y = height;
        } else {
            const pivotAt = this.get.corner();
            utils.scaleFromPivot(this.mesh, pivotAt, this.width, height, this.depth);
        }
    };
    set depth(depth: number) {
        if(this.origin === 'center'){
            this.mesh.scaling.z = depth;
        } else {
            const pivotAt = this.get.corner();
            utils.scaleFromPivot(this.mesh, pivotAt, this.width, this.height, depth);
        }
    };
    ////////////////////////////////
    get origin() {
        return this.#origin;
    }

    set origin(origin: 'center' | 'corner') {
        this.#origin = origin;
    }

    //////////////////////////////////

    get opacity() {
        return this.material.alpha;
    }
    set opacity(opacity: number) {
        this.material.alpha = opacity;
    }


    get = {
        x: () => this.#x,
        y: () => this.#y,
        z: () => this.#z,
        width: () => this.mesh.scaling.x,
        height: () => this.mesh.scaling.y,
        depth: () => this.mesh.scaling.z,
        scale:() => this.mesh.scaling,
        opacity: () => this.material.alpha,
        color: () => this.#color,
        showEdge: () => this.#showEdge,
        edgeColor: () => this.#edgeColor,
        edgeWidth: () => this.#edgeWidth,
        corner: ():Vector3 => {
            return new Vector3(
                this.mesh.position.x - this.mesh.scaling.x / 2, 
                this.mesh.position.y - this.mesh.scaling.y / 2,
                this.mesh.position.z - this.mesh.scaling.z / 2);
        },
        center: ():Vector3 => {
            return new Vector3(
                this.mesh.position.x, 
                this.mesh.position.y,
                this.mesh.position.z);
        }
    }

    set = {
        x: (x: number) => { 
            this.x = x; 
            return this;
        },
        y: (y: number) => {
            this.y = y;
            return this;
        } ,
        z: (z: number) => {
            this.z = z;
            return this;
        } ,
        pivotRotate: (pivot:Vector3, axis:Vector3, angle:number ) => {
            utils.rotateAroundPivot(this.mesh, pivot, axis, angle);
            return this;
        },
        rotation:(axis:Vector3, angle:number , space:any =Space.LOCAL)=> {
            this.mesh.rotate(axis, angle, space);
            return this;
        },
        position: (x: number, y: number, z: number) => {
            this.mesh.position.x = x;
            this.mesh.position.y = y;
            this.mesh.position.z = z;
            return this;
        },
        opacity: (opacity: number) => {
            this.material.alpha = opacity;
            return this;
        },
        edge: (show: boolean, color: string = '#bcbec299', width: number = 3) => {
            if(show){
                this.#showEdge = true;
                this.#edgeColor = color;
                this.#edgeWidth = width;
                this.mesh.enableEdgesRendering();
                this.mesh.edgesWidth = width;
                this.mesh.edgesColor = Color4.FromHexString(color);
            } else {
                this.#showEdge = false;
                this.mesh.disableEdgesRendering();
            }
            return this;
        },
        origin: (origin: 'center' | 'corner') => {
            this.#origin = origin;
            return this;
        },
        scale: (width: number=1, height: number=1, depth: number=1) => {
            if(this.#origin === 'corner'){
                const pivotAt = this.get.corner();
                utils.scaleFromPivot(this.mesh, pivotAt, width, height, depth);
            } else {
                this.mesh.scaling.y = height;
                this.mesh.scaling.x = width;
                this.mesh.scaling.z = depth;
            }
            return this; 
        }

    }
    constructor(params:{
        name?: string,
        width?: number,
        height?: number,
        depth?: number,
        opacity?: number,
        color?: string,
        showEdge?: boolean,
        edgeColor?: string,
        edgeWidth?: number,

        material?: any,
        mesh?: any,
    }={
        width: 1,
        height: 1,
        depth: 1,
        opacity: 1,
    }) {
        super();
        this.#name = params.name || this.#name;
        this.#color = params.color || this.#color;
        this.#showEdge = params.showEdge || this.#showEdge;
        this.#edgeColor = params.edgeColor || this.#edgeColor;
        this.#edgeWidth = params.edgeWidth || this.#edgeWidth;

        if(!params.material){
            this.material = new StandardMaterial("mat");
            this.material.diffuseColor = Color3.FromHexString(this.#color);
            this.material.alpha = params.opacity || 1;
        } else {
            this.material = params.material;
        }

        if(!params.mesh){
            params.height = params.height || 1;
            this.mesh = MeshBuilder.CreateBox(this.#name);
            this.set.position(0.5, 0.5, 0.5);
            this.set.scale(params.width, params.height, params.depth);
        }   else {
            this.mesh = params.mesh;
        }

        this.mesh.material = this.material;

        if(this.#showEdge){
            this.set.edge(true , this.#edgeColor , this.#edgeWidth);
        }
    }
    attachScene(scene: any): void {
        this.scene = scene;
        this.scene.addMesh(this.mesh);
        this.scene.addMaterial(this.material, "mat");
    }

    detachScene(scene: any): void {
        this.scene = scene;
        this.scene.removeMesh(this.mesh);
        this.scene.removeMaterial(this.material, "mat");
    }

    on(event:event, callBack:()=>void){
        super[event](this.mesh, this.scene, callBack);
    }
    intersect(mesh:any, callBack:()=>void, type : 'enter' | 'exit' = 'enter'){
        super.intersect(this.mesh, mesh, this.scene, callBack, type);
    }
}

export class Simple3D {
    canvasID: string;
    canvas: HTMLCanvasElement;
    engine: Engine;
    scene: any;
    camera: any;
    light: Light | undefined;
    stats: any;
    pipeline: any;
    localAxes: any;
    resizeObs :any;
  
    static pointer:any = {event:undefined,pickResult:undefined } ;
    static yAxis = new Vector3(0, 1, 0);
    static xAxis = new Vector3(1, 0, 0);
    static zAxis = new Vector3(0, 0, 1);

    static box3D:typeof box3D = box3D;
    static sphere3D:typeof sphere3D = sphere3D;
    static ground2D:typeof ground2D = ground2D;
    static utils: typeof utils = utils;


    constructor(canvasID: string) {
        this.canvasID = canvasID;
        this.canvas = document.getElementById(this.canvasID) as HTMLCanvasElement;
        this.engine = new Engine(this.canvas, true, {
            preserveDrawingBuffer: true, 
            stencil: true,
            premultipliedAlpha: false,
            antialias: true,
            alpha: true
        });
        const _this = this;
        this.resizeObs = new ResizeObserver(() => _this.engine.resize());
        this.resizeObs.observe(this.canvas);
        this.createScene();
        this.createCamera();
        this.createLights();
        this.createStats();
        // this.createPostProcess();
    }

    createScene(): void {
        this.scene = new Scene(this.engine);
        this.scene.clearColor = new Color4(0,0,0,1).toLinearSpace();
        this.scene.onPointerDown = function (event, pickResult){
            Simple3D.pointer = {
                event,
                pickResult
            }
        }
    }

    createStats(): void {
        this.stats = new Stats();
        this.stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild( this.stats.dom );
        this.showStats(false);
    }

    
    showStats(show = true){
        this.stats.dom.style.display = show ? 'block' : 'none';
        return this;
    }

    createCamera(): void {
        this.camera = new ArcRotateCamera("Camera", 0, 0, 0, new Vector3(0, 0, 0), this.scene);
        this.camera.upperBetaLimit = Math.PI/2 - 0.2 ;
        this.camera.panningAxis = new Vector3(1, 0, 0);
        this.camera.inertia = 0.9;
        this.camera.lowerRadiusLimit = 6;
        this.camera.upperRadiusLimit = 40;
        this.camera.setPosition(new Vector3(10, 5, 15));
        this.camera.setTarget(Vector3.Zero());
        this.camera.attachControl(this.canvas, true);
    }

    createPostProcess(): void {
        this.pipeline = new DefaultRenderingPipeline(
            "defaultPipeline", // The name of the pipeline
            false, // Do you want the pipeline to use HDR texture?
            this.scene, // The scene instance
            this.scene.cameras // The list of cameras to be attached to
        );
        this.pipeline.samples = 4;
        this.pipeline.fxaaEnabled = true;
        this.pipeline.imageProcessing.toneMappingEnabled = true;

    }
    createLights(): void {
        this.light = new HemisphericLight('light1', new Vector3(0, 1, 0), this.scene);
        this.light.intensity = 0.7;
    }

    showAxis(show:boolean = true, size:number = 1) {
        if(this.localAxes){
            this.localAxes.dispose();
            this.localAxes = undefined;   
        }
        if(show){
            this.localAxes = new AxesViewer(this.scene, size);
        }
        return this;

    }

    render(params:any[] = []) {
        this.engine.runRenderLoop(() => {
            this.stats.begin();
            params.forEach(update => update());
            this.scene.render();
            this.stats.end();
        });
        return this;
    }

    add(object: any) {
        if(object.type)
         object.attachScene(this.scene);
        return this;
    }

    remove(object: any) {
        if(object.type)
            object.detachScene(this.scene);
        return this;
    }

    dispose(){
        this.resizeObs.unobserve(this.canvas);
        this.engine.dispose();
    }

}

type event = 
'click' | 
'leftClick'| 
'rightClick' | 
'centerClick' |
'doubleClick' |
'longClick' |
'mouseEnter' |
'mouseExit'


