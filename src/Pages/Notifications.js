import React, { useState, useEffect } from 'react';

function Notifications() {
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('../public/service-worker.js')
        .then(function (registration) {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(function (error) {
          console.log('Service Worker registration failed:', error);
        });
    }
  }, []);

  const publicKey =
    'BNodXlSBzjdinS_THrGV5vwNYxJqE3xamj86nm3ZG3IeUKpTaDbvKBjdie-oxfjgeC6R80LHaC2oJ99EMUeDjyQ';

  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  const handleSubscribeClick = () => {
    Notification.requestPermission()
      .then(function (permission) {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
          navigator.serviceWorker.ready
            .then(function (registration) {
              return registration.pushManager
                .getSubscription()
                .then(function (existingSubscription) {
                  if (existingSubscription) {
                    return existingSubscription;
                  }
                  return registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(publicKey),
                  });
                })
                .then(function (newSubscription) {
                  setSubscription(newSubscription);
                  return fetch('https://remesapruebas-production.up.railway.app/notification/subscribe', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newSubscription),
                  });
                });
            })
            .catch(function (error) {
              console.error('Failed to get registration: ', error);
            });
        }
      })
      .catch(function (error) {
        console.error('Failed to request permission: ', error);
      });
  };

  const handleSendNotificationClick = () => {
    fetch('https://remesapruebas-production.up.railway.app/notification/sendNotificationDefault', {
      method: 'POST',
    });
  };

  return (
    <div>
      <h1>Push Notification Test</h1>
      <button onClick={handleSubscribeClick}>Subscribe to Push Notifications</button>
      <button onClick={handleSendNotificationClick}>Send Notification</button>
    </div>
  );
}

export { Notifications };
