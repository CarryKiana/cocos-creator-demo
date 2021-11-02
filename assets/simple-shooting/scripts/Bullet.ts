
import { _decorator, Component, Node, Vec3, ColliderComponent, RigidBodyComponent, ICollisionEvent } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Bullet
 * DateTime = Tue Nov 02 2021 10:43:53 GMT+0800 (中国标准时间)
 * Author = carryKiana
 * FileBasename = Bullet.ts
 * FileBasenameNoExtension = Bullet
 * URL = db://assets/simple-shooting/scripts/Bullet.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */
 
@ccclass('Bullet')
export class Bullet extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;
    private _collider: ColliderComponent = null;
    private _rigidBody: RigidBodyComponent = null;
    private _flyTime: number = 0;
    private _autoDestoryTime: number = 5;

    onLoad () {
        this._collider = this.node.getComponent(ColliderComponent);
        this._rigidBody = this.node.getComponent(RigidBodyComponent);

        this._collider.on('onCollisionEnter', this.onCollisionEnter, this)
    }

    start () {
        // [3]
    }

    init (velocity: Vec3) {
        this._rigidBody.setLinearVelocity(velocity)
    }
    
    onCollisionEnter (event: ICollisionEvent) {
        // if (event.otherCollider.node.name == 'AirWell' ||
        //     event.otherCollider.node.name == 'Monster' ||
        //     event.otherCollider.node.name == 'tree') {
        //     this.node.destroy();
        // }
    }
    update (deltaTime: number) {
        this._flyTime += deltaTime;
        if (this._flyTime >= this._autoDestoryTime) {
            this.node.destroy();
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
