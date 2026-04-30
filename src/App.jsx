import { useState, useContext, createContext, useEffect } from "react";
const DummyCtx = createContext(false);
const useDummy = () => useContext(DummyCtx);

/* ═══════════════════════════════════════════════════════════
   DESIGN TOKENS — Peko v3.1
═══════════════════════════════════════════════════════════ */
const T = {
  font: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  redPrimary:    "#E83838",
  redDark:       "#C62828",
  redLight:      "#FFF0F0",
  redGrad:       "linear-gradient(135deg,#FF6B6B 0%,#E03030 60%,#C62828 100%)",
  purplePrimary: "#7C3AED",
  purpleDark:    "#5B21B6",
  purpleLight:   "#F5F3FF",
  purpleGrad:    "linear-gradient(135deg,#7C3AED,#5B21B6)",
  purpleBorder:  "#DDD6FE",
  black:         "#1A1A1A",
  grey600:       "#555555",
  grey400:       "#888888",
  grey300:       "#AAAAAA",
  grey200:       "#E0E0E0",
  grey100:       "#F0F0F0",
  grey50:        "#F7F7F7",
  white:         "#FFFFFF",
  pageBg:        "#F9F9F9",
  greenBg:       "#F0FDF4", greenText:  "#16A34A", greenBorder:  "#BBF7D0",
  amberBg:       "#FFF7ED", amberText:  "#D97706", amberBorder:  "#FED7AA",
  redErrBg:      "#FFF0F0", redErrText: "#DC2626", redErrBorder: "#FECACA",
  sidebarW: 180,
  topbarH:  56,
};

/* ═══════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════ */
const DUMMY_CURRENCIES = [
  { code:"USD", country:"United States",  balance:"142,850.00", pending:"3,200.00", flag:"🇺🇸", symbol:"$",   acct:"US29 WFBIUS6S 1234567890",    swift:"WFBIUS6S",    bank:"Wells Fargo Bank",   status:"Active",     cardBg:"linear-gradient(135deg,#EEF2FF 0%,#E0E7FF 60%,#C7D2FE 100%)", cardAccent:"#818CF8", cardText:"#3730A3", logoType:"stripes"    },
  { code:"EUR", country:"European Union", balance:"98,440.50",  pending:"1,100.00", flag:"🇪🇺", symbol:"€",   acct:"DE89 3704 0044 0532 0130 00", swift:"COBADEFFXXX", bank:"Commerzbank AG",     status:"Active",     cardBg:"linear-gradient(135deg,#EFF6FF 0%,#DBEAFE 60%,#BFDBFE 100%)", cardAccent:"#60A5FA", cardText:"#1D4ED8", logoType:"eu"         },
  { code:"GBP", country:"United Kingdom", balance:"67,320.00",  pending:"0.00",     flag:"🇬🇧", symbol:"£",   acct:"GB29 NWBK 6016 1331 9268 19", swift:"NWBKGB2L",   bank:"NatWest Bank",       status:"Active",     cardBg:"linear-gradient(135deg,#FFF1F2 0%,#FFE4E6 60%,#FECDD3 100%)", cardAccent:"#FB7185", cardText:"#BE123C", logoType:"union_jack"  },
  { code:"AUD", country:"Australia",      balance:"34,910.75",  pending:"500.00",   flag:"🇦🇺", symbol:"A$",  acct:"AU12 3456 7890 1234 5678",    swift:"ANZBAU3M",    bank:"ANZ Bank",           status:"Active",     cardBg:"linear-gradient(135deg,#F0FDF4 0%,#DCFCE7 60%,#BBF7D0 100%)", cardAccent:"#4ADE80", cardText:"#15803D", logoType:"aus"        },
  { code:"SGD", country:"Singapore",      balance:"58,640.20",  pending:"900.00",   flag:"🇸🇬", symbol:"S$",  acct:"SG12 3456 7890 1234 5",       swift:"DBSSSGSG",    bank:"DBS Bank",           status:"Activating", cardBg:"linear-gradient(135deg,#FFF0F0 0%,#FFE4E4 60%,#FECACA 100%)", cardAccent:"#F87171", cardText:"#B91C1C", logoType:"sg"         },
  { code:"HKD", country:"Hong Kong",      balance:"24,300.00",  pending:"0.00",     flag:"🇭🇰", symbol:"HK$", acct:"HK12 3456 7890 1234 56",      swift:"HSBCHKHH",    bank:"HSBC Hong Kong",     status:"Active",     cardBg:"linear-gradient(135deg,#FAF5FF 0%,#F3E8FF 60%,#E9D5FF 100%)", cardAccent:"#C084FC", cardText:"#7E22CE", logoType:"hk"         },
];

const EMPTY_CURRENCIES = [
  { code:"USD", country:"United States",  balance:"0.00", pending:"0.00", flag:"🇺🇸", symbol:"$",  acct:"— Not set up —", swift:"— Not set up —", bank:"— Not set up —", status:"Activating", cardBg:"linear-gradient(135deg,#EEF2FF 0%,#E0E7FF 60%,#C7D2FE 100%)", cardAccent:"#818CF8", cardText:"#3730A3", logoType:"stripes"   },
  { code:"EUR", country:"European Union", balance:"0.00", pending:"0.00", flag:"🇪🇺", symbol:"€",  acct:"— Not set up —", swift:"— Not set up —", bank:"— Not set up —", status:"Active",      cardBg:"linear-gradient(135deg,#EFF6FF 0%,#DBEAFE 60%,#BFDBFE 100%)", cardAccent:"#60A5FA", cardText:"#1D4ED8", logoType:"eu"        },
  { code:"GBP", country:"United Kingdom", balance:"0.00", pending:"0.00", flag:"🇬🇧", symbol:"£",  acct:"— Not set up —", swift:"— Not set up —", bank:"— Not set up —", status:"Closed",      cardBg:"linear-gradient(135deg,#FFF1F2 0%,#FFE4E6 60%,#FECDD3 100%)", cardAccent:"#FB7185", cardText:"#BE123C", logoType:"union_jack" },
];

const ALL_BENEFICIARIES = {
  USD: [
    { id:1,  name:"Acme Corp",         bank:"Bank of America", acct:"••••4821", type:"Business",   paymentMethod:"SWIFT", status:"Active" },
    { id:2,  name:"John Smith",         bank:"Chase Bank",      acct:"••••3390", type:"Individual", paymentMethod:"SWIFT", status:"Active" },
    { id:3,  name:"Global Traders Ltd", bank:"Citibank",        acct:"••••7712", type:"Business",   paymentMethod:"SWIFT", status:"Active" },
    { id:4,  name:"Sarah Lee",          bank:"Wells Fargo",     acct:"••••2284", type:"Individual", paymentMethod:"SWIFT", status:"Active" },
  ],
  EUR: [
    { id:5,  name:"EuroTech GmbH",      bank:"Deutsche Bank",  acct:"••••5531", type:"Business",   paymentMethod:"SWIFT", status:"Active" },
    { id:6,  name:"Marie Dupont",       bank:"BNP Paribas",    acct:"••••8847", type:"Individual", paymentMethod:"SWIFT", status:"Active" },
    { id:7,  name:"Logistics EU BV",    bank:"ING Bank",       acct:"••••1123", type:"Business",   paymentMethod:"SWIFT", status:"Active" },
  ],
  GBP: [
    { id:8,  name:"London Freight Co",  bank:"Barclays",       acct:"••••9901", type:"Business",   paymentMethod:"SWIFT", status:"Active" },
    { id:9,  name:"James Wilson",       bank:"HSBC UK",        acct:"••••4456", type:"Individual", paymentMethod:"SWIFT", status:"Active" },
    { id:10, name:"UK Supplies Ltd",    bank:"NatWest",        acct:"••••3370", type:"Business",   paymentMethod:"SWIFT", status:"Active" },
  ],
  AUD: [
    { id:11, name:"AusTrade Pty",       bank:"ANZ Bank",       acct:"••••6612", type:"Business",   paymentMethod:"SWIFT", status:"Active" },
    { id:12, name:"Emily Chen",         bank:"Commonwealth",   acct:"••••8823", type:"Individual", paymentMethod:"SWIFT", status:"Active" },
  ],
  SGD: [
    { id:13, name:"SG Logistics Pte",   bank:"DBS Bank",       acct:"••••4490", type:"Business",   paymentMethod:"SWIFT", status:"Active" },
    { id:14, name:"Wei Lin",            bank:"OCBC Bank",      acct:"••••7754", type:"Individual", paymentMethod:"SWIFT", status:"Active" },
  ],
  HKD: [
    { id:15, name:"HK Trading Co",      bank:"HSBC HK",        acct:"••••3312", type:"Business",   paymentMethod:"SWIFT", status:"Active" },
  ],
};

const TRANSACTIONS = [
  { date:"25 Mar 2026", desc:"Stripe Payout — March",           amount:"+$12,400.00", type:"Credit", status:"Active" },
  { date:"22 Mar 2026", desc:"Supplier Payment — Acme Corp",    amount:"-$8,200.00",  type:"Debit",  status:"Active" },
  { date:"18 Mar 2026", desc:"Amazon Marketplace Payout",       amount:"+$5,750.00",  type:"Credit", status:"Active" },
  { date:"15 Mar 2026", desc:"Wire Transfer — Office Rent",     amount:"-$4,500.00",  type:"Debit",  status:"Active" },
  { date:"10 Mar 2026", desc:"PayPal Settlement",               amount:"+$3,200.00",  type:"Credit", status:"Active" },
  { date:"05 Mar 2026", desc:"Vendor Payment — Global Traders", amount:"-$2,900.00",  type:"Debit",  status:"Active" },
  { date:"01 Mar 2026", desc:"Monthly Revenue — Shopify",       amount:"+$18,600.00", type:"Credit", status:"Active" },
];

const ALL_TRANSACTIONS = [
  { date:"25 Mar", desc:"Stripe Payout",    amount:"+$12,400",  status:"Active", code:"USD" },
  { date:"22 Mar", desc:"Supplier Payment", amount:"-€8,200",   status:"Active", code:"EUR" },
  { date:"18 Mar", desc:"Amazon Payout",    amount:"+£5,750",   status:"Active", code:"GBP" },
  { date:"15 Mar", desc:"Wire Transfer",    amount:"-A$4,500",  status:"Active", code:"AUD" },
  { date:"10 Mar", desc:"PayPal Settlement",amount:"+S$3,200",  status:"Active", code:"SGD" },
  { date:"05 Mar", desc:"Vendor Payment",   amount:"-HK$2,900", status:"Active", code:"HKD" },
  { date:"01 Mar", desc:"Monthly Revenue",  amount:"+$18,600",  status:"Active", code:"USD" },
];

const ALL_ADD_CURRENCIES = [
  { code:"CNY", name:"Chinese Yuan",      flag:"🇨🇳" },
  { code:"IDR", name:"Indonesian Rupiah", flag:"🇮🇩" },
  { code:"MXN", name:"Mexican Peso",      flag:"🇲🇽" },
  { code:"BRL", name:"Brazilian Real",    flag:"🇧🇷" },
  { code:"CHF", name:"Swiss Franc",       flag:"🇨🇭" },
  { code:"SEK", name:"Swedish Krona",     flag:"🇸🇪" },
  { code:"INR", name:"Indian Rupee",      flag:"🇮🇳" },
  { code:"KRW", name:"South Korean Won",  flag:"🇰🇷" },
  { code:"AED", name:"UAE Dirham",        flag:"🇦🇪" },
];

const RECEIVE_FIELDS = {
  USD: [
    { label:"Account Holder Name",        value:"Sigma Dt3 Logistics LLC" },
    { label:"Bank Name",                  value:"Wells Fargo Bank" },
    { label:"Account Number",             value:"1234567890" },
    { label:"Routing Number (ACH/Wire)",  value:"121000248" },
    { label:"SWIFT/BIC",                  value:"WFBIUS6S" },
    { label:"Bank Address",               value:"420 Montgomery St, San Francisco, CA 94104" },
  ],
  EUR: [
    { label:"Account Holder Name", value:"Sigma Dt3 Logistics LLC" },
    { label:"Bank Name",           value:"Commerzbank AG" },
    { label:"IBAN",                value:"DE89 3704 0044 0532 0130 00" },
    { label:"BIC/SWIFT",           value:"COBADEFFXXX" },
  ],
  GBP: [
    { label:"Account Holder Name", value:"Sigma Dt3 Logistics LLC" },
    { label:"Bank Name",           value:"NatWest Bank" },
    { label:"Account Number",      value:"31926819" },
    { label:"Sort Code",           value:"60-16-13" },
    { label:"IBAN",                value:"GB29 NWBK 6016 1331 9268 19" },
    { label:"SWIFT/BIC",           value:"NWBKGB2L" },
  ],
  AUD: [
    { label:"Account Holder Name", value:"Sigma Dt3 Logistics LLC" },
    { label:"Bank Name",           value:"ANZ Bank" },
    { label:"Account Number",      value:"123456789012" },
    { label:"BSB Code",            value:"012-345" },
    { label:"SWIFT/BIC",           value:"ANZBAU3M" },
  ],
  SGD: [
    { label:"Account Holder Name", value:"Sigma Dt3 Logistics LLC" },
    { label:"Bank Name",           value:"DBS Bank" },
    { label:"Account Number",      value:"1234567890" },
    { label:"Bank Code",           value:"7171" },
    { label:"Branch Code",         value:"001" },
    { label:"SWIFT/BIC",           value:"DBSSSGSG" },
  ],
  HKD: [
    { label:"Account Holder Name", value:"Sigma Dt3 Logistics LLC" },
    { label:"Bank Name",           value:"HSBC Hong Kong" },
    { label:"Account Number",      value:"123-456789-001" },
    { label:"Bank Code",           value:"004" },
    { label:"Branch Code",         value:"001" },
    { label:"SWIFT/BIC",           value:"HSBCHKHH" },
  ],
};

