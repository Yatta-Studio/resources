var www_chatbots = [
    {
        name: "Gemini",
        url: "https://gemini.google.com/app",
        provider: "Google",
        features: [],
        icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://w3.org"><path d="M12 2C12 2 13 8 18 12C13 16 12 22 12 22C12 22 11 16 6 12C11 8 12 2 12 2Z" fill="url(#gemini-grad)"/><defs><linearGradient id="gemini-grad" x1="6" y1="2" x2="18" y2="22" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#4285F4"/><stop offset="50%" stop-color="#9B51E0"/><stop offset="100%" stop-color="#EA4335"/></linearGradient></defs></svg>'
    },
    { 
        name: "Grok", 
        url: "https://grok.com/", 
        provider: "xAI", 
        features: [],
        icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://w3.org"><path d="M4 4H9L14 13L19 4H20M4 20L13 11M20 20H15L11.5 14" stroke="#000000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    },
    { 
        name: "Claude", 
        url: "", 
        provider: "Anthropic", 
        features: [],
        icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://w3.org"><path d="M4.5 19.5C3.5 16.5 3 13 4 9.5C5 6 7.5 3.5 11 3C15.5 2.5 19 5.5 20 9.5C21.5 14.5 18.5 19.5 14.5 20.5C11.5 21.2 7.5 21.2 4.5 19.5Z" fill="#CC664B"/><path d="M8.5 15.5C9.5 12 11.5 8.5 15.5 8" stroke="#FFF7ED" stroke-width="2" stroke-linecap="round"/></svg>'
    },
    {
        name: "ChatGPT",
        url: "https://chatgpt.com/",
        provider: "OpenAI",
        features: [],
        icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://w3.org"><path d="M4.5 19.5C3.5 16.5 3 13 4 9.5C5 6 7.5 3.5 11 3C15.5 2.5 19 5.5 20 9.5C21.5 14.5 18.5 19.5 14.5 20.5C11.5 21.2 7.5 21.2 4.5 19.5Z" fill="#CC664B"/><path d="M8.5 15.5C9.5 12 11.5 8.5 15.5 8" stroke="#FFF7ED" stroke-width="2" stroke-linecap="round"/></svg>'
    },
    {
        name: "Allen AI",
        url: "https://playground.allenai.org/",
        provider: "Allen Institute for AI",
        features: [],
        icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://w3.org"><path d="M12 3L3 8V16L12 21L21 16V8L12 3Z" stroke="#2A3B50" stroke-width="2" stroke-linejoin="round"/><path d="M12 8V16M8 12H16" stroke="#16A34A" stroke-width="2" stroke-linecap="round"/></svg>'
    },
    {
        name: "Le Chat",
        url: "https://chat.mistral.ai/chat",
        provider: "Mistral AI",
        features: [],
        icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://w3.org"><path d="M3 4H10.5L12 9L13.5 4H21V20H16.5V9.5L12 14.5L7.5 9.5V20H3V4Z" fill="#F15A24"/></svg>'
    },
    {
        name: "Meta AI",
        url: "https://www.meta.ai/",
        provider: "Meta",
        features: [],
        icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://w3.org"><path d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z" stroke="url(#meta-grad)" stroke-width="3"/><defs><linearGradient id="meta-grad" x1="7" y1="7" x2="17" y2="17" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#0064E0"/><stop offset="100%" stop-color="#00B2FF"/></linearGradient></defs></svg>'
    },
    {
        name: "Qwen",
        url: "https://chat.qwen.ai/",
        provider: "Alibaba",
        features: [],
        icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://w3.org"><path d="M12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21C14 21 15.86 20.35 17.38 19.24L21 21L19.24 17.38C20.35 15.86 21 14 21 12C21 7.03 16.97 3 12 3ZM11 8H13V13H11V8ZM11 15H13V17H11V15Z" fill="#6113A3"/></svg>'
    },
    {
        name: "Deepseek AI",
        url: "https://chat.deepseek.com/",
        provider: "DeepSeek",
        features: [],
        icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://w3.org"><path d="M12 3L3 7.5V16.5L12 21L21 16.5V7.5L12 3Z" fill="#3D52D5"/><path d="M12 7V17M8 10L12 7L16 10" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    },
    {
        name: "Kimi",
        url: "https://www.kimi.com/",
        provider: "Moonshot AI",
        features: [],
        icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://w3.org"><path d="M12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21C16.97 21 21 16.97 21 12C21 7.03 16.97 3 12 3ZM9.5 8.5C10.33 8.5 11 9.17 11 10C11 10.83 10.33 11.5 9.5 11.5C8.67 11.5 8 10.83 8 10C8 9.17 8.67 8.5 9.5 8.5ZM14.5 15.5H9.5V14.5C9.5 13.5 11.5 12.5 12 12.5C12.5 12.5 14.5 13.5 14.5 14.5V15.5ZM14.5 11.5C13.67 11.5 13 10.83 13 10C13 9.17 13.67 8.5 14.5 8.5C15.33 8.5 16 9.17 16 10C16 10.83 15.33 11.5 14.5 11.5Z" fill="#FF6B00"/></svg>'
    },
    {
        name: "Manus AI",
        url: "https://manus.im/app",
        provider: "Manus",
        features: [],
        icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://w3.org"><path d="M4 6H20V18H4V6Z" stroke="#0F172A" stroke-width="2" stroke-linejoin="round"/><path d="M8 10L11 12L8 14M13 14H16" stroke="#0F172A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    },
    { 
        name: "Z.ai", 
        url: "https://z.ai/chat", 
        provider: "Z.ai", 
        features: [],
        icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://w3.org"><path d="M5 5H19L5 19H19" stroke="#111827" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    },
    {
        name: "Perplexity AI",
        url: "https://www.perplexity.ai/",
        provider: "Perplexity AI",
        features: [],
        icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://w3.org"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#13C2C2"/><path d="M10.5 8.5L14 12L10.5 15.5" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    },
    {
        name: "Deep Cogito",
        url: "https://chat.deepcogito.com/",
        provider: "Deep Cogito",
        features: [],
        icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://w3.org"><path d="M12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4ZM12 7C13.66 7 15 8.34 15 10C15 11.66 13.66 13 12 13C10.34 13 9 11.66 9 10C9 8.34 10.34 7 12 7ZM8 16C8 14.5 10 13.5 12 13.5C14 13.5 16 14.5 16 16V17H8V16Z" fill="#4A5568"/></svg>'
    },
    {
        name: "HuggingChat",
        url: "https://huggingface.co/chat/",
        provider: "Hugging Face",
        features: [],
        icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://w3.org"><path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" fill="#FFD21E"/><path d="M9 10C9.55228 10 10 9.55228 10 9C10 8.44772 9.55228 8 9 8C8.44772 8 8 8.44772 8 9C8 9.55228 8.44772 10 9 10ZM15 10C15.5523 10 16 9.55228 16 9C16 8.44772 15.5523 8 15 8C14.4477 8 14 8.44772 14 9C14 9.55228 14.4477 10 15 10ZM12 16C14.5 16 16 14 16 14H8C8 14 9.5 16 12 16Z" fill="#000000"/></svg>'
    },
];
