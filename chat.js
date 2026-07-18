(function() {
  const knowledge = {
    greetings: ['hello', 'hi', 'hey', 'sup', 'yo', 'good morning', 'good afternoon', 'good evening'],
    property: ['landlord', 'property', 'notice', 'eviction', 'lease', 'lacda', '3-day', 'rent', 'tenant screening', 'background check'],
    tenant: ['tenant', 'repair', 'maintenance', 'leak', 'broken', 'fix', 'portal', 'submit request', 'feedback'],
    intake: ['apply', 'application', 'rental', 'new tenant', 'move in', 'lease application', 'screening'],
    ai: ['ai', 'automation', 'consulting', 'it', 'software', 'architecture', 'bot', 'agent', 'workflow'],
    contact: ['phone', 'call', 'email', 'reach', 'contact', 'talk to', 'speak with'],
    emergency: ['emergency', 'urgent', 'flood', 'fire', 'gas', 'lockout', 'no heat', 'no water', 'broken pipe'],
    pricing: ['price', 'cost', 'fee', 'how much', 'rate', 'charge'],
    location: ['where', 'location', 'address', 'office', 'based', 'city'],
    hours: ['hours', 'open', 'available', 'when', 'time', 'schedule']
  };

  const responses = {
    greeting: "Hey there! I'm the EastWest Help AI Assistant. I can help you with property services, tenant requests, new applications, or our AI consulting. What can I do for you?",
    property: "We handle notices, eviction filings, lease agreements, and LACDA paperwork for landlords in CA and TN. Everything is prepared fast and compliant. <a href='/property'>Go to Property Services →</a>",
    tenant: "For maintenance requests, questions, or feedback, use our Tenant Portal. For emergencies, call <strong>(213) 302-6757</strong> immediately — no portal entry needed. <a href='/tenant'>Open Tenant Portal →</a>",
    intake: "Ready to apply? Our New Tenant Intake form takes about 5 minutes. We'll need basic info and ID verification (call us for that part — we don't collect SSN or driver's license numbers online for security). <a href='/intake'>Start Application →</a>",
    ai: "We design and deploy AI-driven architectures — support agents, financial auditing automation, and operational monitoring. Every solution is built for scale. Want to discuss a project? <a href='#engagement'>Contact us below →</a>",
    contact: "You can reach us at <strong>info@eastwesthelp.com</strong> or call <strong>(213) 302-6757</strong>. For non-emergencies, the contact form at the bottom of this page works great too.",
    emergency: "<div style='background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:12px;margin-top:8px;font-size:12px;color:#991b1b'><strong style='display:block;margin-bottom:4px;font-size:13px'>🚨 This sounds like an emergency</strong>For genuine emergencies (flood, fire, gas leak, lockout, no heat/water), call us immediately:<br><a href='tel:2133026757' style='color:#dc2626;font-weight:600;text-decoration:none'>(213) 302-6757</a><br>Do NOT use the portal for emergencies.</div>",
    pricing: "Pricing depends on the service. Property document prep starts at a flat fee per notice/lease. AI consulting is scoped per project. <a href='#engagement'>Reach out for a quote →</a>",
    location: "We're based in Los Angeles, CA, and serve landlords and tenants across California and Tennessee. We operate remotely for most AI consulting work.",
    hours: "We're available Monday–Friday, 9am–6pm PT. The tenant portal and this chat are always open. For emergencies, call (213) 302-6757 anytime.",
    fallback: "I'm not sure I caught that. I can help with: property services, tenant repairs, new applications, AI consulting, or general questions. What would you like to know?"
  };

  const quickActions = [
    { label: "🏠 Property Services", intent: "property" },
    { label: "🔧 Submit Repair", intent: "tenant" },
    { label: "📝 New Application", intent: "intake" },
    { label: "🤖 AI Consulting", intent: "ai" },
    { label: "📞 Contact Info", intent: "contact" },
    { label: "🚨 Emergency", intent: "emergency" }
  ];

  let isOpen = false;
  let hasGreeted = false;

  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      #ewh-chat-btn {
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: #38bdf8;
        color: white;
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(56,189,248,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 50;
        transition: transform 0.2s, box-shadow 0.2s;
      }
      #ewh-chat-btn:hover { transform: scale(1.05); box-shadow: 0 6px 28px rgba(56,189,248,0.5); }
      #ewh-chat-btn svg { width: 28px; height: 28px; }
      #ewh-chat-btn .close-icon { display: none; }
      #ewh-chat-btn.open .chat-icon { display: none; }
      #ewh-chat-btn.open .close-icon { display: block; }

      #ewh-chat-panel {
        position: fixed;
        bottom: 92px;
        right: 24px;
        width: 360px;
        max-width: calc(100vw - 48px);
        height: 520px;
        max-height: calc(100vh - 120px);
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.15);
        display: none;
        flex-direction: column;
        z-index: 50;
        overflow: hidden;
        font-family: 'Inter', sans-serif;
      }
      #ewh-chat-panel.open { display: flex; }

      .ewh-chat-header {
        background: #38bdf8;
        color: white;
        padding: 16px 20px;
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .ewh-chat-header h3 {
        font-family: 'Space Grotesk', sans-serif;
        font-weight: 600;
        font-size: 16px;
        margin: 0;
      }
      .ewh-chat-header p {
        font-size: 12px;
        opacity: 0.9;
        margin: 2px 0 0;
      }
      .ewh-chat-header .status-dot {
        width: 8px;
        height: 8px;
        background: #4ade80;
        border-radius: 50%;
        box-shadow: 0 0 0 2px rgba(74,222,128,0.3);
        animation: ewh-pulse 2s infinite;
      }
      @keyframes ewh-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }

      .ewh-chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        scroll-behavior: smooth;
      }
      .ewh-chat-messages::-webkit-scrollbar { width: 6px; }
      .ewh-chat-messages::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }

      .ewh-msg {
        max-width: 85%;
        padding: 10px 14px;
        border-radius: 16px;
        font-size: 13px;
        line-height: 1.5;
        animation: ewh-fade-in 0.3s ease;
      }
      @keyframes ewh-fade-in {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .ewh-msg.user {
        align-self: flex-end;
        background: #1d4ed8;
        color: white;
        border-bottom-right-radius: 4px;
      }
      .ewh-msg.bot {
        align-self: flex-start;
        background: #f1f5f9;
        color: #1e293b;
        border-bottom-left-radius: 4px;
      }
      .ewh-msg.bot a {
        color: #1d4ed8;
        text-decoration: underline;
        font-weight: 500;
      }
      .ewh-msg.bot .quick-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 10px;
      }
      .ewh-msg.bot .quick-actions button {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 20px;
        padding: 6px 14px;
        font-size: 12px;
        color: #475569;
        cursor: pointer;
        transition: all 0.15s;
        font-family: 'Inter', sans-serif;
      }
      .ewh-msg.bot .quick-actions button:hover {
        border-color: #38bdf8;
        color: #1d4ed8;
        background: #f0f9ff;
      }

      .ewh-typing {
        display: flex;
        gap: 4px;
        padding: 12px 14px;
        align-self: flex-start;
      }
      .ewh-typing span {
        width: 8px;
        height: 8px;
        background: #cbd5e1;
        border-radius: 50%;
        animation: ewh-bounce 1.4s infinite ease-in-out both;
      }
      .ewh-typing span:nth-child(1) { animation-delay: -0.32s; }
      .ewh-typing span:nth-child(2) { animation-delay: -0.16s; }
      @keyframes ewh-bounce {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1); }
      }

      .ewh-chat-input {
        display: flex;
        gap: 8px;
        padding: 12px 16px;
        border-top: 1px solid #e2e8f0;
        background: #f8fafc;
      }
      .ewh-chat-input input {
        flex: 1;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 10px 14px;
        font-size: 13px;
        font-family: 'Inter', sans-serif;
        outline: none;
        background: white;
      }
      .ewh-chat-input input:focus { border-color: #38bdf8; }
      .ewh-chat-input button {
        background: #1d4ed8;
        color: white;
        border: none;
        border-radius: 12px;
        padding: 10px 16px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.15s;
        font-family: 'Inter', sans-serif;
      }
      .ewh-chat-input button:hover { background: #1e40af; }
    `;
    document.head.appendChild(style);
  }

  function injectHTML() {
    const panel = document.createElement('div');
    panel.id = 'ewh-chat-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'EastWest Help Assistant');
    panel.setAttribute('aria-hidden', 'true');
    panel.innerHTML = `
      <div class="ewh-chat-header">
        <div class="status-dot"></div>
        <div>
          <h3>EastWest Help</h3>
          <p>AI Assistant — typically replies instantly</p>
        </div>
      </div>
      <div class="ewh-chat-messages" id="ewh-messages"></div>
      <div class="ewh-chat-input">
        <input type="text" id="ewh-input" placeholder="Ask about property, tenants, AI services..." aria-label="Type your message">
        <button id="ewh-send-btn">Send</button>
      </div>
    `;
    document.body.appendChild(panel);

    const btn = document.createElement('button');
    btn.id = 'ewh-chat-btn';
    btn.setAttribute('aria-label', 'Open chat assistant');
    btn.innerHTML = `
      <svg class="chat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
      <svg class="close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
    `;
    document.body.appendChild(btn);
  }

  function ewhToggle() {
    isOpen = !isOpen;
    const panel = document.getElementById('ewh-chat-panel');
    const btn = document.getElementById('ewh-chat-btn');
    panel.classList.toggle('open', isOpen);
    panel.setAttribute('aria-hidden', !isOpen);
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-label', isOpen ? 'Close chat assistant' : 'Open chat assistant');
    if (isOpen && !hasGreeted) {
      hasGreeted = true;
      setTimeout(() => ewhBotMessage(responses.greeting, true), 400);
    }
    if (isOpen) document.getElementById('ewh-input').focus();
  }

  function ewhSend() {
    const input = document.getElementById('ewh-input');
    const text = input.value.trim();
    if (!text) return;
    ewhUserMessage(text);
    input.value = '';
    ewhThink(text);
  }

  function ewhUserMessage(text) {
    const container = document.getElementById('ewh-messages');
    const div = document.createElement('div');
    div.className = 'ewh-msg user';
    div.textContent = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  function ewhBotMessage(html, showActions) {
    const container = document.getElementById('ewh-messages');
    const div = document.createElement('div');
    div.className = 'ewh-msg bot';
    div.innerHTML = html;
    if (showActions) {
      const actions = document.createElement('div');
      actions.className = 'quick-actions';
      quickActions.forEach(a => {
        const btn = document.createElement('button');
        btn.textContent = a.label;
        btn.onclick = () => {
          ewhUserMessage(a.label);
          ewhThink(a.label, true);
        };
        actions.appendChild(btn);
      });
      div.appendChild(actions);
    }
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  function ewhThink(text, skipTyping) {
    const container = document.getElementById('ewh-messages');
    const typing = document.createElement('div');
    typing.className = 'ewh-typing';
    typing.id = 'ewh-typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    container.appendChild(typing);
    container.scrollTop = container.scrollHeight;

    const delay = skipTyping ? 300 : 600 + Math.random() * 800;
    setTimeout(() => {
      const t = document.getElementById('ewh-typing');
      if (t) t.remove();
      const intent = ewhClassify(text.toLowerCase());
      ewhBotMessage(responses[intent] || responses.fallback, false);
    }, delay);
  }

  function ewhClassify(text) {
    for (const [intent, keywords] of Object.entries(knowledge)) {
      if (keywords.some(k => text.includes(k))) return intent;
    }
    return 'fallback';
  }

  function init() {
    injectStyles();
    injectHTML();
    document.getElementById('ewh-chat-btn').addEventListener('click', ewhToggle);
    document.getElementById('ewh-send-btn').addEventListener('click', ewhSend);
    document.getElementById('ewh-input').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') ewhSend();
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && isOpen) ewhToggle();
    });
    document.addEventListener('click', function(e) {
      if (isOpen && !e.target.closest('#ewh-chat-panel') && !e.target.closest('#ewh-chat-btn')) {
        ewhToggle();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
