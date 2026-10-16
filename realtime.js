/**
 * Paw Care — Real-Time WebSocket & Cross-Tab Client (Socket.io)
 * Handles live synchronization between Pet Owner and Veterinarian dashboards.
 */

(function () {
  const CHANNEL_NAME = 'pawcare_realtime_channel';
  let socket = null;
  let broadcastChannel = null;

  // Initialize BroadcastChannel (supported across all modern browsers)
  if (typeof BroadcastChannel !== 'undefined') {
    try {
      broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
    } catch (e) {
      console.warn('BroadcastChannel initialization error:', e);
    }
  }

  // Initialize Socket.io client if library is loaded
  function initSocket() {
    if (typeof io !== 'undefined') {
      try {
        // Connect to current origin, or localhost:3000 if opened via file:// or custom port
        const serverUrl = (window.location.protocol.startsWith('http')) 
          ? window.location.origin 
          : 'http://localhost:3000';

        socket = io(serverUrl, {
          transports: ['websocket', 'polling'],
          reconnectionAttempts: 5,
          timeout: 4000
        });

        socket.on('connect', () => {
          console.info('🔌 Paw Care: Socket.io connected to', serverUrl);
        });

        // Listen for server broadcasts
        socket.on('appointment_created', (data) => {
          triggerEvent('appointment_created', data);
        });

        socket.on('appointment_accepted', (data) => {
          triggerEvent('appointment_accepted', data);
        });

        socket.on('profile_updated', (data) => {
          triggerEvent('profile_updated', data);
        });
      } catch (err) {
        console.warn('Socket.io connection error:', err);
      }
    }
  }

  // Cross-tab broadcast listener
  if (broadcastChannel) {
    broadcastChannel.onmessage = (event) => {
      if (event.data && event.data.type) {
        triggerEvent(event.data.type, event.data.payload);
      }
    };
  }

  // localStorage storage event listener as second fallback
  window.addEventListener('storage', (e) => {
    if (e.key === 'pawcare_realtime_event' && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        if (parsed && parsed.type) {
          triggerEvent(parsed.type, parsed.payload);
        }
      } catch (err) {}
    }
  });

  function triggerEvent(type, payload) {
    const customEvent = new CustomEvent(`pawcare:${type}`, { detail: payload });
    window.dispatchEvent(customEvent);
  }

  const PawCareRealtime = {
    // Notify that a new appointment was created
    notifyAppointmentCreated(appointment) {
      if (socket && socket.connected) {
        socket.emit('book_appointment', appointment);
      }
      if (broadcastChannel) {
        broadcastChannel.postMessage({ type: 'appointment_created', payload: appointment });
      }
      try {
        localStorage.setItem('pawcare_realtime_event', JSON.stringify({
          type: 'appointment_created',
          payload: appointment,
          time: Date.now()
        }));
      } catch (e) {}
    },

    // Notify that a veterinarian accepted an appointment
    notifyAppointmentAccepted(data) {
      if (socket && socket.connected) {
        socket.emit('accept_appointment', data);
      }
      if (broadcastChannel) {
        broadcastChannel.postMessage({ type: 'appointment_accepted', payload: data });
      }
      try {
        localStorage.setItem('pawcare_realtime_event', JSON.stringify({
          type: 'appointment_accepted',
          payload: data,
          time: Date.now()
        }));
      } catch (e) {}
    },

    // Notify profile or pet update
    notifyProfileUpdated(data) {
      if (socket && socket.connected) {
        socket.emit('profile_updated', data);
      }
      if (broadcastChannel) {
        broadcastChannel.postMessage({ type: 'profile_updated', payload: data });
      }
    },

    // Event listener helpers
    onAppointmentCreated(callback) {
      window.addEventListener('pawcare:appointment_created', (e) => callback(e.detail));
    },

    onAppointmentAccepted(callback) {
      window.addEventListener('pawcare:appointment_accepted', (e) => callback(e.detail));
    },

    onProfileUpdated(callback) {
      window.addEventListener('pawcare:profile_updated', (e) => callback(e.detail));
    }
  };

  // Expose globally
  window.PawCareRealtime = PawCareRealtime;

  // Initialize socket when DOM is ready or right now
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSocket);
  } else {
    initSocket();
  }
})();
