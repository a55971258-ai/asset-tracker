import { useState, useEffect, useMemo, useCallback } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import {
  TrendingUp, DollarSign, Coins, Landmark, Wallet, HandCoins,
  Plus, Trash2, Save, Home, BarChart2, Clock, ChevronRight,
  ArrowUpRight, ArrowDownRight, Minus, Menu, X, Sun, Moon
} from "lucide-react";

// ─── Theme ───────────────────────────────────────────────────────────────────
const darkTheme = {
  bg: "#0f1117", surface: "#181c27", card: "#1e2235", border: "#2a3050",
  text: "#e8eaf6", muted: "#7b82a3", primary: "#7c9ef0", accent: "#c4a44e",
  success: "#4ade80", danger: "#f87171",
};
const lightTheme = {
  bg: "#f0f2f9", surface: "#ffffff", card: "#ffffff", border: "#d5d9ec",
  text: "#1a1f3a", muted: "#6b7280", primary: "#4b6fd4", accent: "#b8932a",
  success: "#16a34a", danger: "#dc2626",
};

const CAT_COLORS = {
  twStocksTotal: "#c4a44e",
  usStocksTotal: "#5b9bd5",
  goldTotal: "#d4a843",
  banksTotal: "#6bb38a",
  cashTotal: "#9b7ed8",
  loansTotal: "#e87c6f",
};

const CATEGORIES = [
  { key: "twStocksTotal", label: "台股", icon: TrendingUp },
  { key: "usStocksTotal", label: "美股", icon: DollarSign },
  { key: "goldTotal", label: "黃金", icon: Coins },
  { key: "banksTotal", label: "銀行存款", icon: Landmark },
  { key: "cashTotal", label: "現金", icon: Wallet },
  { key: "loansTotal", label: "高利貸", icon: HandCoins },
];

const ROUTES = {
  home: "home", twStocks: "tw-stocks", usStocks: "us-stocks",
  gold: "gold", banks: "banks", cash: "cash", loans: "loans",
  pieChart: "pie-chart", history: "history",
};

const fmt = (v) => new Intl.NumberFormat("zh-TW", { style: "decimal", maximumFractionDigits: 0 }).format(v || 0);

const EMPTY_SNAPSHOT = {
  snapshotDate: "",
  twStocks: [], twStocksTotal: 0,
  usStocks: { totalValue: 0, marginAmount: 0, inTransit: 0, brokerageBalance: 0, tomorrowSettlement: 0, dayAfterSettlement: 0, actualBalance: 0 },
  usStocksTotal: 0,
  gold: [], goldTotal: 0,
  banks: [], banksTotal: 0,
  cash: { cash: 0, privateMoney: 0 }, cashTotal: 0,
  loans: [], loansTotal: 0,
  totalAssets: 0,
};

// ─── Storage ─────────────────────────────────────────────────────────────────
const STORAGE_KEY = "asset_tracker_snapshots";
const loadSnapshots = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
};
const saveSnapshots = (snaps) => localStorage.setItem(STORAGE_KEY, JSON.stringify(snaps));

// ─── UI Primitives ────────────────────────────────────────────────────────────
function Card({ children, style, onClick, className = "" }) {
  const t = useTheme();
  return (
    <div
      onClick={onClick}
      className={className}
      style={{
        background: t.card, border: `1px solid ${t.border}`,
        borderRadius: 12, overflow: "hidden",
        cursor: onClick ? "pointer" : "default",
        transition: "border-color 0.15s",
        ...style,
      }}
    >{children}</div>
  );
}

function Input({ label, type = "text", value, onChange, placeholder, step }) {
  const t = useTheme();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {label && <label style={{ fontSize: 11, color: t.muted }}>{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        step={step}
        style={{
          background: t.surface, border: `1px solid ${t.border}`,
          borderRadius: 8, padding: "7px 10px", color: t.text,
          fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box",
        }}
      />
    </div>
  );
}

function Button({ children, onClick, disabled, variant = "primary", size = "md", style: extraStyle }) {
  const t = useTheme();
  const base = {
    display: "inline-flex", alignItems: "center", gap: 6,
    borderRadius: 8, fontWeight: 500, cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1, border: "none", transition: "opacity 0.15s",
    fontSize: size === "sm" ? 12 : 14,
    padding: size === "sm" ? "5px 10px" : "8px 14px",
    ...extraStyle,
  };
  const variants = {
    primary: { background: t.primary, color: "#fff" },
    outline: { background: "transparent", border: `1px solid ${t.border}`, color: t.text },
    ghost: { background: "transparent", color: t.muted },
    danger: { background: "transparent", color: t.danger },
  };
  return <button onClick={disabled ? undefined : onClick} style={{ ...base, ...variants[variant] }}>{children}</button>;
}

function Badge({ value }) {
  const t = useTheme();
  if (value === 0) return <span style={{ color: t.muted, fontSize: 12 }}>—</span>;
  const pos = value > 0;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 2,
      fontSize: 12, fontFamily: "monospace",
      color: pos ? t.success : t.danger,
    }}>
      {pos ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
      {pos ? "+" : ""}{fmt(value)}
    </span>
  );
}

function Toast({ msg, type }) {
  const t = useTheme();
  if (!msg) return null;
  return (
    <div style={{
      position: "fixed", bottom: 80, left: "50%", transform: "translateX(-50%)",
      background: type === "error" ? t.danger : t.success,
      color: "#fff", borderRadius: 10, padding: "10px 20px",
      fontSize: 13, fontWeight: 500, zIndex: 9999, pointerEvents: "none",
      boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
    }}>{msg}</div>
  );
}

// ─── Theme context ────────────────────────────────────────────────────────────
import { createContext, useContext } from "react";
const ThemeCtx = createContext(darkTheme);
const useTheme = () => useContext(ThemeCtx);

