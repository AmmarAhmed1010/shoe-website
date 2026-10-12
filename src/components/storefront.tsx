"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Moon,
  Sun,
  Package,
  Menu,
  X,
  ArrowRight,
  ArrowUpRight,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Truck,
  Check,
  Eye,
  EyeOff,
  SlidersHorizontal,
  Pause,
  Play,
  Ruler,
  LogOut,
} from "lucide-react";
import {
  products,
  categories,
  sizeRows,
  money,
  type Product,
} from "@/lib/catalog";
import {
  useStore,
  signInDemo,
  signOutDemo,
  reservePair,
  remaining,
  resetDemo,
  toggleTheme,
} from "@/lib/store";
export type PageName =
  "home" | "dashboard" | "auth" | "orders" | "checkout" | "order-confirmation";

function Mark() {
  return (
    <svg viewBox="0 0 64 64" width="34" height="34" aria-hidden="true">
      <rect width="64" height="64" rx="15" fill="currentColor" />
      <path
        d="M12 38c0-6 7-7 11-15l7 2 5 8 14 4c3 1 4 4 4 6H12Z"
        fill="white"
      />
      <path
        d="m24 29 8 1m-6 4 9 1M12 49h41"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
function Brand() {
  return (
    <Link className="brand" href="/" aria-label="SOLEVA home">
      <Mark />
      <span>SOLEVA</span>
    </Link>
  );
}
function Header({ page, onSizing }: { page: PageName; onSizing: () => void }) {
  const router = useRouter();
  const store = useStore();
  const [menu, setMenu] = useState(false);
  const dark = store.dark;
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => { document.documentElement.dataset.theme = dark ? "dark" : "light"; }, [dark]);
  return (
    <>
      <div className="announcement">
        {page === "home" ? (
          <>
            <Truck size={13} />
            LOCAL DELIVERY ONLY — WE DON’T SHIP WORLDWIDE
          </>
        ) : (
          <>FREE TO BROWSE · SIGN IN TO ORDER</>
        )}
      </div>
      <header className="header">
        <Brand />
        <nav
          className={menu ? "nav open" : "nav"}
          aria-label="Main navigation"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setMenu(false);
              menuButton.current?.focus();
            }
          }}
        >
          <Link
            className={page === "dashboard" ? "active" : ""}
            href="/dashboard"
            onClick={() => setMenu(false)}
          >
            Shop All
          </Link>
          <Link href="/#collection" onClick={() => setMenu(false)}>
            Trending
          </Link>
          <Link href="/#lookbook" onClick={() => setMenu(false)}>
            Lookbook
          </Link>
          <button
            onClick={() => {
              setMenu(false);
              onSizing();
            }}
          >
            Sizing
          </button>
        </nav>
        <form
          className="header-search"
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            const q = String(new FormData(e.currentTarget).get("q") || "");
            router.push("/dashboard?q=" + encodeURIComponent(q) + "#catalog");
          }}
        >
          <Search size={17} />
          <input
            name="q"
            aria-label="Search the catalog"
            placeholder="Search"
          />
        </form>
        <div className="header-tools">
          <button
            className="icon-button theme-button"
            onClick={toggleTheme}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link className="icon-button" href="/orders" aria-label="My orders">
            <Package size={19} />
          </Link>
          {store.member ? (
            <button
              className="text-button account-link"
              onClick={() => {
                try {
                  signOutDemo();
                } catch {
                  router.push("/auth");
                }
              }}
            >
              Sign out <LogOut size={13} />
            </button>
          ) : (
            <>
              <Link className="account-link" href="/auth">
                Sign In
              </Link>
              <Link className="button join" href="/auth?mode=join">
                Join Us
              </Link>
            </>
          )}
          <button
            ref={menuButton}
            className="icon-button mobile-toggle"
            onClick={() => setMenu(!menu)}
            aria-label={menu ? "Close menu" : "Open menu"}
            aria-expanded={menu}
          >
            {menu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>
    </>
  );
}

