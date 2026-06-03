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
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" fill-rule="evenodd" height="1em" style="flex:none;line-height:1" viewBox="0 0 24 24" width="1em"><path d="M12.604 1.34c.393.69.784 1.382 1.174 2.075a.18.18 0 00.157.091h5.552c.174 0 .322.11.446.327l1.454 2.57c.19.337.24.478.024.837-.26.43-.513.864-.76 1.3l-.367.658c-.106.196-.223.28-.04.512l2.652 4.637c.172.301.111.494-.043.77-.437.785-.882 1.564-1.335 2.34-.159.272-.352.375-.68.37-.777-.016-1.552-.01-2.327.016a.099.099 0 00-.081.05 575.097 575.097 0 01-2.705 4.74c-.169.293-.38.363-.725.364-.997.003-2.002.004-3.017.002a.537.537 0 01-.465-.271l-1.335-2.323a.09.09 0 00-.083-.049H4.982c-.285.03-.553-.001-.805-.092l-1.603-2.77a.543.543 0 01-.002-.54l1.207-2.12a.198.198 0 000-.197 550.951 550.951 0 01-1.875-3.272l-.79-1.395c-.16-.31-.173-.496.095-.965.465-.813.927-1.625 1.387-2.436.132-.234.304-.334.584-.335a338.3 338.3 0 012.589-.001.124.124 0 00.107-.063l2.806-4.895a.488.488 0 01.422-.246c.524-.001 1.053 0 1.583-.006L11.704 1c.341-.003.724.032.9.34zm-3.432.403a.06.06 0 00-.052.03L6.254 6.788a.157.157 0 01-.135.078H3.253c-.056 0-.07.025-.041.074l5.81 10.156c.025.042.013.062-.034.063l-2.795.015a.218.218 0 00-.2.116l-1.32 2.31c-.044.078-.021.118.068.118l5.716.008c.046 0 .08.02.104.061l1.403 2.454c.046.081.092.082.139 0l5.006-8.76.783-1.382a.055.055 0 01.096 0l1.424 2.53a.122.122 0 00.107.062l2.763-.02a.04.04 0 00.035-.02.041.041 0 000-.04l-2.9-5.086a.108.108 0 010-.113l.293-.507 1.12-1.977c.024-.041.012-.062-.035-.062H9.2c-.059 0-.073-.026-.043-.077l1.434-2.505a.107.107 0 000-.114L9.225 1.774a.06.06 0 00-.053-.031zm6.29 8.02c.046 0 .058.02.034.06l-.832 1.465-2.613 4.585a.056.056 0 01-.05.029.058.058 0 01-.05-.029L8.498 9.841c-.02-.034-.01-.052.028-.054l.216-.012 6.722-.012z"/></svg>'
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
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" fill-rule="evenodd" height="1em" style="flex:none;line-height:1" viewBox="0 0 24 24" width="1em"><path d="M21.846 0a1.923 1.923 0 110 3.846H20.15a.226.226 0 01-.227-.226V1.923C19.923.861 20.784 0 21.846 0z"/><path d="M11.065 11.199l7.257-7.2c.137-.136.06-.41-.116-.41H14.3a.164.164 0 00-.117.051l-7.82 7.756c-.122.12-.302.013-.302-.179V3.82c0-.127-.083-.23-.185-.23H3.186c-.103 0-.186.103-.186.23V19.77c0 .128.083.23.186.23h2.69c.103 0 .186-.102.186-.23v-3.25c0-.069.025-.135.069-.178l2.424-2.406a.158.158 0 01.205-.023l6.484 4.772a7.677 7.677 0 003.453 1.283c.108.012.2-.095.2-.23v-3.06c0-.117-.07-.212-.164-.227a5.028 5.028 0 01-2.027-.807l-5.613-4.064c-.117-.078-.132-.279-.028-.381z"/></svg>'
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
