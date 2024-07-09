// js/app.js
document.addEventListener('DOMContentLoaded', () => {
  const loginPage = document.getElementById('login-page');
  const mainPage = document.getElementById('main-page');
  const loginButton = document.getElementById('login-button');
  const signupButton = document.getElementById('signup-button');
  const logoutButton = document.getElementById('logout-button');
  const loginEmail = document.getElementById('login-email');
  const loginPassword = document.getElementById('login-password');
  const messageInput = document.getElementById('message-input');
  const sendButton = document.getElementById('send-button');
  const messagesContainer = document.getElementById('messages-container');
  const channelList = document.getElementById('channel-list');
  const channelTitle = document.getElementById('channel-title');

  let currentUser;
  let currentChannel = 'general';

  const showPage = (page) => {
    loginPage.classList.add('hidden');
    mainPage.classList.add('hidden');
    page.classList.remove('hidden');
  };

  const addMessage = (messageData) => {
    const messageElement = document.createElement('div');
    messageElement.textContent = `${messageData.user}: ${messageData.text}`;
    messagesContainer.appendChild(messageElement);
  };

  const loadMessages = (channel) => {
    db.collection('channels').doc(channel).collection('messages').orderBy('timestamp', 'asc').onSnapshot((snapshot) => {
      messagesContainer.innerHTML = '';
      snapshot.forEach((doc) => {
        const messageData = doc.data();
        addMessage(messageData);
      });
    });
  };

  loginButton.addEventListener('click', () => {
    const email = loginEmail.value;
    const password = loginPassword.value;
    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        currentUser = userCredential.user;
        showPage(mainPage);
        loadMessages(currentChannel);
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
        showPage(mainPage);
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
      db.collection('channels').doc(currentChannel).collection('messages').add({
        text: message,
        user: currentUser.email,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
      messageInput.value = '';
    }
  });

  channelList.addEventListener('click', (event) => {
    if (event.target.tagName === 'LI') {
      currentChannel = event.target.dataset.channel;
      channelTitle.textContent = currentChannel;
      loadMessages(currentChannel);
    }
  });

  auth.onAuthStateChanged((user) => {
    if (user) {
      currentUser = user;
      showPage(mainPage);
      loadMessages(currentChannel);
    } else {
      currentUser = null;
      showPage(loginPage);
    }
  });

  const initializeChannels = () => {
    db.collection('channels').get().then((snapshot) => {
      snapshot.forEach((doc) => {
        const channelElement = document.createElement('li');
        channelElement.textContent = doc.id;
        channelElement.dataset.channel = doc.id;
        channelList.appendChild(channelElement);
      });
    });
  };

  initializeChannels();
});
