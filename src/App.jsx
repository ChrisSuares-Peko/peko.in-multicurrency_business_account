import { useState, useContext, createContext, useEffect, useRef } from "react";
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

const ALL_TXN_DATA = [
  { id:"TXN-2026-000062", dt:"2026-04-28T09:15", desc:"Shopify Payout — April W4",         method:"ACH",             code:"USD", sym:"$",    raw:14200.00,  status:"Active"  },
  { id:"TXN-2026-000061", dt:"2026-04-25T14:30", desc:"Supplier Invoice — Tech Parts",     method:"SWIFT",           code:"EUR", sym:"€",    raw:-6800.00,  status:"Pending" },
  { id:"TXN-2026-000060", dt:"2026-04-22T11:00", desc:"FX Conversion — EUR to GBP",        method:"SEPA",            code:"EUR", sym:"€",    raw:-12000.00, status:"Active"  },
  { id:"TXN-2026-000059", dt:"2026-04-18T16:45", desc:"Amazon Marketplace Payout",         method:"FASTER_PAYMENTS", code:"GBP", sym:"£",    raw:8900.00,   status:"Active"  },
  { id:"TXN-2026-000058", dt:"2026-04-15T10:20", desc:"Payroll — April (SGD)",             method:"FAST",            code:"SGD", sym:"S$",   raw:-42000.00, status:"Active"  },
  { id:"TXN-2026-000057", dt:"2026-04-12T09:00", desc:"HKD Client Invoice — April",        method:"SWIFT",           code:"HKD", sym:"HK$",  raw:45000.00,  status:"Active"  },
  { id:"TXN-2026-000056", dt:"2026-04-10T14:00", desc:"AUD Consulting Fee — Q1",           method:"SWIFT",           code:"AUD", sym:"A$",   raw:7600.00,   status:"Active"  },
  { id:"TXN-2026-000055", dt:"2026-03-28T15:00", desc:"Stripe Payout — March W4",          method:"ACH",             code:"USD", sym:"$",    raw:9800.00,   status:"Active"  },
  { id:"TXN-2026-000054", dt:"2026-03-26T09:30", desc:"SEPA Transfer — Zurich Office",     method:"SEPA",            code:"EUR", sym:"€",    raw:-4500.00,  status:"Active"  },
  { id:"TXN-2026-000053", dt:"2026-03-25T14:32", desc:"Stripe Payout — March",             method:"SWIFT",           code:"USD", sym:"$",    raw:12400.00,  status:"Active"  },
  { id:"TXN-2026-000052", dt:"2026-03-24T11:15", desc:"NatWest Inbound — Client A",        method:"FASTER_PAYMENTS", code:"GBP", sym:"£",    raw:7200.00,   status:"Active"  },
  { id:"TXN-2026-000051", dt:"2026-03-22T10:00", desc:"Supplier Payment — Acme Corp",      method:"SWIFT",           code:"USD", sym:"$",    raw:-8200.00,  status:"Active"  },
  { id:"TXN-2026-000050", dt:"2026-03-20T14:00", desc:"HK Client Invoice Payment",         method:"SWIFT",           code:"HKD", sym:"HK$",  raw:38000.00,  status:"Active"  },
  { id:"TXN-2026-000049", dt:"2026-03-18T09:00", desc:"Amazon Marketplace Payout",         method:"FASTER_PAYMENTS", code:"GBP", sym:"£",    raw:5750.00,   status:"Active"  },
  { id:"TXN-2026-000048", dt:"2026-03-16T13:30", desc:"AUD Vendor — Sydney Logistics",     method:"SWIFT",           code:"AUD", sym:"A$",   raw:-3200.00,  status:"Failed"  },
  { id:"TXN-2026-000047", dt:"2026-03-15T10:00", desc:"Wire Transfer — Office Rent",       method:"FEDWIRE",         code:"USD", sym:"$",    raw:-4500.00,  status:"Active"  },
  { id:"TXN-2026-000046", dt:"2026-03-14T15:45", desc:"SGD Payroll Top-up",                method:"FAST",            code:"SGD", sym:"S$",   raw:-18500.00, status:"Active"  },
  { id:"TXN-2026-000045", dt:"2026-03-12T11:00", desc:"EUR Invoice — Berlin Client",       method:"SEPA",            code:"EUR", sym:"€",    raw:6400.00,   status:"Active"  },
  { id:"TXN-2026-000044", dt:"2026-03-10T09:20", desc:"PayPal Settlement",                 method:"ACH",             code:"USD", sym:"$",    raw:3200.00,   status:"Active"  },
  { id:"TXN-2026-000043", dt:"2026-03-08T14:00", desc:"HKD Office Lease",                  method:"SWIFT",           code:"HKD", sym:"HK$",  raw:-15000.00, status:"Active"  },
  { id:"TXN-2026-000042", dt:"2026-03-06T10:30", desc:"AUD Client Revenue — ANZ",          method:"SWIFT",           code:"AUD", sym:"A$",   raw:11200.00,  status:"Active"  },
  { id:"TXN-2026-000041", dt:"2026-03-05T09:00", desc:"Vendor Payment — Global Traders",   method:"SWIFT",           code:"USD", sym:"$",    raw:-2900.00,  status:"Active"  },
  { id:"TXN-2026-000040", dt:"2026-03-03T11:30", desc:"SGD Revenue — DBS Client",          method:"FAST",            code:"SGD", sym:"S$",   raw:9800.00,   status:"Active"  },
  { id:"TXN-2026-000039", dt:"2026-03-01T09:00", desc:"Monthly Revenue — Shopify",         method:"ACH",             code:"USD", sym:"$",    raw:18600.00,  status:"Active"  },
  { id:"TXN-2026-000038", dt:"2026-02-28T15:00", desc:"EUR Payroll — February",            method:"SEPA",            code:"EUR", sym:"€",    raw:-28000.00, status:"Active"  },
  { id:"TXN-2026-000037", dt:"2026-02-26T14:00", desc:"GBP Invoice — London Client",       method:"FASTER_PAYMENTS", code:"GBP", sym:"£",    raw:12400.00,  status:"Active"  },
  { id:"TXN-2026-000036", dt:"2026-02-25T09:30", desc:"USD Platform Revenue",              method:"ACH",             code:"USD", sym:"$",    raw:22000.00,  status:"Active"  },
  { id:"TXN-2026-000035", dt:"2026-02-24T11:00", desc:"AUD Consulting Fee — Melbourne",    method:"SWIFT",           code:"AUD", sym:"A$",   raw:8600.00,   status:"Active"  },
  { id:"TXN-2026-000034", dt:"2026-02-22T14:30", desc:"SGD Transfer Failed — OCBC",        method:"FAST",            code:"SGD", sym:"S$",   raw:-6200.00,  status:"Failed"  },
  { id:"TXN-2026-000033", dt:"2026-02-20T10:00", desc:"HKD Revenue — Asia Client",         method:"SWIFT",           code:"HKD", sym:"HK$",  raw:52000.00,  status:"Active"  },
  { id:"TXN-2026-000032", dt:"2026-02-18T09:15", desc:"USD Supplier — TechParts Inc",      method:"FEDWIRE",         code:"USD", sym:"$",    raw:-7400.00,  status:"Active"  },
  { id:"TXN-2026-000031", dt:"2026-02-16T14:00", desc:"EUR Client Invoice — Paris",        method:"SEPA",            code:"EUR", sym:"€",    raw:9200.00,   status:"Active"  },
  { id:"TXN-2026-000030", dt:"2026-02-14T11:30", desc:"GBP Vendor Payment",                method:"FASTER_PAYMENTS", code:"GBP", sym:"£",    raw:-3800.00,  status:"Active"  },
  { id:"TXN-2026-000029", dt:"2026-02-12T09:00", desc:"AUD Insurance Premium",             method:"SWIFT",           code:"AUD", sym:"A$",   raw:-2400.00,  status:"Active"  },
  { id:"TXN-2026-000028", dt:"2026-02-10T14:30", desc:"USD Amazon Payout — Feb W2",        method:"ACH",             code:"USD", sym:"$",    raw:16800.00,  status:"Active"  },
  { id:"TXN-2026-000027", dt:"2026-02-08T11:00", desc:"SGD Office Rent — February",        method:"FAST",            code:"SGD", sym:"S$",   raw:-8500.00,  status:"Active"  },
  { id:"TXN-2026-000026", dt:"2026-02-06T09:30", desc:"HKD Supplier — Shenzhen Co",        method:"SWIFT",           code:"HKD", sym:"HK$",  raw:-22000.00, status:"Active"  },
  { id:"TXN-2026-000025", dt:"2026-02-04T14:00", desc:"EUR Tax Payment — Q1",              method:"SEPA",            code:"EUR", sym:"€",    raw:-15600.00, status:"Pending" },
  { id:"TXN-2026-000024", dt:"2026-02-02T10:30", desc:"USD Wire — Insurance Premium",      method:"FEDWIRE",         code:"USD", sym:"$",    raw:-3200.00,  status:"Active"  },
  { id:"TXN-2026-000023", dt:"2026-02-01T09:00", desc:"USD Platform Revenue — February",   method:"ACH",             code:"USD", sym:"$",    raw:24600.00,  status:"Active"  },
  { id:"TXN-2026-000022", dt:"2026-01-30T15:00", desc:"GBP Revenue — London Client",       method:"FASTER_PAYMENTS", code:"GBP", sym:"£",    raw:18200.00,  status:"Active"  },
  { id:"TXN-2026-000021", dt:"2026-01-28T11:00", desc:"AUD Client — Westpac Payout",       method:"SWIFT",           code:"AUD", sym:"A$",   raw:9400.00,   status:"Active"  },
  { id:"TXN-2026-000020", dt:"2026-01-26T14:30", desc:"SGD Revenue — MAS Client",          method:"FAST",            code:"SGD", sym:"S$",   raw:14200.00,  status:"Active"  },
  { id:"TXN-2026-000019", dt:"2026-01-24T09:00", desc:"USD Payroll — January",             method:"ACH",             code:"USD", sym:"$",    raw:-48000.00, status:"Active"  },
  { id:"TXN-2026-000018", dt:"2026-01-22T11:30", desc:"EUR Transfer — Munich Office",      method:"SEPA",            code:"EUR", sym:"€",    raw:-11000.00, status:"Active"  },
  { id:"TXN-2026-000017", dt:"2026-01-20T14:00", desc:"HKD Revenue — HSBC Inbound",        method:"SWIFT",           code:"HKD", sym:"HK$",  raw:68000.00,  status:"Active"  },
  { id:"TXN-2026-000016", dt:"2026-01-18T10:00", desc:"GBP Vendor — NatWest Debit",        method:"FASTER_PAYMENTS", code:"GBP", sym:"£",    raw:-5600.00,  status:"Active"  },
  { id:"TXN-2026-000015", dt:"2026-01-16T09:30", desc:"AUD Equipment Purchase",            method:"SWIFT",           code:"AUD", sym:"A$",   raw:-14800.00, status:"Active"  },
  { id:"TXN-2026-000014", dt:"2026-01-14T14:00", desc:"USD Stripe Payout — Jan W2",        method:"ACH",             code:"USD", sym:"$",    raw:11200.00,  status:"Active"  },
  { id:"TXN-2026-000013", dt:"2026-01-12T11:00", desc:"EUR Platform Revenue — January",    method:"SEPA",            code:"EUR", sym:"€",    raw:18400.00,  status:"Active"  },
  { id:"TXN-2026-000012", dt:"2026-01-10T09:00", desc:"SGD Supplier — Jurong Co",          method:"FAST",            code:"SGD", sym:"S$",   raw:-7800.00,  status:"Active"  },
  { id:"TXN-2026-000011", dt:"2026-01-08T14:30", desc:"HKD Office Deposit",                method:"SWIFT",           code:"HKD", sym:"HK$",  raw:-30000.00, status:"Pending" },
  { id:"TXN-2026-000010", dt:"2026-01-06T10:00", desc:"USD Amazon Payout — Jan W1",        method:"ACH",             code:"USD", sym:"$",    raw:8600.00,   status:"Active"  },
  { id:"TXN-2026-000009", dt:"2026-01-05T11:30", desc:"GBP Consulting Revenue",            method:"FASTER_PAYMENTS", code:"GBP", sym:"£",    raw:9800.00,   status:"Active"  },
  { id:"TXN-2026-000008", dt:"2026-01-04T09:00", desc:"AUD Revenue — CBA Inbound",         method:"SWIFT",           code:"AUD", sym:"A$",   raw:16400.00,  status:"Active"  },
  { id:"TXN-2026-000007", dt:"2026-01-03T14:00", desc:"EUR FX Conversion to USD",          method:"SEPA",            code:"EUR", sym:"€",    raw:-8000.00,  status:"Active"  },
  { id:"TXN-2026-000006", dt:"2026-01-02T10:30", desc:"SGD January Opening Balance",       method:"FAST",            code:"SGD", sym:"S$",   raw:25000.00,  status:"Active"  },
  { id:"TXN-2026-000005", dt:"2026-01-02T09:15", desc:"USD Wire — Platform Fees",          method:"FEDWIRE",         code:"USD", sym:"$",    raw:-1800.00,  status:"Failed"  },
  { id:"TXN-2026-000004", dt:"2026-01-02T09:00", desc:"GBP Opening Transfer",              method:"FASTER_PAYMENTS", code:"GBP", sym:"£",    raw:50000.00,  status:"Active"  },
  { id:"TXN-2026-000003", dt:"2026-01-01T14:00", desc:"HKD Opening Balance Transfer",      method:"SWIFT",           code:"HKD", sym:"HK$",  raw:100000.00, status:"Active"  },
  { id:"TXN-2026-000002", dt:"2026-01-01T11:00", desc:"EUR Opening Balance Transfer",      method:"SEPA",            code:"EUR", sym:"€",    raw:80000.00,  status:"Active"  },
  { id:"TXN-2026-000001", dt:"2026-01-01T09:00", desc:"USD Opening Balance Transfer",      method:"ACH",             code:"USD", sym:"$",    raw:100000.00, status:"Active"  },
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
              <span style={{ fontFamily:"monospace", fontSize:13, color:T.black }}>{f.value}</span>
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
const ACCOUNT_CURRENCIES = ["USD","EUR","GBP","AUD","SGD","HKD","JPY","CAD","CHF","CNY","INR","NZD","AED","MYR","THB","IDR","PHP","KRW","SEK","NOK","DKK"];

function AddBeneficiaryPanel({ cur, onClose, onAdd }) {
  const [step, setStep] = useState(1);
  const [entityType, setEntityType] = useState("Business");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountCurrency, setAccountCurrency] = useState(cur?.code || "");
  const [bankCountry, setBankCountry] = useState("");
  const [bankName, setBankName] = useState("");
  const [swiftCode, setSwiftCode] = useState("");
  const [routingCode, setRoutingCode] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [postcode, setPostcode] = useState("");
  const [country, setCountry] = useState("");

  const step1Valid = firstName.trim() && lastName.trim() && (entityType === "Individual" || companyName.trim());
  const step2Valid = accountName.trim() && accountNumber.trim() && accountCurrency && bankCountry && bankName.trim() && swiftCode.trim();
  const step3Valid = streetAddress.trim() && city.trim() && country;
  const canContinue = step === 1 ? step1Valid : step === 2 ? step2Valid : step3Valid;

  const handleAdd = () => {
    const bankDetails = {
      account_name: accountName,
      account_number: accountNumber,
      account_currency: accountCurrency,
      bank_country_code: bankCountry,
      bank_name: bankName,
      swift_code: swiftCode,
      ...(routingCode.trim() ? { account_routing_params: [{ param_name: "bank_code", param_value: routingCode.trim() }] } : {}),
    };
    const payload = {
      reference_id: (typeof crypto !== "undefined" && crypto.randomUUID) ? crypto.randomUUID() : `ref_${Date.now()}`,
      entity_type: entityType,
      ...(entityType === "Individual" ? { first_name: firstName, last_name: lastName } : { company_name: companyName }),
      payment_methods: ["SWIFT"],
      beneficiary_bank_details: bankDetails,
      beneficiary_address: { street_address: streetAddress, city, state: stateVal, postcode, country_code: country },
    };
    onAdd({ id: Date.now(), name: entityType === "Business" ? companyName : `${firstName} ${lastName}`, bank: bankName, acct: `••••${accountNumber.slice(-4) || "0000"}`, type: entityType, paymentMethod: "SWIFT", status: "Active", _payload: payload });
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
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:T.grey600, display:"block", marginBottom:4 }}>Account Currency *</label>
              {cur?.code ? (
                <div style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1px solid ${T.grey200}`, fontSize:14, color:T.grey400, background:"#FAFAFA", boxSizing:"border-box" }}>{cur.code}</div>
              ) : (
                <select value={accountCurrency} onChange={e => setAccountCurrency(e.target.value)} style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1px solid ${accountCurrency ? T.grey200 : T.grey200}`, fontSize:14, color: accountCurrency ? T.black : T.grey400, fontFamily:T.font, background:T.white, outline:"none", boxSizing:"border-box" }}>
                  <option value="">Select currency</option>
                  {ACCOUNT_CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              )}
              <div style={{ fontSize:11, color:T.grey400, marginTop:4 }}>Currency of the beneficiary's bank account</div>
            </div>
            <SelectField label="Bank Country Code *" value={bankCountry} onChange={e => setBankCountry(e.target.value)} />
            <Input label="Bank Name *" value={bankName} onChange={e => setBankName(e.target.value)} placeholder="Name of the bank" />
            <div>
              <Input label="SWIFT Code *" value={swiftCode} onChange={e => setSwiftCode(e.target.value)} placeholder="8 or 11 character BIC code" />
              <div style={{ fontSize:11, color:T.grey400, marginTop:4 }}>8 or 11 character BIC code</div>
            </div>
            <div>
              <Input label="Bank Routing Code (optional)" value={routingCode} onChange={e => setRoutingCode(e.target.value)} placeholder="e.g. 897678" />
              <div style={{ fontSize:11, color:T.grey400, marginTop:4 }}>Required for some countries (e.g. sort code, BSB, routing number)</div>
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
              {[["Name", entityType === "Business" ? companyName : `${firstName} ${lastName}`], ["Type", entityType], ["Account Name", accountName], ["Account #", `••••${accountNumber.slice(-4) || "----"}`], ["Currency", accountCurrency], ["Bank", bankName], ["SWIFT", swiftCode], ["Bank Country", bankCountry], ...(routingCode.trim() ? [["Routing Code", routingCode]] : [])].map(([lbl, val]) => (
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
   INITIATE SETTLEMENT MODAL
═══════════════════════════════════════════════════════════ */
const SETTLEMENT_RATES = { USD:84.0, EUR:90.5, GBP:106.5, AUD:55.0, SGD:62.5, HKD:10.8 };

function InitiateSettlementModal({ cur, settlementAccount, onClose, onAddSettlementAccount, onSuccess }) {
  const [amount, setAmount] = useState("");
  const [step,   setStep]   = useState("form"); // "form" | "confirm"
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    const onKey = e => { if (e.key === "Escape") handleClose(); };
    document.addEventListener("keydown", onKey);
    return () => { cancelAnimationFrame(id); document.removeEventListener("keydown", onKey); };
  }, []);

  const handleClose = () => { setVisible(false); setTimeout(onClose, 250); };

  const rate             = SETTLEMENT_RATES[cur.code] || 1;
  const parsedAmount     = parseFloat(amount) || 0;
  const availableBalance = parseFloat((cur.balance || "0").replace(/,/g, ""));
  const inrEquiv         = parsedAmount * rate;
  const fmtINR           = parsedAmount > 0
    ? "≈ ₹" + new Intl.NumberFormat("en-IN", { minimumFractionDigits:2, maximumFractionDigits:2 }).format(inrEquiv)
    : "—";
  const amountExceeds = parsedAmount > 0 && parsedAmount > availableBalance;
  const isValid = parsedAmount > 0 && !amountExceeds && !!settlementAccount;

  const handleConfirm = () => {
    onSuccess("Settlement initiated successfully. Funds will arrive in 1–3 business days.");
    handleClose();
  };

  return (
    <>
      <div onClick={handleClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:600, opacity: visible ? 1 : 0, transition:"opacity 0.25s" }} />
      <div style={{ position:"fixed", top:"50%", left:"50%", transform: visible ? "translate(-50%,-50%) scale(1)" : "translate(-50%,-48%) scale(0.97)", opacity: visible ? 1 : 0, transition:"all 0.25s ease-out", width:480, maxWidth:"94vw", background:T.white, borderRadius:16, boxShadow:"0 16px 60px rgba(0,0,0,0.22)", zIndex:601, display:"flex", flexDirection:"column", maxHeight:"90vh" }}>

        {/* Header */}
        <div style={{ padding:"20px 24px", borderBottom:`1px solid ${T.grey100}`, flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
            <div>
              <div style={{ fontSize:17, fontWeight:700, color:T.black }}>Initiate Settlement</div>
              <div style={{ fontSize:13, color:T.grey400, marginTop:3 }}>Transfer your balance to your linked settlement account</div>
            </div>
            <button onClick={handleClose} style={{ border:"none", background:"none", cursor:"pointer", fontSize:22, color:T.grey400, lineHeight:1, padding:0, marginLeft:16 }}>×</button>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex:1, overflowY:"auto", padding:"20px 24px", display:"flex", flexDirection:"column", gap:20 }}>
          {step === "form" ? (
            <>
              {/* Amount */}
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:T.grey600, display:"block", marginBottom:6 }}>Settlement Amount *</label>
                <div style={{ display:"flex", alignItems:"center", border:`1.5px solid ${amountExceeds ? T.redErrBorder : T.grey200}`, borderRadius:8, overflow:"hidden" }}>
                  <span style={{ padding:"10px 14px", fontSize:16, fontWeight:700, color:T.grey400, borderRight:`1px solid ${T.grey100}`, background:"#FAFAFA", flexShrink:0 }}>{cur.symbol}</span>
                  <input type="number" min="0" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00"
                    style={{ flex:1, padding:"10px 12px", fontSize:16, border:"none", outline:"none", fontFamily:T.font, color:T.black }} />
                </div>
                {amountExceeds && <div style={{ fontSize:12, color:T.redErrText, marginTop:4 }}>Amount exceeds available balance</div>}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:6 }}>
                  <span style={{ fontSize:12, color:T.grey400 }}>Available balance: {cur.symbol}{cur.balance}</span>
                  <span onClick={() => setAmount(String(availableBalance))} style={{ fontSize:12, color:T.redPrimary, fontWeight:600, cursor:"pointer" }}>Settle full balance →</span>
                </div>
              </div>

              {/* Settling To */}
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:T.grey600, display:"block", marginBottom:6 }}>Settling To</label>
                {settlementAccount ? (
                  <div style={{ background:"#FAFAFA", border:`1px solid ${T.grey100}`, borderRadius:10, padding:"14px 16px", display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ width:36, height:36, borderRadius:8, background:T.grey100, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>🏦</div>
                    <div>
                      <div style={{ fontSize:14, fontWeight:700, color:T.black }}>{settlementAccount.bankName}</div>
                      <div style={{ fontSize:12, color:T.grey400 }}>••••{settlementAccount.accountNumber.slice(-4)} · {settlementAccount.holderName}</div>
                    </div>
                  </div>
                ) : (
                  <div style={{ background:T.amberBg, border:`1px solid ${T.amberBorder}`, borderRadius:10, padding:"14px 16px" }}>
                    <div style={{ fontSize:13, fontWeight:600, color:T.amberText, marginBottom:4 }}>No settlement account linked</div>
                    <div style={{ fontSize:12, color:T.amberText, opacity:0.9, marginBottom:8 }}>Please add one first before initiating a settlement.</div>
                    <span onClick={() => { handleClose(); onAddSettlementAccount(); }} style={{ fontSize:13, color:T.redPrimary, fontWeight:600, cursor:"pointer" }}>Add Settlement Account →</span>
                  </div>
                )}
              </div>

              {/* INR Conversion */}
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:T.grey600, display:"block", marginBottom:6 }}>Amount in Home Currency (INR)</label>
                <div style={{ background:"#FAFAFA", border:`1px solid ${T.grey100}`, borderRadius:8, padding:"12px 16px" }}>
                  <div style={{ fontSize:18, fontWeight:700, color: parsedAmount > 0 ? T.black : T.grey300 }}>{fmtINR}</div>
                  <div style={{ fontSize:12, color:T.grey400, marginTop:4 }}>Exchange rate: 1 {cur.code} = ₹{rate.toFixed(2)}</div>
                </div>
              </div>
            </>
          ) : (
            /* Confirmation step */
            <div>
              <div style={{ fontSize:15, fontWeight:700, color:T.black, marginBottom:16 }}>Please confirm your settlement:</div>
              <div style={{ background:"#FAFAFA", border:`1px solid ${T.grey100}`, borderRadius:12, padding:"16px 18px", display:"flex", flexDirection:"column", gap:12 }}>
                {[
                  ["Amount",     `${cur.symbol}${parseFloat(amount).toLocaleString("en-US", { minimumFractionDigits:2, maximumFractionDigits:2 })}`],
                  ["To",         settlementAccount ? `${settlementAccount.bankName} ••••${settlementAccount.accountNumber.slice(-4)}` : "—"],
                  ["Equivalent", fmtINR],
                ].map(([lbl, val]) => (
                  <div key={lbl} style={{ display:"flex", justifyContent:"space-between" }}>
                    <span style={{ fontSize:13, color:T.grey400 }}>{lbl}</span>
                    <span style={{ fontSize:13, fontWeight:600, color:T.black }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ flexShrink:0, padding:"16px 24px", borderTop:`1px solid ${T.grey100}`, display:"flex", gap:10 }}>
          {step === "form" ? (
            <>
              <BtnSecondary onClick={handleClose} style={{ flex:1 }}>Cancel</BtnSecondary>
              <BtnPrimary onClick={() => setStep("confirm")} disabled={!isValid} style={{ flex:1 }}>Initiate Settlement</BtnPrimary>
            </>
          ) : (
            <>
              <BtnSecondary onClick={() => setStep("form")} style={{ flex:1 }}>← Go Back</BtnSecondary>
              <BtnPrimary onClick={handleConfirm} style={{ flex:1 }}>Confirm & Settle</BtnPrimary>
            </>
          )}
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   CURRENCY DETAIL SCREEN   ← defined BEFORE DashboardAppScreen
═══════════════════════════════════════════════════════════ */
function CurrencyDetailScreen({ cur, setPage, onNav, dummy, setDummy, settlementAccount, setSettlementAccount, onViewTransactions }) {
  const [showReceive,          setShowReceive]          = useState(false);
  const [showSend,             setShowSend]             = useState(false);
  const [showAddBenef,         setShowAddBenef]         = useState(false);
  const [sendBenef,            setSendBenef]            = useState(null);
  const [showSettlement,       setShowSettlement]       = useState(false);
  const [showSettlementPanel,  setShowSettlementPanel]  = useState(false);
  const [detailToast,          setDetailToast]          = useState(null);

  const showDetailToast = msg => { setDetailToast(msg); setTimeout(() => setDetailToast(null), 3500); };
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
            {dummy && INR_RATES[cur.code] && (
              <div style={{ fontSize:14, color:T.grey400, marginTop:2 }}>
                ≈ ₹{new Intl.NumberFormat("en-IN", { minimumFractionDigits:2, maximumFractionDigits:2 }).format(parseFloat(cur.balance.replace(/,/g, "")) * INR_RATES[cur.code])}
              </div>
            )}
            {dummy && cur.pending !== "0.00" && (
              <div style={{ fontSize:12, color:T.grey400, marginTop:2 }}>+ {cur.symbol}{cur.pending} pending</div>
            )}
          </div>
        </div>

        {/* 3 action CTAs */}
        <div style={{ display:"flex", gap:12, marginBottom:20 }}>
          <DetailCtaBtn icon="📥" label="Share Account Details" onClick={() => setShowReceive(true)} />
          <DetailCtaBtn icon="📤" label="Make a Payment"        onClick={() => openSend()} />
          <DetailCtaBtn icon="🏦" label="Initiate Settlement"    onClick={() => setShowSettlement(true)} />
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
          {transactions.length > 0 && (
            <div onClick={() => onViewTransactions(cur.code)} style={{ padding:"12px 20px", textAlign:"center", fontSize:13, color:T.redPrimary, cursor:"pointer", fontWeight:600, borderTop:`1px solid ${T.grey100}` }}>
              View all transactions →
            </div>
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
      {showSettlement && (
        <InitiateSettlementModal
          cur={cur}
          settlementAccount={settlementAccount}
          onClose={() => setShowSettlement(false)}
          onAddSettlementAccount={() => setShowSettlementPanel(true)}
          onSuccess={msg => showDetailToast(msg)}
        />
      )}
      {showSettlementPanel && (
        <SettlementPanel
          account={settlementAccount}
          onClose={() => setShowSettlementPanel(false)}
          onSave={acc => { setSettlementAccount(acc); showDetailToast("Settlement account added successfully"); }}
          onRemove={() => { setSettlementAccount(null); showDetailToast("Settlement account removed"); }}
        />
      )}
      {detailToast && (
        <div style={{ position:"fixed", bottom:28, left:"50%", transform:"translateX(-50%)", background:"#1F2937", color:"#FFF", padding:"12px 28px", borderRadius:10, fontSize:13, fontWeight:600, zIndex:700, boxShadow:"0 4px 20px rgba(0,0,0,0.25)", whiteSpace:"nowrap", pointerEvents:"none" }}>✓ {detailToast}</div>
      )}
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
   SETTLEMENT ACCOUNT PANEL
═══════════════════════════════════════════════════════════ */
function SettlementPanel({ account, onClose, onSave, onRemove }) {
  const [holderName,      setHolderName]      = useState(account?.holderName      || "");
  const [bankName,        setBankName]        = useState(account?.bankName        || "");
  const [accountNumber,   setAccountNumber]   = useState(account?.accountNumber   || "");
  const [confirmNumber,   setConfirmNumber]   = useState(account?.accountNumber   || "");
  const [ifscSwift,       setIfscSwift]       = useState(account?.ifscSwift       || "");
  const [bankCountry,     setBankCountry]     = useState(account?.bankCountry     || "");
  const [accountCurrency, setAccountCurrency] = useState(account?.accountCurrency || "");
  const [accountType,     setAccountType]     = useState(account?.accountType     || "Current");
  const [autoSettle,      setAutoSettle]      = useState(account?.autoSettle      || false);
  const [timezone,        setTimezone]        = useState(account?.timezone        || (() => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Dubai"; } catch { return "Asia/Dubai"; } })());
  const [showTriggerConfirm, setShowTriggerConfirm] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [visible,         setVisible]         = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    const onKey = e => { if (e.key === "Escape") handleClose(); };
    document.addEventListener("keydown", onKey);
    return () => { cancelAnimationFrame(id); document.removeEventListener("keydown", onKey); };
  }, []);

  const handleClose = () => { setVisible(false); setTimeout(onClose, 300); };

  const accountsMatch = !confirmNumber || confirmNumber === accountNumber;
  const isValid = holderName.trim() && bankName.trim() && accountNumber.trim() &&
                  confirmNumber === accountNumber && ifscSwift.trim() && bankCountry && accountCurrency;

  const handleSave = () => {
    if (!isValid) return;
    onSave({ holderName, bankName, accountNumber, ifscSwift, bankCountry, accountCurrency, accountType, autoSettle, timezone });
    handleClose();
  };

  const selStyle = { width:"100%", padding:"10px 12px", borderRadius:8, border:`1px solid ${T.grey200}`, fontSize:14, fontFamily:T.font, background:T.white, outline:"none", boxSizing:"border-box" };

  return (
    <>
      <div onClick={handleClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:499, opacity: visible ? 1 : 0, transition:"opacity 0.3s" }} />
      <div style={{ position:"fixed", right:0, top:0, width:420, height:"100vh", background:T.white, boxShadow:"-4px 0 24px rgba(0,0,0,0.12)", zIndex:500, display:"flex", flexDirection:"column", transform: visible ? "translateX(0)" : "translateX(100%)", transition:"transform 0.3s ease-out" }}>

        {/* Header */}
        <div style={{ padding:"20px 24px", borderBottom:`1px solid ${T.grey100}`, flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
            <div>
              <div style={{ fontSize:17, fontWeight:700, color:T.black }}>Settlement Account</div>
              <div style={{ fontSize:13, color:T.grey400, marginTop:3 }}>Add a bank account to receive settlements</div>
            </div>
            <button onClick={handleClose} style={{ border:"none", background:"none", cursor:"pointer", fontSize:22, color:T.grey400, lineHeight:1, padding:0 }}>×</button>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex:1, overflowY:"auto", padding:"20px 24px", display:"flex", flexDirection:"column", gap:14 }}>
          <div style={{ fontSize:13, fontWeight:700, color:T.black }}>Account Holder Details</div>
          <Input label="Account Holder Name *" value={holderName} onChange={e => setHolderName(e.target.value)} placeholder="Full name as it appears on the bank account" />

          <div style={{ fontSize:13, fontWeight:700, color:T.black, marginTop:4 }}>Bank Details</div>
          <Input label="Bank Name *" value={bankName} onChange={e => setBankName(e.target.value)} placeholder="Name of the bank" />
          <Input label="Account Number *" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} placeholder="Enter account number" />
          <div>
            <Input label="Confirm Account Number *" value={confirmNumber} onChange={e => setConfirmNumber(e.target.value)} placeholder="Re-enter account number" />
            {confirmNumber && !accountsMatch && <div style={{ fontSize:11, color:T.redErrText, marginTop:4 }}>Account numbers do not match</div>}
          </div>
          <div>
            <Input label="IFSC Code / SWIFT Code *" value={ifscSwift} onChange={e => setIfscSwift(e.target.value)} placeholder="IFSC (India) or SWIFT/BIC code" />
            <div style={{ fontSize:11, color:T.grey400, marginTop:4 }}>Enter IFSC for Indian banks or SWIFT code for international banks</div>
          </div>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:T.grey600, display:"block", marginBottom:4 }}>Bank Country *</label>
            <select value={bankCountry} onChange={e => setBankCountry(e.target.value)} style={{ ...selStyle, color: bankCountry ? T.black : T.grey400 }}>
              <option value="">Select country</option>
              {COUNTRY_CODES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:T.grey600, display:"block", marginBottom:4 }}>Account Currency *</label>
            <select value={accountCurrency} onChange={e => setAccountCurrency(e.target.value)} style={{ ...selStyle, color: accountCurrency ? T.black : T.grey400 }}>
              <option value="">Select currency</option>
              {ACCOUNT_CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <div style={{ fontSize:13, fontWeight:700, color:T.black, marginBottom:10 }}>Account Type</div>
            <div style={{ display:"flex", gap:8 }}>
              {["Current","Savings"].map(t => (
                <div key={t} onClick={() => setAccountType(t)} style={{ flex:1, padding:"10px", borderRadius:8, border:`1.5px solid ${accountType === t ? T.redPrimary : T.grey200}`, background: accountType === t ? T.redLight : T.white, color: accountType === t ? T.redPrimary : T.grey600, textAlign:"center", cursor:"pointer", fontSize:13, fontWeight:600, transition:"all 0.15s" }}>{t}</div>
              ))}
            </div>
          </div>

          {/* Auto Settlement */}
          <div style={{ paddingTop:16, borderTop:`1px solid ${T.grey100}` }}>
            <label style={{ display:"flex", alignItems:"flex-start", gap:10, cursor:"pointer" }}>
              <input type="checkbox" checked={autoSettle} onChange={e => { setAutoSettle(e.target.checked); setShowTriggerConfirm(false); }}
                style={{ marginTop:2, width:16, height:16, accentColor:T.redPrimary, cursor:"pointer", flexShrink:0 }} />
              <div>
                <div style={{ fontSize:13, fontWeight:600, color:T.black }}>Activate Auto Settlement</div>
                <div style={{ fontSize:12, color:T.grey400, marginTop:3, lineHeight:1.5 }}>Automatically settles your balance daily at 11:59 PM. Can also be manually triggered at any time.</div>
              </div>
            </label>

            {autoSettle && (
              <div style={{ marginTop:12, background:T.grey50, borderRadius:10, padding:"14px 16px", display:"flex", flexDirection:"column", gap:12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:12, color:T.grey400, fontWeight:500 }}>Schedule</span>
                  <span style={{ fontSize:13, fontWeight:600, color:T.black }}>Daily at 11:59 PM</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:12 }}>
                  <span style={{ fontSize:12, color:T.grey400, fontWeight:500, flexShrink:0 }}>Timezone</span>
                  <select value={timezone} onChange={e => setTimezone(e.target.value)}
                    style={{ fontSize:12, color:T.black, border:`1px solid ${T.grey200}`, borderRadius:6, padding:"5px 8px", fontFamily:T.font, background:T.white, outline:"none", maxWidth:200 }}>
                    {["Asia/Dubai","Asia/Kolkata","Asia/Singapore","Asia/Colombo","Asia/Karachi","Asia/Hong_Kong","Asia/Shanghai","Asia/Tokyo","Europe/London","Europe/Paris","Europe/Berlin","America/New_York","America/Chicago","America/Los_Angeles","Australia/Sydney"].map(tz =>
                      <option key={tz} value={tz}>{tz.replace("_"," ")}</option>
                    )}
                  </select>
                </div>
                <div style={{ borderTop:`1px solid ${T.grey200}`, paddingTop:12 }}>
                  {!showTriggerConfirm ? (
                    <button onClick={() => setShowTriggerConfirm(true)}
                      style={{ fontSize:12, fontWeight:600, color:T.redPrimary, background:"transparent", border:`1.5px solid ${T.redPrimary}`, borderRadius:6, padding:"7px 14px", cursor:"pointer", fontFamily:T.font }}>
                      ⚡ Trigger Now
                    </button>
                  ) : (
                    <div style={{ background:T.amberBg, border:`1px solid ${T.amberBorder}`, borderRadius:8, padding:"12px 14px" }}>
                      <div style={{ fontSize:12, fontWeight:600, color:T.amberText, marginBottom:6 }}>Trigger manual settlement?</div>
                      <div style={{ fontSize:12, color:T.amberText, opacity:0.9, marginBottom:12, lineHeight:1.5 }}>This will transfer your available balance to your linked settlement account.</div>
                      <div style={{ display:"flex", gap:8 }}>
                        <button onClick={() => setShowTriggerConfirm(false)}
                          style={{ flex:1, background:T.amberText, color:T.white, border:"none", borderRadius:6, padding:"8px", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:T.font }}>Yes, Settle Now</button>
                        <button onClick={() => setShowTriggerConfirm(false)}
                          style={{ flex:1, background:T.white, color:T.grey600, border:`1px solid ${T.grey200}`, borderRadius:6, padding:"8px", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:T.font }}>Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {account && !showRemoveConfirm && (
            <div style={{ marginTop:8, paddingTop:16, borderTop:`1px solid ${T.grey100}` }}>
              <button onClick={() => setShowRemoveConfirm(true)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:13, color:T.redErrText, fontWeight:600, padding:0, fontFamily:T.font }}>🗑 Remove Settlement Account</button>
            </div>
          )}
          {showRemoveConfirm && (
            <div style={{ background:T.redErrBg, border:`1px solid ${T.redErrBorder}`, borderRadius:10, padding:"16px" }}>
              <div style={{ fontSize:13, fontWeight:600, color:T.redErrText, marginBottom:6 }}>Remove this settlement account?</div>
              <div style={{ fontSize:12, color:T.redErrText, opacity:0.8, marginBottom:14 }}>This will unlink the account. You can always add a new one later.</div>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={() => { onRemove(); handleClose(); }} style={{ flex:1, background:T.redErrText, color:T.white, border:"none", borderRadius:8, padding:"9px", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:T.font }}>Yes, Remove</button>
                <button onClick={() => setShowRemoveConfirm(false)} style={{ flex:1, background:T.white, color:T.grey600, border:`1px solid ${T.grey200}`, borderRadius:8, padding:"9px", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:T.font }}>Cancel</button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ flexShrink:0, padding:"12px 24px 20px", borderTop:`1px solid ${T.grey100}` }}>
          <BtnPrimary onClick={handleSave} disabled={!isValid} style={{ width:"100%", padding:"13px", marginBottom:10 }}>Save Settlement Account</BtnPrimary>
          <div onClick={handleClose} style={{ textAlign:"center", fontSize:13, color:T.grey400, cursor:"pointer", fontWeight:500 }}>Cancel</div>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   DASHBOARD APP SCREEN
═══════════════════════════════════════════════════════════ */
const INR_RATES = { USD: 84.0, EUR: 90.5, GBP: 106.5, AUD: 55.0, SGD: 62.5, HKD: 10.8 };

function DashboardAppScreen({ setPage, setDetailCurrency, onNav, dummy, setDummy, settlementAccount, setSettlementAccount, onViewTransactions }) {
  const currencies = dummy ? DUMMY_CURRENCIES : EMPTY_CURRENCIES;
  const transactions = dummy ? ALL_TRANSACTIONS : [];
  const activeCurrencies = currencies.filter(c => c.status === "Active");
  const curMap = DUMMY_CURRENCIES.reduce((acc, c) => ({ ...acc, [c.code]: c }), {});
  const totalINR = dummy
    ? DUMMY_CURRENCIES.reduce((sum, c) => sum + parseFloat(c.balance.replace(/,/g, "")) * (INR_RATES[c.code] || 1), 0)
    : 0;
  const fmtINR = "₹" + new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(totalINR);

  const [showSettlementPanel, setShowSettlementPanel] = useState(false);
  const [hovSettlement,       setHovSettlement]       = useState(false);
  const [toast,               setToast]               = useState(null);

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(null), 3000); };
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
          {/* Settlement Account card */}
          <div onClick={() => setShowSettlementPanel(true)} onMouseEnter={() => setHovSettlement(true)} onMouseLeave={() => setHovSettlement(false)}
            style={{ flex:1, background: hovSettlement ? "#F5F8FF" : T.white, borderRadius:12, padding:"20px", boxShadow:"0 1px 4px rgba(0,0,0,0.06)", border:`1px solid ${hovSettlement ? T.grey200 : T.grey100}`, cursor:"pointer", transition:"all 0.15s", display:"flex", flexDirection:"column", justifyContent:"space-between", minHeight:80 }}>
            <div>
              <div style={{ fontSize:12, color:T.grey400, fontWeight:500, marginBottom:8 }}>Settlement Account</div>
              {settlementAccount ? (
                <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                  <span style={{ fontSize:14, fontWeight:700, color:T.black }}>{settlementAccount.bankName} ••••{settlementAccount.accountNumber.slice(-4)}</span>
                  {settlementAccount.autoSettle && (
                    <span style={{ fontSize:11, fontWeight:700, background:T.greenBg, color:T.greenText, border:`1px solid ${T.greenBorder}`, borderRadius:20, padding:"2px 8px" }}>⏰ Auto</span>
                  )}
                </div>
              ) : (
                <div style={{ fontSize:14, color:T.grey300, fontStyle:"italic" }}>No account linked</div>
              )}
            </div>
            <div style={{ display:"flex", justifyContent:"flex-end", marginTop:8 }}>
              <span style={{ fontSize:20, lineHeight:1, color: settlementAccount ? T.grey400 : T.redPrimary, fontWeight:300 }}>{settlementAccount ? "›" : "+"}</span>
            </div>
          </div>
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
              <div onClick={() => onViewTransactions()} style={{ padding:"12px 20px", textAlign:"center", fontSize:13, color:T.redPrimary, cursor:"pointer", fontWeight:600 }}>View all transactions →</div>
            </div>
          )}
        </div>
        <div style={{ marginTop:40 }}><Footer /></div>
      </div>

      {showSettlementPanel && (
        <SettlementPanel
          account={settlementAccount}
          onClose={() => setShowSettlementPanel(false)}
          onSave={acc => { setSettlementAccount(acc); showToast("Settlement account added successfully"); }}
          onRemove={() => { setSettlementAccount(null); showToast("Settlement account removed"); }}
        />
      )}
      {toast && (
        <div style={{ position:"fixed", bottom:28, left:"50%", transform:"translateX(-50%)", background:"#1F2937", color:"#FFF", padding:"12px 28px", borderRadius:10, fontSize:13, fontWeight:600, zIndex:700, boxShadow:"0 4px 20px rgba(0,0,0,0.25)", whiteSpace:"nowrap", pointerEvents:"none" }}>✓ {toast}</div>
      )}
    </AppShell>
  );
}