const PAYOUT_CONFIG = {
  USD: {
    methods:["ACH","FEDWIRE","SWIFT"],
    fields:{
      ACH:     [{key:"account_name",label:"Account Name"},{key:"account_number",label:"Account Number"},{key:"aba",label:"ABA Routing Number"}],
      FEDWIRE: [{key:"account_name",label:"Account Name"},{key:"account_number",label:"Account Number"},{key:"aba",label:"ABA Routing Number"}],
      SWIFT:   [{key:"account_name",label:"Account Name"},{key:"account_number",label:"Account Number"},{key:"swift_code",label:"SWIFT Code"}],
    },
  },
  EUR: {
    methods:["SEPA","SWIFT"],
    fields:{
      SEPA:  [{key:"account_name",label:"Account Name"},{key:"iban",label:"IBAN"}],
      SWIFT: [{key:"account_name",label:"Account Name"},{key:"iban",label:"IBAN"},{key:"swift_code",label:"SWIFT Code"}],
    },
  },
  GBP: {
    methods:["FASTER_PAYMENTS","SWIFT"],
    fields:{
      FASTER_PAYMENTS:[{key:"account_name",label:"Account Name"},{key:"account_number",label:"Account Number"},{key:"sort_code",label:"Sort Code"}],
      SWIFT:          [{key:"account_name",label:"Account Name"},{key:"iban",label:"IBAN"},{key:"swift_code",label:"SWIFT Code"}],
    },
  },
  AUD: {
    methods:["BANK_TRANSFER","SWIFT"],
    fields:{
      BANK_TRANSFER:[{key:"account_name",label:"Account Name"},{key:"account_number",label:"Account Number"},{key:"bsb",label:"BSB Code"}],
      SWIFT:        [{key:"account_name",label:"Account Name"},{key:"account_number",label:"Account Number"},{key:"swift_code",label:"SWIFT Code"}],
    },
  },
  SGD: {
    methods:["FAST","GIRO","RTGS","SWIFT"],
    fields:{
      FAST: [{key:"account_name",label:"Account Name"},{key:"account_number",label:"Account Number"},{key:"swift_code",label:"SWIFT Code"}],
      GIRO: [{key:"account_name",label:"Account Name"},{key:"account_number",label:"Account Number"},{key:"swift_code",label:"SWIFT Code"}],
      RTGS: [{key:"account_name",label:"Account Name"},{key:"account_number",label:"Account Number"},{key:"swift_code",label:"SWIFT Code"}],
      SWIFT:[{key:"account_name",label:"Account Name"},{key:"account_number",label:"Account Number"},{key:"swift_code",label:"SWIFT Code"}],
    },
  },
  HKD: {
    methods:["ACH","FPS","RTGS","SWIFT"],
    fields:{
      ACH:  [{key:"account_name",label:"Account Name"},{key:"account_number",label:"Account Number"},{key:"bank_code",label:"Bank Code"}],
      FPS:  [{key:"account_name",label:"Account Name"},{key:"account_number",label:"Account Number"},{key:"bank_code",label:"Bank Code"}],
      RTGS: [{key:"account_name",label:"Account Name"},{key:"account_number",label:"Account Number"},{key:"swift_code",label:"SWIFT Code"}],
      SWIFT:[{key:"account_name",label:"Account Name"},{key:"account_number",label:"Account Number"},{key:"swift_code",label:"SWIFT Code"}],
    },
  },
};

const COUNTRY_CODES = ["AE","AU","BR","CA","CH","CN","DE","FR","GB","HK","ID","IN","JP","KR","MX","MY","NL","NZ","PH","SG","SE","TH","US","VN"];

/* ═══════════════════════════════════════════════════════════
   ATOMS
═══════════════════════════════════════════════════════════ */

function Pill({ label }) {
  let bg = T.grey50, color = T.grey400, border = T.grey200;
  if (label === "Active" || label === "Added") { bg = T.greenBg; color = T.greenText; border = T.greenBorder; }
  else if (label === "Activating" || label === "Pending") { bg = T.amberBg; color = T.amberText; border = T.amberBorder; }
  else if (label === "Failed" || label === "Error") { bg = T.redErrBg; color = T.redErrText; border = T.redErrBorder; }
  else if (label === "Closed") { bg = "#F3F4F6"; color = "#6B7280"; border = "#D1D5DB"; }
  return (
    <span style={{ background: bg, color, border:`1px solid ${border}`, padding:"3px 10px", borderRadius:20, fontSize:12, fontWeight:600, display:"inline-block", lineHeight:1.5 }}>
      {label}
    </span>
  );
}

function pmBadge(pm) {
  let bg, color;
  switch (pm) {
    case "ACH": case "FEDWIRE": case "SEPA":           bg="#EFF6FF"; color="#1D4ED8"; break;
    case "SWIFT":                                       bg="#F5F3FF"; color="#7C3AED"; break;
    case "FASTER_PAYMENTS": case "BANK_TRANSFER": case "FPS": bg="#F0FDF4"; color="#16A34A"; break;
    case "FAST": case "GIRO":                          bg="#FFF7ED"; color="#D97706"; break;
    case "RTGS":                                        bg="#F5F3FF"; color="#7C3AED"; break;
    default:                                            bg=T.grey50;  color=T.grey400;
  }
  return <span key={pm} style={{ background:bg, color, padding:"3px 10px", borderRadius:20, fontSize:12, fontWeight:600, display:"inline-block" }}>{pm}</span>;
}

function BtnPrimary({ children, onClick, style, disabled }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: disabled ? T.grey200 : T.redGrad, color: disabled ? T.grey400 : T.white,
        border:"none", borderRadius:8, padding:"10px 20px", fontSize:14, fontWeight:600,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : hov ? 0.88 : 1,
        transition:"opacity 0.15s", fontFamily:T.font, ...style,
      }}
    >{children}</button>
  );
}

function BtnSecondary({ children, onClick, style }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? T.grey50 : T.white, color:T.black,
        border:`1px solid ${T.grey200}`, borderRadius:8, padding:"10px 20px",
        fontSize:14, fontWeight:600, cursor:"pointer",
        transition:"background 0.15s", fontFamily:T.font, ...style,
      }}
    >{children}</button>
  );
}

function BtnPurple({ children, onClick, style }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background:T.purpleGrad, color:T.white, border:"none",
        borderRadius:8, padding:"10px 20px", fontSize:14, fontWeight:600,
        cursor:"pointer", opacity: hov ? 0.88 : 1, transition:"opacity 0.15s",
        fontFamily:T.font, ...style,
      }}
    >{children}</button>
  );
}

function Input({ label, value, onChange, placeholder, defaultValue, readOnly, type = "text" }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
      {label && <label style={{ fontSize:12, fontWeight:600, color:T.grey600 }}>{label}</label>}
      <input
        type={type} value={value} defaultValue={defaultValue}
        onChange={onChange} placeholder={placeholder} readOnly={readOnly}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          border:`1px solid ${focused ? T.redPrimary : T.grey200}`,
          boxShadow: focused ? "0 0 0 3px rgba(232,56,56,0.08)" : "none",
          borderRadius:8, padding:"10px 12px", fontSize:14, color:T.black,
          fontFamily:T.font, background: readOnly ? T.grey50 : T.white,
          outline:"none", transition:"border-color 0.15s, box-shadow 0.15s",
          width:"100%", boxSizing:"border-box",
        }}
      />
    </div>
  );
}

function Avatar({ name = "U", size = 32, fontSize = 14 }) {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{
      width:size, height:size, borderRadius:"50%", background:T.redGrad, color:T.white,
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize, fontWeight:700, flexShrink:0,
    }}>{initials}</div>
  );
}

function Notice({ type = "info", children }) {
  let bg, border, color, icon;
  if (type === "warning") { bg="#FFFBEB"; border="#F59E0B"; color="#92400E"; icon="⚠️"; }
  else if (type === "success") { bg="#F0FDF4"; border="#16A34A"; color="#16A34A"; icon="✓"; }
  else { bg="#EFF6FF"; border="#3B82F6"; color="#1D4ED8"; icon="ℹ️"; }
  return (
    <div style={{ background:bg, borderLeft:`4px solid ${border}`, borderRadius:8, padding:"10px 14px", fontSize:13, color, display:"flex", gap:8, alignItems:"flex-start" }}>
      <span style={{ flexShrink:0 }}>{icon}</span><span>{children}</span>
    </div>
  );
}

function Footer() {
  return (
    <div style={{ borderTop:`1px solid ${T.grey100}`, padding:"16px 32px", display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:12 }}>
      <span style={{ color:T.grey300 }}>© 2024–2026 Peko Payment Services LLC. All Rights Reserved.</span>
      <span style={{ color:T.grey400 }}>Peko Platform Agreement · Privacy Policy · Refund Policy · Cookie Policy</span>
    </div>
  );
}

