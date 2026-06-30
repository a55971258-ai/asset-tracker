import { useState, useEffect, useMemo, useRef, createContext, useContext } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { TrendingUp, DollarSign, Coins, Landmark, Wallet, HandCoins, Plus, Trash2, Save, Home, BarChart2, Clock, Menu, X, Sun, Moon, Lock, Eye, EyeOff, Settings, GripVertical, RefreshCw, Check } from "lucide-react";

const DarkTheme  = { bg:"#0f1117", surface:"#181c27", card:"#1e2235", border:"#2a3050", text:"#e8eaf6", muted:"#7b82a3", primary:"#7c9ef0", accent:"#c4a44e", success:"#4ade80", danger:"#f87171" };
const LightTheme = { bg:"#f0f2f9", surface:"#ffffff", card:"#ffffff", border:"#d5d9ec", text:"#1a1f3a", muted:"#6b7280", primary:"#4b6fd4", accent:"#b8932a", success:"#16a34a", danger:"#dc2626" };
const ThemeCtx = createContext(DarkTheme);
const useTheme = function() { return useContext(ThemeCtx); };

function resolveTheme(prefs) {
  var p = prefs && prefs.themePreset;
  // 莫蘭迪系列（淡色系）
  if (p==="morandi1") return { bg:"#f2ede8", surface:"#faf7f4", card:"#ffffff", border:"#ddd5cc", text:"#3d3530", muted:"#9c8f87", primary:"#a07865", accent:"#c4956a", success:"#7aab8a", danger:"#c47a72" };
  if (p==="morandi2") return { bg:"#e8ecf0", surface:"#f4f6f8", card:"#ffffff", border:"#c8d0d8", text:"#2c3540", muted:"#7a8c9c", primary:"#5a7fa0", accent:"#7aa0b8", success:"#6aab8a", danger:"#b87070" };
  if (p==="morandi3") return { bg:"#f0e8e8", surface:"#f8f2f2", card:"#ffffff", border:"#dcc8c8", text:"#3a2c2c", muted:"#9c8080", primary:"#a06070", accent:"#c48080", success:"#7aab8a", danger:"#c47070" };
  if (p==="morandi4") return { bg:"#e8ede8", surface:"#f4f7f4", card:"#ffffff", border:"#c8d4c8", text:"#2c3830", muted:"#7a9080", primary:"#5a8870", accent:"#8aa870", success:"#6aab7a", danger:"#b87060" };
  if (p==="morandi5") return { bg:"#eceaf2", surface:"#f6f4fa", card:"#ffffff", border:"#d0cce0", text:"#302c40", muted:"#8880a0", primary:"#7068a8", accent:"#9888c0", success:"#6aab8a", danger:"#b87080" };
  // 淺色
  if (p==="light")    return { bg:"#f5f5f5", surface:"#ffffff",  card:"#ffffff", border:"#e0e0e0", text:"#1a1a2e", muted:"#757575", primary:"#5c6bc0", accent:"#ff8a65", success:"#4caf50", danger:"#ef5350" };
  // 彩色系列
  if (p==="candy")    return { bg:"#1a0a2e", surface:"#2d1654", card:"#3d2070", border:"#5a30a0", text:"#f0e0ff", muted:"#b090d0", primary:"#c060ff", accent:"#ff60c0", success:"#60ffb0", danger:"#ff6060" };
  if (p==="sunset")   return { bg:"#1a0808", surface:"#2e1010", card:"#3d1818", border:"#6030208", text:"#ffe8d0", muted:"#d09070", primary:"#ff7040", accent:"#ffb040", success:"#60d080", danger:"#ff4060" };
  if (p==="teal")     return { bg:"#041c1c", surface:"#062e2e", card:"#083a3a", border:"#0d5555", text:"#d0f5f0", muted:"#60b0a8", primary:"#00d4c0", accent:"#00ff88", success:"#00ff88", danger:"#ff4060" };
  if (p==="royal")    return { bg:"#0a0818", surface:"#120e28", card:"#1a1538", border:"#2a2255", text:"#e0d8ff", muted:"#8878c0", primary:"#8060ff", accent:"#e060ff", success:"#60d880", danger:"#ff5060" };
  // 螢光暗色系列
  if (p==="neon")     return { bg:"#050510", surface:"#0a0a1e", card:"#0f0f28", border:"#1e1e50", text:"#e0e0ff", muted:"#6060a0", primary:"#00ffff", accent:"#ff00ff", success:"#00ff80", danger:"#ff0050" };
  if (p==="matrix")   return { bg:"#000800", surface:"#001200", card:"#001a00", border:"#003300", text:"#00ff41", muted:"#00802a", primary:"#00ff41", accent:"#39ff14", success:"#00ff41", danger:"#ff0030" };
  if (p==="cyber")    return { bg:"#080010", surface:"#100020", card:"#180030", border:"#300060", text:"#f0e0ff", muted:"#8040c0", primary:"#ff0099", accent:"#ffcc00", success:"#00ff99", danger:"#ff3300" };
  // 預設深色
  return { bg:"#0f1117", surface:"#181c27", card:"#1e2235", border:"#2a3050", text:"#e8eaf6", muted:"#7b82a3", primary:"#7c9ef0", accent:"#c4a44e", success:"#4ade80", danger:"#f87171" };
}

// 主題配色板：每個主題有自己的類別顏色陣列（順序對應 BUILT_IN）
function getThemePalette(preset) {
  var p = preset || "dark";
  // [台股, 美股, 一戶通, 黃金, 銀行, 現金, 高利貸]
  if (p==="light")    return ["#5c6bc0","#42a5f5","#26c6da","#ffb300","#66bb6a","#ab47bc","#ef5350"];
  if (p==="morandi1") return ["#a07865","#c4956a","#8a9e78","#c4a87a","#7a9e8a","#b08878","#c47a72"];
  if (p==="morandi2") return ["#5a7fa0","#7aa0b8","#5a9090","#8090a8","#6a9878","#8880a0","#a07880"];
  if (p==="morandi3") return ["#a06070","#c48080","#907080","#b09070","#708070","#9870a0","#c07060"];
  if (p==="morandi4") return ["#5a8870","#8aa870","#6a9890","#a09858","#609870","#8880a0","#b87860"];
  if (p==="morandi5") return ["#7068a8","#9888c0","#6888b0","#a090a8","#6898a0","#a070a0","#b07080"];
  if (p==="candy")    return ["#c060ff","#ff60c0","#60c0ff","#ffcc00","#60ffb0","#ff9060","#ff6060"];
  if (p==="sunset")   return ["#ff7040","#ffb040","#ff5080","#ffd040","#40d090","#ff8090","#ff4060"];
  if (p==="teal")     return ["#00d4c0","#00ff88","#00c0ff","#80ff40","#40d0c0","#00ffcc","#ff6080"];
  if (p==="royal")    return ["#8060ff","#e060ff","#60a0ff","#c080ff","#60d880","#a060e0","#ff5060"];
  if (p==="neon")     return ["#00ffff","#ff00ff","#00ff80","#ffff00","#ff8000","#0080ff","#ff0050"];
  if (p==="matrix")   return ["#00ff41","#39ff14","#00cc33","#80ff00","#00ff80","#00dd22","#ff3300"];
  if (p==="cyber")    return ["#ff0099","#ffcc00","#00ff99","#ff6600","#00ccff","#ff0066","#ffff00"];
  // default dark
  return ["#c4a44e","#5b9bd5","#3a7fc1","#d4a843","#6bb38a","#9b7ed8","#e87c6f"];
}

const BUILT_IN = [
  { key:"twStocksTotal",  label:"台股",    route:"tw-stocks",  Icon:TrendingUp },
  { key:"usStocksTotal",  label:"美股",    route:"us-stocks",  Icon:DollarSign },
  { key:"usAccountTotal", label:"一戶通",  route:"us-account", Icon:Landmark },
  { key:"goldTotal",      label:"黃金",    route:"gold",       Icon:Coins },
  { key:"banksTotal",     label:"銀行存款", route:"banks",     Icon:Landmark },
  { key:"cashTotal",      label:"現金",    route:"cash",       Icon:Wallet },
  { key:"loansTotal",     label:"高利貸",  route:"loans",      Icon:HandCoins },
];

// Helper: get color for a BUILT_IN key based on current theme
function getBuiltInColor(key, themePreset) {
  var palette = getThemePalette(themePreset);
  var idx = -1; BUILT_IN.forEach(function(c,i){ if(c.key===key) idx=i; });
  if (idx>=0) return palette[idx] || palette[0];
  return palette[0];
}

const STORE_KEY   = "asset_tracker_v4";
const PIN_KEY     = "asset_pin_v4";
const PREF_KEY    = "asset_pref_v4";
const SB_URL_KEY  = "sb_url";
const SB_KEY_KEY  = "sb_key";
const SB_SESS_KEY = "sb_session";

function loadSBConfig() {
  return {
    url: localStorage.getItem(SB_URL_KEY)||"",
    key: localStorage.getItem(SB_KEY_KEY)||""
  };
}
function saveSBConfig(url, key) {
  localStorage.setItem(SB_URL_KEY, url);
  localStorage.setItem(SB_KEY_KEY, key);
}
function loadSBSession() {
  try { return JSON.parse(localStorage.getItem(SB_SESS_KEY)||"null"); } catch(e){ return null; }
}
function saveSBSession(sess) {
  if (sess) localStorage.setItem(SB_SESS_KEY, JSON.stringify(sess));
  else localStorage.removeItem(SB_SESS_KEY);
}

// Supabase REST helpers
// 支援新版 sb_publishable_ key 和舊版 eyJ key
function sbCleanUrl(url) {
  // 移除尾部 /rest/v1/ 等路徑，只保留 base URL
  return url.replace(/\/rest\/v1.*$/, "").replace(/\/$/, "");
}
function sbHeaders(key, token) {
  var h = {"Content-Type":"application/json", "apikey":key, "Authorization":"Bearer "+(token||key)};
  return h;
}
function sbSignUp(url, key, email, password) {
  var base = sbCleanUrl(url);
  return fetch(base+"/auth/v1/signup", {
    method:"POST", headers:sbHeaders(key),
    body:JSON.stringify({email:email, password:password})
  }).then(function(r){return r.json();});
}
function sbSignIn(url, key, email, password) {
  var base = sbCleanUrl(url);
  return fetch(base+"/auth/v1/token?grant_type=password", {
    method:"POST", headers:sbHeaders(key),
    body:JSON.stringify({email:email, password:password})
  }).then(function(r){return r.json();});
}
function sbRefreshToken(url, key, refreshToken) {
  var base = sbCleanUrl(url);
  return fetch(base+"/auth/v1/token?grant_type=refresh_token", {
    method:"POST", headers:sbHeaders(key),
    body:JSON.stringify({refresh_token:refreshToken})
  }).then(function(r){return r.json();});
}
function sbSignOut(url, key, token) {
  var base = sbCleanUrl(url);
  return fetch(base+"/auth/v1/logout", {
    method:"POST", headers:sbHeaders(key, token)
  }).catch(function(){});
}
function sbUpload(url, key, token, userId, data) {
  var base = sbCleanUrl(url);
  var payload = {data: data, updated_at: new Date().toISOString()};
  if (userId) payload.uid = userId;
  return fetch(base+"/rest/v1/snapshots?on_conflict=uid", {
    method:"POST",
    headers:Object.assign({},sbHeaders(key,token),{"Prefer":"resolution=merge-duplicates","Content-Type":"application/json"}),
    body:JSON.stringify(payload)
  }).then(function(r){
    if (!r.ok) {
      return r.text().then(function(t){
        console.error("upload error:",t);
        return {ok:false, error:t};
      });
    }
    return {ok:true};
  }).catch(function(e){
    return {ok:false, error:e.message||"網路連線失敗"};
  });
}
function sbDownload(url, key, token) {
  var base = sbCleanUrl(url);
  return fetch(base+"/rest/v1/snapshots?select=data,updated_at&limit=1", {
    headers:sbHeaders(key,token)
  }).then(function(r){return r.ok?r.json():[];})
  .then(function(rows){return rows&&rows.length>0?rows[0]:null;});
}
const PALETTE   = ["#c4a44e","#5b9bd5","#d4a843","#6bb38a","#9b7ed8","#e87c6f","#7c9ef0","#60a860","#d85b7c","#e07c5a","#5bc4b0","#a07cd8"];

function numFmt(v) { return new Intl.NumberFormat("zh-TW",{maximumFractionDigits:0}).format(v||0); }
function loadStore() { try { return JSON.parse(localStorage.getItem(STORE_KEY)||"{}"); } catch(e) { return {}; } }
function saveStore(d) { try { localStorage.setItem(STORE_KEY, JSON.stringify(d)); } catch(e) {} }
function loadPin() { return localStorage.getItem(PIN_KEY)||""; }
function savePin(p) { localStorage.setItem(PIN_KEY, p); }
function loadPrefs() {
  try {
    var p = JSON.parse(localStorage.getItem(PREF_KEY)||"null");
    if (p) return p;
  } catch(e) {}
  return { isDark:true, themePreset:"dark", order:BUILT_IN.map(function(c){return c.key;}), hidden:[], hideTotal:false };
}
function savePrefs(p) { try { localStorage.setItem(PREF_KEY, JSON.stringify(p)); } catch(e) {} }

// ── UI primitives ──────────────────────────────────────────────────────────────
function Card(props) {
  var t = useTheme();
  return (
    <div onClick={props.onClick} style={Object.assign({ background:t.card, border:"1px solid "+t.border, borderRadius:12, overflow:"hidden", cursor:props.onClick?"pointer":"default" }, props.style||{})}>
      {props.children}
    </div>
  );
}

function Inp(props) {
  var t = useTheme();
  return (
    <div style={{display:"flex",flexDirection:"column",gap:4}}>
      {props.label && <label style={{fontSize:11,color:t.muted}}>{props.label}</label>}
      <input
        type={props.type||"text"} value={props.value} onChange={props.onChange}
        placeholder={props.placeholder} step={props.step}
        style={{background:t.surface,border:"1px solid "+t.border,borderRadius:8,padding:"7px 10px",color:t.text,fontSize:14,outline:"none",width:"100%",boxSizing:"border-box"}}
      />
    </div>
  );
}

function Btn(props) {
  var t = useTheme();
  var sz = props.size === "sm";
  var bg = props.variant === "outline" ? "transparent" :
           props.variant === "ghost"   ? "transparent" :
           props.variant === "danger"  ? "transparent" : t.primary;
  var cl = props.variant === "outline" ? t.text :
           props.variant === "ghost"   ? t.muted :
           props.variant === "danger"  ? t.danger : "#fff";
  var bo = props.variant === "outline" ? "1px solid "+t.border : "none";
  return (
    <button onClick={props.disabled ? undefined : props.onClick} style={Object.assign({
      display:"inline-flex", alignItems:"center", gap:6, borderRadius:8,
      fontWeight:500, cursor:props.disabled?"not-allowed":"pointer",
      opacity:props.disabled?0.5:1, border:bo, background:bg, color:cl,
      fontSize:sz?12:14, padding:sz?"5px 10px":"8px 14px"
    }, props.style||{})}>
      {props.children}
    </button>
  );
}