function AddCurrencyCard({ onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ borderRadius:12, border:`2px dashed ${hov ? T.redPrimary : T.grey200}`, background: hov ? T.redLight : "transparent", padding:"20px", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8, minHeight:128, transition:"all 0.15s" }}>
      <div style={{ width:36, height:36, borderRadius:"50%", background: hov ? T.redLight : T.grey100, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, color: hov ? T.redPrimary : T.grey400, border:`1px solid ${hov ? T.redPrimary : "transparent"}` }}>+</div>
      <span style={{ fontSize:12, fontWeight:600, color: hov ? T.redPrimary : T.grey400 }}>Open New Currency Account</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TRANSACTIONS SCREEN
═══════════════════════════════════════════════════════════ */
const TXN_PAGE_SIZE = 20;
const TXN_CURR_OPTIONS = [
  { code:"USD", flag:"🇺🇸", name:"United States Dollar" },
  { code:"EUR", flag:"🇪🇺", name:"Euro" },
  { code:"GBP", flag:"🇬🇧", name:"British Pound" },
  { code:"AUD", flag:"🇦🇺", name:"Australian Dollar" },
  { code:"SGD", flag:"🇸🇬", name:"Singapore Dollar" },
  { code:"HKD", flag:"🇭🇰", name:"Hong Kong Dollar" },
];
const TXN_STATUSES = ["Active","Pending","Failed"];
const TXN_CURR_META = { USD:{sym:"$",flag:"🇺🇸"}, EUR:{sym:"€",flag:"🇪🇺"}, GBP:{sym:"£",flag:"🇬🇧"}, AUD:{sym:"A$",flag:"🇦🇺"}, SGD:{sym:"S$",flag:"🇸🇬"}, HKD:{sym:"HK$",flag:"🇭🇰"} };
const TXN_PM_COLORS = { ACH:["#EFF6FF","#1D4ED8"], SWIFT:["#F5F3FF","#5B21B6"], SEPA:["#F0FDF4","#15803D"], FEDWIRE:["#FFF7ED","#C2410C"], FASTER_PAYMENTS:["#FDF4FF","#9333EA"], FAST:["#ECFDF5","#059669"] };
const TXN_PM_LABEL = { FASTER_PAYMENTS:"Faster Payments", FEDWIRE:"Fedwire" };

