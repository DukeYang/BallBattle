import {
  _decorator,
  Component,
  Node,
  Sprite,
  Color,
  Label,
  RigidBody2D,
  Collider,
  Contact2DType,
  Collider2D,
  IPhysics2DContact,
  BoxCollider2D,
  v2,
  PhysicsSystem2D,
  math,
  CircleCollider2D,
  Graphics,
} from 'cc';
import { ArmItem } from './ArmItem';
import { Camp } from './CampManager';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = MapItem
 * DateTime = Mon Oct 04 2021 16:46:45 GMT+0800 (中国标准时间)
 * Author = lyang1
 * FileBasename = MapItem.ts
 * FileBasenameNoExtension = MapItem
 * URL = db://assets/Scripts/MapItem.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('ItemManager')
export class ItemManager extends Component {
  @property(Camp)
  camp: Camp = null;

  @property
  defaultColor = new Color();

  @property(Sprite)
  mainContent: Sprite = null;

  @property({ type: Label })
  label: Label = null;

  rigidbody: RigidBody2D = null;

  id = { id: -1, x: -1, y: -1 };

  existsBall: ArmItem = null;

  setId(id, x, y) {
    this.id.id = id;
    this.id.x = x;
    this.id.y = y;
  }

  attackBy(ball: ArmItem) {
    this.camp = ball.camp;
    ball.life = 0;
    this.show();
  }

  start() {
    this.show();
    this.label.string = `${this.id.x}-${this.id.y}`;

    this.rigidbody = this.node.getComponent(RigidBody2D);
    const col = this.node.getComponent(BoxCollider2D);
    col.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    col.on(Contact2DType.END_CONTACT, this.onEndContact, this);
  }

  onEndContact(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact | null
  ) {
    if (this.existsBall === otherCollider.node.getComponent(ArmItem))
      this.existsBall = null;
  }
  onBeginContact(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact | null
  ) {
    const armNode = otherCollider.node;
    const mapNode = selfCollider.node;
    const arm = armNode.getComponent(ArmItem);
    const item = mapNode.getComponent(ItemManager);
    if (this.existsBall === null) {
      this.existsBall = arm;
      if (item.camp !== arm.camp) {
        item.attackBy(arm);
        // this.col(arm);
      }
    } else if (item.camp !== arm.camp) {
      arm.life = 0;
      // this.col(otherCollider.node.getComponent(ArmItem));
      return;
    }
  }

  col(ball: ArmItem) {
    // 反弹
    const armCenter = v2();
    ball.rigidbody.getWorldCenter(armCenter);
    const itemCenter = v2();
    this.rigidbody.getWorldCenter(itemCenter);
    const x = armCenter.x - itemCenter.x;
    const y = armCenter.y - itemCenter.y;
    const targetSpeed = v2(
      ball.rigidbody.linearVelocity.x,
      ball.rigidbody.linearVelocity.y
    );
    if (Math.abs(x) === Math.abs(y)) {
      targetSpeed.x = -targetSpeed.x;
      targetSpeed.y = targetSpeed.y;
    } else if (Math.abs(x) > Math.abs(y)) {
      targetSpeed.x = -targetSpeed.x;
    } else {
      targetSpeed.y = -targetSpeed.y;
    }
    ball.setSpeed(targetSpeed);
  }

  show() {
    if (this.camp) {
      this.mainContent.color = this.camp.itemColor;
    } else {
      this.mainContent.color = this.defaultColor;
    }
  }

  update(deltaTime: number) {}
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
