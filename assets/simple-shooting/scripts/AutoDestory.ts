
import { _decorator, Component, Node, CCFloat } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = AutoDestory
 * DateTime = Tue Nov 02 2021 11:29:29 GMT+0800 (中国标准时间)
 * Author = carryKiana
 * FileBasename = AutoDestory.ts
 * FileBasenameNoExtension = AutoDestory
 * URL = db://assets/simple-shooting/scripts/AutoDestory.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */
 
@ccclass('AutoDestory')
export class AutoDestory extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;
    @property({ type: CCFloat })
    public destroyTime: number = 1;

    private _curPassedTime: number = 0;

    start () {
        // [3]
    }

    update (deltaTime: number) {
        this._curPassedTime += deltaTime;
        if (this._curPassedTime > this.destroyTime) {
            this.node.destroy()
        }
    }
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
