const fs = require('fs');
const path = require('path');

class GraphDFSMaze {
    constructor() {
        this.graph = {};
        this.start = null;
        this.end = null;
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
        const maze = fs.readFileSync(filePath, 'utf-8').split('\n').map(row => row.split(''));
        const rows = maze.length;
        const cols = maze[0].length;

        for (let x = 0; x < rows; x++) {
            for (let y = 0; y < cols; y++) {
                if (maze[x][y] === ' ' || maze[x][y] === 'S' || maze[x][y] === 'F') {
                    const vertex = `${x},${y}`;
                    this.addVertex(vertex);

                    if (maze[x][y] === 'S') this.start = vertex;
                    if (maze[x][y] === 'F') this.end = vertex;

                    [[1, 0], [0, 1], [-1, 0], [0, -1]].forEach(([dx, dy]) => {
                        const [nx, ny] = [x + dx, y + dy];
                        if (nx >= 0 && nx < rows && ny >= 0 && ny < cols && (maze[nx][ny] === ' ' || maze[nx][ny] === 'S' || maze[nx][ny] === 'F')) {
                            const neighbor = `${nx},${ny}`;
                            this.addEdge(vertex, neighbor);
                        }
                    });
                }
            }
        }
    }

    dfs(start, goal, path = [], visited = new Set()) {
        path.push(start);
        visited.add(start);

        if (start === goal) {
            return path;
        }

        for (let neighbor of this.graph[start]) {
            if (!visited.has(neighbor)) {
                const result = this.dfs(neighbor, goal, path, visited);
                if (result) {
                    return result;
                }
            }
        }

        path.pop(); // Важливо: видаляємо вершину зі шляху, якщо вона не веде до цілі
        return null;
    }

    findPathInMaze() {
        const path = this.dfs(this.start, this.end);
        if (path) {
            console.log(`Шлях знайдено: ${path.join(' -> ')}`);
        } else {
            console.log("Шлях не знайдено.");
        }
    }
}

// Приклад використання
const filePath = path.join(__dirname, 'maze.txt');
const graph = new GraphDFSMaze();
graph.loadMazeFromFile(filePath);
graph.findPathInMaze();
