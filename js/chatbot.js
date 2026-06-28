(function () {
  var botContainer, botBtn, botWindow, messagesEl, inputEl, sendBtn;

  var botOpen = false;
  var step = "greeting";
  var userName = "";
  var userEmail = "";
  var userPhone = "";
  var userInterest = "";
  var userMsg = "";

  var interests = [
    { label: "Food & FMCG", emoji: "🍚" },
    { label: "Building Materials", emoji: "🏗️" },
    { label: "Construction", emoji: "🏢" },
    { label: "Government Projects", emoji: "🏛️" },
    { label: "Global Sourcing", emoji: "🌍" },
    { label: "IT Services", emoji: "💻" },
    { label: "General Inquiry", emoji: "📋" },
  ];

  function init() {
    botContainer = document.createElement("div");
    botContainer.id = "vg-bot";

    botBtn = document.createElement("button");
    botBtn.id = "vg-bot-btn";
    botBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
    botBtn.setAttribute("aria-label", "Open chat");
    botBtn.onclick = toggleChat;

    botWindow = document.createElement("div");
    botWindow.id = "vg-bot-window";
    botWindow.innerHTML =
      '<div id="vg-bot-header"><span id="vg-bot-header-icon">💬</span><div><div id="vg-bot-header-title">Vertrauen Global</div><div id="vg-bot-header-sub">Trading Assistant</div></div><button id="vg-bot-close" aria-label="Close chat">&times;</button></div>' +
      '<div id="vg-bot-messages"></div>' +
      '<div id="vg-bot-input-area"><input id="vg-bot-input" type="text" placeholder="Type your message..."><button id="vg-bot-send" aria-label="Send"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button></div>';

    botContainer.appendChild(botBtn);
    botContainer.appendChild(botWindow);
    document.body.appendChild(botContainer);

    messagesEl = document.getElementById("vg-bot-messages");
    inputEl = document.getElementById("vg-bot-input");
    sendBtn = document.getElementById("vg-bot-send");
    document.getElementById("vg-bot-close").onclick = toggleChat;

    function onSend() {
      var text = inputEl.value.trim();
      if (text) { handleInput(text); inputEl.value = ""; }
    }
    sendBtn.onclick = onSend;
    inputEl.addEventListener("keydown", function (e) {
      if (e.key === "Enter") onSend();
    });

    setTimeout(function () {
      addBotMsg("👋 Welcome to Vertrauen Global Trading! How can I assist you today?");
      addBotMsg("I can help you with our services, provide information, or connect you with our team.");
      showQuickReplies();
    }, 1000);
  }

  function toggleChat() {
    botOpen = !botOpen;
    botWindow.classList.toggle("open", botOpen);
    botBtn.classList.toggle("hidden", botOpen);
    if (botOpen) setTimeout(function () { inputEl.focus(); }, 300);
  }

  function addBotMsg(text) {
    var div = document.createElement("div");
    div.className = "vg-bot-msg vg-bot-msg-bot";
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function addUserMsg(text) {
    var div = document.createElement("div");
    div.className = "vg-bot-msg vg-bot-msg-user";
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function showQuickReplies(options) {
    var cont = document.createElement("div");
    cont.className = "vg-bot-qr";
    (options || interests).forEach(function (opt) {
      var btn = document.createElement("button");
      btn.className = "vg-bot-qr-btn";
      btn.textContent = (opt.emoji ? opt.emoji + " " : "") + (opt.label || opt);
      btn.onclick = function () {
        cont.innerHTML = "";
        handleInput(opt.label || opt);
      };
      cont.appendChild(btn);
    });
    messagesEl.appendChild(cont);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function processResponse(text) {
    var lower = text.toLowerCase();

    if (lower.includes("food") || lower.includes("fmcg") || lower.includes("building") || lower.includes("construction") || lower.includes("government") || lower.includes("sourcing") || lower.includes("it service") || lower.includes("general")) {
      var map = {
        "food": "food-fmcg.html",
        "building": "building-materials.html",
        "construction": "construction.html",
        "government": "government.html",
        "sourcing": "global-sourcing.html",
        "it": "it-services.html"
      };
      var url = "contact.html";
      for (var k in map) {
        if (lower.includes(k)) { url = map[k]; break; }
      }
      addBotMsg("Great choice! You can learn more about this on our dedicated page.");
      addBotMsg("Would you like our team to contact you about this? Please share your name.");
      step = "ask_name_intent";
      userInterest = text;
    } else if (lower.includes("contact") || lower.includes("call") || lower.includes("email") || lower.includes("help")) {
      addBotMsg("I'd be happy to connect you with our team. What's your name?");
      step = "ask_name_contact";
    } else if (lower.includes("price") || lower.includes("cost") || lower.includes("quote")) {
      addBotMsg("For pricing and quotes, our sales team will get back to you. Let me take your details.");
      addBotMsg("First, what's your name?");
      step = "ask_name_quote";
    } else if (lower.includes("hello") || lower.includes("hi ") || lower.includes("hey")) {
      addBotMsg("Hello! Welcome to Vertrauen Global Trading. How can I help you today?");
      showQuickReplies();
    } else if (lower.includes("thank") || lower.includes("thanks")) {
      addBotMsg("You're welcome! Feel free to reach out anytime. Have a great day! 😊");
    } else if (lower.includes("about") || lower.includes("who")) {
      addBotMsg("Vertrauen Global Trading W.L.L. is a Qatar-based diversified trading and contracting company with 5+ business divisions. We specialize in Food & FMCG, Building Materials, Construction, Government Projects, Global Sourcing, and IT Services.");
      showQuickReplies();
    } else {
      addBotMsg("Thank you for your message! I'll connect you with our team for a detailed response.");
      addBotMsg("Could you please share your name first?");
      step = "ask_name_fallback";
    }
  }

  function handleInput(text) {
    addUserMsg(text);

    if (step === "greeting") {
      processResponse(text);
      return;
    }

    if (step.startsWith("ask_name")) {
      userName = text;
      step = step.replace("name", "email");
      addBotMsg("Nice to meet you, " + text + "! What's your email address?");
      return;
    }

    if (step.startsWith("ask_email")) {
      userEmail = text;
      step = step.replace("email", "phone");
      addBotMsg("Thanks! And your phone number?");
      return;
    }

    if (step.startsWith("ask_phone")) {
      userPhone = text;
      step = step.replace("phone", "done");
      sendLead();
      return;
    }

    processResponse(text);
  }

  function sendLead() {
    var msg = "New Lead from Chatbot:\nName: " + userName + "\nEmail: " + userEmail + "\nPhone: " + userPhone + "\nInterest: " + (userInterest || "Not specified") + "\nMessage: " + (userMsg || "Not specified");

    addBotMsg("Thank you " + userName + "! Our team will get back to you within 24 hours. 😊");

    var mailto = "mailto:info@vertrauenglobal.com?subject=Chatbot%20Lead%20-%20" + encodeURIComponent(userName) + "&body=" + encodeURIComponent(msg);
    var link = document.createElement("a");
    link.href = mailto;
    link.click();

    userName = ""; userEmail = ""; userPhone = ""; userInterest = ""; userMsg = "";
    step = "greeting";

    setTimeout(function () {
      addBotMsg("Is there anything else I can help you with?");
      showQuickReplies();
    }, 2000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
