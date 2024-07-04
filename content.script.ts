function getStoredPasswords(url: string): Promise<any> {
    return fetch('http://44.206.224.230/api/passwords?url=' + encodeURIComponent(url))
     .then(response => response.json());
  }
  
  function autofillFields(storedPassword: any) {
    const emailInput : any= document.querySelector('input[type="email"]');
    const passwordInput: any  = document.querySelector('input[type="password"]');
  
    if (emailInput && passwordInput) {
      emailInput.value = storedPassword.username;
      passwordInput.value = storedPassword.password;
    }
  }
  
  function listenForUrlChanges() {
    let currentUrl = window.location.href;
    const URL_CHANGE_DETECTION_INTERVAL = 1000; // 1 second
  
    setInterval(() => {
      const newUrl = window.location.href;
      if (newUrl!== currentUrl) {
        currentUrl = newUrl;
        getStoredPasswords(newUrl).then(storedPassword => {
          if (storedPassword) {
            autofillFields(storedPassword);
          }
        });
      }
    }, URL_CHANGE_DETECTION_INTERVAL);
  }
  
  listenForUrlChanges();