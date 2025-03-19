import { Component, Signal, effect } from '@angular/core';
import { GamerpadService } from '../gamerpad.service';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-gamepad',
  standalone: true,
  imports: [NgIf, ],
  templateUrl: './gamepad.component.html',
  styleUrl: './gamepad.component.css',
})
export class GamepadComponent {
  gamepad: Signal<Gamepad | null>;
  buttonA: Signal<boolean>;
  buttonB: Signal<boolean>;
  buttonX: Signal<boolean>;
  buttonY: Signal<boolean>;
  leftStickX: Signal<number>;
  leftStickY: Signal<number>;
  rightStickX: Signal<number>;
  rightStickY: Signal<number>;
  leftTrigger: Signal<number>;
  rightTrigger: Signal<number>;

  constructor(private readonly gamepadService: GamerpadService) {
    this.gamepad = this.gamepadService.getGamepad();
    this.buttonA = this.gamepadService.getButtonState(0);
    this.buttonB = this.gamepadService.getButtonState(1);
    this.buttonX = this.gamepadService.getButtonState(2);
    this.buttonY = this.gamepadService.getButtonState(3);
    this.leftTrigger = this.gamepadService.getLeftTrigger();
    this.rightTrigger = this.gamepadService.getRightTrigger();
    this.leftStickX = this.gamepadService.getAxisState(0);
    this.leftStickY = this.gamepadService.getAxisState(1);
    this.rightStickX = this.gamepadService.getAxisState(2);
    this.rightStickY = this.gamepadService.getAxisState(3);

    effect(() => {
      console.log('Right Trigger:', this.rightTrigger());
      console.log('Left Stick X:', this.leftStickX());
    });
  }
}
