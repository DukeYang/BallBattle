import { _decorator, Component, Node, Label } from 'cc';
import { Camp } from './CampManager';
import { DrawPie } from './DrawPie';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = RandomPanelManager
 * DateTime = Tue Oct 05 2021 18:44:12 GMT+0800 (中国标准时间)
 * Author = lyang1
 * FileBasename = RandomPanelManager.ts
 * FileBasenameNoExtension = RandomPanelManager
 * URL = db://assets/Scripts/RandomPanelManager.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('RandomPanelManager')
export class RandomPanelManager extends Component {
  @property(Label)
  numberLabel: Label = null;

  @property(Camp)
  camp: Camp = null;
  number = 1;

  @property
  oneLength = 10;

  @property
  doubleLength = 10;

  @property
  fireLength = 80;

  @property(DrawPie)
  pie: DrawPie = null;

  start() {
    // [3]
    this.number = 1;
    this.camp.randomManager = this;
    this.run();
    this.pie.setOptions([this.oneLength, this.doubleLength, this.fireLength]);
  }

  roll() {
    const rand =
      Math.random() * (this.oneLength + this.doubleLength + this.fireLength);
    if (rand < this.oneLength) {
      this.doubleLength += 1;
      return;
    }
    if (rand < this.oneLength + this.doubleLength) {
      this.number = this.number * 2;
      return;
    }
    this.camp.targetCount = this.number;
    this.camp.fire();
    this.number = 1;
    this.stop();
  }
  stop() {
    this.unschedule(this.roll);
  }

  run() {
    this.schedule(this.roll, 1);
  }

  update(deltaTime: number) {
    this.numberLabel.string = `${this.number}`;
    this.pie.setOptions([this.oneLength, this.doubleLength, this.fireLength]);
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
