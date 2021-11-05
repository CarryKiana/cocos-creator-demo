
import { _decorator, Component, Node, Vec3, ColliderComponent, RigidBodyComponent, EventTouch } from 'cc';
import { ShootingPlayerController } from './ShootingPlayerController';
import { ActionType } from './GameDefines';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = InputControl
 * DateTime = Fri Nov 05 2021 16:01:29 GMT+0800 (中国标准时间)
 * Author = carryKiana
 * FileBasename = InputControl.ts
 * FileBasenameNoExtension = InputControl
 * URL = db://assets/simple-shooting/scripts/InputControl.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */
 
@ccclass('InputControl')
export class InputControl extends Component {
    @property({ type: [Node] })
    public actionButtons: Node[] = [];
    @property({ type: ShootingPlayerController })
    public playerCtrl: ShootingPlayerController = null;

    onLoad () {
        this.actionButtons.forEach((button) => {
            button.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
            button.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        })
    }

    onTouchStart(event:EventTouch) {
        const node = event.currentTarget as Node;
        if (node) {
            switch (node.name) {
                case 'Forward':
                    this.playerCtrl.doAction(ActionType.Forward, true);
                    break;
                case 'Backward':
                    this.playerCtrl.doAction(ActionType.Backward, true);
                    break;
                case 'Left':
                    this.playerCtrl.doAction(ActionType.Left, true);
                    break;
                case 'Right':
                    this.playerCtrl.doAction(ActionType.Right, true);
                    break;
                case 'Shoot':
                    this.playerCtrl.doAction(ActionType.Shoot, true);
                    break;
                case 'ThrowGrenade':
                    this.playerCtrl.doAction(ActionType.ThrowGrenade, true);
                    break;
            }
        }
    }

    onTouchEnd(event:EventTouch) {
        const node = event.currentTarget as Node;
        if (node) {
            switch(node.name) {
                case 'Forward':
                    this.playerCtrl.doAction(ActionType.Forward, false);
                    break;
                case 'Backward':
                    this.playerCtrl.doAction(ActionType.Backward, false);
                    break;
                case 'Left':
                    this.playerCtrl.doAction(ActionType.Left, false);
                    break;
                case 'Right':
                    this.playerCtrl.doAction(ActionType.Right, false);
                    break;
            }
        }
    }

    start () {
        // [3]
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
