import 'package:crud/projects/planet.dart';
import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

class PlanetControl {
  static Database? _bd;

  Future<Database> get bd async {
    if (_bd != null) return _bd!;
    _bd = await _initDB('planets.db');
    return _bd!;
  }

  Future<Database> _initDB(String localFile) async {
    final pathDB = await getDatabasesPath();
    final path = join(pathDB, localFile);
    return await openDatabase(
      path,
      version: 1,
      onCreate: _createDB,
    );
  }

  Future<int> insertPlanet(Planet planet) async {
    final db = await bd;
    return await db.insert('Planets', planet.toMap());
  }

  Future<List<Planet>> loadPlanets() async {
    final db = await bd;
    final result = await db.query('Planets');
    return result.map((item) => Planet.fromMap(item)).toList();
  }

  Future<int> changePlanet(Planet planet) async {
    final db = await bd;
    return db.update(
      'planets',
      planet.toMap(),
      where: 'id = ?',
      whereArgs: [planet.id],
    );
  }

  Future<int> deletePlanet(int id) async {
    final db = await bd;
    return await db.delete(
      'planets',
      where: 'id = ?',
      whereArgs: [id],
    );
  }
}

Future<void> _createDB(Database bd, int version) async {
  const sql = '''
    CREATE TABLE planets(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      size REAL NOT NULL,
      distance REAL NOT NULL,
      nickname TEXT
    )
  ''';
  await bd.execute(sql);
}
