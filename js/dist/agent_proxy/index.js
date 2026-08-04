//#region \0rolldown/runtime.js
var e = Object.defineProperty, t = Object.getOwnPropertyDescriptor, n = Object.getOwnPropertyNames, r = Object.prototype.hasOwnProperty, i = (e, t, n) => () => {
	if (n) throw n[0];
	try {
		return e && (t = e(e = 0)), t;
	} catch (e) {
		throw n = [e], e;
	}
}, a = (t, n) => {
	let r = {};
	for (var i in t) e(r, i, {
		get: t[i],
		enumerable: !0
	});
	return n || e(r, Symbol.toStringTag, { value: "Module" }), r;
}, o = (i, a, o, s) => {
	if (a && typeof a == "object" || typeof a == "function") for (var c = n(a), l = 0, u = c.length, d; l < u; l++) d = c[l], !r.call(i, d) && d !== o && e(i, d, {
		get: ((e) => a[e]).bind(null, d),
		enumerable: !(s = t(a, d)) || s.enumerable
	});
	return i;
}, s = (t) => r.call(t, "module.exports") ? t["module.exports"] : o(e({}, "__esModule", { value: !0 }), t), c = /* @__PURE__ */ ((e) => typeof require < "u" ? require : typeof Proxy < "u" ? new Proxy(e, { get: (e, t) => (typeof require < "u" ? require : e)[t] }) : e)(function(e) {
	if (typeof require < "u") return require.apply(this, arguments);
	throw Error("Calling `require` for \"" + e + "\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.");
}), l = /* @__PURE__ */ a({ default: () => v }), u, d, f, p, m, h, g, _, v, y = i((() => {
	({createLogger: u, format: d, transports: f, TransformableInfo: p} = c("winston")), {combine: m, timestamp: h, printf: g} = d, _ = g(({ timestamp: e, level: t, message: n, ...r }) => {
		let i = `${e} [${t.toUpperCase()}]: ${n}`;
		return Object.keys(r).length > 0 && (i += ` ${JSON.stringify(r, null, 2)}`), i;
	}), v = u({
		format: m(h(), _),
		transports: [new f.Console(), new f.File({ filename: "application.log" })]
	});
})), b = /* @__PURE__ */ a({
	SSEClient: () => T,
	delay: () => w
}), x, S, C, w, T, E = i((() => {
	({Express: x, Request: S, Response: C} = c("express")), w = (e) => new Promise((t) => setTimeout(t, e)), T = class e {
		static instance = null;
		static connection = null;
		static getInstance() {
			return e.instance ||= new e(), e.instance;
		}
		static connect(t) {
			t.get("/events", (t, n) => {
				n.set({
					"Content-Type": "text/event-stream",
					"Cache-Control": "no-cache",
					Connection: "keep-alive",
					"Access-Control-Allow-Origin": "*"
				}), n.status(200), n.flushHeaders(), n.write("data: {\"message\": \"Connected\"}\n\n"), e.connection = n, t.on("close", () => {
					e.connection = null;
				});
			});
		}
		static end() {
			e.connection && (e.connection.write("data: {\"message\": \"Connected\"}\n\n"), e.connection.end());
		}
		async stream_to_agent(t, n) {
			let r = {
				id: `chatcmpl-${crypto.randomUUID()}`,
				object: "chat.completion",
				created: Math.floor(Date.now() / 1e3),
				model: "kakudai"
			};
			e.sendChunk(t, r, {
				role: "assistant",
				content: ""
			}), t.write("data: [DONE]\n\n"), t.end();
		}
		static sendChunk(e, t, n, r = null) {
			let i = {
				...t,
				choices: [{
					index: 0,
					delta: n,
					finish_reason: r
				}]
			};
			e.write(`data: ${JSON.stringify(i)}\n\n`);
		}
	};
})), D = c("express"), O = c("cors"), k = (y(), s(l)).default, { SSEClient: A } = (E(), s(b)), j = D(), M = /* @__PURE__ */ new Map();
j.use(O()), j.use(D.json());
var N = A.getInstance();
N.connect(j), j.post("/v1/chat/completions", async (e, t) => {
	N.connection || t.status(503).json({ error: "No extension connected" });
	let n = e.body, r = crypto.randomUUID();
	try {
		let i = await new Promise((t, i) => {
			let a = setTimeout(() => {
				M.has(r) && (M.delete(r), i(/* @__PURE__ */ Error("Timeout")));
			}, 3e4);
			M.set(r, {
				resolve: t,
				timeout_id: a
			}), k.info("request ID", r), k.info("agent request payload", e.body), A.write(`data: ${JSON.stringify({
				request_id: r,
				payload: n
			})}\n\n`);
		});
		n.stream || (t.writeHead(200, { "Content-Type": "application/json" }), t.end(JSON.stringify(i))), t.writeHead(200, {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache",
			Connection: "keep-alive"
		}), await N.stream_to_agent(t, i);
	} catch {
		t.writeHead(400, { "Content-Type": "application/json" }), t.end(JSON.stringify({ error: "Invalid JSON payload layout" }));
	}
}), j.post("/v1/chat_response", async (e, t) => {
	let { request_id: n, result: r } = e.body;
	(!n || !M.has(n)) && t.status(404).json({ error: "Request ID not found or already expired" });
	let { resolve: i, timeout_id: a } = M.get(n);
	clearTimeout(a), M.delete(n), i(r), t.status(200).json({ status: "acknowledged" });
}), process.on("SIGTERM", () => {
	N.end();
}), j.listen(3e3, () => console.log("Server running on port 3000"));
//#endregion
