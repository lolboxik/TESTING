// import Image from "next/image";
// import styles from "./page.module.css";
import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <nav>
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/admin/">Admin</Link></li>
          <li><Link href="/manage-files/">Файловый менеджер</Link></li>
        </ul>
      </nav>
    </div>
  );
}
