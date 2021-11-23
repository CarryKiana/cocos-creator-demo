
import { _decorator, Component, Node, SkeletalAnimationComponent, SkeletalAnimation, Vec3, CCFloat, systemEvent, SystemEvent, tween, AnimationComponent, Touch, ColliderComponent, ITriggerEvent, AudioClip, AudioSource } from 'cc';
import { GameDefines, GameState } from './GameDefines'
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = PlayerController
 * DateTime = Mon Nov 15 2021 15:56:39 GMT+0800 (中国标准时间)
 * Author = carryKiana
 * FileBasename = PlayerController.ts
 * FileBasenameNoExtension = PlayerController
 * URL = db://assets/simple-run/scripts/PlayerController.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

const tempVec3_a = new Vec3();

enum MoveAction {
    LEFT,
    RIGHT,
    UP
}

enum MoveState {
    RUNNING,
    MOVING_LEFT,
    MOVING_RIGHT,
    JUMPING
}

const cocosAnim = {
    idle: 'cocos_anim_idle',
    run: 'cocos_anim_run',
    jump: 'cocos_anim_jump'
}
 
@ccclass('PlayerController')
export class PlayerController extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;
    @property({ type: CCFloat })
    public speed: number = 1;

    @property({ type: SkeletalAnimationComponent })
    public playerAnimComp: SkeletalAnimationComponent = null;
    @property({ type: AudioClip })
    public coinAC: AudioClip = null;
    @property({ type: AudioClip })
    public jumpAC: AudioClip = null;

    public onTriggerCoin: (coinNode: Node) => void;
    public onTriggerBlock: (roadBlockNode: Node) => void;

    private _pressedX = 0;
    private _pressedY = 0;

    private _moveState: MoveState = MoveState.RUNNING;
    private _gameState: GameState = GameState.INIT;

    private _audioSourceComp: AudioSource = null;

    start () {
        this._audioSourceComp = this.getComponent(AudioSource);
    }

    onGameStateChanged (state: GameState) {
        switch (state) {
            case GameState.INIT: 
                this.onGameInit();
                break;
            case GameState.PLAYING:
                this.onGamePlaying();
                break;
            case GameState.END:
                this.onGameEnd();
                break;
        }

        this._gameState = state;
    }

    onGameInit () {
        console.log(this)
        this.playerAnimComp.play(cocosAnim.idle);
        this.node.setPosition(tempVec3_a.set(0, 0 , 0));
    }

    onGamePlaying () {
        this._moveState = MoveState.RUNNING;
        this.playerAnimComp.play(cocosAnim.run);
        console.log(this.playerAnimComp)
        this.playerAnimComp.on(AnimationComponent.EventType.LASTFRAME, this.onAnimationEnd, this)

        systemEvent.on(SystemEvent.EventType.TOUCH_START, this.onViewTouchStart, this);
        systemEvent.on(SystemEvent.EventType.TOUCH_END, this.onViewTouchEnd, this);

        this.bindCollider(true)
    }

    onGameEnd () {
        this.playerAnimComp.off(AnimationComponent.EventType.LASTFRAME, this.onAnimationEnd, this)

        systemEvent.off(SystemEvent.EventType.TOUCH_START, this.onViewTouchStart, this);
        systemEvent.off(SystemEvent.EventType.TOUCH_END, this.onViewTouchEnd, this);

        this.bindCollider(false)
    }

    onAnimationEnd (type, state) {
        if (state.name === cocosAnim.jump) {
            this.onJumpEnd(type, state)
        }
    }

    bindCollider(flag: Boolean) {
        const collider = this.getComponent(ColliderComponent);
        if (collider) {
            if (flag) {
                collider.on('onCollisionEnter', this.onTriggerEnter, this);
            } else {
                collider.off('onCollisionEnter', this.onTriggerEnter, this);
            }
        }
    }

    onTriggerEnter (event: ITriggerEvent) {
        const triggerNode:Node = event.otherCollider.node;
        if (triggerNode.name === 'Coin') {
            this._audioSourceComp.playOneShot(this.coinAC);
            if (this.onTriggerCoin) {
                this.onTriggerCoin(triggerNode);
            }
        } else if (triggerNode.name === 'RoadBlock') {
            const animComp = triggerNode.getComponent(AnimationComponent);
            const downName = 'block_down';
            const state = animComp.getState(downName);
            if (!state.isPlaying) {
                animComp.play(downName);
            }
            if (this.onTriggerBlock) {
                this.onTriggerBlock(triggerNode);
            }
        }
    }

    onViewTouchStart (event: Touch) {
        let location = event.getLocation();
        this._pressedX = location.x;
        this._pressedY = location.y;
    }

    onViewTouchEnd (event: Touch) {
        let touchPoint = event.getLocation();
        let endX = this._pressedX - touchPoint.x;
        let endY = this._pressedY - touchPoint.y;

        // 人物旋转180度面朝里，此时向左为x周正方向
        // 判断横纵轴哪个跨度大，以跨度大的为准
        if (Math.abs(endX) > Math.abs(endY)) {
            // 手势向左右
            if (endX > 0) {
                // 左
                this.move(MoveAction.LEFT);
            } else {
                // 右
                this.move(MoveAction.RIGHT);
            }
        } else {
            // 手势向上下
            if (endY > 0) {
                // down
            } else {
                this.move(MoveAction.UP)
            }
        }
    }

    move (moveAction: MoveAction) {
        switch (moveAction) {
            case MoveAction.LEFT:
                if (this._moveState === MoveState.RUNNING) {
                    tween(this.node)
                        .by(0.5, { position: new Vec3(GameDefines.leftLineX, 0, 0) }, { onComplete: () => {
                            this._moveState = MoveState.RUNNING;
                        }})
                        .start();
                    this._moveState = MoveState.MOVING_LEFT;
                }
                break;
            case MoveAction.RIGHT:
                if (this._moveState === MoveState.RUNNING) {
                    tween(this.node)
                        .by(0.5, { position: new Vec3(GameDefines.rightLineX, 0, 0) }, { onComplete: () => {
                            this._moveState = MoveState.RUNNING;
                        }})
                        .start();
                    this._moveState = MoveState.MOVING_RIGHT;
                }
                break;
            case MoveAction.UP:
                if (this._moveState === MoveState.RUNNING) {
                    this._audioSourceComp.playOneShot(this.jumpAC);
                    this.playerAnimComp.crossFade(cocosAnim.jump);
                    const state = this.playerAnimComp.getState(cocosAnim.jump);
                    state.speed = 1.5;
                    tween(this.node)
                        .by(0.75, { position: new Vec3(0, 0, 10) }, { onComplete: () => {
                            // 已在跳跃动画监听处理
                        }})
                        .start();
                    this._moveState = MoveState.JUMPING;
                    this.bindCollider(false);
                }
                break;
        }
    }

    onJumpEnd (type, state) {
        if (state?.name === cocosAnim.jump) {
            this.playerAnimComp.play(cocosAnim.run);
            this._moveState = MoveState.RUNNING;
            this.bindCollider(true);
        }
    }

    update (deltaTime: number) {
        if (this._gameState === GameState.PLAYING) {
            if (this._moveState === MoveState.JUMPING) {
                // this.node.translate(tempVec3_a.set(0, 0, this.speed * 1.5 * deltaTime));
            } else {
                this.node.translate(tempVec3_a.set(0, 0, this.speed * deltaTime));
            }
        }
    }

    onDestroy () {
        systemEvent.off(SystemEvent.EventType.TOUCH_START, this.onViewTouchStart, this);
        systemEvent.off(SystemEvent.EventType.TOUCH_END, this.onViewTouchEnd, this);
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
