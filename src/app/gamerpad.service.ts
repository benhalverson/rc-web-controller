import { computed, Injectable, Signal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GamerpadService {
  private gamepad = signal<Gamepad | null>(null);
  private pollingActive = false;

  constructor() {
    this.waitForUserInteraction();
    console.log('gamepad service initialized');
    console.log('gamepad:', this.gamepad());
  }

  private waitForUserInteraction() {
    // Wait for a user event before starting gamepad detection
    const enableGamepad = () => {
      console.log('enableGamepad');
      window.addEventListener('gamepadconnected', (event: GamepadEvent) => {
        console.log('Gamepad connected:', event.gamepad);
        this.gamepad.set(event.gamepad);
        this.pollGamepad();
      });

      window.addEventListener('gamepaddisconnected', () => {
        console.log('Gamepad disconnected');
        this.gamepad.set(null);
      });

      this.pollGamepad();
      window.removeEventListener('click', enableGamepad);
      window.removeEventListener('keydown', enableGamepad);
    };

    // Wait for the user to click or press a key before enabling gamepad input
    window.addEventListener('click', enableGamepad);
    window.addEventListener('keydown', enableGamepad);
  }

  private pollGamepad() {
    if (this.pollingActive) return; // Prevent multiple polling loops
    this.pollingActive = true;

    const update = () => {
      const gamepads = navigator.getGamepads();
      if (gamepads[0]) {
        this.gamepad.set(gamepads[0]);
      }
      requestAnimationFrame(update);
    };
    update();
  }

  getGamepad(): Signal<Gamepad | null> {
    return this.gamepad;
  }

  getButtonState(index: number): Signal<boolean> {
    return computed(() => this.gamepad()?.buttons[index]?.pressed ?? false);
  }

  getAxisState(index: number): Signal<number> {
    return computed(() => this.gamepad()?.axes[index] ?? 0);
  }

  getLeftTrigger(): Signal<number> {
    return computed(() => this.gamepad()?.buttons[6]?.value ?? 0);
  }

  getRightTrigger(): Signal<number> {
    return computed(() => this.gamepad()?.buttons[7]?.value ?? 0);
  }
}