function TransactionsScreen({ setPage, onNav, dummy, setDummy, initCurrency }) {
  const [currencyFilter, setCurrencyFilter] = useState(initCurrency || "");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [txnPage, setTxnPage] = useState(1);
  const [copiedId, setCopiedId] = useState(null);

  const data = dummy ? ALL_TXN_DATA : [];

  const filtered = data.filter(tx => {
    if (currencyFilter && tx.code !== currencyFilter) return false;
    if (dateFrom && tx.dt < dateFrom) return false;
    if (dateTo && tx.dt > dateTo + "T23:59") return false;
    if (statusFilter && tx.status !== statusFilter) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / TXN_PAGE_SIZE));
  const pageRows = filtered.slice((txnPage - 1) * TXN_PAGE_SIZE, txnPage * TXN_PAGE_SIZE);

  const handleCopy = id => {
    navigator.clipboard?.writeText(id).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleCSV = () => {
    const cols = ["Date & Time","Description","Transaction ID","Payment Method","Currency","Amount","Status"];
    const rows = filtered.map(tx => [
      tx.dt, tx.desc, tx.id, tx.method, tx.code,
      (tx.raw >= 0 ? "+" : "") + tx.sym + Math.abs(tx.raw).toFixed(2),
      tx.status,
    ]);
    const csv = [cols, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type:"text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "peko_transactions.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const fmtDt = dt => {
    const d = new Date(dt);
    return d.toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }) + ", " +
      d.toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit", hour12:true });
  };

  const fmtAmt = tx => (tx.raw >= 0 ? "+" : "") + tx.sym + Math.abs(tx.raw).toLocaleString("en-US", { minimumFractionDigits:2, maximumFractionDigits:2 });

  const TXN_TH = { padding:"10px 14px", fontSize:11, fontWeight:700, color:T.grey400, textAlign:"left", background:T.grey50, borderBottom:`1px solid ${T.grey100}`, whiteSpace:"nowrap", textTransform:"uppercase", letterSpacing:"0.5px" };
  const TXN_TD = { padding:"11px 14px", fontSize:13, color:T.black, borderBottom:`1px solid ${T.grey100}`, verticalAlign:"middle" };

  return (
    <AppShell activePage="transactions" onNav={onNav} setPage={setPage} dummy={dummy} setDummy={setDummy}>
      <div style={{ paddingTop:28, paddingBottom:48 }}>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
          <div>
            <button onClick={() => setPage("dashboard_app")}
              style={{ background:"none", border:"none", cursor:"pointer", padding:0, fontSize:13, color:T.grey400, fontFamily:T.font, display:"flex", alignItems:"center", gap:4, marginBottom:6 }}>
              ← Back to Accounts
            </button>
            <div style={{ fontSize:22, fontWeight:800, color:T.black }}>Transactions</div>
            <div style={{ fontSize:13, color:T.grey400, marginTop:2 }}>All activity across your multicurrency wallets</div>
          </div>
          <button onClick={handleCSV}
            style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 16px", fontSize:13, fontWeight:600, color:T.white, background:T.redPrimary, border:"none", borderRadius:8, cursor:"pointer", fontFamily:T.font }}>
            ↓ Download CSV
          </button>
        </div>

        {/* Filters */}
        <div style={{ background:T.white, borderRadius:12, boxShadow:"0 1px 4px rgba(0,0,0,0.06)", padding:"14px 18px", marginBottom:18, display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ fontSize:11, fontWeight:700, color:T.grey400, textTransform:"uppercase", letterSpacing:"0.4px" }}>Currency</span>
            <select value={currencyFilter} onChange={e => { setCurrencyFilter(e.target.value); setTxnPage(1); }}
              style={{ width:200, padding:"6px 10px", border:`1px solid ${T.grey200}`, borderRadius:6, fontSize:13, fontFamily:T.font, color: currencyFilter ? T.black : T.grey400, outline:"none", background:T.white, cursor:"pointer" }}>
              <option value="">All Currencies</option>
              <option disabled>──────────────────</option>
              {TXN_CURR_OPTIONS.map(o => (
                <option key={o.code} value={o.code}>{o.flag} {o.code} — {o.name}</option>
              ))}
            </select>
          </div>
          <div style={{ width:1, height:28, background:T.grey200, flexShrink:0 }} />
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ fontSize:11, fontWeight:700, color:T.grey400, textTransform:"uppercase", letterSpacing:"0.4px" }}>From</span>
            <input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setTxnPage(1); }}
              style={{ padding:"5px 8px", border:`1px solid ${T.grey200}`, borderRadius:6, fontSize:12, fontFamily:T.font, color:T.black, outline:"none" }} />
            <span style={{ fontSize:11, fontWeight:700, color:T.grey400, textTransform:"uppercase", letterSpacing:"0.4px" }}>To</span>
            <input type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setTxnPage(1); }}
              style={{ padding:"5px 8px", border:`1px solid ${T.grey200}`, borderRadius:6, fontSize:12, fontFamily:T.font, color:T.black, outline:"none" }} />
            {(dateFrom || dateTo) && (
              <button onClick={() => { setDateFrom(""); setDateTo(""); setTxnPage(1); }}
                style={{ padding:"3px 8px", borderRadius:20, fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:T.font, border:`1px solid ${T.grey200}`, background:"transparent", color:T.grey400 }}>
                ✕
              </button>
            )}
          </div>
          <div style={{ width:1, height:28, background:T.grey200, flexShrink:0 }} />
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ fontSize:11, fontWeight:700, color:T.grey400, textTransform:"uppercase", letterSpacing:"0.4px" }}>Status</span>
            <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setTxnPage(1); }}
              style={{ padding:"5px 8px", border:`1px solid ${T.grey200}`, borderRadius:6, fontSize:12, fontFamily:T.font, color:T.black, outline:"none", background:T.white, cursor:"pointer" }}>
              <option value="">All</option>
              {TXN_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Table */}
        <div style={{ background:T.white, borderRadius:12, boxShadow:"0 1px 4px rgba(0,0,0,0.06)", overflow:"hidden" }}>
          <div style={{ padding:"12px 18px", borderBottom:`1px solid ${T.grey100}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span style={{ fontSize:13, fontWeight:600, color:T.grey600 }}>{filtered.length} transaction{filtered.length !== 1 ? "s" : ""}</span>
            {filtered.length > 0 && totalPages > 1 && <span style={{ fontSize:12, color:T.grey400 }}>Page {txnPage} of {totalPages}</span>}
          </div>
          {filtered.length === 0 ? (
            <div style={{ padding:"64px 20px", textAlign:"center" }}>
              <div style={{ fontSize:40, marginBottom:12 }}>📭</div>
              <div style={{ fontSize:15, fontWeight:700, color:T.black, marginBottom:6 }}>No transactions found</div>
              <div style={{ fontSize:13, color:T.grey400 }}>Try adjusting your filters to see more results.</div>
            </div>
          ) : (
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", minWidth:820 }}>
                <thead>
                  <tr>
                    <th style={TXN_TH}>Date & Time</th>
                    <th style={TXN_TH}>Description</th>
                    <th style={TXN_TH}>Transaction ID</th>
                    <th style={TXN_TH}>Payment Method</th>
                    <th style={TXN_TH}>Currency</th>
                    <th style={{ ...TXN_TH, textAlign:"right" }}>Amount</th>
                    <th style={TXN_TH}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map(tx => {
                    const isCredit = tx.raw >= 0;
                    const pm = TXN_PM_COLORS[tx.method] || ["#F3F4F6","#374151"];
                    const cd = TXN_CURR_META[tx.code] || {};
                    return (
                      <tr key={tx.id} onMouseEnter={e => e.currentTarget.style.background="#FAFAFA"} onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                        <td style={{ ...TXN_TD, whiteSpace:"nowrap", color:T.grey600, fontSize:12 }}>{fmtDt(tx.dt)}</td>
                        <td style={{ ...TXN_TD, maxWidth:220 }}><div style={{ fontWeight:500 }}>{tx.desc}</div></td>
                        <td style={TXN_TD}>
                          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                            <span style={{ fontFamily:"monospace", fontSize:11, color:T.grey600 }}>{tx.id}</span>
                            <button onClick={() => handleCopy(tx.id)}
                              style={{ background:"none", border:`1px solid ${T.grey200}`, borderRadius:4, padding:"2px 6px", fontSize:10, cursor:"pointer", color: copiedId === tx.id ? T.greenText : T.grey400, fontFamily:T.font, whiteSpace:"nowrap", transition:"color 0.12s" }}>
                              {copiedId === tx.id ? "✓ Copied" : "Copy"}
                            </button>
                          </div>
                        </td>
                        <td style={TXN_TD}>
                          <span style={{ display:"inline-block", padding:"3px 9px", borderRadius:20, fontSize:11, fontWeight:600, background:pm[0], color:pm[1] }}>
                            {TXN_PM_LABEL[tx.method] || tx.method}
                          </span>
                        </td>
                        <td style={TXN_TD}>
                          <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, fontWeight:600, whiteSpace:"nowrap" }}>
                            <span>{cd.flag}</span>{tx.code}
                          </span>
                        </td>
                        <td style={{ ...TXN_TD, textAlign:"right", fontWeight:700, fontSize:13, color: isCredit ? T.greenText : T.redErrText, whiteSpace:"nowrap" }}>
                          {fmtAmt(tx)}
                        </td>
                        <td style={TXN_TD}><Pill label={tx.status} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {totalPages > 1 && (
            <div style={{ padding:"14px 18px", borderTop:`1px solid ${T.grey100}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <button onClick={() => setTxnPage(p => Math.max(1, p - 1))} disabled={txnPage === 1}
                style={{ padding:"7px 14px", fontSize:12, fontWeight:600, borderRadius:7, border:`1px solid ${T.grey200}`, background: txnPage === 1 ? T.grey50 : T.white, color: txnPage === 1 ? T.grey300 : T.black, cursor: txnPage === 1 ? "default" : "pointer", fontFamily:T.font }}>
                ← Previous
              </button>
              <div style={{ display:"flex", gap:4 }}>
                {Array.from({ length:totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setTxnPage(p)}
                    style={{ width:32, height:32, borderRadius:7, border: p === txnPage ? "none" : `1px solid ${T.grey200}`, background: p === txnPage ? T.redPrimary : T.white, color: p === txnPage ? T.white : T.black, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:T.font }}>
                    {p}
                  </button>
                ))}
              </div>
              <button onClick={() => setTxnPage(p => Math.min(totalPages, p + 1))} disabled={txnPage === totalPages}
                style={{ padding:"7px 14px", fontSize:12, fontWeight:600, borderRadius:7, border:`1px solid ${T.grey200}`, background: txnPage === totalPages ? T.grey50 : T.white, color: txnPage === totalPages ? T.grey300 : T.black, cursor: txnPage === totalPages ? "default" : "pointer", fontFamily:T.font }}>
                Next →
              </button>
            </div>
          )}
        </div>

        <div style={{ marginTop:40 }}><Footer /></div>
      </div>
    </AppShell>
  );
}

