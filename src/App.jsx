import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowUpRight, ShoppingBag, Menu as MenuIcon, X, Plus, Minus, Clock3, MapPin, Instagram, ChevronDown, Search, Check, ChefHat, LayoutDashboard, UtensilsCrossed, ClipboardList, CalendarDays, TrendingUp, Bell, Settings, Flame, Sparkles } from "lucide-react";
import { categories, products } from "./data";

const money = n => `Rs. ${Number(n).toLocaleString("en-PK")}`;

function Logo({small=false}) {
  return <div className="brand"><span className="brand-mark">M</span><span className="brand-name">MENUVERSE<small>{small ? "BY PIXELORA" : "A NEW ERA OF DIGITAL DINING"}</small></span></div>;
}

function ProductCard({product,onSelect}) {
  return <motion.article className="product-card" layout whileHover={{y:-5}} transition={{duration:.22}}>
    <button className="product-image-btn" onClick={()=>onSelect(product)} aria-label={`View ${product.name}`}>
      <img src={product.image} alt={product.name} loading="lazy"/>
      {product.tag && <span className="product-tag">{product.tag}</span>}
      <span className="quick-add"><Plus size={17}/></span>
    </button>
    <div className="product-meta"><span>{product.category}</span><span><Clock3 size={12}/> {product.time}</span></div>
    <div className="product-title-row"><h3>{product.name}</h3><strong>{money(product.price)}</strong></div>
    <p>{product.desc}</p>
    <button className="text-link" onClick={()=>onSelect(product)}>Customize & add <ArrowUpRight size={14}/></button>
  </motion.article>;
}

function ProductModal({product,onClose,onAdd}) {
  const [choices,setChoices] = useState({});
  const [addons,setAddons] = useState([]);
  const [qty,setQty] = useState(1);
  const [note,setNote] = useState("");
  if (!product) return null;
  const variantTotal = (product.options||[]).reduce((s,o)=>s+(o.choices.find(c=>c[0]===choices[o.name])?.[1]||0),0);
  const addonTotal = addons.reduce((s,a)=>s+a[1],0);
  const total = (product.price+variantTotal+addonTotal)*qty;
  return <div className="modal-backdrop" onMouseDown={onClose}>
    <motion.div className="product-modal" initial={{opacity:0,y:18,scale:.98}} animate={{opacity:1,y:0,scale:1}} onMouseDown={e=>e.stopPropagation()}>
      <button className="icon-btn modal-close" onClick={onClose}><X/></button>
      <img className="modal-photo" src={product.image} alt={product.name}/>
      <div className="modal-content">
        <div className="eyebrow">{product.category} · {product.time}</div>
        <h2>{product.name}</h2><p>{product.desc}</p>
        {(product.options||[]).map(group=><section className="choice-group" key={group.name}><div className="choice-heading"><b>{group.name}</b><span>Choose one</span></div><div className="choice-list">{group.choices.map(([name,price])=><label className="choice-option" key={name}><input type="radio" name={group.name} checked={(choices[group.name]||group.choices[0][0])===name} onChange={()=>setChoices(v=>({...v,[group.name]:name}))}/><span>{name}</span>{price>0&&<small>+{money(price)}</small>}</label>)}</div></section>)}
        {product.addons?.length>0&&<section className="choice-group"><div className="choice-heading"><b>Make it yours</b><span>Optional extras</span></div><div className="choice-list">{product.addons.map(([name,price])=><label className="choice-option" key={name}><input type="checkbox" checked={addons.some(a=>a[0]===name)} onChange={e=>setAddons(v=>e.target.checked?[...v,[name,price]]:v.filter(a=>a[0]!==name))}/><span>{name}</span><small>+{money(price)}</small></label>)}</div></section>}
        <label className="field-label">Special instructions<textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Any preferences for the kitchen?" rows="2"/></label>
        <div className="modal-bottom"><div className="qty-control"><button onClick={()=>setQty(Math.max(1,qty-1))}><Minus size={14}/></button><b>{qty}</b><button onClick={()=>setQty(qty+1)}><Plus size={14}/></button></div><button className="btn btn-gold grow" onClick={()=>onAdd({product,choices:{...choices},addons:[...addons],qty,note,unitPrice:product.price+variantTotal+addonTotal})}>Add to order · {money(total)} <ArrowRight size={16}/></button></div>
      </div>
    </motion.div>
  </div>;
}

