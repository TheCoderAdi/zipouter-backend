class ZipNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ZipNotFoundError";
  }
}

class CompilationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CompilationError";
  }
}
