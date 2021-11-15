
import { _decorator, Component, Node, CCFloat, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

let v3_a = new Vec3();
let v3_b = new Vec3();

/**
 * Predefined variables
 * Name = CameraFollow
 * DateTime = Mon Nov 15 2021 15:54:31 GMT+0800 (中国标准时间)
 * Author = carryKiana
 * FileBasename = CameraFollow.ts
 * FileBasenameNoExtension = CameraFollow
 * URL = db://assets/simple-run/scripts/CameraFollow.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */
 
@ccclass('CameraFollow')
export class CameraFollow extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    @property({ type: Node })
    public target: Node = null;
    @property({ type: CCFloat })
    public smoothSpeed: number = 0.125;
    @property(Vec3)
    public offset: Vec3 = new Vec3();
    @property(Vec3)
    public lookAtOffset: Vec3 = new Vec3();

    start () {
        // [3]
    }

    lateUpdate (deltaTime: number) {
        this.target.getWorldPosition(v3_a);
        Vec3.add(v3_b, v3_a, this.offset);
        Vec3.lerp(v3_b, this.node.position, v3_b, this.smoothSpeed);
        this.node.setWorldPosition(v3_b);

        Vec3.add(v3_a, v3_a, this.lookAtOffset);
        this.node.lookAt(v3_a);
    }
    // update (deltaTime: number) {
    //     // [4]
    // }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.3/manual/zh/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.3/manual/zh/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.3/manual/zh/scripting/life-cycle-callbacks.html
 */