// ─── Pages ────────────────────────────────────────────────────────────────────
function HomePage({ snapshot, navigate }) {
  const t = useTheme();
  const total = snapshot?.totalAssets ?? 0;
  const pieData = CATEGORIES
    .map(c => ({ name: c.label, value: snapshot ? Number(snapshot[c.key]) || 0 : 0, color: CAT_COLORS[c.key] }))
    .filter(d => d.value > 0);

  const pathMap = {
    twStocksTotal: ROUTES.twStocks, usStocksTotal: ROUTES.usStocks,
    goldTotal: ROUTES.gold, banksTotal: ROUTES.banks,
    cashTotal: ROUTES.cash, loansTotal: ROUTES.loans,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: t.text, margin: 0 }}>資產總覽</h1>
        {snapshot?.snapshotDate && (
          <p style={{ fontSize: 13, color: t.muted, marginTop: 4 }}>最近更新：{snapshot.snapshotDate}</p>
        )}
      </div>

      {/* Total card */}
      <Card style={{ background: `linear-gradient(135deg, ${t.card} 60%, ${t.primary}22)` }}>
        <div style={{ padding: "20px 20px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: 12, color: t.muted, margin: 0 }}>總資產</p>
            <p style={{ fontSize: 32, fontWeight: 700, color: t.primary, margin: "8px 0 0" }}>${fmt(total)}</p>
          </div>
          {pieData.length > 0 && (
            <div style={{ width: 110, height: 110 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={28} outerRadius={48} dataKey="value" strokeWidth={2} stroke={t.card}>
                    {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip formatter={v => `$${fmt(v)}`} contentStyle={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </Card>

      {/* Category grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {CATEGORIES.map(cat => {
          const val = snapshot ? Number(snapshot[cat.key]) || 0 : 0;
          const pct = total > 0 ? ((val / total) * 100).toFixed(1) : "0.0";
          return (
            <Card key={cat.key} onClick={() => navigate(pathMap[cat.key])}
              style={{ ":hover": { borderColor: t.primary } }}>
              <div style={{ padding: "14px 14px 12px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: CAT_COLORS[cat.key] + "22", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <cat.icon size={16} style={{ color: CAT_COLORS[cat.key] }} />
                  </div>
                  <span style={{ fontSize: 11, color: t.muted }}>{pct}%</span>
                </div>
                <p style={{ fontSize: 11, color: t.muted, margin: 0 }}>{cat.label}</p>
                <p style={{ fontSize: 16, fontWeight: 600, color: t.text, margin: "4px 0 0" }}>${fmt(val)}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {!snapshot && (
        <Card style={{ border: `2px dashed ${t.border}` }}>
          <div style={{ padding: 32, textAlign: "center" }}>
            <p style={{ color: t.muted, marginBottom: 12 }}>尚無資產記錄，請前往各分類頁面輸入資料後儲存快照。</p>
            <Button variant="outline" onClick={() => navigate(ROUTES.twStocks)}>開始記錄</Button>
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── 台股即時報價 (證交所 API) ───────────────────────────────────────────────
// 上市: tse_XXXX.tw  上櫃: otc_XXXX.tw
// 回傳欄位: c=代號, n=名稱, z=成交價, y=昨收, u=漲停, w=跌停
async function fetchTwsePrice(code) {
  const trimmed = code.trim();
  if (!trimmed) return null;
  // 先試上市 (tse)，失敗再試上櫃 (otc)
  const tryFetch = async (prefix) => {
    const url = `https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=${prefix}_${trimmed}.tw&json=1&delay=0`;
    const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const res = await fetch(proxy, { signal: AbortSignal.timeout(8000) });
    const json = await res.json();
    const data = JSON.parse(json.contents);
    const stock = data?.msgArray?.[0];
    if (!stock || stock.z === "-" || !stock.z) return null;
    return {
      price: parseFloat(stock.z),
      name: stock.n,
      code: stock.c,
      change: stock.y ? parseFloat(stock.z) - parseFloat(stock.y) : 0,
      pct: stock.y ? ((parseFloat(stock.z) - parseFloat(stock.y)) / parseFloat(stock.y) * 100).toFixed(2) : "0",
      limitUp: stock.u,
      limitDown: stock.w,
    };
  };
  try {
    const r = await tryFetch("tse");
    if (r) return r;
    return await tryFetch("otc");
  } catch { return null; }
}

function TwStocksPage({ snapshot, onSave }) {
  const t = useTheme();
  const [tab, setTab] = useState("cash");
  const [cashStocks, setCashStocks] = useState([{ type: "cash", code: "", name: "", buyValue: 0, principal: 0, price: 0, shares: 0, marketValue: 0 }]);
  const [marginStocks, setMarginStocks] = useState([{ type: "margin", code: "", name: "", buyValue: 0, principal: 0, price: 0, shares: 0, marketValue: 0, marginLoan: 0, maintenanceRate: 0 }]);
  const [fetchingIdx, setFetchingIdx] = useState(null); // {tab, index}
  const [fetchAllLoading, setFetchAllLoading] = useState(false);
  const [priceUpdateTime, setPriceUpdateTime] = useState("");

  useEffect(() => {
    if (snapshot?.twStocks?.length > 0) {
      const items = snapshot.twStocks;
      const cash = items.filter(s => s.type === "cash" || !s.type).map(s => ({ ...s, type: "cash" }));
      const margin = items.filter(s => s.type === "margin");
      if (cash.length) setCashStocks(cash);
      if (margin.length) setMarginStocks(margin);
    }
  }, [snapshot]);

  const recalcCash = (item) => ({ ...item, marketValue: item.price * item.shares * 1000 });
  const recalcMargin = (item) => {
    const mv = item.price * item.shares * 1000;
    const ml = item.buyValue - item.principal;
    return { ...item, marketValue: mv, marginLoan: ml, maintenanceRate: ml > 0 ? Math.round(mv / ml * 100) : 0 };
  };

  const updateCash = (i, field, val) => setCashStocks(prev => {
    const u = [...prev]; u[i] = recalcCash({ ...u[i], [field]: val }); return u;
  });
  const updateMargin = (i, field, val) => setMarginStocks(prev => {
    const u = [...prev]; u[i] = recalcMargin({ ...u[i], [field]: val }); return u;
  });

  // Fetch price for a single stock card
  const fetchSinglePrice = async (isMargin, index) => {
    const stocks = isMargin ? marginStocks : cashStocks;
    const stock = stocks[index];
    if (!stock.code) return;
    setFetchingIdx({ tab: isMargin ? "margin" : "cash", index });
    const result = await fetchTwsePrice(stock.code);
    setFetchingIdx(null);
    if (!result) return;
    if (isMargin) {
      updateMargin(index, "price", result.price);
      if (!stocks[index].name) updateMargin(index, "name", result.name);
    } else {
      updateCash(index, "price", result.price);
      if (!stocks[index].name) updateCash(index, "name", result.name);
    }
    setPriceUpdateTime(new Date().toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" }));
  };

  // Fetch all prices at once
  const fetchAllPrices = async () => {
    setFetchAllLoading(true);
    const allWithMeta = [
      ...cashStocks.map((s, i) => ({ ...s, _i: i, _isMargin: false })),
      ...marginStocks.map((s, i) => ({ ...s, _i: i, _isMargin: true })),
    ].filter(s => s.code);

    const results = await Promise.all(allWithMeta.map(s => fetchTwsePrice(s.code)));

    // Apply results
    setCashStocks(prev => {
      const u = [...prev];
      allWithMeta.forEach((s, ri) => {
        if (!s._isMargin && results[ri]) {
          u[s._i] = recalcCash({ ...u[s._i], price: results[ri].price, name: u[s._i].name || results[ri].name });
        }
      });
      return u;
    });
    setMarginStocks(prev => {
      const u = [...prev];
      allWithMeta.forEach((s, ri) => {
        if (s._isMargin && results[ri]) {
          u[s._i] = recalcMargin({ ...u[s._i], price: results[ri].price, name: u[s._i].name || results[ri].name });
        }
      });
      return u;
    });

    setFetchAllLoading(false);
    setPriceUpdateTime(new Date().toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" }));
  };

  const cashTotal = useMemo(() => cashStocks.reduce((s, x) => s + x.marketValue, 0), [cashStocks]);
  const marginTotal = useMemo(() => marginStocks.reduce((s, x) => s + x.marketValue, 0), [marginStocks]);
  const twStocksTotal = cashTotal + marginTotal;

  const handleSave = () => {
    const all = [...cashStocks.filter(s => s.code || s.name), ...marginStocks.filter(s => s.code || s.name)];
    onSave({ twStocks: all, twStocksTotal });
  };

  const StockCard = ({ stock, index, onUpdate, onRemove, isMargin }) => {
    const isFetching = fetchingIdx?.tab === (isMargin ? "margin" : "cash") && fetchingIdx?.index === index;
    return (
      <Card style={{ marginBottom: 12 }}>
        <div style={{ padding: "14px 14px 12px" }}>
          {/* Code + Name row with fetch button */}
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end", marginBottom: 10 }}>
            <div style={{ flex: "0 0 100px" }}>
              <Input label="股票代號" value={stock.code}
                onChange={e => onUpdate(index, "code", e.target.value)}
                placeholder="如 2330" />
            </div>
            <div style={{ flex: 1 }}>
              <Input label="名稱" value={stock.name}
                onChange={e => onUpdate(index, "name", e.target.value)}
                placeholder="如 台積電" />
            </div>
            {/* Per-card fetch button */}
            <button
              onClick={() => fetchSinglePrice(isMargin, index)}
              disabled={!stock.code || isFetching}
              title="抓取即時收盤價"
              style={{
                background: isFetching ? t.border : t.primary + "22",
                border: `1px solid ${t.primary}44`,
                borderRadius: 8, padding: "7px 10px",
                color: t.primary, cursor: stock.code ? "pointer" : "not-allowed",
                opacity: stock.code ? 1 : 0.4,
                fontSize: 16, lineHeight: 1, marginBottom: 1,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {isFetching ? "…" : "⬇"}
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
            <Input label="買進價值" type="number" value={stock.buyValue || ""} onChange={e => onUpdate(index, "buyValue", Number(e.target.value))} />
            <Input label="本金" type="number" value={stock.principal || ""} onChange={e => onUpdate(index, "principal", Number(e.target.value))} />
            <div>
              <label style={{ fontSize: 11, color: t.muted, display: "block", marginBottom: 4 }}>
                現價 {stock.price > 0 && <span style={{ color: t.accent, fontWeight: 600 }}>✓</span>}
              </label>
              <input type="number" value={stock.price || ""} step="0.1"
                onChange={e => onUpdate(index, "price", Number(e.target.value))}
                style={{ background: t.surface, border: `1px solid ${stock.price > 0 ? t.accent + "88" : t.border}`, borderRadius: 8, padding: "7px 10px", color: t.text, fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box" }} />
            </div>
            <Input label="張數" type="number" value={stock.shares || ""} onChange={e => onUpdate(index, "shares", Number(e.target.value))} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, paddingTop: 10, borderTop: `1px solid ${t.border}` }}>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, color: t.muted }}>市值：<b style={{ color: t.text }}>${fmt(stock.marketValue)}</b></span>
              {isMargin && <>
                <span style={{ fontSize: 12, color: t.muted }}>融資：<b style={{ color: t.text }}>${fmt(stock.marginLoan)}</b></span>
                <span style={{ fontSize: 12, color: t.muted }}>維持率：<b style={{ color: stock.maintenanceRate >= 130 ? t.success : stock.maintenanceRate > 0 ? t.danger : t.muted }}>{stock.maintenanceRate}%</b></span>
              </>}
            </div>
            <Button variant="danger" size="sm" onClick={() => onRemove(index)}><Trash2 size={14} /></Button>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <PageShell title="台股持倉" subtitle={`台股市值合計：$${fmt(twStocksTotal)}`} onSave={handleSave}>

      {/* Fetch all banner */}
      <Card style={{ marginBottom: 16, background: t.primary + "12", border: `1px solid ${t.primary}33` }}>
        <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: t.primary, margin: 0 }}>📈 一鍵抓取所有收盤價</p>
            <p style={{ fontSize: 11, color: t.muted, margin: "3px 0 0" }}>
              {priceUpdateTime ? `上次更新：${priceUpdateTime}　資料來源：台灣證交所` : "輸入股票代號後，點擊抓取當天收盤價"}
            </p>
          </div>
          <Button onClick={fetchAllPrices} disabled={fetchAllLoading} size="sm">
            {fetchAllLoading ? "抓取中…" : "🔄 全部更新"}
          </Button>
        </div>
      </Card>

      {/* Tab switcher */}
      <div style={{ display: "flex", gap: 0, marginBottom: 16, background: t.surface, borderRadius: 10, padding: 4 }}>
        {[["cash", `現股（${cashStocks.filter(s => s.code || s.name).length}）`], ["margin", `融資（${marginStocks.filter(s => s.code || s.name).length}）`]].map(([v, l]) => (
          <button key={v} onClick={() => setTab(v)} style={{
            flex: 1, padding: "7px 0", border: "none", borderRadius: 7,
            background: tab === v ? t.primary : "transparent",
            color: tab === v ? "#fff" : t.muted, cursor: "pointer", fontSize: 13, fontWeight: 500,
          }}>{l}</button>
        ))}
      </div>

      {tab === "cash" && <>
        <p style={{ fontSize: 12, color: t.muted, marginBottom: 12 }}>現股市值：<b style={{ color: t.text }}>${fmt(cashTotal)}</b></p>
        {cashStocks.map((s, i) => <StockCard key={i} stock={s} index={i} onUpdate={updateCash} onRemove={j => setCashStocks(p => p.filter((_, k) => k !== j))} isMargin={false} />)}
        <Button variant="outline" onClick={() => setCashStocks(p => [{ type: "cash", code: "", name: "", buyValue: 0, principal: 0, price: 0, shares: 0, marketValue: 0 }, ...p])} style={{ width: "100%", justifyContent: "center", borderStyle: "dashed" }}>
          <Plus size={14} />新增現股
        </Button>
      </>}

      {tab === "margin" && <>
        <p style={{ fontSize: 12, color: t.muted, marginBottom: 12 }}>融資市值：<b style={{ color: t.text }}>${fmt(marginTotal)}</b></p>
        {marginStocks.map((s, i) => <StockCard key={i} stock={s} index={i} onUpdate={updateMargin} onRemove={j => setMarginStocks(p => p.filter((_, k) => k !== j))} isMargin={true} />)}
        <Button variant="outline" onClick={() => setMarginStocks(p => [{ type: "margin", code: "", name: "", buyValue: 0, principal: 0, price: 0, shares: 0, marketValue: 0, marginLoan: 0, maintenanceRate: 0 }, ...p])} style={{ width: "100%", justifyContent: "center", borderStyle: "dashed" }}>
          <Plus size={14} />新增融資
        </Button>
      </>}
    </PageShell>
  );
}

function UsStocksPage({ snapshot, onSave }) {
  const t = useTheme();
  const def = { totalValue: 0, marginAmount: 0, inTransit: 0, brokerageBalance: 0, tomorrowSettlement: 0, dayAfterSettlement: 0, actualBalance: 0 };
  const [data, setData] = useState(def);

  useEffect(() => { if (snapshot?.usStocks) setData(snapshot.usStocks); }, [snapshot]);

  const update = (field, val) => setData(p => {
    const u = { ...p, [field]: val };
    u.actualBalance = u.brokerageBalance + u.tomorrowSettlement + u.dayAfterSettlement;
    return u;
  });

  const fields = [
    ["totalValue", "總值"], ["marginAmount", "圈存金額"], ["inTransit", "在途款"],
    ["brokerageBalance", "一戶通餘額"], ["tomorrowSettlement", "明天交割款"], ["dayAfterSettlement", "後天交割款"],
  ];

  return (
    <PageShell title="美股" subtitle={`美股總值：$${fmt(data.totalValue)}`} onSave={() => onSave({ usStocks: data, usStocksTotal: data.totalValue })}>
      <Card>
        <div style={{ padding: "16px 16px 14px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {fields.map(([f, l]) => (
              <Input key={f} label={l} type="number" value={data[f] || ""} onChange={e => update(f, Number(e.target.value))} />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, paddingTop: 12, borderTop: `1px solid ${t.border}` }}>
            <span style={{ fontSize: 13, color: t.muted }}>一戶通實際餘額（自動計算）</span>
            <span style={{ fontSize: 16, fontWeight: 600, color: t.primary }}>${fmt(data.actualBalance)}</span>
          </div>
        </div>
      </Card>
    </PageShell>
  );
}

// 1錢 = 3.75公克, 1公克 = 0.2666...錢
const QIAN_PER_GRAM = 1 / 3.75;

function GoldPage({ snapshot, onSave }) {
  const t = useTheme();
  // items store amount in 錢 internally for consistency
  const [items, setItems] = useState([{ name: "", principal: 0, unit: 0, unitType: "qian" }]);
  // goldPricePerGram: price per gram in TWD (from 台銀)
  const [goldPricePerGram, setGoldPricePerGram] = useState(4133);
  const [fetchStatus, setFetchStatus] = useState("idle"); // idle | loading | ok | error
  const [fetchTime, setFetchTime] = useState("");

  useEffect(() => {
    if (snapshot?.gold?.length) {
      setItems(snapshot.gold.map(x => ({ ...x, unitType: x.unitType || "qian" })));
    }
  }, [snapshot]);

  // Fetch live gold price from 台銀 via a CORS proxy
  const fetchGoldPrice = async () => {
    setFetchStatus("loading");
    try {
      // Use allorigins proxy to bypass CORS
      const url = "https://rate.bot.com.tw/gold/quote/recent";
      const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      const res = await fetch(proxy);
      const json = await res.json();
      const html = json.contents;
      // Parse: look for 黃金存摺 本行買進 price (per gram)
      // Pattern: 黃金存摺 ... 本行買進 ... 4,133
      const match = html.match(/黃金存摺[\s\S]*?本行買進[^\d]*([\d,]+)/);
      if (match) {
        const price = parseInt(match[1].replace(/,/g, ""), 10);
        if (price > 1000 && price < 100000) {
          setGoldPricePerGram(price);
          setFetchStatus("ok");
          setFetchTime(new Date().toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" }));
          return;
        }
      }
      throw new Error("parse failed");
    } catch (e) {
      setFetchStatus("error");
    }
  };

  const update = (i, f, v) => setItems(p => { const u = [...p]; u[i] = { ...u[i], [f]: v }; return u; });

  // Convert item amount to 錢 for value calculation
  const toQian = (item) => item.unitType === "gram" ? item.unit * QIAN_PER_GRAM : item.unit;
  const pricePerQian = goldPricePerGram * 3.75;

  const goldTotal = useMemo(() => items.reduce((s, x) => s + toQian(x) * pricePerQian, 0), [items, pricePerQian]);

  const statusColor = { idle: t.muted, loading: t.primary, ok: t.success, error: t.danger }[fetchStatus];
  const statusText = { idle: "點擊抓取即時報價", loading: "抓取中…", ok: `更新：${fetchTime}`, error: "抓取失敗，可手動輸入" }[fetchStatus];

  return (
    <PageShell title="黃金" subtitle={`黃金總市值：$${fmt(goldTotal)}`} onSave={() => onSave({ gold: items.filter(x => x.name), goldTotal })}>
      {/* Price card */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ padding: "14px 14px 12px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, marginBottom: 8 }}>
            <div style={{ flex: 1 }}>
              <Input label="台銀買進牌價（每公克，TWD）" type="number" value={goldPricePerGram || ""} onChange={e => { setGoldPricePerGram(Number(e.target.value)); setFetchStatus("idle"); }} />
            </div>
            <Button onClick={fetchGoldPrice} disabled={fetchStatus === "loading"} size="sm" style={{ whiteSpace: "nowrap", marginBottom: 1 }}>
              {fetchStatus === "loading" ? "抓取中…" : "🔄 即時報價"}
            </Button>
          </div>
          <div style={{ display: "flex", gap: 20, fontSize: 12 }}>
            <span style={{ color: statusColor }}>{statusText}</span>
            <span style={{ color: t.muted }}>每錢 ≈ <b style={{ color: t.text }}>${fmt(pricePerQian)}</b></span>
          </div>
        </div>
      </Card>

      {/* Items */}
      {items.map((item, i) => {
        const mktVal = toQian(item) * pricePerQian;
        return (
          <Card key={i} style={{ marginBottom: 12 }}>
            <div style={{ padding: "14px 14px 12px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                <Input label="品項名稱" value={item.name} onChange={e => update(i, "name", e.target.value)} placeholder="如 金豆、桂花鍊" />
                <Input label="黃金本金" type="number" value={item.principal || ""} onChange={e => update(i, "principal", Number(e.target.value))} />
              </div>
              {/* Unit input with gram/qian toggle */}
              <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                <div style={{ flex: 1 }}>
                  <Input
                    label={`數量（${item.unitType === "gram" ? "公克" : "錢"}）`}
                    type="number"
                    value={item.unit || ""}
                    onChange={e => update(i, "unit", Number(e.target.value))}
                    step="0.001"
                  />
                </div>
                {/* Toggle button */}
                <div style={{ display: "flex", background: t.surface, borderRadius: 8, border: `1px solid ${t.border}`, overflow: "hidden", marginBottom: 1 }}>
                  {["qian", "gram"].map(type => (
                    <button key={type} onClick={() => update(i, "unitType", type)} style={{
                      padding: "7px 12px", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 500,
                      background: item.unitType === type ? t.primary : "transparent",
                      color: item.unitType === type ? "#fff" : t.muted,
                      transition: "background 0.15s",
                    }}>
                      {type === "qian" ? "錢" : "克"}
                    </button>
                  ))}
                </div>
              </div>
              {/* Equivalent display */}
              {item.unit > 0 && (
                <div style={{ marginTop: 6, fontSize: 11, color: t.muted }}>
                  {item.unitType === "gram"
                    ? `≈ ${(item.unit * QIAN_PER_GRAM).toFixed(4)} 錢`
                    : `≈ ${(item.unit * 3.75).toFixed(3)} 公克`
                  }
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, paddingTop: 10, borderTop: `1px solid ${t.border}` }}>
                <span style={{ fontSize: 12, color: t.muted }}>市值：<b style={{ color: t.text }}>${fmt(mktVal)}</b></span>
                <Button variant="danger" size="sm" onClick={() => setItems(p => p.filter((_, k) => k !== i))}><Trash2 size={14} /></Button>
              </div>
            </div>
          </Card>
        );
      })}
      <Button variant="outline" onClick={() => setItems(p => [{ name: "", principal: 0, unit: 0, unitType: "qian" }, ...p])} style={{ width: "100%", justifyContent: "center", borderStyle: "dashed" }}>
        <Plus size={14} />新增黃金品項
      </Button>
    </PageShell>
  );
}

function BanksPage({ snapshot, onSave }) {
  const t = useTheme();
  const empty = { bankName: "", deposit: 0, settlement: 0, foreignCurrency: 0, digitalAccount: 0, unbilled: 0 };
  const [banks, setBanks] = useState([empty]);

  useEffect(() => { if (snapshot?.banks?.length) setBanks(snapshot.banks); }, [snapshot]);

  const update = (i, f, v) => setBanks(p => { const u = [...p]; u[i] = { ...u[i], [f]: v }; return u; });
  const banksTotal = useMemo(() => banks.reduce((s, b) => s + b.deposit + b.settlement + b.foreignCurrency + b.digitalAccount, 0), [banks]);

  return (
    <PageShell title="銀行存款" subtitle={`銀行總額：$${fmt(banksTotal)}`} onSave={() => onSave({ banks: banks.filter(b => b.bankName), banksTotal })}>
      {banks.map((bank, i) => (
        <Card key={i} style={{ marginBottom: 12 }}>
          <div style={{ padding: "14px 14px 12px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <Input label="銀行名稱" value={bank.bankName} onChange={e => update(i, "bankName", e.target.value)} placeholder="如 中信銀行" />
              </div>
              <Input label="存款戶" type="number" value={bank.deposit || ""} onChange={e => update(i, "deposit", Number(e.target.value))} />
              <Input label="交割戶" type="number" value={bank.settlement || ""} onChange={e => update(i, "settlement", Number(e.target.value))} />
              <Input label="外幣戶" type="number" value={bank.foreignCurrency || ""} onChange={e => update(i, "foreignCurrency", Number(e.target.value))} />
              <Input label="數位帳號" type="number" value={bank.digitalAccount || ""} onChange={e => update(i, "digitalAccount", Number(e.target.value))} />
              <div style={{ gridColumn: "1 / -1" }}>
                <Input label="未出帳" type="number" value={bank.unbilled || ""} onChange={e => update(i, "unbilled", Number(e.target.value))} />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, paddingTop: 10, borderTop: `1px solid ${t.border}` }}>
              <span style={{ fontSize: 12, color: t.muted }}>小計：<b style={{ color: t.text }}>${fmt(bank.deposit + bank.settlement + bank.foreignCurrency + bank.digitalAccount)}</b></span>
              <Button variant="danger" size="sm" onClick={() => setBanks(p => p.filter((_, k) => k !== i))}><Trash2 size={14} /></Button>
            </div>
          </div>
        </Card>
      ))}
      <Button variant="outline" onClick={() => setBanks(p => [empty, ...p])} style={{ width: "100%", justifyContent: "center", borderStyle: "dashed" }}>
        <Plus size={14} />新增銀行
      </Button>
    </PageShell>
  );
}

function CashPage({ snapshot, onSave }) {
  const t = useTheme();
  const [data, setData] = useState({ cash: 0, privateMoney: 0 });

  useEffect(() => { if (snapshot?.cash) setData(snapshot.cash); }, [snapshot]);

  const cashTotal = data.cash + data.privateMoney;
  return (
    <PageShell title="現金" subtitle={`現金總額：$${fmt(cashTotal)}`} onSave={() => onSave({ cash: data, cashTotal })}>
      <Card>
        <div style={{ padding: "16px 16px 14px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="現金" type="number" value={data.cash || ""} onChange={e => setData(p => ({ ...p, cash: Number(e.target.value) }))} />
            <Input label="私房錢" type="number" value={data.privateMoney || ""} onChange={e => setData(p => ({ ...p, privateMoney: Number(e.target.value) }))} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, paddingTop: 12, borderTop: `1px solid ${t.border}` }}>
            <span style={{ fontSize: 13, color: t.muted }}>現金總額（自動加總）</span>
            <span style={{ fontSize: 16, fontWeight: 600, color: t.primary }}>${fmt(cashTotal)}</span>
          </div>
        </div>
      </Card>
    </PageShell>
  );
}

function LoansPage({ snapshot, onSave }) {
  const [loans, setLoans] = useState([{ borrowerName: "", amount: 0 }]);

  useEffect(() => { if (snapshot?.loans?.length) setLoans(snapshot.loans); }, [snapshot]);

  const update = (i, f, v) => setLoans(p => { const u = [...p]; u[i] = { ...u[i], [f]: v }; return u; });
  const loansTotal = useMemo(() => loans.reduce((s, l) => s + l.amount, 0), [loans]);
  const t = useTheme();

  return (
    <PageShell title="高利貸" subtitle={`高利貸總額：$${fmt(loansTotal)}`} onSave={() => onSave({ loans: loans.filter(l => l.borrowerName), loansTotal })}>
      {loans.map((loan, i) => (
        <Card key={i} style={{ marginBottom: 12 }}>
          <div style={{ padding: "14px 14px 12px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Input label="借款人名稱" value={loan.borrowerName} onChange={e => update(i, "borrowerName", e.target.value)} placeholder="借款人姓名或代稱" />
              <Input label="金額" type="number" value={loan.amount || ""} onChange={e => update(i, "amount", Number(e.target.value))} />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10, paddingTop: 10, borderTop: `1px solid ${t.border}` }}>
              <Button variant="danger" size="sm" onClick={() => setLoans(p => p.filter((_, k) => k !== i))}><Trash2 size={14} /></Button>
            </div>
          </div>
        </Card>
      ))}
      <Button variant="outline" onClick={() => setLoans(p => [{ borrowerName: "", amount: 0 }, ...p])} style={{ width: "100%", justifyContent: "center", borderStyle: "dashed" }}>
        <Plus size={14} />新增借款人
      </Button>
    </PageShell>
  );
}

function PieChartPage({ snapshot }) {
  const t = useTheme();
  const total = snapshot?.totalAssets ?? 0;
  const chartData = CATEGORIES
    .map(c => ({ name: c.label, value: snapshot ? Number(snapshot[c.key]) || 0 : 0, color: CAT_COLORS[c.key] }))
    .filter(d => d.value > 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: t.text, margin: 0 }}>資產分佈</h1>
        <p style={{ fontSize: 13, color: t.muted, marginTop: 4 }}>總資產：<b style={{ color: t.primary }}>${fmt(total)}</b></p>
      </div>
      <Card>
        <div style={{ padding: "16px 16px 8px" }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 12 }}>資產類別佔比</p>
          {chartData.length === 0 ? (
            <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: t.muted, fontSize: 13 }}>尚無資產資料</div>
          ) : (
            <div style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" innerRadius={65} outerRadius={110} paddingAngle={2} dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`} labelLine={{ strokeWidth: 1 }}>
                    {chartData.map((e, i) => <Cell key={i} fill={e.color} stroke="transparent" />)}
                  </Pie>
                  <Tooltip formatter={v => [`$${fmt(v)}`, "金額"]} contentStyle={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text, fontSize: 12 }} />
                  <Legend verticalAlign="bottom" formatter={v => <span style={{ color: t.text, fontSize: 12 }}>{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </Card>
      {chartData.length > 0 && (
        <Card>
          <div style={{ padding: "16px 16px 8px" }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 12 }}>各類別明細</p>
            {CATEGORIES.map((cat, i) => {
              const val = snapshot ? Number(snapshot[cat.key]) || 0 : 0;
              const pct = total > 0 ? ((val / total) * 100).toFixed(1) : "0.0";
              return (
                <div key={cat.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 8px", borderBottom: i < CATEGORIES.length - 1 ? `1px solid ${t.border}` : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: CAT_COLORS[cat.key] }} />
                    <span style={{ fontSize: 13, color: t.text }}>{cat.label}</span>
                  </div>
                  <div style={{ display: "flex", gap: 16 }}>
                    <span style={{ fontSize: 13, fontFamily: "monospace", color: t.text }}>${fmt(val)}</span>
                    <span style={{ fontSize: 12, color: t.muted, width: 44, textAlign: "right" }}>{pct}%</span>
                  </div>
                </div>
              );
            })}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 8px 4px", borderTop: `1px solid ${t.border}`, marginTop: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>總計</span>
              <span style={{ fontSize: 13, fontWeight: 600, fontFamily: "monospace", color: t.text }}>${fmt(total)}</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

function HistoryPage({ history }) {
  const t = useTheme();
  const [selDate, setSelDate] = useState("");
  const [cmpDate, setCmpDate] = useState("");

  const sel = history.find(h => h.snapshotDate === selDate);
  const cmp = history.find(h => h.snapshotDate === cmpDate);
  const diff = useMemo(() => {
    if (!sel || !cmp) return null;
    return Object.fromEntries(CATEGORIES.map(c => [c.key, (sel[c.key] || 0) - (cmp[c.key] || 0)]).concat([["totalAssets", sel.totalAssets - cmp.totalAssets]]));
  }, [sel, cmp]);

  const Select = ({ value, onChange, label }) => (
    <div>
      <label style={{ fontSize: 12, color: t.muted, display: "block", marginBottom: 4 }}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} style={{
        width: "100%", background: t.surface, border: `1px solid ${t.border}`,
        borderRadius: 8, padding: "7px 10px", color: t.text, fontSize: 13,
      }}>
        <option value="">選擇日期</option>
        {history.map(h => <option key={h.snapshotDate} value={h.snapshotDate}>{h.snapshotDate}</option>)}
      </select>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: t.text, margin: 0 }}>歷史記錄</h1>
        <p style={{ fontSize: 13, color: t.muted, marginTop: 4 }}>查看過去每日的資產快照，並進行差異對比。</p>
      </div>

      {history.length >= 2 && (
        <Card>
          <div style={{ padding: "16px 16px 14px" }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 12 }}>日期對比</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <Select value={selDate} onChange={setSelDate} label="選擇日期" />
              <Select value={cmpDate} onChange={setCmpDate} label="對比日期" />
            </div>
            {diff && sel && cmp && (
              <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: t.text }}>總資產差異</span>
                  <Badge value={diff.totalAssets} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                  {[sel, cmp].map((s, i) => (
                    <div key={i} style={{ background: t.surface, borderRadius: 8, padding: "10px 12px" }}>
                      <p style={{ fontSize: 11, color: t.muted, margin: "0 0 4px" }}>{i === 0 ? selDate : cmpDate} 總資產</p>
                      <p style={{ fontSize: 16, fontWeight: 600, color: t.text, margin: 0 }}>${fmt(s.totalAssets)}</p>
                    </div>
                  ))}
                </div>
                {CATEGORIES.map(cat => (
                  <div key={cat.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${t.border}40` }}>
                    <span style={{ fontSize: 12, color: t.muted }}>{cat.label}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 12, fontFamily: "monospace", color: t.text }}>${fmt(sel[cat.key] || 0)}</span>
                      <Badge value={diff[cat.key]} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}

      <Card>
        <div style={{ padding: "16px 16px 8px" }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 12 }}>快照記錄</p>
          {history.length === 0 ? (
            <p style={{ color: t.muted, fontSize: 13, textAlign: "center", padding: "24px 0" }}>尚無歷史記錄</p>
          ) : (
            history.map((item, idx) => {
              const prev = history[idx + 1];
              const d = prev ? item.totalAssets - prev.totalAssets : 0;
              return (
                <div key={item.snapshotDate} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 8px", borderBottom: idx < history.length - 1 ? `1px solid ${t.border}` : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: t.primary + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Clock size={14} style={{ color: t.primary }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 500, color: t.text, margin: 0 }}>{item.snapshotDate}</p>
                      <p style={{ fontSize: 11, color: t.muted, margin: "2px 0 0" }}>台股 ${fmt(item.twStocksTotal)} · 美股 ${fmt(item.usStocksTotal)} · 黃金 ${fmt(item.goldTotal)}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: t.text, margin: 0 }}>${fmt(item.totalAssets)}</p>
                    {prev && <Badge value={d} />}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
}

// ─── PageShell ────────────────────────────────────────────────────────────────
function PageShell({ title, subtitle, onSave, children }) {
  const t = useTheme();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: t.text, margin: 0 }}>{title}</h1>
          {subtitle && <p style={{ fontSize: 13, color: t.muted, marginTop: 4 }} dangerouslySetInnerHTML={{ __html: subtitle.replace(/(\$[\d,]+)/, `<b style="color:${t.primary}">$1</b>`) }} />}
        </div>
        <Button onClick={onSave}><Save size={14} />儲存快照</Button>
      </div>
      {children}
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [isDark, setIsDark] = useState(true);
  const theme = isDark ? darkTheme : lightTheme;
  const [route, setRoute] = useState(ROUTES.home);
  const [snapshots, setSnapshots] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "success" });

  useEffect(() => { setSnapshots(loadSnapshots()); }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "success" }), 2500);
  };

  const latestSnapshot = snapshots.length > 0 ? snapshots[0] : null;

  const handleSave = useCallback((updates) => {
    const today = new Date().toISOString().slice(0, 10);
    const base = latestSnapshot ?? { ...EMPTY_SNAPSHOT };
    const merged = { ...base, ...updates, snapshotDate: today };
    merged.totalAssets = (
      (Number(merged.twStocksTotal) || 0) +
      (Number(merged.usStocksTotal) || 0) +
      (Number(merged.goldTotal) || 0) +
      (Number(merged.banksTotal) || 0) +
      (Number(merged.cashTotal) || 0) +
      (Number(merged.loansTotal) || 0)
    );
    const existing = snapshots.findIndex(s => s.snapshotDate === today);
    let updated;
    if (existing >= 0) { updated = [...snapshots]; updated[existing] = merged; }
    else { updated = [merged, ...snapshots]; }
    setSnapshots(updated);
    saveSnapshots(updated);
    showToast("資料已儲存");
  }, [latestSnapshot, snapshots]);

  const NAV = [
    { route: ROUTES.home, label: "總覽", icon: Home },
    { route: ROUTES.twStocks, label: "台股", icon: TrendingUp },
    { route: ROUTES.usStocks, label: "美股", icon: DollarSign },
    { route: ROUTES.gold, label: "黃金", icon: Coins },
    { route: ROUTES.banks, label: "銀行", icon: Landmark },
    { route: ROUTES.cash, label: "現金", icon: Wallet },
    { route: ROUTES.loans, label: "高利貸", icon: HandCoins },
    { route: ROUTES.pieChart, label: "分佈圖", icon: BarChart2 },
    { route: ROUTES.history, label: "歷史", icon: Clock },
  ];

  const BOTTOM_NAV = [
    { route: ROUTES.home, label: "總覽", icon: Home },
    { route: ROUTES.pieChart, label: "分佈圖", icon: BarChart2 },
    { route: ROUTES.history, label: "歷史", icon: Clock },
    { route: "menu", label: "更多", icon: Menu },
  ];

  const renderPage = () => {
    const props = { snapshot: latestSnapshot, onSave: handleSave, navigate: setRoute, history: snapshots };
    switch (route) {
      case ROUTES.home: return <HomePage {...props} />;
      case ROUTES.twStocks: return <TwStocksPage {...props} />;
      case ROUTES.usStocks: return <UsStocksPage {...props} />;
      case ROUTES.gold: return <GoldPage {...props} />;
      case ROUTES.banks: return <BanksPage {...props} />;
      case ROUTES.cash: return <CashPage {...props} />;
      case ROUTES.loans: return <LoansPage {...props} />;
      case ROUTES.pieChart: return <PieChartPage {...props} />;
      case ROUTES.history: return <HistoryPage {...props} />;
      default: return <HomePage {...props} />;
    }
  };

  return (
    <ThemeCtx.Provider value={theme}>
      <div style={{ minHeight: "100vh", background: theme.bg, color: theme.text, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

        {/* Top bar */}
        <div style={{ position: "sticky", top: 0, zIndex: 100, background: theme.surface + "ee", backdropFilter: "blur(12px)", borderBottom: `1px solid ${theme.border}`, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: theme.primary }}>💰 資產追蹤</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setIsDark(!isDark)} style={{ background: "none", border: "none", color: theme.muted, cursor: "pointer", padding: 4 }}>
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>

        {/* Slide-in menu */}
        {menuOpen && (
          <div style={{ position: "fixed", inset: 0, zIndex: 200 }}>
            <div onClick={() => setMenuOpen(false)} style={{ position: "absolute", inset: 0, background: "#00000088" }} />
            <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 240, background: theme.surface, borderLeft: `1px solid ${theme.border}`, padding: 16, display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: theme.text }}>選單</span>
                <button onClick={() => setMenuOpen(false)} style={{ background: "none", border: "none", color: theme.muted, cursor: "pointer" }}><X size={18} /></button>
              </div>
              {NAV.map(n => (
                <button key={n.route} onClick={() => { setRoute(n.route); setMenuOpen(false); }} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8,
                  background: route === n.route ? theme.primary + "22" : "transparent",
                  color: route === n.route ? theme.primary : theme.text,
                  border: "none", cursor: "pointer", textAlign: "left", fontSize: 14, fontWeight: route === n.route ? 600 : 400,
                }}>
                  <n.icon size={16} />{n.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main content */}
        <div style={{ padding: "20px 16px 90px", maxWidth: 640, margin: "0 auto" }}>
          {renderPage()}
        </div>

        {/* Bottom nav */}
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: theme.surface + "f0", backdropFilter: "blur(12px)", borderTop: `1px solid ${theme.border}`, display: "flex", padding: "8px 0 calc(8px + env(safe-area-inset-bottom))" }}>
          {BOTTOM_NAV.map(n => {
            const active = n.route !== "menu" && route === n.route;
            return (
              <button key={n.route} onClick={() => n.route === "menu" ? setMenuOpen(true) : setRoute(n.route)} style={{
                flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                background: "none", border: "none", cursor: "pointer",
                color: active ? theme.primary : theme.muted, padding: "4px 0",
              }}>
                <n.icon size={20} />
                <span style={{ fontSize: 10, fontWeight: active ? 600 : 400 }}>{n.label}</span>
              </button>
            );
          })}
        </div>

        <Toast msg={toast.msg} type={toast.type} />
      </div>
    </ThemeCtx.Provider>
  );
}