function Toast(props) {
  var t = useTheme();
  if (!props.msg) return null;
  return (
    <div style={{position:"fixed",bottom:80,left:"50%",transform:"translateX(-50%)",background:props.type==="error"?t.danger:t.success,color:"#fff",borderRadius:10,padding:"10px 20px",fontSize:13,fontWeight:500,zIndex:9999,pointerEvents:"none",boxShadow:"0 4px 20px rgba(0,0,0,.3)"}}>
      {props.msg}
    </div>
  );
}

function Shell(props) {
  var t = useTheme();
  return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
        <div>
          <h1 style={{fontSize:22,fontWeight:700,color:t.text,margin:0}}>{props.title}</h1>
          {props.sub && <p style={{fontSize:13,color:t.muted,marginTop:4}}>{props.sub}</p>}
        </div>
        {props.onSave && <Btn onClick={props.onSave}><Save size={14}/>儲存快照</Btn>}
      </div>
      {props.children}
    </div>
  );
}

// ── Supabase Auth Panel ───────────────────────────────────────────────────────
function SupabasePanel(props) {
  var onLogin = props.onLogin;
  var onClose = props.onClose;
  var t = useTheme();
  var cfg = loadSBConfig();
  var s1 = useState(cfg.url); var sbUrl = s1[0]; var setSbUrl = s1[1];
  var s2 = useState(cfg.key); var sbKey = s2[0]; var setSbKey = s2[1];
  var s3 = useState(""); var email = s3[0]; var setEmail = s3[1];
  var s4 = useState(""); var pw = s4[0]; var setPw = s4[1];
  var s5 = useState("login"); var mode = s5[0]; var setMode = s5[1];
  var s6 = useState(""); var err = s6[0]; var setErr = s6[1];
  var s7 = useState(false); var loading = s7[0]; var setLoading = s7[1];
  var s8 = useState(false); var showPw = s8[0]; var setShowPw = s8[1];
  var configured = sbUrl && sbUrl.includes("supabase.co") && sbKey && sbKey.length > 10;

  function doAuth() {
    if (!email||!pw) { setErr("請輸入 Email 和密碼"); return; }
    setLoading(true); setErr("");
    saveSBConfig(sbUrl.trim(), sbKey.trim());
    var fn = mode==="signup" ? sbSignUp : sbSignIn;
    fn(sbUrl.trim(), sbKey.trim(), email.trim(), pw).then(function(data){
      setLoading(false);
      if (data.error || data.error_description) { setErr(data.error_description||data.error||"登入失敗"); return; }
      if (data.access_token) {
        var sess = {access_token:data.access_token, refresh_token:data.refresh_token, email:email.trim()};
        saveSBSession(sess);
        if (onLogin) onLogin(sess);
      } else { setErr("登入失敗，請確認 Email 和密碼"); }
    }).catch(function(){ setLoading(false); setErr("連線失敗，請確認 Supabase URL 和 Key"); });
  }

  return (
    <div style={{position:"fixed",inset:0,background:"#00000099",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:t.card,border:"1px solid "+t.border,borderRadius:14,width:"100%",maxWidth:400,padding:24,display:"flex",flexDirection:"column",gap:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <h2 style={{fontSize:17,fontWeight:700,color:t.text,margin:0}}>☁️ 雲端同步設定</h2>
          <button onClick={onClose} style={{background:"none",border:"none",color:t.muted,cursor:"pointer",fontSize:20,lineHeight:1}}>×</button>
        </div>
        {!configured && (
          <div>
            <p style={{fontSize:12,color:t.muted,marginBottom:10}}>請先填入 Supabase 專案資訊（只需設定一次）</p>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <Inp label="Supabase Project URL" value={sbUrl} onChange={function(e){setSbUrl(e.target.value);}} placeholder="https://xxxxxx.supabase.co"/>
              <Inp label="anon public key" value={sbKey} onChange={function(e){setSbKey(e.target.value);}} placeholder="eyJhbGciOiJIUzI1NiIs..."/>
            </div>
            <p style={{fontSize:11,color:t.muted,marginTop:8}}>不知道如何取得？請看安裝包裡的「安裝指南.md」</p>
          </div>
        )}
        {configured && (
          <div>
            <div style={{display:"flex",background:t.surface,borderRadius:8,padding:4,marginBottom:14}}>
              {[["login","登入"],["signup","註冊新帳號"]].map(function(it){
                return <button key={it[0]} onClick={function(){setMode(it[0]);setErr("");}} style={{flex:1,padding:"7px 0",border:"none",borderRadius:6,background:mode===it[0]?t.primary:"transparent",color:mode===it[0]?"#fff":t.muted,cursor:"pointer",fontSize:13,fontWeight:500}}>{it[1]}</button>;
              })}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <Inp label="Email" type="email" value={email} onChange={function(e){setEmail(e.target.value);}} placeholder="your@email.com"/>
              <div style={{position:"relative"}}>
                <Inp label="密碼" type={showPw?"text":"password"} value={pw} onChange={function(e){setPw(e.target.value);}} placeholder="至少 6 位"/>
                <button onClick={function(){setShowPw(!showPw);}} style={{position:"absolute",right:10,bottom:8,background:"none",border:"none",color:t.muted,cursor:"pointer",display:"flex",alignItems:"center",padding:2}}>
                  {showPw?<EyeOff size={15}/>:<Eye size={15}/>}
                </button>
              </div>
            </div>
          </div>
        )}
        {err && <p style={{fontSize:12,color:t.danger,margin:0}}>{err}</p>}
        <Btn onClick={configured?doAuth:function(){saveSBConfig(sbUrl.trim(),sbKey.trim());}} disabled={loading} style={{width:"100%",justifyContent:"center"}}>
          {loading?"連線中...":(configured?(mode==="login"?"登入":"註冊帳號"):"確認並繼續")}
        </Btn>
        {configured && <button onClick={function(){saveSBConfig("","");setSbUrl("");setSbKey("");}} style={{background:"none",border:"none",color:t.muted,cursor:"pointer",fontSize:12,textDecoration:"underline"}}>重新設定 Supabase 資訊</button>}
      </div>
    </div>
  );
}

// ── PIN Screen ─────────────────────────────────────────────────────────────────
function PinScreen(props) {
  var t = useTheme();
  var s1 = useState(""); var pin = s1[0]; var setPin = s1[1];
  var s2 = useState(""); var np  = s2[0]; var setNp  = s2[1];
  var s3 = useState(""); var cf  = s3[0]; var setCf  = s3[1];
  var s4 = useState(false); var show = s4[0]; var setShow = s4[1];
  var s5 = useState(""); var err  = s5[0]; var setErr  = s5[1];
  var isSetup = !props.hasPin;

  function submit() {
    if (!isSetup) {
      if (pin === loadPin()) { props.onUnlock(); }
      else { setErr("PIN 錯誤，請重試"); setPin(""); }
    } else {
      if (np.length < 4) { setErr("PIN 至少 4 位數"); return; }
      if (np !== cf) { setErr("兩次輸入不一致"); return; }
      savePin(np); props.onUnlock();
    }
  }

  var inputType = show ? "text" : "password";
  return (
    <div style={{minHeight:"100vh",background:t.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{width:"100%",maxWidth:360}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontSize:48,marginBottom:12}}>💰</div>
          <h1 style={{fontSize:24,fontWeight:700,color:t.text,margin:0}}>資產追蹤</h1>
          <p style={{color:t.muted,fontSize:13,marginTop:6}}>{isSetup?"首次使用，請設定 PIN 保護隱私":"請輸入 PIN 解鎖"}</p>
        </div>
        <Card>
          <div style={{padding:24,display:"flex",flexDirection:"column",gap:16}}>
            {!isSetup && (
              <div style={{position:"relative"}}>
                <Inp label="PIN 碼" type={inputType} value={pin} onChange={function(e){
                  var val=e.target.value; setPin(val);
                  if(val===loadPin()){props.onUnlock();}
                }} placeholder="輸入 PIN"/>
                <button onClick={function(){setShow(!show);}} style={{position:"absolute",right:10,bottom:8,background:"none",border:"none",color:t.muted,cursor:"pointer",display:"flex",alignItems:"center",padding:2}}>
                  {show ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            )}
            {isSetup && (
              <div>
                <div style={{position:"relative",marginBottom:12}}>
                  <Inp label="設定 PIN（至少 4 位）" type={inputType} value={np} onChange={function(e){setNp(e.target.value);}} placeholder="輸入新 PIN"/>
                  <button onClick={function(){setShow(!show);}} style={{position:"absolute",right:10,bottom:8,background:"none",border:"none",color:t.muted,cursor:"pointer",display:"flex",alignItems:"center",padding:2}}>
                    {show ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
                <Inp label="確認 PIN" type="password" value={cf} onChange={function(e){setCf(e.target.value);}} placeholder="再次輸入"/>
              </div>
            )}
            {err && <p style={{color:t.danger,fontSize:12,margin:0}}>{err}</p>}
            <Btn onClick={submit} style={{width:"100%",justifyContent:"center"}}>
              <Lock size={14}/>{isSetup?"設定並進入":"解鎖"}
            </Btn>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── Home Page ──────────────────────────────────────────────────────────────────
function HomePage(props) {
  var snapshot = props.snapshot;
  var navigate = props.navigate;
  var prefs    = props.prefs;
  var setPrefs = props.setPrefs;
  var customCats = props.customCats;
  var t = useTheme();

  var s1 = useState(false); var editMode = s1[0]; var setEditMode = s1[1];
  var s2 = useState(null);  var dragIdx  = s2[0]; var setDragIdx  = s2[1];
  var s3 = useState(null);  var overIdx  = s3[0]; var setOverIdx  = s3[1];
  var dragNodeRef = useRef(null);
  var gridRef = useRef(null);

  var allKeys = BUILT_IN.map(function(c){return c.key;}).concat(
    (customCats||[]).map(function(c){return "custom_"+c.id;})
  );
  var orderedKeys = (prefs.order||[]).filter(function(k){return allKeys.indexOf(k)>=0;});
  var rest = allKeys.filter(function(k){return orderedKeys.indexOf(k)<0;});
  var fullOrder = orderedKeys.concat(rest);

  function getCat(key) {
    var b = BUILT_IN.find(function(c){return c.key===key;});
    if (b) return Object.assign({},b,{color:getBuiltInColor(key, prefs.themePreset)});
    var id = key.replace("custom_","");
    var cc = (customCats||[]).find(function(c){return c.id===id;});
    if (!cc) return null;
    return { key:key, label:cc.label, color:cc.color||t.primary, route:key, Icon:BarChart2 };
  }

  function getVal(key) {
    if (key.indexOf("custom_")===0) {
      var id = key.replace("custom_","");
      var cc = (customCats||[]).find(function(c){return c.id===id;});
      if (!cc || !cc.items) return 0;
      return cc.items.reduce(function(s,i){return s+(i.currentValue||0);},0);
    }
    return snapshot ? (Number(snapshot[key])||0) : 0;
  }

  var total = snapshot ? (Number(snapshot.totalAssets)||0) : 0;
  var visibleKeys = fullOrder.filter(function(k){return (prefs.hidden||[]).indexOf(k)<0;});

  var pieData = visibleKeys.map(function(k){
    var c = getCat(k);
    return c ? { name:c.label, value:getVal(k), color:c.color } : null;
  }).filter(function(d){return d && d.value>0;});

  function reorder(from, to) {
    if (from === to) return;
    var o = fullOrder.slice();
    var moved = o.splice(from,1)[0];
    o.splice(to,0,moved);
    var np = Object.assign({},prefs,{order:o});
    setPrefs(np); savePrefs(np);
  }

  function getCardAt(x,y) {
    if (!gridRef.current) return null;
    var cardEls = gridRef.current.querySelectorAll("[data-cidx]"); var cards = []; for(var ci=0;ci<cardEls.length;ci++) cards.push(cardEls[ci]);
    var result = null;
    cards.forEach(function(card){
      var r = card.getBoundingClientRect();
      if (x>=r.left && x<=r.right && y>=r.top && y<=r.bottom)
        result = parseInt(card.getAttribute("data-cidx"),10);
    });
    return result;
  }

  function onTouchStart(e,i) {
    if (!editMode) return;
    dragNodeRef.current = i; setDragIdx(i);
  }
  function onTouchMove(e) {
    if (!editMode || dragNodeRef.current===null) return;
    e.preventDefault();
    var touch = e.touches[0];
    var idx = getCardAt(touch.clientX, touch.clientY);
    if (idx !== null) setOverIdx(idx);
  }
  function onTouchEnd() {
    if (dragNodeRef.current!==null && overIdx!==null) reorder(dragNodeRef.current,overIdx);
    dragNodeRef.current=null; setDragIdx(null); setOverIdx(null);
  }

  function toggleHide(key) {
    var h = prefs.hidden||[];
    var nh = h.indexOf(key)>=0 ? h.filter(function(k){return k!==key;}) : h.concat([key]);
    var np = Object.assign({},prefs,{hidden:nh}); setPrefs(np); savePrefs(np);
  }

  var RADIAN = Math.PI/180;
  function renderLabel(labelProps) {
    var cx=labelProps.cx,cy=labelProps.cy,midAngle=labelProps.midAngle,innerRadius=labelProps.innerRadius,outerRadius=labelProps.outerRadius,percent=labelProps.percent;
    if (percent < 0.08) return null;
    // Place label at center of arc band
    var r = innerRadius+(outerRadius-innerRadius)*0.5;
    var x = cx+r*Math.cos(-midAngle*RADIAN);
    var y = cy+r*Math.sin(-midAngle*RADIAN);
    return (
      <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="middle" fontSize={9} fontWeight={700} style={{textShadow:"0 1px 2px rgba(0,0,0,0.8)"}}>
        {(percent*100).toFixed(0)+"%"}
      </text>
    );
  }

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <h1 style={{fontSize:22,fontWeight:700,color:t.text,margin:0}}>資產總覽</h1>
          {snapshot && snapshot.snapshotDate && <p style={{fontSize:13,color:t.muted,marginTop:4}}>{"最近更新："+snapshot.snapshotDate}</p>}
        </div>
        <Btn size="sm" variant={editMode?"primary":"outline"} onClick={function(){setEditMode(!editMode);}}>
          <GripVertical size={13}/>{editMode?"完成":"編輯"}
        </Btn>
      </div>

      <Card style={{background:"linear-gradient(135deg, "+t.card+" 60%, "+t.primary+"22)"}}>
        <div style={{padding:"20px 20px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:16}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <p style={{fontSize:12,color:t.muted,margin:0}}>總資產</p>
              <button onClick={function(){
                var np=Object.assign({},prefs,{hideTotal:!prefs.hideTotal});
                setPrefs(np); savePrefs(np);
              }} style={{background:"none",border:"none",color:t.muted,cursor:"pointer",padding:2,display:"flex",alignItems:"center"}}>
                {prefs.hideTotal?<EyeOff size={13}/>:<Eye size={13}/>}
              </button>
            </div>
            <p style={{fontSize:32,fontWeight:700,color:t.primary,margin:"8px 0 0",fontFamily:"monospace"}}>
              {prefs.hideTotal?"$***,***":"$"+numFmt(total)}
            </p>
          </div>
          {pieData.length>0 && (
            <div style={{width:120,height:120,flexShrink:0}}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={28} outerRadius={54} dataKey="value" strokeWidth={1} stroke={t.card} labelLine={false} label={renderLabel}>
                    {pieData.map(function(e,i){return <Cell key={i} fill={e.color}/>;}) }
                  </Pie>
                  <Tooltip formatter={function(v){return ["$"+numFmt(v),"金額"];}} contentStyle={{background:t.card,border:"1px solid "+t.border,borderRadius:8,color:t.text,fontSize:12}}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </Card>

      {editMode && <p style={{fontSize:12,color:t.muted,textAlign:"center",margin:0}}>長按拖曳調整順序，點 👁 隱藏/顯示</p>}

      <div ref={gridRef} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(150px,1fr))",gap:12,touchAction:editMode?"none":"auto"}}>
        {fullOrder.map(function(key,i){
          var hidden = (prefs.hidden||[]).indexOf(key)>=0;
          if (!editMode && hidden) return null;
          var cat = getCat(key); if(!cat) return null;
          var val = getVal(key);
          var pct = total>0 ? ((val/total)*100).toFixed(1) : "0.0";
          var CatIcon = cat.Icon;
          return (
            <div key={key} data-cidx={i}
              draggable={editMode}
              onDragStart={editMode ? function(){dragNodeRef.current=i;setDragIdx(i);} : undefined}
              onDragOver={editMode ? function(e){e.preventDefault();setOverIdx(i);} : undefined}
              onDrop={editMode ? function(){if(dragNodeRef.current!==null&&dragNodeRef.current!==i)reorder(dragNodeRef.current,i);dragNodeRef.current=null;setDragIdx(null);setOverIdx(null);} : undefined}
              onDragEnd={function(){dragNodeRef.current=null;setDragIdx(null);setOverIdx(null);}}
              onTouchStart={function(e){onTouchStart(e,i);}}
              style={{opacity:dragIdx===i?0.35:hidden?0.45:1,transform:overIdx===i&&editMode?"scale(1.03)":"scale(1)",cursor:editMode?"grab":"pointer",position:"relative",outline:overIdx===i&&editMode?"2px dashed "+t.primary:"none",borderRadius:12,transition:"opacity .15s"}}>
              <Card onClick={!editMode&&!hidden?function(){navigate(cat.route);} : undefined} style={{height:"100%"}}>
                <div style={{padding:"14px 12px 12px"}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                    <div style={{width:32,height:32,borderRadius:8,background:cat.color+"22",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <CatIcon size={15} style={{color:cat.color}}/>
                    </div>
                    {editMode ? (
                      <button onClick={function(e){e.stopPropagation();toggleHide(key);}} style={{background:"none",border:"none",color:hidden?t.muted:t.primary,cursor:"pointer",padding:4,display:"flex",borderRadius:6}}>
                        {hidden ? <EyeOff size={15}/> : <Eye size={15}/>}
                      </button>
                    ) : <span style={{fontSize:11,color:t.muted}}>{pct+"%"}</span>}
                  </div>
                  <p style={{fontSize:11,color:t.muted,margin:0}}>{cat.label}</p>
                  <p style={{fontSize:15,fontWeight:600,color:hidden?t.muted:t.text,margin:"4px 0 0",fontFamily:"monospace"}}>{"$"+numFmt(val)}</p>
                </div>
              </Card>
              {editMode && <div style={{position:"absolute",top:6,left:8,color:t.muted,pointerEvents:"none"}}><GripVertical size={12}/></div>}
            </div>
          );
        })}
      </div>

      {!snapshot && (
        <Card style={{border:"2px dashed "+t.border}}>
          <div style={{padding:32,textAlign:"center"}}>
            <p style={{color:t.muted,marginBottom:12}}>尚無資產記錄，請前往各分類頁面輸入資料後儲存快照。</p>
            <Btn variant="outline" onClick={function(){navigate("tw-stocks");}}>開始記錄</Btn>
          </div>
        </Card>
      )}
    </div>
  );
}

// ── 台股報價 ─────────────────────────────────────────────────────────────────
var _stockCache = {};

// 查名稱：用 TWSE/TPEx OpenAPI（昨收，CORS OK）
// 內建常見台股代號清單（離線可用，立即查到，不需等 API）
var BUILTIN_STOCKS = {"1101":"台泥","1102":"亞泥","1216":"統一","1301":"台塑","1303":"南亞","1326":"台化","1789":"神隆","2002":"中鋼","2204":"中華","2207":"和泰車","2303":"聯電","2308":"台達電","2317":"鴻海","2324":"仁寶","2330":"台積電","2357":"華碩","2382":"廣達","2395":"研華","2409":"友達","2454":"聯發科","2603":"長榮","2609":"陽明","2610":"華航","2615":"萬海","2618":"長榮航","2880":"華南金","2881":"富邦金","2882":"國泰金","2883":"開發金","2884":"玉山金","2885":"元大金","2886":"兆豐金","2887":"台新金","2890":"永豐金","2891":"中信金","2892":"第一金","3008":"大立光","3017":"奇鋐","3081":"聯亞","3105":"穩懋","3131":"弘塑","3231":"緯創","3293":"鈊象","3324":"雙鴻","3481":"群創","3529":"力旺","3711":"日月光投控","4147":"中裕","4174":"浩鼎","5274":"信驊","5347":"世界","5880":"合庫金","6147":"頎邦","6182":"合晶","6223":"旺矽","6274":"台燿","6488":"環球晶","6515":"穎崴","6547":"高端疫苗","6669":"緯穎","8046":"南電","8069":"元太","8299":"群聯"};

// 台股名稱查詢：先查內建清單（瞬間），查不到再呼叫 API
var _stockCache = {};
var _twseAllList = null;
var _twseAllTs = 0;

function _getTwseAll() {
  if (_twseAllList && Date.now()-_twseAllTs < 3600000*6) {
    return Promise.resolve(_twseAllList);
  }
  return fetch("https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_AVG_ALL")
    .then(function(r){ return r.ok ? r.json() : []; })
    .then(function(list){
      if (list && list.length > 0) {
        _twseAllList = list;
        _twseAllTs = Date.now();
      }
      return _twseAllList || [];
    })
    .catch(function(){ return _twseAllList || []; });
}

function fetchByCode(code) {
  var q = (code||"").trim(); if (!q) return Promise.resolve(null);
  // 1. 先查內建清單，瞬間回應
  if (BUILTIN_STOCKS[q]) {
    return Promise.resolve({name: BUILTIN_STOCKS[q], code:q, price:0});
  }
  var cacheKey = "c_"+q;
  if (_stockCache[cacheKey] && Date.now()-_stockCache[cacheKey].ts<3600000) {
    return Promise.resolve(_stockCache[cacheKey].data);
  }
  // 2. 查不到再呼叫 API
  return _getTwseAll().then(function(list){
    var found = null;
    list.forEach(function(item){ if (item.Code===q) found=item; });
    if (found) {
      var r = {name:found.Name, code:q, price:parseFloat(found.ClosingPrice)||0};
      _stockCache[cacheKey] = {data:r, ts:Date.now()};
      return r;
    }
    return fetch("https://www.tpex.org.tw/openapi/v1/tpex_mainboard_daily_close_quotes")
      .then(function(r2){ return r2.ok ? r2.json() : []; })
      .then(function(list2){
        var found2 = null;
        list2.forEach(function(item){ if (item.SecuritiesCompanyCode===q) found2=item; });
        if (!found2) return null;
        var r2 = {name:found2.CompanyAbbreviation||q, code:q, price:parseFloat(found2.Close)||0};
        _stockCache[cacheKey] = {data:r2, ts:Date.now()};
        return r2;
      });
  }).catch(function(){ return null; });
}

function fetchByName(name) {
  var q = (name||"").trim(); if (!q) return Promise.resolve(null);
  // 1. 先查內建清單
  var builtinCode = null;
  Object.keys(BUILTIN_STOCKS).forEach(function(c){
    if (!builtinCode && BUILTIN_STOCKS[c].indexOf(q)>=0) builtinCode=c;
  });
  if (builtinCode) {
    return Promise.resolve({name: BUILTIN_STOCKS[builtinCode], code:builtinCode, price:0});
  }
  var cacheKey = "n_"+q;
  if (_stockCache[cacheKey] && Date.now()-_stockCache[cacheKey].ts<3600000) {
    return Promise.resolve(_stockCache[cacheKey].data);
  }
  // 2. 查不到再呼叫 API
  return _getTwseAll().then(function(list){
    var found = null;
    list.forEach(function(item){
      if (!found && item.Name && item.Name.indexOf(q)>=0) found=item;
    });
    if (found) {
      var r = {name:found.Name, code:found.Code, price:parseFloat(found.ClosingPrice)||0};
      _stockCache[cacheKey] = {data:r, ts:Date.now()};
      return r;
    }
    return fetch("https://www.tpex.org.tw/openapi/v1/tpex_mainboard_daily_close_quotes")
      .then(function(r2){ return r2.ok ? r2.json() : []; })
      .then(function(list2){
        var found2 = null;
        list2.forEach(function(item){
          if (!found2 && item.CompanyAbbreviation && item.CompanyAbbreviation.indexOf(q)>=0) found2=item;
        });
        if (!found2) return null;
        var r2 = {name:found2.CompanyAbbreviation, code:found2.SecuritiesCompanyCode, price:parseFloat(found2.Close)||0};
        _stockCache[cacheKey] = {data:r2, ts:Date.now()};
        return r2;
      });
  }).catch(function(){ return null; });
}


// ── StockRow（放頂層避免每次 render 重建，解決輸入跳掉問題）────────────────────
function StockRow(rowProps) {
  var s=rowProps.s; var i=rowProps.i; var isM=rowProps.isM; var t=rowProps.t;
  var isFetching=rowProps.isFetching;
  var onCodeChange=rowProps.onCodeChange; var onNameChange=rowProps.onNameChange;
  var onCodeBlur=rowProps.onCodeBlur;   var onNameBlur=rowProps.onNameBlur;
  var onFieldChange=rowProps.onFieldChange;
  var onFetch=rowProps.onFetch; var onDelete=rowProps.onDelete;

  // 現股計算: (成本 - 現價) × 數量 (張=×1000, 零股=×1)
  var isZeroStock = !isM && s.unitType==="zero";
  var unitMultiplier = isZeroStock ? 1 : 1000;
  // 現股市值
  var cMarketVal = isM ? s.marketValue : (s.price * s.shares * unitMultiplier);
  // 現股損益
  var cPnL = isM ? 0 : ((s.buyValue - s.price) * s.shares * unitMultiplier);
  // 融資計算: ((買進價值 - 現價) - (買進價值 × 成數%)) × 張數
  var mPnL = isM ? ((s.buyValue - s.price - s.buyValue*((s.marginRatio==null?60:s.marginRatio))/100) * s.shares * 1000) : 0;

  return (
    <Card style={{marginBottom:10}}>
      <div style={{padding:"13px 13px 11px"}}>
        {/* 代號 + 名稱 + 刷新 */}
        <div style={{display:"flex",gap:8,alignItems:"flex-end",marginBottom:10}}>
          <div style={{flex:"0 0 90px"}}>
            <label style={{fontSize:11,color:t.muted,display:"block",marginBottom:4}}>代號</label>
            <input value={s.code} onChange={onCodeChange} onBlur={onCodeBlur} placeholder="2330"
              style={{background:t.surface,border:"1px solid "+t.border,borderRadius:8,padding:"7px 8px",color:t.text,fontSize:14,outline:"none",width:"100%",boxSizing:"border-box"}}/>
          </div>
          <div style={{flex:1}}>
            <label style={{fontSize:11,color:t.muted,display:"block",marginBottom:4}}>
              名稱{isFetching&&<span style={{color:t.primary,marginLeft:6,fontSize:10}}>查詢中...</span>}
            </label>
            <input value={s.name} onChange={onNameChange} onBlur={onNameBlur} placeholder="台積電"
              style={{background:t.surface,border:"1px solid "+t.border,borderRadius:8,padding:"7px 8px",color:t.text,fontSize:14,outline:"none",width:"100%",boxSizing:"border-box"}}/>
          </div>
          <button onClick={onFetch} disabled={!s.code||isFetching} title="刷新現價"
            style={{background:isFetching?t.border:t.primary+"22",border:"1px solid "+t.primary+"44",borderRadius:8,padding:"7px 9px",color:t.primary,cursor:s.code&&!isFetching?"pointer":"not-allowed",opacity:s.code?1:0.4,marginBottom:1,display:"flex",alignItems:"center"}}>
            <RefreshCw size={14}/>
          </button>
        </div>

        {/* 現股欄位 */}
        {!isM&&(
          <div>
            {/* 張/零股 切換 */}
            <div style={{display:"flex",background:t.surface,borderRadius:8,border:"1px solid "+t.border,overflow:"hidden",marginBottom:10,width:"fit-content"}}>
              {[["share","整張"],["zero","零股"]].map(function(it){
                var active=(s.unitType||"share")===it[0];
                return <button key={it[0]} onClick={function(){onFieldChange("unitType",it[0]);}} style={{padding:"5px 14px",border:"none",cursor:"pointer",fontSize:12,fontWeight:500,background:active?t.primary:"transparent",color:active?"#fff":t.muted}}>{it[1]}</button>;
              })}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
              <div>
                <label style={{fontSize:11,color:t.muted,display:"block",marginBottom:4}}>成本（每股）</label>
                <input type="number" value={s.buyValue||""} step="0.1" onChange={function(e){onFieldChange("buyValue",+e.target.value);}}
                  style={{background:t.surface,border:"1px solid "+t.border,borderRadius:8,padding:"7px 8px",color:t.text,fontSize:14,outline:"none",width:"100%",boxSizing:"border-box"}}/>
              </div>
              <div>
                <label style={{fontSize:11,color:t.muted,display:"block",marginBottom:4}}>
                  現價{s.price>0&&<span style={{color:t.success,marginLeft:4,fontSize:10}}>✓</span>}
                </label>
                <input type="number" value={s.price||""} step="0.1" onChange={function(e){onFieldChange("price",+e.target.value);}}
                  style={{background:t.surface,border:"1px solid "+(s.price>0?t.success+"66":t.border),borderRadius:8,padding:"7px 8px",color:t.text,fontSize:14,outline:"none",width:"100%",boxSizing:"border-box"}}/>
              </div>
              <div>
                <label style={{fontSize:11,color:t.muted,display:"block",marginBottom:4}}>{isZeroStock?"數量（股）":"數量（張）"}</label>
                <input type="number" value={s.shares||""} onChange={function(e){onFieldChange("shares",+e.target.value);}}
                  style={{background:t.surface,border:"1px solid "+t.border,borderRadius:8,padding:"7px 8px",color:t.text,fontSize:14,outline:"none",width:"100%",boxSizing:"border-box"}}/>
              </div>
            </div>
          </div>
        )}

        {/* 融資欄位 */}
        {isM&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",gap:8}}>
            <div>
              <label style={{fontSize:11,color:t.muted,display:"block",marginBottom:4}}>買進均價</label>
              <input type="number" value={s.buyValue||""} step="0.1" onChange={function(e){onFieldChange("buyValue",+e.target.value);}}
                style={{background:t.surface,border:"1px solid "+t.border,borderRadius:8,padding:"7px 8px",color:t.text,fontSize:14,outline:"none",width:"100%",boxSizing:"border-box"}}/>
            </div>
            <div>
              <label style={{fontSize:11,color:t.muted,display:"block",marginBottom:4}}>自備款</label>
              <input type="number" value={s.principal||""} onChange={function(e){onFieldChange("principal",+e.target.value);}}
                style={{background:t.surface,border:"1px solid "+t.border,borderRadius:8,padding:"7px 8px",color:t.text,fontSize:14,outline:"none",width:"100%",boxSizing:"border-box"}}/>
            </div>
            <div>
              <label style={{fontSize:11,color:t.muted,display:"block",marginBottom:4}}>成數%</label>
              <input type="number" value={s.marginRatio===undefined||s.marginRatio===null?"":s.marginRatio} placeholder="60" onChange={function(e){onFieldChange("marginRatio",e.target.value===""?null:+e.target.value);}}
                style={{background:t.surface,border:"1px solid "+t.border,borderRadius:8,padding:"7px 8px",color:t.text,fontSize:14,outline:"none",width:"100%",boxSizing:"border-box"}}/>
            </div>
            <div>
              <label style={{fontSize:11,color:t.muted,display:"block",marginBottom:4}}>
                現價{s.price>0&&<span style={{color:t.success,marginLeft:4,fontSize:10}}>✓</span>}
              </label>
              <input type="number" value={s.price||""} step="0.1" onChange={function(e){onFieldChange("price",+e.target.value);}}
                style={{background:t.surface,border:"1px solid "+(s.price>0?t.success+"66":t.border),borderRadius:8,padding:"7px 8px",color:t.text,fontSize:14,outline:"none",width:"100%",boxSizing:"border-box"}}/>
            </div>
            <div>
              <label style={{fontSize:11,color:t.muted,display:"block",marginBottom:4}}>數量</label>
              <input type="number" value={s.shares||""} onChange={function(e){onFieldChange("shares",+e.target.value);}}
                style={{background:t.surface,border:"1px solid "+t.border,borderRadius:8,padding:"7px 8px",color:t.text,fontSize:14,outline:"none",width:"100%",boxSizing:"border-box"}}/>
            </div>
          </div>
        )}

        {/* 底部計算結果 */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10,paddingTop:10,borderTop:"1px solid "+t.border}}>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            {!isM&&(
              <span style={{fontSize:12,color:t.muted}}>
                市值：<b style={{color:t.text,fontFamily:"monospace"}}>{"$"+numFmt(cMarketVal)}</b>
                {s.buyValue>0&&s.price>0&&<span style={{marginLeft:8,color:cPnL<=0?t.success:t.danger,fontFamily:"monospace"}}>{cPnL<=0?"+":""}{numFmt(-cPnL)}</span>}
              </span>
            )}
            {isM&&(
              <span style={{fontSize:12,color:t.muted}}>
                損益：<b style={{fontFamily:"monospace",color:mPnL>=0?t.success:t.danger}}>{mPnL>=0?"+":""}{numFmt(mPnL)}</b>
              </span>
            )}
          </div>
          <button onClick={onDelete} style={{background:"none",border:"none",color:t.danger,cursor:"pointer",padding:4,display:"flex",alignItems:"center"}}>
            <Trash2 size={14}/>
          </button>
        </div>
      </div>
    </Card>
  );
}

// ── 台股 ─────────────────────────────────────────────────────────────────────
function TwStocksPage(props) {
  var snapshot=props.snapshot; var onSave=props.onSave;
  var t=useTheme();
  var s1=useState("cash"); var tab=s1[0]; var setTab=s1[1];
  var emptyC=function(){return {_id:"c"+Date.now()+Math.random(),type:"cash",code:"",name:"",buyValue:0,principal:0,price:0,shares:0,marketValue:0,unitType:"share"};};
  var emptyM=function(){return {_id:"m"+Date.now()+Math.random(),type:"margin",code:"",name:"",buyValue:0,principal:0,price:0,shares:0,marketValue:0,marginLoan:0,marginRatio:60,companyLoan:0,netValue:0};};
  var s2=useState([emptyC()]); var cashStocks=s2[0]; var setCashStocks=s2[1];
  var s3=useState([emptyM()]); var marginStocks=s3[0]; var setMarginStocks=s3[1];
  var s4=useState(false); var fetchingAll=s4[0]; var setFetchingAll=s4[1];
  var s5=useState(null); var fetchingIdx=s5[0]; var setFetchingIdx=s5[1];
  var s6=useState(""); var updAt=s6[0]; var setUpdAt=s6[1];

  useEffect(function(){
    if(snapshot&&snapshot.twStocks&&snapshot.twStocks.length){
      var cash=snapshot.twStocks.filter(function(s){return s.type==="cash"||!s.type;}).map(function(s,si){return Object.assign({},emptyC(),s,{type:"cash",_id:s._id||("c"+si)});});
      var margin=snapshot.twStocks.filter(function(s){return s.type==="margin";}).map(function(s,mi){return Object.assign({},emptyM(),s,{_id:s._id||("m"+mi)});});
      if(cash.length) setCashStocks(cash); else setCashStocks([emptyC()]);
      if(margin.length) setMarginStocks(margin); else setMarginStocks([emptyM()]);
    }
  },[snapshot]);

  function recC(it){
    var mult = it.unitType==="zero" ? 1 : 1000;
    return Object.assign({},it,{marketValue:it.price*it.shares*mult});
  }
  function recM(it){
    var mv=it.price*it.shares*1000;
    var ratio=(it.marginRatio==null?60:it.marginRatio);
    var companyLoan=Math.round(it.buyValue*ratio/100);
    // 損益: ((買進均價 - 現價) - (買進均價 × 成數%)) × 張數
    var pnl=((it.buyValue-it.price)-it.buyValue*ratio/100)*it.shares*1000;
    return Object.assign({},it,{marketValue:mv,marginLoan:it.buyValue-it.principal,companyLoan:companyLoan,netValue:mv-companyLoan,pnl:pnl});
  }
  function updC(i,f,v){setCashStocks(function(p){var u=p.slice();var n=Object.assign({},u[i]);n[f]=v;u[i]=recC(n);return u;});}
  function updM(i,f,v){setMarginStocks(function(p){var u=p.slice();var n=Object.assign({},u[i]);n[f]=v;u[i]=recM(n);return u;});}
  function updCMulti(i,fields){setCashStocks(function(p){var u=p.slice();u[i]=recC(Object.assign({},u[i],fields));return u;});}
  function updMMulti(i,fields){setMarginStocks(function(p){var u=p.slice();u[i]=recM(Object.assign({},u[i],fields));return u;});}

  // Use top-level async helpers (no nested async allowed in Babel artifact)
  function onCodeBlur(isM,idx){
    var stocks=isM?marginStocks:cashStocks; var s=stocks[idx];
    if(!s.code||!s.code.trim()) return;
    setFetchingIdx({isM:isM,idx:idx});
    fetchByCode(s.code.trim()).then(function(r){
      setFetchingIdx(null);
      if(!r || !r.name) {
        showToast("找不到股票代號 "+s.code.trim(), "error");
        return;
      }
      var fields={name:r.name};
      if(isM) updMMulti(idx,fields); else updCMulti(idx,fields);
      showToast(r.name+" 帶入成功", "success");
    }).catch(function(e){
      setFetchingIdx(null);
      showToast("查詢失敗，請稍後再試", "error");
    });
  }
  function onNameBlur(isM,idx){
    var stocks=isM?marginStocks:cashStocks; var s=stocks[idx];
    if(!s.name||!s.name.trim()||(s.code&&s.code.trim())) return;
    setFetchingIdx({isM:isM,idx:idx});
    fetchByName(s.name.trim()).then(function(r){
      setFetchingIdx(null); if(!r||!r.code) return;
      // 帶入代號和名稱，不自動帶入價格（避免舊資料誤導）
      var fields={code:r.code};
      if(r.name) fields.name=r.name;
      if(isM) updMMulti(idx,fields); else updCMulti(idx,fields);
    }).catch(function(){setFetchingIdx(null);});
  }
  function fetchSingle(isM,idx){
    var stocks=isM?marginStocks:cashStocks; var s=stocks[idx]; if(!s.code) return;
    setFetchingIdx({isM:isM,idx:idx});
    fetchByCode(s.code.trim()).then(function(r){
      setFetchingIdx(null);
      if(!r) { showToast("找不到 "+s.code.trim(), "error"); return; }
      var fields={};
      if(r.name) fields.name=r.name;
      if(r.price) fields.price=r.price;
      if(isM) updMMulti(idx,fields); else updCMulti(idx,fields);
      setUpdAt(new Date().toLocaleTimeString("zh-TW",{hour:"2-digit",minute:"2-digit"}));
      showToast((r.name||s.code.trim())+" 已帶入", "success");
    }).catch(function(){
      setFetchingIdx(null);
      showToast("查詢失敗，請稍後再試", "error");
    });
  }
  function fetchAll(){
    setFetchingAll(true);
    var cItems=cashStocks.map(function(s,i){return Object.assign({},s,{_i:i,_m:false});}).filter(function(s){return !!s.code;});
    var mItems=marginStocks.map(function(s,i){return Object.assign({},s,{_i:i,_m:true});}).filter(function(s){return !!s.code;});
    var all=cItems.concat(mItems);
    Promise.all(all.map(function(s){return fetchByCode(s.code);})).then(function(results){
      setCashStocks(function(p){var u=p.slice();all.forEach(function(s,ri){if(!s._m&&results[ri]){var n=Object.assign({},u[s._i]);n.price=results[ri].price;n.name=results[ri].name||u[s._i].name;u[s._i]=recC(n);}});return u;});
      setMarginStocks(function(p){var u=p.slice();all.forEach(function(s,ri){if(s._m&&results[ri]){var n=Object.assign({},u[s._i]);n.price=results[ri].price;n.name=results[ri].name||u[s._i].name;u[s._i]=recM(n);}});return u;});
      setFetchingAll(false);
      setUpdAt(new Date().toLocaleTimeString("zh-TW",{hour:"2-digit",minute:"2-digit"}));
    }).catch(function(){setFetchingAll(false);});
  }

  var cashTotal=useMemo(function(){return cashStocks.reduce(function(s,x){return s+x.marketValue;},0);},[cashStocks]);
  var marginTotal=useMemo(function(){return marginStocks.reduce(function(s,x){return s+x.marketValue;},0);},[marginStocks]);
  var marginNetTotal=useMemo(function(){return marginStocks.reduce(function(s,x){return s+(x.netValue||0);},0);},[marginStocks]);

  function handleSave(){
    var all=cashStocks.filter(function(s){return s.code||s.name;}).concat(marginStocks.filter(function(s){return s.code||s.name;}));
    onSave({twStocks:all,twStocksTotal:cashTotal+marginTotal});
  }

  var cashFiltered=cashStocks.filter(function(s){return s.code||s.name;});
  var marginFiltered=marginStocks.filter(function(s){return s.code||s.name;});

  return (
    <Shell title="台股持倉" sub={"市值合計：$"+numFmt(cashTotal+marginTotal)} onSave={handleSave}>
      <Card style={{background:t.primary+"12",border:"1px solid "+t.primary+"33",marginBottom:4}}>
        <div style={{padding:"10px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
          <p style={{fontSize:12,color:t.muted,margin:0}}>{updAt?"名稱更新："+updAt:"輸入代號後離開欄位自動帶入名稱"}</p>
          <div style={{display:"flex",gap:6}}>
            <Btn onClick={fetchAll} disabled={fetchingAll} size="sm"><RefreshCw size={13}/>{fetchingAll?"查詢中…":"全部帶入"}</Btn>
          </div>
        </div>
      </Card>
      <div style={{display:"flex",background:t.surface,borderRadius:10,padding:4,marginBottom:12}}>
        {[["cash","現股（"+cashFiltered.length+"）"],["margin","融資（"+marginFiltered.length+"）"]].map(function(it){
          var v=it[0]; var l=it[1];
          return <button key={v} onClick={function(){setTab(v);}} style={{flex:1,padding:"7px 0",border:"none",borderRadius:7,background:tab===v?t.primary:"transparent",color:tab===v?"#fff":t.muted,cursor:"pointer",fontSize:13,fontWeight:500}}>{l}</button>;
        })}
      </div>
      {tab==="cash"&&(
        <div>
          <p style={{fontSize:12,color:t.muted,marginBottom:10}}>{"現股市值：$"+numFmt(cashTotal)+"（整張＋零股）"}</p>
          {cashStocks.map(function(s,i){
            var isFetching=fetchingIdx&&!fetchingIdx.isM&&fetchingIdx.idx===i;
            return <StockRow key={s._id||("c"+i)} s={s} i={i} isM={false} t={t} isFetching={isFetching}
              onCodeChange={function(e){updC(i,"code",e.target.value);}}
              onNameChange={function(e){updC(i,"name",e.target.value);}}
              onCodeBlur={function(){onCodeBlur(false,i);}}
              onNameBlur={function(){onNameBlur(false,i);}}
              onFieldChange={function(f,v){updC(i,f,v);}}
              onFetch={function(){fetchSingle(false,i);}}
              onDelete={function(){setCashStocks(function(p){return p.filter(function(_,k){return k!==i;});});}}/>;
          })}
          <Btn variant="outline" onClick={function(){setCashStocks(function(p){return [emptyC()].concat(p);});}} style={{width:"100%",justifyContent:"center",borderStyle:"dashed"}}><Plus size={13}/>新增現股</Btn>
        </div>
      )}
      {tab==="margin"&&(
        <div>
          <div style={{display:"flex",gap:12,marginBottom:10,flexWrap:"wrap"}}>
            <p style={{fontSize:12,color:t.muted,margin:0}}>{"融資市值：$"+numFmt(marginTotal)}</p>
            <p style={{fontSize:12,color:t.success,margin:0}}>{"淨值：$"+numFmt(marginNetTotal)}</p>
          </div>
          {marginStocks.map(function(s,i){
            var isFetching=fetchingIdx&&fetchingIdx.isM&&fetchingIdx.idx===i;
            return <StockRow key={s._id||("m"+i)} s={s} i={i} isM={true} t={t} isFetching={isFetching}
              onCodeChange={function(e){updM(i,"code",e.target.value);}}
              onNameChange={function(e){updM(i,"name",e.target.value);}}
              onCodeBlur={function(){onCodeBlur(true,i);}}
              onNameBlur={function(){onNameBlur(true,i);}}
              onFieldChange={function(f,v){updM(i,f,v);}}
              onFetch={function(){fetchSingle(true,i);}}
              onDelete={function(){setMarginStocks(function(p){return p.filter(function(_,k){return k!==i;});});}}/>;
          })}
          <Btn variant="outline" onClick={function(){setMarginStocks(function(p){return [emptyM()].concat(p);});}} style={{width:"100%",justifyContent:"center",borderStyle:"dashed"}}><Plus size={13}/>新增融資</Btn>
        </div>
      )}
    </Shell>
  );
}

// ── 美股 ────────────────────────────────────────────────────────────────────────
function UsStocksPage(props) {
  var snapshot = props.snapshot; var onSave = props.onSave;
  var t = useTheme();
  var defUs = {totalValue:0,marginAmount:0,inTransit:0};
  var s1 = useState(defUs); var d = s1[0]; var setD = s1[1];
  useEffect(function(){
    if(snapshot && snapshot.usStocks) {
      setD({
        totalValue:   snapshot.usStocks.totalValue||0,
        marginAmount: snapshot.usStocks.marginAmount||0,
        inTransit:    snapshot.usStocks.inTransit||0
      });
    }
  },[snapshot]);
  function upd(f,v){setD(function(p){var u=Object.assign({},p);u[f]=v;return u;});}
  var grandTotal = d.totalValue + d.marginAmount + d.inTransit;
  return (
    <Shell title="美股" sub={"合計：$"+numFmt(grandTotal)} onSave={function(){
      var existing = (snapshot && snapshot.usStocks) || {};
      onSave({usStocks:Object.assign({},existing,d), usStocksTotal:grandTotal});
    }}>
      <Card>
        <div style={{padding:"14px 14px 12px"}}>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <Inp label="股票總值" type="number" value={d.totalValue||""} onChange={function(e){upd("totalValue",+e.target.value);}}/>
            <Inp label="圈存金額" type="number" value={d.marginAmount||""} onChange={function(e){upd("marginAmount",+e.target.value);}}/>
            <Inp label="在途款" type="number" value={d.inTransit||""} onChange={function(e){upd("inTransit",+e.target.value);}}/>
          </div>
          <div style={{marginTop:12,paddingTop:10,borderTop:"1px solid "+t.border,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:13,color:t.muted}}>合計（股票＋圈存＋在途）</span>
            <span style={{fontSize:16,fontWeight:600,color:t.primary,fontFamily:"monospace"}}>{"$"+numFmt(grandTotal)}</span>
          </div>
        </div>
      </Card>
    </Shell>
  );
}

// ── 一戶通 ────────────────────────────────────────────────────────────────────
function UsAccountPage(props) {
  var snapshot = props.snapshot; var onSave = props.onSave;
  var t = useTheme();
  var defAcc = {brokerageBalance:0,tomorrowSettlement:0,dayAfterSettlement:0,actualBalance:0};
  var s1 = useState(defAcc); var d = s1[0]; var setD = s1[1];
  useEffect(function(){
    if(snapshot && snapshot.usStocks) {
      var u = snapshot.usStocks;
      var b=u.brokerageBalance||0; var t1=u.tomorrowSettlement||0; var t2=u.dayAfterSettlement||0;
      setD({brokerageBalance:b,tomorrowSettlement:t1,dayAfterSettlement:t2,actualBalance:b+t1+t2});
    }
  },[snapshot]);
  function upd(f,v){setD(function(p){var u=Object.assign({},p);u[f]=v;u.actualBalance=u.brokerageBalance+u.tomorrowSettlement+u.dayAfterSettlement;return u;});}
  return (
    <Shell title="一戶通" sub={"實際餘額：$"+numFmt(d.actualBalance)} onSave={function(){
      var existing = (snapshot && snapshot.usStocks) || {};
      onSave({usStocks:Object.assign({},existing,d),usAccountTotal:d.actualBalance});
    }}>
      <Card>
        <div style={{padding:"14px 14px 12px"}}>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <Inp label="一戶通餘額" type="number" value={d.brokerageBalance||""} onChange={function(e){upd("brokerageBalance",+e.target.value);}}/>
            <Inp label="明天交割款" type="number" value={d.tomorrowSettlement||""} onChange={function(e){upd("tomorrowSettlement",+e.target.value);}}/>
            <Inp label="後天交割款" type="number" value={d.dayAfterSettlement||""} onChange={function(e){upd("dayAfterSettlement",+e.target.value);}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:12,paddingTop:10,borderTop:"1px solid "+t.border}}>
            <span style={{fontSize:13,color:t.muted}}>實際餘額（自動計算）</span>
            <span style={{fontSize:16,fontWeight:600,color:t.primary,fontFamily:"monospace"}}>{"$"+numFmt(d.actualBalance)}</span>
          </div>
        </div>
      </Card>
    </Shell>
  );
}

// ── 黃金報價（移到頂層避免 Babel 巢狀 async 問題）─────────────────────────────
async function fetchGoldPrice(setFs, setPpq, setFt) {
  setFs("loading");
  try {
    var proxy = "https://api.allorigins.win/get?url="+encodeURIComponent("https://www.gck99.com.tw/gold.php");
    var r = await fetch(proxy);
    var j = await r.json();
    var html = j.contents;
    var dateRe = /20[0-9][0-9]-[0-9]{2}-[0-9]{2}/;
    var dm = dateRe.exec(html);
    if (dm) {
      var afterDate = html.slice(dm.index + 10, dm.index + 200);
      var numRe = /[0-9]{4,6}/g;
      var nums = [];
      var nm = numRe.exec(afterDate);
      while(nm !== null && nums.length < 6) {
        nums.push(parseInt(nm[0], 10));
        nm = numRe.exec(afterDate);
      }
      if (nums.length >= 3) {
        var buy = nums[2];
        if (buy > 3000 && buy < 99999) {
          setPpq(buy);
          setFs("ok");
          setFt(new Date().toLocaleTimeString("zh-TW",{hour:"2-digit",minute:"2-digit"}));
          return;
        }
      }
    }
    throw new Error("parse");
  } catch(e) { setFs("error"); }
}

// ── 黃金 ────────────────────────────────────────────────────────────────────────
var QIAN_PER_GRAM = 1/3.75;
function GoldPage(props) {
  var snapshot = props.snapshot; var onSave = props.onSave;
  var t = useTheme();
  var s1 = useState([{_id:"g0",name:"",principal:0,unit:0,unitType:"qian"}]); var items = s1[0]; var setItems = s1[1];
  var s2 = useState(15230); var ppq = s2[0]; var setPpq = s2[1];
  var s3 = useState("idle"); var fs = s3[0]; var setFs = s3[1];
  var s4 = useState(""); var ft = s4[0]; var setFt = s4[1];

  useEffect(function(){
    if (snapshot && snapshot.gold && snapshot.gold.length)
      setItems(snapshot.gold.map(function(x,xi){return Object.assign({_id:x._id||("g"+xi),unitType:"qian"},x);}));
    if (snapshot && snapshot.goldPpq) setPpq(snapshot.goldPpq);
  },[snapshot]);



  function upd(i,f,v){setItems(function(p){var u=p.slice();var n=Object.assign({},u[i]);n[f]=v;u[i]=n;return u;});}
  function toQ(it){return it.unitType==="gram" ? it.unit*QIAN_PER_GRAM : it.unit;}
  var goldTotal = useMemo(function(){return items.reduce(function(s,x){return s+toQ(x)*ppq;},0);},[items,ppq]);
  var scMap = {idle:t.muted,loading:t.primary,ok:t.success,error:t.danger};
  var stMap = {idle:"點擊抓取即時牌價 (展寬黃金)",loading:"抓取中...",ok:"更新："+ft+" 展寬黃金買進牌價",error:"抓取失敗，可手動輸入"};

  return (
    <Shell title="黃金" sub={"黃金總市值：$"+numFmt(goldTotal)} onSave={function(){onSave({gold:items.filter(function(x){return !!x.name;}),goldTotal:goldTotal,goldPpq:ppq});}}>
      <Card style={{marginBottom:4}}>
        <div style={{padding:"13px 13px 11px"}}>
          <div style={{display:"flex",alignItems:"flex-end",gap:10}}>
            <div style={{flex:1}}><Inp label="買進牌價 (每錢 TWD)" type="number" value={ppq||""} onChange={function(e){setPpq(+e.target.value);setFs("idle");}}/></div>
            <Btn onClick={function(){fetchGoldPrice(setFs,setPpq,setFt);}} disabled={fs==="loading"} size="sm" style={{marginBottom:1}}><RefreshCw size={13}/>{fs==="loading"?"抓取中...":"即時報價"}</Btn>
          </div>
          <p style={{fontSize:11,color:scMap[fs],margin:"6px 0 0"}}>{stMap[fs]}</p>
        </div>
      </Card>
      {items.map(function(it,i){
        var mv = toQ(it)*ppq;
        return (
          <Card key={it._id||i} style={{marginBottom:10}}>
            <div style={{padding:"13px 13px 11px"}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                <Inp label="品項名稱" value={it.name} onChange={function(e){upd(i,"name",e.target.value);}} placeholder="如 金豆"/>
                <Inp label="成本" type="number" value={it.principal||""} onChange={function(e){upd(i,"principal",+e.target.value);}}/>
              </div>
              <div style={{display:"flex",gap:10,alignItems:"flex-end"}}>
                <div style={{flex:1}}>
                  <Inp label={it.unitType==="gram"?"數量 (公克)":"數量 (錢)"} type="number" value={it.unit||""} onChange={function(e){upd(i,"unit",+e.target.value);}} step="0.001"/>
                </div>
                <div style={{display:"flex",background:t.surface,borderRadius:8,border:"1px solid "+t.border,overflow:"hidden",marginBottom:1}}>
                  {["qian","gram"].map(function(tp){
                    return <button key={tp} onClick={function(){upd(i,"unitType",tp);}} style={{padding:"7px 11px",border:"none",cursor:"pointer",fontSize:12,fontWeight:500,background:it.unitType===tp?t.primary:"transparent",color:it.unitType===tp?"#fff":t.muted}}>{tp==="qian"?"錢":"克"}</button>;
                  })}
                </div>
              </div>
              {it.unit>0 && <p style={{fontSize:11,color:t.muted,margin:"5px 0 0"}}>{it.unitType==="gram"?"≈ "+(it.unit*QIAN_PER_GRAM).toFixed(4)+" 錢":"≈ "+(it.unit*3.75).toFixed(3)+" 公克"}</p>}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10,paddingTop:10,borderTop:"1px solid "+t.border}}>
                <span style={{fontSize:12,color:t.muted}}>市值：<b style={{color:t.text,fontFamily:"monospace"}}>{"$"+numFmt(mv)}</b></span>
                <Btn variant="danger" size="sm" onClick={function(){setItems(function(p){return p.filter(function(_,k){return k!==i;});});}}><Trash2 size={13}/></Btn>
              </div>
            </div>
          </Card>
        );
      })}
      <Btn variant="outline" onClick={function(){setItems(function(p){return [{_id:"g"+Date.now(),name:"",principal:0,unit:0,unitType:"qian"}].concat(p);});}} style={{width:"100%",justifyContent:"center",borderStyle:"dashed"}}><Plus size={13}/>新增黃金品項</Btn>
      {items.filter(function(x){return !!x.name;}).length>0&&(
        <Card style={{marginTop:4}}>
          <div style={{padding:"12px 14px"}}>
            {(function(){
              var totalCost=items.reduce(function(s,x){return s+(x.principal||0);},0);
              var diff=goldTotal-totalCost;
              return (
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:13,color:t.muted}}>總成本 ${numFmt(totalCost)}　市值 ${numFmt(goldTotal)}</span>
                  <span style={{fontSize:14,fontWeight:600,fontFamily:"monospace",color:diff>=0?t.success:t.danger}}>
                    {diff>=0?"+":""}{numFmt(diff)}
                  </span>
                </div>
              );
            })()}
          </div>
        </Card>
      )}
    </Shell>
  );
}

// ── 銀行存款 ──────────────────────────────────────────────────────────────────────
function BanksPage(props) {
  var snapshot = props.snapshot; var onSave = props.onSave;
  var t = useTheme();
  var emptyB = function(){return {_id:"b"+Date.now()+Math.random(),bankName:"",deposit:0,settlement:0,foreignCurrency:0,digitalAccount:0,unbilled:0};};
  var s1 = useState([emptyB()]); var banks = s1[0]; var setBanks = s1[1];
  useEffect(function(){if(snapshot && snapshot.banks && snapshot.banks.length) setBanks(snapshot.banks.map(function(b,bi){return Object.assign({_id:b._id||("b"+bi)},b);}));},[snapshot]);
  function upd(i,f,v){setBanks(function(p){var u=p.slice();var n=Object.assign({},u[i]);n[f]=v;u[i]=n;return u;});}
  var banksTotal = useMemo(function(){return banks.reduce(function(s,b){return s+b.deposit+b.settlement+b.foreignCurrency+b.digitalAccount+(b.unbilled||0);},0);},[banks]);
  return (
    <Shell title="銀行存款" sub={"銀行總額：$"+numFmt(banksTotal)} onSave={function(){onSave({banks:banks.filter(function(b){return !!b.bankName;}),banksTotal:banksTotal});}}>
      {banks.map(function(b,i){
        return (
          <Card key={b._id||i} style={{marginBottom:10}}>
            <div style={{padding:"13px 13px 11px"}}>
              <div style={{marginBottom:10}}><Inp label="銀行名稱" value={b.bankName} onChange={function(e){upd(i,"bankName",e.target.value);}} placeholder="如 中信銀行"/></div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <Inp label="存款戶" type="number" value={b.deposit||""} onChange={function(e){upd(i,"deposit",+e.target.value);}}/>
                <Inp label="交割戶" type="number" value={b.settlement||""} onChange={function(e){upd(i,"settlement",+e.target.value);}}/>
                <Inp label="外幣戶" type="number" value={b.foreignCurrency||""} onChange={function(e){upd(i,"foreignCurrency",+e.target.value);}}/>
                <Inp label="數位帳號" type="number" value={b.digitalAccount||""} onChange={function(e){upd(i,"digitalAccount",+e.target.value);}}/>
                <div style={{gridColumn:"1/-1"}}><Inp label="未出帳" type="number" value={b.unbilled||""} onChange={function(e){upd(i,"unbilled",+e.target.value);}}/></div>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10,paddingTop:10,borderTop:"1px solid "+t.border}}>
                <span style={{fontSize:12,color:t.muted}}>小計：<b style={{color:t.text,fontFamily:"monospace"}}>{"$"+numFmt(b.deposit+b.settlement+b.foreignCurrency+b.digitalAccount+(b.unbilled||0))}</b></span>
                <Btn variant="danger" size="sm" onClick={function(){setBanks(function(p){return p.filter(function(_,k){return k!==i;});});}}><Trash2 size={13}/></Btn>
              </div>
            </div>
          </Card>
        );
      })}
      <Btn variant="outline" onClick={function(){setBanks(function(p){return [emptyB()].concat(p);});}} style={{width:"100%",justifyContent:"center",borderStyle:"dashed"}}><Plus size={13}/>新增銀行</Btn>
    </Shell>
  );
}

// ── 現金 ──────────────────────────────────────────────────────────────────────
function CashPage(props) {
  var snapshot = props.snapshot; var onSave = props.onSave;
  var t = useTheme();
  var s1 = useState({cash:0,privateMoney:0}); var d = s1[0]; var setD = s1[1];
  useEffect(function(){if(snapshot && snapshot.cash) setD(snapshot.cash);},[snapshot]);
  var total = d.cash+d.privateMoney;
  return (
    <Shell title="現金" sub={"現金總額：$"+numFmt(total)} onSave={function(){onSave({cash:d,cashTotal:total});}}>
      <Card>
        <div style={{padding:"14px 14px 12px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Inp label="現金" type="number" value={d.cash||""} onChange={function(e){setD(function(p){return Object.assign({},p,{cash:+e.target.value});});}}/>
            <Inp label="私房錢" type="number" value={d.privateMoney||""} onChange={function(e){setD(function(p){return Object.assign({},p,{privateMoney:+e.target.value});});}}/>
          </div>
        </div>
      </Card>
    </Shell>
  );
}

// ── 高利貸 ────────────────────────────────────────────────────────────────────
function LoansPage(props) {
  var snapshot = props.snapshot; var onSave = props.onSave;
  var t = useTheme();
  var s1 = useState([{_id:"l0",borrowerName:"",amount:0}]); var loans = s1[0]; var setLoans = s1[1];
  useEffect(function(){if(snapshot && snapshot.loans && snapshot.loans.length) setLoans(snapshot.loans.map(function(l,li){return Object.assign({_id:l._id||("l"+li)},l);}));},[snapshot]);
  function upd(i,f,v){setLoans(function(p){var u=p.slice();var n=Object.assign({},u[i]);n[f]=v;u[i]=n;return u;});}
  var loansTotal = useMemo(function(){return loans.reduce(function(s,l){return s+l.amount;},0);},[loans]);
  return (
    <Shell title="高利貸" sub={"高利貸總額：$"+numFmt(loansTotal)} onSave={function(){onSave({loans:loans.filter(function(l){return !!l.borrowerName;}),loansTotal:loansTotal});}}>
      {loans.map(function(l,i){
        return (
          <Card key={l._id||i} style={{marginBottom:10}}>
            <div style={{padding:"13px 13px 11px"}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <Inp label="借款人" value={l.borrowerName} onChange={function(e){upd(i,"borrowerName",e.target.value);}} placeholder="姓名或代稱"/>
                <Inp label="金額" type="number" value={l.amount||""} onChange={function(e){upd(i,"amount",+e.target.value);}}/>
              </div>
              <div style={{display:"flex",justifyContent:"flex-end",marginTop:10,paddingTop:10,borderTop:"1px solid "+t.border}}>
                <Btn variant="danger" size="sm" onClick={function(){setLoans(function(p){return p.filter(function(_,k){return k!==i;});});}}><Trash2 size={13}/></Btn>
              </div>
            </div>
          </Card>
        );
      })}
      <Btn variant="outline" onClick={function(){setLoans(function(p){return [{_id:"l"+Date.now(),borrowerName:"",amount:0}].concat(p);});}} style={{width:"100%",justifyContent:"center",borderStyle:"dashed"}}><Plus size={13}/>新增借款人</Btn>
    </Shell>
  );
}

// ── 自訂類別 ──────────────────────────────────────────────────────────────────
function CustomCatPage(props) {
  var cat = props.cat; var snapshot = props.snapshot; var onSave = props.onSave;
  var t = useTheme();
  function emptyItem(){return {id:""+Date.now()+Math.random(),name:"",cost:0,currentValue:0,note:""};}
  var s1 = useState([emptyItem()]); var items = s1[0]; var setItems = s1[1];
  useEffect(function(){
    var sc = snapshot && snapshot.customCats && snapshot.customCats[cat.id];
    if (sc && sc.items && sc.items.length) setItems(sc.items);
  },[snapshot,cat.id]);
  function upd(i,f,v){setItems(function(p){var u=p.slice();var n=Object.assign({},u[i]);n[f]=v;u[i]=n;return u;});}
  var total = useMemo(function(){return items.reduce(function(s,x){return s+(x.currentValue||0);},0);},[items]);
  function handleSave(){
    var cats = Object.assign({}, snapshot && snapshot.customCats || {});
    cats[cat.id] = Object.assign({},cat,{items:items});
    onSave({customCats:cats});
  }
  return (
    <Shell title={cat.label} sub={"總現值：$"+numFmt(total)} onSave={handleSave}>
      {items.map(function(it,i){
        return (
          <Card key={it.id||i} style={{marginBottom:10}}>
            <div style={{padding:"13px 13px 11px"}}>
              <div style={{marginBottom:10}}><Inp label="項目名稱" value={it.name} onChange={function(e){upd(i,"name",e.target.value);}} placeholder="項目描述"/></div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                <Inp label="成本" type="number" value={it.cost||""} onChange={function(e){upd(i,"cost",+e.target.value);}}/>
                <Inp label="現值" type="number" value={it.currentValue||""} onChange={function(e){upd(i,"currentValue",+e.target.value);}}/>
              </div>
              <Inp label="備註" value={it.note||""} onChange={function(e){upd(i,"note",e.target.value);}} placeholder="選填"/>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10,paddingTop:10,borderTop:"1px solid "+t.border}}>
                {it.cost>0 && <span style={{fontSize:12,color:t.muted}}>損益：<b style={{color:it.currentValue>=it.cost?t.success:t.danger,fontFamily:"monospace"}}>{(it.currentValue>=it.cost?"+":"")+numFmt(it.currentValue-it.cost)}</b></span>}
                <div style={{marginLeft:"auto"}}><Btn variant="danger" size="sm" onClick={function(){setItems(function(p){return p.filter(function(_,k){return k!==i;});});}}><Trash2 size={13}/></Btn></div>
              </div>
            </div>
          </Card>
        );
      })}
      <Btn variant="outline" onClick={function(){setItems(function(p){return [emptyItem()].concat(p);});}} style={{width:"100%",justifyContent:"center",borderStyle:"dashed"}}><Plus size={13}/>新增項目</Btn>
    </Shell>
  );
}

// ── 分佈圖 ────────────────────────────────────────────────────────────────────
function PieChartPage(props) {
  var snapshot = props.snapshot; var history = props.history; var customCats = props.customCats;
  var themePreset = props.themePreset;
  var t = useTheme();
  var total = snapshot ? (Number(snapshot.totalAssets)||0) : 0;

  var allCats = BUILT_IN.map(function(c){return {key:c.key,label:c.label,color:getBuiltInColor(c.key,themePreset)};}).concat(
    (customCats||[]).map(function(c){return {key:"custom_"+c.id,label:c.label,color:c.color||"#7c9ef0"};})
  );

  function getVal(key) {
    if (key.indexOf("custom_")===0) {
      var id = key.replace("custom_","");
      var cc = (customCats||[]).find(function(c){return c.id===id;});
      if (!cc || !cc.items) return 0;
      return cc.items.reduce(function(s,i){return s+(i.currentValue||0);},0);
    }
    return snapshot ? (Number(snapshot[key])||0) : 0;
  }

  var chartData = allCats.map(function(c){return {name:c.label,value:getVal(c.key),color:c.color};}).filter(function(d){return d.value>0;});
  var histData  = useMemo(function(){
    var sorted = history.slice().sort(function(a,b){return a.snapshotDate<b.snapshotDate?-1:1;});
    return sorted.slice(-30).map(function(h){return {date:h.snapshotDate.slice(5),total:h.totalAssets};});
  },[history]);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div>
        <h1 style={{fontSize:22,fontWeight:700,color:t.text,margin:0}}>資產分佈</h1>
        <p style={{fontSize:13,color:t.muted,marginTop:4}}>{"總資產：$"+numFmt(total)}</p>
      </div>
      {chartData.length>0 && (
        <Card>
          <div style={{padding:"16px 16px 8px"}}>
            <p style={{fontSize:13,fontWeight:600,color:t.text,marginBottom:12}}>資產類別佔比</p>
            <div style={{height:300}}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value"
                    label={function(p){return p.name+" "+(p.percent*100).toFixed(1)+"%";}} labelLine={{strokeWidth:1}}>
                    {chartData.map(function(e,i){return <Cell key={i} fill={e.color} stroke="transparent"/>;}) }
                  </Pie>
                  <Tooltip formatter={function(v){return ["$"+numFmt(v),"金額"];}} contentStyle={{background:t.card,border:"1px solid "+t.border,borderRadius:8,color:t.text,fontSize:12}}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      )}
      {histData.length>=2 && (
        <Card>
          <div style={{padding:"16px 16px 8px"}}>
            <p style={{fontSize:13,fontWeight:600,color:t.text,marginBottom:12}}>總資產趨勢 (近30天)</p>
            <div style={{height:200}}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={histData} margin={{top:5,right:16,left:0,bottom:5}}>
                  <CartesianGrid strokeDasharray="3 3" stroke={t.border}/>
                  <XAxis dataKey="date" tick={{fontSize:10,fill:t.muted}} interval="preserveStartEnd"/>
                  <YAxis tick={{fontSize:10,fill:t.muted}} tickFormatter={function(v){return (v/10000).toFixed(0)+"萬";}} width={46}/>
                  <Tooltip formatter={function(v){return "$"+numFmt(v);}} contentStyle={{background:t.card,border:"1px solid "+t.border,borderRadius:8,color:t.text,fontSize:12}} labelStyle={{color:t.muted}}/>
                  <Line type="monotone" dataKey="total" stroke={t.primary} strokeWidth={2} dot={{r:3,fill:t.primary}} name="總資產"/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      )}
      {chartData.length>0 && (
        <Card>
          <div style={{padding:"16px 16px 8px"}}>
            <p style={{fontSize:13,fontWeight:600,color:t.text,marginBottom:8}}>各類別明細</p>
            {allCats.map(function(cat,i){
              var val = getVal(cat.key);
              var pct = total>0 ? ((val/total)*100).toFixed(1) : "0.0";
              return (
                <div key={cat.key} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 8px",borderBottom:i<allCats.length-1?"1px solid "+t.border+"40":"none"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:10,height:10,borderRadius:"50%",background:cat.color,flexShrink:0}}/>
                    <span style={{fontSize:13,color:t.text}}>{cat.label}</span>
                  </div>
                  <div style={{display:"flex",gap:14}}>
                    <span style={{fontSize:13,fontFamily:"monospace",color:t.text}}>{"$"+numFmt(val)}</span>
                    <span style={{fontSize:12,color:t.muted,width:44,textAlign:"right"}}>{pct+"%"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}

// ── 歷史記錄 ──────────────────────────────────────────────────────────────────
function HistoryPage(props) {
  var history = props.history; var allCats = props.allCats;
  var t = useTheme();
  var s1 = useState(""); var selA = s1[0]; var setSelA = s1[1];
  var s2 = useState(""); var selB = s2[0]; var setSelB = s2[1];
  var snapA = history.find(function(h){return h.snapshotDate===selA;});
  var snapB = history.find(function(h){return h.snapshotDate===selB;});

  function getVal(snap,key) {
    if (!snap) return 0;
    if (key.indexOf("custom_")===0) {
      var id = key.replace("custom_","");
      var sc = snap.customCats && snap.customCats[id];
      if (!sc || !sc.items) return 0;
      return sc.items.reduce(function(s,i){return s+(i.currentValue||0);},0);
    }
    return Number(snap[key])||0;
  }

  function SelBox(selProps) {
    return (
      <div>
        <label style={{fontSize:12,color:t.muted,display:"block",marginBottom:4}}>{selProps.label}</label>
        <select value={selProps.val} onChange={function(e){selProps.onChange(e.target.value);}} style={{width:"100%",background:t.surface,border:"1px solid "+t.border,borderRadius:8,padding:"7px 10px",color:t.text,fontSize:13}}>
          <option value="">選擇日期</option>
          {history.map(function(h){return <option key={h.snapshotDate} value={h.snapshotDate}>{h.snapshotDate}</option>;})}
        </select>
      </div>
    );
  }

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div>
        <h1 style={{fontSize:22,fontWeight:700,color:t.text,margin:0}}>歷史記錄</h1>
        <p style={{fontSize:13,color:t.muted,marginTop:4}}>{"共 "+history.length+" 筆快照"}</p>
      </div>
      {history.length>=2 && (
        <Card>
          <div style={{padding:"14px 14px 12px"}}>
            <p style={{fontSize:13,fontWeight:600,color:t.text,marginBottom:12}}>日期對比</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
              <SelBox val={selA} onChange={setSelA} label="日期 A"/>
              <SelBox val={selB} onChange={setSelB} label="日期 B"/>
            </div>
            {snapA && snapB && (
              <div style={{borderTop:"1px solid "+t.border,paddingTop:12}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
                  {[{s:snapA,d:selA},{s:snapB,d:selB}].map(function(it,ii){
                    return <div key={ii} style={{background:t.surface,borderRadius:8,padding:"10px 12px"}}><p style={{fontSize:11,color:t.muted,margin:"0 0 4px"}}>{it.d}</p><p style={{fontSize:16,fontWeight:600,color:t.text,margin:0,fontFamily:"monospace"}}>{"$"+numFmt(it.s.totalAssets)}</p></div>;
                  })}
                </div>
                <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid "+t.border,marginBottom:4}}>
                  <span style={{fontSize:13,fontWeight:600,color:t.text}}>總資產差異</span>
                  <span style={{fontSize:13,fontFamily:"monospace",fontWeight:600,color:(snapA.totalAssets-snapB.totalAssets)>=0?t.success:t.danger}}>{((snapA.totalAssets-snapB.totalAssets)>=0?"+":"")+numFmt(snapA.totalAssets-snapB.totalAssets)}</span>
                </div>
                {allCats.map(function(cat){
                  var va=getVal(snapA,cat.key); var vb=getVal(snapB,cat.key); var diff=va-vb;
                  return (
                    <div key={cat.key} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:"1px solid "+t.border+"30"}}>
                      <span style={{fontSize:12,color:t.muted}}>{cat.label}</span>
                      <div style={{display:"flex",gap:12}}>
                        <span style={{fontSize:12,fontFamily:"monospace",color:t.text}}>{"$"+numFmt(va)}</span>
                        <span style={{fontSize:12,fontFamily:"monospace",color:diff>0?t.success:diff<0?t.danger:t.muted}}>{(diff>0?"+":"")+numFmt(diff)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Card>
      )}
      <Card>
        <div style={{padding:"14px 14px 8px"}}>
          <p style={{fontSize:13,fontWeight:600,color:t.text,marginBottom:10}}>所有快照</p>
          {history.length===0 && <p style={{color:t.muted,fontSize:13,textAlign:"center",padding:"20px 0"}}>尚無歷史記錄</p>}
          {history.map(function(item,idx){
            var prev = history[idx+1];
            var diff = prev ? item.totalAssets-prev.totalAssets : 0;
            return (
              <div key={item.snapshotDate} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 8px",borderBottom:idx<history.length-1?"1px solid "+t.border:"none"}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:32,height:32,borderRadius:8,background:t.primary+"18",display:"flex",alignItems:"center",justifyContent:"center"}}><Clock size={14} style={{color:t.primary}}/></div>
                  <div>
                    <p style={{fontSize:13,fontWeight:500,color:t.text,margin:0}}>{item.snapshotDate}</p>
                    <p style={{fontSize:11,color:t.muted,margin:"2px 0 0"}}>{"台股 $"+numFmt(item.twStocksTotal)+" 美股 $"+numFmt(item.usStocksTotal)}</p>
                  </div>
                </div>
                <div style={{textAlign:"right"}}>
                  <p style={{fontSize:13,fontWeight:600,color:t.text,margin:0,fontFamily:"monospace"}}>{"$"+numFmt(item.totalAssets)}</p>
                  {prev && <span style={{fontSize:11,color:diff>=0?t.success:t.danger}}>{(diff>=0?"+":"")+numFmt(diff)}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ── 設定 ──────────────────────────────────────────────────────────────────────
function SettingsPage(props) {
  var prefs = props.prefs; var setPrefs = props.setPrefs;
  var customCats = props.customCats; var setCustomCats = props.setCustomCats;
  var snapshot = props.snapshot; var onSave = props.onSave;
  var t = useTheme();

  var s1 = useState(""); var newLabel = s1[0]; var setNewLabel = s1[1];
  var s2 = useState(PALETTE[0]); var newColor = s2[0]; var setNewColor = s2[1];
  var s3 = useState(false); var pinMode = s3[0]; var setPinMode = s3[1];
  var s4 = useState(""); var newPin = s4[0]; var setNewPin = s4[1];
  var s5 = useState(""); var confPin = s5[0]; var setConfPin = s5[1];
  var s6 = useState(""); var pinErr = s6[0]; var setPinErr = s6[1];
  var s7 = useState(null); var dragIdx = s7[0]; var setDragIdx = s7[1];
  var s8 = useState(null); var overIdx = s8[0]; var setOverIdx = s8[1];

  var allKeys = BUILT_IN.map(function(c){return c.key;}).concat(
    (customCats||[]).map(function(c){return "custom_"+c.id;})
  );
  var orderedKeys = (prefs.order||[]).filter(function(k){return allKeys.indexOf(k)>=0;});
  var rest = allKeys.filter(function(k){return orderedKeys.indexOf(k)<0;});
  var fullOrder = orderedKeys.concat(rest);

  function getLabel(key) {
    var b = BUILT_IN.find(function(c){return c.key===key;}); if(b) return b.label;
    var id = key.replace("custom_","");
    var cc = (customCats||[]).find(function(c){return c.id===id;});
    return cc ? cc.label : key;
  }
  function getColor(key) {
    var b = BUILT_IN.find(function(c){return c.key===key;});
    if (b) return getBuiltInColor(key, prefs.themePreset);
    var id = key.replace("custom_","");
    var cc = (customCats||[]).find(function(c){return c.id===id;});
    return cc ? (cc.color||t.primary) : t.primary;
  }
  function reorder(from,to) {
    if(from===to) return;
    var o=fullOrder.slice(); var m=o.splice(from,1)[0]; o.splice(to,0,m);
    var np=Object.assign({},prefs,{order:o}); setPrefs(np); savePrefs(np);
  }
  function toggleHide(key) {
    var h = prefs.hidden||[];
    var nh = h.indexOf(key)>=0 ? h.filter(function(k){return k!==key;}) : h.concat([key]);
    var np=Object.assign({},prefs,{hidden:nh}); setPrefs(np); savePrefs(np);
  }
  function addCat() {
    if (!newLabel.trim()) return;
    var id = ""+Date.now();
    var nc = {id:id,label:newLabel.trim(),color:newColor,items:[]};
    var ncc = (customCats||[]).concat([nc]); setCustomCats(ncc);
    var nOrder = (prefs.order||[]).concat(["custom_"+id]);
    var np = Object.assign({},prefs,{order:nOrder}); setPrefs(np); savePrefs(np);
    var cats = Object.assign({}, snapshot && snapshot.customCats || {}); cats[id]=nc;
    onSave({customCats:cats});
    setNewLabel(""); setNewColor(PALETTE[Math.floor(Math.random()*PALETTE.length)]);
  }
  function delCat(id) {
    var ncc = (customCats||[]).filter(function(c){return c.id!==id;}); setCustomCats(ncc);
    var np = Object.assign({},prefs,{order:(prefs.order||[]).filter(function(k){return k!=="custom_"+id;}),hidden:(prefs.hidden||[]).filter(function(k){return k!=="custom_"+id;})});
    setPrefs(np); savePrefs(np);
  }
  function changePin() {
    if (newPin.length<4){setPinErr("PIN 至少 4 位");return;}
    if (newPin!==confPin){setPinErr("兩次輸入不一致");return;}
    savePin(newPin); setPinMode(false); setNewPin(""); setConfPin(""); setPinErr("");
  }

  function onSettingsTouchStart(i) { setDragIdx(i); }
  function onSettingsTouchMove(e) {
    e.preventDefault();
    var touch = e.touches[0];
    var sEls = document.querySelectorAll("[data-sidx]"); var els = []; for(var si=0;si<sEls.length;si++) els.push(sEls[si]);
    els.forEach(function(el){
      var r = el.getBoundingClientRect();
      if (touch.clientY>=r.top && touch.clientY<=r.bottom)
        setOverIdx(parseInt(el.getAttribute("data-sidx"),10));
    });
  }
  function onSettingsTouchEnd() {
    if(dragIdx!==null && overIdx!==null && dragIdx!==overIdx) reorder(dragIdx,overIdx);
    setDragIdx(null); setOverIdx(null);
  }

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <h1 style={{fontSize:22,fontWeight:700,color:t.text,margin:0}}>設定</h1>

      <Card>
        <div style={{padding:"14px 14px 8px"}}>
          <p style={{fontSize:13,fontWeight:600,color:t.text,marginBottom:4}}>總覽方塊順序 / 顯示</p>
          <p style={{fontSize:11,color:t.muted,marginBottom:12}}>拖曳調整排列，點眼睛隱藏/顯示</p>
          <div style={{touchAction:"none"}}>
            {fullOrder.map(function(key,i){
              var hidden = (prefs.hidden||[]).indexOf(key)>=0;
              return (
                <div key={key} data-sidx={i} draggable={true}
                  onDragStart={function(){setDragIdx(i);}}
                  onDragOver={function(e){e.preventDefault();setOverIdx(i);}}
                  onDrop={function(){if(dragIdx!==null&&dragIdx!==i)reorder(dragIdx,i);setDragIdx(null);setOverIdx(null);}}
                  onDragEnd={function(){setDragIdx(null);setOverIdx(null);}}
                  onTouchStart={function(){onSettingsTouchStart(i);}}
                  onTouchMove={onSettingsTouchMove}
                  onTouchEnd={onSettingsTouchEnd}
                  style={{display:"flex",alignItems:"center",gap:10,padding:"9px 8px",borderRadius:8,marginBottom:4,background:overIdx===i?t.primary+"22":"transparent",opacity:dragIdx===i?0.4:1,cursor:"grab"}}>
                  <GripVertical size={14} style={{color:t.muted,flexShrink:0}}/>
                  <div style={{width:10,height:10,borderRadius:"50%",background:getColor(key),flexShrink:0}}/>
                  <span style={{fontSize:13,color:hidden?t.muted:t.text,flex:1,textDecoration:hidden?"line-through":"none"}}>{getLabel(key)}</span>
                  <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    <button onClick={function(){toggleHide(key);}} title={hidden?"顯示在首頁":"從首頁隱藏"}
                      style={{background:hidden?t.surface:t.primary+"22",border:"1px solid "+(hidden?t.border:t.primary+"44"),borderRadius:6,color:hidden?t.muted:t.primary,cursor:"pointer",padding:"3px 7px",display:"flex",alignItems:"center",gap:3,fontSize:11}}>
                      {hidden ? <EyeOff size={12}/> : <Eye size={12}/>}
                      {hidden ? "已隱藏" : "顯示中"}
                    </button>
                    {key.indexOf("custom_")===0 && (
                      <button onClick={function(){
                        if(window.confirm("確定刪除「"+getLabel(key)+"」嗎？")) {
                          delCat(key.replace("custom_",""));
                        }
                      }} title="刪除此類別"
                        style={{background:t.danger+"18",border:"1px solid "+t.danger+"66",borderRadius:6,color:t.danger,cursor:"pointer",padding:"3px 8px",display:"flex",alignItems:"center",gap:3,fontSize:11}}>
                        <Trash2 size={12}/>刪除
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <Card>
        <div style={{padding:"14px 14px 12px"}}>
          <p style={{fontSize:13,fontWeight:600,color:t.text,marginBottom:12}}>新增自訂類別</p>
          <div style={{display:"flex",gap:10,alignItems:"flex-end",marginBottom:12}}>
            <div style={{flex:1}}><Inp label="類別名稱" value={newLabel} onChange={function(e){setNewLabel(e.target.value);}} placeholder="如 不動產、加密貨幣"/></div>
            <Btn onClick={addCat} disabled={!newLabel.trim()} style={{marginBottom:1}}><Plus size={13}/>新增</Btn>
          </div>
          <div>
            <p style={{fontSize:11,color:t.muted,marginBottom:8}}>選擇顏色</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {PALETTE.map(function(c){
                return <button key={c} onClick={function(){setNewColor(c);}} style={{width:28,height:28,borderRadius:"50%",background:c,border:newColor===c?"3px solid "+t.text:"3px solid transparent",cursor:"pointer"}}/>;
              })}
            </div>
          </div>
          {(customCats||[]).length>0 && (
            <div style={{marginTop:16,paddingTop:12,borderTop:"1px solid "+t.border}}>
              <p style={{fontSize:12,color:t.muted,marginBottom:8}}>已新增的自訂類別</p>
              {(customCats||[]).map(function(c){
                return (
                  <div key={c.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"7px 0"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:10,height:10,borderRadius:"50%",background:c.color}}/>
                      <span style={{fontSize:13,color:t.text}}>{c.label}</span>
                    </div>
                    <Btn variant="danger" size="sm" onClick={function(){delCat(c.id);}}><Trash2 size={12}/></Btn>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>

      <Card>
        <div style={{padding:"14px 14px 12px"}}>
          <p style={{fontSize:13,fontWeight:600,color:t.text,marginBottom:12}}>主題配色</p>
          {[
              ["莫蘭迪", [
                ["morandi1","米霧","#f2ede8","#a07865","#3d3530"],
                ["morandi2","藍霧","#e8ecf0","#5a7fa0","#2c3540"],
                ["morandi3","玫灰","#f0e8e8","#a06070","#3a2c2c"],
                ["morandi4","抹茶","#e8ede8","#5a8870","#2c3830"],
                ["morandi5","薰衣草","#eceaf2","#7068a8","#302c40"]
              ]],
              ["基本", [
                ["dark","深色","#0f1117","#7c9ef0","#ffffff"],
                ["light","淺色","#f5f5f5","#5c6bc0","#1a1a2e"]
              ]],
              ["彩色暗系", [
                ["candy","糖果","#1a0a2e","#c060ff","#f0e0ff"],
                ["sunset","夕陽","#1a0808","#ff7040","#ffe8d0"],
                ["teal","翡翠","#041c1c","#00d4c0","#d0f5f0"],
                ["royal","皇家","#0a0818","#8060ff","#e0d8ff"]
              ]],
              ["螢光暗系", [
                ["neon","霓虹","#050510","#00ffff","#e0e0ff"],
                ["matrix","駭客","#000800","#00ff41","#00ff41"],
                ["cyber","電馭","#080010","#ff0099","#f0e0ff"]
              ]]
            ].map(function(group){
              var groupName=group[0]; var themes=group[1];
              return (
                <div key={groupName} style={{marginBottom:12}}>
                  <p style={{fontSize:11,color:t.muted,marginBottom:6,fontWeight:600}}>{groupName}</p>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    {themes.map(function(it){
                      var isActive=(prefs.themePreset||"dark")===it[0];
                      return (
                        <button key={it[0]} onClick={function(){
                          var np=Object.assign({},prefs,{themePreset:it[0],isDark:it[0]!=="light"&&it[0].indexOf("morandi")<0});
                          props.setPrefs(np); savePrefs(np);
                        }} style={{background:it[2],border:"2px solid "+(isActive?it[3]:"#ffffff22"),borderRadius:10,padding:"8px 10px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,minWidth:52,boxShadow:isActive?"0 0 8px "+it[3]+"88":"none"}}>
                          <div style={{width:20,height:20,borderRadius:"50%",background:it[3],boxShadow:"0 0 4px "+it[3]+"66"}}/>
                          <span style={{fontSize:10,color:it[4],fontWeight:isActive?700:400,textAlign:"center",whiteSpace:"nowrap"}}>{it[1]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      </Card>

      <Card>
        <div style={{padding:"14px 14px 12px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <p style={{fontSize:13,fontWeight:600,color:t.text,margin:0}}>修改 PIN 碼</p>
            <Btn variant="outline" size="sm" onClick={function(){setPinMode(!pinMode);}}>{pinMode?"取消":"修改"}</Btn>
          </div>
          {pinMode && (
            <div style={{marginTop:12,display:"flex",flexDirection:"column",gap:10}}>
              <Inp label="新 PIN (至少 4 位)" type="password" value={newPin} onChange={function(e){setNewPin(e.target.value);}}/>
              <Inp label="確認新 PIN" type="password" value={confPin} onChange={function(e){setConfPin(e.target.value);}}/>
              {pinErr && <p style={{color:t.danger,fontSize:12,margin:0}}>{pinErr}</p>}
              <Btn onClick={changePin}><Check size={13}/>儲存 PIN</Btn>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <div style={{padding:"14px 14px 12px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div>
              <p style={{fontSize:13,fontWeight:600,color:t.text,margin:0}}>☁️ 雲端同步</p>
              {props.sbSession && <p style={{fontSize:11,color:t.success,margin:"3px 0 0"}}>{"已登入："+props.sbSession.email}</p>}
              {!props.sbSession && <p style={{fontSize:11,color:t.muted,margin:"3px 0 0"}}>未登入，資料僅存本機</p>}
            </div>
            <Btn variant="outline" size="sm" onClick={function(){props.onOpenSB();}}>
              {props.sbSession?"帳號設定":"登入 / 註冊"}
            </Btn>
          </div>
          {props.sbSession && (
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <Btn size="sm" onClick={function(){props.onSBUpload();}} style={{flex:1,justifyContent:"center"}}>⬆ 上傳到雲端</Btn>
              <Btn size="sm" variant="outline" onClick={function(){props.onSBDownload();}} style={{flex:1,justifyContent:"center"}}>⬇ 從雲端下載</Btn>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

// ── App Root ──────────────────────────────────────────────────────────────────
export default function App() {
  var s0 = useState(loadPrefs); var prefs = s0[0]; var setPrefs = s0[1];
  var theme = resolveTheme(prefs);
  var s1 = useState("home"); var route = s1[0]; var setRoute = s1[1];
  var s2 = useState(false); var unlocked = s2[0]; var setUnlocked = s2[1];
  var s3 = useState([]); var snapshots = s3[0]; var setSnapshots = s3[1];
  var s4 = useState([]); var customCats = s4[0]; var setCustomCats = s4[1];
  var s5 = useState(false); var menuOpen = s5[0]; var setMenuOpen = s5[1];
  var s6 = useState({msg:"",type:"success"}); var toast = s6[0]; var setToast = s6[1];
  var s7 = useState(loadSBSession); var sbSession = s7[0]; var setSbSession = s7[1];
  var s8 = useState(false); var showSBPanel = s8[0]; var setShowSBPanel = s8[1];

  useEffect(function(){
    var d = loadStore();
    if (d.snapshots) setSnapshots(d.snapshots);
    if (d.customCats) setCustomCats(d.customCats);
  },[]);

  function showToast(msg,type) { setToast({msg:msg,type:type||"success"}); setTimeout(function(){setToast({msg:"",type:"success"});},2500); }

  var latest = snapshots[0]||null;

  function handleSave(updates) {
    var today = new Date().toISOString().slice(0,10);
    var base = latest || {};
    var merged = Object.assign({},base,updates,{snapshotDate:today});
    var customTotal = 0;
    if (merged.customCats) {
      Object.keys(merged.customCats).forEach(function(id){
        var cat = merged.customCats[id];
        if (cat && cat.items) customTotal += cat.items.reduce(function(s,i){return s+(i.currentValue||0);},0);
      });
    }
    merged.totalAssets = (Number(merged.twStocksTotal)||0)+(Number(merged.usStocksTotal)||0)+(Number(merged.usAccountTotal)||0)+(Number(merged.goldTotal)||0)+(Number(merged.banksTotal)||0)+(Number(merged.cashTotal)||0)+(Number(merged.loansTotal)||0)+customTotal;
    var idx = -1; snapshots.forEach(function(s,si){ if(s.snapshotDate===today) idx=si; });
    var updated = idx>=0 ? snapshots.map(function(s,i){return i===idx?merged:s;}) : [merged].concat(snapshots);
    setSnapshots(updated);
    if (merged.customCats) {
      var cc = []; Object.keys(merged.customCats).forEach(function(k){ cc.push(merged.customCats[k]); }); setCustomCats(cc);
      saveStore({snapshots:updated,customCats:cc});
    } else {
      var existing = loadStore(); saveStore(Object.assign({},existing,{snapshots:updated}));
    }
    showToast("資料已儲存");
    // Auto sync to cloud if logged in (with token refresh)
    if (sbSession) {
      ensureFreshSession().then(function(sess){
        var cfg2 = loadSBConfig();
        var d2 = Object.assign({},loadStore(),{snapshots:updated});
        sbUpload(cfg2.url, cfg2.key, sess.access_token, sess.userId||"", d2).then(function(result){
          if (!result.ok) showToast("自動同步失敗","error");
        }).catch(function(){ showToast("自動同步失敗","error"); });
      });
    }
  }

  function toggleTheme() { var p=prefs.themePreset||"dark"; var next=p==="dark"?"light":"dark"; var np=Object.assign({},prefs,{themePreset:next,isDark:next!=="light"}); setPrefs(np); savePrefs(np); }

  function handleSBLogin(sess) {
    // Extract user_id from JWT token
    try {
      var payload = sess.access_token.split(".")[1];
      // pad base64
      while (payload.length % 4) payload += "=";
      var decoded = JSON.parse(atob(payload));
      sess.userId = decoded.sub || "";
    } catch(e) { sess.userId = ""; }
    setSbSession(sess); saveSBSession(sess); setShowSBPanel(false);
    showToast("登入成功！","success");
    // Auto download after login
    doSBDownload(sess);
  }
  function ensureFreshSession() {
    if (!sbSession) return Promise.resolve(null);
    var cfg = loadSBConfig();
    if (!sbSession.refresh_token) return Promise.resolve(sbSession);
    return sbRefreshToken(cfg.url, cfg.key, sbSession.refresh_token).then(function(data){
      if (data && data.access_token) {
        var newSess = Object.assign({}, sbSession, {access_token:data.access_token, refresh_token:data.refresh_token||sbSession.refresh_token});
        setSbSession(newSess); saveSBSession(newSess);
        return newSess;
      }
      return sbSession;
    }).catch(function(){ return sbSession; });
  }
  function doSBUpload() {
    if (!sbSession) return;
    ensureFreshSession().then(function(sess){
      var cfg = loadSBConfig();
      var data = loadStore();
      sbUpload(cfg.url, cfg.key, sess.access_token, sess.userId||"", data).then(function(result){
        if (result.ok) showToast("已上傳到雲端","success");
        else showToast("上傳失敗: "+(result.error||"").slice(0,50),"error");
      }).catch(function(e){ showToast("上傳失敗: "+e.message,"error"); });
    });
  }
  function doSBDownload(sess) {
    var s0 = sess || sbSession; if (!s0) return;
    ensureFreshSession().then(function(s){
    var cfg = loadSBConfig();
    sbDownload(cfg.url, cfg.key, s.access_token).then(function(row){
      if (!row) { showToast("雲端無資料","error"); return; }
      var d = row.data;
      if (d.snapshots) setSnapshots(d.snapshots);
      if (d.customCats) setCustomCats(d.customCats);
      saveStore(d);
      showToast("已從雲端下載","success");
    }).catch(function(){ showToast("下載失敗","error"); });
    });
  }
  function doSBLogout() {
    if (!sbSession) return;
    var cfg = loadSBConfig();
    sbSignOut(cfg.url, cfg.key, sbSession.access_token);
    setSbSession(null); saveSBSession(null);
    showToast("已登出","success");
  }

  var allCats = BUILT_IN.map(function(c){return {key:c.key,label:c.label,color:getBuiltInColor(c.key,prefs.themePreset),route:c.route};}).concat(
    (customCats||[]).map(function(c){return {key:"custom_"+c.id,label:c.label,color:c.color||"#7c9ef0",route:"custom_"+c.id};})
  );

  var NAV = [
    {route:"home",label:"總覽",Icon:Home},
    {route:"tw-stocks",label:"台股",Icon:TrendingUp},
    {route:"us-stocks",label:"美股",Icon:DollarSign},
    {route:"us-account",label:"一戶通",Icon:Landmark},
    {route:"gold",label:"黃金",Icon:Coins},
    {route:"banks",label:"銀行存款",Icon:Landmark},
    {route:"cash",label:"現金",Icon:Wallet},
    {route:"loans",label:"高利貸",Icon:HandCoins}
  ].concat(
    (customCats||[]).map(function(c){return {route:"custom_"+c.id,label:c.label,Icon:BarChart2,color:c.color};})
  ).concat([
    {route:"pie-chart",label:"分佈圖",Icon:BarChart2},
    {route:"history",label:"歷史記錄",Icon:Clock},
    {route:"settings",label:"設定",Icon:Settings}
  ]);

  var BOTTOM = [
    {route:"home",label:"總覽",Icon:Home},
    {route:"pie-chart",label:"分佈圖",Icon:BarChart2},
    {route:"history",label:"歷史",Icon:Clock},
    {route:"settings",label:"設定",Icon:Settings}
  ];

  function renderPage() {
    var shared = {snapshot:latest,onSave:handleSave,navigate:setRoute};
    if (route==="home") return <HomePage snapshot={latest} navigate={setRoute} prefs={prefs} setPrefs={setPrefs} customCats={customCats}/>;
    if (route==="tw-stocks") return <TwStocksPage snapshot={latest} onSave={handleSave}/>;
    if (route==="us-stocks") return <UsStocksPage snapshot={latest} onSave={handleSave}/>;
    if (route==="us-account") return <UsAccountPage snapshot={latest} onSave={handleSave}/>;
    if (route==="gold") return <GoldPage snapshot={latest} onSave={handleSave}/>;
    if (route==="banks") return <BanksPage snapshot={latest} onSave={handleSave}/>;
    if (route==="cash") return <CashPage snapshot={latest} onSave={handleSave}/>;
    if (route==="loans") return <LoansPage snapshot={latest} onSave={handleSave}/>;
    if (route==="pie-chart") return <PieChartPage snapshot={latest} history={snapshots} customCats={customCats} themePreset={prefs.themePreset}/>;
    if (route==="history") return <HistoryPage history={snapshots} allCats={allCats}/>;
    if (route==="settings") return <SettingsPage prefs={prefs} setPrefs={setPrefs} customCats={customCats} setCustomCats={setCustomCats} snapshot={latest} onSave={handleSave}
      sbSession={sbSession} onOpenSB={function(){setShowSBPanel(true);}} onSBUpload={doSBUpload} onSBDownload={function(){doSBDownload(null);}} onSBLogout={doSBLogout}/>;
    if (route.indexOf("custom_")===0) {
      var id = route.replace("custom_","");
      var cat = (customCats||[]).find(function(c){return c.id===id;});
      if (cat) return <CustomCatPage cat={cat} snapshot={latest} onSave={handleSave}/>;
    }
    return <HomePage snapshot={latest} navigate={setRoute} prefs={prefs} setPrefs={setPrefs} customCats={customCats}/>;
  }

  if (!unlocked) return (
    <ThemeCtx.Provider value={theme}>
      <PinScreen onUnlock={function(){setUnlocked(true);}} hasPin={!!loadPin()}/>
    </ThemeCtx.Provider>
  );

  return (
    <ThemeCtx.Provider value={theme}>
      <div style={{minHeight:"100vh",background:theme.bg,color:theme.text,fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"}}>
        <div style={{position:"sticky",top:0,zIndex:100,background:theme.surface+"ee",backdropFilter:"blur(12px)",borderBottom:"1px solid "+theme.border,padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <button onClick={function(){setRoute("home");}} style={{background:"none",border:"none",cursor:"pointer",fontSize:16,fontWeight:700,color:theme.primary}}>💰 資產追蹤</button>
          <div style={{display:"flex",gap:4}}>
            <button onClick={toggleTheme} style={{background:"none",border:"none",color:theme.muted,cursor:"pointer",padding:6}}>{prefs.isDark?<Sun size={18}/>:<Moon size={18}/>}</button>
            <button onClick={function(){setMenuOpen(true);}} style={{background:"none",border:"none",color:theme.muted,cursor:"pointer",padding:6}}><Menu size={18}/></button>
          </div>
        </div>

        {menuOpen && (
          <div style={{position:"fixed",inset:0,zIndex:200}}>
            <div onClick={function(){setMenuOpen(false);}} style={{position:"absolute",inset:0,background:"#00000088"}}/>
            <div style={{position:"absolute",right:0,top:0,bottom:0,width:260,background:theme.surface,borderLeft:"1px solid "+theme.border,padding:16,display:"flex",flexDirection:"column",gap:2,overflowY:"auto"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <span style={{fontSize:15,fontWeight:600,color:theme.text}}>選單</span>
                <button onClick={function(){setMenuOpen(false);}} style={{background:"none",border:"none",color:theme.muted,cursor:"pointer"}}><X size={18}/></button>
              </div>
              {NAV.map(function(n){
                var NavIcon = n.Icon;
                return (
                  <button key={n.route} onClick={function(){setRoute(n.route);setMenuOpen(false);}} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:8,background:route===n.route?theme.primary+"22":"transparent",color:route===n.route?theme.primary:theme.text,border:"none",cursor:"pointer",textAlign:"left",fontSize:14,fontWeight:route===n.route?600:400}}>
                    {n.color ? <div style={{width:8,height:8,borderRadius:"50%",background:n.color,flexShrink:0}}/> : <NavIcon size={15}/>}
                    {n.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div style={{padding:"20px 16px 90px",maxWidth:720,margin:"0 auto"}}>
          {renderPage()}
        </div>

        <div style={{position:"fixed",bottom:0,left:0,right:0,background:theme.surface+"f0",backdropFilter:"blur(12px)",borderTop:"1px solid "+theme.border,display:"flex",padding:"8px 0"}}>
          {BOTTOM.map(function(n){
            var BotIcon = n.Icon;
            var active = route===n.route;
            return (
              <button key={n.route} onClick={function(){setRoute(n.route);}} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"none",border:"none",cursor:"pointer",color:active?theme.primary:theme.muted,padding:"4px 0"}}>
                <BotIcon size={20}/>
                <span style={{fontSize:10,fontWeight:active?600:400}}>{n.label}</span>
              </button>
            );
          })}
        </div>
        {showSBPanel && <SupabasePanel onLogin={handleSBLogin} onClose={function(){setShowSBPanel(false);}}/>}
        <Toast msg={toast.msg} type={toast.type}/>
      </div>
    </ThemeCtx.Provider>
  );
}
