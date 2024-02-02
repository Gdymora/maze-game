

class GraphBFS {
    constructor() {
        this.edges = {};
    }

    addVertex(vertex) {
        this.edges[vertex] = [];
    }

    addEdge(vertex1, vertex2) {
        this.edges[vertex1].push(vertex2);
        this.edges[vertex2].push(vertex1); // Для неорієнтованого графа
    }

    bfs(startingNode) {
        let visited = {};
        let queue = [startingNode];

        visited[startingNode] = true;

        while (queue.length) {
            const vertex = queue.shift();
            console.log(vertex);

            this.edges[vertex].forEach(neighbour => {
                if (!visited[neighbour]) {
                    visited[neighbour] = true;
                    queue.push(neighbour);
                }
            });
        }
    }
 // Метод для виводу зв'язків графа
 printGraph() {
    Object.keys(this.edges).forEach((vertex) => {
      console.log(`${vertex} -> ${this.edges[vertex].join(", ")}`);
    });
  }
}

// Приклад використання
const graph = new GraphBFS();
graph.addVertex("A");
graph.addVertex("B");
graph.addVertex("C");
graph.addVertex("D");
graph.addVertex("F");
graph.addVertex("G");
graph.addEdge("A", "B");
graph.addEdge("A", "C");
graph.addEdge("B", "D");
graph.addEdge("B", "F");
graph.addEdge("C", "D");
graph.addEdge("F", "G");
console.log("BFS starting from vertex A:");
graph.bfs("A");
console.log("Зв'язки в графі:");
graph.printGraph();
module.exports = GraphBFS;

/* 
                       A
                      / \
                     B   C
                    / \ /  
                   F   D 
                  /
                 G
*/