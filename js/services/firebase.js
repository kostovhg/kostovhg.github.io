// Initialize Firebase
var config = {
    apiKey: "AIzaSyDHPVNhWSnIc-2NZNn-XHIwmwYSOiE9GM8",
    authDomain: "pdb-aa8e8.firebaseapp.com",
    databaseURL: "https://pdb-aa8e8.firebaseio.com",
    projectId: "pdb-aa8e8",
    storageBucket: "pdb-aa8e8.appspot.com",
    messagingSenderId: "260563364863",
    appName: "spa_app"
};

firebase.initializeApp(config);

firebase.auth().onAuthStateChanged(function (user) {
    console.log(user)
    if (user) {
        for (const key in user) {
            if (user.hasOwnProperty(key) && /^[a-zA-Z]{3,}$/.test(key)) {
                if (typeof user[key] !== 'object' || user[key === null]) {
                    if (key === 'displayName' && user.displayName === null) {
                        sessionStorage.setIte('displayName', user.email.split('@')[0]);
                    } else {
                        sessionStorage.setItem('user' + (key.charAt(0).toUpperCase() + key.slice(1)), user[key]);
                    }
                } else {
                    let propObj = user[key];
                    for (const subKey in propObj) {
                        if (propObj.hasOwnProperty(subKey)) {
                            sessionStorage.setItem('user_' + (key.charAt(0).toUpperCase() + key.slice(1)) + '_' + subKey, propObj[subKey])

                        }
                    }
                }
            }
        }
    } else {
        sessionStorage.clear();
        console.log('User has logout');
    }
})

// /**
//  * initApp handles setting up UI event listeners and registering Firebase auth listeners:
//  *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
//  *    out, and that is where we update the UI.
//  */
// function initApp() {
//     // Listening for auth state changes.
//     // [START authstatelistener]
//     firebase.auth().onAuthStateChanged(function (user) {
//         // [START_EXCLUDE silent]
//         document.getElementById('quickstart-verify-email').disabled = true;
//         // [END_EXCLUDE]
//         if (user) {
//             // User is signed in.
//             var displayName = user.displayName;
//             var email = user.email;
//             var emailVerified = user.emailVerified;
//             var photoURL = user.photoURL;
//             var isAnonymous = user.isAnonymous;
//             var uid = user.uid;
//             var providerData = user.providerData;
//             // [START_EXCLUDE]
//             document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
//             document.getElementById('quickstart-sign-in').textContent = 'Sign out';
//             document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
//             if (!emailVerified) {
//                 document.getElementById('quickstart-verify-email').disabled = false;
//             }
//             // [END_EXCLUDE]
//         } else {
//             // User is signed out.
//             // [START_EXCLUDE]
//             document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
//             document.getElementById('quickstart-sign-in').textContent = 'Sign in';
//             document.getElementById('quickstart-account-details').textContent = 'null';
//             // [END_EXCLUDE]
//         }
//         // [START_EXCLUDE silent]
//         document.getElementById('quickstart-sign-in').disabled = false;
//         // [END_EXCLUDE]
//     });
//     // [END authstatelistener]
//     document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
//     document.getElementById('quickstart-sign-up').addEventListener('click', handleSignUp, false);
//     document.getElementById('quickstart-verify-email').addEventListener('click', sendEmailVerification, false);
//     document.getElementById('quickstart-password-reset').addEventListener('click', sendPasswordReset, false);
// }

// window.onload = function () {
//     initApp();
// };