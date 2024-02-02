/* 
   Пошук в глибину (DFS)
   Алгоритм DFS працює шляхом заглиблення в граф до найглибшого вузла 
   перед тим, як бути змушеним повертатися назад і пробувати інший шлях. 
   Це досягається за допомогою стеку замість черги, що використовується в BFS.
 */

class GraphDFS {
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

  dfs(startingNode) {
    let visited = {};
    this._dfsUtil(startingNode, visited);
  }

  _dfsUtil(vertex, visited) {
    visited[vertex] = true;
    console.log(vertex);
    this.edges[vertex].forEach((neighbour) => {
      if (!visited[neighbour]) {
        this._dfsUtil(neighbour, visited);
      }
    });
  }
  // Метод для виводу зв'язків графа
  printGraph() {
    Object.keys(this.edges).forEach((vertex) => {
      console.log(`${vertex} -> ${this.edges[vertex].join(", ")}`);
    });
  }
}

// Приклад використання
const graph = new GraphDFS();
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
console.log("DFS starting from vertex A:");
graph.dfs("A");
console.log("Зв'язки в графі:");
graph.printGraph();
module.exports = GraphDFS;

/* 
                       A
                      / \
                     B   C
                    / \ /  
                   F   D 
                  /
                 G
*/

