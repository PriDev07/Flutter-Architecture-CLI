import '../domain/entities/user.dart';

/// Data model for User
/// Models are responsible for JSON serialization/deserialization
class UserModel {
  final String id;
  final String name;
  final String email;
  final String createdAt;

  UserModel({
    required this.id,
    required this.name,
    required this.email,
    required this.createdAt,
  });

  /// Convert JSON to UserModel
  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] as String,
      name: json['name'] as String,
      email: json['email'] as String,
      createdAt: json['created_at'] as String,
    );
  }

  /// Convert UserModel to JSON
  Map<String, dynamic> toJson() {
    return {'id': id, 'name': name, 'email': email, 'created_at': createdAt};
  }

  /// Convert UserModel to domain entity
  User toEntity() {
    return User(
      id: id,
      name: name,
      email: email,
      createdAt: DateTime.parse(createdAt),
    );
  }

  /// Create UserModel from domain entity
  factory UserModel.fromEntity(User user) {
    return UserModel(
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toIso8601String(),
    );
  }
}
