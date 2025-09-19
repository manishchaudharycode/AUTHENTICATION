export class ApiResponse {
  constructor(statusCode, data, message = "success") {
    (this.statusCode = statusCode),
      (this.data = data),
      (this.message = message),
      (this.successs = statusCode < 400);
  }
}
