import 'package:crud/control/planet_control.dart';
import 'package:flutter/material.dart';

import '../projects/planet.dart';

class ScreenPlanet extends StatefulWidget {
  final bool isInclusion;
  final Planet planet;
  final Function() onSaved;

  const ScreenPlanet({
    super.key,
    required this.isInclusion,
    required this.planet,
    required this.onSaved,
  });

  @override
  State<ScreenPlanet> createState() => _ScreenPlanetState();
}

class _ScreenPlanetState extends State<ScreenPlanet> {
  final _formKey = GlobalKey<FormState>();

  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _sizeController = TextEditingController();
  final TextEditingController _distanceController = TextEditingController();
  final TextEditingController _nicknameController = TextEditingController();

  final PlanetControl _planetControl = PlanetControl();

  late Planet _planet;

  @override
  void initState() {
    _planet = widget.planet;
    _nameController.text = _planet.name;
    _sizeController.text = _planet.size.toString();
    _distanceController.text = _planet.distance.toString();
    _nicknameController.text = _planet.nickname ?? '';
    super.initState();
  }

  @override
  void dispose() {
    _nameController.dispose();
    _sizeController.dispose();
    _distanceController.dispose();
    _nicknameController.dispose();
    super.dispose();
  }

  Future<void> _insertPlanet() async {
    await _planetControl.insertPlanet(_planet);
  }

  Future<void> _changePlanet() async {
    await _planetControl.changePlanet(_planet);
  }

  void _submitForm() {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();

      if (widget.isInclusion) {
        _insertPlanet();
      } else {
        _changePlanet();
      }

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
              'Planet data are ${widget.isInclusion ? 'included' : 'chance'} successfully!'),
        ),
      );
      Navigator.of(context).pop();
      widget.onSaved();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: const Text('Register Planet'),
        backgroundColor: const Color.fromARGB(255, 202, 173, 252),
        elevation: 3,
      ),
      body: Padding(
        padding: EdgeInsets.symmetric(horizontal: 40.0, vertical: 20.0),
        child: Form(
            key: _formKey,
            child: SingleChildScrollView(
              child: Column(
                children: [
                  TextFormField(
                    controller: _nameController,
                    autovalidateMode: AutovalidateMode.onUserInteraction,
                    validator: (value) {
                      if (value == null || value.isEmpty || value.length < 3) {
                        return 'Please enter a planet name(3+ characters).';
                      }
                      return null;
                    },
                    onSaved: (value) {
                      _planet.name = value!;
                    },
                    decoration: InputDecoration(
                      labelText: 'Name:',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10.0),
                      ),
                    ),
                  ),
                  const SizedBox(height: 10.0),
                  TextFormField(
                    controller: _sizeController,
                    keyboardType: TextInputType.number,
                    autovalidateMode: AutovalidateMode.onUserInteraction,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter a planet size.';
                      }
                      final size = double.tryParse(value);
                      if (size == null || size <= 0) {
                        return 'Please enter a valid planet size.';
                      }
                      return null;
                    },
                    onSaved: (value) {
                      _planet.size = double.parse(value!);
                    },
                    decoration: InputDecoration(
                      labelText: 'Size (km):',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10.0),
                      ),
                    ),
                  ),
                  const SizedBox(height: 10.0),
                  TextFormField(
                    controller: _distanceController,
                    keyboardType: TextInputType.number,
                    autovalidateMode: AutovalidateMode.onUserInteraction,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter a planet distance.';
                      }
                      final distance = double.tryParse(value);
                      if (distance == null || distance <= 0) {
                        return 'Please enter a valid planet distance.';
                      }
                      return null;
                    },
                    onSaved: (value) {
                      _planet.distance = double.parse(value!);
                    },
                    decoration: InputDecoration(
                      labelText: 'Distance(km):',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10.0),
                      ),
                    ),
                  ),
                  const SizedBox(height: 10.0),
                  TextFormField(
                    controller: _nicknameController,
                    decoration: InputDecoration(
                      labelText: 'Nickname:',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10.0),
                      ),
                    ),
                    onSaved: (value) {
                      _planet.nickname = value;
                    },
                  ),
                  const SizedBox(
                    height: 30.0,
                  ),
                  ElevatedButton(
                    onPressed: _submitForm,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color.fromARGB(255, 183, 143, 252),
                      foregroundColor: Colors.white,
                      shadowColor: Colors.black,
                      elevation: 5,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(30),
                      ),
                      padding:
                          EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                    ),
                    child: Text(
                      'Register',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
            )),
      ),
    );
  }
}
