
import { _decorator, Component, Prefab, instantiate, Node, Vec3, CCInteger } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = ShootingGameManager
 * DateTime = Mon Nov 01 2021 11:06:06 GMT+0800 (中国标准时间)
 * Author = carryKiana
 * FileBasename = ShootingGameManager.ts
 * FileBasenameNoExtension = ShootingGameManager
 * URL = db://assets/simple-shooting/scripts/ShootingGameManager.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */
 
@ccclass('ShootingGameManager')
export class ShootingGameManager extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    @property({ type: Prefab })
    public boxPrfb: Prefab = null;
    @property({ type: CCInteger })
    public bottomBoxNum: number = 5;

    start () {
        this.generateBoxes();
    }

    generateBoxes () {
        const bottomBoxNum = this.bottomBoxNum;
        const boxSize = 1;
        for (let i = 0; i < bottomBoxNum; i++) {
            for (let j = 0; j < (bottomBoxNum - i); j++) {
                const boxNode: Node = instantiate(this.boxPrfb);
                const posX = i * boxSize / 2 + j;
                const posY = i + 0.1;
                boxNode.parent = this.node;
                boxNode.setWorldPosition(new Vec3(posX, posY, -10));
            }
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
