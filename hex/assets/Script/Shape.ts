// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import Board from './Board';
import { Tiles } from './Config.js'

const { ccclass, property } = cc._decorator;

@ccclass
export default class Shape extends cc.Component {
    // *六边形的高度
    @property
    tileH: number = 122;

    // *方块缩放值，用于点击后放大
    @property
    tileScale: number = 0.7;

    // *棋盘节点
    board: Board = null;

    // *各种方块颜色对应贴图
    @property(cc.SpriteFrame)
    type1: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    type2: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    type3: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    type4: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    type5: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    type6: cc.SpriteFrame = null;

    // *方块形状
    private tiles: [any] = Tiles;

    // *方块原始位置，当方块被使用后重新在原始位置生成新的方块。
    private ox:number = 0;
    private oy:number = 0;

    // *棋盘与方块重合部分
    private boradTiles:number[] = null;

    // *方块当前重合部分
    private fillTiles: number[] = null;
    

    // ?自定方法

    // *返回 min 到 max 之间的随机数
    getRandomNumber(min: number, max: number) {
        return min + Math.floor((Math.random() * max));
    }

    // *随机方块
    getRandomType() {
        const shape = this.tiles[this.getRandomNumber(0, this.tiles.length)];
        const list = shape.list[this.getRandomNumber(0, shape.list.length)]
        return {
            type: shape.type,
            list: list
        }
    }

    // *根据行列坐标和高度获取六边形像素点位置
    hex2pixel(hexArr: Array<number>, h: number) {

        const q = hexArr[0];
        const r = hexArr[1];

        let size = h / 2;
        let x = size * Math.sqrt(3) * (q + r / 2);
        let y = ((size * 3) / 2) * r;
        return cc.p(x, y);
    }

    // *渲染方块
    setSpriteFrame(hexes: cc.Vec2[], tilePic: cc.SpriteFrame) {
        for (let i = 0, len = hexes.length; i < len; i++) {
            let node = new cc.Node('frame');
            let sprite = node.addComponent(cc.Sprite);
            sprite.spriteFrame = tilePic;
            node.x = hexes[i].x;
            node.y = hexes[i].y;
            node.parent = this.node;
        }
    }

    setTile() {
        const hexData = this.getRandomType();

        let hexPx = hexData.list.map(hexArr => {
            return this.hex2pixel(hexArr, this.tileH);
        });

        this.setSpriteFrame(hexPx, this[`type${hexData.type}`]);
        this.node.scale = this.tileScale;
        this.ox = this.node.x;
        this.oy = this.node.y;

    }

    // *触摸离开事件
    noTouch() {
        this.node.setScale(0.7);
        this.node.children.forEach(child => {
            child.setScale(1);
        });
    }

    // *触摸移动事件
    moveTouch(event){
        const {x,y} = event.touch.getDelta();
        
        this.node.x += x;
        this.node.y += y;
    }

    // *添加触摸事件
    addTouchEvent() {
        this.node.on('touchstart', event => {
            this.node.setScale(1);
            this.node.children.forEach(child => {
                child.setScale(0.8);
            });

        });

        this.node.on('touchend', event => {
            this.noTouch();
        });

        this.node.on('touchcancel',event=>{
            this.noTouch();
        });

        this.node.on('touchmove',event=>{
            this.moveTouch(event);
        })
    }
    //? LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.setTile();
        this.addTouchEvent();
    }

    // start() {

    // }

    // update (dt) {}
}
