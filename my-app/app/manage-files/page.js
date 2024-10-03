'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import SyntaxHighlighter from 'react-syntax-highlighter';

export default function ManageFiles() {
  const [files, setFiles] = useState([]);
  const [currentDir, setCurrentDir] = useState(''); // Текущая директория
  const [fileContent, setFileContent] = useState('');
  const [selectedFile, setSelectedFile] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [isRenaming, setIsRenaming] = useState('');
  const [executionResult, setExecutionResult] = useState(''); // Результат выполнения
  const [isRunning, setIsRunning] = useState(false); // Статус выполнения файла

  // Функция для получения списка файлов и папок
  useEffect(() => {
    fetchFiles();
  }, [currentDir]);

  const fetchFiles = async () => {
    try {
      const res = await axios.get(`/api/files?dir=${currentDir}`);
      setFiles(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Функция для открытия файла
  const openFile = async (filePath) => {
    try {
      const res = await axios.post(`/api/files`, { filePath });
      setFileContent(res.data.content);
      setSelectedFile(filePath);
      setIsEditing(false);
      setExecutionResult(''); // Сбрасываем результат выполнения при открытии нового файла
    } catch (error) {
      console.error(error);
    }
  };

  // Функция для сохранения изменений в файле
  const saveFile = async () => {
    try {
      await axios.put(`/api/files`, {
        type: 'edit',
        name: selectedFile,
        content: fileContent,
      });
      alert('File saved successfully!');
    } catch (error) {
      console.error(error);
    }
  };

  // Функция для переименования файла или папки
  const renameFileOrFolder = async (oldName, newName) => {
    try {
      await axios.put(`/api/files`, {
        type: 'rename',
        name: `${currentDir}/${oldName}`,
        newPath: `${currentDir}/${newName}`,
      });
      setIsRenaming('');
      fetchFiles();
    } catch (error) {
      console.error(error);
    }
  };

  // Функция для создания файла или папки
  const createFileOrFolder = async (type, name) => {
    try {
      await axios.put(`/api/files`, { type, name: `${currentDir}/${name}` });
      fetchFiles();
    } catch (error) {
      console.error(error);
    }
  };

  // Функция для удаления файла или папки
  const deleteFileOrFolder = async (path) => {
    try {
      await axios.delete(`/api/files`, { data: { path: `${currentDir}/${path}` } });
      fetchFiles();
    } catch (error) {
      console.error(error);
    }
  };

  // Функция для перехода в родительскую директорию
  const goBack = () => {
    const parentDir = currentDir.split('/').slice(0, -1).join('/');
    setCurrentDir(parentDir);
  };

  // Функция для запуска файла
  const executeFile = async () => {
    if (!selectedFile) return;
    
    setIsRunning(true); // Устанавливаем статус выполнения
    setExecutionResult(''); // Очищаем предыдущий результат

    try {
      const res = await axios.post(`/api/execute`, { filePath: selectedFile });

      if (res.data.output) {
        setExecutionResult(res.data.output); // Устанавливаем вывод программы
      } else if (res.data.error) {
        setExecutionResult(`Error: ${res.data.error}`); // Устанавливаем сообщение об ошибке
      }
    } catch (error) {
      console.error(error);
      setExecutionResult('Error executing file');
    } finally {
      setIsRunning(false); // Сбрасываем статус выполнения
    }
  };

  return (
    <div>
      <h1>File Manager</h1>

      {/* Кнопка "Назад" */}
      {currentDir && (
        <button onClick={goBack}>
          Назад
        </button>
      )}

      <div>
        <button onClick={() => createFileOrFolder('folder', 'new-folder')}>Create Folder</button>
        <button onClick={() => createFileOrFolder('file', 'new-file.js')}>Create File</button>
      </div>

      {/* Список файлов и папок */}
      <ul>
        {files.map((file) => (
          <li key={file.name}>
            {isRenaming === file.name ? (
              <div>
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                />
                <button onClick={() => renameFileOrFolder(file.name, newFileName)}>Rename</button>
              </div>
            ) : (
              <>
                {file.isDirectory ? (
                  <button onClick={() => setCurrentDir(`${currentDir}/${file.name}`)}>
                    {file.name}
                  </button>
                ) : (
                  <button onClick={() => openFile(`${currentDir}/${file.name}`)}>{file.name}</button>
                )}
                <button onClick={() => setIsRenaming(file.name)}>Rename</button>
                <button onClick={() => deleteFileOrFolder(file.name)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* Отображение содержимого файла */}
      {fileContent && selectedFile && (
        <div>
          <h2>File: {selectedFile}</h2>
          {isEditing ? (
            <textarea
              value={fileContent}
              onChange={(e) => setFileContent(e.target.value)}
              rows={20}
              cols={80}
            />
          ) : (
            <SyntaxHighlighter language={selectedFile.endsWith('.js') ? 'javascript' : 'python'}>
              {fileContent}
            </SyntaxHighlighter>
          )}
          <div>
            <button onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? 'Cancel Edit' : 'Edit File'}
            </button>
            {isEditing && <button onClick={saveFile}>Save File</button>}
          </div>

          {/* Кнопка для запуска файла */}
          <button onClick={executeFile} disabled={isRunning}>
            {isRunning ? 'Running...' : 'Run File'}
          </button>

          {/* Отображение результата выполнения файла */}
          {executionResult && (
            <div>
              <h3>Execution Result:</h3>
              <pre>{executionResult}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
