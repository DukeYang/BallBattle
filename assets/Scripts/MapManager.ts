import {
  _decorator,
  Component,
  Node,
  v2,
  v3,
  Prefab,
  instantiate,
  PhysicsSystem2D,
  EPhysics2DDrawFlags,
  director,
  math,
  UITransform,
} from 'cc';
import { Camp } from './CampManager';
import { ItemManager } from './ItemManager';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = MapManager
 * DateTime = Mon Oct 04 2021 16:53:11 GMT+0800 (中国标准时间)
 * Author = lyang1
 * FileBasename = MapManager.ts
 * FileBasenameNoExtension = MapManager
 * URL = db://assets/Scripts/MapManager.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('MapManager')
export class MapManager extends Component {
  items: ItemManager[] = new Array();

  @property({ type: Prefab })
  private mapItem: Prefab = null;

  MapSize = v2(0, 0);
  start() {}

  initMap() {
    const width = this.MapSize.x;
    const height = this.MapSize.y;
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        const item = instantiate(this.mapItem);
        item.setParent(this.node);
        const size = item.getComponent(UITransform).contentSize;
        let x = j * size.width - 300 + size.width / 2;
        let y = -(i * size.height - 300 + size.height / 2);
        item.setPosition(x, y, 0);
        const mapItem = item.getComponent(ItemManager);
        mapItem.setId(i * height + j, i, j);
        // mapItem.camp = this.Teams[1].getComponent(Camp);
        this.items.push(mapItem);
      }
    }
  }

  update(deltaTime: number) {
    // [4]
  }

  pause() {
    director.pause();
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
