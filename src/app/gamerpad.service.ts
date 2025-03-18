import { computed, effect, Injectable, Signal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GamerpadService {
  private gamepad = signal<Gamepad | null>(null);
  private websocket: WebSocket | null = null;
  private pollingActive = false;

  constructor() {
    this.waitForUserInteraction();
    this.connectWebSocket();
    console.log('Gamepad service initialized');

    // ✅ Use an effect to automatically send data when rightTrigger or leftAxis changes
    effect(() => {
      this.sendToWebSocket();
    });
  }

  private connectWebSocket() {
    if (this.websocket) return; // Prevent multiple connections

    this.websocket = new WebSocket('ws://localhost:8000/ws');

    this.websocket.onopen = () => {
        console.log('%cWebSocket connection established', 'color: green; font-weight: bold;');
    };

    this.websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('%cReceived from server:', 'color: blue;', data);
    };

    this.websocket.onerror = (error) => {
        console.error('%cWebSocket error:', 'color: red;', error);
    };

    this.websocket.onclose = () => {
        console.warn('%cWebSocket connection closed. Reconnecting...', 'color: orange; font-weight: bold;');
        this.websocket = null;
        setTimeout(() => this.connectWebSocket(), 3000); // ✅ Auto-reconnect after 3 seconds
    };
}

  private sendToWebSocket() {
    if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket is not open, skipping send');
      return;
    }

    const rightTrigger = this.getRightTrigger()();
    const leftAxis = this.getAxisState(0)();

    // ✅ Only send data when RT is pressed or left joystick moves left/right
    if (rightTrigger > 0.0 || Math.abs(leftAxis) > 0.1) {
      const data = JSON.stringify({ right_trigger: rightTrigger, left_axis: leftAxis });
      this.websocket.send(data);
      console.log('%cSent data:', 'color: blue;', data);
    }
  }

  private waitForUserInteraction() {
    const enableGamepad = () => {
      console.log('%cEnable Gamepad', 'color: purple; font-weight: bold;');

      window.addEventListener('gamepadconnected', (event: GamepadEvent) => {
        console.log('%cGamepad connected:', 'color: green;', event.gamepad);
        this.gamepad.set(event.gamepad);
        this.pollGamepad();
      });

      window.addEventListener('gamepaddisconnected', () => {
        console.log('%cGamepad disconnected', 'color: red;');
        this.gamepad.set(null);
      });

      this.pollGamepad();
      window.removeEventListener('click', enableGamepad);
      window.removeEventListener('keydown', enableGamepad);
    };

    window.addEventListener('click', enableGamepad);
    window.addEventListener('keydown', enableGamepad);
  }

  private pollGamepad() {
    if (this.pollingActive) return;
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
