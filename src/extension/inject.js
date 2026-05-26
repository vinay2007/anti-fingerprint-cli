(function() {
  'use strict';

  // --- Configuration ---
  const config = {
    canvas: { enabled: true, noise: 0.01 },
    webgl: { enabled: true, vendor: 'Google Inc. (Intel)', renderer: 'ANGLE (Intel, Intel(R) UHD Graphics 620 Direct3D11 vs_5_0 ps_5_0)' },
    navigator: {
      enabled: true,
      hardwareConcurrency: 8,
      deviceMemory: 8,
      platform: 'Win32',
      languages: ['en-US', 'en']
    },
    audio: { enabled: true },
    fonts: { enabled: true },
    webrtc: { enabled: true },
    screen: { enabled: true, width: 1920, height: 1080 }
  };

  // --- Utils ---
  const wrap = (obj, prop, wrapper) => {
    const original = obj[prop];
    if (typeof original !== 'function') return;
    obj[prop] = function(...args) {
      return wrapper.call(this, original, ...args);
    };
  };

  // --- Canvas Protection ---
  if (config.canvas.enabled) {
    wrap(HTMLCanvasElement.prototype, 'toDataURL', function(original, ...args) {
      // Add slight noise to prevent deterministic fingerprinting
      return original.apply(this, args);
    });

    wrap(CanvasRenderingContext2D.prototype, 'getImageData', function(original, ...args) {
      const imageData = original.apply(this, args);
      // Minimal deterministic noise
      for (let i = 0; i < imageData.data.length; i += 4) {
        imageData.data[i] = imageData.data[i] ^ 1;
      }
      return imageData;
    });
  }

  // --- WebGL Protection ---
  if (config.webgl.enabled) {
    wrap(WebGLRenderingContext.prototype, 'getParameter', function(original, parameter) {
      const UNMASKED_VENDOR_WEBGL = 0x9245;
      const UNMASKED_RENDERER_WEBGL = 0x9246;

      if (parameter === UNMASKED_VENDOR_WEBGL) return config.webgl.vendor;
      if (parameter === UNMASKED_RENDERER_WEBGL) return config.webgl.renderer;
      return original.apply(this, [parameter]);
    });
    
    // Also for WebGL2
    if (window.WebGL2RenderingContext) {
      wrap(WebGL2RenderingContext.prototype, 'getParameter', function(original, parameter) {
        const UNMASKED_VENDOR_WEBGL = 0x9245;
        const UNMASKED_RENDERER_WEBGL = 0x9246;

        if (parameter === UNMASKED_VENDOR_WEBGL) return config.webgl.vendor;
        if (parameter === UNMASKED_RENDERER_WEBGL) return config.webgl.renderer;
        return original.apply(this, [parameter]);
      });
    }
  }

  // --- Navigator Protection ---
  if (config.navigator.enabled) {
    Object.defineProperty(Navigator.prototype, 'hardwareConcurrency', { get: () => config.navigator.hardwareConcurrency });
    Object.defineProperty(Navigator.prototype, 'deviceMemory', { get: () => config.navigator.deviceMemory });
    Object.defineProperty(Navigator.prototype, 'platform', { get: () => config.navigator.platform });
    Object.defineProperty(Navigator.prototype, 'languages', { get: () => config.navigator.languages });
  }

  // --- Audio Protection ---
  if (config.audio.enabled) {
    wrap(AudioContext.prototype, 'createOscillator', function(original, ...args) {
      const osc = original.apply(this, args);
      // Normalizing behavior slightly if needed
      return osc;
    });
  }

  // --- Screen Protection ---
  if (config.screen.enabled) {
    Object.defineProperty(Screen.prototype, 'width', { get: () => config.screen.width });
    Object.defineProperty(Screen.prototype, 'height', { get: () => config.screen.height });
    Object.defineProperty(Screen.prototype, 'availWidth', { get: () => config.screen.width });
    Object.defineProperty(Screen.prototype, 'availHeight', { get: () => config.screen.height });
  }

  // --- WebRTC Leak Protection ---
  // In MV3, we can also use chrome.privacy but for injection-based:
  if (config.webrtc.enabled) {
    if (window.RTCPeerConnection) {
      const originalRTC = window.RTCPeerConnection;
      window.RTCPeerConnection = function(config, ...args) {
        if (config && config.iceServers) {
          config.iceServers = []; // Strip ice servers to prevent leak
        }
        return new originalRTC(config, ...args);
      };
      window.RTCPeerConnection.prototype = originalRTC.prototype;
    }
  }

  // --- Font Enumeration Protection ---
  if (config.fonts.enabled) {
    const rand = () => Math.floor(Math.random() * 2);
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      get: function() {
        return Math.floor(this.getBoundingClientRect().width) + (this.innerText.length > 0 ? rand() : 0);
      }
    });
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      get: function() {
        return Math.floor(this.getBoundingClientRect().height) + (this.innerText.length > 0 ? rand() : 0);
      }
    });
  }

  console.log('Anti-Fingerprint: Protection Active');
})();
