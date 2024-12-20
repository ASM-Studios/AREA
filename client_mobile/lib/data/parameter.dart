class Parameter {
  final String name;
  final String description;
  final String type;
  String? value;

  Parameter({
    required this.name,
    required this.description,
    required this.type,
    this.value,
  });

  factory Parameter.fromJson(Map<String, dynamic> json) {
    return Parameter(
      name: json['name'],
      description: json['description'] ?? "",
      type: json['type'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'type': type,
      'value': value
    };
  }
}