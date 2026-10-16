const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3000;

// Serve static frontend files
app.use(express.static(path.join(__dirname)));
app.use(express.json());

// Socket.io Real-Time Event Handlers
io.on('connection', (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);

  // When a pet owner books an appointment
  socket.on('book_appointment', (appointment) => {
    console.log('📅 Appointment booked:', appointment);
    // Broadcast to all clients (especially veterinarian dashboard)
    io.emit('appointment_created', appointment);
  });

  // When a veterinarian accepts an appointment request
  socket.on('accept_appointment', (data) => {
    console.log('✅ Appointment accepted:', data);
    // Broadcast to all clients (especially pet owner dashboard)
    io.emit('appointment_accepted', data);
  });

  // When an appointment is rescheduled or declined
  socket.on('reschedule_appointment', (data) => {
    console.log('🔄 Appointment rescheduled:', data);
    io.emit('appointment_rescheduled', data);
  });

  // When a pet or user profile is updated
  socket.on('profile_updated', (data) => {
    io.emit('profile_updated', data);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`🐾 Paw Care server with Socket.io running on http://localhost:${PORT}`);
});
