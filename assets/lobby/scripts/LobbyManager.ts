import { _decorator, Component, Node, Prefab, instantiate, Vec3, Quat, tween, EventTouch, Touch,
    systemEvent, SystemEvent, EventMouse, CameraComponent, geometry, PhysicsSystem, assetManager, JsonAsset, MeshRenderer, BoxCollider, Texture2D, js, director, Vec2, game, find, log } from 'cc';
const { ccclass, property } = _decorator;
/**
 * Predefined variables
 * Name = LobbyManager
 * DateTime = Sat Oct 09 2021 15:56:02 GMT+0800 (中国标准时间)
 * Author = carryKiana
 * FileBasename = LobbyManager.ts
 * FileBasenameNoExtension = LobbyManager
 * URL = db://assets/lobby/scripts/LobbyManager.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */
const { Ray } = geometry
const tempQuat_a: Quat = new Quat()

interface ICoverData {
    name: string;
    coverImgUrl: string;
    sceneUrl: string;
}


@ccclass('Lobby')
export class Lobby extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;
    @property({type: Prefab})
    public coverPrfb: Prefab = null
    @property({type: CameraComponent})
    public mainCamera: CameraComponent = null

    private coverWidth: number = 1
    private _coverList: Node[] = []
    private _coverData: ICoverData[] = []
    private _curIndex = 0
    private _isLoading = false


    start () {
        this.loadCovers()
        // 鼠标监听
        systemEvent.on(SystemEvent.EventType.MOUSE_UP, this.onMouseUp, this)
        // 触摸监听
        systemEvent.on(SystemEvent.EventType.TOUCH_END, this.onTouchEnd, this)
    }
    // 加载数据文件
    loadCovers () {
        assetManager.resources.load('games', JsonAsset, (err, jsonData) => {
            if(jsonData && Array.isArray(jsonData['json'])) {
                this.generateCovers(jsonData['json'])
            }
        })
    }
    // 根据数据生成实例
    generateCovers(coverData: ICoverData[]) {
        this._coverData = coverData
        const coverNum = Math.max(coverData.length, 5)
        for (let i = 0; i < coverNum; i++) {
            const coverNode:Node = instantiate(this.coverPrfb)
            coverNode.name = '' + i
            // coverNode.parent = this.node
            this.node.addChild(coverNode)
            if (i < coverData.length) {
                const data = coverData[i]

                const modelComp = coverNode.getComponent(MeshRenderer)
                const mat = modelComp.material
                assetManager.resources.load(data.coverImgUrl,Texture2D, (err, texture: Texture2D) => {
                    if (err) {
                        console.error(err)
                        return
                    }
                    mat.setProperty('mainTexture', texture)
                    if (i === coverData.length - 1) {
                        this.tweenToIndex(this._curIndex, false)
                    }
                })
            }
            this._coverList.push(coverNode)
        }
    }

    tweenToIndex(index: number, immediate: boolean = false) {
        if (index < 0 || index >= this._coverList.length) {
            return
        }

        this._curIndex = index
        for (let i = 0; i < this._coverList.length; i++) {
            const coverNode = this._coverList[i]
            const pos = new Vec3()
            const rot: Quat = new Quat()
            if (i  !== this._curIndex) {
                const delta = (i - this._curIndex) * this.coverWidth
                let diff = (1 - (Math.abs(delta) + 2) * 0.1)
                if (diff < 0.1) {
                    diff = 0.1
                }
                const sign = Math.sign(delta)
                let posX = delta * diff
                let angle = -60 * sign
                pos.set(posX * 300, 0, 0)
                Quat.fromAxisAngle(rot, Vec3.UNIT_Y, angle/180 * Math.PI)
            }

            if (immediate) {
                coverNode.setWorldPosition(pos)
                coverNode.setWorldRotation(rot)
            } else {
                tween(coverNode)
                .to(0.5, { position: pos, rotation: rot }, { onComplete: () => {

                }})
                .start()
            }
        }
    }
    // 向右切换
    moveRight () {
        if (this._curIndex + 1 < this._coverList.length) {
            this.tweenToIndex(this._curIndex + 1)
        }
    }
    // 向左切换
    moveLeft () {
        if (this._curIndex - 1 >= 0) {
            this.tweenToIndex(this._curIndex - 1)
        }
    }
    // 碰撞检测
    onClickPos (mousePos: Vec2) {
        const outRay = new Ray();
        log('碰撞检测')
    }
    // 鼠标抬起事件监听
    onMouseUp (event: EventMouse) {
        this.onClickPos(event.getLocation())
    }
    // 触摸结束事件监听
    onTouchEnd (touch: Touch, event: EventTouch) {
        this.onClickPos(event.getLocation())
    }

    onDestroy () {
        // 解除鼠标监听
        systemEvent.off(SystemEvent.EventType.MOUSE_UP, this.onMouseUp, this)
        // 解除触摸监听
        systemEvent.off(SystemEvent.EventType.TOUCH_END, this.onTouchEnd, this)
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