function Breadcrumb({ items }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, color:T.grey400, marginBottom:16 }}>
      {items.map((item, i) => (
        <span key={i} style={{ display:"flex", alignItems:"center", gap:6 }}>
          {i > 0 && <span style={{ color:T.grey300 }}>›</span>}
          {item.onClick
            ? <span onClick={item.onClick} style={{ cursor:"pointer", color:T.grey600 }}>{item.label}</span>
            : <span style={{ color: i === items.length - 1 ? T.black : T.grey600, fontWeight: i === items.length - 1 ? 600 : 400 }}>{item.label}</span>
          }
        </span>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CURRENCY LOGO SVG
═══════════════════════════════════════════════════════════ */
let _svgUidCounter = 0;

function CurrencyLogo({ c, size = 44 }) {
  const [clipId] = useState(() => `clip${++_svgUidCounter}`);
  const r = size / 2, cx = r, cy = r;

  const renderFlag = () => {
    const lt = c.logoType;
    const s = size;

    if (lt === "stripes") {
      const sh = s / 13;
      const cw = s * 0.38, ch = sh * 7;
      return (
        <>
          <rect width={s} height={s} fill="#fff" />
          {Array.from({ length: 13 }, (_, i) => (
            <rect key={i} x={0} y={i * sh} width={s} height={sh} fill={i % 2 === 0 ? "#B22234" : "#fff"} />
          ))}
          <rect x={0} y={0} width={cw} height={ch} fill="#3C3B6E" />
          {Array.from({ length: 5 }, (_, row) =>
            Array.from({ length: row % 2 === 0 ? 6 : 5 }, (_, col) => {
              const xOff = row % 2 === 0 ? 2.5 : 5;
              const sx = xOff + col * (cw / 6), sy = ch * 0.1 + row * (ch / 5.2);
              return <circle key={`${row}-${col}`} cx={sx} cy={sy} r={1.1} fill="#fff" />;
            })
          )}
        </>
      );
    }

    if (lt === "eu") {
      const stars12 = Array.from({ length: 12 }, (_, i) => {
        const angle = (i * 30 - 90) * Math.PI / 180;
        const sx = cx + 13 * Math.cos(angle), sy = cy + 13 * Math.sin(angle);
        const pts = Array.from({ length: 5 }, (_, j) => {
          const a = (j * 72 - 90) * Math.PI / 180;
          const a2 = (j * 72 - 54) * Math.PI / 180;
          return `${sx + 2.5 * Math.cos(a)},${sy + 2.5 * Math.sin(a)} ${sx + 1.1 * Math.cos(a2)},${sy + 1.1 * Math.sin(a2)}`;
        }).join(" ");
        return <polygon key={i} points={pts} fill="#FFCC00" />;
      });
      return (<><rect width={s} height={s} fill="#003399" />{stars12}</>);
    }

    if (lt === "union_jack") {
      return (
        <>
          <rect width={s} height={s} fill="#012169" />
          <line x1={0} y1={0} x2={s} y2={s} stroke="#fff" strokeWidth={s * 0.2} />
          <line x1={s} y1={0} x2={0} y2={s} stroke="#fff" strokeWidth={s * 0.2} />
          <line x1={0} y1={0} x2={s} y2={s} stroke="#C8102E" strokeWidth={s * 0.12} />
          <line x1={s} y1={0} x2={0} y2={s} stroke="#C8102E" strokeWidth={s * 0.12} />
          <rect x={s * 0.38} y={0} width={s * 0.24} height={s} fill="#fff" />
          <rect x={0} y={s * 0.38} width={s} height={s * 0.24} fill="#fff" />
          <rect x={s * 0.44} y={0} width={s * 0.12} height={s} fill="#C8102E" />
          <rect x={0} y={s * 0.44} width={s} height={s * 0.12} fill="#C8102E" />
        </>
      );
    }

    if (lt === "aus") {
      const ms = s * 0.44, mh = ms / 2;
      const starPts = (sx, sy, or, ir) =>
        Array.from({ length: 5 }, (_, j) => {
          const a = (j * 72 - 90) * Math.PI / 180;
          const a2 = (j * 72 - 54) * Math.PI / 180;
          return `${sx + or * Math.cos(a)},${sy + or * Math.sin(a)} ${sx + ir * Math.cos(a2)},${sy + ir * Math.sin(a2)}`;
        }).join(" ");
      return (
        <>
          <rect width={s} height={s} fill="#00235D" />
          <rect x={0} y={0} width={ms} height={mh} fill="#012169" />
          <line x1={0} y1={0} x2={ms} y2={mh} stroke="#fff" strokeWidth={mh * 0.38} />
          <line x1={ms} y1={0} x2={0} y2={mh} stroke="#fff" strokeWidth={mh * 0.38} />
          <line x1={0} y1={0} x2={ms} y2={mh} stroke="#C8102E" strokeWidth={mh * 0.22} />
          <line x1={ms} y1={0} x2={0} y2={mh} stroke="#C8102E" strokeWidth={mh * 0.22} />
          <rect x={ms * 0.38} y={0} width={ms * 0.24} height={mh} fill="#fff" />
          <rect x={0} y={mh * 0.38} width={ms} height={mh * 0.24} fill="#fff" />
          <rect x={ms * 0.44} y={0} width={ms * 0.12} height={mh} fill="#C8102E" />
          <rect x={0} y={mh * 0.44} width={ms} height={mh * 0.12} fill="#C8102E" />
          {[[s*0.74,s*0.24,2.4,1.1],[s*0.60,s*0.52,2.4,1.1],[s*0.88,s*0.52,2.4,1.1],[s*0.70,s*0.74,2.4,1.1],[s*0.56,s*0.37,1.7,0.8]].map(([sx,sy,or,ir],i) => (
            <polygon key={i} points={starPts(sx, sy, or, ir)} fill="#fff" />
          ))}
        </>
      );
    }

    if (lt === "sg") {
      const starPts = (sx, sy) =>
        Array.from({ length: 5 }, (_, j) => {
          const a = (j * 72 - 90) * Math.PI / 180;
          const a2 = (j * 72 - 54) * Math.PI / 180;
          return `${sx + 2.4 * Math.cos(a)},${sy + 2.4 * Math.sin(a)} ${sx + 1.0 * Math.cos(a2)},${sy + 1.0 * Math.sin(a2)}`;
        }).join(" ");
      return (
        <>
          <rect width={s} height={s / 2} fill="#EF3340" />
          <rect y={s / 2} width={s} height={s / 2} fill="#fff" />
          <circle cx={s * 0.28} cy={s * 0.25} r={s * 0.15} fill="#fff" />
          <circle cx={s * 0.37} cy={s * 0.25} r={s * 0.115} fill="#EF3340" />
          {Array.from({ length: 5 }, (_, i) => {
            const angle = (i * 72 - 90) * Math.PI / 180;
            return <polygon key={i} points={starPts(s*0.62 + s*0.10*Math.cos(angle), s*0.25 + s*0.10*Math.sin(angle))} fill="#fff" />;
          })}
        </>
      );
    }

    if (lt === "hk") {
      return (
        <>
          <rect width={s} height={s} fill="#DE2910" />
          {Array.from({ length: 5 }, (_, i) => (
            <g key={i} transform={`rotate(${i * 72} ${cx} ${cy})`}>
              <ellipse cx={cx} cy={cy - s * 0.21} rx={s * 0.045} ry={s * 0.135} fill="white" opacity={0.92} />
            </g>
          ))}
          <circle cx={cx} cy={cy} r={s * 0.06} fill="#DE2910" />
        </>
      );
    }

    return <rect width={s} height={s} fill={T.grey200} />;
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg" style={{ display:"block" }}>
      <defs><clipPath id={clipId}><circle cx={cx} cy={cy} r={r} /></clipPath></defs>
      <g clipPath={`url(#${clipId})`}>{renderFlag()}</g>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   SIDEBAR
═══════════════════════════════════════════════════════════ */
const NAV_MAIN = [
  { id:"dashboard_app", label:"Dashboard",        icon:"📊" },
  { id:"bills",         label:"Bill Payments",    icon:"💳" },
  { id:"travel",        label:"Corporate Travel", icon:"✈️" },
  { id:"payroll",       label:"Payroll",           icon:"💰", badge:"New", badgeBg:T.redPrimary },
  { id:"supplies",      label:"Office Supplies",  icon:"🖨️" },
  { id:"software",      label:"Softwares",        icon:"💻" },
  { id:"logistics",     label:"Logistics",        icon:"📦" },
  { id:"gifts",         label:"Gift Cards",       icon:"🎁" },
  { id:"marketplace",   label:"Marketplace",      icon:"🛍️", badge:"Free", badgeBg:T.greenText },
  { id:"tax",           label:"Tax & More",       icon:"📋", badge:"New", badgeBg:T.redPrimary },
  { id:"accounts",      label:"Accounts",         icon:"🏦" },
  { id:"invoicing",     label:"Invoicing",        icon:"📄" },
  { id:"insurance",     label:"Insurance",        icon:"🛡️" },
  { id:"hub",           label:"Hub",              icon:"🔗" },
];
const NAV_BOTTOM = [
  { id:"reports",  label:"Reports",    icon:"📈" },
  { id:"help",     label:"Need Help?", icon:"❓" },
  { id:"settings", label:"Settings",   icon:"⚙️" },
];

const ACCOUNTS_PAGES = new Set(["dashboard_app","currency_detail","currencies","add_modal","remove_modal"]);

function Sidebar({ activePage, onNav }) {
  const NavItem = ({ item }) => {
    const active = item.id === "accounts" ? ACCOUNTS_PAGES.has(activePage) : activePage === item.id;
    const [hov, setHov] = useState(false);
    return (
      <div
        onClick={() => onNav(item.id)}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          padding:"9px 16px", fontSize:13, fontWeight: active ? 600 : 500,
          color: active ? T.redPrimary : T.grey600,
          background: active ? T.redLight : hov ? T.grey50 : "transparent",
          cursor:"pointer", display:"flex", alignItems:"center", gap:8,
          position:"relative", transition:"background 0.1s",
        }}
      >
        {active && <div style={{ position:"absolute", right:0, top:"20%", width:3, height:"60%", background:T.redPrimary, borderRadius:"3px 0 0 3px" }} />}
        <span style={{ fontSize:14, lineHeight:1 }}>{item.icon}</span>
        <span style={{ flex:1 }}>{item.label}</span>
        {item.badge && (
          <span style={{ fontSize:10, fontWeight:700, padding:"2px 6px", borderRadius:20, background:item.badgeBg, color:T.white }}>{item.badge}</span>
        )}
      </div>
    );
  };

  return (
    <div style={{ position:"fixed", left:0, top:0, width:T.sidebarW, height:"100vh", background:T.white, borderRight:`1px solid ${T.grey100}`, display:"flex", flexDirection:"column", zIndex:300, overflowY:"auto" }}>
      <div style={{ height:T.topbarH, display:"flex", alignItems:"center", gap:10, padding:"0 16px", borderBottom:`1px solid ${T.grey100}`, flexShrink:0 }}>
        <div style={{ width:32, height:32, borderRadius:8, background:T.redGrad, display:"flex", alignItems:"center", justifyContent:"center", color:T.white, fontSize:18, fontWeight:800 }}>P</div>
        <span style={{ fontSize:16, fontWeight:700, color:T.black }}>peko</span>
      </div>
      <div style={{ flex:1, paddingTop:8 }}>
        {NAV_MAIN.map(item => <NavItem key={item.id} item={item} />)}
      </div>
      <div style={{ borderTop:`1px solid ${T.grey100}`, paddingTop:8, paddingBottom:8 }}>
        {NAV_BOTTOM.map(item => <NavItem key={item.id} item={item} />)}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TOPBAR
═══════════════════════════════════════════════════════════ */
function Topbar({ setPage, dummy, setDummy }) {
  const [searchVal, setSearchVal] = useState("");
  const [searchFocus, setSearchFocus] = useState(false);
  return (
    <div style={{ position:"fixed", left:T.sidebarW, right:0, top:0, height:T.topbarH, background:T.white, borderBottom:`1px solid ${T.grey100}`, boxShadow:"0 2px 8px rgba(0,0,0,0.06)", display:"flex", alignItems:"center", padding:"0 20px", gap:12, zIndex:200 }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, background: searchFocus ? T.white : "#F5F5F5", border:`1px solid ${searchFocus ? T.redPrimary : "transparent"}`, boxShadow: searchFocus ? "0 0 0 3px rgba(232,56,56,0.08)" : "none", borderRadius:10, padding:"0 12px", flex:1, maxWidth:340, transition:"all 0.15s" }}>
        <span style={{ fontSize:13, color:T.grey400 }}>🔍</span>
        <input value={searchVal} onChange={e => setSearchVal(e.target.value)} onFocus={() => setSearchFocus(true)} onBlur={() => setSearchFocus(false)} placeholder="Search..." style={{ border:"none", background:"transparent", outline:"none", fontSize:14, color:T.black, fontFamily:T.font, flex:1, padding:"8px 0" }} />
      </div>
      <div style={{ flex:1 }} />
      <div style={{ background:T.redLight, borderRadius:20, padding:"5px 12px", display:"flex", alignItems:"center", gap:6 }}>
        <span>🏆</span>
        <span style={{ fontSize:12, fontWeight:600, color:T.redPrimary }}>Cashback: AED {dummy ? "1,200.00" : "0.00"}</span>
      </div>
      <div onClick={() => setPage("setup")} style={{ background:T.redGrad, color:T.white, borderRadius:8, padding:"4px 12px", fontSize:11, fontWeight:600, lineHeight:1.4, cursor:"pointer", textAlign:"center" }}>
        Claim your<br/>free credits
      </div>
      <div onClick={() => setDummy(!dummy)} style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", border:`1.5px solid ${dummy ? T.redPrimary : T.grey200}`, borderRadius:20, padding:"4px 10px", background: dummy ? T.redLight : T.grey50 }}>
        <div style={{ width:32, height:18, borderRadius:9, background: dummy ? T.redPrimary : T.grey200, position:"relative", transition:"background 0.2s" }}>
          <div style={{ position:"absolute", top:2, left: dummy ? 14 : 2, width:14, height:14, borderRadius:"50%", background:T.white, transition:"left 0.2s", boxShadow:"0 1px 3px rgba(0,0,0,0.2)" }} />
        </div>
        <span style={{ fontSize:12, fontWeight:600, color: dummy ? T.redPrimary : T.grey400 }}>Dummy Data</span>
      </div>
      <button style={{ width:34, height:34, borderRadius:"50%", border:`1px solid ${T.grey200}`, background:T.white, cursor:"pointer", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center" }}>💬</button>
      <div style={{ position:"relative" }}>
        <button style={{ width:34, height:34, borderRadius:"50%", border:`1px solid ${T.grey200}`, background:T.white, cursor:"pointer", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center" }}>🔔</button>
        <div style={{ position:"absolute", top:-4, right:-4, background:T.redPrimary, color:T.white, borderRadius:20, fontSize:10, fontWeight:700, padding:"1px 5px", minWidth:18, textAlign:"center" }}>{dummy ? 27 : 0}</div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <Avatar name="S" size={30} fontSize={13} />
        <div style={{ lineHeight:1.3 }}>
          <div style={{ fontSize:12, fontWeight:600, color:T.black }}>Sigma Dt3 Logistics</div>
          <div style={{ fontSize:11, color:T.grey400 }}>Corporate</div>
        </div>
      </div>
      <button style={{ width:30, height:30, borderRadius:6, border:`1px solid ${T.grey200}`, background:T.white, cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>⏏</button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   APP SHELL
═══════════════════════════════════════════════════════════ */
function AppShell({ activePage, onNav, setPage, dummy, setDummy, children }) {
  return (
    <div style={{ background:T.pageBg, minHeight:"100vh" }}>
      <Sidebar activePage={activePage} onNav={onNav} />
      <Topbar setPage={setPage} dummy={dummy} setDummy={setDummy} />
      <div style={{ marginLeft:T.sidebarW, marginTop:T.topbarH, minHeight:`calc(100vh - ${T.topbarH}px)` }}>
        <div style={{ maxWidth:1100, margin:"0 auto", paddingLeft:32, paddingRight:32 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PROTO NAV
═══════════════════════════════════════════════════════════ */
const PROTO_PAGES = [
  { group:"Marketing",  id:"landing",        label:"Landing Page",        icon:"🏠" },
  { group:"Onboarding", id:"setup",           label:"Setup",               icon:"⚙️" },
  { group:"Onboarding", id:"initialising",    label:"Initialising",        icon:"⏳" },
  { group:"Product",    id:"dashboard_app",   label:"Dashboard",           icon:"📊" },
  { group:"Product",    id:"currency_detail", label:"Currency Detail",     icon:"💱" },
  { group:"Product",    id:"currencies",      label:"Currencies Page",     icon:"🌍" },
  { group:"Modals",     id:"add_modal",       label:"Add Currency Modal",  icon:"➕" },
  { group:"Modals",     id:"remove_modal",    label:"Remove Currency",     icon:"🗑️" },
];

function ProtoNav({ currentPage, setPage, navOpen, setNavOpen }) {
  const currentIdx = PROTO_PAGES.findIndex(p => p.id === currentPage);
  return (
    <>
      <div onClick={() => setNavOpen(!navOpen)} style={{ position:"fixed", right: navOpen ? 260 : 0, top:"50%", transform:"translateY(-50%)", background:T.redGrad, color:T.white, width:28, height:80, borderRadius:"8px 0 0 8px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", cursor:"pointer", zIndex:2000, transition:"right 0.25s ease-out", boxShadow:"-2px 0 12px rgba(0,0,0,0.15)" }}>
        <span style={{ fontSize:14, fontWeight:700 }}>{navOpen ? "›" : "‹"}</span>
        <span style={{ fontSize:9, fontWeight:700, writingMode:"vertical-rl", textOrientation:"mixed", letterSpacing:1, marginTop:4 }}>PAGES</span>
      </div>
      <div style={{ position:"fixed", right: navOpen ? 0 : -260, top:0, width:260, height:"100vh", background:T.white, borderLeft:`1px solid ${T.grey100}`, boxShadow:"-4px 0 24px rgba(0,0,0,0.10)", zIndex:1999, transition:"right 0.25s ease-out", display:"flex", flexDirection:"column" }}>
        <div style={{ padding:"16px 16px 12px", borderBottom:`1px solid ${T.grey100}`, flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
            <div style={{ width:24, height:24, borderRadius:6, background:T.redGrad, display:"flex", alignItems:"center", justifyContent:"center", color:T.white, fontSize:12, fontWeight:800 }}>P</div>
            <span style={{ fontSize:13, fontWeight:700, color:T.black }}>Prototype Navigator</span>
          </div>
          <div style={{ fontSize:11, color:T.grey400, marginBottom:8 }}>{PROTO_PAGES.length} screens</div>
          <div style={{ height:4, background:T.grey100, borderRadius:2 }}>
            <div style={{ height:"100%", borderRadius:2, background:T.redGrad, width:`${((currentIdx + 1) / PROTO_PAGES.length) * 100}%`, transition:"width 0.25s" }} />
          </div>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"8px 0" }}>
          {PROTO_PAGES.map((pg, i) => {
            const active = currentPage === pg.id;
            const showGroup = i === 0 || PROTO_PAGES[i - 1].group !== pg.group;
            return (
              <div key={pg.id}>
                {showGroup && <div style={{ fontSize:10, fontWeight:700, color:T.grey300, padding:"8px 16px 4px", letterSpacing:0.5, textTransform:"uppercase" }}>{pg.group}</div>}
                <div onClick={() => setPage(pg.id)} style={{ padding:"9px 16px", cursor:"pointer", background: active ? T.redLight : "transparent", display:"flex", alignItems:"center", gap:10, transition:"background 0.1s" }}>
                  <div style={{ width:28, height:28, borderRadius:6, flexShrink:0, background: active ? T.redGrad : T.grey50, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13 }}>{pg.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, fontWeight: active ? 600 : 500, color: active ? T.redPrimary : T.black }}>{pg.label}</div>
                    <div style={{ fontSize:10, color:T.grey400 }}>{pg.group}</div>
                  </div>
                  {active && <div style={{ width:6, height:6, borderRadius:"50%", background:T.redPrimary }} />}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ padding:"12px 16px", borderTop:`1px solid ${T.grey100}`, flexShrink:0 }}>
          <div style={{ display:"flex", gap:8, marginBottom:10 }}>
            <BtnSecondary onClick={() => currentIdx > 0 && setPage(PROTO_PAGES[currentIdx - 1].id)} style={{ flex:1, padding:"8px 10px", fontSize:12 }}>← Prev</BtnSecondary>
            <BtnPrimary onClick={() => currentIdx < PROTO_PAGES.length - 1 && setPage(PROTO_PAGES[currentIdx + 1].id)} style={{ flex:1, padding:"8px 10px", fontSize:12 }}>Next →</BtnPrimary>
          </div>
          <div style={{ fontSize:10, color:T.grey300, textAlign:"center" }}>Peko Design System v3.1</div>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   RECEIVE MODAL
═══════════════════════════════════════════════════════════ */
function ReceiveModal({ cur, onClose }) {
  const fields = RECEIVE_FIELDS[cur.code] || [];
  const [copied, setCopied] = useState({});

  const handleCopy = (key, value) => {
    navigator.clipboard?.writeText(value).catch(() => {});
    setCopied(c => ({ ...c, [key]: true }));
    setTimeout(() => setCopied(c => ({ ...c, [key]: false })), 1600);
  };

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:600 }}>
      <div style={{ background:T.white, borderRadius:16, padding:28, width:520, maxWidth:"92vw", maxHeight:"86vh", overflowY:"auto", boxShadow:"0 8px 40px rgba(0,0,0,0.18)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
          <CurrencyLogo c={cur} size={44} />
          <div style={{ flex:1 }}>
            <div style={{ fontSize:18, fontWeight:700, color:T.black }}>{cur.code} Account Details</div>
            <div style={{ fontSize:13, color:T.grey400 }}>{cur.country}</div>
          </div>
          <button onClick={onClose} style={{ border:"none", background:"none", cursor:"pointer", fontSize:22, color:T.grey400, lineHeight:1 }}>×</button>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {fields.map((f, i) => (
            <div key={i} style={{ background:T.grey50, borderRadius:8, padding:"10px 14px" }}>
              <div style={{ fontSize:11, fontWeight:700, color:T.grey400, textTransform:"uppercase", letterSpacing:0.5, marginBottom:4 }}>{f.label}</div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontFamily:"monospace", fontSize:13, color:T.black, flex:1 }}>{f.value}</span>
                <button onClick={() => handleCopy(i, f.value)} style={{ fontSize:12, fontWeight:600, padding:"4px 10px", borderRadius:6, border:`1px solid ${copied[i] ? T.greenBorder : T.grey200}`, background: copied[i] ? T.greenBg : T.white, color: copied[i] ? T.greenText : T.grey600, cursor:"pointer", transition:"all 0.2s", whiteSpace:"nowrap" }}>
                  {copied[i] ? "✓ Copied" : "Copy"}
                </button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display:"flex", gap:8, marginTop:20 }}>
          <BtnSecondary onClick={() => handleCopy("all", fields.map(f => `${f.label}: ${f.value}`).join("\n"))} style={{ flex:1, fontSize:13, padding:"9px 12px" }}>
            {copied["all"] ? "✓ Copied All" : "Copy All"}
          </BtnSecondary>
          <BtnSecondary onClick={() => {}} style={{ flex:1, fontSize:13, padding:"9px 12px" }}>Download PDF</BtnSecondary>
          <BtnSecondary onClick={() => {}} style={{ flex:1, fontSize:13, padding:"9px 12px" }}>Share via email</BtnSecondary>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SEND PANEL
═══════════════════════════════════════════════════════════ */
function SendPanel({ cur, beneficiaries, initialBenef, onClose }) {
  const config = PAYOUT_CONFIG[cur.code] || { methods:["SWIFT"], fields:{ SWIFT:[] } };
  const [selectedBenef, setSelectedBenef] = useState(initialBenef || null);
  const [method, setMethod] = useState(config.methods[0]);
  const [fieldVals, setFieldVals] = useState({});
  const [amount, setAmount] = useState("");
  const [amtFocus, setAmtFocus] = useState(false);
  const [success, setSuccess] = useState(false);

  const fields = config.fields[method] || [];
  const allFieldsFilled = fields.every(f => fieldVals[f.key]?.trim());
  const canSubmit = amount.trim() !== "" && (selectedBenef !== null || allFieldsFilled);

  if (success) {
    return (
      <div style={{ position:"fixed", right:0, top:0, width:400, height:"100vh", background:T.white, boxShadow:"-4px 0 24px rgba(0,0,0,0.10)", zIndex:500, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:32, textAlign:"center" }}>
        <div style={{ width:72, height:72, borderRadius:"50%", background:T.greenBg, border:`2px solid ${T.greenBorder}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, marginBottom:20 }}>✓</div>
        <div style={{ fontSize:20, fontWeight:700, color:T.black, marginBottom:8 }}>Payment Submitted!</div>
        <div style={{ fontSize:14, color:T.grey400, marginBottom:28 }}>
          Your {cur.code} payment of {cur.symbol}{amount} has been queued for processing.
        </div>
        <BtnPrimary onClick={onClose} style={{ width:"100%" }}>Done</BtnPrimary>
      </div>
    );
  }

  return (
    <div style={{ position:"fixed", right:0, top:0, width:400, height:"100vh", background:T.white, boxShadow:"-4px 0 24px rgba(0,0,0,0.10)", zIndex:500, display:"flex", flexDirection:"column" }}>
      <div style={{ padding:"20px 24px 16px", borderBottom:`1px solid ${T.grey100}`, display:"flex", alignItems:"flex-start", gap:12, flexShrink:0 }}>
        <CurrencyLogo c={cur} size={40} />
        <div style={{ flex:1 }}>
          <div style={{ fontSize:16, fontWeight:700, color:T.black }}>Make a Payment</div>
          <div style={{ fontSize:13, color:T.grey400 }}>{cur.code} · {cur.country}</div>
        </div>
        <button onClick={onClose} style={{ border:"none", background:"none", cursor:"pointer", fontSize:22, color:T.grey400, lineHeight:1 }}>×</button>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"20px 24px", display:"flex", flexDirection:"column", gap:16 }}>
        <div>
          <label style={{ fontSize:12, fontWeight:600, color:T.grey600, display:"block", marginBottom:4 }}>Select Beneficiary (Optional)</label>
          <select value={selectedBenef?.id || ""} onChange={e => { const b = beneficiaries.find(b => b.id === Number(e.target.value)); setSelectedBenef(b || null); if (b) setMethod(b.paymentMethod || config.methods[0]); }} style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1px solid ${T.grey200}`, fontSize:14, color:T.black, fontFamily:T.font, background:T.white, outline:"none" }}>
            <option value="">— Select a beneficiary —</option>
            {beneficiaries.map(b => <option key={b.id} value={b.id}>{b.name} ({b.bank})</option>)}
          </select>
        </div>
        {selectedBenef && (
          <div style={{ background:"#F0FDF4", border:`1px solid ${T.greenBorder}`, borderRadius:8, padding:"12px 14px" }}>
            <div style={{ fontSize:12, fontWeight:700, color:T.greenText, marginBottom:8 }}>Beneficiary Details</div>
            {[["Bank", selectedBenef.bank], ["Account", selectedBenef.acct], ["Method", selectedBenef.paymentMethod], ["Currency", cur.code]].map(([lbl, val]) => (
              <div key={lbl} style={{ display:"flex", justifyContent:"space-between", marginBottom:4, fontSize:13 }}>
                <span style={{ color:T.grey600 }}>{lbl}</span>
                <span style={{ fontWeight:600, color:T.black }}>{val}</span>
              </div>
            ))}
          </div>
        )}
        <div>
          <label style={{ fontSize:12, fontWeight:600, color:T.grey600, display:"block", marginBottom:8 }}>Payment Method</label>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {config.methods.map(m => (
              <div key={m} onClick={() => setMethod(m)} style={{ padding:"5px 12px", borderRadius:20, fontSize:12, fontWeight:600, cursor:"pointer", border:`1.5px solid ${method === m ? T.redPrimary : T.grey200}`, background: method === m ? T.redLight : T.white, color: method === m ? T.redPrimary : T.grey600, transition:"all 0.15s" }}>{m}</div>
            ))}
          </div>
        </div>
        {!selectedBenef && fields.map(f => (
          <Input key={f.key} label={f.label} value={fieldVals[f.key] || ""} onChange={e => setFieldVals(v => ({ ...v, [f.key]: e.target.value }))} placeholder={`Enter ${f.label.toLowerCase()}`} />
        ))}
        <div>
          <label style={{ fontSize:12, fontWeight:600, color:T.grey600, display:"block", marginBottom:4 }}>Amount ({cur.code})</label>
          <div style={{ display:"flex", alignItems:"center", border:`1px solid ${amtFocus || amount ? T.redPrimary : T.grey200}`, borderRadius:8, overflow:"hidden", boxShadow: amtFocus ? "0 0 0 3px rgba(232,56,56,0.08)" : "none", transition:"all 0.15s" }}>
            <span style={{ padding:"10px 14px", background:T.grey50, fontSize:18, fontWeight:700, color:T.black, borderRight:`1px solid ${T.grey200}` }}>{cur.symbol}</span>
            <input type="text" value={amount} onChange={e => setAmount(e.target.value)} onFocus={() => setAmtFocus(true)} onBlur={() => setAmtFocus(false)} placeholder="0.00" style={{ flex:1, padding:"10px 14px", border:"none", outline:"none", fontSize:18, fontWeight:700, fontFamily:T.font, color:T.black }} />
          </div>
        </div>
        <Notice type="warning">Please double-check all payment details before proceeding. Payments cannot be reversed once submitted.</Notice>
      </div>
      <div style={{ padding:"16px 24px", borderTop:`1px solid ${T.grey100}`, display:"flex", gap:10, flexShrink:0 }}>
        <BtnSecondary onClick={onClose} style={{ flex:1 }}>Cancel</BtnSecondary>
        <BtnPrimary onClick={() => canSubmit && setSuccess(true)} disabled={!canSubmit} style={{ flex:1 }}>Initiate Payment</BtnPrimary>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ADD BENEFICIARY PANEL — 3-step, right side, 440px
═══════════════════════════════════════════════════════════ */
function AddBeneficiaryPanel({ cur, onClose, onAdd }) {
  const [step, setStep] = useState(1);
  const [entityType, setEntityType] = useState("Business");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankCountry, setBankCountry] = useState("");
  const [bankName, setBankName] = useState("");
  const [swiftCode, setSwiftCode] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [postcode, setPostcode] = useState("");
  const [country, setCountry] = useState("");

  const step1Valid = firstName.trim() && lastName.trim() && (entityType === "Individual" || companyName.trim());
  const step2Valid = accountName.trim() && accountNumber.trim() && bankCountry && bankName.trim() && swiftCode.trim();
  const step3Valid = streetAddress.trim() && city.trim() && country;
  const canContinue = step === 1 ? step1Valid : step === 2 ? step2Valid : step3Valid;

  const handleAdd = () => {
    onAdd({ id: Date.now(), name: entityType === "Business" ? companyName : `${firstName} ${lastName}`, bank: bankName, acct: `••••${accountNumber.slice(-4) || "0000"}`, type: entityType, paymentMethod: "SWIFT", status: "Active" });
    onClose();
  };

  const progressPct = step === 1 ? 33 : step === 2 ? 66 : 100;

  const StepDots = () => (
    <div style={{ display:"flex", alignItems:"center", gap:0 }}>
      {[1, 2, 3].map((s, i) => {
        const done = step > s, active = step === s;
        return (
          <div key={s} style={{ display:"flex", alignItems:"center" }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
              <div style={{ width:24, height:24, borderRadius:"50%", background: done ? T.greenText : active ? T.redPrimary : T.grey200, color:T.white, fontSize:11, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>{done ? "✓" : s}</div>
              <span style={{ fontSize:10, color: active ? T.redPrimary : done ? T.greenText : T.grey400, marginTop:2, whiteSpace:"nowrap" }}>{["Entity","Bank","Address"][i]}</span>
            </div>
            {i < 2 && <div style={{ height:2, width:30, background: step > s + 1 ? T.greenText : step > s ? T.redPrimary : T.grey200, margin:"0 4px", marginBottom:14, transition:"background 0.2s" }} />}
          </div>
        );
      })}
    </div>
  );

  const SelectField = ({ label, value, onChange }) => (
    <div>
      <label style={{ fontSize:12, fontWeight:600, color:T.grey600, display:"block", marginBottom:4 }}>{label}</label>
      <select value={value} onChange={onChange} style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1px solid ${T.grey200}`, fontSize:14, color:T.black, fontFamily:T.font, background:T.white, outline:"none", boxSizing:"border-box" }}>
        <option value="">Select...</option>
        {COUNTRY_CODES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
    </div>
  );

  return (
    <div style={{ position:"fixed", right:0, top:0, width:440, height:"100vh", background:T.white, boxShadow:"-4px 0 24px rgba(0,0,0,0.10)", zIndex:500, display:"flex", flexDirection:"column" }}>
      <div style={{ padding:"16px 24px", borderBottom:`1px solid ${T.grey100}`, flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:14 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <CurrencyLogo c={cur} size={36} />
            <div>
              <div style={{ fontSize:15, fontWeight:700, color:T.black }}>Add Beneficiary</div>
              <div style={{ fontSize:12, color:T.grey400 }}>{cur.code} · {cur.country}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ border:"none", background:"none", cursor:"pointer", fontSize:22, color:T.grey400, lineHeight:1 }}>×</button>
        </div>
        <StepDots />
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"20px 24px", display:"flex", flexDirection:"column", gap:14 }}>
        {step === 1 && (
          <>
            <div style={{ fontSize:14, fontWeight:700, color:T.black }}>Entity Information</div>
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:T.grey600, display:"block", marginBottom:6 }}>Entity Type</label>
              <div style={{ display:"flex", gap:8 }}>
                {["Business", "Individual"].map(type => (
                  <div key={type} onClick={() => setEntityType(type)} style={{ flex:1, padding:"10px", borderRadius:8, cursor:"pointer", border:`1.5px solid ${entityType === type ? T.redPrimary : T.grey200}`, background: entityType === type ? T.redGrad : T.white, color: entityType === type ? T.white : T.grey600, display:"flex", alignItems:"center", justifyContent:"center", gap:6, fontSize:13, fontWeight:600, transition:"all 0.15s" }}>
                    <span>{type === "Business" ? "🏢" : "👤"}</span>{type}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <Input label="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name" />
              <Input label="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name" />
            </div>
            {entityType === "Business" && (
              <div>
                <Input label="Company Name" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Legal company name" />
                <div style={{ fontSize:11, color:T.grey400, marginTop:4 }}>Enter the company's full legal name</div>
              </div>
            )}
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:T.grey600, display:"block", marginBottom:6 }}>Payment Method</label>
              <div style={{ background:T.purpleLight, border:`1px solid ${T.purpleBorder}`, borderRadius:8, padding:"12px 14px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <span style={{ fontSize:14, fontWeight:600, color:T.purplePrimary }}>SWIFT</span>
                <span style={{ fontSize:10, fontWeight:700, background:T.purpleGrad, color:T.white, padding:"2px 8px", borderRadius:20 }}>Only option</span>
              </div>
            </div>
            <Notice type="info">SWIFT payments are currently the only supported method for adding beneficiaries.</Notice>
          </>
        )}
        {step === 2 && (
          <>
            <div style={{ fontSize:14, fontWeight:700, color:T.black }}>Beneficiary Bank Details</div>
            <div>
              <Input label="Account Name *" value={accountName} onChange={e => setAccountName(e.target.value)} placeholder="Full name as it appears on the bank account" />
              <div style={{ fontSize:11, color:T.grey400, marginTop:4 }}>Full name as it appears on the bank account</div>
            </div>
            <div>
              <Input label="Account Number *" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} placeholder="Up to 17 digits" />
              <div style={{ fontSize:11, color:T.grey400, marginTop:4 }}>Up to 17 digits</div>
            </div>
            <SelectField label="Bank Country Code *" value={bankCountry} onChange={e => setBankCountry(e.target.value)} />
            <Input label="Bank Name *" value={bankName} onChange={e => setBankName(e.target.value)} placeholder="Name of the bank" />
            <div>
              <Input label="SWIFT Code *" value={swiftCode} onChange={e => setSwiftCode(e.target.value)} placeholder="8 or 11 character BIC code" />
              <div style={{ fontSize:11, color:T.grey400, marginTop:4 }}>8 or 11 character BIC code</div>
            </div>
            <div style={{ background:T.grey50, borderRadius:8, padding:"12px 14px" }}>
              <div style={{ fontSize:11, fontWeight:700, color:T.grey400, textTransform:"uppercase", letterSpacing:0.5, marginBottom:6 }}>Step 1 Summary</div>
              <div style={{ fontSize:13, fontWeight:600, color:T.black }}>{entityType === "Business" ? companyName : `${firstName} ${lastName}`}</div>
              <div style={{ fontSize:12, color:T.grey400 }}>{entityType}</div>
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <div style={{ fontSize:14, fontWeight:700, color:T.black }}>Beneficiary Address</div>
            <Input label="Street Address *" value={streetAddress} onChange={e => setStreetAddress(e.target.value)} placeholder="Street address" />
            <Input label="City *" value={city} onChange={e => setCity(e.target.value)} placeholder="City" />
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <Input label="State / Province" value={stateVal} onChange={e => setStateVal(e.target.value)} placeholder="State (optional)" />
              <Input label="Postcode" value={postcode} onChange={e => setPostcode(e.target.value)} placeholder="Postcode (optional)" />
            </div>
            <SelectField label="Country Code *" value={country} onChange={e => setCountry(e.target.value)} />
            <div style={{ background:T.grey50, borderRadius:8, padding:"14px" }}>
              <div style={{ fontSize:11, fontWeight:700, color:T.grey400, textTransform:"uppercase", letterSpacing:0.5, marginBottom:10 }}>Review Summary</div>
              {[["Name", entityType === "Business" ? companyName : `${firstName} ${lastName}`], ["Type", entityType], ["Account Name", accountName], ["Account #", `••••${accountNumber.slice(-4) || "----"}`], ["Bank", bankName], ["SWIFT", swiftCode], ["Bank Country", bankCountry]].map(([lbl, val]) => (
                <div key={lbl} style={{ display:"flex", justifyContent:"space-between", marginBottom:6, fontSize:13 }}>
                  <span style={{ color:T.grey400 }}>{lbl}</span>
                  <span style={{ fontWeight:600, color:T.black }}>{val || "—"}</span>
                </div>
              ))}
            </div>
            <Notice type="info">Please double-check all details carefully. Incorrect beneficiary information may result in failed or misdirected payments.</Notice>
          </>
        )}
      </div>
      <div style={{ flexShrink:0 }}>
        <div style={{ height:4, background:T.grey100 }}>
          <div style={{ height:"100%", background:T.redGrad, width:`${progressPct}%`, transition:"width 0.3s" }} />
        </div>
        <div style={{ padding:"12px 24px 16px", borderTop:`1px solid ${T.grey100}` }}>
          <div style={{ fontSize:11, color:T.grey400, marginBottom:10 }}>Step {step} of 3</div>
          <div style={{ display:"flex", gap:10 }}>
            {step > 1 && <BtnSecondary onClick={() => setStep(s => s - 1)} style={{ flex:1 }}>← Back</BtnSecondary>}
            {step < 3
              ? <BtnPrimary onClick={() => setStep(s => s + 1)} disabled={!canContinue} style={{ flex:1 }}>Continue →</BtnPrimary>
              : <BtnPrimary onClick={handleAdd} disabled={!canContinue} style={{ flex:1 }}>Add Beneficiary</BtnPrimary>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   BENEFICIARIES TABLE
═══════════════════════════════════════════════════════════ */
function BeneficiariesTable({ cur, beneficiaries, onSend, onAddBenef }) {
  const TH = { padding:"10px 16px", fontSize:11, fontWeight:700, color:T.grey400, textTransform:"uppercase", letterSpacing:0.5, background:"#FAFAFA", textAlign:"left", borderBottom:`1.5px solid ${T.grey100}` };
  const TD = { padding:"13px 16px", fontSize:13, color:T.black, borderBottom:`1px solid #F5F5F5` };
  return (
    <div style={{ background:T.white, borderRadius:12, boxShadow:"0 1px 4px rgba(0,0,0,0.06)", overflow:"hidden" }}>
      <div style={{ padding:"16px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:`1px solid ${T.grey100}` }}>
        <div>
          <div style={{ fontSize:15, fontWeight:700, color:T.black }}>Beneficiaries</div>
          <div style={{ fontSize:12, color:T.grey400 }}>{beneficiaries.length} recipient{beneficiaries.length !== 1 ? "s" : ""} added</div>
        </div>
        <BtnPrimary onClick={onAddBenef} style={{ fontSize:13, padding:"8px 14px" }}>+ Add Beneficiary</BtnPrimary>
      </div>
      {beneficiaries.length === 0 ? (
        <div style={{ padding:"48px 20px", textAlign:"center" }}>
          <div style={{ fontSize:40, marginBottom:12 }}>👤</div>
          <div style={{ fontSize:15, fontWeight:700, color:T.black, marginBottom:6 }}>No beneficiaries yet</div>
          <div style={{ fontSize:13, color:T.grey400, marginBottom:20 }}>Add your first beneficiary to start sending payments.</div>
          <BtnPrimary onClick={onAddBenef} style={{ padding:"10px 24px" }}>Add First Beneficiary</BtnPrimary>
        </div>
      ) : (
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr>
              <th style={TH}>Name</th>
              <th style={TH}>Payment Method</th>
              <th style={TH}>Type</th>
              <th style={TH}>Status</th>
              <th style={TH}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {beneficiaries.map(b => (
              <tr key={b.id} onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"} onMouseLeave={e => e.currentTarget.style.background = "transparent"} style={{ cursor:"default" }}>
                <td style={TD}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <Avatar name={b.name} size={32} fontSize={12} />
                    <div>
                      <div style={{ fontWeight:600, fontSize:13 }}>{b.name}</div>
                      <div style={{ fontSize:11, color:T.grey400 }}>{b.bank}</div>
                    </div>
                  </div>
                </td>
                <td style={TD}>{pmBadge(b.paymentMethod)}</td>
                <td style={TD}>
                  <span style={{ padding:"3px 10px", borderRadius:20, fontSize:12, fontWeight:600, background: b.type === "Business" ? "#EEF2FF" : "#F5F3FF", color: b.type === "Business" ? "#4F46E5" : "#7C3AED" }}>{b.type}</span>
                </td>
                <td style={TD}><Pill label={b.status} /></td>
                <td style={TD}>
                  <div style={{ display:"flex", gap:6 }}>
                    <BtnPrimary onClick={() => onSend(b)} style={{ fontSize:12, padding:"6px 12px" }}>Send</BtnPrimary>
                    <BtnSecondary style={{ fontSize:12, padding:"6px 12px" }}>Edit</BtnSecondary>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

/* helpers for CurrencyDetailScreen — extracted to honour rules-of-hooks */
function DetailCtaBtn({ icon, label, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ flex:1, padding:"14px 20px", background: hov ? T.redLight : T.white, border:`1px solid ${hov ? T.redPrimary : T.grey200}`, borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:600, color: hov ? T.redPrimary : T.black, display:"flex", alignItems:"center", justifyContent:"center", gap:8, transition:"all 0.15s", boxShadow:"0 1px 4px rgba(0,0,0,0.06)", fontFamily:T.font }}>
      <span style={{ fontSize:16 }}>{icon}</span>{label}
    </button>
  );
}

function BankDetailRow({ label, value }) {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ display:"flex", alignItems:"center", borderBottom:`1px solid ${T.grey100}` }}>
      <div style={{ width:180, padding:"14px 20px", fontSize:13, fontWeight:600, color:T.grey600, flexShrink:0 }}>{label}</div>
      <div style={{ flex:1, display:"flex", alignItems:"center", gap:10, padding:"14px 0" }}>
        {value
          ? <>
              <span style={{ fontFamily:"monospace", fontSize:13 }}>{value}</span>
              <button onClick={() => { navigator.clipboard?.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1600); }}
                style={{ fontSize:12, padding:"3px 8px", borderRadius:6, border:`1px solid ${copied ? T.greenBorder : T.grey200}`, background: copied ? T.greenBg : T.white, color: copied ? T.greenText : T.grey600, cursor:"pointer", fontFamily:T.font }}>
                {copied ? "✓" : "Copy"}
              </button>
            </>
          : <span style={{ color:T.grey300, fontStyle:"italic", fontSize:13 }}>— Not set up —</span>
        }
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CURRENCY DETAIL SCREEN   ← defined BEFORE DashboardAppScreen
═══════════════════════════════════════════════════════════ */
function CurrencyDetailScreen({ cur, setPage, onNav, dummy, setDummy }) {
  const [showReceive, setShowReceive] = useState(false);
  const [showSend, setShowSend] = useState(false);
  const [showAddBenef, setShowAddBenef] = useState(false);
  const [sendBenef, setSendBenef] = useState(null);
  const [beneficiaries, setBeneficiaries] = useState(() =>
    dummy ? (ALL_BENEFICIARIES[cur.code] || []) : []
  );

  useEffect(() => {
    setBeneficiaries(dummy ? (ALL_BENEFICIARIES[cur.code] || []) : []);
  }, [dummy, cur.code]);

  const transactions = dummy ? TRANSACTIONS : [];

  const openSend = (benef = null) => { setSendBenef(benef); setShowSend(true); };

  const TH = { padding:"10px 16px", fontSize:11, fontWeight:700, color:T.grey400, textTransform:"uppercase", letterSpacing:0.5, background:"#FAFAFA", textAlign:"left", borderBottom:`1.5px solid ${T.grey100}` };
  const TD = { padding:"13px 16px", fontSize:13, color:T.black, borderBottom:`1px solid #F5F5F5` };

  return (
    <AppShell activePage="currency_detail" onNav={onNav} setPage={setPage} dummy={dummy} setDummy={setDummy}>
      <div style={{ padding:"24px 28px", minHeight:"calc(100vh - 56px)", background:T.pageBg }}>
        <Breadcrumb items={[{ label:"Home", onClick:() => setPage("dashboard_app") }, { label:"Multicurrency Accounts", onClick:() => setPage("dashboard_app") }, { label:`${cur.code} Account` }]} />

        {/* Header card */}
        <div style={{ background:cur.cardBg, border:`1px solid ${cur.cardAccent}40`, borderRadius:12, padding:"20px 24px", marginBottom:20, display:"flex", alignItems:"center", gap:16, boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
          <CurrencyLogo c={cur} size={56} />
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
              <span style={{ fontSize:22, fontWeight:700, color:T.black }}>{cur.code}</span>
              <Pill label={cur.status} />
            </div>
            <div style={{ fontSize:14, color:T.grey600 }}>{cur.country}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:11, color:T.grey400, marginBottom:4 }}>Available Balance</div>
            <div style={{ fontSize:28, fontWeight:700, color:T.black }}>
              {dummy ? `${cur.symbol}${cur.balance}` : <span style={{ color:T.grey300 }}>—</span>}
            </div>
            {dummy && cur.pending !== "0.00" && (
              <div style={{ fontSize:12, color:T.grey400 }}>+ {cur.symbol}{cur.pending} pending</div>
            )}
          </div>
        </div>

        {/* 3 action CTAs */}
        <div style={{ display:"flex", gap:12, marginBottom:20 }}>
          <DetailCtaBtn icon="📥" label="Share Account Details" onClick={() => setShowReceive(true)} />
          <DetailCtaBtn icon="📤" label="Make a Payment"        onClick={() => openSend()} />
          <DetailCtaBtn icon="🏦" label="Initiate Settlement"    onClick={() => setShowAddBenef(true)} />
        </div>

        {/* Bank Details */}
        <div style={{ background:T.white, borderRadius:12, marginBottom:20, boxShadow:"0 1px 4px rgba(0,0,0,0.06)", overflow:"hidden" }}>
          <div style={{ background:"#FAFAFA", padding:"10px 20px", borderBottom:`1px solid ${T.grey100}`, fontSize:11, fontWeight:700, color:T.grey400, textTransform:"uppercase", letterSpacing:0.5 }}>Account / Bank Details</div>
          <BankDetailRow label="Account / IBAN" value={dummy ? cur.acct : null} />
          <BankDetailRow label="SWIFT / BIC"    value={dummy ? cur.swift : null} />
          <BankDetailRow label="Bank Name"      value={dummy ? cur.bank : null} />
        </div>

        {/* Beneficiaries — full width */}
        <BeneficiariesTable cur={cur} beneficiaries={beneficiaries} onSend={openSend} onAddBenef={() => setShowAddBenef(true)} />

        {/* Recent Transactions — full width below beneficiaries */}
        <div style={{ background:T.white, borderRadius:12, boxShadow:"0 1px 4px rgba(0,0,0,0.06)", overflow:"hidden", marginTop:20, marginBottom:20 }}>
          <div style={{ padding:"16px 20px", borderBottom:`1px solid ${T.grey100}` }}>
            <div style={{ fontSize:15, fontWeight:700, color:T.black }}>Recent Transactions</div>
          </div>
          {transactions.length === 0 ? (
            <div style={{ padding:"48px 20px", textAlign:"center" }}>
              <div style={{ fontSize:36, marginBottom:10 }}>📭</div>
              <div style={{ fontSize:14, fontWeight:700, color:T.black, marginBottom:6 }}>No transactions yet</div>
              <div style={{ fontSize:13, color:T.grey400 }}>Transactions will appear here once your account is active.</div>
            </div>
          ) : (
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr>
                <th style={TH}>Date</th>
                <th style={TH}>Description</th>
                <th style={{ ...TH, textAlign:"right" }}>Amount</th>
                <th style={TH}>Status</th>
              </tr></thead>
              <tbody>
                {transactions.map((tx, i) => (
                  <tr key={i} onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={TD}><span style={{ color:T.grey400, fontSize:12 }}>{tx.date}</span></td>
                    <td style={TD}>{tx.desc}</td>
                    <td style={{ ...TD, textAlign:"right", fontWeight:600, color: tx.type === "Credit" ? T.greenText : T.redErrText }}>{tx.amount}</td>
                    <td style={TD}><Pill label={tx.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Danger Zone */}
        <div style={{ marginTop:32, border:`1px solid ${T.redErrBorder}`, borderRadius:12, padding:"20px 24px", background:T.redErrBg, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontSize:14, fontWeight:700, color:T.redErrText, marginBottom:3 }}>Close Account</div>
            <div style={{ fontSize:13, color:T.redErrText, opacity:0.8 }}>Permanently close this {cur.code} wallet. Any remaining balance must be converted first.</div>
          </div>
          <button onClick={() => setPage("remove_modal")}
            style={{ flexShrink:0, marginLeft:24, padding:"10px 20px", fontSize:13, fontWeight:600, color:T.redErrText, background:T.white, border:`1.5px solid ${T.redErrBorder}`, borderRadius:8, cursor:"pointer", fontFamily:T.font }}>
            🗑 Close Account
          </button>
        </div>
        <div style={{ marginTop:16 }}><Footer /></div>
      </div>

      {showReceive && <ReceiveModal cur={cur} onClose={() => setShowReceive(false)} />}
      {showSend && <SendPanel cur={cur} beneficiaries={beneficiaries} initialBenef={sendBenef} onClose={() => { setShowSend(false); setSendBenef(null); }} />}
      {showAddBenef && <AddBeneficiaryPanel cur={cur} onClose={() => setShowAddBenef(false)} onAdd={b => setBeneficiaries(prev => [...prev, b])} />}
    </AppShell>
  );
}

/* ═══════════════════════════════════════════════════════════
   CURRENCY CARD (used in Dashboard grid)
═══════════════════════════════════════════════════════════ */
function CurrencyCard({ c, onClick, dummy }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background:c.cardBg, border:`1px solid ${c.cardAccent}40`, borderRadius:12, padding:"16px", cursor:"pointer", transform: hov ? "translateY(-2px)" : "none", boxShadow: hov ? "0 4px 16px rgba(0,0,0,0.08)" : "0 1px 4px rgba(0,0,0,0.06)", transition:"all 0.15s" }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
        <CurrencyLogo c={c} size={32} />
        <div>
          <div style={{ fontSize:14, fontWeight:700, color:T.black }}>{c.code}</div>
          <div style={{ fontSize:11, color:T.grey400 }}>{c.country}</div>
        </div>
      </div>
      <div style={{ fontSize:17, fontWeight:700, color: dummy ? T.black : T.grey400, marginBottom:8 }}>
        {`${c.symbol}${c.balance}`}
      </div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <Pill label={c.status} />
        <span style={{ fontSize:12, color:T.redPrimary, fontWeight:600 }}>View →</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DASHBOARD APP SCREEN
═══════════════════════════════════════════════════════════ */
const INR_RATES = { USD: 84.0, EUR: 90.5, GBP: 106.5, AUD: 55.0, SGD: 62.5, HKD: 10.8 };

function DashboardAppScreen({ setPage, setDetailCurrency, onNav, dummy, setDummy }) {
  const currencies = dummy ? DUMMY_CURRENCIES : EMPTY_CURRENCIES;
  const transactions = dummy ? ALL_TRANSACTIONS : [];
  const activeCurrencies = currencies.filter(c => c.status === "Active");
  const curMap = DUMMY_CURRENCIES.reduce((acc, c) => ({ ...acc, [c.code]: c }), {});
  const totalINR = dummy
    ? DUMMY_CURRENCIES.reduce((sum, c) => sum + parseFloat(c.balance.replace(/,/g, "")) * (INR_RATES[c.code] || 1), 0)
    : 0;
  const fmtINR = "₹" + new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(totalINR);

  const handleCurrencyClick = (c) => { setDetailCurrency(c); setPage("currency_detail"); };

  return (
    <AppShell activePage="dashboard_app" onNav={onNav} setPage={setPage} dummy={dummy} setDummy={setDummy}>
      <div style={{ padding:"24px 28px", minHeight:"calc(100vh - 56px)", background:T.pageBg }}>
        <Breadcrumb items={[{ label:"Home" }, { label:"Multicurrency Accounts" }]} />
        <div style={{ marginBottom:24 }}>
          <h1 style={{ fontSize:24, fontWeight:700, color:T.black, margin:"0 0 4px" }}>Multicurrency Accounts</h1>
          <p style={{ fontSize:14, color:T.grey600, margin:0 }}>Manage your global currency wallets and payments</p>
        </div>

        {/* Stat cards */}
        <div style={{ display:"flex", gap:16, marginBottom:24 }}>
          {[
            { value:fmtINR,                    label:"Total Balance in Home Currency", bg:T.white,    color:T.black,     valueSize:22 },
            { value:activeCurrencies.length,   label:"Active Wallets",                bg:T.greenBg,  color:T.greenText, valueSize:28 },
          ].map(stat => (
            <div key={stat.label} style={{ flex:1, background:stat.bg, borderRadius:12, padding:"20px", boxShadow:"0 1px 4px rgba(0,0,0,0.06)", border:`1px solid ${stat.bg === T.white ? T.grey100 : "transparent"}` }}>
              <div style={{ fontSize:stat.valueSize, fontWeight:700, color:stat.color, marginBottom:4 }}>{stat.value}</div>
              <div style={{ fontSize:12, color:stat.color, opacity:0.8 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Currency Wallets — full width */}
        <div style={{ marginBottom:28 }}>
          <div style={{ fontSize:16, fontWeight:700, color:T.black, marginBottom:14 }}>Currency Wallets</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
            {currencies.map(c => <CurrencyCard key={c.code} c={c} onClick={() => handleCurrencyClick(c)} dummy={dummy} />)}
            <AddCurrencyCard onClick={() => setPage("add_modal")} />
          </div>
        </div>

        {/* Recent Activity — full width below */}
        <div style={{ background:T.white, borderRadius:12, boxShadow:"0 1px 4px rgba(0,0,0,0.06)", overflow:"hidden" }}>
          <div style={{ padding:"16px 20px", borderBottom:`1px solid ${T.grey100}` }}>
            <div style={{ fontSize:15, fontWeight:700, color:T.black }}>Recent Activity</div>
          </div>
          {transactions.length === 0 ? (
            <div style={{ padding:"40px 20px", textAlign:"center" }}>
              <div style={{ fontSize:36, marginBottom:10 }}>📭</div>
              <div style={{ fontSize:14, fontWeight:700, color:T.black, marginBottom:6 }}>No activity yet</div>
              <div style={{ fontSize:12, color:T.grey400 }}>Recent transactions across all currencies will appear here.</div>
            </div>
          ) : (
            <div>
              {transactions.map((tx, i) => {
                const mc = curMap[tx.code] || DUMMY_CURRENCIES[0];
                const isCredit = tx.amount.startsWith("+");
                return (
                  <div key={i} style={{ padding:"12px 20px", borderBottom:`1px solid #F5F5F5`, display:"flex", alignItems:"center", gap:10 }}>
                    <CurrencyLogo c={mc} size={26} />
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:600, color:T.black }}>{tx.desc}</div>
                      <div style={{ fontSize:11, color:T.grey400 }}>{tx.date} · {tx.code}</div>
                    </div>
                    <div style={{ fontSize:13, fontWeight:600, color: isCredit ? T.greenText : T.redErrText }}>{tx.amount}</div>
                  </div>
                );
              })}
              <div style={{ padding:"12px 20px", textAlign:"center", fontSize:13, color:T.redPrimary, cursor:"pointer", fontWeight:600 }}>View all transactions →</div>
            </div>
          )}
        </div>
        <div style={{ marginTop:40 }}><Footer /></div>
      </div>
    </AppShell>
  );
}

function AddCurrencyCard({ onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ borderRadius:12, border:`2px dashed ${hov ? T.redPrimary : T.grey200}`, background: hov ? T.redLight : "transparent", padding:"20px", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8, minHeight:128, transition:"all 0.15s" }}>
      <div style={{ width:36, height:36, borderRadius:"50%", background: hov ? T.redLight : T.grey100, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, color: hov ? T.redPrimary : T.grey400, border:`1px solid ${hov ? T.redPrimary : "transparent"}` }}>+</div>
      <span style={{ fontSize:12, fontWeight:600, color: hov ? T.redPrimary : T.grey400 }}>Add Currency</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   LANDING SCREEN
═══════════════════════════════════════════════════════════ */
const LANDING_CURRENCIES = [
  { code:"USD", flag:"🇺🇸", name:"US Dollar" },
  { code:"EUR", flag:"🇪🇺", name:"Euro" },
  { code:"GBP", flag:"🇬🇧", name:"British Pound" },
  { code:"AUD", flag:"🇦🇺", name:"Australian Dollar" },
  { code:"CAD", flag:"🇨🇦", name:"Canadian Dollar" },
  { code:"SGD", flag:"🇸🇬", name:"Singapore Dollar" },
  { code:"HKD", flag:"🇭🇰", name:"Hong Kong Dollar" },
  { code:"JPY", flag:"🇯🇵", name:"Japanese Yen" },
  { code:"CNY", flag:"🇨🇳", name:"Chinese Yuan" },
  { code:"IDR", flag:"🇮🇩", name:"Indonesian Rupiah" },
  { code:"NZD", flag:"🇳🇿", name:"New Zealand Dollar" },
  { code:"AED", flag:"🇦🇪", name:"UAE Dirham" },
];

const MOCKUP_WALLETS = [
  { flag:"🇺🇸", code:"USD", country:"United States",  display:"$142,850.00" },
  { flag:"🇪🇺", code:"EUR", country:"European Union", display:"€98,440.50" },
  { flag:"🇬🇧", code:"GBP", country:"United Kingdom", display:"£67,320.00" },
  { flag:"🇦🇺", code:"AUD", country:"Australia",      display:"A$34,910.75" },
];

function LandingScreen({ setPage, onNav, dummy, setDummy }) {
  return (
    <AppShell activePage="landing" onNav={onNav} setPage={setPage} dummy={dummy} setDummy={setDummy}>

      {/* Hero */}
      <div style={{ padding:"80px 56px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:72, alignItems:"center", maxWidth:1200, margin:"0 auto" }}>
          {/* Left */}
          <div>
            <h1 style={{ fontSize:52, fontWeight:800, lineHeight:1.12, letterSpacing:"-1.5px", margin:"0 0 20px" }}>
              <span style={{ color:T.redPrimary }}>Dedicated Account for Every Currency.</span><br />
              <span style={{ color:T.black }}>Zero Hassle.</span>
            </h1>
            <p style={{ fontSize:15, color:T.grey600, lineHeight:1.65, margin:"0 0 28px" }}>
              Get 12 dedicated currency accounts — each with its own IBAN, routing number, and SWIFT code. Receive, hold, and send like a local, from one dashboard.
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:32 }}>
              {[
                { icon:"🏦", title:"12 Dedicated Currency Accounts", sub:"One account per currency — USD, EUR, GBP, AUD, SGD, HKD, and 6 more" },
                { icon:"🔄", title:"Live Exchange Rates", sub:"Convert between currencies at competitive mid-market rates" },
                { icon:"⚡", title:"Fast Payments", sub:"Send via SWIFT, SEPA, ACH, Faster Payments & more" },
              ].map(vp => (
                <div key={vp.title} style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                  <div style={{ width:36, height:36, borderRadius:8, background:T.white, border:`1px solid ${T.grey200}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>{vp.icon}</div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, color:T.black }}>{vp.title}</div>
                    <div style={{ fontSize:13, color:T.grey400 }}>{vp.sub}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:12, marginBottom:14 }}>
              <BtnPrimary onClick={() => setPage("setup")} style={{ fontSize:15, padding:"13px 28px" }}>👉 Open Global Account</BtnPrimary>
              <BtnSecondary style={{ fontSize:15, padding:"13px 24px" }}>Request a demo</BtnSecondary>
            </div>
            <div style={{ fontSize:12, color:T.grey300 }}>✓ No setup fees · ✓ KYB verified in 24h · ✓ Available in 50+ countries</div>
          </div>

          {/* Right — dashboard mockup */}
          <div style={{ background:T.white, borderRadius:16, boxShadow:"0 16px 60px rgba(0,0,0,0.16)", overflow:"hidden" }}>
            <div style={{ background:"#F0F0F0", padding:"10px 16px", borderBottom:`1px solid ${T.grey100}`, display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ width:10, height:10, borderRadius:"50%", background:"#FF5F57" }} />
              <div style={{ width:10, height:10, borderRadius:"50%", background:"#FFBD2E" }} />
              <div style={{ width:10, height:10, borderRadius:"50%", background:"#28CA41" }} />
              <div style={{ flex:1, background:T.white, borderRadius:4, height:20, marginLeft:8, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontSize:10, color:T.grey400 }}>app.peko.com/accounts</span>
              </div>
            </div>
            <div style={{ padding:20, background:"#F8F9FF" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <span style={{ fontSize:14, fontWeight:700, color:T.black }}>Your Wallets</span>
                <span style={{ fontSize:12, color:T.redPrimary, fontWeight:600 }}>+ Add Currency</span>
              </div>
              {MOCKUP_WALLETS.map(w => (
                <div key={w.code} style={{ background:T.white, borderRadius:10, padding:"10px 14px", display:"flex", alignItems:"center", gap:10, border:`1px solid ${T.grey100}`, marginBottom:8 }}>
                  <span style={{ fontSize:36, lineHeight:1 }}>{w.flag}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:700, color:T.black }}>{w.code}</div>
                    <div style={{ fontSize:12, color:T.grey400 }}>{w.country}</div>
                  </div>
                  <div style={{ fontSize:15, fontWeight:700, color:T.black }}>{w.display}</div>
                </div>
              ))}
              <div style={{ display:"flex", gap:8, marginTop:14 }}>
                <div style={{ flex:1, background:T.redGrad, color:T.white, borderRadius:8, padding:"9px", textAlign:"center", fontSize:12, fontWeight:600 }}>Send</div>
                <div style={{ flex:1, background:T.grey50, color:T.black, border:`1px solid ${T.grey200}`, borderRadius:8, padding:"9px", textAlign:"center", fontSize:12, fontWeight:600 }}>Receive</div>
                <div style={{ flex:1, background:T.grey50, color:T.black, border:`1px solid ${T.grey200}`, borderRadius:8, padding:"9px", textAlign:"center", fontSize:12, fontWeight:600 }}>Convert</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Currency Strip */}
      <div style={{ background:T.white, borderTop:`1px solid ${T.grey100}`, borderBottom:`1px solid ${T.grey100}`, padding:"40px 56px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ fontSize:14, fontWeight:600, color:T.grey400, marginBottom:8 }}>12 dedicated currency accounts available</div>
          <div style={{ fontSize:22, fontWeight:700, color:T.black, marginBottom:20 }}>One dedicated account per currency. No pooling. No confusion.</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
            {LANDING_CURRENCIES.map(c => (
              <div key={c.code} style={{ display:"flex", alignItems:"center", gap:6, background:T.grey50, border:`1px solid ${T.grey200}`, borderRadius:99, padding:"8px 16px" }}>
                <span style={{ fontSize:16 }}>{c.flag}</span>
                <span style={{ fontSize:13, fontWeight:700, color:T.black }}>{c.code}</span>
                <span style={{ fontSize:12, color:T.grey400 }}>{c.name}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize:12, color:T.grey400, marginTop:16 }}>Each account comes with a dedicated IBAN, account number, SWIFT code, and local routing details.</div>
        </div>
      </div>

      {/* Features Grid */}
      <div style={{ background:T.grey50, padding:"64px 56px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <h2 style={{ fontSize:28, fontWeight:700, color:T.black, textAlign:"center", margin:"0 0 8px" }}>Everything your business needs</h2>
          <p style={{ fontSize:14, color:T.grey400, textAlign:"center", margin:"0 0 40px" }}>A complete global payments infrastructure built for modern businesses</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
            {[
              { icon:"🏦", title:"Dedicated Local Accounts",   desc:"Get real bank account details for each currency — IBAN, routing, and SWIFT included." },
              { icon:"⚡", title:"Instant SWIFT Payments",     desc:"Send international wires via SWIFT to 150+ countries with same-day processing." },
              { icon:"🔄", title:"Real-Time FX Conversion",   desc:"Convert between currencies at competitive mid-market rates with live pricing." },
              { icon:"📊", title:"Unified Dashboard",         desc:"Track all your multicurrency balances, transactions, and payments in one place." },
              { icon:"👤", title:"Beneficiary Management",    desc:"Save recipients once and send to them again in seconds — no re-entering details." },
              { icon:"🔒", title:"Bank-Grade Security",       desc:"256-bit encryption, two-factor auth, and full regulatory compliance built-in." },
            ].map(f => (
              <div key={f.title} style={{ background:T.white, borderRadius:12, padding:"24px", boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
                <div style={{ width:40, height:40, borderRadius:10, background:T.redLight, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, marginBottom:14 }}>{f.icon}</div>
                <div style={{ fontSize:15, fontWeight:700, color:T.black, marginBottom:6 }}>{f.title}</div>
                <div style={{ fontSize:13, color:T.grey400, lineHeight:1.55 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </AppShell>
  );
}

/* ═══════════════════════════════════════════════════════════
   SETUP SCREEN
═══════════════════════════════════════════════════════════ */
const SETUP_CURRENCY_ROWS = [
  { group:"popular", code:"USD", country:"United States",  flag:"🇺🇸" },
  { group:"popular", code:"GBP", country:"United Kingdom", flag:"🇬🇧" },
  { group:"popular", code:"EUR", country:"European Union", flag:"🇪🇺" },
  { group:"other",   code:"AUD", country:"Australia",      flag:"🇦🇺" },
  { group:"other",   code:"CAD", country:"Canada",         flag:"🇨🇦" },
  { group:"other",   code:"HKD", country:"Hong Kong",      flag:"🇭🇰" },
  { group:"other",   code:"CNY", country:"China",          flag:"🇨🇳" },
  { group:"other",   code:"IDR", country:"Indonesia",      flag:"🇮🇩" },
  { group:"other",   code:"JPY", country:"Japan",          flag:"🇯🇵" },
  { group:"other",   code:"NZD", country:"New Zealand",    flag:"🇳🇿" },
  { group:"other",   code:"SGD", country:"Singapore",      flag:"🇸🇬" },
];

function SetupScreen({ setPage, onNav, dummy, setDummy }) {
  const [step, setStep] = useState(1);
  const [bizName, setBizName] = useState("Sigma Dt3 Logistics");
  const [bizType, setBizType] = useState("Limited Company");
  const [bizEmail, setBizEmail] = useState("finance@sigmadt3.com");
  const [phone, setPhone] = useState("+971 50 123 4567");
  const [selected, setSelected] = useState(new Set(["USD","GBP","EUR"]));
  const [msaStatus, setMsaStatus] = useState("pending"); // pending | signing | signed | error

  const toggleCurrency = code => setSelected(prev => { const n = new Set(prev); n.has(code) ? n.delete(code) : n.add(code); return n; });
  const popular = SETUP_CURRENCY_ROWS.filter(r => r.group === "popular");
  const others  = SETUP_CURRENCY_ROWS.filter(r => r.group === "other");

  const STEP_LABELS = ["Business Info", "Currencies", "Sign MSA"];

  const SetupStepper = () => (
    <div style={{ display:"flex", alignItems:"center" }}>
      {[1, 2, 3].map((s, i) => {
        const done = step > s, active = step === s;
        return (
          <div key={s} style={{ display:"flex", alignItems:"center" }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
              <div style={{ width:28, height:28, borderRadius:"50%", background: done ? T.greenText : active ? T.redPrimary : T.grey200, color:T.white, fontSize:13, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>{done ? "✓" : s}</div>
              <span style={{ fontSize:11, color: active ? T.redPrimary : done ? T.greenText : T.grey400, marginTop:3 }}>{STEP_LABELS[i]}</span>
            </div>
            {i < 2 && <div style={{ height:2, width:60, background: step > s ? T.greenText : T.grey200, margin:"0 8px", marginBottom:18 }} />}
          </div>
        );
      })}
    </div>
  );

  const handleESign = () => {
    setMsaStatus("signing");
    // Simulate eSign provider flow (replace setTimeout with DocuSign/Digio/SignDesk SDK call)
    setTimeout(() => setMsaStatus("signed"), 2200);
  };

  return (
    <AppShell activePage="setup" onNav={onNav} setPage={setPage} dummy={dummy} setDummy={setDummy}>
      <div style={{ maxWidth:560, margin:"0 auto", padding:"48px 24px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:32 }}>
          <SetupStepper />
          <BtnSecondary onClick={() => setPage("landing")} style={{ fontSize:13, padding:"8px 16px" }}>Exit</BtnSecondary>
        </div>

        {step === 1 ? (
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:T.redPrimary, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Step 1 of 3</div>
            <h2 style={{ fontSize:24, fontWeight:800, color:T.black, margin:"0 0 6px" }}>Business Information Verification</h2>
            <p style={{ fontSize:14, color:T.grey400, margin:"0 0 28px" }}>Please review and confirm your business details below.</p>
            <div style={{ background:T.white, borderRadius:12, padding:24, boxShadow:"0 1px 4px rgba(0,0,0,0.06)", display:"flex", flexDirection:"column", gap:16 }}>
              <Input label="Business Name" value={bizName} onChange={e => setBizName(e.target.value)} />
              <Input label="Business Type" value={bizType} onChange={e => setBizType(e.target.value)} />
              <Input label="Business Email" value={bizEmail} onChange={e => setBizEmail(e.target.value)} />
              <Input label="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} />
              <BtnPrimary onClick={() => setStep(2)} style={{ width:"100%", padding:"13px" }}>Proceed →</BtnPrimary>
            </div>
          </div>

        ) : step === 2 ? (
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:T.redPrimary, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Step 2 of 3</div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
              <h2 style={{ fontSize:24, fontWeight:800, color:T.black, margin:0 }}>Select Currency Accounts</h2>
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                <span style={{ fontSize:12, color:T.grey400 }}>{selected.size} selected</span>
                <span onClick={() => setSelected(new Set())} style={{ fontSize:12, color:T.redPrimary, cursor:"pointer", fontWeight:600 }}>Clear all</span>
              </div>
            </div>
            <p style={{ fontSize:14, color:T.grey400, margin:"0 0 20px" }}>Choose the currencies you want to receive and hold funds in.</p>
            <div style={{ background:T.white, borderRadius:12, boxShadow:"0 1px 4px rgba(0,0,0,0.06)", marginBottom:14, overflow:"hidden" }}>
              <div style={{ background:T.amberBg, padding:"10px 16px", display:"flex", alignItems:"center", gap:6, borderBottom:`1px solid ${T.amberBorder}` }}>
                <span>⭐</span><span style={{ fontSize:13, fontWeight:700, color:T.amberText }}>Popular Accounts</span>
              </div>
              {popular.map(row => <SetupCurrencyRow key={row.code} row={row} selected={selected.has(row.code)} onToggle={() => toggleCurrency(row.code)} />)}
            </div>
            <div style={{ background:T.white, borderRadius:12, boxShadow:"0 1px 4px rgba(0,0,0,0.06)", marginBottom:20, overflow:"hidden" }}>
              <div style={{ padding:"10px 16px", borderBottom:`1px solid ${T.grey100}` }}>
                <span style={{ fontSize:13, fontWeight:700, color:T.black }}>Other Currencies</span>
              </div>
              {others.map(row => <SetupCurrencyRow key={row.code} row={row} selected={selected.has(row.code)} onToggle={() => toggleCurrency(row.code)} />)}
            </div>
            {selected.size > 0 && (
              <div style={{ background:T.greenBg, border:`1px solid ${T.greenBorder}`, borderRadius:10, padding:"12px 16px", marginBottom:20, display:"flex", flexWrap:"wrap", gap:6, alignItems:"center" }}>
                <span style={{ fontSize:12, fontWeight:600, color:T.greenText, marginRight:4 }}>Selected:</span>
                {[...selected].map(code => {
                  const row = SETUP_CURRENCY_ROWS.find(r => r.code === code);
                  return <span key={code} style={{ background:T.greenText, color:T.white, borderRadius:20, padding:"3px 10px", fontSize:12, fontWeight:600 }}>{row?.flag} {code}</span>;
                })}
              </div>
            )}
            <div style={{ display:"flex", gap:10 }}>
              <BtnSecondary onClick={() => setStep(1)} style={{ flex:1, padding:"12px" }}>← Back</BtnSecondary>
              <BtnPrimary onClick={() => setStep(3)} style={{ flex:1, padding:"12px" }}>Next →</BtnPrimary>
            </div>
          </div>

        ) : (
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:T.redPrimary, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Step 3 of 3</div>
            <h2 style={{ fontSize:24, fontWeight:800, color:T.black, margin:"0 0 6px" }}>Sign Master Services Agreement</h2>
            <p style={{ fontSize:14, color:T.grey400, margin:"0 0 24px" }}>Please review and eSign the MSA before proceeding.</p>

            {/* Document preview card */}
            <div style={{ background:T.white, borderRadius:12, boxShadow:"0 1px 4px rgba(0,0,0,0.06)", marginBottom:16, overflow:"hidden" }}>
              <div style={{ padding:"20px" }}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:14, marginBottom:20 }}>
                  <div style={{ width:44, height:52, borderRadius:6, background:"#FEE2E2", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:22 }}>📄</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:700, color:T.black, marginBottom:3 }}>Decfin_IFSC_MSA_Template.pdf</div>
                    <div style={{ fontSize:12, color:T.grey400 }}>Master Services Agreement · 20 pages</div>
                  </div>
                  {msaStatus === "signed"  && <span style={{ background:T.greenBg,   color:T.greenText,   border:`1px solid ${T.greenBorder}`,   borderRadius:20, padding:"3px 10px", fontSize:12, fontWeight:600, flexShrink:0 }}>✓ Signed</span>}
                  {msaStatus === "pending" && <span style={{ background:T.amberBg,   color:T.amberText,   border:`1px solid ${T.amberBorder}`,   borderRadius:20, padding:"3px 10px", fontSize:12, fontWeight:600, flexShrink:0 }}>Awaiting signature</span>}
                  {msaStatus === "signing" && <span style={{ background:T.amberBg,   color:T.amberText,   border:`1px solid ${T.amberBorder}`,   borderRadius:20, padding:"3px 10px", fontSize:12, fontWeight:600, flexShrink:0 }}>Signing…</span>}
                  {msaStatus === "error"   && <span style={{ background:T.redErrBg,  color:T.redErrText,  border:`1px solid ${T.redErrBorder}`,  borderRadius:20, padding:"3px 10px", fontSize:12, fontWeight:600, flexShrink:0 }}>Failed</span>}
                </div>
                <div style={{ borderTop:`1px solid ${T.grey100}`, paddingTop:16, display:"flex", flexDirection:"column", gap:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:12, color:T.grey400, fontWeight:500 }}>Signer (Customer)</span>
                    <span style={{ fontSize:12, color:T.black, fontWeight:600 }}>{bizName}</span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:16 }}>
                    <span style={{ fontSize:12, color:T.grey400, fontWeight:500, flexShrink:0 }}>Counterparty</span>
                    <span style={{ fontSize:12, color:T.black, fontWeight:600, textAlign:"right" }}>DecFin Fintech Services IFSC Private Limited</span>
                  </div>
                </div>
              </div>
            </div>

            {msaStatus === "error" && (
              <div style={{ background:T.redErrBg, border:`1px solid ${T.redErrBorder}`, borderRadius:10, padding:"12px 16px", marginBottom:16, fontSize:13, color:T.redErrText, fontWeight:500 }}>
                eSign failed or timed out. Please try again.
              </div>
            )}

            <div style={{ display:"flex", gap:10, marginBottom:12 }}>
              {msaStatus === "signed" ? (
                <div style={{ flex:1, background:T.greenBg, border:`1px solid ${T.greenBorder}`, borderRadius:8, padding:"13px", textAlign:"center", fontSize:14, fontWeight:700, color:T.greenText }}>✓ Document Signed</div>
              ) : (
                <BtnPrimary
                  onClick={msaStatus !== "signing" ? handleESign : undefined}
                  style={{ flex:1, padding:"13px", opacity: msaStatus === "signing" ? 0.7 : 1, cursor: msaStatus === "signing" ? "wait" : "pointer" }}
                >
                  {msaStatus === "signing" ? "Opening eSign…" : msaStatus === "error" ? "Try Again" : "Review & eSign"}
                </BtnPrimary>
              )}
              <BtnSecondary style={{ padding:"13px 18px", flexShrink:0 }}>⬇ Download PDF</BtnSecondary>
            </div>

            <div style={{ display:"flex", gap:10 }}>
              <BtnSecondary onClick={() => setStep(2)} style={{ flex:1, padding:"12px" }}>← Back</BtnSecondary>
              <BtnPrimary
                onClick={() => { if (msaStatus === "signed") setPage("initialising"); }}
                style={{ flex:1, padding:"12px", opacity: msaStatus === "signed" ? 1 : 0.4, cursor: msaStatus === "signed" ? "pointer" : "not-allowed" }}
              >
                Submit Request →
              </BtnPrimary>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function SetupCurrencyRow({ row, selected, onToggle }) {
  return (
    <div onClick={onToggle} style={{ padding:"12px 16px", borderBottom:`1px solid ${T.grey100}`, display:"flex", alignItems:"center", gap:12, cursor:"pointer", background: selected ? "#FFF5F5" : "transparent", transition:"background 0.1s" }}>
      <div style={{ width:18, height:18, borderRadius:4, border:`2px solid ${selected ? T.redPrimary : T.grey200}`, background: selected ? T.redPrimary : T.white, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.15s" }}>
        {selected && <span style={{ color:T.white, fontSize:11, fontWeight:700 }}>✓</span>}
      </div>
      <span style={{ fontSize:18 }}>{row.flag}</span>
      <div style={{ flex:1 }}>
        <span style={{ fontSize:13, fontWeight:600, color:T.black }}>{row.country}</span>
        <span style={{ fontSize:12, color:T.grey400, marginLeft:6 }}>{row.code}</span>
      </div>
      <Pill label="Active" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   INITIALISING SCREEN
═══════════════════════════════════════════════════════════ */
function InitialisingScreen({ setPage, onNav, dummy, setDummy }) {
  const [dots, setDots] = useState(".");
  useEffect(() => {
    const t = setInterval(() => setDots(d => d.length >= 3 ? "." : d + "."), 500);
    return () => clearInterval(t);
  }, []);

  const milestones = [
    { label:"Request Submitted",     status:"done" },
    { label:"Verifying Details",     status:"done" },
    { label:"Creating Accounts",     status:"active" },
    { label:"Sharing Account Details", status:"pending" },
  ];

  return (
    <AppShell activePage="initialising" onNav={onNav} setPage={setPage} dummy={dummy} setDummy={setDummy}>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 24px", minHeight:`calc(100vh - ${T.topbarH}px)` }}>
      <div style={{ maxWidth:480, width:"100%", textAlign:"center" }}>
        <div style={{ width:72, height:72, borderRadius:16, background:T.redGrad, display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, margin:"0 auto 24px" }}>🌍</div>
        <h1 style={{ fontSize:26, fontWeight:800, color:T.black, margin:"0 0 10px" }}>We're getting things ready!</h1>
        <p style={{ fontSize:15, color:T.grey400, margin:"0 0 32px", lineHeight:1.65 }}>Sit back and relax ☕ — we're setting up your multicurrency accounts. This usually takes just a moment.</p>
        <div style={{ background:T.white, borderRadius:12, boxShadow:"0 1px 4px rgba(0,0,0,0.06)", overflow:"hidden", marginBottom:24, textAlign:"left" }}>
          {milestones.map((m, i) => (
            <div key={i} style={{ padding:"14px 20px", borderBottom: i < milestones.length - 1 ? `1px solid ${T.grey100}` : "none", display:"flex", alignItems:"center", gap:12, background: m.status === "active" ? T.amberBg : "transparent" }}>
              <div style={{ width:28, height:28, borderRadius:"50%", flexShrink:0, background: m.status === "done" ? T.greenBg : m.status === "active" ? T.amberBg : T.grey50, border:`2px solid ${m.status === "done" ? T.greenBorder : m.status === "active" ? T.amberBorder : T.grey200}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13 }}>
                {m.status === "done" ? "✓" : m.status === "active" ? "●" : "○"}
              </div>
              <div style={{ flex:1, fontSize:14, fontWeight: m.status === "active" ? 600 : 500, color: m.status === "done" ? T.greenText : m.status === "active" ? T.amberText : T.grey400 }}>{m.label}</div>
              <div style={{ fontSize:12, fontWeight:600, color: m.status === "done" ? T.greenText : m.status === "active" ? T.amberText : T.grey300 }}>
                {m.status === "done" ? "Done" : m.status === "active" ? `Working${dots}` : "Pending"}
              </div>
            </div>
          ))}
        </div>
        <div style={{ background:T.grey100, borderRadius:3, height:6, marginBottom:8, overflow:"hidden" }}>
          <div style={{ height:"100%", background:T.redGrad, width:"62%", borderRadius:3, transition:"width 0.4s ease" }} />
        </div>
        <div style={{ fontSize:12, color:T.grey400, marginBottom:28 }}>Step 3 of 4 — Creating your accounts…</div>
        <BtnPrimary onClick={() => setPage("dashboard_app")} style={{ width:"100%", padding:"14px", fontSize:15 }}>Take me to my Dashboard →</BtnPrimary>
        <div style={{ fontSize:11, color:T.grey300, marginTop:12 }}>You can close this page — we'll email you when everything is ready.</div>
      </div>
      </div>
    </AppShell>
  );
}

/* ═══════════════════════════════════════════════════════════
   CURRENCIES SCREEN
═══════════════════════════════════════════════════════════ */
const ALL_CURRENCIES_LIST = [
  { code:"USD", name:"US Dollar",          flag:"🇺🇸" },
  { code:"EUR", name:"Euro",               flag:"🇪🇺" },
  { code:"GBP", name:"British Pound",      flag:"🇬🇧" },
  { code:"AUD", name:"Australian Dollar",  flag:"🇦🇺" },
  { code:"SGD", name:"Singapore Dollar",   flag:"🇸🇬" },
  { code:"HKD", name:"Hong Kong Dollar",   flag:"🇭🇰" },
  { code:"JPY", name:"Japanese Yen",       flag:"🇯🇵" },
  { code:"CAD", name:"Canadian Dollar",    flag:"🇨🇦" },
  { code:"CHF", name:"Swiss Franc",        flag:"🇨🇭" },
  { code:"CNY", name:"Chinese Yuan",       flag:"🇨🇳" },
  { code:"INR", name:"Indian Rupee",       flag:"🇮🇳" },
];

function CurrencyListCard({ c, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: hov ? T.redLight : T.white, border:`1.5px solid ${hov ? T.redPrimary : T.grey100}`, borderRadius:10, padding:"20px", cursor:"pointer", textAlign:"center", boxShadow:"0 1px 4px rgba(0,0,0,0.04)", transition:"all 0.15s" }}>
      <div style={{ fontSize:28, marginBottom:8 }}>{c.flag}</div>
      <div style={{ fontSize:13, fontWeight:700, color: hov ? T.redPrimary : T.black }}>{c.code}</div>
      <div style={{ fontSize:11, color:T.grey400 }}>{c.name}</div>
    </div>
  );
}

function CurrenciesScreen({ setPage, onNav, dummy, setDummy }) {
  return (
    <AppShell activePage="currencies" onNav={onNav} setPage={setPage} dummy={dummy} setDummy={setDummy}>
      <div style={{ padding:"24px 28px", minHeight:"calc(100vh - 56px)", background:T.pageBg }}>
        <Breadcrumb items={[{ label:"Home", onClick:() => setPage("dashboard_app") }, { label:"Currencies" }]} />
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <h1 style={{ fontSize:24, fontWeight:700, color:T.black, margin:"0 0 6px" }}>Supported Currencies</h1>
          <p style={{ fontSize:14, color:T.grey400, margin:"0 0 16px" }}>Add any of these currencies to your Peko account</p>
          <div style={{ background:T.greenBg, border:`1px solid ${T.greenBorder}`, borderRadius:8, padding:"10px 20px", display:"inline-block", fontSize:13, color:T.greenText }}>
            ℹ️ All currencies come with dedicated local bank account details and support for multiple payment rails.
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:40 }}>
          {ALL_CURRENCIES_LIST.map(c => <CurrencyListCard key={c.code} c={c} onClick={() => setPage("add_modal")} />)}
        </div>
        <div style={{ background:T.redGrad, borderRadius:16, padding:"32px 40px", textAlign:"center" }}>
          <h2 style={{ fontSize:22, fontWeight:800, color:T.white, margin:"0 0 8px" }}>Need a currency not listed?</h2>
          <p style={{ fontSize:14, color:"rgba(255,255,255,0.85)", margin:"0 0 20px" }}>We're constantly expanding. Contact us and we'll prioritize your request.</p>
          <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
            <button style={{ background:T.white, color:T.redPrimary, border:"none", borderRadius:8, padding:"10px 24px", fontSize:14, fontWeight:700, cursor:"pointer" }}>Contact Support</button>
            <button onClick={() => setPage("add_modal")} style={{ background:"transparent", color:T.white, border:"2px solid rgba(255,255,255,0.5)", borderRadius:8, padding:"10px 20px", fontSize:14, fontWeight:600, cursor:"pointer" }}>Add Currency →</button>
          </div>
        </div>
        <div style={{ marginTop:32 }}><Footer /></div>
      </div>
    </AppShell>
  );
}

/* ═══════════════════════════════════════════════════════════
   ADD CURRENCY MODAL
═══════════════════════════════════════════════════════════ */
function AddModalScreen({ setPage }) {
  const [selected, setSelected] = useState(new Set());
  const toggle = code => setSelected(prev => { const n = new Set(prev); n.has(code) ? n.delete(code) : n.add(code); return n; });
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:600 }}>
      <div style={{ background:T.white, borderRadius:16, padding:28, width:460, maxWidth:"92vw", boxShadow:"0 8px 40px rgba(0,0,0,0.18)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
          <div>
            <div style={{ fontSize:18, fontWeight:700, color:T.black }}>Add Currency</div>
            <div style={{ fontSize:13, color:T.grey400 }}>Select currencies to add to your account</div>
          </div>
          <button onClick={() => setPage("dashboard_app")} style={{ border:"none", background:"none", cursor:"pointer", fontSize:22, color:T.grey400, lineHeight:1 }}>×</button>
        </div>
        <div style={{ maxHeight:320, overflowY:"auto", marginBottom:20 }}>
          {ALL_ADD_CURRENCIES.map(c => {
            const sel = selected.has(c.code);
            return (
              <div key={c.code} onClick={() => toggle(c.code)} style={{ padding:"12px 8px", display:"flex", alignItems:"center", gap:12, cursor:"pointer", borderBottom:`1px solid ${T.grey100}`, background: sel ? "#FFF5F5" : "transparent" }}>
                <div style={{ width:18, height:18, borderRadius:4, border:`2px solid ${sel ? T.redPrimary : T.grey200}`, background: sel ? T.redPrimary : T.white, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  {sel && <span style={{ color:T.white, fontSize:11, fontWeight:700 }}>✓</span>}
                </div>
                <span style={{ fontSize:18 }}>{c.flag}</span>
                <div style={{ flex:1 }}>
                  <span style={{ fontSize:13, fontWeight:600, color:T.black }}>{c.name}</span>
                  <span style={{ fontSize:12, color:T.grey400, marginLeft:6 }}>{c.code}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <BtnSecondary onClick={() => setPage("dashboard_app")} style={{ flex:1 }}>Cancel</BtnSecondary>
          <BtnPrimary onClick={() => setPage("dashboard_app")} style={{ flex:1 }}>
            {selected.size > 0 ? `Add (${selected.size})` : "Add Currency"}
          </BtnPrimary>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   REMOVE CURRENCY MODAL
═══════════════════════════════════════════════════════════ */
function RemoveModalScreen({ setPage, cur }) {
  const removeCur = cur || DUMMY_CURRENCIES[0];
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:600 }}>
      <div style={{ background:T.white, borderRadius:16, padding:28, width:460, maxWidth:"92vw", boxShadow:"0 8px 40px rgba(0,0,0,0.18)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
          <div style={{ fontSize:18, fontWeight:700, color:T.black }}>Remove Currency</div>
          <button onClick={() => setPage("dashboard_app")} style={{ border:"none", background:"none", cursor:"pointer", fontSize:22, color:T.grey400, lineHeight:1 }}>×</button>
        </div>
        <Notice type="warning">
          Removing this currency will close your {removeCur.code} wallet. Any remaining balance must be converted first before removal.
        </Notice>
        <div style={{ margin:"20px 0", background:T.grey50, borderRadius:10, padding:"16px", display:"flex", alignItems:"center", gap:12 }}>
          <CurrencyLogo c={removeCur} size={44} />
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:T.black }}>{removeCur.code} Wallet Balance</div>
            <div style={{ fontSize:22, fontWeight:700, color:T.redPrimary, marginTop:2 }}>{removeCur.symbol}{removeCur.balance}</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <BtnSecondary onClick={() => setPage("dashboard_app")} style={{ flex:1 }}>Cancel</BtnSecondary>
          <BtnPurple onClick={() => setPage("dashboard_app")} style={{ flex:1 }}>Convert &amp; Remove</BtnPurple>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState("landing");
  const [navOpen, setNavOpen] = useState(false);
  const [dummy, setDummy] = useState(false);
  const [detailCurrency, setDetailCurrency] = useState(DUMMY_CURRENCIES[0]);

  const handleSetPage = id => setPage(id === "dashboard" ? "dashboard_app" : id);

  const handleNav = id => {
    if (id === "accounts") setPage("dashboard_app");
    else setPage("landing");
  };

  const renderPage = () => {
    switch (page) {
      case "landing":        return <LandingScreen setPage={handleSetPage} onNav={handleNav} dummy={dummy} setDummy={setDummy} />;
      case "setup":          return <SetupScreen setPage={handleSetPage} onNav={handleNav} dummy={dummy} setDummy={setDummy} />;
      case "initialising":   return <InitialisingScreen setPage={handleSetPage} onNav={handleNav} dummy={dummy} setDummy={setDummy} />;
      case "currency_detail":return <CurrencyDetailScreen cur={detailCurrency} setPage={handleSetPage} onNav={handleNav} dummy={dummy} setDummy={setDummy} />;
      case "currencies":     return <CurrenciesScreen setPage={handleSetPage} onNav={handleNav} dummy={dummy} setDummy={setDummy} />;
      case "add_modal":      return <AddModalScreen setPage={handleSetPage} />;
      case "remove_modal":   return <RemoveModalScreen setPage={handleSetPage} cur={detailCurrency} />;
      case "dashboard_app":
      default:
        return <DashboardAppScreen setPage={handleSetPage} setDetailCurrency={setDetailCurrency} onNav={handleNav} dummy={dummy} setDummy={setDummy} />;
    }
  };

  return (
    <DummyCtx.Provider value={dummy}>
      <div style={{ fontFamily:T.font, position:"relative" }}>
        <div style={{ paddingRight: navOpen ? 260 : 0, transition:"padding-right 0.25s ease-out", minHeight:"100vh" }}>
          {renderPage()}
        </div>
        <ProtoNav currentPage={page} setPage={handleSetPage} navOpen={navOpen} setNavOpen={setNavOpen} />
      </div>
    </DummyCtx.Provider>
  );
}
