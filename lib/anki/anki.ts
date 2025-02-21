import * as Sqlite from 'expo-sqlite'

class Anki {
    private db: SQLite.Database;

    constructor() {
      // Open the SQLite database (use the path to your anki database file)
      this.db = SQLite.openDatabase('collection.anki2');
    }
}