import { promises as fs } from 'fs';
import path from 'path';

const basePath = path.resolve(process.cwd(), './softs'); // Укажите вашу базовую директорию

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const dir = searchParams.get('dir') || '';
  const fullPath = path.join(basePath, dir);

  try {
    const files = await fs.readdir(fullPath, { withFileTypes: true });
    const fileList = files.map(file => ({
      name: file.name,
      isDirectory: file.isDirectory(),
    }));
    return new Response(JSON.stringify(fileList), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function POST(request) {
  const { filePath } = await request.json();
  const fullPath = path.join(basePath, filePath);

  try {
    const fileContent = await fs.readFile(fullPath, 'utf-8');
    return new Response(JSON.stringify({ content: fileContent }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function PUT(request) {
  const { type, name, content, newPath } = await request.json();
  const fullPath = path.join(basePath, name);

  try {
    // Создание файла/папки
    if (type === 'file') {
      await fs.writeFile(fullPath, '');
    } else if (type === 'folder') {
      await fs.mkdir(fullPath);
    }

    // Изменение содержимого файла
    if (type === 'edit') {
      await fs.writeFile(fullPath, content);
    }

    // Переименование файла или папки
    if (type === 'rename') {
      const newFullPath = path.join(basePath, newPath);
      await fs.rename(fullPath, newFullPath);
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function DELETE(request) {
  const { path: deletePath } = await request.json();
  const fullPath = path.join(basePath, deletePath);

  try {
    await fs.rm(fullPath, { recursive: true, force: true });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
