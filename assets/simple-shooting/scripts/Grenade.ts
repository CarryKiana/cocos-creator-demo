
import { _decorator, Component, Node, Vec3, ColliderComponent, RigidBodyComponent, PhysicsSystem, director, Scene, Prefab, instantiate, Event } from 'cc';
import { Utils } from './Utils'
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Grenade
 * DateTime = Mon Nov 01 2021 17:18:54 GMT+0800 (中国标准时间)
 * Author = carryKiana
 * FileBasename = Grenade.ts
 * FileBasenameNoExtension = Grenade
 * URL = db://assets/simple-shooting/scripts/Grenade.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */
 
@ccclass('Grenade')
export class Grenade extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;
    @property({ type: Prefab })
    public explosionPrfb: Prefab = null;

    private _collider: ColliderComponent = null;
    private _rigidBody: RigidBodyComponent = null;
    private _flyTime: number = 0;
    private _autoDestoryTime: number = 3;
    private _explosionForce = 100;
    private _explosionRadius = 10;

    onLoad () {
        this._collider = this.node.getComponent(ColliderComponent);
        this._rigidBody = this.node.getComponent(RigidBodyComponent);
        this._collider.on('onCollisionEnter', this.onCollisionEnter, this)
    }

    start () {
        // [3]
    }

    init (force: Vec3) {
        this._rigidBody.applyImpulse(force, new Vec3(0, -1, 0))
    }

    onCollisionEnter (event: Event) {
        this.explosion();
    }

    explosion () {
        this.node.destroy();
        const scene : Scene = director.getScene();
        const explosion : any = instantiate(this.explosionPrfb);
        scene.addChild(explosion)
        explosion.setWorldPosition(this.node.getWorldPosition());

        const children:any[] = scene.children;
        children.forEach((node:Node) => {
            Utils.walkNode(node, (node:Node) => {
                const rigid = node.getComponent(RigidBodyComponent);
                if (rigid) {
                    const dir = new Vec3();
                    Vec3.subtract(dir, node.getWorldPosition(), this.node.getWorldPosition());
                    const dist: number = dir.length();
                    if (dist < this._explosionRadius) {
                        dir.normalize();
                        Vec3.multiplyScalar(dir, dir, this._explosionForce / dist);
                        rigid.applyImpulse(dir)
                    }
                }
            })
        })
    }

    update (deltaTime: number) {
        // [4]
        this._flyTime += deltaTime;
        if (this._flyTime >= this._autoDestoryTime) {
            this.explosion()
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
