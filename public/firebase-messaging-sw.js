// firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging.js');

// Initialize Firebase with your configuration
const firebaseConfig = {
    apiKey: "AIzaSyCH79TfIXVYmsXV-fgcPUUFxblTMLx7WSg",
    authDomain: "passowrd-app-api.firebaseapp.com",
    projectId: "passowrd-app-api",
    storageBucket: "passowrd-app-api.firebasestorage.app",
    messagingSenderId: "854470670417",
    appId: "1:854470670417:web:266c2da8c9190ea558a070",
    measurementId: "G-HQ9G8PNMV9"
};

firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message: ', payload);
  // Customize the notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
