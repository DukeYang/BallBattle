import {
  _decorator,
  Component,
  Node,
  Color,
  Sprite,
  v2,
  Prefab,
  instantiate,
  resources,
  Label,
  NodePool,
} from 'cc';
import { ArmItem } from './ArmItem';
import { ItemManager } from './ItemManager';
import { RandomPanelManager } from './RandomPanelManager';
import vectorsToDegress from './MyUtils/MyUtils';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Camp
 * DateTime = Mon Oct 04 2021 16:47:29 GMT+0800 (中国标准时间)
 * Author = lyang1
 * FileBasename = Camp.ts
 * FileBasenameNoExtension = Camp
 * URL = db://assets/Scripts/Camp.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('Camp')
export class Camp extends Component {
  @property
  color: Color = new Color();

  @property
  campName = '';

  @property(Node)
  canon: Node = null;

  @property(Label)
  countLabel: Label = null;

  @property
  initPosition = v2();

  @property
  defaultSpeed = v2();

  armItem: Prefab = null;

  itemColor: Color = null;
  ballColor: Color = null;

  armPools: NodePool = new NodePool();

  randomManager: RandomPanelManager = null;

  start() {
    resources.load('assets/Arm', Prefab, (err, prefab) => {
      this.armItem = prefab;
    });
    if (!this.campName) {
      this.campName = this.color.toString();
    }
    this.itemColor = new Color(
      this.color.r * 0.7,
      this.color.g * 0.7,
      this.color.b * 0.7,
      150
    );
    this.ballColor = new Color(this.color.r, this.color.g, this.color.b, 255);
    this.node
      .getComponentsInChildren(Sprite)
      .forEach((item) => (item.color = this.color));

    this.canon.setRotationFromEuler(0, 0, vectorsToDegress(this.defaultSpeed));
  }
  startPoint = v2();
  addArm() {
    let arm = null;
    if (this.armPools.size() > 0) {
      arm = this.armPools.get();
    } else {
      arm = instantiate(this.armItem);
    }

    arm.getComponent(ArmItem).camp = this;
    arm.setParent(this.node);
    arm.setPosition(this.firePoint.x, this.firePoint.y, 0);
    arm.getComponent(ArmItem).start();
  }
  targetCount = 0;
  count = 0;
  fire() {
    this.count = this.targetCount;
  }
  ID() {
    return this.initPosition;
  }
  rotate = 0;
  shunshi = 1;
  xishu = 1.1;
  cd = 0;
  firePoint = v2();
  update(deltaTime: number) {
    // [4]
    this.defaultSpeed = this.defaultSpeed.rotate(
      deltaTime * this.xishu * this.shunshi
    );
    this.rotate += deltaTime * this.xishu * this.shunshi;
    if (this.rotate >= 0.9) {
      this.shunshi = -1;
    } else if (this.rotate <= -0.9) {
      this.shunshi = 1;
    }

    const target = this.defaultSpeed.clone().normalize();
    this.canon.setRotationFromEuler(0, 0, -vectorsToDegress(target));
    this.firePoint = v2(target.x * 15, target.y * 15);
    this.cd -= deltaTime;
    if (this.cd <= 0 && this.count > 0) {
      this.addArm();
      this.count -= 1;
      this.cd = 0.1;
    }
    this.countLabel.string = `${this.count}`;
    if (this.count === 0) {
      this.randomManager.run();
    }
  }

  lose() {
    this.targetCount = 0;
    this.count = 0;
    this.node.active = false;
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
