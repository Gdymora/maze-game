// Maze.js
export const tileSize = 25;
/* const maze = [
  [1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1],
  [1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1],
  [1, 1, 1, 1, 1],
]; */
const MAZE_SIZE = 40; // Размер лабиринта

export const maze = Array(MAZE_SIZE)
  .fill()
  .map((_, rowIndex) =>
    Array(MAZE_SIZE)
      .fill(0)
      .map((_, colIndex) => (rowIndex === 0 || rowIndex === MAZE_SIZE - 1 || colIndex === 0 || colIndex === MAZE_SIZE - 1 ? 1 : 1))
  );

export function findFreeCell() {
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

export const bonuses = []; // Массив для хранения бонусов

export function placeBonuses() {
  for (let i = 0; i < 100; i++) {
    // Предположим, мы хотим добавить 10 бонусов
    let bonusPosition = findFreeCell();
    bonuses.push(bonusPosition);
  }
}

// Функция для отрисовки бонусов
export function drawBonuses(context) {
  context.fillStyle = "gold"; // Цвет бонусов
  bonuses.forEach((bonus) => {
    context.beginPath();
    context.arc(bonus.x + tileSize / 2, bonus.y + tileSize / 2, tileSize / 4, 0, 2 * Math.PI);
    context.fill();
  });
}

export function collectBonuses(newPos) {
  for (let i = 0; i < bonuses.length; i++) {
    if (Math.abs(newPos.x - bonuses[i].x) < tileSize && Math.abs(newPos.y - bonuses[i].y) < tileSize) {
      bonuses.splice(i, 1); // Удалить собранный бонус
      break; // Предполагаем, что за один ход можно собрать только один бонус
    }
  }
}
// Функция проверки столкновений
export const checkCollision = (newPos) => {
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

generateMaze(1, 1);
placeBonuses(); // Разместить бонусы при инициализации
