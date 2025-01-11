declare module "next-runtime-dotenv" {
  interface DotenvOptions {
    public?: string[];
    server?: string[];
  }

  function withRuntimeDotenv(options: DotenvOptions): (config: any) => any;

  export default withRuntimeDotenv;
}