/* ═══════════════════════════════════════════════════════════
   MSA VIEWER MODAL
═══════════════════════════════════════════════════════════ */
const MSA_CONTENT = [
  { head: null }, // page 1 = cover — special rendering
  { head: "1. DEFINITIONS AND INTERPRETATION", body: `1.1 "Account" means any multi-currency account opened by Customer pursuant to this Agreement.\n\n1.2 "Applicable Law" means all statutes, regulations, orders, and guidelines applicable to the Services, including the IFSCA Act 2019, FEMA 1999, PMLA 2002, and all applicable RBI guidelines.\n\n1.3 "Business Day" means any day other than a Saturday, Sunday, or public holiday in India or in the jurisdiction of the relevant currency.\n\n1.4 "Confidential Information" means information disclosed by one party to the other that is designated as confidential or should reasonably be understood as such.\n\n1.5 "Customer Data" means all data and information submitted by Customer to Service Provider in connection with the Services.\n\n1.6 "Fees" means the charges payable by Customer as set out in Schedule 2 to this Agreement.\n\n1.7 "Services" means the multi-currency banking and payment services described in Schedule 1.` },
  { head: "2. SERVICES", body: `2.1 Provision of Services. Subject to the terms of this Agreement and payment of applicable Fees, Service Provider shall provide the Services described in Schedule 1 following completion of the account onboarding process.\n\n2.2 Account Opening. Customer may open multi-currency accounts in currencies approved by Service Provider, subject to completion of all KYC and AML requirements.\n\n2.3 Account Operations. Customer may receive funds, hold balances, and make payments from its Accounts in accordance with this Agreement and Service Provider's transaction policies.\n\n2.4 Correspondent Banking. Service Provider uses correspondent banking to facilitate international payments. Service Provider shall not be liable for delays caused by correspondent banks acting in accordance with their own policies.` },
  { head: "2. SERVICES (CONTINUED)", body: `2.5 Transaction Limits. Service Provider may impose limits on transaction amounts, frequency, and types. Limits may be updated upon notice to Customer.\n\n2.6 Service Availability. Service Provider will use commercially reasonable efforts to ensure availability. Scheduled maintenance or circumstances beyond its control may result in temporary unavailability.\n\n2.7 Compliance. Both parties agree to comply with all Applicable Laws. Customer agrees to provide all documentation reasonably requested for compliance purposes.\n\n2.8 Changes to Services. Service Provider may modify the Services upon thirty (30) days' prior written notice. Material changes that adversely affect Customer entitle Customer to terminate without penalty.` },
  { head: "3. FEES AND PAYMENT", body: `3.1 Fees. Customer agrees to pay the fees set forth in Schedule 2. Service Provider may update fees upon thirty (30) days' prior written notice.\n\n3.2 Currency of Fees. All fees shall be payable in Indian Rupees (INR) unless otherwise specified. Service Provider may deduct fees directly from Customer Account balances.\n\n3.3 Taxes. Customer is responsible for all taxes and duties imposed on the Services, excluding taxes on Service Provider's net income.\n\n3.4 Late Payments. Unpaid fees shall accrue interest at 1.5% per month or the maximum rate permitted by law, whichever is lower.\n\n3.5 Disputes. Customer must notify Service Provider within thirty (30) days of an invoice to dispute any amount. Failure to do so constitutes acceptance.` },
  { head: "4. TERM AND TERMINATION", body: `4.1 Term. This Agreement commences on the Effective Date and continues for an initial term of one (1) year, renewing automatically for successive one-year periods unless either party provides sixty (60) days' written notice of non-renewal.\n\n4.2 Termination for Convenience. Either party may terminate upon sixty (60) days' prior written notice.\n\n4.3 Termination for Cause. Either party may terminate immediately if the other materially breaches and fails to cure within thirty (30) days of notice, or becomes insolvent.\n\n4.4 Effect of Termination. Upon termination: Customer shall cease using the Services; Service Provider shall close Accounts and return remaining balances; all licenses shall terminate.` },
  { head: "5. CONFIDENTIALITY", body: `5.1 Each party agrees to maintain in strict confidence all Confidential Information of the other party, not to disclose it to third parties without prior written consent, and to use it solely for the purposes of this Agreement.\n\n5.2 Exceptions. Confidentiality obligations do not apply to information that: is or becomes publicly available without breach; was already known to the receiving party; is received from a third party without restriction; or is independently developed without use of Confidential Information.\n\n5.3 Regulatory Disclosure. A party may disclose Confidential Information to the extent required by law, regulation, or court order, provided it gives the other party prompt prior written notice to the extent permitted.` },
  { head: "6. DATA PROTECTION AND PRIVACY", body: `6.1 Customer Data. Service Provider will process Customer Data only as necessary to provide the Services and in accordance with applicable data protection laws.\n\n6.2 Security. Service Provider will implement appropriate technical and organizational measures to protect Customer Data against unauthorized access, disclosure, alteration, or destruction.\n\n6.3 Breach Notification. Service Provider will notify Customer without undue delay upon becoming aware of a security breach affecting Customer Data.\n\n6.4 Data Retention. Service Provider will retain Customer Data for the period required by Applicable Law and will thereafter securely delete or anonymize such data.\n\n6.5 Customer Obligations. Customer is responsible for ensuring its use of the Services and data it provides complies with all applicable data protection laws.` },
  { head: "7. INTELLECTUAL PROPERTY", body: `7.1 Service Provider's IP. All intellectual property in and to the Services — including software, technology, processes, and documentation — is owned by Service Provider or its licensors. Nothing herein grants Customer any ownership interest.\n\n7.2 Customer's IP. All intellectual property in Customer Data is owned by Customer. Customer grants Service Provider a limited license to use Customer Data solely as necessary to provide the Services.\n\n7.3 Feedback. Service Provider may freely use any feedback, suggestions, or recommendations provided by Customer regarding the Services without restriction or obligation.\n\n7.4 Restrictions. Customer shall not reverse engineer, decompile, or otherwise attempt to derive source code from any software used in connection with the Services.` },
  { head: "8. REPRESENTATIONS AND WARRANTIES", body: `8.1 Mutual. Each party represents that: it is duly organized and validly existing; it has authority to enter into this Agreement; this Agreement constitutes a valid and binding obligation; and its execution does not violate any applicable laws or other agreements.\n\n8.2 Service Provider Warranties. Service Provider warrants that it holds all necessary licenses and regulatory approvals to provide the Services; Services will be provided in a professional manner; and it will comply with all Applicable Laws.\n\n8.3 Customer Warranties. Customer warrants that it will use the Services only for lawful purposes; all information provided is accurate and complete; and it will comply with all Applicable Laws.` },
  { head: "9. LIMITATION OF LIABILITY", body: `9.1 Exclusion of Consequential Damages. TO THE MAXIMUM EXTENT PERMITTED BY LAW, NEITHER PARTY SHALL BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, LOSS OF DATA, OR LOSS OF BUSINESS OPPORTUNITIES.\n\n9.2 Aggregate Cap. SERVICE PROVIDER'S TOTAL AGGREGATE LIABILITY SHALL NOT EXCEED THE TOTAL FEES PAID BY CUSTOMER IN THE THREE (3) MONTHS PRECEDING THE EVENT GIVING RISE TO SUCH LIABILITY.\n\n9.3 Essential Basis. The parties acknowledge that these limitations reflect a reasonable allocation of risk and are an essential element of the basis of the bargain between them.` },
  { head: "10. INDEMNIFICATION", body: `10.1 Customer Indemnification. Customer shall indemnify and hold Service Provider harmless from all claims, damages, losses, costs, and expenses (including legal fees) arising from: Customer's breach; Customer's violation of Applicable Law; any third-party claim from Customer's use of the Services; or inaccurate information provided by Customer.\n\n10.2 Service Provider Indemnification. Service Provider shall indemnify Customer from claims arising from: Service Provider's material breach; Service Provider's gross negligence or willful misconduct; or any claim that the Services infringe third-party intellectual property rights.\n\n10.3 Procedure. The indemnified party must promptly notify the indemnifying party and reasonably cooperate in the defense of any claim.` },
  { head: "11. COMPLIANCE AND REGULATORY", body: `11.1 Regulatory Framework. Service Provider operates under the International Financial Services Centres Authority (IFSCA) Act, 2019 and all applicable rules and guidelines issued thereunder.\n\n11.2 KYC and AML. Customer agrees to comply with all KYC and AML requirements as stipulated by Service Provider and Applicable Law. Customer authorizes Service Provider to conduct ongoing due diligence checks as required.\n\n11.3 Sanctions. Customer represents it is not a restricted person under any applicable sanctions regime and agrees not to use the Services for any purpose that would violate applicable sanctions laws.\n\n11.4 Reporting. Customer acknowledges that Service Provider may be required to report certain transactions to regulatory authorities and agrees to cooperate fully with such reporting obligations.` },
  { head: "12. FORCE MAJEURE", body: `12.1 Neither party shall be liable for failure or delay caused by circumstances beyond its reasonable control, including acts of God, natural disasters, war, terrorism, epidemic or pandemic, governmental actions, power failures, or internet service disruptions.\n\n12.2 A party claiming force majeure shall promptly notify the other party, specifying the nature of the event, expected duration, and steps being taken to address the situation.\n\n12.3 If a force majeure event continues for more than ninety (90) days, either party may terminate this Agreement upon written notice without further liability, except for obligations accrued prior to the event.` },
  { head: "13. DISPUTE RESOLUTION", body: `13.1 Informal Resolution. The parties shall first attempt to resolve any dispute through good-faith negotiation between senior representatives within thirty (30) days of written notice of a dispute.\n\n13.2 Arbitration. If negotiation fails, the dispute shall be referred to binding arbitration under the rules of the Indian Council of Arbitration. Arbitration shall take place in Ahmedabad, Gujarat. Language shall be English. The award shall be final and binding on both parties.\n\n13.3 Governing Law. This Agreement is governed by the laws of India. Subject to the arbitration clause, the courts of Ahmedabad, Gujarat shall have exclusive jurisdiction.` },
  { head: "14. ASSIGNMENT", body: `14.1 Customer Assignment. Customer may not assign this Agreement without Service Provider's prior written consent, which shall not be unreasonably withheld.\n\n14.2 Service Provider Assignment. Service Provider may assign to an affiliate or in connection with a merger or sale of substantially all of its assets, provided Customer receives written notice.\n\n14.3 Notices. All notices shall be in writing and delivered by personal delivery, overnight courier, or email. Notices are deemed delivered upon personal delivery, one Business Day after courier, or upon confirmed receipt of email.\n\n14.4 Binding Effect. This Agreement shall be binding upon and inure to the benefit of both parties and their respective permitted successors and assigns.` },
  { head: "15. AMENDMENTS AND WAIVERS", body: `15.1 Amendments by Service Provider. Service Provider may amend this Agreement upon thirty (30) days' prior written notice. Material changes that adversely affect Customer shall include a description of the change and its effective date.\n\n15.2 Customer Acceptance. Continued use of the Services after the notice period constitutes acceptance. If Customer does not accept a material amendment, it may terminate without penalty before the effective date.\n\n15.3 No Oral Modifications. No oral modification or waiver of any term is effective. All modifications must be in writing.\n\n15.4 No Waiver. Failure to exercise any right does not constitute a waiver. No single exercise of any right precludes any other or further exercise.` },
  { head: "16. GENERAL PROVISIONS", body: `16.1 Severability. If any provision is held invalid or unenforceable, the remaining provisions continue in full force and effect.\n\n16.2 Entire Agreement. This Agreement, together with its Schedules, constitutes the entire agreement between the parties and supersedes all prior negotiations, representations, and understandings.\n\n16.3 Counterparts. This Agreement may be executed in counterparts. Electronic signatures are legally valid and binding in accordance with the Information Technology Act, 2000 and its amendments.\n\n16.4 Language. This Agreement is in English. In the event of any conflict with a translation, the English version shall prevail.\n\n16.5 Headings. Section headings are for convenience only and do not affect interpretation.` },
  { head: "SCHEDULE 1 — SERVICES DESCRIPTION", body: `The following services are provided by DecFin Fintech Services IFSC Private Limited:\n\n1. MULTI-CURRENCY ACCOUNTS\n   Opening and maintenance of accounts in USD, EUR, GBP, AUD, SGD, HKD and other approved currencies. Real-time balance visibility and transaction reporting.\n\n2. PAYMENT SERVICES\n   International wire transfers (SWIFT). Local payment schemes: ACH (USD), SEPA (EUR), Faster Payments (GBP), FAST (SGD). Beneficiary management, payment scheduling, and transaction status tracking.\n\n3. FOREIGN EXCHANGE\n   Spot FX conversions between supported currencies at competitive rates with transparent fee disclosure.\n\n4. REPORTING AND API\n   Real-time notifications, monthly statements, API access for automated reconciliation, and custom reports on request.` },
  { head: "SIGNATURE PAGE", body: `This Master Services Agreement is entered into as of the date of the last signature below.\n\nDECFIN FINTECH SERVICES IFSC PRIVATE LIMITED\n\nBy: ___________________________\nName: _________________________\nTitle: Chief Executive Officer\nDate: __________________________\n\n\nCUSTOMER ENTITY\n\nBy: ___________________________\nName: _________________________\nTitle: __________________________\nDate: __________________________\n\n\n─────────────────────────────────────\nELECTRONIC SIGNATURE ACKNOWLEDGMENT\n\nBy electronically signing this Agreement, each signatory acknowledges having read and understood the Agreement in full, having authority to bind the respective entity, and that the electronic signature is legally binding under the Information Technology Act, 2000.` },
];

