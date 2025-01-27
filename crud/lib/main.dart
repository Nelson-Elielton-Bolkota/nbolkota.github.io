import 'package:crud/projects/planet.dart';
import 'package:flutter/material.dart';

import 'control/planet_control.dart';
import 'screen/planet_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Planets',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const MyHomePage(title: 'App - Planets'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({
    super.key,
    required this.title,
  });

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  final PlanetControl _planetControl = PlanetControl();
  List<Planet> _planets = [];

  @override
  void initState() {
    super.initState();
    _loadPlanets();
  }

  Future<void> _loadPlanets() async {
    final result = await _planetControl.loadPlanets();
    setState(() {
      _planets = result;
    });
  }

  void _includePlanet(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => ScreenPlanet(
          isInclusion: true,
          planet: Planet.empty(),
          onSaved: () {
            _loadPlanets();
          },
        ),
      ),
    );
  }

  void _addPlanet(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => ScreenPlanet(
          isInclusion: true,
          planet: Planet.empty(),
          onSaved: () {
            _loadPlanets();
          },
        ),
      ),
    );
  }

  void _editPlanet(BuildContext context, Planet planet) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => ScreenPlanet(
          isInclusion: false,
          planet: planet,
          onSaved: () {
            _loadPlanets();
          },
        ),
      ),
    );
  }

  void _deletePlanet(int id) async {
    await _planetControl.deletePlanet(id);
    _loadPlanets();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text(widget.title),
      ),
      body: ListView.builder(
        itemCount: _planets.length,
        itemBuilder: (context, index) {
          final planet = _planets[index];
          return ListTile(
              title: Text(planet.name),
              subtitle: Text(planet.nickname!),
              trailing: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  IconButton(
                    icon: const Icon(Icons.edit),
                    onPressed: () => _editPlanet(context, planet),
                  ),
                  IconButton(
                    icon: const Icon(Icons.delete),
                    onPressed: () => _deletePlanet(planet.id!),
                  ),
                ],
              ));
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          _addPlanet(context);
        },
        child: const Icon(Icons.add_to_photos_outlined),
      ),
    );
  }
}