function CartDrawer({open,onClose,cart,onQty,onRemove,onCheckout}) {
  const subtotal=cart.reduce((s,i)=>s+i.unitPrice*i.qty,0);
  return <AnimatePresence>{open&&<><motion.div className="drawer-scrim" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose}/><motion.aside className="cart-drawer" initial={{x:"100%"}} animate={{x:0}} exit={{x:"100%"}} transition={{type:"spring",damping:28,stiffness:260}}>
    <div className="drawer-head"><div><span className="eyebrow">YOUR SELECTION</span><h2>Your order <em>({cart.reduce((s,i)=>s+i.qty,0)})</em></h2></div><button className="icon-btn" onClick={onClose}><X/></button></div>
    {cart.length===0?<div className="empty-cart"><ShoppingBag size={34}/><h3>Your table is waiting.</h3><p>Add something exceptional from our menu.</p><button className="btn btn-outline" onClick={onClose}>Explore menu</button></div>:<>
      <div className="cart-items">{cart.map(item=><div className="cart-item" key={item.key}><img src={item.product.image}/><div className="cart-item-info"><b>{item.product.name}</b><small>{[...Object.values(item.choices),...item.addons.map(a=>a[0])].join(" · ")}</small><strong>{money(item.unitPrice*item.qty)}</strong><div className="mini-qty"><button onClick={()=>onQty(item.key,-1)}><Minus size={12}/></button>{item.qty}<button onClick={()=>onQty(item.key,1)}><Plus size={12}/></button><button className="remove" onClick={()=>onRemove(item.key)}>Remove</button></div></div></div>)}</div>
      <div className="cart-summary"><div><span>Subtotal</span><b>{money(subtotal)}</b></div><div><span>Tax & charges</span><span>Calculated at checkout</span></div><button className="btn btn-gold full" onClick={onCheckout}>Continue to checkout <ArrowRight size={16}/></button><p className="tiny-note">Final charges are confirmed before placing your order.</p></div>
    </>}
  </motion.aside></>}</AnimatePresence>;
}

function CheckoutModal({cart,onClose,onPlace}) {
  const [type,setType]=useState("Dine-in");
  const [name,setName]=useState(""); const [phone,setPhone]=useState(""); const [table,setTable]=useState("04"); const [address,setAddress]=useState(""); const [payment,setPayment]=useState("Pay at counter");
  const subtotal=cart.reduce((s,i)=>s+i.unitPrice*i.qty,0);
  const [placed,setPlaced]=useState(false);
  return <div className="modal-backdrop" onMouseDown={onClose}><motion.div className="checkout-modal" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} onMouseDown={e=>e.stopPropagation()}>
    <div className="drawer-head"><div><span className="eyebrow">ALMOST THERE</span><h2>Complete your order</h2></div><button className="icon-btn" onClick={onClose}><X/></button></div>
    {placed?<div className="success-state"><span className="success-icon"><Check/></span><h2>Demo order created</h2><p>Your sample order has been recorded in this browser session. No restaurant, payment provider or kitchen is connected yet.</p><button className="btn btn-gold full" onClick={onClose}>Back to MenuVerse</button></div>:<>
      <div className="order-type">{["Dine-in","Takeaway","Delivery"].map(t=><button className={type===t?"active":""} onClick={()=>setType(t)} key={t}>{t}</button>)}</div>
      <div className="checkout-fields"><label className="field-label">Your name<input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name"/></label><label className="field-label">Phone number<input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+92 3XX XXXXXXX"/></label>
      {type==="Dine-in"?<label className="field-label">Table number<select value={table} onChange={e=>setTable(e.target.value)}>{["01","02","03","04","05","06","07","08"].map(t=><option key={t}>{t}</option>)}</select></label>:type==="Delivery"?<label className="field-label">Delivery address<textarea value={address} onChange={e=>setAddress(e.target.value)} placeholder="Enter your delivery address"/></label>:null}
      <label className="field-label">Payment method<select value={payment} onChange={e=>setPayment(e.target.value)}><option>Pay at counter</option><option>Cash on delivery</option><option>Pay at restaurant</option></select></label></div>
      <div className="checkout-total"><span>Estimated total</span><b>{money(subtotal)}</b></div>
      <button className="btn btn-gold full" disabled={!name.trim()||!phone.trim()||(type==="Delivery"&&!address.trim())} onClick={()=>{onPlace({name,phone,type,table,address,payment,total:subtotal});setPlaced(true)}}>Place demo order <ArrowRight size={16}/></button>
      <p className="tiny-note">Demo mode only — no real payment or restaurant order is submitted.</p>
    </>}
  </motion.div></div>;
}

