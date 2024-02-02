/* 
Цей код зчитує лабіринт з файлу maze.txt, розташованого в тій же директорії, що й скрипт,
 і виводить його вміст в консоль. Якщо файл знаходиться в іншому місці, 
 вам потрібно буде відповідно змінити шлях до файлу в змінній mazeFilePath.
 */
const fs = require("fs");
const path = require("path");

// Функція для читання лабіринту з файлу та відображення його в консолі
function displayMazeFromFile(filePath) {
  fs.readFile(filePath, { encoding: "utf-8" }, (err, data) => {
    if (err) {
      console.error("Не вдалося відкрити файл: ", err);
      return;
    }
    console.log("Лабіринт з файлу '" + filePath + "':\n" + data);
  });
}

// Змініть шлях до файлу відповідно до вашого середовища
const mazeFilePath = path.join(__dirname, "maze.txt");

// Виклик функції
module.exports = displayMazeFromFile(mazeFilePath);
