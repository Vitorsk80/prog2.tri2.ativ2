import { Database } from "bun:sqlite";

const db = new Database("database.sqlite")

db.run(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    title TEXT NOT NULL
  )
`)

const querySelectItems = db.prepare("SELECT * FROM items")
const queryInsertItem = db.prepare("INSERT INTO items (title) VALUES (?)")
const queryDeleteItem = db.prepare("DELETE FROM items WHERE id = (?);")
const queryUpdateItem = db.prepare("UPDATE items SET title = (?) WHERE id = (?)")

class Item {
  constructor(public title: string) { }
}

class TodoList {
  private items: Item[] = []

  addItem(item: Item) {
    this.items.push(item)
    queryInsertItem.run(item.title)
  }

  removeItem(index: number) {
    if (index >= 0 && index < this.items.length) {
  const removedItem = this.items[index];
        if (removedItem){
            this.items.splice(index,1);
        }
        queryDeleteItem.run(index)
      }
    }
  updateItem(index: number, newTitle: string) {
    if (index >= 0 && index < this.items.length) {
            this.items[index].title = newTitle;
        }
        queryUpdateItem.run(newTitle, index)
  }
  getItems() {
    const items = querySelectItems.all()
    return items
  }
}

const lista = new TodoList()
lista.addItem(new Item("ficar quieto"))
lista.addItem(new Item("prestar atenção"))
lista.addItem(new Item("aprender typescript"))
lista.removeItem(1)
lista.updateItem(2, "ficar quieto e prestar atenção")
console.log(lista.getItems())