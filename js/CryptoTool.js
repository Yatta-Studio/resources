const CryptoTool = {
  // Internal helper to derive a secure cryptographic key from a text secret
  // tqxQB+rdTBW2lm69VRwm+iA62xTbP0jIdBFDbQMKJl54Fv0QrkhqtNlWEcsDLz5zcym62uPTwUEvAichGupJ4iNNcjxsbnRmrrl7pcci939hxObPzVydtEb+R4uVEvdskEc0x0Y=
  async _getKey(secret, usage) {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );
    return window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: enc.encode("fixed-salt-value"), 
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      [usage]
    );
  },

  // Encrypts a string and outputs a Base64-encoded token
  async encrypt(text, secret) {
    const enc = new TextEncoder();
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const key = await this._getKey(secret, "encrypt");
    const encrypted = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      key,
      enc.encode(text)
    );
    
    const combined = new Uint8Array(iv.length + new Uint8Array(encrypted).length);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);
    return btoa(String.fromCharCode(...combined));
  },

  // Decrypts a Base64-encoded token back into the original string
  async decrypt(encryptedBase64, secret) {
    try {
      const dec = new TextDecoder();
      const data = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
      const iv = data.slice(0, 12);
      const encrypted = data.slice(12);
      const key = await this._getKey(secret, "decrypt");
      const decrypted = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv: iv },
        key,
        encrypted
      );
      return dec.decode(decrypted);
    } catch (e) {
      throw new Error("Decryption failed. Invalid secret key or corrupted data.");
    }
  }
};
