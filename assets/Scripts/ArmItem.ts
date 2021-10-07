import {
  _decorator,
  Component,
  v2,
  Collider,
  CircleCollider2D,
  Contact2DType,
  BoxCollider2D,
  Collider2D,
  IPhysics2DContact,
  RigidBody2D,
  Sprite,
  Vec2,
} from 'cc';
import { Camp } from './CampManager';
import { ItemManager } from './ItemManager';
import { PlayScript } from './PlayScript';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = ArmItem
 * DateTime = Mon Oct 04 2021 16:52:59 GMT+0800 (中国标准时间)
 * Author = lyang1
 * FileBasename = ArmItem.ts
 * FileBasenameNoExtension = ArmItem
 * URL = db://assets/Scripts/ArmItem.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('ArmItem')
export class ArmItem extends Component {
  camp: Camp = null;

  rigidbody: RigidBody2D = null;
  life = 1;
  speedList = [];
  start() {
    this.life = 1;
    this.rigidbody = this.node.getComponent(RigidBody2D);
    this.rigidbody.linearVelocity = v2(
      this.camp.defaultSpeed.x,
      this.camp.defaultSpeed.y
    );
    this.node.getComponent(Sprite).color = this.camp.ballColor;
  }

  standby = false;
  update(deltaTime: number) {
    if (this.speedList.length > 0) {
      this.rigidbody.linearVelocity = this.speedList.pop();
      this.speedList.length = 0;
    }
    if (
      this.rigidbody.linearVelocity.x === 0 &&
      this.rigidbody.linearVelocity.y === 0
    ) {
      this.rigidbody.linearVelocity = v2(
        this.camp.defaultSpeed.x,
        this.camp.defaultSpeed.y
      ).rotate(Math.random());
    } else {
      if (
        this.rigidbody.linearVelocity.x === 0 ||
        this.rigidbody.linearVelocity.y === 0
      ) {
        this.rigidbody.linearVelocity = this.rigidbody.linearVelocity.rotate(
          Math.random()
        );
      }
    }
    if (this.rigidbody.linearVelocity.length() < 0.1) {
      if (this.standby === false) {
        this.standby = true;
        this.scheduleOnce(this.randomMove, 5);
      }
    }
    if (this.life === 0) {
      // [4]
      this.stop();
    }
  }

  stop() {
    this.rigidbody.linearVelocity = v2();
    this.camp.armPools.put(this.node);
  }

  randomMove() {
    if (this.rigidbody.linearVelocity.length() < 0.1) {
      this.setSpeed(
        v2(this.camp.defaultSpeed.x, this.camp.defaultSpeed.y).rotate(
          Math.random()
        )
      );
    }
    this.standby = false;
  }
  setSpeed(speed: Vec2) {
    this.speedList.push(speed);
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
