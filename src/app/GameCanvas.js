import React, { useRef, useEffect, useState } from "react";

const tileSize = 30;
/* const maze = [
  [1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1],
  [1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1],
  [1, 1, 1, 1, 1],
]; */
const MAZE_SIZE = 50; // Размер лабиринта

const maze = Array(MAZE_SIZE)
  .fill()
  .map((_, rowIndex) =>
    Array(MAZE_SIZE)
      .fill(0)
      .map((_, colIndex) => (rowIndex === 0 || rowIndex === MAZE_SIZE - 1 || colIndex === 0 || colIndex === MAZE_SIZE - 1 ? 1 : 1))
  );

function findFreeCell() {
  let freeCells = [];
  for (let y = 1; y < MAZE_SIZE - 1; y++) {
    for (let x = 1; x < MAZE_SIZE - 1; x++) {
      if (maze[y][x] === 0) {
        // Зберігаємо всі вільні клітинки
        freeCells.push({ x: x * tileSize, y: y * tileSize });
      }
    }
  }
  if (freeCells.length > 0) {
    // Вибираємо випадкову вільну клітинку
    const randomIndex = Math.floor(Math.random() * freeCells.length);
    return freeCells[randomIndex];
  } else {
    // Запасний варіант, якщо вільних клітинок не знайдено
    return { x: tileSize, y: tileSize };
  }
}

const initialPosition = findFreeCell();

const hero = {
  x: initialPosition.x,
  y: initialPosition.y,
  size: tileSize,
};

function generateMaze(x, y) {
  const directions = [
    [0, -2],
    [0, 2],
    [-2, 0],
    [2, 0],
  ];
  maze[y][x] = 0; // Отметка текущей ячейки как посещенной
  directions.sort(() => Math.random() - 0.5); // Случайный выбор направления

  for (let i = 0; i < directions.length; i++) {
    const [dx, dy] = directions[i];
    const nx = x + dx,
      ny = y + dy;
    const mx = x + dx / 2,
      my = y + dy / 2; // Средняя точка для удаления стены

    if (ny > 0 && ny < MAZE_SIZE - 1 && nx > 0 && nx < MAZE_SIZE - 1 && maze[ny][nx] === 1) {
      if (maze[my][mx] === 1) {
        maze[my][mx] = 0; // Удаление стены только если она существует

        generateMaze(nx, ny); // Рекурсивный вызов для новой ячейки
      }
    }
  }
}

// Начать генерацию с некоторого расстояния от краев, чтобы сохранить внешние стены
generateMaze(1, 1);

const bonuses = []; // Массив для хранения бонусов

function placeBonuses() {
  for (let i = 0; i < 100; i++) {
    // Предположим, мы хотим добавить 10 бонусов
    let bonusPosition = findFreeCell();
    bonuses.push(bonusPosition);
  }
}

// Функция для отрисовки бонусов
function drawBonuses(context) {
  context.fillStyle = "gold"; // Цвет бонусов
  bonuses.forEach((bonus) => {
    context.beginPath();
    context.arc(bonus.x + tileSize / 2, bonus.y + tileSize / 2, tileSize / 4, 0, 2 * Math.PI);
    context.fill();
  });
}

function collectBonuses(newPos) {
  for (let i = 0; i < bonuses.length; i++) {
    if (Math.abs(newPos.x - bonuses[i].x) < tileSize && Math.abs(newPos.y - bonuses[i].y) < tileSize) {
      bonuses.splice(i, 1); // Удалить собранный бонус
      break; // Предполагаем, что за один ход можно собрать только один бонус
    }
  }
}

// Функция проверки столкновений
const checkCollision = (newPos) => {
  const left = Math.floor(newPos.x / tileSize);
  const right = Math.ceil((newPos.x + newPos.size) / tileSize);
  const top = Math.floor(newPos.y / tileSize);
  const bottom = Math.ceil((newPos.y + newPos.size) / tileSize);

  for (let y = top; y < bottom; y++) {
    for (let x = left; x < right; x++) {
      if (maze[y][x] === 1) {
        return true; // Столкновение со стеной
      }
    }
  }
  // collectBonuses(newPos);
  return false; // Без столкновений
};
placeBonuses(); // Разместить бонусы при инициализации
function GameCanvas() {
  const canvasRef = useRef(null);
  const [player, setPlayer] = useState({ x: hero.x, y: hero.y, size: hero.size });

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    // Обновление позиции игрока
    const movePlayer = (dx, dy) => {
      const newPos = { ...player, x: player.x + dx, y: player.y + dy };
      if (!checkCollision(newPos, maze)) {
        // Оновлення позиції гравця
        setPlayer(newPos);
        // Перевіряємо і оновлюємо бонуси, якщо вони зібрані
        collectBonuses(newPos, bonuses);
      }
    };

    const drawMaze = () => {
      maze.forEach((row, y) => {
        row.forEach((cell, x) => {
          context.fillStyle = cell === 1 ? "black" : "white";
          context.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        });
      });
    };

    const drawPlayer = () => {
      context.fillStyle = "blue";
      context.fillRect(player.x, player.y, player.size, player.size);
    };

    const render = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      drawMaze(context);
      drawBonuses(context); // Отрисовать бонусы
      drawPlayer(context);
    };

    render();

    const handleKeyDown = (e) => {
      const speed = 5;
      switch (e.key) {
        case "ArrowUp":
          movePlayer(0, -speed);
          break;
        case "ArrowDown":
          movePlayer(0, speed);
          break;
        case "ArrowLeft":
          movePlayer(-speed, 0);
          break;
        case "ArrowRight":
          movePlayer(speed, 0);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [player, bonuses]);

  return <canvas ref={canvasRef} width={1000} height={1000} />;
}

export default GameCanvas;