function Film({ compact = false }: { compact?: boolean }) {
  const frames = [products[5], products[1], products[2]];
  const [frame, setFrame] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (paused || reduced) return;
    const timer = window.setInterval(
      () => setFrame((f) => (f + 1) % frames.length),
      6000,
    );
    return () => clearInterval(timer);
  }, [paused, frames.length]);
  return (
    <div
      className={compact ? "film compact" : "film"}
      aria-label="SOLEVA brand film"
    >
      <div className="film-label">
        <span className="dot" />
        BRAND FILM
      </div>
      {frames.map((p, i) => (
        <div
          key={p.id}
          className={i === frame ? "film-frame visible" : "film-frame"}
          aria-hidden={i !== frame}
        >
          <Image
            src={p.image}
            alt=""
            fill
            sizes={compact ? "(max-width:700px) 100vw, 55vw" : "100vw"}
            loading="eager"
          />
          <div className="film-shade" />
          <div className="film-caption">
            <p>
              0{i + 1} / 03 <span>{p.brand.toUpperCase()}</span>
            </p>
            <h2>{p.name}</h2>
            <div className="caption-rule" />
            <span>
              {money(p.price)} · US {p.sizes[0]}
            </span>
          </div>
        </div>
      ))}
      <div className="film-bottom">
        <div className="film-progress">
          {frames.map((p, i) => (
            <button
              key={p.id}
              aria-label={"Show " + p.name}
              aria-pressed={i === frame}
              onClick={() => setFrame(i)}
              className={i === frame ? "selected" : ""}
            />
          ))}
        </div>
        <span>SOLEVA</span>
        <button
          className="film-pause"
          aria-label={paused ? "Play brand film" : "Pause brand film"}
          onClick={() => setPaused(!paused)}
        >
          {paused ? <Play size={14} /> : <Pause size={14} />}
        </button>
      </div>
    </div>
  );
}
function Photo({
  p,
  className = "",
  priority = false,
}: {
  p: Product;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={p.image}
      alt={`${p.name} — illustrative stock photograph`}
      fill
      sizes="(max-width:700px) 50vw, 25vw"
      loading={priority ? "eager" : "lazy"}
      className={className}
    />
  );
}
function ProductCard({
  p,
  onView,
}: {
  p: Product;
  onView: (p: Product) => void;
}) {
  return (
    <button
      className="product-card"
      onClick={() => onView(p)}
      aria-label={"Quick view " + p.name}
    >
      <div className="product-image">
        <Photo p={p} />
        {p.stock === 1 && <span className="last-one">Last One</span>}
        <span className="quick-view">
          Quick View <ArrowUpRight size={15} />
        </span>
      </div>
      <div className="product-copy">
        <h3>{p.name}</h3>
        <p>
          {p.brand} · {p.model}
        </p>
        <strong>{money(p.price)}</strong>
        <small>{p.sizes.map((s) => "US " + s).join(" · ")}</small>
      </div>
    </button>
  );
}
function Rail({
  title,
  kicker,
  list,
  id,
  onView,
}: {
  title: string;
  kicker: string;
  list: Product[];
  id?: string;
  onView: (p: Product) => void;
}) {
  const rail = useRef<HTMLDivElement>(null);
  return (
    <section className="section rail-section" id={id}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">{kicker}</p>
          <h2>{title}</h2>
        </div>
        <Link href="/dashboard">
          Shop All <ArrowRight size={16} />
        </Link>
      </div>
      <div className="product-rail" ref={rail}>
        {list.map((p) => (
          <ProductCard key={p.id} p={p} onView={onView} />
        ))}
      </div>
      <div className="rail-controls">
        <button
          className="icon-button"
          aria-label={"Scroll " + title + " left"}
          onClick={() =>
            rail.current?.scrollBy({
              left: -650,
              behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
                .matches
                ? "instant"
                : "smooth",
            })
          }
        >
          <ChevronLeft size={20} />
        </button>
        <button
          className="icon-button"
          aria-label={"Scroll " + title + " right"}
          onClick={() =>
            rail.current?.scrollBy({
              left: 650,
              behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
                .matches
                ? "instant"
                : "smooth",
            })
          }
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
}
function SizeTable() {
  return (
    <div className="size-table">
      <table>
        <thead>
          <tr>
            {["US", "UK", "EU", "CM"].map((h) => (
              <th key={h} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sizeRows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, i) => (
                <td key={i}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function Sizing({
  onOpen,
  compact = false,
}: {
  onOpen: () => void;
  compact?: boolean;
}) {
  return (
    <section
      className={
        compact
          ? "section sizing-section catalog-sizing"
          : "section sizing-section"
      }
      id="sizing"
    >
      <div>
        <p className="eyebrow">FIT & SIZING</p>
        <h2>FIND YOUR SIZE</h2>
        <p>
          Unisex sneaker sizing — measure heel-to-toe and match the CM column.
          Every thrifted pair is one-of-one, so check your fit before you order.
        </p>
        {!compact && (
          <>
            <ol className="sizing-steps">
              <li>
                <span>1</span>Stand on paper with your heel against a wall.
              </li>
              <li>
                <span>2</span>Mark the tip of your longest toe.
              </li>
              <li>
                <span>3</span>Measure heel-to-toe in CM, then match the chart.
              </li>
            </ol>
            <button className="button" onClick={onOpen}>
              Open full size chart <Ruler size={17} />
            </button>
          </>
        )}
      </div>
      <SizeTable />
    </section>
  );
}
function Home({
  onSizing,
  onView,
}: {
  onSizing: () => void;
  onView: (p: Product) => void;
}) {
  const trending = [
    products[5],
    products[6],
    products[7],
    products[0],
    products[8],
    products[9],
    products[1],
    products[10],
    products[2],
    products[3],
  ];
  return (
    <>
      <section className="hero">
        <Film />
        <div className="hero-copy">
          <div>
            <p className="eyebrow">CURATED THRIFT · ONE OF EVERY PAIR</p>
            <h1>
              WORN IN.
              <br />
              NEVER WORN OUT.
            </h1>
          </div>
          <div>
            <p>
              Hand-picked thrifted sneakers — cleaned, photographed, and priced
              honestly. Browse the whole rack free. Sign up only when you order.
            </p>
            <div className="hero-actions">
              <Link className="button" href="/dashboard">
                Shop the rack <ArrowRight size={18} />
              </Link>
              <button className="button secondary" onClick={onSizing}>
                Size Chart <Ruler size={17} />
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="brand-strip" aria-label="Brands on the rack">
        {[
          "Nike",
          "adidas",
          "New Balance",
          "Vans",
          "Converse",
          "ASICS",
          "Jordan",
          "Clarks",
        ].map((b) => (
          <span key={b}>{b}</span>
        ))}
      </section>
      <section className="section categories">
        <div className="section-heading">
          <h2>SHOP BY CATEGORY</h2>
          <Link href="/dashboard">
            All pairs <ArrowRight size={17} />
          </Link>
        </div>
        <div className="category-grid">
          {[
            ["sneakers", products[5]],
            ["basketball", products[6]],
            ["boots", products[7]],
          ].map(([cat, product]) => {
            const p = product as Product;
            return (
              <Link key={String(cat)} href={"/dashboard?category=" + cat}>
                <div className="category-image">
                  <Photo p={p} />
                  <div className="category-shade" />
                  <div>
                    <h3>{String(cat)}</h3>
                    <span>
                      Shop <ArrowUpRight size={18} />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      <Rail
        id="collection"
        title="TRENDING THIS WEEK"
        kicker="FRESH ON THE RACK"
        list={trending}
        onView={onView}
      />
      <Rail
        title="UNDER $60"
        kicker="EVERYDAY PRICES"
        list={trending.filter((p) => p.price < 60).concat(products[4])}
        onView={onView}
      />
      <section className="section lookbook" id="lookbook">
        <p className="eyebrow">LOOKBOOK</p>
        <h2>WORN BY THE CITY</h2>
        <p>
          Good shoes, new stories. A look at the shapes and colors on this
          week’s rack.
        </p>
        <div className="lookbook-grid">
          <figure className="lookbook-large">
            <Photo p={products[5]} />
            <figcaption>
              <p>№ 01 — NIKE</p>
              <h3>KILLSHOT 2</h3>
              <button
                className="button light"
                onClick={() => onView(products[5])}
              >
                Shop <ArrowUpRight size={17} />
              </button>
            </figcaption>
          </figure>
          <div>
            <figure className="lookbook-small">
              <Photo p={products[6]} />
              <figcaption>
                № 02 — JORDAN <strong>Air Jordan 1 Mid</strong>
              </figcaption>
            </figure>
            <blockquote>
              <p>“A GOOD PAIR DOESN’T CARE WHAT YEAR IT WAS MADE.”</p>
              <span>THE SOLEVA RACK RULES</span>
            </blockquote>
          </div>
        </div>
      </section>
      <section className="membership section">
        <div>
          <p className="eyebrow">FREE TO BROWSE</p>
          <h2>
            BROWSE FREE.
            <br />
            ORDER WITH AN ACCOUNT.
          </h2>
        </div>
        <div>
          <p>
            Viewing costs nothing. Create a demo account when you reserve a
            pair, and keep your reservation details together.
          </p>
          <ul>
            {[
              "No account needed to browse",
              "Demo confirmation on every reservation",
              "Track your demo orders any time",
            ].map((s) => (
              <li key={s}>
                <Check size={17} />
                {s}
              </li>
            ))}
          </ul>
          <div className="hero-actions">
            <Link className="button" href="/dashboard">
              Start browsing <ArrowRight size={17} />
            </Link>
            <Link className="text-link" href="/auth?mode=join">
              Create account <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>
      <section className="values section">
        {[
          [
            "HAND-CHECKED",
            "Every pair deserves attention. Condition notes show you what to expect.",
          ],
          [
            "HONEST GRADES",
            "Like new, good or used. Find the character that fits your wardrobe.",
          ],
          [
            "LOCAL ONLY",
            "The local delivery concept keeps the next chapter close to home.",
          ],
        ].map(([h, p], i) => (
          <div key={h}>
            <span>0{i + 1}</span>
            <h3>{h}</h3>
            <p>{p}</p>
          </div>
        ))}
      </section>
      <Sizing onOpen={onSizing} />
    </>
  );
}

function Catalog({
  onView,
  onSizing,
}: {
  onView: (p: Product) => void;
  onSizing: () => void;
}) {
  const params = useSearchParams();
  const [category, setCategory] = useState(params.get("category") || "all");
  const [query, setQuery] = useState(params.get("q") || "");
  const [sort, setSort] = useState("featured");
  const [condition, setCondition] = useState("all");
  let list = products.filter(
    (p) =>
      (category === "all" || p.category === category) &&
      (condition === "all" || p.condition === condition) &&
      `${p.name} ${p.brand} ${p.category} ${p.colors.join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  list = [...list].sort((a, b) =>
    sort === "low"
      ? a.price - b.price
      : sort === "high"
        ? b.price - a.price
        : sort === "newest"
          ? products.indexOf(b) - products.indexOf(a)
          : 0,
  );
  return (
    <>
      <section className="catalog-film">
        <Film compact />
        <div>
          <p className="eyebrow">NOW IN THE RACK</p>
          <h2>
            THIS WEEK’S ARRIVALS,
            <br />
            ON FILM
          </h2>
          <p>
            A moving edit of this week’s rack — familiar silhouettes with
            another chapter ahead.
          </p>
          <a className="button light" href="#catalog">
            Browse the grid <ArrowRight size={16} />
          </a>
        </div>
      </section>
      <section className="section catalog" id="catalog">
        <p className="eyebrow">THE CATALOG</p>
        <div className="catalog-title">
          <h1>ALL PAIRS</h1>
          <p role="status">{list.length} pairs available</p>
        </div>
        <div className="catalog-controls">
          <div className="category-filters">
            <span>
              <SlidersHorizontal size={16} />
              Filter
            </span>
            {categories.map((c, i) => (
              <button
                key={c}
                className={
                  category === (i ? c.toLowerCase() : "all") ? "selected" : ""
                }
                aria-pressed={category === (i ? c.toLowerCase() : "all")}
                onClick={() => setCategory(i ? c.toLowerCase() : "all")}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="select-filters">
            <select
              aria-label="Sort products"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="featured">Sort By: Featured</option>
              <option value="newest">Sort By: Newest</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
            <select
              aria-label="Filter by condition"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
            >
              <option value="all">All conditions</option>
              {["Like new", "Good", "Used"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <label className="catalog-search">
              <Search size={17} />
              <input
                aria-label="Search pairs"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the catalog"
              />
            </label>
          </div>
        </div>
        {list.length ? (
          <div className="catalog-grid">
            {list.map((p) => (
              <ProductCard key={p.id} p={p} onView={onView} />
            ))}
          </div>
        ) : (
          <div className="empty">
            <h2>NOTHING ON THIS RACK.</h2>
            <p>Try another search or clear your filters.</p>
            <button
              className="button"
              onClick={() => {
                setQuery("");
                setCategory("all");
                setCondition("all");
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
      <Sizing compact onOpen={onSizing} />
    </>
  );
}

function Modal({
  children,
  title,
  onClose,
  wide = false,
}: {
  children: React.ReactNode;
  title: string;
  onClose: () => void;
  wide?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = dialog.current;
    el?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      el?.close();
      document.body.style.overflow = previous;
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className={wide ? "modal wide" : "modal"}
      aria-label={title}
      onCancel={onClose}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          const r = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX < r.left ||
            e.clientX > r.right ||
            e.clientY < r.top ||
            e.clientY > r.bottom
          )
            onClose();
        }
      }}
    >
      <button
        className="modal-close icon-button"
        aria-label="Close"
        onClick={onClose}
      >
        <X size={21} />
      </button>
      {children}
    </dialog>
  );
}
function QuickView({
  p,
  onClose,
  onSizing,
}: {
  p: Product;
  onClose: () => void;
  onSizing: () => void;
}) {
  const store = useStore();
  const router = useRouter();
  const [size, setSize] = useState(p.sizes[0]);
  const [error, setError] = useState("");
  const stock = remaining(p.id, size);
  function order() {
    setError("");
    try {
      sessionStorage.setItem(
        "soleva.intent.v1",
        JSON.stringify({ product: p.id, size }),
      );
      router.push(
        store.member
          ? `/checkout?pair=${p.id}&size=${size}`
          : "/auth?return=checkout",
      );
      onClose();
    } catch {
      setError(
        "Browser session storage is unavailable. Please enable it to continue.",
      );
    }
  }
  return (
    <Modal wide title={p.name} onClose={onClose}>
      <div className="quick-layout">
        <div className="quick-photo">
          <Photo p={p} priority />
        </div>
        <div className="quick-copy">
          <p className="eyebrow">
            {p.brand} · {p.model}
          </p>
          <h2>{p.name}</h2>
          <div className="quick-price">
            <strong>{money(p.price)}</strong>
            <span className="condition">{p.condition}</span>
          </div>
          <div className="color-tags">
            {p.colors.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
          <div className="size-selection">
            <div>
              <p className="eyebrow">SELECT SIZE</p>
              <small>
                {stock
                  ? stock === 1
                    ? "Last piece in US " + size
                    : stock + " pieces in US " + size
                  : "Reserved in this browser"}
              </small>
            </div>
            <div className="size-buttons">
              {p.sizes.map((s) => (
                <button
                  key={s}
                  aria-pressed={s === size}
                  disabled={!remaining(p.id, s)}
                  className={s === size ? "selected" : ""}
                  onClick={() => setSize(s)}
                >
                  US {s}
                </button>
              ))}
            </div>
          </div>
          <dl className="product-facts">
            <div>
              <dt>Condition</dt>
              <dd>{p.condition}</dd>
            </div>
            <div>
              <dt>Sizes in stock</dt>
              <dd>{p.sizes.map((s) => "US " + s).join(" · ")}</dd>
            </div>
            <div>
              <dt>Photos</dt>
              <dd>1</dd>
            </div>
          </dl>
          <p>{p.description}</p>
          <button className="size-guide-link" onClick={onSizing}>
            <Ruler size={18} />
            Size guide — your pair is US {size}
            <ChevronRight size={18} />
          </button>
          <button
            className="button order-button"
            disabled={!store.ready || !stock}
            onClick={order}
          >
            {stock ? "Order this pair — US " + size : "Reserved"}{" "}
            <ArrowRight size={17} />
          </button>
          <p className="small-note">
            Local demo only. Stock photos illustrate the catalog. No payment or
            real delivery.
          </p>
          <p role="alert" className="error">
            {error}
          </p>
        </div>
      </div>
    </Modal>
  );
}
function Auth() {
  const router = useRouter();
  const params = useSearchParams();
  const [join, setJoin] = useState(params.get("mode") === "join");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      signInDemo();
      const intent = JSON.parse(
        sessionStorage.getItem("soleva.intent.v1") || "null",
      );
      const p = products.find((p) => p.id === intent?.product);
      router.push(
        p && p.sizes.includes(intent.size)
          ? `/checkout?pair=${p.id}&size=${intent.size}`
          : "/dashboard",
      );
    } catch {
      setError(
        "Browser storage is unavailable. Enable local storage to use the demo account.",
      );
    }
  }
  return (
    <main className="auth-page" id="main">
      <div className="auth-card">
        <Brand />
        <h1>{join ? "Create an account" : "Sign in"}</h1>
        <p>
          Browsing is free. An account is only needed to reserve a pair and
          follow your orders.
        </p>
        <form onSubmit={submit}>
          {join && (
            <label>
              Name
              <input
                name="name"
                required
                minLength={2}
                autoComplete="name"
                placeholder="Alex Morgan"
              />
            </label>
          )}
          <label>
            Email
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
            />
          </label>
          <label>
            Password
            <div className="password-field">
              <input
                name="password"
                type={show ? "text" : "password"}
                required
                minLength={8}
                autoComplete="off"
                placeholder="At least 8 characters"
              />
              <button
                type="button"
                aria-label={show ? "Hide password" : "Show password"}
                onClick={() => setShow(!show)}
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>
          <button className="button">
            {join ? "Create demo account" : "Sign in to demo"}
          </button>
          <p role="alert" className="error">
            {error}
          </p>
        </form>
        <p>
          {join ? "Already here?" : "New here?"}{" "}
          <button className="text-link" onClick={() => setJoin(!join)}>
            {join ? "Sign in" : "Create an account"}
          </button>
        </p>
        <p className="auth-note">
          Demo account only. Use sample details. Your email and password are
          never saved or sent.
        </p>
        <Link className="back-store" href="/">
          Back to the store
        </Link>
      </div>
    </main>
  );
}
function Checkout() {
  const store = useStore();
  const params = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState("");
  const p = products.find((p) => p.id === params.get("pair"));
  const size = Number(params.get("size"));
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!p) return;
    try {
      const order = reservePair(p.id, size);
      router.push("/order-confirmation?reference=" + order.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to reserve this pair.");
    }
  }
  if (!store.ready)
    return <div className="loading">Preparing your reservation…</div>;
  if (!store.member)
    return (
      <section className="empty">
        <h1>SIGN IN TO RESERVE.</h1>
        <p>Your demo orders stay together in this browser.</p>
        <Link className="button" href="/auth">
          Sign in
        </Link>
      </section>
    );
  if (!p || !p.sizes.includes(size))
    return (
      <section className="empty">
        <h1>FIND YOUR PAIR.</h1>
        <p>Choose a pair and size from the rack first.</p>
        <Link className="button" href="/dashboard">
          Browse the rack
        </Link>
      </section>
    );
  return (
    <section className="section checkout">
      <p className="eyebrow">YOUR NEXT CHAPTER</p>
      <h1>MAKE IT YOURS.</h1>
      <p className="demo-banner">
        Demo reservation · No payment is collected and no pair is shipped.
      </p>
      <div className="checkout-grid">
        <form onSubmit={submit}>
          <h2>DELIVERY DETAILS</h2>
          <label>
            Full name
            <input required name="name" minLength={2} autoComplete="name" />
          </label>
          <label>
            Phone number
            <input
              required
              name="phone"
              type="tel"
              pattern="[+0-9 ()-]{7,20}"
              autoComplete="tel"
            />
          </label>
          <label>
            Local delivery address
            <textarea
              required
              name="address"
              minLength={8}
              rows={3}
              autoComplete="street-address"
            />
          </label>
          <label className="consent">
            <input type="checkbox" required />I understand this is a demo
            reservation, with no payment or fulfillment.
          </label>
          <p className="small-note">
            These contact fields demonstrate the form. They are not saved or
            sent.
          </p>
          <p role="alert" className="error">
            {error}
          </p>
          <button className="button" disabled={!remaining(p.id, size)}>
            Confirm demo reservation <ArrowRight size={17} />
          </button>
        </form>
        <aside className="checkout-summary">
          <div className="summary-photo">
            <Photo p={p} priority />
          </div>
          <h2>{p.name}</h2>
          <p>
            {p.brand} · US {size} · {p.condition}
          </p>
          <div>
            <span>Pair</span>
            <strong>{money(p.price)}</strong>
          </div>
          <div>
            <span>Demo delivery</span>
            <strong>Included</strong>
          </div>
          <div className="total">
            <span>Total</span>
            <strong>{money(p.price)}</strong>
          </div>
        </aside>
      </div>
    </section>
  );
}
function Orders({ confirmation = false }: { confirmation?: boolean }) {
  const store = useStore();
  const params = useSearchParams();
  const [feedback, setFeedback] = useState("");
  const list = confirmation
    ? store.orders.filter((o) => o.id === params.get("reference"))
    : store.orders;
  return (
    <section className="section orders-page">
      <p className="eyebrow">
        {confirmation ? "YOUR PAIR, YOUR NEXT CHAPTER" : "YOUR DEMO ACCOUNT"}
      </p>
      <h1>{confirmation ? "IT’S ON YOUR RACK." : "MY ORDERS"}</h1>
      <p>
        {confirmation
          ? "Demo reservation confirmed. No payment was taken and nothing will be shipped."
          : "Your browser-local reservations, all in one place."}
      </p>
      {!store.ready ? (
        <p className="loading">Loading your orders…</p>
      ) : !list.length ? (
        <div className="empty">
          <Package size={35} />
          <h2>
            {store.member
              ? "YOUR RACK STARTS HERE."
              : "SIGN IN TO FOLLOW YOUR PAIRS."}
          </h2>
          <p>
            {store.member
              ? "You have no saved demo reservations."
              : "Sign in to the local demo to start a reservation."}
          </p>
          <Link className="button" href={store.member ? "/dashboard" : "/auth"}>
            {store.member ? "Browse the rack" : "Sign in"}
          </Link>
        </div>
      ) : (
        <div className="order-list">
          {list.map((o) => {
            const p = products.find((p) => p.id === o.product)!;
            return (
              <article key={o.id}>
                <div className="order-photo">
                  <Photo p={p} />
                </div>
                <div>
                  <span className="order-status">
                    <Check size={14} />
                    DEMO RESERVED
                  </span>
                  <h2>{p.name}</h2>
                  <p>
                    US {o.size} · {money(o.price)}
                  </p>
                  <small>
                    {o.id} ·{" "}
                    {new Intl.DateTimeFormat("en-GB", {
                      timeZone: "Asia/Karachi",
                      dateStyle: "medium",
                    }).format(new Date(o.date))}
                  </small>
                </div>
                <strong>{money(o.price)}</strong>
              </article>
            );
          })}
        </div>
      )}
      <div className="order-actions">
        <Link className="button" href="/dashboard">
          Back to the rack <ArrowRight size={17} />
        </Link>
        {store.member && (
          <button
            className="text-link"
            onClick={() => {
              try {
                resetDemo();
                setFeedback("Demo account and reservations cleared.");
              } catch {
                setFeedback("Unable to clear browser storage.");
              }
            }}
          >
            Reset demo account & reservations
          </button>
        )}
      </div>
      <p role="status">{feedback}</p>
    </section>
  );
}
function Footer({
  compact,
  onSizing,
}: {
  compact: boolean;
  onSizing: () => void;
}) {
  if (compact)
    return (
      <footer className="compact-footer">
        <Brand />
        <p>Curated thrift, priced honestly. Local demonstration.</p>
        <Link href="/">
          Back to home <ArrowLeft size={16} />
        </Link>
      </footer>
    );
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <Brand />
          <p>
            Curated thrift sneakers — cleaned, photographed, and priced
            honestly. One of every pair.
          </p>
          <Link className="button" href="/auth?mode=join">
            Become a member <ArrowUpRight size={17} />
          </Link>
        </div>
        <div>
          <h3>SHOP</h3>
          <Link href="/dashboard">All pairs</Link>
          <Link href="/#collection">Trending this week</Link>
          <Link href="/#lookbook">Lookbook</Link>
        </div>
        <div>
          <h3>SUPPORT</h3>
          <button className="text-button" onClick={onSizing}>
            Size chart
          </button>
          <Link href="/orders">Track an order</Link>
          <span>Demo orders stay in this browser</span>
        </div>
        <div>
          <h3>THE STORE</h3>
          <span>Local delivery concept</span>
          <span>No worldwide shipping</span>
          <span>A fresh second chapter</span>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 SOLEVA. Thrifted with care, delivered locally.</span>
        <span>SECOND LIVES FOR FIRST-CLASS SNEAKERS</span>
      </div>
      <p className="footer-demo">
        Local storefront demonstration. Stock photos and sample inventory. No
        real accounts, payments, emails or delivery.
      </p>
    </footer>
  );
}
export function Storefront({ page }: { page: PageName }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [sizing, setSizing] = useState(false);
  const params = useSearchParams();
  const store = useStore();
  if (page === "auth") return <Auth />;
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header page={page} onSizing={() => setSizing(true)} />
      <main id="main">
        {page === "home" ? (
          <Home onSizing={() => setSizing(true)} onView={setProduct} />
        ) : page === "dashboard" ? (
          <Catalog
            key={params.toString()}
            onSizing={() => setSizing(true)}
            onView={setProduct}
          />
        ) : page === "checkout" ? (
          <Checkout />
        ) : (
          <Orders confirmation={page === "order-confirmation"} />
        )}
      </main>
      <Footer compact={page !== "home"} onSizing={() => setSizing(true)} />
      {product && (
        <QuickView
          p={product}
          onClose={() => setProduct(null)}
          onSizing={() => setSizing(true)}
        />
      )}{" "}
      {sizing && (
        <Modal title="Full size chart" onClose={() => setSizing(false)}>
          <div className="sizing-modal">
            <p className="eyebrow">SOLEVA / FIT & SIZING</p>
            <h2>FIND YOUR SIZE</h2>
            <p>
              A general unisex conversion guide. Fit varies by brand and model;
              compare the shoe manufacturer’s chart before a real purchase.
            </p>
            <SizeTable />
          </div>
        </Modal>
      )}
      {store.storageError && (
        <div className="storage-status" role="status">
          Browser storage is unavailable; demo reservations may not persist.
        </div>
      )}
    </>
  );
}
