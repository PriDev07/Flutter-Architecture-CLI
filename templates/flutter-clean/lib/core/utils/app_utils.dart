/// Common utility functions for the application
class AppUtils {
  // Private constructor to prevent instantiation
  AppUtils._();

  /// Validates email format
  static bool isValidEmail(String email) {
    final emailRegex = RegExp(
      r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
    );
    return emailRegex.hasMatch(email);
  }

  /// Validates password strength
  static bool isValidPassword(String password) {
    return password.length >= 8;
  }

  /// Formats date to readable string
  static String formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }

  /// Capitalizes first letter of string
  static String capitalize(String text) {
    if (text.isEmpty) return text;
    return text[0].toUpperCase() + text.substring(1);
  }
}
