/// Application-wide constants
class AppConstants {
  // Private constructor to prevent instantiation
  AppConstants._();

  /// App Information
  static const String appName = '__APP_NAME_PASCAL__';
  static const String appVersion = '1.0.0';

  /// API Configuration
  static const String baseUrl = 'https://api.example.com';
  static const String apiVersion = 'v1';
  static const Duration apiTimeout = Duration(seconds: 30);

  /// Storage Keys
  static const String tokenKey = 'auth_token';
  static const String userKey = 'user_data';
  static const String themeKey = 'theme_mode';

  /// Pagination
  static const int defaultPageSize = 20;

  /// Validation
  static const int minPasswordLength = 8;
  static const int maxUsernameLength = 30;
}