function MSAViewerModal({ onClose }) {
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingPage, setEditingPage] = useState(false);
  const [pageInput, setPageInput] = useState("1");
  const scrollRef = useRef(null);
  const pageRefs = useRef([]);
  const TOTAL_PAGES = MSA_CONTENT.length;

  const changeZoom = delta => setZoom(z => Math.min(200, Math.max(50, z + delta)));

  const goToPage = n => {
    const p = Math.min(TOTAL_PAGES, Math.max(1, Number(n) || 1));
    setCurrentPage(p);
    setPageInput(String(p));
    const el = pageRefs.current[p - 1];
    if (el) el.scrollIntoView({ behavior:"smooth", block:"start" });
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = "/Decfin_IFSC_MSA_Template.pdf";
    a.download = "Decfin_IFSC_MSA_Template.pdf";
    a.click();
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const track = () => {
      const cTop = container.getBoundingClientRect().top;
      let nearest = 0, nearestDist = Infinity;
      pageRefs.current.forEach((el, i) => {
        if (!el) return;
        const d = Math.abs(el.getBoundingClientRect().top - cTop - 40);
        if (d < nearestDist) { nearestDist = d; nearest = i; }
      });
      setCurrentPage(nearest + 1);
      setPageInput(String(nearest + 1));
    };
    container.addEventListener("scroll", track, { passive:true });
    return () => container.removeEventListener("scroll", track);
  }, []);

  const tbBtn = (extra = {}) => ({
    padding:"4px 10px", borderRadius:6, border:`1px solid ${T.grey200}`,
    background:T.white, cursor:"pointer", fontFamily:T.font, fontSize:13, ...extra,
  });

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.72)", zIndex:800, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ width:"80vw", height:"85vh", background:T.white, borderRadius:14, display:"flex", flexDirection:"column", overflow:"hidden", boxShadow:"0 16px 64px rgba(0,0,0,0.4)" }}>

        {/* Header */}
        <div style={{ padding:"13px 20px", borderBottom:`1px solid ${T.grey200}`, display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:18 }}>📄</span>
            <span style={{ fontSize:15, fontWeight:700, color:T.black }}>Master Service Agreement</span>
            <span style={{ background:"#FEE2E2", color:"#DC2626", borderRadius:5, padding:"2px 8px", fontSize:11, fontWeight:700 }}>PDF</span>
          </div>
          <button onClick={onClose} style={{ border:"none", background:"none", cursor:"pointer", fontSize:22, color:T.grey400, lineHeight:1, padding:4 }}>×</button>
        </div>

        {/* Toolbar */}
        <div style={{ padding:"8px 16px", borderBottom:`1px solid ${T.grey100}`, background:T.grey50, display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
          {/* Page navigation */}
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <button style={tbBtn({ color: currentPage === 1 ? T.grey300 : T.black, cursor: currentPage === 1 ? "default" : "pointer" })}
              onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>←</button>
            <div style={{ display:"flex", alignItems:"center", gap:4, fontSize:13, color:T.grey600 }}>
              <span>Page</span>
              {editingPage ? (
                <input autoFocus value={pageInput}
                  onChange={e => setPageInput(e.target.value)}
                  onBlur={() => { setEditingPage(false); goToPage(pageInput); }}
                  onKeyDown={e => {
                    if (e.key === "Enter") { setEditingPage(false); goToPage(pageInput); }
                    else if (e.key === "Escape") { setEditingPage(false); setPageInput(String(currentPage)); }
                  }}
                  style={{ width:36, padding:"2px 4px", border:`1.5px solid ${T.redPrimary}`, borderRadius:4, fontSize:13, fontFamily:T.font, textAlign:"center", outline:"none" }} />
              ) : (
                <span onClick={() => { setEditingPage(true); setPageInput(String(currentPage)); }}
                  style={{ minWidth:28, padding:"2px 6px", borderRadius:4, border:`1px solid ${T.grey200}`, background:T.white, textAlign:"center", cursor:"text", fontWeight:600, color:T.black }}>
                  {currentPage}
                </span>
              )}
              <span>of {TOTAL_PAGES}</span>
            </div>
            <button style={tbBtn({ color: currentPage === TOTAL_PAGES ? T.grey300 : T.black, cursor: currentPage === TOTAL_PAGES ? "default" : "pointer" })}
              onClick={() => goToPage(currentPage + 1)} disabled={currentPage === TOTAL_PAGES}>→</button>
          </div>

          {/* Zoom + download */}
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <button style={tbBtn({ color: zoom <= 50 ? T.grey300 : T.black, cursor: zoom <= 50 ? "default" : "pointer", fontWeight:700 })}
              onClick={() => changeZoom(-25)} disabled={zoom <= 50}>−</button>
            <span style={{ fontSize:12, fontWeight:600, color:T.grey600, minWidth:42, textAlign:"center" }}>{zoom}%</span>
            <button style={tbBtn({ color: zoom >= 200 ? T.grey300 : T.black, cursor: zoom >= 200 ? "default" : "pointer", fontWeight:700 })}
              onClick={() => changeZoom(25)} disabled={zoom >= 200}>+</button>
            <button style={tbBtn({ fontSize:11, fontWeight:600, color:T.grey600, whiteSpace:"nowrap" })} onClick={() => setZoom(100)}>Fit Width</button>
            <div style={{ width:1, height:20, background:T.grey200 }} />
            <button style={tbBtn({ color:T.grey600 })} onClick={handleDownload} title="Download PDF">⬇</button>
          </div>
        </div>

        {/* Page content area */}
        <div ref={scrollRef} style={{ flex:1, overflowY:"auto", overflowX:"auto", background:"#525252", padding:"24px 0" }}>
          {MSA_CONTENT.map((pg, i) => (
            <div key={i} ref={el => { pageRefs.current[i] = el; }}
              style={{ width:(680 * zoom/100) + "px", minHeight:(960 * zoom/100) + "px", background:T.white, boxShadow:"0 2px 10px rgba(0,0,0,0.35)", margin:"0 auto 20px", padding:`${52*zoom/100}px ${64*zoom/100}px`, boxSizing:"border-box", position:"relative" }}>

              {/* Page number footer */}
              <div style={{ position:"absolute", bottom:24*zoom/100, left:0, right:0, textAlign:"center", fontSize:10*zoom/100, color:T.grey300 }}>— {i+1} —</div>

              {i === 0 ? (
                /* Cover page */
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:(820*zoom/100)+"px", textAlign:"center", gap:16*zoom/100, fontFamily:"Georgia,serif" }}>
                  <div style={{ fontSize:9*zoom/100, letterSpacing:3*zoom/100, color:T.grey400, fontFamily:T.font, textTransform:"uppercase" }}>CONFIDENTIAL</div>
                  <div style={{ width:52*zoom/100, height:2*zoom/100, background:"#DC2626" }} />
                  <div style={{ fontSize:20*zoom/100, fontWeight:700, color:"#111", letterSpacing:0.5*zoom/100 }}>MASTER SERVICES AGREEMENT</div>
                  <div style={{ fontSize:11*zoom/100, color:T.grey400, marginTop:4*zoom/100 }}>Between</div>
                  <div style={{ fontSize:14*zoom/100, fontWeight:700, color:"#111" }}>DecFin Fintech Services IFSC Private Limited</div>
                  <div style={{ fontSize:11*zoom/100, color:T.grey400 }}>AND</div>
                  <div style={{ fontSize:14*zoom/100, fontWeight:700, color:"#111" }}>Customer Entity (as defined herein)</div>
                  <div style={{ width:52*zoom/100, height:2*zoom/100, background:"#DC2626", marginTop:16*zoom/100 }} />
                  <div style={{ fontSize:10*zoom/100, color:T.grey400, marginTop:8*zoom/100 }}>GIFT City, Gandhinagar, Gujarat — India</div>
                </div>
              ) : (
                <div style={{ fontFamily:"Georgia,'Times New Roman',serif", fontSize:11.5*zoom/100, lineHeight:1.75, color:"#1A1A1A" }}>
                  <div style={{ fontSize:12*zoom/100, fontWeight:700, fontFamily:T.font, marginBottom:14*zoom/100, paddingBottom:8*zoom/100, borderBottom:`1.5px solid #E5E7EB`, color:"#111827" }}>
                    {pg.head}
                  </div>
                  <div style={{ whiteSpace:"pre-wrap" }}>{pg.body}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding:"12px 20px", borderTop:`1px solid ${T.grey100}`, display:"flex", gap:8, justifyContent:"flex-end", flexShrink:0 }}>
          <BtnSecondary onClick={onClose} style={{ fontSize:13, padding:"9px 20px" }}>Close</BtnSecondary>
          <BtnPrimary onClick={handleDownload} style={{ fontSize:13, padding:"9px 20px" }}>⬇ Download PDF</BtnPrimary>
        </div>
      </div>
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
                <span style={{ fontSize:12, color:T.redPrimary, fontWeight:600 }}>+ Open New Currency Account</span>
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
  const [msaStatus, setMsaStatus] = useState("pending"); // pending | sent | signed
  const [msaSubScreen, setMsaSubScreen] = useState(null); // null | "form" | "tracking" | "edit"
  const [showMSAViewer, setShowMSAViewer] = useState(false);
  const [signerName, setSignerName] = useState("");
  const [signerEmail, setSignerEmail] = useState("");
  const [signerNameErr, setSignerNameErr] = useState(false);
  const [signerEmailErr, setSignerEmailErr] = useState(false);
  const [msaSentAt, setMsaSentAt] = useState(null);
  const [signedAt, setSignedAt] = useState(null);

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

        ) : msaSubScreen === "form" ? (

          /* ── Screen 1: Acknowledgement & Signer Info ── */
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:T.redPrimary, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Step 3 of 3</div>
            <h2 style={{ fontSize:21, fontWeight:800, color:T.black, margin:"0 0 8px" }}>Master Services Agreement Acknowledgement and E-signing</h2>
            <p style={{ fontSize:14, color:T.grey400, margin:"0 0 20px", lineHeight:1.6 }}>An agreement will be sent to the signer's email ID for electronic signature to complete the Multi-Currency account activation.</p>

            {/* Document card */}
            <div style={{ background:T.white, borderRadius:10, border:`1px solid ${T.grey200}`, padding:"14px 16px", marginBottom:20, display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:40, height:48, borderRadius:6, background:"#FEE2E2", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:20 }}>📄</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:700, color:T.black }}>Master Service Agreement</div>
                <div style={{ fontSize:12, color:T.grey400, marginTop:2 }}>Decfin_IFSC_MSA_Template.pdf · 20 pages</div>
              </div>
              <span style={{ background:"#FEE2E2", color:"#DC2626", borderRadius:6, padding:"3px 10px", fontSize:11, fontWeight:700, letterSpacing:0.3, flexShrink:0 }}>PDF</span>
              <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                <button onClick={() => setShowMSAViewer(true)}
                  style={{ padding:"6px 12px", fontSize:12, fontWeight:600, borderRadius:6, border:`1px solid ${T.grey200}`, background:T.white, color:T.grey600, cursor:"pointer", fontFamily:T.font }}>
                  View
                </button>
                <button onClick={() => { const a = document.createElement("a"); a.href="/Decfin_IFSC_MSA_Template.pdf"; a.download="Decfin_IFSC_MSA_Template.pdf"; a.click(); }}
                  style={{ padding:"6px 12px", fontSize:12, fontWeight:600, borderRadius:6, border:`1px solid ${T.grey200}`, background:T.white, color:T.grey600, cursor:"pointer", fontFamily:T.font, display:"flex", alignItems:"center", gap:4 }}>
                  ⬇ Download
                </button>
              </div>
            </div>

            {/* Form */}
            <div style={{ background:T.white, borderRadius:12, padding:20, boxShadow:"0 1px 4px rgba(0,0,0,0.06)", display:"flex", flexDirection:"column", gap:14, marginBottom:20 }}>
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:T.black, display:"block", marginBottom:6 }}>Signer Name <span style={{ color:T.redPrimary }}>*</span></label>
                <input value={signerName} onChange={e => { setSignerName(e.target.value); setSignerNameErr(false); }} placeholder="Enter"
                  style={{ width:"100%", boxSizing:"border-box", padding:"10px 12px", border:`1.5px solid ${signerNameErr ? T.redPrimary : T.grey200}`, borderRadius:8, fontSize:14, fontFamily:T.font, outline:"none", color:T.black }} />
                {signerNameErr && <div style={{ fontSize:12, color:T.redPrimary, marginTop:4 }}>Signer name is required.</div>}
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:T.black, display:"block", marginBottom:6 }}>Signer Email ID <span style={{ color:T.redPrimary }}>*</span></label>
                <input type="email" value={signerEmail} onChange={e => { setSignerEmail(e.target.value); setSignerEmailErr(false); }} placeholder="Enter"
                  style={{ width:"100%", boxSizing:"border-box", padding:"10px 12px", border:`1.5px solid ${signerEmailErr ? T.redPrimary : T.grey200}`, borderRadius:8, fontSize:14, fontFamily:T.font, outline:"none", color:T.black }} />
                {signerEmailErr && <div style={{ fontSize:12, color:T.redPrimary, marginTop:4 }}>Please enter a valid email address.</div>}
              </div>
            </div>

            <div style={{ display:"flex", gap:10 }}>
              <BtnSecondary onClick={() => setMsaSubScreen(null)} style={{ flex:1, padding:"12px" }}>Go back</BtnSecondary>
              <BtnPrimary style={{ flex:1, padding:"12px" }} onClick={() => {
                let ok = true;
                if (!signerName.trim()) { setSignerNameErr(true); ok = false; }
                if (!signerEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signerEmail)) { setSignerEmailErr(true); ok = false; }
                if (!ok) return;
                setMsaSentAt(new Date());
                setMsaStatus("sent");
                setMsaSubScreen("tracking");
              }}>Submit</BtnPrimary>
            </div>
          </div>

        ) : msaSubScreen === "tracking" ? (

          /* ── Screen 2: eSign Tracking ── */
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:T.redPrimary, textTransform:"uppercase", letterSpacing:1, marginBottom:16 }}>Step 3 of 3</div>

            {/* Green success banner */}
            <div style={{ background:T.greenBg, border:`1px solid ${T.greenBorder}`, borderRadius:12, padding:"16px 18px", marginBottom:24, display:"flex", alignItems:"flex-start", gap:12 }}>
              <div style={{ width:30, height:30, borderRadius:"50%", background:T.greenText, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, color:T.white, fontSize:14, fontWeight:700 }}>✓</div>
              <div>
                <div style={{ fontSize:14, fontWeight:700, color:T.greenText, marginBottom:3 }}>Multi-Currency Account Activation Request Submitted</div>
                <div style={{ fontSize:13, color:T.greenText, opacity:0.85 }}>Your MSA has been successfully sent for electronic signature.</div>
              </div>
            </div>

            {/* Horizontal progress tracker */}
            <div style={{ background:T.white, borderRadius:12, boxShadow:"0 1px 4px rgba(0,0,0,0.06)", padding:"22px 24px", marginBottom:14 }}>
              <div style={{ fontSize:13, fontWeight:700, color:T.black, marginBottom:20 }}>eSign Progress</div>
              <div style={{ display:"flex", alignItems:"flex-start" }}>
                {/* Step 1 — sent (always complete) */}
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flex:1 }}>
                  <div style={{ width:28, height:28, borderRadius:"50%", background:T.greenText, border:`2px solid ${T.greenText}`, display:"flex", alignItems:"center", justifyContent:"center", color:T.white, fontSize:13, fontWeight:700 }}>✓</div>
                  <div style={{ fontSize:12, fontWeight:600, color:T.greenText, marginTop:8, textAlign:"center" }}>Agreement sent</div>
                  <div style={{ fontSize:11, color:T.grey400, marginTop:2, textAlign:"center", wordBreak:"break-all" }}>to {signerEmail}</div>
                  {msaSentAt && <div style={{ fontSize:11, color:T.grey400, marginTop:3, textAlign:"center" }}>{msaSentAt.toLocaleString("en-IN", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit", hour12:true })}</div>}
                </div>
                {/* Connector */}
                <div style={{ height:2, flex:1, background: msaStatus === "signed" ? T.greenText : T.grey200, marginTop:14, flexShrink:0 }} />
                {/* Step 2 — signed (pending until done) */}
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flex:1 }}>
                  <div style={{ width:28, height:28, borderRadius:"50%", background: msaStatus === "signed" ? T.greenText : T.white, border:`2px solid ${msaStatus === "signed" ? T.greenText : T.grey200}`, display:"flex", alignItems:"center", justifyContent:"center", color: msaStatus === "signed" ? T.white : T.grey300, fontSize:13, fontWeight:700 }}>
                    {msaStatus === "signed" ? "✓" : ""}
                  </div>
                  <div style={{ fontSize:12, fontWeight:600, color: msaStatus === "signed" ? T.greenText : T.grey400, marginTop:8, textAlign:"center" }}>Agreement Signed</div>
                  <div style={{ fontSize:11, color:T.grey400, marginTop:3, textAlign:"center" }}>
                    {msaStatus === "signed" && signedAt ? signedAt.toLocaleString("en-IN", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit", hour12:true }) : "Pending signature"}
                  </div>
                </div>
              </div>
            </div>

            {/* Details table */}
            <div style={{ background:T.white, borderRadius:12, boxShadow:"0 1px 4px rgba(0,0,0,0.06)", overflow:"hidden", marginBottom:14 }}>
              <div style={{ padding:"12px 20px", borderBottom:`1px solid ${T.grey100}`, display:"flex", alignItems:"center" }}>
                <span style={{ fontSize:12, color:T.grey400, fontWeight:500, flex:1 }}>Signer (Customer)</span>
                <span style={{ fontSize:13, color:T.black, fontWeight:600 }}>{signerName}</span>
              </div>
              <div style={{ padding:"12px 20px", display:"flex", alignItems:"center" }}>
                <span style={{ fontSize:12, color:T.grey400, fontWeight:500, flex:1 }}>Entity</span>
                <span style={{ fontSize:13, color:T.black, fontWeight:600 }}>{bizName}</span>
              </div>
            </div>

            {/* Prototype: simulate signing */}
            {msaStatus !== "signed" && (
              <div style={{ background:T.amberBg, border:`1px solid ${T.amberBorder}`, borderRadius:8, padding:"10px 14px", marginBottom:14, display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
                <span style={{ fontSize:12, color:T.amberText }}>Prototype: simulate the signer completing eSign</span>
                <button onClick={() => { setMsaStatus("signed"); setSignedAt(new Date()); }}
                  style={{ padding:"5px 12px", fontSize:12, fontWeight:600, borderRadius:6, border:`1.5px solid ${T.amberText}`, background:"transparent", color:T.amberText, cursor:"pointer", fontFamily:T.font, whiteSpace:"nowrap", flexShrink:0 }}>
                  Mark as Signed ✓
                </button>
              </div>
            )}

            <div style={{ display:"flex", gap:10 }}>
              <BtnSecondary onClick={() => setMsaSubScreen(null)} style={{ flex:1, padding:"12px" }}>Go Back</BtnSecondary>
              <BtnPrimary onClick={() => setMsaSubScreen("edit")} style={{ flex:1, padding:"12px" }}>Edit eSign Info</BtnPrimary>
            </div>
          </div>

        ) : msaSubScreen === "edit" ? (

          /* ── Screen 3: Edit Signer Information ── */
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:T.redPrimary, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Step 3 of 3</div>
            <h2 style={{ fontSize:22, fontWeight:800, color:T.black, margin:"0 0 20px" }}>Edit Signer Information</h2>

            <div style={{ background:T.white, borderRadius:12, padding:20, boxShadow:"0 1px 4px rgba(0,0,0,0.06)", display:"flex", flexDirection:"column", gap:14, marginBottom:16 }}>
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:T.black, display:"block", marginBottom:6 }}>Signer Name</label>
                <input value={signerName} onChange={e => setSignerName(e.target.value)}
                  style={{ width:"100%", boxSizing:"border-box", padding:"10px 12px", border:`1.5px solid ${T.grey200}`, borderRadius:8, fontSize:14, fontFamily:T.font, outline:"none", color:T.black }} />
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:T.black, display:"block", marginBottom:6 }}>Enter email ID</label>
                <div style={{ display:"flex", gap:8 }}>
                  <input type="email" value={signerEmail} onChange={e => setSignerEmail(e.target.value)}
                    style={{ flex:1, padding:"10px 12px", border:`1.5px solid ${T.grey200}`, borderRadius:8, fontSize:14, fontFamily:T.font, outline:"none", color:T.black }} />
                  <button onClick={() => window.open("about:blank", "_blank")}
                    style={{ padding:"10px 16px", fontSize:13, fontWeight:600, borderRadius:8, border:`1.5px solid ${T.redPrimary}`, background:T.white, color:T.redPrimary, cursor:"pointer", fontFamily:T.font, whiteSpace:"nowrap", flexShrink:0 }}>
                    View MSA
                  </button>
                </div>
                {msaSentAt && (
                  <div style={{ fontSize:12, color:T.greenText, marginTop:6 }}>
                    Document was last sent for eSign on {msaSentAt.toLocaleDateString("en-IN", { day:"2-digit", month:"long", year:"numeric" })}, at {msaSentAt.toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit", hour12:true })}.
                  </div>
                )}
              </div>
            </div>

            {/* Amber note */}
            <div style={{ background:T.amberBg, border:`1px solid ${T.amberBorder}`, borderRadius:10, padding:"12px 16px", marginBottom:20, display:"flex", alignItems:"flex-start", gap:8 }}>
              <span style={{ flexShrink:0 }}>⚠️</span>
              <div style={{ fontSize:13, color:T.amberText, lineHeight:1.5 }}>
                <strong>Note:</strong> The agreement will be sent to the provided email ID for the purpose of eSign.
              </div>
            </div>

            <div style={{ display:"flex", gap:10 }}>
              <BtnSecondary onClick={() => setMsaSubScreen("tracking")} style={{ flex:1, padding:"12px" }}>Go back</BtnSecondary>
              <BtnPrimary style={{ flex:1, padding:"12px" }} onClick={() => {
                setMsaSentAt(new Date());
                setMsaStatus("sent");
                setSignedAt(null);
                setMsaSubScreen("tracking");
              }}>Send Document for eSign</BtnPrimary>
            </div>
          </div>

        ) : (

          /* ── Step 3 default: main MSA view ── */
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:T.redPrimary, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Step 3 of 3</div>
            <h2 style={{ fontSize:24, fontWeight:800, color:T.black, margin:"0 0 6px" }}>Sign Master Services Agreement</h2>
            <p style={{ fontSize:14, color:T.grey400, margin:"0 0 24px" }}>Please review and eSign the MSA before proceeding.</p>

            {/* Document preview card */}
            <div style={{ background:T.white, borderRadius:12, boxShadow:"0 1px 4px rgba(0,0,0,0.06)", marginBottom:16, overflow:"hidden" }}>
              <div style={{ padding:"20px" }}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:14, marginBottom: msaStatus === "signed" ? 20 : 0 }}>
                  <div style={{ width:44, height:52, borderRadius:6, background:"#FEE2E2", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:22 }}>📄</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:700, color:T.black, marginBottom:3 }}>Decfin_IFSC_MSA_Template.pdf</div>
                    <div style={{ fontSize:12, color:T.grey400 }}>Master Services Agreement · 20 pages</div>
                  </div>
                  {msaStatus === "signed" && <span style={{ background:T.greenBg, color:T.greenText, border:`1px solid ${T.greenBorder}`, borderRadius:20, padding:"3px 10px", fontSize:12, fontWeight:600, flexShrink:0 }}>✓ Signed</span>}
                  {(msaStatus === "pending" || msaStatus === "sent") && <span style={{ background:T.amberBg, color:T.amberText, border:`1px solid ${T.amberBorder}`, borderRadius:20, padding:"3px 10px", fontSize:12, fontWeight:600, flexShrink:0 }}>Awaiting signature</span>}
                </div>
                {msaStatus === "signed" && (
                  <div style={{ borderTop:`1px solid ${T.grey100}`, paddingTop:16, display:"flex", flexDirection:"column", gap:12 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ fontSize:12, color:T.grey400, fontWeight:500 }}>Signer (Customer)</span>
                      <span style={{ fontSize:12, color:T.black, fontWeight:600 }}>{signerName || bizName}</span>
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:16 }}>
                      <span style={{ fontSize:12, color:T.grey400, fontWeight:500, flexShrink:0 }}>Counterparty</span>
                      <span style={{ fontSize:12, color:T.black, fontWeight:600, textAlign:"right" }}>DecFin Fintech Services IFSC Private Limited</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display:"flex", gap:10, marginBottom:12 }}>
              {msaStatus === "signed" ? (
                <div style={{ flex:1, background:T.greenBg, border:`1px solid ${T.greenBorder}`, borderRadius:8, padding:"13px", textAlign:"center", fontSize:14, fontWeight:700, color:T.greenText }}>✓ Document Signed</div>
              ) : (
                <BtnPrimary onClick={() => setMsaSubScreen(msaStatus === "sent" ? "tracking" : "form")} style={{ flex:1, padding:"13px" }}>
                  {msaStatus === "sent" ? "View eSign Status" : "Review & eSign"}
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
      {showMSAViewer && <MSAViewerModal onClose={() => setShowMSAViewer(false)} />}
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
  const [dummy, setDummy] = useState(true);
  const [detailCurrency, setDetailCurrency] = useState(DUMMY_CURRENCIES[0]);
  const [settlementAccount, setSettlementAccount] = useState(null);
  const [txnInitCurrency, setTxnInitCurrency] = useState(null);

  const handleSetPage = id => setPage(id === "dashboard" ? "dashboard_app" : id);

  const handleNav = id => {
    if (id === "accounts") setPage("dashboard_app");
    else setPage("landing");
  };

  const handleViewTransactions = (currency = null) => {
    setTxnInitCurrency(currency);
    setPage("transactions");
  };

  const renderPage = () => {
    switch (page) {
      case "landing":        return <LandingScreen setPage={handleSetPage} onNav={handleNav} dummy={dummy} setDummy={setDummy} />;
      case "setup":          return <SetupScreen setPage={handleSetPage} onNav={handleNav} dummy={dummy} setDummy={setDummy} />;
      case "initialising":   return <InitialisingScreen setPage={handleSetPage} onNav={handleNav} dummy={dummy} setDummy={setDummy} />;
      case "currency_detail":return <CurrencyDetailScreen cur={detailCurrency} setPage={handleSetPage} onNav={handleNav} dummy={dummy} setDummy={setDummy} settlementAccount={settlementAccount} setSettlementAccount={setSettlementAccount} onViewTransactions={handleViewTransactions} />;
      case "currencies":     return <CurrenciesScreen setPage={handleSetPage} onNav={handleNav} dummy={dummy} setDummy={setDummy} />;
      case "add_modal":      return <AddModalScreen setPage={handleSetPage} />;
      case "remove_modal":   return <RemoveModalScreen setPage={handleSetPage} cur={detailCurrency} />;
      case "transactions":   return <TransactionsScreen setPage={handleSetPage} onNav={handleNav} dummy={dummy} setDummy={setDummy} initCurrency={txnInitCurrency} />;
      case "dashboard_app":
      default:
        return <DashboardAppScreen setPage={handleSetPage} setDetailCurrency={setDetailCurrency} onNav={handleNav} dummy={dummy} setDummy={setDummy} settlementAccount={settlementAccount} setSettlementAccount={setSettlementAccount} onViewTransactions={handleViewTransactions} />;
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
