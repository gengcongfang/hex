// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Board extends cc.Component {

    // ! 禁止使用
    // * 主要
    // ? 询问，疑问
    // TODO: 需要补全的代码片段
    // @property(cc.Label)
    // label: cc.Label = null;

    // @property
    // text: string = 'hello';

    //* 生成六边形布局的边界个数 
    @property
    hexSide: number = 5

    //* 六边形的高度
    @property
    tileH: number = 122

    // *棋盘背景
    @property(cc.SpriteFrame)
    tilePic: cc.SpriteFrame = null

    // *六边形位置数组
    private hexes: Array<Array<any>> = new Array<Array<any>>();

    private boardFrameList: Array<cc.Node> = [];
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.setHexagonGrid();
        this.node.on('dropSuccess', this.deleteTile, this);
        this.getOldScore();

    }

    // *初始化hexes数组
    initArray() {
        for (let i = 0; i < 9; i++) {
            this.hexes[i] = [];
        }
        this.hexes.push([]);


    }

    // *初始化棋盘
    setHexagonGrid(): void {

        this.hexSide--;
        this.initArray();
        // for(let i = 0;i < 9; i++){
        //     this.hexes[i] = [];
        // }
        // this.hexes.push([]);
        // 棋盘六角网格布局，坐标系存储方法
        for (let q = -this.hexSide; q <= this.hexSide; q++) {
            let r1 = Math.max(-this.hexSide, -q - this.hexSide);
            let r2 = Math.min(this.hexSide, -q + this.hexSide);
            for (let r = r1; r <= r2; r++) {
                let col = q + this.hexSide;
                let row = r - r1;
                if (!this.hexes[col]) {
                    this.hexes[col] = [];
                }
                this.hexes[col][row] = this.hex2pixel(q, r, this.tileH);
            }
        }
        this.hexes.forEach(hexs => {
            this.setSpriteFrame(hexs);
        });
    }

    // *清除六边形
    deleteTile() {
        // TODO: 消除六边形
    }

    // *获取历史最高分
    getOldScore() {

    }
    // *根据行列坐标和高度获取六边形像素点位置
    hex2pixel(q: number, r: number, h: number) {
        let size = h / 2;
        let x = size * Math.sqrt(3) * (q + r / 2);
        let y = ((size * 3) / 2) * r;
        return cc.p(x, y);
    }

    // *设置六边形
    setSpriteFrame(hexes) {
        for (let index = 0; index < hexes.length; index++) {
            let node = new cc.Node('frame');
            let sprite = node.addComponent(cc.Sprite);
            sprite.spriteFrame = this.tilePic;
            
            node.x = hexes[index].x;
            node.y = hexes[index].y;
            node.parent = this.node;
            hexes[index].spriteFrame = node;
            this.setShadowNode(node);
            this.setFillNode(node);
            // 保存当前棋盘格子的信息，用于后面落子判定及消除逻辑等。
            this.boardFrameList.push(node);
        }
    }

    // *设置六边形阴影
    setShadowNode(node: cc.Node) {
        const newNode = new cc.Node('frame');
        newNode.addComponent(cc.Sprite);
        newNode.name = 'shadowNode';
        newNode.opacity = 150;
        newNode.parent = node;
    }

    // *设置六边形填充
    setFillNode(node: cc.Node) {
        const newNode = new cc.Node('frame');
        newNode.addComponent(cc.Sprite);
        newNode.name = 'fillNode';
        newNode.parent = node;
    }
    // start () {

    // }

    // update (dt) {}
}
