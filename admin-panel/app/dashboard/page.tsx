import React from 'react';
import prisma from '../../prisma/client';

// Определяем тип для пользователя
type User = {
  id: number;
  name: string;
  email: string;
};

const Dashboard = async () => {
  // Получаем данные пользователей с сервера
  const users: User[] = await prisma.user.findMany();
  const user_Unique = await prisma.user.findUnique({
    where: {
        id: 3,
    },
  })

//   const user_create = await prisma.user.create({
    // data: {
        // id: 5,
        // name: '123 321 123 321',
        // email: 'geytu323@mail.ru',
    // }
//   })
  
  return (
    <div>
      <h1>Панель управления</h1>
      <h2>Список пользователей:</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
      <h1>Отдельный поиск пользователя по ID</h1>
      <div>
        {user_Unique ? (
            <div>
                <li>{user_Unique.id} - {user_Unique.name}</li>
            </div>
        ) : (
            <p>Пользователь не найден</p>
        )}
       </div>
    </div>
  );
};

export default Dashboard;