// js/app.js
document.addEventListener('DOMContentLoaded', () => {
  const loginPage = document.getElementById('login-page');
  const chatPage = document.getElementById('chat-page');
  const loginButton = document.getElementById('login-button');
  const signupButton = document.getElementById('signup-button');
  const logoutButton = document.getElementById('logout-button');
  const loginEmail = document.getElementById('login-email');
  const loginPassword = document.getElementById('login-password');
  const messageInput = document.getElementById('message-input');
  const sendButton = document.getElementById('send-button');
  const messagesContainer = document.getElementById('messages');

  let currentUser;

  const showPage = (page) => {
    loginPage.classList.add('hidden');
    chatPage.classList.add('hidden');
    page.classList.remove('hidden');
  };

  loginButton.addEventListener('click', () => {
    const email = loginEmail.value;
    const password = loginPassword.value;
    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        currentUser = userCredential.user;
        showPage(chatPage);
        loadMessages();
      })
      .catch((error) => {
        console.error('Error logging in:', error);
      });
  });

  signupButton.addEventListener('click', () => {
    const email = loginEmail.value;
    const password = loginPassword.value;
    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        currentUser = userCredential.user;
        showPage(chatPage);
      })
      .catch((error) => {
        console.error('Error signing up:', error);
      });
  });

  logoutButton.addEventListener('click', () => {
    auth.signOut()
      .then(() => {
        currentUser = null;
        showPage(loginPage);
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
  });

  sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (message.trim() !== '') {
      db.collection('messages').add({
        text: message,
        user: currentUser.email,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
      messageInput.value = '';
    }
  });

  const loadMessages = () => {
    db.collection('messages').orderBy('timestamp', 'asc').onSnapshot((snapshot) => {
      messagesContainer.innerHTML = '';
      snapshot.forEach((doc) => {
        const messageData = doc.data();
        const messageElement = document.createElement('div');
        messageElement.textContent = `${messageData.user}: ${messageData.text}`;
        messagesContainer.appendChild(messageElement);
      });
    });
  };

  auth.onAuthStateChanged((user) => {
    if (user) {
      currentUser = user;
      showPage(chatPage);
      loadMessages();
    } else {
      currentUser = null;
      showPage(loginPage);
    }
  });
});