function CustomerSite({onOpenProduct,cartCount,onCart,onReserve}) {
  const [active,setActive]=useState("All"); const [query,setQuery]=useState("");
  const filtered=useMemo(()=>products.filter(p=>(active==="All"||p.category===active)&&`${p.name} ${p.desc}`.toLowerCase().includes(query.toLowerCase())),[active,query]);
  return <div className="customer-site">
    <div className="announcement"><Sparkles size={13}/> AN EXPERIENCE BEYOND DINING <span>·</span> OPEN TODAY 12 PM — 11 PM</div>
    <header className="site-nav"><a className="logo-link" href="#"><Logo/></a><nav><a href="#menu">Menu</a><a href="#story">Our story</a><a href="#visit">Visit us</a></nav><div className="nav-actions"><button className="btn btn-outline nav-reserve" onClick={onReserve}>Reserve a table</button><button className="cart-trigger" onClick={onCart}><ShoppingBag size={18}/><span>Order</span><i>{cartCount}</i></button></div></header>
    <section className="hero">
      <img className="hero-image" src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2200&q=90" alt="Maison Noir dining room"/>
      <div className="hero-shade"/>
      <div className="hero-content"><div className="eyebrow gold-eyebrow"><span/> THE MAISON NOIR EXPERIENCE</div><h1>Where every<br/><em>flavor</em> tells a story.</h1><p>Thoughtfully sourced ingredients. Bold culinary artistry.<br className="desktop-only"/> An evening worth remembering.</p><div className="hero-actions"><a href="#menu" className="btn btn-gold">Explore the menu <ArrowUpRight size={16}/></a><button className="btn btn-glass" onClick={onReserve}>Reserve your table</button></div><div className="hero-note"><span>01 / 03</span><i/><span>CRAFTED FOR THE CURIOUS</span></div></div>
      <div className="hero-side-note">KARACHI · PAKISTAN</div>
    </section>
    <section className="intro-strip"><div><span className="eyebrow">A LITTLE MORE THAN A MEAL</span><h2>Made with intention.<br/><em>Served with soul.</em></h2></div><p>At Maison Noir, every detail has a purpose — from the first pour to the final bite. Discover a menu shaped by season, craft and a love for the extraordinary.</p><a href="#story" className="round-arrow"><ArrowUpRight/></a></section>
    <section className="menu-section section-wrap" id="menu"><div className="section-heading"><div><span className="eyebrow">THE MENU</span><h2>A taste of <em>something special.</em></h2><p>Signature plates, familiar comforts and unexpected delights.</p></div><div className="menu-search"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Find your favorite..."/></div></div>
      <div className="category-row">{categories.map(c=><button key={c} className={active===c?"selected":""} onClick={()=>setActive(c)}>{c}</button>)}</div>
      <div className="product-grid">{filtered.map(p=><ProductCard key={p.id} product={p} onSelect={onOpenProduct}/>)}</div>
      {filtered.length===0&&<div className="empty-results">No dishes found. Try another search.</div>}
    </section>
    <section className="feature-band" id="story"><div className="feature-image"><img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1300&q=85" alt="Chef preparing a dish"/></div><div className="feature-copy"><span className="eyebrow">OUR PHILOSOPHY</span><h2>Good food is<br/><em>never ordinary.</em></h2><p>We bring together seasonal ingredients, thoughtful technique and a little creative rebellion. The result is food that feels familiar, yet leaves you with something new to remember.</p><a className="text-link" href="#visit">Discover our story <ArrowUpRight size={15}/></a></div></section>
    <section className="visit-section" id="visit"><div><span className="eyebrow">YOUR TABLE IS WAITING</span><h2>Make tonight<br/><em>memorable.</em></h2><p>Join us for a thoughtful dining experience in the heart of Karachi.</p><button className="btn btn-gold" onClick={onReserve}>Reserve a table <ArrowUpRight size={16}/></button></div><div className="visit-details"><div><MapPin/><span><b>Find us</b><small>Clifton, Karachi, Pakistan</small></span></div><div><Clock3/><span><b>Opening hours</b><small>Daily · 12:00 PM – 11:00 PM</small></span></div><div><Instagram/><span><b>Follow along</b><small>@maisonnoir.demo</small></span></div></div></section>
    <footer className="site-footer"><Logo small/><span>© 2026 Maison Noir. A MenuVerse demo experience.</span><span>POWERED BY <b>PIXELORA</b></span></footer>
  </div>;
}

