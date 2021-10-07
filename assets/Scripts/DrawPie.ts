import { _decorator, Component, Node, Graphics, Label, Vec2, Color } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = DrawPie
 * DateTime = Thu Oct 07 2021 16:33:31 GMT+0800 (中国标准时间)
 * Author = lyang1
 * FileBasename = DrawPie.ts
 * FileBasenameNoExtension = DrawPie
 * URL = db://assets/Scripts/MyUtils/DrawPie.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('DrawPie')
export class DrawPie extends Component {
  @property
  radius = 50;

  options = [30, 40, 30];

  colors = ['#00FF66', '#0066FF', '#FF0000'];
  start() {
    // [3]
    this.drawAllPie();
    // this.drawCircle();
    // this.drawPie(0, 0.3 * 2 * Math.PI, '#FF0000');
    // this.drawPie(0.3 * 2 * Math.PI, 0.7 * 2 * Math.PI, '#00FF00');
    // this.drawPie(0.7 * 2 * Math.PI, 2 * Math.PI, '#0000FF');
  }

  setOptions(newOptions) {
    let change = false;
    for (let i = 0; i < newOptions.length; i++) {
      const newEle = newOptions[i];
      const ele = this.options[i];
      if (newEle != ele) {
        change = true;
        break;
      }
    }
    if (change) {
      this.options = newOptions;
      this.drawAllPie();
    }
  }

  drawAllPie() {
    this.drawCircle();
    let start = 0;
    const all = this.options.reduce((a, b) => {
      return a + b;
    });
    for (let i = 0; i < this.options.length; i++) {
      const item = this.options[i];
      let x = (start / all) * 2 * Math.PI;
      let y = ((start + item) / all) * 2 * Math.PI;
      start += item;
      this.drawPie(x, y, this.colors[i]);
    }
  }

  drawCircle() {
    const g = this.getComponent(Graphics);
    g.circle(0, 0, this.radius);
    g.fill();
  }

  drawPie(x, y, color) {
    const g = this.getComponent(Graphics);
    g.moveTo(0, 0);
    g.lineTo(Math.cos(x) * 50, Math.sin(x) * 50);
    g.arc(0, 0, this.radius, x, y, true);
    g.lineTo(0, 0);
    g.fillColor = new Color().fromHEX(color);
    g.close();
    g.fill();
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
