import {
  _decorator,
  Component,
  Node,
  math,
  v2,
  PhysicsSystem2D,
  EPhysics2DDrawFlags,
  Collider2D,
  IPhysics2DContact,
  CircleCollider2D,
  Contact2DType,
  director,
  Label,
} from 'cc';
import { ArmItem } from './ArmItem';
import { Camp } from './CampManager';
import { ItemManager } from './ItemManager';
import { MapManager } from './MapManager';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = PlayScript
 * DateTime = Tue Oct 05 2021 13:30:22 GMT+0800 (中国标准时间)
 * Author = lyang1
 * FileBasename = PlayScript.ts
 * FileBasenameNoExtension = PlayScript
 * URL = db://assets/Scripts/PlayScript.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('PlayScript')
export class PlayScript extends Component {
  @property([Node])
  Teams: Node[] = [];

  @property(Label)
  result: Label = null;

  @property(math.Vec2)
  MapSize = v2(60, 60);
  @property(MapManager)
  mapManager = null;

  start() {
    // [3]
    PhysicsSystem2D.instance.enable = true;
    // PhysicsSystem2D.instance.debugDrawFlags =
    //   EPhysics2DDrawFlags.Aabb |
    //   EPhysics2DDrawFlags.Pair |
    //   EPhysics2DDrawFlags.CenterOfMass |
    //   EPhysics2DDrawFlags.Joint |
    //   EPhysics2DDrawFlags.Shape;
    PhysicsSystem2D.instance.gravity = v2();
    this.result.node.active = false;
    this.mapManager.MapSize = this.MapSize;
    this.mapManager.initMap();
    this.initCamp();
  }

  initCamp() {
    this.Teams.forEach((item) => {
      const camp = item.getComponent(Camp);
      const id = camp.ID();
      const index = id.x * this.MapSize.y + id.y;
      const start = this.mapManager.items[index];
      start.camp = camp;
      item.setPosition(start.node.position.x, start.node.position.y, 0);
      item.setParent(this.mapManager.node);
      camp.targetCount = 100;
      camp.fire();
      camp.randomManager.stop();
    });
  }

  buttonPressed() {
    const camp = this.Teams[0].getComponent(Camp);
    camp.randomManager.stop();
    camp.targetCount = 10000;
    camp.fire();
  }

  update() {
    let campCount = 0;
    let resultStr = '';
    this.Teams.forEach((item) => {
      const camp = item.getComponent(Camp);
      const id = camp.ID();
      const index = id.x * this.MapSize.y + id.y;
      const start = this.mapManager.items[index];
      if (start.camp !== camp) {
        camp.lose();
      } else {
        campCount += 1;
        resultStr = camp.name;
      }
    });
    if (campCount === 1) {
      director.pause();
      this.result.node.active = true;
      this.result.string = `${resultStr} WIN!`;
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