function AdminPanel({orders,onStatus}) {
  const revenue=orders.filter(o=>o.status==="Completed").reduce((s,o)=>s+o.total,0);
  const pending=orders.filter(o=>["Pending","Preparing"].includes(o.status)).length;
  return <div className="workspace"><aside className="workspace-sidebar"><Logo small/><div className="workspace-label">WORKSPACE</div><a className="side-active"><LayoutDashboard/>Overview</a><a><ClipboardList/>Orders <i>{orders.length}</i></a><a><UtensilsCrossed/>Menu management</a><a><CalendarDays/>Reservations</a><a><TrendingUp/>Analytics</a><a><Settings/>Settings</a><div className="sidebar-bottom"><span className="avatar">MN</span><span><b>Maison Noir</b><small>Demo restaurant</small></span></div></aside>
    <main className="workspace-main"><div className="workspace-top"><div><span className="eyebrow">MONDAY, NOVEMBER 09, 2026</span><h1>Good evening, <em>Maison Noir.</em></h1><p>Here is what's happening at your restaurant today.</p></div><span className="live-pill"><i/> DEMO WORKSPACE</span></div>
      <div className="stat-grid"><div className="stat-card"><span>DEMO REVENUE</span><strong>{money(revenue)}</strong><small><TrendingUp size={13}/> From completed demo orders</small></div><div className="stat-card"><span>TOTAL ORDERS</span><strong>{orders.length.toString().padStart(2,"0")}</strong><small>Orders in this browser session</small></div><div className="stat-card"><span>NEEDS ATTENTION</span><strong>{pending.toString().padStart(2,"0")}</strong><small>Pending or preparing</small></div><div className="stat-card"><span>MENU ITEMS</span><strong>{products.length.toString().padStart(2,"0")}</strong><small>Sample menu items</small></div></div>
      <div className="admin-content-grid"><section className="panel"><div className="panel-heading"><div><span className="eyebrow">LIVE ACTIVITY</span><h3>Recent orders</h3></div><span className="live-pill"><i/> LOCAL DEMO</span></div>{orders.length===0?<div className="admin-empty"><ClipboardList/><b>No orders yet</b><span>Place a demo order from the customer menu to see it here.</span></div>:<div className="orders-table"><div className="table-head"><span>ORDER</span><span>CUSTOMER</span><span>TYPE</span><span>TOTAL</span><span>STATUS</span></div>{orders.map(o=><div className="table-row" key={o.id}><b>#{o.id}</b><span>{o.name}</span><span>{o.type}</span><b>{money(o.total)}</b><select value={o.status} onChange={e=>onStatus(o.id,e.target.value)}><option>Pending</option><option>Preparing</option><option>Ready</option><option>Completed</option><option>Cancelled</option></select></div>)}</div>}</section>
      <section className="panel"><div className="panel-heading"><div><span className="eyebrow">MENU OVERVIEW</span><h3>Popular dishes</h3></div></div>{products.slice(0,5).map((p,i)=><div className="popular-row" key={p.id}><span className="rank">0{i+1}</span><img src={p.image}/><span><b>{p.name}</b><small>{p.category}</small></span><strong>{money(p.price)}</strong></div>)}</section></div>
      <p className="demo-disclaimer">This is a frontend demonstration. Revenue and orders are session-only sample data, not connected to a production database.</p>
    </main></div>;
}

function KitchenPanel({orders,onStatus}) {
  const cols=[["Pending","New orders"],["Preparing","In preparation"],["Ready","Ready to serve"]];
  return <div className="kitchen-page"><header className="kitchen-head"><Logo small/><div><span className="live-pill"><i/> DEMO KITCHEN</span><span className="kitchen-clock">SERVICE VIEW</span></div></header><div className="kitchen-title"><div><span className="eyebrow">MAISON NOIR · KARACHI</span><h1>Kitchen <em>display.</em></h1><p>Incoming tickets and preparation status.</p></div><div className="kitchen-count"><b>{orders.filter(o=>!["Completed","Cancelled"].includes(o.status)).length}</b><span>ACTIVE TICKETS</span></div></div><div className="kitchen-columns">{cols.map(([status,label])=><section className="kitchen-column" key={status}><div className="kitchen-column-head"><h3>{label}</h3><span>{orders.filter(o=>o.status===status).length}</span></div>{orders.filter(o=>o.status===status).map(o=><article className="ticket" key={o.id}><div className="ticket-top"><b>#{o.id}</b><span>{o.type}{o.table?` · Table ${o.table}`:""}</span></div><h4>{o.name}</h4>{o.items.map((item,i)=><div className="ticket-item" key={i}><b>{item.qty}×</b><span>{item.product.name}</span></div>)}<div className="ticket-bottom"><strong>{money(o.total)}</strong><button className="btn btn-gold" onClick={()=>onStatus(o.id,status==="Pending"?"Preparing":status==="Preparing"?"Ready":"Completed")}>{status==="Pending"?"Start":status==="Preparing"?"Mark ready":"Complete"} <ArrowRight size={14}/></button></div></article>)}</section>)}</div>{orders.length===0&&<div className="kitchen-empty">No tickets yet. Place a demo order to send a ticket to the kitchen.</div>}<p className="demo-disclaimer">Kitchen actions update this browser's demo order state only. Production synchronization requires the backend and Socket.IO.</p></div>;
}

function ReservationModal({onClose}) {
  const [guests,setGuests]=useState("2 guests"); const [date,setDate]=useState("2026-11-12"); const [time,setTime]=useState("7:00 PM"); const [name,setName]=useState(""); const [phone,setPhone]=useState(""); const [done,setDone]=useState(false);
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="reservation-modal" onMouseDown={e=>e.stopPropagation()}><div className="drawer-head"><div><span className="eyebrow">A SEAT AT OUR TABLE</span><h2>Reserve your evening.</h2></div><button className="icon-btn" onClick={onClose}><X/></button></div>{done?<div className="success-state"><span className="success-icon"><Check/></span><h2>Request received</h2><p>This is a demo reservation request. No restaurant booking has been made.</p><button className="btn btn-gold full" onClick={onClose}>Close</button></div>:<><div className="checkout-fields"><label className="field-label">Your name<input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name"/></label><label className="field-label">Phone number<input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+92 3XX XXXXXXX"/></label><div className="two-fields"><label className="field-label">Date<input type="date" value={date} onChange={e=>setDate(e.target.value)}/></label><label className="field-label">Time<select value={time} onChange={e=>setTime(e.target.value)}>{["6:00 PM","6:30 PM","7:00 PM","7:30 PM","8:00 PM","8:30 PM","9:00 PM"].map(t=><option key={t}>{t}</option>)}</select></label></div><label className="field-label">Guests<select value={guests} onChange={e=>setGuests(e.target.value)}>{["1 guest","2 guests","3 guests","4 guests","5 guests","6 guests"].map(t=><option key={t}>{t}</option>)}</select></label></div><button className="btn btn-gold full" disabled={!name.trim()||!phone.trim()} onClick={()=>setDone(true)}>Request reservation <ArrowRight size={16}/></button></>}</div></div>;
}

function OwnerLoginModal({target,onClose,onAuthenticate}) {
  const [username,setUsername]=useState("owner");
  const [password,setPassword]=useState("");
  const [error,setError]=useState("");
  const isAdmin = target === "admin";
  return <div className="modal-backdrop" onMouseDown={onClose}><motion.div className="checkout-modal" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} onMouseDown={e=>e.stopPropagation()} style={{maxWidth:440}}>
    <div className="drawer-head"><div><span className="eyebrow">OWNER ACCESS</span><h2>{isAdmin ? "Admin login" : "Kitchen login"}</h2></div><button className="icon-btn" onClick={onClose}><X/></button></div>
    <div style={{display:"grid",gap:18,paddingTop:8}}>
      <div style={{padding:"10px 12px",background:"rgba(198,165,107,0.12)",border:"1px solid rgba(198,165,107,0.35)",borderRadius:10,color:"#f4d9a3",fontSize:10,letterSpacing:2,textTransform:"uppercase",textAlign:"center"}}>{isAdmin ? "Restaurant dashboard" : "Service operations"}</div>
      <div className="checkout-fields">
        <label className="field-label">Username<input value={username} onChange={e=>setUsername(e.target.value)} placeholder="owner" /></label>
        <label className="field-label">Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter password" /></label>
      </div>
      {error && <p style={{margin:0,color:"#ffb0a5",fontSize:12}}>{error}</p>}
      <button className="btn btn-gold full" onClick={()=>{
        if (username.trim().toLowerCase()==="owner" && password === "menuverse123") {
          onAuthenticate(target);
        } else {
          setError("Invalid owner credentials. Use owner / menuverse123");
        }
      }}>Enter {isAdmin ? "Admin" : "Kitchen"} <ArrowRight size={16}/></button>
      <p className="tiny-note">Demo owner credentials: owner / menuverse123</p>
    </div>
  </motion.div></div>;
}

export default function App() {
  const [view,setView]=useState("customer"); const [pendingView,setPendingView]=useState(null); const [selected,setSelected]=useState(null); const [cart,setCart]=useState([]); const [cartOpen,setCartOpen]=useState(false); const [checkout,setCheckout]=useState(false); const [reserve,setReserve]=useState(false); const [orders,setOrders]=useState([]); const [ownerAccess,setOwnerAccess]=useState({admin:false,kitchen:false}); const [showSplash,setShowSplash]=useState(true);
  React.useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1200);
    return () => clearTimeout(timer);
  }, []);
  const addToCart=item=>{const key=`${item.product.id}-${JSON.stringify(item.choices)}-${JSON.stringify(item.addons)}`;setCart(old=>{const found=old.find(x=>x.key===key);return found?old.map(x=>x.key===key?{...x,qty:x.qty+item.qty}:x):[...old,{...item,key}]});setSelected(null);setCartOpen(true);};
  const changeQty=(key,delta)=>setCart(old=>old.map(x=>x.key===key?{...x,qty:x.qty+delta}:x).filter(x=>x.qty>0));
  const placeOrder=data=>{const id=String(Date.now()).slice(-5);setOrders(old=>[{id,...data,items:cart,status:"Pending",createdAt:new Date().toISOString()},...old]);setCart([]);};
  const updateStatus=(id,status)=>setOrders(old=>old.map(o=>o.id===id?{...o,status}:o));
  const openProtectedView=target=>{
    if (target === "customer") {
      setPendingView(null); setView("customer"); return;
    }
    if (ownerAccess[target]) {
      setView(target); setPendingView(null); return;
    }
    setPendingView(target);
  };
  const handleOwnerLogin=target=>{
    setOwnerAccess(prev=>({...prev,[target]:true}));
    setView(target);
    setPendingView(null);
  };
  const cartCount=cart.reduce((s,i)=>s+i.qty,0);
  return <div className="app-shell">
    {showSplash && <div className="splash-screen"><div className="splash-logo" aria-label="MenuVerse logo"><span>M</span></div></div>}
    <div className="demo-toolbar"><span><i/> MENUVERSE INTERACTIVE DEMO</span><div><button className={view==="customer"?"active":""} onClick={()=>openProtectedView("customer")}>Customer</button><button className={view==="admin"?"active":""} onClick={()=>openProtectedView("admin")}>Admin</button><button className={view==="kitchen"?"active":""} onClick={()=>openProtectedView("kitchen")}>Kitchen</button></div></div>
    {view==="customer"?<CustomerSite onOpenProduct={setSelected} cartCount={cartCount} onCart={()=>setCartOpen(true)} onReserve={()=>setReserve(true)}/>:view==="admin"?<AdminPanel orders={orders} onStatus={updateStatus}/>:<KitchenPanel orders={orders} onStatus={updateStatus}/>} 
    <ProductModal product={selected} onClose={()=>setSelected(null)} onAdd={addToCart}/>
    <CartDrawer open={cartOpen} onClose={()=>setCartOpen(false)} cart={cart} onQty={changeQty} onRemove={key=>setCart(c=>c.filter(i=>i.key!==key))} onCheckout={()=>{setCartOpen(false);setCheckout(true)}}/>
    {checkout&&<CheckoutModal cart={cart} onClose={()=>setCheckout(false)} onPlace={placeOrder}/>} 
    {reserve&&<ReservationModal onClose={()=>setReserve(false)}/>}
    {pendingView&&<OwnerLoginModal target={pendingView} onClose={()=>setPendingView(null)} onAuthenticate={handleOwnerLogin}/>} 
  </div>;
}