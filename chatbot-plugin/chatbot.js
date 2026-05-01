/* ── BALCO CHATBOT PLUGIN - chatbot.js
   Drop chatbot-plugin/ folder + 3 lines into any page to embed the chatbot.
   Limit: 600 lines. */

(function () {
  "use strict";

  // ── CONFIG ─────────────────────────────────
  const CONFIG = {
    apiBase: "https://saggy-shrewdly-premiere.ngrok-free.dev/chat",
    queryParam: "q",
    sessionParam: "session_id",
    sessionStorageKey: "balco_session_id",
    sessionTTL: 30 * 60 * 1000, // 30 minutes in milliseconds
    botName: "BALCO Assistant",
    logoSrc: "assets/images/balco_logo.png",
    welcomeMsg:
      "Hello! 👋 I'm the BALCO Medical Centre assistant. I can help you with information about our cancer treatments, specialities, doctors, appointments, and more. How can I help you today?",
    quickReplies: [
      "Book Appointment",
      "Our Specialities",
      "Contact Us",
      "Our Doctors",
    ],
  };

  // ── SESSION ID MANAGEMENT ──────────────────
  // Stores { id, createdAt } in localStorage.
  // If missing OR older than 30 minutes, a fresh ID is generated.
  // Naturally resets when the user clears site data / cache.

  function generateSessionId() {
    if (window.crypto && window.crypto.randomUUID) {
      return window.crypto.randomUUID();
    }
    // Fallback for very old browsers
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
  }

  function getOrCreateSessionId() {
    try {
      const stored = localStorage.getItem(CONFIG.sessionStorageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        const age = Date.now() - parsed.createdAt;
        if (age < CONFIG.sessionTTL) return parsed.id;
      }
    } catch (e) {
      // localStorage blocked (private mode, etc.) — fall through
    }

    const newSession = { id: generateSessionId(), createdAt: Date.now() };
    try {
      localStorage.setItem(
        CONFIG.sessionStorageKey,
        JSON.stringify(newSession),
      );
    } catch (e) {
      // Unavailable — session works for this page visit only
    }
    return newSession.id;
  }

  // Resolved once at load time; used in every API call
  const SESSION_ID = getOrCreateSessionId();

  // ── PENDING ACTION ─────────────────────────
  // When the backend sends an action (e.g. redirect), we hold it here.
  // It is consumed or discarded when the user clicks a suggestion chip.
  // It is never sent to the backend — purely a frontend concern.
  let pendingAction = null;

  // ── HELPERS ────────────────────────────────
  function getTime() {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function escapeHtml(text) {
    const d = document.createElement("div");
    d.textContent = text;
    return d.innerHTML;
  }

  // ── SOUND NOTIFICATION ─────────────────────
  function playChime() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
      // silently fail if browser blocks audio
    }
  }

  // ── BUILD DOM ─────────────────────────────
  function buildChatbot() {
    // Trigger button
    const trigger = document.createElement("button");
    trigger.id = "balco-chat-trigger";
    trigger.setAttribute("aria-label", "Open BALCO chat assistant");
    trigger.innerHTML = `
      <svg class="icon-chat" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 10H6v-2h12v2zm0-3H6V7h12v2z"/>
      </svg>
      <svg class="icon-close" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
      </svg>
      <div id="balco-unread-badge"></div>`;
    document.body.appendChild(trigger);

    // Chat window
    const win = document.createElement("div");
    win.id = "balco-chat-window";
    win.setAttribute("role", "dialog");
    win.setAttribute("aria-label", "BALCO Medical Centre Chat Assistant");
    win.innerHTML = `
      <div class="balco-chat-header">
        <div class="balco-avatar">
          <img src="${CONFIG.logoSrc}" alt="BALCO Logo" class="balco-avatar-img">
        </div>
        <div class="balco-header-info">
          <h3>${CONFIG.botName}</h3>
          <p><span class="status-dot"></span> Online · BALCO Medical Centre</p>
        </div>
        <button id="balco-dark-toggle" aria-label="Toggle dark mode" title="Switch to dark mode">
          <svg viewBox="0 0 24 24" fill="#2d7a31"><path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg>
        </button>
      </div>

      <div class="balco-messages" id="balco-messages" role="log" aria-live="polite"></div>

      <div class="balco-quick-replies" id="balco-quick-replies">
        ${CONFIG.quickReplies
          .map(
            (q) =>
              `<button class="quick-reply-btn" data-query="${q}">${q}</button>`,
          )
          .join("")}
      </div>

      <div class="balco-input-area">
        <input
          type="text"
          id="balco-user-input"
          placeholder="Type your message..."
          aria-label="Type your message"
          maxlength="300"
          autocomplete="off"
        />
        <button id="balco-send-btn" aria-label="Send message">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
      <div class="balco-char-row">
        <span id="balco-char-counter">300 characters remaining</span>
      </div>

      <div class="balco-chat-footer">
        Powered by <span>BALCO Medical Centre AI</span>
      </div>`;
    document.body.appendChild(win);

    // Scroll-to-bottom pill — inside the window so it stays positioned correctly
    const pill = document.createElement("button");
    pill.id = "balco-scroll-pill";
    pill.textContent = "↓ Latest message";
    pill.addEventListener("click", () => scrollToBottom(true));
    win.appendChild(pill);
  }

  // ── SUGGESTION CHIPS ──────────────────────
  // Renders clickable chips below a bot reply.
  // Special case: if pendingAction.type === "redirect" and the user clicks
  // "Yes, take me there", open the URL in a new tab and skip the API call.
  // Any other chip (including "No, continue here") clears the action and
  // sends the text to the backend as a normal message.

  function appendSuggestions(suggestions) {
    if (!Array.isArray(suggestions) || suggestions.length === 0) return;

    const container = document.getElementById("balco-messages");
    const chipsEl = document.createElement("div");
    chipsEl.className = "balco-suggestion-chips";

    suggestions.forEach((suggestion) => {
      const btn = document.createElement("button");
      btn.className = "suggestion-chip-btn";
      btn.textContent = suggestion;

      btn.addEventListener("click", () => {
        // Clear all chip rows first so they don't pile up
        container
          .querySelectorAll(".balco-suggestion-chips")
          .forEach((el) => el.remove());

        // Check for a pending redirect action
        if (
          pendingAction &&
          pendingAction.type === "redirect" &&
          btn.textContent.trim().toLowerCase() === "yes, take me there"
        ) {
          // Open the booking / target URL in a new tab — nothing sent to backend
          window.open(pendingAction.url, "_blank");
          pendingAction = null;
          return;
        }

        // "No, continue here" or any other chip — clear action, chat normally
        pendingAction = null;
        sendMessage(suggestion);
      });

      chipsEl.appendChild(btn);
    });

    container.appendChild(chipsEl);
    scrollToBottom();
  }

  // ── MESSAGE RENDERING ─────────────────────
  function appendMessage(text, sender, isError = false) {
    const container = document.getElementById("balco-messages");
    const msgEl = document.createElement("div");
    msgEl.className = `balco-msg ${sender}`;
    const time = getTime();

    if (sender === "bot") {
      const msgId = `msg-${Date.now()}`;
      msgEl.innerHTML = `
        <div class="msg-icon">
          <img src="${CONFIG.logoSrc}" alt="BALCO" onerror="this.src='';this.style.display='none'"/>
        </div>
        <div>
          <div class="msg-bubble${isError ? " error" : ""}">${escapeHtml(text)}</div>
          <span class="msg-time">${time}</span>
          <div class="msg-reactions" data-id="${msgId}">
            <button class="reaction-btn up-btn" title="Helpful">👍</button>
            <button class="reaction-btn down-btn" title="Not helpful">👎</button>
          </div>
        </div>`;
    } else {
      msgEl.innerHTML = `
        <div>
          <div class="msg-bubble">${escapeHtml(text)}</div>
          <span class="msg-time">${time}</span>
        </div>`;
    }

    container.appendChild(msgEl);
    scrollToBottom();

    if (sender === "bot") {
      playChime();
      const win = document.getElementById("balco-chat-window");
      if (!win.classList.contains("open")) {
        document.getElementById("balco-unread-badge").classList.add("visible");
      }
    }

    return msgEl;
  }

  function showTyping() {
    const container = document.getElementById("balco-messages");
    const typingEl = document.createElement("div");
    typingEl.className = "typing-indicator";
    typingEl.id = "balco-typing";
    typingEl.innerHTML = `
      <div class="msg-icon"><img src="${CONFIG.logoSrc}" alt="BALCO" onerror="this.src='';this.style.display='none'"/></div>
      <div class="typing-bubble">
        <div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>
      </div>`;
    container.appendChild(typingEl);
    scrollToBottom();
  }

  function hideTyping() {
    const el = document.getElementById("balco-typing");
    if (el) el.remove();
  }

  function scrollToBottom(force = false) {
    const container = document.getElementById("balco-messages");
    const pill = document.getElementById("balco-scroll-pill");
    const distFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    if (force || distFromBottom < 80) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
      if (pill) pill.classList.remove("visible");
    } else {
      if (pill) pill.classList.add("visible");
    }
  }

  function bindScrollPill() {
    const container = document.getElementById("balco-messages");
    container.addEventListener("scroll", () => {
      const pill = document.getElementById("balco-scroll-pill");
      const distFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;
      if (distFromBottom < 40) pill.classList.remove("visible");
    });
  }

  // ── API CALL ──────────────────────────────
  // Appends ?q=...&session_id=... to every request.
  // Returns { text, suggestions, action } so the caller can handle all three.

  async function fetchBotResponse(userMessage) {
    const url =
      `${CONFIG.apiBase}` +
      `?${CONFIG.queryParam}=${encodeURIComponent(userMessage)}` +
      `&${CONFIG.sessionParam}=${encodeURIComponent(SESSION_ID)}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json, text/plain, */*",
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const data = await response.json();

      const text =
        data.answer ||
        data.response ||
        data.reply ||
        data.message ||
        data.text ||
        JSON.stringify(data);

      const suggestions = Array.isArray(data.suggestions)
        ? data.suggestions
        : [];

      // action can be null/undefined — default to null so checks are safe
      const action = data.action || null;

      return { text, suggestions, action };
    } else {
      const text = await response.text();
      return { text, suggestions: [], action: null };
    }
  }

  // ── SEND MESSAGE FLOW ─────────────────────
  async function sendMessage(text) {
    const input = document.getElementById("balco-user-input");
    const sendBtn = document.getElementById("balco-send-btn");
    const quickReplies = document.getElementById("balco-quick-replies");
    const message = (text || input.value).trim();
    if (!message) return;

    // Clear input and reset counter
    input.value = "";
    document.getElementById("balco-char-counter").textContent =
      "300 characters remaining";
    document.getElementById("balco-char-counter").className = "";

    input.disabled = true;
    sendBtn.disabled = true;
    quickReplies.style.display = "none";

    // Remove any leftover chips from the previous turn
    document
      .getElementById("balco-messages")
      .querySelectorAll(".balco-suggestion-chips")
      .forEach((el) => el.remove());

    appendMessage(message, "user");
    showTyping();

    try {
      const {
        text: botReply,
        suggestions,
        action,
      } = await fetchBotResponse(message);
      hideTyping();
      appendMessage(botReply, "bot");

      // Store the action (redirect etc.) so appendSuggestions can use it
      pendingAction = action;

      // Render suggestion chips — action logic is handled inside appendSuggestions
      appendSuggestions(suggestions);
    } catch (err) {
      hideTyping();
      appendMessage(
        "Sorry, I couldn't connect right now. Please try again or call 0771-2237575.",
        "bot",
        true,
      );
      console.error("[BALCO Chatbot] API Error:", err);
    } finally {
      input.disabled = false;
      sendBtn.disabled = false;
      input.focus();
    }
  }

  // ── REACTION HANDLER ──────────────────────
  function bindReactions() {
    document.getElementById("balco-messages").addEventListener("click", (e) => {
      const btn = e.target.closest(".reaction-btn");
      if (!btn) return;

      const reactionsEl = btn.closest(".msg-reactions");
      const upBtn = reactionsEl.querySelector(".up-btn");
      const downBtn = reactionsEl.querySelector(".down-btn");
      const isUp = btn.classList.contains("up-btn");

      // Toggle off if already selected
      if (btn.classList.contains(isUp ? "selected-up" : "selected-down")) {
        btn.classList.remove(isUp ? "selected-up" : "selected-down");
        return;
      }

      upBtn.classList.remove("selected-up");
      downBtn.classList.remove("selected-down");
      btn.classList.add(isUp ? "selected-up" : "selected-down");

      const msgId = reactionsEl.dataset.id;
      const verdict = isUp ? "helpful" : "not_helpful";
      console.log(`[BALCO Feedback] msg=${msgId} verdict=${verdict}`);
    });
  }

  // ── EVENT LISTENERS ───────────────────────
  function bindEvents() {
    const trigger = document.getElementById("balco-chat-trigger");
    const win = document.getElementById("balco-chat-window");
    const input = document.getElementById("balco-user-input");
    const sendBtn = document.getElementById("balco-send-btn");
    const quickReplies = document.getElementById("balco-quick-replies");

    // Toggle open/close
    trigger.addEventListener("click", () => {
      const isOpen = win.classList.toggle("open");
      trigger.classList.toggle("open", isOpen);
      trigger.setAttribute("aria-expanded", isOpen);
      if (isOpen) {
        document
          .getElementById("balco-unread-badge")
          .classList.remove("visible");
        setTimeout(() => input.focus(), 350);
      }
    });

    // Dark mode toggle
    const darkBtn = document.getElementById("balco-dark-toggle");
    darkBtn.addEventListener("click", () => {
      const win = document.getElementById("balco-chat-window");
      const isDark = win.classList.toggle("balco-dark");
      darkBtn.innerHTML = isDark
        ? `<svg viewBox="0 0 24 24" fill="white"><path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 11H1v2h3v-2zm9-9.95h-2V4h2V1.05zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 11v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"/></svg>`
        : `<svg viewBox="0 0 24 24" fill="#2d7a31"><path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg>`;
      darkBtn.title = isDark ? "Switch to light mode" : "Switch to dark mode";
    });

    // Live character counter
    const counter = document.getElementById("balco-char-counter");
    const MAX = 300;
    input.addEventListener("input", () => {
      const remaining = MAX - input.value.length;
      counter.textContent = `${remaining} character${remaining === 1 ? "" : "s"} remaining`;
      counter.className =
        remaining <= 20
          ? "balco-char-warn"
          : remaining <= 50
            ? "balco-char-caution"
            : "";
    });

    // Send on button click
    sendBtn.addEventListener("click", () => sendMessage());

    // Send on Enter key
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    // Quick reply buttons
    quickReplies.addEventListener("click", (e) => {
      const btn = e.target.closest(".quick-reply-btn");
      if (!btn) return;
      sendMessage(btn.dataset.query);
    });
  }

  // ── INIT ──────────────────────────────────
  function init() {
    buildChatbot();
    bindEvents();
    bindScrollPill();
    bindReactions();

    setTimeout(() => {
      appendMessage(CONFIG.welcomeMsg, "bot");
    }, 600);

    console.log("[BALCO Chatbot] Session ID:", SESSION_ID);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
