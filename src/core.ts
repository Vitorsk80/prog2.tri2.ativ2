import { Database } from "bun:sqlite";

const db = new Database("database.sqlite");

db.run(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL
  )
`);

const querySelectItems = db.prepare("SELECT * FROM items");
const queryInsertItem = db.prepare("INSERT INTO items (title) VALUES (?)");
const queryDeleteItem = db.prepare("DELETE FROM items WHERE id = ?");
const queryUpdateItem = db.prepare("UPDATE items SET title = ? WHERE id = ?");

class Item {
  constructor(
    public title: string,
    public id?: number
  ) {}
}

class TodoList {
  private items: Item[] = [];

  addItem(item: Item) {
    const result = queryInsertItem.run(item.title);

    item.id = Number(result.lastInsertRowid);

    this.items.push(item);
  }

  removeItem(id: number) {
    this.items = this.items.filter(item => item.id !== id);

    queryDeleteItem.run(id);
  }

  updateItem(id: number, newTitle: string) {
    const item = this.items.find(item => item.id === id);

    if (item) {
      item.title = newTitle;
      queryUpdateItem.run(newTitle, id);
    }
  }

  getItems() {
    return querySelectItems.all();
  }
}

const lista = new TodoList();

lista.addItem(new Item("ficar quieto"));
lista.addItem(new Item("prestar atenção"));
lista.addItem(new Item("aprender typescript"));

lista.removeItem(2);

lista.updateItem(
  3,
  "ficar quieto e prestar atenção"
);

console.log(lista.getItems());