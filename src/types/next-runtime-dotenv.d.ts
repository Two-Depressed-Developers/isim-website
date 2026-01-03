declare module "next-runtime-dotenv" {
  interface DotenvOptions {
    public?: string[];
    server?: string[];
  }

  function withRuntimeDotenv(
    options: DotenvOptions,
  ): (config: unknown) => unknown;

  export default withRuntimeDotenv;
}
