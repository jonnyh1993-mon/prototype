// shared.jsx - shared primitives for the Investments prototype

const StatusBar = ({ dark = false }) => (
 <div className="phone-statusbar">
 <span>9:41</span>
 <div className="right">
 <svg width="18" height="11" viewBox="0 0 18 11" aria-hidden="true">
 <path d="M1 7.5h2v3H1zm4-2h2v5H5zm4-2h2v7H9zm4-3h2v10h-2z" fill="currentColor"/>
 </svg>
 <svg width="16" height="11" viewBox="0 0 16 11" aria-hidden="true">
 <path d="M8 2.5a8.5 8.5 0 015.9 2.3l.9-.9A9.8 9.8 0 008 1.2 9.8 9.8 0 001.2 4l.9.9A8.5 8.5 0 018 2.5zm0 3.5a5 5 0 013.5 1.4l.9-.9A6.3 6.3 0 008 4.5 6.3 6.3 0 003.6 6.5l.9.9A5 5 0 018 6zm0 2.7A2.2 2.2 0 005.8 11h4.4A2.2 2.2 0 008 8.7z" fill="currentColor"/>
 </svg>
 <svg width="24" height="12" viewBox="0 0 24 12" aria-hidden="true">
 <rect x="0.5" y="0.5" width="20" height="11" rx="2.5" fill="none" stroke="currentColor" strokeOpacity="0.4"/>
 <rect x="2" y="2" width="17" height="8" rx="1" fill="currentColor"/>
 <path d="M22 4v4c.6-.2 1-.8 1-1.5V5.5c0-.7-.4-1.3-1-1.5z" fill="currentColor" opacity=".4"/>
 </svg>
 </div>
 </div>
);

const PhoneFrame = ({ children, darkChrome = false }) => (
 <div className="phone">
 <div className={"phone-screen" + (darkChrome ? " dark-chrome" : "")}>
 <div className="phone-notch" />
 <StatusBar dark={darkChrome} />
 {children}
 <div className="phone-home" />
 </div>
 </div>
);

const ArrowLeft = ({ color = "#232323", size = 20 }) => (
 <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
 <path d="M15 18l-6-6 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
 </svg>
);

const ChevR = ({ color, size = 14 }) => (
 <svg className="listrow-chev" width={size/2} height={size} viewBox="0 0 8 14" aria-hidden="true" style={{ color: color || undefined }}>
 <path d="M1 1l6 6-6 6" stroke={color || "currentColor"} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
 </svg>
);

const CloseX = ({ color = "#232323" }) => (
 <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
 <path d="M3.5 3.5L12.5 12.5M12.5 3.5L3.5 12.5" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
 </svg>
);

const TopBar = ({ title, onBack, onClose, closeLabel = "Close", dark = false, progress = null }) => (
 <>
 <div className={"topbar" + (dark ? " dark" : "")}>
 {onBack && (
 <button className="topbar-back" onClick={onBack} aria-label="Back">
 <ArrowLeft color={dark ? "#fff" : "#232323"} />
 </button>
 )}
 {title && <div className="topbar-title">{title}</div>}
 {onClose && (
 <button className="topbar-close" onClick={onClose} aria-label={closeLabel}>
 <CloseX color={dark ? "#fff" : "#232323"}/>
 </button>
 )}
 </div>
 {/* Progress bar removed per design direction */}
 </>
);

const Button = ({ label, variant = "primary", showArrow = false, onClick, disabled = false }) => (
 <button
 className={"btn btn-" + variant + (showArrow ? " arrow" : "")}
 onClick={onClick}
 disabled={disabled}
 >{label}</button>
);

const TickIcon = ({ size = 20, color = "#00505A" }) => (
 <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
 <path d="M4 12l5 5L20 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
 </svg>
);

const Shield = ({ size = 28, color = "#00505A" }) => (
 <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
 <path d="M12 2l9 4v6c0 5-3.8 9.4-9 10-5.2-.6-9-5-9-10V6l9-4z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
 <path d="M8 12l3 3 5-6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
 </svg>
);

const BarsIcon = ({ size = 18, color = "#003036" }) => (
 <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
 <path d="M4 20v-5M10 20v-9M16 20V8M22 20V4" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
 </svg>
);

const icon = (name) => "ds/icons/" + name + ".png";

// Format helpers
const fmtGBP = (n, decimals = 0) => "£" + n.toLocaleString("en-GB", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
const fmtPct = (n, decimals = 2) => n.toFixed(decimals) + "%";

// Tiny custom event hub for persistent route state
Object.assign(window, {
 StatusBar, PhoneFrame, ArrowLeft, ChevR, TopBar, Button, TickIcon, Shield, BarsIcon,
 icon, fmtGBP, fmtPct,
});
