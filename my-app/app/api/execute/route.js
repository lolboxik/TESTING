import { spawn } from 'child_process';
import path from 'path';

export async function POST(request) {
  const { filePath } = await request.json();

  try {
    const absolutePath = path.resolve('./softs' + filePath); // Преобразуем путь в абсолютный
    let command, args;

    // Определяем команду и аргументы для выполнения в зависимости от типа файла
    if (filePath.endsWith('.js')) {
      command = 'node';
      args = [absolutePath];
    } else if (filePath.endsWith('.py')) {
      command = 'python';
      args = [absolutePath];
    } else {
      return new Response(JSON.stringify({ error: 'Unsupported file type' }), { status: 400 });
    }

    // Используем spawn для выполнения команды
    const child = spawn(command, args);

    // Сбор данных stdout и stderr
    let stdoutData = '';
    let stderrData = '';

    // Обработка stdout
    child.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });

    // Обработка stderr
    child.stderr.on('data', (data) => {
      stderrData += data.toString();
    });

    // Обработка завершения процесса
    return new Promise((resolve) => {
      child.on('close', (code) => {
        if (code === 0) {
          resolve(new Response(JSON.stringify({ output: stdoutData }), { status: 200 }));
        } else {
          resolve(new Response(JSON.stringify({ error: stderrData || `Process exited with code ${code}` }), { status: 500 }));
        }
      });
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
