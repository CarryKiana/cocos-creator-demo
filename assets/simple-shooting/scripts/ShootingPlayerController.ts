
import { _decorator, Component, Node, AnimationComponent, systemEvent, SystemEvent, KeyCode, Vec3, math, game, Quat, CCFloat, Prefab, director, instantiate, Scene, EventMouse, AnimationClip } from 'cc';
import { Bullet} from './Bullet';
import { ActionType } from './GameDefines';
import { Grenade } from './Grenade';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = ShootingPlayerController
 * DateTime = Wed Nov 03 2021 10:14:00 GMT+0800 (中国标准时间)
 * Author = carryKiana
 * FileBasename = ShootingPlayerController.ts
 * FileBasenameNoExtension = ShootingPlayerController
 * URL = db://assets/simple-shooting/scripts/ShootingPlayerController.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */
enum PlayerAnimState {
    None,
    Idle,
    Running,
    Jumping,
    Shooting
}

enum MoveDir {
    Left,
    Right,
    Forward,
    Backward
}

const tempVec3_a = new Vec3();
const tempVec3_b = new Vec3();
const tempQuat_a = new Quat();

@ccclass('ShootingPlayerController')
export class ShootingPlayerController extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;
    @property({ type: CCFloat })
    public moveSpeed: number = 1;
    @property({ type: Prefab })
    public BulletPrefab: Prefab = null;
    @property({ type: Prefab })
    public grenatePrfb: Prefab = null;
    @property({ type: Node })
    public firePoint: Node = null;
    @property({ type: Node })
    public throwPoint: Node = null;
    @property({ type: Node })
    public verticalViewNode: Node = null;
    @property({ type: CCFloat })
    public viewUpAngle: number = 60;
    @property({ type: CCFloat })
    public viewDownAngle: number = -60;

    private _animComp: AnimationComponent = null;
    private _animState: PlayerAnimState = PlayerAnimState.None;
    private _animStateToNameMap: any = {};
    private _moveDirMap: any = {};
    private _velocity: Vec3 = new Vec3();
    private _rotHorizontalSpeed: number = 0.005;
    private _rotVerticalSpeed: number = 0.002;
    private _bulletSpeed: number = 50;
    private _grenadeForce: number = 50;

    onLoad () {
        // 键盘监听
        systemEvent.on(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        systemEvent.on(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);

        // 鼠标监听
        systemEvent.on(SystemEvent.EventType.MOUSE_UP, this.onMouseUp, this);
        systemEvent.on(SystemEvent.EventType.MOUSE_DOWN, this.onMouseDown, this);
        // systemEvent.on(SystemEvent.EventType.MOUSE_MOVE, this.onMouseMove, this);

        // 触摸监听
        systemEvent.on(SystemEvent.EventType.TOUCH_MOVE, this.onTouchMove, this);

        this._animStateToNameMap[PlayerAnimState.Idle] = 'Ar|Idle';
        this._animStateToNameMap[PlayerAnimState.Running] = 'Ar|Run';
        this._animStateToNameMap[PlayerAnimState.Jumping] = 'Ar|Jump';
        this._animStateToNameMap[PlayerAnimState.Shooting] = 'Ar|ShootTorsoArmsRifle';

        this._moveDirMap[MoveDir.Left] = new Vec3(1, 0, 0);
        this._moveDirMap[MoveDir.Right] = new Vec3(-1, 0, 0);
        this._moveDirMap[MoveDir.Forward] = new Vec3(0, 0, 1);
        this._moveDirMap[MoveDir.Backward] = new Vec3(0, 0, -1);
    }

    start () {
        const rootNode = this.node.getChildByName('RootNode')
        this._animComp = rootNode.getComponent(AnimationComponent);
        this._animComp.on(AnimationComponent.EventType.LASTFRAME, this.onAnimationEnd, this)
        this.changeToAnimState(PlayerAnimState.Idle);
    }

    doAction (action: ActionType, enable: boolean) {
        switch(action) {
            case ActionType.Forward:
                if (enable) {
                    this._velocity.z = 1;
                    this.changeToAnimState(PlayerAnimState.Running);
                } else {
                    if (this._velocity.z > 0) {
                        this._velocity.z = 0;
                    }
                    this.checkToIdle();
                }
                break;
            case ActionType.Backward:
                if (enable) {
                    this._velocity.z = -1;
                    this.changeToAnimState(PlayerAnimState.Running);
                } else {
                    if (this._velocity.z < 0) {
                        this._velocity.z = 0;
                    }
                    this.checkToIdle();
                }
                break;
            case ActionType.Left:
                if (enable) {
                    this._velocity.x = 1;
                    this.changeToAnimState(PlayerAnimState.Running);
                } else {
                    if (this._velocity.x > 0) {
                        this._velocity.x = 0;
                    }
                    this.checkToIdle();
                }
                break;
            case ActionType.Right:
                if (enable) {
                    this._velocity.x = -1;
                    this.changeToAnimState(PlayerAnimState.Running);
                } else {
                    if (this._velocity.x < 0) {
                        this._velocity.x = 0;
                    }
                    this.checkToIdle();
                }
                break;
            case ActionType.Shoot:
                if (enable) {
                    this.changeToAnimState(PlayerAnimState.Shooting);
                    this.shoot();
                }
                break;
            case ActionType.ThrowGrenade:
                if (enable) {
                    this.throwGrenade();
                }
                break;
        }
    }

    onKeyDown (event) {
        switch(event.keyCode) {
            case KeyCode.KEY_A:
                this.doAction(ActionType.Left, true);
                break;
            case KeyCode.KEY_D:
                this.doAction(ActionType.Right, true);
                break;
            case KeyCode.KEY_W:
                this.doAction(ActionType.Forward, true);
                break;
            case KeyCode.KEY_S:
                this.doAction(ActionType.Backward, true);
                break;
            case KeyCode.KEY_G:
                this.doAction(ActionType.ThrowGrenade, true);
                break;
            case KeyCode.SPACE:
                // this.changeToAnimState(PlayerAnimState.Jumping);
                break;
        }
    }

    checkToIdle () {
        if (this._velocity.x === 0 &&
            this._velocity.y === 0 &&
            this._velocity.z === 0) {
                this.changeToAnimState(PlayerAnimState.Idle)
        }
    }

    onKeyUp (event) {
        switch(event.keyCode) {
            case KeyCode.KEY_A:
                this.doAction(ActionType.Left, false);
                break;
            case KeyCode.KEY_D:
                this.doAction(ActionType.Right, false);
                break;
            case KeyCode.KEY_W:
                this.doAction(ActionType.Forward, false);
                break;
            case KeyCode.KEY_S:
                this.doAction(ActionType.Backward, false);
                break;
            case KeyCode.SPACE:
                break;
        }
    }

    onMouseDown (event) {
        if (event.getButton() === 2) {
            game.canvas.requestPointerLock?.();
        }
    }

    onMouseUp (event) {
        if (event.getButton() === 0) { // 左键
            this.changeToAnimState(PlayerAnimState.Shooting);
            this.shoot();
        } else if (event.getButton() === 2) {
            document.exitPointerLock?.();
        }
    }

    onMouseMove (event: EventMouse) {
        if (event.movementX != 0) {
            const horizontalRot = this.node.getRotation();
            Quat.rotateAround(horizontalRot, horizontalRot, Vec3.UNIT_Y, -event.movementX * this._rotHorizontalSpeed);
            this.node.setRotation(horizontalRot)
        }

        if (event.movementY != 0) {
            const verticalRot = this.verticalViewNode.getRotation();
            Quat.rotateAround(verticalRot, verticalRot, Vec3.UNIT_X, event.movementY * this._rotVerticalSpeed);
            verticalRot.getEulerAngles(tempVec3_a);
            if (tempVec3_a.x > this.viewDownAngle && tempVec3_a.x < this.viewUpAngle) {
                this.verticalViewNode.setRotation(verticalRot);
            }
        }
    }

    onTouchMove (event) {
        if (event.getDelta().x != 0) {
            const horizontalRot = this.node.getRotation();
            Quat.rotateAround(horizontalRot, horizontalRot, Vec3.UNIT_Y, -event.getDelta().x * this._rotHorizontalSpeed);
            this.node.setRotation(horizontalRot)
        }

        if (event.getDelta().y != 0) {
            const verticalRot = this.verticalViewNode.getRotation();
            Quat.rotateAround(verticalRot, verticalRot, Vec3.UNIT_X, event.getDelta().y * this._rotVerticalSpeed);
            verticalRot.getEulerAngles(tempVec3_a);
            if (tempVec3_a.x > this.viewDownAngle && tempVec3_a.x < this.viewUpAngle) {
                this.verticalViewNode.setRotation(verticalRot);
            }
        }
    }

    changeToAnimState (state: PlayerAnimState) {
        if (this._animState === PlayerAnimState.Idle) {
            if (this._animState !== state) {
                this._animComp.play(this._animStateToNameMap[state]);
                this._animState = state;
            }
        } else {
            if (state === PlayerAnimState.Idle) {
                this._animComp.play(this._animStateToNameMap[state]);
                this._animState = state;
            }
        }
    }

    onAnimationEnd(type, state) {
        if (state.name === this._animStateToNameMap[PlayerAnimState.Shooting]) {
            this.changeToAnimState(PlayerAnimState.Idle)
        }
    }

    shoot () {
        let scene = director.getScene();
        let newBullet: any = instantiate(this.BulletPrefab);

        scene.addChild(newBullet);
        newBullet.setPosition(this.firePoint.getWorldPosition());
        const bullet: Bullet = newBullet.getComponent(Bullet);
        let dir = new Vec3(0, 0, 1);
        Vec3.transformQuat(dir, dir, this.firePoint.getWorldRotation());
        Vec3.multiplyScalar(dir, dir, this._bulletSpeed);
        bullet.init(dir);
    }

    throwGrenade () {
        let scene = director.getScene();
        let newGrenade: any = instantiate(this.grenatePrfb);
        scene.addChild(newGrenade);
        newGrenade.setPosition(this.throwPoint.getWorldPosition());
        const grenade: Grenade = newGrenade.getComponent(Grenade);
        let dir = new Vec3(0, 0, 1);
        Vec3.transformQuat(dir, dir, this.throwPoint.getWorldRotation());
        Vec3.multiplyScalar(dir, dir, this._grenadeForce);
        grenade.init(dir);
    }

    move (deltaTime: number) {
        let curPos = tempVec3_a;
        const dir = this._velocity;
        this.node.getWorldPosition(curPos);
        this.node.getWorldRotation(tempQuat_a);
        Vec3.transformQuat(tempVec3_b, dir, tempQuat_a);
        Vec3.scaleAndAdd(curPos, curPos, tempVec3_b, deltaTime * this.moveSpeed);
        this.node.setWorldPosition(curPos)
    }

    update (deltaTime: number) {
        if (this._animState === PlayerAnimState.Running) {
            this.move(deltaTime);
        }
    }

    onDestroy () {
        // 取消键盘监听
        systemEvent.off(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        systemEvent.off(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);

        // 取消鼠标监听
        systemEvent.off(SystemEvent.EventType.MOUSE_UP, this.onMouseUp, this);
        systemEvent.off(SystemEvent.EventType.MOUSE_DOWN, this.onMouseDown, this);
        // systemEvent.off(SystemEvent.EventType.MOUSE_MOVE, this.onMouseMove, this);

        // 取消触摸监听
        systemEvent.off(SystemEvent.EventType.TOUCH_MOVE, this.onTouchMove, this);
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
