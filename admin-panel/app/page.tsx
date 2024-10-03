// admin-panel/app/page.tsx
import Link from 'next/link';
import React from 'react';

const AdminPanel = () => {
  return (
    <div>
      <h1>Добро пожаловать в админ-панель</h1>
      <nav>
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/admin/dashboard/">Панель управления</Link></li>
        </ul>
      </nav>
      {/* Другие элементы и компоненты */}
    </div>
  );
};

export default AdminPanel;