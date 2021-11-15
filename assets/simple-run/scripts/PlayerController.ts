
import { _decorator, Component, Node, SkeletalAnimationComponent, Vec3, CCFloat, systemEvent, SystemEvent, tween, AnimationComponent, Touch, ColliderComponent, ITriggerEvent, AudioClip, AudioSource } from 'cc';
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
        this.playerAnimComp.play(cocosAnim.idle);
        this.node.setPosition(tempVec3_a.set(0, 0 , 0));
    }

    onGamePlaying () {
        this._moveState = MoveState.RUNNING;
        this.playerAnimComp.play(cocosAnim.run);

        const jumpState = this.playerAnimComp.getState(cocosAnim.jump);
        jumpState.on(AnimationComponent.EventType.FINISHED, this.onJumpEnd, this);

        systemEvent.on(SystemEvent.EventType.TOUCH_START, this.onViewTouchStart, this);
        systemEvent.on(SystemEvent.EventType.TOUCH_END, this.onViewTouchEnd, this);

        this.bindCollider(true)
    }

    onGameEnd () {
        const jumpState = this.playerAnimComp.getComponent(cocosAnim.jump);
        // todo
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

    onTriggerEnter (event: ITriggerEvent) {}

    onViewTouchStart (event: Touch) {}

    onViewTouchEnd (event: Touch) {}

    move (moveAction: MoveAction) {}

    onJumpEnd (type, state) {}

    update (deltaTime: number) {
        // [4]
    }

    onDestroy () {}
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
