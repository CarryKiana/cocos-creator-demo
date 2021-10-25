
import { _decorator, Component, Node, director } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = PhysicsConfig
 * DateTime = Mon Oct 25 2021 16:19:00 GMT+0800 (中国标准时间)
 * Author = carryKiana
 * FileBasename = PhysicsConfig.ts
 * FileBasenameNoExtension = PhysicsConfig
 * URL = db://assets/simple-shooting/scripts/PhysicsConfig.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */
 
@ccclass('PhysicsConfig')
export class PhysicsConfig extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;
    @property({ type: Node })
    envSprite: Node = null;


    start () {
        // [3]
        if (window['CC_PHYSICS_AMMO']) {
            this.envSprite.active = false
            director.loadScene('simple-shooting/scenes/Main', null, null)
        } else {
            this.envSprite.active = true
        }
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
