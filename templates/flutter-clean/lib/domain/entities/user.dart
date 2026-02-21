import 'package:equatable/equatable.dart';

/// Example entity representing a user in the domain layer
/// Entities are plain Dart classes with business logic
class User extends Equatable {
  final String id;
  final String name;
  final String email;
  final DateTime createdAt;

  const User({
    required this.id,
    required this.name,
    required this.email,
    required this.createdAt,
  });

  @override
  List<Object?> get props => [id, name, email, createdAt];

  @override
  String toString() => 'User(id: $id, name: $name, email: $email)';
}
