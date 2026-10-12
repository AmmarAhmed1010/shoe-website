import Link from "next/link";
export default function NotFound() {
  return (
    <main className="empty">
      <p className="eyebrow">SOLEVA / 404</p>
      <h1>This pair has wandered.</h1>
      <p>The page you are looking for is not on the rack.</p>
      <Link className="button" href="/">
        Back to the store
      </Link>
    </main>
  );
}
