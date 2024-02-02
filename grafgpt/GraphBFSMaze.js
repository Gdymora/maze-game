const fs = require("fs");
const path = require("path");

class GraphBFSMaze {
  constructor() {
    this.graph = {};
    this.start = null; // Додаємо властивість для зберігання початкової точки
    this.end = null; // Додаємо властивість для зберігання кінцевої точки
  }

  addVertex(vertex) {
    if (!this.graph[vertex]) {
      this.graph[vertex] = [];
    }
  }

  addEdge(vertex1, vertex2) {
    if (this.graph[vertex1] && this.graph[vertex2]) {
      this.graph[vertex1].push(vertex2);
      this.graph[vertex2].push(vertex1);
    }
  }

  loadMazeFromFile(filePath) {
    const maze = fs
      .readFileSync(filePath, "utf-8")
      .split("\n")
      .map((row) => row.split(""));
    const rows = maze.length;
    const cols = maze[0].length;

    for (let x = 0; x < rows; x++) {
      for (let y = 0; y < cols; y++) {
        if (maze[x][y] === " " || maze[x][y] === "S" || maze[x][y] === "F") {
          const vertex = `${x},${y}`;
          this.addVertex(vertex);

          if (maze[x][y] === "S") this.start = vertex; // Запам'ятовуємо початкову точку
          if (maze[x][y] === "F") this.end = vertex; // Запам'ятовуємо кінцеву точку

          [
            [1, 0],
            [0, 1],
            [-1, 0],
            [0, -1],
          ].forEach(([dx, dy]) => {
            const [nx, ny] = [x + dx, y + dy];
            if (nx >= 0 && nx < rows && ny >= 0 && ny < cols && (maze[nx][ny] === " " || maze[nx][ny] === "S" || maze[nx][ny] === "F")) {
              const neighbor = `${nx},${ny}`;
              this.addEdge(vertex, neighbor);
            }
          });
        }
      }
    }
  }

  bfs(start, goal) {
    let queue = [[start]];
    let visited = { [start]: true };

    while (queue.length > 0) {
      let path = queue.shift();
      let vertex = path[path.length - 1];

      if (vertex === goal) {
        return path;
      }

      this.graph[vertex].forEach((neighbor) => {
        if (!visited[neighbor]) {
          visited[neighbor] = true;
          let newPath = path.slice();
          newPath.push(neighbor);
          queue.push(newPath);
        }
      });
    }

    return null;
  }

  findPathInMaze() {
    const path = this.bfs(this.start, this.end);
    if (path) {
      console.log(`Шлях знайдено: ${path.join(" -> ")}`);
    } else {
      console.log("Шлях не знайдено.");
    }
  }
}

// Приклад використання
const filePath = path.join(__dirname, "maze.txt"); // Змініть шлях до вашого файлу лабіринту
const graph = new GraphBFSMaze();
graph.loadMazeFromFile(filePath);
graph.findPathInMaze(); // Вам не потрібно передавати початкові та кінцеві точки, оскільки вони зазначені в методі loadMazeFromFile

/* 
Так, давайте детально розглянемо, що відбувається в коді, і як він працює для пошуку шляху в лабіринті за допомогою BFS (пошук в ширину),
 а також надамо візуальне представлення процесу.

Як працює код
Ініціалізація графа: Спочатку створюється порожній граф за допомогою конструктора класу GraphBFS. Граф представлятиме лабіринт, 
де вершини - це прохідні клітинки, а ребра з'єднують сусідні прохідні клітинки.

Читання лабіринту з файлу: Метод loadMazeFromFile читає лабіринт з файлу, перетворюючи його на граф. Прохідні клітинки (' ', 'S', 'F')
 стають вершинами графа, а їхні сусідні відносини відображаються як ребра. Також визначаються координати початкової ('S') і кінцевої ('F') точок.

Пошук шляху за допомогою BFS: Метод findPathInMaze використовує BFS для пошуку шляху від 'S' до 'F'. BFS працює шар за шаром: від початкової
 точки до всіх доступних з неї за один крок, потім до тих, що доступні за два кроки, і так далі, поки не буде знайдено ціль або поки не будуть перевірені всі вершини.

Відображення результату: Якщо шлях знайдено, виводиться послідовність вершин, що утворюють шлях від 'S' до 'F'. Якщо шляху не існує, виводиться повідомлення про це.

Візуальне представлення
Давайте уявимо лабіринт наступним чином:
S##
# F

S - початкова точка.
F - кінцева точка.
# - стіни.
Пробіл - прохід.

Після читання цього лабіринту, граф буде виглядати приблизно так:

Вершини: координати прохідних клітинок.
Ребра: відображають безпосередньо сусідні прохідні клітинки.
Під час виконання BFS, алгоритм спочатку додасть до черги сусідів початкової точки S, потім буде переходити до їхніх сусідів, доки не досягне F або не перевірить всі вершини.


*/
